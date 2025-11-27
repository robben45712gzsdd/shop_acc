<template>
  <div class="account-purchase-history">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa fa-history"></i>
          <h2 class="title">Lịch sử mua vật phẩm</h2>
        </div>
        <div class="header-stats">
          <span class="stat-item">
            <i class="fa fa-shopping-cart"></i>
            Tổng: <strong>{{ totalPages }}</strong> đơn
          </span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="premium-table">
          <thead>
            <tr>
              <th width="100">Mã đơn</th>
              <th width="200">Thông tin</th>
              <th width="120">Hình ảnh</th>
              <th width="180">Tài khoản</th>
              <th width="100">Giá tiền</th>
              <th width="140">Thời gian</th>
              <th width="80">Chi tiết</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in history" :key="item.orderId" class="table-row">
              <!-- Mã đơn -->
              <td>
                <div class="order-id">
                  <span class="id-text">#{{ item.orderId }}</span>
                </div>
              </td>

              <!-- Thông tin game -->
              <td>
                <div class="game-info">
                  <div class="game-category">
                    <span class="category-badge">{{ item.accountTitle }}</span>
                  </div>
                  <div class="game-name">{{ item.description }}</div>
                </div>
              </td>

              <!-- Hình ảnh -->
              <td>
                <div class="image-cell">
                  <div v-if="item.credentials?.additionalInfo" class="thumbnail-wrapper"
                    @click="openImageModal(item.credentials.additionalInfo)">
                    <img :src="item.credentials.additionalInfo" alt="Ảnh tài khoản" class="thumbnail-image" />
                    <div class="image-overlay">
                      <i class="fa fa-search-plus"></i>
                    </div>
                  </div>
                  <div v-else class="no-image">
                    <i class="fa fa-image"></i>
                    <span>Không có</span>
                  </div>
                </div>
              </td>

              <!-- Tài khoản -->
              <td>
                <div class="credentials-preview">
                  <div class="cred-item">
                    <i class="fa fa-user icon-user"></i>
                    <span class="cred-value" :class="{ 'blur': !visibleItems[item.orderId] }">
                      {{ item.credentials?.username || 'N/A' }}
                    </span>
                  </div>
                  <div class="cred-item">
                    <i class="fa fa-lock icon-lock"></i>
                    <span class="cred-value" :class="{ 'blur': !visibleItems[item.orderId] }">
                      {{ item.credentials?.password || 'N/A' }}
                    </span>
                  </div>
                </div>
              </td>

              <!-- Giá tiền -->
              <td>
                <div class="price-cell">
                  <span class="price-amount">{{ formatPrice(item.amount) }}</span>
                </div>
              </td>

              <!-- Thời gian -->
              <td>
                <div class="datetime-cell">
                  <div class="date">{{ formatDateOnly(item.createdAt) }}</div>
                  <div class="time">{{ formatTimeOnly(item.createdAt) }}</div>
                </div>
              </td>

              <!-- Chi tiết -->
              <td>
                <div class="action-cell">
                  <button @click="openDetailModal(item)" class="detail-btn" title="Xem chi tiết">
                    <i class="fa fa-info-circle"></i>
                  </button>
                </div>
              </td>
            </tr>

            <tr v-if="history.length === 0">
              <td colspan="7" class="empty-state">
                <div class="empty-content">
                  <div class="empty-icon">
                    <i class="fa fa-inbox"></i>
                  </div>
                  <p class="empty-text">Chưa có lịch sử mua hàng</p>
                  <p class="empty-subtext">Các giao dịch của bạn sẽ hiển thị tại đây</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Pagination -->
    <div class="pagination-wrapper">
      <Pagination :currentPage="page" :totalPages="totalPages" @update:page="changePage" />
    </div>

    <!-- Modal Chi tiết đơn hàng -->
    <transition name="modal-fade">
      <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
        <div class="modal-container detail-modal" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fa fa-file-text"></i>
              Chi tiết đơn hàng
            </h3>
            <button class="close-modal-btn" @click="closeDetailModal">
              <i class="fa fa-times"></i>
            </button>
          </div>

          <div class="modal-body" v-if="selectedItem">
            <div class="detail-section">
              <div class="section-title">Thông tin đơn hàng</div>
              <div class="detail-grid">
                <div class="detail-item">
                  <span class="detail-label">Mã đơn hàng:</span>
                  <span class="detail-value id-value">{{ selectedItem.orderId }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Danh mục:</span>
                  <span class="detail-value">{{ selectedItem.accountTitle }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Tên game:</span>
                  <span class="detail-value">{{ selectedItem.description }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Giá tiền:</span>
                  <span class="detail-value price-highlight">{{ formatPrice(selectedItem.amount) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Thời gian mua:</span>
                  <span class="detail-value">{{ formatDate(selectedItem.createdAt) }}</span>
                </div>
              </div>
            </div>

            <div class="detail-section credentials-section">
              <div class="section-title-with-action">
                <div class="section-title">Thông tin tài khoản</div>
                <div class="credential-actions">
                  <button @click="toggleModalVisibility" class="action-icon-btn"
                    :title="visibleItems[selectedItem.orderId] ? 'Ẩn thông tin' : 'Hiện thông tin'">
                    <i :class="visibleItems[selectedItem.orderId] ? 'fa fa-eye-slash' : 'fa fa-eye'"></i>
                  </button>
                  <button @click="copyCredentials(selectedItem)" class="action-icon-btn" title="Sao chép">
                    <i class="fa fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="credentials-box">
                <div class="cred-row">
                  <div class="cred-label">
                    <i class="fa fa-user"></i>
                    Tài khoản
                  </div>
                  <div class="cred-content" :class="{ 'blur': !visibleItems[selectedItem.orderId] }">
                    {{ selectedItem.credentials?.username || 'N/A' }}
                  </div>
                </div>
                <div class="cred-row">
                  <div class="cred-label">
                    <i class="fa fa-lock"></i>
                    Mật khẩu
                  </div>
                  <div class="cred-content" :class="{ 'blur': !visibleItems[selectedItem.orderId] }">
                    {{ selectedItem.credentials?.password || 'N/A' }}
                  </div>
                </div>
              </div>
            </div>

            <div class="detail-section" v-if="selectedItem.credentials?.additionalInfo">
              <div class="section-title">Hình ảnh đính kèm</div>
              <div class="detail-image-wrapper">
                <img :src="selectedItem.credentials.additionalInfo" alt="Ảnh đính kèm" class="detail-image"
                  @click="openImageModal(selectedItem.credentials.additionalInfo)" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <p class="description">
        <strong>Dùng điện thoại <i class="fa fa-mobile" aria-hidden="true"></i>, hãy
          vuốt bảng từ phải qua trái (
          <i class="fa fa-arrow-circle-left" aria-hidden="true"></i> ) để xem đầy
          đủ thông tin!</strong>
      </p>
    </transition>

    <!-- Modal Xem ảnh full -->
    <transition name="fade">
      <div v-if="showImageModal" class="modal-overlay image-modal-overlay" @click="closeImageModal">
        <div class="image-modal-content" @click.stop>
          <button class="image-close-btn" @click="closeImageModal">
            <i class="fa fa-times"></i>
          </button>
          <img :src="currentImage" alt="Ảnh đính kèm" class="full-image" />
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import order from "~/api/order";

export default {
  components: { Pagination },

  data() {
    return {
      history: [],
      page: 1,
      limit: 10,
      totalPages: 0,
      showDetailModal: false,
      showImageModal: false,
      selectedItem: null,
      currentImage: null,
      visibleItems: {},
    };
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

        this.history = res.data;
        this.totalPages = Math.ceil(res.totalRecords / this.limit);

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

    toggleModalVisibility() {
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
          this.$toast?.success?.("Đã sao chép thông tin!");
        });
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.$toast?.success?.("Đã sao chép thông tin!");
      }
    },

    changePage(newPage) {
      this.page = newPage;
      this.fetchHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
    },

    formatPrice(num) {
      return num?.toLocaleString("vi-VN") + "đ" || "0đ";
    }
  }
};
</script>

<style lang="scss" scoped>
$primary-color: #FF723D;
$primary-dark: #e55a28;
$primary-light: #ff8f5f;
$text-dark: #1a1a1a;
$text-gray: #6b7280;
$border-color: #e5e7eb;
$bg-light: #f9fafb;

.account-purchase-history {
  width: 100%;
  overflow: hidden;
  border-radius: 10px;

  // Header
  .header {
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    padding: 12px 15px;
    color: white;

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
    }

    .title-section {
      display: flex;
      align-items: center;
      gap: 12px;

      i {
        font-size: 1.5rem;
      }

      .title {
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .header-stats {
      .stat-item {
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 20px;
        font-size: 0.875rem;

        i {
          margin-right: 6px;
        }

        strong {
          font-weight: 700;
        }
      }
    }
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 8px;
    border: 1px solid $border-color;

    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: $bg-light;
    }

    &::-webkit-scrollbar-thumb {
      background: lighten($primary-color, 20%);
      border-radius: 4px;

      &:hover {
        background: $primary-color;
      }
    }
  }

  .premium-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    min-width: 1000px;

    thead {
      background: $bg-light;
      border-bottom: 2px solid $primary-color;

      th {
        padding: 14px 12px;
        text-align: left;
        font-weight: 600;
        color: $text-dark;
        text-transform: uppercase;
        font-size: 0.75rem;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    tbody {
      .table-row {
        border-bottom: 1px solid $border-color;
        transition: all 0.2s ease;

        &:hover {
          background: lighten($primary-color, 45%);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }

        &:last-child {
          border-bottom: none;
        }
      }

      td {
        padding: 14px 12px;
        vertical-align: middle;
      }
    }
  }

  // Order ID
  .order-id {
    .id-text {
      display: inline-block;
      padding: 6px 10px;
      background: linear-gradient(135deg, lighten($primary-color, 35%) 0%, lighten($primary-color, 40%) 100%);
      color: $primary-dark;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      border: 1px solid lighten($primary-color, 30%);
    }
  }

  // Game Info
  .game-info {
    .game-category {
      margin-bottom: 6px;

      .category-badge {
        display: inline-block;
        padding: 4px 10px;
        background: $primary-color;
        color: white;
        border-radius: 4px;
        font-size: 0.7rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }
    }

    .game-name {
      color: $text-gray;
      font-size: 0.813rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }

  // Image Cell
  .image-cell {
    .thumbnail-wrapper {
      position: relative;
      width: 80px;
      height: 80px;
      border-radius: 8px;
      overflow: hidden;
      cursor: pointer;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;

      &:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 12px rgba($primary-color, 0.3);

        .image-overlay {
          opacity: 1;
        }
      }

      .thumbnail-image {
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
        transition: opacity 0.3s ease;

        i {
          color: white;
          font-size: 1.5rem;
        }
      }
    }

    .no-image {
      width: 80px;
      height: 80px;
      border-radius: 8px;
      border: 2px dashed $border-color;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 6px;
      color: $text-gray;

      i {
        font-size: 1.5rem;
        opacity: 0.5;
      }

      span {
        font-size: 0.7rem;
      }
    }
  }

  // Credentials Preview
  .credentials-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .cred-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 10px;
      background: $bg-light;
      border-radius: 6px;
      font-size: 0.813rem;

      i {
        font-size: 0.75rem;
        width: 14px;

        &.icon-user {
          color: #3b82f6;
        }

        &.icon-lock {
          color: #8b5cf6;
        }
      }

      .cred-value {
        flex: 1;
        font-family: 'Courier New', monospace;
        color: $text-dark;
        transition: all 0.3s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &.blur {
          filter: blur(4px);
          user-select: none;
        }
      }
    }
  }

  // Price
  .price-cell {
    .price-amount {
      display: inline-block;
      padding: 8px 14px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: white;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.875rem;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(16, 185, 129, 0.2);
    }
  }

  // DateTime
  .datetime-cell {
    .date {
      font-weight: 600;
      color: $text-dark;
      font-size: 0.813rem;
      margin-bottom: 4px;
    }

    .time {
      color: $text-gray;
      font-size: 0.75rem;
    }
  }

  // Action Cell
  .action-cell {
    text-align: center;

    .detail-btn {
      width: 40px;
      height: 40px;
      border: none;
      border-radius: 8px;
      background: $primary-color;
      color: white;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba($primary-color, 0.2);

      &:hover {
        background: $primary-dark;
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba($primary-color, 0.3);
      }

      &:active {
        transform: translateY(0);
      }

      i {
        font-size: 1.125rem;
      }
    }
  }

  // Empty State
  .empty-state {
    .empty-content {
      padding: 80px 20px;
      text-align: center;

      .empty-icon {
        margin-bottom: 20px;

        i {
          font-size: 4rem;
          color: lighten($text-gray, 20%);
          opacity: 0.5;
        }
      }

      .empty-text {
        font-size: 1rem;
        font-weight: 600;
        color: $text-gray;
        margin-bottom: 8px;
      }

      .empty-subtext {
        font-size: 0.875rem;
        color: lighten($text-gray, 10%);
      }
    }
  }
}

// Modal Overlay
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
}

// Detail Modal
.modal-container {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease;

  .modal-header {
    padding: 20px 24px;
    background: linear-gradient(135deg, $primary-color 0%, $primary-dark 100%);
    color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .modal-title {
      font-size: 1.125rem;
      font-weight: 700;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        font-size: 1.25rem;
      }
    }

    .close-modal-btn {
      width: 36px;
      height: 36px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.2);
      color: white;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(255, 255, 255, 0.3);
        transform: rotate(90deg);
      }

      i {
        font-size: 1.125rem;
      }
    }
  }

  .modal-body {
    padding: 24px;
    overflow-y: auto;
    flex: 1;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: $bg-light;
    }

    &::-webkit-scrollbar-thumb {
      background: lighten($primary-color, 20%);
      border-radius: 3px;

      &:hover {
        background: $primary-color;
      }
    }
  }

  .detail-section {
    margin-bottom: 24px;

    &:last-child {
      margin-bottom: 0;
    }

    .section-title {
      font-size: 0.875rem;
      font-weight: 700;
      color: $text-dark;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 16px;
      padding-bottom: 8px;
      border-bottom: 2px solid $primary-color;
    }

    .section-title-with-action {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;

      .section-title {
        margin-bottom: 0;
        padding-bottom: 0;
        border-bottom: none;
      }

      .credential-actions {
        display: flex;
        gap: 8px;

        .action-icon-btn {
          width: 36px;
          height: 36px;
          border: none;
          border-radius: 6px;
          background: $bg-light;
          color: $text-dark;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;

          &:hover {
            background: $primary-color;
            color: white;
          }

          i {
            font-size: 0.875rem;
          }
        }
      }
    }
  }

  .detail-grid {
    display: grid;
    gap: 16px;

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .detail-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: $text-gray;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .detail-value {
        font-size: 0.938rem;
        color: $text-dark;
        padding: 10px 14px;
        background: $bg-light;
        border-radius: 6px;
        word-break: break-all;

        &.id-value {
          font-family: 'Courier New', monospace;
          font-size: 0.813rem;
        }

        &.price-highlight {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: white;
          font-weight: 700;
        }
      }
    }
  }

  .credentials-section {
    .credentials-box {
      background: $bg-light;
      border-radius: 8px;
      padding: 16px;
      border: 1px solid $border-color;

      .cred-row {
        display: flex;
        flex-direction: column;
        gap: 8px;
        padding: 12px 0;

        &:not(:last-child) {
          border-bottom: 1px solid darken($bg-light, 5%);
        }

        .cred-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.75rem;
          font-weight: 600;
          color: $text-gray;
          text-transform: uppercase;

          i {
            font-size: 0.875rem;
            color: $primary-color;
          }
        }

        .cred-content {
          font-family: 'Courier New', monospace;
          font-size: 1rem;
          color: $text-dark;
          padding: 10px 14px;
          background: white;
          border-radius: 6px;
          transition: all 0.3s ease;
          word-break: break-all;

          &.blur {
            filter: blur(5px);
            user-select: none;
          }
        }
      }
    }
  }

  .detail-image-wrapper {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid $border-color;

    .detail-image {
      width: 100%;
      height: auto;
      display: block;
      cursor: pointer;
      transition: transform 0.3s ease;

      &:hover {
        transform: scale(1.02);
      }
    }
  }
}

// Image Modal
.image-modal-overlay {
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(8px);
}

.image-modal-content {
  position: relative;
  max-width: 95%;
  max-height: 95%;
  animation: zoomIn 0.3s ease;

  .image-close-btn {
    position: absolute;
    top: -50px;
    right: 0;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 50%;
    background: $primary-color;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);

    &:hover {
      background: $primary-dark;
      transform: rotate(90deg) scale(1.1);
    }

    i {
      font-size: 1.25rem;
    }
  }

  .full-image {
    max-width: 100%;
    max-height: 85vh;
    border-radius: 8px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  }
}

// Animations
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

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.8);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;

  .modal-container {
    transition: transform 0.3s ease;
  }
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;

  .modal-container {
    transform: translateY(30px);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Responsive
@media (max-width: 768px) {
  .account-purchase-history {
    border-radius: 0;

    .header {
      padding: 16px 20px;

      .header-content {
        flex-direction: column;
        align-items: flex-start;
      }

      .title-section {
        .title {
          font-size: 1.125rem;
        }
      }
    }


    .premium-table {
      font-size: 0.813rem;

      thead th {
        padding: 12px 10px;
        font-size: 0.7rem;
      }

      tbody td {
        padding: 12px 10px;
      }
    }

    .image-cell {

      .thumbnail-wrapper,
      .no-image {
        width: 60px;
        height: 60px;
      }
    }
  }

  .modal-container {
    max-width: 95%;
    max-height: 95vh;

    .modal-header {
      padding: 16px 20px;

      .modal-title {
        font-size: 1rem;
      }
    }

    .modal-body {
      padding: 20px;
    }
  }
}
</style>