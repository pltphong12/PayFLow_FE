import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Form,
    Input,
    Button,
    Checkbox,
    Divider,
    Alert,
    message,
} from 'antd';
import {
    MailOutlined,
    LockOutlined,
} from '@ant-design/icons';

import authApi from '../services/authApi';
import { saveAuth } from '../../../stores/authStore';

import type { LoginRequest } from '../../../types/auth.types';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../types/api.types';

/* ================================================================
 *  LoginForm — PayFlow Login
 *
 *  Design system: PayFlow MASTER.md
 *  - Primary:  #F59E0B (Gold trust)  → focus ring
 *  - Accent:   #8B5CF6 (Purple tech) → CTA button
 *  - Font:     IBM Plex Sans
 *  - Responsive: 375px / 768px / 1024px (via CSS classes)
 *
 *  UX compliance (ux-guidelines):
 *  - autocomplete="current-password" → allow paste & password managers
 *  - Loading → success/error feedback
 *  - Proper <label> via Antd Form (not placeholder-only)
 * ================================================================ */
export default function LoginForm() {
    const [form] = Form.useForm<LoginRequest>();
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const navigate = useNavigate();

    /* ---------- Submit handler ---------- */
    const onFinish = async (values: LoginRequest) => {
        setLoading(true);
        setErrorMsg(null);

        try {
            const res = await authApi.login(values);
            const body = res.data;

            if (body.success) {
                saveAuth(body.data, values.remember);
                message.success('Đăng nhập thành công!');

                // Điều hướng theo role
                const role = body.data.user.role;
                if (role === 'USER') {
                    navigate('/wallet', { replace: true });
                } else {
                    navigate('/portal/dashboard', { replace: true });
                }
            } else {
                setErrorMsg(body.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
            }
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<ApiResponse>;
            const serverMsg = axiosErr.response?.data?.message;
            setErrorMsg(serverMsg || 'Không thể kết nối máy chủ. Vui lòng thử lại sau.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* ---- Header ---- */}
            <div style={{ marginBottom: 32 }}>
                <h2 className="login-form-header__title">Đăng nhập</h2>
                <p className="login-form-header__subtitle">
                    Nhập thông tin tài khoản để tiếp tục.
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
                    style={{ marginBottom: 24, borderRadius: 8 }}
                />
            )}

            {/* ---- Form ---- */}
            <Form
                form={form}
                name="login"
                layout="vertical"
                onFinish={onFinish}
                autoComplete="on"
                requiredMark={false}
                size="large"
            >
                {/* Email */}
                <Form.Item
                    name="email"
                    label={<span style={styles.label}>Email</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập email!' },
                        { type: 'email', message: 'Email không đúng định dạng!' },
                    ]}
                >
                    <Input
                        prefix={<MailOutlined style={styles.inputIcon} />}
                        placeholder="you@example.com"
                        autoComplete="email"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Password — autocomplete="current-password" per UX guideline */}
                <Form.Item
                    name="password"
                    label={<span style={styles.label}>Mật khẩu</span>}
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu!' },
                        { min: 6, message: 'Mật khẩu tối thiểu 6 ký tự!' },
                    ]}
                >
                    <Input.Password
                        prefix={<LockOutlined style={styles.inputIcon} />}
                        placeholder="Nhập mật khẩu"
                        autoComplete="current-password"
                        style={styles.input}
                    />
                </Form.Item>

                {/* Remember + Forgot */}
                <Form.Item style={{ marginBottom: 24 }}>
                    <div style={styles.utilRow}>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>
                                <span style={styles.checkboxLabel}>Ghi nhớ đăng nhập</span>
                            </Checkbox>
                        </Form.Item>
                        <Link to="/forgot-password" style={styles.forgotLink}>
                            Quên mật khẩu?
                        </Link>
                    </div>
                </Form.Item>

                {/* Submit — Accent/CTA color per design system */}
                <Form.Item style={{ marginBottom: 16 }}>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={loading}
                        style={styles.submitBtn}
                    >
                        Đăng nhập
                    </Button>
                </Form.Item>
            </Form>

            {/* Divider */}
            <Divider plain style={{ borderColor: '#e2e8f0', margin: '4px 0 20px' }}>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>hoặc tiếp tục với</span>
            </Divider>

            {/* Google OAuth — uses CSS class for hover/active states */}
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
                <span>Google</span>
            </button>

            {/* Register link */}
            <div style={{ textAlign: 'center', marginTop: 24 }}>
                <span style={styles.registerText}>
                    Chưa có tài khoản?{' '}
                    <Link to="/register" style={styles.registerLink}>
                        Đăng ký ngay
                    </Link>
                </span>
            </div>
        </div>
    );
}

/* ---------- Inline styles (non-responsive, token-driven) ---------- */
const styles: Record<string, React.CSSProperties> = {
    label: {
        fontSize: 13,
        fontWeight: 600,
        color: '#334155',
    },
    input: {
        borderRadius: 8,
        height: 44,
        fontSize: 15,
    },
    inputIcon: {
        color: '#94a3b8',
    },
    utilRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    checkboxLabel: {
        fontSize: 13,
        color: '#475569',
    },
    forgotLink: {
        fontSize: 13,
        fontWeight: 500,
        color: 'var(--color-accent)',
    },
    submitBtn: {
        height: 46,
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 15,
        background: 'var(--color-accent)',
        border: 'none',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    registerText: {
        fontSize: 13,
        color: '#64748b',
    },
    registerLink: {
        color: 'var(--color-accent)',
        fontWeight: 600,
    },
};
