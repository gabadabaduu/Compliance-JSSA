import { Icon } from '@iconify/react';
import { useQueryClient } from '@tanstack/react-query';
import { useMyNotificationCount } from '../../../modules/notifications/hooks/useNotifications';
import { useUserStore } from '../../../stores/userStore';

interface NotificationBellProps {
    onClick: () => void;
}

export default function NotificationBell({ onClick }: NotificationBellProps) {
    const { userData } = useUserStore();
    const email = userData?.email ?? '';
    const { data: count } = useMyNotificationCount(email);
    const queryClient = useQueryClient();
    const hasNotifications = count !== undefined && count > 0;

    const handleClick = () => {
        // Forzar refetch fresco (ignorar staleTime)
        queryClient.refetchQueries({ queryKey: ['my-notifications'] });
        queryClient.refetchQueries({ queryKey: ['my-notification-count'] });
        onClick();
    };

    return (
        <button
            onClick={handleClick}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-[13px] transition-colors text-sm text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
            <div className="relative shrink-0">
                <Icon
                    icon={hasNotifications ? "mdi:bell-badge" : "mdi:bell-outline"}
                    width="20"
                    height="20"
                    className={hasNotifications ? "text-red-500" : "text-gray-600 dark:text-gray-300"}
                />
                {hasNotifications && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold rounded-full min-w-[16px] h-4 flex items-center justify-center px-0.5">
                        {count > 9 ? '9+' : count}
                    </span>
                )}
            </div>
            <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Notificaciones
            </span>
        </button>
    );
}