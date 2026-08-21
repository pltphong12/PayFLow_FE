import { useState } from 'react';
import { Drawer, InputNumber, Button, message, Alert } from 'antd';
import { PlusCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import walletApi from '../services/walletApi';

/* ================================================================
 *  TopupModal — Premium bottom drawer nạp tiền
 *
 *  Design system: PayFlow MASTER.md + ui-ux-pro-max (fintech/glassmorphism)
 *  - Drawer bottom với border-radius 20px top
 *  - Quick chips với active state rõ (accent fill + shadow glow)
 *  - Input số tiền custom styled (large, VND format)
 *  - Idempotency-Key generate tại thời điểm submit (KHÔNG khi mở)
 *  - Async flow: loading → "Đang xử lý..." → refetch sau 3s
 *  - Touch targets ≥44px (UX checklist)
 * ================================================================ */

interface TopupModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess: () => Promise<void>;
}

const QUICK_AMOUNTS = [
    { label: '50K', value: 50_000 },
    { label: '100K', value: 100_000 },
    { label: '200K', value: 200_000 },
    { label: '500K', value: 500_000 },
    { label: '1M', value: 1_000_000 },
];

export default function TopupModal({ open, onClose, onSuccess }: TopupModalProps) {
    const [amount, setAmount] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleClose = () => {
        if (loading || processing) return;
        setAmount(null);
        setErrorMsg(null);
        setProcessing(false);
        onClose();
    };

    const handleSubmit = async () => {
        if (!amount || amount < 1) {
            setErrorMsg('Vui lòng nhập số tiền hợp lệ (tối thiểu 1 ₫).');
            return;
        }

        setLoading(true);
        setErrorMsg(null);

        try {
            // Generate key ngay khi submit — không generate khi mở modal
            const idempotencyKey = crypto.randomUUID();
            const res = await walletApi.topup(amount, idempotencyKey);

            if (res.data.success) {
                setLoading(false);
                setProcessing(true);

                message.loading({ content: 'Đang xử lý nạp tiền…', key: 'topup', duration: 3 });

                setTimeout(async () => {
                    await onSuccess();
                    setProcessing(false);
                    message.success({ content: 'Nạp tiền thành công! 🎉', key: 'topup' });
                    setAmount(null);
                    onClose();
                }, 3000);
            } else {
                setErrorMsg(res.data.message || 'Nạp tiền thất bại. Vui lòng thử lại.');
                setLoading(false);
            }
        } catch (err: unknown) {
            const axiosErr = err as import('axios').AxiosError<import('../../../../types/api.types').ApiResponse>;
            const serverMsg = axiosErr.response?.data?.message;
            setErrorMsg(serverMsg || 'Không thể kết nối máy chủ. Vui lòng thử lại sau.');
            setLoading(false);
        }
    };

    const isDisabled = processing || !amount || amount < 1;

    return (
        <Drawer
            title={
                <div style={styles.drawerHeader}>
                    <div style={styles.drawerIconWrap}>
                        <ThunderboltOutlined style={{ fontSize: 16, color: '#F59E0B' }} aria-hidden="true" />
                    </div>
                    <span style={styles.drawerTitle}>Nạp tiền vào ví</span>
                </div>
            }
            placement="bottom"
            open={open}
            onClose={handleClose}
            height="auto"
            styles={{
                body: { padding: '20px 20px 32px' },
                header: {
                    padding: '16px 20px 12px',
                    borderBottom: '1px solid #F1F5F9',
                },
                wrapper: { borderRadius: '20px 20px 0 0', overflow: 'hidden' },
                mask: { backdropFilter: 'blur(4px)', background: 'rgba(15,23,42,0.5)' },
            }}
            maskClosable={!loading && !processing}
            closable={!loading && !processing}
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

            {/* Quick chips */}
            <p style={styles.sectionLabel}>Chọn nhanh</p>
            <div style={styles.chipGrid}>
                {QUICK_AMOUNTS.map((q) => {
                    const isActive = amount === q.value;
                    return (
                        <button
                            key={q.value}
                            type="button"
                            onClick={() => setAmount(q.value)}
                            style={{
                                ...styles.chip,
                                ...(isActive ? styles.chipActive : {}),
                            }}
                            aria-pressed={isActive}
                        >
                            {q.label}
                        </button>
                    );
                })}
            </div>

            {/* Custom amount input */}
            <p style={{ ...styles.sectionLabel, marginTop: 20 }}>Hoặc nhập số tiền</p>
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
                    id="input-topup-amount"
                    aria-label="Nhập số tiền nạp"
                />
                <span style={styles.currencyBadge}>₫</span>
            </div>

            {/* Submit */}
            <Button
                type="primary"
                block
                size="large"
                icon={<PlusCircleOutlined aria-hidden="true" />}
                loading={loading}
                disabled={isDisabled}
                onClick={handleSubmit}
                style={{
                    ...styles.submitBtn,
                    ...(isDisabled && !loading ? styles.submitBtnDisabled : {}),
                }}
                id="btn-submit-topup"
            >
                {processing ? 'Đang xử lý…' : 'Nạp tiền'}
            </Button>

            {processing && (
                <p style={styles.processingHint}>
                    Giao dịch đang được xử lý. Số dư sẽ được cập nhật trong vài giây.
                </p>
            )}
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
        width: 32,
        height: 32,
        borderRadius: 8,
        background: 'rgba(0, 85, 212, 0.1)',
        color: '#0055d4',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    drawerTitle: {
        fontSize: 17,
        fontWeight: 700,
        color: '#1a1c1e',
        fontFamily: "'Inter', sans-serif",
        letterSpacing: '-0.01em',
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: 700,
        color: '#737686',
        margin: '0 0 10px',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
    },
    chipGrid: {
        display: 'flex',
        gap: 8,
        flexWrap: 'wrap',
    },
    chip: {
        height: 40,
        padding: '0 18px',
        borderRadius: 10,
        border: '1.5px solid #e2e8f0',
        background: '#f8fafc',
        fontSize: 13,
        fontWeight: 700,
        color: '#424654',
        cursor: 'pointer',
        transition: 'all 180ms ease',
        fontFamily: "'Inter', sans-serif",
    },
    chipActive: {
        background: 'linear-gradient(135deg, #0055d4, #003fa3)',
        color: '#ffffff',
        borderColor: 'transparent',
        boxShadow: '0 4px 12px rgba(0, 85, 212, 0.35)',
    },
    inputWrap: {
        position: 'relative',
        marginBottom: 24,
    },
    amountInput: {
        width: '100%',
        height: 56,
        borderRadius: 12,
        fontSize: 22,
        fontWeight: 700,
        fontFamily: "'Inter', sans-serif",
        paddingRight: 48,
    },
    currencyBadge: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: 'translateY(-50%)',
        fontSize: 18,
        fontWeight: 700,
        color: '#cbd5e1',
        pointerEvents: 'none',
    },
    submitBtn: {
        height: 52,
        borderRadius: 12,
        fontWeight: 700,
        fontSize: 16,
        background: 'linear-gradient(135deg, #0055d4 0%, #003fa3 100%)',
        border: 'none',
        boxShadow: '0 4px 16px rgba(0, 85, 212, 0.3)',
        cursor: 'pointer',
        transition: 'all 200ms ease',
        fontFamily: "'Inter', sans-serif",
    },
    submitBtnDisabled: {
        background: '#e2e8f0',
        boxShadow: 'none',
    },
    processingHint: {
        textAlign: 'center',
        fontSize: 12,
        color: '#737686',
        marginTop: 12,
        lineHeight: 1.6,
    },
};
