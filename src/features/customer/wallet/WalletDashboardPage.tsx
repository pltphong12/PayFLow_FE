import { useState } from 'react';
import { Alert } from 'antd';
import CustomerLayout from '../../../components/layout/CustomerLayout';
import BalanceCard from './components/BalanceCard';
import TransactionList from './components/TransactionList';
import TopupModal from './components/TopupModal';
import TransferModal from './components/TransferModal';
import useWallet from './hooks/useWallet';

/* ================================================================
 *  WalletDashboardPage — Trang chính Ví điện tử PayFlow
 *
 *  Design system: PayFlow MASTER.md
 *  - Mobile-first: CustomerLayout với bottom navigation bar
 *  - BalanceCard: số dư + 2 nút action (Nạp tiền / Chuyển tiền)
 *  - TransactionList: lịch sử ledger + infinite scroll
 *  - TopupModal + TransferModal: Drawer bottom (mobile-friendly)
 *  - useWallet hook: quản lý state, loading, refetch
 * ================================================================ */
export default function WalletDashboardPage() {
    const { wallet, ledgerEntries, loading, loadingMore, error, hasMore, loadMore, refetch } =
        useWallet();

    const [topupOpen, setTopupOpen] = useState(false);
    const [transferOpen, setTransferOpen] = useState(false);

    return (
        <CustomerLayout>
            {/* Error khi không tải được dữ liệu */}
            {error && !loading && (
                <Alert
                    message={error}
                    type="error"
                    showIcon
                    closable
                    style={{ borderRadius: 10 }}
                />
            )}

            {/* Thẻ số dư */}
            <BalanceCard
                wallet={wallet}
                loading={loading}
                onTopup={() => setTopupOpen(true)}
                onTransfer={() => setTransferOpen(true)}
            />

            {/* Danh sách giao dịch */}
            <TransactionList
                entries={ledgerEntries}
                loading={loading}
                loadingMore={loadingMore}
                hasMore={hasMore}
                onLoadMore={loadMore}
            />

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
