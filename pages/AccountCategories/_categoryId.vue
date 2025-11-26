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
        <div class="filter-container">
          <!-- SORT BY -->
          <div class="filter-group">
            <label class="filter-label">Sắp xếp</label>
            <select v-model="params.sortType" @change="applyFilters" class="filter-select">
              <option value="0">Mới nhất</option>
              <option value="1">Giá thấp đến cao</option>
              <option value="2">Giá cao đến thấp</option>
              <option value="3">Bán chạy nhất</option>
            </select>
          </div>

          <!-- SORT ORDER -->
          <div class="filter-group">
            <label class="filter-label">Thứ tự</label>
            <select v-model.number="params.ascending" @change="applyFilters" class="filter-select">
              <option :value="false">Giảm dần</option>
              <option :value="true">Tăng dần</option>
            </select>
          </div>

          <!-- MIN PRICE -->
          <div class="filter-group">
            <label class="filter-label">Giá tối thiểu (VNĐ)</label>
            <input v-model="minPriceInput" type="text" placeholder="0" class="filter-input"
              @input="onPriceInput('minPrice')" @change="applyFilters" />
          </div>

          <!-- MAX PRICE -->
          <div class="filter-group">
            <label class="filter-label">Giá tối đa (VNĐ)</label>
            <input v-model="maxPriceInput" type="text" placeholder="Không giới hạn" class="filter-input"
              @input="onPriceInput('maxPrice')" @change="applyFilters" />
          </div>

          <!-- RESET BUTTON -->
          <div class="reset-group filter-group">
            <button class="btn-reset" @click="resetFilters">
              <i class="fas fa-redo-alt"></i> Đặt lại
            </button>
          </div>
        </div>
      </div>

      <!-- ACCOUNTS GRID -->
      <div class="list-account-category" v-if="accounts.length > 0 && !loading">
        <nuxt-link v-for="(acc, index) in accounts" :key="acc.accountId"
          :to="'/DetailAccountPage/' + acc.accountId" class="account-type">
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
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 40px;
  border: 1px solid $border-color;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

  .filter-container {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 20px;
    align-items: flex-end;

    .filter-group {
      display: flex;
      flex-direction: column;
      gap: 8px;

      .filter-label {
        font-size: 13px;
        font-weight: 600;
        color: $text-main;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .filter-select,
      .filter-input {
        padding: 10px 12px;
        border: 2px solid $border-color;
        border-radius: 8px;
        font-size: 14px;
        color: $text-main;
        background: white;
        transition: all 0.3s;
        font-family: inherit;

        &:focus {
          outline: none;
          border-color: $accent;
          box-shadow: 0 0 0 3px rgba(255, 107, 53, 0.1);
        }

        &:hover {
          border-color: $accent;
        }
      }

      &.reset-group {
        justify-content: flex-end;

        .btn-reset {
          padding: 10px 16px;
          background: linear-gradient(135deg, #f0f0f0, #e8e8e8);
          color: $text-main;
          border: 2px solid $border-color;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;

          &:hover {
            background: linear-gradient(135deg, #e8e8e8, #e0e0e0);
            border-color: $accent;
            color: $accent;
            transform: translateY(-2px);
          }

          i {
            font-size: 12px;
          }
        }
      }
    }
  }
}

/* ACCOUNTS GRID */
.list-account-category {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 20px;
  padding: 0 10px;

  .account-type {
    grid-column: span 3;
    display: flex;
    border: 2px solid #FF8755;
    padding-bottom: 20px;
    border-radius: 5px;
    overflow: hidden;
    transition: 0.3s;

    &:hover {
      box-shadow: 0 12px 24px rgba(255, 107, 53, 0.15);
    }

    .wrap-type-account {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;

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
@media (max-width: 1000px) {
  .list-account-category .account-type {
    grid-column: span 6 !important;
  }
}

@media (max-width: 480px) {
  .wrap-categories {
    padding: 0 10px 40px;
  }

  .category-title {
    font-size: 1.8rem;
  }
}
</style>
