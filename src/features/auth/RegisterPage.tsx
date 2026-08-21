import AuthLayout from '../../components/layout/AuthLayout';
import RegisterForm from './components/RegisterForm';

/* ================================================================
 *  RegisterPage — Trang đăng ký PayFlow
 *  Kết hợp AuthLayout (2-cột) + RegisterForm
 * ================================================================ */
export default function RegisterPage() {
  return (
    <AuthLayout
      headline="Khởi đầu thanh toán thông minh cùng PayFlow"
      subHeadline="Mở tài khoản ví điện tử bảo mật chuẩn ngân hàng chỉ trong 1 phút, hoàn toàn miễn phí."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
