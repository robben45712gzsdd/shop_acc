/**
 * Cấu hình Zalo Integration
 * Thay đổi số điện thoại tại đây
 */

export default {
  // Số Zalo chủ tài khoản mặc định
  DEFAULT_ZALO_PHONE: process.env.NUXT_ENV_ZALO_PHONE || "0987654321",

  // Tùy chỉnh theo danh mục (tùy chọn)
  CATEGORY_ZALO_MAP: {
    // "Liên Minh Huyền Thoại": "0981234567",
    // "PUBG": "0982345678",
    // "Genshin Impact": "0983456789",
  },

  // Thông báo cho người dùng
  MESSAGES: {
    openingZalo: "Đang mở Zalo...",
    copiedOrderCode: "Đã sao chép mã đơn hàng!",
    copyFailed: "Không thể sao chép"
  }
};
