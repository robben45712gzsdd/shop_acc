<template>
  <div class="list-game-account">
    <div class="title"><strong>danh mục acc game</strong></div>

    <div class="list-type-account">
      <nuxt-link v-for="category in listCategoryGameAccount" :key="category.categoryId"
        :to="`/AccountCategories/${category.categoryId}?categoryName=${category.name}`"
        :class="['type-account', category.totalAccount === 0 ? 'disabled' : '']">
        <div class="wrap-type-account">
          <img class="img-type-account" :src="category.banner" :alt="category.name" />

          <p class="name-type-acc">
            <strong>{{ category.name }}</strong>
          </p>

          <p class="num-acc">
            Số tài khoản: <strong>{{ category.totalAccount }}</strong>
          </p>

          <div class="btn-buy-now">
            <img src="@/assets/images/btn-buy-now.png" alt="" />
          </div>
        </div>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import account from '~/api/account';

export default {
  name: "ListGameAccount",
  data() {
    return {
      listCategoryGameAccount: []
    };
  },

  mounted() {
    this.getListCategoryGameAccount();
  },

  methods: {
    getListCategoryGameAccount() {
      account.getCategoryList()
        .then(res => {
          if (res.success) {
            let data = res.data.map(cat => ({
              ...cat,
            }));

            this.listCategoryGameAccount = data;
          }
        })
        .catch(err => console.error(err));
    }
  }
};
</script>


<style lang="scss">
$primary: #f28a59;
$surface: #ffffff;
$surface-soft: #f8fafc;
$border: #e9eef3;
$text: #0f172a;
$muted: #64748b;

.list-game-account {
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 32px auto 28px;
  padding-bottom: 18px;

  .title {
    padding: 10px 0 20px;
    color: $primary;
    text-align: center;
    font-size: 1.7rem;
    font-weight: 800;
    letter-spacing: 0.6px;
    text-transform: uppercase;
  }

  .list-type-account {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 12px;
    padding: 0 10px;
    overflow-x: hidden;

    .type-account {
      grid-column: span 3;
      display: flex;
      background: $surface;
      border: 1px solid $border;
      border-radius: 18px;
      overflow: hidden;
      box-shadow: 0 10px 24px rgba(15, 23, 42, 0.05);
      transition: all 0.18s ease;

      &:hover {
        transform: translateY(-3px);
        border-color: rgba(242, 138, 89, 0.16);
        box-shadow: 0 18px 32px rgba(15, 23, 42, 0.08);
      }

      &.disabled {
        opacity: 0.55;
        pointer-events: none;
      }

      .wrap-type-account {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding: 12px 12px 16px;

        .img-type-account {
          width: 100%;
          border-radius: 14px;
          background: $surface-soft;
        }

        .name-type-acc {
          margin: 12px 0 0;
          color: $text;
          text-transform: uppercase;
          text-align: center;
          font-size: 0.92rem;
          line-height: 1.35;
        }

        .num-acc {
          margin-top: 8px;
          color: $muted;
          font-size: 0.9rem;
          text-align: center;
        }

        .btn-buy-now {
          margin-top: 16px;
          max-width: 140px;
          padding: 0 5px;

          img {
            width: 100%;
            display: block;
          }
        }
      }
    }
  }
}

@media (max-width: 1000px) {
  .list-type-account .type-account {
    grid-column: span 6 !important;
  }
}

@media (max-width: 560px) {
  .list-game-account {
    margin: 24px auto 20px;

    .title {
      font-size: 1.45rem;
      padding-bottom: 14px;
    }
  }

  .list-game-account .list-type-account {
    gap: 10px;
    padding: 0 8px;

    .type-account {
      border-radius: 16px;

      .wrap-type-account {
        padding: 10px;

        .name-type-acc {
          font-size: 0.88rem;
        }

        .num-acc {
          font-size: 0.84rem;
        }
      }
    }
  }
}
</style>
