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
/* ---------- Response DTOs ---------- */
/** Thông tin cơ bản của user sau khi xác thực */
export interface UserInfo {
    id: string;
    email: string;
    fullName: string;
    avatar?: string;
    role: UserRole;
}
/** Dữ liệu trả về trong `data` khi login thành công */
export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    user: UserInfo;
}