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
