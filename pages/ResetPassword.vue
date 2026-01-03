<template>
  <div class="reset-password-page">
    <div class="reset-password-card">
      <div class="reset-header">
        <h1>Xác Nhận & Đổi Mật Khẩu</h1>
        <p>Nhập mã xác nhận từ email và mật khẩu mới</p>
      </div>

      <form @submit.prevent="handleResetPassword" class="reset-form">
        <!-- Email or Username Display -->
        <div class="form-field email-display">
          <label>Email hoặc Tên Đăng Nhập</label>
          <div class="email-value">{{ userEmailOrUsername }}</div>
        </div>

        <!-- Reset Code -->
        <div class="form-field" :class="{ error: errors.code }">
          <label>Mã Xác Nhận</label>
          <input
            v-model="resetCode"
            type="text"
            placeholder="Nhập mã từ email (6 ký tự)"
            maxlength="6"
            @blur="validateCode"
            @input="clearError('code')"
            :disabled="loading"
            class="code-input"
          />
          <span v-if="errors.code" class="error-msg">{{ errors.code }}</span>
        </div>

        <!-- New Password -->
        <div class="form-field" :class="{ error: errors.password }">
          <label>Mật Khẩu Mới</label>
          <div class="password-field">
            <input
              v-model="newPassword"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nhập mật khẩu mới"
              @blur="validatePassword"
              @input="clearError('password')"
              :disabled="loading"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
              tabindex="-1"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>

        <!-- Confirm Password -->
        <div class="form-field" :class="{ error: errors.confirmPassword }">
          <label>Xác Nhận Mật Khẩu</label>
          <div class="password-field">
            <input
              v-model="confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu"
              @blur="validateConfirmPassword"
              @input="clearError('confirmPassword')"
              :disabled="loading"
            />
            <button
              type="button"
              class="toggle-password"
              @click="showConfirmPassword = !showConfirmPassword"
              tabindex="-1"
            >
              <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error-msg">{{ errors.confirmPassword }}</span>
        </div>

        <!-- Error Message -->
        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="!isValid || loading">
          <span v-if="!loading">Đổi Mật Khẩu</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
        </button>

        <!-- Back Link -->
        <div class="back-link">
          <nuxt-link to="/Login">
            <i class="fa-arrow-left fas"></i> Quay lại Đăng Nhập
          </nuxt-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from '~/api/auth';

export default {
  name: 'ResetPassword',
  data() {
    return {
      userEmailOrUsername: '',
      resetCode: '',
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      generalError: '',
      errors: {
        code: '',
        password: '',
        confirmPassword: ''
      }
    };
  },

  computed: {
    isValid() {
      return (
        this.resetCode.length === 6 &&
        this.newPassword.length >= 6 &&
        this.confirmPassword.length >= 6 &&
        this.newPassword === this.confirmPassword &&
        !this.errors.code &&
        !this.errors.password &&
        !this.errors.confirmPassword
      );
    }
  },

  mounted() {
    // Get emailOrUsername from query params
    this.userEmailOrUsername = this.$route.query.emailOrUsername || '';
    if (!this.userEmailOrUsername) {
      this.$toast.error('Email hoặc tên đăng nhập không hợp lệ. Vui lòng quay lại trang quên mật khẩu');
      this.$router.push('/ForgotPassword');
    }
  },

  methods: {
    validateCode() {
      const val = this.resetCode.trim().toUpperCase();

      if (!val) {
        this.errors.code = 'Vui lòng nhập mã xác nhận';
        return false;
      }

      if (val.length !== 6) {
        this.errors.code = 'Mã xác nhận phải có 6 ký tự';
        return false;
      }

      if (!/^[A-Z0-9]{6}$/.test(val)) {
        this.errors.code = 'Mã xác nhận chỉ chứa chữ và số';
        return false;
      }

      this.errors.code = '';
      return true;
    },

    validatePassword() {
      if (!this.newPassword) {
        this.errors.password = 'Vui lòng nhập mật khẩu mới';
        return false;
      }

      if (this.newPassword.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        return false;
      }

      if (this.newPassword.length > 50) {
        this.errors.password = 'Mật khẩu không được quá 50 ký tự';
        return false;
      }

      if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
        this.errors.confirmPassword = 'Mật khẩu không khớp';
      } else {
        this.errors.confirmPassword = '';
      }

      this.errors.password = '';
      return true;
    },

    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
        return false;
      }

      if (this.confirmPassword !== this.newPassword) {
        this.errors.confirmPassword = 'Mật khẩu không khớp';
        return false;
      }

      this.errors.confirmPassword = '';
      return true;
    },

    clearError(field) {
      this.errors[field] = '';
      this.generalError = '';
    },

    async handleResetPassword() {
      const isCodeValid = this.validateCode();
      const isPasswordValid = this.validatePassword();
      const isConfirmValid = this.validateConfirmPassword();

      if (!isCodeValid || !isPasswordValid || !isConfirmValid) {
        return;
      }

      this.generalError = '';
      this.loading = true;

      try {
        const res = await auth.resetPassword({
          emailOrUsername: this.userEmailOrUsername,
          code: this.resetCode.toUpperCase(),
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        });

        if (res.success === true) {
          this.$toast.success('Đổi mật khẩu thành công!');
          
          setTimeout(() => {
            this.$router.push('/Login');
          }, 1500);
        } else {
          this.generalError = res.message || 'Không thể đổi mật khẩu. Vui lòng thử lại';
        }
      } catch (err) {
        console.error(err);
        this.generalError = err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại';
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.reset-password-page {
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
  background: #f5f7fa;
}

.reset-password-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 40px 35px;
}

.reset-header {
  text-align: center;
  margin-bottom: 35px;

  h1 {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
  }

  p {
    font-size: 14px;
    color: #6b7280;
    margin: 0;
  }
}

.reset-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;
  }

  input {
    width: 100%;
    padding: 11px 14px;
    border: 1.5px solid #d1d5db;
    border-radius: 8px;
    font-size: 15px;
    color: #1a1a1a;
    background: #fff;
    transition: all 0.2s;

    &::placeholder {
      color: #9ca3af;
    }

    &:focus {
      outline: none;
      border-color: #c17635;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    &:disabled {
      background: #f9fafb;
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  &.error input {
    border-color: #ef4444;

    &:focus {
      box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
    }
  }

  &.email-display {
    .email-value {
      padding: 11px 14px;
      background: #f9fafb;
      border: 1.5px solid #e5e7eb;
      border-radius: 8px;
      font-size: 15px;
      color: #374151;
      word-break: break-all;
    }
  }
}

.code-input {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
}

.password-field {
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 42px;
  }

  .toggle-password {
    position: absolute;
    right: 10px;
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s;

    &:hover {
      color: #374151;
      background: #f3f4f6;
    }

    i {
      font-size: 16px;
    }
  }
}

.error-msg {
  font-size: 13px;
  color: #ef4444;
  margin-top: -2px;
}

.alert-error {
  padding: 12px 14px;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 14px;
  line-height: 1.5;
}

.btn-submit {
  width: 100%;
  padding: 13px;
  background: #c17635;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 5px;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  i {
    margin-right: 5px;
  }
}

.back-link {
  text-align: center;
  margin-top: 10px;

  a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    color: #c17635;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;

    &:hover {
      text-decoration: underline;
      color: #a05a1f;
    }

    i {
      font-size: 12px;
    }
  }
}

@media (max-width: 480px) {
  .reset-password-card {
    padding: 30px 25px;
  }

  .reset-header h1 {
    font-size: 24px;
  }
}
</style>
