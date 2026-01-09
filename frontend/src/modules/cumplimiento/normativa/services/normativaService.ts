import { apiClient } from '../../../../lib/api-client';
import type { NormativaName } from '../types';

export async function getNormativaNames(): Promise<NormativaName[]> {
    return apiClient.get<NormativaName[]>('/Normativa/names');
}

export async function getNormativaById(id: number): Promise<NormativaName> {
    return apiClient.get<NormativaName>(`/Normativa/${id}`);
}