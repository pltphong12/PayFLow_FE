import type { AxiosResponse } from 'axios';
import apiClient from '../../../lib/axios';
import type { ApiResponse } from '../../../types/api.types';
import type { AuthResponse, LoginRequest } from '../../../types/auth.types';
/* ================================================================
 *  Auth API Service
 * ================================================================ */
/**
 * Gọi API đăng nhập.
 * POST /auth/login
 */
export async function login(
    data: LoginRequest,
): Promise<AxiosResponse<ApiResponse<AuthResponse>>> {
    return apiClient.post<ApiResponse<AuthResponse>>('/auth/login', {
        email: data.email,
        password: data.password,
    });
}
const authApi = { login };
export default authApi;