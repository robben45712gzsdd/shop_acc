# Hướng Dẫn Xác Thực Email & Đổi Mật Khẩu

## 📋 Tổng Quan

Tính năng xác thực email mới cho phép người dùng:
1. Truy cập link xác thực từ email: `/verify_mail?token=xxx`
2. Nhập mã OTP 6 chữ số được gửi đến email
3. Xác thực thành công → Tự động chuyển sang form đổi mật khẩu
4. Cập nhật mật khẩu và đăng nhập lại

## 🗂️ Cấu Trúc File

```
pages/
  └── VerifyMail.vue                # Trang xác thực email chính
components/Modals/
  └── VerifyMailModal.vue           # Modal xác thực (optional, cho flow khác)
api/
  └── auth.js                       # API methods bổ sung
store/
  └── modals.js                     # State management cho modals
```

## 🔧 API Methods (auth.js)

```javascript
// 1. Xác thực token từ URL
authApi.verifyMailToken({ token: 'xxx' })
// Response: { success: true/false, message: '...' }

// 2. Xác thực mã OTP
authApi.verifyMail({ 
  email: 'user@example.com', 
  code: '123456' 
})
// Response: { success: true/false, message: '...' }

// 3. Gửi lại mã OTP
authApi.resendVerifyCode({ email: 'user@example.com' })
// Response: { success: true/false, message: '...' }

// 4. Cập nhật mật khẩu sau xác thực
authApi.updatePasswordAfterVerify({
  token: 'xxx',
  newPassword: 'password123',
  confirmPassword: 'password123'
})
// Response: { success: true/false, message: '...' }
```

## 🎯 Luồng Hoạt Động

### Flow 1: Xác thực qua URL (VerifyMail Page)

```
1. Người dùng nhận email + link: /verify_mail?token=731377
2. Click link → Trang VerifyMail.vue load
3. Lấy token từ URL, gửi verifyMailToken()
4. Nếu token hợp lệ → Hiển thị form OTP input
5. Người dùng nhập 6 chữ số OTP
6. Click Xác Thực → gửi verifyMail()
7. Thành công → Hiển thị success message
8. Tự động chuyển → Form đổi mật khẩu
9. Cập nhật mật khẩu → Redirect /Login
```

### Flow 2: Xác thực qua Modal (VerifyMailModal Component)

```
1. Trigger từ UI: this.$store.commit('modals/SHOW_VERIFY_MAIL_MODAL')
2. Modal hiển thị với OTP input (6 trường)
3. User nhập 6 chữ số → auto focus field kế tiếp
4. Click Xác Thực → verifyMail()
5. Thành công → Hiển thị success icon
6. Click Tiếp Tục → Modal đóng, ChangePasswordModal mở
7. Quá trình giống Flow 1 từ bước 8
```

## 📱 Sử Dụng Component

### VerifyMailModal (trong template)
```vue
<!-- Đã được thêm vào layouts/default.vue -->
<VerifyMailModal />

<!-- Trigger modal từ code -->
<script>
this.$store.commit('modals/SHOW_VERIFY_MAIL_MODAL')
</script>
```

### VerifyMail Page (Route)
```
URL: /verify_mail?token=731377

Các state page:
- Loading: Kiểm tra token từ backend
- Verified + Form: Hiển thị OTP input
- Verified + Success: Hiển thị success message
- Change Password: Form đổi mật khẩu
- Error: Hiển thị lỗi (token hết hạn, etc)
```

## 🎨 UI Features

### OTP Input
- 6 trường input riêng biệt
- Auto-focus field kế tiếp khi nhập số
- Auto-backspace khi xóa
- Validation: Chỉ nhập số 0-9

### Countdown Timer
- Đếm ngược 5 phút (300 giây)
- Hiển thị format MM:SS
- Khi hết hạn → Hiển thị nút "Gửi Lại Mã"

### Password Strength
- Real-time validation
- Hiển thị thanh độ mạnh: Yếu / Trung Bình / Mạnh
- Yêu cầu tối thiểu 8 ký tự
- Kiểm tra: chữ hoa, chữ thường, số, ký tự đặc biệt

### Animations
- Slide Down: Modal/Form hiển thị
- Pulse: Icon success
- Spin: Loading spinner
- Fade: Transition giữa state

## 🔐 Security Notes

1. **Token Validation**: Token phải hợp lệ & chưa hết hạn
2. **OTP Code**: 6 chữ số, có thể set thời hạn
3. **Resend Limit**: Giới hạn số lần gửi lại (backend xử lý)
4. **Password Requirements**: Tối thiểu 8 ký tự
5. **Redirect**: Sau xác thực → /Login (buộc đăng nhập lại)

## 🌍 Responsive Design

✅ Desktop: Layout 2 column (success icon + form)
✅ Tablet: Stack layout 1 column  
✅ Mobile: Full width, optimized touch targets

## 🎯 Store Mutations

```javascript
// Việc hiển thị/ẩn modals
this.$store.commit('modals/SHOW_VERIFY_MAIL_MODAL')
this.$store.commit('modals/HIDE_VERIFY_MAIL_MODAL')
this.$store.commit('modals/SHOW_CHANGE_PASSWORD_MODAL')
this.$store.commit('modals/HIDE_CHANGE_PASSWORD_MODAL')
```

## ⚡ Quick Integration

### 1. Backend cần implement các endpoint:
```
POST /api/Auth/VerifyMail/Token
POST /api/Auth/VerifyMail/Code
POST /api/Auth/VerifyMail/Resend
POST /api/Auth/VerifyMail/UpdatePassword
```

### 2. Email template cần bao gồm:
```
Xin chào [Username],

Xác thực email của bạn bằng link:
https://your-domain.com/verify_mail?token=731377

Link có hiệu lực trong 24 giờ.

Mã OTP: 123456
```

### 3. Testing các flows:
- Valid token → success
- Expired token → error message
- Wrong OTP → error, cho phép retry
- Password mismatch → show error
- Success → redirect login

## 📝 Các Props/Options

### VerifyMail Page
- Query param: `token` (required)
- Auto-actions: Verify token on mount, show password form after verify

### VerifyMailModal
- Computed: `maskedEmail` (che email: ab***@domain.com)
- Data: OTP array, countdown timer, form errors
- Methods: Verify, Resend, Navigate to change password

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Modal không hiển thị | Check commit mutation name trong store |
| OTP input không focus | Check ref binding `otpInputs` |
| Timer không countdown | Check `startCountdown()` method call |
| API error | Verify backend endpoint URLs match |
| Email không nhận | Check email backend integration |

## 📚 Related Components

- **ChangePassword.vue**: Used after email verification
- **PolicyModal.vue**: Similar modal structure
- **CookieConsent.vue**: Global modal pattern

