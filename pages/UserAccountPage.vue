<template>
  <div class="user-account-page">
    <div class="page-container">
      <!-- HEADER PROFILE -->
      <div class="profile-header">
        <div class="profile-bg"></div>
        <div class="profile-card">
          <div class="avatar-wrapper">
            <img src="@/assets/images/avatar-user.jpg" :alt="user.name" class="avatar" />
            <div class="status-badge"></div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ user.name }}</h1>
            <p class="profile-id">ID: {{ user.userId }}</p>
            <p class="profile-email">{{ user.email }}</p>
          </div>
        </div>
      </div>

      <!-- MAIN CONTENT -->
      <div class="content-wrapper">
        <!-- SIDEBAR NAVIGATION -->
        <aside class="sidebar">
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
    navigateTo(target) {

      // update nav state
      Object.keys(this.nav).forEach(key => {
        this.nav[key] = key === target;
      });

      // update URL
      this.$router.push({
        query: { tab: target }
      });

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
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 24px;
    border-bottom: 1px solid $border;
    z-index: 2;

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
  top: 100px;
  height: fit-content;


  .nav-group {
    background: $bg;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: $shadow-md;
    margin-bottom: 20px;
    border: 1px solid $border;

    .nav-group-title {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
      border-bottom: 2px solid $border;
      font-size: 13px;
      font-weight: 700;
      color: $text-main;
      text-transform: uppercase;
      letter-spacing: 0.5px;

      i {
        font-size: 16px;
        color: $primary;
      }
    }

    .nav-link {
      border: 1px solid $border;

      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 14px 20px;
      background: transparent;
      border: none;
      border-left: 3px solid transparent;
      cursor: pointer;
      font-size: 14px;
      color: $text-sub;
      transition: all 0.2s ease;
      text-align: left;

      i {
        font-size: 16px;
        width: 20px;
        flex-shrink: 0;
        color: inherit;
      }

      span:first-of-type {
        flex: 1;
        font-weight: 500;
      }

      .badge {
        display: inline-block;
        padding: 2px 8px;
        background: $primary;
        color: white;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;
        margin-left: auto;
      }

      &:hover {
        background: $border-light;
        color: $primary;

        i {
          color: $primary;
        }
      }

      &.active {
        background: rgba($primary, 0.1);
        color: $primary;
        border-left-color: $primary;
        font-weight: 600;

        i {
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
    gap: 8px;
    position: static;
    top: auto;

    .nav-group {
      margin-bottom: 0;

      .nav-group-title {
        padding: 8px 12px;
        font-size: 11px;
        gap: 6px;

        i {
          font-size: 13px;
        }
      }

      .nav-link {
        padding: 10px 12px;
        font-size: 13px;
        gap: 10px;

        i {
          font-size: 15px;
          width: 18px;
        }

        span:first-of-type {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .badge {
          padding: 2px 6px;
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