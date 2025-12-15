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
                <span class="badge-discount">-{{ ((account.price - account.priceSale) / account.price) * 100 }}%</span>
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
          <div class="button-group">
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
      if (!this.accountID || !this.userProfile) return;
      
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
$primary: #ff6b35;
$primary-dark: #e55a2b;
$text-main: #1a1a1a;
$text-sub: #666;
$text-light: #999;
$border: #e5e5e5;
$bg: #ffffff;
$bg-light: #f9f9f9;
$success: #10b981;
$success-bg: #ecfdf5;
$danger: #ff4757;

.detail-account-page {
  min-height: 100vh;
  background: #f5f5f5;
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
      color: $primary-dark;
    }
  }

  span {
    color: $text-light;
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
    border: 3px solid rgba(255, 107, 53, 0.2);
    border-top-color: $primary;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: $text-sub;
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
    color: $text-sub;
    margin-bottom: 25px;
    font-size: 14px;
  }

  .retry-btn {
    padding: 10px 28px;
    background: $primary;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: $primary-dark;
      transform: translateY(-1px);
    }
  }
}

// CONTENT WRAPPER
.content-wrapper {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 30px;
  background: $bg;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
      padding: 6px 12px;
      background: white;
      border: 1.5px solid $success;
      color: $success;
      font-size: 11px;
      font-weight: 700;
      border-radius: 4px;
      z-index: 10;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      &.sold {
        border-color: $danger;
        color: $danger;
      }
    }

    .image-frame {
      position: relative;
      background: white;
      border: 1px solid $border;
      border-radius: 6px;
      overflow: hidden;
      aspect-ratio: 1;
      cursor: pointer;
      margin-bottom: 12px;
      transition: all 0.3s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        object-position: center;
        background-color: #1a1a1a;
        transition: transform 0.3s;
        border: 3px solid #FF8552;
      }

      &:hover {
        border-color: $primary;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);

        img {
          transform: scale(1.04);
        }
      }

      .zoom-button {
        position: absolute;
        bottom: 10px;
        right: 10px;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, $primary, #ff8c5a);
        color: white;
        border: none;
        border-radius: 4px;
        font-size: 16px;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);

        &:hover {
          transform: scale(1.05);
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
        border: 2px solid $border;
        border-radius: 4px;
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
          border-color: $primary;

          img {
            transform: scale(1.08);
          }
        }

        &.active {
          border-color: $primary;
          box-shadow: 0 2px 8px rgba(255, 107, 53, 0.2);
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
      font-size: 26px;
      font-weight: 800;
      color: $text-main;
      margin: 0 0 8px 0;
      line-height: 1.3;
    }

    .meta-info {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;

      .id-badge {
        padding: 4px 10px;
        background: #f0f0f0;
        color: $text-sub;
        border-radius: 4px;
        font-weight: 600;
      }

      .seller {
        color: $text-light;
        font-weight: 500;
      }
    }
  }

  .description {
    font-size: 13px;
    color: $text-sub;
    line-height: 1.6;
    margin: 0;
    padding: 10px;
    background: #fafafa;
    border-left: 2px solid $primary;
    border-radius: 4px;
  }

  // PRICE GRID
  .price-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;

    .price-item {
      padding: 12px;
      border: 1px solid $border;
      border-radius: 6px;
      background: white;
      transition: all 0.2s;

      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

      &:hover {
        border-color: $primary;
        box-shadow: 0 3px 12px rgba(255, 107, 53, 0.1);
        transform: translateY(-2px);
      }

      .price-label {
        font-size: 11px;
        color: $text-light;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .price-value {
        font-size: 18px;
        font-weight: 800;
        color: $primary;

        &.discount {
          color: $success;
        }
      }

      .price-row {
        display: flex;
        align-items: center;
        gap: 8px;

        .badge-discount {
          padding: 2px 6px;
          background: rgba(16, 185, 129, 0.2);
          color: $success;
          font-size: 10px;
          font-weight: 700;
          border-radius: 3px;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }
      }

      &.atm-price {
        background: $success_bg;
        border-color: $success;

        &:hover {
          border-color: $success;
          box-shadow: 0 3px 12px rgba(16, 185, 129, 0.1);
        }
      }
    }
  }

  // STATUS SECTION
  .status-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    padding: 12px;
    background: $bg-light;
    border-radius: 6px;
    border: 1px solid $border;

    .status-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .label {
        font-size: 11px;
        color: $text-light;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .value {
        font-size: 13px;
        font-weight: 700;
        color: $text-main;

        &.code {

          background: white;
          padding: 4px 8px;
          border-radius: 4px;
          color: $primary;
        }
      }
    }
  }

  // BENEFITS
  .benefits {
    padding: 12px;
    background: $success_bg;
    border: 1px solid rgba(16, 185, 129, 0.2);
    border-radius: 6px;

    display: flex;
    flex-direction: column;
    gap: 8px;

    .benefit {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 12px;
      color: #047857;

      i {
        color: $success;
        font-size: 14px;
        flex-shrink: 0;
      }
    }
  }

  // BUTTONS
  .button-group {
    display: flex;
    gap: 10px;

    .btn-primary {
      flex: 1;
      padding: 12px;
      background: linear-gradient(135deg, $primary, #ff8c5a);
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.2);

      &:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(255, 107, 53, 0.3);
      }

      &:disabled {
        background: #ccc;
        cursor: not-allowed;
        opacity: 0.6;
      }
    }

    .btn-secondary {
      width: 48px;
      padding: 0;
      background: white;
      color: $primary;
      border: 1.5px solid $border;
      border-radius: 6px;
      font-size: 16px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

      &:hover:not(:disabled) {
        border-color: $primary;
        background: #fff8f5;
        color: $primary-dark;
        box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
      }

      &.is-favorite {
        background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
        border-color: #ff6b6b;
        color: white;
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff5252, #e04855);
          box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
        }
      }

      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      i {
        transition: transform 0.2s;
      }

      &:hover:not(:disabled) i {
        transform: scale(1.1);
      }
    }
  }

  // SELLER INFO
  .seller-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: $bg-light;
    border: 1px solid $border;
    border-radius: 6px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);

    .seller-left {
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;

      .seller-avatar {
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 16px;
        flex-shrink: 0;
        box-shadow: 0 2px 8px rgba(255, 107, 53, 0.15);
      }

      .label {
        font-size: 11px;
        color: $text-light;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        font-weight: 600;
      }

      .name {
        font-size: 13px;
        color: $text-main;
        margin: 0;
        font-weight: 600;
      }
    }

    .btn-contact {
      cursor: pointer;
    }
  }
}

// BOTTOM SECTIONS
.bottom-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .section-card {
    background: $bg;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.2s;

    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .section-title {
      font-size: 16px;
      font-weight: 700;
      color: $text-main;
      margin: 0 0 16px 0;
      display: flex;
      align-items: center;
      gap: 10px;

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
        padding: 16px;
        background: $bg-light;
        border: 1px solid $border;
        border-radius: 6px;
        text-align: center;
        transition: all 0.2s;

        &:hover {
          border-color: $primary;
          background: #fffbf8;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 107, 53, 0.1);
        }

        .policy-icon {
          font-size: 32px;
          color: $primary;
          margin-bottom: 10px;
        }

        h4 {
          font-size: 13px;
          font-weight: 700;
          color: $text-main;
          margin: 0 0 6px 0;
        }

        p {
          font-size: 12px;
          color: $text-light;
          margin: 0;
          line-height: 1.5;
        }
      }
    }

    // INFO GRID
    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .info-row {
        display: grid;
        grid-template-columns: 140px 1fr;
        gap: 16px;
        padding: 10px 0;
        border-bottom: 1px solid #f0f0f0;

        &:last-child {
          border-bottom: none;
        }

        .info-label {
          font-size: 13px;
          font-weight: 600;
          color: $text-light;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-value {
          font-size: 13px;
          font-weight: 600;
          color: $text-main;

          &.price-discount {
            color: $success;
          }

          &.price-save {
            color: $primary;
          }

          .badge {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;

            &.success {
              background: rgba(16, 185, 129, 0.2);
              color: $success;
            }

            &.danger {
              background: rgba(255, 71, 87, 0.2);
              color: $danger;
            }
          }
        }
      }
    }

    // DESCRIPTION
    .full-description {
      p {
        font-size: 13px;
        color: $text-sub;
        line-height: 1.7;
        margin: 0 0 16px 0;
      }

      .description-extras {
        h4 {
          font-size: 13px;
          font-weight: 700;
          color: $text-main;
          margin: 0 0 10px 0;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 0;

          li {
            font-size: 12px;
            color: $text-sub;
            padding: 6px 0;
            line-height: 1.6;
          }
        }
      }
    }

    // FAQ
    .faq-list {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .faq-item {
        padding: 12px;
        background: $bg-light;
        border: 1px solid $border;
        border-radius: 6px;
        transition: all 0.2s;

        &:hover {
          border-color: $primary;
          background: #fffbf8;
        }

        h4 {
          font-size: 13px;
          font-weight: 700;
          color: $text-main;
          margin: 0 0 6px 0;
        }

        p {
          font-size: 12px;
          color: $text-sub;
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
  background: rgba(0, 0, 0, 0.9);
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
    top: -40px;
    right: 0;
    width: 40px;
    height: 40px;
    background: white;
    border: none;
    border-radius: 4px;
    color: #1a1a1a;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      transform: scale(1.1);
      background: #f0f0f0;
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
      border-radius: 6px;
      animation: zoomIn 0.3s ease-out;
    }

    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      width: 44px;
      height: 44px;
      background: rgba(255, 255, 255, 0.2);
      border: 1px solid white;
      border-radius: 4px;
      color: white;
      font-size: 18px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: white;
        color: #1a1a1a;
        transform: scale(1.08);
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
    padding: 6px 16px;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid white;
    border-radius: 4px;
    color: white;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 15px;
  }

  .lightbox-thumbs {
    display: flex;
    gap: 10px;
    justify-content: center;

    .lightbox-thumb {
      width: 70px;
      height: 70px;
      border-radius: 4px;
      overflow: hidden;
      border: 2px solid transparent;
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
      }

      &.active {
        border-color: white;
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
