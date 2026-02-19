import React from 'react';
import ReactFlow, { Background, BackgroundVariant, Node, Edge } from 'reactflow';
import 'reactflow/dist/style.css';
import type { RopaDataFlowDto } from '../services/ratService';

interface Entity {
    id: number;
    name: string;
}

interface FlowDiagramProps {
    processingActivityId: number;
    processingActivityName: string | null;
    flows: RopaDataFlowDto[];
    entities: Entity[];
}

/**
 * Componente mínimo para renderizar un diagrama a partir de `entities` y `flows`.
 * - Cada entidad se transforma en un nodo.
 * - Si un flow tiene parentEntity y entityId se renderiza una arista parent -> entity.
 *
 * Ajusta la lógica de posición / layout según necesites.
 */
export default function FlowDiagram({
    processingActivityId,
    processingActivityName,
    flows,
    entities,
}: FlowDiagramProps): React.ReactElement {
    // Convertir entidades a nodos (posicionamiento simple en línea)
    const nodes: Node[] = entities.map((e, i) => ({
        id: String(e.id),
        data: { label: e.name },
        position: { x: (i % 6) * 220, y: Math.floor(i / 6) * 120 },
        style: {
            padding: 10,
            borderRadius: 8,
            minWidth: 140,
            textAlign: 'center',
            background: '#fff',
            boxShadow: '0 1px 6px rgba(0,0,0,0.08)',
        },
    }));

    // Convertir flows a edges (si tienen parentEntity -> entityId)
    const edges: Edge[] = flows
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

    return (
        <div style={{ width: '100%', height: 420 }}>
            <div style={{ marginBottom: 8 }}>
                <strong style={{ display: 'block' }}>
                    {processingActivityName ?? `Actividad #${processingActivityId}`}
                </strong>
                <small style={{ color: '#6b7280' }}>{entities.length} entidades — {flows.length} flujos</small>
            </div>

            <div style={{ width: '100%', height: 360, borderRadius: 8, overflow: 'hidden', background: '#f8fafc' }}>
                <ReactFlow nodes={nodes} edges={edges} fitView>
                    <Background gap={12} color="#e6eef6" variant={BackgroundVariant.Dots} />
                </ReactFlow>
            </div>
        </div>
    );
}