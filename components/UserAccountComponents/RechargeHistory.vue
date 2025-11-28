<template>
  <div class="recharge-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-content">
        <i class="fas fa-history"></i>
        <h2>Lịch Sử Nạp Thẻ</h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="fas fa-receipt"></i>
          {{ totalTransactions }} giao dịch
        </span>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <div class="filter-group">
        <label class="filter-label">
          <i class="fas fa-filter"></i>
          Trạng Thái:
        </label>
        <select v-model="selectedStatus" class="filter-select">
          <option value="">Tất Cả</option>
          <option value="success">Thành Công</option>
          <option value="pending">Chờ Xử Lý</option>
          <option value="failed">Thất Bại</option>
        </select>
      </div>

      <div class="filter-group">
        <label class="filter-label">
          <i class="fas fa-sim-card"></i>
          Loại Thẻ:
        </label>
        <select v-model="selectedCarrier" class="filter-select">
          <option value="">Tất Cả</option>
          <option value="viettel">Viettel</option>
          <option value="vinaphone">Vinaphone</option>
          <option value="mobifone">Mobifone</option>
        </select>
      </div>

      <button class="btn-reset" @click="resetFilters">
        <i class="fas fa-redo"></i>
        Reset
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-section">
      <div class="table-wrapper">
        <table class="recharge-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Loại Thẻ</th>
              <th>Mệnh Giá</th>
              <th>Thực Nhận</th>
              <th>Mã Thẻ</th>
              <th>Serial</th>
              <th>Thời Gian</th>
              <th>Trạng Thái</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(recharge, index) in filteredHistory" :key="index" class="recharge-row">
              <!-- ID -->
              <td class="cell-id">
                <span class="id-badge">{{ recharge.id }}</span>
              </td>

              <!-- LOẠI THẺ -->
              <td class="cell-carrier">
                <span class="carrier-badge" :class="'carrier-' + recharge.carrier">
                  <i :class="getCarrierIcon(recharge.carrier)"></i>
                  {{ getCarrierName(recharge.carrier) }}
                </span>
              </td>

              <!-- MỆNH GIÁ -->
              <td class="cell-denomination">
                <div class="denomination-info">
                  <span class="denom-value">{{ formatPrice(recharge.denomination) }}</span>
                  <span class="denom-label">Mệnh giá</span>
                </div>
              </td>

              <!-- THỰC NHẬN -->
              <td class="cell-received">
                <div class="received-info">
                  <span class="received-value" :class="{ bonus: recharge.bonus > 0 }">
                    {{ formatPrice(recharge.received) }}
                  </span>
                  <span v-if="recharge.bonus > 0" class="bonus-badge">
                    +{{ formatPrice(recharge.bonus) }}
                  </span>
                </div>
              </td>

              <!-- MÃ THẺ -->
              <td class="cell-code">
                <span class="code-badge">
                  {{ maskCode(recharge.cardCode) }}
                </span>
                <button
                  class="btn-copy-mini"
                  @click="copyCode(recharge.cardCode)"
                  :title="recharge.cardCode"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </td>

              <!-- SERIAL -->
              <td class="cell-serial">
                <span class="serial-badge">
                  {{ maskSerial(recharge.serial) }}
                </span>
                <button
                  class="btn-copy-mini"
                  @click="copySerial(recharge.serial)"
                  :title="recharge.serial"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </td>

              <!-- THỜI GIAN -->
              <td class="cell-time">
                <div class="time-content">
                  <div class="date">{{ formatDate(recharge.createdAt) }}</div>
                  <div class="time">{{ formatTime(recharge.createdAt) }}</div>
                </div>
              </td>

              <!-- TRẠNG THÁI -->
              <td class="cell-status">
                <span class="status-badge" :class="'status-' + recharge.status">
                  <i :class="getStatusIcon(recharge.status)"></i>
                  {{ getStatusName(recharge.status) }}
                </span>
              </td>

              <!-- CHI TIẾT -->
              <td class="cell-action">
                <button class="btn-detail" @click="openDetail(recharge)" title="Chi tiết">
                  <i class="fa-chevron-right fas"></i>
                </button>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="filteredHistory.length === 0" class="empty-row">
              <td colspan="9">
                <div class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Không có lịch sử nạp thẻ</p>
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

    <!-- STATS SECTION -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon success">
          <i class="fas fa-check-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Thành Công</span>
          <span class="stat-value">{{ stats.success }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon pending">
          <i class="fas fa-hourglass-half"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Chờ Xử Lý</span>
          <span class="stat-value">{{ stats.pending }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon failed">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Thất Bại</span>
          <span class="stat-value">{{ stats.failed }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon total">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Tổng Nạp</span>
          <span class="stat-value">{{ formatPrice(stats.totalAmount) }}</span>
        </div>
      </div>
    </div>

    <!-- INFO LEGEND -->
    <div class="info-legend">
      <div class="legend-item">
        <span class="legend-label">M.GIÁ</span>
        <span class="legend-desc">= MỆNH GIÁ (Giá thẻ cào)</span>
      </div>
      <div class="legend-item">
        <span class="legend-label">T.NHẬN</span>
        <span class="legend-desc">= THỰC NHẬN (Số tiền thực tế nhận được)</span>
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
              <i class="fas fa-receipt"></i>
              Chi Tiết Giao Dịch
            </h3>
            <button class="btn-close" @click="closeDetail">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body" v-if="selectedRecharge">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID Giao Dịch</span>
                <span class="detail-value code">{{ selectedRecharge.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Loại Thẻ</span>
                <span class="detail-value">{{ getCarrierName(selectedRecharge.carrier) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Mệnh Giá</span>
                <span class="detail-value">{{ formatPrice(selectedRecharge.denomination) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Thực Nhận</span>
                <span class="detail-value highlight">{{ formatPrice(selectedRecharge.received) }}</span>
              </div>
              <div v-if="selectedRecharge.bonus > 0" class="detail-item">
                <span class="detail-label">Tiền Thưởng</span>
                <span class="detail-value bonus">+{{ formatPrice(selectedRecharge.bonus) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Mã Thẻ</span>
                <div class="detail-value-with-copy">
                  <span class="code-text">{{ selectedRecharge.cardCode }}</span>
                  <button class="btn-copy-detail" @click="copyCode(selectedRecharge.cardCode)">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="detail-item">
                <span class="detail-label">Serial</span>
                <div class="detail-value-with-copy">
                  <span class="code-text">{{ selectedRecharge.serial }}</span>
                  <button class="btn-copy-detail" @click="copySerial(selectedRecharge.serial)">
                    <i class="fas fa-copy"></i>
                  </button>
                </div>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">Trạng Thái</span>
                <span class="detail-value">
                  <span class="status-badge" :class="'status-' + selectedRecharge.status">
                    <i :class="getStatusIcon(selectedRecharge.status)"></i>
                    {{ getStatusName(selectedRecharge.status) }}
                  </span>
                </span>
              </div>
              <div class="detail-item full-width">
                <span class="detail-label">Thời Gian</span>
                <span class="detail-value">{{ formatFullDate(selectedRecharge.createdAt) }}</span>
              </div>
              <div v-if="selectedRecharge.note" class="detail-item full-width">
                <span class="detail-label">Ghi Chú</span>
                <span class="detail-value">{{ selectedRecharge.note }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- TOAST NOTIFICATION -->
    <transition name="toast">
      <div v-if="showToast" class="toast-notification" :class="toastType">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'RechargeHistory',
  data() {
    return {
      page: 1,
      limit: 10,
      selectedStatus: '',
      selectedCarrier: '',
      showDetail: false,
      selectedRecharge: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastIcon: 'fas fa-check-circle',
      rechargeHistory: [
        {
          id: '845512',
          carrier: 'viettel',
          denomination: 100000,
          received: 100000,
          bonus: 0,
          cardCode: '0123456789012345',
          serial: '1234567890123',
          status: 'success',
          createdAt: new Date('2024-06-16'),
          note: 'Nạp thành công',
        },
        {
          id: '845511',
          carrier: 'vinaphone',
          denomination: 50000,
          received: 50000,
          bonus: 5000,
          cardCode: '9876543210987654',
          serial: '9876543210987',
          status: 'success',
          createdAt: new Date('2024-06-15'),
          note: 'Nạp thành công, nhận bonus 5%',
        },
        {
          id: '845510',
          carrier: 'mobifone',
          denomination: 200000,
          received: 0,
          bonus: 0,
          cardCode: '5555555555555555',
          serial: '5555555555555',
          status: 'failed',
          createdAt: new Date('2024-06-14'),
          note: 'Mã thẻ không hợp lệ',
        },
        {
          id: '845509',
          carrier: 'viettel',
          denomination: 50000,
          received: 0,
          bonus: 0,
          cardCode: '3333333333333333',
          serial: '3333333333333',
          status: 'pending',
          createdAt: new Date('2024-06-13'),
          note: 'Đang xử lý',
        },
      ],
    };
  },

  computed: {
    totalTransactions() {
      return this.rechargeHistory.length;
    },

    filteredHistory() {
      return this.rechargeHistory.filter(item => {
        const statusMatch = !this.selectedStatus || item.status === this.selectedStatus;
        const carrierMatch = !this.selectedCarrier || item.carrier === this.selectedCarrier;
        return statusMatch && carrierMatch;
      });
    },

    totalPages() {
      return Math.ceil(this.filteredHistory.length / this.limit);
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

    stats() {
      const success = this.rechargeHistory.filter(r => r.status === 'success').length;
      const pending = this.rechargeHistory.filter(r => r.status === 'pending').length;
      const failed = this.rechargeHistory.filter(r => r.status === 'failed').length;
      const totalAmount = this.rechargeHistory.reduce((sum, r) => sum + r.received, 0);

      return { success, pending, failed, totalAmount };
    },
  },

  methods: {
    getCarrierName(carrier) {
      const names = {
        viettel: 'Viettel',
        vinaphone: 'Vinaphone',
        mobifone: 'Mobifone',
      };
      return names[carrier] || 'Unknown';
    },

    getCarrierIcon(carrier) {
      const icons = {
        viettel: 'fas fa-mobile-alt',
        vinaphone: 'fas fa-mobile-alt',
        mobifone: 'fas fa-mobile-alt',
      };
      return icons[carrier] || 'fas fa-phone';
    },

    getStatusName(status) {
      const names = {
        success: 'Thành Công',
        pending: 'Chờ Xử Lý',
        failed: 'Thất Bại',
      };
      return names[status] || 'Unknown';
    },

    getStatusIcon(status) {
      const icons = {
        success: 'fas fa-check-circle',
        pending: 'fas fa-hourglass-half',
        failed: 'fas fa-times-circle',
      };
      return icons[status] || 'fas fa-question-circle';
    },

    maskCode(code) {
      if (!code) return '****';
      return code.slice(0, 4) + '****' + code.slice(-4);
    },

    maskSerial(serial) {
      if (!serial) return '****';
      return serial.slice(0, 4) + '****' + serial.slice(-4);
    },

    copyCode(code) {
      this.copyToClipboard(code, 'Mã thẻ');
    },

    copySerial(serial) {
      this.copyToClipboard(serial, 'Serial');
    },

    copyToClipboard(text, label) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToastMessage(`Đã sao chép ${label}!`, 'success', 'fas fa-check-circle');
        }).catch(() => {
          this.fallbackCopy(text, label);
        });
      } else {
        this.fallbackCopy(text, label);
      }
    },

    fallbackCopy(text, label) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToastMessage(`Đã sao chép ${label}!`, 'success', 'fas fa-check-circle');
    },

    showToastMessage(message, type = 'success', icon = 'fas fa-check-circle') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastIcon = icon;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2500);
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    openDetail(recharge) {
      this.selectedRecharge = recharge;
      this.showDetail = true;
      document.body.style.overflow = 'hidden';
    },

    closeDetail() {
      this.showDetail = false;
      this.selectedRecharge = null;
      document.body.style.overflow = '';
    },

    resetFilters() {
      this.selectedStatus = '';
      this.selectedCarrier = '';
      this.page = 1;
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
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$red: #ef4444;
$red-light: #fef2f2;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.recharge-history {
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

  // FILTER BAR
  .filter-bar {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 14px 24px;
    background: $bg-light;
    border-bottom: 1px solid $border;
    flex-wrap: wrap;

    .filter-group {
      display: flex;
      align-items: center;
      gap: 10px;

      .filter-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: $text-sub;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        white-space: nowrap;

        i {
          font-size: 13px;
        }
      }

      .filter-select {
        padding: 8px 12px;
        border: 1px solid $border;
        border-radius: 6px;
        background: white;
        color: $text-main;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.2s ease;

        &:focus {
          outline: none;
          border-color: $primary;
          box-shadow: 0 0 0 3px rgba($primary, 0.1);
        }
      }
    }

    .btn-reset {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: white;
      color: $primary;
      border: 1px solid $primary;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: rgba($primary, 0.05);
      }

      i {
        font-size: 12px;
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
    min-width: 1200px;
  }

  .recharge-table {
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
      .recharge-row {
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
        padding: 12px 14px;
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
        font-size: 10px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }
    }

    .cell-carrier {
      .carrier-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        background: $blue-light;
        color: $blue;

        i {
          font-size: 11px;
        }

        &.carrier-viettel {
          background: #fee2e2;
          color: #dc2626;
        }

        &.carrier-vinaphone {
          background: #fef3c7;
          color: #d97706;
        }

        &.carrier-mobifone {
          background: #dbeafe;
          color: #1e40af;
        }
      }
    }

    .cell-denomination {
      .denomination-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .denom-value {
          font-weight: 700;
          color: $text-main;
          font-size: 12px;
        }

        .denom-label {
          font-size: 10px;
          color: $text-light;
        }
      }
    }

    .cell-received {
      .received-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .received-value {
          font-weight: 700;
          color: $red;
          font-size: 12px;

          &.bonus {
            color: $green;
          }
        }

        .bonus-badge {
          display: inline-block;
          width: fit-content;
          padding: 2px 6px;
          background: $green-light;
          color: $green;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
        }
      }
    }

    .cell-code,
    .cell-serial {
      display: flex;
      align-items: center;
      gap: 6px;

      .code-badge,
      .serial-badge {
        padding: 4px 8px;
        background: $bg-light;
        color: $text-sub;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 600;
        font-family: 'Courier New', monospace;
      }

      .btn-copy-mini {
        width: 28px;
        height: 28px;
        border: none;
        background: white;
        color: $primary;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-size: 12px;
        border: 1px solid $border;

        &:hover {
          background: $primary;
          color: white;
          border-color: $primary;
        }

        i {
          font-size: 12px;
        }
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
          font-size: 12px;
        }

        &.status-success {
          background: $green-light;
          color: $green;
        }

        &.status-pending {
          background: $yellow-light;
          color: darken($yellow, 10%);
        }

        &.status-failed {
          background: $red-light;
          color: $red;
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

  // STATS SECTION
  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, $bg-light, $bg-darker);
    border-top: 1px solid $border;

    .stat-card {
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

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        flex-shrink: 0;

        &.success {
          background: linear-gradient(135deg, $green, darken($green, 10%));
        }

        &.pending {
          background: linear-gradient(135deg, $yellow, darken($yellow, 10%));
        }

        &.failed {
          background: linear-gradient(135deg, $red, darken($red, 10%));
        }

        &.total {
          background: linear-gradient(135deg, $primary, $primary-dark);
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: $text-light;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: $text-main;
        }
      }
    }
  }

  // INFO LEGEND
  .info-legend {
    display: flex;
    gap: 20px;
    padding: 16px 24px;
    background: $bg-light;
    border-top: 1px solid $border;
    flex-wrap: wrap;

    .legend-item {
      display: flex;
      gap: 8px;

      .legend-label {
        font-weight: 700;
        color: $primary;
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.3px;
      }

      .legend-desc {
        font-size: 12px;
        color: $text-sub;
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

              &.highlight {
                color: $green;
                font-weight: 700;
              }

              &.bonus {
                color: $blue;
                font-weight: 700;
              }

              .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 10px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;

                i {
                  font-size: 12px;
                }

                &.status-success {
                  background: $green-light;
                  color: $green;
                }

                &.status-pending {
                  background: $yellow-light;
                  color: darken($yellow, 10%);
                }

                &.status-failed {
                  background: $red-light;
                  color: $red;
                }
              }
            }

            .detail-value-with-copy {
              display: flex;
              align-items: center;
              gap: 10px;

              .code-text {
                flex: 1;
                font-family: 'Courier New', monospace;
                font-size: 12px;
                color: $text-main;
                font-weight: 600;
                word-break: break-all;
              }

              .btn-copy-detail {
                width: 32px;
                height: 32px;
                border: 1px solid $border;
                background: white;
                color: $primary;
                border-radius: 6px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.2s ease;
                flex-shrink: 0;

                i {
                  font-size: 13px;
                }

                &:hover {
                  background: $primary;
                  color: white;
                  border-color: $primary;
                }
              }
            }
          }
        }
      }
    }
  }

  // TOAST
  .toast-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    box-shadow: $shadow-lg;
    z-index: 1000;
    animation: slideInUp 0.3s ease;

    i {
      font-size: 16px;
    }

    &.success {
      background: $green-light;
      color: $green;
      border: 1px solid rgba($green, 0.2);
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

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
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

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter,
.toast-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

// RESPONSIVE
@media (max-width: 768px) {
  .recharge-history {
    .history-header {
      padding: 16px;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;

      .header-content h2 {
        font-size: 16px;
      }
    }

    .filter-bar {
      padding: 12px 16px;
      gap: 10px;
    }

    .recharge-table {
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

    .stats-section {
      padding: 16px;
      gap: 12px;
      grid-template-columns: repeat(2, 1fr);

      .stat-card {
        gap: 10px;
        padding: 12px;

        .stat-icon {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }

        .stat-content .stat-value {
          font-size: 16px;
        }
      }
    }

    .info-legend {
      padding: 12px 16px;
      gap: 12px;

      .legend-item {
        flex: 1;
        min-width: 200px;
      }
    }
  }
}

@media (max-width: 480px) {
  .recharge-history {
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

    .filter-bar {
      padding: 10px 12px;
      gap: 8px;

      .filter-group {
        flex: 1;
        min-width: 160px;
      }
    }

    .recharge-table {
      font-size: 11px;
      min-width: 1000px;

      thead th {
        padding: 8px;
        font-size: 9px;
      }

      tbody td {
        padding: 8px;
      }
    }

    .stats-section {
      padding: 12px;
      gap: 10px;
      grid-template-columns: repeat(2, 1fr);

      .stat-card {
        padding: 10px;
        gap: 8px;

        .stat-icon {
          width: 36px;
          height: 36px;
          font-size: 14px;
        }

        .stat-content .stat-value {
          font-size: 14px;
        }
      }
    }

    .info-legend {
      padding: 10px 12px;
      gap: 8px;

      .legend-item {
        font-size: 11px;
      }
    }

    .modal-content .modal-body .detail-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style>