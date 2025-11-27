import { apiClient } from '@/lib/api-client';
import { DashboardMetrics } from '@/types';

export const dashboardApi = {
    getMetrics: () =>
        apiClient.get<DashboardMetrics>('/dashboard/metrics'),
};