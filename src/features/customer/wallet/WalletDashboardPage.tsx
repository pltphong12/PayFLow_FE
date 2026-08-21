import { useState } from 'react';
import { Alert, message } from 'antd';
import {
    PlusCircleOutlined,
    SwapOutlined,
    QrcodeOutlined,
    HistoryOutlined,
    GiftFilled,
} from '@ant-design/icons';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import BalanceCard from './components/BalanceCard';
import TransactionList from './components/TransactionList';
import TopupModal from './components/TopupModal';
import TransferModal from './components/TransferModal';
import useWallet from './hooks/useWallet';

/* ================================================================
 *  WalletDashboardPage — Stitch PayFlow Financial Core Dashboard
 * ================================================================ */
export default function WalletDashboardPage() {
    const {
        wallet,
        ledgerEntries,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refetch,
    } = useWallet();

    const [topupOpen, setTopupOpen] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);

    const handleQrScan = () => {
        message.info('Tính năng Quét mã QR thanh toán đang được hoàn thiện!');
    };

    const handleScrollToHistory = () => {
        const historyEl = document.getElementById('transaction-history-section');
        if (historyEl) {
            historyEl.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <CustomerLayout>
            {/* Error banner nếu không tải được dữ liệu */}
            {error && !loading && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    style={{ borderRadius: 12, marginBottom: 20 }}
                />
            )}

            {/* Dashboard 2-column Grid (12 cols: 8 left, 4 right) */}
            <div className="wallet-grid">
                {/* Left Column: Balance + Quick Actions + Promo */}
                <div className="wallet-grid__left">
                    {/* 1. Thẻ số dư ví PayFlow */}
                    <BalanceCard wallet={wallet} loading={loading} />

                    {/* 2. Lưới 4 Thao tác nhanh (Quick Actions) */}
                    <div className="quick-actions-grid">
                        {/* Nạp tiền */}
                        <div
                            className="quick-action-card"
                            onClick={() => setTopupOpen(true)}
                            id="btn-quick-topup"
                            role="button"
                            tabIndex={0}
                        >
                            <div className="quick-action-icon">
                                <PlusCircleOutlined />
                            </div>
                            <span className="quick-action-label">Nạp tiền</span>
                        </div>

                        {/* Chuyển tiền */}
                        <div
                            className="quick-action-card"
                            onClick={() => setTransferOpen(true)}
                            id="btn-quick-transfer"
                            role="button"
                            tabIndex={0}
                        >
                            <div className="quick-action-icon">
                                <SwapOutlined />
                            </div>
                            <span className="quick-action-label">Chuyển tiền</span>
                        </div>

                        {/* Quét QR */}
                        <div
                            className="quick-action-card"
                            onClick={handleQrScan}
                            id="btn-quick-qr"
                            role="button"
                            tabIndex={0}
                        >
                            <div className="quick-action-icon">
                                <QrcodeOutlined />
                            </div>
                            <span className="quick-action-label">Quét QR</span>
                        </div>

                        {/* Lịch sử */}
                        <div
                            className="quick-action-card"
                            onClick={handleScrollToHistory}
                            id="btn-quick-history"
                            role="button"
                            tabIndex={0}
                        >
                            <div className="quick-action-icon">
                                <HistoryOutlined />
                            </div>
                            <span className="quick-action-label">Lịch sử</span>
                        </div>
                    </div>

                    {/* 3. Banner khuyến mãi PayFlow */}
                    <div className="promo-banner">
                        <div className="promo-banner__icon">
                            <GiftFilled />
                        </div>
                        <div className="promo-banner__content">
                            <h4 className="promo-banner__title">Mở thẻ tín dụng ảo PayFlow</h4>
                            <p className="promo-banner__desc">
                                Hoàn tiền 5% mọi giao dịch mua sắm &amp; thanh toán hóa đơn. Mở ngay trong 1 phút.
                            </p>
                        </div>
                        <button
                            type="button"
                            className="promo-banner__btn"
                            onClick={() =>
                                message.success('Bạn đã đăng ký nhận thông tin ưu đãi thẻ PayFlow!')
                            }
                        >
                            Đăng ký ngay
                        </button>
                    </div>
                </div>

                {/* Right Column: Lịch sử giao dịch */}
                <div className="wallet-grid__right" id="transaction-history-section">
                    <TransactionList
                        entries={ledgerEntries}
                        loading={loading}
                        loadingMore={loadingMore}
                        hasMore={hasMore}
                        onLoadMore={loadMore}
                    />
                </div>
            </div>

            {/* Modal nạp tiền */}
            <TopupModal
                open={topupOpen}
                onClose={() => setTopupOpen(false)}
                onSuccess={refetch}
            />

            {/* Modal chuyển tiền */}
            <TransferModal
                open={transferOpen}
                onClose={() => setTransferOpen(false)}
                onSuccess={refetch}
            />
        </CustomerLayout>
    );
}
