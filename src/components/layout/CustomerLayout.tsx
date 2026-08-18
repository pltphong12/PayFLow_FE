import { type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    WalletOutlined,
    QrcodeOutlined,
    HistoryOutlined,
    UserOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { clearAuth, getUser } from '../../stores/authStore';

/* ================================================================
 *  CustomerLayout — Mobile-first wallet app layout
 *
 *  Design system: PayFlow MASTER.md
 *  - Mobile (<768px): Bottom Navigation Bar cố định + content scrollable
 *  - Desktop (>=768px): Header đơn giản + centered content (max-width 480px)
 *  - Bottom nav tabs: Ví · Quét QR · Lịch sử · Tài khoản
 *  - Safe-area-inset cho iPhone notch
 * ================================================================ */

interface CustomerLayoutProps {
    children: ReactNode;
}

interface NavTab {
    key: string;
    label: string;
    icon: ReactNode;
    path: string;
    disabled?: boolean;
}

const NAV_TABS: NavTab[] = [
    { key: 'wallet', label: 'Ví', icon: <WalletOutlined />, path: '/wallet' },
    { key: 'qr-scan', label: 'Quét QR', icon: <QrcodeOutlined />, path: '/qr-scan', disabled: true },
    { key: 'history', label: 'Lịch sử', icon: <HistoryOutlined />, path: '/wallet', disabled: true },
    { key: 'account', label: 'Tài khoản', icon: <UserOutlined />, path: '/profile', disabled: true },
];

export default function CustomerLayout({ children }: CustomerLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();

    const handleLogout = () => {
        clearAuth();
        navigate('/login', { replace: true });
    };

    return (
        <div className="customer-wrapper">
            {/* ---- DESKTOP HEADER (>=768px) ---- */}
            <header className="customer-header">
                <div className="customer-header__inner">
                    <div className="customer-header__brand">
                        <div className="customer-header__logo-icon">
                            <WalletOutlined style={{ fontSize: 16, color: 'var(--color-on-primary)' }} />
                        </div>
                        <span className="customer-header__logo-text">PayFlow</span>
                    </div>
                    <div className="customer-header__right">
                        <span className="customer-header__user">
                            {user?.fullName ?? 'Người dùng'}
                        </span>
                        <button
                            type="button"
                            className="customer-header__logout"
                            onClick={handleLogout}
                            title="Đăng xuất"
                        >
                            <LogoutOutlined />
                        </button>
                    </div>
                </div>
            </header>

            {/* ---- MOBILE HEADER (<768px) ---- */}
            <div className="customer-mobile-header">
                <div className="customer-mobile-header__brand">
                    <div className="customer-header__logo-icon">
                        <WalletOutlined style={{ fontSize: 14, color: 'var(--color-on-primary)' }} />
                    </div>
                    <span className="customer-mobile-header__text">PayFlow</span>
                </div>
                <span className="customer-mobile-header__greeting">
                    Xin chào, {user?.fullName?.split(' ').pop() ?? 'bạn'}
                </span>
            </div>

            {/* ---- MAIN CONTENT ---- */}
            <main className="customer-main">
                <div className="customer-main__container">
                    {children}
                </div>
            </main>

            {/* ---- BOTTOM NAVIGATION (<768px only) ---- */}
            <nav className="customer-bottom-nav">
                {NAV_TABS.map((tab) => {
                    const isActive = location.pathname === tab.path && !tab.disabled;
                    return (
                        <button
                            key={tab.key}
                            type="button"
                            className={`customer-bottom-nav__tab${isActive ? ' customer-bottom-nav__tab--active' : ''}${tab.disabled ? ' customer-bottom-nav__tab--disabled' : ''}`}
                            onClick={() => {
                                if (!tab.disabled) navigate(tab.path);
                            }}
                            disabled={tab.disabled}
                        >
                            <span className="customer-bottom-nav__icon">{tab.icon}</span>
                            <span className="customer-bottom-nav__label">{tab.label}</span>
                        </button>
                    );
                })}
            </nav>
        </div>
    );
}
