<template>
  <div class="flex md:flex-row flex-col gap-4 content-wrapper ro-wrap">

    <!-- <div class="flex-1 ro-card">

      <div class="ro-tabs">
        <button class="ro-tab" :class="{ active: activeTab === 'deals' }" @click="switchTab('deals')">
          <span class="ro-tab-icon">🔥</span>
          Ưu Đãi Hot
          <span v-if="hotDeals.length" class="ro-tab-count">{{ hotDeals.length }}</span>
        </button>
        <button class="ro-tab" :class="{ active: activeTab === 'top' }" @click="switchTab('top')">
          <span class="ro-tab-icon">🏆</span>
          Top Nạp
        </button>
        <div class="ro-tab-slider" :class="activeTab === 'top' ? 'to-right' : ''"></div>
      </div>

      <div class="ro-body">

        <transition name="pane">
          <div v-if="activeTab === 'top'" class="ro-pane" key="top">
            <div v-if="isLoading" class="ro-loader">
              <div class="ro-spin"></div>
            </div>

            <div v-else-if="topRechargeHistory && topRechargeHistory.length > 0">

              <div class="podium">
                <div class="podium-slot" v-if="topRechargeHistory[1]">
                  <div class="pod-crown silver-crown">✦</div>
                  <div class="pod-avatar silver"><span>{{ initials(topRechargeHistory[1].userName) }}</span></div>
                  <p class="pod-name">{{ shortName(topRechargeHistory[1].userName) }}</p>
                  <p class="pod-price">{{ formatPrice(topRechargeHistory[1].price) }}</p>
                  <div class="pod-base silver-base"><span class="pod-rank">2</span></div>
                </div>

                <div class="podium-slot center" v-if="topRechargeHistory[0]">
                  <div class="pod-crown gold-crown">👑</div>
                  <div class="pod-avatar gold"><span>{{ initials(topRechargeHistory[0].userName) }}</span></div>
                  <p class="pod-name">{{ shortName(topRechargeHistory[0].userName) }}</p>
                  <p class="pod-price">{{ formatPrice(topRechargeHistory[0].price) }}</p>
                  <div class="pod-base gold-base"><span class="pod-rank">1</span></div>
                </div>

                <div class="podium-slot" v-if="topRechargeHistory[2]">
                  <div class="pod-crown bronze-crown">✦</div>
                  <div class="pod-avatar bronze"><span>{{ initials(topRechargeHistory[2].userName) }}</span></div>
                  <p class="pod-name">{{ shortName(topRechargeHistory[2].userName) }}</p>
                  <p class="pod-price">{{ formatPrice(topRechargeHistory[2].price) }}</p>
                  <div class="pod-base bronze-base"><span class="pod-rank">3</span></div>
                </div>
              </div>

              <div class="rest-list" v-if="topRechargeHistory.length > 3">
                <div class="rest-row" v-for="(item, index) in topRechargeHistory.slice(3)" :key="item.stt"
                  :style="{ animationDelay: `${index * 0.06}s` }">
                  <span class="rest-num">{{ index + 4 }}</span>
                  <div class="rest-avatar">{{ initials(item.userName) }}</div>
                  <div class="rest-info">
                    <span class="rest-name">{{ item.userName }}</span>
                  </div>
                  <span class="rest-price">{{ formatPrice(item.price) }}</span>
                </div>
              </div>

            </div>

            <div v-else class="ro-empty">
              <div class="ro-empty-icon">🏆</div>
              <p>Chưa có dữ liệu xếp hạng</p>
            </div>
          </div>
        </transition>

        <transition name="pane">
          <div v-if="activeTab === 'deals'" class="ro-pane" key="deals">
            <div v-if="isLoadingDeals" class="ro-loader">
              <div class="ro-spin"></div>
            </div>

            <div v-else-if="hotDeals && hotDeals.length > 0" class="deals-list">
              <div class="deal-card" v-for="(deal, index) in hotDeals" :key="deal.id"
                :style="{ animationDelay: `${index * 0.07}s` }" @click="viewDeal(deal)">



                <div class="deal-body">
                  <div class="flex items-start gap-2">
                    <div class="deal-left">
                      <div class="deal-pct">-{{ deal.discount?.toFixed(0) }}%</div>
                    </div>
                    <p class="deal-title">{{ deal.title }}</p>
                  </div>
                  <div class="deal-price-row">
                    <span class="deal-old">{{ formatPrice(deal.originalPrice) }}</span>
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      stroke-width="2.5">
                      <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span class="deal-new">{{ formatPrice(deal.currentPrice) }}</span>
                  </div>
                  <div class="deal-save-row">
                    <span class="deal-save-pill">Tiết kiệm {{ formatPrice(deal.originalPrice - deal.currentPrice)
                      }}</span>
                  </div>
                </div>

                <div class="deal-cta">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </div>
              </div>
            </div>

            <div v-else class="ro-empty">
              <div class="ro-empty-icon">🎁</div>
              <p>Chưa có ưu đãi nào</p>
            </div>
          </div>
        </transition>

      </div>
    </div> -->

    <!-- Right banner -->
    <div class="flex-[2] gap-4 ro-banner pt-10">
      <img :src="bannerImage" alt="Banner" class="banner-main" />
      <div class="gap-4 banner-sub">
        <img src="@/assets/images/logo/chuyenkhoan.gif" alt="Chuyển khoản" />
        <img src="@/assets/images/logo/thecao.gif" alt="Thẻ cào" />
      </div>
    </div>

  </div>
</template>

<script>
import account from '~/api/account';

import banner1 from '@/assets/images/logo/banner.gif'
import banner2 from '@/assets/images/logo/banner3.gif'

export default {
  data() {
    return {
      activeTab: 'deals',
      isLoading: false,
      isLoadingDeals: false,
      error: null,
      bannerImage: banner1,
      topRechargeHistory: [],
      hotDeals: [],
      timer: null,
    };
  },

  methods: {
    formatPrice(price) {
      if (!price) return '0đ';
      return price.toLocaleString('vi-VN') + 'đ';
    },
    initials(name) {
      if (!name) return '?';
      const parts = name.trim().split(' ');
      return parts.length > 1
        ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
        : name.slice(0, 2).toUpperCase();
    },
    shortName(name) {
      if (!name) return '';
      const parts = name.trim().split(' ');
      return parts[parts.length - 1];
    },
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'top' && this.topRechargeHistory.length === 0) this.getTop5RechargeHistory();
      else if (tab === 'deals' && this.hotDeals.length === 0) this.getHotDeals();
    },
    async getTop5RechargeHistory() {
      this.isLoading = true;
      try {
        const response = await account.getTop5RechargeHistory();
        if (response?.success) this.topRechargeHistory = response.data;
      } catch (err) {
        this.$toast.error('Lấy danh sách thất bại. Vui lòng thử lại');
      } finally {
        this.isLoading = false;
      }
    },
    async getHotDeals() {
      this.isLoadingDeals = true;
      try {
        const response = await account.getTopAccountSale();
        if (response?.success) {
          this.hotDeals = response.data?.map(item => ({
            id: item.accountId,
            title: item.title,
            originalPrice: item.priceSell,
            currentPrice: item.priceSale,
            discount: item.percentSale,
            accountId: item.accountId,
          })) || [];
        }
      } catch (err) {
        this.$toast.error('Lấy danh sách ưu đãi thất bại. Vui lòng thử lại');
      } finally {
        this.isLoadingDeals = false;
      }
    },
    viewDeal(deal) {
      if (deal.accountId) this.$router.push(`/DetailAccountPage/${deal.accountId}`);
    },
  },

  mounted() {
    this.getHotDeals();
    this.timer = setInterval(() => {
      this.bannerImage =
        this.bannerImage === banner1 ? banner2 : banner1
    }, 5000);
  },

  beforeUnmount() {
    clearInterval(this.timer)
  },
};
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@400;500;600;700;800&display=swap');

// ── TOKENS ───────────────────────────────────────────────────
$red: #af2e34;
$red-hover: #c9383f;
$red-soft: #fff0f0;
$red-ring: rgba(175, 46, 52, 0.15);

$gold: #d4960a;
$gold-soft: #fffbf0;
$silver: #5a7a96;
$silver-soft: #f0f5f9;
$bronze: #a05828;
$bronze-soft: #fff4ed;

$ink: #180a0b;
$ink-2: #3e2224;
$ink-3: #7a5254;
$ink-4: #b89092;

$bg: #f9ecec;
$bg-2: white;
$border: #eedede;
$shadow: rgba(175, 46, 52, 0.07);

$f: "Roboto Condensed", sans-serif;

// ── WRAP ─────────────────────────────────────────────────────
.ro-wrap {
  display: flex;
  align-items: stretch;
  gap: 14px;
  margin: 34px auto;
  font-family: $f;
}

// ── CARD ─────────────────────────────────────────────────────
.ro-card {
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: $bg;
  border: 1.5px solid $border;
}

@media (max-width: 768px) {
  .ro-card {
    border-radius: 6px;
  }
}

// ── TABS ─────────────────────────────────────────────────────
.ro-tabs {
  position: relative;
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: $bg-2;
  border-bottom: 1.5px solid $border;
  flex-shrink: 0;
  padding: 5px;
  gap: 4px;
}

@media (max-width: 768px) {
  .ro-tabs {
    border-radius: 6px;
  }
}

.ro-tab-slider {
  position: absolute;
  top: 5px;
  bottom: 5px;
  left: 5px;
  width: calc(50% - 7px);
  background: $bg;
  border-radius: 11px;
  border: 1.5px solid $border;
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.07);
  transition: transform 0.26s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;

  &.to-right {
    transform: translateX(calc(100% + 4px));
  }
}

.ro-tab {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 8px;
  background: transparent;
  border: none;
  border-radius: 11px;
  cursor: pointer;
  font-family: $f;
  font-size: 0.78rem;
  font-weight: 600;
  color: $ink-3;
  transition: color 0.15s;
  white-space: nowrap;

  .ro-tab-icon {
    font-size: 0.9rem;
  }

  .ro-tab-count {
    padding: 1px 6px;
    background: $red-soft;
    color: $red;
    border-radius: 99px;
    font-size: 0.62rem;
    font-weight: 700;
  }

  &.active {
    color: $ink;
    font-weight: 700;
  }
}

// ── BODY ─────────────────────────────────────────────────────
.ro-body {
  flex: 1;
  position: relative;
  min-height: 40vh;
}

.ro-pane {
  position: absolute;
  inset: 0;
  overflow-y: auto;
  padding: 14px 12px;

  &::-webkit-scrollbar {
    width: 3px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: $border;
    border-radius: 99px;
  }
}

.pane-enter-active,
.pane-leave-active {
  transition: opacity 0.17s, transform 0.17s;
}

.pane-enter-from {
  opacity: 0;
  transform: translateX(8px);
}

.pane-leave-to {
  opacity: 0;
  transform: translateX(-8px);
}

// ── LOADER / EMPTY ───────────────────────────────────────────
.ro-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
}

.ro-spin {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2.5px solid $border;
  border-top-color: $red;
  animation: ro-spin 0.75s linear infinite;
}

@keyframes ro-spin {
  to {
    transform: rotate(360deg);
  }
}

.ro-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  gap: 8px;
  color: $ink-4;

  .ro-empty-icon {
    font-size: 1.8rem;
    opacity: 0.45;
  }

  p {
    margin: 0;
    font-size: 0.82rem;
  }
}

// ── PODIUM ───────────────────────────────────────────────────
.podium {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;
  padding: 4px 0 0;
  margin-bottom: 14px;
}

.podium-slot {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;

  &.center .pod-avatar {
    width: 56px;
    height: 56px;
    font-size: 1rem;
  }
}

.pod-crown {
  line-height: 1;
  margin-bottom: 2px;

  &.gold-crown {
    font-size: 1.25rem;
    filter: drop-shadow(0 2px 5px rgba(212, 150, 10, .55));
  }

  &.silver-crown {
    font-size: 0.88rem;
    color: $silver;
  }

  &.bronze-crown {
    font-size: 0.88rem;
    color: $bronze;
  }
}

.pod-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.82rem;
  font-weight: 800;
  border: 2.5px solid;
  flex-shrink: 0;

  &.gold {
    background: $gold-soft;
    color: $gold;
    border-color: $gold;
    box-shadow: 0 3px 12px rgba(212, 150, 10, .3);
  }

  &.silver {
    background: $silver-soft;
    color: $silver;
    border-color: $silver;
    box-shadow: 0 3px 12px rgba(90, 122, 150, .22);
  }

  &.bronze {
    background: $bronze-soft;
    color: $bronze;
    border-color: $bronze;
    box-shadow: 0 3px 12px rgba(160, 88, 40, .2);
  }
}

.pod-name {
  margin: 0;
  font-size: 0.72rem;
  font-weight: 700;
  color: $ink-2;
  text-align: center;
  max-width: 76px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.pod-price {
  margin: 0;
  font-size: 0.65rem;
  font-weight: 700;
  color: $red;
  text-align: center;
}

.pod-base {
  width: 100%;
  margin-top: 4px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 6px 4px;

  &.gold-base {
    background: linear-gradient(180deg, #fef3c7, #fde68a);
    height: 54px;
  }

  &.silver-base {
    background: linear-gradient(180deg, $silver-soft, #d8e6f0);
    height: 40px;
  }

  &.bronze-base {
    background: linear-gradient(180deg, $bronze-soft, #fcd6b4);
    height: 32px;
  }
}

.pod-rank {
  font-size: 1.05rem;
  font-weight: 800;

  .gold-base & {
    color: #92400e;
  }

  .silver-base & {
    color: $silver;
  }

  .bronze-base & {
    color: $bronze;
  }
}

// ── REST ROWS (rank 4+) ──────────────────────────────────────
.rest-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1.5px dashed $border;
  padding-top: 10px;
}

.rest-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 13px;
  background: $bg-2;
  border: 1.5px solid $border;
  animation: row-up 0.2s ease both;
  transition: border-color 0.14s, background 0.14s, transform 0.14s;

  &:hover {
    border-color: rgba(175, 46, 52, .25);
    background: $red-soft;
    transform: translateX(2px);
  }
}

@keyframes row-up {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.rest-num {
  width: 20px;
  text-align: center;
  font-size: 0.72rem;
  font-weight: 800;
  color: $ink-4;
  flex-shrink: 0;
}

.rest-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: $red-soft;
  color: $red;
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1.5px solid $red-ring;
}

.rest-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.rest-name {
  font-size: 0.84rem;
  font-weight: 600;
  color: $ink-2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.rest-price {
  font-size: 0.82rem;
  font-weight: 800;
  color: $red;
  flex-shrink: 0;
  white-space: nowrap;
}

// ── DEAL CARDS ───────────────────────────────────────────────
.deals-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.deal-card {
  display: flex;
  align-items: center;
  gap: 11px;
  padding: 12px 12px;
  border-radius: 14px;
  background: $bg-2;
  border: 1.5px solid $border;
  cursor: pointer;
  animation: row-up 0.2s ease both;
  transition: border-color 0.15s, background 0.15s, transform 0.15s, box-shadow 0.15s;

  &:hover {
    border-color: $red;
    background: $red-soft;
    transform: translateY(-1px);
    box-shadow: 0 4px 16px $shadow;

    .deal-cta {
      background: $red;
      color: #fff;
    }
  }
}

// left discount square
.deal-left {
  flex-shrink: 0;
}

.deal-pct {
  width: fit-content;
  height: fit-content;
  border-radius: 0;
  background: red;
  border-radius: 6px;
  padding: 4px 6px;
  color: #fff;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.3px;
  box-shadow: 0 3px 10px rgba(175, 46, 52, .28);
  line-height: 1.2;
  text-align: center;
}

// middle body — stacked, full info
.deal-body {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.deal-title {
  margin: 0;
  font-size: 0.86rem;
  font-weight: 700;
  color: $ink;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.3;
}

.deal-price-row {
  display: flex;
  align-items: center;
  gap: 5px;

  svg {
    color: $ink-4;
    flex-shrink: 0;
  }
}

.deal-old {
  font-size: 0.72rem;
  color: $ink-4;
  text-decoration: line-through;
  white-space: nowrap;
}

.deal-new {
  font-size: 0.9rem;
  font-weight: 800;
  color: $red;
  white-space: nowrap;
}

.deal-save-row {
  display: flex;
  align-items: center;
}

.deal-save-pill {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: rgba(5, 150, 105, 0.08);
  border: 1px solid rgba(5, 150, 105, 0.2);
  border-radius: 99px;
  font-size: 0.67rem;
  font-weight: 700;
  color: #059669;
  white-space: nowrap;
}

// right arrow
.deal-cta {
  flex-shrink: 0;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  background: $red-soft;
  color: $red;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}

// ── BANNER ───────────────────────────────────────────────────
.ro-banner {
  display: flex;
  flex-direction: column;
  height: 100vh;

  .banner-main {
    flex: 1;
    width: 100%;
    min-height: 0;
    object-fit: cover;
    object-position: top;
    display: block;
    transition: opacity 0.5s ease;
    border: 3px solid $border;
    border-radius: 12px;
  }

  .banner-sub {
    display: flex;
    gap: 10px;
    flex-shrink: 0;

    img {
      flex: 1;
      width: 0;
      height: auto;
      display: block;
      border: 3px solid $border;
      border-radius: 12px;
      object-fit: cover;
    }
  }
}

// ── RESPONSIVE ───────────────────────────────────────────────
@media (max-width: 1000px) {
  .ro-wrap {
    flex-direction: column-reverse;
    height: auto;
    margin: 0 auto;
  }

  .ro-card {
    width: 100%;
    max-height: 480px;
  }

  .ro-banner {
    .banner-main {
      height: 180px;
      flex: none;
    }
  }
}
</style>
