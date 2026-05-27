# Hướng Dẫn Tích Hợp Zalo Gửi Mã Đơn Hàng

## Mô Tả Tính Năng

Thay vì hiển thị mật khẩu trực tiếp trong lịch sử mua hàng, người dùng sẽ:

1. **Xem mã đơn hàng** (`orderCode`) - được API trả về thay vì password
2. **Gửi Zalo** - ấn nút "Gửi Tin Nhắn Zalo" sẽ tự động:
   - Mở ứng dụng/web Zalo
   - Gửi tin nhắn có sẵn với mã đơn hàng (`orderCode`) và ID tài khoản (`accountId`)
3. **Chủ tài khoản** sẽ trả lời bằng username + password qua Zalo

## Cấu Hình Số Zalo

### Cách 1: Cấu Hình Trong Component (Nhanh Nhất)

File: `components/UserAccountComponents/AccountPurchaseHistory.vue`

Tìm method `sendZaloMessage()` và thay đổi số Zalo:

```javascript
sendZaloMessage(item) {
  // Thay "0987654321" bằng số Zalo của bạn
  const zaloPhoneNumber = "0987654321";
  // ... phần còn lại
}
```

**Ví dụ:**
```javascript
const zaloPhoneNumber = "0981234567"; // Thay bằng số của bạn
```

### Cách 2: Cấu Hình Qua Environment Variables (Khuyến Nghị)

1. Thêm vào file `.env` hoặc `.env.local`:
```
NUXT_ENV_ZALO_PHONE=0987654321
```

2. Cập nhật method `sendZaloMessage()`:
```javascript
sendZaloMessage(item) {
  const zaloPhoneNumber = process.env.NUXT_ENV_ZALO_PHONE || "0987654321";
  
  const message = `Xin chào, tôi vừa mua tài khoản với mã đơn hàng: ${item.orderCode}\n\nID tài khoản: ${item.accountId}\n\nVui lòng gửi cho tôi username và password.`;
  
  const encodedMessage = encodeURIComponent(message);
  const zaloUrl = `https://zalo.me/${zaloPhoneNumber}/?text=${encodedMessage}`;
  
  window.open(zaloUrl, '_blank');
  this.$toast?.info?.("Đang mở Zalo...");
}
```

### Cách 3: Cấu Hình Qua Constants (Dễ Quản Lý)

1. Tạo/Cập nhật file `constants/zaloConfig.js`:
```javascript
export default {
  ZALO_PHONE: process.env.NUXT_ENV_ZALO_PHONE || "0987654321"
}
```

2. Import và sử dụng trong component:
```javascript
import zaloConfig from "~/constants/zaloConfig"

// Trong method:
const zaloPhoneNumber = zaloConfig.ZALO_PHONE;
```

## Luồng Tin Nhắn Tự Động

Khi người dùng ấn nút "Gửi Tin Nhắn Zalo", tin nhắn tự động được tạo như sau:

```
Xin chào, tôi vừa mua tài khoản với mã đơn hàng: FunkyM2026051215524193DC44DC

ID tài khoản: 30881f9e-261e-467c-8607-1e19a1dd1212

Vui lòng gửi cho tôi username và password.
```

**Bạn có thể tùy chỉnh tin nhắn** bằng cách sửa method `sendZaloMessage()`:

```javascript
const message = `[TÙY CHỈNH TIN NHẮN TẠI ĐÂY]`;
```

## Cách Sử Dụng Cho Người Dùng

### Trên Web:
1. Vào "Lịch Sử Mua Hàng"
2. Ấn nút <i class="fas fa-info-circle"></i> (Chi tiết) trên đơn hàng cần nhận TK
3. Ấn nút **"Gửi Tin Nhắn Zalo"**
4. Sẽ mở trang Zalo.me tự động với tin nhắn có sẵn
5. Chỉ cần ấn gửi hoặc tuỳ chỉnh tin nhắn

### Trên Mobile:
- Nếu có app Zalo cài đặt: sẽ mở app Zalo trực tiếp
- Nếu không: sẽ mở web Zalo.me

## Cách Sao Chép Mã Đơn Hàng

Ngoài tin nhắn Zalo, người dùng có thể:
1. Sao chép mã đơn hàng (orderCode) bằng nút <i class="fas fa-copy"></i> 
2. Gửi qua kênh khác (SMS, email, v.v.)

## Tùy Chỉnh Thêm

### Đổi Số Điện Thoại Động (Multiple Chủ TK)

Nếu bạn có nhiều chủ tài khoản khác nhau:

```javascript
// Cấu hình ánh xạ danh mục -> Số Zalo
const categoryZaloMap = {
  "Liên Minh Huyền Thoại": "0981234567",
  "PUBG": "0982345678",
  "Genshin Impact": "0983456789"
};

sendZaloMessage(item) {
  const zaloPhoneNumber = categoryZaloMap[item.accountTitle] || "0987654321";
  // ... phần còn lại
}
```

### Thêm Thông Tin Vào Tin Nhắn

```javascript
const message = `
Xin chào, tôi vừa mua tài khoản game.

📝 Mã đơn hàng: ${item.orderCode}
🎮 Danh mục: ${item.accountTitle}
💰 Giá tiền: ${this.formatPrice(item.amount)}
🪪 ID tài khoản: ${item.accountId}

Vui lòng gửi cho tôi username và password.
Cảm ơn!
`;
```

## API Zalo Được Sử Dụng

- **URL:** `https://zalo.me/[phone]/?text=[message]`
- **Hỗ trợ:** Gần như tất cả các trình duyệt hiện đại
- **Mã hóa:** URL encoding (encodeURIComponent)
- **Mở:** Tab mới (window.open)

## Xử Lý Lỗi & Thông Báo

Component hiện tại sẽ:
- ✅ Hiển thị toast "Đang mở Zalo..." khi ấn nút
- ✅ Tự động sao chép mã đơn hàng với thông báo
- ✅ Xử lý popup blockers (mở trong tab/cửa sổ mới)

## Kiểm Tra Trạng Thái

Sau khi cấu hình, test:

1. Vào lịch sử mua hàng
2. Ấn chi tiết đơn hàng
3. Ấn "Gửi Tin Nhắn Zalo"
4. Kiểm tra:
   - ✅ Số điện thoại đúng?
   - ✅ Tin nhắn có thông tin đầy đủ (orderCode, accountId)?
   - ✅ Mở được Zalo (web hoặc app)?

## Lưu Ý

- Số Zalo phải là số hợp lệ ở Việt Nam (10 chữ số)
- Zalo.me link hoạt động trên hầu hết các thiết bị
- Nếu không thấy nút "Gửi Zalo", kiểm tra:
  - Browser có hỗ trợ window.open?
  - Popup có bị chặn?
