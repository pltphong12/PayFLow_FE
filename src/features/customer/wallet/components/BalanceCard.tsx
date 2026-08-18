import {
    WalletOutlined,
    PlusCircleOutlined,
    SendOutlined,
    EyeOutlined,
    EyeInvisibleOutlined,
} from '@ant-design/icons';
import { Button, Skeleton } from 'antd';
import { useState } from 'react';
import type { WalletResponse } from '../types/wallet.types';

/* ================================================================
 *  BalanceCard — Glassmorphism hero card hiển thị số dư ví
 *
 *  Design system: PayFlow MASTER.md + ui-ux-pro-max (fintech style)
 *  Style: Dark glassmorphism + mesh gradient + depth layers
 *  - Gradient: navy → indigo → purple mesh
 *  - Balance: toggle ẩn/hiện (tap to reveal)
 *  - 2 CTA: Nạp tiền (accent solid) + Chuyển tiền (glass outline)
 *  - Micro-animation: shimmer overlay on hover, button scale press
 *  - Touch targets: ≥44px chiều cao (UX checklist)
 *  - Icons: @ant-design/icons (consistent outlined style)
 * ================================================================ */

interface BalanceCardProps {
    wallet: WalletResponse | null;
    loading: boolean;
    onTopup: () => void;
    onTransfer: () => void;
}

function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

export default function BalanceCard({ wallet, loading, onTopup, onTransfer }: BalanceCardProps) {
    const [hidden, setHidden] = useState(false);

    if (loading) {
        return (
            <div style={styles.card}>
                <div style={styles.meshTop} />
                <div style={styles.meshBottom} />
                <Skeleton active paragraph={{ rows: 3 }} style={{ padding: 0 }}
                    title={{ style: { background: 'rgba(255,255,255,0.1)', borderRadius: 6 } }}
                />
            </div>
        );
    }

    return (
        <div style={styles.card} className="balance-card">
            {/* Mesh gradient layers */}
            <div style={styles.meshTop} />
            <div style={styles.meshBottom} />
            <div style={styles.shimmer} className="balance-card__shimmer" />

            <div style={styles.content}>
                {/* Top row: icon + wallet tag */}
                <div style={styles.topRow}>
                    <div style={styles.walletTag}>
                        <WalletOutlined style={{ fontSize: 13, color: '#F59E0B' }} aria-hidden="true" />
                        <span style={styles.walletTagText}>Ví PayFlow</span>
                    </div>
                    <button
                        type="button"
                        style={styles.eyeBtn}
                        onClick={() => setHidden((h) => !h)}
                        aria-label={hidden ? 'Hiện số dư' : 'Ẩn số dư'}
                        title={hidden ? 'Hiện số dư' : 'Ẩn số dư'}
                    >
                        {hidden
                            ? <EyeInvisibleOutlined style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} aria-hidden="true" />
                            : <EyeOutlined style={{ fontSize: 16, color: 'rgba(255,255,255,0.5)' }} aria-hidden="true" />
                        }
                    </button>
                </div>

                {/* Balance label */}
                <p style={styles.balanceLabel}>Số dư khả dụng</p>

                {/* Balance amount */}
                <div style={styles.balanceRow}>
                    {hidden ? (
                        <span style={styles.balanceHidden}>••••••••</span>
                    ) : (
                        <>
                            <span style={styles.balanceAmount}>{formatVND(wallet?.balance ?? 0)}</span>
                            <span style={styles.balanceCurrency}>₫</span>
                        </>
                    )}
                </div>

                {/* Divider */}
                <div style={styles.divider} />

                {/* Action buttons */}
                <div style={styles.actions}>
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined aria-hidden="true" />}
                        onClick={onTopup}
                        style={styles.btnPrimary}
                        className="balance-card__btn-primary"
                        id="btn-topup"
                        aria-label="Nạp tiền vào ví"
                    >
                        Nạp tiền
                    </Button>
                    <Button
                        icon={<SendOutlined aria-hidden="true" />}
                        onClick={onTransfer}
                        style={styles.btnOutline}
                        className="balance-card__btn-outline"
                        id="btn-transfer"
                        aria-label="Chuyển tiền cho người khác"
                    >
                        Chuyển tiền
                    </Button>
                </div>
            </div>
        </div>
    );
}

/* ---------- Inline styles (token-driven, semantic vars) ---------- */
const styles: Record<string, React.CSSProperties> = {
    card: {
        position: 'relative',
        borderRadius: 20,
        padding: '24px 20px 20px',
        background: 'linear-gradient(145deg, #0F172A 0%, #1E1B4B 40%, #312E81 70%, #4C1D95 100%)',
        overflow: 'hidden',
        minHeight: 210,
        boxShadow: '0 20px 40px rgba(15,23,42,0.4), 0 0 0 1px rgba(139,92,246,0.15)',
    },
    meshTop: {
        position: 'absolute',
        top: -80,
        right: -80,
        width: 240,
        height: 240,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(139,92,246,0.35) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    meshBottom: {
        position: 'absolute',
        bottom: -60,
        left: -60,
        width: 180,
        height: 180,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(245,158,11,0.2) 0%, transparent 65%)',
        pointerEvents: 'none',
    },
    shimmer: {
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
        pointerEvents: 'none',
        transition: 'opacity 300ms ease',
    },
    content: {
        position: 'relative',
        zIndex: 1,
    },
    topRow: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    walletTag: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 10px',
        borderRadius: 20,
        background: 'rgba(245,158,11,0.12)',
        border: '1px solid rgba(245,158,11,0.2)',
    },
    walletTagText: {
        fontSize: 11,
        fontWeight: 700,
        color: '#F59E0B',
        letterSpacing: '0.06em',
        textTransform: 'uppercase' as const,
    },
    eyeBtn: {
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        flexShrink: 0,
    },
    balanceLabel: {
        fontSize: 12,
        color: 'rgba(148,163,184,0.8)',
        margin: '0 0 8px',
        fontWeight: 500,
        letterSpacing: '0.04em',
        textTransform: 'uppercase' as const,
    },
    balanceRow: {
        display: 'flex',
        alignItems: 'baseline',
        gap: 8,
        marginBottom: 20,
    },
    balanceAmount: {
        fontSize: 38,
        fontWeight: 700,
        color: '#F8FAFC',
        letterSpacing: '-0.03em',
        fontFamily: "'IBM Plex Sans', sans-serif",
        lineHeight: 1,
    },
    balanceCurrency: {
        fontSize: 22,
        fontWeight: 600,
        color: 'rgba(148,163,184,0.7)',
    },
    balanceHidden: {
        fontSize: 32,
        fontWeight: 700,
        color: 'rgba(148,163,184,0.6)',
        letterSpacing: '0.15em',
        lineHeight: 1,
    },
    divider: {
        height: 1,
        background: 'rgba(255,255,255,0.08)',
        marginBottom: 16,
    },
    actions: {
        display: 'flex',
        gap: 10,
    },
    btnPrimary: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 14,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        border: 'none',
        boxShadow: '0 4px 12px rgba(139,92,246,0.4)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '0.01em',
    },
    btnOutline: {
        flex: 1,
        height: 46,
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 14,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: '#F8FAFC',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '0.01em',
    },
};
