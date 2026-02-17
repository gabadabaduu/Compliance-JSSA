import React, { useEffect, useMemo, useRef, useState } from 'react';
import type { RopaDataFlowDto } from '../services/ratService';

interface FlowDiagramProps {
    processingActivityId: number;
    processingActivityName?: string | null;
    flows: RopaDataFlowDto[]; // flows filtered to this activity
    entities: { id: number; name: string }[]; // lookup
}

/**
 * Lightweight dependency-free Flow Diagram.
 * Robust to variations in flow data:
 *  - f.entityId may be number or string, or missing
 *  - f.entityName may exist; if so use it preferentially
 *  - f.parentEntity may be number/string; allow "Ninguno" (empty)
 *
 * Draws simple curved SVG links between nodes.
 */

const CARD_WIDTH = 240;
const CARD_HEIGHT = 92;
const H_MARGIN = 24;
const V_MARGIN = 28;

export default function FlowDiagram({
    processingActivityId,
    processingActivityName,
    flows,
    entities,
}: FlowDiagramProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const activityRef = useRef<HTMLDivElement | null>(null);
    const entityRefs = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const [paths, setPaths] = useState<string[]>([]);
    const resizeObserverRef = useRef<ResizeObserver | null>(null);

    // Build lookup from entities list
    const entityLookup = useMemo(() => {
        const m = new Map<string, string>();
        (entities ?? []).forEach((e) => m.set(String(e.id), e.name));
        return m;
    }, [entities]);

    // Normalize flows: ensure entityKey and parentKey (string) and pick entityName if present
    const normalizedFlows = useMemo(() => {
        return (flows ?? []).map((f) => {
            const entityKey = f.entityId != null ? String(f.entityId) : (f.entityName ? `name:${String(f.entityName)}` : '');
            const parentKey = f.parentEntity != null ? String(f.parentEntity) : '';
            const name = (f as any).entityName ?? entityLookup.get(entityKey) ?? (f.entityId ? `Entidad ${f.entityId}` : (f.entityName ?? ''));
            return {
                ...f,
                _entityKey: entityKey,
                _parentKey: parentKey,
                _entityNameResolved: name,
            };
        });
    }, [flows, entityLookup]);

    // Determine unique nodes: include any entity referenced in flows (either by id or name)
    const uniqueNodes = useMemo(() => {
        const map = new Map<string, { key: string; name: string }>();
        normalizedFlows.forEach((f) => {
            if (f._entityKey) {
                if (!map.has(f._entityKey)) map.set(f._entityKey, { key: f._entityKey, name: f._entityNameResolved ?? `Entidad ${f.entityId ?? ''}` });
            } else if (f._entityNameResolved) {
                // fallback to named entity
                const key = `name:${f._entityNameResolved}`;
                if (!map.has(key)) map.set(key, { key, name: f._entityNameResolved });
            }
            // also ensure parent exists as node (if parentKey present we add placeholder)
            if (f._parentKey) {
                if (!map.has(f._parentKey)) {
                    const parentName = entityLookup.get(f._parentKey) ?? `Entidad ${f._parentKey}`;
                    map.set(f._parentKey, { key: f._parentKey, name: parentName });
                }
            }
        });
        return Array.from(map.values());
    }, [normalizedFlows, entityLookup]);

    // utility: compute center of element relative to container
    const getCenter = (el: HTMLElement | null) => {
        if (!el || !containerRef.current) return null;
        const containerRect = containerRef.current.getBoundingClientRect();
        const r = el.getBoundingClientRect();
        return {
            x: r.left + r.width / 2 - containerRect.left,
            y: r.top + r.height / 2 - containerRect.top,
        };
    };

    // Build svg paths after DOM rendered and on resize
    useEffect(() => {
        let active = true;

        const computePaths = () => {
            if (!active) return;
            const newPaths: string[] = [];
            const activityCenter = getCenter(activityRef.current);
            if (!activityCenter) {
                setPaths([]);
                return;
            }

            const makeCurve = (sx: number, sy: number, tx: number, ty: number) => {
                const dy = Math.abs(ty - sy);
                const cx1 = sx;
                const cy1 = sy + Math.max(24, dy * 0.28);
                const cx2 = tx;
                const cy2 = ty - Math.max(24, dy * 0.28);
                return `M ${sx},${sy} C ${cx1},${cy1} ${cx2},${cy2} ${tx},${ty}`;
            };

            normalizedFlows.forEach((f) => {
                const targetEl = entityRefs.current.get(f._entityKey);
                if (!targetEl) return;
                const targetCenter = getCenter(targetEl);
                if (!targetCenter) return;

                const parentKey = f._parentKey;
                if (parentKey && parentKey !== '' && entityRefs.current.get(parentKey)) {
                    const parentCenter = getCenter(entityRefs.current.get(parentKey) ?? null);
                    if (parentCenter) {
                        newPaths.push(
                            `<path d="${makeCurve(parentCenter.x, parentCenter.y + CARD_HEIGHT / 2, targetCenter.x, targetCenter.y - CARD_HEIGHT / 2)}" stroke="#9CA3AF" stroke-width="2" fill="none" stroke-dasharray="6 6" stroke-linecap="round" />`
                        );
                        return;
                    }
                }

                // default: activity -> target
                newPaths.push(
                    `<path d="${makeCurve(activityCenter.x, activityCenter.y + CARD_HEIGHT / 2, targetCenter.x, targetCenter.y - CARD_HEIGHT / 2)}" stroke="#93c5fd" stroke-width="2" fill="none" stroke-dasharray="6 6" stroke-linecap="round" />`
                );
            });

            setPaths(newPaths);
        };

        // Run compute a bit after mount to ensure refs exist
        const t = window.setTimeout(computePaths, 60);

        // Observe resizes to recompute
        if (containerRef.current && 'ResizeObserver' in window) {
            resizeObserverRef.current = new ResizeObserver(() => {
                computePaths();
            });
            resizeObserverRef.current.observe(containerRef.current);
        } else {
            window.addEventListener('resize', computePaths);
        }

        return () => {
            active = false;
            window.clearTimeout(t);
            if (resizeObserverRef.current && containerRef.current) {
                resizeObserverRef.current.unobserve(containerRef.current);
                resizeObserverRef.current.disconnect();
                resizeObserverRef.current = null;
            } else {
                window.removeEventListener('resize', computePaths);
            }
        };
        // re-run when normalizedFlows or node refs change
    }, [normalizedFlows, uniqueNodes, processingActivityId, processingActivityName]);

    // If there are no nodes, show placeholder
    if (!normalizedFlows || normalizedFlows.length === 0) {
        return (
            <div className="w-full p-6 bg-white rounded-lg shadow-sm text-center" style={{ minHeight: 200 }}>
                <div className="text-sm text-gray-500">No hay flujos asociados a esta actividad.</div>
                <div className="text-xs text-gray-400 mt-2">Crea un flujo para ver el mapa de datos.</div>
            </div>
        );
    }

    // Render nodes (activity + entity cards). We arrange entity cards in wrapped flex; SVG overlays connectors.
    return (
        <div ref={containerRef} className="w-full p-4 bg-white rounded-lg shadow-sm" style={{ position: 'relative', minHeight: 320 }}>
            {/* Activity card */}
            <div
                ref={activityRef}
                className="mx-auto mb-6 bg-white rounded-lg shadow p-4 text-center"
                style={{ width: CARD_WIDTH, height: CARD_HEIGHT, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
            >
                <div className="text-sm text-gray-500">Actividad</div>
                <div className="text-base font-semibold text-gray-900">{processingActivityName ?? `#${processingActivityId}`}</div>
            </div>

            {/* SVG overlay for connectors */}
            <svg
                style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'visible' }}
                width="100%"
                height="100%"
                xmlns="http://www.w3.org/2000/svg"
            >
                <g dangerouslySetInnerHTML={{ __html: paths.join('\n') }} />
            </svg>

            {/* Entities grid */}
            <div className="flex flex-wrap gap-4 justify-center items-start" style={{ paddingTop: 8 }}>
                {uniqueNodes.map((n) => {
                    const role = entityRoleById(normalizedFlows).get(n.key) ?? '';
                    return (
                        <div
                            key={n.key}
                            ref={(el) => { entityRefs.current.set(n.key, el); }}
                            className="bg-white rounded-lg shadow p-3"
                            style={{
                                width: CARD_WIDTH,
                                height: CARD_HEIGHT,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                            }}
                        >
                            <div className="text-sm font-semibold text-gray-800">{n.name}</div>
                            <div className="text-xs text-gray-500 mt-1">&nbsp;</div>
                            {role && (
                                <div style={{ marginTop: 8 }}>
                                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: '#e6fffa', color: '#065f46' }}>{role}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* Helpers outside component to keep memoization stable */
function entityRoleById(flows: RopaDataFlowDto[]) {
    const m = new Map<string, string>();
    flows.forEach((f) => {
        const key = f.entityId != null ? String(f.entityId) : (f.entityName ? `name:${String(f.entityName)}` : '');
        if (key && f.entityRole && !m.has(key)) {
            m.set(key, String(f.entityRole));
        }
    });
    return m;
}