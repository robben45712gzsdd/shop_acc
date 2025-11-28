<template>
  <div class="item-purchase-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-content">
        <i class="fas fa-shopping-bag"></i>
        <h2>Lịch Sử Mua Vật Phẩm</h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="fas fa-box"></i>
          {{ totalItems }} vật phẩm
        </span>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-section">
      <div class="table-wrapper">
        <table class="item-table">
          <thead>
            <tr>
              <th>ID Giao Dịch</th>
              <th>Danh Mục</th>
              <th>Tên Vật Phẩm</th>
              <th>Trị Giá</th>
              <th>Mua Giá</th>
              <th>Mua Lúc</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in itemHistory" :key="index" class="item-row">
              <!-- ID -->
              <td class="cell-id">
                <span class="id-badge">{{ item.id }}</span>
              </td>

              <!-- DANH MỤC -->
              <td class="cell-category">
                <span class="category-badge" :class="'category-' + item.category">
                  <i :class="getCategoryIcon(item.category)"></i>
                  {{ item.categoryName }}
                </span>
              </td>

              <!-- TÊN VẬT PHẨM -->
              <td class="cell-name">
                <div class="item-info">
                  <span class="item-name">{{ item.itemName }}</span>
                  <span class="item-desc">{{ item.description }}</span>
                </div>
              </td>

              <!-- TRỊ GIÁ -->
              <td class="cell-value">
                <span class="value-badge original">{{ formatPrice(item.originalPrice) }}</span>
              </td>

              <!-- MUA GIÁ -->
              <td class="cell-price">
                <span class="price-badge">{{ formatPrice(item.purchasePrice) }}</span>
              </td>

              <!-- THỜI GIAN -->
              <td class="cell-time">
                <div class="time-content">
                  <div class="date">{{ formatDate(item.createdAt) }}</div>
                  <div class="time">{{ formatTime(item.createdAt) }}</div>
                </div>
              </td>

              <!-- CHI TIẾT -->
              <td class="cell-action">
                <button class="btn-detail" @click="openDetail(item)" title="Chi tiết">
                  <i class="fa-chevron-right fas"></i>
                </button>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="itemHistory.length === 0" class="empty-row">
              <td colspan="7">
                <div class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Chưa có lịch sử mua vật phẩm</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="pagination-section" v-if="totalPages > 1">
      <div class="pagination">
        <button
          class="page-btn prev"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >
          <i class="fa-chevron-left fas"></i>
        </button>

        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn number"
            :class="{ active: page === p }"
            @click="changePage(p)"
          >
            {{ p }}
          </button>
        </div>

        <button
          class="page-btn next"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >
          <i class="fa-chevron-right fas"></i>
        </button>
      </div>

      <div class="page-info">
        Trang {{ page }} / {{ totalPages }}
      </div>
    </div>

    <!-- SUMMARY SECTION -->
    <div class="summary-section">
      <div class="summary-card">
        <div class="summary-icon spent">
          <i class="fas fa-wallet"></i>
        </div>
        <div class="summary-content">
          <span class="summary-label">Tổng Chi Tiêu</span>
          <span class="summary-value">{{ formatPrice(summary.totalSpent) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon saved">
          <i class="fas fa-piggy-bank"></i>
        </div>
        <div class="summary-content">
          <span class="summary-label">Tiết Kiệm Được</span>
          <span class="summary-value">{{ formatPrice(summary.totalSaved) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon average">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="summary-content">
          <span class="summary-label">Giá Trị Trung Bình</span>
          <span class="summary-value">{{ formatPrice(summary.averagePrice) }}</span>
        </div>
      </div>

      <div class="summary-card">
        <div class="summary-icon discount">
          <i class="fas fa-percentage"></i>
        </div>
        <div class="summary-content">
          <span class="summary-label">Chiết Khấu Trung Bình</span>
          <span class="summary-value">{{ summary.averageDiscount }}%</span>
        </div>
      </div>
    </div>

    <!-- MOBILE TIP -->
    <div class="mobile-tip">
      <i class="fas fa-mobile-alt"></i>
      <span>Trên điện thoại, vuốt bảng từ phải sang trái để xem đầy đủ thông tin</span>
    </div>

    <!-- DETAIL MODAL -->
    <transition name="modal">
      <div v-if="showDetail" class="modal-overlay" @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-package"></i>
              Chi Tiết Vật Phẩm
            </h3>
            <button class="btn-close" @click="closeDetail">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body" v-if="selectedItem">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID Giao Dịch</span>
                <span class="detail-value code">{{ selectedItem.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Danh Mục</span>
                <span class="detail-value">{{ selectedItem.categoryName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tên Vật Phẩm</span>
                <span class="detail-value">{{ selectedItem.itemName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Mô Tả</span>
                <span class="detail-value">{{ selectedItem.description }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Trị Giá Gốc</span>
                <span class="detail-value original">{{ formatPrice(selectedItem.originalPrice) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Giá Mua</span>
                <span class="detail-value purchased">{{ formatPrice(selectedItem.purchasePrice) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tiết Kiệm Được</span>
                <span class="detail-value saved">{{ formatPrice(selectedItem.originalPrice - selectedItem.purchasePrice) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Chiết Khấu</span>
                <span class="detail-value discount">{{ calculateDiscount(selectedItem.originalPrice, selectedItem.purchasePrice) }}%</span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">Mua Lúc</span>
                <span class="detail-value">{{ formatFullDate(selectedItem.createdAt) }}</span>
              </div>
            </div>

            <!-- ITEM FEATURES (if any) -->
            <div v-if="selectedItem.features && selectedItem.features.length" class="features-section">
              <h4 class="section-title">Tính Năng Vật Phẩm</h4>
              <div class="features-list">
                <div v-for="(feature, idx) in selectedItem.features" :key="idx" class="feature-item">
                  <i class="fas fa-check-circle"></i>
                  <span>{{ feature }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'ItemPurchaseHistory',
  data() {
    return {
      page: 1,
      limit: 10,
      showDetail: false,
      selectedItem: null,
      itemHistory: [
        {
          id: '845512',
          category: 'lol',
          categoryName: 'Liên Minh Huyền Thoại',
          itemName: 'Nick Cấp 30',
          description: 'Nick mới, đủ điều kiện rank',
          originalPrice: 200000,
          purchasePrice: 150000,
          features: ['Tài khoản mới', 'Đủ điều kiện Rank', '2 năm bảo hành'],
          createdAt: new Date('2024-06-16'),
        },
        {
          id: '845511',
          category: 'valorant',
          categoryName: 'Valorant',
          itemName: 'Valorant Point 1000',
          description: 'Gói điểm trong game',
          originalPrice: 500000,
          purchasePrice: 450000,
          features: ['Ngay lập tức', 'An toàn 100%', 'Bảo mật tài khoản'],
          createdAt: new Date('2024-06-15'),
        },
        {
          id: '845510',
          category: 'dota',
          categoryName: 'Dota 2',
          itemName: 'Cosmetics Arcana',
          description: 'Trang phục Arcana cho nhân vật',
          originalPrice: 1000000,
          purchasePrice: 800000,
          features: ['Cosmetics hiếm', 'Bao gồm hiệu ứng', 'Nâng cấp vĩnh viễn'],
          createdAt: new Date('2024-06-14'),
        },
      ],
    };
  },

  computed: {
    totalItems() {
      return this.itemHistory.length;
    },

    totalPages() {
      return Math.ceil(this.itemHistory.length / this.limit);
    },

    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },

    summary() {
      const totalSpent = this.itemHistory.reduce((sum, item) => sum + item.purchasePrice, 0);
      const totalOriginal = this.itemHistory.reduce((sum, item) => sum + item.originalPrice, 0);
      const totalSaved = totalOriginal - totalSpent;
      const averagePrice = this.totalItems > 0 ? Math.floor(totalSpent / this.totalItems) : 0;
      const averageDiscount = this.totalItems > 0
        ? Math.round((totalSaved / totalOriginal) * 100)
        : 0;

      return {
        totalSpent,
        totalSaved,
        averagePrice,
        averageDiscount,
      };
    },
  },

  methods: {
    getCategoryIcon(category) {
      const icons = {
        lol: 'fas fa-crown',
        valorant: 'fas fa-crosshairs',
        dota: 'fas fa-wand-magic-sparkles',
        csgo: 'fas fa-gun',
      };
      return icons[category] || 'fas fa-gamepad';
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    openDetail(item) {
      this.selectedItem = item;
      this.showDetail = true;
      document.body.style.overflow = 'hidden';
    },

    closeDetail() {
      this.showDetail = false;
      this.selectedItem = null;
      document.body.style.overflow = '';
    },

    formatDate(date) {
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    },

    formatTime(date) {
      const d = new Date(date);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },

    formatFullDate(date) {
      const d = new Date(date);
      return d.toLocaleString('vi-VN');
    },

    formatPrice(num) {
      return (num || 0).toLocaleString('vi-VN') + 'đ';
    },

    calculateDiscount(original, purchased) {
      if (original <= 0) return 0;
      return Math.round(((original - purchased) / original) * 100);
    },
  },
};
</script>

<style lang="scss" scoped>
// DESIGN TOKENS
$primary: #ff6b35;
$primary-dark: #e55a28;
$primary-light: #ff8f5f;
$text-main: #1a1a1a;
$text-sub: #6b7280;
$text-light: #9ca3af;
$border: #e5e7eb;
$border-light: #f3f4f6;
$bg: #ffffff;
$bg-light: #f9fafb;
$bg-darker: #f3f4f6;

$green: #10b981;
$green-light: #ecfdf5;
$blue: #3b82f6;
$blue-light: #eff6ff;
$purple: #a855f7;
$purple-light: #faf5ff;
$red: #ef4444;
$red-light: #fef2f2;
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$pink: #ec4899;
$pink-light: #fce7f3;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.item-purchase-history {
  padding: 0;

  // HEADER
  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
    border-bottom: 2px solid $border;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      i {
        font-size: 20px;
        color: $primary;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        color: $text-main;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .header-stats {
      .stat-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255, 107, 53, 0.1);
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: $primary;
        border: 1px solid rgba(255, 107, 53, 0.2);

        i {
          font-size: 14px;
        }
      }
    }
  }

  // TABLE SECTION
  .table-section {
    overflow-x: auto;
    border-top: 1px solid $border;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: $bg-light;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 107, 53, 0.3);
      border-radius: 3px;

      &:hover {
        background: rgba(255, 107, 53, 0.5);
      }
    }
  }

  .table-wrapper {
    min-width: 1000px;
  }

  .item-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead {
      background: $bg-light;
      border-bottom: 2px solid $primary;

      th {
        padding: 12px 14px;
        text-align: left;
        font-weight: 700;
        color: $text-main;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    tbody {
      .item-row {
        border-bottom: 1px solid $border;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 107, 53, 0.03);
        }

        &:last-child {
          border-bottom: none;
        }
      }

      td {
        padding: 14px;
        vertical-align: middle;
      }
    }

    // CELLS
    .cell-id {
      .id-badge {
        display: inline-block;
        padding: 4px 8px;
        background: $bg-light;
        color: $text-sub;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }
    }

    .cell-category {
      .category-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;

        i {
          font-size: 11px;
        }

        &.category-lol {
          background: $blue-light;
          color: $blue;
        }

        &.category-valorant {
          background: $pink-light;
          color: $pink;
        }

        &.category-dota {
          background: $purple-light;
          color: $purple;
        }

        &.category-csgo {
          background: $yellow-light;
          color: darken($yellow, 10%);
        }
      }
    }

    .cell-name {
      .item-info {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .item-name {
          font-size: 12px;
          font-weight: 600;
          color: $text-main;
        }

        .item-desc {
          font-size: 11px;
          color: $text-sub;
        }
      }
    }

    .cell-value {
      .value-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 12px;
        background: $border-light;
        color: $text-sub;
        text-decoration: line-through;

        &.original {
          opacity: 0.7;
        }
      }
    }

    .cell-price {
      .price-badge {
        display: inline-block;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 12px;
        background: linear-gradient(135deg, $green, darken($green, 10%));
        color: white;
      }
    }

    .cell-time {
      .time-content {
        .date {
          font-weight: 700;
          color: $text-main;
          font-size: 12px;
          margin-bottom: 2px;
        }

        .time {
          color: $text-light;
          font-size: 11px;
        }
      }
    }

    .cell-action {
      .btn-detail {
        width: 36px;
        height: 36px;
        border: none;
        background: $bg-light;
        color: $primary;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-size: 14px;

        &:hover {
          background: $primary;
          color: white;
          transform: translateX(2px);
        }
      }
    }
  }

  // EMPTY STATE
  .empty-row {
    border: none;

    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: $text-light;

      i {
        font-size: 48px;
        opacity: 0.3;
        display: block;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: $text-sub;
      }
    }
  }

  // PAGINATION
  .pagination-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid $border;
    background: $bg-light;
    gap: 20px;

    .pagination {
      display: flex;
      align-items: center;
      gap: 6px;

      .page-btn {
        width: 36px;
        height: 36px;
        border: 1px solid $border;
        background: white;
        color: $text-main;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover:not(:disabled) {
          border-color: $primary;
          color: $primary;
          transform: translateY(-1px);
        }

        &.active {
          background: linear-gradient(135deg, $primary, $primary-dark);
          color: white;
          border-color: $primary;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        i {
          font-size: 14px;
        }
      }

      .page-numbers {
        display: flex;
        gap: 6px;
      }
    }

    .page-info {
      font-size: 12px;
      color: $text-sub;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  // SUMMARY SECTION
  .summary-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, $bg-light, $bg-darker);
    border-top: 1px solid $border;

    .summary-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: white;
      border-radius: 10px;
      border: 1px solid $border-light;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }

      .summary-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        flex-shrink: 0;

        &.spent {
          background: linear-gradient(135deg, $red, darken($red, 10%));
        }

        &.saved {
          background: linear-gradient(135deg, $green, darken($green, 10%));
        }

        &.average {
          background: linear-gradient(135deg, $blue, darken($blue, 10%));
        }

        &.discount {
          background: linear-gradient(135deg, $purple, darken($purple, 10%));
        }
      }

      .summary-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .summary-label {
          font-size: 11px;
          font-weight: 700;
          color: $text-light;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .summary-value {
          font-size: 18px;
          font-weight: 800;
          color: $text-main;
        }
      }
    }
  }

  // MOBILE TIP
  .mobile-tip {
    display: none;
    align-items: center;
    gap: 10px;
    margin: 0 20px 20px 20px;
    padding: 12px 14px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    border-left: 4px solid #1e40af;

    i {
      font-size: 14px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }

  // MODAL
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: $shadow-lg;
      animation: slideUp 0.3s ease;

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: white;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;

          i {
            font-size: 18px;
          }
        }

        .btn-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: rotate(90deg);
          }

          i {
            font-size: 16px;
          }
        }
      }

      .modal-body {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 20px;

        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;

          .detail-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px;
            background: $bg-light;
            border-radius: 8px;
            border-left: 3px solid $primary;

            &.full-width {
              grid-column: 1 / -1;
            }

            .detail-label {
              font-size: 11px;
              font-weight: 700;
              color: $text-light;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }

            .detail-value {
              font-size: 13px;
              font-weight: 600;
              color: $text-main;

              &.code {
                font-family: 'Courier New', monospace;
                font-size: 12px;
              }

              &.original {
                color: $red;
                text-decoration: line-through;
                opacity: 0.7;
              }

              &.purchased {
                color: $green;
                font-weight: 700;
              }

              &.saved {
                color: $blue;
                font-weight: 700;
              }

              &.discount {
                color: $purple;
                font-weight: 700;
              }
            }
          }
        }

        .features-section {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 16px;
          background: $bg-light;
          border-radius: 8px;
          border-left: 3px solid $green;

          .section-title {
            font-size: 12px;
            font-weight: 700;
            color: $text-main;
            text-transform: uppercase;
            letter-spacing: 0.3px;
            margin: 0;
          }

          .features-list {
            display: flex;
            flex-direction: column;
            gap: 8px;

            .feature-item {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 12px;
              color: $text-sub;

              i {
                font-size: 13px;
                color: $green;
                flex-shrink: 0;
              }
            }
          }
        }
      }
    }
  }
}

// ANIMATIONS
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: translateY(30px);
  }
}

// RESPONSIVE
@media (max-width: 768px) {
  .item-purchase-history {
    .history-header {
      padding: 16px;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;

      .header-content h2 {
        font-size: 16px;
      }
    }

    .item-table {
      font-size: 12px;

      thead th {
        padding: 10px;
        font-size: 10px;
      }

      tbody td {
        padding: 10px;
      }
    }

    .pagination-section {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      .pagination {
        justify-content: center;
      }

      .page-info {
        text-align: center;
      }
    }

    .summary-section {
      padding: 16px;
      gap: 12px;
      grid-template-columns: repeat(2, 1fr);

      .summary-card {
        gap: 10px;
        padding: 12px;

        .summary-icon {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }

        .summary-content .summary-value {
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .item-purchase-history {
    .history-header {
      padding: 12px;

      .header-content {
        h2 {
          font-size: 14px;
        }

        i {
          font-size: 18px;
        }
      }

      .header-stats .stat-badge {
        font-size: 11px;
        padding: 6px 10px;
      }
    }

    .item-table {
      font-size: 11px;
      min-width: 800px;

      thead th {
        padding: 8px;
        font-size: 9px;
      }

      tbody td {
        padding: 8px;
      }
    }

    .summary-section {
      padding: 12px;
      gap: 10px;
      grid-template-columns: repeat(2, 1fr);

      .summary-card {
        padding: 10px;
        gap: 8px;

        .summary-icon {
          width: 36px;
          height: 36px;
          font-size: 14px;
        }

        .summary-content .summary-value {
          font-size: 14px;
        }
      }
    }

    .modal-content .modal-body .detail-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>