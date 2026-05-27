<template>
  <transition name="modal">
    <div v-if="show" class="promo-modal-overlay" @click.stop>
      <div class="promo-modal" @click.stop>
        <button class="close-btn" @click="closeModal">
          <i class="fas fa-times"></i>
        </button>
        
        <div class="promo-content">
          <div class="promo-header">
            <h2>🎉 KHUYẾN MÃI ĐẶC BIỆT!</h2>
            <p class="promo-subtitle">Chào mừng bạn đến với ACCGAME247</p>
          </div>
          
          <div class="promo-body">
            <div class="promo-badge">GIẢM GIÁ LÊN ĐẾN</div>
            <div class="discount-number">30%</div>
            <p class="promo-description">
              Áp dụng cho <strong>TẤT CẢ TÀI KHOẢN GAME</strong><br>
              Từ ngày 30/12/2025 - 05/01/2026
            </p>
            
            <div class="promo-features">
              <div class="feature">
                <i class="fas fa-gift"></i>
                <span>Tặng thêm 10% xu khi nạp</span>
              </div>
              <div class="feature">
                <i class="fas fa-bolt"></i>
                <span>Giao dịch nhanh 24/7</span>
              </div>
              <div class="feature">
                <i class="fas fa-shield-alt"></i>
                <span>Bảo hành tài khoản 72h</span>
              </div>
            </div>
            
            <button class="btn-shop-now" @click="goToShop">
              🛒 MUA NGAY
            </button>
            
            <p class="promo-note">*Số lượng có hạn, nhanh tay đặt hàng!</p>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'PromoModal',
  computed: {
    show() {
      return this.$store.state.modals?.showPromoModal || false
    }
  },
  methods: {
    closeModal() {
      localStorage.setItem('promoModalShown', new Date().toISOString())
      this.$store.commit('modals/HIDE_PROMO_MODAL')
    },
    goToShop() {
      this.closeModal()
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.promo-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10001;
  padding: 20px;
}

.promo-modal {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    background: #ff6b6b;
  border-radius: 25px;
  max-width: 500px;
  width: 100%;
  position: relative;
  overflow: hidden;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.6);
  animation: popIn 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

@keyframes popIn {
  0% {
    transform: scale(0.5) rotate(-5deg);
    opacity: 0;
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

.close-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s;
  z-index: 10;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.1) rotate(90deg);
}

.promo-content {
  padding: 40px 30px;
  text-align: center;
  color: #fff;
}

.promo-header h2 {
  margin: 0 0 10px 0;
  font-size: 32px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.promo-subtitle {
  margin: 0 0 30px 0;
  font-size: 16px;
  opacity: 0.95;
}

.promo-body {
  background: rgba(255, 255, 255, 0.95);
  padding: 30px;
  border-radius: 20px;
  color: #333;
}

.promo-badge {
  display: inline-block;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 100%);
    background: #ffd700;
  color: #d32f2f;
  padding: 8px 20px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 700;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.discount-number {
  font-size: 80px;
  font-weight: 900;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
    color: #ff6b6b;
  line-height: 1;
  margin: 10px 0 20px 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
}

.promo-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 20px 0;
  color: #555;
}

.promo-description strong {
  color: #ee5a6f;
  font-weight: 700;
}

.promo-features {
  margin: 25px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8f9fa;
  padding: 12px 15px;
  border-radius: 10px;
  transition: all 0.3s;
}

.feature:hover {
  background: #e9ecef;
  transform: translateX(5px);
}

.feature i {
  font-size: 20px;
  color: #ff6b6b;
}

.feature span {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.btn-shop-now {
  width: 100%;
  padding: 18px;
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
    background: #ff6b6b;
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 700;
  cursor: pointer;
  margin-top: 25px;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 5px 15px rgba(238, 90, 111, 0.4);
}

.btn-shop-now:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(238, 90, 111, 0.6);
}

.promo-note {
  margin: 15px 0 0 0;
  font-size: 13px;
  color: #999;
  font-style: italic;
}

/* Animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .promo-modal {
    max-width: 95%;
  }

  .promo-content {
    padding: 30px 20px;
  }

  .promo-header h2 {
    font-size: 24px;
  }

  .discount-number {
    font-size: 60px;
  }

  .promo-body {
    padding: 20px;
  }
}
</style>
