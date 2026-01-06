import { apiClient } from '../../../lib/api-client';
import type { RatName } from '../types';

export async function getRatNames(): Promise<RatName[]> {
    return apiClient.get<RatName[]>('/Rat/names');
}

export async function getRatById(id: number): Promise<RatName> {
    return apiClient.get<RatName>(`/Rat/${id}`);
}