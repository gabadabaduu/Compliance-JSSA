import { apiClient } from '../../../lib/api-client';
import type { NormogramaName } from '../types';

export async function getNormogramaNames(): Promise<NormogramaName[]> {
    return apiClient.get<NormogramaName[]>('/Normograma/names');
}

export async function getNormogramaById(id: number): Promise<NormogramaName> {
    return apiClient.get<NormogramaName>(`/Normograma/${id}`);
}