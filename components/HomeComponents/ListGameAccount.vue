<template>
  <div class="list-game-account">
    <!-- <div class="!text-white title"><strong>danh mục acc game</strong></div>

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
    <div class="mt-10 mb-2 !text-white title"><strong>Free Fire</strong></div>
    <div class="bg-white w-full h-[2px]"></div> -->

    <div class="gap-4 grid grid-cols-1 md:grid-cols-2 mt-4 w-full">
      <nuxt-link
      :to="{
         path: '/AccountCategories/8f3b6f1a-2d4c-4f7e-9a11-5c7d2b9e8a30',
         query: {
          imageUrlThumb: item.imageUrlThumb,
          banner: item.banner,
          title: item.name,
          minPrice: item.minPrice,
          maxPrice: item.maxPrice,
         }
      }"
      class="bg-white border border-[5px] border-white rounded-lg overflow-hidden" v-for="(item, index) in listCateFreeFire" :key="index">
        <!-- Banner -->
        <div class="relative">
          <img :src="(item.banner)" :alt="item.name" class="w-full h-auto object-cover" />
          <img :src="(item.imageUrlThumb)" :alt="item.name" class="right-0 bottom-0 absolute w-[40%] h-auto object-cover" />
        </div>

        <!-- Content -->
        <div class="flex justify-between items-center bg-white py-4 px-3">
          <!-- Left -->
          <div>
            <h2 class="font-bold text-red-800 text-2xl">
             {{ item.name }}
            </h2>

            <div class="inline-block bg-red-500 mt-3 px-5 py-1 rounded font-bold text-white text-xl">
              Siêu giảm giá 50%
            </div>
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
      listCategoryGameAccount: [],
      listCateFreeFire: [
        {
          name: 'Acc Free Fire dưới 1M',
          imageUrlThumb: require('@/assets/images/banner/duoi1m.png'),
          banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
          totalAccount: 120,
          minPrice: 10000,
          maxPrice: 1000000,
        },
        {
          name: 'Acc Free Fire 1M - 2M',
          imageUrlThumb: require('@/assets/images/banner/1m2m.png'),
          banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
          totalAccount: 80,
          minPrice: 1000000,
          maxPrice: 2000000,
        },
        {
          name: 'Acc Free Fire 2M - 5M',
          imageUrlThumb: require('@/assets/images/banner/2m5m.png'),
          banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
          totalAccount: 50,
          minPrice: 2000000,
          maxPrice: 5000000,
        },
        {
          name: 'Acc Free Fire 5M - 10M',
          imageUrlThumb: require('@/assets/images/banner/5m10m.png'),
          banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
          totalAccount: 30,
          minPrice: 5000000,
          maxPrice: 10000000,
        },
        {
          name: 'Acc Free Fire 10M - 20M',
          imageUrlThumb: require('@/assets/images/banner/10m20m.png'),
          banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
          totalAccount: 20,
          minPrice: 10000000,
          maxPrice: 20000000,
        },
        {
            name: 'Acc Free Fire Siêu Phẩm',
            imageUrlThumb: require('@/assets/images/banner/sieupham.png'),
            banner: require('@/assets/images/banner/sieu-pham-tet.gif'),
            totalAccount: 10,
            minPrice: 20000000,
            maxPrice: 1000000000,
          },
      ],
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
              banner: process.env.NUXT_ENV_BASE_URL + cat?.banner || '/default-banner.png',
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
    overflow-x: hidden;

    .type-account {
      grid-column: span 3;
      display: flex;
      background: $surface;
      border: 1px solid $border;
      border-radius: 8px;
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
          border-radius: 7px;
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
    padding: 0;

    .type-account {
      border-radius: 8px;

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
