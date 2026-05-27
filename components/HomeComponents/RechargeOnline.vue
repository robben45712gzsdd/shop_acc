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
                <i class="fas fa-tag"></i>
                <span class="discount-value">-{{ deal.discount?.toFixed(0) }}%</span>
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
      <img src="@/assets/images/logo/banner.gif" alt="Banner" />
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
$primary: #f28a59;
$primary-dark: #e67540;
$surface: #ffffff;
$surface-soft: #f8fafc;
$border: #e9eef3;
$border-strong: #dde5ec;
$text: #0f172a;
$muted: #64748b;
$muted-2: #94a3b8;

.recharge-online {
  display: flex;
  gap: 16px;
  margin: 34px auto;
  padding: 16px;
  align-items: stretch;

  .left {
    width: 32%;
    min-width: 320px;
    background: $surface;
    border: 1px solid $border;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);

    .form-title {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0;
      background: $surface-soft;
      border-bottom: 1px solid $border;

      .tab-item {
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 14px 10px;
        color: $muted;
        cursor: pointer;
        text-align: center;
        border-bottom: 2px solid transparent;
        transition: all 0.18s ease;

        i {
          font-size: 1.05rem;
          transition: transform 0.18s ease;
        }

        strong {
          font-size: 0.8rem;
          letter-spacing: 0.4px;
        }

        &:hover {
          color: $text;
          background: rgba(242, 138, 89, 0.05);

          i {
            transform: translateY(-1px);
          }
        }

        &.active {
          color: $primary;
          border-bottom-color: $primary;
          background: #ffffff;
        }

        &.hot-tab .hot-badge {
          position: absolute;
          top: 8px;
          right: 8px;
          padding: 2px 6px;
          border-radius: 999px;
          background: rgba(242, 138, 89, 0.14);
          color: $primary;
          font-size: 0.6rem;
          font-weight: 800;
        }

        &.hot-tab i.fa-fire {
          color: $primary;
        }
      }
    }

    .charge-form,
    .top-charge-form,
    .deals-form {
      min-height: 280px;
      max-height: 560px;
      overflow-y: auto;
      padding: 14px !important;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #f1f5f9;
        border-radius: 999px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(242, 138, 89, 0.26);
        border-radius: 999px;
      }
    }

    .loading-state,
    .empty-state,
    .coming-soon {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 56px 20px;
      text-align: center;
      color: $muted;

      i {
        margin-bottom: 12px;
        color: $primary;
        opacity: 0.9;
      }

      p {
        margin: 0;
        font-size: 0.98rem;
      }
    }

    .loading-state .spinner {
      width: 38px;
      height: 38px;
      margin-bottom: 14px;
      border-radius: 50%;
      border: 3px solid rgba(242, 138, 89, 0.16);
      border-top-color: $primary;
      animation: spin 0.9s linear infinite;
    }

    .top-charge-form {
      .rank {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        margin-bottom: 10px;
        padding: 12px 14px;
        border: 1px solid $border;
        border-radius: 16px;
        background: $surface-soft;
        transition: all 0.16s ease;

        &:hover {
          transform: translateX(3px);
          border-color: rgba(242, 138, 89, 0.14);
          box-shadow: 0 8px 18px rgba(15, 23, 42, 0.06);
        }

        .rank-left {
          display: flex;
          align-items: center;
          gap: 10px;
          min-width: 0;

          .rank-badge {
            width: 34px;
            height: 34px;
            border-radius: 999px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            background: rgba(242, 138, 89, 0.12);
            color: $primary;
            font-weight: 800;

            i {
              font-size: 0.85rem;
            }

            span {
              font-size: 0.8rem;
            }

            &.rank-1 { background: rgba(251, 191, 36, 0.15); color: #a16207; }
            &.rank-2 { background: rgba(148, 163, 184, 0.16); color: #475569; }
            &.rank-3 { background: rgba(205, 127, 50, 0.16); color: #92400e; }
          }

          strong {
            color: $text;
            font-size: 0.95rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .rank-right {
          padding: 7px 12px;
          border-radius: 999px;
          background: linear-gradient(135deg, $primary, #f5a25d);
          color: #ffffff;
          flex-shrink: 0;

          strong {
            font-size: 0.95rem;
            font-weight: 800;
          }

          span {
            font-size: 0.7rem;
            opacity: 0.9;
          }
        }
      }
    }

    .deals-form {
      .deals-container {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }

      .hot-deal-card {
        position: relative;
        overflow: hidden;
        border-radius: 18px;
        border: 1px solid $border;
        background: #ffffff;
        cursor: pointer;
        transition: all 0.18s ease;
        box-shadow: 0 8px 20px rgba(15, 23, 42, 0.05);

        &:hover {
          transform: translateY(-3px);
          border-color: rgba(242, 138, 89, 0.16);
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.08);

          .view-btn {
            transform: translateY(-1px);
            box-shadow: 0 8px 16px rgba(242, 138, 89, 0.14);
          }

          .discount-badge {
            transform: scale(1.03);
          }
        }

        .discount-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 2;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          background: rgba(242, 138, 89, 0.12);
          color: $primary;
          font-size: 0.75rem;
          font-weight: 800;

          i {
            font-size: 0.75rem;
          }
        }

        .card-body {
          padding: 18px;
        }

        .deal-title {
          margin: 0 0 14px;
          color: $text;
          font-size: 1rem;
          line-height: 1.4;
        }

        .price-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 16px;
          padding: 14px;
          border-radius: 14px;
          background: $surface-soft;
          border: 1px solid $border;
        }

        .price-row,
        .savings {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 0.92rem;
        }

        .price-label {
          color: $muted;
        }

        .original-price {
          color: $muted-2;
          text-decoration: line-through;
        }

        .sale-price {
          color: $primary;
          font-weight: 800;
        }

        .savings {
          justify-content: flex-start;
          color: #0f766e;
          padding-top: 4px;

          i {
            color: #10b981;
          }
        }

        .view-btn {
          width: 100%;
          min-height: 44px;
          border: 1px solid transparent;
          border-radius: 14px;
          background: linear-gradient(135deg, $primary, #f5a25d);
          color: #ffffff;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          cursor: pointer;
          transition: all 0.18s ease;
          font-size: 0.88rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4px;

          i {
            font-size: 0.85rem;
          }
        }
      }
    }
  }

  .right {
    width: 68%;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid $border;
    box-shadow: 0 14px 34px rgba(15, 23, 42, 0.06);
    background: #ffffff;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 1000px) {
  .recharge-online {
    flex-direction: column-reverse;

    .left,
    .right {
      width: 100%;
      min-width: 0;
    }
  }
}

@media (max-width: 767px) {
  .recharge-online {
    padding: 12px;
    margin: 24px auto;
  }

  .recharge-online .left .form-title .tab-item {
    padding: 12px 8px;

    strong {
      font-size: 0.74rem;
    }
  }
}

@media (max-width: 480px) {
  .recharge-online {
    padding: 8px;
    margin: 18px auto;
  }

  .recharge-online .left {
    border-radius: 18px;
  }

  .recharge-online .left .top-charge-form .rank {
    padding: 11px 12px;
  }

  .recharge-online .left .deals-form .hot-deal-card .card-body {
    padding: 16px;
  }
}
</style>
