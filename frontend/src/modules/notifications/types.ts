export interface DsrNotification {
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