import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore';

import LoginPage from './modules/auth/pages/Login';
import SignupPage from './modules/auth/pages/Signup';
import ForgotPasswordPage from './modules/auth/pages/ForgotPassword';
import ResetPasswordPage from './modules/auth/pages/ResetPassword';

import MainLayout from './components/layout/MainLayout/MainLayout';

import DashboardPage from './modules/dashboard/pages/DashboardPage';
import RATPage from './modules/rat/pages/RATPage';
import HabeasDataPage from './modules/habeasdata/pages/HabeasDataPage';
import EPIDPage from './modules/epid/pages/EPIDPage';
import NormogramaPage from './modules/normograma/pages/NormogramaPage';
import AjustesPage from './modules/ajustes/pages/AjustesPage';
import UsuarioPage from './modules/usuario/pages/UsuarioPage';
import MatrizRiesgoPage from './modules/matrizriesgo/pages/MatrizRiesgoPage';

import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const queryClient = new QueryClient();

function App() {
    const { checkAuth } = useAuthStore()

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
                        <Route path="dashboard" element={<DashboardPage />} />
                        <Route path="epid" element={<EPIDPage />} />
                        <Route path="habeasdata" element={<HabeasDataPage />} />
                        <Route path="normograma" element={<NormogramaPage />} />
                        <Route path="rat" element={<RATPage />} />
                        <Route path="ajustes" element={<AjustesPage />} />
                        <Route path="usuario" element={<UsuarioPage />} />
                        <Route path="matrizriesgo" element={<MatrizRiesgoPage />} />

                    </Route>

                    {/* Redirecciones */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                    <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;