<template>
  <div id="app">
    <div id="nav" :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }">
      <div class="wrap-nav">

        <!-- LEFT / MENU -->
        <div class="nav-left">
          <div class="logo">
            <nuxt-link to="/">
              <img src="@/assets/images/logo.png" alt="" />
            </nuxt-link>
          </div>
          <ul class="menu" :class="{ active: showMenuMobile }">
            <li><nuxt-link to="/">TRANG CHỦ</nuxt-link></li>

            <li>
              <nuxt-link :to="{ name: 'RechargeOnline' }">NẠP THẺ</nuxt-link>
            </li>

            <li>
              <a href="#" @click.prevent="openRechargeModal">
                NẠP ATM/MOMO TỰ ĐỘNG 24/24
              </a>
            </li>
          </ul>
        </div>

        <!-- MOBILE MENU ICON -->
        <div class="mobile-menu-bar" @click="toggleMenuMobile">
          <i class="fa fa-bars"></i>
        </div>

        <!-- RIGHT / ACCOUNT -->
        <div class="nav-right">

          <!-- Nếu chưa login -->
          <nuxt-link v-if="!is_login" :to="{ name: 'Login' }">
            <div class="btn-account">
              <strong>ĐĂNG NHẬP</strong>
            </div>
          </nuxt-link>

          <!-- Nếu đã login -->
          <nuxt-link v-if="is_login" to="/UserAccountPage">
            <div class="flex font-normal btn-account">
              <span class="text-sm">TÀI KHOẢN</span>
              <span class="text-sm">Ví: {{ user.balance?.toLocaleString() || 0 }} VNĐ</span>
            </div>
          </nuxt-link>

          <!-- Signup / Logout -->
          <nuxt-link v-if="!is_login" :to="{ name: 'Register' }">
            <div class="btn-logout"><strong>ĐĂNG KÝ</strong></div>
          </nuxt-link>

          <div v-if="is_login" class="btn-logout" @click="user_logout">
            <strong>ĐĂNG XUẤT</strong>
          </div>

        </div>
      </div>
    </div>

    <div class="!mt-[70px] min-h-[calc(100vh-70px)]" :class="{ 'dark-mode': darkMode }" id="main">
      <Nuxt />
    </div>

    <footer class="footer">
      <div class="wrap-footer">
        <!-- TOP: logo + info + liên hệ -->
        <div class="footer-top">
          <!-- Logo & Giới thiệu -->
          <div class="footer-brand">
            <nuxt-link to="/">
              <img src="@/assets/images/logo.png" alt="ThaiSonShop Logo" class="footer-logo" />
            </nuxt-link>
            <p>
              Hệ thống bán acc tự động, đảm bảo uy tín và chất lượng.
              Luôn mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>

          <!-- Liên hệ -->
          <div class="footer-contact">
            <h4>Liên hệ</h4>
            <p>Email: <a href="mailto:support@thaisonshop.com">support@thaisonshop.com</a></p>
            <p>Hotline: <a href="tel:0123456789">0123 456 789</a></p>
            <p>Mạng xã hội:
            <div class="flex items-center gap-4 mt-2">
              <a href="#" target="_blank">
                <img src="~/assets/images/zalo.webp" alt="Zalo" style="width: 30px; height: 30px;"></img>
              </a>
              <a href="#" target="_blank">
                <img src="~/assets/images/mess.png" alt="Facebook" style="width: 30px; height: 30px;"></img>
              </a>
            </div>
            </p>
          </div>

          <!-- Link nhanh -->
          <div class="flex flex-col footer-links">
            <h4>Liên kết nhanh</h4>
            <ul class="flex flex-col">
              <li><nuxt-link to="/">Trang chủ</nuxt-link></li>
              <li><nuxt-link :to="{ name: 'RechargeOnline' }">Nạp thẻ</nuxt-link></li>
              <li><a href="#" @click.prevent="openRechargeModal">Nạp ATM/MOMO</a></li>
              <li><nuxt-link to="/UserAccountPage">Tài khoản</nuxt-link></li>
            </ul>
          </div>
        </div>

        <!-- BOTTOM: bản quyền -->
        <div class="footer-bottom">
          <p>© 2025 ThaiSonShop. All rights reserved.</p>
        </div>
      </div>
    </footer>

    <!-- FLOATING ICONS -->
    <div class="float-icons">
      <a href="https://zalo.me/" target="_blank" class="float-icon zalo" title="Zalo">
        <img src="@/assets/images/zalo.webp" alt="Zalo" style="width: 24px; height: 24px;" />
      </a>
      <a href="https://facebook.com/" target="_blank" class="float-icon facebook" title="Facebook">
        <img src="@/assets/images/mess.png" alt="Facebook" style="width: 24px; height: 24px;" />
      </a>
    </div>
    <div>
      <!-- MODAL RECHARGE -->
      <transition v-if="is_login" name="modal">
        <div v-if="showRechargeModal" class="modal-backdrop" @click="closeRechargeModal">
          <div class="modal-container" @click.stop>
            <button class="modal-close" @click="closeRechargeModal">
              <i class="fas fa-times"></i>
            </button>

            <div class="modal-body">
              <!-- LEFT: QR / SUCCESS -->
              <div class="modal-qr">
                <!-- QR CODE (hidden when payment successful) -->
                <transition name="qr-fade" mode="out-in">
                  <div v-if="!isPaymentSuccessful" key="qr" class="qr-content">
                    <h3>Quét mã QR</h3>
                    <div class="qr-box">
                      <img
                        :src="`https://img.vietqr.io/image/MB-3513042002-print.png?amount=${rechargeAmount}&addInfo=${transactionId}`"
                        alt="QR Code" />
                    </div>
                    <p>Dùng Momo hoặc app ngân hàng quét</p>
                  </div>

                  <!-- SUCCESS CONTENT -->
                  <div v-else key="success" class="success-content">
                
                    <!-- Success circle animation -->
                    <div class="success-wrapper">
                      <div class="success-circle">
                        <svg class="checkmark" viewBox="0 0 52 52">
                          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none" />
                          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
                        </svg>
                      </div>
                    </div>

                    <!-- Amount and details -->
                    <div class="success-details">
                      <h3 class="success-title">Thanh Toán Thành Công!</h3>
                      <p class="success-amount">+{{ formatCurrency(successPaymentAmount) }}</p>
                      <p class="success-time">
                        <i class="fas fa-check"></i>
                        {{ paymentSuccessTime ? formatPaymentTime(paymentSuccessTime) : '' }}
                      </p>
                    </div>
                  </div>
                </transition>
              </div>

              <!-- RIGHT: FORM -->
              <transition name="form-fade" mode="out-in">
                <div key="form" class="modal-form">
                  <h2>Nạp ATM/MOMO</h2>

                  <div class="form-group">
                    <label>Số Tiền Nạp (VNĐ)</label>
                    <div class="input-amount">
                      <span>₫</span>
                      <input type="text" :value="rechargeAmountText" placeholder="10.000" @input="handleInputRecharge" />
                    </div>
                    <small>Tối thiểu 10.000 VNĐ - Tối đa 100.000.000 VNĐ</small>
                  </div>
                  <!-- QUICK BUTTONS -->
                  <div class="quick-amounts">
                    <button v-for="amt in quickAmounts" :key="amt" type="button"
                      @click="handleInputRecharge({ target: { value: (rechargeAmount + amt).toLocaleString('vi-VN') } })" class="quick-btn">
                      +{{ (amt / 1000).toLocaleString() }}K
                    </button>
                  </div>

                  <!-- TRANSACTION ID -->
                  <div class="form-group">
                    <label>Nội Dung Chuyển Khoản</label>
                    <div class="txn-copy">
                      <input type="text" :value="transactionId" readonly />
                      <button type="button" @click="copyToClipboard" :class="{ copied: isCopied }">
                        <svg v-if="isCopied" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                          width="24px" fill="#e3e3e3">
                          <path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z" />
                        </svg>
                        <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px"
                          fill="#e3e3e3">
                          <path
                            d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- SUBMIT -->
                  <button @click="handleRecharge" class="flex justify-center items-center btn-submit">
                    <p class="!my-0 uppercase !leading-none">Xác nhận, tôi đã thanh toán</p>
                    <i class="fa-arrow-right fas"></i>
                  </button>

                  <!-- INFO -->
                  <div class="info-box">

                    <div class="info-item">
                      <i class="fas fa-check-circle"></i>
                      <span>Ghi chính xác nội dung chuyển khoản để hệ thống tự động xác nhận.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-clock"></i>
                      <span>Tiền sẽ được cộng trong vòng 1–5 phút.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-shield-alt"></i>
                      <span>Hệ thống chỉ xử lý giao dịch đúng thông tin và đúng mã nạp.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-exclamation-triangle"></i>
                      <span>Không chịu trách nhiệm với mọi trường hợp chuyển sai nội dung, sai số tiền, hoặc sai tài khoản
                        nhận.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-ban"></i>
                      <span>Các giao dịch nghi ngờ gian lận hoặc bất thường sẽ bị từ chối.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-user-check"></i>
                      <span>Bằng cách nạp tiền, bạn đồng ý với mọi điều khoản & xác nhận rằng thông tin cung cấp là chính
                        xác.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>Nếu gặp lỗi, vui lòng liên hệ hỗ trợ: <b>0969 999 999</b></span>
                    </div>

                  </div>

                </div>
              </transition>
            </div>
          </div>
        </div>
      </transition>

    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showMenuMobile: false,
      showRechargeModal: false,
      rechargeAmount: 10000,
      rechargeAmountText: '10.000',
      isCopied: false,
      quickAmounts: [100000, 200000, 500000, 1000000],
      // Payment Success State
      isPaymentSuccessful: false,
      successPaymentAmount: 0,
      paymentSuccessTime: null,
    };
  },

  computed: {
    darkMode() {
      return this.$store.state.darkMode;
    },

    is_login() {
      return this.$store.state.isAuthenticated;
    },

    user() {
      return this.$store.state.user_data || {};
    },

    transactionId() {
      return this.$store.state.user_data?.topUpCode;
    },
  },

  mounted() {
    // Listen for WebSocket messages
    window.addEventListener('ws-message', this.handleWsMessage);
  },

  beforeDestroy() {
    // Remove WebSocket listener
    window.removeEventListener('ws-message', this.handleWsMessage);
  },

  methods: {
    toggleMenuMobile() {
      this.showMenuMobile = !this.showMenuMobile;
    },

    openRechargeModal() {
      this.showRechargeModal = true;
      this.rechargeAmount = 10000;
      this.rechargeAmountText = '10.000';
      this.isPaymentSuccessful = false;
      document.body.style.overflow = 'hidden';
    },

    closeRechargeModal() {
      this.showRechargeModal = false;
      this.isPaymentSuccessful = false;
      this.successPaymentAmount = 0;
      document.body.style.overflow = 'auto';
    },

    handleInputRecharge(e) {
      const init = e?.target ? e.target.value : e;
      let raw = init?.toString().replace(/\D/g, "");

      if (raw === "") {
        this.rechargeAmount = 0;
        this.rechargeAmountText = "";
        return;
      }

      let value = Number(raw);
      if (value > 100000000) value = 100000000;

      this.rechargeAmount = value;
      this.rechargeAmountText = this.formatCurrency(value);
    },

    formatCurrency(value) {
      return value.toLocaleString("vi-VN");
    },

    async handleRecharge() {
      if (!this.rechargeAmount || this.rechargeAmount < 10000) {
        this.$toast?.error?.('Vui lòng nhập số tiền hợp lệ (tối thiểu 10.000 VNĐ)');
        return;
      }

      this.$toast?.info?.('Vui lòng hoàn tất chuyển khoản để xác nhận thanh toán');
    },

    handleWsMessage(event) {
      const data = event.detail;

      if (data.m === 'SendNotifyPayment' && data.dt) {
        const { IsSuccess, Price } = data.dt;

        if (IsSuccess && this.showRechargeModal) {
          this.isPaymentSuccessful = true;
          this.successPaymentAmount = Price;
          this.paymentSuccessTime = new Date();

          this.playSuccessSound();

          if (this.$store.state.user_data) {
            this.$store.state.user_data.balance = 
              (this.$store.state.user_data.balance || 0) + Price;
          }

          this.$toast?.success?.(`Nạp tiền thành công! +${this.formatCurrency(Price)}`);

          // Auto close sau 3 giây rồi reload
          setTimeout(() => {
            this.closeRechargeModal();
            // Reload page sau khi đóng modal
            window.location.reload();
          }, 3000);
        }
      }
    },

    playSuccessSound() {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioContext.currentTime;

        // First beep: 800Hz
        const osc1 = audioContext.createOscillator();
        const gain1 = audioContext.createGain();
        osc1.connect(gain1);
        gain1.connect(audioContext.destination);
        osc1.frequency.value = 800;
        osc1.type = 'sine';
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        osc1.start(now);
        osc1.stop(now + 0.1);

        // Second beep: 1000Hz
        const osc2 = audioContext.createOscillator();
        const gain2 = audioContext.createGain();
        osc2.connect(gain2);
        gain2.connect(audioContext.destination);
        osc2.frequency.value = 1000;
        osc2.type = 'sine';
        gain2.gain.setValueAtTime(0.3, now + 0.15);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
        osc2.start(now + 0.15);
        osc2.stop(now + 0.25);
      } catch (e) {
        console.log('Could not play success sound:', e);
      }
    },

    formatPaymentTime(date) {
      if (!date) return '';
      return date.toLocaleTimeString('vi-VN', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
    },

    copyToClipboard() {
      navigator.clipboard.writeText(this.transactionId);
      this.isCopied = true;
      setTimeout(() => {
        this.isCopied = false;
      }, 2000);
    },

    async user_logout() {
      if (confirm('Bạn chắc chắn muốn đăng xuất?')) {
        this.$store.dispatch('logout');
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style scoped lang="scss">
// ============================================
// NAVBAR
// ============================================

#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
  z-index: 1000;

  &.dark-mode {
    background: #1a1a1a;
    border-bottom-color: #333;

    .wrap-nav {
      .nav-left .menu li a,
      .nav-left .menu li nuxt-link {
        color: #f5f5f5;
      }

      .nav-right .btn-account,
      .nav-right .btn-logout {
        color: #f5f5f5;
      }
    }
  }

  .wrap-nav {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .nav-left {
    display: flex;
    align-items: center;
    gap: 40px;

    .logo img {
      height: 40px;
    }

    .menu {
      display: flex;
      gap: 30px;
      list-style: none;
      margin: 0;
      padding: 0;

      li a,
      li nuxt-link {
        text-decoration: none;
        color: #333;
        font-weight: 500;
        font-size: 14px;
        transition: all 0.3s;

        &:hover {
          color: #ff6b35;
        }
      }

      @media (max-width: 768px) {
        position: absolute;
        top: 70px;
        left: 0;
        right: 0;
        flex-direction: column;
        gap: 0;
        background: white;
        border-bottom: 1px solid #e0e0e0;
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.3s ease;

        &.active {
          max-height: 300px;
        }

        li {
          padding: 15px 20px;
          border-bottom: 1px solid #e0e0e0;
        }
      }
    }
  }

  .mobile-menu-bar {
    display: none;
    cursor: pointer;
    font-size: 24px;
    color: #333;

    @media (max-width: 768px) {
      display: block;
    }
  }

  .nav-right {
    display: flex;
    gap: 12px;
    align-items: center;

    .btn-account,
    .btn-logout {
      padding: 8px 16px;
      border-radius: 6px;
      text-decoration: none;
      font-size: 13px;
      font-weight: 600;
      transition: all 0.3s;
      cursor: pointer;
      border: none;
      background: none;
    }

    .btn-account {
      color: #333;
      border: 2px solid #ff6b35;

      &:hover {
        background: #ff6b35;
        color: white;
      }
    }

    .btn-logout {
      background: linear-gradient(135deg, #ff6b35, #ff8c5a);
      color: white;

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
      }
    }
  }
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

// ============================================
// FOOTER
// ============================================

.footer {
  background-color: #0f0f0f;
  color: #fff;
  font-family: 'Roboto', sans-serif;
  padding: 50px 20px 20px 20px;
  margin-top: auto;

  a {
    color: #ff6b35;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .wrap-footer {
    max-width: 1400px;
    margin: 0 auto;

    .footer-top {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 30px;
      margin-bottom: 30px;

      .footer-brand .footer-logo {
        width: 120px;
        margin-bottom: 15px;
      }

      .footer-brand p {
        font-size: 0.95rem;
        line-height: 1.6;
      }

      .footer-contact h4,
      .footer-links h4 {
        font-size: 1.1rem;
        margin-bottom: 10px;
        color: #ff6b35;
      }

      .footer-contact p,
      .footer-contact li,
      .footer-links li {
        font-size: 0.9rem;
        margin-bottom: 8px;
      }

      .footer-links ul {
        list-style: none;
        padding: 0;
      }
    }

    .footer-bottom {
      border-top: 1px solid #444;
      padding-top: 15px;
      text-align: center;
      font-size: 0.85rem;
      color: #999;
    }
  }

  @media (max-width: 768px) {
    .wrap-footer .footer-top {
      grid-template-columns: 1fr;
      text-align: center;
    }
  }
}

// ============================================
// FLOATING ICONS
// ============================================

.float-icons {
  position: fixed;
  bottom: 40px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 900;

  .float-icon {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    text-decoration: none;
    font-size: 24px;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }

    &.zalo,
    &.facebook {
      background: white;
    }
  }

  @media (max-width: 768px) {
    bottom: 20px;
    right: 10px;
    gap: 10px;

    .float-icon {
      width: 45px;
      height: 45px;
      font-size: 20px;
    }
  }
}

// ============================================
// MODAL RECHARGE
// ============================================

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
  backdrop-filter: blur(4px);

  .modal-container {
    background: #1a1a1a;
    border-radius: 12px;
    width: 100%;
    max-width: 900px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

    @keyframes slideUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .modal-close {
      position: absolute;
      top: 20px;
      right: 20px;
      background: none;
      border: none;
      font-size: 24px;
      color: #aaa;
      cursor: pointer;
      transition: all 0.3s;
      z-index: 10;

      &:hover {
        color: #ff6b35;
        transform: rotate(90deg);
      }
    }

    .modal-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      padding: 40px;
      color: #fff;

      .modal-qr {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 500px;

        h3 {
          font-size: 18px;
          font-weight: 700;
          margin-bottom: 20px;
        }

        .qr-content,
        .success-content {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .qr-box {
          background: white;
          border-radius: 20px;
          padding: 10px;

          img {
            object-fit: contain;
            border-radius: 20px;
          }
        }

        .success-content {
          gap: 25px;

          .confetti-container {
            position: absolute;
            width: 100%;
            height: 100%;
            pointer-events: none;
            overflow: hidden;

            .confetti {
              position: absolute;
              width: 12px;
              height: 12px;
              background: linear-gradient(135deg, #ff6b35, #ff8f5f);
              border-radius: 50%;
              animation: confetti-fall 2.5s ease-in infinite;
              opacity: 0.7;
              left: calc(var(--confetti-index) * 3%);

              @keyframes confetti-fall {
                0% {
                  transform: translateY(-20px) rotate(0deg);
                  opacity: 1;
                }
                100% {
                  transform: translateY(400px) rotate(720deg);
                  opacity: 0;
                }
              }

              @for $i from 0 through 30 {
                &:nth-child(#{$i}) {
                  animation-delay: ($i * 0.08s);
                  background: (linear-gradient(135deg, #ff6b35, #ff8f5f, #4caf50, #2196f3, #ff6b35), random(4) + 1);
                }
              }
            }
          }

          .success-wrapper {
            position: relative;
            width: 140px;
            height: 140px;
            display: flex;
            align-items: center;
            justify-content: center;

            .success-circle {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: rgba(76, 175, 80, 0.1);
              display: flex;
              align-items: center;
              justify-content: center;
              border: 3px solid #4caf50;
              animation: pulse-ring 2s ease-out;

              @keyframes pulse-ring {
                0% {
                  box-shadow: 0 0 0 0 rgba(76, 175, 80, 0.7);
                  transform: scale(0.95);
                }
                50% {
                  box-shadow: 0 0 0 25px rgba(76, 175, 80, 0);
                }
                100% {
                  box-shadow: 0 0 0 0 rgba(76, 175, 80, 0);
                  transform: scale(1);
                }
              }

              .checkmark {
                width: 80px;
                height: 80px;
                animation: checkmark-scale 0.6s ease-out 0.3s backwards;

                @keyframes checkmark-scale {
                  0% {
                    transform: scale(0);
                  }
                  50% {
                    transform: scale(1.2);
                  }
                  100% {
                    transform: scale(1);
                  }
                }

                .checkmark-circle {
                  stroke-dasharray: 166;
                  stroke-dashoffset: 166;
                  stroke: #4caf50;
                  stroke-width: 2;
                  animation: checkmark-circle 0.6s ease-out 0.3s backwards;

                  @keyframes checkmark-circle {
                    0% {
                      stroke-dashoffset: 166;
                    }
                    100% {
                      stroke-dashoffset: 0;
                    }
                  }
                }

                .checkmark-check {
                  stroke-dasharray: 48;
                  stroke-dashoffset: 48;
                  stroke: #4caf50;
                  stroke-width: 3;
                  stroke-linecap: round;
                  animation: checkmark-check 0.6s ease-out 0.6s backwards;

                  @keyframes checkmark-check {
                    0% {
                      stroke-dashoffset: 48;
                    }
                    100% {
                      stroke-dashoffset: 0;
                    }
                  }
                }
              }
            }
          }

          .success-details {
            text-align: center;
            animation: details-fade-in 0.5s ease 0.8s backwards;

            @keyframes details-fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .success-title {
              font-size: 24px;
              font-weight: 700;
              color: #4caf50;
              margin: 0 0 15px 0;
            }

            .success-amount {
              font-size: 28px;
              font-weight: 800;
              color: #4caf50;
              margin: 0 0 10px 0;
            }

            .success-time {
              font-size: 13px;
              color: #aaa;
              margin: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 6px;

              i {
                color: #4caf50;
              }
            }
          }
        }

        p {
          font-size: 13px;
          color: #aaa;
          text-align: center;
          margin-top: 10px;
        }
      }

      .modal-form {
        h2 {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .form-group {
          margin-bottom: 20px;

          label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 8px;
            color: #fff;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          small {
            display: block;
            font-size: 11px;
            color: #aaa;
            margin-top: 6px;
          }

          .input-amount {
            position: relative;

            span {
              position: absolute;
              left: 15px;
              top: 50%;
              transform: translateY(-50%);
              font-weight: 600;
              color: #ff6b35;
              font-size: 14px;
            }

            input {
              width: 100%;
              padding: 12px 15px 12px 35px;
              background: #0f0f0f;
              border: 2px solid #333;
              border-radius: 8px;
              color: #fff;
              font-size: 14px;
              transition: all 0.3s;

              &:focus {
                outline: none;
                border-color: #ff6b35;
                box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
              }

              &::placeholder {
                color: #555;
              }
            }
          }

          .txn-copy {
            display: flex;
            gap: 8px;

            input {
              flex: 1;
              padding: 10px 12px;
              background: #0f0f0f;
              border: 2px solid #333;
              border-radius: 8px;
              color: #fff;
              font-size: 13px;
              font-family: 'Courier New', monospace;
              transition: all 0.3s;

              &:focus {
                outline: none;
                border-color: #ff6b35;
              }
            }

            button {
              padding: 10px 16px;
              background: #ff6b35;
              color: white;
              border: none;
              border-radius: 8px;
              font-size: 12px;
              font-weight: 600;
              cursor: pointer;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.3s;
              white-space: nowrap;

              &:hover {
                background: #ff8c5a;
                transform: translateY(-2px);
              }

              &.copied {
                background: #4caf50;
              }
            }
          }
        }

        .quick-amounts {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 10px;
          margin-bottom: 20px;

          .quick-btn {
            padding: 10px;
            background: rgba(255, 107, 53, 0.1);
            border: 2px solid #333;
            border-radius: 8px;
            color: #fff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;

            &:hover {
              background: #ff6b35;
              border-color: #ff6b35;
              transform: translateY(-2px);
            }
          }
        }

        .btn-submit {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #05965291, #098d1ba6);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
          margin-bottom: 20px;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 8px rgba(0, 175, 44, 0.3);
          }

          &:active {
            transform: translateY(0);
          }
        }

        .info-box {
          background: rgba(255, 107, 53, 0.1);
          border-left: 4px solid #ff6b35;
          border-radius: 8px;
          padding: 15px;

          .info-item {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            font-size: 12px;
            color: #aaa;
            margin-bottom: 10px;

            &:last-child {
              margin-bottom: 0;
            }

            i {
              color: #ff6b35;
              margin-top: 2px;
              flex-shrink: 0;
            }
          }
        }
      }
    }
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

// TRANSITION ANIMATIONS
.qr-fade-enter-active,
.qr-fade-leave-active,
.form-fade-enter-active,
.form-fade-leave-active {
  transition: all 0.3s ease;
}

.qr-fade-enter,
.qr-fade-leave-to,
.form-fade-enter,
.form-fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-backdrop {
    .modal-container {
      .modal-body {
        grid-template-columns: 1fr;
        gap: 20px;
        padding: 20px;

        .modal-qr {
          min-height: auto;

          .qr-box img {
            width: 200px;
            height: 200px;
          }
        }

        .modal-form .quick-amounts {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }
  }
}
</style>