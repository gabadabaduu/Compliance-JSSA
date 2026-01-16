import { apiClient } from '../../../../lib/api-client';
import type { CatalogItem, CreateCatalogDto, UpdateCatalogDto } from '../types';

export const catalogService = {
    // Obtener todos los items de un catálogo
    getAll: async (endpoint: string): Promise<CatalogItem[]> => {
        return apiClient.get<CatalogItem[]>(`/Resolutions/catalog/${endpoint}`);
    },

    // Crear un nuevo item
    create: async (
        endpoint: string,
        data: CreateCatalogDto
    ): Promise<CatalogItem> => {
        return apiClient.post<CatalogItem>(`/Resolutions/catalog/${endpoint}`, data);
    },

    // Actualizar un item existente
    update: async (
        endpoint: string,
        id: number,
        data: UpdateCatalogDto
    ): Promise<CatalogItem> => {
        return apiClient.put<CatalogItem>(`/Resolutions/catalog/${endpoint}/${id}`, data);
    },

    // Eliminar un item
    delete: async (endpoint: string, id: number): Promise<void> => {
        return apiClient.delete(`/Resolutions/catalog/${endpoint}/${id}`);
    },
};