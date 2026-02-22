// ============================================
// 🗺️ MAPA
// ============================================
export interface MapData {
    countries: string[];
}

// ============================================
// 📊 PIE CHART - Habeas Data
// ============================================
export interface DsrStatusSummary {
    open: number;
    closed: number;
}

// ============================================
// ⏰ PETICIÓN PRÓXIMA
// ============================================
export interface DsrUpcoming {
    id: number;
    dsrId: number;
    recipientEmail: string;
    recipientRole: string;
    daysBeforeDue: number;
    emailSent: boolean;
    createdAt: string;

    // Datos del DSR
    caseId?: string;
    fullName?: string;
    requestType?: string;
    status?: string;
    dueDate?: string;
    tenant?: string;
}

// ============================================
// 📜 ÚLTIMA NORMATIVA
// ============================================
export interface LatestNormativa {
    id: number;
    nombre: string;
    descripcion: string;
    tipo: string;
    createdAt: string;
}