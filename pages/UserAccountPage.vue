<template>
  <div class="user-account-page">
    <div class="!py-10 page-container">
      <!-- Mobile Overlay -->
      <div class="mobile-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>

      <!-- HEADER PROFILE -->
      <div class="profile-header">
        <div class="profile-bg"></div>
        <div class="profile-card">
          <!-- Mobile Menu Button -->
          <button class="mobile-menu-btn" @click="toggleMobileMenu" v-if="isMobileView">
            <i class="fas fa-bars"></i>
          </button>

          <div class="avatar-wrapper">
            <img src="@/assets/images/avatar-user.jpg" :alt="user.name" class="avatar" />
            <div class="status-badge"></div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ user.name }}</h1>
            <p class="profile-id">ID: {{ user.userId }}</p>
            <p class="profile-email">{{ user.email }}</p>
          </div>
          <button @click="user_logout" class="logout-button">
            <i class="fas fa-sign-out-alt"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="content-wrapper">
        <!-- SIDEBAR NAVIGATION -->
        <aside class="sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
          <!-- User Info Section -->
          <div class="sidebar-user-info">
            <div class="sidebar-avatar">
              <img src="@/assets/images/avatar-user.jpg" :alt="user.name" />
              <div class="online-status"></div>
            </div>
            <div class="sidebar-user-details">
              <h3 class="sidebar-username">{{ user.name }}</h3>
              <p class="sidebar-user-id">ID: {{ user.userId }}</p>
              <div class="sidebar-balance">
                <i class="fas fa-wallet"></i>
                <span>{{ user.balance?.toLocaleString() || 0 }}đ</span>
              </div>
            </div>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">
              <i class="fas fa-user"></i>
              Tài Khoản
            </div>
            <button v-for="item in menuGroups.account" :key="item.id" @click="navigateTo(item.id)"
              :class="{ active: nav[item.id] }" class="nav-link">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
              <span v-if="item.badge" class="badge" :class="item?.color">{{ item.badge }}</span>
            </button>
          </div>

          <div class="nav-group">
            <div class="nav-group-title">
              <i class="fas fa-exchange-alt"></i>
              Giao Dịch
            </div>
            <button v-for="item in menuGroups.transaction" :key="item.id" @click="navigateTo(item.id)"
              :class="{ active: nav[item.id] }" class="nav-link">
              <i :class="item.icon"></i>
              <span>{{ item.label }}</span>
              <span v-if="item.badge" class="badge">{{ item.badge }}</span>
            </button>
          </div>

          <div class="nav-group">
            <button @click="user_logout" class="hover:bg-red-50 text-red-600 hover:text-red-800 nav-link">
              <i class="!text-red-600 fas fa-sign-out-alt"></i>
              <span class="text-red-600">Đăng xuất</span>
            </button>
          </div>
        </aside>

        <!-- MAIN PANEL -->
        <main class="main-panel">
          <transition name="fade" mode="out-in">
            <div :key="activeTab">
              <AccountInformations v-if="nav.accountInfor" />
              <ChangePassword v-if="nav.changePassword" />
              <ListFavorites v-if="nav.listFavorites" />
              <RechargeHistory v-if="nav.rechargeHistory" />
              <TransactionHistory v-if="nav.transactionHistory" />
              <AccountPurchaseHistory v-if="nav.accountPurchaseHistory" />
              <AutoRechargeCard v-if="nav.autoRechargeCard" />
              <AutoAtmRecharge v-if="nav.autoAtmRecharge" />
            </div>
          </transition>
        </main>
      </div>
    </div>
  </div>
</template>

<script>

export default {

  components: {
    AccountInformations: () =>
      import("@/components/UserAccountComponents/AccountInformations"),
    ChangePassword: () =>
      import("@/components/UserAccountComponents/ChangePassword"),
    RechargeHistory: () =>
      import("@/components/UserAccountComponents/RechargeHistory"),
    TransactionHistory: () =>
      import("@/components/UserAccountComponents/TransactionHistory"),
    AccountPurchaseHistory: () =>
      import("@/components/UserAccountComponents/AccountPurchaseHistory"),
    AutoRechargeCard: () =>
      import("@/components/UserAccountComponents/AutoRechargeCard"),
    AutoAtmRecharge: () =>
      import("@/components/UserAccountComponents/AutoAtmRecharge"),
    ListFavorites: () =>
      import("@/components/UserAccountComponents/ListFavorites"),
  },

  data() {
    return {
      isMobileMenuOpen: false,
      isMobileView: false,
      nav: {
        accountInfor: true,
        changePassword: false,
        rechargeHistory: false,
        listFavorites: false,
        transactionHistory: false,
        accountPurchaseHistory: false,
        autoRechargeCard: false,
        autoAtmRecharge: false,
      },
      menuGroups: {
        account: [
          { id: 'accountInfor', label: 'Thông tin tài khoản', icon: 'fas fa-id-card' },
          { id: 'changePassword', label: 'Đổi mật khẩu', icon: 'fas fa-key' },
        ],
        transaction: [
          { id: 'listFavorites', label: 'Danh sách yêu thích', icon: 'fas fa-heart' },
          { id: 'autoRechargeCard', label: 'Nạp thẻ cào tự động', icon: 'fas fa-sim-card' },
          { id: 'autoAtmRecharge', label: 'Nạp ATM/MOMO tự động', icon: 'fas fa-credit-card' },
          { id: 'rechargeHistory', label: 'Lịch sử nạp thẻ', icon: 'fas fa-history' },
          { id: 'transactionHistory', label: 'Lịch sử giao dịch', icon: 'fas fa-exchange-alt' },
          { id: 'accountPurchaseHistory', label: 'Lịch sử mua nick', icon: 'fas fa-shopping-bag' },
        ],
      },
    };
  },

  computed: {
    user() {
      return this.$store.state?.user_data;
    },
    activeTab() {
      return Object.keys(this.nav).find(key => this.nav[key]);
    }
  },

  methods: {
    toggleMobileMenu() {
      this.isMobileMenuOpen = !this.isMobileMenuOpen;
      // Prevent body scroll when menu is open
      if (this.isMobileMenuOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    },
    checkMobileView() {
      this.isMobileView = window.innerWidth <= 768;
      if (!this.isMobileView) {
        this.isMobileMenuOpen = false;
        document.body.style.overflow = '';
      }
    },
    navigateTo(target) {

      // update nav state
      Object.keys(this.nav).forEach(key => {
        this.nav[key] = key === target;
      });

      // update URL
      this.$router.push({
        query: { tab: target }
      });

      // Close mobile menu after navigation
      if (this.isMobileView) {
        this.toggleMobileMenu();
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async user_logout() {
      this.$store.dispatch('logout');
      this.$router.push('/login');
    },
  },

  mounted() {
    this.$store.commit("setIsDarkMode", false);
    // 🚨 Check nếu không có user thì về trang login      
    if (!this.$store.state.isAuthenticated) {
      this.$router.push('/login');
      return;
    }

    const tab = this.$route.query.tab;
    if (tab && this.nav[tab] !== undefined) {
      this.navigateTo(tab);
    }

    // Check mobile view on mount and window resize
    this.checkMobileView();
    window.addEventListener('resize', this.checkMobileView);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobileView);
    document.body.style.overflow = '';
  },
  watch: {
    '$route.query.tab'(newTab) {
      if (newTab && this.nav[newTab] !== undefined) {
        this.navigateTo(newTab);
      }
    }
  }

};
</script>

<style lang="scss" scoped>
// DESIGN TOKENS
$primary: #ff6b35;
$primary-dark: #e55a28;
$primary-light: #ff8f5f;
$text-main: #1a1a1a;
$text-sub: #6b7280;
$text-light: #9ca3af;
$border: #e5e7eb;
$border-light: #f3f4f6;
$bg: #ffffff;
$bg-light: #f9fafb;
$bg-darker: #f3f4f6;
$shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

// Mobile Menu Button
.mobile-menu-btn {
  display: none;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: $primary;
  color: white;
  border: none;
  box-shadow: $shadow-md;
  cursor: pointer;
  transition: all 0.3s ease;
  flex-shrink: 0;

  i {
    font-size: 18px;
  }

  &:hover {
    background: $primary-dark;
    transform: scale(1.05);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    display: flex;
  }
}

// Mobile Overlay
.mobile-overlay {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .mobile-overlay {
    display: block;
  }
}

.user-account-page {
  min-height: 100vh;
  padding-bottom: 40px;
  margin-top: 74px;

  @media (max-width: 768px) {
    margin-top: 0;
    padding-bottom: 80px;
  }

  .page-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 16px;

    @media (max-width: 768px) {
      padding: 0 10px;
    }
  }
}

// PROFILE HEADER
.profile-header {
  position: relative;
  margin-bottom: 40px;

  .profile-bg {
    height: 10px;
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
      background: $primary;
    border-radius: 12px;
    margin-bottom: -60px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: -50%;
      right: -10%;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%);
      border-radius: 50%;
    }

    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 10%;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(0, 0, 0, 0.05) 0%, transparent 70%);
      border-radius: 50%;
    }
  }

  .profile-card {
    position: relative;
    background: $bg;
    border-radius: 12px;
      border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 16px;
    border-bottom: 1px solid $border;
    z-index: 2;

    @media (max-width: 768px) {
      gap: 12px;
      padding: 12px;
    }

    .avatar-wrapper {
      position: relative;
      flex-shrink: 0;

      .avatar {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        border: 4px solid $primary;
        object-fit: cover;
        box-shadow: 0 8px 24px rgba(255, 107, 53, 0.25);
      }

      .status-badge {
        position: absolute;
        bottom: 0;
        right: 0;
        width: 30px;
        height: 30px;
        background: linear-gradient(135deg, $primary, $primary-dark);
        border-radius: 50%;
        border: 4px solid $bg;
        box-shadow: $shadow-md;
      }
    }

    .profile-info {
      flex: 1;
      min-width: 0;

      .profile-name {
        font-size: 28px;
        font-weight: 800;
        color: $text-main;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
      }

      .profile-id {
        font-size: 14px;
        font-weight: 600;
        color: $primary;
        margin: 0 0 4px 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      .profile-email {
        font-size: 14px;
        color: $text-sub;
        margin: 0;
      }
    }

    .logout-button {
      padding: 12px 24px;
      border-radius: 10px;
      border: none;
      background: linear-gradient(135deg, #ef4444, #dc2626);
      color: white;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.3s ease;
      box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);

      i {
        font-size: 16px;
      }

      &:hover {
      background: #ef4444;
    }

    .logout-button:hover {
        background: darken(#ef4444, 10%);
          background: $primary;
        transform: translateY(-2px);
        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4);
      }

      &:active {
        transform: translateY(0);
      }

      @media (max-width: 768px) {
        padding: 10px 16px;
        font-size: 14px;

        span {
          display: none;
        }

        i {
          margin: 0;
        }
      }
    }
  }
}

// CONTENT WRAPPER
.content-wrapper {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 24px;
}

// SIDEBAR
.sidebar {
  position: sticky;
  top: 20px;
  height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.05);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba($primary, 0.3);
    border-radius: 3px;

    &:hover {
      background: rgba($primary, 0.5);
    }
  }

  // User Info Section
  .sidebar-user-info {
    background: linear-gradient(135deg, $primary 0%, $primary-dark 100%);
    border-radius: 12px;
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    box-shadow: 0 4px 12px rgba($primary, 0.25);
    margin-bottom: 4px;

    .sidebar-avatar {
      position: relative;
      flex-shrink: 0;

      img {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.3);
        object-fit: cover;
      }

      .online-status {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 14px;
        height: 14px;
        background: #10b981;
        border-radius: 50%;
        border: 2px solid white;
      }
    }

    .sidebar-user-details {
      flex: 1;
      min-width: 0;

      .sidebar-username {
        font-size: 16px;
        font-weight: 700;
        color: white;
        margin: 0 0 4px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .sidebar-user-id {
        font-size: 11px;
        color: rgba(255, 255, 255, 0.7);
        margin: 0 0 8px 0;
        font-weight: 600;
      }

      .sidebar-balance {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        backdrop-filter: blur(10px);

        i {
          font-size: 12px;
          color: #fbbf24;
        }

        span {
          font-size: 13px;
          font-weight: 700;
          color: white;
        }
      }
    }
  }

  .nav-group {
    background: $bg;
    border-radius: 12px;
      border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
    border: 1px solid rgba($border, 0.8);
    transition: all 0.3s ease;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      transform: translateY(-1px);
    }

    .nav-group-title {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      background: $bg-darker;
      border-bottom: 1px solid $border;
      font-size: 11px;
      font-weight: 700;
      color: $text-sub;
      text-transform: uppercase;
      letter-spacing: 1px;

      i {
        font-size: 13px;
        color: $primary;
      }
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 12px 16px;
      background: transparent;
      border: none;
      border-left: 2px solid transparent;
      cursor: pointer;
      font-size: 13.5px;
      color: $text-sub;
      transition: all 0.2s ease;
      text-align: left;
      position: relative;

      i {
        font-size: 16px;
        width: 20px;
        flex-shrink: 0;
        color: $text-light;
        transition: all 0.2s ease;
        text-align: center;
      }

      span:first-of-type {
        flex: 1;
        font-weight: 500;
        line-height: 1.4;
      }

      .badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-width: 22px;
        height: 22px;
        padding: 0 8px;
        background: $primary;
        color: white;
        border-radius: 11px;
        font-size: 11px;
        font-weight: 600;
        margin-left: auto;
      }

      &:hover {
        background: rgba($primary, 0.05);
        color: $text-main;

        i {
          color: $primary;
        }
      }

      &.active {
        background: rgba($primary, 0.08);
        color: $primary;
        border-left-color: $primary;

        i {
          color: $primary;
        }

        span:first-of-type {
          font-weight: 600;
          color: $primary;
        }
      }
    }
  }
}

// MAIN PANEL
.main-panel {
  background: $bg;
  border-radius: 12px;
    border-radius: 8px;
  box-shadow: $shadow-md;
  overflow: hidden;
  height: fit-content;
  animation: slideIn 0.3s ease;
  border: 1px solid $border;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

// TRANSITIONS
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// TABLET (1024px)
@media (max-width: 1024px) {
  .profile-header .profile-card {
    padding: 24px;
    gap: 16px;

    .avatar-wrapper .avatar {
      width: 120px;
      height: 120px;
    }

    .profile-info .profile-name {
      font-size: 24px;
    }
  }

  .content-wrapper {
    grid-template-columns: 260px 1fr;
    gap: 20px;
  }

  .sidebar {
    top: 90px;

    .nav-group .nav-link {
      padding: 12px 16px;
      font-size: 13px;

      i {
        font-size: 14px;
      }
    }
  }
}

// MOBILE (768px)
@media (max-width: 768px) {
  .user-account-page {
    padding-bottom: 20px;
    border-radius: 50%;

    .page-container {
      padding: 0 10px;
    }
  }

  .profile-header {
    margin-bottom: 12px;

    .profile-bg {
      height: 60px;
      margin-bottom: -24px;
    }

    .profile-card {
      padding: 10px 12px;
      gap: 10px;
      flex-direction: row;
      align-items: center;
      text-align: left;

      .avatar-wrapper {
        .avatar {
          width: 60px;
          height: 60px;
          border-width: 3px;
        }

        .status-badge {
          width: 20px;
          height: 20px;
          border-width: 3px;
        }
      }

      .profile-info {
        flex: 1;
        min-width: 0;

        .profile-name {
          font-size: 16px;
          margin-bottom: 3px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .profile-id {
          font-size: 11px;
          margin-bottom: 2px;
        }

        .profile-email {
          font-size: 11px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }
  }

  .content-wrapper {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: fixed;
    top: 0;
    left: -100%;
    height: 100vh;
    width: 280px;
    background: $bg;
    z-index: 1000;
    overflow-y: auto;
    padding: 80px 12px 20px;
    box-shadow: 4px 0 16px rgba(0, 0, 0, 0.12);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    &.mobile-open {
      left: 0;
    }

    // Close button in mobile sidebar
    &::before {
      content: '';
      position: fixed;
      top: 20px;
      right: 20px;
      width: 40px;
      height: 40px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 50%;
      display: none;
    }

    .nav-group {
      margin-bottom: 0;
      border-radius: 10px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

      .nav-group-title {
        padding: 10px 14px;
        font-size: 10px;
        gap: 6px;

        i {
          font-size: 12px;
        }
      }

      .nav-link {
        padding: 11px 14px;
        font-size: 13px;
        gap: 10px;

        i {
          font-size: 15px;
          width: 18px;
        }

        .badge {
          min-width: 20px;
          height: 20px;
          padding: 0 6px;
          font-size: 10px;
        }
      }
    }
  }
}

// SMALL MOBILE (480px)
@media (max-width: 480px) {
  .profile-header {
    margin-bottom: 10px;

    .profile-bg {
      height: 50px;
      margin-bottom: -20px;
    }

    .profile-card {
      padding: 8px 10px;
      gap: 8px;

      .avatar-wrapper .avatar {
        width: 50px;
        height: 50px;
      }

      .profile-info {
        .profile-name {
          font-size: 14px;
          margin-bottom: 2px;
        }

        .profile-id {
          font-size: 10px;
          margin-bottom: 1px;
        }

        .profile-email {
          font-size: 10px;
        }
      }
    }
  }

  .sidebar {
    .nav-group {
      .nav-group-title {
        padding: 7px 10px;
        font-size: 10px;
      }

      .nav-link {
        padding: 9px 10px;
        font-size: 12px;
      }
    }
  }
}
</style>