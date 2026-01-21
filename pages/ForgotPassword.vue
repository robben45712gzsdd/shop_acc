<template>
  <div class="forgot-password-page">
    <div class="forgot-password-card">
      <div class="forgot-header">
        <h1>Quên Mật Khẩu</h1>
        <p>Nhập email của bạn để nhận mã xác nhận</p>
      </div>

      <form @submit.prevent="handleSendCode" class="forgot-form">
        <!-- Email or Username Input -->
        <div class="form-field" :class="{ error: errors.emailOrUsername }">
          <label>Email hoặc Tên Đăng Nhập</label>
          <input
            v-model="emailOrUsername"
            type="text"
            placeholder="Nhập email hoặc tên đăng nhập"
            @blur="validateEmailOrUsername"
            @input="clearError('emailOrUsername')"
            :disabled="loading"
          />
          <span v-if="errors.emailOrUsername" class="error-msg">{{ errors.emailOrUsername }}</span>
        </div>

        <!-- Error Message -->
        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <!-- Success Message -->
        <div v-if="successMessage" class="alert-success">
          {{ successMessage }}
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="!isValid || loading">
          <span v-if="!loading">Gửi Mã Xác Nhận</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
        </button>

        <!-- Info Message -->
        <div class="info-text">
          Mã xác nhận sẽ được gửi tới email liên kết với tài khoản của bạn. Vui lòng kiểm tra trong 10 phút
        </div>

        <!-- Back to Login -->
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
  name: 'ForgotPassword',
  data() {
    return {
      emailOrUsername: '',
      loading: false,
      generalError: '',
      successMessage: '',
      errors: {
        emailOrUsername: ''
      }
    };
  },

  computed: {
    isValid() {
      return this.emailOrUsername.trim().length > 0 && !this.errors.emailOrUsername;
    }
  },

  methods: {
    validateEmailOrUsername() {
      const val = this.emailOrUsername.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;

      if (!val) {
        this.errors.emailOrUsername = 'Vui lòng nhập email hoặc tên đăng nhập';
        return false;
      }

      const isEmail = emailRegex.test(val);
      const isUsername = usernameRegex.test(val);

      if (!isEmail && !isUsername) {
        this.errors.emailOrUsername = 'Email hoặc tên đăng nhập không hợp lệ';
        return false;
      }

      this.errors.emailOrUsername = '';
      return true;
    },

    clearError(field) {
      this.errors[field] = '';
      this.generalError = '';
    },

    async handleSendCode() {
      const isValid = this.validateEmailOrUsername();

      if (!isValid) {
        return;
      }

      this.generalError = '';
      this.successMessage = '';
      this.loading = true;

      try {
        const res = await auth.forgotPassword({
          emailOrUsername: this.emailOrUsername
        });

        if (res.success === true) {
          this.successMessage = 'Mã xác nhận đã được gửi tới email của bạn!';
        
        } else {
          this.generalError = res.message || 'Không thể gửi mã xác nhận. Vui lòng thử lại';
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
.forgot-password-page {
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
  background: #f5f7fa;
}

.forgot-password-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 40px 35px;
}

.forgot-header {
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

.forgot-form {
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

.alert-success {
  padding: 12px 14px;
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  color: #16a34a;
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

.info-text {
  text-align: center;
  font-size: 13px;
  color: #6b7280;
  line-height: 1.5;
  padding: 10px;
  background: #f9fafb;
  border-radius: 6px;
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
  .forgot-password-card {
    padding: 30px 25px;
  }

  .forgot-header h1 {
    font-size: 24px;
  }
}
</style>
