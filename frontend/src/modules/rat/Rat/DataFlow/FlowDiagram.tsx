import React, { useCallback, useEffect, useMemo } from 'react';
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

/**
 * Custom node that renders a card similar to the second screenshot:
 * - title (name) bold
 * - subtitle (country)
 * - role badge
 * - handles (dots) on top/bottom/left/right
 */
function CustomNode({ data, selected }: NodeProps<any>): React.ReactElement {
    const cardStyle: React.CSSProperties = {
        background: '#fff',
        padding: 12,
        borderRadius: 12,
        minWidth: 180,
        boxShadow: '0 8px 24px rgba(2,6,23,0.08)',
        color: '#0f172a',
        border: selected ? '2px solid #2563eb' : '1px solid rgba(14, 165, 233, 0.03)',
        display: 'inline-block',
        textAlign: 'left',
    };

    const titleStyle: React.CSSProperties = { fontWeight: 700, marginBottom: 6, fontSize: 14 };
    const subtitleStyle: React.CSSProperties = { color: '#6b7280', fontSize: 12, marginBottom: 8 };
    const badgeStyle: React.CSSProperties = {
        display: 'inline-block',
        background: '#e6f8ff',
        color: '#0369a1',
        padding: '6px 10px',
        borderRadius: 999,
        fontSize: 12,
    };

    const handleStyle: React.CSSProperties = {
        width: 10,
        height: 10,
        background: '#374151',
        borderRadius: '50%',
        border: '2px solid #fff',
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

/**
 * FlowDiagram component:
 * - nodes use type 'custom' and data: { name, country, role }
 * - edges are dashed and animated
 */
export default function FlowDiagram({
    processingActivityId,
    processingActivityName,
    flows,
    entities,
}: FlowDiagramProps): React.ReactElement {
    // inline edge CSS to animate dash (no external file)
    const edgeCss = `
.react-flow__edge-path.animated {
  animation: rf-dash 1s linear infinite;
}
@keyframes rf-dash { to { stroke-dashoffset: -20; } }
.react-flow__edge-path:hover { stroke: #6b46c1 !important; stroke-width: 2.5 !important; }
.react-flow__edge-path { filter: none; }
`;

    // nodes built from entities prop (entities already includes country/role where possible)
    const initialNodes = useMemo<Node[]>(() => {
        return entities.map((e, i) => {
            const x = (i % 6) * 260;
            const y = Math.floor(i / 6) * 160;
            return {
                id: String(e.id),
                type: 'custom',
                data: { name: e.name, country: e.country, role: e.role },
                position: { x, y },
                draggable: true,
                selectable: true,
            } as Node;
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // build once on mount so positions persist after drags

    // edges from flows (parentEntity -> entityId)
    const initialEdges = useMemo<Edge[]>(() => {
        return flows
            .map((f, idx) => {
                const source = f.parentEntity ?? null;
                const target = f.entityId ?? null;
                if (source != null && target != null && String(source) !== '' && String(target) !== '') {
                    return {
                        id: `e-${idx}`,
                        source: String(source),
                        target: String(target),
                        animated: true,
                        style: {
                            stroke: '#9ca3af',
                            strokeDasharray: '8 6',
                            strokeLinecap: 'butt',
                            strokeWidth: 2,
                        },
                    } as Edge;
                }
                return null;
            })
            .filter(Boolean) as Edge[];
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flows]);

    const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChangeInternal] = useEdgesState(initialEdges);

    // sync selection when nodes change
    const handleNodesChange: OnNodesChange = useCallback(
        (changes: NodeChange[]) => {
            setNodes((nds) => {
                const newNodes = applyNodeChanges(changes, nds);
                return newNodes;
            });
            onNodesChangeInternal(changes);
        },
        [onNodesChangeInternal]
    );

    const handleEdgesChange: OnEdgesChange = useCallback(
        (changes: EdgeChange[]) => {
            setEdges((eds) => {
                const newE = applyEdgeChanges(changes, eds);
                return newE;
            });
            onEdgesChangeInternal(changes);
        },
        [onEdgesChangeInternal]
    );

    const onConnect: OnConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

    // onNodeClick: toggle selected state
    const onNodeClick: NodeMouseHandler = useCallback(
        (_evt, node) => {
            setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, selected: !(n as any).selected } : n)));
        },
        []
    );

    // update node position on dragStop (only single node)
    const onNodeDragStop = useCallback((_evt: any, node: Node) => {
        setNodes((nds) => nds.map((n) => (n.id === node.id ? { ...n, position: node.position } : n)));
    }, []);

    // if entities prop changes, sync nodes but preserve positions when possible
    useEffect(() => {
        setNodes((current) => {
            // Build position map
            const posMap = new Map(current.map((n) => [n.id, n.position]));
            const recreated = entities.map((e, i) => {
                const id = String(e.id);
                const pos = (posMap.get(id) as any) ?? { x: (i % 6) * 260, y: Math.floor(i / 6) * 160 };
                return {
                    id,
                    type: 'custom',
                    data: { name: e.name, country: e.country, role: e.role },
                    position: pos,
                    draggable: true,
                    selectable: true,
                } as Node;
            });
            return recreated;
        });
        setEdges(initialEdges);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [entities, flows]);

    return (
        <div style={{ width: '100%' }}>
            <style>{edgeCss}</style>

            <div style={{ marginBottom: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <strong style={{ display: 'block' }}>{processingActivityName ?? `Actividad #${processingActivityId}`}</strong>
                    <small style={{ color: '#6b7280' }}>{entities.length} entidades — {flows.length} flujos</small>
                </div>
            </div>

            <div style={{ width: '100%', height: 420, borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
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
                    <Background gap={12} color="#e6eef6" variant={BackgroundVariant.Dots} />
                    <MiniMap nodeColor={(n) => ((n as any).selected ? '#2563eb' : '#fff')} />
                    <Controls />
                </ReactFlow>
            </div>
        </div>
    );
}