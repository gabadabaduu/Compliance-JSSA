import { useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import ReactFlow, {
    MiniMap,
    Controls,
    Background,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Node,
    Edge
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ratApi } from '../api/ratApi';

export default function RATGraphPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['rat-graph'],
        queryFn: ratApi.getGraph,
    });

    const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

    useEffect(() => {
        if (data) {
            //setNodes(data.nodes || []); ver que hace esto
            setEdges(data.edges || []);
        }
    }, [data, setNodes, setEdges]);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge(params, eds)),
        [setEdges]
    );

    if (isLoading) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-xl text-gray-600">Cargando grafo RAT...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-red-600">
                    <p className="text-2xl mb-2">❌ Error al cargar el grafo</p>
                    <p className="text-gray-600">{(error as Error).message}</p>
                </div>
            </div>
        );
    }

    if (!nodes.length) {
        return (
            <div className="h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center text-gray-600">
                    <p className="text-2xl mb-2">📊 No hay entidades en el RAT</p>
                    <p>Crea tu primera entidad para visualizar el grafo</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-screen">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Controls />
                <MiniMap />
                <Background gap={12} size={1} />
            </ReactFlow>
        </div>
    );
}