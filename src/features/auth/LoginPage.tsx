import AuthLayout from '../../components/layout/AuthLayout';
import LoginForm from './components/LoginForm';

/* ================================================================
 *  LoginPage — Trang đăng nhập PayFlow
 *  Kết hợp AuthLayout (2-cột) + LoginForm
 * ================================================================ */
export default function LoginPage() {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
