import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Button, Spin, Empty } from 'antd';
import type { LedgerEntry } from '../types/wallet.types';

interface TransactionListProps {
    entries: LedgerEntry[];
    loading: boolean;
    loadingMore: boolean;
    hasMore: boolean;
    onLoadMore: () => void;
}

function formatVND(amount: number): string {
    return new Intl.NumberFormat('vi-VN').format(amount);
}

function formatDateTime(dateStr: string): string {
    const d = new Date(dateStr);
    const time = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    const date = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    return `${time} ${date}`;
}

/* ================================================================
 *  TransactionList — Stitch PayFlow Financial Core Transaction List
 * ================================================================ */
export default function TransactionList({
    entries,
    loading,
    loadingMore,
    hasMore,
    onLoadMore,
}: TransactionListProps) {
    if (loading) {
        return (
            <div style={styles.card}>
                <div style={styles.centered}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#0055d4' }} spin />} />
                    <p style={styles.loadingText}>Đang tải lịch sử giao dịch…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.card}>
            {/* Header */}
            <div style={styles.header}>
                <h3 style={styles.headerTitle}>Lịch sử giao dịch</h3>
                {entries.length > 0 && (
                    <span style={styles.headerCount}>{entries.length} giao dịch</span>
                )}
            </div>

            {/* Empty state */}
            {entries.length === 0 && (
                <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={
                        <span style={{ color: '#737686', fontSize: 14 }}>
                            Chưa có giao dịch nào
                        </span>
                    }
                    style={{ padding: '32px 0 16px' }}
                />
            )}

            {/* Transaction List */}
            {entries.length > 0 && (
                <div style={styles.list}>
                    {entries.map((entry, idx) => {
                        const isCredit = entry.entryType === 'CREDIT';
                        const isLast = idx === entries.length - 1;

                        return (
                            <div key={entry.id}>
                                <div style={styles.item} className="txn-item">
                                    {/* Left: Icon and info */}
                                    <div style={styles.itemLeft}>
                                        <div
                                            style={{
                                                ...styles.iconWrap,
                                                background: isCredit ? '#e8fdf0' : '#ffdad6',
                                                color: isCredit ? '#006d36' : '#ba1a1a',
                                            }}
                                        >
                                            {isCredit ? (
                                                <ArrowDownOutlined style={{ fontSize: 16 }} />
                                            ) : (
                                                <ArrowUpOutlined style={{ fontSize: 16 }} />
                                            )}
                                        </div>
                                        <div style={styles.infoCol}>
                                            <span style={styles.title}>
                                                {isCredit ? 'Nạp tiền vào ví' : 'Chuyển tiền / Thanh toán'}
                                            </span>
                                            <span style={styles.time}>{formatDateTime(entry.createdAt)}</span>
                                        </div>
                                    </div>

                                    {/* Right: Amount */}
                                    <div style={styles.amountCol}>
                                        <span
                                            style={{
                                                ...styles.amount,
                                                color: isCredit ? '#006d36' : '#ba1a1a',
                                            }}
                                        >
                                            {isCredit ? '+' : '−'}{formatVND(entry.amount)}&thinsp;₫
                                        </span>
                                        <span style={styles.balanceAfter}>
                                            Dư: {formatVND(entry.balanceAfter)}&thinsp;₫
                                        </span>
                                    </div>
                                </div>
                                {!isLast && <div style={styles.divider} />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load more button */}
            {hasMore && (
                <div style={styles.loadMoreWrap}>
                    <Button
                        type="text"
                        loading={loadingMore}
                        onClick={onLoadMore}
                        style={styles.loadMoreBtn}
                    >
                        Xem thêm giao dịch
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ---------- Inline styles ---------- */
const styles: Record<string, React.CSSProperties> = {
    card: {
        background: '#ffffff',
        border: '1px solid #eeeef0',
        borderRadius: 16,
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
    },
    centered: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 0',
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: '#737686',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid #f1f3f6',
    },
    headerTitle: {
        fontSize: 17,
        fontWeight: 700,
        color: '#1a1c1e',
        margin: 0,
        letterSpacing: '-0.01em',
    },
    headerCount: {
        fontSize: 13,
        fontWeight: 500,
        color: '#0055d4',
    },
    list: {
        display: 'flex',
        flexDirection: 'column',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 8px',
        borderRadius: 10,
        transition: 'background 150ms ease',
        cursor: 'pointer',
    },
    itemLeft: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
    },
    iconWrap: {
        width: 40,
        height: 40,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    infoCol: {
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
    },
    title: {
        fontSize: 14,
        fontWeight: 600,
        color: '#1a1c1e',
    },
    time: {
        fontSize: 12,
        color: '#737686',
    },
    amountCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 2,
    },
    amount: {
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
    },
    balanceAfter: {
        fontSize: 11,
        color: '#737686',
    },
    divider: {
        height: 1,
        background: '#f8fafc',
        margin: '2px 0',
    },
    loadMoreWrap: {
        textAlign: 'center',
        paddingTop: 16,
        marginTop: 8,
        borderTop: '1px solid #f1f3f6',
    },
    loadMoreBtn: {
        fontSize: 13,
        fontWeight: 600,
        color: '#0055d4',
        borderRadius: 8,
    },
};
