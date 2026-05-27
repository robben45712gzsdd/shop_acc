<template>
  <div class="homepage-content">
    <!-- PROMO MODAL -->
    <transition name="modal-fade">
      <div class="promo-modal-overlay" v-if="showPromoModal" @click.self="closePromoModal">
        <div class="promo-modal">
          <!-- Close Button -->
          <button class="modal-close" @click="closePromoModal">
            <i class="fas fa-times"></i>
          </button>

          <!-- Header với hiệu ứng -->
          <div class="modal-header">
            <div class="flash-badge">
              <i class="fas fa-bolt"></i>
              FLASH SALE
            </div>
            <h2 class="modal-title">SIÊU GIẢM GIÁ</h2>
            <div class="discount-badge">
              <span class="discount-number">50</span>
              <span class="discount-percent">%</span>
              <span class="discount-text">GIẢM</span>
            </div>
          </div>

          <!-- Content -->
          <div class="modal-body">
            <p class="promo-desc">Cơ hội sở hữu tài khoản game chất lượng với giá siêu hời!</p>
            
            <ul class="promo-features">
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Tài khoản uy tín, bảo hành 100%</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Giao dịch tức thì, an toàn tuyệt đối</span>
              </li>
              <li>
                <i class="fas fa-check-circle"></i>
                <span>Hỗ trợ 24/7, đổi trả miễn phí</span>
              </li>
            </ul>

            <div class="promo-countdown">
              <span class="countdown-label">Kết thúc sau:</span>
              <div class="countdown-timer">
                <div class="time-block">
                  <span class="time-value">{{ countdown.hours }}</span>
                  <span class="time-label">Giờ</span>
                </div>
                <span class="time-sep">:</span>
                <div class="time-block">
                  <span class="time-value">{{ countdown.minutes }}</span>
                  <span class="time-label">Phút</span>
                </div>
                <span class="time-sep">:</span>
                <div class="time-block">
                  <span class="time-value">{{ countdown.seconds }}</span>
                  <span class="time-label">Giây</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
  
            <a href="https://www.facebook.com/LyMinhTuan.AdminCheckScamVn" target="_blank" class="btn-promo-secondary">
              <i class="fab fa-facebook"></i>
              Fanpage hỗ trợ
            </a>
          </div>

          <!-- Footer -->
          <div class="modal-footer">
            <label class="dont-show-again">
              <input type="checkbox" v-model="dontShowAgain" />
              <span>Không hiển thị lại hôm nay</span>
            </label>
          </div>
        </div>
      </div>
    </transition>

    <section>
      <RechargeOnline />
      <ListGameAccount />
      <!-- <div class="hot-mini-game">
        <div class="title"><strong>mini game siêu hot</strong></div>
      </div> -->
    </section>
  </div>
</template>

<script>
import RechargeOnline from "@/components/HomeComponents/RechargeOnline";
import ListGameAccount from "@/components/HomeComponents/ListGameAccount";

export default {
  components: { RechargeOnline, ListGameAccount },

  data() {
    return {
      showPromoModal: false,
      dontShowAgain: false,
      countdown: {
        hours: '23',
        minutes: '59',
        seconds: '59'
      },
      countdownInterval: null
    };
  },

  methods: {
    closePromoModal() {
      this.showPromoModal = false;
      if (this.dontShowAgain) {
        const today = new Date().toDateString();
        localStorage.setItem('promoModalHidden', today);
      }
    },

    checkShowModal() {
      const hiddenDate = localStorage.getItem('promoModalHidden');
      const today = new Date().toDateString();
      if (hiddenDate !== today) {
        this.showPromoModal = true;
      }
    },

    startCountdown() {
      // Set end time to midnight
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);
      
      this.countdownInterval = setInterval(() => {
        const now = new Date();
        const diff = endOfDay - now;
        
        if (diff <= 0) {
          this.countdown = { hours: '00', minutes: '00', seconds: '00' };
          clearInterval(this.countdownInterval);
          return;
        }
        
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        this.countdown = {
          hours: hours.toString().padStart(2, '0'),
          minutes: minutes.toString().padStart(2, '0'),
          seconds: seconds.toString().padStart(2, '0')
        };
      }, 1000);
    }
  },

  mounted() {
    this.$store.commit('setIsDarkMode', true);
    this.checkShowModal();
    this.startCountdown();
  },

  beforeDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
};
</script>

<style lang="scss">
// ============================================
// DARK GAMING THEME VARIABLES
// ============================================
$primary: #ff4655;
$primary-dark: #d63845;
$secondary: #00d9ff;
$accent: #ffb800;
$dark: #0a0a0a;
$dark-card: #121212;
$dark-light: #1a1a1a;
$dark-border: #2a2a2a;
$text-white: #ffffff;
$text-gray: #888888;
$success: #00ff88;

.homepage-content {
  padding-top: 1px;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-size: cover;
}

// ============================================
// PROMO MODAL - GAMING STYLE
// ============================================
.promo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.promo-modal {
  background: $dark-card;
  border: 1px solid $dark-border;
  width: 100%;
  max-width: 480px;
  position: relative;
  overflow: hidden;

  // Red accent line at top
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, $primary, $accent, $primary);
    background-size: 200% 100%;
    animation: gradientSlide 3s ease infinite;
      background: $primary;
  }
}

@keyframes gradientSlide {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: $dark-light;
  border: 1px solid $dark-border;
  color: $text-gray;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: $primary;
    border-color: $primary;
    color: $text-white;
  }
}

.modal-header {
  padding: 32px 24px 20px;
  text-align: center;
  background: linear-gradient(180deg, rgba($primary, 0.1) 0%, transparent 100%);
    background: rgba($primary, 0.1);
  border-bottom: 1px solid $dark-border;
}

.flash-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px;
  background: $accent;
  color: $dark;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;

  i {
    font-size: 12px;
  }
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.modal-title {
  color: $text-white;
  font-size: 28px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 3px;
  margin: 0 0 16px 0;
}

.discount-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 12px 24px;
  background: $primary;
  position: relative;

  .discount-number {
    font-size: 48px;
    font-weight: 900;
    color: $text-white;
    line-height: 1;
  }

  .discount-percent {
    font-size: 24px;
    font-weight: 800;
    color: $text-white;
  }

  .discount-text {
    font-size: 14px;
    font-weight: 700;
    color: rgba(255,255,255,0.8);
    margin-left: 8px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.modal-body {
  padding: 24px;
}

.promo-desc {
  color: $text-gray;
  font-size: 14px;
  text-align: center;
  margin: 0 0 20px 0;
  line-height: 1.6;
}

.promo-features {
  list-style: none;
  padding: 0;
  margin: 0 0 24px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;

  li {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    background: $dark-light;
    border-left: 3px solid $success;

    i {
      color: $success;
      font-size: 16px;
    }

    span {
      color: $text-white;
      font-size: 13px;
      font-weight: 500;
    }
  }
}

.promo-countdown {
  text-align: center;
  padding: 16px;
  background: $dark-light;
  border: 1px solid $dark-border;
}

.countdown-label {
  display: block;
  color: $text-gray;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 12px;
}

.countdown-timer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.time-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 50px;

  .time-value {
    font-size: 28px;
    font-weight: 900;
    color: $primary;
  }

  .time-label {
    font-size: 10px;
    color: $text-gray;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.time-sep {
  font-size: 24px;
  font-weight: 700;
  color: $text-gray;
  margin-bottom: 16px;
}

.modal-actions {
  padding: 0 24px 24px;
  display: flex;
  gap: 12px;
}

.btn-promo-primary,
.btn-promo-secondary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 20px;
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-promo-primary {
  background: $primary;
  border: 1px solid $primary;
  color: $text-white;

  &:hover {
    background: $primary-dark;
  }

  i {
    font-size: 14px;
  }
}

.btn-promo-secondary {
  background: transparent;
  border: 1px solid $dark-border;
  color: $text-white;

  &:hover {
    border-color: $secondary;
    color: $secondary;
  }

  i {
    font-size: 14px;
    color: #1877f2;
  }
}

.modal-footer {
  padding: 16px 24px;
  background: $dark-light;
  border-top: 1px solid $dark-border;
}

.dont-show-again {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  font-size: 13px;
  color: $text-gray;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: $primary;
    cursor: pointer;
  }

  &:hover span {
    color: $text-white;
  }
}

// Modal Animation
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-active .promo-modal {
  animation: modalSlideIn 0.3s ease;
}

.modal-fade-leave-active .promo-modal {
  animation: modalSlideOut 0.2s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

@keyframes modalSlideOut {
  from {
    opacity: 1;
    transform: scale(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

// ============================================
// RESPONSIVE
// ============================================
@media (max-width: 480px) {
  .promo-modal {
    max-width: 100%;
  }

  .modal-title {
    font-size: 22px;
    letter-spacing: 2px;
  }

  .discount-badge {
    padding: 10px 20px;

    .discount-number {
      font-size: 36px;
    }

    .discount-percent {
      font-size: 18px;
    }
  }

  .modal-actions {
    flex-direction: column;
  }

  .time-block .time-value {
    font-size: 22px;
  }
}

// ============================================
// SECTION STYLES
// ============================================
section {
  max-width: var(--max-width);
  margin: 0px auto;

  .hot-mini-game {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--black-three);

    .title {
      text-transform: uppercase;
      font-size: 1.9rem;
      text-align: center;
      padding: 30px 0px;
      color: var(--yellow-active);
    }
  }
}

@media (max-width: 480px) {
  footer {
    .wrap-footer {
      p {
        line-height: 20px;
        font-size: 0.9rem;
      }
    }
  }
}
</style>
