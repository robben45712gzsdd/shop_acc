<template>
  <div class="homepage-content">
    <!-- PROMO MODAL -->
    <transition name="modal-fade">
      <div class="promo-modal-overlay" v-if="showPromoModal" @click.self="closePromoModal">
        <div class="promo-modal">

          <button class="modal-close" @click="closePromoModal" aria-label="Đóng">
            <i class="fas fa-times"></i>
          </button>

          <div class="modal-hero">
            <div class="modal-hero-bg"></div>
            <div class="flash-badge">
              <i class="fas fa-bolt"></i>
              FLASH SALE
            </div>
            <h2 class="modal-title">SIÊU GIẢM GIÁ</h2>
            <div class="discount-wrap">
              <span class="discount-number">50</span>
              <div class="discount-right">
                <span class="discount-percent">%</span>
                <span class="discount-text">GIẢM</span>
              </div>
            </div>
          </div>

          <div class="modal-body">
            <p class="promo-desc">Cơ hội sở hữu tài khoản game chất lượng với giá siêu hời!</p>

            <ul class="promo-features">
              <li>
                <span class="feat-icon"><i class="fas fa-shield-alt"></i></span>
                <span>Tài khoản uy tín, bảo hành 100%</span>
              </li>
              <li>
                <span class="feat-icon"><i class="fas fa-bolt"></i></span>
                <span>Giao dịch tức thì, an toàn tuyệt đối</span>
              </li>
              <li>
                <span class="feat-icon"><i class="fas fa-headset"></i></span>
                <span>Hỗ trợ 24/7, đổi trả miễn phí</span>
              </li>
            </ul>

            <div class="promo-countdown">
              <span class="countdown-label">
                <i class="fas fa-clock"></i>
                Kết thúc sau
              </span>
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
            <a href="https://www.facebook.com/funkymanh" target="_blank" class="btn-facebook">
              <i class="fab fa-facebook-f"></i>
              Fanpage hỗ trợ
            </a>
            <button class="btn-shop" @click="closePromoModal">
              Mua ngay
              <i class="fa-arrow-right fas"></i>
            </button>
          </div>


        </div>
      </div>
    </transition>

    <section class="page-section">
      <RechargeOnline />
      <ListGameAccount />
    </section>

    <FooterChinhSach />
  </div>
</template>

<script>
import RechargeOnline from "@/components/HomeComponents/RechargeOnline";
import ListGameAccount from "@/components/HomeComponents/ListGameAccount";
import FooterChinhSach from "~/components/common/FooterChinhSach.vue";

export default {
  components: { RechargeOnline, ListGameAccount, FooterChinhSach },

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
        setTimeout(() => { this.showPromoModal = true; }, 600);
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
// ─── BRAND PALETTE ────────────────────────────────────────────
// Primary: #af2e34 (deep crimson)
// Tints:   #8e1e24  #a62229  #be272f  #d62c35
// Shades:  #601316  #4a0e10  #340a0b
// Light accents derived from primary for light theme
// ──────────────────────────────────────────────────────────────

$brand:         #6E161A;
$brand-dark:    #601316;
$brand-deeper:  #4a0e10;
$brand-mid:     #a62229;
$brand-bright:  #c62a32;

$brand-tint-1:  #f9ecec;   // very soft blush
$brand-tint-2:  #f2d5d6;   // soft rose
$brand-tint-3:  #e8b5b7;   // medium rose
$brand-tint-4:  #d08285;   // dusty rose

$gold:          #c8922a;   // warm accent
$gold-light:    #f5ead6;
$gold-mid:      #e4a93a;

$surface:       #fdfbfb;
$surface-2:     #ffffff;
$surface-3:     #f7f2f2;
$border:        #eadede;
$border-2:      #dfd0d0;

$ink:           #1c0a0b;
$ink-2:         #4a2426;
$ink-3:         #7a4a4d;
$ink-4:         #b08082;

$success:       #1e6e4a;
$success-bg:    #e6f5ed;

// ─── FONTS ────────────────────────────────────────────────────
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Mulish:wght@400;500;600;700&display=swap');

// ─── HOMEPAGE ─────────────────────────────────────────────────
.homepage-content {
  min-height: 100vh;
  background: $brand;
  font-family: "Roboto Condensed", sans-serif;
}

.page-section {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px 48px;
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
  0%   { background-position: 200% 0; }
  100% { background-position: -200% 0; }
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
  background: rgba(255,255,255,0.92);
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
      radial-gradient(ellipse 60% 60% at 20% 80%, rgba(118,24,29,0.10) 0%, transparent 70%),
      radial-gradient(ellipse 50% 50% at 80% 20%, rgba(200,146,42,0.08) 0%, transparent 70%);
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
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.7; transform: scale(1.2); }
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
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent);
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
    color: rgba(255,255,255,0.95);
    line-height: 1;
  }

  .discount-text {
    font-size: 11px;
    font-weight: 800;
    color: rgba(255,255,255,0.80);
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
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.2; }
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
    background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent 60%);
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

  input:checked + .check-custom {
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
  .promo-modal { animation: modal-pop-in 0.26s cubic-bezier(0.34, 1.4, 0.64, 1); }
}

.modal-fade-leave-active {
  transition: opacity 0.18s ease;
  .promo-modal { animation: modal-pop-out 0.18s ease forwards; }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

@keyframes modal-pop-in {
  from { opacity: 0; transform: scale(0.92) translateY(20px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
}

@keyframes modal-pop-out {
  from { opacity: 1; transform: scale(1) translateY(0); }
  to   { opacity: 0; transform: scale(0.94) translateY(16px); }
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
    .time-value { font-size: 24px; }
  }

  .countdown-timer { gap: 6px; }
  .time-sep { font-size: 18px; }
}

@media (max-width: 360px) {
  .modal-actions {
    flex-direction: column;
  }
}
</style>