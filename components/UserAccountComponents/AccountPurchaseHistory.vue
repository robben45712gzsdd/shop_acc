<template>
  <div class="purchase-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-title">
        <i class="fas fa-shopping-cart"></i>
        <h2>Lịch Sử Mua Hàng</h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="fas fa-box"></i>
          {{ totalRecords }} đơn hàng
        </span>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-section">
      <div class="table-wrapper">
        <table class="purchase-table">
          <thead>
            <tr>
              <th>Mã Đơn</th>
              <th>Sản Phẩm</th>
              <th>Hình Ảnh</th>
              <th>Tài Khoản</th>
              <th>Giá</th>
              <th>Thời Gian</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.orderId" class="order-row">
              <!-- MÃ ĐƠN -->
              <td class="cell-id">
                <span class="order-id">{{ item.orderId }}</span>
              </td>

              <!-- SẢN PHẨM -->
              <td class="cell-product">
                <div class="product-info">
                  <span class="product-category">{{ item.accountTitle }}</span>
                  <span class="product-desc">{{ item.description }}</span>
                </div>
              </td>

              <!-- HÌNH ẢNH -->
              <td class="cell-image">
                <div v-if="item.credentials?.additionalInfo" class="image-thumb" @click="openImageModal(item.credentials.additionalInfo)">
                  <img :src="item.credentials.additionalInfo" :alt="item.description" />
                  <div class="image-overlay">
                    <i class="fas fa-search-plus"></i>
                  </div>
                </div>
                <div v-else class="no-image">
                  <i class="fas fa-image"></i>
                </div>
              </td>

              <!-- TÀI KHOẢN -->
              <td class="cell-cred">
                <div class="cred-preview">
                  <div class="cred-line">
                    <i class="fas fa-user"></i>
                    <span class="cred-text" :class="{ blur: !visibleItems[item.orderId] }">
                      {{ item.credentials?.username || 'N/A' }}
                    </span>
                  </div>
                  <div class="cred-line">
                    <i class="fas fa-lock"></i>
                    <span class="cred-text" :class="{ blur: !visibleItems[item.orderId] }">
                      {{ item.credentials?.password || 'N/A' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- GIÁ -->
              <td class="cell-price">
                <span class="price-badge">{{ formatPrice(item.amount) }}</span>
              </td>

              <!-- THỜI GIAN -->
              <td class="cell-time">
                <div class="time-info">
                  <div class="date">{{ formatDateOnly(item.createdAt) }}</div>
                  <div class="time">{{ formatTimeOnly(item.createdAt) }}</div>
                </div>
              </td>

              <!-- THAO TÁC -->
              <td class="cell-action">
                <button class="btn-detail" @click="openDetailModal(item)" title="Chi tiết">
                  <i class="fas fa-info-circle"></i>
                </button>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="history.length === 0" class="empty-row">
              <td colspan="7">
                <div class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Chưa có đơn hàng nào</p>
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

    <!-- INFO -->
    <div class="info-box">
      <i class="fas fa-info-circle"></i>
      <span>Trên điện thoại, vuốt bảng từ phải sang trái để xem thêm thông tin</span>
    </div>

    <!-- DETAIL MODAL -->
    <transition name="modal">
      <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
        <div class="modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-receipt"></i>
              Chi Tiết Đơn Hàng
            </h3>
            <button class="btn-close" @click="closeDetailModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body" v-if="selectedItem">
            <!-- ORDER INFO -->
            <div class="modal-section">
              <h4 class="section-title">Thông Tin Đơn Hàng</h4>
              <div class="info-rows">
                <div class="info-row">
                  <span class="info-label">Mã đơn:</span>
                  <span class="info-value code">{{ selectedItem.orderId }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Danh mục:</span>
                  <span class="info-value">{{ selectedItem.accountTitle }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Mô tả:</span>
                  <span class="info-value">{{ selectedItem.description }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Giá:</span>
                  <span class="info-value price">{{ formatPrice(selectedItem.amount) }}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Thời gian:</span>
                  <span class="info-value">{{ formatDate(selectedItem.createdAt) }}</span>
                </div>
              </div>
            </div>

            <!-- CREDENTIALS -->
            <div class="modal-section">
              <div class="section-header">
                <h4 class="section-title">Thông Tin Tài Khoản</h4>
                <div class="actions">
                  <button class="action-btn" @click="toggleVisibility" :title="visibleItems[selectedItem.orderId] ? 'Ẩn' : 'Hiện'">
                    <i :class="visibleItems[selectedItem.orderId] ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                  </button>
                  <button class="action-btn" @click="copyCredentials(selectedItem)" title="Sao chép">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="cred-box">
                <div class="cred-item">
                  <label class="cred-label">
                    <i class="fas fa-user"></i>
                    Tài Khoản
                  </label>
                  <div class="cred-value" :class="{ blur: !visibleItems[selectedItem.orderId] }">
                    {{ selectedItem.credentials?.username || 'N/A' }}
                  </div>
                </div>
                <div class="cred-item">
                  <label class="cred-label">
                    <i class="fas fa-lock"></i>
                    Mật Khẩu
                  </label>
                  <div class="cred-value" :class="{ blur: !visibleItems[selectedItem.orderId] }">
                    {{ selectedItem.credentials?.password || 'N/A' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- IMAGE -->
            <div v-if="selectedItem.credentials?.additionalInfo" class="modal-section">
              <h4 class="section-title">Hình Ảnh</h4>
              <div class="image-box" @click="openImageModal(selectedItem.credentials.additionalInfo)">
                <img :src="selectedItem.credentials.additionalInfo" :alt="selectedItem.description" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- IMAGE MODAL -->
    <transition name="fade">
      <div v-if="showImageModal" class="image-overlay" @click="closeImageModal">
        <button class="img-close" @click="closeImageModal">
          <i class="fas fa-times"></i>
        </button>
        <img :src="currentImage" :alt="'Image'" class="fullscreen-image" @click.stop />
      </div>
    </transition>
  </div>
</template>

<script>
import order from "~/api/order";

export default {
  data() {
    return {
      history: [],
      page: 1,
      limit: 10,
      totalRecords: 0,
      showDetailModal: false,
      showImageModal: false,
      selectedItem: null,
      currentImage: null,
      visibleItems: {},
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.limit);
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
  },

  mounted() {
    this.fetchHistory();
  },

  methods: {
    async fetchHistory() {
      try {
        const res = await order.getOrderHistory({
          currentPage: this.page,
          recordPerPage: this.limit
        });

        this.history = res.data || [];
        this.totalRecords = res.totalRecords || 0;
        this.initVisibleItems();
      } catch (err) {
        console.error("Fetch history error:", err);
        this.$toast?.error?.("Không thể tải lịch sử mua hàng");
      }
    },

    initVisibleItems() {
      const visible = {};
      this.history.forEach(item => {
        visible[item.orderId] = false;
      });
      this.visibleItems = visible;
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchHistory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    openDetailModal(item) {
      this.selectedItem = item;
      this.showDetailModal = true;
      document.body.style.overflow = 'hidden';
    },

    closeDetailModal() {
      this.showDetailModal = false;
      this.selectedItem = null;
      document.body.style.overflow = '';
    },

    toggleVisibility() {
      if (this.selectedItem) {
        this.$set(this.visibleItems, this.selectedItem.orderId, !this.visibleItems[this.selectedItem.orderId]);
      }
    },

    openImageModal(imageUrl) {
      this.currentImage = imageUrl;
      this.showImageModal = true;
    },

    closeImageModal() {
      this.showImageModal = false;
      this.currentImage = null;
    },

    copyCredentials(item) {
      const text = `Tài khoản: ${item.credentials?.username || 'N/A'}\nMật khẩu: ${item.credentials?.password || 'N/A'}`;

      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.$toast?.success?.("Đã sao chép!");
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$toast?.success?.("Đã sao chép!");
      }
    },

    formatPrice(num) {
      return (num || 0).toLocaleString("vi-VN") + "đ";
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleString("vi-VN");
    },

    formatDateOnly(date) {
      const d = new Date(date);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    },

    formatTimeOnly(date) {
      const d = new Date(date);
      const hours = String(d.getHours()).padStart(2, '0');
      const minutes = String(d.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
    }
  }
};
</script>

<style scoped lang="scss">
$primary: #ff6b35;
$primary-dark: #e55a2b;
$text-main: #1a1a1a;
$text-sub: #666;
$text-light: #999;
$border: #e8e8e8;
$bg: #ffffff;
$bg-light: #f9f9f9;

$success: #10b981;
$success-light: #ecfdf5;

.purchase-history {
  background: $bg;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// ============================================
// HEADER
// ============================================

.history-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, rgba(255, 107, 53, 0.08), rgba(255, 107, 53, 0.03));

  .header-title {
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
      padding: 8px 14px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      backdrop-filter: blur(10px);
      border: 1px solid $primary;
      color: $primary;

      i {
        font-size: 14px;
        color: $primary;
      }
    }
  }
}

// ============================================
// TABLE
// ============================================

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

.purchase-table {
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
    .order-row {
      border-bottom: 1px solid $border;
      transition: all 0.2s;

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
    .order-id {
      display: inline-block;
      padding: 4px 8px;
      background: #f3f4f6;
      color: $text-sub;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      
      letter-spacing: 0.3px;
    }
  }

  .cell-product {
    .product-info {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .product-category {
        display: inline-block;
        width: fit-content;
        padding: 4px 10px;
        background: $primary;
        color: white;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .product-desc {
        font-size: 12px;
        color: $text-sub;
        line-height: 1.4;
        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }

  .cell-image {
    .image-thumb {
      position: relative;
      width: 60px;
      height: 60px;
      border-radius: 6px;
      overflow: hidden;
      cursor: pointer;
      border: 1px solid $border;
      transition: all 0.2s;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .image-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.6);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s;

        i {
          color: white;
          font-size: 16px;
        }
      }

      &:hover {
        border-color: $primary;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);

        .image-overlay {
          opacity: 1;
        }
      }
    }

    .no-image {
      width: 60px;
      height: 60px;
      border: 2px dashed $border;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-light;
      font-size: 20px;
    }
  }

  .cell-cred {
    .cred-preview {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .cred-line {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 11px;

        i {
          color: $primary;
          font-size: 11px;
          flex-shrink: 0;
        }

        .cred-text {
          
          color: $text-sub;
          max-width: 120px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          transition: all 0.2s;

          &.blur {
            filter: blur(3px);
            user-select: none;
          }
        }
      }
    }
  }

  .cell-price {
    .price-badge {
      display: inline-block;
      padding: 6px 12px;
      background: linear-gradient(135deg, $success, darken($success, 10%));
      color: white;
      border-radius: 4px;
      font-size: 12px;
      font-weight: 700;
      white-space: nowrap;
    }
  }

  .cell-time {
    .time-info {
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
      background: $primary;
      color: white;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: $primary-dark;
        transform: translateY(-1px);
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

// ============================================
// PAGINATION
// ============================================

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

// ============================================
// INFO BOX
// ============================================

.info-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  background: #eff6ff;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  font-size: 12px;

  i {
    font-size: 14px;
    flex-shrink: 0;
  }

  span {
    line-height: 1.5;
  }
}

// ============================================
// MODAL
// ============================================

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  backdrop-filter: blur(4px);

  .modal {
    background: $bg;
    border-radius: 8px;
    width: 100%;
    max-width: 700px;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    animation: slideUp 0.3s ease;

    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 20px;
      background: linear-gradient(135deg, $primary, $primary-dark);
      color: white;
      border-bottom: 1px solid $border;

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
        width: 36px;
        height: 36px;
        border: none;
        background: none;
        color: white;
        cursor: pointer;
        font-size: 18px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
          transform: rotate(90deg);
        }
      }
    }

    .modal-body {
      padding: 20px;

      .modal-section {
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }

        .section-title {
          font-size: 13px;
          font-weight: 700;
          color: $text-main;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 12px;
          padding-bottom: 8px;
          border-bottom: 2px solid $primary;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;

          .section-title {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }

          .actions {
            display: flex;
            gap: 8px;

            .action-btn {
              width: 32px;
              height: 32px;
              border: 1px solid $border;
              background: white;
              color: $text-main;
              border-radius: 4px;
              cursor: pointer;
              display: flex;
              align-items: center;
              justify-content: center;
              transition: all 0.2s;
              font-size: 14px;

              &:hover {
                border-color: $primary;
                color: $primary;
                background: #fff8f5;
              }
            }
          }
        }

        .info-rows {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .info-row {
            display: flex;
            gap: 12px;

            .info-label {
              font-size: 12px;
              font-weight: 600;
              color: $text-light;
              text-transform: uppercase;
              letter-spacing: 0.3px;
              min-width: 90px;
              flex-shrink: 0;
            }

            .info-value {
              font-size: 13px;
              color: $text-main;
              flex: 1;
              word-break: break-all;

              &.code {
                
                font-size: 12px;
              }

              &.price {
                color: $success;
                font-weight: 700;
              }
            }
          }
        }

        .cred-box {
          background: $bg-light;
          border: 1px solid $border;
          border-radius: 6px;
          padding: 12px;

          .cred-item {
            padding: 10px 0;

            &:not(:last-child) {
              border-bottom: 1px solid #e5e5e5;
            }

            .cred-label {
              display: flex;
              align-items: center;
              gap: 8px;
              font-size: 11px;
              font-weight: 600;
              color: $text-light;
              text-transform: uppercase;
              margin-bottom: 6px;

              i {
                font-size: 12px;
                color: $primary;
              }
            }

            .cred-value {
              padding: 8px 10px;
              background: white;
              border-radius: 4px;
              
              font-size: 13px;
              color: $text-main;
              word-break: break-all;
              transition: all 0.2s;

              &.blur {
                filter: blur(4px);
                user-select: none;
              }
            }
          }
        }

        .image-box {
          border-radius: 6px;
          overflow: hidden;
          border: 1px solid $border;
          cursor: pointer;
          transition: all 0.2s;

          img {
            width: 100%;
            height: auto;
            display: block;
          }

          &:hover {
            border-color: $primary;
            box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
          }
        }
      }
    }
  }
}

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
  transition: opacity 0.3s;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;
}

// ============================================
// IMAGE MODAL
// ============================================

.image-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .img-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 44px;
    height: 44px;
    border: none;
    background: white;
    color: $text-main;
    border-radius: 4px;
    font-size: 20px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
      background: #f0f0f0;
    }
  }

  .fullscreen-image {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 6px;
    animation: zoomIn 0.3s ease;
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// ============================================
// RESPONSIVE
// ============================================

@media (max-width: 768px) {
  .history-header {
    padding: 12px 16px;
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;

    .header-title h2 {
      font-size: 16px;
    }
  }

  .table-wrapper {
    min-width: auto;
  }

  .purchase-table {
    font-size: 12px;

    thead th {
      padding: 10px;
      font-size: 10px;
    }

    tbody td {
      padding: 10px;
    }

    .cell-image {
      .image-thumb,
      .no-image {
        width: 50px;
        height: 50px;
      }
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

  .info-box {
    padding: 10px 14px;
    font-size: 11px;
  }

  .modal {
    max-width: 95%;
  }
}

@media (max-width: 480px) {
  .history-header {
    padding: 10px 12px;

    .header-title {
      h2 {
        font-size: 14px;
      }

      i {
        font-size: 16px;
      }
    }

    .stat-badge {
      font-size: 11px;
      padding: 6px 10px;
    }
  }

  .purchase-table {
    font-size: 11px;

    thead th {
      padding: 8px;
      font-size: 9px;
    }

    tbody td {
      padding: 8px;
    }
  }
}
</style>