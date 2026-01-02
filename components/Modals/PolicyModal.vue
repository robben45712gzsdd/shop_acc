<template>
  <div v-if="show" class="policy-modal-overlay" @click.stop>
    <div class="policy-modal" @click.stop>
      <div class="policy-header">
        <h2>📋 Chính Sách & Điều Khoản Sử Dụng</h2>
      </div>
      
      <div class="policy-content">
        <div class="policy-intro">
          <p><strong>Chào mừng bạn đến với ACCGAME247!</strong></p>
          <p>Vui lòng đọc kỹ các điều khoản và chính sách dưới đây trước khi sử dụng dịch vụ của chúng tôi. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận toàn bộ các điều khoản này.</p>
        </div>

        <div class="policy-section">
          <h3>📜 1. ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ</h3>
          <h4>1.1. Đối tượng áp dụng</h4>
          <ul>
            <li>Người dùng phải đủ 18 tuổi hoặc có sự đồng ý của phụ huynh/người giám hộ</li>
            <li>Chỉ dành cho mục đích cá nhân, không thương mại</li>
            <li>Người dùng chịu trách nhiệm về tất cả hoạt động dưới tài khoản của mình</li>
          </ul>
          
          <h4>1.2. Quyền và nghĩa vụ của người mua</h4>
          <ul>
            <li><strong>Quyền:</strong> Kiểm tra tài khoản trước khi thanh toán, được hỗ trợ kỹ thuật, được bảo hành theo quy định</li>
            <li><strong>Nghĩa vụ:</strong> Cung cấp thông tin chính xác, thanh toán đầy đủ, bảo mật thông tin tài khoản đã mua</li>
            <li><strong>Cam kết:</strong> Không sử dụng tài khoản vào mục đích vi phạm pháp luật, không chia sẻ/bán lại tài khoản</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>🔐 2. CHÍNH SÁCH BẢO MẬT THÔNG TIN</h3>
          <h4>2.1. Thu thập thông tin</h4>
          <ul>
            <li>Thông tin cá nhân: Họ tên, email, số điện thoại, địa chỉ</li>
            <li>Thông tin giao dịch: Lịch sử mua hàng, phương thức thanh toán</li>
            <li>Thông tin kỹ thuật: IP address, browser, cookies</li>
          </ul>
          
          <h4>2.2. Sử dụng thông tin</h4>
          <ul>
            <li>Xử lý đơn hàng và bàn giao tài khoản</li>
            <li>Cung cấp dịch vụ chăm sóc khách hàng</li>
            <li>Gửi thông báo về giao dịch, khuyến mãi (nếu đồng ý)</li>
            <li>Phân tích và cải thiện chất lượng dịch vụ</li>
            <li>Phòng chống gian lận, bảo vệ hệ thống</li>
          </ul>
          
          <h4>2.3. Bảo mật thông tin</h4>
          <ul>
            <li>Mã hóa SSL/TLS cho tất cả giao dịch</li>
            <li>Không chia sẻ thông tin với bên thứ ba (trừ trường hợp pháp luật yêu cầu)</li>
            <li>Hệ thống bảo mật 24/7, sao lưu dữ liệu định kỳ</li>
            <li>Nhân viên được đào tạo về bảo mật thông tin khách hàng</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>💳 3. CHÍNH SÁCH THANH TOÁN</h3>
          <h4>3.1. Phương thức thanh toán</h4>
          <ul>
            <li><strong>Thẻ cào điện thoại:</strong> Viettel, Mobifone, Vinaphone (chiết khấu theo tỷ lệ)</li>
            <li><strong>Chuyển khoản ngân hàng:</strong> Hỗ trợ tất cả ngân hàng nội địa, nhận tiền tự động 24/7</li>
            <li><strong>Ví điện tử:</strong> Momo, ZaloPay, VNPay (nạp nhanh, không chiết khấu)</li>
          </ul>
          
          <h4>3.2. Quy trình thanh toán</h4>
          <ul>
            <li>Bước 1: Nạp tiền vào ví tài khoản</li>
            <li>Bước 2: Chọn tài khoản game muốn mua</li>
            <li>Bước 3: Xác nhận thanh toán</li>
            <li>Bước 4: Nhận thông tin tài khoản ngay lập tức</li>
          </ul>
          
          <h4>3.3. Lưu ý về thanh toán</h4>
          <ul>
            <li>Kiểm tra kỹ thông tin trước khi chuyển khoản</li>
            <li>Ghi đúng nội dung chuyển khoản để hệ thống cộng tiền tự động</li>
            <li>Thời gian xử lý: Ngay lập tức (ATM/Momo) hoặc 5-15 phút (thẻ cào)</li>
            <li>Liên hệ ngay nếu sau 30 phút chưa nhận được tiền</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>🔄 4. CHÍNH SÁCH ĐỔI TRẢ & HOÀN TIỀN</h3>
          <h4>4.1. Điều kiện được hoàn tiền 100%</h4>
          <ul>
            <li>Tài khoản không đúng mô tả đã công bố</li>
            <li>Tài khoản bị khóa/thu hồi trong vòng 24h (không do lỗi người mua)</li>
            <li>Không thể đăng nhập được tài khoản sau khi nhận bàn giao</li>
            <li>Thông tin tài khoản sai hoàn toàn so với quảng cáo</li>
          </ul>
          
          <h4>4.2. Trường hợp KHÔNG hoàn tiền</h4>
          <ul>
            <li>Đã thay đổi thông tin tài khoản (email, mật khẩu, số điện thoại)</li>
            <li>Tài khoản bị khóa do vi phạm quy định nhà phát hành (hack, cheat, spam...)</li>
            <li>Đã sử dụng tài khoản quá 24h</li>
            <li>Không cung cấp bằng chứng khi được yêu cầu</li>
            <li>Khách hàng tự ý giao dịch tài khoản với người khác</li>
          </ul>
          
          <h4>4.3. Quy trình xử lý hoàn tiền</h4>
          <ul>
            <li>Bước 1: Gửi yêu cầu hoàn tiền kèm bằng chứng (screenshot, video)</li>
            <li>Bước 2: Bộ phận CSKH kiểm tra và phản hồi trong 24h</li>
            <li>Bước 3: Nếu hợp lệ, hoàn tiền vào ví trong 3-7 ngày làm việc</li>
            <li>Bước 4: Khách hàng có thể rút tiền hoặc tiếp tục mua sắm</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>🛡️ 5. CHÍNH SÁCH BẢO HÀNH</h3>
          <h4>5.1. Thời gian bảo hành</h4>
          <ul>
            <li><strong>Tài khoản thường:</strong> 24 giờ kể từ khi bàn giao</li>
          </ul>
          
          <h4>5.2. Điều kiện bảo hành</h4>
          <ul>
            <li>Tài khoản chưa thay đổi thông tin bảo mật</li>
            <li>Lỗi từ phía người bán (thông tin sai, tài khoản bị thu hồi)</li>
            <li>Có đầy đủ bằng chứng và thông tin giao dịch</li>
          </ul>
          
          <h4>5.3. Hình thức bảo hành</h4>
          <ul>
            <li>Đổi tài khoản tương đương giá trị</li>
            <li>Hoặc hoàn tiền 100% vào ví</li>
            <li>Bồi thường thêm 20% nếu lỗi nghiêm trọng từ hệ thống</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>📞 6. CHÍNH SÁCH HỖ TRỢ KHÁCH HÀNG</h3>
          <ul class="flex !flex-col">
            <li><strong>Hotline:</strong> 0336.856.626 (8:00 - 22:00 hàng ngày)</li>
            <li><strong>Zalo:</strong> 0336.856.626 (hỗ trợ 24/7)</li>
            <li><strong>Facebook:</strong> <a class="text-blue-400" href="https://www.facebook.com/LyMinhTuan.AdminCheckScamVn"> Tại đây</a></li>
            <li><strong>Email:</strong> tuanfbchinh@gmail.com (phản hồi trong 24h)</li>
            <li><strong>Live Chat:</strong> Trên website (8:00 - 23:00)</li>
          </ul>
        </div>

        <div class="policy-section warning">
          <h3>⚠️ 7. TUYÊN BỐ MIỄN TRỪ TRÁCH NHIỆM</h3>
          <ul>
            <li><strong>Về nhà phát hành game:</strong> Việc mua bán tài khoản có thể vi phạm điều khoản của nhà phát hành. Chúng tôi không chịu trách nhiệm nếu tài khoản bị khóa do chính sách của họ.</li>
            <li><strong>Về rủi ro:</strong> Người mua tự chịu rủi ro khi mua tài khoản. Vui lòng đọc kỹ mô tả và chính sách trước khi quyết định.</li>
            <li><strong>Về pháp luật:</strong> Người dùng phải tuân thủ pháp luật Việt Nam. Không sử dụng dịch vụ vào mục đích bất hợp pháp.</li>
            <li><strong>Về tranh chấp:</strong> Mọi tranh chấp sẽ được giải quyết trên tinh thần hòa giải, thương lượng. Nếu không đạt được thỏa thuận, sẽ đưa ra cơ quan pháp luật có thẩm quyền.</li>
          </ul>
        </div>

        <div class="policy-section">
          <h3>📝 8. CẬP NHẬT CHÍNH SÁCH</h3>
          <p>Chúng tôi có quyền cập nhật, thay đổi chính sách này bất cứ lúc nào. Mọi thay đổi sẽ được thông báo trên website. Việc tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các điều khoản mới.</p>
          <p><strong>Ngày có hiệu lực:</strong> 30/12/2025</p>
          <p><strong>Phiên bản:</strong> 1.0</p>
        </div>

        <div class="acceptance-section">
          <label class="checkbox-label">
            <input type="checkbox" v-model="accepted" />
            <span>Tôi đã đọc và đồng ý với tất cả các điều khoản, chính sách trên</span>
          </label>
        </div>
      </div>

      <div class="policy-footer">
        <button 
          class="btn-accept" 
          :disabled="!accepted" 
          @click="acceptPolicy"
        >
          ✓ Tôi Đồng Ý - Tiếp Tục Sử Dụng
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PolicyModal',
  data() {
    return {
      accepted: false
    }
  },
  computed: {
    show() {
      return this.$store.state.modals?.showPolicyModal || false
    }
  },
  mounted() {
    // Check if user has already accepted policy
    const hasAcceptedPolicy = localStorage.getItem('policyAccepted')
    if (!hasAcceptedPolicy) {
      // Show immediately
      this.$nextTick(() => {
        this.$store.commit('modals/SHOW_POLICY_MODAL')
      })
    }
  },
  methods: {
    acceptPolicy() {
      if (this.accepted) {
        localStorage.setItem('policyAccepted', 'true')
        localStorage.setItem('policyAcceptedDate', new Date().toISOString())
        this.$store.commit('modals/HIDE_POLICY_MODAL')
        this.$toast.success('Cảm ơn bạn đã đồng ý với chính sách của chúng tôi!')
        
        // Show cookie consent after policy is accepted
        setTimeout(() => {
          const cookieConsent = localStorage.getItem('cookieConsent')
          if (!cookieConsent) {
            this.$store.commit('modals/SHOW_COOKIE_CONSENT')
          }
        }, 500)
      }
    },
    declinePolicy() {
      // Không cho đóng modal nếu chưa đồng ý
      alert('Bạn cần đồng ý với chính sách để sử dụng dịch vụ!')
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
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
  overflow-y: auto;
}

.policy-modal {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.policy-header {
  padding: 30px 30px 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
}

.policy-header h2 {
  margin: 0;
  color: #fff;
  font-size: 28px;
  font-weight: 700;
  text-align: center;
}

.policy-content {
  padding: 30px;
  overflow-y: auto;
  flex: 1;
  background: #fff;
}

.policy-intro {
  background: #e3f2fd;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 25px;
  border-left: 4px solid #2196f3;
}

.policy-intro p {
  margin: 8px 0;
  color: #1565c0;
  line-height: 1.6;
}

.policy-intro strong {
  font-size: 16px;
  color: #0d47a1;
}

.policy-section {
  margin-bottom: 25px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border-left: 4px solid #667eea;
}

.policy-section.warning {
  background: #fff3cd;
  border-left-color: #ff9800;
}

.policy-section h3 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.policy-section h4 {
  margin: 15px 0 10px 0;
  color: #555;
  font-size: 16px;
  font-weight: 600;
}

.policy-section p {
  margin: 0 0 10px 0;
  color: #555;
  line-height: 1.6;
}

.policy-section ul {
  margin: 10px 0;
  padding-left: 20px;
}

.policy-section li {
  margin: 8px 0;
  color: #666;
  line-height: 1.6;
}

.acceptance-section {
  margin-top: 30px;
  padding: 20px;
  background: #e8f4f8;
  border-radius: 12px;
  border: 2px solid #667eea;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 16px;
  color: #333;
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 24px;
  height: 24px;
  margin-right: 12px;
  cursor: pointer;
}

.checkbox-label span {
  flex: 1;
}

.policy-footer {
  padding: 20px 30px 30px;
  display: flex;
  gap: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 0 0 20px 20px;
  justify-content: center;
}

.btn-accept {
  flex: 0 0 auto;
  min-width: 300px;
  padding: 15px 30px;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  color: #667eea;
}

.btn-accept:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 255, 255, 0.3);
}

.btn-accept:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .policy-modal {
    max-width: 100%;
    margin: 10px;
    max-height: 95vh;
  }

  .policy-header h2 {
    font-size: 22px;
  }

  .policy-content {
    padding: 20px;
  }

  .policy-section {
    padding: 15px;
  }

  .policy-footer {
    flex-direction: column;
  }

  .btn-accept {
    min-width: auto;
    width: 100%;
  }
}
</style>
