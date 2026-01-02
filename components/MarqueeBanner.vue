<template>
  <div class="marquee-banner">
    <div class="marquee-content">
      <div class="marquee-item" v-for="(item, index) in displayItems" :key="index">
        <i :class="item.icon"></i>
        <span class="user-name">{{ item.userName }}</span>
        <span class="action-text">{{ item.action }}</span>
        <span class="amount">{{ item.amount }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MarqueeBanner',
  data() {
    return {
      notifications: [
        { userName: 'duongmanh2953', action: 'đã nạp', amount: '500.000đ', icon: 'fas fa-wallet' },
        { userName: 'gamer_pro123', action: 'đã mua nick Liên Quân', amount: '1.200.000đ', icon: 'fas fa-shopping-cart' },
        { userName: 'thanhcong88', action: 'đã nạp', amount: '300.000đ', icon: 'fas fa-wallet' },
        { userName: 'nguyenvana', action: 'đã mua nick PUBG', amount: '800.000đ', icon: 'fas fa-shopping-cart' },
        { userName: 'gamethuvip', action: 'đã nạp', amount: '1.000.000đ', icon: 'fas fa-wallet' },
        { userName: 'kientrung99', action: 'đã mua nick Free Fire', amount: '650.000đ', icon: 'fas fa-shopping-cart' },
        { userName: 'hoanglong2k', action: 'đã nạp', amount: '200.000đ', icon: 'fas fa-wallet' },
        { userName: 'minhhieu', action: 'đã mua nick Liên Minh', amount: '2.500.000đ', icon: 'fas fa-shopping-cart' },
        { userName: 'tuananh123', action: 'đã nạp', amount: '750.000đ', icon: 'fas fa-wallet' },
        { userName: 'quanghuy', action: 'đã mua nick Valorant', amount: '1.800.000đ', icon: 'fas fa-shopping-cart' },
      ]
    }
  },
  computed: {
    // Duplicate items để tạo hiệu ứng loop liền mạch
    displayItems() {
      return [...this.notifications, ...this.notifications]
    }
  }
}
</script>

<style lang="scss" scoped>
.marquee-banner {
  background: linear-gradient(90deg, #1a1a2e 0%, #16213e 50%, #1a1a2e 100%);
  border-bottom: 1px solid rgba(245, 158, 11, 0.2);
  overflow: hidden;
  padding: 10px 0;
  position: relative;
  width: 100%;
  z-index: 50;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 90px;
    z-index: 2;
    pointer-events: none;
  }

  &::before {
    left: 0;
    background: linear-gradient(90deg, #1a1a2e 0%, transparent 100%);
  }

  &::after {
    right: 0;
    background: linear-gradient(90deg, transparent 0%, #1a1a2e 100%);
  }
}

.marquee-content {
  display: flex;
  animation: marquee 40s linear infinite;
  white-space: nowrap;
  will-change: transform;

  &:hover {
    animation-play-state: paused;
  }
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

.marquee-item {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 0 40px;
  font-size: 13px;
  color: #fff;

  i {
    color: #f59e0b;
    font-size: 14px;
  }

  .user-name {
    color: #60a5fa;
    font-weight: 600;
  }

  .action-text {
    color: #d1d5db;
  }

  .amount {
    color: #10b981;
    font-weight: 700;
  }

  &::after {
    content: '•';
    margin-left: 40px;
    color: rgba(245, 158, 11, 0.4);
    font-size: 12px;
  }

  &:last-child::after {
    display: none;
  }
}

// Pause animation on hover
.marquee-banner:hover .marquee-content {
  animation-play-state: paused;
}

@media (max-width: 768px) {
  .marquee-banner {
    padding: 6px 0;
  }

  .marquee-item {
    font-size: 12px;
    padding: 0 20px;

    i {
      font-size: 12px;
    }

    &::after {
      margin-left: 20px;
    }
  }

  .marquee-content {
    animation: marquee 30s linear infinite;
  }
}
</style>
