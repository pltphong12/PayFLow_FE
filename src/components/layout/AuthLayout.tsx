import { type ReactNode } from 'react';
import heroImg from '../../assets/payflow_brand_logo.png';

interface AuthLayoutProps {
    children: ReactNode;
    headline?: string;
    subHeadline?: string;
}

/* ================================================================
 *  AuthLayout — Responsive 2-column Auth Layout (Stitch Design System)
 *
 *  Left: Modern Financial Hero, Local Assets Illustration & Badges
 *  Right: Authentication Form (Login / Register)
 * ================================================================ */
export default function AuthLayout({
    children,
    headline = 'Thanh toán an toàn, bảo mật tuyệt đối',
    subHeadline = 'Trải nghiệm ứng dụng tài chính thông minh, bảo mật cấp độ ngân hàng với PayFlow.',
}: AuthLayoutProps) {
    return (
        <div className="auth-wrapper">
            {/* ---- LEFT PANEL — Branding & Illustration ---- */}
            <div className="auth-left">
                <div className="auth-left__grid" />

                <div className="auth-left__content">
                    {/* Main Headline */}
                    <h1 className="auth-headline">{headline}</h1>

                    {/* Subtitle */}
                    <p className="auth-sub-headline">{subHeadline}</p>

                    {/* Illustration Card from local assets */}
                    <div className="auth-left__illustration">
                        <img
                            src={heroImg}
                            alt="PayFlow Secure Digital Banking"
                            loading="eager"
                        />
                    </div>
                </div>

                {/* Footer Copyright */}
                <div className="auth-left__copyright">
                    © 2026 PayFlow Inc. Tất cả các quyền được bảo lưu.
                </div>
            </div>

            {/* ---- RIGHT PANEL — Form Area ---- */}
            <div className="auth-right">
                <div className="auth-right__container">{children}</div>
            </div>
        </div>
    );
}
