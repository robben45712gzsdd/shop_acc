<template>
  <div class="login-page">
    <div class="login-card">
      <div class="login-header">
        <h1>Đăng Nhập</h1>
        <p>Đăng nhập để tiếp tục sử dụng dịch vụ</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <!-- Username -->
        <div class="form-field" :class="{ error: errors.username }">
          <label>Tên đăng nhập</label>
          <input
            v-model="username"
            type="text"
            placeholder="Nhập tên đăng nhập"
            @blur="validateUsername"
            @input="clearError('username')"
            :disabled="loading"
          />
          <span v-if="errors.username" class="error-msg">{{ errors.username }}</span>
        </div>

        <!-- Password -->
        <div class="form-field" :class="{ error: errors.password }">
          <label>Mật khẩu</label>
          <div class="password-field">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Nhập mật khẩu"
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

        <!-- Options -->
        <div class="form-options">
          <label class="checkbox-label">
            <input type="checkbox" v-model="rememberMe" />
            <span>Ghi nhớ đăng nhập</span>
          </label>
          <a href="#" @click.prevent="handleForgotPassword" class="forgot-link">Quên mật khẩu?</a>
        </div>

        <!-- Error Message -->
        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="!isValid || loading">
          <span v-if="!loading">Đăng Nhập</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
        </button>

        <!-- Register Link -->
        <div class="register-link">
          Chưa có tài khoản? 
          <nuxt-link to="/Register">Đăng ký ngay</nuxt-link>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import auth from '~/api/auth';

export default {
  data() {
    return {
      username: '',
      password: '',
      showPassword: false,
      rememberMe: false,
      loading: false,
      generalError: '',
      errors: {
        username: '',
        password: ''
      }
    };
  },

  computed: {
    isValid() {
      return (
        this.username.trim().length >= 3 &&
        this.password.length >= 2 &&
        !this.errors.username &&
        !this.errors.password
      );
    }
  },

  mounted() {
    this.$store.commit('setIsDarkMode', true);
    
    if (this.$store.state.user_data?.username) {
      this.$router.push('/');
    }

    const saved = localStorage.getItem('rememberedUser');
    if (saved) {
      this.username = saved;
      this.rememberMe = true;
    }
  },

  methods: {
    validateUsername() {
      const val = this.username.trim();
      
      if (!val) {
        this.errors.username = 'Vui lòng nhập tên đăng nhập';
        return false;
      }
      
      if (val.length < 3) {
        this.errors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        return false;
      }
      
      if (val.length > 30) {
        this.errors.username = 'Tên đăng nhập không được quá 30 ký tự';
        return false;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        this.errors.username = 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới';
        return false;
      }
      
      this.errors.username = '';
      return true;
    },

    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Vui lòng nhập mật khẩu';
        return false;
      }
      
      if (this.password.length < 3) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        return false;
      }
      
      if (this.password.length > 50) {
        this.errors.password = 'Mật khẩu không được quá 50 ký tự';
        return false;
      }
      
      this.errors.password = '';
      return true;
    },

    clearError(field) {
      this.errors[field] = '';
      this.generalError = '';
    },

    async handleLogin() {
      const isUsernameValid = this.validateUsername();
      const isPasswordValid = this.validatePassword();

      if (!isUsernameValid || !isPasswordValid) {
        return;
      }

      this.generalError = '';
      this.loading = true;

      try {
        const res = await auth.login({
          userName: this.username,
          password: this.password,
        });

        if (res.success === true) {
          if (this.rememberMe) {
            localStorage.setItem('rememberedUser', this.username);
          } else {
            localStorage.removeItem('rememberedUser');
          }

          this.$store.dispatch('login', { token: res.data?.accessToken });
          this.$toast.success('Đăng nhập thành công!');
          
          setTimeout(() => {
            this.$router.push('/');
          }, 300);
        } else {
          this.generalError = res.message || 'Tên đăng nhập hoặc mật khẩu không đúng';
        }
      } catch (err) {
        console.error(err);
        this.generalError = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại';
      } finally {
        this.loading = false;
      }
    },

    handleForgotPassword() {
      this.$router.push('/ForgotPassword');
    }
  }
};
</script>

<style lang="scss" scoped>
.login-page {
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
  background: #f5f7fa;
}

.login-card {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 40px 35px;
}

.login-header {
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

.login-form {
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

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -5px;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
  user-select: none;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    cursor: pointer;
    accent-color: #c17635;
  }

  &:hover {
    color: #1a1a1a;
  }
}

.forgot-link {
  font-size: 14px;
  color: #c17635;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    text-decoration: underline;
    color: #a05a1f;
  }
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

.register-link {
  text-align: center;
  font-size: 14px;
  color: #6b7280;
  margin-top: 5px;

  a {
    color: #c17635;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 25px;
  }

  .login-header h1 {
    font-size: 24px;
  }
}
</style>
