<template>
  <div class="change-password">
    <div class="title"><strong>đổi mật khẩu</strong></div>
    <div class="form">
      <input
        type="password"
        placeholder="Mật khẩu cũ"
        v-model="oldPassword"
      />
      <input
        type="password"
        placeholder="Mật khẩu mới"
        v-model="newPassword"
      />
      <button :disabled="isLoading" @click="handleChangePassword">
        <strong>{{ isLoading ? 'Đang xử lý...' : 'Đổi mật khẩu' }}</strong>
      </button>

      <div v-if="error" class="error-text">{{ error }}</div>
    </div>
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
      oldPassword: "",
      newPassword: "",
    };
  },
  mounted() {
    this.$store.commit("setIsDarkMode", false);
  },
  methods: {
    async handleChangePassword() {
      if (!this.oldPassword || !this.newPassword) {
        this.error = "Vui lòng điền đầy đủ thông tin";
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
          this.oldPassword = "";
          this.newPassword = "";
          this.$toast.success("Đổi mật khẩu thành công!");
        } else {
          this.error = res.message || "Đổi mật khẩu thất bại";
          this.$toast.error(this.error);
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Có lỗi xảy ra";
        this.$toast.error(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
};
</script>

<style lang="scss">
.change-password {
  .form {
    width: 100%;

    input {
      outline: none;
      border: 1px solid var(--grey-text);
      padding: 5px 10px;
      border-radius: 3px;
      font-weight: 700;
      font-size: 0.9rem;
      color: var(--grey-text);
    }

    button {
      background-color: var(--red-btn);
      border: none;
      outline: none;
      padding: 6px 10px;
      color: #ffffff;
      font-size: 0.9rem;
      border-radius: 2px;
      cursor: pointer;

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }

    input,
    button {
      margin: 10px 15px 10px 0px;
    }

    .error-text {
      color: #e63946;
      margin-top: 5px;
      font-size: 0.85rem;
    }
  }
}
</style>
