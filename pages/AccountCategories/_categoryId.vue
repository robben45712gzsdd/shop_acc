<template>
  <div class="account-categories" :class="{ 'light-theme': lightTheme }">
    <div class="wrap-categories">
      <!-- TITLE -->
      <div class="category-header">
        <h1 class="category-title">{{ pathName }}</h1>
        <div class="category-divider"></div>
      </div>

      <!-- FILTER SECTION -->
      <div class="filter-section">
        <div class="filter-header">
          <div class="filter-title">
            <i class="fas fa-sliders-h"></i>
            <span>Bộ lọc tìm kiếm</span>
          </div>
          <button class="btn-toggle-filter" @click="filterExpanded = !filterExpanded">
            <i :class="filterExpanded ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
          </button>
        </div>

        <transition name="filter-collapse">
          <div class="filter-container" v-show="filterExpanded">
            <!-- ROW 1: SORT & ORDER -->
            <div class="filter-row">
              <div class="filter-group">
                <label class="filter-label">
                  <i class="fas fa-sort"></i>
                  Sắp xếp
                </label>
                <select v-model="params.sortType" @change="applyFilters" class="filter-select">
                  <option value="0">Mới nhất</option>
                  <option value="1">Giá thấp → cao</option>
                  <option value="2">Giá cao → thấp</option>
                  <option value="3">Bán chạy nhất</option>
                </select>
              </div>

              <div class="filter-group">
                <label class="filter-label">
                  <i class="fas fa-arrows-alt-v"></i>
                  Thứ tự
                </label>
                <select v-model.number="params.ascending" @change="applyFilters" class="filter-select">
                  <option :value="false">Giảm dần</option>
                  <option :value="true">Tăng dần</option>
                </select>
              </div>
            </div>

            <!-- ROW 2: PRICE RANGE -->
            <div class="filter-row">
              <div class="price-group filter-group">
                <label class="filter-label">
                  <i class="fas fa-money-bill-wave"></i>
                  Khoảng giá
                </label>
                <div class="flex-wrap !max-w-full price-inputs">
                  <input v-model="minPriceInput" type="text" placeholder="Tối thiểu" class="filter-input"
                    @input="onPriceInput('minPrice')" @change="applyFilters" />
                  <span class="price-divider">-</span>
                  <input v-model="maxPriceInput" type="text" placeholder="Tối đa" class="filter-input"
                    @input="onPriceInput('maxPrice')" @change="applyFilters" />
                </div>
              </div>

              <!-- RESET BUTTON -->
              <div class="filter-group">
                <button class="btn-reset" @click="resetFilters">
                  <i class="fas fa-redo-alt"></i>
                  <span>Đặt lại bộ lọc</span>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

      <!-- ACCOUNTS GRID -->
      <div class="list-account-category" v-if="accounts.length > 0 && !loading">
        <div v-for="(acc, index) in accounts" :key="acc.accountId" class="account-type">
          <nuxt-link :to="'/DetailAccountPage/' + acc.accountId" class="account-link">
            <div class="wrap-type-account">
              <div class="image-container">
                <img class="img-type-account" :src="acc.image" :alt="acc.title" />
                <div class="image-label">
                  <div class="account-code">{{ acc.accountCode }}</div>
                  <div class="discount-badge" v-if="calculateDiscount(acc.price, acc.priceSale) > 0">
                    -{{ calculateDiscount(acc.price, acc.priceSale) }}%
                  </div>
                </div>
              </div>
              <p class="name-type-acc"><strong>{{ acc.title }}</strong></p>
              <p class="num-acc">Mô tả: <strong>{{ acc.description }}</strong></p>
              <div class="price">
                <span class="old-price" v-if="acc.price">{{ formatPrice(acc.price) }}</span>
                <span class="new-price">{{ formatPrice(acc.priceSale || acc.price) }}</span>
              </div>
              <div class="btn-buy-now">
                <img src="@/assets/images/btn-buy-now.png" alt="" />
              </div>
            </div>
          </nuxt-link>

          <!-- FAVORITE SECTION -->
          <div class="favorite-section">
            <div class="favorite-count">
              <i class="fas fa-heart"></i>
              <span>{{ acc.totalFavorite || 0 }} lượt thích</span>
            </div>

          </div>
        </div>
      </div>

      <!-- EMPTY STATE -->
      <div v-if="accounts.length === 0 && !loading" class="empty-state">
        <i class="fas fa-inbox"></i>
        <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn</p>
      </div>

      <!-- PAGINATION -->
      <Pagination v-if="totalPages > 1 && accounts.length > 0 && !loading" :currentPage="currentPage"
        :totalPages="totalPages" @update:page="handlePageChange" />

      <!-- LOADING -->
      <div v-if="loading" class="loading-wrapper">
        <div class="my-10">
          <LoadingSpinner />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import account from "@/api/account";
import favorite from "~/api/favorite";

export default {
  data() {
    return {
      pathName: "",
      accounts: [],
      // enable light theme for this page by default (toggleable)
      lightTheme: true,
      currentPage: 1,
      recordPerPage: 12,
      totalRecords: 0,
      loading: false,
      filterExpanded: true,
      params: {
        categoryId: "",
        sortType: 0,
        minPrice: 0,
        maxPrice: 1000000000,
        ascending: false,
        currentPage: 1,
        recordPerPage: 12,
      },
      minPriceInput: "0",
      maxPriceInput: "1.000.000.000",
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.recordPerPage);
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  mounted() {
    this.$store.commit("setIsDarkMode", false);
    this.pathName = this.$route.query.categoryName || this.$route.params.categoryId;
    this.params.categoryId = this.$route.params.categoryId;
    this.getListAccountByCategory();
  },
  methods: {
    getListAccountByCategory() {
      this.loading = true;
      this.params.currentPage = this.currentPage;
      this.params.recordPerPage = this.recordPerPage;

      account
        .getAccountList(this.params)
        .then((res) => {
          if (res.success) {
            this.accounts = res.data.map((acc) => ({
              ...acc,
              image: acc?.images || "/default-image.png",
            }));
            this.totalRecords = res.totalRecords || res.data.length;
          }
        })
        .catch((err) => console.error(err))
        .finally(() => {
          this.loading = false;
        });
    },
    formatPrice(price) {
      if (!price) return "0";
      return Number(price).toLocaleString("vi-VN") + " đ";
    },
    calculateDiscount(originalPrice, salePrice) {
      if (!originalPrice || !salePrice || originalPrice <= 0) return 0;
      const discount = ((originalPrice - salePrice) / originalPrice) * 100;
      return Math.round(discount);
    },
    onPriceInput(key) {
      let input = this[key + "Input"];
      let numeric = input.replace(/\D/g, "");
      this[key + "Input"] = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
      this.params[key] = Number(numeric) || 0;
    },
    applyFilters() {
      this.currentPage = 1;
      this.getListAccountByCategory();
    },
    resetFilters() {
      this.params.sortType = 0;
      this.params.minPrice = 0;
      this.params.maxPrice = 1000000000;
      this.params.ascending = false;
      this.currentPage = 1;
      this.minPriceInput = "0";
      this.maxPriceInput = "1.000.000.000";
      this.getListAccountByCategory();
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.getListAccountByCategory();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    async toggleFavorite(acc) {
      // Check if user is logged in
      const token = this.$store.state.token;
      if (!token) {
        this.$toast.warning("Vui lòng đăng nhập để thực hiện chức năng này!");
        return;
      }

      // Prevent double clicks
      if (acc.favoriteLoading) return;

      // Set loading state
      this.$set(acc, 'favoriteLoading', true);
      const previousState = acc.isFavorited;
      const previousCount = acc.totalFavorite || 0;

      try {
        // Optimistically update UI
        this.$set(acc, 'isFavorited', !previousState);
        this.$set(acc, 'totalFavorite', previousState ? previousCount - 1 : previousCount + 1);

        // Call API
        const res = await favorite.addFavorite({ accountId: acc.accountId });

        if (res.success) {
          this.$toast.success(previousState ? "Đã bỏ yêu thích!" : "Đã thêm vào yêu thích!");
        } else {
          throw new Error(res.message || "Có lỗi xảy ra");
        }
      } catch (error) {
        // Revert on error
        this.$set(acc, 'isFavorited', previousState);
        this.$set(acc, 'totalFavorite', previousCount);
        this.$toast.error(error.message || "Không thể thực hiện. Vui lòng thử lại!");
        console.error("Toggle favorite error:", error);
      } finally {
        this.$set(acc, 'favoriteLoading', false);
      }
    },
  },
};
</script>

<style scoped lang="scss">
/* Compact light UI with orange accent and no shadows. */

.account-categories {
  --primary: #ff6b35;
  --primary-soft: #fff1ea;
  --bg: #f6f7fb;
  --bg-2: #ffffff;
  --card: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;

  width: 100%;
  min-height: calc(100vh - 110px);
  background: var(--bg);
  color: var(--text);
  padding: 0 0 60px;
}

.account-categories.light-theme {
  --bg: #f6f7fb;
  --bg-2: #ffffff;
  --card: #ffffff;
  --border: #e5e7eb;
  --text: #111827;
  --muted: #6b7280;
  --primary: #ff6b35;
  --primary-soft: #fff1ea;
}

.wrap-categories {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.category-header {
  padding: 22px 0 14px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 56px;
    height: 2px;
    background: var(--primary);
  }

  .category-title {
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 6px 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

.filter-section {
  background: var(--card);
  border: 1px solid var(--border);
  margin-bottom: 16px;
  border-radius: 14px;
  overflow: hidden;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--bg-2);
    border-bottom: 1px solid var(--border);

    .filter-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 600;
      color: var(--text);
      text-transform: uppercase;
      letter-spacing: 0.8px;

      i { color: var(--primary); font-size: 13px; }
    }

    .btn-toggle-filter {
      display: none;
      border: 1px solid var(--border);
      background: var(--bg-2);
      color: var(--muted);
      border-radius: 10px;
      width: 34px;
      height: 34px;
    }
  }

  .filter-container { padding: 12px; display:flex; flex-direction:column; gap:10px; }

  .filter-row { display:grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap:10px; }

  .filter-group {
    display:flex; flex-direction:column; gap:6px;
    .filter-label { font-size:10px; color:var(--muted); font-weight:700; text-transform:uppercase; letter-spacing:0.8px; display:flex; gap:6px; align-items:center; }
    .filter-select, .filter-input {
      padding:9px 11px; border:1px solid var(--border); background:var(--bg-2); color:var(--text); font-size:13px; border-radius:10px;
      transition: border-color .15s, background-color .15s;
      &:focus { outline:none; border-color:var(--primary); }
    }

    &.price-group { grid-column: span 2; }

    .price-inputs {
      display:flex;
      align-items:center;
      gap:8px;
      flex-wrap:wrap;

      .filter-input { flex:1; min-width: 140px; }
    }

    .price-divider { color: var(--muted); font-weight:700; }

    .btn-reset {
      margin-top:auto;
      padding:9px 12px;
      background:var(--primary-soft);
      color:var(--primary);
      border:1px solid rgba(255, 107, 53, 0.18);
      font-weight:700;
      border-radius:10px;
      cursor:pointer;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      font-size:12px;
    }
  }
}

/* Collapse animation (kept simple) */
.filter-collapse-enter-active, .filter-collapse-leave-active { transition: max-height .2s ease; overflow:hidden; }
.filter-collapse-enter, .filter-collapse-leave-to { max-height:0; opacity:0; }

.list-account-category { display:grid; grid-template-columns: repeat(4,1fr); gap:14px; }

.account-type {
  display:flex; flex-direction:column; background:var(--card); border:1px solid var(--border); transition:transform .18s, border-color .18s; border-radius:14px; overflow:hidden;
  .wrap-type-account { display:flex; flex-direction:column; flex:1; }

  &:hover { transform: translateY(-2px); border-color: var(--primary); }

  .image-container { position:relative; width:100%; height:164px; overflow:hidden; }
  .img-type-account { width:100%; height:100%; object-fit:cover; display:block; }

  .image-label { position:absolute; top:8px; left:8px; right:8px; display:flex; justify-content:space-between; pointer-events:none; }
  .account-code { background:rgba(255, 255, 255, 0.92); color:var(--primary); padding:4px 9px; border-radius:999px; font-size:10px; font-weight:700; border:1px solid rgba(255, 107, 53, 0.18); }
  .discount-badge { background:var(--primary); color:#fff; padding:5px 9px; border-radius:999px; font-weight:700; font-size:12px; align-self:flex-end; }

  .name-type-acc { color:var(--text); text-transform:uppercase; margin:11px 12px 5px; font-size:13px; }
  .num-acc { margin:0 12px 10px; color:var(--muted); font-size:12px; line-height:1.45; line-clamp:2; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }

  .price { display:flex; gap:8px; align-items:center; margin:0 12px 10px; padding:9px 10px; background:var(--primary-soft); border-left:3px solid var(--primary); border-radius:10px; }
  .old-price { text-decoration:line-through; color:var(--muted); font-size:12px; }
  .new-price { color:var(--primary); font-weight:800; font-size:15px; }

  .btn-buy-now { margin:0 12px 12px; img{ max-width:110px; display:block; } }
}

.favorite-section { display:flex; align-items:center; justify-content:space-between; padding:9px 12px; background:var(--bg-2); border-top:1px solid var(--border); gap:8px; }
.favorite-count { display:flex; align-items:center; gap:6px; color:var(--muted); font-size:12px; i{ color:var(--primary); } }
.btn-favorite { padding:8px 12px; border:1px solid var(--border); background:transparent; color:var(--text); border-radius:10px; cursor:pointer; }

.empty-state { text-align:center; padding:52px 20px; background:var(--card); border:1px solid var(--border); i{ font-size:42px; color:var(--border); margin-bottom:12px; } p{ color:var(--muted); font-size:14px; }
}

.loading-wrapper { display:flex; justify-content:center; align-items:center; min-height:220px; }

@media (max-width:1200px){ .list-account-category{ grid-template-columns:repeat(3,1fr); } }
@media (max-width:900px){ .list-account-category{ grid-template-columns:repeat(2,1fr); } }
@media (max-width:768px){
  .wrap-categories{ padding:0 14px; }
  .category-header{ padding-top:18px; }
  .filter-section .filter-header .btn-toggle-filter{ display:flex; align-items:center; justify-content:center; }
  .filter-section .filter-row{ grid-template-columns:1fr; }
  .filter-section .filter-group.price-group{ grid-column:auto; }
  .list-account-category .account-type .favorite-section{ flex-direction:column; align-items:flex-start; }
}
@media (max-width:600px){ .list-account-category{ grid-template-columns:1fr; gap:12px; } .account-type .image-container{ height:190px; } }

</style>
