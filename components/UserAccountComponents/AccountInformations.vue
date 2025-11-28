<template>
  <div class="account-informations">
    <!-- HEADER -->
    <div class="info-header">
      <div class="header-content">
        <i class="fas fa-shield-alt"></i>
        <h2>Thông tin tài khoản</h2>
      </div>
      <p class="header-subtitle">Quản lý thông tin cá nhân và bảo mật</p>
    </div>

    <!-- INFO GRID -->
    <div class="info-grid">
      <!-- USER ID -->
      <div class="info-card">
        <div class="card-header">
          <i class="fas fa-id-badge"></i>
          <span class="card-label">ID Tài Khoản</span>
        </div>
        <div class="card-body">
          <div class="info-value-badge">{{ user.userId }}</div>
          <button class="btn-copy" @click="copyToClipboard(user.userId)" title="Sao chép">
            <i class="fas fa-copy"></i>
          </button>
        </div>
      </div>

      <!-- USERNAME -->
      <div class="info-card">
        <div class="card-header">
          <i class="fas fa-user"></i>
          <span class="card-label">Tên Tài Khoản</span>
        </div>
        <div class="card-body">
          <p class="info-value">{{ user.userName }}</p>
        </div>
      </div>

      <!-- DISPLAY NAME -->
      <div class="info-card">
        <div class="card-header">
          <i class="fas fa-user-circle"></i>
          <span class="card-label">Tên Hiển Thị</span>
        </div>
        <div class="card-body">
          <p class="info-value">{{ user.name }}</p>
        </div>
      </div>

      <!-- PHONE -->
      <div class="info-card">
        <div class="card-header">
          <i class="fas fa-phone"></i>
          <span class="card-label">Số Điện Thoại</span>
        </div>
        <div class="card-body">
          <p class="info-value">{{ user.phoneNumber || 'Chưa cập nhật' }}</p>
        </div>
      </div>

      <!-- BALANCE -->
      <div class="info-card highlight">
        <div class="card-header">
          <i class="fas fa-wallet"></i>
          <span class="card-label">Số Dư</span>
        </div>
        <div class="card-body">
          <div class="balance-display">
            <span class="balance-amount">{{ formatPrice(user.balance) }}</span>
            <button class="btn-recharge" @click="$emit('recharge')">
              <i class="fas fa-plus"></i>
              Nạp tiền
            </button>
          </div>
        </div>
      </div>

      <!-- JOIN DATE -->
      <div class="info-card">
        <div class="card-header">
          <i class="fas fa-calendar-alt"></i>
          <span class="card-label">Ngày Tham Gia</span>
        </div>
        <div class="card-body">
          <p class="info-value">{{ formattedDate }}</p>
        </div>
      </div>
    </div>

    <!-- VERIFICATION SECTION -->
    <div class="verification-section">
      <h3 class="section-title">Xác Minh Tài Khoản</h3>
      <div class="verification-items">
        <div class="verification-item">
          <div class="verification-check" :class="{ verified: user.phoneNumber }">
            <i :class="user.phoneNumber ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>
          <div class="verification-info">
            <span class="verification-label">Số Điện Thoại</span>
            <span class="verification-status">{{ user.phoneNumber ? 'Đã xác minh' : 'Chưa xác minh' }}</span>
          </div>
        </div>

        <div class="verification-item">
          <div class="verification-check verified">
            <i class="fas fa-check"></i>
          </div>
          <div class="verification-info">
            <span class="verification-label">Email</span>
            <span class="verification-status">Đã xác minh</span>
          </div>
        </div>

        <div class="verification-item">
          <div class="verification-check" :class="{ verified: user.twoFactorEnabled }">
            <i :class="user.twoFactorEnabled ? 'fas fa-check' : 'fas fa-times'"></i>
          </div>
          <div class="verification-info">
            <span class="verification-label">Xác Minh 2 Yếu Tố</span>
            <span class="verification-status">{{ user.twoFactorEnabled ? 'Bật' : 'Tắt' }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- QUICK ACTIONS -->
    <!-- <div class="quick-actions">
      <button class="action-btn primary">
        <i class="fas fa-edit"></i>
        Chỉnh Sửa Thông Tin
      </button>
      <button class="action-btn secondary">
        <i class="fas fa-key"></i>
        Đổi Mật Khẩu
      </button>
      <button class="action-btn secondary">
        <i class="fas fa-shield-alt"></i>
        Cài Đặt Bảo Mật
      </button>
    </div> -->

    <!-- TOAST MESSAGE -->
    <transition name="toast">
      <div v-if="showToast" class="toast-message" :class="toastType">
        <i :class="toastIcon"></i>
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastIcon: 'fas fa-check-circle',
    };
  },

  computed: {
    user() {
      return this.$store.state?.user_data || {
        userId: '---',
        name: '---',
        userName: '---',
        phoneNumber: '',
        balance: 0,
        createdAt: new Date(),
      };
    },

    formattedDate() {
      if (!this.user.createdAt) return '---';
      const d = new Date(this.user.createdAt);
      return d.toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    },
  },

  methods: {
    formatPrice(num) {
      return (num || 0).toLocaleString('vi-VN') + 'đ';
    },

    copyToClipboard(text) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
          this.showToastMessage('Đã sao chép!', 'success', 'fas fa-check-circle');
        }).catch(() => {
          this.fallbackCopy(text);
        });
      } else {
        this.fallbackCopy(text);
      }
    },

    fallbackCopy(text) {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToastMessage('Đã sao chép!', 'success', 'fas fa-check-circle');
    },

    showToastMessage(message, type = 'success', icon = 'fas fa-check-circle') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastIcon = icon;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 2000);
    },
  },
};
</script>

<style lang="scss" scoped>
// COLORS
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
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$red: #ef4444;
$red-light: #fef2f2;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.account-informations {
  padding: 0;

  // HEADER
  .info-header {
    padding: 24px;
    background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
    border-bottom: 2px solid $border;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 8px;

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

    .header-subtitle {
      font-size: 13px;
      color: $text-sub;
      margin: 0;
      margin-left: 32px;
    }
  }

  // INFO GRID
  .info-grid {
    padding: 24px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 20px;

    .info-card {
      background: $bg-light;
      border: 1px solid $border-light;
      border-radius: 10px;
      padding: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(90deg, $primary, $primary-light);
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.3s ease;
      }

      &:hover {
        border-color: $primary;
        background: white;
        box-shadow: $shadow-md;

        &::before {
          transform: scaleX(1);
        }
      }

      &.highlight {
        background: linear-gradient(135deg, rgba($primary, 0.05), rgba($primary, 0.02));
        border-color: $primary;

        &::before {
          transform: scaleX(1);
        }
      }

      .card-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 12px;

        i {
          font-size: 16px;
          color: $primary;
          width: 20px;
        }

        .card-label {
          font-size: 12px;
          font-weight: 700;
          color: $text-light;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
      }

      .card-body {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;

        .info-value {
          font-size: 16px;
          font-weight: 600;
          color: $text-main;
          margin: 0;
          word-break: break-word;
        }

        .info-value-badge {
          display: inline-block;
          padding: 8px 14px;
          background: linear-gradient(135deg, $primary, $primary-dark);
          color: white;
          border-radius: 6px;
          font-size: 14px;
          font-weight: 700;
          font-family: 'Courier New', monospace;
          letter-spacing: 0.2px;
          flex: 1;
        }

        .balance-display {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;

          .balance-amount {
            font-size: 20px;
            font-weight: 800;
            color: $green;
            font-family: 'Courier New', monospace;
          }

          .btn-recharge {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: $green;
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            white-space: nowrap;

            &:hover {
              background: darken($green, 10%);
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba($green, 0.25);
            }

            i {
              font-size: 13px;
            }
          }
        }

        .btn-copy {
          width: 36px;
          height: 36px;
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

          &:hover {
            background: $primary;
            color: white;
            border-color: $primary;
            transform: translateY(-2px);
          }

          i {
            font-size: 14px;
          }
        }
      }
    }
  }

  // VERIFICATION SECTION
  .verification-section {
    padding: 24px;
    border-top: 1px solid $border;

    .section-title {
      font-size: 14px;
      font-weight: 700;
      color: $text-main;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 8px;

      &::before {
        content: '';
        width: 4px;
        height: 16px;
        background: $primary;
        border-radius: 2px;
      }
    }

    .verification-items {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .verification-item {
        display: flex;
        align-items: center;
        gap: 14px;
        padding: 14px;
        background: $bg-light;
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: $border-light;
        }

        .verification-check {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: $yellow-light;
          color: $yellow;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          flex-shrink: 0;
          font-weight: bold;

          &.verified {
            background: $green-light;
            color: $green;
          }
        }

        .verification-info {
          display: flex;
          flex-direction: column;
          gap: 2px;

          .verification-label {
            font-size: 13px;
            font-weight: 600;
            color: $text-main;
          }

          .verification-status {
            font-size: 12px;
            color: $text-light;
          }
        }
      }
    }
  }

  // QUICK ACTIONS
  .quick-actions {
    padding: 24px;
    border-top: 1px solid $border;
    display: flex;
    gap: 12px;
    flex-wrap: wrap;

    .action-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 20px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      text-transform: uppercase;
      letter-spacing: 0.3px;

      i {
        font-size: 14px;
      }

      &.primary {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: white;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba($primary, 0.3);
        }

        &:active {
          transform: translateY(0);
        }
      }

      &.secondary {
        background: white;
        color: $text-main;
        border: 2px solid $border;

        &:hover {
          border-color: $primary;
          color: $primary;
          background: rgba($primary, 0.02);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  // TOAST MESSAGE
  .toast-message {
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

    &.error {
      background: $red-light;
      color: $red;
      border: 1px solid rgba($red, 0.2);
    }

    &.warning {
      background: $yellow-light;
      color: $yellow;
      border: 1px solid rgba($yellow, 0.2);
    }
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
@media (max-width: 1024px) {
  .account-informations {
    .info-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      padding: 20px;

      .info-card {
        padding: 16px;

        .card-body {
          flex-direction: column;
          align-items: flex-start;

          .balance-display {
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          }
        }
      }
    }

    .verification-section,
    .quick-actions {
      padding: 20px;
    }
  }
}

@media (max-width: 768px) {
  .account-informations {
    .info-header {
      padding: 16px;

      .header-content {
        h2 {
          font-size: 16px;
        }
      }

      .header-subtitle {
        font-size: 12px;
        margin-left: 28px;
      }
    }

    .info-grid {
      grid-template-columns: 1fr;
      padding: 16px;
      gap: 12px;

      .info-card {
        padding: 14px;

        .card-body {
          flex-direction: column;
          align-items: flex-start;
        }
      }
    }

    .verification-section {
      padding: 16px;

      .verification-items {
        gap: 10px;

        .verification-item {
          padding: 12px;
          gap: 12px;

          .verification-check {
            width: 36px;
            height: 36px;
          }
        }
      }
    }

    .quick-actions {
      padding: 16px;
      flex-direction: column;

      .action-btn {
        width: 100%;
        justify-content: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .account-informations {
    .info-grid {
      padding: 12px;
      gap: 10px;

      .info-card {
        padding: 12px;

        .card-header {
          margin-bottom: 10px;
        }

        .card-body {
          gap: 8px;

          .info-value-badge {
            font-size: 13px;
            padding: 6px 10px;
          }

          .balance-display .balance-amount {
            font-size: 18px;
          }
        }
      }
    }
  }
}
</style>