import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react'
import { useAuthStore } from './stores/authStore';
import LoginPage from './modules/auth/pages/LoginPage';
import SignupPage from './modules/auth/pages/SignupPage';
import ChangePasswordPage from './modules/auth/pages/ChangePasswordPage';
import ForgotPasswordPage from './modules/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from './modules/auth/pages/ResetPasswordPage';
import DashboardPage from './modules/dashboard/pages/DashboardPage';
import RATGraphPage from './modules/rat/pages/RATGraphPage';
import UserManagementPage from './modules/admin/pages/UserManagementPage'; // ← DEBE ESTAR
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import SuperAdminRoute from './components/SuperAdminRoute'; // ← DEBE ESTAR

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

                    {/* Rutas protegidas normales */}
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

                    {/* ← ESTA RUTA DEBE ESTAR - Solo para SuperAdmin */}
                    <Route
                        path="/admin/users"
                        element={
                            <SuperAdminRoute>
                                <UserManagementPage />
                           </SuperAdminRoute>
                        }
                    />

                    {/* Redirigir / al login */}
                    <Route path="/" element={<Navigate to="/login" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;