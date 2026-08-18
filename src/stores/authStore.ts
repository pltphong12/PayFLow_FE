import type { AuthResponse, UserInfo } from '../features/auth/types/auth.types';

/* ================================================================
 *  Auth Store — Token & User management utilities
 *
 *  Chiến lược lưu token:
 *  - accessToken  → localStorage (interceptor đọc để gắn header)
 *  - refreshToken → HttpOnly Cookie do BE set qua Set-Cookie header
 *                   FE KHÔNG đọc/ghi cookie này trực tiếp.
 *                   Browser tự gửi cookie khi withCredentials=true.
 *  - userInfo     → localStorage hoặc sessionStorage (theo remember)
 * ================================================================ */

const ACCESS_TOKEN_KEY = 'access_token';
const USER_INFO_KEY    = 'user_info';

/* ----------------------------------------------------------------
 *  Storage helpers
 * ---------------------------------------------------------------- */

function getStorage(remember?: boolean): Storage {
    return remember ? localStorage : sessionStorage;
}

/* ----------------------------------------------------------------
 *  Public API
 * ---------------------------------------------------------------- */

/** Lưu auth sau khi login thành công.
 *  - accessToken → localStorage (interceptor dùng chung)
 *  - userInfo    → localStorage (remember) hoặc sessionStorage
 *  - refreshToken: BE đã set qua HttpOnly cookie, FE không cần xử lý. */
export function saveAuth(auth: AuthResponse, user: UserInfo, remember?: boolean): void {
    // Access token luôn vào localStorage để interceptor đọc được
    localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);

    // User info theo remember
    const storage = getStorage(remember);
    storage.setItem(USER_INFO_KEY, JSON.stringify(user));
}

/** Cập nhật access token mới sau khi refresh thành công. */
export function updateAccessToken(newToken: string): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken);
}

/** Xóa toàn bộ auth client-side (logout).
 *  Cookie HttpOnly sẽ bị xóa bởi BE khi gọi endpoint logout. */
export function clearAuth(): void {
    [localStorage, sessionStorage].forEach((s) => {
        s.removeItem(ACCESS_TOKEN_KEY);
        s.removeItem(USER_INFO_KEY);
    });
}

/** Lấy access token hiện tại. */
export function getAccessToken(): string | null {
    return (
        localStorage.getItem(ACCESS_TOKEN_KEY) ??
        sessionStorage.getItem(ACCESS_TOKEN_KEY)
    );
}

/** Lấy user info đang lưu. */
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

/** Kiểm tra đã đăng nhập chưa. */
export function isAuthenticated(): boolean {
    return !!getAccessToken();
}