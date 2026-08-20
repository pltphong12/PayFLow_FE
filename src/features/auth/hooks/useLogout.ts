import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import authApi from '../services/authApi';
import { clearAuth } from '../../../stores/authStore';

/**
 * Custom hook xử lý Đăng xuất (Logout)
 * - Gọi API POST /auth/logout (hủy session/cookie phía backend)
 * - Xóa token và user info ở localStorage/sessionStorage
 * - Thông báo toast cho user
 * - Redirect về trang /login
 */
export function useLogout() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogout = async () => {
        setLoading(true);
        try {
            await authApi.logout();
        } catch (error) {
            // Dù API BE gặp lỗi hoặc 401, client vẫn chủ động xóa local auth để bảo mật
            console.warn('Lỗi khi gọi API logout BE:', error);
        } finally {
            clearAuth();
            setLoading(false);
            message.success('Đã đăng xuất thành công');
            navigate('/login', { replace: true });
        }
    };

    return { handleLogout, loading };
}
