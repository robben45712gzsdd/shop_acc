<template>
  <div class="detail-account-page">
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

          <p class="description">{{ account.description }}</p>

          <!-- PRICE CARDS -->
          <div class="price-grid">
            <div class="price-item atm-price">
              <span class="price-label">Giá niêm yết</span>
              <div class="price-row">
                <span class="font-normal !text-gray-400 !text-sm !line-through price-value">{{
                  formatPrice(account.price) }}</span>
                <span class="price-value discount">{{ formatPrice(account.priceSale) }}</span>
                <span class="!text-red-400 badge-discount">-{{ (((account.price - account.priceSale) / account.price) * 100).toFixed(0) }}%</span>
              </div>
            </div>
          </div>

          <!-- ACCOUNT STATUS -->
          <div class="status-section">
            <div class="status-item">
              <span class="label">Tình Trạng</span>
              <span class="value">{{ account.status === 0 ? 'Còn hàng' : 'Đã bán' }}</span>
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
              <i class="fas fa-shopping-cart"></i>
              <span v-if="!loadingBuy">{{ account.status === 0 ? 'Mua Ngay' : 'Đã Bán' }}</span>
              <span v-else>Đang xử lý...</span>
            </button>
            <button class="btn-secondary" :class="{ 'is-favorite': isFavorite }" :disabled="loadingFavorite" @click="toggleFavorite">
              <i class="fas fa-heart" :class="{ 'fa-solid': isFavorite, 'fa-regular': !isFavorite }"></i>
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
            <a class="btn-contact" href="https://zalo.me/chat/join/0x0" target="_blank">
              <img src="@/assets/images/zalo.webp" alt="Zalo" width="32" height="32" />
            </a>
          </div>
        </div>
      </div>

      <!-- BOTTOM SECTIONS -->
      <div class="bottom-sections">
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

          <div class="lightbox-thumbs" v-if="account.getListImages?.length > 1">
            <div v-for="(img, index) in account.getListImages" :key="index" class="lightbox-thumb"
              :class="{ active: lightboxIndex === index }" @click="lightboxIndex = index">
              <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
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
      selectedImageIndex: 0,
      selectedImage: null,
      showLightbox: false,
      lightboxIndex: 0,
      pathName: "",
      userProfile: null,
    };
  },
  computed: {
    userProfile() {
      return this.userProfile;
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

    async fetchAccount() {
      this.loading = true;
      this.error = null;
      try {
        const res = await account.getAccountDetail({
          accountID: this.accountID,
        });
        if (res.success) {
          this.account = res.data;
          if (this.account.getListImages?.length) {
            this.selectedImage = this.account.getListImages[0].imageUrl;
          }
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
        if (res.success) {
          const d = res.data;
          this.$toast.success(
            `🎉 Mua tài khoản thành công!\n\n` +
            `🧾 Mã đơn hàng: ${d.orderId}\n` +
            `Vui lòng kiểm tra lịch sử giao dịch để nhận thông tin tài khoản.`
          );
          setTimeout(() => {
            window.location.href = "/UserAccountPage?tab=accountPurchaseHistory";
          }, 3000);
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
$primary: #ff4655;
$primary-dark: #d63845;
$secondary: #00d9ff;
$accent: #ffb800;
$dark: #0a0a0a;
$dark-card: #121212;
$dark-light: #1a1a1a;
$dark-border: #2a2a2a;
$text-white: #ffffff;
$text-light: #bbbbbb;
$text-main: #dddddd;
$text-sub: #bbbbbb;
$text-gray: #888888;
$text-muted: #666666;
$success: #00ff88;
$danger: #ff4655;

.detail-account-page {
  min-height: 100vh;
  background: $dark;
  padding: 20px;
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
  margin-bottom: 20px;
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
  background: $dark-card;
  border: 1px solid $dark-border;
  padding: 24px;
  margin-bottom: 24px;
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
      background: $dark;
      border: 2px solid $success;
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
      background: $dark-light;
      border: 1px solid $dark-border;
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
        background-color: $dark;
        transition: transform 0.3s;
        border: 3px solid $primary;
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
        background: $primary;
        color: $text-white;
        border: none;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;

        &:hover {
          background: $primary-dark;
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
        background: $dark-light;
        border: 1px solid $dark-border;
        color: $primary;
        font-weight: 700;
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
    padding: 12px 16px;
    background: $dark-light;
    border-left: 3px solid $primary;
  }

  // PRICE GRID
  .price-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12px;

    .price-item {
      padding: 16px;
      border: 1px solid $dark-border;
      background: $dark-light;
      transition: all 0.2s;
      display: flex;
      flex-direction: column;
      gap: 8px;

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
          background: rgba($danger, 0.2);
          border: 1px solid $danger;
          color: $danger;
          font-size: 12px;
          font-weight: 700;
        }
      }

      &.atm-price {
        background: rgba($success, 0.1);
        border-color: $success;
        border-left: 3px solid $success;

        &:hover {
          border-color: $success;
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
    background: $dark-light;
    border: 1px solid $dark-border;

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
          background: $dark;
          padding: 6px 10px;
          color: $secondary;
          border: 1px solid $dark-border;
        }
      }
    }
  }

  // BENEFITS
  .benefits {
    padding: 16px;
    background: rgba($success, 0.08);
    border: 1px solid rgba($success, 0.3);
    border-left: 3px solid $success;
    display: flex;
    flex-direction: column;
    gap: 10px;

    .benefit {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 13px;
      color: $success;

      i {
        font-size: 14px;
        flex-shrink: 0;
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

      &:hover:not(:disabled) {
        background: $primary-dark;
      }

      &:disabled {
        background: $dark-border;
        color: $text-gray;
        cursor: not-allowed;
      }
    }

    .btn-secondary {
      width: 52px;
      padding: 0;
      background: $dark-light;
      color: $text-white;
      border: 1px solid $dark-border;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover:not(:disabled) {
        border-color: $primary;
        color: $primary;
      }

      &.is-favorite {
        background: $primary;
        border-color: $primary;
        color: $text-white;
        
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
    background: $dark-light;
    border: 1px solid $dark-border;

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
    background: $dark-card;
    border: 1px solid $dark-border;
    padding: 24px;
    transition: all 0.2s;

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
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;

      .policy-item {
        padding: 20px;
        background: $dark-light;
        border: 1px solid $dark-border;
        text-align: center;
        transition: all 0.2s;

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
              background: rgba($success, 0.2);
              border: 1px solid $success;
              color: $success;
            }

            &.danger {
              background: rgba($danger, 0.2);
              border: 1px solid $danger;
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
        background: $dark-light;
        border-left: 3px solid $primary;

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
            color: $success;
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
        background: $dark-light;
        border: 1px solid $dark-border;
        transition: all 0.2s;

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
    background: $primary;
    border: none;
    color: $text-white;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: $primary-dark;
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
      background: $dark-card;
      border: 1px solid $dark-border;
      color: $text-white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: $primary;
        border-color: $primary;
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
    background: $dark-card;
    border: 1px solid $dark-border;
    color: $text-white;
    font-size: 12px;
    font-weight: 700;
    margin-bottom: 15px;
    letter-spacing: 1px;
  }

  .lightbox-thumbs {
    display: flex;
    gap: 10px;
    justify-content: center;

    .lightbox-thumb {
      width: 70px;
      height: 70px;
      overflow: hidden;
      border: 2px solid $dark-border;
      cursor: pointer;
      opacity: 0.6;
      transition: all 0.2s;

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
        grid-template-columns: 1fr;
      }
    }
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
      grid-template-columns: repeat(3, 1fr);
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
      flex-direction: column;
      gap: 10px;
      align-items: stretch;

      .btn-contact {
        width: 100%;
        justify-content: center;
      }
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
</style>
<!-- <template>
    <div class="detail-account-page">
      <div class="wrarp-detail-account">
        <div class="title">
          <strong>tài khoản #{{ accountID }}</strong>
        </div>
        <div class="sub-title"><b>danh mục: acc liên minh tự chọn</b></div>
        <div class="action-block">
          <div class="price">
            <div class="pay-card-price">
              <strong>490.000 đ</strong>
              <span>CARD</span>
            </div>
            -
            <div class="pay-atm-price">
              <span>ATM</span>
              <strong>392.000 đ</strong>
            </div>
          </div>
          <div class="btn-buy-now"><b>mua ngay</b></div>
        </div>
        <div class="nav-view-detail">
          <div
            @click="viewAcccountInfor('overview')"
            :class="{ active: overview }"
          >
            <p><b>tài khoản</b></p>
          </div>
          <div
            @click="viewAcccountInfor('viewChamps')"
            :class="{ active: viewChamps }"
          >
            <p><b>tướng [103]</b></p>
          </div>
          <div
            @click="viewAcccountInfor('viewSkins')"
            :class="{ active: viewSkins }"
          >
            <p><b>trang phục [61]</b></p>
          </div>
          <div
            @click="viewAcccountInfor('viewOtherInfor')"
            :class="{ active: viewOtherInfor }"
          >
            <p><b>thông tin khác</b></p>
          </div>
        </div>
        <div class="detail-content">
          <div v-show="overview" class="overview">
            <div class="recharge-atm-momo">
              <p>
                <strong
                  >nạp atm/momo tự động 24/24 -
                  <nuxt-link to="/">xem tại đây</nuxt-link></strong
                >
              </p>
            </div>
            <img
              src="@/assets/images/account-img/image-bd424bd0-2b8b-46b2-a3f3-556175c0ba8a.jpeg"
              alt=""
            />
          </div>
          <div v-show="viewChamps" class="view-champs">
            <div class="wrap-champ">
              <img src="@/assets/images/champs/aatrox.jpg" alt="" />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img src="@/assets/images/champs/Aphelios_0.jpg" alt="" />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_alistar.jpg"
                alt=""
              />
              <div class="champ-name">nhaatroxaatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_amumu.jpg"
                alt=""
              />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_anivia.jpg"
                alt=""
              />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_ahri.jpg"
                alt=""
              />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_annie.jpg"
                alt=""
              />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="wrap-champ">
              <img
                src="@/assets/images/champs/RiotX_ChampionList_aurelionsol.jpg"
                alt=""
              />
              <div class="champ-name">aatrox</div>
            </div>
            <div class="btn-view-more"><p>xem thêm</p></div>
          </div>
          <div v-show="viewOtherInfor" class="view-other-infor">
            <img src="@/assets/images/account-img/profile1.jpeg" alt="" />
            <img src="@/assets/images/account-img/profile2.jpeg" alt="" />
            <img src="@/assets/images/account-img/profile3.jpeg" alt="" />
            <img src="@/assets/images/account-img/profile4.jpeg" alt="" />
            <img src="@/assets/images/account-img/profile5.jpeg" alt="" />
          </div>
        </div>
      </div>
    </div>
  </template>

  <script>
  export default {
    data() {
      return {
        accountID: "",
        overview: false,
        viewChamps: true,
        viewSkins: false,
        viewOtherInfor: false,
      };
    },

    methods: {
      viewAcccountInfor(typeInfor) {
        this.overview =
          this.viewChamps =
          this.viewSkins =
          this.viewOtherInfor =
            false;
        this[typeInfor] = true;
      },
    },

    mounted() {

      this.accountID = this.$route.params.accountID;
    },
  };
  </script>

  <style lang="scss">
  .detail-account-page {
    width: 100%;
    min-height: calc(100% - 74px);
    height: auto;
    background-color: white;
    margin: 74px auto;
    padding-top: 1px;

    .wrarp-detail-account {
      padding: 0px 8px 30px 8px;
      margin: 30px auto 0px auto;
      max-width: var(--max-width);
      display: flex;
      flex-direction: column;

      .title {
        text-transform: uppercase;
        font-size: 1.5rem;
        text-align: left;
        padding: 15px 0px 5px 0px;
        color: var(--black-one);
      }

      .sub-title {
        text-transform: uppercase;
        color: var(--red-text);
        font-size: 0.9rem;
      }

      .action-block {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: var(--black-one);
        border-radius: 5px;
        margin-top: 25px;

        .price {
          display: flex;

          .pay-card-price,
          .pay-atm-price {
            padding: 20px 10px 10px 10px;
            font-size: 1.2rem;
            color: var(--yellow-active);
            position: relative;

            span {
              position: absolute;
              top: 5px;
              left: 10px;
              font-size: 0.8rem;
            }
          }
        }
        .btn-buy-now {
          background-color: var(--red-btn);
          padding: 10px 15px;
          margin-right: 10px;
          font-size: 1.2rem;
          text-transform: uppercase;
          color: #ffffff;
          border-radius: 5px;
          cursor: pointer;
        }
      }

      .nav-view-detail {
        margin-top: 20px;
        display: flex;
        text-transform: uppercase;
        flex-wrap: wrap;

        .active {
          background-color: var(--red-text);
          color: white;
        }

        > div {
          padding: 0px 30px;
          cursor: pointer;
        }
      }

      .detail-content {
        margin-top: 30px;
        .overview,
        .view-other-infor {
          .recharge-atm-momo {
            text-transform: uppercase;
            font-size: 1.4rem;
            text-align: center;

            a {
              color: var(--red-text);
            }
          }
          padding-bottom: 40px;
          img {
            width: 100%;
            margin-bottom: 10px;
          }
        }

        .view-champs {
          display: grid;
          grid-template-columns: repeat(12, 1fr);
          grid-gap: 10px;
          position: relative;
          padding-bottom: 90px;

          .wrap-champ {
            grid-column: span 2;
            width: 100%;
            overflow: hidden;
            position: relative;

            .champ-name {
              text-transform: uppercase;
              position: absolute;
              bottom: 0;
              left: 0;
              width: 100%;
              color: #ffffff;
              font-style: italic;
              background-color: var(--black-one);
              font-weight: 700;
              text-align: center;
              padding: 10px 0px;
              font-size: 1.2rem;
              transition: 0.4s;
            }

            img {
              transform: scale3d(1.05, 1.05, 1);
              object-fit: cover;
              width: 100%;
              height: 100%;
              transition: 0.4s;
            }
          }

          .btn-view-more {
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            text-align: center;

            p {
              text-transform: uppercase;
              font-size: 1rem;
              padding: 5px 10px;
              border-radius: 5px;
              border: 1px solid var(--black-one);
              display: inline-block;
              cursor: pointer;
              font-weight: 700;
              color: var(--grey-btn);
            }
          }

          .wrap-champ:after {
            content: "";
            position: absolute;
            top: 0px;
            right: 0px;
            width: 11%;
            padding-top: 11%;
            background-color: rgb(255, 255, 255);
            transition: transform 0.5s ease 0s;
            transform: translate(50%, -50%) rotate(45deg);
            transition: 0.4s;
          }

          .wrap-champ:hover {
            img {
              transform: scale3d(1, 1, 1);
            }
          }

          .wrap-champ:hover:after {
            transform: translate(100%, -100%) rotate(45deg) !important;
          }
        }
      }
    }
  }

  @media (max-width: 1000px) {
    .wrarp-detail-account {
      .detail-content {
        .view-champs {
          .wrap-champ {
            grid-column: span 3 !important;
          }
          .champ-name {
            font-size: 1rem !important;
          }
        }
      }
    }
  }
  @media (max-width: 480px) {
    .wrarp-detail-account {
      .action-block {
        .btn-buy-now,
        .price .pay-card-price,
        .pay-atm-price {
          font-size: 1rem !important;
        }
      }

      .nav-view-detail {
        flex-direction: column;
        > div {
          padding: 0px 20px !important;
        }
      }

      .detail-content {
        margin-top: 15px !important;
        .recharge-atm-momo {
          font-size: 1.1rem !important;
        }

        .view-champs {
          .wrap-champ {
            grid-column: span 4 !important;

            .champ-name {
              font-size: 0.8rem !important;
            }
          }

          .wrap-champ:after {
            display: none;
          }
        }
      }
    }
  }
  </style> -->
