<template>
  <div class="transaction-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-title">
        <i class="fas fa-exchange-alt"></i>
        <h2>Lịch Sử Giao Dịch</h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="fas fa-list"></i>
          {{ totalRecords }} giao dịch
        </span>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-section">
      <div class="table-wrapper">
        <table class="transaction-table">
          <thead>
            <tr>
              <th>Thời Gian</th>
              <th>Mã GD</th>
              <th>Loại</th>
              <th>Giá Trị</th>
              <th>Trạng Thái</th>
              <th>Ghi Chú</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in history" :key="item.walletId" class="tx-row">
              <!-- THỜI GIAN -->
              <td class="cell-time">
                <div class="time-content">
                  <div class="date">{{ formatDateOnly(item.createdAt) }}</div>
                  <div class="time">{{ formatTimeOnly(item.createdAt) }}</div>
                </div>
              </td>

              <!-- MÃ GD -->
              <td class="cell-id">
                <span class="tx-id">{{ item.walletId }}</span>
              </td>

              <!-- LOẠI -->
              <td class="cell-type">
                <span class="type-badge" :class="'type-' + item.type">
                  <i :class="typeIcons[item.type]"></i>
                  {{ typeNames[item.type] }}
                </span>
              </td>

              <!-- GIÁ TRỊ -->
              <td class="cell-amount">
                <span class="amount" :class="item.type === 0 ? 'positive' : 'negative'">
                  {{ item.type === 0 ? '+' : '' }}{{ formatPrice(item.amount) }}
                </span>
              </td>

              <!-- TRẠNG THÁI -->
              <td class="cell-status">
                <span class="status-badge" :class="'status-' + item.status">
                  <i :class="statusIcons[item.status]"></i>
                  {{ statusNames[item.status] }}
                </span>
              </td>

              <!-- GHI CHÚ -->
              <td class="cell-note">
                <span class="note-text">{{ item.description || '-' }}</span>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="history.length === 0" class="empty-row">
              <td colspan="6">
                <div class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Chưa có giao dịch nào</p>
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
        <button class="page-btn prev" :disabled="page === 1" @click="changePage(page - 1)">
          <i class="fa-chevron-left fas"></i>
        </button>

        <div class="page-numbers">
          <button v-for="p in visiblePages" :key="p" class="page-btn number" :class="{ active: page === p }"
            @click="changePage(p)">
            {{ p }}
          </button>
        </div>

        <button class="page-btn next" :disabled="page === totalPages" @click="changePage(page + 1)">
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
  </div>
</template>

<script>
import payment from "~/api/payment";

export default {
  data() {
    return {
      history: [],
      page: 1,
      limit: 10,
      totalRecords: 0,
      typeNames: ['Nạp tiền', 'Rút tiền', 'Mua tài khoản', 'Hoàn tiền', 'Giao dịch khác'],
      typeIcons: ['fas fa-arrow-down', 'fas fa-redo', 'fas fa-shopping-cart', 'fas fa-arrow-up', 'fas fa-ellipsis-h'],
      statusNames: ['Chờ xử lý', 'Đang xử lý', 'Hoàn thành', 'Thất bại', 'Đã hủy'],
      statusIcons: ['fas fa-clock', 'fas fa-hourglass-half', 'fas fa-check-circle', 'fas fa-times-circle', 'fas fa-ban'],
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
        const res = await payment.getTransactionList({
          currentPage: this.page,
          recordPerPage: this.limit
        });
        this.history = res.data || [];
        this.totalRecords = res.totalRecords || 0;
      } catch (err) {
        console.error("Fetch error:", err);
        this.$toast?.error?.("Không thể tải lịch sử giao dịch");
      }
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        this.fetchHistory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    formatDateOnly(date) {
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    },

    formatTimeOnly(date) {
      const d = new Date(date);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },

    formatPrice(num) {
      return (num || 0).toLocaleString("vi-VN") + "đ";
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
$warning: #f59e0b;
$warning-light: #fffbeb;
$danger: #ef4444;
$danger-light: #fef2f2;
$info: #3b82f6;
$info-light: #eff6ff;

.transaction-history {
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
      background: rgba(255, 107, 53, 0.1);
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
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
// TABLE SECTION
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
  min-width: 900px;
}

.transaction-table {
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
    .tx-row {
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

  .cell-id {
    .tx-id {
      display: inline-block;
      padding: 4px 8px;
      background: $info-light;
      color: $info;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
      font-family: 'Courier New', monospace;
      letter-spacing: 0.3px;
    }
  }

  .cell-type {
    .type-badge {
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

      &.type-0 {
        background: $success-light;
        color: darken($success, 10%);
      }

      &.type-1 {
        background: $warning-light;
        color: darken($warning, 10%);
      }

      &.type-2 {
        background: $info-light;
        color: $info;
      }

      &.type-3 {
        background: $danger-light;
        color: darken($danger, 10%);
      }

      &.type-4 {
        background: #f3f4f6;
        color: $text-sub;
      }
    }
  }

  .cell-amount {
    .amount {
      display: inline-block;
      padding: 6px 12px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 12px;
      white-space: nowrap;

      &.positive {
        background: linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(16, 185, 129, 0.05));
        color: darken($success, 10%);
        border: 1px solid rgba(16, 185, 129, 0.3);
      }

      &.negative {
        background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
        color: darken($danger, 10%);
        border: 1px solid rgba(239, 68, 68, 0.3);
      }
    }
  }

  .cell-status {
    .status-badge {
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

      &.status-0 {
        background: $warning-light;
        color: darken($warning, 10%);
      }

      &.status-2 {
        background: $success-light;
        color: darken($success, 10%);
      }

      &.status-3, &.status-4 {
        background: $danger-light;
        color: darken($danger, 10%);
      }

      &.status-1 {
        background: #f3f4f6;
        color: $text-sub;
      }
    }
  }

  .cell-note {
    .note-text {
      color: $text-sub;
      font-size: 12px;
      display: block;
      max-width: 200px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
  background: $info-light;
  border-top: 1px solid rgba(59, 130, 246, 0.2);
  color: $info;
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

  .transaction-table {
    font-size: 12px;

    thead th {
      padding: 10px;
      font-size: 10px;
    }

    tbody td {
      padding: 10px;
    }

    .cell-amount .amount {
      font-size: 11px;
      padding: 4px 8px;
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

  .transaction-table {
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