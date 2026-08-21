import { type ReactNode } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Popconfirm, Tooltip } from 'antd';
import {
    HomeOutlined,
    WalletOutlined,
    TagOutlined,
    UserOutlined,
    BellOutlined,
    LogoutOutlined,
} from '@ant-design/icons';
import { getUser } from '../../stores/authStore';
import { useLogout } from '../../features/auth/hooks/useLogout';
import payflowLogo from '../../assets/payflow_brand_logo.png';

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
    { key: 'home', label: 'Trang chủ', icon: <HomeOutlined />, path: '/wallet' },
    { key: 'finance', label: 'Tài chính', icon: <WalletOutlined />, path: '/wallet' },
    { key: 'promos', label: 'Ưu đãi', icon: <TagOutlined />, path: '/wallet' },
    { key: 'profile', label: 'Tài khoản', icon: <UserOutlined />, path: '/profile' },
];

/* ================================================================
 *  CustomerLayout — Stitch PayFlow Dashboard TopAppBar & BottomBar
 * ================================================================ */
export default function CustomerLayout({ children }: CustomerLayoutProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const user = getUser();
    const { handleLogout, loading } = useLogout();

    const userInitial = user?.fullName
        ? user.fullName.trim().charAt(0).toUpperCase()
        : 'U';

    return (
        <div className="customer-wrapper">
            {/* ---- DESKTOP HEADER (>=768px) ---- */}
            <header className="customer-header">
                <div className="customer-header__inner">
                    {/* Brand Logo */}
                    <div
                        className="customer-header__brand"
                        onClick={() => navigate('/wallet')}
                    >
                        <img
                            src={payflowLogo}
                            alt="PayFlow"
                            className="customer-header__logo-img"
                        />
                    </div>

                    {/* Navigation Links */}
                    <nav className="customer-header__nav">
                        {NAV_TABS.map((tab) => {
                            const isActive =
                                tab.key === 'home'
                                    ? location.pathname === '/wallet'
                                    : tab.key === 'profile'
                                    ? location.pathname === '/profile'
                                    : false;

                            return (
                                <Link
                                    key={tab.key}
                                    to={tab.path}
                                    className={`customer-header__nav-item${
                                        isActive ? ' customer-header__nav-item--active' : ''
                                    }`}
                                >
                                    {tab.icon}
                                    <span>{tab.label}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Right User Controls */}
                    <div className="customer-header__right">
                        {/* Notifications */}
                        <Tooltip title="Thông báo">
                            <button
                                type="button"
                                className="customer-header__notify-btn"
                                aria-label="Thông báo"
                            >
                                <BellOutlined />
                            </button>
                        </Tooltip>

                        {/* User Profile Pill */}
                        <div
                            className="customer-header__user-pill"
                            onClick={() => navigate('/profile')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="customer-header__avatar">{userInitial}</div>
                            <span className="customer-header__user-name">
                                {user?.fullName ?? 'Người dùng'}
                            </span>
                        </div>

                        {/* Logout Button */}
                        <Popconfirm
                            title="Đăng xuất"
                            description="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản?"
                            onConfirm={handleLogout}
                            okText="Đăng xuất"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true, loading }}
                            placement="bottomRight"
                        >
                            <button
                                type="button"
                                className="customer-header__logout"
                                title="Đăng xuất"
                                disabled={loading}
                            >
                                <LogoutOutlined />
                            </button>
                        </Popconfirm>
                    </div>
                </div>
            </header>

            {/* ---- MOBILE HEADER (<768px) ---- */}
            <div className="customer-mobile-header">
                <div
                    className="customer-mobile-header__brand"
                    onClick={() => navigate('/wallet')}
                    style={{ display: 'flex', alignItems: 'center', overflow: 'visible' }}
                >
                    <img
                        src={payflowLogo}
                        alt="PayFlow"
                        style={{ height: 100, width: 'auto', objectFit: 'contain', margin: '-24px -10px' }}
                    />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div
                        onClick={() => navigate('/profile')}
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            backgroundColor: '#0055d4',
                            color: '#ffffff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 13,
                            fontWeight: 600,
                            cursor: 'pointer',
                        }}
                    >
                        {userInitial}
                    </div>
                    <Popconfirm
                        title="Đăng xuất"
                        description="Bạn có chắc chắn muốn đăng xuất?"
                        onConfirm={handleLogout}
                        okText="Đăng xuất"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true, loading }}
                        placement="bottomRight"
                    >
                        <button
                            type="button"
                            className="customer-header__logout"
                            title="Đăng xuất"
                            disabled={loading}
                        >
                            <LogoutOutlined />
                        </button>
                    </Popconfirm>
                </div>
            </div>

            {/* ---- MAIN CONTENT ---- */}
            <main className="customer-main">
                <div className="customer-main__container">{children}</div>
            </main>

            {/* ---- BOTTOM NAVIGATION (<768px only) ---- */}
            <nav className="customer-bottom-nav">
                {NAV_TABS.map((tab) => {
                    const isActive =
                        tab.key === 'home'
                            ? location.pathname === '/wallet'
                            : tab.key === 'profile'
                            ? location.pathname === '/profile'
                            : false;

                    return (
                        <button
                            key={tab.key}
                            type="button"
                            className={`customer-bottom-nav__tab${
                                isActive ? ' customer-bottom-nav__tab--active' : ''
                            }`}
                            onClick={() => navigate(tab.path)}
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
