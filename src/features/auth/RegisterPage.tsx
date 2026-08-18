import AuthLayout from '../../components/layout/AuthLayout';
import RegisterForm from './components/RegisterForm';

/* ================================================================
 *  RegisterPage — Trang đăng ký PayFlow
 *  Kết hợp AuthLayout (2-cột) + RegisterForm
 * ================================================================ */
export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
