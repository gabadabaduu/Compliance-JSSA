import { Icon } from '@iconify/react';
import { usePermissions } from '../../../hooks/usePermissions';
import Mapa from '../components/Mapa';
import PeticionProx from '../components/PeticionProx';
import PieChart from '../components/PieChart';
import UltiNorma from '../components/UltiNorma';

function SuperAdminDashboard() {
    return (
        <div className="flex flex-col items-center justify-center min-h-full p-6">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-12">
                Dashboard
            </h1>

            <div className="bg-white dark:bg-[#151824] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.5)] p-8 max-w-md">
                <div className="flex flex-col items-center text-center">
                    <Icon 
                        icon="mdi:hammer-wrench" 
                        width="64" 
                        height="64" 
                        className="text-blue-400 mb-4"
                    />
                    
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
                        Módulo en desarrollo
                    </h2>
                    
                    <p className="text-gray-600 dark:text-gray-400">
                        Estamos trabajando para traerte nuevas funcionalidades. 
                        ¡Gracias por tu paciencia!
                    </p>
                </div>
            </div>
        </div>
    );
}

function CompanyDashboard() {
    return (
        <div className="min-h-full p-6 space-y-4">

            {/* Grid principal - 2 columnas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                {/* Mapa */}
                <div className="lg:col-span-1 min-h-[320px] max-h-[390px]">
                    <Mapa />
                </div>

                {/* Columna derecha - Petición próxima + Pie chart */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    
                    {/* Petición próxima a vencer */}
                    <div className="flex-1 min-h-[150px] max-h-[270px]">
                        <PeticionProx />
                    </div>

                    {/* Pie Chart - Peticiones */}
                    <div className="flex-1 min-h-[150px] max-h-[170px]">
                        <PieChart />
                    </div>
                </div>
            </div>

            {/* Fila inferior - Última normativa */}
            <div className="min-h-[140px]">
                <UltiNorma />
            </div>
        </div>
    );
}

export default function DashboardPage() {
    const { isSuperAdmin } = usePermissions();

    return isSuperAdmin ? <SuperAdminDashboard /> : <CompanyDashboard />;
}