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
      <div class="p-3 deals-form fade-in" v-show="activeTab === 'deals'">
        <div v-if="!isLoadingDeals">
          <div v-if="hotDeals && hotDeals.length > 0">
            <div 
              class="scale-in deal-card" 
              v-for="(deal, index) in hotDeals" 
              :key="deal.id"
              :style="{ animationDelay: `${index * 0.15}s` }"
            >
              <div class="deal-badge shine">
                <i class="fa fa-bolt"></i>
                <span>-{{ deal.discount }}%</span>
              </div>
              <div class="deal-content">
                <h4 class="deal-title">{{ deal.title }}</h4>
                <div class="deal-price">
                  <span class="old-price">{{ deal.originalPrice?.toLocaleString() }}đ</span>
                  <span class="new-price">{{ deal.currentPrice?.toLocaleString() }}đ</span>
                </div>
                <div class="deal-footer">
                  <div class="deal-meta">
                    <span><i class="fa fa-eye"></i> {{ deal.views }}</span>
                    <span><i class="fa fa-heart"></i> {{ deal.likes }}</span>
                  </div>
                  <button class="btn-view">
                    <i class="fa-arrow-right fa"></i>
                  </button>
                </div>
              </div>
              <div class="glow-effect"></div>
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
      hotDeals: [
        // Dữ liệu mẫu - thay bằng API thực tế
        {
          id: 1,
          title: 'Acc Liên Quân VIP',
          originalPrice: 500000,
          currentPrice: 250000,
          discount: 50,
          views: 1234,
          likes: 89
        },
        {
          id: 2,
          title: 'Acc PUBG Mobile',
          originalPrice: 800000,
          currentPrice: 480000,
          discount: 40,
          views: 2341,
          likes: 156
        },
        {
          id: 3,
          title: 'Acc Free Fire Diamond',
          originalPrice: 300000,
          currentPrice: 180000,
          discount: 40,
          views: 987,
          likes: 67
        },
        {
          id: 4,
          title: 'Acc Tốc Chiến Rank Cao',
          originalPrice: 1000000,
          currentPrice: 600000,
          discount: 40,
          views: 3456,
          likes: 234
        }
      ],
    };
  },

  methods: {
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
      // TODO: Thay bằng API thực tế
      this.isLoadingDeals = true;
      
      setTimeout(() => {
        // Giả lập load API
        this.isLoadingDeals = false;
      }, 500);
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
      .deal-card {
        position: relative;
        background: linear-gradient(135deg, rgba(30, 30, 30, 0.95), rgba(20, 20, 20, 0.95));
        border-radius: 10px;
        padding: 12px;
        margin-bottom: 10px;
        border: 1.5px solid rgba(245, 158, 11, 0.25);
        overflow: hidden;
        transition: all 0.3s ease;
        cursor: pointer;

        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 18px rgba(245, 158, 11, 0.35);
          border-color: rgba(245, 158, 11, 0.5);

          .glow-effect {
            opacity: 1;
          }

          .deal-badge {
            transform: scale(1.05);
          }

          .btn-view {
            background: var(--yellow-active);
            transform: translateX(2px);
          }
        }

        .glow-effect {
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .deal-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          background: linear-gradient(135deg, #ff0000, #ff6b00);
          color: white;
          padding: 5px 10px;
          border-radius: 6px;
          font-weight: bold;
          font-size: 0.85rem;
          box-shadow: 0 3px 8px rgba(255, 0, 0, 0.4);
          transition: all 0.3s ease;
          z-index: 2;
          display: flex;
          align-items: center;
          gap: 4px;

          i {
            font-size: 0.9rem;
            animation: boltFlash 1.5s infinite;
          }

          span {
            position: relative;
            z-index: 1;
          }

          &.shine::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -100%;
            width: 100%;
            height: 200%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.5), transparent);
            animation: shine 3s infinite;
          }
        }

        .deal-content {
          position: relative;
          z-index: 1;

          .deal-title {
            color: #ffffff;
            font-size: 1.05rem;
            margin-bottom: 8px;
            font-weight: 600;
            line-height: 1.3;
          }

          .deal-price {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 10px;

            .old-price {
              color: rgba(255, 255, 255, 0.4);
              text-decoration: line-through;
              font-size: 0.85rem;
            }

            .new-price {
              color: var(--yellow-active);
              font-size: 1.2rem;
              font-weight: bold;
              text-shadow: 0 0 8px rgba(245, 158, 11, 0.4);
            }
          }

          .deal-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .deal-meta {
              display: flex;
              gap: 12px;
              color: rgba(255, 255, 255, 0.55);
              font-size: 0.8rem;

              span {
                display: flex;
                align-items: center;
                gap: 4px;

                i {
                  color: var(--yellow-text);
                  font-size: 0.75rem;
                }
              }
            }

            .btn-view {
              background: rgba(245, 158, 11, 0.2);
              border: 1px solid rgba(245, 158, 11, 0.4);
              color: var(--yellow-active);
              width: 28px;
              height: 28px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              cursor: pointer;
              transition: all 0.3s ease;
              font-size: 0.85rem;

              i {
                transition: transform 0.3s ease;
              }

              &:hover i {
                transform: translateX(2px);
              }
            }
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
