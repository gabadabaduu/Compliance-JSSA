import { apiClient } from '../../../lib/api-client';
import type { HabeasDataName } from '../types';

export async function getHabeasDataNames(): Promise<HabeasDataName[]> {
    return apiClient.get<HabeasDataName[]>('/HabeasData/names');
}

export async function getHabeasDataById(id: number): Promise<HabeasDataName> {
    return apiClient.get<HabeasDataName>(`/HabeasData/${id}`);
}