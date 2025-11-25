import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './stores/authStore'; // ← Importar
import LoginPage from './modules/auth/pages/LoginPage';
import SignupPage from './modules/auth/pages/SignupPage';
import ChangePasswordPage from './modules/auth/pages/ChangePasswordPage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import RATGraphPage from './modules/rat/pages/RATGraphPage';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

const queryClient = new QueryClient();

function App() {
    const { checkAuth } = useAuthStore() // ← Obtener checkAuth

    // Verificar autenticación al cargar la app
    useEffect(() => {
        checkAuth()
    }, [checkAuth])
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    {/* Rutas públicas (solo accesibles si NO estás logueado) */}
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

                    {/* Reset password puede ser accedido estando logueado o no */}
                    <Route path="/reset-password" element={<ResetPasswordPage />} />

                    {/* Rutas protegidas (solo accesibles si ESTÁS logueado) */}
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/change-password"
                        element={
                            <ProtectedRoute>
                                <ChangePasswordPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/rat/graph"
                        element={
                            <ProtectedRoute>
                                <RATGraphPage />
                            </ProtectedRoute>
                        }
                    />

                    {/* Redirigir / según estado de autenticación */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );  
}

export default App;