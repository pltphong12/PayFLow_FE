/* ================================================================
 *  Auth Module — Type Definitions
 * ================================================================ */
/** Các vai trò người dùng trong hệ thống */
export type UserRole = 'USER' | 'MERCHANT' | 'ADMIN';
/* ---------- Request DTOs ---------- */
/** Payload gửi lên khi đăng nhập */
export interface LoginRequest {
    email: string;
    password: string;
    remember?: boolean;
}
/** Payload gửi lên khi đăng ký */
export interface RegisterRequest {
    email: string;
    password: string;
    fullName: string;
}
/* ---------- Response DTOs ---------- */
/** Thông tin cơ bản của user — dùng cho authStore (lưu client-side) */
export interface UserInfo {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role: UserRole;
}
/** Dữ liệu trả về trong `data` khi login thành công (POST /auth/login).
 *  Backend set refresh token qua HttpOnly cookie tự động — FE không nhận qua body. */
export interface AuthResponse {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
}
/** Dữ liệu trả về từ GET /users/me — khớp với backend UserProfileResponse.java */
export interface UserProfileResponse {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: string;
    createdAt: string;
}
/** Dữ liệu trả về khi đăng ký thành công (POST /auth/register) */
export interface RegisterResponse {
    id: string;
    email: string;
    fullName: string;
    role: UserRole;
    status: 'ACTIVE' | 'DISABLED';
    createdAt: string;
}