import { apiClient } from '../../../lib/api-client';
import type { AjusteName } from '../types';

export async function getAjustesNames(): Promise<AjusteName[]> {
    return apiClient.get<AjusteName[]>('/Ajustes/names');
}

export async function getAjusteById(id: number): Promise<AjusteName> {
    return apiClient.get<AjusteName>(`/Ajustes/${id}`);
}