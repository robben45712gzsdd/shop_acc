<template>
  <div class="auto-recharge-card">
    <!-- HEADER -->
    <div class="form-header">
      <div class="header-content">
        <i class="fas fa-sim-card"></i>
        <h2>Nạp Thẻ Cào Tự Động</h2>
      </div>
      <p class="header-subtitle">Nạp thẻ cào 24/24, nhận 100% giá trị thẻ</p>
    </div>

    <!-- INFO BANNER -->
    <div class="info-banner warning">
      <i class="fas fa-exclamation-triangle"></i>
      <span>Chọn đúng mệnh giá. Nếu sai sẽ mất thẻ</span>
    </div>

    <!-- RECHARGE FORM -->
    <form @submit.prevent="handleRecharge" class="recharge-form">
      <!-- CARRIER SELECTION -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-mobile-alt"></i>
          Nhà Mạng
          <span class="required">*</span>
        </label>
        <select
          v-model="selectedCarrier"
          class="form-control"
          @change="validateForm"
        >
          <option value="">-- Chọn nhà mạng --</option>
          <option v-for="carrier in carriers" :key="carrier.id" :value="carrier.id">
            {{ carrier.name }}
          </option>
        </select>
      </div>

      <!-- DENOMINATION SELECTION -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-money-bill-wave"></i>
          Mệnh Giá
          <span class="required">*</span>
        </label>
        <select
          v-model="selectedDenomination"
          class="form-control"
          @change="validateForm"
        >
          <option value="">-- Chọn mệnh giá --</option>
          <option
            v-for="denom in denominations"
            :key="denom.value"
            :value="denom.value"
          >
            {{ denom.label }}
          </option>
        </select>
        <div v-if="selectedDenomination" class="denomination-info">
          <span class="receive-badge">
            <i class="fas fa-check-circle"></i>
            Bạn sẽ nhận: {{ formatPrice(selectedDenomination) }}
          </span>
        </div>
      </div>

      <!-- SERIAL INPUT -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-barcode"></i>
          Số Seri
          <span class="required">*</span>
        </label>
        <input
          v-model="serialNumber"
          type="text"
          class="form-control"
          placeholder="Ví dụ: 1234567890123"
          @input="validateForm"
          :disabled="isLoading"
        />
        <p class="form-hint">Số seri nằm phía trước của thẻ cào</p>
      </div>

      <!-- PIN INPUT -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-key"></i>
          Mã PIN
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <input
            v-model="pinCode"
            :type="showPin ? 'text' : 'password'"
            class="form-control"
            placeholder="Ví dụ: 1234567890123456"
            @input="validateForm"
            :disabled="isLoading"
          />
          <button
            type="button"
            class="toggle-pin"
            @click="togglePin"
            :disabled="isLoading"
          >
            <i :class="showPin ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <p class="form-hint">Mã PIN nằm phía sau của thẻ cào, dưới lớp bạc</p>
      </div>

      <!-- FORM ACTIONS -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isFormValid || isLoading"
        >
          <i class="fas fa-paper-plane"></i>
          {{ isLoading ? 'Đang xử lý...' : 'Nạp Thẻ' }}
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          @click="resetForm"
          :disabled="isLoading"
        >
          <i class="fas fa-redo"></i>
          Hủy
        </button>
      </div>

      <!-- ERROR MESSAGE -->
      <transition name="slide">
        <div v-if="error" class="alert alert-error">
          <i class="fas fa-times-circle"></i>
          <span>{{ error }}</span>
        </div>
      </transition>
    </form>

    <!-- QUICK INFO -->
    <div class="quick-info">
      <div class="info-section">
        <h4 class="info-title">
          <i class="fas fa-lightbulb"></i>
          Cách Tìm Số Seri Và Mã PIN
        </h4>
        <div class="info-content">
          <div class="info-item">
            <span class="info-label">Số Seri:</span>
            <span class="info-desc">Dãy số 13 chữ số nằm ở phía trước của thẻ cào (phía dưới logo nhà mạng)</span>
          </div>
          <div class="info-item">
            <span class="info-label">Mã PIN:</span>
            <span class="info-desc">Dãy số 16 chữ số nằm ở phía sau của thẻ cào, dưới lớp bạc (cần gạo cạo)</span>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h4 class="info-title">
          <i class="fas fa-check-circle"></i>
          Lợi Ích Nạp Thẻ
        </h4>
        <ul class="benefits-list">
          <li>
            <i class="fas fa-check"></i>
            <span>Nạp 100%, không mất phí gì cả</span>
          </li>
          <li>
            <i class="fas fa-check"></i>
            <span>Tự động xử lý, tiền về trong 1-2 phút</span>
          </li>
          <li>
            <i class="fas fa-check"></i>
            <span>Hỗ trợ Viettel, Vinaphone, Mobifone</span>
          </li>
          <li>
            <i class="fas fa-check"></i>
            <span>An toàn, bảo mật thông tin 100%</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- MOBILE TIP -->
    <div class="mobile-tip">
      <i class="fas fa-mobile-alt"></i>
      <span>Trên điện thoại, vuốt bảng từ phải sang trái để xem đầy đủ thông tin</span>
    </div>

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
  name: 'AutoRechargeCard',
  data() {
    return {
      selectedCarrier: '',
      selectedDenomination: '',
      serialNumber: '',
      pinCode: '',
      showPin: false,
      isLoading: false,
      error: null,
      showToast: false,
      toastMessage: '',
      toastType: 'success',
      toastIcon: 'fas fa-check-circle',
      carriers: [
        { id: 'viettel', name: 'Viettel' },
        { id: 'vinaphone', name: 'Vinaphone' },
        { id: 'mobifone', name: 'Mobifone' },
      ],
      denominations: [
        { value: 10000, label: '10.000 VNĐ - (nhận 100%)' },
        { value: 20000, label: '20.000 VNĐ - (nhận 100%)' },
        { value: 30000, label: '30.000 VNĐ - (nhận 100%)' },
        { value: 50000, label: '50.000 VNĐ - (nhận 100%)' },
        { value: 100000, label: '100.000 VNĐ - (nhận 100%)' },
        { value: 200000, label: '200.000 VNĐ - (nhận 100%)' },
        { value: 300000, label: '300.000 VNĐ - (nhận 100%)' },
        { value: 500000, label: '500.000 VNĐ - (nhận 100%)' },
        { value: 1000000, label: '1.000.000 VNĐ - (nhận 100%)' },
      ],
    };
  },

  computed: {
    isFormValid() {
      return (
        this.selectedCarrier &&
        this.selectedDenomination &&
        this.serialNumber.length === 13 &&
        this.pinCode.length === 16
      );
    },
  },

  methods: {
    togglePin() {
      this.showPin = !this.showPin;
    },

    validateForm() {
      this.error = null;

      if (!this.selectedCarrier || !this.selectedDenomination) {
        return;
      }

      if (this.serialNumber && this.serialNumber.length !== 13) {
        this.error = 'Số seri phải có 13 chữ số';
      }

      if (this.pinCode && this.pinCode.length !== 16) {
        this.error = 'Mã PIN phải có 16 chữ số';
      }
    },

    async handleRecharge() {
      if (!this.isFormValid) {
        this.error = 'Vui lòng điền đầy đủ thông tin chính xác';
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Success
        this.showToastMessage(
          `Nạp thẻ ${this.selectedCarrier.toUpperCase()} ${this.formatPrice(this.selectedDenomination)} thành công!`,
          'success',
          'fas fa-check-circle'
        );
        this.resetForm();
      } catch (err) {
        this.error = 'Nạp thẻ thất bại. Vui lòng thử lại';
        this.showToastMessage(this.error, 'error', 'fas fa-times-circle');
      } finally {
        this.isLoading = false;
      }
    },

    resetForm() {
      this.selectedCarrier = '';
      this.selectedDenomination = '';
      this.serialNumber = '';
      this.pinCode = '';
      this.showPin = false;
      this.error = null;
    },

    formatPrice(num) {
      return (num || 0).toLocaleString('vi-VN') + 'đ';
    },

    showToastMessage(message, type = 'success', icon = 'fas fa-check-circle') {
      this.toastMessage = message;
      this.toastType = type;
      this.toastIcon = icon;
      this.showToast = true;

      setTimeout(() => {
        this.showToast = false;
      }, 3000);
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

$green: #10b981;
$green-light: #ecfdf5;
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$red: #ef4444;
$red-light: #fef2f2;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.auto-recharge-card {
  padding: 0;

  // HEADER
  .form-header {
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

  // INFO BANNER
  .info-banner {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 20px 24px 0 24px;
    padding: 14px 16px;
    border-left: 4px solid $yellow;
    border-radius: 8px;
    font-size: 13px;
    color: darken($yellow, 10%);
    background: $yellow-light;

    i {
      font-size: 16px;
      flex-shrink: 0;
    }

    span {
      line-height: 1.5;
    }

    &.warning {
      border-left-color: $yellow;
      background: $yellow-light;
      color: darken($yellow, 10%);
    }
  }

  // RECHARGE FORM
  .recharge-form {
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  // FORM GROUP
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .form-label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: $text-main;
      text-transform: uppercase;
      letter-spacing: 0.3px;

      i {
        font-size: 14px;
        color: $primary;
        width: 16px;
      }

      .required {
        color: $red;
        margin-left: 2px;
      }
    }

    .form-control {
      padding: 12px 16px;
      font-size: 14px;
      color: $text-main;
      border: 2px solid $border;
      border-radius: 8px;
      background: $bg-light;
      transition: all 0.2s ease;
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

      &:focus {
        outline: none;
        border-color: $primary;
        background: white;
        box-shadow: 0 0 0 3px rgba($primary, 0.1);
      }

      &:disabled {
        background: $border-light;
        color: $text-light;
        cursor: not-allowed;
      }
    }

    select.form-control {
      cursor: pointer;

      option {
        padding: 8px;
      }
    }

    .denomination-info {
      margin-top: 6px;

      .receive-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: $green-light;
        color: $green;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 600;

        i {
          font-size: 13px;
        }
      }
    }

    .form-hint {
      font-size: 11px;
      color: $text-light;
      margin: 2px 0 0 0;
      font-style: italic;
    }

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .form-control {
        padding-right: 44px;
      }

      .toggle-pin {
        position: absolute;
        right: 12px;
        width: 32px;
        height: 32px;
        border: none;
        background: transparent;
        color: $text-light;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 6px;
        transition: all 0.2s ease;
        font-size: 14px;

        &:hover:not(:disabled) {
          background: $border-light;
          color: $primary;
        }

        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
    }
  }

  // FORM ACTIONS
  .form-actions {
    display: flex;
    gap: 12px;
    margin-top: 8px;

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      transition: all 0.2s ease;

      i {
        font-size: 14px;
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      &.btn-primary {
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: white;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba($primary, 0.3);
        }

        &:active:not(:disabled) {
          transform: translateY(0);
        }
      }

      &.btn-secondary {
        background: white;
        color: $text-main;
        border: 2px solid $border;

        &:hover:not(:disabled) {
          border-color: $primary;
          color: $primary;
          background: rgba($primary, 0.02);
        }

        &:active:not(:disabled) {
          transform: scale(0.98);
        }
      }
    }
  }

  // ALERTS
  .alert {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 500;

    i {
      font-size: 16px;
      flex-shrink: 0;
    }

    &.alert-error {
      background: $red-light;
      color: $red;
      border: 1px solid rgba($red, 0.2);
    }
  }

  // QUICK INFO
  .quick-info {
    padding: 24px;
    background: $bg-light;
    border-top: 1px solid $border;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;

    .info-section {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .info-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        font-weight: 700;
        color: $text-main;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        margin: 0;

        i {
          font-size: 16px;
          color: $primary;
        }
      }

      .info-content {
        display: flex;
        flex-direction: column;
        gap: 10px;

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          border-left: 3px solid $primary;

          .info-label {
            font-size: 11px;
            font-weight: 700;
            color: $primary;
            text-transform: uppercase;
            letter-spacing: 0.2px;
          }

          .info-desc {
            font-size: 12px;
            color: $text-sub;
            line-height: 1.4;
          }
        }
      }

      .benefits-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: flex;
        flex-direction: column;
        gap: 8px;

        li {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px;
          background: white;
          border-radius: 6px;
          font-size: 13px;
          color: $text-main;
          border-left: 3px solid $green;

          i {
            font-size: 14px;
            color: $green;
            flex-shrink: 0;
          }
        }
      }
    }
  }

  // MOBILE TIP
  .mobile-tip {
    display: none;
    align-items: center;
    gap: 10px;
    margin: 0 24px 24px 24px;
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

  // TOAST NOTIFICATION
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

    &.error {
      background: $red-light;
      color: $red;
      border: 1px solid rgba($red, 0.2);
    }
  }
}

// ANIMATIONS
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

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
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
  .auto-recharge-card {
    .form-header {
      padding: 16px;

      .header-content h2 {
        font-size: 16px;
      }

      .header-subtitle {
        font-size: 12px;
        margin-left: 28px;
      }
    }

    .info-banner {
      margin: 16px 16px 0 16px;
      padding: 12px 14px;
      font-size: 12px;
    }

    .recharge-form {
      padding: 16px;
      gap: 16px;
    }

    .form-actions {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }

    .quick-info {
      padding: 16px;
      gap: 16px;
      grid-template-columns: 1fr;

      .info-section {
        gap: 10px;

        .info-title {
          font-size: 12px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .auto-recharge-card {
    .form-header {
      padding: 12px;

      .header-content {
        h2 {
          font-size: 14px;
        }

        i {
          font-size: 18px;
        }
      }

      .header-subtitle {
        font-size: 11px;
      }
    }

    .info-banner {
      margin: 12px 12px 0 12px;
      padding: 10px 12px;
      font-size: 11px;
    }

    .recharge-form {
      padding: 12px;
      gap: 14px;
    }

    .form-group .form-control {
      padding: 10px 12px;
      font-size: 13px;
    }

    .quick-info {
      padding: 12px;
      gap: 12px;

      .info-section {
        gap: 8px;

        .info-title {
          font-size: 11px;
        }
      }
    }
  }
}
</style>