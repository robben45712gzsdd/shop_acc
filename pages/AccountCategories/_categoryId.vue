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
                <div class="price-inputs">
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
            <button 
              class="btn-favorite" 
              :class="{ 'is-favorited': acc.isFavorited }"
              @click.prevent="toggleFavorite(acc)"
              :disabled="acc.favoriteLoading"
            >
              <i :class="acc.isFavorited ? 'fas fa-heart' : 'far fa-heart'"></i>
              <span>{{ acc.isFavorited ? 'Đã thích' : 'Yêu thích' }}</span>
            </button>
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
        const res = await account.addHeart({ accountId: acc.accountId });
        
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
$accent: #ff6b35;
$accent-light: #ff8c5a;
$text-main: #1a1a1a;
$text-light: #666;
$border-color: #e0e0e0;

.account-categories {
  width: 100%;
  min-height: calc(100vh - 70px);
  background: linear-gradient(135deg, #f8f9fa 0%, #f5f5f5 100%);
  padding-top: 30px;
}

.wrap-categories {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px 60px;
}

/* TITLE */
.category-header {
  text-align: center;
  margin-bottom: 50px;

  .category-title {
    font-size: 2.5rem;
    font-weight: 800;
    color: $text-main;
    margin: 0 0 20px 0;
    text-transform: uppercase;
    letter-spacing: 2px;
    background: linear-gradient(135deg, $accent, $accent-light);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .category-divider {
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, $accent, $accent-light);
    margin: 0 auto;
    border-radius: 2px;
  }
}

/* FILTER SECTION */
.filter-section {
  background: white;
  border-radius: 16px;
  margin-bottom: 40px;
  border: 1px solid $border-color;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  overflow: hidden;

  .filter-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 18px 24px;
    background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
    border-bottom: 1px solid $border-color;

    .filter-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 16px;
      font-weight: 700;
      color: $text-main;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      i {
        color: $accent;
        font-size: 18px;
      }
    }

    .btn-toggle-filter {
      display: none; // Show on mobile
      background: none;
      border: none;
      color: $accent;
      font-size: 18px;
      cursor: pointer;
      padding: 8px;
      transition: all 0.3s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }

  .filter-container {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .filter-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;

      .filter-group {
        flex: 1;
        min-width: 200px;
        display: flex;
        flex-direction: column;
        gap: 10px;

        .filter-label {
          font-size: 13px;
          font-weight: 700;
          color: $text-main;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          display: flex;
          align-items: center;
          gap: 8px;

          i {
            color: $accent;
            font-size: 14px;
          }
        }

        .filter-select,
        .filter-input {
          padding: 12px 14px;
          border: 2px solid $border-color;
          border-radius: 10px;
          font-size: 14px;
          color: $text-main;
          background: white;
          transition: all 0.3s;
          font-family: inherit;
          font-weight: 500;

          &:focus {
            outline: none;
            border-color: $accent;
            box-shadow: 0 0 0 4px rgba(255, 107, 53, 0.1);
          }

          &:hover {
            border-color: $accent-light;
          }
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
              color: $text-light;
              font-weight: 700;
              font-size: 18px;
            }
          }
        }

        .btn-reset {
          margin-top: 28px;
          padding: 12px 20px;
          background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
          color: $text-main;
          border: 2px solid $border-color;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          transition: all 0.3s;
          white-space: nowrap;

          &:hover {
            background: linear-gradient(135deg, $accent, $accent-light);
            border-color: $accent;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);
          }

          &:active {
            transform: translateY(0);
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

/* ACCOUNTS GRID */
.list-account-category {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  // padding: 0 10px;

  .account-type {
    grid-column: span 3;
    display: flex;
    flex-direction: column;
    border: 2px solid #FF8755;
    border-radius: 5px;
    overflow: hidden;
    transition: all 0.3s;
    background: white;

    &:hover {
      box-shadow: 0 12px 24px rgba(255, 107, 53, 0.15);
      transform: translateY(-4px);
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
      justify-content: center;
      align-items: center;
      width: 100%;
      padding-bottom: 20px;
      flex: 1;

      .img-type-account {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .name-type-acc {
        color: #f2ac00;
        text-transform: uppercase;
        margin-bottom: 0;
      }

      .num-acc {
        margin-top: 10px;
        padding: 0 20px;
        color: $text-main;
      }

      .price {
        display: flex;
        gap: 10px;
        align-items: center;
        padding: 5px 10px;
        border: 2px solid #e63946;
        border-radius: 5px;

        .old-price {
          text-decoration: line-through;
          color: #999;
          font-size: 0.9rem;
        }

        .new-price {
          color: #e63946;
          font-weight: 600;
          font-size: 1rem;
        }
      }

      .btn-buy-now {
        margin-top: 20px;
        max-width: 135px;

        img {
          width: 100%;
        }
      }
    }

    // NEW: Favorite Section
    .favorite-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 16px;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-top: 1px solid $border-color;
      gap: 12px;

      .favorite-count {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        font-weight: 600;
        color: $text-light;

        i {
          color: #e63946;
          font-size: 14px;
          animation: heartPulse 2s infinite;
        }

        span {
          white-space: nowrap;
        }
      }

      .btn-favorite {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 14px;
        background: white;
        border: 2px solid $border-color;
        border-radius: 8px;
        color: $text-main;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s;
        white-space: nowrap;

        i {
          font-size: 13px;
          transition: all 0.3s;
        }

        &:hover:not(:disabled) {
          border-color: #e63946;
          color: #e63946;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(230, 57, 70, 0.2);

          i {
            transform: scale(1.2);
          }
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }

        &.is-favorited {
          background: linear-gradient(135deg, #e63946, #dc2f41);
          border-color: #e63946;
          color: white;

          i {
            animation: heartBeat 0.5s ease;
          }

          &:hover {
            color: white;
            background: linear-gradient(135deg, #dc2f41, #c9283a);
          }
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  }
}

// Heart animations
@keyframes heartPulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes heartBeat {
  0%, 100% {
    transform: scale(1);
  }
  25% {
    transform: scale(1.3);
  }
  50% {
    transform: scale(1.1);
  }
  75% {
    transform: scale(1.25);
  }
}

/* EMPTY STATE */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  color: $text-light;

  i {
    font-size: 64px;
    color: #ddd;
    margin-bottom: 20px;
  }

  p {
    font-size: 18px;
    margin: 0;
  }
}

/* PAGINATION */
.pagination-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 50px;

  .pagination {
    display: flex;
    align-items: center;
    gap: 8px;

    .page-btn {
      min-width: 40px;
      height: 40px;
      border: 2px solid $border-color;
      background: white;
      color: $text-main;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: all 0.3s;

      &:hover:not(:disabled) {
        border-color: $accent;
        color: $accent;
        transform: translateY(-2px);
      }

      &.active {
        background: linear-gradient(135deg, $accent, $accent-light);
        color: white;
        border-color: $accent;

        &:hover {
          color: white !important;
        }
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
      }
    }

    .page-numbers {
      display: flex;
      gap: 8px;
    }
  }

  .pagination-info {
    font-size: 13px;
    color: $text-light;
    font-weight: 600;
  }
}

/* RESPONSIVE */
@media (max-width: 1200px) {
  .list-account-category .account-type {
    grid-column: span 4 !important;
  }
}

@media (max-width: 1000px) {
  .list-account-category .account-type {
    grid-column: span 6 !important;
  }
}

@media (max-width: 768px) {
  .wrap-categories {
    padding: 0 15px 40px;
  }

  .category-title {
    font-size: 2rem;
  }

  // Show filter toggle button on mobile
  .filter-section .filter-header .btn-toggle-filter {
    display: block;
  }

  // Make filter responsive
  .filter-section .filter-container {
    padding: 20px;

    .filter-row {
      flex-direction: column;
      gap: 16px;

      .filter-group {
        width: 100%;
        min-width: auto;

        &.price-group {
          .price-inputs {
            gap: 10px;

            .price-divider {
              font-size: 16px;
            }
          }
        }

        .btn-reset {
          margin-top: 0;
          width: 100%;
        }
      }
    }
  }

  // Adjust account cards
  .list-account-category {
    gap: 16px;

    .account-type {
      .favorite-section {
        flex-direction: column;
        align-items: stretch;
        gap: 10px;

        .favorite-count {
          justify-content: center;
        }

        .btn-favorite {
          justify-content: center;
          width: 100%;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .wrap-categories {
    padding: 0 10px 40px;
  }

  .category-title {
    font-size: 1.8rem;
  }

  .filter-section {
    .filter-header {
      padding: 14px 16px;

      .filter-title {
        font-size: 14px;

        i {
          font-size: 16px;
        }
      }
    }

    .filter-container {
      padding: 16px;

      .filter-row .filter-group {
        .filter-label {
          font-size: 12px;
        }

        .filter-select,
        .filter-input {
          padding: 10px 12px;
          font-size: 13px;
        }
      }
    }
  }

  .list-account-category {
    gap: 12px;

    .account-type {
      .wrap-type-account {
        padding-bottom: 16px;

        .img-type-account {
          height: 160px;
        }

        .name-type-acc {
          font-size: 0.9rem;
          padding: 0 10px;
        }

        .num-acc {
          font-size: 0.85rem;
          padding: 0 16px;
        }
      }

      .favorite-section {
        padding: 10px 12px;

        .favorite-count {
          font-size: 12px;

          i {
            font-size: 13px;
          }
        }

        .btn-favorite {
          font-size: 11px;
          padding: 7px 12px;

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}
</style>
