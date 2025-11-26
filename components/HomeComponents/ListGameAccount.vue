<template>
  <div class="list-game-account">
    <div class="title"><strong>danh mục acc game</strong></div>

    <div class="list-type-account">
      <nuxt-link
        v-for="category in listCategoryGameAccount"
        :key="category.categoryId"
        :to="`/AccountCategories/${category.categoryId}?categoryName=${category.name}`"
        :class="['type-account', category.disabled ? 'disabled' : '']"
      >
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
              disabled: cat.blug !== "free-fire" // chỉ free-fire active
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
.list-game-account {
  padding-bottom: 20px;
  margin: 60px auto 30px auto;
  width: 100%;
  background-color: var(--black-three);
  display: flex;
  flex-direction: column;

  .title {
    text-transform: uppercase;
    font-size: 1.9rem;
    text-align: center;
    padding: 30px 0;
    color: var(--yellow-active);
  }

  .list-type-account {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    grid-gap: 10px;
    padding: 0 10px;

    .type-account {
      grid-column: span 3;
      display: flex;
      border: 2px solid var(--yellow-text);
      padding-bottom: 20px;

      &.disabled {
        opacity: 0.5;
        pointer-events: none;
      }

      .wrap-type-account {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;

        .name-type-acc {
          color: var(--yellow-active);
          text-transform: uppercase;
          margin: 16px 0 0 0;
        }

        .num-acc {
          margin-top: 10px;
          color: #fff;
        }

        .img-type-account {
          width: 100%;
        }

        .btn-buy-now {
          margin-top: 20px;
          max-width: 135px;
          padding: 0 5px;

          img {
            width: 100%;
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

@media (max-width: 480px) {
  .list-game-account {
    margin: 30px auto;
  }
}
</style>
