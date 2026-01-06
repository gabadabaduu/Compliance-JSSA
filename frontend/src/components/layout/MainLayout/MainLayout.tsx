import { Outlet } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import './MainLayout.css';

export default function MainLayout() {
    return (
        <div className="main-layout">
            <Sidebar />

            <div className="main-content">
                <main className="page-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}