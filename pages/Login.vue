<template>
  <div class="login-page">
    <div @keyup.enter="user_login" class="wrap-login-form">
      <p class="title"><strong>Đăng nhập tài khoản</strong></p>
      <div class="border-b"></div>
      <div class="form">
        <p><strong>Tên tài khoản</strong></p>
        <input v-model="name_account" type="text" placeholder="Nhập tên tài khoản" />
        <p><strong>Mật khẩu</strong></p>
        <input v-model="password" type="password" placeholder="Nhập mật khẩu" />
        <p v-if="error" class="error-message">
          <strong>{{ error }}</strong>
        </p>
      </div>
      <div @click="user_login" class="btn-login">Đăng nhập</div>
      <div class="hr"></div>
      <div class="btn-login-facebook">
        <i class="fa fa-facebook-official" aria-hidden="true"></i> Đăng nhập qua Facebook
      </div>
      <nuxt-link class="btn-create-new" :to="{ name: 'Register' }">
        <i class="fa fa-user-plus" aria-hidden="true"></i> Tạo tài khoản
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import auth from '~/api/auth';
export default {
  data() {
    return {
      name_account: '',
      password: '',
      error: null,
    };
  },

  mounted() {    
    this.$store.commit('setIsDarkMode', true);
    if (this.$store.state.user_data?.username) {
      this.$router.push('/');
    }
  },

  methods: {
    async user_login() {
      this.error = null;

      if (!this.name_account || !this.password) {
        this.error = 'Tài khoản hoặc mật khẩu không hợp lệ!';
        return;
      }

      try {
        const res = await auth.login({
          userName: this.name_account,
          password: this.password,
        });
        if (res.success === true) {                    
          this.$store.dispatch('login', { token: res.data?.accessToken });
          this.$router.push('/');
        } else {
          this.error = res.message || 'Đăng nhập thất bại!';
        }
      } catch (err) {
        console.error(err);
        this.error = err.response?.data?.message || 'Đăng nhập thất bại!';
      }
    },
  },
};
</script>
<style lang="scss">
.hr {
  width: 100%;
  height: 0.1px;
  background-color: rgba(51, 51, 51, 0.692);
}

.login-page,
.register-page {
  width: 100%;
  height: calc(100vh - 70px);
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;

  .wrap-login-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border: 1px solid var(--black-one);
    padding: 20px;
    margin: 10px;
    border-radius: 10px;
    max-width: 380px;

    .border-b {
      width: 150px;
      height: 1px;
      background-color: var(--black-three);
    }

    .title {
      font-size: 1.6rem;
      text-transform: uppercase;
      margin: 5px 60px;
    }

    .form {
      width: 100%;

      input {
        width: 100%;
        padding: 10px;
        border-radius: 5px;
        outline: none;
        border: 1px solid var(--black-one);
        background-color: white !important;
      }

      p {
        font-size: 0.9rem;
        margin-bottom: 5px;
      }
    }

    .btn-login,
    .btn-login-facebook,
    .btn-create-new {
      width: 100%;
      padding: 10px 0;
      text-align: center;
      border-radius: 5px;
      cursor: pointer;
      color: white;
      font-size: 1.2rem;
    }

    .btn-login {
      background-color: var(--red-btn);
      margin: 10px 0px 10px 0px;
    }

    .btn-login-facebook {
      background-color: #3b5998;
      margin: 10px 0px;
    }

    .btn-create-new {
      border: 1px solid var(--black-one);
      color: var(--black-two);
    }

    .btn-login-facebook,
    .btn-create-new {
      position: relative;

      i {
        position: absolute;
        top: 50%;
        left: 16px;
        transform: translateY(-50%);
      }
    }

    .error-message {
      color: red;
      font-size: 0.8rem !important;
      text-align: center;
    }
  }
}
</style>
