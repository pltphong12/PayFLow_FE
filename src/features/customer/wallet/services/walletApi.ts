import type { AxiosResponse } from 'axios';
import apiClient from '../../../../lib/axios';
import type { ApiResponse } from '../../../../types/api.types';
import type {
    WalletResponse,
    LedgerEntry,
    PageResponse,
    TopupResponse,
    TransferRequest,
    TransferResponse,
} from '../types/wallet.types';

/* ================================================================
 *  Wallet API Service
 *  Gọi các endpoint wallet-service & transaction-service qua Gateway
 * ================================================================ */

/**
 * Lấy thông tin ví của user hiện tại.
 * GET /wallets/me
 */
export async function getMyWallet(): Promise<AxiosResponse<ApiResponse<WalletResponse>>> {
    return apiClient.get<ApiResponse<WalletResponse>>('/wallets/me');
}

/**
 * Lấy lịch sử bút toán (ledger) của ví hiện tại.
 * GET /wallets/me/ledger?page={page}&size={size}
 */
export async function getMyLedger(
    page = 0,
    size = 20,
): Promise<AxiosResponse<ApiResponse<PageResponse<LedgerEntry>>>> {
    return apiClient.get<ApiResponse<PageResponse<LedgerEntry>>>('/wallets/me/ledger', {
        params: { page, size },
    });
}

/**
 * Nạp tiền vào ví.
 * POST /topup
 * Yêu cầu header Idempotency-Key (UUID, generate khi submit).
 */
export async function topup(
    amount: number,
    idempotencyKey: string,
): Promise<AxiosResponse<ApiResponse<TopupResponse>>> {
    return apiClient.post<ApiResponse<TopupResponse>>(
        '/topup',
        { amount },
        { headers: { 'Idempotency-Key': idempotencyKey } },
    );
}

/**
 * Chuyển tiền P2P.
 * POST /transfers
 * Yêu cầu header Idempotency-Key (UUID, generate khi submit).
 */
export async function transfer(
    data: TransferRequest,
    idempotencyKey: string,
): Promise<AxiosResponse<ApiResponse<TransferResponse>>> {
    return apiClient.post<ApiResponse<TransferResponse>>(
        '/transfers',
        data,
        { headers: { 'Idempotency-Key': idempotencyKey } },
    );
}

const walletApi = { getMyWallet, getMyLedger, topup, transfer };
export default walletApi;
