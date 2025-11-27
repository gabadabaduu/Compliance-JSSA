    import { apiClient } from '@/lib/api-client';
    import { LoginRequest, RegisterRequest, AuthResponse } from '@/types';

    export const authApi = {
        login: (data: LoginRequest) =>
            apiClient.post<AuthResponse>('/auth/login', data),

        register: (data: RegisterRequest) =>
            apiClient.post<AuthResponse>('/auth/register', data),

        logout: () =>
            apiClient.post('/auth/logout', {}),
    };
