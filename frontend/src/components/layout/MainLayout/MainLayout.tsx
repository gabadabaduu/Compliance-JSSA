import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';

export default function MainLayout() {
    return (
        <div className="flex min-h-screen bg-[#EFF2FB] dark:bg-[#151824]">
            <Sidebar />

            <div className="flex-1 flex flex-col">
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}