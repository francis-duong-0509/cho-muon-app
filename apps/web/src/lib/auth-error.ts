const AUTH_ERROR_MESSAGES: Record<string, string> = {
    INVALID_EMAIL_OR_PASSWORD: "Email hoặc mật khẩu không chính xác",
    USER_NOT_FOUND: "Không tìm thấy tài khoản với email này",
    EMAIL_NOT_VERIFIED: "Email chưa được xác thực",
    USER_ALREADY_EXISTS: "Tài khoản với email này đã tồn tại",
    TOO_MANY_REQUESTS: "Quá nhiều lần thử, vui lòng đợi vài phút",
    PASSWORD_MISMATCH: "Mật khẩu không khớp",
    AGREE_TO_TERMS: "Vui lòng đồng ý với điều khoản",
    INVALID_PHONE: "Số điện thoại không hợp lệ",
    PHONE_ALREADY_EXISTS: "Số điện thoại đã tồn tại",

    // Add more as needed
};

export function getAuthErrorMessage(code?: string): string {
    if (!code) return "Đã xảy ra lỗi, vui lòng thử lại";

    return AUTH_ERROR_MESSAGES[code] ?? "Đã xảy ra lỗi, vui lòng thử lại";
}