import { apiClient } from '../../../lib/api-client';
import { useUserStore } from '../../../stores/userStore';
import type { DsrUpcoming, DsrStatusSummary } from '../types';
import type { Regulation } from '../../cumplimiento/normativa/types';
import type { Dsr } from '../../habeasdata/types';

// ============================================
// 🗺️ MAPA - Países donde se almacenan datos
// ============================================

export async function getStorageCountries(companyName?: string): Promise<string[]> {
    const params = new URLSearchParams();
    if (companyName) {
        params.append('companyName', companyName);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<string[]>(`/rat/data/countries${query}`);
}

export function getStorageCountriesForCurrentUser(): Promise<string[]> {
    const { userData } = useUserStore.getState();
    const companyName = userData?.role === 'superadmin' ? undefined : userData?.nombreEmpresa;
    return getStorageCountries(companyName);
}

// ============================================
// ⏰ PETICIÓN PRÓXIMA A VENCER
// ============================================

export async function getNextDueDsr(companyName?: string): Promise<DsrUpcoming | null> {
    const params = new URLSearchParams();
    if (companyName) {
        params.append('companyName', companyName);
    }
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiClient.get<DsrUpcoming | null>(`/dsr/next-due${query}`);
}

// ============================================
// 📜 ÚLTIMA NORMATIVA AGREGADA
// ============================================

export async function getLatestRegulation(): Promise<Regulation | null> {
    return apiClient.get<Regulation | null>('/Normativa/latest');
}

// ============================================
// 📊 PIE CHART - Pendientes vs Completadas
// ============================================

export async function getDsrStatusSummary(): Promise<DsrStatusSummary> {
    const [pending, completed] = await Promise.all([
        apiClient.get<Dsr[]>('/dsr/pending'),
        apiClient.get<Dsr[]>('/dsr/completed'),
    ]);

    return {
        open: pending.length,
        closed: completed.length,
    };
}