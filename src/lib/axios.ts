import axios, { type AxiosRequestConfig } from 'axios';
import { env } from '../config/env';

/* ================================================================
 *  API Client — Axios instance với auto token refresh
 *
 *  withCredentials: true → browser tự gửi HttpOnly cookie (refresh token)
 *  khi gọi bất kỳ request nào, kể cả cross-origin (cần BE cho phép CORS).
 *
 *  Luồng xử lý 401:
 *  1. Request nhận 401 → gọi POST /auth/refresh (browser tự gửi cookie)
 *  2. Nếu đang refresh → queue request lại, chờ token mới
 *  3. Thành công → lưu access token mới → retry tất cả request trong queue
 *  4. Thất bại    → clearAuth → redirect /login
 *
 *  Tránh vòng lặp:
 *  - refreshToken() dùng axios thuần (không qua apiClient)
 *  - Request đã retry được đánh dấu _retry=true
 * ================================================================ */

const apiClient = axios.create({
    baseURL: env.apiBaseUrl,
    timeout: 15_000,
    withCredentials: true,              // Browser tự gửi HttpOnly cookie
    headers: { 'Content-Type': 'application/json' },
});

/* ---- Trạng thái refresh (module-level singleton) ---- */
let isRefreshing = false;
type PendingItem = { resolve: (token: string) => void; reject: (err: unknown) => void };
let pendingQueue: PendingItem[] = [];

function drainQueue(newToken: string) {
    pendingQueue.forEach(({ resolve }) => resolve(newToken));
    pendingQueue = [];
}

function rejectQueue(err: unknown) {
    pendingQueue.forEach(({ reject }) => reject(err));
    pendingQueue = [];
}

/* ================================================================
 *  Request Interceptor — Gắn Bearer access token
 * ================================================================ */
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

/* ================================================================
 *  Response Interceptor — 401 → refresh + retry
 * ================================================================ */
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        // Kiểm tra xem request có phải gửi tới endpoint Auth (login, register, refresh, logout) hay không
        const url = originalRequest?.url ?? '';
        const isAuthEndpoint =
            url.includes('/auth/login') ||
            url.includes('/auth/register') ||
            url.includes('/auth/refresh') ||
            url.includes('/auth/logout');

        // Chỉ xử lý 401 cho các API nghiệp vụ, không áp dụng cho các endpoint Auth hoặc request đã retry
        if (error.response?.status !== 401 || originalRequest._retry || isAuthEndpoint) {
            return Promise.reject(error);
        }

        // Nếu đang refresh → queue lại, chờ token mới
        if (isRefreshing) {
            return new Promise<string>((resolve, reject) => {
                pendingQueue.push({ resolve, reject });
            }).then((newToken) => {
                if (originalRequest.headers) {
                    (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newToken}`;
                }
                originalRequest._retry = true;
                return apiClient(originalRequest);
            });
        }

        // Bắt đầu refresh
        originalRequest._retry = true;
        isRefreshing = true;

        try {
            // Dynamic import để tránh circular dependency
            const { refreshToken } = await import('../features/auth/services/authApi');
            const res = await refreshToken();   // Không cần tham số — browser gửi cookie tự động

            if (!res.data.success) throw new Error('Refresh token không hợp lệ');

            const newAccessToken = res.data.data.accessToken;

            // Lưu access token mới
            const { updateAccessToken } = await import('../stores/authStore');
            updateAccessToken(newAccessToken);

            // Cập nhật header request gốc
            if (originalRequest.headers) {
                (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${newAccessToken}`;
            }

            // Notify các request đang chờ
            drainQueue(newAccessToken);

            // Retry request gốc
            return apiClient(originalRequest);
        } catch (refreshErr) {
            rejectQueue(refreshErr);
            const { clearAuth } = await import('../stores/authStore');
            clearAuth();
            // Chỉ redirect nếu không ở sẵn các trang login/register
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.replace('/login');
            }
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    },
);

export default apiClient;