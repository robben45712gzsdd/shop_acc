<template>
  <div class="reset-password-page">
    <!-- Loading Auto-Verify -->
    <div v-if="isLoading" class="reset-password-card">
      <div class="reset-header">
        <div class="verify-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <h1>Đang xác thực...</h1>
      </div>
    </div>

    <!-- Password Change Form (after token verified) -->
    <div v-else-if="isVerified" class="reset-password-card">

      <div class="password-step">
        <div class="reset-header">
          <div class="success-badge">
            <i class="fas fa-check-circle"></i>
          </div>
          <h1>Đổi Mật Khẩu</h1>
          <p>Email của bạn đã được xác thực. Hãy tạo mật khẩu mới</p>
        </div>

        <form @submit.prevent="handleResetPassword" class="reset-form">
          <!-- New Password -->
          <div class="form-field" :class="{ error: errors.password }">
            <label>Mật Khẩu Mới</label>
            <div class="password-field">
              <input
                v-model="newPassword"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                @blur="validatePassword"
                @input="clearError('password')"
                :disabled="loading"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                tabindex="-1"
                :disabled="loading"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>

            <!-- Password Strength -->
            <div v-if="newPassword" class="password-strength">
              <div class="strength-bar">
                <div
                  class="strength-fill"
                  :class="passwordStrength.level"
                  :style="{ width: passwordStrength.percent + '%' }"
                ></div>
              </div>
              <p class="strength-text">Độ mạnh: <strong>{{ passwordStrength.text }}</strong></p>
            </div>
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
                :disabled="loading"
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
          <button type="submit" class="btn-submit" :disabled="!isPasswordValid || loading">
            <span v-if="!loading">Cập Nhật Mật Khẩu</span>
            <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
          </button>

          <!-- Back to Login -->
          <div class="back-link">
            <nuxt-link to="/Login">
              <i class="fa-arrow-left fas"></i> Quay lại Đăng Nhập
            </nuxt-link>
          </div>
        </form>
      </div>
    </div>

    <!-- Error State - Token Invalid -->
    <div v-else class="reset-password-card">
      <div class="reset-header error-state">
        <div class="error-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h1>Xác Thực Thất Bại</h1>
        <p>{{ verifyError }}</p>
      </div>
      <button @click="$router.push('/ForgotPassword')" class="btn-submit">
        Quay Lại Quên Mật Khẩu
      </button>
    </div>
  </div>
</template>

<script>
import auth from '~/api/auth'

export default {
  name: 'ResetPassword',
  data() {
    return {
      token: '',
      isLoading: true,
      isVerified: false,
      verifyError: '',
      
      // Password reset
      newPassword: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      
      // States
      loading: false,
      generalError: '',
      errors: {
        password: '',
        confirmPassword: ''
      },
      passwordStrength: {
        level: '',
        percent: 0,
        text: ''
      }
    }
  },

  computed: {
    isPasswordValid() {
      return (
        this.newPassword.length >= 8 &&
        this.confirmPassword.length >= 8 &&
        this.newPassword === this.confirmPassword &&
        !this.errors.password &&
        !this.errors.confirmPassword
      )
    }
  },

  async mounted() {
    // Get token from URL query params
    this.token = this.$route.query.token
    
    if (!this.token) {
      this.isLoading = false
      this.verifyError = 'Liên kết xác thực không hợp lệ hoặc đã hết hạn'
      return
    }

    // Auto-verify token
    await this.verifyToken()
  },

  methods: {
    async verifyToken() {
      try {
        const response = await auth.verifyMailToken({
          code: this.token
        })

        if (response?.success) {
          this.isVerified = true
          this.$toast.success('Email xác thực thành công!')
        } else {
          this.verifyError = response?.message || 'Liên kết không hợp lệ hoặc đã hết hạn'
        }
      } catch (error) {
        this.verifyError = 'Có lỗi xảy ra khi xác thực. Vui lòng thử lại'
        console.error('Verify token error:', error)
      } finally {
        this.isLoading = false
      }
    },

    validatePassword() {
      if (!this.newPassword) {
        this.errors.password = 'Vui lòng nhập mật khẩu mới'
        return false
      }

      if (this.newPassword.length < 8) {
        this.errors.password = 'Mật khẩu phải có ít nhất 8 ký tự'
        return false
      }

      if (this.confirmPassword && this.newPassword !== this.confirmPassword) {
        this.errors.confirmPassword = 'Mật khẩu không khớp'
      } else {
        this.errors.confirmPassword = ''
      }

      this.errors.password = ''
      this.validatePasswordStrength()
      return true
    },

    validatePasswordStrength() {
      const password = this.newPassword
      let strength = { level: 'weak', percent: 30, text: 'Yếu' }

      if (password.length >= 8) strength.percent = 50
      if (password.length >= 12) strength.percent = 70
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength.percent += 15
      if (/\d/.test(password)) strength.percent += 10
      if (/[!@#$%^&*]/.test(password)) strength.percent += 15

      if (strength.percent >= 80) {
        strength.level = 'strong'
        strength.text = 'Mạnh'
      } else if (strength.percent >= 60) {
        strength.level = 'medium'
        strength.text = 'Trung Bình'
      }

      this.passwordStrength = strength
    },

    validateConfirmPassword() {
      if (!this.confirmPassword) {
        this.errors.confirmPassword = 'Vui lòng xác nhận mật khẩu'
        return false
      }

      if (this.newPassword !== this.confirmPassword) {
        this.errors.confirmPassword = 'Mật khẩu không khớp'
        return false
      }

      this.errors.confirmPassword = ''
      return true
    },

    clearError(field) {
      this.errors[field] = ''
      this.generalError = ''
    },

    togglePassword() {
      this.showPassword = !this.showPassword
    },

    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },

    async handleResetPassword() {
      const isValid = this.validatePassword() && this.validateConfirmPassword()

      if (!isValid) return

      this.loading = true
      this.generalError = ''

      try {
        const response = await auth.updatePasswordAfterVerify({
          code: this.token,
          newPassword: this.newPassword,
          confirmPassword: this.confirmPassword
        })

        if (response?.success) {
          this.$toast.success('Mật khẩu đã được cập nhật thành công!')
          setTimeout(() => {
            this.$router.push('/Login')
          }, 2000)
        } else {
          this.generalError = response?.message || 'Cập nhật mật khẩu thất bại'
        }
      } catch (error) {
        this.generalError = 'Có lỗi xảy ra. Vui lòng thử lại'
        console.error('Reset password error:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.reset-password-page {
  min-height: calc(100vh - 110px);
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
    border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 40px 35px;
  animation: slideUp 0.3s ease;

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
}

.reset-header {
  text-align: center;
  margin-bottom: 35px;

  .verify-spinner {
    width: 70px;
    height: 70px;
    margin: 0 auto 20px;
    background: #f0fdf4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #16a34a;

    i {
      animation: spin 1s linear infinite;
    }
  }

  .error-icon {
    width: 70px;
    height: 70px;
    margin: 0 auto 20px;
    background: #fef2f2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #dc2626;
  }

  .success-badge {
    width: 70px;
    height: 70px;
    margin: 0 auto 20px;
    background: #f0fdf4;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    color: #16a34a;
    animation: pulse 0.6s ease;

    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
  }

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

  &.error-state p {
    color: #dc2626;
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

.otp-inputs {
  display: flex;
  gap: 8px;
  justify-content: center;

  .otp-input {
    width: 50px;
    height: 55px;
    font-size: 24px;
    font-weight: 600;
    text-align: center;
    border: 2px solid #d1d5db;
    border-radius: 10px;
    transition: all 0.3s ease;
    background: #f9fafb;
    color: #1a1a1a;

    &:focus {
      outline: none;
      border-color: #c17635;
      background: white;
      box-shadow: 0 0 0 3px rgba(193, 118, 53, 0.1);
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      background: #f0f0f0;
    }

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}

.countdown-section {
  text-align: center;
  margin-top: 12px;
  font-size: 13px;

  .countdown {
    color: #6b7280;
    margin: 0;

    strong {
      color: #c17635;
      font-weight: 600;
    }
  }

  .resend-btn {
    background: none;
    border: none;
    color: #c17635;
    font-weight: 600;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    transition: all 0.2s;

    &:hover:not(:disabled) {
      color: #a05a1f;
      transform: translateX(2px);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    i {
      transition: transform 0.3s ease;
    }

    &:hover:not(:disabled) i {
      transform: rotate(180deg);
    }
  }
}

.password-strength {
  margin-top: 8px;

  .strength-bar {
    height: 4px;
    background: #e5e7eb;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 6px;

    .strength-fill {
      height: 100%;
      transition: all 0.3s ease;

      &.weak {
        background: #ef4444;
      }

      &.medium {
        background: #f59e0b;
      }

      &.strong {
        background: #10b981;
      }
    }
  }

  .strength-text {
    font-size: 12px;
    color: #6b7280;
    margin: 0;

    strong {
      color: #1a1a1a;
    }
  }
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

@keyframes spin {
  to {
    transform: rotate(360deg);
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
