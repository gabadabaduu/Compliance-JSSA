import { apiClient } from '@/lib/api-client';
import { Entity, GraphNode, GraphEdge } from '@/types';

export const ratApi = {
    getEntities: () =>
        apiClient.get<Entity[]>('/rat/entities'),

    getEntityById: (id: number) =>
        apiClient.get<Entity>(`/rat/entities/${id}`),

    createEntity: (data: Partial<Entity>) =>
        apiClient.post<Entity>('/rat/entities', data),

    getGraph: () =>
        apiClient.get<{ nodes: GraphNode[]; edges: GraphEdge[] }>('/rat/graph/full'),
};

