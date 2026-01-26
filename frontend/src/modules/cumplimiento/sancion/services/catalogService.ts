import { apiClient } from '../../../../lib/api-client';
import type { CatalogItem, CreateCatalogDto, UpdateCatalogDto } from '../types';
import { useUserStore } from '../../../../stores/userStore';
export const catalogService = {
    // Obtener todos los items de un catálogo
    getAll: async (endpoint: string): Promise<CatalogItem[]> => {
        return apiClient.get<CatalogItem[]>(`/Sanctions/catalog/${endpoint}`);  // 🆕 Cambio:  Sanctions
    },

    // Crear un nuevo item
    create: async (
        endpoint: string,
        data: CreateCatalogDto
    ): Promise<CatalogItem> => {
        const { userData } = useUserStore.getState();
        
        if (userData?.role !== 'superadmin') {
            throw new Error('No tienes permisos para crear items de catálogo');
        }
        
        return apiClient.post<CatalogItem>(`/Sanctions/catalog/${endpoint}`, data);
    },

    // Actualizar un item existente
    update: async (
        endpoint: string,
        id: number,
        data: UpdateCatalogDto
    ): Promise<CatalogItem> => {
        const { userData } = useUserStore.getState();
        
        if (userData?.role !== 'superadmin') {
            throw new Error('No tienes permisos para actualizar items de catálogo');
        }
        
        return apiClient.put<CatalogItem>(`/Sanctions/catalog/${endpoint}/${id}`, data);
    },

    // Eliminar un item
    delete: async (endpoint: string, id: number): Promise<void> => {
        const { userData } = useUserStore.getState();
        
        if (userData?.role !== 'superadmin') {
            throw new Error('No tienes permisos para eliminar items de catálogo');
        }
        
        return apiClient.delete(`/Sanctions/catalog/${endpoint}/${id}`);
    },
};