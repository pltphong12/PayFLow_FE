import { useState } from 'react';
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    SafetyCertificateFilled,
} from '@ant-design/icons';
import { Skeleton } from 'antd';
import type { WalletResponse } from '../types/wallet.types';

interface BalanceCardProps {
    wallet: WalletResponse | null;
    loading: boolean;
    onTopup?: () => void;
    onTransfer?: () => void;
}

function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

/* ================================================================
 *  BalanceCard — Stitch PayFlow Financial Core Balance Card
 * ================================================================ */
export default function BalanceCard({ wallet, loading }: BalanceCardProps) {
    const [hidden, setHidden] = useState(false);

    if (loading) {
        return (
            <div style={styles.card}>
                <Skeleton
                    active
                    paragraph={{ rows: 2 }}
                    title={{ style: { background: 'rgba(255,255,255,0.2)', borderRadius: 6 } }}
                />
            </div>
        );
    }

    return (
        <div style={styles.card}>
            {/* Background geometric decorative circle */}
            <div style={styles.circleBg} />

            <div style={styles.content}>
                {/* Header row: Label + Eye toggle */}
                <div style={styles.headerRow}>
                    <span style={styles.label}>Số dư ví khả dụng</span>
                    <button
                        type="button"
                        style={styles.eyeBtn}
                        onClick={() => setHidden((h) => !h)}
                        aria-label={hidden ? 'Hiện số dư' : 'Ẩn số dư'}
                        title={hidden ? 'Hiện số dư' : 'Ẩn số dư'}
                    >
                        {hidden ? (
                            <EyeInvisibleOutlined style={{ fontSize: 18 }} />
                        ) : (
                            <EyeOutlined style={{ fontSize: 18 }} />
                        )}
                    </button>
                </div>

                {/* Main Balance display */}
                <div style={styles.amountRow}>
                    {hidden ? (
                        <span style={styles.hiddenAmount}>•••••••• ₫</span>
                    ) : (
                        <span style={styles.amount}>
                            {formatVND(wallet?.balance ?? 0)} <span style={styles.currency}>₫</span>
                        </span>
                    )}
                </div>

                {/* Bottom Trust Badge */}
                <div style={styles.badgeRow}>
                    <div style={styles.trustBadge}>
                        <SafetyCertificateFilled style={{ fontSize: 14, color: '#62ff98' }} />
                        <span>Bảo vệ bởi PayFlow Security 256-bit</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------- Inline styles ---------- */
const styles: Record<string, React.CSSProperties> = {
    card: {
        position: 'relative',
        borderRadius: 18,
        padding: '24px 24px 20px',
        background: 'linear-gradient(135deg, #0055d4 0%, #003fa3 100%)',
        overflow: 'hidden',
        color: '#ffffff',
        boxShadow: '0 10px 25px -5px rgba(0, 85, 212, 0.3), 0 4px 10px -4px rgba(0, 0, 0, 0.05)',
        minHeight: 160,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    circleBg: {
        position: 'absolute',
        top: -60,
        right: -60,
        width: 220,
        height: 220,
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
    },
    content: {
        position: 'relative',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
    },
    headerRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: 14,
        fontWeight: 500,
        color: '#b2c5ff',
        letterSpacing: '0.02em',
    },
    eyeBtn: {
        background: 'transparent',
        border: 'none',
        color: '#b2c5ff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        borderRadius: 6,
        transition: 'color 180ms ease',
    },
    amountRow: {
        margin: '4px 0',
    },
    amount: {
        fontSize: 34,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '-0.02em',
        fontFamily: "'Inter', sans-serif",
    },
    currency: {
        fontSize: 24,
        fontWeight: 600,
        marginLeft: 2,
    },
    hiddenAmount: {
        fontSize: 28,
        fontWeight: 700,
        color: '#ffffff',
        letterSpacing: '2px',
    },
    badgeRow: {
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
    },
    trustBadge: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        padding: '4px 12px',
        borderRadius: 8,
        background: 'rgba(255, 255, 255, 0.14)',
        backdropFilter: 'blur(8px)',
        fontSize: 12,
        fontWeight: 500,
        color: '#ffffff',
    },
};
