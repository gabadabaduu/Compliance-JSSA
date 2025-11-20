import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';

export default function DashboardPage() {
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard-metrics'],
        queryFn: dashboardApi.getMetrics,
    });

    if (isLoading) return <div>Cargando...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-8">📈 Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard title="Entidades" value={data?.totalEntities || 0} icon="📊" />
                <MetricCard title="Solicitudes" value={data?.totalRequests || 0} icon="📋" />
                <MetricCard title="Pendientes" value={data?.pendingRequests || 0} icon="⏳" />
                <MetricCard title="Alertas SLA" value={data?.slaAlerts || 0} icon="⚠️" />
            </div>
        </div>
    );
}

function MetricCard({ title, value, icon }: { title: string; value: number; icon: string }) {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="text-4xl mb-2">{icon}</div>
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-gray-600">{title}</div>
        </div>
    );
}