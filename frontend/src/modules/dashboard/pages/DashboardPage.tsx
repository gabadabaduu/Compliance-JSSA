import './DashboardPage.css'

export default function DashboardPage() {
    return (
        <div className="dashboard-page">
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="dashboard-card">
                <h2 className="dashboard-card-title">Bienvenido a Compliance JSSA</h2>
                <p className="dashboard-card-text">
                    Selecciona un módulo del menú lateral para comenzar.
                </p>
            </div>
        </div>
    )
}