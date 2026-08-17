import { type ReactNode } from 'react';
import { WalletOutlined } from '@ant-design/icons';

interface AuthLayoutProps {
    children: ReactNode;
}

/* ================================================================
 *  AuthLayout — Responsive 2-column auth layout
 *
 *  Design system: PayFlow (MASTER.md)
 *  Responsive: 375px / 768px / 1024px / 1440px
 *
 *  Desktop (>1024px): 2-column — branding | form
 *  Tablet  (768-1024): 2-column — narrower branding | form
 *  Mobile  (<768px):  1-column — mobile header + form only
 * ================================================================ */
export default function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="auth-wrapper">
            {/* ---- MOBILE HEADER — visible <768px only ---- */}
            <div className="auth-mobile-header">
                <div className="auth-logo__icon">
                    <WalletOutlined style={{ fontSize: 18, color: 'var(--color-on-primary)' }} />
                </div>
                <span className="auth-mobile-header__text">PayFlow</span>
            </div>

            {/* ---- LEFT PANEL — Branding (hidden on mobile) ---- */}
            <div className="auth-left">
                <div className="auth-left__grid" />
                <div className="auth-left__accent-line" />

                <div className="auth-left__content">
                    {/* Logo */}
                    <div className="auth-logo">
                        <div className="auth-logo__icon">
                            <WalletOutlined style={{ fontSize: 22, color: 'var(--color-on-primary)' }} />
                        </div>
                        <span className="auth-logo__text">PayFlow</span>
                    </div>

                    {/* Headline */}
                    <h1 className="auth-headline">
                        Nền tảng thanh toán số
                        <br />
                        <span className="auth-headline__accent">đáng tin cậy.</span>
                    </h1>

                    <p className="auth-sub-headline">
                        Quản lý ví, chuyển tiền &amp; thanh toán hóa đơn
                        <br />
                        — nhanh chóng, an toàn, minh bạch.
                    </p>

                    {/* Trust metrics */}
                    <div className="auth-metrics">
                        {trustMetrics.map((m) => (
                            <div key={m.label}>
                                <span className="auth-metric__value">{m.value}</span>
                                <span className="auth-metric__label">{m.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Security badges */}
                    <div className="auth-badges">
                        {securityBadges.map((b) => (
                            <div key={b} className="auth-badge">
                                <svg
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="var(--color-primary)"
                                    strokeWidth="2.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    aria-hidden="true"
                                >
                                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                                </svg>
                                <span>{b}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom copyright */}
                <span className="auth-left__copyright">
                    © 2026 PayFlow. All rights reserved.
                </span>
            </div>

            {/* ---- RIGHT PANEL — Form ---- */}
            <div className="auth-right">
                <div className="auth-right__container">{children}</div>
            </div>
        </div>
    );
}

/* ---------- Data ---------- */
const trustMetrics = [
    { value: '2M+', label: 'Người dùng' },
    { value: '99.9%', label: 'Uptime' },
    { value: '256-bit', label: 'Mã hoá' },
];

const securityBadges = ['PCI DSS', 'ISO 27001', 'HTTPS/TLS'];
