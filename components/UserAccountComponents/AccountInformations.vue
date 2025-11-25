<template>
  <div class="account-informations">
    <div class="title"><strong>Thông tin tài khoản</strong></div>
    <table>
      <tr>
        <td><p>ID tài khoản</p></td>
        <td>
          <p class="red-background">
            <span>{{ user.userId }}</span>
          </p>
        </td>
      </tr>

      <tr>
        <td><p>Tên hiển thị</p></td>
        <td>{{ user.name }}</td>
      </tr>

      <tr>
        <td><p>Tên tài khoản</p></td>
        <td>{{ user.userName }}</td>
      </tr>

      <tr>
        <td><p>Số điện thoại</p></td>
        <td>{{ user.phoneNumber }}</td>
      </tr>

      <tr>
        <td><p>Số dư</p></td>
        <td>
          <p class="red-background">
            <span>{{ user.balance?.toLocaleString() }} VNĐ</span>
          </p>
        </td>
      </tr>

      <tr>
        <td><p>Ngày tham gia</p></td>
        <td>{{ formattedDate }}</td>
      </tr>
    </table>
  </div>
</template>

<script>
export default {
  computed: {
    user() {
      return this.$store.state?.user_data  || {};
    },

    formattedDate() {
      if (!this.user.createdAt) return "";
      const d = new Date(this.user.createdAt);
      return d.toLocaleDateString("vi-VN");
    }
  }
};
</script>

<style lang="scss">
.account-informations {
  table {
    border-collapse: collapse;
    width: 100%;

    td {
      border-bottom: 1px solid #dddddd;
      text-align: left;
      font-size: 0.9rem;

      .red-background span {
        font-weight: 700;
        padding: 3px 10px;
        border-radius: 3px;
        background-color: var(--red-btn);
        color: #ffffff;
      }
    }

    td:nth-child(1) {
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}
</style>
