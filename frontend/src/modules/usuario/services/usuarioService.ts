import { apiClient } from '../../../lib/api-client';
import type { UsuarioName } from '../types';

export async function getUsuarioNames(): Promise<UsuarioName[]> {
    return apiClient.get<UsuarioName[]>('/Usuario/names');
}

export async function getUsuarioById(id: number): Promise<UsuarioName> {
    return apiClient.get<UsuarioName>(`/Usuario/${id}`);
}