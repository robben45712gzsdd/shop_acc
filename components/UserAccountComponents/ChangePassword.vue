<template>
  <div class="change-password">
    <!-- HEADER -->
    <div class="form-header">
      <div class="header-content">
        <i class="fas fa-lock"></i>
        <h2>Đổi Mật Khẩu</h2>
      </div>
      <p class="header-subtitle">Cập nhật mật khẩu của bạn định kỳ để bảo vệ tài khoản</p>
    </div>

    <!-- FORM -->
    <form @submit.prevent="handleChangePassword" class="password-form">
      <!-- OLD PASSWORD -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-key"></i>
          Mật Khẩu Cũ
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <input
            :type="showOldPassword ? 'text' : 'password'"
            v-model="oldPassword"
            placeholder="Nhập mật khẩu cũ"
            class="form-input"
            @focus="clearError"
            :disabled="isLoading"
          />
          <button
            type="button"
            @click="toggleOldPassword"
            class="toggle-password"
            :disabled="isLoading"
          >
            <i :class="showOldPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
      </div>

      <!-- NEW PASSWORD -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-lock-open"></i>
          Mật Khẩu Mới
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <input
            :type="showNewPassword ? 'text' : 'password'"
            v-model="newPassword"
            placeholder="Nhập mật khẩu mới"
            class="form-input"
            @focus="clearError"
            @input="validatePassword"
            :disabled="isLoading"
          />
          <button
            type="button"
            @click="toggleNewPassword"
            class="toggle-password"
            :disabled="isLoading"
          >
            <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <div class="password-strength" v-if="newPassword">
          <div class="strength-bar">
            <div class="strength-fill" :class="passwordStrength.level" :style="{ width: passwordStrength.percent + '%' }"></div>
          </div>
          <p class="strength-text">Độ mạnh: <strong>{{ passwordStrength.text }}</strong></p>
        </div>
      </div>

      <!-- CONFIRM PASSWORD -->
      <div class="form-group">
        <label class="form-label">
          <i class="fas fa-check-circle"></i>
          Xác Nhận Mật Khẩu Mới
          <span class="required">*</span>
        </label>
        <div class="input-wrapper">
          <input
            :type="showConfirmPassword ? 'text' : 'password'"
            v-model="confirmPassword"
            placeholder="Xác nhận mật khẩu mới"
            class="form-input"
            @focus="clearError"
            :disabled="isLoading"
            :class="{ error: confirmPassword && newPassword !== confirmPassword }"
          />
          <button
            type="button"
            @click="toggleConfirmPassword"
            class="toggle-password"
            :disabled="isLoading"
          >
            <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
        </div>
        <p v-if="confirmPassword && newPassword !== confirmPassword" class="mismatch-warning">
          <i class="fas fa-exclamation-circle"></i>
          Mật khẩu không khớp
        </p>
      </div>

      <!-- ERROR MESSAGE -->
      <transition name="slide">
        <div v-if="error" class="alert alert-error">
          <i class="fas fa-times-circle"></i>
          <span>{{ error }}</span>
        </div>
      </transition>

      <!-- PASSWORD TIPS -->
      <div class="password-tips">
        <p class="tips-title">
          <i class="fas fa-lightbulb"></i>
          Gợi ý bảo mật mật khẩu:
        </p>
        <ul class="tips-list">
          <li :class="{ valid: hasMinLength }">
            <i :class="hasMinLength ? 'fas fa-check' : 'fas fa-circle'"></i>
            Ít nhất 8 ký tự
          </li>
          <li :class="{ valid: hasUpperCase }">
            <i :class="hasUpperCase ? 'fas fa-check' : 'fas fa-circle'"></i>
            Bao gồm chữ cái viết hoa
          </li>
          <li :class="{ valid: hasNumber }">
            <i :class="hasNumber ? 'fas fa-check' : 'fas fa-circle'"></i>
            Bao gồm số
          </li>
          <li :class="{ valid: hasSpecialChar }">
            <i :class="hasSpecialChar ? 'fas fa-check' : 'fas fa-circle'"></i>
            Bao gồm ký tự đặc biệt (@, #, $, ...)
          </li>
        </ul>
      </div>

      <!-- BUTTONS -->
      <div class="form-actions">
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isFormValid || isLoading"
        >
          <i class="fas fa-save"></i>
          {{ isLoading ? 'Đang cập nhật...' : 'Cập Nhật Mật Khẩu' }}
        </button>
        <button
          type="button"
          @click="resetForm"
          class="btn btn-secondary"
          :disabled="isLoading"
        >
          <i class="fas fa-redo"></i>
          Hủy
        </button>
      </div>
    </form>

    <!-- SUCCESS MESSAGE -->
    <transition name="slide">
      <div v-if="showSuccess" class="alert alert-success">
        <i class="fas fa-check-circle"></i>
        <span>Đổi mật khẩu thành công! Mật khẩu mới sẽ được áp dụng ngay lập tức.</span>
      </div>
    </transition>
  </div>
</template>

<script>
import auth from "@/api/auth";

export default {
  name: "ChangePassword",
  data() {
    return {
      isLoading: false,
      error: null,
      showSuccess: false,
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
      showOldPassword: false,
      showNewPassword: false,
      showConfirmPassword: false,
    };
  },

  computed: {
    hasMinLength() {
      return this.newPassword.length >= 8;
    },

    hasUpperCase() {
      return /[A-Z]/.test(this.newPassword);
    },

    hasNumber() {
      return /\d/.test(this.newPassword);
    },

    hasSpecialChar() {
      return /[@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(this.newPassword);
    },

    passwordStrength() {
      let strength = 0;
      if (this.hasMinLength) strength += 25;
      if (this.hasUpperCase) strength += 25;
      if (this.hasNumber) strength += 25;
      if (this.hasSpecialChar) strength += 25;

      const levels = {
        0: { level: 'empty', text: 'Rất yếu', percent: 0 },
        25: { level: 'weak', text: 'Yếu', percent: 25 },
        50: { level: 'fair', text: 'Trung bình', percent: 50 },
        75: { level: 'good', text: 'Tốt', percent: 75 },
        100: { level: 'strong', text: 'Rất mạnh', percent: 100 },
      };

      return levels[strength] || { level: 'empty', text: 'Rất yếu', percent: 0 };
    },

    isFormValid() {
      return (
        this.oldPassword.length > 0 &&
        this.newPassword.length > 0 &&
        this.confirmPassword.length > 0 &&
        this.newPassword === this.confirmPassword &&
        this.passwordStrength.level !== 'empty' &&
        this.passwordStrength.level !== 'weak'
      );
    },
  },

  methods: {
    toggleOldPassword() {
      this.showOldPassword = !this.showOldPassword;
    },

    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword;
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword;
    },

    validatePassword() {
      if (this.newPassword === this.oldPassword) {
        this.error = 'Mật khẩu mới không được trùng với mật khẩu cũ';
      }
    },

    clearError() {
      this.error = null;
    },

    resetForm() {
      this.oldPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
      this.showOldPassword = false;
      this.showNewPassword = false;
      this.showConfirmPassword = false;
      this.error = null;
    },

    async handleChangePassword() {
      if (!this.isFormValid) {
        this.error = 'Vui lòng điền đầy đủ và chính xác thông tin';
        return;
      }

      if (this.newPassword === this.oldPassword) {
        this.error = 'Mật khẩu mới phải khác mật khẩu cũ';
        return;
      }

      this.isLoading = true;
      this.error = null;

      try {
        const res = await auth.changePassword({
          oldPassword: this.oldPassword,
          newPassword: this.newPassword,
        });

        if (res.success) {
          this.showSuccess = true;
          this.resetForm();
          this.$toast?.success?.('Đổi mật khẩu thành công!');

          setTimeout(() => {
            this.showSuccess = false;
          }, 4000);
        } else {
          this.error = res.message || 'Đổi mật khẩu thất bại';
          this.$toast?.error?.(this.error);
        }
      } catch (err) {
        this.error = err.response?.data?.message || 'Có lỗi xảy ra';
        this.$toast?.error?.(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },

  mounted() {
    this.$store.commit("setIsDarkMode", false);
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
$yellow: #f59e0b;
$yellow-light: #fffbeb;
$red: #ef4444;
$red-light: #fef2f2;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);

.change-password {
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

  // FORM
  .password-form {
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

    .input-wrapper {
      position: relative;
      display: flex;
      align-items: center;

      .form-input {
        width: 100%;
        padding: 12px 16px;
        padding-right: 44px;
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

        &.error {
          border-color: $red;
          background: rgba($red, 0.02);

          &:focus {
            box-shadow: 0 0 0 3px rgba($red, 0.1);
          }
        }
      }

      .toggle-password {
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

    // PASSWORD STRENGTH
    .password-strength {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .strength-bar {
        height: 4px;
        background: $border-light;
        border-radius: 2px;
        overflow: hidden;

        .strength-fill {
          height: 100%;
          border-radius: 2px;
          transition: all 0.3s ease;

          &.empty {
            width: 0%;
            background: transparent;
          }

          &.weak {
            background: $red;
          }

          &.fair {
            background: $yellow;
          }

          &.good {
            background: $primary;
          }

          &.strong {
            background: $green;
          }
        }
      }

      .strength-text {
        font-size: 12px;
        color: $text-sub;
        margin: 0;

        strong {
          color: $text-main;
          font-weight: 600;
        }
      }
    }

    // MISMATCH WARNING
    .mismatch-warning {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 12px;
      color: $red;
      margin: 0;

      i {
        font-size: 13px;
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

    &.alert-success {
      background: $green-light;
      color: $green;
      border: 1px solid rgba($green, 0.2);
    }
  }

  // PASSWORD TIPS
  .password-tips {
    padding: 16px;
    background: $bg-light;
    border-left: 4px solid $primary;
    border-radius: 6px;

    .tips-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 13px;
      font-weight: 700;
      color: $text-main;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin: 0 0 10px 0;

      i {
        font-size: 16px;
        color: $primary;
      }
    }

    .tips-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 6px;

      li {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 12px;
        color: $text-sub;

        i {
          font-size: 12px;
          width: 12px;
          text-align: center;
          flex-shrink: 0;
        }

        &.valid {
          color: $green;

          i {
            color: $green;
          }
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
}

// TRANSITIONS
@keyframes slideInDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
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

// RESPONSIVE
@media (max-width: 768px) {
  .change-password {
    .form-header {
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

    .password-form {
      padding: 16px;
      gap: 16px;
    }

    .form-actions {
      flex-direction: column;

      .btn {
        width: 100%;
      }
    }

    .password-tips {
      padding: 12px;

      .tips-title {
        font-size: 12px;
      }

      .tips-list li {
        font-size: 11px;
      }
    }
  }
}

@media (max-width: 480px) {
  .change-password {
    .form-header {
      padding: 12px;

      .header-content {
        h2 {
          font-size: 14px;
        }
      }

      .header-subtitle {
        font-size: 11px;
      }
    }

    .password-form {
      padding: 12px;
      gap: 14px;
    }

    .form-group .input-wrapper .form-input {
      padding: 10px 14px;
      padding-right: 40px;
      font-size: 13px;
    }

    .password-tips {
      padding: 10px;
    }
  }
}
</style>