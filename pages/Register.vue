<template>
  <div class="register-page">
    <div class="wrap-login-form">
      <p class="title"><strong>Đăng ký tài khoản</strong></p>
      <div class="border-b"></div>
      <div class="form">
        <p><strong>Tên đăng nhập</strong></p>
        <input v-model="userName" type="text" placeholder="Nhập tên đăng nhập" />
        <p v-if="error.userName" class="error-message">
          <strong>{{ error.userName }}</strong>
        </p>

        <p><strong>Email</strong></p>
        <input v-model="email" type="email" placeholder="Nhập email" />
        <p v-if="error.email" class="error-message">
          <strong>{{ error.email }}</strong>
        </p>

        <p><strong>Tên đầy đủ</strong></p>
        <input v-model="name" type="text" placeholder="Nhập tên đầy đủ" />
        <p v-if="error.name" class="error-message">
          <strong>{{ error.name }}</strong>
        </p>

        <p><strong>Số điện thoại</strong></p>
        <input v-model="phoneNumber" type="number" placeholder="Nhập số điện thoại" />
        <p v-if="error.phoneNumber" class="error-message">
          <strong>{{ error.phoneNumber }}</strong>
        </p>

        <p><strong>Mật khẩu</strong></p>
        <input v-model="password" type="password" placeholder="Nhập mật khẩu" />
        <p v-if="error.password" class="error-message">
          <strong>{{ error.password }}</strong>
        </p>

        <p><strong>Nhập lại mật khẩu</strong></p>
        <input v-model="re_password" type="password" placeholder="Nhập lại mật khẩu" />
        <p v-if="error.re_password" class="error-message">
          <strong>{{ error.re_password }}</strong>
        </p>

        <p>
          <strong>
            Lưu ý nhập đúng số điện thoại. Khi quên, mất mật khẩu chúng tôi sẽ
            cung cấp lại mật khẩu cho bạn thông qua số điện thoại
          </strong>
        </p>
      </div>

      <div class="btn-login" @click="send_register_req">Đăng ký</div>
      <nuxt-link class="btn-create-new" :to="{ name: 'Login' }">Đăng nhập</nuxt-link>
    </div>
  </div>
</template>


<script>
import auth from "~/api/auth";

export default {
  data() {
    return {
      userName: null,
      email: null,
      name: null,
      phoneNumber: null,
      password: null,
      re_password: null,

      error: {
        userName: null,
        email: null,
        name: null,
        phoneNumber: null,
        password: null,
        re_password: null,
      },
    };
  },

  methods: {
    send_register_req() {
      this.remove_error();

      if (this.password !== this.re_password) {
        this.set_error("re_password", "Nhập lại mật khẩu không chính xác");
        return;
      }

      auth.register({
        userName: this.userName,
        email: this.email,
        name: this.name,
        phoneNumber: this.phoneNumber,
        password: this.password,
        role: 0,
        isActive: true
      })
      .then((res) => {
        this.remove_error();
        this.$router.push("/login");
      })
      .catch((errors) => {
        if (errors.response) {
          const e = errors.response.data[0];
          this.set_error(e.param, e.msg);
        }
      });
    },

    set_error(field, msg) {
      this.error[field] = msg;
    },

    remove_error() {
      Object.keys(this.error).forEach((field) => (this.error[field] = null));
    },
  },
};

</script>

<style lang="scss"></style>
