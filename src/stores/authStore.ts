import type { AuthResponse, UserInfo } from '../types/auth.types';
/* ================================================================
 *  Auth Store — Token & User management utilities
 *  Sử dụng localStorage (remember) / sessionStorage (session-only)
 * ================================================================ */
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';
/** Lấy storage phù hợp dựa vào cờ "Ghi nhớ đăng nhập" */
function getStorage(remember?: boolean): Storage {
    return remember ? localStorage : sessionStorage;
}
/** Lưu thông tin xác thực sau khi login thành công */
export function saveAuth(auth: AuthResponse, remember?: boolean): void {
    const storage = getStorage(remember);
    storage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    storage.setItem(REFRESH_TOKEN_KEY, auth.refreshToken);
    storage.setItem(USER_INFO_KEY, JSON.stringify(auth.user));
    // Luôn lưu access_token ở localStorage để interceptor dùng chung
    if (!remember) {
        localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
    }
}
/** Xoá toàn bộ thông tin xác thực (logout) */
export function clearAuth(): void {
    [localStorage, sessionStorage].forEach((s) => {
        s.removeItem(ACCESS_TOKEN_KEY);
        s.removeItem(REFRESH_TOKEN_KEY);
        s.removeItem(USER_INFO_KEY);
    });
}
/** Lấy access token đang lưu */
export function getAccessToken(): string | null {
    return (
        localStorage.getItem(ACCESS_TOKEN_KEY) ??
        sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
}
/** Lấy thông tin user đang lưu */
export function getUser(): UserInfo | null {
    const raw =
        localStorage.getItem(USER_INFO_KEY) ??
        sessionStorage.getItem(USER_INFO_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as UserInfo;
    } catch {
        return null;
    }
}
/** Kiểm tra đã đăng nhập chưa */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}