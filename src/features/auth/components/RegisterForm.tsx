import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Divider,
    Alert,
    message,
} from 'antd';
import {
    MailOutlined,
    LockOutlined,
    UserOutlined,
} from '@ant-design/icons';
import payflowLogo from '../../../assets/payflow_brand_logo.png';

import authApi from '../services/authApi';
import { saveAuth } from '../../../stores/authStore';

import type { RegisterRequest } from '../types/auth.types';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../types/api.types';

/** Form values bao gồm cả confirmPassword (chỉ dùng phía client) */
interface RegisterFormValues extends RegisterRequest {
    confirmPassword: string;
}

/* ================================================================
 *  RegisterForm — PayFlow Registration
 *  Design System: PayFlow Financial Core (Stitch)
 * ================================================================ */
export default function RegisterForm() {
    const [form] = Form.useForm<RegisterFormValues>();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    /* ---------- Submit handler ---------- */
    const onFinish = async (values: RegisterFormValues) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            /* Bước 1: Gọi API đăng ký */
            const regRes = await authApi.register({
                email: values.email,
                password: values.password,
                fullName: values.fullName,
            });
            const regBody = regRes.data;

            if (!regBody.success) {
                setErrorMsg(regBody.message || 'Đăng ký thất bại. Vui lòng thử lại.');
                return;
            }

            /* Bước 2: Đăng ký thành công → tự động login ngầm */
            let authData;
            try {
                const loginRes = await authApi.login({
                    email: values.email,
                    password: values.password,
                });
                const loginBody = loginRes.data;

                if (!loginBody.success) {
                    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                    navigate('/login', { replace: true });
                    return;
                }
                authData = loginBody.data;
            } catch {
                message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                navigate('/login', { replace: true });
                return;
            }

            /* Bước 3: Lưu tạm access token NGAY để interceptor dùng được */
            localStorage.setItem('access_token', authData.accessToken);

            /* Bước 4: Gọi GET /users/me lấy thông tin user đầy đủ */
            let userProfile;
            try {
                const userRes = await authApi.getCurrentUser();
                if (!userRes.data.success) {
                    message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                    localStorage.removeItem('access_token');
                    navigate('/login', { replace: true });
                    return;
                }
                userProfile = userRes.data.data;
            } catch {
                message.success('Đăng ký thành công! Vui lòng đăng nhập.');
                localStorage.removeItem('access_token');
                navigate('/login', { replace: true });
                return;
            }

            /* Bước 5: Lưu đầy đủ auth + user vào store */
            const userInfo = {
                id: userProfile.id,
                email: userProfile.email,
                fullName: userProfile.fullName,
                role: userProfile.role,
            };
            saveAuth(authData, userInfo, false);
            message.success('Đăng ký thành công! Chào mừng bạn đến với PayFlow.');

            /* Bước 6: Điều hướng vào /wallet */
            navigate('/wallet', { replace: true });
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<ApiResponse>;
            const status = axiosErr.response?.status;
            const serverMsg = axiosErr.response?.data?.message;

            if (status === 409) {
                setErrorMsg('Email này đã được đăng ký. Vui lòng đăng nhập hoặc dùng email khác.');
            } else {
                setErrorMsg(serverMsg || 'Không thể kết nối máy chủ. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ---- Brand Header ---- */}
            <div className="auth-form-brand">
                <img
                    src={payflowLogo}
                    alt="PayFlow Logo"
                    style={{
                        height: 180,
                        width: 'auto',
                        objectFit: 'contain',
                        margin: '-20px 0 -8px',
                    }}
                />
                <h2 className="auth-form-brand__title">Tạo tài khoản mới</h2>
                <p className="auth-form-brand__subtitle">
                    Đăng ký ví điện tử PayFlow nhanh chóng chỉ trong 1 phút
                </p>
            </div>

            {/* ---- Error alert ---- */}
            {errorMsg && (
                <Alert
                    message={errorMsg}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setErrorMsg(null)}
                    style={{ marginBottom: 20, borderRadius: 8 }}
                />
            )}

            {/* ---- Form ---- */}
            <Form
                form={form}
                name="register"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="on"
                requiredMark={false}
                size="large"
            >
                {/* Họ tên */}
                <Form.Item
                    name="fullName"
                    label={<span style={styles.label}>Họ và tên</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập họ và tên!' },
                        { min: 2, message: 'Họ tên tối thiểu 2 ký tự!' },
                    ]}
                >
                    <Input
                        prefix={<UserOutlined style={styles.inputIcon} />}
                        placeholder="Ví dụ: Nguyễn Văn An"
                        autoComplete="name"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Email */}
                <Form.Item
                    name="email"
                    label={<span style={styles.label}>Địa chỉ Email</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={styles.inputIcon} />}
                        placeholder="tenban@email.com"
                        autoComplete="email"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Mật khẩu */}
                <Form.Item
                    name="password"
                    label={<span style={styles.label}>Mật khẩu</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 8, message: 'Mật khẩu tối thiểu 8 ký tự!' },
                    ]}
                    extra={
                        <span style={{ fontSize: 12, color: '#737686' }}>
                            Tối thiểu 8 ký tự để đảm bảo an toàn tài khoản
                        </span>
                    }
                >
                    <Input.Password
                        prefix={<LockOutlined style={styles.inputIcon} />}
                        placeholder="Nhập mật khẩu an toàn"
                        autoComplete="new-password"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Xác nhận mật khẩu */}
                <Form.Item
                    name="confirmPassword"
                    label={<span style={styles.label}>Xác nhận mật khẩu</span>}
                    dependencies={['password']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận lại mật khẩu!' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('password') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(
                                    new Error('Mật khẩu xác nhận không trùng khớp!'),
                                );
                            },
                        }),
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={styles.inputIcon} />}
                        placeholder="Nhập lại mật khẩu ở trên"
                        autoComplete="new-password"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Submit */}
                <Form.Item style={{ marginBottom: 16, marginTop: 8 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={styles.submitBtn}
                    >
                        Tạo tài khoản PayFlow
                    </Button>
                </Form.Item>
            </Form>

            {/* Divider */}
            <Divider plain style={{ borderColor: '#e2e8f0', margin: '8px 0 20px' }}>
                <span style={{ fontSize: 13, color: '#737686' }}>hoặc đăng ký bằng</span>
            </Divider>

            {/* Google OAuth Button */}
            <button type="button" className="login-social-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                        fill="#4285F4"
                    />
                    <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                    />
                    <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                    />
                    <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                    />
                </svg>
                <span>Đăng ký với Google</span>
            </button>

            {/* Login Link */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <span style={styles.registerText}>
                    Đã có tài khoản PayFlow?{' '}
                    <Link to="/login" style={styles.registerLink}>
                        Đăng nhập ngay
                    </Link>
                </span>
            </div>
        </div>
    );
}

/* ---------- Inline styles (token-driven) ---------- */
const styles: Record<string, React.CSSProperties> = {
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#1a1c1e',
    },
    input: {
        borderRadius: 8,
        height: 44,
        fontSize: 14,
        borderColor: '#e2e8f0',
    },
    inputIcon: {
        color: '#737686',
        marginRight: 4,
    },
    submitBtn: {
        height: 46,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 15,
        backgroundColor: '#0055d4',
        border: 'none',
        boxShadow: '0 4px 12px rgba(0, 85, 212, 0.25)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'Inter', sans-serif",
    },
    registerText: {
        fontSize: 13,
        color: '#424654',
    },
    registerLink: {
        color: '#0055d4',
        fontWeight: 600,
        textDecoration: 'none',
    },
};
