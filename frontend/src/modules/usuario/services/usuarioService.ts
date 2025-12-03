import { apiClient } from '../../../lib/api-client'
import { UserDto } from '../../../types/user.types'

// Servicio específico del módulo Usuario
// Solo contiene operaciones CRUD para gestionar usuarios

export const usuarioService = {
    // Obtener todos los usuarios (solo admin/superadmin)
    getAllUsers: async (): Promise<UserDto[]> => {
        return await apiClient.get<UserDto[]>('/users')
    },

    // Obtener usuario por ID
    getUserById: async (userId: string): Promise<UserDto> => {
        return await apiClient.get<UserDto>(`/users/${userId}`)
    },

    // Actualizar usuario
    updateUser: async (userId: string, data: Partial<UserDto>): Promise<UserDto> => {
        return await apiClient.put<UserDto>(`/users/${userId}`, data)
    },

    // Actualizar permisos de un usuario
    updatePermissions: async (userId: string, permissions: Partial<UserDto>): Promise<UserDto> => {
        return await apiClient.put<UserDto>(`/users/${userId}/permissions`, permissions)
    },

    // Eliminar usuario (solo superadmin)
    deleteUser: async (userId: string): Promise<void> => {
        await apiClient.delete(`/users/${userId}`)
    }
}