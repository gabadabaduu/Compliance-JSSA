import { apiClient } from '../../../../lib/api-client';
import type { CatalogItem } from '../types';

export const catalogService = {
    // Obtener todos los items de un catálogo
    getAll: async (endpoint: string): Promise<CatalogItem[]> => {
        return apiClient.get<CatalogItem[]>(`/Normativa/catalog/${endpoint}`);
    },

    // Crear un nuevo item
    create: async (
        endpoint: string,
        data: Omit<CatalogItem, 'id'>
    ): Promise<CatalogItem> => {
        return apiClient.post<CatalogItem>(`/Normativa/catalog/${endpoint}`, data);
    },

    // Actualizar un item existente
    update: async (
        endpoint: string,
        id: number,
        data: Partial<CatalogItem>
    ): Promise<CatalogItem> => {
        return apiClient.put<CatalogItem>(`/Normativa/catalog/${endpoint}/${id}`, data);
    },

    // Eliminar un item
    delete: async (endpoint: string, id: number): Promise<void> => {
        return apiClient.delete(`/Normativa/catalog/${endpoint}/${id}`);
    },
};