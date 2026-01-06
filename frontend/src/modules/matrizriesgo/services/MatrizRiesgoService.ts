import { apiClient } from '../../../lib/api-client';
import type { MatrizRiesgoName } from '../types';

export async function getMatrizRiesgoNames(): Promise<MatrizRiesgoName[]> {
    return apiClient.get<MatrizRiesgoName[]>('/MatrizRiesgo/names');
}

export async function getMatrizRiesgoById(id: number): Promise<MatrizRiesgoName> {
    return apiClient.get<MatrizRiesgoName>(`/MatrizRiesgo/${id}`);
}