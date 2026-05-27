<template>
  <div class="homepage-content">
    <!-- PROMO MODAL -->
    <transition name="modal-fade">
      <div class="promo-modal-overlay" v-if="showPromoModal" @click.self="closePromoModal">
        <div class="promo-modal">
          <button class="modal-close" @click="closePromoModal">
            <i class="fas fa-times"></i>
          </button>

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

          <div class="modal-actions">
            <a href="https://www.facebook.com/LyMinhTuan.AdminCheckScamVn" target="_blank" class="btn-promo-secondary">
              <i class="fab fa-facebook"></i>
              Fanpage hỗ trợ
            </a>
          </div>

        </div>
      </div>
    </transition>

    <section>
      <RechargeOnline />
      <ListGameAccount />
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
      const now = new Date();
      const endOfDay = new Date(now);
      endOfDay.setHours(23, 59, 59, 999);

      this.countdownInterval = setInterval(() => {
        const current = new Date();
        const diff = endOfDay - current;

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
    this.$store.commit('setIsDarkMode', false);
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
$primary: #f28a59;
$primary-dark: #e67540;
$primary-soft: rgba(242, 138, 89, 0.12);
$page-bg: #fbfcfd;
$surface: #ffffff;
$surface-soft: #f8fafc;
$border: #e9eef3;
$border-strong: #dde5ec;
$text: #0f172a;
$muted: #64748b;
$muted-2: #94a3b8;

.homepage-content {
  min-height: 100vh;
  background:
   radial-gradient(circle at top, rgba(242, 138, 89, 0.08), transparent 36%), linear-gradient(180deg, #ffffff 0%, #d7ffd3 38%, #f7fff4 100%);
}

.promo-modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: rgba(15, 23, 42, 0.58);
  backdrop-filter: blur(8px);
}

.promo-modal {
  width: 100%;
  max-width: 520px;
  position: relative;
  overflow: hidden;
  border-radius: 5px;
  background: $surface;
  border: 1px solid rgba(242, 138, 89, 0.16);
  box-shadow: 0 30px 80px rgba(15, 23, 42, 0.16);

  &::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 5px;
    background: linear-gradient(90deg, $primary, #f5a25d, $primary);
  }
}

.modal-close {
  position: absolute;
  top: 14px;
  right: 14px;
  width: 38px;
  height: 38px;
  border: 1px solid $border;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  color: $muted;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.18s ease;
  z-index: 2;

  &:hover {
    transform: rotate(90deg);
    border-color: rgba(242, 138, 89, 0.24);
    color: $primary;
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
  }
}

.modal-header {
  padding: 34px 28px 22px;
  text-align: center;
  background: linear-gradient(180deg, rgba(242, 138, 89, 0.08), transparent);
}

.flash-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 14px;
  border-radius: 999px;
  background: $primary-soft;
  color: $primary;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 1.8px;
  text-transform: uppercase;
  margin-bottom: 14px;

  i {
    font-size: 12px;
  }
}

.modal-title {
  margin: 0 0 14px;
  color: $text;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 900;
  letter-spacing: 2px;
  text-transform: uppercase;
}

.discount-badge {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
  padding: 12px 20px;
  background: linear-gradient(135deg, #ff0000, #ff1919);
  box-shadow: 0 12px 30px rgba(242, 138, 89, 0.22);

  .discount-number {
    font-size: 48px;
    font-weight: 900;
    color: #ffffff;
    line-height: 1;
  }

  .discount-percent {
    font-size: 24px;
    font-weight: 800;
    color: rgba(255, 255, 255, 0.95);
  }

  .discount-text {
    margin-left: 6px;
    color: rgba(255, 255, 255, 0.82);
    font-size: 13px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.modal-body {
  padding: 0 28px 24px;
}

.promo-desc {
  margin: 0 0 18px;
  color: $muted;
  text-align: center;
  line-height: 1.65;
  font-size: 14px;
}

.promo-features {
  list-style: none;
  margin: 0 0 22px;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;

  li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 12px 14px;
    border: 1px solid $border;
    border-radius: 16px;
    background: $surface-soft;

    i {
      color: $primary;
      font-size: 16px;
      margin-top: 1px;
      flex-shrink: 0;
    }

    span {
      color: $text;
      font-size: 13px;
      font-weight: 500;
      line-height: 1.5;
    }
  }
}

.promo-countdown {
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid $border;
  text-align: center;
}

.countdown-label {
  display: block;
  margin-bottom: 12px;
  color: $muted-2;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.countdown-timer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.time-block {
  min-width: 58px;
  padding: 10px 12px;
  border-radius: 14px;
  background: $surface;
  border: 1px solid $border;
  display: flex;
  flex-direction: column;
  align-items: center;

  .time-value {
    color: $primary;
    font-size: 28px;
    font-weight: 900;
    line-height: 1;
  }

  .time-label {
    margin-top: 4px;
    color: $muted-2;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.time-sep {
  margin-bottom: 12px;
  color: $muted-2;
  font-size: 24px;
  font-weight: 700;
}

.modal-actions {
  padding: 0 28px 24px;
  display: flex;
  gap: 12px;
}

.btn-promo-secondary,
.btn-promo-primary {
  flex: 1;
  min-height: 48px;
  padding: 12px 18px;
  border-radius: 14px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.18s ease;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.btn-promo-primary {
  background: linear-gradient(135deg, $primary, #f5a25d);
  border: 1px solid transparent;
  color: #ffffff;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 22px rgba(242, 138, 89, 0.18);
  }
}

.btn-promo-secondary {
  background: #ffffff;
  border: 1px solid $border-strong;
  color: $text;

  &:hover {
    transform: translateY(-1px);
    border-color: rgba(242, 138, 89, 0.32);
    color: $primary;
    box-shadow: 0 10px 22px rgba(15, 23, 42, 0.06);
  }

  i {
    color: #1877f2;
    font-size: 14px;
  }
}

.modal-footer {
  padding: 14px 28px 22px;
  border-top: 1px solid $border;
  background: linear-gradient(180deg, rgba(248, 250, 252, 0.8), #ffffff);
}

.dont-show-again {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: $muted;
  cursor: pointer;
  font-size: 13px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: $primary;
    cursor: pointer;
  }

  span {
    transition: color 0.18s ease;
  }

  &:hover span {
    color: $text;
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.24s ease;
}

.modal-fade-enter-active .promo-modal {
  animation: modalSlideIn 0.24s ease;
}

.modal-fade-leave-active .promo-modal {
  animation: modalSlideOut 0.18s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.96);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes modalSlideOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(16px) scale(0.97);
  }
}

section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 18px 16px 28px;
}

@media (max-width: 768px) {
  .promo-modal {
    max-width: 100%;
    border-radius: 20px;
  }

  .modal-header {
    padding: 30px 20px 18px;
  }

  .modal-body,
  .modal-actions,
  .modal-footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .modal-title {
    font-size: 22px;
    letter-spacing: 1.5px;
  }

  .discount-badge {
    .discount-number {
      font-size: 38px;
    }

    .discount-percent {
      font-size: 18px;
    }
  }

  .countdown-timer {
    gap: 8px;
  }

  .time-block {
    min-width: 52px;
    padding: 8px 10px;

    .time-value {
      font-size: 24px;
    }
  }
}

@media (max-width: 480px) {
  .modal-actions {
    flex-direction: column;
  }

  .countdown-timer {
    gap: 6px;
  }

  .time-sep {
    font-size: 20px;
  }
}
</style>
