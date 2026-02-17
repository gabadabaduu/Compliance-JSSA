import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { RopaDataFlowDto } from '../services/ratService';

interface FlowDiagramProps {
    processingActivityId: number;
    processingActivityName?: string | null;
    flows: RopaDataFlowDto[]; // flows filtered to this activity
    entities: { id: number; name: string }[]; // lookup
}

/**
 * FlowDiagram: light-mode-first visual style similar to the provided mocks.
 * - dotted background (subtle)
 * - central activity card at top
 * - level-based layout: activity -> level1 (children of activity) -> level2 (children of level1)
 * - dashed bezier edges with circular handles
 * - left vertical controls (+, -, fit)
 * - no external libs, TypeScript-safe (ResizeObserver null-checked)
 */

const CARD_WIDTH = 260;
const CARD_HEIGHT = 96;
const V_GAP = 110;
const H_GAP = 36;

type LayoutNode = {
    key: string;
    name: string;
    role?: string;
    country?: string;
    x: number;
    y: number;
};

export default function FlowDiagram({
    processingActivityId,
    processingActivityName,
    flows,
    entities,
}: FlowDiagramProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const viewportRef = useRef<HTMLDivElement | null>(null);
    const roRef = useRef<ResizeObserver | null>(null);

    const [scale, setScale] = useState<number>(1);
    const [isDark, setIsDark] = useState<boolean>(() =>
        typeof document !== 'undefined' ? document.documentElement.classList.contains('dark') : false
    );
    const [nodes, setNodes] = useState<LayoutNode[]>([]);
    const [paths, setPaths] = useState<{ id: string; d: string; sx: number; sy: number; tx: number; ty: number }[]>([]);

    // theme observer (keeps components responsive to app theme)
    useEffect(() => {
        const root = document.documentElement;
        const mo = new MutationObserver(() => setIsDark(root.classList.contains('dark')));
        mo.observe(root, { attributes: true, attributeFilter: ['class'] });
        return () => mo.disconnect();
    }, []);

    // lookups & normalization
    const entityLookup = useMemo(() => {
        const m = new Map<string, string>();
        (entities ?? []).forEach((e) => m.set(String(e.id), e.name));
        return m;
    }, [entities]);

    const normalizedFlows = useMemo(() => {
        return (flows ?? []).map((f) => {
            const key = f.entityId != null ? String(f.entityId) : (f as any).entityName ? `name:${String((f as any).entityName)}` : '';
            const parent = f.parentEntity != null && f.parentEntity !== '' ? String(f.parentEntity) : '';
            const name = (f as any).entityName ?? entityLookup.get(key) ?? (f.entityId ? `Entidad ${f.entityId}` : '');
            const country = (f as any).countryName ?? (f as any).country ?? '';
            return { ...f, _key: key, _parent: parent, _name: name, _country: country };
        });
    }, [flows, entityLookup]);

    // Build levels for layout:
    // level 0 = activity
    // level 1 = nodes with no parent (direct children of activity)
    // level 2 = nodes whose parent is in level1
    const computeLayout = () => {
        const container = containerRef.current;
        const width = container ? Math.max(container.clientWidth, 900) : 1200;
        // Unique node keys from normalizedFlows
        const uniqueMap = new Map<string, { key: string; name: string; country: string; role?: string }>();
        normalizedFlows.forEach((f) => {
            if (f._key) uniqueMap.set(f._key, { key: f._key, name: f._name, country: f._country, role: f.entityRole });
            if (f._parent) {
                if (!uniqueMap.has(f._parent)) uniqueMap.set(f._parent, { key: f._parent, name: entityLookup.get(f._parent) ?? `Entidad ${f._parent}`, country: '', role: undefined });
            }
        });

        const allNodes = Array.from(uniqueMap.values());

        // classify
        const level0 = [{ key: `activity-${processingActivityId}`, name: processingActivityName ?? `Actividad #${processingActivityId}`, country: '', role: 'Actividad' }];

        // level1: nodes that don't have a parent in flows (meaning parent is activity) OR whose parent is falsy
        const parentSet = new Set<string>(normalizedFlows.map((f) => f._parent).filter(Boolean));
        const level1 = allNodes.filter((n) => !parentSet.has(n.key) || n.key && normalizedFlows.every(f => f._parent !== n.key && f._key !== n.key && !f._parent));
        // more robust approach: consider nodes that are targets in flows where parent empty -> those have parent activity
        const level1_fromActivity = normalizedFlows.filter((f) => !f._parent || f._parent === '').map(f => f._key).filter(Boolean);
        const level1keys = new Set(level1_fromActivity.length ? level1_fromActivity : level1.map(n => n.key));
        const level1Nodes = allNodes.filter(n => level1keys.has(n.key));

        // level2: nodes whose parent is in level1Nodes
        const level1KeyList = level1Nodes.map(n => n.key);
        const level2Nodes = allNodes.filter(n => {
            const hasParentInLevel1 = normalizedFlows.some(f => f._key === n.key && f._parent && level1KeyList.includes(f._parent));
            return hasParentInLevel1;
        });

        // fallback: if level1 empty, put all nodes as level1
        const finalLevel1 = level1Nodes.length ? level1Nodes : allNodes;
        const levels = [level0, finalLevel1, level2Nodes];

        // compute coordinates per level (center each level)
        const out: LayoutNode[] = [];
        const startY = 36;
        levels.forEach((lvl, i) => {
            if (lvl.length === 0) return;
            const y = startY + i * V_GAP;
            const totalWidth = lvl.length * CARD_WIDTH + Math.max(0, lvl.length - 1) * H_GAP;
            let startX = Math.max(48, (width - totalWidth) / 2);
            lvl.forEach((it: any, idx: number) => {
                const x = startX + idx * (CARD_WIDTH + H_GAP);
                out.push({ key: it.key, name: it.name, role: it.role, country: it.country, x, y });
            });
        });

        setNodes(out);
    };

    // recompute layout on mount & when data changes & on resize (ResizeObserver)
    useEffect(() => {
        computeLayout();

        const compute = () => computeLayout();

        if (containerRef.current && (window as any).ResizeObserver) {
            try {
                const obs = new (window as any).ResizeObserver(() => compute());
                try {
                    obs.observe(containerRef.current as HTMLElement);
                    roRef.current = obs;
                } catch {
                    window.addEventListener('resize', compute);
                }
            } catch {
                window.addEventListener('resize', compute);
            }
        } else {
            window.addEventListener('resize', compute);
        }

        return () => {
            const obs = roRef.current;
            if (obs) {
                try { if (containerRef.current) obs.unobserve(containerRef.current as HTMLElement); } catch { }
                try { obs.disconnect(); } catch { }
                roRef.current = null;
            } else {
                window.removeEventListener('resize', compute);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [flows, entities, processingActivityId, processingActivityName, scale]);

    // compute paths after nodes positioned
    useEffect(() => {
        const out: typeof paths = [];
        const find = (k: string) => nodes.find((n) => n.key === k);

        const makeCurve = (sx: number, sy: number, tx: number, ty: number) => {
            const dy = Math.abs(ty - sy);
            const c1x = sx;
            const c1y = sy + Math.max(24, dy * 0.28);
            const c2x = tx;
            const c2y = ty - Math.max(24, dy * 0.28);
            return `M ${sx},${sy} C ${c1x},${c1y} ${c2x},${c2y} ${tx},${ty}`;
        };

        const activityNode = find(`activity-${processingActivityId}`);

        normalizedFlows.forEach((f) => {
            const tgt = find(f._key);
            if (!tgt) return;
            const parentKey = f._parent;
            if (parentKey) {
                const parentNode = find(parentKey);
                if (parentNode) {
                    const sx = parentNode.x + CARD_WIDTH / 2;
                    const sy = parentNode.y + CARD_HEIGHT / 2;
                    const tx = tgt.x + CARD_WIDTH / 2;
                    const ty = tgt.y - CARD_HEIGHT / 2;
                    const d = makeCurve(sx, sy, tx, ty);
                    out.push({ id: `p-${f.id || Math.random()}`, d, sx, sy, tx, ty });
                    return;
                }
            }
            // else connect from activity
            if (activityNode) {
                const sx = activityNode.x + CARD_WIDTH / 2;
                const sy = activityNode.y + CARD_HEIGHT / 2;
                const tx = tgt.x + CARD_WIDTH / 2;
                const ty = tgt.y - CARD_HEIGHT / 2;
                const d = makeCurve(sx, sy, tx, ty);
                out.push({ id: `p-act-${f.id || Math.random()}`, d, sx, sy, tx, ty });
            }
        });

        setPaths(out);
    }, [nodes, normalizedFlows, processingActivityId]);

    // zoom controls
    const zoomIn = () => setScale((s) => Math.min(2, +(s + 0.15).toFixed(2)));
    const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.15).toFixed(2)));
    const fitView = () => {
        setScale(1);
        if (containerRef.current) containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    };

    // visual theme tuned for light, but still supports dark
    const dotted = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
    const panelBg = isDark ? '#071726' : '#ffffff';
    const pageBg = isDark ? '#05141a' : '#fafafa';
    const cardBg = isDark ? 'rgba(255,255,255,0.03)' : '#ffffff';
    const textColor = isDark ? '#e6eef6' : '#0f172a';
    const subtle = isDark ? '#93a7b8' : '#9aa0a6';
    const edgeColor = isDark ? '#a8c0d9' : '#9CA3AF';

    return (
        <div ref={containerRef} className="w-full rounded-xl" style={{ position: 'relative', background: pageBg, padding: 28 }}>
            {/* Left stacked controls */}
            <div style={{ position: 'absolute', left: 20, top: 20, zIndex: 40 }}>
                <div style={{ background: '#fff', borderRadius: 8, padding: 6, boxShadow: '0 12px 30px rgba(16,24,40,0.08)' }}>
                    <button title="Zoom in" onClick={zoomIn} style={{ width: 44, height: 44, borderRadius: 8, border: 'none', background: '#fff', marginBottom: 8, cursor: 'pointer' }}>+</button>
                    <button title="Zoom out" onClick={zoomOut} style={{ width: 44, height: 44, borderRadius: 8, border: 'none', background: '#fff', marginBottom: 8, cursor: 'pointer' }}>−</button>
                    <button title="Fit" onClick={fitView} style={{ width: 44, height: 44, borderRadius: 8, border: 'none', background: '#fff', cursor: 'pointer' }}>⤢</button>
                </div>
            </div>

            {/* Viewport (scaled) */}
            <div
                ref={viewportRef}
                style={{
                    transform: `scale(${scale})`,
                    transformOrigin: 'top center',
                    transition: 'transform 160ms ease',
                    marginTop: 18,
                    minHeight: 520,
                    borderRadius: 12,
                    position: 'relative',
                    background: panelBg,
                    boxShadow: '0 30px 60px rgba(16,24,40,0.06)',
                    overflow: 'hidden',
                }}
            >
                {/* dotted background */}
                <div
                    aria-hidden
                    style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: `radial-gradient(${dotted} 2px, transparent 2px)`,
                        backgroundSize: '28px 28px',
                        opacity: 1,
                        zIndex: 0,
                        pointerEvents: 'none',
                    }}
                />

                {/* SVG connectors (z-index 1) */}
                <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 10, overflow: 'visible' }} width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <marker id="handle" markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
                            <circle cx="4" cy="4" r="3" fill={edgeColor} />
                        </marker>
                    </defs>

                    {paths.map((p) => (
                        <g key={p.id}>
                            <path d={p.d} stroke={edgeColor} strokeWidth={2.2} fill="none" strokeDasharray="8 8" strokeLinecap="round" />
                            {/* circular handles at 25% and 60% */}
                            <circle cx={p.sx + (p.tx - p.sx) * 0.25} cy={p.sy + (p.ty - p.sy) * 0.25} r={6} fill={panelBg} stroke={edgeColor} strokeWidth={1.2} />
                            <circle cx={p.sx + (p.tx - p.sx) * 0.6} cy={p.sy + (p.ty - p.sy) * 0.6} r={6} fill={panelBg} stroke={edgeColor} strokeWidth={1.2} />
                        </g>
                    ))}
                </svg>

                {/* Nodes (z-index 20) */}
                <div style={{ position: 'relative', zIndex: 20, minHeight: 480 }}>
                    {nodes.map((n) => {
                        const isActivity = n.key.startsWith('activity-');
                        return (
                            <div
                                key={n.key}
                                style={{
                                    position: 'absolute',
                                    left: n.x,
                                    top: n.y,
                                    width: CARD_WIDTH,
                                    height: CARD_HEIGHT,
                                    background: cardBg,
                                    borderRadius: 12,
                                    boxShadow: '0 12px 24px rgba(16,24,40,0.06)',
                                    padding: 14,
                                    color: textColor,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    border: isDark ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(2,6,23,0.04)',
                                }}
                            >
                                <div style={{ fontSize: 12, color: subtle, marginBottom: 6 }}>{isActivity ? 'Actividad' : ''}</div>
                                <div style={{ fontSize: 15, fontWeight: 700 }}>{n.name}</div>
                                {!isActivity && n.country && <div style={{ fontSize: 12, color: subtle, marginTop: 10 }}>{n.country}</div>}
                                {/* role pill */}
                                {!isActivity && (
                                    <div style={{ marginTop: 12 }}>
                                        <span
                                            style={{
                                                display: 'inline-block',
                                                fontSize: 12,
                                                padding: '6px 12px',
                                                borderRadius: 999,
                                                background: n.role === 'Responsable' ? '#e6f0ff' : n.role === 'Encargado' ? '#ecfdf5' : '#fff7ed',
                                                color: n.role === 'Responsable' ? '#0b61d8' : n.role === 'Encargado' ? '#065f46' : '#7c4d0c',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {n.role ?? ''}
                                        </span>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}