import { apiClient } from '../../../lib/api-client';
import type { DsrNotification } from '../types';

export async function getMyNotifications(email: string): Promise<DsrNotification[]> {
    return apiClient.get<DsrNotification[]>(`/dsrnotification/my?email=${encodeURIComponent(email)}`);
}

export async function getMyNotificationCount(email: string): Promise<number> {
    return apiClient.get<number>(`/dsrnotification/my/count?email=${encodeURIComponent(email)}`);
}

export async function refreshNotifications(email: string): Promise<void> {
    await apiClient.post(`/dsrnotification/refresh?email=${encodeURIComponent(email)}`);
}