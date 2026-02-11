import { Icon } from '@iconify/react';
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMyNotifications } from '../../../modules/notifications/hooks/useNotifications';
import { useUserStore } from '../../../stores/userStore';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DsrInfo {
    id: number;
    caseId: string;
    fullName: string;
    dueDate: string;
    status: string;
    tenant: string;
}

interface RequestTypeInfo {
    type: string;
}

interface DsrNotification {
    id: number;
    dsrId: number;
    recipientEmail: string;
    recipientRole: string;
    daysBeforeDue: number;
    emailSent: boolean;
    createdAt: string;
    dsr?: DsrInfo;
    requestType?: RequestTypeInfo;
}

function NotificationCard({ notification }: { notification: DsrNotification }) {
    const daysText = notification.daysBeforeDue <= 0
        ? notification.daysBeforeDue === 0
            ? 'Vence hoy'
            : `Vencida hace ${Math.abs(notification.daysBeforeDue)} día(s)`
        : `${notification.daysBeforeDue} día(s) restante(s)`;

    const urgencyColor = notification.daysBeforeDue <= 0
        ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
        : notification.daysBeforeDue === 1
            ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20'
            : 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';

    const urgencyTextColor = notification.daysBeforeDue <= 0
        ? 'text-red-600 dark:text-red-400'
        : notification.daysBeforeDue === 1
            ? 'text-orange-600 dark:text-orange-400'
            : 'text-yellow-600 dark:text-yellow-400';

    const urgencyIcon = notification.daysBeforeDue <= 0
        ? 'mdi:alert-circle'
        : notification.daysBeforeDue === 1
            ? 'mdi:alert'
            : 'mdi:clock-alert-outline';

    return (
        <div className={`border-l-4 rounded-lg p-3 mb-3 ${urgencyColor}`}>
            <div className="flex items-start gap-2">
                <Icon
                    icon={urgencyIcon}
                    width="18"
                    height="18"
                    className={`shrink-0 mt-0.5 ${urgencyTextColor}`}
                />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            Radicado: {notification.dsr?.caseId ?? 'N/A'}
                        </p>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded whitespace-nowrap ml-2 ${urgencyTextColor}`}>
                            {daysText}
                        </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 truncate">
                        Titular: {notification.dsr?.fullName ?? 'N/A'}
                    </p>
                    {notification.requestType?.type && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            Tipo: {notification.requestType.type}
                        </p>
                    )}
                    {notification.dsr?.dueDate && (
                        <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                            Vence: {new Date(notification.dsr.dueDate).toLocaleDateString('es-CO')}
                        </p>
                    )}
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
                className={`fixed top-0 right-0 h-full w-[380px] bg-white dark:bg-[#1e2130] shadow-2xl z-50 
                           transform transition-transform duration-300 ease-in-out
                           ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                        <Icon icon="mdi:bell-outline" width="22" height="22" className="text-gray-700 dark:text-gray-200" />
                        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                            Notificaciones
                        </h2>
                        {notifications && notifications.length > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
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

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 h-[calc(100%-64px)]">
                    {isLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <Icon icon="mdi:loading" width="24" height="24" className="animate-spin text-gray-400" />
                            <span className="ml-2 text-sm text-gray-500">Cargando...</span>
                        </div>
                    ) : !notifications || notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <Icon icon="mdi:bell-off-outline" width="48" height="48" className="mb-3 opacity-50" />
                            <p className="text-sm">No tienes notificaciones</p>
                        </div>
                    ) : (
                        <>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                {notifications.length} solicitud(es) requiere(n) atención
                            </p>
                            {(notifications as DsrNotification[]).map((notification) => (
                                <NotificationCard
                                    key={notification.id}
                                    notification={notification}
                                />
                            ))}
                        </>
                    )}
                </div>
            </div>
        </>
    );
}