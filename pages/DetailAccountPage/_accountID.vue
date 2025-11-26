<template>
  <div class="detail-account-page">
    <div class="container">
      <div class="account-detail-wrapper">
        <!-- BREADCRUMB -->
        <div class="breadcrumb">
          <nuxt-link to="/">Trang chủ</nuxt-link>
          <span class="separator">/</span>
          <span class="current">Chi tiết tài khoản</span>
        </div>

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
        <div v-else-if="account" class="account-content">
          <!-- LEFT: IMAGE GALLERY -->
          <div class="gallery-section">
            <!-- MAIN IMAGE -->
            <div class="main-image">
              <div class="image-badge">
                <span v-if="account.status === 0" class="badge-available">Còn hàng</span>
                <span v-else class="badge-sold">Đã bán</span>
              </div>
              <img 
                :src="selectedImage || (account.getListImages?.[0]?.imageUrl || '/placeholder.jpg')" 
                :alt="account.title"
                @click="openLightbox(selectedImageIndex)"
              />
              <button class="zoom-btn" @click="openLightbox(selectedImageIndex)">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                  <line x1="11" y1="8" x2="11" y2="14"></line>
                  <line x1="8" y1="11" x2="14" y2="11"></line>
                </svg>
                Phóng to
              </button>
            </div>

            <!-- THUMBNAIL GRID -->
            <div class="thumbnail-grid" v-if="account.getListImages?.length > 1">
              <div 
                v-for="(img, index) in account.getListImages" 
                :key="index"
                class="thumbnail"
                :class="{ active: selectedImageIndex === index }"
                @click="selectImage(index)"
              >
                <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
              </div>
            </div>
          </div>

          <!-- RIGHT: ACCOUNT INFO -->
          <div class="info-section">
            <!-- TITLE & DESCRIPTION -->
            <div class="header-info">
              <h1 class="account-title">{{ account.title }}</h1>
              <div class="account-id">ID: #{{ accountID }}</div>
            </div>

            <p class="account-description">{{ account.description }}</p>

            <!-- PRICE BOX -->
            <div class="price-box">
              <div class="price-row card-price">
                <div class="price-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                    <line x1="1" y1="10" x2="23" y2="10"></line>
                  </svg>
                  Giá thẻ cào
                </div>
                <div class="price-value">{{ formatPrice(account.price) }}</div>
              </div>
              <div class="price-row atm-price">
                <div class="price-label">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="2" y="5" width="20" height="14" rx="2"></rect>
                    <line x1="2" y1="10" x2="22" y2="10"></line>
                  </svg>
                  Giá ATM/Momo
                </div>
                <div class="price-value discount">
                  {{ formatPrice(account.price * 0.8) }}
                  <span class="discount-badge">-20%</span>
                </div>
              </div>
            </div>

            <!-- SELLER INFO -->
            <div class="seller-box">
              <div class="seller-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                </svg>
              </div>
              <div class="seller-info">
                <div class="seller-label">Người bán</div>
                <div class="seller-name">{{ account.sellerId }}</div>
              </div>
              <button class="contact-seller">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
                Liên hệ
              </button>
            </div>

            <!-- ACTION BUTTONS -->
            <div class="action-buttons">
              <button class="btn-buy" :disabled="account.status !== 0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="9" cy="21" r="1"></circle>
                  <circle cx="20" cy="21" r="1"></circle>
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                </svg>
                {{ account.status === 0 ? 'Mua ngay' : 'Đã bán' }}
              </button>
              <button class="btn-favorite">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                </svg>
              </button>
            </div>

            <!-- FEATURES -->
            <div class="features-list">
              <div class="feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Bảo hành đổi acc nếu sai thông tin
              </div>
              <div class="feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Hỗ trợ đổi mật khẩu miễn phí
              </div>
              <div class="feature-item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Giao dịch nhanh chóng, an toàn
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- IMAGE LIGHTBOX OVERLAY -->
    <transition name="lightbox-fade">
      <div v-if="showLightbox" class="lightbox-overlay" @click="closeLightbox">
        <div class="lightbox-container" @click.stop>
          <button class="lightbox-close" @click="closeLightbox">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- MAIN IMAGE -->
          <div class="lightbox-main">
            <button 
              class="lightbox-prev" 
              @click="prevImage"
              v-if="account.getListImages?.length > 1"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>

            <img 
              :src="account.getListImages[lightboxIndex]?.imageUrl" 
              :alt="'Ảnh ' + (lightboxIndex + 1)"
            />

            <button 
              class="lightbox-next" 
              @click="nextImage"
              v-if="account.getListImages?.length > 1"
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>

          <!-- THUMBNAIL STRIP -->
          <div class="lightbox-thumbnails" v-if="account.getListImages?.length > 1">
            <div 
              v-for="(img, index) in account.getListImages" 
              :key="index"
              class="lightbox-thumb"
              :class="{ active: lightboxIndex === index }"
              @click="lightboxIndex = index"
            >
              <img :src="img.imageUrl" :alt="'Ảnh ' + (index + 1)" />
            </div>
          </div>

          <div class="lightbox-counter">
            {{ lightboxIndex + 1 }} / {{ account.getListImages?.length }}
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import account from '~/api/account';

export default {
  data() {
    return {
      accountID: "",
      account: null,
      loading: false,
      error: null,
      selectedImageIndex: 0,
      selectedImage: null,
      showLightbox: false,
      lightboxIndex: 0,
    };
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
    this.$store.state.darkMode = false;
    this.fetchAccount();

    // Keyboard navigation for lightbox
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
.detail-account-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 20px 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
}

.account-detail-wrapper {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

// BREADCRUMB
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 20px;
  font-size: 12px;

  a {
    color: #FF713C;
    text-decoration: none;
    transition: color 0.3s;

    &:hover {
      color: #e65a2b;
    }
  }

  .separator {
    color: #9ca3af;
  }

  .current {
    color: #6b7280;
  }
}

// LOADING STATE
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e5e7eb;
    border-top-color: #FF713C;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  p {
    color: #6b7280;
    font-size: 16px;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// ERROR STATE
.error-container {
  text-align: center;
  padding: 80px 20px;

  .error-icon {
    font-size: 64px;
    margin-bottom: 20px;
  }

  h3 {
    color: #ef4444;
    font-size: 24px;
    margin-bottom: 10px;
  }

  p {
    color: #6b7280;
    margin-bottom: 30px;
  }

  .retry-btn {
    padding: 12px 32px;
    background: #FF713C;
    color: #fff;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      background: #e65a2b;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(255, 113, 60, 0.4);
    }
  }
}

// MAIN CONTENT
.account-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

// GALLERY SECTION
.gallery-section {
  .main-image {
    position: relative;
    border-radius: 4px;
    overflow: hidden;
    background: #f9fafb;
    margin-bottom: 12px;
    cursor: pointer;

    .image-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 2;

      span {
        display: inline-block;
        padding: 4px 12px;
        border-radius: 2px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .badge-available {
        background: #10b981;
        color: #fff;
      }

      .badge-sold {
        background: #ef4444;
        color: #fff;
      }
    }

    img {
      width: 100%;
      height: 380px;
      object-fit: cover;
      transition: transform 0.3s;
    }

    &:hover img {
      transform: scale(1.03);
    }

    .zoom-btn {
      position: absolute;
      bottom: 12px;
      right: 12px;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(10px);
      color: #fff;
      border: none;
      border-radius: 2px;
      font-size: 12px;
      cursor: pointer;
      transition: all 0.3s;

      svg {
        stroke-width: 2;
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: rgba(0, 0, 0, 0.9);
        transform: translateY(-1px);
      }
    }
  }

  .thumbnail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
    gap: 8px;

    .thumbnail {
      position: relative;
      border-radius: 2px;
      overflow: hidden;
      cursor: pointer;
      border: 2px solid transparent;
      transition: all 0.3s;

      &.active {
        border-color: #FF713C;
      }

      img {
        width: 100%;
        height: 80px;
        object-fit: cover;
        transition: transform 0.3s;
      }

      &:hover img {
        transform: scale(1.08);
      }
    }
  }
}

// INFO SECTION
.info-section {
  .header-info {
    margin-bottom: 12px;

    .account-title {
      font-size: 22px;
      font-weight: 700;
      color: #111827;
      margin-bottom: 6px;
      line-height: 1.3;
    }

    .account-id {
      display: inline-block;
      padding: 3px 10px;
      background: #f3f4f6;
      color: #6b7280;
      border-radius: 2px;
      font-size: 11px;
      font-weight: 500;
    }
  }

  .account-description {
    color: #6b7280;
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 16px;
  }

  // PRICE BOX
  .price-box {
    background: linear-gradient(135deg, #FF713C 0%, #ff5722 100%);
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;

    .price-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;

      &:not(:last-child) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .price-label {
        display: flex;
        align-items: center;
        gap: 8px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 13px;
        font-weight: 500;

        svg {
          stroke-width: 2;
          width: 18px;
          height: 18px;
        }
      }

      .price-value {
        font-size: 20px;
        font-weight: 700;
        color: #fff;

        &.discount {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #fbbf24;

          .discount-badge {
            padding: 3px 8px;
            background: rgba(251, 191, 36, 0.2);
            border: 1px solid #fbbf24;
            border-radius: 2px;
            font-size: 10px;
            font-weight: 600;
          }
        }
      }
    }
  }

  // SELLER BOX
  .seller-box {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px;
    background: #f9fafb;
    border-radius: 4px;
    margin-bottom: 16px;

    .seller-avatar {
      width: 44px;
      height: 44px;
      background: linear-gradient(135deg, #FF713C, #ff5722);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      flex-shrink: 0;

      svg {
        width: 20px;
        height: 20px;
      }
    }

    .seller-info {
      flex: 1;

      .seller-label {
        font-size: 11px;
        color: #9ca3af;
        margin-bottom: 3px;
      }

      .seller-name {
        font-size: 14px;
        font-weight: 600;
        color: #111827;
      }
    }

    .contact-seller {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 14px;
      background: #fff;
      border: 2px solid #e5e7eb;
      border-radius: 2px;
      color: #FF713C;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;

      svg {
        width: 16px;
        height: 16px;
      }

      &:hover {
        border-color: #FF713C;
        background: #fff7f5;
      }
    }
  }

  // ACTION BUTTONS
  .action-buttons {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 10px;
    margin-bottom: 16px;

    .btn-buy {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px;
      background: linear-gradient(135deg, #FF713C, #ff5722);
      color: #fff;
      border: none;
      border-radius: 2px;
      font-size: 14px;
      font-weight: 700;
      cursor: pointer;
      transition: all 0.3s;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(255, 113, 60, 0.4);
      }

      &:disabled {
        background: #9ca3af;
        cursor: not-allowed;
      }
    }

    .btn-favorite {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      padding: 12px;
      background: #fff;
      border: 2px solid #e5e7eb;
      border-radius: 2px;
      color: #ef4444;
      cursor: pointer;
      transition: all 0.3s;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        border-color: #ef4444;
        background: #fef2f2;
      }
    }
  }

  // FEATURES LIST
  .features-list {
    padding: 14px;
    background: #f0fdf4;
    border-radius: 4px;
    border: 1px solid #bbf7d0;

    .feature-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 6px 0;
      color: #166534;
      font-size: 12px;

      svg {
        flex-shrink: 0;
        width: 16px;
        height: 16px;
      }
    }
  }
}

// LIGHTBOX OVERLAY
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

  .lightbox-container {
    position: relative;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .lightbox-close {
    position: absolute;
    top: 0;
    right: 0;
    width: 48px;
    height: 48px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    transition: all 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: rotate(90deg);
    }
  }

  .lightbox-main {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-height: calc(100% - 120px);
    margin-bottom: 20px;

    img {
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      border-radius: 8px;
    }

    .lightbox-prev,
    .lightbox-next {
      position: absolute;
      width: 56px;
      height: 56px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: none;
      border-radius: 50%;
      color: #fff;
      cursor: pointer;
      transition: all 0.3s;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
        transform: scale(1.1);
      }
    }

    .lightbox-prev {
      left: 20px;
    }

    .lightbox-next {
      right: 20px;
    }
  }

  .lightbox-thumbnails {
    display: flex;
    gap: 12px;
    padding: 0 60px;
    overflow-x: auto;
    max-width: 100%;

    &::-webkit-scrollbar {
      height: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.3);
      border-radius: 3px;
    }

    .lightbox-thumb {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      border: 3px solid transparent;
      cursor: pointer;
      opacity: 0.5;
      transition: all 0.3s;

      &.active {
        border-color: #FF713C;
        opacity: 1;
      }

      &:hover {
        opacity: 1;
      }

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }

  .lightbox-counter {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 6px;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
  }
}

// LIGHTBOX TRANSITIONS
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
  .account-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .gallery-section .main-image img {
    height: 320px;
  }
}

@media (max-width: 768px) {
  .account-detail-wrapper {
    padding: 16px;
  }

  .gallery-section .main-image img {
    height: 280px;
  }

  .info-section {
    .header-info .account-title {
      font-size: 18px;
    }

    .price-box .price-row .price-value {
      font-size: 18px;
    }

    .seller-box {
      flex-wrap: wrap;
      gap: 10px;

      .contact-seller {
        width: 100%;
        justify-content: center;
      }
    }

    .action-buttons {
      grid-template-columns: 1fr;

      .btn-favorite {
        width: 100%;
      }
    }
  }

  .lightbox-overlay {
    .lightbox-main {
      .lightbox-prev,
      .lightbox-next {
        width: 36px;
        height: 36px;

        svg {
          width: 20px;
          height: 20px;
        }
      }

      .lightbox-prev {
        left: 8px;
      }

      .lightbox-next {
        right: 8px;
      }
    }

    .lightbox-thumbnails {
      padding: 0 16px;

      .lightbox-thumb {
        width: 56px;
        height: 56px;
      }
    }
  }
}

@media (max-width: 480px) {
  .account-detail-wrapper {
    padding: 12px;
  }

  .gallery-section {
    .main-image img {
      height: 240px;
    }

    .thumbnail-grid {
      grid-template-columns: repeat(auto-fill, minmax(64px, 1fr));
      gap: 6px;

      .thumbnail img {
        height: 64px;
      }
    }
  }

  .info-section {
    .header-info .account-title {
      font-size: 16px;
    }

    .price-box {
      padding: 12px;

      .price-row {
        padding: 8px 0;

        .price-label {
          font-size: 12px;
        }

        .price-value {
          font-size: 16px;
        }
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
      this.$store.state.darkMode = false;
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
