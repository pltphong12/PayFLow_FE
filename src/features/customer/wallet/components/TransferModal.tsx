import { useState } from 'react';
import { Drawer, Input, InputNumber, Button, Alert } from 'antd';
import { SendOutlined, UserOutlined, InfoCircleOutlined } from '@ant-design/icons';
import walletApi from '../services/walletApi';
import type { AxiosError } from 'axios';
import type { ApiResponse } from '../../../../types/api.types';
import { message } from 'antd';

/* ================================================================
 *  TransferModal — Premium bottom drawer chuyển tiền P2P
 *
 *  Design system: PayFlow MASTER.md + ui-ux-pro-max (fintech)
 *  - Drawer bottom với blurred backdrop
 *  - UUID input với icon + helper text rõ ràng
 *  - Lỗi riêng biệt: 409 (số dư / receiver inactive) vs 400 (not found)
 *  - COMPENSATING state → explanatory banner (không phải lỗi thông thường)
 *  - Touch targets ≥44px (UX checklist)
 *  - Idempotency-Key generate tại thời điểm submit
 * ================================================================ */

interface TransferModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default function TransferModal({ open, onClose, onSuccess }: TransferModalProps) {
    const [receiverId, setReceiverId] = useState('');
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleClose = () => {
        if (loading) return;
        setReceiverId('');
        setAmount(null);
        setErrorMsg(null);
        onClose();
    };

    const handleSubmit = async () => {
        setErrorMsg(null);

        const trimmedId = receiverId.trim();
        if (!trimmedId) { setErrorMsg('Vui lòng nhập mã người nhận.'); return; }
        if (!UUID_REGEX.test(trimmedId)) {
            setErrorMsg('Mã người nhận không đúng định dạng UUID. Ví dụ: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx');
            return;
        }
        if (!amount || amount < 1) { setErrorMsg('Vui lòng nhập số tiền hợp lệ (tối thiểu 1 ₫).'); return; }

        setLoading(true);

        try {
            const idempotencyKey = crypto.randomUUID();
            const res = await walletApi.transfer(
                { receiverUserId: trimmedId, amount },
                idempotencyKey,
            );

            if (res.data.success) {
                const status = res.data.data.status;
                if (status === 'COMPENSATING') {
                    message.warning(
                        'Giao dịch gặp sự cố — đang tự động hoàn tiền. Vui lòng đợi trong giây lát.',
                    );
                } else if (status === 'FAILED') {
                    setErrorMsg('Giao dịch thất bại. Vui lòng thử lại.');
                    setLoading(false);
                    return;
                } else {
                    message.success('Chuyển tiền thành công!');
                }

                await onSuccess();
                setReceiverId('');
                setAmount(null);
                onClose();
            } else {
                setErrorMsg(res.data.message || 'Chuyển tiền thất bại. Vui lòng thử lại.');
            }
        } catch (err: unknown) {
            const axiosErr = err as AxiosError<ApiResponse>;
            const status = axiosErr.response?.status;
            const serverMsg = axiosErr.response?.data?.message;

            if (status === 409) {
                setErrorMsg(serverMsg || 'Số dư không đủ hoặc tài khoản người nhận không khả dụng.');
            } else if (status === 400) {
                setErrorMsg(serverMsg || 'Người nhận không tồn tại hoặc không thể chuyển tiền cho chính mình.');
            } else {
                setErrorMsg(serverMsg || 'Không thể kết nối máy chủ. Vui lòng thử lại sau.');
            }
        } finally {
            setLoading(false);
        }
    };

    const canSubmit = receiverId.trim().length > 0 && !!amount && amount >= 1 && !loading;

    return (
        <Drawer
            title={
                <div style={styles.drawerHeader}>
                    <div style={styles.drawerIconWrap}>
                        <SendOutlined style={{ fontSize: 15, color: '#8B5CF6' }} aria-hidden="true" />
                    </div>
                    <span style={styles.drawerTitle}>Chuyển tiền</span>
                </div>
            }
            placement="bottom"
            open={open}
            onClose={handleClose}
            height="auto"
            styles={{
                body: { padding: '20px 20px 36px' },
                header: {
                    padding: '16px 20px 12px',
                    borderBottom: '1px solid #F1F5F9',
                },
                wrapper: { borderRadius: '20px 20px 0 0', overflow: 'hidden' },
                mask: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' },
            }}
            maskClosable={!loading}
            closable={!loading}
        >
            {errorMsg && (
                <Alert
                    message={errorMsg}
                    type="error"
                    showIcon
                    closable
                    onClose={() => setErrorMsg(null)}
                    style={{ marginBottom: 20, borderRadius: 10, border: 'none', background: '#FEF2F2' }}
                />
            )}

            {/* Receiver UUID */}
            <p style={styles.fieldLabel}>Mã người nhận (UUID)</p>
            <Input
                value={receiverId}
                onChange={(e) => setReceiverId(e.target.value)}
                prefix={<UserOutlined style={{ color: '#CBD5E1' }} aria-hidden="true" />}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                style={styles.textInput}
                size="large"
                id="input-transfer-receiver"
                aria-label="Nhập mã UUID người nhận"
                allowClear
            />

            {/* Helper text */}
            <div style={styles.helperBox}>
                <InfoCircleOutlined style={{ fontSize: 12, color: '#94A3B8', flexShrink: 0 }} aria-hidden="true" />
                <span style={styles.helperText}>
                    Yêu cầu người nhận cung cấp mã UUID từ trang Tài khoản. Tính năng tìm kiếm theo email sẽ có trong phiên bản tới.
                </span>
            </div>

            {/* Amount */}
            <p style={{ ...styles.fieldLabel, marginTop: 20 }}>Số tiền chuyển</p>
            <div style={styles.inputWrap}>
                <InputNumber
                    value={amount}
                    onChange={(v) => setAmount(v)}
                    min={1}
                    style={styles.amountInput}
                    placeholder="0"
                    formatter={(v) => (v ? `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '')}
                    parser={(v) => Number(v?.replace(/\./g, '') ?? 0)}
                    controls={false}
                    size="large"
                    id="input-transfer-amount"
                    aria-label="Nhập số tiền chuyển"
                />
                <span style={styles.currencyBadge}>₫</span>
            </div>

            {/* Submit */}
            <Button
                type="primary"
                block
                size="large"
                icon={<SendOutlined aria-hidden="true" />}
                loading={loading}
                disabled={!canSubmit}
                onClick={handleSubmit}
                style={{
                    ...styles.submitBtn,
                    ...(!canSubmit && !loading ? styles.submitBtnDisabled : {}),
                }}
                id="btn-submit-transfer"
            >
                Xác nhận chuyển tiền
            </Button>
        </Drawer>
    );
}

/* ---------- Inline styles ---------- */
const styles: Record<string, React.CSSProperties> = {
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
    },
    drawerIconWrap: {
        width: 30,
        height: 30,
        borderRadius: 8,
        background: 'rgba(139,92,246,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerTitle: {
        fontSize: 16,
        fontWeight: 700,
        color: '#0F172A',
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '-0.01em',
    },
    fieldLabel: {
        fontSize: 12,
        fontWeight: 700,
        color: '#64748B',
        margin: '0 0 8px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    textInput: {
        borderRadius: 12,
        height: 48,
        fontSize: 14,
        fontFamily: "'IBM Plex Sans', monospace",
        letterSpacing: '0.02em',
    },
    helperBox: {
        display: 'flex',
        alignItems: 'flex-start',
        gap: 6,
        marginTop: 8,
        padding: '10px 12px',
        background: '#F8FAFC',
        borderRadius: 8,
        border: '1px solid #E2E8F0',
    },
    helperText: {
        fontSize: 12,
        color: '#64748B',
        lineHeight: 1.6,
    },
    inputWrap: {
        position: 'relative',
        marginBottom: 28,
    },
    amountInput: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'IBM Plex Sans', sans-serif",
    },
    currencyBadge: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 18,
        fontWeight: 700,
        color: '#CBD5E1',
        pointerEvents: 'none',
    },
    submitBtn: {
        height: 52,
        borderRadius: 14,
        fontWeight: 700,
        fontSize: 16,
        background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
        border: 'none',
        boxShadow: '0 4px 16px rgba(139,92,246,0.35)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'IBM Plex Sans', sans-serif",
        letterSpacing: '0.01em',
    },
    submitBtnDisabled: {
        background: '#E2E8F0',
        boxShadow: 'none',
    },
};
