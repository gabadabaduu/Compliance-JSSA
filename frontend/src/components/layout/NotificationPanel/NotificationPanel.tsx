import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMyNotifications } from '../../../modules/notifications/hooks/useNotifications';
import { useUserStore } from '../../../stores/userStore';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DsrNotification {
    id: number;
    dsrId: number;
    recipientEmail: string;
    recipientRole: string;
    daysBeforeDue: number;
    emailSent: boolean;
    createdAt: string;
    caseId: string;
    fullName: string;
    requestType: string;
    status: string;
    dueDate: string;
    tenant: string;
}

function NotificationCard({ notification }: { notification: DsrNotification }) {
    const isExpired = notification.daysBeforeDue <= 0;
    const isUrgent = notification.daysBeforeDue <= 1;

    const urgencyText = notification.daysBeforeDue > 0
        ? `Vence en ${notification.daysBeforeDue} día(s)`
        : notification.daysBeforeDue === 0
            ? 'Vence hoy'
            : `Venció hace ${Math.abs(notification.daysBeforeDue)} día(s)`;

    const urgencyColor = isExpired
        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
        : isUrgent
            ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
            : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';

    const borderColor = isExpired
        ? 'border-l-red-500'
        : isUrgent
            ? 'border-l-orange-500'
            : 'border-l-yellow-500';

    const dueDate = notification.dueDate
        ? new Date(notification.dueDate).toLocaleDateString('es-CO', {
            day: '2-digit', month: '2-digit', year: 'numeric'
        })
        : 'N/A';

    const createdAt = new Date(notification.createdAt).toLocaleDateString('es-CO', {
        day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className={`bg-white dark:bg-[#1e2130] rounded-lg border-l-4 ${borderColor} 
                         shadow-sm p-4 hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-800 dark:text-white">
                    Radicado No. {notification.caseId ?? 'N/A'}
                </span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${urgencyColor}`}>
                    {urgencyText}
                </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                Solicitud de <strong>{notification.requestType ?? 'N/A'}</strong> sobre datos personales
                de <strong>{notification.fullName ?? 'N/A'}</strong>.
            </p>

            <div className="flex flex-col gap-1 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                    <Icon icon="mdi:calendar-clock" width="14" height="14" />
                    <span>Fecha límite: {dueDate}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Icon icon="mdi:domain" width="14" height="14" />
                    <span>{notification.tenant ?? 'N/A'}</span>
                </div>
                <div className="flex items-center gap-1">
                    <Icon icon="mdi:clock-outline" width="14" height="14" />
                    <span>{createdAt}</span>
                </div>
            </div>
        </div>
    );
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
    const { userData } = useUserStore();
    const email = userData?.email ?? '';
    const { data: notifications, isLoading } = useMyNotifications(email);
    const queryClient = useQueryClient();

    // Refrescar cada vez que se abre el panel
    useEffect(() => {
        if (isOpen && email) {
            queryClient.refetchQueries({ queryKey: ['my-notifications'] });
            queryClient.refetchQueries({ queryKey: ['my-notification-count'] });
        }
    }, [isOpen, email, queryClient]);

    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/30 z-40 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Panel */}
            <div
                className={`fixed top-0 right-0 h-full w-[400px] bg-[#EFF2FB] dark:bg-[#151824] shadow-2xl z-50 
                           transform transition-transform duration-300 ease-in-out flex flex-col
                           ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1e2130]">
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:bell-outline" width="22" height="22" className="text-gray-700 dark:text-gray-200" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Notificaciones
                        </h2>
                        {notifications && notifications.length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                                {notifications.length}
                            </span>
                        )}
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <Icon icon="mdi:close" width="22" height="22" className="text-gray-500 dark:text-gray-400" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Icon icon="mdi:loading" width="32" height="32" className="animate-spin mb-3" />
                            <p className="text-sm">Cargando notificaciones...</p>
                        </div>
                    ) : notifications && notifications.length > 0 ? (
                        (notifications as DsrNotification[]).map((notification) => (
                            <NotificationCard key={notification.id} notification={notification} />
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Icon icon="mdi:bell-check-outline" width="48" height="48" className="mb-3 opacity-50" />
                            <p className="text-sm">No tienes notificaciones pendientes</p>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}