import { apiClient } from '../../../../lib/api-client';
import type { SancionName } from '../types';

export async function getSancionNames(): Promise<SancionName[]> {
    return apiClient.get<SancionName[]>('/Sancion/names');
}

export async function getSancionById(id: number): Promise<SancionName> {
    return apiClient.get<SancionName>(`/Sancion/${id}`);
}