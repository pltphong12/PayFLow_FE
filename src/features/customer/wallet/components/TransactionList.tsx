import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    LoadingOutlined,
} from '@ant-design/icons';
import { Button, Spin, Empty } from 'antd';
import type { LedgerEntry } from '../types/wallet.types';

/* ================================================================
 *  TransactionList — Lịch sử giao dịch ledger (premium fintech style)
 *
 *  Design system: PayFlow MASTER.md + ui-ux-pro-max
 *  - CREDIT (vào): #10B981 + icon mũi tên xuống, dấu +
 *  - DEBIT  (ra):  #EF4444 + icon mũi tên lên, dấu -
 *  - Card surface: white với subtle shadow (elevation layer)
 *  - Hover state: background shift (micro-interaction)
 *  - Divider separator giữa các items
 *  - "Xem thêm" dạng ghost button căn giữa
 *  - 8dp spacing rhythm (UX checklist)
 * ================================================================ */

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

function timeAgo(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'Vừa xong';
    if (diffMin < 60) return `${diffMin} phút trước`;
    if (diffHour < 24) return `${diffHour} giờ trước`;
    if (diffDay < 7) return `${diffDay} ngày trước`;

    return new Date(dateStr).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

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
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: 'var(--color-accent)' }} spin />} />
                    <p style={styles.loadingText}>Đang tải lịch sử giao dịch…</p>
                </div>
            </div>
        );
    }

    return (
        <div style={styles.card}>
            {/* Section header */}
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
                        <span style={{ color: '#94a3b8', fontSize: 14 }}>
                            Chưa có giao dịch nào
                        </span>
                    }
                    style={{ padding: '32px 0 16px' }}
                />
            )}

            {/* Transaction entries */}
            {entries.length > 0 && (
                <div style={styles.list}>
                    {entries.map((entry, idx) => {
                        const isCredit = entry.entryType === 'CREDIT';
                        const isLast = idx === entries.length - 1;
                        return (
                            <div key={entry.id}>
                                <div
                                    style={styles.item}
                                    className="txn-item"
                                    role="listitem"
                                >
                                    {/* Type icon */}
                                    <div
                                        style={{
                                            ...styles.iconWrap,
                                            background: isCredit
                                                ? 'rgba(16,185,129,0.1)'
                                                : 'rgba(239,68,68,0.1)',
                                        }}
                                        aria-hidden="true"
                                    >
                                        {isCredit
                                            ? <ArrowDownOutlined style={{ color: '#10B981', fontSize: 15 }} />
                                            : <ArrowUpOutlined style={{ color: '#EF4444', fontSize: 15 }} />
                                        }
                                    </div>

                                    {/* Info col */}
                                    <div style={styles.infoCol}>
                                        <span style={styles.typeLabel}>
                                            {isCredit ? 'Tiền vào' : 'Tiền ra'}
                                        </span>
                                        <span style={styles.timeLabel}>{timeAgo(entry.createdAt)}</span>
                                    </div>

                                    {/* Amount col */}
                                    <div style={styles.amountCol}>
                                        <span
                                            style={{
                                                ...styles.amountText,
                                                color: isCredit ? '#10B981' : '#EF4444',
                                            }}
                                            aria-label={`${isCredit ? 'Nhận' : 'Gửi'} ${formatVND(entry.amount)} đồng`}
                                        >
                                            {isCredit ? '+' : '−'}{formatVND(entry.amount)}&thinsp;₫
                                        </span>
                                        <span style={styles.balanceAfterLabel}>
                                            Số dư: {formatVND(entry.balanceAfter)}&thinsp;₫
                                        </span>
                                    </div>
                                </div>
                                {/* Separator */}
                                {!isLast && <div style={styles.separator} />}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Load more */}
            {hasMore && (
                <div style={styles.loadMoreWrap}>
                    <Button
                        type="text"
                        loading={loadingMore}
                        onClick={onLoadMore}
                        style={styles.loadMoreBtn}
                        id="btn-load-more-ledger"
                    >
                        {loadingMore ? 'Đang tải…' : 'Xem thêm giao dịch'}
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ---------- Inline styles ---------- */
const styles: Record<string, React.CSSProperties> = {
    card: {
        background: '#FFFFFF',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)',
        border: '1px solid #F1F5F9',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '18px 20px 14px',
        borderBottom: '1px solid #F8FAFC',
    },
    headerTitle: {
        fontSize: 15,
        fontWeight: 700,
        color: '#0F172A',
        margin: 0,
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '-0.01em',
    },
    headerCount: {
        fontSize: 12,
        fontWeight: 500,
        color: '#94A3B8',
        background: '#F8FAFC',
        padding: '2px 8px',
        borderRadius: 20,
        border: '1px solid #E2E8F0',
    },
    centered: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
        padding: '40px 20px',
    },
    loadingText: {
        color: '#94A3B8',
        fontSize: 13,
        margin: 0,
    },
    list: {
        padding: '4px 0',
    },
    item: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '14px 20px',
        transition: 'background 150ms ease',
        cursor: 'default',
    },
    iconWrap: {
        width: 38,
        height: 38,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    infoCol: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 0,
    },
    typeLabel: {
        fontSize: 14,
        fontWeight: 600,
        color: '#0F172A',
        letterSpacing: '-0.01em',
    },
    timeLabel: {
        fontSize: 12,
        color: '#94A3B8',
        fontWeight: 400,
    },
    amountCol: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 3,
        flexShrink: 0,
    },
    amountText: {
        fontSize: 15,
        fontWeight: 700,
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '-0.01em',
    },
    balanceAfterLabel: {
        fontSize: 11,
        color: '#CBD5E1',
        fontWeight: 400,
    },
    separator: {
        height: 1,
        background: '#F8FAFC',
        margin: '0 20px',
    },
    loadMoreWrap: {
        padding: '12px 20px 16px',
        borderTop: '1px solid #F8FAFC',
        display: 'flex',
        justifyContent: 'center',
    },
    loadMoreBtn: {
        color: 'var(--color-accent)',
        fontWeight: 600,
        fontSize: 14,
        height: 36,
        letterSpacing: '0.01em',
    },
};
