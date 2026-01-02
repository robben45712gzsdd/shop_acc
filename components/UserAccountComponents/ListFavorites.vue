<template>
  <div class="!p-3 favorites-container">

    <!-- HEADER SECTION -->
    <div class="page-header">
      <div class="header-left">
        <div class="icon-wrapper">
          <i class="fas fa-heart"></i>
        </div>
        <div class="header-text">
          <h1>Tài Khoản Yêu Thích</h1>
          <p>Quản lý danh sách tài khoản game yêu thích của bạn</p>
        </div>
      </div>

      <div class="header-right">
        <div class="count-badge">
          <i class="fas fa-bookmark"></i>
          <span>{{ totalRecords }} tài khoản</span>
        </div>
      </div>
    </div>

    <!-- LOADING STATE -->
    <div v-if="loading" class="loading-wrapper">
      <div class="loader">
        <div class="spinner"></div>
        <p>Đang tải danh sách yêu thích...</p>
      </div>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="favorites.length === 0" class="empty-wrapper">
      <div class="empty-content">
        <div class="empty-icon">
          <i class="fas fa-heart-broken"></i>
        </div>
        <h3>Chưa có tài khoản yêu thích</h3>
        <p>Thêm các tài khoản game bạn quan tâm vào danh sách để dễ dàng theo dõi</p>
        <nuxt-link to="/" class="btn-explore">
          <i class="fas fa-compass"></i>
          Khám phá ngay
        </nuxt-link>
      </div>
    </div>

    <!-- FAVORITES LIST -->
    <div v-else class="favorites-content">
      <div class="favorites-grid">
        <div v-for="(item, index) in favorites" :key="index" class="fav-card">
          <!-- Card Image/Icon -->
          <div class="card-image">
            <img :src="item.images || '/default-image.png'" alt="" />
            <button class="btn-favorite active" @click="removeFavoriteItem(item)" title="Xóa khỏi yêu thích">
              <i class="fas fa-heart"></i>
            </button>
          </div>

          <!-- Card Content -->
          <div class="card-content">
            <div class="card-main">
              <h3 class="card-title">
                <i class="fas fa-wallet"></i>
                {{ item.accountId }}
              </h3>

              <div class="card-price">
                <span class="price-label">Giá trị:</span>
                <!-- giá gốc -->
                <span class="font-normal !text-gray-400 !text-sm !line-through price-value">{{
                  formatMoney(item.priceSell) }}</span>
                <span class="price-value">{{ formatMoney(item.priceSale) }}</span>
              </div>

              <div class="card-meta">
                <div class="meta-item">
                  <i class="fas fa-building"></i>
                  <span>{{ item.categoryName || 'Không rõ' }}</span>
                </div>
                <div class="meta-item">
                  <i class="fas fa-clock"></i>
                  <span>{{ formatDateShort(item.createdAt) }}</span>
                </div>
              </div>

              <div class="card-status">
                <span class="status-badge" :class="getStatusClass(item.status)">
                  <i :class="getStatusIcon(item.status)"></i>
                  {{ getStatusText(item.status) }}
                </span>
              </div>
            </div>

            <div class="card-actions">
              <button class="btn-action btn-view" @click="viewDetail(item)">
                <i class="fas fa-eye"></i>
                <span>Xem chi tiết</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- PAGINATION -->
      <div class="pagination-wrapper">
        <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages" :max-visible="5"
          @update:page="changePage" />
      </div>
    </div>

    <!-- DETAIL STATUS (phần bạn bị để lạc chỗ — giờ mình đặt đúng vị trí) -->
    <div v-if="selectedGame" class="game-detail">
      <span class="detail-label">Trạng Thái</span>
      <span class="detail-value">
        <span class="status-badge" :class="{ win: selectedGame.isWin }">
          <i :class="selectedGame.isWin ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
          {{ selectedGame.isWin ? 'Thắng' : 'Thua' }}
        </span>
      </span>
    </div>

  </div>
</template>


<script>
import favoriteApi from '@/api/favorite';
import Pagination from '@/components/Pagination.vue';

export default {
  name: 'ListFavorites',
  components: {
    Pagination,
  },
  data() {
    return {
      currentPage: 1,
      recordPerPage: 12,
      loading: false,
      favorites: [],
      totalRecords: 0,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.recordPerPage);
    },
  },

  mounted() {
    this.loadFavorites();
  },

  methods: {
    async loadFavorites() {
      try {
        this.loading = true;
        const response = await favoriteApi.getFavoriteList({
          currentPage: this.currentPage,
          recordPerPage: this.recordPerPage,
        });

        if (response.success) {
          this.favorites = response.data || [];
          this.totalRecords = response.totalRecords || 0;
        } else {
          this.$toast?.error?.(response.message || 'Không thể tải danh sách yêu thích');
        }
      } catch (error) {
        console.error('Error loading favorites:', error);
        this.$toast?.error?.('Có lỗi xảy ra khi tải danh sách yêu thích');
      } finally {
        this.loading = false;
      }
    },

    async changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages && newPage !== this.currentPage) {
        this.currentPage = newPage;
        await this.loadFavorites();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    async removeFavoriteItem(item) {
      try {
        const response = await favoriteApi.removeFavorite({
          accountId: item.accountId,
        });

        if (response.success) {
          this.$toast?.success?.('Đã xóa khỏi danh sách yêu thích');
          await this.loadFavorites();
        } else {
          this.$toast?.error?.(response.message || 'Không thể xóa khỏi yêu thích');
        }
      } catch (error) {
        console.error('Error removing favorite:', error);
        this.$toast?.error?.('Có lỗi xảy ra khi xóa yêu thích');
      }
    },

    viewDetail(item) {
      // Navigate to account detail page
      this.$router.push(`/DetailAccountPage/${item.accountId}`);
    },

    formatWalletId(id) {
      if (!id) return 'N/A';
      return id.substring(0, 8) + '...';
    },

    formatMoney(amount) {
      return (amount || 0).toLocaleString('vi-VN') + ' VNĐ';
    },

    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },

    formatDateShort(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
    },

    getStatusText(status) {
      const statusMap = {
        0: 'Đang chờ',
        1: 'Đã xác nhận',
        2: 'Đã hủy',
        3: 'Hoàn thành',
      };
      return statusMap[status] || 'Không xác định';
    },

    getStatusClass(status) {
      const classMap = {
        0: 'pending',
        1: 'confirmed',
        2: 'cancelled',
        3: 'completed',
      };
      return classMap[status] || '';
    },

    getStatusIcon(status) {
      const iconMap = {
        0: 'fas fa-clock',
        1: 'fas fa-check-circle',
        2: 'fas fa-times-circle',
        3: 'fas fa-check-double',
      };
      return iconMap[status] || 'fas fa-question-circle';
    },
  },
};
</script>

<style lang="scss" scoped>
// === VARIABLES ===
$primary: #ff6b35;
$primary-light: #ff8f5f;
$primary-lighter: #fff5f2;
$text-dark: #1a1a1a;
$text-gray: #6b7280;
$text-light: #9ca3af;
$border-color: #e5e7eb;
$bg-light: #f9fafb;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$info: #c17635;

// === MAIN CONTAINER ===
.favorites-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
}

// === PAGE HEADER ===
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 8px 0 16px;
  margin-bottom: 32px;
  border-bottom: 2px solid $border-color;

  .header-left {
    display: flex;
    align-items: center;
    gap: 20px;

    .icon-wrapper {
      width: 48px;
      height: 48px;
      background: linear-gradient(135deg, $primary, $primary-light);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.25);

      i {
        font-size: 20px;
        color: white;
      }
    }

    .header-text {
      h1 {
        margin: 0 0 4px 0;
        font-size: 20px;
        font-weight: 700;
        color: $text-dark;
      }

      p {
        margin: 0;
        font-size: 13px;
        color: $text-gray;
      }
    }
  }

  .header-right {
    .count-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      background: $primary-lighter;
      border: 2px solid $primary;
      border-radius: 10px;
      font-weight: 600;
      color: $primary;

      i {
        font-size: 14px;
      }

      span {
        font-size: 13px;
      }
    }
  }
}

// === LOADING STATE ===
.loading-wrapper {
  display: flex;
  justify-content: center;
  padding: 80px 20px;

  .loader {
    text-align: center;

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid $border-color;
      border-top-color: $primary;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }

    p {
      color: $text-gray;
      font-size: 15px;
      font-weight: 500;
    }
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
}

// === EMPTY STATE ===
.empty-wrapper {
  display: flex;
  justify-content: center;
  padding: 80px 20px;

  .empty-content {
    text-align: center;
    max-width: 500px;

    .empty-icon {
      width: 90px;
      height: 90px;
      margin: 0 auto 24px;
      background: $bg-light;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;

      i {
        font-size: 48px;
        color: $text-light;
      }
    }

    h3 {
      margin: 0 0 12px 0;
      font-size: 24px;
      font-weight: 700;
      color: $text-dark;
    }

    p {
      margin: 0 0 32px 0;
      font-size: 15px;
      color: $text-gray;
      line-height: 1.6;
    }

    .btn-explore {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 14px 32px;
      background: linear-gradient(135deg, $primary, $primary-light);
      color: white;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 15px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.3);

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 20px rgba(255, 107, 53, 0.4);
      }

      i {
        font-size: 16px;
      }
    }
  }
}

// === FAVORITES CONTENT ===
.favorites-content {
  .favorites-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 16px;
    margin-bottom: 32px;
  }

  .fav-card {
    background: white;
    border: 2px solid $border-color;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
      border-color: $primary;
    }

    .card-image {
      position: relative;
      height: 150px;
      background: linear-gradient(135deg, $primary-lighter 0%, white 100%);
      display: flex;
      align-items: center;
      justify-content: center;


      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .btn-favorite {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 32px;
        height: 32px;
        background: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

        i {
          font-size: 14px;
          color: $text-light;
        }

        &.active i {
          color: $danger;
        }

        &:hover {
          transform: scale(1.1);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
      }
    }

    .card-content {
      padding: 12px;

      .card-main {
        .card-title {
          margin: 0 0 10px 0;
          font-size: 13px;
          font-weight: 700;
          color: $text-dark;
          display: flex;
          align-items: center;
          gap: 6px;

          i {
            color: $primary;
            font-size: 13px;
          }
        }

        .card-price {
          display: flex;
          align-items: baseline;
          gap: 6px;
          margin-bottom: 10px;

          .price-label {
            font-size: 11px;
            color: $text-gray;
            font-weight: 500;
          }

          .price-value {
            font-size: 16px;
            font-weight: 700;
            color: $success;
          }
        }

        .card-meta {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 10px;

          .meta-item {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 11px;
            color: $text-gray;

            i {
              width: 14px;
              text-align: center;
              color: $primary;
              font-size: 11px;
            }
          }
        }

        .card-status {
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            padding: 4px 10px;
            border-radius: 12px;
            font-size: 10px;
            font-weight: 600;

            &.pending {
              background: #fef3c7;
              color: #92400e;
            }

            &.confirmed {
              background: #dbeafe;
              color: #1e40af;
            }

            &.completed {
              background: #d1fae5;
              color: #065f46;
            }

            &.cancelled {
              background: #fee2e2;
              color: #991b1b;
            }

            i {
              font-size: 10px;
            }
          }
        }
      }

      .card-actions {
        margin-top: 12px;
        padding-top: 12px;
        border-top: 1px solid $border-color;

        .btn-action {
          width: 100%;
          padding: 8px 12px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          font-size: 12px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s ease;

          &.btn-view {
            background: linear-gradient(135deg, $primary, $primary-light);
            color: white;
            box-shadow: 0 2px 8px rgba(255, 107, 53, 0.3);

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(255, 107, 53, 0.4);
            }
          }

          i {
            font-size: 12px;
          }
        }
      }
    }
  }

  .pagination-wrapper {
    margin-top: 48px;
  }
}

// === RESPONSIVE ===
@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    padding: 24px 0;

    .header-left {
      .icon-wrapper {
        width: 56px;
        height: 56px;

        i {
          font-size: 24px;
        }
      }

      .header-text {
        h1 {
          font-size: 22px;
        }

        p {
          font-size: 13px;
        }
      }
    }

    .header-right {
      width: 100%;

      .count-badge {
        width: 100%;
        justify-content: center;
      }
    }
  }

  .favorites-content {
    .favorites-grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 20px 0;

    .header-left {
      gap: 16px;

      .icon-wrapper {
        width: 48px;
        height: 48px;

        i {
          font-size: 20px;
        }
      }

      .header-text {
        h1 {
          font-size: 20px;
        }
      }
    }
  }

  .empty-wrapper {
    padding: 60px 20px;

    .empty-content {
      .empty-icon {
        width: 80px;
        height: 80px;

        i {
          font-size: 36px;
        }
      }

      h3 {
        font-size: 20px;
      }
    }
  }
}
</style>