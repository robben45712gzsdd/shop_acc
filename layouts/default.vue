<template>
  <div id="app" @click="handleOutsideClick">
    <!-- Cookie Consent -->
    <CookieConsent />

    <div id="nav" :class="{ 'dark-mode': darkMode, 'light-mode': !darkMode }">
      <!-- Marquee Banner -->
      <MarqueeBanner />

      <div class="flex w-full wrap-nav">
        <!-- LEFT / MENU -->
        <div class="nav-left flex-1" @click.stop>
          <div class="logo">
            <nuxt-link to="/">
              <img src="@/assets/images/logo/accgame247_2.gif" alt="logo" />
            </nuxt-link>
          </div>
          <ul class="menu" :class="{ active: showMenuMobile }" @click.stop="closeMenuOnClick">
            <li><nuxt-link to="/">TRANG CHỦ</nuxt-link></li>

            <li>
              <nuxt-link to="/UserAccountPage?tab=autoRechargeCard">NẠP THẺ</nuxt-link>
            </li>

            <li>
              <a href="#" @click.prevent="openRechargeModal">
                NẠP ATM/MOMO TỰ ĐỘNG 24/24
              </a>
            </li>

            <li><nuxt-link to="/FAQ">HỎI ĐÁP</nuxt-link></li>
          </ul>
        </div>



        <!-- RIGHT / ACCOUNT -->
        <div class="nav-right !flex justify-end items-center">

          <!-- Nếu chưa login -->
          <div v-if="!is_login" class="auth-group">
            <nuxt-link :to="{ name: 'Login' }" class="auth-link">
              <i class="fas fa-user"></i>
              Đăng nhập
            </nuxt-link>
            <nuxt-link :to="{ name: 'Register' }" class="auth-link register">
              <i class="fas fa-user-plus"></i>
              Đăng ký
            </nuxt-link>
          </div>

          <!-- Nếu đã login -->
          <div v-if="is_login" class="user-section">
            <nuxt-link to="/UserAccountPage" class="user-info">
              <div class="balance-box">
                <i class="fas fa-coins"></i>
                <span class="balance-amount">{{ user.balance?.toLocaleString() || 0 }}</span>
              </div>
              <div class="user-avatar">
                <i class="text-white fas fa-user-circle"></i>
              </div>
            </nuxt-link>
            <button @click="handleLogout" class="logout-btn" title="Đăng xuất">
              <i class="fas fa-power-off"></i>
            </button>
          </div>


        </div>

      </div>
    </div>

    <div class="!mt-[100px] min-h-[calc(100vh-100px)]" :class="{ 'dark-mode': darkMode, 'pb-mobile': is_login }"
      id="main">
      <Nuxt />
       <footer class="footer">
      <div class="wrap-footer">
        <!-- TOP: logo + info + liên hệ -->
        <div class="footer-top">
          <!-- Logo & Giới thiệu -->
          <div class="footer-brand">
            <nuxt-link to="/" class="flex !justify-center md:!justify-start">
              <img src="@/assets/images/logo/accgame247_2.gif" alt="ThaiSonShop Logo" class="footer-logo" />
            </nuxt-link>
            <p>
              Hệ thống bán acc tự động, đảm bảo uy tín và chất lượng.
              Luôn mang đến trải nghiệm tốt nhất cho khách hàng.
            </p>
          </div>

          <!-- Liên hệ -->
          <div class="footer-contact">
            <h4>Liên hệ</h4>
            <p>Email: <a href="mailto:tuanfbchinh@gmail.com">tuanfbchinh@gmail.com</a></p>
            <p>Hotline: <a href="tel:0123456789">0981.897.301</a></p>
            <p>Mạng xã hội:
            <div class="flex justify-center md:!justify-start items-center gap-4 mx-auto md:mx-0 mt-2">
              <a href="https://zalo.me/g/rtqsvs427" target="_blank">
                <img src="~/assets/images/zalo.webp" alt="Zalo" style="width: 30px; height: 30px;"></img>
              </a>
              <a href="https://www.facebook.com/funkymanh" target="_blank">
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
              <li><nuxt-link to="/FAQ">Câu hỏi thường gặp</nuxt-link></li>
            </ul>
          </div>
        </div>

        <!-- BOTTOM: bản quyền -->
        <div class="footer-bottom">
          <p>© 2025 SHOPACCGK.COM. All rights reserved.</p>
        </div>
      </div>
    </footer>
    </div>
    <!-- MOBILE BOTTOM NAV (only when logged in) -->
    <div v-if="is_login" class="mobile-bottom-nav">
      <nuxt-link to="/" class="nav-item" :class="{ active: $route.path === '/' }">
        <i class="fas fa-home"></i>
        <span>Trang chủ</span>
      </nuxt-link>

      <nuxt-link to="/UserAccountPage?tab=autoRechargeCard" class="nav-item"
        :class="{ active: $route.query.tab === 'autoRechargeCard' }">
        <i class="fas fa-credit-card"></i>
        <span>Nạp thẻ</span>
      </nuxt-link>

      <nuxt-link to="/UserAccountPage" class="nav-item avatar-item"
        :class="{ active: $route.path === '/UserAccountPage' && !$route.query.tab }">
        <div class="avatar-circle">
          <i class="fas fa-user"></i>
        </div>
      </nuxt-link>

      <a href="#" @click.prevent="openRechargeModal" class="nav-item">
        <i class="fas fa-wallet"></i>
        <span>Nạp tiền</span>
      </a>

      <nuxt-link to="/FAQ" class="nav-item" :class="{ active: $route.path === '/FAQ' }">
        <i class="fas fa-question-circle"></i>
        <span>Hỏi đáp</span>
      </nuxt-link>
    </div>

    <!-- FLOATING ICONS -->
    <div class="float-icons" :class="{ 'isLogined': is_login }">
      <a href="https://zalo.me/g/rtqsvs427" target="_blank" class="float-icon zalo" title="Zalo">
        <img src="@/assets/images/zalo.webp" alt="Zalo" style="width: 24px; height: 24px;" />
      </a>
      <a href="https://www.facebook.com/funkymanh" target="_blank" class="float-icon facebook" title="Facebook">
        <img src="@/assets/images/mess.png" alt="Facebook" style="width: 24px; height: 24px;" />
      </a>
    </div>
    <div>
      <!-- MODAL RECHARGE -->
      <transition name="modal">
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
                      <input type="text" :value="rechargeAmountText" placeholder="10.000"
                        @input="handleInputRecharge" />
                    </div>
                    <small>Tối thiểu 10.000 VNĐ - Tối đa 100.000.000 VNĐ</small>
                  </div>
                  <!-- QUICK BUTTONS -->
                  <div class="quick-amounts">
                    <button v-for="amt in quickAmounts" :key="amt" type="button"
                      @click="handleInputRecharge({ target: { value: (rechargeAmount + amt).toLocaleString('vi-VN') } })"
                      class="quick-btn">
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
                        <svg v-else xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960"
                          width="24px" fill="#e3e3e3">
                          <path
                            d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <!-- SUBMIT -->
                  <button @click="handleRecharge" :disabled="isLoadingCheckPayment"
                    class="flex justify-center items-center btn-submit">
                    <div v-if="!isLoadingCheckPayment" class="flex justify-center items-center gap-2">
                      <p class="!my-0 uppercase !leading-none">Xác nhận, tôi đã thanh toán</p>
                      <i class="fa-arrow-right fas"></i>
                    </div>
                    <div v-else class="flex justify-center items-center gap-2">
                      <i class="fas fa-hourglass-half"></i>
                      Đang kiểm tra...
                    </div>
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
                      <span>Không chịu trách nhiệm với mọi trường hợp chuyển sai nội dung, sai số tiền, hoặc sai tài
                        khoản
                        nhận.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-ban"></i>
                      <span>Các giao dịch nghi ngờ gian lận hoặc bất thường sẽ bị từ chối.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-user-check"></i>
                      <span>Bằng cách nạp tiền, bạn đồng ý với mọi điều khoản & xác nhận rằng thông tin cung cấp là
                        chính
                        xác.</span>
                    </div>

                    <div class="info-item">
                      <i class="fas fa-phone-alt"></i>
                      <span>Nếu gặp lỗi, vui lòng liên hệ hỗ trợ: <b>0981.897.301</b></span>
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
import payment from '~/api/payment';
export default {
  components: {
    CookieConsent: () => import('@/components/Modals/CookieConsent'),
    PromoModal: () => import('@/components/Modals/PromoModal'),
    MarqueeBanner: () => import('@/components/MarqueeBanner'),
  },

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
      isLoadingCheckPayment: false,
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

    // Check cookie consent
    const cookieConsent = localStorage.getItem('cookieConsent');
    if (!cookieConsent) {
      // Show cookie consent if not accepted yet
      setTimeout(() => {
        this.$store.commit('modals/SHOW_COOKIE_CONSENT');
      }, 1000);
    }
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
      if (!this.$store.state.isAuthenticated) {
        this.$router.push('/login');
        return;
      };
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
      try {
        this.isLoadingCheckPayment = true;
        const res = await payment.checkPayment({
          transCode: this.transactionId?.match(/TopUpCode (\w+) Trans/)[1],
        });
        if (res && res?.success) {
          this.isPaymentSuccessful = true;
          this.successPaymentAmount = this.rechargeAmount;
          this.paymentSuccessTime = new Date();

          this.playSuccessSound();

          if (this.$store.state.user_data) {
            this.$store.state.user_data.balance =
              (this.$store.state.user_data.balance || 0) + this.rechargeAmount;
          }

          this.$toast?.success?.(`Nạp tiền thành công! +${this.formatCurrency(this.rechargeAmount)}`);

          // // Auto close sau 3 giây rồi reload
          setTimeout(() => {
            this.closeRechargeModal();
            // Reload page sau khi đóng modal
            window.location.reload();
          }, 3000);
        } else {
          this.$toast?.warning?.("Chưa nhận được thanh toán. Vui lòng kiểm tra lại.");
        }
      } catch (error) {
        console.error("Error checking payment:", error);
        this.$toast?.warning?.("Đã xảy ra lỗi khi kiểm tra thanh toán.");
      } finally {
        this.isPaymentSuccessful = false;
        this.successPaymentAmount = 0;
        this.isLoadingCheckPayment = false;
        this.paymentSuccessTime = null;
      }

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
            this.$store.commit('updateBalance', Price);
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

    closeMenuOnClick(e) {
      // Close menu when clicking on any link inside the menu
      if (e.target.tagName === 'A' || e.target.closest('a')) {
        this.showMenuMobile = false;
      }
    },

    handleOutsideClick() {
      // Close menu when clicking anywhere outside
      if (this.showMenuMobile) {
        this.showMenuMobile = false;
      }
    },

    handleLogout() {
      this.$store.dispatch('logout');
      this.$router.push('/');
      this.$toast.success('Đăng xuất thành công');
    },


  },
};
</script>

<style scoped lang="scss">
// ============================================
// NAVBAR
// ============================================
#main {
  background: url("@/assets/images/logo/tai-anh-dong-dep-11.gif") no-repeat center;
  background-size: cover;
  height: 100vh;
  width: 100vw;
  overflow-y: auto;

  &::-webkit-scrollbar {
    display: none;
  }
}

#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  z-index: 1000;
  background-color: #f9ecec;

  &.dark-mode {
    height: auto;

    .wrap-nav {
      padding: 10px 20px;
      background: #1a1a1a;
      border-bottom-color: #333;
      width: 100vw;

      .nav-left .menu li a,
      .nav-left .menu li nuxt-link {
        color: #f5f5f5;
      }

      .nav-right .btn-account,
      .nav-right .btn-logout {
        color: #f5f5f5;
      }
    }

    ul {
      li {
        background: #1a1a1a;
      }
    }
  }

  .wrap-nav {
    margin: 0 auto;
    padding: 0 20px;
    height: 100%;
    display: flex;
    background-color: white;
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
          color: #af2e34;
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
        // border-bottom: 1px solid #e0e0e0;
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
  }

  .nav-right {
    display: flex;
    gap: 10px;
    align-items: center;

    // Auth group (Login + Register)
    .auth-group {
      display: flex;
      gap: 8px;
      align-items: center;

      .auth-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        text-decoration: none;
        background: transparent;
        color: #af2e34;
        border: 1px solid #af2e34;

        i {
          font-size: 14px;
        }

        &:hover {
          background: #76181D;
          border-color: #af2e34;
          color: #fff;
        }

        &.register {
          background: #af2e34;
          border: none;
          color: #fff;

          &:hover {
            background: transparent;
            border: 1px solid #af2e34;
            color: #af2e34;

          }
        }

        @media (max-width: 768px) {
          padding: 8px 6px;
          font-size: 12px;

          span {
            display: none;
          }

          i {
            margin: 0;
          }
        }
      }
    }

    // User section (when logged in)
    .user-section {
      display: flex;
      align-items: center;
      gap: 8px;

      .user-info {
        display: flex;
        align-items: center;
        gap: 8px;
        text-decoration: none;
        transition: all 0.3s ease;

        .balance-box {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: linear-gradient(135deg, #af2e34 0%, #af2e34 100%);
          border-radius: 6px;
          color: #fff;
          background: #af2e34;
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s ease;

          i {
            font-size: 16px;
            animation: coinSpin 3s linear infinite;
          }

          .balance-amount {
            white-space: nowrap;
          }

          @media (max-width: 768px) {
            padding: 8px 10px;
            font-size: 13px;
          }
        }

        .user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: darken(#af2e34, 10%);
          border: 2px solid #af2e34;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #af2e34;
          transition: all 0.3s ease;

          i {
            font-size: 20px;
          }

          @media (max-width: 768px) {
            display: none;
          }
        }

        &:hover {
          .balance-box {
            background: linear-gradient(135deg, #af2e34 0%, #ffa575 100%);
            transform: translateY(-2px);
          }

          .user-avatar {
            background: #af2e34;
            color: #fff;
            transform: rotate(10deg) scale(1.1);
          }
        }
      }

      .logout-btn {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background: rgba(239, 68, 68, 0.1);
        border: 2px solid #ef4444;
        color: #ef4444;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;

        i {
          font-size: 14px;
        }

        &:hover {
          background: #ef4444;
          color: #fff;
          transform: rotate(90deg);
        }

        &:active {
          transform: rotate(90deg) scale(0.95);
        }

        @media (max-width: 768px) {
          display: none;
        }
      }
    }

    @keyframes coinSpin {
      0% {
        transform: rotateY(0deg);
      }

      50% {
        transform: rotateY(180deg);
      }

      100% {
        transform: rotateY(360deg);
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
// MOBILE BOTTOM NAV
// ============================================
.mobile-bottom-nav {
  display: none;

  @media (max-width: 768px) {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
    z-index: 1000;
    padding: 0;
    box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
  }

  .nav-item {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    text-decoration: none;
    color: #6b7280;
    transition: all 0.2s;
    position: relative;
    padding: 8px 0;

    i {
      font-size: 20px;
      transition: all 0.2s;
    }

    span {
      font-size: 11px;
      font-weight: 500;
      transition: all 0.2s;
    }

    &:active {
      transform: scale(0.95);
    }

    &.active,
    &:hover {
      color: #c17635;

      i {
        transform: translateY(-2px);
      }
    }

    // Avatar item (center)
    &.avatar-item {
      position: relative;
      margin-top: -25px;

      .avatar-circle {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        background: linear-gradient(135deg, #f6b43b, #d5612e);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        border: 3px solid #fff;
        transition: all 0.3s;

        i {
          font-size: 24px;
          color: #fff;
          transform: none;
        }
      }

      &:active .avatar-circle {
        transform: scale(0.92);
      }

      &.active .avatar-circle,
      &:hover .avatar-circle {
        transform: scale(1.05);
      }
    }
  }
}

.dark-mode .mobile-bottom-nav {
  background: #1a1a1a;
  border-top-color: #333;

  .nav-item {
    color: #9ca3af;

    &.active,
    &:hover {
      color: #60a5fa;
    }

    &.avatar-item .avatar-circle {
      border-color: #1a1a1a;
      background: linear-gradient(135deg, #60a5fa, #93c5fd);
    }
  }
}

// ============================================
// FOOTER
// ============================================
.footer-chinhsach {
  background: url("@/assets/images/logo/footer-chinhsach.png") no-repeat center;
  background-size: cover;
}

.footer {
  background-color: #0f0f0f;
  color: #fff;
  padding: 50px 20px 20px 20px;
  margin-top: auto;

  a {
    color: #f44e56;
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
        color: #f44e56;
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

    &:hover {
      transform: translateY(-5px);
    }

    &.zalo,
    &.facebook {
      background: white;
    }
  }

  @media (max-width: 768px) {
    bottom: 30px;
    right: 10px;
    gap: 10px;

    .float-icon {
      width: 45px;
      height: 45px;
      font-size: 20px;
    }

    &.isLogined {
      bottom: 80px;
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
        color: #af2e34;
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
              background: linear-gradient(135deg, #af2e34, #ff8f5f);
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
                  background: (linear-gradient(135deg, #af2e34, #ff8f5f, #4caf50, #2196f3, #af2e34), random(4) + 1);
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
              color: #af2e34;
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
                border-color: #af2e34;
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

              transition: all 0.3s;

              &:focus {
                outline: none;
                border-color: #af2e34;
              }
            }

            button {
              padding: 10px 16px;
              background: #af2e34;
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
                background: #af2e34;
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
              background: #af2e34;
              border-color: #af2e34;
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
          }

          &:active {
            transform: translateY(0);
          }
        }

        .info-box {
          background: rgba(255, 107, 53, 0.1);
          border-left: 4px solid #af2e34;
          border-radius: 8px;
          padding: 15px;
          flex-direction: column;
          align-items: flex-start;

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
              color: #af2e34;
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
            width: auto;
            height: auto;
          }
        }

        .modal-form .quick-amounts {
          grid-template-columns: repeat(4, 1fr);
        }
      }
    }
  }
}

#nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 70px;
  background: white;

  z-index: 1000;

  &.dark-mode {
    background: #1a1a1a;


  }

  .wrap-nav {
    border-bottom: 1px solid #b5b5b557;
    margin: 0 auto;
    padding: 0 16px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  /* LEFT AREA */
  .nav-left {
    display: flex;
    align-items: center;
    gap: 28px;

    .logo img {
      height: 40px;
      transition: 0.3s ease;
    }
  }

  /* MENU DESKTOP */
  .menu {
    display: flex;
    gap: 26px;
    list-style: none;

    li a {
      text-decoration: none;
      color: #333;
      font-weight: 600;
      font-size: 14px;
      transition: 0.3s ease;

      &:hover {
        color: #af2e34;
      }
    }
  }

  /* MOBILE MENU BUTTON */
  .mobile-menu-bar {
    display: none;
    cursor: pointer;
    font-size: 26px;
    color: #bdbdbd;
    padding: 8px;
  }

  /* RIGHT ACCOUNT AREA */
  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;

    .btn-account,
    .btn-logout {
      padding: 8px 14px;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      white-space: nowrap;
      cursor: pointer;
      transition: 0.25s ease;
    }

    .btn-account {
      border: 2px solid #af2e34;
      color: #af2e34;

      &:hover {
        background: #af2e34;
        color: #fff;
      }
    }

    .btn-logout {
      background: linear-gradient(135deg, #af2e34, #ff8b57);
      color: #fff;

      &:hover {
        transform: translateY(-3px);
      }
    }
  }

  /* =============================
        MOBILE RESPONSIVE
     ============================= */
  @media (max-width: 768px) {
    .wrap-nav {
      padding: 0 12px;
    }

    .nav-left {
      gap: 12px;
    }

    .mobile-menu-bar {
      display: block;
    }

    /* Hide desktop menu */
    .menu {
      position: fixed;
      top: 70px;
      left: 0;
      right: 0;
      background: white;
      flex-direction: column;
      padding: 0;
      gap: 0;
      overflow: hidden;

      max-height: 0;
      // border-bottom: 1px solid transparent;
      transition: max-height 0.35s ease, border-color 0.3s ease;

      &.active {
        max-height: 260px;
        border-bottom-color: #e0e0e0;
      }

      li {
        padding: 16px 20px;
        border-bottom: 1px solid #eee;
        text-align: center;

        a {
          font-size: 15px;
          font-weight: 600;
        }
      }
    }

    /* RIGHT SECTION shrink */
    .nav-right {
      gap: 6px;

      .btn-account,
      .btn-logout {
        padding: 6px 10px;
        font-size: 12px;
      }
    }
  }

  /* Mobile small screens (≤480px) */
  @media (max-width: 480px) {
    .logo img {
      height: 32px;
    }

    .nav-right .btn-account,
    .nav-right .btn-logout {
      padding: 6px 8px;
      font-size: 11px;
    }

    .menu.active {
      max-height: 230px;
    }
  }
}
</style>
<style lang="scss">
// ─── BRAND PALETTE ────────────────────────────────────────────
// Primary: #af2e34 (deep crimson)
// Tints:   #8e1e24  #a62229  #be272f  #d62c35
// Shades:  #601316  #4a0e10  #340a0b
// Light accents derived from primary for light theme
// ──────────────────────────────────────────────────────────────

$brand: #6E161A;
$brand-dark: #601316;
$brand-deeper: #4a0e10;
$brand-mid: #a62229;
$brand-bright: #c62a32;

$brand-tint-1: #f9ecec; // very soft blush
$brand-tint-2: #f2d5d6; // soft rose
$brand-tint-3: #e8b5b7; // medium rose
$brand-tint-4: #d08285; // dusty rose

$gold: #c8922a; // warm accent
$gold-light: #f5ead6;
$gold-mid: #e4a93a;

$surface: #fdfbfb;
$surface-2: #ffffff;
$surface-3: #f7f2f2;
$border: #eadede;
$border-2: #dfd0d0;

$ink: #1c0a0b;
$ink-2: #4a2426;
$ink-3: #7a4a4d;
$ink-4: #b08082;

$success: #1e6e4a;
$success-bg: #e6f5ed;

// ─── FONTS ────────────────────────────────────────────────────
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Mulish:wght@400;500;600;700&display=swap');

// ─── HOMEPAGE ─────────────────────────────────────────────────
.homepage-content-footer {
  background: $brand;
  height: fit-content;
  font-family: "Roboto Condensed", sans-serif;
}

.page-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px 20px;
}

@media (max-width: 768px) {
  .page-section {
    padding: 10px;
  }
}

// ─── OVERLAY ──────────────────────────────────────────────────
.promo-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(28, 10, 11, 0.55);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
}

// ─── MODAL CARD ───────────────────────────────────────────────
.promo-modal {
  width: 100%;
  max-width: 480px;
  position: relative;
  border-radius: 20px;
  background: $surface-2;
  border: 1px solid $border-2;
  overflow: hidden;
  box-shadow:
    0 2px 4px rgba(118, 24, 29, 0.06),
    0 12px 40px rgba(118, 24, 29, 0.14),
    0 40px 80px rgba(28, 10, 11, 0.10);
}

// top accent line
.promo-modal::before {
  content: '';
  position: absolute;
  inset: 0 0 auto 0;
  height: 3px;
  background: linear-gradient(90deg, $brand-deeper, $brand, $brand-mid, $gold-mid, $brand);
  background-size: 200% 100%;
  animation: shimmer-line 3s linear infinite;
  z-index: 2;
}

@keyframes shimmer-line {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}

// ─── CLOSE BUTTON ─────────────────────────────────────────────
.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border: 1px solid $border;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.92);
  color: $ink-3;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  z-index: 10;
  font-size: 13px;

  &:hover {
    transform: rotate(90deg);
    border-color: $brand-tint-3;
    color: $brand;
    background: $brand-tint-1;
  }
}

// ─── HERO SECTION ─────────────────────────────────────────────
.modal-hero {
  position: relative;
  padding: 40px 28px 28px;
  text-align: center;
  overflow: hidden;
  background: $brand-tint-1;

  .modal-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 60% at 20% 80%, rgba(118, 24, 29, 0.10) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 80% 20%, rgba(200, 146, 42, 0.08) 0%, transparent 70%);
    pointer-events: none;
  }

  // decorative corner ornament
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 20px;
    background: $surface-2;
    clip-path: ellipse(55% 100% at 50% 100%);
  }
}

.flash-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 6px 16px;
  border-radius: 999px;
  background: $brand;
  color: #fff;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  margin-bottom: 14px;
  box-shadow: 0 4px 14px rgba(118, 24, 29, 0.30);

  i {
    font-size: 11px;
    animation: pulse-bolt 1.4s ease-in-out infinite;
  }
}

@keyframes pulse-bolt {

  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }

  50% {
    opacity: 0.7;
    transform: scale(1.2);
  }
}

.modal-title {
  margin: 0 0 16px;
  color: $brand;
  font-family: "Roboto Condensed", sans-serif;
  font-size: 30px;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
  line-height: 1;
  position: relative;
  z-index: 1;
}

.discount-wrap {
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 10px 20px 10px 16px;
  background: $brand;
  border-radius: 14px;
  position: relative;
  z-index: 1;
  box-shadow: 0 8px 24px rgba(118, 24, 29, 0.28);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 14px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent);
  }

  .discount-number {
    font-family: "Roboto Condensed", sans-serif;
    font-size: 52px;
    font-weight: 900;
    color: #fff;
    line-height: 1;
    letter-spacing: -1px;
  }

  .discount-right {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin-left: 2px;
  }

  .discount-percent {
    font-size: 22px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.95);
    line-height: 1;
  }

  .discount-text {
    font-size: 11px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.80);
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-top: 2px;
  }
}

// ─── MODAL BODY ───────────────────────────────────────────────
.modal-body {
  padding: 10px 26px;
}

.promo-desc {
  margin: 0 0 18px;
  color: $ink-2;
  text-align: center;
  line-height: 1.65;
  font-size: 14px;
}

.promo-features {
  list-style: none;
  margin: 0 0 20px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border: 1px solid $border;
    border-radius: 12px;
    background: $surface;
    transition: border-color 0.18s, background 0.18s;

    &:hover {
      border-color: $brand-tint-3;
      background: $brand-tint-1;
    }

    span:last-child {
      color: $ink-2;
      font-size: 13px;
      font-weight: 600;
      line-height: 1.4;
    }
  }
}

.feat-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: $brand-tint-1;
  border: 1px solid $brand-tint-3;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  i {
    color: $brand;
    font-size: 13px;
  }
}

// ─── COUNTDOWN ────────────────────────────────────────────────
.promo-countdown {
  padding: 16px 18px;
  border-radius: 14px;
  background: $surface-3;
  border: 1px solid $border;
  text-align: center;
}

.countdown-label {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
  color: $ink-3;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.2px;

  i {
    color: $brand;
    font-size: 12px;
  }
}

.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.time-block {
  min-width: 58px;
  padding: 10px 8px 8px;
  border-radius: 12px;
  background: $surface-2;
  border: 1.5px solid $border-2;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  overflow: hidden;

  // subtle top accent
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: $brand;
    opacity: 0.6;
  }

  .time-value {
    color: $brand;
    font-family: "Roboto Condensed", sans-serif;
    font-size: 28px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: -0.5px;
  }

  .time-label {
    margin-top: 4px;
    color: $ink-4;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.time-sep {
  color: $brand-tint-3;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 10px;
  line-height: 1;
  animation: blink-sep 1s step-end infinite;
}

@keyframes blink-sep {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.2;
  }
}

// ─── ACTIONS ──────────────────────────────────────────────────
.modal-actions {
  padding: 0 26px 16px;
  display: flex;
  gap: 10px;
}

.btn-facebook {
  flex: 1;
  min-height: 46px;
  padding: 12px 14px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 13px;
  font-weight: 700;
  background: #ffffff;
  border: 1.5px solid $border-2;
  color: $ink-2;

  i {
    color: #1877f2;
    font-size: 15px;
  }

  &:hover {
    border-color: #1877f2;
    background: #f0f5ff;
    transform: translateY(-1px);
  }
}

.btn-shop {
  flex: 1;
  min-height: 46px;
  padding: 12px 16px;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 13px;
  font-weight: 700;
  background: $brand;
  border: none;
  color: #fff;
  letter-spacing: 0.3px;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 60%);
    pointer-events: none;
  }

  i {
    font-size: 12px;
    transition: transform 0.18s;
  }

  &:hover {
    background: $brand-dark;
    transform: translateY(-1px);
    box-shadow: 0 8px 22px rgba(118, 24, 29, 0.30);

    i {
      transform: translateX(3px);
    }
  }

  &:active {
    transform: translateY(0);
  }
}

// ─── FOOTER NOTE ──────────────────────────────────────────────
.modal-footer-note {
  padding: 12px 26px 18px;
  border-top: 1px solid $border;
  display: flex;
  justify-content: center;
}

.dont-show-again {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $ink-3;
  cursor: pointer;
  font-size: 12px;
  font-weight: 500;
  user-select: none;

  input[type="checkbox"] {
    display: none;
  }

  .check-custom {
    width: 16px;
    height: 16px;
    border-radius: 4px;
    border: 1.5px solid $border-2;
    background: $surface-2;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.15s;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 8px;
      border-radius: 2px;
      background: $brand;
      opacity: 0;
      transform: scale(0);
      transition: all 0.15s;
    }
  }

  input:checked+.check-custom {
    border-color: $brand;
    background: $brand-tint-1;

    &::after {
      opacity: 1;
      transform: scale(1);
    }
  }

  span:last-child {
    transition: color 0.15s;
  }

  &:hover span:last-child {
    color: $brand;
  }
}

// ─── TRANSITIONS ──────────────────────────────────────────────
.modal-fade-enter-active {
  transition: opacity 0.26s ease;

  .promo-modal {
    animation: modal-pop-in 0.26s cubic-bezier(0.34, 1.4, 0.64, 1);
  }
}

.modal-fade-leave-active {
  transition: opacity 0.18s ease;

  .promo-modal {
    animation: modal-pop-out 0.18s ease forwards;
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop-in {
  from {
    opacity: 0;
    transform: scale(0.92) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modal-pop-out {
  from {
    opacity: 1;
    transform: scale(1) translateY(0);
  }

  to {
    opacity: 0;
    transform: scale(0.94) translateY(16px);
  }
}

// ─── RESPONSIVE ───────────────────────────────────────────────
@media (max-width: 540px) {
  .promo-modal {
    border-radius: 18px;
    max-height: 92vh;
    overflow-y: auto;
  }

  .modal-hero {
    padding: 36px 20px 26px;
  }

  .modal-title {
    font-size: 24px;
  }

  .discount-wrap .discount-number {
    font-size: 42px;
  }

  .modal-body,
  .modal-actions,
  .modal-footer-note {
    padding-left: 18px;
    padding-right: 18px;
  }

  .time-block {
    min-width: 50px;

    .time-value {
      font-size: 24px;
    }
  }

  .countdown-timer {
    gap: 6px;
  }

  .time-sep {
    font-size: 18px;
  }
}

@media (max-width: 360px) {
  .modal-actions {
    flex-direction: column;
  }
}
</style>