import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../stores/authStore';

/**
 * Component bảo vệ đường dẫn (ProtectedRoute)
 * - Nếu chưa đăng nhập (không có token trong store) -> redirect về /login
 * - Nếu đã đăng nhập -> render các route con (Outlet)
 */
export default function ProtectedRoute() {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}
