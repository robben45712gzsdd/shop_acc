<template>
  <div class="recharge-online">
    <div class="left">
      <div class="tabs-header">
        <div
          @click="switchTab('deals')"
          :class="{ active: activeTab === 'deals' }"
          class="tab-item hot-tab"
        >
          <i class="fa fa-fire"></i>
          <strong>Ưu Đãi Hot</strong>
          <span class="hot-badge pulse">HOT</span>
        </div>
        <div
          @click="switchTab('top')"
          :class="{ active: activeTab === 'top' }"
          class="tab-item"
        >
          <i class="fa fa-trophy"></i>
          <strong>Top Nạp</strong>
        </div>
      </div>

      <!-- Tab Top Nạp -->
      <div class="tab-content fade-in" v-show="activeTab === 'top'">
        <div v-if="!isLoading">
          <div v-if="topRechargeHistory && topRechargeHistory.length > 0">
            <div
              class="rank-item slide-in"
              v-for="(recharge, index) in topRechargeHistory"
              :key="recharge.stt"
              :style="{ animationDelay: `${index * 0.07}s` }"
            >
              <div class="rank-left">
                <div class="rank-badge" :class="`rank-${index + 1}`">
                  <i v-if="index < 3" class="fa fa-trophy"></i>
                  <span v-else>{{ index + 1 }}</span>
                </div>
                <strong class="rank-name">{{ recharge.userName }}</strong>
              </div>
              <div class="rank-amount">
                <strong>{{ recharge.price?.toLocaleString() }}</strong>
                <span>VNĐ</span>
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
      <div class="tab-content deals-content fade-in" v-show="activeTab === 'deals'">
        <div v-if="!isLoadingDeals">
          <div v-if="hotDeals && hotDeals.length > 0" class="deals-list">
            <div
              class="deal-card"
              v-for="(deal, index) in hotDeals"
              :key="deal.id"
              :style="{ animationDelay: `${index * 0.08}s` }"
              @click="viewDeal(deal)"
            >
              <div class="deal-badge">-{{ deal.discount?.toFixed(0) }}%</div>

              <div class="deal-body">
                <h3 class="deal-title">{{ deal.title }}</h3>

                <div class="deal-prices">
                  <span class="price-original">{{ formatPrice(deal.originalPrice) }}</span>
                  <span class="price-arrow">→</span>
                  <span class="price-sale">{{ formatPrice(deal.currentPrice) }}</span>
                </div>

                <div class="deal-save">
                  <i class="fas fa-piggy-bank"></i>
                  Tiết kiệm {{ formatPrice(deal.originalPrice - deal.currentPrice) }}
                </div>
              </div>

              <div class="deal-action">
                <i class="fa-arrow-right fas"></i>
              </div>
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
      activeTab: 'deals',
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
            accountId: item.accountId,
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
    this.getHotDeals();
  },
};
</script>

<style lang="scss">
// ─── BRAND TOKENS (đồng bộ với HomePage + DetailPage) ─────────
$brand:        #76181d;
$brand-dark:   #601316;
$brand-tint-1: #f9ecec;
$brand-tint-2: #f2d5d6;
$brand-tint-3: #e8b5b7;
$brand-tint-4: #d08285;

$gold:         #c8922a;
$gold-light:   #fdf3e0;

$surface:      #fdfbfb;
$surface-2:    #ffffff;
$surface-3:    #f7f2f2;
$border:       #eadede;
$border-2:     #dfd0d0;

$ink:          #1c0a0b;
$ink-2:        #4a2426;
$ink-3:        #7a4a4d;
$ink-4:        #b08082;

$rank-gold:    #a16207;
$rank-gold-bg: rgba(251, 191, 36, 0.14);
$rank-silver:  #475569;
$rank-silver-bg: rgba(148, 163, 184, 0.14);
$rank-bronze:  #92400e;
$rank-bronze-bg: rgba(205, 127, 50, 0.14);

@import url('https://fonts.googleapis.com/css2?family=Mulish:wght@400;500;600;700;800&display=swap');

// ─── LAYOUT ───────────────────────────────────────────────────
.recharge-online {
  display: flex;
  gap: 16px;
  height: 390px;
  margin: 34px auto;
  padding: 0;
  align-items: stretch;
  font-family: 'Mulish', sans-serif;
}

// ─── LEFT PANEL ───────────────────────────────────────────────
.recharge-online .left {
  width: 32%;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  background: $surface-2;
  border: 1.5px solid $border-2;
  border-radius: 18px;
  overflow: hidden;
}

// ─── TABS HEADER ──────────────────────────────────────────────
.recharge-online .tabs-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: $brand-tint-1;
  border-bottom: 1.5px solid $border-2;
  flex-shrink: 0;
}

.recharge-online .tab-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 13px 8px;
  color: $ink-3;
  cursor: pointer;
  text-align: center;
  border-bottom: 2.5px solid transparent;
  transition: all 0.18s ease;
  background: transparent;

  i {
    font-size: 1rem;
    transition: transform 0.18s;
  }

  strong {
    font-size: 0.76rem;
    font-weight: 700;
    letter-spacing: 0.3px;
  }

  &:hover {
    color: $ink-2;
    background: rgba(118, 24, 29, 0.04);
    i { transform: translateY(-1px); }
  }

  &.active {
    color: $brand;
    border-bottom-color: $brand;
    background: $surface-2;
  }

  &.hot-tab i.fa-fire {
    color: $brand;
  }

  .hot-badge {
    position: absolute;
    top: 7px;
    right: 7px;
    padding: 2px 6px;
    border-radius: 999px;
    background: $brand;
    color: #fff;
    font-size: 0.58rem;
    font-weight: 800;
    letter-spacing: .5px;
  }

  .hot-badge.pulse {
    animation: badge-pulse 2s ease-in-out infinite;
  }
}

@keyframes badge-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.75; transform: scale(1.08); }
}

// ─── TAB CONTENT SCROLL AREA ─────────────────────────────────
.recharge-online .tab-content {
  flex: 1;
  overflow-y: auto;
  padding: 12px;

  &::-webkit-scrollbar       { width: 4px; }
  &::-webkit-scrollbar-track { background: $brand-tint-1; border-radius: 999px; }
  &::-webkit-scrollbar-thumb { background: $brand-tint-3; border-radius: 999px; }
}

// ─── STATES ───────────────────────────────────────────────────
.recharge-online .loading-state,
.recharge-online .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  color: $ink-4;

  i {
    font-size: 1.6rem;
    color: $brand-tint-3;
    margin-bottom: 10px;
  }

  p {
    margin: 0;
    font-size: 0.88rem;
  }
}

.recharge-online .spinner {
  width: 34px;
  height: 34px;
  margin-bottom: 12px;
  border-radius: 50%;
  border: 2.5px solid $brand-tint-2;
  border-top-color: $brand;
  animation: spin 0.85s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

// ─── RANK ITEMS ───────────────────────────────────────────────
.recharge-online .rank-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 10px 12px;
  margin-bottom: 8px;
  border: 1px solid $border;
  border-radius: 12px;
  background: $surface;
  transition: all 0.16s ease;

  &:last-child { margin-bottom: 0; }

  &:hover {
    border-color: $brand-tint-3;
    background: $brand-tint-1;
    transform: translateX(2px);
  }
}

.recharge-online .rank-left {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.recharge-online .rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 3px;
  flex-shrink: 0;
  font-weight: 800;
  font-size: 0.78rem;
  background: $brand-tint-1;
  color: $brand;
  border: 1px solid $brand-tint-2;

  i { font-size: 0.75rem; }

  &.rank-1 { background: $rank-gold-bg;   color: $rank-gold;   border-color: rgba(161,98,7,.18); }
  &.rank-2 { background: $rank-silver-bg; color: $rank-silver; border-color: rgba(71,85,105,.16); }
  &.rank-3 { background: $rank-bronze-bg; color: $rank-bronze; border-color: rgba(146,64,14,.16); }
}

.recharge-online .rank-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: $ink-2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recharge-online .rank-amount {
  display: flex;
  align-items: baseline;
  gap: 3px;
  flex-shrink: 0;
  padding: 5px 10px;
  border-radius: 20px;
  background: $brand;
  border: 1px solid rgba(118,24,29,.15);

  strong {
    font-size: 0.85rem;
    font-weight: 800;
    color: #fff;
  }

  span {
    font-size: 0.65rem;
    font-weight: 700;
    color: rgba(255,255,255,.8);
  }
}

// ─── DEAL CARDS ───────────────────────────────────────────────
.recharge-online .deals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.recharge-online .deal-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 12px;
  border: 1px solid $border;
  border-radius: 14px;
  background: $surface;
  cursor: pointer;
  transition: all 0.18s ease;
  overflow: hidden;

  // left accent line
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: $brand;
    border-radius: 14px 0 0 14px;
    opacity: 0;
    transition: opacity 0.18s;
  }

  &:hover {
    border-color: $brand-tint-3;
    background: $brand-tint-1;
    transform: translateX(3px);

    &::before { opacity: 1; }

    .deal-action {
      background: $brand;
      border-color: $brand;
      color: #fff;
      transform: translateX(0);
    }
  }
}

.recharge-online .deal-badge {
  flex-shrink: 0;
  padding: 4px 8px;
  border-radius: 8px;
  background: $brand;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: .3px;
  min-width: 44px;
  text-align: center;
}

.recharge-online .deal-body {
  flex: 1;
  min-width: 0;
}

.recharge-online .deal-title {
  margin: 0 0 5px;
  font-size: 0.88rem;
  font-weight: 700;
  color: $ink-2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.recharge-online .deal-prices {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.recharge-online .price-original {
  font-size: 0.78rem;
  color: $ink-4;
  text-decoration: line-through;
}

.recharge-online .price-arrow {
  font-size: 0.72rem;
  color: $brand-tint-4;
}

.recharge-online .price-sale {
  font-size: 0.92rem;
  font-weight: 800;
  color: $brand;
}

.recharge-online .deal-save {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #0f766e;

  i { font-size: 0.72rem; color: #10b981; }
}

.recharge-online .deal-action {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: $brand-tint-1;
  border: 1px solid $brand-tint-3;
  color: $brand;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.18s ease;
  transform: translateX(-2px);
}

// ─── RIGHT BANNER ─────────────────────────────────────────────
.recharge-online .right {
  flex: 1;
  border-radius: 18px;
  overflow: hidden;
  border: 1.5px solid $border-2;
  background: $surface-2;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
}

// ─── ANIMATIONS ───────────────────────────────────────────────
.fade-in {
  animation: fadeIn 0.22s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0); }
}

.slide-in {
  animation: slideIn 0.22s ease both;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-6px); }
  to   { opacity: 1; transform: translateX(0); }
}

// ─── RESPONSIVE ───────────────────────────────────────────────
@media (max-width: 1000px) {
  .recharge-online {
    flex-direction: column-reverse;
    height: auto;
  }

  .recharge-online .left,
  .recharge-online .right {
    width: 100%;
    min-width: 0;
  }

  .recharge-online .right {
    height: 220px;
  }

  .recharge-online .left {
    max-height: 420px;
  }
}

@media (max-width: 480px) {
  .recharge-online .left {
    border-radius: 14px;
  }

  .recharge-online .right {
    border-radius: 14px;
    height: 180px;
  }
}
</style>