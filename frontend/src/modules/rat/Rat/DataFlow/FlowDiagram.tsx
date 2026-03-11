import React, { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
    applyNodeChanges,
    applyEdgeChanges,
    Node,
    Edge,
    NodeChange,
    EdgeChange,
    OnNodesChange,
    OnEdgesChange,
    OnConnect,
    NodeMouseHandler,
    Handle,
    Position,
    NodeProps,
    NodeTypes,
} from 'reactflow';
import 'reactflow/dist/style.css';
import type { RopaDataFlowDto } from '../services/ratService';

interface Entity {
    id: number;
    name: string;
    country?: string;
    role?: string;
}

interface FlowDiagramProps {
    processingActivityId: number;
    processingActivityName: string | null;
    flows: RopaDataFlowDto[];
    entities: Entity[];
}

/* -------------------------
   Custom node component (adapts to theme via data.isDark)
   ------------------------- */
function CustomNode({ data, selected }: NodeProps<any>): React.ReactElement {
    const isDark: boolean = !!data?.isDark;

    const cardStyle: React.CSSProperties = {
        background: isDark ? '#0b1220' : '#fff',
        padding: 12,
        borderRadius: 12,
        minWidth: 180,
        boxShadow: isDark ? '0 6px 18px rgba(0,0,0,0.5)' : '0 8px 24px rgba(2,6,23,0.08)',
        color: isDark ? '#e6eef6' : '#0f172a',
        border: selected ? (isDark ? '2px solid #7c3aed' : '2px solid #2563eb') : `1px solid ${isDark ? 'rgba(255,255,255,0.04)' : 'rgba(14,165,233,0.03)'}`,
        display: 'inline-block',
        textAlign: 'left',
    };

    const titleStyle: React.CSSProperties = { fontWeight: 700, marginBottom: 6, fontSize: 14 };
    const subtitleStyle: React.CSSProperties = { color: isDark ? '#9aa7b8' : '#6b7280', fontSize: 12, marginBottom: 8 };
    const badgeStyle: React.CSSProperties = {
        display: 'inline-block',
        background: isDark ? '#052f3b' : '#e6f8ff',
        color: isDark ? '#9be1ff' : '#0369a1',
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: 12,
    };

    const handleStyle: React.CSSProperties = {
        width: 10,
        height: 10,
        background: isDark ? '#cbd5e1' : '#374151',
        borderRadius: '50%',
        border: `2px solid ${isDark ? '#0b1220' : '#fff'}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    };

    return (
        <div style={cardStyle}>
            <Handle type="target" position={Position.Top} style={{ ...handleStyle, left: '50%', transform: 'translateX(-50%)', top: -6 }} />
            <div style={{ padding: '6px 4px' }}>
                <div style={titleStyle}>{data.name}</div>
                {data.country && <div style={subtitleStyle}>{data.country}</div>}
                {data.role && (
                    <div style={{ marginTop: 6 }}>
                        <span style={badgeStyle}>{data.role}</span>
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Bottom} style={{ ...handleStyle, left: '50%', transform: 'translateX(-50%)', bottom: -6 }} />
            <Handle type="target" position={Position.Left} style={{ ...handleStyle, left: -6, top: '50%', transform: 'translateY(-50%)' }} />
            <Handle type="source" position={Position.Right} style={{ ...handleStyle, right: -6, top: '50%', transform: 'translateY(-50%)' }} />
        </div>
    );
}

const nodeTypes: NodeTypes = { custom: CustomNode };

/* -------------------------
   Simple hierarchical layout (no dagre)
   - Build parent->child relationships from flows
   - Compute level per node (root = no parent)
   - Place nodes by level and index, centered
   ------------------------- */
function computeHierarchicalLayout(entities: Entity[], flows: RopaDataFlowDto[]): { nodes: Node[]; edges: Edge[] } {
    const nodeWidth = 220;
    const nodeHeight = 110;
    const hGap = 60;
    const vGap = 120;

    // create maps
    const entityMap = new Map<string, Entity>();
    entities.forEach((e) => entityMap.set(String(e.id), e));

    // edges from flows: parentEntity -> entityId
    const edges: Edge[] = flows
        .map((f, idx) => {
            const source = (f as any).parentEntity ?? null;
            const target = (f as any).entityId ?? null;
            if (source != null && target != null && String(source) !== '' && String(target) !== '') {
                return {
                    id: `e-${source}-${target}-${idx}`,
                    source: String(source),
                    target: String(target),
                    animated: true,
                    style: {
                        stroke: '#9ca3af',
                        strokeDasharray: '8 6',
                        strokeLinecap: 'butt',
                        strokeWidth: 2,
                    },
                    markerEnd: {
                        type: 'arrowclosed',
                        color: '#9ca3af',
                    },
                } as Edge;
            }
            return null;
        })
        .filter(Boolean) as Edge[];

    // build child list and parent lookup (if multiple parents we keep first)
    const childrenMap = new Map<string, string[]>();
    const parentMap = new Map<string, string>();
    edges.forEach((e) => {
        const src = e.source;
        const tgt = e.target;
        if (!childrenMap.has(src)) childrenMap.set(src, []);
        childrenMap.get(src)!.push(tgt);
        if (!parentMap.has(tgt)) parentMap.set(tgt, src);
    });

    // find roots: entities that are not target of any edge OR entities that exist but have no parent recorded
    const allIds = entities.map((e) => String(e.id));
    const roots = allIds.filter((id) => !parentMap.has(id));

    // BFS to assign levels; for nodes unreachable assign increasing levels after BFS
    const levelMap = new Map<string, number>();
    const queue: string[] = [];
    roots.forEach((r) => { levelMap.set(r, 0); queue.push(r); });

    while (queue.length > 0) {
        const cur = queue.shift()!;
        const curLevel = levelMap.get(cur) ?? 0;
        const children = childrenMap.get(cur) ?? [];
        children.forEach((c) => {
            const existing = levelMap.get(c);
            const newLevel = curLevel + 1;
            if (existing == null || newLevel < existing) {
                levelMap.set(c, newLevel);
                queue.push(c);
            }
        });
    }

    // Assign default level 0 to any nodes not yet assigned
    allIds.forEach((id) => {
        if (!levelMap.has(id)) levelMap.set(id, 0);
    });

    // group nodes by level
    const levels = new Map<number, string[]>();
    levelMap.forEach((lvl, id) => {
        if (!levels.has(lvl)) levels.set(lvl, []);
        levels.get(lvl)!.push(id);
    });

    // compute positions per level, centering each level horizontally around x=0
    const nodes: Node[] = [];
    const sortedLevels = Array.from(levels.keys()).sort((a, b) => a - b);
    for (const lvl of sortedLevels) {
        const ids = levels.get(lvl) ?? [];
        const count = ids.length;
        const totalWidth = count * nodeWidth + Math.max(0, count - 1) * hGap;
        // startX so that the center of the level is around x = 0
        const startX = -totalWidth / 2;
        ids.forEach((id, i) => {
            const x = startX + i * (nodeWidth + hGap);
            const y = lvl * (nodeHeight + vGap);
            const ent = entityMap.get(id);
            nodes.push({
                id,
                type: 'custom',
                data: { name: ent?.name ?? id, country: ent?.country, role: ent?.role },
                position: { x, y },
                draggable: true,
                selectable: true,
            } as Node);
        });
    }

    // ensure nodes include any entities that might have been omitted (safety)
    const existingIds = new Set(nodes.map(n => n.id));
    entities.forEach((e) => {
        const id = String(e.id);
        if (!existingIds.has(id)) {
            nodes.push({
                id,
                type: 'custom',
                data: { name: e.name, country: e.country, role: e.role },
                position: { x: 0, y: 0 },
                draggable: true,
                selectable: true,
            } as Node);
        }
    });

    return { nodes, edges };
}

/* -------------------------
   FlowDiagram component
   ------------------------- */
export default function FlowDiagram({
    processingActivityId,
    processingActivityName,
    flows,
    entities,
}: FlowDiagramProps): React.ReactElement {
    // theme detection (light/dark) — observe root .dark class
    const [isDark, setIsDark] = useState<boolean>(
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
    );
    useEffect(() => {
        const root = document.documentElement;
        const mo = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => mo.disconnect();
    }, []);

    const safeEntities = (entities ?? []) as Entity[];
    const safeFlows = (flows ?? []) as RopaDataFlowDto[];

    // compute layout without dagre
    const { nodes: computedNodes, edges: computedEdges } = useMemo(() => {
        return computeHierarchicalLayout(safeEntities, safeFlows);
    }, [safeEntities, safeFlows]);

    // add theme flag into node.data so CustomNode can style
    const nodesWithTheme: Node[] = useMemo(() => {
        return computedNodes.map((n) => ({ ...n, data: { ...(n.data as any), isDark } }));
    }, [computedNodes, isDark]);

    const [nodes, setNodes, onNodesChangeInternal] = useNodesState(nodesWithTheme);
    const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(computedEdges);

    // keep nodes/edges in sync when inputs change but preserve user-dragged positions when possible
    useEffect(() => {
        setNodes((current) => {
            const posMap = new Map(current.map((n) => [n.id, n.position]));
            return nodesWithTheme.map((n) => {
                const preserved = posMap.get(n.id) as any;
                return { ...n, position: preserved ?? n.position };
            });
        });
        setEdges(computedEdges.map((e) => ({ ...e })));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [nodesWithTheme.length, computedEdges.length, isDark]);

    const handleNodesChange: OnNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => applyNodeChanges(changes, nds));
            onNodesChangeInternal(changes);
        },
        [onNodesChangeInternal, setNodes]
    );

    const handleEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));
            onEdgesChangeInternal(changes);
        },
        [onEdgesChangeInternal, setEdges]
    );

    const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
        setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, selected: !(n as any).selected } : n)));
    }, [setNodes]);

    const onNodeDragStop = useCallback((_evt: any, node: Node) => {
        setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n)));
    }, [setNodes]);

    // edge css
    const edgeCss = `
    .react-flow__edge-path.animated { animation: rf-dash 1s linear infinite; }
    @keyframes rf-dash { to { stroke-dashoffset: -20; } }
    .react-flow__edge-path:hover { stroke: #7c3aed !important; stroke-width: 2.5 !important; }
    .react-flow__edge-path { filter: none; }
  `;

    const containerBg = isDark ? '#07121a' : '#f8fafc';
    const panelBg = isDark ? '#06121a' : '#ffffff';
    const titleColor = isDark ? '#e6eef6' : '#0f172a';
    const subtitleColor = isDark ? '#94a3b8' : '#6b7280';

    return (
        <div style={{ width: '100%' }}>
            <style>{edgeCss}</style>

            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <strong style={{ display: 'block', color: titleColor }}>{processingActivityName ?? `Actividad #${processingActivityId}`}</strong>
                    <small style={{ color: subtitleColor }}>{entities.length} entidades — {flows.length} flujos</small>
                </div>
            </div>

            <div style={{ width: '100%', height: 560, borderRadius: 8, overflow: 'hidden', background: containerBg, padding: 12 }}>
                <div style={{ background: panelBg, height: '100%', borderRadius: 8, padding: 8 }}>
                    <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={handleNodesChange}
                        onEdgesChange={handleEdgesChange}
                        onConnect={onConnect}
                        onNodeDragStop={onNodeDragStop}
                        onNodeClick={onNodeClick}
                        fitView
                        nodeTypes={nodeTypes}
                        nodesDraggable
                        nodesConnectable
                        selectNodesOnDrag
                    >
                        <Background gap={12} color={isDark ? '#0b1220' : '#e6eef6'} variant={BackgroundVariant.Dots} />
                        <MiniMap nodeColor={(n) => ((n as any).selected ? '#2563eb' : (isDark ? '#1f2937' : '#fff'))} />
                        <Controls />
                    </ReactFlow>
                </div>
            </div>
        </div>
    );
}