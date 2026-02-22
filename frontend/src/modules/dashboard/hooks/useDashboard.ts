import { useQuery } from '@tanstack/react-query';
import { getStorageCountries, getNextDueDsr, getLatestRegulation, getDsrStatusSummary } from '../services/dashboardService';
import { useUserStore } from '../../../stores/userStore';
import { usePermissions } from '../../../hooks/usePermissions';

// ============================================
// 🗺️ MAPA - Países
// ============================================

export function useStorageCountries() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['dashboard', 'storage-countries', companyName],
        queryFn: () => getStorageCountries(companyName),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

// ============================================
// ⏰ PETICIÓN PRÓXIMA A VENCER
// ============================================

export function useNextDueDsr() {
    const { isSuperAdmin } = usePermissions();
    const { userData } = useUserStore();
    const companyName = isSuperAdmin ? undefined : userData?.nombreEmpresa;

    return useQuery({
        queryKey: ['dashboard', 'next-due-dsr', companyName],
        queryFn: () => getNextDueDsr(companyName),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
        retry: 1,
    });
}

// ============================================
// 📜 ÚLTIMA NORMATIVA AGREGADA
// ============================================

export function useLatestRegulation() {
    return useQuery({
        queryKey: ['dashboard', 'latest-regulation'],
        queryFn: () => getLatestRegulation(),
        staleTime: 1000 * 60 * 10,
        gcTime: 1000 * 60 * 30,
        retry: 1,
    });
}

// ============================================
// 📊 PIE CHART - Resumen de estados DSR
// ============================================

export function useDsrStatusSummary() {
    return useQuery({
        queryKey: ['dashboard', 'dsr-status-summary'],
        queryFn: () => getDsrStatusSummary(),
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 15,
        retry: 1,
    });
}