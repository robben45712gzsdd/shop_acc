<template>
  <div class="detail-account-page" :class="{ 'light-theme': lightTheme }">
    <!-- LOADING STATE -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>Đang tải thông tin tài khoản...</p>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">⚠️</div>
      <h3>Không thể tải thông tin</h3>
      <p>{{ error }}</p>
      <button @click="fetchAccount" class="retry-btn">Thử lại</button>
    </div>

    <!-- MAIN CONTENT -->
    <div v-else-if="account" class="page-content">
      <!-- BREADCRUMB -->
      <div class="breadcrumb">
        <nuxt-link to="/">
          <i class="fas fa-home"></i>
        </nuxt-link>
        <span>/</span>
        <span>{{ pathName }}</span>
      </div>

      <div class="!flex md:flex-row flex-col gap-6 content-wrapper">
        <!-- LEFT: GALLERY -->
        <div class="!flex-5 gallery-section">
          <div class="main-image-container">
            <div class="status-badge" :class="account.status === 0 ? 'available' : 'sold'">
              {{ account.status === 0 ? 'Còn hàng' : 'Đã bán' }}
            </div>

            <div class="image-frame">
              <img :src="selectedImage || (account.getListImages?.[0]?.imageUrl || '/placeholder.jpg')"
                :alt="account.title" @click="openLightbox(selectedImageIndex)" />
              <button class="zoom-button" @click="openLightbox(selectedImageIndex)">
                <i class="fas fa-search-plus"></i>
              </button>
            </div>

            <!-- THUMBNAILS -->
            <div class="thumbnail-container" v-if="account.getListImages?.length > 1">
              <div v-for="(img, index) in account.getListImages" :key="index" class="thumbnail-item"
                :class="{ active: selectedImageIndex === index }" @click="selectImage(index)">
                <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: INFO -->
        <div class="!flex-4 info-section">
          <div class="title-section">
            <h1 class="account-title">{{ account.title }}</h1>
            <div class="meta-info">
              <span class="id-badge">ID: {{ account?.accountCode }}</span>
              <span class="seller">{{ account.sellerId }}</span>
            </div>
          </div>

          <!-- PRICE CARDS -->
          <div class="price-grid">
            <div class="price-item atm-price">
              <span class="price-label">Giá niêm yết</span>
              <div class="price-row">
                <span class="font-normal !text-gray-400 !text-sm !line-through price-value">{{
                  formatPrice(account.price) }}</span>
                <span class="price-value discount">{{ formatPrice(account.priceSale) }}</span>
                <span class="!text-red-400 badge-discount">-{{ (((account.price - account.priceSale) / account.price) *
                  100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>

          <p class="description">{{ account.description }}</p>

          <div class="support-panel">
            <div class="support-panel-header">
              <i class="fas fa-gift"></i>
              <span>Ưu đãi nhận được</span>
            </div>
            <div class="support-grid">
              <div v-for="offer in offerHighlights" :key="offer.title" class="support-item">
                <i :class="offer.icon"></i>
                <div>
                  <h4>{{ offer.title }}</h4>
                  <p>{{ offer.text }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- ACCOUNT STATUS -->
          <div class="status-section">
            <div class="status-item">
              <span class="label">Tình Trạng</span>
              <span class="value status-pill" :class="account.status === 0 ? 'available' : 'sold'">
                {{ account.status === 0 ? 'Còn hàng' : 'Đã bán' }}
              </span>
            </div>
            <div class="status-item">
              <span class="label">Mã Tài Khoản</span>
              <span class="value code">{{ accountID }}</span>
            </div>
          </div>

          <!-- BENEFITS -->
          <div class="benefits">
            <div class="benefit">
              <i class="fas fa-check"></i>
              <span>Bảo hành 100% - Đổi acc nếu sai</span>
            </div>
            <div class="benefit">
              <i class="fas fa-check"></i>
              <span>Đổi mật khẩu miễn phí</span>
            </div>
            <div class="benefit">
              <i class="fas fa-check"></i>
              <span>Giao dịch tức thì, an toàn</span>
            </div>
          </div>

          <!-- ACTION BUTTONS -->
          <div class="button-group" v-if="isAuthenticated">
            <button class="btn-primary" :disabled="account.status !== 0 || loadingBuy" @click="buyNow">
              <i class="text-white fas fa-shopping-cart"></i>
              <span class="text-white" v-if="!loadingBuy">{{ account.status === 0 ? 'Mua Ngay' : 'Đã Bán' }}</span>
              <span v-else>Đang xử lý...</span>
            </button>
            <button class="!bg-transparent btn-secondary" :class="{ 'is-favorite': isFavorite }" :disabled="loadingFavorite"
              @click="toggleFavorite">
              <i class="fas fa-heart" :class="{ 'fa-solid !text-red-600': isFavorite, 'fa-regular': !isFavorite }"></i>
            </button>
          </div>

          <!-- SELLER INFO -->
          <div class="seller-info">
            <div class="seller-left">
              <div class="seller-avatar">
                <img src="@/assets/images/avt.png" alt=" Seller Avatar" class="rounded" width="40" height="40" />
              </div>
              <div>
                <p class="label">Người bán</p>
                <p class="name">Hoàng Thái Sơn</p>
              </div>
            </div>
            <a class="btn-contact" href="https://zalo.me/0336.856.626" target="_blank">
              <img src="@/assets/images/zalo.webp" alt="Zalo" width="32" height="32" />
            </a>
          </div>
        </div>
      </div>

      <!-- BOTTOM SECTIONS -->
      <div class="bottom-sections">


        <!-- DETAILED INFO -->
        <div class="section-card">
          <h2 class="section-title">
            <i class="fas fa-info-circle"></i>
            Thông Tin Chi Tiết
          </h2>
          <div class="info-grid">
            <div class="info-row">
              <span class="info-label">Loại tài khoản</span>
              <span class="info-value">{{ account.title }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Người bán</span>
              <span class="info-value">{{ account.sellerId }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Trạng thái</span>
              <span class="info-value">
                <span class="badge" :class="account.status === 0 ? 'success' : 'danger'">
                  {{ account.status === 0 ? 'Còn hàng' : 'Đã bán' }}
                </span>
              </span>
            </div>
            <div class="info-row">
              <span class="info-label">Giá gốc</span>
              <span class="line-through info-value">{{ formatPrice(account.price) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Giá khuyến mãi</span>
              <span class="info-value price-discount">{{ formatPrice(account.priceSale) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Tiết kiệm</span>
              <span class="info-value price-save">{{ formatPrice(account.price - account.priceSale) }}</span>
            </div>
          </div>
        </div>

        <!-- DESCRIPTION -->
        <div class="section-card">
          <h2 class="section-title">
            <i class="fa-align-left fas"></i>
            Mô Tả Chi Tiết
          </h2>
          <div class="full-description">
            <p>{{ account.description }}</p>

            <div class="description-gallery" v-if="displayImages.length">
              <h4>Danh sách ảnh</h4>
              <div class="description-gallery-grid">
                <button
                  v-for="(img, index) in displayImages"
                  :key="`desc-img-${index}`"
                  class="description-gallery-item"
                  type="button"
                  @click="selectImage(index)"
                >
                  <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
                </button>
              </div>
            </div>

            <div class="description-extras">
              <h4>Thông tin bổ sung</h4>
              <ul>
                <li>✓ Tài khoản đã được kiểm tra kỹ lưỡng</li>
                <li>✓ Không có lịch sử bị khóa hoặc cảnh báo</li>
                <li>✓ Có thể đổi mật khẩu ngay lập tức</li>
                <li>✓ Hỗ trợ đăng nhập lại sau khi mua</li>
                <li>✓ Cam kết 100% tiền hoàn nếu sai thông tin</li>
              </ul>
            </div>
          </div>
        </div>
        <!-- POLICIES -->
        <div class="section-card">
          <h2 class="section-title">
            <i class="fas fa-file-contract"></i>
            Chính Sách
          </h2>
          <div class="policies-grid">
            <div class="policy-item">
              <div class="policy-icon">
                <i class="fas fa-redo"></i>
              </div>
              <h4>Chính sách đổi trả</h4>
              <p>Đổi tài khoản trong 24h nếu có vấn đề</p>
            </div>

            <div class="policy-item">
              <div class="policy-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h4>Bảo mật 100%</h4>
              <p>Tài khoản được bảo vệ an toàn tuyệt đối</p>
            </div>

            <div class="policy-item">
              <div class="policy-icon">
                <i class="fas fa-lock-open"></i>
              </div>
              <h4>Đổi mật khẩu free</h4>
              <p>Hỗ trợ đổi MK miễn phí trọn đời</p>
            </div>

            <div class="policy-item">
              <div class="policy-icon">
                <i class="fas fa-headset"></i>
              </div>
              <h4>Hỗ trợ 24/7</h4>
              <p>Liên hệ hỗ trợ bất cứ lúc nào</p>
            </div>
          </div>
        </div>

        <!-- FAQs -->
        <div class="section-card">
          <h2 class="section-title">
            <i class="fas fa-question-circle"></i>
            Câu Hỏi Thường Gặp
          </h2>
          <div class="faq-list">
            <div class="faq-item">
              <h4>Làm sao để mua tài khoản?</h4>
              <p>Nhấn nút "Mua Ngay", chọn phương thức thanh toán và hoàn tất giao dịch. Tài khoản sẽ được gửi ngay lập
                tức.</p>
            </div>

            <div class="faq-item">
              <h4>Có thể đổi mật khẩu được không?</h4>
              <p>Có, bạn có thể đổi mật khẩu ngay sau khi mua. Chúng tôi hỗ trợ đổi MK hoàn toàn miễn phí.</p>
            </div>

            <div class="faq-item">
              <h4>Nếu sai thông tin thì sao?</h4>
              <p>Chúng tôi cam kết 100% hoàn tiền hoặc đổi tài khoản khác nếu thông tin không đúng với mô tả.</p>
            </div>

            <div class="faq-item">
              <h4>Hỗ trợ như thế nào?</h4>
              <p>Bạn có thể liên hệ qua chat, Zalo hoặc phone. Chúng tôi hỗ trợ 24/7, 7 ngày 1 tuần.</p>
            </div>
          </div>
        </div>

        <!-- RELATED PRODUCTS -->
        <div class="section-card related-products-card" v-if="relatedAccounts.length">
          <h2 class="section-title">
            <i class="fa-layer-group fas"></i>
            Sản Phẩm Cùng Loại
          </h2>

          <div class="related-loading" v-if="relatedLoading">
            <span>Đang tải sản phẩm liên quan...</span>
          </div>

          <div class="related-grid" v-else>
            <nuxt-link
              v-for="item in relatedAccounts"
              :key="item.accountId"
              :to="'/DetailAccountPage/' + item.accountId"
              class="related-card"
            >
              <div class="related-image">
                <img :src="item.image" :alt="item.title" />
                <span class="related-badge" v-if="calculateDiscount(item.price, item.priceSale) > 0">
                  -{{ calculateDiscount(item.price, item.priceSale) }}%
                </span>
              </div>
              <div class="related-body">
                <h4>{{ item.title }}</h4>
                <p>{{ item.description }}</p>
                <div class="related-price">{{ formatPrice(item.priceSale || item.price) }}</div>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
    </div>

    <!-- LIGHTBOX -->
    <transition name="lightbox-fade">
      <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
        <div class="lightbox-content" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">
            <i class="fas fa-times"></i>
          </button>

          <div class="lightbox-main">
            <button class="lightbox-prev" @click="prevImage" v-if="account.getListImages?.length > 1">
              <i class="fa-chevron-left fas"></i>
            </button>

            <img :src="account.getListImages[lightboxIndex]?.imageUrl" :alt="'Ảnh ' + (lightboxIndex + 1)" />

            <button class="lightbox-next" @click="nextImage" v-if="account.getListImages?.length > 1">
              <i class="fa-chevron-right fas"></i>
            </button>
          </div>

          <div class="lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ account.getListImages?.length }}
          </div>

          <div class="w-full overflow-x-auto lightbox-thumbs--container">
            <div class="lightbox-thumbs" v-if="account.getListImages?.length > 1">
              <div v-for="(img, index) in account.getListImages" :key="index" class="lightbox-thumb"
                :class="{ active: lightboxIndex === index }" @click="lightboxIndex = index">
                <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import account from '~/api/account';
import order from '~/api/order';
import favoriteApi from '~/api/favorite';

export default {
  data() {
    return {
      accountID: "",
      account: null,
      loading: false,
      loadingBuy: false,
      loadingFavorite: false,
      isFavorite: false,
      error: null,
      lightTheme: true,
      relatedAccounts: [],
      relatedLoading: false,
      selectedImageIndex: 0,
      selectedImage: null,
      showLightbox: false,
      lightboxIndex: 0,
      pathName: "",
      userProfile: null,
    };
  },
  computed: {
    displayImages() {
      return this.account?.getListImages || [];
    },
    offerHighlights() {
      return [
        {
          icon: 'fas fa-shield-alt',
          title: 'Bảo hành',
          text: 'Đổi tài khoản nếu sai thông tin hoặc lỗi mô tả.',
        },
        {
          icon: 'fas fa-lock-open',
          title: 'Đổi mật khẩu',
          text: 'Hỗ trợ đổi mật khẩu miễn phí sau khi mua.',
        },
        {
          icon: 'fas fa-headset',
          title: 'Hỗ trợ nhanh',
          text: 'Có người hỗ trợ khi cần xác minh hoặc bàn giao.',
        },
      ];
    },
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
  },
  methods: {
    formatPrice(price) {
      if (!price) return "0đ";
      return Number(price).toLocaleString("vi-VN") + "đ";
    },

    calculateDiscount(originalPrice, salePrice) {
      if (!originalPrice || !salePrice || originalPrice <= 0) return 0;
      const discount = ((originalPrice - salePrice) / originalPrice) * 100;
      return Math.round(discount);
    },

    async fetchAccount() {
      this.loading = true;
      this.error = null;
      try {
        const res = await account.getAccountDetail({
          accountID: this.accountID,
        });
        if (res.success) {
          this.account = res.data;
          this.account.getListImages = this.account.getListImages || [];
          
          // Add the single image from 'images' field to getListImages array
          if (this.account.images && !this.account.getListImages.some(img => img.imageUrl === this.account.images)) {
            this.account.getListImages.unshift({
              accountId: this.account.accountId,
              imageUrl: this.account.images
            });
          }
          
          if (this.account.getListImages?.length) {
            this.selectedImage = this.account.getListImages[0].imageUrl;
          }

          await this.getListAccountByCategory();
        } else {
          this.error = res.message || "Lỗi khi lấy thông tin tài khoản";
        }
      } catch (err) {
        console.error(err);
        this.error = "Không thể kết nối đến server";
      } finally {
        this.loading = false;
      }
    },

    async checkFavoriteStatus() {

      if (!this.accountID || !this.isAuthenticated) return;

      try {
        const res = await favoriteApi.checkIsFavorite({
          accountId: this.accountID,
        });
        if (res.success) {
          this.isFavorite = res.data?.isFavorite || false;
        }
      } catch (err) {
        console.error('Error checking favorite status:', err);
      }
    },

    resolveCategoryId() {
      return (
        this.account?.categoryId ||
        this.account?.categoryID ||
        this.account?.category ||
        this.$route.query.categoryId ||
        this.$route.query.categoryID ||
        ''
      );
    },

    async getListAccountByCategory() {
      const categoryId = this.resolveCategoryId();
      this.relatedLoading = true;
      try {
        const query = {
          sortType: 0,
          minPrice: 0,
          maxPrice: 1000000000,
          ascending: false,
          currentPage: 1,
          recordPerPage: 8,
        };

        if (categoryId) {
          query.categoryId = categoryId;
        }

        const res = await account.getAccountList(query);

        if (res?.success && Array.isArray(res.data)) {
          this.relatedAccounts = res.data
            .filter((item) => item.accountId !== this.accountID)
            .map((item) => ({
              ...item,
              image: item?.images || '/default-image.png',
            }))
            .slice(0, 8);
        } else {
          this.relatedAccounts = [];
        }
      } catch (err) {
        console.error('Error loading related accounts:', err);
        this.relatedAccounts = [];
      } finally {
        this.relatedLoading = false;
      }
    },

    async toggleFavorite() {
      if (!this.userProfile) {
        this.$toast.error('Vui lòng đăng nhập để thêm vào yêu thích');
        return;
      }

      if (this.loadingFavorite) return;

      this.loadingFavorite = true;
      try {
        if (this.isFavorite) {
          const res = await favoriteApi.removeFavorite({
            accountId: this.accountID,
          });
          if (res.success) {
            this.isFavorite = false;
            this.$toast.success('Đã xóa khỏi danh sách yêu thích');
          } else {
            this.$toast.error(res.message || 'Không thể xóa khỏi yêu thích');
          }
        } else {
          const res = await favoriteApi.addFavorite({
            accountId: this.accountID,
          });
          if (res.success) {
            this.isFavorite = true;
            this.$toast.success('Đã thêm vào danh sách yêu thích');
          } else {
            this.$toast.error(res.message || 'Không thể thêm vào yêu thích');
          }
        }
      } catch (err) {
        console.error('Error toggling favorite:', err);
        this.$toast.error('Có lỗi xảy ra khi cập nhật yêu thích');
      } finally {
        this.loadingFavorite = false;
      }
    },

    async buyNow() {
      if (!this.accountID) return;

      if (!this.userProfile) {
        this.$toast.error("Vui lòng đăng nhập để thực hiện giao dịch.");
        return;
      }
      if (!this.account.price > this.userProfile?.balance) {
        this.$toast.error("Số dư không đủ để thực hiện giao dịch.");
        return;
      };

      this.loadingBuy = true;
      this.error = null;
      try {
        const res = await order.createOrder({
          accountID: this.accountID,
        });
        if (res?.success) {
          const d = res.data;
          this.$toast.success(
            `🎉 Mua tài khoản thành công!\n\n` +
            `🧾 Mã đơn hàng: ${d.orderId}\n` +
            `Vui lòng kiểm tra lịch sử giao dịch để nhận thông tin tài khoản.`
          );
          setTimeout(() => {
            window.location.href = "/UserAccountPage?tab=accountPurchaseHistory";
          }, 3000);
        } else {
          this.$toast.error(res.message || "Đã có lỗi xảy ra khi tạo đơn hàng.");
        }
      }
      catch (err) {
        console.error(err);
        this.$toast.error("Đã có lỗi xảy ra khi tạo đơn hàng.");
      } finally {
        this.loadingBuy = false;
      }
    },

    selectImage(index) {
      this.selectedImageIndex = index;
      this.selectedImage = this.account.getListImages[index].imageUrl;
    },

    openLightbox(index) {
      this.lightboxIndex = index;
      this.showLightbox = true;
      document.body.style.overflow = 'hidden';
    },

    closeLightbox() {
      this.showLightbox = false;
      document.body.style.overflow = '';
    },

    prevImage() {
      this.lightboxIndex = this.lightboxIndex > 0
        ? this.lightboxIndex - 1
        : this.account.getListImages.length - 1;
    },

    nextImage() {
      this.lightboxIndex = this.lightboxIndex < this.account.getListImages.length - 1
        ? this.lightboxIndex + 1
        : 0;
    },
  },

  mounted() {
        this.$store.commit("setIsDarkMode", false);
    this.accountID = this.$route.params.accountID;
    this.pathName = this.$route.query.categoryName || 'Chi tiết tài khoản';
    this.userProfile = this.$store.state.user_data;
    this.fetchAccount();
    this.checkFavoriteStatus();

    window.addEventListener('keydown', (e) => {
      if (this.showLightbox) {
        if (e.key === 'Escape') this.closeLightbox();
        if (e.key === 'ArrowLeft') this.prevImage();
        if (e.key === 'ArrowRight') this.nextImage();
      }
    });
  },

  beforeDestroy() {
    document.body.style.overflow = '';
  },
};
</script>

<style scoped lang="scss">
// ============================================
// GAMING DARK THEME VARIABLES
// ============================================
$primary: #ff6b35;
$primary-dark: #e55f2f;
$secondary: #ff8a5c;
$accent: #ffb800;
$primary-soft: #fff4ee;
$favorite-soft: #FF6B35;
$dark: #f3f6fb;
$dark-card: #ffffff;
$dark-light: #f9fbfd;
$dark-border: #dde5ef;
$text-white: #162133;
$text-light: #344054;
$text-main: #162133;
$text-sub: #475467;
$text-gray: #667085;
$text-muted: #98a2b3;
$success: #2563eb;
$danger: #ff4655;

.detail-account-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #fbfcfe 0%, #f3f6fb 100%);
  padding: 20px;
}

.detail-account-page,
.detail-account-page * {
  box-shadow: none !important;
}

.detail-account-page.light-theme {
  background: linear-gradient(180deg, #fbfcfe 0%, #f3f6fb 100%);
}

.page-content {
  max-width: 1200px;
  margin: 0 auto;
}

// BREADCRUMB
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 20px 10px 10px;
  font-size: 12px;

  a {
    color: $primary;
    text-decoration: none;
    transition: color 0.2s;

    &:hover {
      color: $secondary;
    }
  }

  span {
    color: $text-gray;
  }
}

// LOADING
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;

  .spinner {
    width: 50px;
    height: 50px;
    border: 3px solid $dark-border;
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: $text-gray;
    font-size: 14px;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// ERROR
.error-container {
  text-align: center;
  padding: 80px 20px;
  background: $dark-card;
  border: 1px solid $dark-border;

  .error-icon {
    font-size: 64px;
    margin-bottom: 15px;
  }

  h3 {
    color: $danger;
    font-size: 22px;
    margin-bottom: 10px;
  }

  p {
    color: $text-gray;
    margin-bottom: 25px;
    font-size: 14px;
  }

  .retry-btn {
    padding: 12px 28px;
    background: $primary;
    color: $text-white;
    border: none;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: uppercase;
    letter-spacing: 1px;
    border-radius: 12px;

    &:hover {
      background: $primary-dark;
    }
  }
}

// CONTENT WRAPPER
.content-wrapper {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 30px;
  background: rgba(255, 255, 255, 0.94);
  border: 1px solid $dark-border;
  padding: 24px;
  margin-bottom: 24px;
  border-radius: 18px;
}

// GALLERY
.gallery-section {
  .main-image-container {
    position: relative;

    .status-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 8px 16px;
      background: rgba(255, 255, 255, 0.95);
      border: 1px solid rgba($success, 0.22);
      color: $success;
      font-size: 11px;
      font-weight: 700;
      z-index: 10;
      text-transform: uppercase;
      letter-spacing: 1px;

      &.sold {
        border-color: $danger;
        color: $danger;
      }
    }

    .image-frame {
      position: relative;
      background: #ffffff;
      border: 1px solid $dark-border;
      border-radius: 16px;
      overflow: hidden;
      aspect-ratio: 1;
      cursor: pointer;
      margin-bottom: 12px;
      transition: all 0.2s;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        background-color: #ffffff;
        transition: transform 0.3s;
        border: 1px solid rgba($primary, 0.18);
      }

      &:hover {
        border-color: $primary;

        img {
          transform: scale(1.02);
        }
      }

      .zoom-button {
        position: absolute;
        bottom: 12px;
        right: 12px;
        width: 44px;
        height: 44px;
        background: $primary-soft;
        color: $primary;
        border: none;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        border-radius: 14px;

        &:hover {
          background: rgba($primary, 0.12);
        }
      }

      &:hover .zoom-button {
        opacity: 1;
      }
    }

    .thumbnail-container {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;

      .thumbnail-item {
        aspect-ratio: 1;
        border: 2px solid $dark-border;
        overflow: hidden;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 12px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          transition: transform 0.2s;
        }

        &:hover {
          border-color: $text-gray;

          img {
            transform: scale(1.05);
          }
        }

        &.active {
          border-color: $primary;
        }
      }
    }
  }
}

// INFO SECTION
.info-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .title-section {
    .account-title {
      font-size: 28px;
      font-weight: 800;
      color: $text-white;
      margin: 0 0 10px 0;
      line-height: 1.3;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;

      .id-badge {
        padding: 6px 12px;
        background: $primary-soft;
        border: 1px solid rgba($primary, 0.16);
        color: $primary;
        font-weight: 700;
        border-radius: 999px;
      }

      .seller {
        color: $text-gray;
        font-weight: 500;
      }
    }
  }

  .description {
    font-size: 13px;
    color: $text-gray;
    line-height: 1.6;
    margin: 0;
    padding: 14px 16px;
    background: $primary-soft;
    border-left: 3px solid $primary;
    border-radius: 14px;
  }

  .support-panel {
    padding: 16px;
    background: #ffffff;
    border: 1px solid $dark-border;
    border-radius: 18px;

    .support-panel-header {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 12px;
      font-weight: 700;
      color: $text-white;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 12px;

      i {
        color: $primary;
      }
    }

    .support-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .support-item {
      display: flex;
      gap: 10px;
      align-items: flex-start;
      padding: 12px;
      background: #fcfdff;
      border: 1px solid $dark-border;
      border-radius: 14px;

      i {
        color: $primary;
        font-size: 18px;
        margin-top: 2px;
      }

      h4 {
        margin: 0 0 4px 0;
        color: $text-white;
        font-size: 13px;
      }

      p {
        margin: 0;
        color: $text-gray;
        font-size: 12px;
        line-height: 1.5;
      }
    }
  }

  // PRICE GRID
  .price-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;

    .price-item {
      padding: 16px;
      border: 1px solid $dark-border;
      background: #ffffff;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 8px;
      border-radius: 16px;

      &:hover {
        border-color: $primary;
      }

      .price-label {
        font-size: 11px;
        color: $text-gray;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .price-value {
        font-size: 20px;
        font-weight: 800;
        color: $primary;

        &.discount {
          color: $success;
        }
      }

      .price-row {
        display: flex;
        align-items: center;
        gap: 12px;

        .badge-discount {
          padding: 4px 8px;
          background: rgba($primary, 0.08);
          border: 1px solid rgba($primary, 0.16);
          color: $danger;
          font-size: 12px;
          font-weight: 700;
          border-radius: 999px;
        }
      }

      &.atm-price {
        background: #fff8f3;
        border-color: rgba($primary, 0.18);
        border-left: 3px solid $primary;

        &:hover {
          border-color: rgba($primary, 0.28);
        }
      }
    }
  }

  // STATUS SECTION
  .status-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 16px;
    background: #ffffff;
    border: 1px solid $dark-border;
    border-radius: 16px;

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 6px;

      .label {
        font-size: 11px;
        color: $text-gray;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 1px;
      }

      .value {
        font-size: 14px;
        font-weight: 700;
        color: $text-white;

        &.code {
          background: $primary-soft;
          padding: 6px 10px;
          color: $primary;
          border: 1px solid rgba($primary, 0.16);
        }
      }

      .status-pill {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        padding: 7px 12px;
        border-radius: 999px;
        font-size: 12px;
        letter-spacing: 0.5px;
        border: 1px solid transparent;
      }

      .status-pill.available {
        background: linear-gradient(135deg, #2563eb 0%, #38bdf8 100%);
        color: #ffffff;
        border-color: rgba(37, 99, 235, 0.2);
      }

      .status-pill.sold {
        background: linear-gradient(135deg, #ff6b35 0%, #ff8a5c 100%);
        color: #ffffff;
        border-color: rgba(255, 107, 53, 0.2);
      }
    }
  }

  // BENEFITS
  .benefits {
    padding: 16px;
    background: #ffffff;
    border: 1px solid rgba($primary, 0.14);
    border-left: 3px solid $primary;
    display: flex;
    flex-direction: column;
    gap: 10px;
    border-radius: 16px;

    .benefit {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: $text-light;

      i {
        font-size: 14px;
        flex-shrink: 0;
        color: $primary;
      }
    }
  }

  // BUTTONS
  .button-group {
    display: flex;
    gap: 12px;

    .btn-primary {
      flex: 1;
      padding: 14px;
      background: $primary;
      color: $text-white;
      border: none;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      text-transform: uppercase;
      letter-spacing: 1px;
      border-radius: 14px;

      &:hover:not(:disabled) {
        background: $primary-dark;
      }

      &:disabled {
        background: $dark-border;
        color: $text-gray;
        cursor: not-allowed;
      }

      i {
        color: #ffffff;
      }
    }

    .btn-secondary {
      width: 52px;
      padding: 0;
      background: $favorite-soft;
      color: $primary;
      border: 1px solid rgba($primary, 0.16);
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;

      i {
        color: $primary;
      }

      &:hover:not(:disabled) {
        border-color: rgba($primary, 0.3);
        background: rgba($primary, 0.12);
      }

      &.is-favorite {
        background: transparent;
        border-color: $primary;

        &:hover:not(:disabled) {
          background: $primary-dark;
        }

     
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }
  }

  // SELLER INFO
  .seller-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px;
    background: #ffffff;
    border: 1px solid $dark-border;
    border-radius: 16px;

    .seller-left {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;

      .seller-avatar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        border: 2px solid $primary;
        border-radius: 999px;
      }

      .label {
        font-size: 11px;
        color: $text-gray;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1px;
        font-weight: 700;
      }

      .name {
        font-size: 14px;
        color: $text-white;
        margin: 0;
        font-weight: 600;
      }
    }

    .btn-contact {
      cursor: pointer;
      transition: transform 0.2s;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
}

// BOTTOM SECTIONS
.bottom-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-card {
    background: rgba(255, 255, 255, 0.96);
    border: 1px solid $dark-border;
    padding: 24px;
    transition: all 0.2s;
    border-radius: 18px;

    &:hover {
      border-color: $text-muted;
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: $text-white;
      margin: 0 0 20px 0;
      display: flex;
      align-items: center;
      gap: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding-bottom: 12px;
      border-bottom: 1px solid $dark-border;

      i {
        color: $primary;
        font-size: 18px;
      }
    }

    // POLICIES
    .policies-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 4fr));
      gap: 16px;

      .policy-item {
        padding: 20px;
        background: #ffffff;
        border: 1px solid $dark-border;
        text-align: center;
        transition: all 0.2s;
        border-radius: 14px;

        &:hover {
          border-color: $primary;
        }

        .policy-icon {
          font-size: 32px;
          color: $primary;
          margin-bottom: 12px;
        }

        h4 {
          font-size: 14px;
          font-weight: 700;
          color: $text-white;
          margin: 0 0 8px 0;
        }

        p {
          font-size: 12px;
          color: $text-gray;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    // INFO GRID
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0;

      .info-row {
        display: grid;
        grid-template-columns: 160px 1fr;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1px solid $dark-border;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 12px;
          font-weight: 700;
          color: $text-gray;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .info-value {
          font-size: 14px;
          font-weight: 600;
          color: $text-white;

          &.price-discount {
            color: $success;
          }

          &.price-save {
            color: $primary;
          }

          .badge {
            display: inline-block;
            padding: 4px 12px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;

            &.success {
              background: rgba($primary, 0.08);
              border: 1px solid rgba($primary, 0.16);
              color: $primary;
            }

            &.danger {
              background: rgba($danger, 0.08);
              border: 1px solid rgba($danger, 0.16);
              color: $danger;
            }
          }
        }
      }
    }

    // DESCRIPTION
    .full-description {
      p {
        font-size: 14px;
        color: $text-gray;
        line-height: 1.7;
        margin: 0 0 20px 0;
      }

      .description-extras {
        padding: 16px;
        background: #ffffff;
        border-left: 3px solid $primary;
        border-radius: 14px;

        .description-gallery {
          margin-bottom: 16px;

          h4 {
            font-size: 13px;
            font-weight: 700;
            color: $text-white;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
          }

          .description-gallery-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
            gap: 8px;
          }

          .description-gallery-item {
            padding: 0;
            border: 1px solid $dark-border;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            cursor: pointer;

            img {
              width: 100%;
              aspect-ratio: 1;
              object-fit: cover;
              display: block;
            }
          }
        }

        h4 {
          font-size: 13px;
          font-weight: 700;
          color: $text-white;
          margin: 0 0 12px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            font-size: 13px;
            color: $text-light;
            padding: 8px 0;
            line-height: 1.6;
          }
        }
      }
    }

    // FAQ
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .faq-item {
        padding: 16px;
        background: #ffffff;
        border: 1px solid $dark-border;
        transition: all 0.2s;
        border-radius: 14px;

        &:hover {
          border-color: $primary;
        }

        h4 {
          font-size: 14px;
          font-weight: 700;
          color: $text-white;
          margin: 0 0 8px 0;
        }

        p {
          font-size: 13px;
          color: $text-gray;
          margin: 0;
          line-height: 1.6;
        }
      }
    }
  }
}

// LIGHTBOX
.lightbox-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  .lightbox-content {
    position: relative;
    width: 100%;
    max-width: 900px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lightbox-close {
    position: absolute;
    top: -50px;
    right: 0;
    width: 44px;
    height: 44px;
    background: $primary-soft;
    border: none;
    color: $primary;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 14px;

    &:hover {
      background: rgba($primary, 0.12);
    }
  }

  .lightbox-main {
    position: relative;
    width: 100%;
    height: 65vh;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border: 2px solid $dark-border;
      animation: zoomIn 0.3s ease-out;
    }

    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      width: 48px;
      height: 48px;
      background: #ffffff;
      border: 1px solid $dark-border;
      color: $primary;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;

      &:hover {
        background: $primary-soft;
        border-color: rgba($primary, 0.2);
      }
    }

    .lightbox-prev {
      left: 20px;
    }

    .lightbox-next {
      right: 20px;
    }
  }

  .lightbox-counter {
    padding: 8px 20px;
    background: #ffffff;
    border: 1px solid $dark-border;
    color: $text-light;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 15px;
    letter-spacing: 1px;
    border-radius: 999px;
  }

  .lightbox-thumbs--container {

    &::-webkit-scrollbar {
      height: 2px;
    }

    .lightbox-thumbs {
      display: flex;
      gap: 10px;
      justify-content: center;
      width: max-content;

      .lightbox-thumb {
        width: 70px;
        height: 70px;
        overflow: hidden;
        border: 2px solid $dark-border;
        cursor: pointer;
        opacity: 0.6;
        transition: all 0.2s;
          border-radius: 10px;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        &:hover {
          opacity: 1;
          border-color: $text-gray;
        }

        &.active {
          border-color: $primary;
          opacity: 1;
        }
      }
    }
  }
}

.related-products-card {
  .related-loading {
    color: $text-gray;
    font-size: 13px;
    padding: 4px 0 0;
  }

  .related-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 14px;
  }

  .related-card {
    display: flex;
    flex-direction: column;
    text-decoration: none;
    color: inherit;
    border: 1px solid $dark-border;
    background: #ffffff;
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.18s, border-color 0.18s;

    &:hover {
      transform: translateY(-2px);
      border-color: $primary;
    }
  }

  .related-image {
    position: relative;
    aspect-ratio: 1;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
  }

  .related-badge {
    position: absolute;
    top: 8px;
    right: 8px;
    padding: 4px 8px;
    border-radius: 999px;
    background: $primary;
    color: #fff;
    font-size: 11px;
    font-weight: 700;
  }

  .related-body {
    padding: 12px;

    h4 {
      margin: 0 0 6px 0;
      font-size: 13px;
      color: $text-white;
      line-height: 1.4;
    }

    p {
      margin: 0 0 10px 0;
      font-size: 12px;
      color: $text-gray;
      line-height: 1.5;
      line-clamp: 2;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .related-price {
      font-size: 15px;
      font-weight: 800;
      color: $primary;
    }
  }
}

@keyframes zoomIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

.lightbox-fade-enter-active,
.lightbox-fade-leave-active {
  transition: opacity 0.3s;
}

.lightbox-fade-enter,
.lightbox-fade-leave-to {
  opacity: 0;
}

// RESPONSIVE
@media (max-width: 1024px) {
  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .detail-account-page {
    padding: 12px;
  }

  .content-wrapper {
    padding: 12px;
    gap: 15px;
  }

  .info-section {
    .title-section .account-title {
      font-size: 20px;
    }

    .price-grid {
      grid-template-columns: 1fr;
    }

    .button-group .btn-secondary {
      width: 44px;
    }
  }

  .bottom-sections {
    .section-card {
      padding: 16px;

      .policies-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  .related-products-card .related-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .lightbox-overlay {
    .lightbox-main {
      .lightbox-prev {
        left: 10px;
      }

      .lightbox-next {
        right: 10px;
      }
    }
  }
}

@media (max-width: 480px) {
  .detail-account-page {
    padding: 8px;
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    padding: 10px;
    gap: 12px;
  }

  .gallery-section .main-image-container {
    .thumbnail-container {
      grid-template-columns: repeat(5, 1fr);
    }
  }

  .info-section {
    gap: 12px;

    .title-section .account-title {
      font-size: 18px;
    }

    .button-group .btn-primary {
      padding: 10px;
      font-size: 12px;
    }

    .seller-info {
      padding: 10px;
      gap: 10px;
      justify-content: space-between;

    }

      .support-panel .support-grid {
        grid-template-columns: 1fr;
      }
  }

  .bottom-sections {
    .section-card {
      padding: 12px;

      .info-grid .info-row {
        grid-template-columns: 1fr;
        gap: 4px;

        .info-label {
          font-size: 11px;
        }

        .info-value {
          font-size: 12px;
        }
      }
    }
  }

  .related-products-card .related-grid {
    grid-template-columns: 1fr;
  }

  .lightbox-overlay {
    .lightbox-close {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }

    .lightbox-main {
      height: 50vh;

      .lightbox-prev,
      .lightbox-next {
        width: 36px;
        height: 36px;
        font-size: 14px;

        &.lightbox-prev {
          left: 8px;
        }

        &.lightbox-next {
          right: 8px;
        }
      }
    }

    .lightbox-thumbs {
      .lightbox-thumb {
        width: 60px;
        height: 60px;
      }
    }
  }
}

.policies-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

/* Tablet */
@media (max-width: 992px) {
  .policies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Mobile */
@media (max-width: 576px) {
  .policies-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
