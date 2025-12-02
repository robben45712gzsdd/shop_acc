<template>
  <div class="recharge-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-content">
        <i class="fas fa-history"></i>
        <h2>Lịch Sử Nạp Thẻ</h2>
      </div>
      <span class="stat-badge">{{ totalRecords }} giao dịch</span>
    </div>

    <!-- LOADING -->
    <div v-if="isLoading" class="loading">
      <i class="fas fa-spinner fa-spin"></i>
      <span>Đang tải...</span>
    </div>

    <!-- EMPTY STATE -->
    <div v-else-if="recharges.length === 0" class="empty">
      <i class="fas fa-inbox"></i>
      <p>Chưa có giao dịch</p>
    </div>

    <!-- TABLE -->
    <div v-else class="table-wrapper">
      <table class="table">
        <thead>
          <tr>
            <th>Nhà Mạng</th>
            <th>Số Tiền</th>
            <th>Phí</th>
            <th>Thực Nhận</th>
            <th>Mã Thẻ</th>
            <th>Serial</th>
            <th>Trạng Thái</th>
            <th>Ngày Giao Dịch</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in recharges" :key="item.walletId">
            <td><span class="provider-badge">{{ item.provider }}</span></td>
            <td>{{ formatPrice(item.amount) }}</td>
            <td>{{ formatPrice(item.fee) }}</td>
            <td><strong class="received">{{ formatPrice(item.amount - item.fee) }}</strong></td>
            <td><code>{{ maskCode(item.cardCode) }}</code></td>
            <td><code>{{ maskSerial(item.serial) }}</code></td>
            <td><span :class="'status-' + getStatusClass(item.status)">{{ getStatusText(item.status) }}</span></td>
            <td>{{ formatDate(item.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
      <!-- INFO -->
      <div class="info-box">
        <i class="fas fa-info-circle"></i>
        <span>Trên điện thoại, vuốt bảng từ phải sang trái để xem thêm thông tin</span>
      </div>

    </div>

    <!-- PAGINATION -->
    <Pagination v-if="!isLoading && recharges.length > 0" :currentPage="currentPage" :totalPages="totalPages"
      @update:page="handlePageChange" />
  </div>
</template>

<script>
import payment from '~/api/payment';
import Pagination from '~/components/Pagination';
import { telcom } from '~/constants/telcom';

export default {
  name: 'RechargeHistory',
  components: {
    Pagination,
  },
  data() {
    return {
      recharges: [],
      isLoading: false,
      currentPage: 1,
      recordPerPage: 5,
      totalRecords: 0,
    };
  },

  computed: {
    totalPages() {
      return Math.ceil(this.totalRecords / this.recordPerPage);
    },
  },

  mounted() {
    this.fetchData();
  },

  methods: {
    async fetchData() {
      this.isLoading = true;
      try {
        // Uncomment khi có API thực
        const response = await payment.getPaymentCard({
          currentPage: this.currentPage,
          recordPerPage: this.recordPerPage,
        });
        if (response.success) {
          this.recharges = response.data?.map(item => ({
            ...item,
            provider: telcom[item.provider] || item.provider,
          })) || [];
          this.totalRecords = response.totalRecords || 0;
        } else {
          this.$toast.error('Lỗi tải dữ liệu');
        }

      } catch (err) {
        this.$toast.error('Lỗi: ' + err.message);
        console.error(err);
      } finally {
        this.isLoading = false;
      }
    },

    handlePageChange(page) {
      this.currentPage = page;
      this.fetchData();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    formatPrice(num) {
      return (num || 0).toLocaleString('vi-VN') + 'đ';
    },

    formatDate(date) {
      return new Date(date).toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    },

    maskCode(code) {
      if (!code || code.length < 4) return '****';
      return code.slice(0, 4) + '*'.repeat(code.length - 8) + code.slice(-4);
    },

    maskSerial(serial) {
      if (!serial || serial.length < 4) return '****';
      return serial.slice(0, 3) + '*'.repeat(serial.length - 6) + serial.slice(-3);
    },

    getStatusText(status) {
      const map = {
        0: 'Chờ Xử Lý',
        1: 'Thành Công',
        2: 'Thất Bại',
        3: 'Đã Hủy',
      };
      return map[status] || 'Không Xác Định';
    },

    getStatusClass(status) {
      const map = {
        0: 'pending',
        1: 'success',
        2: 'failed',
        3: 'cancelled',
      };
      return map[status] || 'unknown';
    },
  },
};
</script>

<style lang="scss" scoped>
$primary: #ff6b35;
$text-main: #1a1a1a;
$text-sub: #6b7280;
$text-light: #9ca3af;
$border: #e5e7eb;
$bg-light: #f9fafb;
$green: #10b981;
$red: #ef4444;
$yellow: #f59e0b;

.recharge-history {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .history-header {
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
    border-bottom: 2px solid $border;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      i {
        font-size: 20px;
        color: $primary;
      }

      h2 {
        margin: 0;
        font-size: 18px;
        font-weight: 700;
        color: $text-main;
      }
    }

    .stat-badge {
      padding: 6px 14px;
      background: white;
      border: 1px solid $border;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      color: $primary;
    }
  }

  .loading {
    padding: 40px 20px;
    text-align: center;
    color: $text-sub;

    i {
      font-size: 24px;
      animation: spin 1s linear infinite;
      margin-right: 8px;
    }
  }

  .empty {
    padding: 40px 20px;
    text-align: center;
    color: $text-sub;

    i {
      font-size: 48px;
      opacity: 0.3;
      display: block;
      margin-bottom: 10px;
    }

    p {
      margin: 0;
      font-size: 14px;
    }
  }

  .table-wrapper {
    overflow-x: auto;

    .table {
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
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
          white-space: nowrap;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid $border;
          transition: background 0.2s;

          &:hover {
            background: $bg-light;
          }

          td {
            padding: 12px 14px;
            vertical-align: middle;
          }

          .provider-badge {
            display: inline-block;
            padding: 4px 8px;
            background: $primary;
            color: white;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }

          code {
            padding: 3px 6px;
            background: $bg-light;
            border-radius: 3px;
            font-family: monospace;
            font-size: 11px;
            color: $text-sub;
          }

          .received {
            color: $green;
            font-size: 13px;
          }

          .status-pending {
            display: inline-block;
            padding: 4px 8px;
            background: rgba($yellow, 0.2);
            color: darken($yellow, 10%);
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }

          .status-success {
            display: inline-block;
            padding: 4px 8px;
            background: rgba($green, 0.2);
            color: $green;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }

          .status-failed {
            display: inline-block;
            padding: 4px 8px;
            background: rgba($red, 0.2);
            color: $red;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }

          .status-cancelled {
            display: inline-block;
            padding: 4px 8px;
            background: $border;
            color: $text-sub;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }

          .status-unknown {
            display: inline-block;
            padding: 4px 8px;
            background: $border;
            color: $text-light;
            border-radius: 4px;
            font-weight: 600;
            font-size: 11px;
            text-transform: uppercase;
          }
        }
      }
    }
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  .recharge-history {
    .history-header {
      flex-direction: column;
      gap: 12px;
      align-items: flex-start;

      .header-content h2 {
        font-size: 16px;
      }
    }

    .table-wrapper .table {
      font-size: 11px;

      thead th,
      tbody td {
        padding: 8px 10px;
      }
    }
  }
}

@media (max-width: 480px) {
  .recharge-history {
    .history-header {
      .header-content h2 {
        font-size: 14px;
      }

      .stat-badge {
        font-size: 11px;
        padding: 4px 10px;
      }
    }

    .table-wrapper .table {
      font-size: 10px;

      thead th,
      tbody td {
        padding: 6px 8px;
      }
    }
  }
}
</style>
