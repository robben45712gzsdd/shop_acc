<template>
  <div class="transaction-history">
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <i class="fa fa-credit-card"></i>
          <h2 class="title">Lịch sử nạp thẻ</h2>
        </div>
        <div class="header-stats">
          <span class="stat-item">
            <i class="fa fa-list"></i>
            Tổng: <strong>{{ totalPages }}</strong> giao dịch
          </span>
        </div>
      </div>
    </div>

    <div class="table-container">
      <div class="table-wrapper">
        <table class="premium-table">
          <thead>
            <tr>
              <th width="140">Thời gian</th>
              <th width="120">Mã GD</th>
              <th width="150">Loại giao dịch</th>
              <th width="120">Giá trị</th>
              <th width="100">Trạng thái</th>
              <th>Ghi chú</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in history" :key="item.walletId" class="table-row">
              <!-- Thời gian -->
              <td>
                <div class="datetime-cell">
                  <div class="date">{{ formatDateOnly(item.createdAt) }}</div>
                  <div class="time">{{ formatTimeOnly(item.createdAt) }}</div>
                </div>
              </td>

              <!-- Mã giao dịch -->
              <td>
                <div class="transaction-id">
                  <span class="id-text">#{{ item.walletId.substring(0, 8) }}</span>
                </div>
              </td>

              <!-- Loại giao dịch -->
              <td>
                <div class="transaction-type">
                  <span class="type-badge" :class="getTypeClass(item.type)">
                    <i :class="getTypeIcon(item.type)"></i>
                    {{ getTypeName(item.type) }}
                  </span>
                </div>
              </td>

              <!-- Giá trị -->
              <td>
                <div class="amount-cell" :class="item.type === 0 ? 'positive' : 'negative'">
                  <span class="amount-value">
                    {{ item.type === 0 ? '+' : '-' }}{{ formatPrice(item.amount) }}
                  </span>
                </div>
              </td>

              <!-- Trạng thái -->
              <td>
                <div class="status-cell">
                  <span class="status-badge" :class="getStatusClass(item.status)">
                    <i :class="getStatusIcon(item.status)"></i>
                    {{ getStatusName(item.status) }}
                  </span>
                </div>
              </td>

              <!-- Ghi chú -->
              <td>
                <div class="description-cell">
                  <span class="description-text">{{ item.description || '-' }}</span>
                </div>
              </td>
            </tr>

            <tr v-if="history.length === 0">
              <td colspan="6" class="empty-state">
                <div class="empty-content">
                  <div class="empty-icon">
                    <i class="fa fa-inbox"></i>
                  </div>
                  <p class="empty-text">Chưa có lịch sử giao dịch</p>
                  <p class="empty-subtext">Các giao dịch nạp thẻ của bạn sẽ hiển thị tại đây</p>
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

    <!-- Description -->
    <div class="info-section">
      <p class="info-text">
        <i class="fa fa-info-circle"></i>
        <strong>Dùng điện thoại</strong>, hãy vuốt bảng từ phải qua trái để xem đầy đủ thông tin!
      </p>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination.vue";
import payment from "~/api/payment";

export default {
  components: { Pagination },

  data() {
    return {
      history: [],
      page: 1,
      limit: 10,
      totalPages: 0,
    };
  },

  mounted() {
    this.fetchHistory();
  },

  methods: {
    async fetchHistory() {
      try {
        const res = await payment.getTransactionList({
          currentPage: this.page,
          recordPerPage: this.limit
        });

        this.history = res.data;
        this.totalPages = Math.ceil(res.totalRecords / this.limit);
      } catch (err) {
        console.error("Fetch transaction history error:", err);
        this.$toast?.error?.("Không thể tải lịch sử giao dịch");
      }
    },

    changePage(newPage) {
      this.page = newPage;
      this.fetchHistory();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    // Xác định tên loại giao dịch
    getTypeName(type) {
      const types = {
        0: 'Nạp tiền',
        1: 'Mua tài khoản',
        2: 'Hoàn tiền',
        3: 'Rút tiền',
        4: 'Khác'
      };
      return types[type] || 'Không xác định';
    },

    // Xác định class cho loại giao dịch
    getTypeClass(type) {
      const classes = {
        0: 'type-deposit',
        1: 'type-purchase',
        2: 'type-refund',
        3: 'type-withdraw',
        4: 'type-other'
      };
      return classes[type] || 'type-default';
    },

    // Xác định icon cho loại giao dịch
    getTypeIcon(type) {
      const icons = {
        0: 'fa fa-arrow-down',
        1: 'fa fa-shopping-cart',
        2: 'fa fa-undo',
        3: 'fa fa-arrow-up',
        4: 'fa fa-exchange'
      };
      return icons[type] || 'fa fa-question';
    },

    // Xác định tên trạng thái
    getStatusName(status) {
      const statuses = {
        0: 'Chờ xử lý',
        1: 'Thành công',
        2: 'Thất bại',
        3: 'Đã hủy'
      };
      return statuses[status] || 'Không xác định';
    },

    // Xác định class cho trạng thái
    getStatusClass(status) {
      const classes = {
        0: 'status-pending',
        1: 'status-success',
        2: 'status-failed',
        3: 'status-cancelled'
      };
      return classes[status] || 'status-default';
    },

    // Xác định icon cho trạng thái
    getStatusIcon(status) {
      const icons = {
        0: 'fa fa-clock-o',
        1: 'fa fa-check-circle',
        2: 'fa fa-times-circle',
        3: 'fa fa-ban'
      };
      return icons[status] || 'fa fa-question-circle';
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
$text-dark: #1a1a1a;
$text-gray: #6b7280;
$border-color: #e5e7eb;
$bg-light: #f9fafb;

// Success colors
$success-color: #10b981;
$success-light: #d1fae5;

// Warning colors
$warning-color: #f59e0b;
$warning-light: #fef3c7;

// Danger colors
$danger-color: #ef4444;
$danger-light: #fee2e2;

// Info colors
$info-color: #3b82f6;
$info-light: #dbeafe;

.transaction-history {
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

  // Table Container
  .table-container {
    padding: 0;
  }

  .table-wrapper {
    overflow-x: auto;
    border-radius: 0;
    border: none;
    border-top: 1px solid $border-color;

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
    min-width: 900px;

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

  // DateTime Cell
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

  // Transaction ID
  .transaction-id {
    .id-text {
      display: inline-block;
      padding: 6px 10px;
      background: linear-gradient(135deg, lighten($info-color, 35%) 0%, lighten($info-color, 40%) 100%);
      color: darken($info-color, 10%);
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 700;
      font-family: 'Courier New', monospace;
      border: 1px solid lighten($info-color, 30%);
    }
  }

  // Transaction Type
  .transaction-type {
    .type-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;

      i {
        font-size: 0.813rem;
      }

      &.type-deposit {
        background: $success-light;
        color: darken($success-color, 10%);
      }

      &.type-purchase {
        background: $warning-light;
        color: darken($warning-color, 10%);
      }

      &.type-refund {
        background: $info-light;
        color: darken($info-color, 10%);
      }

      &.type-withdraw {
        background: $danger-light;
        color: darken($danger-color, 10%);
      }

      &.type-other {
        background: lighten($text-gray, 30%);
        color: $text-gray;
      }
    }
  }

  // Amount Cell
  .amount-cell {
    .amount-value {
      display: inline-block;
      padding: 8px 14px;
      border-radius: 6px;
      font-weight: 700;
      font-size: 0.875rem;
      white-space: nowrap;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    &.positive .amount-value {
      background: linear-gradient(135deg, $success-color 0%, darken($success-color, 10%) 100%);
      color: white;
    }

    &.negative .amount-value {
      background: linear-gradient(135deg, $danger-color 0%, darken($danger-color, 10%) 100%);
      color: white;
    }
  }

  // Status Cell
  .status-cell {
    .status-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 0.75rem;
      font-weight: 600;

      i {
        font-size: 0.813rem;
      }

      &.status-pending {
        background: $warning-light;
        color: darken($warning-color, 10%);
      }

      &.status-success {
        background: $success-light;
        color: darken($success-color, 10%);
      }

      &.status-failed {
        background: $danger-light;
        color: darken($danger-color, 10%);
      }

      &.status-cancelled {
        background: lighten($text-gray, 30%);
        color: $text-gray;
      }
    }
  }

  // Description Cell
  .description-cell {
    .description-text {
      color: $text-gray;
      font-size: 0.813rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
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

  // Pagination
  .pagination-wrapper {
    padding: 20px 24px;
    border-top: 1px solid $border-color;
    background: $bg-light;
  }

  // Info Section
  .info-section {
    padding: 16px 24px;
    background: lighten($info-color, 42%);
    border-top: 1px solid lighten($info-color, 35%);

    .info-text {
      margin: 0;
      color: darken($info-color, 10%);
      font-size: 0.875rem;
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        font-size: 1.125rem;
      }

      strong {
        font-weight: 700;
      }
    }
  }
}

// Responsive
@media (max-width: 768px) {
  .transaction-history {
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

    .info-section {
      padding: 12px 16px;

      .info-text {
        font-size: 0.813rem;
        flex-direction: column;
        text-align: center;
      }
    }
  }
}
</style>