<template>
  <transition name="slide-up">
    <div v-if="show" class="cookie-consent" @click.stop>
      <div class="cookie-content">
        <div class="cookie-icon">🍪</div>
        <div class="cookie-text">
          <h3>🍪 Cookies & Quyền Riêng Tư</h3>
          <p>
            Website sử dụng cookies để cải thiện trải nghiệm, phân tích lưu lượng, cá nhân hóa nội dung 
            và ghi nhớ thông tin đăng nhập của bạn. Cookies giúp chúng tôi cung cấp dịch vụ tốt hơn và 
            bảo vệ tài khoản của bạn.
          </p>
          <p style="margin-top: 10px; font-size: 13px; opacity: 0.9;">
            <strong>Cookies bao gồm:</strong> Cookies cần thiết (bắt buộc), Cookies phân tích, Cookies chức năng.
            Bằng cách nhấn "Chấp Nhận", bạn đồng ý với việc sử dụng tất cả các loại cookies.
          </p>
        </div>
        <div class="cookie-actions">
          <button class="btn-accept-all" @click="acceptAllCookies">
            ✓ Chấp Nhận Tất Cả
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'CookieConsent',
  data() {
    return {
      preferences: {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true
      }
    }
  },
  computed: {
    show() {
      return this.$store.state.modals?.showCookieConsent || false
    }
  },
  mounted() {
    // Don't show automatically - wait for policy modal to trigger
    const cookieConsent = localStorage.getItem('cookieConsent')
    if (cookieConsent) {
      // Load saved preferences
      const savedPreferences = JSON.parse(cookieConsent)
      this.preferences = { ...this.preferences, ...savedPreferences }
    }
  },
  methods: {
    acceptAllCookies() {
      const consent = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('cookieConsent', JSON.stringify(consent))
      this.$store.commit('modals/HIDE_COOKIE_CONSENT')
      this.$toast.success('✓ Đã chấp nhận cookies')
      this.applyCookieSettings(consent)
      
      // Show promo modal after cookie consent
      setTimeout(() => {
        const promoShown = localStorage.getItem('promoModalShown')
        const today = new Date().toDateString()
        const lastShown = promoShown ? new Date(promoShown).toDateString() : null
        
        // Show promo once per day
        if (!promoShown || lastShown !== today) {
          this.$store.commit('modals/SHOW_PROMO_MODAL')
        }
      }, 500)
    },
    applyCookieSettings(consent) {
      // Apply cookie settings based on user preferences
      if (consent.analytics) {
        // Enable analytics tracking (Google Analytics, etc.)
        console.log('Analytics cookies enabled')
      }
      if (consent.marketing) {
        // Enable marketing cookies (Facebook Pixel, etc.)
        console.log('Marketing cookies enabled')
      }
      if (consent.functional) {
        // Enable functional cookies
        console.log('Functional cookies enabled')
      }
    }
  }
}
</script>

<style scoped>
.cookie-consent {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    background: #1e3c72;
  box-shadow: 0 -5px 25px rgba(0, 0, 0, 0.3);
  z-index: 9999;
}

.cookie-content {
  padding: 25px 30px;
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
}

.cookie-icon {
  font-size: 48px;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.cookie-text {
  flex: 1;
  min-width: 300px;
  color: #fff;
}

.cookie-text h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 700;
}

.cookie-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.95;
}

.cookie-text p {
  margin: 0 0 8px 0;
  font-size: 14px;
  line-height: 1.6;
  opacity: 0.95;
}

.cookie-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-accept-all {
  padding: 15px 20px;
  border: none;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  background: #4caf50;
  color: #fff;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
}

.btn-accept-all:hover {
  background: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(76, 175, 80, 0.5);
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.4s ease-out, opacity 0.4s;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .cookie-content {
    flex-direction: column;
    padding: 20px;
    text-align: center;
  }

  .cookie-icon {
    font-size: 36px;
  }

  .cookie-text {
    min-width: auto;
  }

  .cookie-actions {
    width: 100%;
    flex-direction: column;
  }

  .btn-accept-all {
    width: 100%;
  }
}
</style>
