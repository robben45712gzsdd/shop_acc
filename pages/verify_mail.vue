<template>
  <div class="verify-mail-page">
    <!-- LOADING STATE -->
    <div v-if="isLoading" class="verify-loading">
      <div class="loading-container">
        <div class="spinner"></div>
        <p>Đang xác thực email của bạn...</p>
      </div>
    </div>

    <!-- SUCCESS STATE -->
    <div v-else-if="isVerified && !showChangePassword" class="verify-success">
      <div class="success-container">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Email Đã Xác Thực Thành Công!</h1>
        <p class="success-message">
          Email của bạn đã được xác thực. Bây giờ bạn có thể đổi mật khẩu của mình.
        </p>
        <button @click="goToChangePassword" class="btn btn-primary">
          Tiếp Tục Đổi Mật Khẩu <i class="fa-arrow-right fas"></i>
        </button>
        <button @click="goHome" class="btn btn-secondary">
          Quay Về Trang Chủ
        </button>
      </div>
    </div>

    <!-- CHANGE PASSWORD FORM -->
    <div v-else-if="showChangePassword" class="change-password-container">
      <div class="form-wrapper">
        <div class="form-header">
          <div class="header-content">
            <i class="fas fa-lock"></i>
            <h2>Đổi Mật Khẩu</h2>
          </div>
          <p class="header-subtitle">Cập nhật mật khẩu của bạn để hoàn tất xác thực</p>
        </div>

        <form @submit.prevent="handleChangePassword" class="password-form">
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
                v-model="formData.newPassword"
                placeholder="Nhập mật khẩu mới"
                class="form-input"
                @focus="clearErrors"
                @input="validatePassword"
                :disabled="isProcessing"
              />
              <button
                type="button"
                @click="toggleNewPassword"
                class="toggle-password"
                :disabled="isProcessing"
              >
                <i :class="showNewPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <div class="password-strength" v-if="formData.newPassword">
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

          <!-- CONFIRM PASSWORD -->
          <div class="form-group">
            <label class="form-label">
              <i class="fas fa-check-circle"></i>
              Xác Nhận Mật Khẩu
              <span class="required">*</span>
            </label>
            <div class="input-wrapper">
              <input
                :type="showConfirmPassword ? 'text' : 'password'"
                v-model="formData.confirmPassword"
                placeholder="Xác nhận mật khẩu mới"
                class="form-input"
                @focus="clearErrors"
                :disabled="isProcessing"
                :class="{ error: formData.confirmPassword && !passwordMatch }"
              />
              <button
                type="button"
                @click="toggleConfirmPassword"
                class="toggle-password"
                :disabled="isProcessing"
              >
                <i :class="showConfirmPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
            <p v-if="formData.confirmPassword && !passwordMatch" class="error-message">
              <i class="fas fa-exclamation-circle"></i> Mật khẩu không khớp
            </p>
          </div>

          <!-- ERROR MESSAGE -->
          <div v-if="formError" class="alert alert-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ formError }}
          </div>

          <!-- ACTION BUTTONS -->
          <div class="form-actions">
            <button type="button" @click="goHome" class="btn btn-secondary" :disabled="isProcessing">
              Hủy
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              :disabled="!isFormValid || isProcessing"
            >
              <span v-if="!isProcessing">Cập Nhật Mật Khẩu</span>
              <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div v-else class="verify-error">
      <div class="error-container">
        <div class="error-icon">
          <i class="fas fa-times-circle"></i>
        </div>
        <h1>Xác Thực Không Hợp Lệ</h1>
        <p class="error-message">{{ errorMessage }}</p>
        <button @click="goHome" class="btn btn-primary">
          Quay Về Trang Chủ
        </button>
        <button @click="requestNewCode" class="btn btn-secondary" v-if="allowRetry">
          Yêu Cầu Mã Mới
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import authApi from '~/api/auth'

export default {
  name: 'VerifyMailPage',
  data() {
    return {
      isLoading: true,
      isVerified: false,
      isProcessing: false,
      showChangePassword: false,
      errorMessage: '',
      allowRetry: false,
      token: '',
      formError: '',
      showNewPassword: false,
      showConfirmPassword: false,
      formData: {
        newPassword: '',
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
    passwordMatch() {
      return this.formData.newPassword === this.formData.confirmPassword
    },
    isFormValid() {
      return (
        this.formData.newPassword &&
        this.formData.confirmPassword &&
        this.passwordMatch &&
        this.formData.newPassword.length >= 8
      )
    }
  },
  async mounted() {
    // Get token from query params
    this.token = this.$route.query.token
    
    if (!this.token) {
      this.isLoading = false
      this.errorMessage = 'Token xác thực không hợp lệ hoặc đã hết hạn'
      return
    }

    // Verify token
    await this.verifyToken()
  },
  methods: {
    async verifyToken() {
      try {
        const response = await authApi.verifyMailToken({
          code: this.token
        })

        if (response?.success) {
          this.isVerified = true
          this.$toast.success('Email đã được xác thực!')
          // Auto show change password after 2 seconds
          setTimeout(() => {
            this.showChangePassword = true
          }, 2000)
        } else {
          this.errorMessage = response?.message || 'Token xác thực không hợp lệ'
          this.allowRetry = true
        }
      } catch (error) {
        this.errorMessage = 'Có lỗi xảy ra khi xác thực email. Vui lòng thử lại.'
        this.allowRetry = true
        console.error('Verify token error:', error)
      } finally {
        this.isLoading = false
      }
    },
    validatePassword() {
      const password = this.formData.newPassword
      let strength = { level: 'weak', percent: 30, text: 'Yếu' }

      if (password.length >= 8) {
        strength.percent = 50
      }
      if (password.length >= 12) {
        strength.percent = 70
      }
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
        strength.percent += 15
      }
      if (/\d/.test(password)) {
        strength.percent += 10
      }
      if (/[!@#$%^&*]/.test(password)) {
        strength.percent += 15
      }

      if (strength.percent >= 80) {
        strength.level = 'strong'
        strength.text = 'Mạnh'
      } else if (strength.percent >= 60) {
        strength.level = 'medium'
        strength.text = 'Trung Bình'
      }

      this.passwordStrength = strength
    },
    async handleChangePassword() {
      if (!this.isFormValid) return

      this.isProcessing = true
      this.formError = ''

      try {
        const response = await authApi.updatePasswordAfterVerify({
          code: this.token,
          newPassword: this.formData.newPassword,
          confirmPassword: this.formData.confirmPassword
        })

        if (response?.success) {
          this.$toast.success('Mật khẩu đã được cập nhật thành công!')
          setTimeout(() => {
            this.$router.push('/Login')
          }, 2000)
        } else {
          this.formError = response?.message || 'Cập nhật mật khẩu thất bại'
        }
      } catch (error) {
        this.formError = 'Có lỗi xảy ra. Vui lòng thử lại.'
        console.error('Update password error:', error)
      } finally {
        this.isProcessing = false
      }
    },
    toggleNewPassword() {
      this.showNewPassword = !this.showNewPassword
    },
    toggleConfirmPassword() {
      this.showConfirmPassword = !this.showConfirmPassword
    },
    clearErrors() {
      this.formError = ''
    },
    goToChangePassword() {
      this.showChangePassword = true
    },
    goHome() {
      this.$router.push('/')
    },
    async requestNewCode() {
      // Implement request new verification code
      this.$router.push('/ForgotPassword')
    }
  }
}
</script>

<style scoped lang="scss">
.verify-mail-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;

  // LOADING STATE
  .verify-loading {
    .loading-container {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 400px;

      .spinner {
        width: 50px;
        height: 50px;
        border: 4px solid #f0f0f0;
        border-top-color: #667eea;
        border-radius: 50%;
        animation: spin 1s linear infinite;
        margin: 0 auto 20px;
      }

      p {
        font-size: 16px;
        color: #666;
        margin: 0;
      }
    }
  }

  // SUCCESS STATE
  .verify-success {
    .success-container {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      animation: slideUp 0.5s ease;

      .success-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: #f0f9ff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #00b894;
        animation: pulse 0.6s ease;
      }

      h1 {
        font-size: 24px;
        color: #333;
        margin: 20px 0 10px;
      }

      .success-message {
        font-size: 14px;
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .btn {
        width: 100%;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  // ERROR STATE
  .verify-error {
    .error-container {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 450px;
      animation: slideUp 0.5s ease;

      .error-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 20px;
        background: #ffe0e0;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 40px;
        color: #ff6b6b;
        animation: pulse 0.6s ease;
      }

      h1 {
        font-size: 24px;
        color: #333;
        margin: 20px 0 10px;
      }

      .error-message {
        font-size: 14px;
        color: #666;
        margin-bottom: 30px;
        line-height: 1.6;
      }

      .btn {
        width: 100%;
        margin-bottom: 12px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }

  // CHANGE PASSWORD
  .change-password-container {
    .form-wrapper {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      overflow: hidden;
      animation: slideUp 0.5s ease;

      .form-header {
        padding: 40px 30px 20px;
        border-bottom: 1px solid #e0e0e0;

        .header-content {
          display: flex;
          align-items: center;
          gap: 12px;

          i {
            font-size: 28px;
            color: #667eea;
          }

          h2 {
            font-size: 24px;
            font-weight: 600;
            color: #333;
            margin: 0;
          }
        }

        .header-subtitle {
          font-size: 13px;
          color: #999;
          margin: 10px 0 0 40px;
        }
      }

      .password-form {
        padding: 30px;

        .form-group {
          margin-bottom: 25px;

          .form-label {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;

            i {
              color: #667eea;
            }

            .required {
              color: #ff6b6b;
            }
          }

          .input-wrapper {
            position: relative;
            display: flex;
            align-items: center;

            .form-input {
              width: 100%;
              padding: 12px 40px 12px 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
              font-size: 14px;
              transition: all 0.3s ease;
              background: #f9f9f9;

              &:focus {
                outline: none;
                border-color: #667eea;
                background: white;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
              }

              &:disabled {
                opacity: 0.6;
                cursor: not-allowed;
                background: #f0f0f0;
              }

              &.error {
                border-color: #ff6b6b;
                background: #fff5f5;
              }
            }

            .toggle-password {
              position: absolute;
              right: 12px;
              background: none;
              border: none;
              cursor: pointer;
              color: #999;
              font-size: 16px;
              transition: color 0.3s ease;

              &:hover:not(:disabled) {
                color: #667eea;
              }

              &:disabled {
                opacity: 0.5;
                cursor: not-allowed;
              }
            }
          }

          .password-strength {
            margin-top: 10px;

            .strength-bar {
              height: 4px;
              background: #e0e0e0;
              border-radius: 2px;
              overflow: hidden;
              margin-bottom: 8px;

              .strength-fill {
                height: 100%;
                transition: all 0.3s ease;

                &.weak {
                  background: #ff6b6b;
                  width: 30%;
                }

                &.medium {
                  background: #ffa940;
                }

                &.strong {
                  background: #00b894;
                }
              }
            }

            .strength-text {
              font-size: 12px;
              color: #999;
              margin: 0;

              strong {
                color: #333;
              }
            }
          }

          .error-message {
            font-size: 13px;
            color: #ff6b6b;
            margin-top: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
        }

        .alert {
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 13px;
          display: flex;
          align-items: center;
          gap: 10px;

          &.alert-error {
            background: #fff5f5;
            color: #ff6b6b;
            border: 1px solid #ffdddd;
          }
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 30px;
        }
      }
    }
  }

  .btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    &.btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
      }
    }

    &.btn-secondary {
      background: #e0e0e0;
      color: #333;
      flex: 1;

      &:hover:not(:disabled) {
        background: #d0d0d0;
      }
    }
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

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

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@media (max-width: 600px) {
  .verify-mail-page {
    .verify-success,
    .verify-error,
    .change-password-container {
      .success-container,
      .error-container,
      .form-wrapper {
        max-width: 100%;
        margin: 0 20px;
      }
    }

    .change-password-container {
      .form-wrapper {
        .form-header {
          padding: 30px 20px 15px;

          .header-content {
            h2 {
              font-size: 20px;
            }
          }

          .header-subtitle {
            margin-left: 32px;
          }
        }

        .password-form {
          padding: 20px;
        }
      }
    }
  }
}
</style>
