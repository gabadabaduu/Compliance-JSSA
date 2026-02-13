import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useAuthStore, setQueryClientRef } from './stores/authStore'

// Auth pages (públicas)
import LoginPage from './modules/auth/pages/Login'
import SignupPage from './modules/auth/pages/Signup'
import ForgotPasswordPage from './modules/auth/pages/ForgotPassword'
import ResetPasswordPage from './modules/auth/pages/ResetPassword'

// Layout
import MainLayout from './components/layout/MainLayout/MainLayout'

// Module pages
import DashboardPage from './modules/dashboard/pages/DashboardPage'
import HabeasDataPage from './modules/habeasdata/pages/HabeasDataPage'
import EPIDPage from './modules/epid/pages/EPIDPage'
import NormativaPage from './modules/cumplimiento/normativa/pages/NormativaPage'
import SancionPage from './modules/cumplimiento/sancion/pages/SancionPage'
import AjustesPage from './modules/ajustes/pages/AjustesPage'
import UsuarioPage from './modules/usuario/pages/UsuarioPage'
import MatrizRiesgoPage from './modules/matrizriesgo/pages/MatrizRiesgoPage'
import ResolutionPage from './modules/cumplimiento/resolucion/pages/ResolutionPage'
import ContractsPage from  './modules/rat/contracts/pages/ContractsPage'
import DataPage from './modules/rat/data/pages/DataPage'
import EntitiesPage from './modules/rat/entities/pages/EntitiesPage'
import RatPage from './modules/rat/Rat/pages/RatPage'
import DataFlow from './modules/rat/Rat/DataFlow/Dataflow'
// Route components
import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'
import ModuleRoute from './components/ModuleRoute'
import { useTheme } from './hooks/useTheme'


const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
})
setQueryClientRef(queryClient)

function App() {
    const { checkAuth } = useAuthStore()
    useTheme() 
    useEffect(() => {
        checkAuth()
    }, [checkAuth])

    return (
        <QueryClientProvider client={queryClient}>

            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas */}
                    <Route
                        path="/login"
                        element={
                            <PublicRoute>
                                <LoginPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/signup"
                        element={
                            <PublicRoute>
                                <SignupPage />
                            </PublicRoute>
                        }
                    />
                    <Route
                        path="/forgot-password"
                        element={
                            <PublicRoute>
                                <ForgotPasswordPage />
                            </PublicRoute>
                        }
                    />
                    <Route path="/reset-password" element={<ResetPasswordPage />} />
                    

                    {/* Rutas protegidas CON Layout */}
                    <Route
                        path="/app"
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >

                        {/* Dashboard */}
                        <Route
                            path="dashboard"
                            element={
                                <ModuleRoute requiredAccess="accessDashboard">
                                    <DashboardPage />
                                </ModuleRoute>
                            }
                        />

                        {/* EPID */}
                        <Route
                            path="epid"
                            element={
                                <ModuleRoute requiredAccess="accessEpid">
                                    <EPIDPage />
                                </ModuleRoute>
                            }
                        />

                        {/* RAT */}
                        <Route
                            path="rat"
                            element={
                                <ModuleRoute requiredAccess="accessRat">
                                    <RatPage />
                                </ModuleRoute>
                            }
                        />
                        <Route
                            path="rat/dataflow"
                            element={
                                <ModuleRoute requiredAccess="accessRat">
                                    <DataFlow />
                                </ModuleRoute>
                            }
                        />
                        <Route
                            path="rat/contracts"
                            element={
                                <ModuleRoute requiredAccess="accessRat">
                                    <ContractsPage />
                                </ModuleRoute>
                            }
                        />
                        <Route
                            path="rat/data"
                            element={
                                <ModuleRoute requiredAccess="accessRat">
                                    <DataPage />
                                </ModuleRoute>
                            }
                        />
                        <Route
                            path="rat/entities"
                            element={
                                <ModuleRoute requiredAccess="accessRat">
                                    <EntitiesPage />
                                </ModuleRoute>
                            }
                        />

                        {/* Normativa */}
                        <Route
                            path="normativa"
                            element={
                                <ProtectedRoute>
                                    <NormativaPage />
                                </ProtectedRoute>
                            }
                        />
                        {/* Habeas Data */}
                        <Route
                            path="habeasdata"
                            element={
                                <ModuleRoute requiredAccess="accessHabeasdata">
                                    <HabeasDataPage />
                                </ModuleRoute>
                            }
                        />

                        {/* Resolución */}
                        <Route
                            path="resolucion"
                            element={
                                <ProtectedRoute>
                                    <ResolutionPage />
                                </ProtectedRoute>
                                }
                        />

                        {/* Sancion */}
                        <Route
                            path="sancion"
                            element={
                                <ProtectedRoute>
                                    <SancionPage />
                                </ProtectedRoute>
                            }
                        />

                        {/* Matriz de Riesgo */}
                        <Route
                            path="matrizriesgo"
                            element={
                                <ModuleRoute requiredAccess="accessMatrizriesgo">
                                    <MatrizRiesgoPage />
                                </ModuleRoute>
                            }
                        />

                        {/* Ajustes */}
                        <Route
                            path="ajustes"
                            element={
                                <ModuleRoute requiredAccess="accessAjustes">
                                    <AjustesPage />
                                </ModuleRoute>
                            }
                        />

                        {/* Usuario - tiene su propia lógica interna de rol */}
                        <Route
                            path="usuario"
                            element={
                                <ModuleRoute requiredAccess="accessUsuario">
                                    <UsuarioPage />
                                </ModuleRoute>
                            }
                        />
                    </Route>

                    {/* Redirecciones */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    )
}

export default App