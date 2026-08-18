/* ================================================================
 *  Wallet Module — Type Definitions
 *  Khớp backend response từ wallet-service & transaction-service
 * ================================================================ */

/* ---------- Generic Spring Data Page wrapper ---------- */
export interface PageResponse<T> {
    content: T[];
    totalElements: number;
    totalPages: number;
    number: number;       // current page (0-indexed)
    size: number;
    first: boolean;
    last: boolean;
    empty: boolean;
}

/* ---------- Wallet ---------- */
export interface WalletResponse {
    id: string;
    userId: string;
    balance: number;
    currency: string;
    status: string;
    createdAt: string;
}

/* ---------- Ledger ---------- */
export type LedgerEntryType = 'DEBIT' | 'CREDIT';

export interface LedgerEntry {
    id: string;
    transactionId: string;
    entryType: LedgerEntryType;
    amount: number;
    balanceAfter: number;
    createdAt: string;
}

/* ---------- Topup ---------- */
export interface TopupRequest {
    amount: number;
}

export type TopupStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface TopupResponse {
    id: string;
    userId: string;
    amount: number;
    status: TopupStatus;
    createdAt: string;
}

/* ---------- Transfer ---------- */
export interface TransferRequest {
    receiverUserId: string;
    amount: number;
}

export type TransferStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'COMPENSATING';

export interface TransferResponse {
    id: string;
    type: string;
    senderUserId: string;
    receiverUserId: string;
    amount: number;
    status: TransferStatus;
    createdAt: string;
}
