<template>
  <div class="recharge-online">
    <div class="left">
      <div class="form-title">
        <div @click="switchTab('deals')" :class="{ active: activeTab === 'deals' }" class="tab-item hot-tab">
          <i class="fa fa-fire"></i>
          <strong>ƯU ĐÃI HOT</strong>
          <span class="hot-badge pulse">HOT</span>
        </div>
       
        <div @click="switchTab('top')" :class="{ active: activeTab === 'top' }" class="tab-item">
          <i class="fa fa-trophy"></i>
          <strong>TOP NẠP</strong>
        </div>
      </div>

  
      <!-- Tab Top Nạp -->
      <div class="top-charge-form p-3 fade-in" v-show="activeTab === 'top'">
        <div v-if="!isLoading">
          <div v-if="topRechargeHistory && topRechargeHistory.length > 0">
            <div 
              class="rank slide-in" 
              v-for="(recharge, index) in topRechargeHistory" 
              :key="recharge.stt"
              :style="{ animationDelay: `${index * 0.1}s` }"
            >
              <div class="rank-left">
                <div class="rank-badge" :class="`rank-${index + 1}`">
                  <i class="fa fa-trophy"></i>
                  <span>{{ index + 1 }}</span>
                </div>
                <strong>{{ recharge.userName }}</strong>
              </div>
              <div class="rank-right">
                <strong>{{ recharge.price?.toLocaleString() }} <span>VNĐ</span></strong>
              </div>
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="fa fa-inbox"></i>
            <p>Chưa có danh sách nạp thẻ</p>
          </div>
        </div>
        <div v-else class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải danh sách...</p>
        </div>
      </div>

      <!-- Tab Ưu Đãi Hot -->
      <div class="deals-form fade-in" v-show="activeTab === 'deals'">
        <div v-if="!isLoadingDeals">
          <div v-if="hotDeals && hotDeals.length > 0" class="deals-container">
            <div 
              class="hot-deal-card" 
              v-for="(deal, index) in hotDeals" 
              :key="deal.id"
              :style="{ animationDelay: `${index * 0.1}s` }"
              @click="viewDeal(deal)"
            >
              <!-- Discount Badge -->
              <div class="discount-badge">
                <div class="discount-icon">
                  <i class="fas fa-fire"></i>
                </div>
                <div class="discount-text">
                  <span class="percent">{{ deal.discount }}%</span>
                  <span class="label">GIẢM</span>
                </div>
                <div class="badge-shine"></div>
                <div class="badge-glow"></div>
              </div>

              <!-- Card Content -->
              <div class="card-body">
                <h3 class="deal-title">{{ deal.title }}</h3>
                
                <div class="price-section">
                  <div class="price-row">
                    <span class="price-label">Giá gốc:</span>
                    <span class="original-price">{{ formatPrice(deal.originalPrice) }}</span>
                  </div>
                  <div class="price-row highlighted">
                    <span class="price-label">Giá sale:</span>
                    <span class="sale-price">{{ formatPrice(deal.currentPrice) }}</span>
                  </div>
                  <div class="savings">
                    <i class="fas fa-piggy-bank"></i>
                    <span>Tiết kiệm: {{ formatPrice(deal.originalPrice - deal.currentPrice) }}</span>
                  </div>
                </div>

                <button class="view-btn">
                  <span>Mua ngay</span>
                  <i class="fa-arrow-right fas"></i>
                </button>
              </div>

              <!-- Decorative Elements -->
              <div class="card-shine"></div>
              <div class="top-left corner-accent"></div>
              <div class="bottom-right corner-accent"></div>
            </div>
          </div>
          <div v-else class="empty-state">
            <i class="fa fa-gift"></i>
            <p>Chưa có ưu đãi nào</p>
          </div>
        </div>
        <div v-else class="loading-state">
          <div class="spinner"></div>
          <p>Đang tải ưu đãi...</p>
        </div>
      </div>
    </div>
    
    <div class="right">
      <img src="@/assets/images/recharge-banner.gif" alt="Banner" />
    </div>
  </div>
</template>

<script>
import account from '~/api/account';

export default {
  data() {
    return {
      activeTab: 'deals', // Mặc định hiển thị tab ưu đãi hot
      isLoading: false,
      isLoadingDeals: false,
      error: null,
      topRechargeHistory: [],
      hotDeals: [],
    };
  },

  methods: {
    formatPrice(price) {
      if (!price) return '0đ';
      return price.toLocaleString('vi-VN') + 'đ';
    },

    switchTab(tab) {
      this.activeTab = tab;
      
      // Load dữ liệu khi chuyển tab
      if (tab === 'top' && this.topRechargeHistory.length === 0) {
        this.getTop5RechargeHistory();
      } else if (tab === 'deals' && this.hotDeals.length === 0) {
        this.getHotDeals();
      }
    },

    async getTop5RechargeHistory() {
      this.isLoading = true;
      this.error = null;

      try {
        const response = await account.getTop5RechargeHistory();
        if (response?.success) {
          this.topRechargeHistory = response?.data;
        } else {
          this.error = response?.message;
        }
      } catch (err) {
        this.error = 'Lấy danh sách thẻ thất bại. Vui lòng thử lại';
        this.$toast.error(this.error);
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    async getHotDeals() {
      this.isLoadingDeals = true;
      this.error = null;

      try {
        const response = await account.getTopAccountSale();
        if (response?.success) {
          this.hotDeals = response?.data?.map(item => ({
            id: item.accountId,
            title: item.title,
            originalPrice: item.priceSell,
            currentPrice: item.priceSale,
            discount: item.percentSale,
            accountId: item.accountId
          })) || [];
        } else {
          this.error = response?.message;
        }
      } catch (err) {
        this.error = 'Lấy danh sách ưu đãi thất bại. Vui lòng thử lại';
        this.$toast.error(this.error);
        console.error(err);
      } finally {
        this.isLoadingDeals = false;
      }
    },

    viewDeal(deal) {
      if (deal.accountId) {
        this.$router.push(`/DetailAccountPage/${deal.accountId}`);
      }
    },
  },

  mounted() {
    // Load dữ liệu mặc định
    this.getHotDeals();
  },
};
</script>

<style lang="scss">
.recharge-online {
  background-color: var(--black-one);
  display: flex;
  padding: 10px;
  margin: 60px auto;
  gap: 10px;

  .left {
    width: 30%;
    background-color: var(--black-two);
    border-radius: 8px;
    overflow: hidden;

    .form-title {
      display: flex;
      justify-content: space-around;
      background: linear-gradient(180deg, rgba(30, 30, 30, 1) 0%, rgba(20, 20, 20, 1) 100%);
      border-bottom: 2px solid rgba(245, 158, 11, 0.3);

      .tab-item {
        flex: 1;
        font-size: 1rem;
        font-weight: 400;
        padding: 12px 8px;
        color: rgba(255, 255, 255, 0.6);
        cursor: pointer;
        text-align: center;
        transition: all 0.3s ease;
        position: relative;
        border-bottom: 2px solid transparent;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;

        i {
          font-size: 1.1rem;
          transition: transform 0.3s ease;
        }

        strong {
          font-size: 0.8rem;
        }

        &:hover {
          background-color: rgba(245, 158, 11, 0.1);
          color: var(--yellow-text);

          i {
            transform: scale(1.1);
          }
        }

        &.active {
          color: var(--yellow-active) !important;
          border-bottom-color: var(--yellow-active);
          background-color: rgba(245, 158, 11, 0.15);

          i {
            transform: scale(1.2);
            filter: drop-shadow(0 0 5px rgba(245, 158, 11, 0.5));
          }
        }

        &.hot-tab {
          position: relative;

          .hot-badge {
            position: absolute;
            top: 5px;
            right: 5px;
            background: linear-gradient(135deg, #ff0000, #ff6b00);
            color: white;
            font-size: 0.6rem;
            padding: 2px 6px;
            border-radius: 10px;
            font-weight: bold;
            box-shadow: 0 2px 5px rgba(255, 0, 0, 0.5);
          }

          i.fa-fire {
            color: #ff4500;
          }

          &.active i.fa-fire {
            animation: fireFlicker 1.5s infinite;
          }
        }
      }
    }

    .charge-form,
    .top-charge-form,
    .deals-form {
      min-height: 300px;
      max-height: 500px;
      overflow-y: auto;
      padding: 12px !important;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(245, 158, 11, 0.4);
        border-radius: 2px;

        &:hover {
          background: rgba(245, 158, 11, 0.6);
        }
      }
    }

    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.6);

      i {
        font-size: 4rem;
        margin-bottom: 15px;
        opacity: 0.5;
      }

      p {
        font-size: 1.1rem;
      }
    }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.5);

      i {
        font-size: 3rem;
        margin-bottom: 10px;
        opacity: 0.5;
      }

      p {
        font-size: 1rem;
      }
    }

    .loading-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.7);

      .spinner {
        width: 40px;
        height: 40px;
        border: 4px solid rgba(245, 158, 11, 0.2);
        border-top-color: var(--yellow-active);
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin-bottom: 15px;
      }

      p {
        font-size: 1rem;
      }
    }

    .top-charge-form {
      .rank {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        padding: 10px 12px;
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.8), rgba(20, 20, 20, 0.8));
        border-radius: 6px;
        transition: all 0.3s ease;
        border: 1px solid rgba(245, 158, 11, 0.15);

        &:hover {
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
          border-color: rgba(245, 158, 11, 0.4);
        }

        .rank-left {
          display: flex;
          align-items: center;
          gap: 10px;

          .rank-badge {
            position: relative;
            width: 35px;
            height: 35px;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            background: linear-gradient(135deg, #ffd700, #ffed4e);
            box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);

            &.rank-1 {
              background: linear-gradient(135deg, #ffd700, #ffed4e);
              animation: goldGlow 2s infinite;
            }

            &.rank-2 {
              background: linear-gradient(135deg, #c0c0c0, #e8e8e8);
            }

            &.rank-3 {
              background: linear-gradient(135deg, #cd7f32, #e6a15c);
            }

            i {
              font-size: 1.1rem;
              color: rgba(0, 0, 0, 0.7);
            }

            span {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              font-size: 0.85rem;
              font-weight: bold;
              color: rgba(0, 0, 0, 0.8);
            }
          }

          strong {
            color: #ffffff;
            font-size: 0.95rem;
          }
        }

        .rank-right {
          padding: 5px 12px;
          background: linear-gradient(135deg, var(--red-btn), #ff4757);
          border-radius: 15px;
          box-shadow: 0 2px 6px rgba(255, 71, 87, 0.3);

          strong {
            font-weight: 700;
            color: #ffffff;
            font-size: 1rem;
          }

          span {
            font-size: 0.7rem;
          }
        }
      }
    }

    .deals-form {
      padding: 12px;
      max-height: 600px;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(255, 255, 255, 0.05);
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(245, 158, 11, 0.5);
        border-radius: 3px;

        &:hover {
          background: rgba(245, 158, 11, 0.7);
        }
      }

      .deals-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .hot-deal-card {
        position: relative;
        background: linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 100%);
        border-radius: 12px;
        padding: 0;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border: 2px solid rgba(245, 158, 11, 0.2);
        animation: slideInUp 0.5s ease-out forwards;
        opacity: 0;

        &:hover {
          transform: translateY(-4px) scale(1.02);
          border-color: rgba(245, 158, 11, 0.5);
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.3);

          .discount-badge {
            transform: scale(1.1) rotate(-3deg);
          }

          .view-btn {
            background: linear-gradient(135deg, #f59e0b, #ff6b00);
            transform: translateX(3px);

            i {
              transform: translateX(3px);
            }
          }

          .card-shine {
            opacity: 1;
            transform: translateX(100%);
          }
        }

        .discount-badge {
          position: absolute;
          top: 10px;
          right: 12px;
          z-index: 10;
          display: flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #ff3b3b, #ff6b00);
          padding: 5px 10px;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(255, 59, 59, 0.5), 0 0 30px rgba(255, 59, 59, 0.3);
          transition: all 0.3s ease;
          animation: badgePulse 2s ease-in-out infinite;
          overflow: hidden;
          font-size: 16px;

          &::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%);
            animation: badgeRotate 3s linear infinite;
          }

          .badge-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 50%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
            animation: badgeShine 3s ease-in-out infinite;
            transform: skewX(-20deg);
          }

          .badge-glow {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 120%;
            height: 120%;
            background: radial-gradient(circle, rgba(255, 107, 0, 0.4) 0%, transparent 70%);
            transform: translate(-50%, -50%);
            animation: badgeGlow 2s ease-in-out infinite alternate;
            pointer-events: none;
          }

          .discount-icon {
            width: 28px;
            height: 28px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255, 255, 255, 0.25);
            border-radius: 50%;
            position: relative;
            z-index: 2;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.3);
            
            i {
              color: #fff;
              font-size: 14px;
              animation: fireFlicker 1.5s infinite, fireBounce 0.8s ease-in-out infinite;
              filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
            }
          }

          .discount-text {
            display: flex;
            flex-direction: column;
            line-height: 1.1;
            position: relative;
            z-index: 2;

            .percent {
              color: #fff;
              font-size: 18px;
              font-weight: 800;
              text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3), 0 0 10px rgba(255, 255, 255, 0.5);
              animation: percentZoom 1.5s ease-in-out infinite;
            }

            .label {
              color: rgba(255, 255, 255, 0.95);
              font-size: 9px;
              font-weight: 600;
              letter-spacing: 1px;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
            }
          }
        }

        .card-body {
          padding: 16px;
          padding-top: 20px;

          .deal-title {
            color: #fff;
            font-size: 15px;
            font-weight: 700;
            margin-bottom: 12px;
            line-height: 1.4;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .price-section {
            background: rgba(245, 158, 11, 0.08);
            border-radius: 8px;
            padding: 10px;
            margin-bottom: 12px;
            border: 1px solid rgba(245, 158, 11, 0.15);

            .price-row {
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-bottom: 6px;

              &:last-of-type {
                margin-bottom: 8px;
              }

              .price-label {
                color: rgba(255, 255, 255, 0.6);
                font-size: 11px;
                font-weight: 500;
              }

              .original-price {
                color: rgba(255, 255, 255, 0.4);
                font-size: 13px;
                text-decoration: line-through;
                font-weight: 500;
              }

              .sale-price {
                color: #f59e0b;
                font-size: 18px;
                font-weight: 800;
                text-shadow: 0 0 10px rgba(245, 158, 11, 0.4);
              }

              &.highlighted {
                padding: 6px 8px;
                background: rgba(245, 158, 11, 0.12);
                border-radius: 6px;
                margin: 0 -4px 8px -4px;
              }
            }

            .savings {
              display: flex;
              align-items: center;
              gap: 6px;
              padding-top: 6px;
              border-top: 1px dashed rgba(245, 158, 11, 0.25);
              color: #10b981;
              font-size: 12px;
              font-weight: 600;

              i {
                font-size: 13px;
              }
            }
          }

          .view-btn {
            width: 100%;
            padding: 10px 16px;
            background: rgba(245, 158, 11, 0.15);
            border: 2px solid rgba(245, 158, 11, 0.4);
            border-radius: 8px;
            color: #f59e0b;
            font-size: 13px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            transition: all 0.3s ease;
            text-transform: uppercase;
            letter-spacing: 0.5px;

            i {
              font-size: 12px;
              transition: transform 0.3s ease;
            }
          }
        }

        .card-shine {
          position: absolute;
          top: 0;
          left: -100%;
          width: 50%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          opacity: 0;
          transition: all 0.6s ease;
          pointer-events: none;
        }

        .corner-accent {
          position: absolute;
          width: 30px;
          height: 30px;
          border: 2px solid rgba(245, 158, 11, 0.3);
          
          &.top-left {
            top: 8px;
            left: 8px;
            border-right: none;
            border-bottom: none;
            border-radius: 4px 0 0 0;
          }

          &.bottom-right {
            bottom: 8px;
            right: 8px;
            border-left: none;
            border-top: none;
            border-radius: 0 0 4px 0;
          }
        }
      }
    }
  }

  .right {
    width: 70%;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// Animations
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

@keyframes fireFlicker {
  0%, 100% {
    transform: scale(1);
    filter: drop-shadow(0 0 5px #ff4500);
  }
  50% {
    transform: scale(1.1);
    filter: drop-shadow(0 0 10px #ff6b00);
  }
}

@keyframes goldGlow {
  0%, 100% {
    box-shadow: 0 2px 6px rgba(255, 215, 0, 0.3);
  }
  50% {
    box-shadow: 0 2px 12px rgba(255, 215, 0, 0.6);
  }
}

@keyframes shine {
  0% {
    left: -100%;
  }
  100% {
    left: 200%;
  }
}

@keyframes boltFlash {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.6;
    transform: scale(1.1);
  }
}

@keyframes fireFlicker {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1);
  }
}

@keyframes fireBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
}

@keyframes badgePulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 12px rgba(255, 59, 59, 0.5), 0 0 30px rgba(255, 59, 59, 0.3);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 59, 59, 0.7), 0 0 40px rgba(255, 59, 59, 0.5);
  }
}

@keyframes badgeRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes badgeShine {
  0% {
    left: -100%;
  }
  50%, 100% {
    left: 200%;
  }
}

@keyframes badgeGlow {
  0% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.2);
  }
}

@keyframes percentZoom {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.08);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.fade-in {
  animation: fade-in 0.5s ease;
}

.slide-in {
  animation: slide-in 0.5s ease forwards;
  opacity: 0;
}

.scale-in {
  animation: scale-in 0.5s ease forwards;
  opacity: 0;
}

.pulse {
  animation: pulse 2s infinite;
}

@media (max-width: 1000px) {
  .recharge-online {
    flex-direction: column-reverse;

    .left,
    .right {
      width: 100%;
    }

    .left {
      margin-top: 10px;
    }
  }
}

@media (max-width: 767px) {
  .recharge-online .left .form-title .tab-item {
    padding: 12px 5px;
    font-size: 0.9rem;

    i {
      font-size: 1rem;
    }

    strong {
      font-size: 0.75rem;
    }

    &.hot-tab .hot-badge {
      font-size: 0.5rem;
      padding: 1px 4px;
    }
  }
}

@media (max-width: 480px) {
  .recharge-online {
    margin: 30px auto !important;
    padding: 5px;
  }

  .recharge-online .left {
    .form-title .tab-item {
      padding: 10px 3px;

      strong {
        font-size: 0.7rem;
      }

      i {
        font-size: 0.9rem;
      }
    }

    .deals-form .deal-card {
      .deal-content h4 {
        font-size: 1rem;
      }

      .deal-badge {
        padding: 6px 10px;
        font-size: 0.85rem;
      }
    }
  }
}
</style>
