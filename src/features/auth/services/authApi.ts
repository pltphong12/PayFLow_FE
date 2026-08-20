import type { AxiosResponse } from 'axios';
import axios from 'axios';
import apiClient from '../../../lib/axios';
import type { ApiResponse } from '../../../types/api.types';
import type {
    AuthResponse,
    LoginRequest,
    RegisterRequest,
    RegisterResponse,
    UserProfileResponse,
} from '../types/auth.types';
import { env } from '../../../config/env';

/* ================================================================
 *  Auth API Service
 * ================================================================ */

/**
 * Gọi API đăng nhập.
 * POST /auth/login
 * BE sẽ set-cookie HttpOnly refresh token tự động trong response.
 */
export async function login(
    data: LoginRequest,
): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: data.email,
        password: data.password,
    });
}

/**
 * Gọi API đăng ký tài khoản mới.
 * POST /auth/register
 */
export async function register(
    data: RegisterRequest,
): Promise<AxiosResponse<ApiResponse<RegisterResponse>>> {
    return apiClient.post<ApiResponse<RegisterResponse>>('/auth/register', {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
    });
}

/**
 * Lấy thông tin user đang đăng nhập.
 * GET /users/me
 */
export async function getCurrentUser(): Promise<AxiosResponse<ApiResponse<UserProfileResponse>>> {
    return apiClient.get<ApiResponse<UserProfileResponse>>('/users/me');
}

/**
 * Làm mới access token bằng refresh token (HttpOnly cookie).
 * POST /auth/refresh
 *
 * - Dùng axios THUẦN (không qua apiClient) để tránh vòng lặp 401.
 * - withCredentials: true → browser tự đính kèm HttpOnly cookie.
 * - Không cần gửi body — BE lấy refresh token từ cookie.
 */
export async function refreshToken(): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
    return axios.post<ApiResponse<AuthResponse>>(
        `${env.apiBaseUrl}/auth/refresh`,
        {},
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        },
    );
}

/**
 * Gọi API đăng xuất.
 * POST /auth/logout
 * BE sẽ xóa HttpOnly cookie refresh token và thu hồi session.
 */
export async function logout(): Promise<AxiosResponse<ApiResponse<null>>> {
    return apiClient.post<ApiResponse<null>>('/auth/logout');
}

const authApi = { login, register, getCurrentUser, refreshToken, logout };
export default authApi;

