import { apiClient } from '../../../lib/api-client';
import type { EpidName } from '../types';

export async function getEpidNames(): Promise<EpidName[]> {
  // apiClient ya devuelve response.data por el wrapper request<T>
  return apiClient.get<EpidName[]>('/EPID/names');
}

export async function getEpidById(id: number): Promise<EpidName> {
  return apiClient.get<EpidName>(`/EPID/${id}`);
}