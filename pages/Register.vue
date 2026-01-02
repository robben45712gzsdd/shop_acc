<template>
  <div class="register-page">
    <div class="register-card">
      <div class="register-header">
        <h1>Đăng Ký Tài Khoản</h1>
        <p>Tạo tài khoản mới để trải nghiệm dịch vụ</p>
      </div>

      <form @submit.prevent="handleRegister" class="register-form">
        <!-- Username -->
        <div class="form-field" :class="{ error: errors.userName }">
          <label>Tên đăng nhập <span class="required">*</span></label>
          <input
            v-model="userName"
            type="text"
            placeholder="Nhập tên đăng nhập"
            @blur="validateUsername"
            @input="clearError('userName')"
            :disabled="loading"
          />
          <span v-if="errors.userName" class="error-msg">{{ errors.userName }}</span>
        </div>

        <!-- Email -->
        <div class="form-field" :class="{ error: errors.email }">
          <label>Email <span class="required">*</span></label>
          <input
            v-model="email"
            type="email"
            placeholder="Nhập email"
            @blur="validateEmail"
            @input="clearError('email')"
            :disabled="loading"
          />
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>

        <!-- Full Name -->
        <div class="form-field" :class="{ error: errors.name }">
          <label>Tên đầy đủ <span class="required">*</span></label>
          <input
            v-model="name"
            type="text"
            placeholder="Nhập họ và tên"
            @blur="validateName"
            @input="clearError('name')"
            :disabled="loading"
          />
          <span v-if="errors.name" class="error-msg">{{ errors.name }}</span>
        </div>

        <!-- Phone Number -->
        <div class="form-field" :class="{ error: errors.phoneNumber }">
          <label>Số điện thoại <span class="required">*</span></label>
          <input
            v-model="phoneNumber"
            type="tel"
            placeholder="Nhập số điện thoại"
            @blur="validatePhoneNumber"
            @input="clearError('phoneNumber')"
            :disabled="loading"
            maxlength="11"
          />
          <span v-if="errors.phoneNumber" class="error-msg">{{ errors.phoneNumber }}</span>
        </div>

        <!-- Password -->
        <div class="form-field" :class="{ error: errors.password }">
          <label>Mật khẩu <span class="required">*</span></label>
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

        <!-- Confirm Password -->
        <div class="form-field" :class="{ error: errors.re_password }">
          <label>Nhập lại mật khẩu <span class="required">*</span></label>
          <div class="password-field">
            <input
              v-model="re_password"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="Nhập lại mật khẩu"
              @blur="validateConfirmPassword"
              @input="clearError('re_password')"
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
          <span v-if="errors.re_password" class="error-msg">{{ errors.re_password }}</span>
        </div>

        <!-- Info Note -->
        <div class="info-note">
          <i class="fas fa-info-circle"></i>
          <span>Vui lòng nhập đúng số điện thoại để khôi phục mật khẩu khi cần thiết</span>
        </div>

        <!-- Policy Acceptance -->
        <div class="policy-acceptance">
          <label class="checkbox-label">
            <input type="checkbox" v-model="acceptedPolicy" />
            <span>
              Tôi đã đọc và đồng ý với 
              <a href="#" @click.prevent="showPolicyModal = true" class="policy-link">Điều khoản & Chính sách</a>
            </span>
          </label>
        </div>

        <!-- General Error -->
        <div v-if="generalError" class="alert-error">
          {{ generalError }}
        </div>

        <!-- Submit Button -->
        <button type="submit" class="btn-submit" :disabled="!isValid || !acceptedPolicy || loading">
          <span v-if="!loading">Đăng Ký</span>
          <span v-else><i class="fas fa-spinner fa-spin"></i> Đang xử lý...</span>
        </button>

        <!-- Login Link -->
        <div class="login-link">
          Đã có tài khoản? 
          <nuxt-link to="/Login">Đăng nhập ngay</nuxt-link>
        </div>
      </form>
    </div>

    <!-- Policy Modal -->
    <PolicyModal :show="showPolicyModal" @close="showPolicyModal = false" />
  </div>
</template>


<script>
import auth from "~/api/auth";

export default {
  components: {
    PolicyModal: () => import('@/components/Modals/PolicyModal'),
  },

  data() {
    return {
      userName: '',
      email: '',
      name: '',
      phoneNumber: '',
      password: '',
      re_password: '',
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
      acceptedPolicy: false,
      showPolicyModal: false,
      generalError: '',
      errors: {
        userName: '',
        email: '',
        name: '',
        phoneNumber: '',
        password: '',
        re_password: ''
      }
    };
  },

  computed: {
    isValid() {
      return (
        this.userName.trim().length >= 3 &&
        this.email.trim().length > 0 &&
        this.name.trim().length >= 2 &&
        this.phoneNumber.trim().length >= 10 &&
        this.password.length >= 6 &&
        this.re_password === this.password &&
        !Object.values(this.errors).some(err => err !== '')
      );
    }
  },

  mounted() {
    this.$store.commit('setIsDarkMode', true);
  },

  methods: {
    validateUsername() {
      const val = this.userName.trim();
      
      if (!val) {
        this.errors.userName = 'Vui lòng nhập tên đăng nhập';
        return false;
      }
      
      if (val.length < 3) {
        this.errors.userName = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        return false;
      }
      
      if (val.length > 30) {
        this.errors.userName = 'Tên đăng nhập không được quá 30 ký tự';
        return false;
      }
      
      if (!/^[a-zA-Z0-9_]+$/.test(val)) {
        this.errors.userName = 'Tên đăng nhập chỉ chứa chữ, số và dấu gạch dưới';
        return false;
      }
      
      this.errors.userName = '';
      return true;
    },

    validateEmail() {
      const val = this.email.trim();
      
      if (!val) {
        this.errors.email = 'Vui lòng nhập email';
        return false;
      }
      
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val)) {
        this.errors.email = 'Email không đúng định dạng';
        return false;
      }
      
      this.errors.email = '';
      return true;
    },

    validateName() {
      const val = this.name.trim();
      
      if (!val) {
        this.errors.name = 'Vui lòng nhập tên đầy đủ';
        return false;
      }
      
      if (val.length < 2) {
        this.errors.name = 'Tên phải có ít nhất 2 ký tự';
        return false;
      }
      
      if (val.length > 50) {
        this.errors.name = 'Tên không được quá 50 ký tự';
        return false;
      }
      
      this.errors.name = '';
      return true;
    },

    validatePhoneNumber() {
      const val = this.phoneNumber.trim();
      
      if (!val) {
        this.errors.phoneNumber = 'Vui lòng nhập số điện thoại';
        return false;
      }
      
      if (!/^[0-9]+$/.test(val)) {
        this.errors.phoneNumber = 'Số điện thoại chỉ chứa chữ số';
        return false;
      }
      
      if (val.length < 10) {
        this.errors.phoneNumber = 'Số điện thoại phải có ít nhất 10 số';
        return false;
      }
      
      if (val.length > 11) {
        this.errors.phoneNumber = 'Số điện thoại không được quá 11 số';
        return false;
      }
      
      if (!/^(0[3|5|7|8|9])/.test(val)) {
        this.errors.phoneNumber = 'Số điện thoại không hợp lệ';
        return false;
      }
      
      this.errors.phoneNumber = '';
      return true;
    },

    validatePassword() {
      if (!this.password) {
        this.errors.password = 'Vui lòng nhập mật khẩu';
        return false;
      }
      
      if (this.password.length < 6) {
        this.errors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        return false;
      }
      
      if (this.password.length > 50) {
        this.errors.password = 'Mật khẩu không được quá 50 ký tự';
        return false;
      }
      
      this.errors.password = '';
      
      if (this.re_password) {
        this.validateConfirmPassword();
      }
      
      return true;
    },

    validateConfirmPassword() {
      if (!this.re_password) {
        this.errors.re_password = 'Vui lòng nhập lại mật khẩu';
        return false;
      }
      
      if (this.re_password !== this.password) {
        this.errors.re_password = 'Mật khẩu nhập lại không khớp';
        return false;
      }
      
      this.errors.re_password = '';
      return true;
    },

    clearError(field) {
      this.errors[field] = '';
      this.generalError = '';
    },

    async handleRegister() {
      const isUsernameValid = this.validateUsername();
      const isEmailValid = this.validateEmail();
      const isNameValid = this.validateName();
      const isPhoneValid = this.validatePhoneNumber();
      const isPasswordValid = this.validatePassword();
      const isConfirmPasswordValid = this.validateConfirmPassword();

      if (!isUsernameValid || !isEmailValid || !isNameValid || 
          !isPhoneValid || !isPasswordValid || !isConfirmPasswordValid) {
        return;
      }

      this.generalError = '';
      this.loading = true;

      try {
        const res = await auth.register({
          userName: this.userName,
          email: this.email,
          name: this.name,
          phoneNumber: this.phoneNumber,
          password: this.password,
          role: 0,
          isActive: true
        });

        this.$toast.success('Đăng ký thành công! Đang chuyển trang...');
        
        setTimeout(() => {
          this.$router.push('/Login');
        }, 500);
      } catch (err) {
        console.error(err);
        
        if (err.response?.data) {
          const errorData = err.response.data;
          
          if (Array.isArray(errorData) && errorData[0]) {
            const e = errorData[0];
            this.errors[e.param] = e.msg;
          } else if (errorData.message) {
            this.generalError = errorData.message;
          } else {
            this.generalError = 'Đăng ký thất bại. Vui lòng thử lại';
          }
        } else {
          this.generalError = 'Đăng ký thất bại. Vui lòng kiểm tra kết nối';
        }
      } finally {
        this.loading = false;
      }
    }
  }
};

</script>

<style lang="scss" scoped>
.register-page {
  min-height: calc(100vh - 90px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 30px 15px;
  background: #f5f7fa;
}

.register-card {
  width: 100%;
  max-width: 500px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 40px 35px;
}

.register-header {
  text-align: center;
  margin-bottom: 30px;

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

.register-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 14px;
    font-weight: 600;
    color: #374151;

    .required {
      color: #ef4444;
      margin-left: 2px;
    }
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

.info-note {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  font-size: 13px;
  line-height: 1.5;
  color: #1e40af;

  i {
    font-size: 14px;
    margin-top: 1px;
    flex-shrink: 0;
  }
}
.policy-acceptance {
  padding: 14px;
  background: #f9fafb;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    gap: 10px;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      cursor: pointer;
      flex-shrink: 0;
      accent-color: #c17635;
    }

    span {
      flex: 1;
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
    }

    .policy-link {
      color: #c17635;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
  }
}
.policy-acceptance {
  padding: 14px;
  background: #f9fafb;
  border: 1.5px solid #d1d5db;
  border-radius: 8px;

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    cursor: pointer;
    gap: 10px;

    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      margin-top: 2px;
      cursor: pointer;
      flex-shrink: 0;
    }

    span {
      flex: 1;
      font-size: 13px;
      color: #374151;
      line-height: 1.5;
    }

    .policy-link {
      color: #c17635;
      text-decoration: none;
      font-weight: 600;

      &:hover {
        text-decoration: underline;
      }
    }
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

.login-link {
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

@media (max-width: 540px) {
  .register-card {
    padding: 30px 25px;
  }

  .register-header h1 {
    font-size: 24px;
  }
}
</style>
