import { useState, useEffect, useCallback } from 'react';
import walletApi from '../services/walletApi';
import type { WalletResponse, LedgerEntry } from '../types/wallet.types';

/* ================================================================
 *  useWallet — Custom hook quản lý state ví & lịch sử giao dịch
 *
 *  - Fetch wallet balance + ledger (page 0) khi mount
 *  - Cung cấp hàm loadMore để tải thêm ledger
 *  - Cung cấp hàm refetch để reload sau topup/transfer
 * ================================================================ */

interface UseWalletReturn {
    /** Thông tin ví */
    wallet: WalletResponse | null;
    /** Danh sách ledger (tích luỹ qua các trang) */
    ledgerEntries: LedgerEntry[];
    /** Loading lần đầu */
    loading: boolean;
    /** Loading khi tải thêm ledger */
    loadingMore: boolean;
    /** Thông báo lỗi */
    error: string | null;
    /** Còn trang ledger tiếp theo */
    hasMore: boolean;
    /** Tải thêm trang ledger tiếp theo */
    loadMore: () => Promise<void>;
    /** Refetch wallet + ledger từ đầu (sau topup/transfer) */
    refetch: () => Promise<void>;
}

const LEDGER_PAGE_SIZE = 20;

export default function useWallet(): UseWalletReturn {
    const [wallet, setWallet] = useState<WalletResponse | null>(null);
    const [ledgerEntries, setLedgerEntries] = useState<LedgerEntry[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    /** Fetch wallet + ledger page 0 */
    const fetchInitial = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [walletRes, ledgerRes] = await Promise.all([
                walletApi.getMyWallet(),
                walletApi.getMyLedger(0, LEDGER_PAGE_SIZE),
            ]);

            if (walletRes.data.success) {
                setWallet(walletRes.data.data);
            }

            if (ledgerRes.data.success) {
                const page = ledgerRes.data.data;
                setLedgerEntries(page.content);
                setCurrentPage(0);
                setHasMore(!page.last);
            }
        } catch {
            setError('Không thể tải thông tin ví. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    }, []);

    /** Load more ledger entries */
    const loadMore = useCallback(async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        try {
            const nextPage = currentPage + 1;
            const res = await walletApi.getMyLedger(nextPage, LEDGER_PAGE_SIZE);
            if (res.data.success) {
                const page = res.data.data;
                setLedgerEntries((prev) => [...prev, ...page.content]);
                setCurrentPage(nextPage);
                setHasMore(!page.last);
            }
        } catch {
            // Silently fail — user can retry
        } finally {
            setLoadingMore(false);
        }
    }, [currentPage, hasMore, loadingMore]);

    /** Refetch everything (after topup/transfer) */
    const refetch = useCallback(async () => {
        await fetchInitial();
    }, [fetchInitial]);

    useEffect(() => {
        fetchInitial();
    }, [fetchInitial]);

    return {
        wallet,
        ledgerEntries,
        loading,
        loadingMore,
        error,
        hasMore,
        loadMore,
        refetch,
    };
}
