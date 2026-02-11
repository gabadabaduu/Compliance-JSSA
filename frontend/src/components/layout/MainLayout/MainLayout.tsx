import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import NotificationPanel from '../NotificationPanel/NotificationPanel';
import { useNotificationHub } from '../../../modules/notifications/hooks/useNotificationHub';

export default function MainLayout() {
    const [isNotificationPanelOpen, setIsNotificationPanelOpen] = useState(false);

    // Conectar WebSocket para notificaciones en tiempo real
    useNotificationHub();

    return (
        <div className="flex min-h-screen bg-[#EFF2FB] dark:bg-[#151824]">
            <Sidebar onNotificationClick={() => setIsNotificationPanelOpen(true)} />

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>

            <NotificationPanel
                isOpen={isNotificationPanelOpen}
                onClose={() => setIsNotificationPanelOpen(false)}
            />
        </div>
    );
}