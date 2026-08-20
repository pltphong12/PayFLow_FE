import { useState, useEffect } from 'react';
import { Alert, Skeleton, message } from 'antd';
import type { AxiosError } from 'axios';
import authApi from './services/authApi';
import type { UserProfileResponse } from './types/auth.types';
import type { ApiResponse } from '../../types/api.types';

/* ================================================================
 *  useProfile — Custom hook để fetch thông tin user profile
 *
 *  - Gọi GET /users/me khi mount
 *  - Trả về: profile, loading, error, refetch
 * ================================================================ */

interface UseProfileReturn {
    profile: UserProfileResponse | null;
    loading: boolean;
    error: string | null;
}

export function useProfile(): UseProfileReturn {
    const [profile, setProfile] = useState<UserProfileResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        authApi
            .getCurrentUser()
            .then((res) => {
                if (cancelled) return;
                if (res.data.success) {
                    setProfile(res.data.data);
                } else {
                    setError(res.data.message || 'Không thể tải thông tin tài khoản.');
                }
            })
            .catch((err: AxiosError<ApiResponse>) => {
                if (cancelled) return;
                const serverMsg = err.response?.data?.message;
                setError(serverMsg || 'Không thể kết nối máy chủ.');
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return { profile, loading, error };
}

/* ================================================================
 *  ProfilePage — Trang thông tin tài khoản người dùng
 *
 *  Design system: PayFlow MASTER.md + ui-ux-pro-max (fintech/glassmorphism)
 *  - Hero card: avatar gradient + tên + role badge
 *  - Info rows: email, role, status, ngày tham gia
 *  - Security section: nút đăng xuất (dùng useLogout hook)
 *  - Micro-animations: hover, transition all 200ms
 *  - Responsive: full CustomerLayout
 *  - Font: IBM Plex Sans
 * ================================================================ */

import CustomerLayout from '../../components/layout/CustomerLayout';
import { useLogout } from './hooks/useLogout';
import {
    UserOutlined,
    MailOutlined,
    SafetyOutlined,
    CalendarOutlined,
    LogoutOutlined,
    TeamOutlined,
    CheckCircleOutlined,
    CloseCircleOutlined,
} from '@ant-design/icons';

type BadgeStatus = 'USER' | 'MERCHANT' | 'ADMIN';
type AccountStatus = 'ACTIVE' | 'DISABLED' | string;

function getRoleBadge(role: BadgeStatus) {
    const map: Record<BadgeStatus, { label: string; bg: string; color: string; border: string }> = {
        USER: {
            label: 'Người dùng',
            bg: 'rgba(139,92,246,0.12)',
            color: '#8B5CF6',
            border: 'rgba(139,92,246,0.25)',
        },
        MERCHANT: {
            label: 'Merchant',
            bg: 'rgba(245,158,11,0.12)',
            color: '#F59E0B',
            border: 'rgba(245,158,11,0.25)',
        },
        ADMIN: {
            label: 'Quản trị viên',
            bg: 'rgba(239,68,68,0.12)',
            color: '#EF4444',
            border: 'rgba(239,68,68,0.25)',
        },
    };
    return map[role] ?? map.USER;
}

function getStatusBadge(status: AccountStatus) {
    if (status === 'ACTIVE') {
        return { label: 'Hoạt động', color: '#22C55E', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.2)' };
    }
    return { label: 'Bị khóa', color: '#EF4444', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.2)' };
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

function getInitials(fullName: string): string {
    return fullName
        .trim()
        .split(' ')
        .filter(Boolean)
        .map((w) => w[0].toUpperCase())
        .slice(-2)
        .join('');
}

/* ---- Skeleton row loader ---- */
function ProfileSkeletonRows() {
    return (
        <div style={{ padding: '0 4px' }}>
            {[1, 2, 3, 4].map((i) => (
                <div key={i} style={styles.infoRow}>
                    <Skeleton.Avatar active size={36} shape="circle" style={{ flexShrink: 0 }} />
                    <Skeleton active paragraph={{ rows: 1 }} title={false} style={{ flex: 1 }} />
                </div>
            ))}
        </div>
    );
}

/* ---- Info row component ---- */
function InfoRow({
    icon,
    label,
    value,
    badge,
}: {
    icon: React.ReactNode;
    label: string;
    value?: string;
    badge?: React.ReactNode;
}) {
    return (
        <div style={styles.infoRow} className="profile-info-row">
            <div style={styles.infoIconWrap}>{icon}</div>
            <div style={styles.infoContent}>
                <span style={styles.infoLabel}>{label}</span>
                {badge ? badge : <span style={styles.infoValue}>{value ?? '—'}</span>}
            </div>
        </div>
    );
}

export default function ProfilePage() {
    const { profile, loading, error } = useProfile();
    const { handleLogout, loading: logoutLoading } = useLogout();

    const roleBadge = profile ? getRoleBadge(profile.role as BadgeStatus) : null;
    const statusBadge = profile ? getStatusBadge(profile.status) : null;
    const initials = profile ? getInitials(profile.fullName) : '?';

    return (
        <CustomerLayout>
            {/* ---- Error banner ---- */}
            {error && !loading && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    style={{ borderRadius: 10 }}
                />
            )}

            {/* ================================================================
                HERO CARD — Avatar gradient + Tên + Role badge
            ================================================================ */}
            <div style={styles.heroCard} className="profile-hero-card">
                {/* Mesh gradient decorations */}
                <div style={styles.heroBlobTop} />
                <div style={styles.heroBlobBottom} />

                <div style={styles.heroContent}>
                    {/* Avatar */}
                    {loading ? (
                        <Skeleton.Avatar active size={80} style={{ display: 'block', margin: '0 auto 16px' }} />
                    ) : (
                        <div style={styles.avatarWrap} aria-label={`Ảnh đại diện của ${profile?.fullName}`}>
                            <span style={styles.avatarInitials}>{initials}</span>
                            {/* Online dot */}
                            <div style={styles.avatarOnlineDot} aria-hidden="true" />
                        </div>
                    )}

                    {/* Name */}
                    {loading ? (
                        <Skeleton active paragraph={{ rows: 0 }} title={{ width: 160 }} style={{ textAlign: 'center' }} />
                    ) : (
                        <h1 style={styles.heroName}>{profile?.fullName ?? 'Người dùng'}</h1>
                    )}

                    {/* Role badge */}
                    {!loading && roleBadge && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
                            <span
                                style={{
                                    ...styles.badge,
                                    background: roleBadge.bg,
                                    color: roleBadge.color,
                                    border: `1px solid ${roleBadge.border}`,
                                }}
                                aria-label={`Vai trò: ${roleBadge.label}`}
                            >
                                <TeamOutlined aria-hidden="true" />
                                {roleBadge.label}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* ================================================================
                THÔNG TIN TÀI KHOẢN
            ================================================================ */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={styles.cardHeaderIcon} aria-hidden="true">
                        <UserOutlined style={{ fontSize: 14 }} />
                    </div>
                    <span style={styles.cardTitle}>Thông tin tài khoản</span>
                </div>

                <div style={styles.cardDivider} />

                {loading ? (
                    <ProfileSkeletonRows />
                ) : (
                    <>
                        <InfoRow
                            icon={<MailOutlined style={{ fontSize: 16, color: '#8B5CF6' }} aria-hidden="true" />}
                            label="Email"
                            value={profile?.email}
                        />

                        <InfoRow
                            icon={<TeamOutlined style={{ fontSize: 16, color: '#F59E0B' }} aria-hidden="true" />}
                            label="Vai trò"
                            badge={
                                roleBadge && (
                                    <span
                                        style={{
                                            ...styles.badge,
                                            background: roleBadge.bg,
                                            color: roleBadge.color,
                                            border: `1px solid ${roleBadge.border}`,
                                            marginTop: 4,
                                        }}
                                    >
                                        {roleBadge.label}
                                    </span>
                                )
                            }
                        />

                        <InfoRow
                            icon={
                                profile?.status === 'ACTIVE' ? (
                                    <CheckCircleOutlined style={{ fontSize: 16, color: '#22C55E' }} aria-hidden="true" />
                                ) : (
                                    <CloseCircleOutlined style={{ fontSize: 16, color: '#EF4444' }} aria-hidden="true" />
                                )
                            }
                            label="Trạng thái tài khoản"
                            badge={
                                statusBadge && (
                                    <span
                                        style={{
                                            ...styles.badge,
                                            background: statusBadge.bg,
                                            color: statusBadge.color,
                                            border: `1px solid ${statusBadge.border}`,
                                            marginTop: 4,
                                        }}
                                    >
                                        {profile?.status === 'ACTIVE'
                                            ? <CheckCircleOutlined aria-hidden="true" style={{ marginRight: 4 }} />
                                            : <CloseCircleOutlined aria-hidden="true" style={{ marginRight: 4 }} />
                                        }
                                        {statusBadge.label}
                                    </span>
                                )
                            }
                        />

                        <InfoRow
                            icon={<CalendarOutlined style={{ fontSize: 16, color: '#94A3B8' }} aria-hidden="true" />}
                            label="Ngày tham gia"
                            value={profile?.createdAt ? formatDate(profile.createdAt) : '—'}
                        />

                        <InfoRow
                            icon={<SafetyOutlined style={{ fontSize: 16, color: '#94A3B8' }} aria-hidden="true" />}
                            label="ID tài khoản"
                            value={profile?.id ?? '—'}
                        />
                    </>
                )}
            </div>

            {/* ================================================================
                BẢO MẬT & ĐĂNG XUẤT
            ================================================================ */}
            <div style={styles.card}>
                <div style={styles.cardHeader}>
                    <div style={{ ...styles.cardHeaderIcon, background: 'rgba(239,68,68,0.1)' }} aria-hidden="true">
                        <SafetyOutlined style={{ fontSize: 14, color: '#EF4444' }} />
                    </div>
                    <span style={styles.cardTitle}>Bảo mật & Phiên đăng nhập</span>
                </div>

                <div style={styles.cardDivider} />

                <p style={styles.securityNote}>
                    Để bảo vệ tài khoản của bạn, hãy đăng xuất khi sử dụng thiết bị chung hoặc không tin tưởng.
                </p>

                <button
                    id="btn-logout-profile"
                    type="button"
                    style={{
                        ...styles.logoutBtn,
                        opacity: logoutLoading ? 0.7 : 1,
                        cursor: logoutLoading ? 'not-allowed' : 'pointer',
                    }}
                    onClick={handleLogout}
                    disabled={logoutLoading}
                    aria-label="Đăng xuất khỏi tài khoản"
                    className="profile-logout-btn"
                >
                    <LogoutOutlined aria-hidden="true" style={{ fontSize: 16 }} />
                    <span>{logoutLoading ? 'Đang đăng xuất...' : 'Đăng xuất'}</span>
                </button>
            </div>
        </CustomerLayout>
    );
}

/* ================================================================
 *  Inline styles — token-driven, semantic vars
 * ================================================================ */
const styles: Record<string, React.CSSProperties> = {
    /* ---- Hero card ---- */
    heroCard: {
        position: 'relative',
        borderRadius: 20,
        padding: '32px 24px 28px',
        background: 'linear-gradient(145deg, #0F172A 0%, #1E1B4B 45%, #312E81 75%, #4C1D95 100%)',
        overflow: 'hidden',
        textAlign: 'center',
        boxShadow: '0 20px 40px rgba(15,23,42,0.4), 0 0 0 1px rgba(139,92,246,0.15)',
    },
    heroBlobTop: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    heroBlobBottom: {
        position: 'absolute',
        bottom: -50,
        left: -50,
        width: 160,
        height: 160,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    heroContent: {
        position: 'relative',
        zIndex: 1,
    },
    avatarWrap: {
        width: 80,
        height: 80,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px',
        position: 'relative',
        boxShadow: '0 0 0 4px rgba(255,255,255,0.08), 0 8px 20px rgba(139,92,246,0.4)',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
    },
    avatarInitials: {
        fontSize: 28,
        fontWeight: 700,
        color: '#fff',
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '-0.02em',
        lineHeight: 1,
    },
    avatarOnlineDot: {
        position: 'absolute',
        bottom: 4,
        right: 4,
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: '#22C55E',
        border: '2px solid #1E1B4B',
        boxShadow: '0 0 6px rgba(34,197,94,0.6)',
    },
    heroName: {
        fontSize: 24,
        fontWeight: 700,
        color: '#F8FAFC',
        margin: '0 0 12px',
        letterSpacing: '-0.025em',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    badge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: '4px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
        fontFamily: "'IBM Plex Sans', sans-serif",
    },

    /* ---- Info card ---- */
    card: {
        background: '#ffffff',
        borderRadius: 16,
        padding: '20px 20px 8px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)',
        border: '1px solid #f1f5f9',
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        marginBottom: 16,
    },
    cardHeaderIcon: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'rgba(139,92,246,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#8B5CF6',
        flexShrink: 0,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: 700,
        color: '#0F172A',
        letterSpacing: '-0.01em',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    cardDivider: {
        height: 1,
        background: '#f1f5f9',
        margin: '0 -20px 16px',
    },

    /* ---- Info rows ---- */
    infoRow: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '12px 0',
        borderBottom: '1px solid #f8fafc',
        transition: 'background 150ms ease',
    },
    infoIconWrap: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: '#f8fafc',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        marginTop: 2,
    },
    infoContent: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column' as const,
        gap: 2,
        overflow: 'hidden',
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: 600,
        color: '#94A3B8',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.06em',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    infoValue: {
        fontSize: 14,
        fontWeight: 500,
        color: '#334155',
        fontFamily: "'IBM Plex Sans', sans-serif",
        wordBreak: 'break-all' as const,
        marginTop: 2,
    },

    /* ---- Security section ---- */
    securityNote: {
        fontSize: 13,
        color: '#64748b',
        lineHeight: 1.6,
        margin: '0 0 16px',
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    logoutBtn: {
        width: '100%',
        height: 48,
        borderRadius: 12,
        border: '1px solid rgba(239,68,68,0.3)',
        background: 'rgba(239,68,68,0.06)',
        color: '#EF4444',
        fontSize: 14,
        fontWeight: 700,
        fontFamily: "'IBM Plex Sans', sans-serif",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transition: 'all 200ms ease',
        marginBottom: 12,
        letterSpacing: '0.01em',
    },
};
