/**
 * Cấu trúc response chuẩn từ Backend PayFlow API.
 * Mọi endpoint đều trả về format này.
 */
export interface ApiResponse<T = unknown> {
    /** Trạng thái thành công hay thất bại */
    success: boolean;
    /** Mã HTTP hoặc mã nghiệp vụ tùy chỉnh */
    code: number;
    /** Thông điệp mô tả kết quả */
    message: string;
    /** Thời điểm server xử lý (ISO 8601) */
    timestamp: string;
    /** Dữ liệu trả về — generic theo từng endpoint */
    data: T;
}