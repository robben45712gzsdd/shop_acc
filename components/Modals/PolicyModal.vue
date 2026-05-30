<template>
  <div v-if="show" class="policy-modal-overlay" @click.stop>
    <div class="policy-modal" @click.stop>
      <div class="policy-header">
        <h2>Chính Sách & Điều Khoản</h2>
      </div>
      
      <div class="policy-content">
        <div class="policy-intro">
          <p><strong>Chào mừng bạn đến với SHOPACCGK</strong></p>
          <p>Vui lòng đọc kỹ các điều khoản trước khi sử dụng dịch vụ. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận toàn bộ các điều khoản này.</p>
        </div>

        <div class="policy-section">
          <h3>1. Điều Khoản Sử Dụng</h3>
          <ul>
            <li>Người dùng phải đủ 18 tuổi hoặc có sự đồng ý của phụ huynh</li>
            <li>Chỉ dành cho mục đích cá nhân, không thương mại</li>
            <li>Người dùng chịu trách nhiệm về tất cả hoạt động dưới tài khoản của mình</li>
            <li>Không sử dụng tài khoản vào mục đích vi phạm pháp luật</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>2. Chính Sách Bảo Mật</h3>
          <h4>Thu thập thông tin:</h4>
          <ul>
            <li>Họ tên, email, số điện thoại</li>
            <li>Lịch sử giao dịch và thanh toán</li>
            <li>Thông tin kỹ thuật: IP, browser, cookies</li>
          </ul>
          <h4>Sử dụng thông tin:</h4>
          <ul>
            <li>Xử lý đơn hàng và bàn giao tài khoản</li>
            <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
            <li>Gửi thông báo về giao dịch, khuyến mãi</li>
            <li>Phân tích và cải thiện chất lượng dịch vụ</li>
          </ul>
          <h4>Bảo mật:</h4>
          <ul>
            <li>Mã hóa SSL/TLS cho tất cả giao dịch</li>
            <li>Không chia sẻ thông tin với bên thứ ba</li>
            <li>Hệ thống bảo mật 24/7</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>3. Thanh Toán</h3>
          <h4>Phương thức:</h4>
          <ul>
            <li><strong>Thẻ cào:</strong> Viettel, Mobifone, Vinaphone</li>
            <li><strong>Ngân hàng:</strong> Chuyển khoản tự động 24/7</li>
            <li><strong>Ví điện tử:</strong> Momo, ZaloPay, VNPay</li>
          </ul>
          <h4>Lưu ý:</h4>
          <ul>
            <li>Kiểm tra kỹ thông tin trước khi chuyển khoản</li>
            <li>Ghi đúng nội dung để hệ thống cộng tiền tự động</li>
            <li>Thời gian xử lý: 1-15 phút</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>4. Hoàn Tiền</h3>
          <h4>Được hoàn tiền khi:</h4>
          <ul>
            <li>Tài khoản không đúng mô tả</li>
            <li>Tài khoản bị khóa trong vòng 24h (không do lỗi người mua)</li>
            <li>Không thể đăng nhập sau khi nhận bàn giao</li>
          </ul>
          <h4>Không hoàn tiền khi:</h4>
          <ul>
            <li>Đã thay đổi thông tin tài khoản</li>
            <li>Tài khoản bị khóa do vi phạm quy định nhà phát hành</li>
            <li>Đã sử dụng tài khoản quá 24h</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>5. Bảo Hành</h3>
          <ul>
            <li><strong>Thời gian:</strong> 24 giờ kể từ khi bàn giao</li>
            <li><strong>Điều kiện:</strong> Chưa thay đổi thông tin bảo mật</li>
            <li><strong>Hình thức:</strong> Đổi tài khoản tương đương hoặc hoàn tiền</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>6. Liên Hệ Hỗ Trợ</h3>
          <ul>
            <li><strong>Hotline:</strong> 0981.897.301 (8:00 - 22:00)</li>
            <li><strong>Zalo:</strong> 0981.897.301 (24/7)</li>
            <li><strong>Email:</strong> tuanfbchinh@gmail.com</li>
          </ul>
        </div>

        <div class="policy-section warning">
          <h3>7. Lưu Ý Quan Trọng</h3>
          <ul>
            <li>Việc mua bán tài khoản có thể vi phạm điều khoản của nhà phát hành game</li>
            <li>Người mua tự chịu rủi ro. Vui lòng đọc kỹ mô tả trước khi quyết định</li>
            <li>Phải tuân thủ pháp luật Việt Nam</li>
            <li>Mọi tranh chấp sẽ được giải quyết theo pháp luật</li>
          </ul>
        </div>

        <div class="acceptance-section">
          <label class="checkbox-label">
            <input type="checkbox" v-model="accepted" />
            <span>Tôi đã đọc và đồng ý với các điều khoản trên</span>
          </label>
        </div>
      </div>

      <div class="policy-footer">
        <button 
          class="btn-accept" 
          :disabled="!accepted" 
          @click="acceptPolicy"
        >
          Đồng Ý
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PolicyModal',
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      accepted: false
    }
  },
  methods: {
    acceptPolicy() {
      if (this.accepted) {
        this.$emit('close')
        this.$toast.success('Cảm ơn bạn đã đồng ý với chính sách của chúng tôi!')
      }
    }
  }
}
</script>

<style scoped>
.policy-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
}

.policy-modal {
  background: #fff;
  border-radius: 8px;
  max-width: 700px;
  width: 100%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
}

.policy-header {
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.policy-header h2 {
  margin: 0;
  color: #1f2937;
  font-size: 20px;
  font-weight: 600;
}

.policy-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.policy-content::-webkit-scrollbar {
  width: 6px;
}

.policy-content::-webkit-scrollbar-track {
  background: #f3f4f6;
}

.policy-content::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 3px;
}

.policy-intro {
  background: #f3f4f6;
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 3px solid #6b7280;
}

.policy-intro p {
  margin: 6px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}

.policy-intro strong {
  color: #1f2937;
}

.policy-section {
  margin-bottom: 20px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
  border-left: 3px solid #d1d5db;
}

.policy-section.warning {
  background: #fef3c7;
  border-left-color: #f59e0b;
}

.policy-section h3 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.policy-section h4 {
  margin: 12px 0 8px 0;
  color: #374151;
  font-size: 14px;
  font-weight: 600;
}

.policy-section p {
  margin: 0 0 8px 0;
  color: #4b5563;
  line-height: 1.6;
  font-size: 14px;
}

.policy-section ul {
  margin: 8px 0;
  padding-left: 20px;
}

.policy-section li {
  margin: 6px 0;
  color: #6b7280;
  line-height: 1.5;
  font-size: 13px;
}

.policy-section li strong {
  color: #374151;
}

.policy-section li a {
  color: #2563eb;
  text-decoration: none;
}

.policy-section li a:hover {
  text-decoration: underline;
}

.acceptance-section {
  margin-top: 20px;
  padding: 16px;
  background: #f0f9ff;
  border-radius: 6px;
  border: 1px solid #bae6fd;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin-right: 10px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.checkbox-label span {
  flex: 1;
}

.policy-footer {
  padding: 16px 24px;
  display: flex;
  justify-content: center;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  border-radius: 0 0 8px 8px;
}

.btn-accept {
  min-width: 200px;
  padding: 10px 24px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  background: #3b82f6;
  color: #fff;
}

.btn-accept:hover:not(:disabled) {
  background: #2563eb;
}

.btn-accept:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background: #9ca3af;
}

@media (max-width: 768px) {
  .policy-modal {
    max-width: 100%;
    margin: 0;
    max-height: 100vh;
    border-radius: 0;
  }

  .policy-header h2 {
    font-size: 18px;
  }

  .policy-content {
    padding: 16px;
  }

  .policy-section {
    padding: 12px;
  }

  .btn-accept {
    width: 100%;
    min-width: auto;
  }
}
</style>
