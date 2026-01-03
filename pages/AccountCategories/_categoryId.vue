<template>
  <div class="account-categories">
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
              <img class="img-type-account" :src="acc.image" :alt="acc.title" />
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
              image: acc.getListImages?.[0]?.imageUrl || "/default-image.png",
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
// ============================================
// GAMING SHOP UI - SHARP & SOLID DESIGN
// ============================================

// Color Palette - Gaming Theme
$primary: #ff4655;
$primary-dark: #d63447;
$secondary: #00d9ff;
$accent: #ffb800;
$dark: #0a0a0a;
$dark-light: #141414;
$dark-card: #1a1a1a;
$dark-border: #2a2a2a;
$text-white: #ffffff;
$text-gray: #888888;
$success: #00ff88;
$danger: #ff4655;

// ============================================
// MAIN CONTAINER
// ============================================
.account-categories {
  width: 100%;
  min-height: calc(100vh - 90px);
  background: $dark;
  padding: 0 0 60px;
}

.wrap-categories {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

// ============================================
// HEADER - GAMING STYLE
// ============================================
.category-header {
  padding: 40px 0 30px;
  border-bottom: 2px solid $primary;
  margin-bottom: 30px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 120px;
    height: 2px;
    background: $secondary;
  }

  .category-title {
    font-size: 2rem;
    font-weight: 900;
    color: $text-white;
    margin: 0 0 8px 0;
    text-transform: uppercase;
    letter-spacing: 4px;
  }

  .category-divider {
    display: none;
  }
}

// ============================================
// FILTER SECTION - SHARP DESIGN
// ============================================
.filter-section {
  background: $dark-card;
  border: 1px solid $dark-border;
  margin-bottom: 30px;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    background: $dark-light;
    border-bottom: 1px solid $dark-border;

    .filter-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 14px;
      font-weight: 700;
      color: $text-white;
      text-transform: uppercase;
      letter-spacing: 2px;

      i {
        color: $primary;
        font-size: 16px;
      }
    }

    .btn-toggle-filter {
      display: none;
      background: transparent;
      border: 1px solid $dark-border;
      color: $text-gray;
      font-size: 14px;
      cursor: pointer;
      padding: 8px 16px;
      transition: all 0.2s;

      &:hover {
        border-color: $primary;
        color: $primary;
      }
    }
  }

  .filter-container {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .filter-row {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;

      .filter-group {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 8px;

        .filter-label {
          font-size: 11px;
          font-weight: 700;
          color: $text-gray;
          text-transform: uppercase;
          letter-spacing: 2px;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: $primary;
            font-size: 12px;
          }
        }

        .filter-select,
        .filter-input {
          padding: 12px 16px;
          border: 1px solid $dark-border;
          background: $dark-light;
          font-size: 14px;
          color: $text-white;
          transition: all 0.2s;

          &:focus {
            outline: none;
            border-color: $primary;
          }

          &:hover {
            border-color: $text-gray;
          }
        }

        .filter-select {
          cursor: pointer;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23ff4655'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          background-size: 16px;
          padding-right: 40px;
        }

        &.price-group {
          flex: 1.5;

          .price-inputs {
            display: flex;
            align-items: center;
            gap: 12px;

            .filter-input {
              flex: 1;
            }

            .price-divider {
              color: $text-gray;
              font-weight: 700;
            }
          }
        }

        .btn-reset {
          margin-top: auto;
          padding: 12px 20px;
          background: transparent;
          color: $text-white;
          border: 1px solid $dark-border;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 1px;
          transition: all 0.2s;

          &:hover {
            background: $primary;
            border-color: $primary;
          }

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

// Filter collapse animation
.filter-collapse-enter-active,
.filter-collapse-leave-active {
  transition: all 0.3s ease;
  max-height: 500px;
  overflow: hidden;
}

.filter-collapse-enter,
.filter-collapse-leave-to {
  max-height: 0;
  opacity: 0;
}

// ============================================
// ACCOUNTS GRID - GAMING CARDS
// ============================================
.list-account-category {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;

  .account-type {
    display: flex;
    flex-direction: column;
    background: $dark-card;
    border: 1px solid $dark-border;
    transition: all 0.2s;
    position: relative;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 0;
      background: $primary;
      transition: height 0.3s;
    }

    &:hover {
      border-color: $primary;

      &::before {
        height: 100%;
      }

      .wrap-type-account .img-type-account {
        filter: brightness(1.1);
      }
    }

    .account-link {
      text-decoration: none;
      color: inherit;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .wrap-type-account {
      display: flex;
      flex-direction: column;
      width: 100%;
      flex: 1;

      .img-type-account {
        width: 100%;
        height: 180px;
        object-fit: cover;
        border-bottom: 1px solid $dark-border;
        transition: filter 0.3s;
      }

      .name-type-acc {
        color: $text-white;
        text-transform: uppercase;
        margin: 16px 16px 8px;
        font-size: 14px;
        letter-spacing: 1px;
        
        strong {
          font-weight: 700;
        }
      }

      .num-acc {
        margin: 0 16px 16px;
        color: $text-gray;
        font-size: 13px;
        line-height: 1.5;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        
        strong {
          color: $text-white;
          font-weight: 500;
        }
      }

      .price {
        display: flex;
        gap: 12px;
        align-items: center;
        margin: auto 16px 16px;
        padding: 12px 16px;
        background: $dark-light;
        border-left: 3px solid $primary;

        .old-price {
          text-decoration: line-through;
          color: $text-gray;
          font-size: 13px;
        }

        .new-price {
          color: $primary;
          font-weight: 800;
          font-size: 18px;
        }
      }

      .btn-buy-now {
        margin: 0 16px 16px;

        img {
          width: 100%;
          max-width: 140px;
          filter: brightness(0.9);
          transition: filter 0.2s;
        }

        &:hover img {
          filter: brightness(1);
        }
      }
    }

    // Favorite Section
    .favorite-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: $dark-light;
      border-top: 1px solid $dark-border;
      gap: 12px;

      .favorite-count {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: $text-gray;

        i {
          color: $primary;
          font-size: 14px;
        }
      }

      .btn-favorite {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        background: transparent;
        border: 1px solid $dark-border;
        color: $text-white;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        text-transform: uppercase;
        letter-spacing: 0.5px;

        i {
          font-size: 12px;
          transition: all 0.2s;
        }

        &:hover:not(:disabled) {
          border-color: $primary;
          color: $primary;
        }

        &.is-favorited {
          background: $primary;
          border-color: $primary;
          color: $text-white;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
      }
    }
  }
}

// ============================================
// EMPTY STATE
// ============================================
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: $dark-card;
  border: 1px solid $dark-border;

  i {
    font-size: 60px;
    color: $dark-border;
    margin-bottom: 20px;
    display: block;
  }

  p {
    font-size: 16px;
    color: $text-gray;
    margin: 0;
  }
}

// ============================================
// LOADING
// ============================================
.loading-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  
  .my-10 {
    margin: 40px 0;
  }
}

// ============================================
// RESPONSIVE
// ============================================
@media (max-width: 1200px) {
  .list-account-category {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .list-account-category {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .wrap-categories {
    padding: 0 16px;
  }

  .category-header {
    padding: 30px 0 20px;

    .category-title {
      font-size: 1.5rem;
      letter-spacing: 2px;
    }
  }

  .filter-section {
    .filter-header .btn-toggle-filter {
      display: block;
    }

    .filter-container .filter-row {
      flex-direction: column;

      .filter-group {
        width: 100%;
        min-width: auto;

        .btn-reset {
          margin-top: 10px;
          width: 100%;
        }
      }
    }
  }

  .list-account-category .account-type {
    .favorite-section {
      flex-direction: column;
      gap: 10px;

      .btn-favorite {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 600px) {
  .list-account-category {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .list-account-category .account-type {
    .wrap-type-account {
      .img-type-account {
        height: 200px;
      }
    }
  }
}
</style>
