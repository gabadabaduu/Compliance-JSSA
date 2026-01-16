import { apiClient } from '../../../../lib/api-client';
import type { CatalogItem } from '../types';

export const catalogService = {
    // Obtener todos los items de un catálogo
    getAll: async (endpoint: string): Promise<CatalogItem[]> => {
        const response = await apiClient.get<any[]>(`/Normativa/catalog/${endpoint}`);

        // Transformar "type" a "name" para el endpoint "types"
        if (endpoint === 'types') {
            return response.map(item => ({
                id: item.id,
                name: item.type  // 👈 Mapear "type" a "name"
            }));
        }

        return response;
    },

    // Crear un nuevo item
    create: async (
        endpoint: string,
        data: Omit<CatalogItem, 'id'>
    ): Promise<CatalogItem> => {
        // Transformar "name" a "type" para el endpoint "types"
        const payload = endpoint === 'types'
            ? { type: data.name }  // 👈 Enviar como "type"
            : data;                 // Enviar como "name"

        const response = await apiClient.post<any>(`/Normativa/catalog/${endpoint}`, payload);

        // Transformar respuesta
        if (endpoint === 'types') {
            return {
                id: response.id,
                name: response.type  // 👈 Mapear "type" a "name"
            };
        }

        return response;
    },

    // Actualizar un item existente
    update: async (
        endpoint: string,
        id: number,
        data: Partial<CatalogItem>
    ): Promise<CatalogItem> => {
        // Transformar "name" a "type" para el endpoint "types"
        const payload = endpoint === 'types' && data.name
            ? { type: data.name }  // 👈 Enviar como "type"
            : data;                 // Enviar como "name"

        const response = await apiClient.put<any>(`/Normativa/catalog/${endpoint}/${id}`, payload);

        // Transformar respuesta
        if (endpoint === 'types') {
            return {
                id: response.id,
                name: response.type  // 👈 Mapear "type" a "name"
            };
        }

        return response;
    },

    // Eliminar un item
    delete: async (endpoint: string, id: number): Promise<void> => {
        return apiClient.delete(`/Normativa/catalog/${endpoint}/${id}`);
    },
};