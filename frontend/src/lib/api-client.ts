import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para JWT
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Error handler
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);


async function request<T>(config: AxiosRequestConfig): Promise<T> {
    const response: AxiosResponse<T> = await axiosInstance.request(config);
    return response.data;
}

export const apiClient = {
    get: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'GET', url }),

    post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'POST', url, data }),

    put: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'PUT', url, data }),

    delete: <T>(url: string, config?: AxiosRequestConfig) =>
        request<T>({ ...config, method: 'DELETE', url }),
};
