import axios from 'axios';
import { env } from '../config/env';

/**
 * Axios instance dùng chung cho toàn bộ ứng dụng.
 * - Base URL lấy từ config/env.ts (trỏ API Gateway :8080)
 * - Tự động đính kèm Access Token vào header Authorization
 */
const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/* ---------- Request Interceptor ---------- */
apiClient.interceptors.request.use(
    (config) => {
        const token =
            localStorage.getItem('access_token') ??
            sessionStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error),
);

/* ---------- Response Interceptor ---------- */
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Có thể mở rộng xử lý 401 → refresh token ở đây
        return Promise.reject(error);
    },
);

export default apiClient;