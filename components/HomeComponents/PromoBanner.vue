<template>
  <section class="promo-banner">
    <div class="wrap">
      <div class="content">
        <div class="eyebrow">Khuyến mãi cực sốc</div>
        <h1 class="title">Giảm đến 50% • Tài khoản game uy tín</h1>
        <p class="subtitle">Mua nhanh – Giao tức thì – Bảo hành 100%</p>
        <div class="actions">
          <nuxt-link to="/Register" class="btn btn-primary">
            <i class="fas fa-bolt"></i>
            Bắt đầu ngay
          </nuxt-link>
          <nuxt-link to="/RechargeOnlinePage" class="btn btn-secondary">
            <i class="fas fa-wallet"></i>
            Nạp nhanh
          </nuxt-link>
        </div>
        <ul class="features">
          <li><i class="fas fa-shield-alt"></i> Bảo hành đổi trả</li>
          <li><i class="fas fa-truck-fast"></i> Giao tài khoản tức thì</li>
          <li><i class="fas fa-tags"></i> Nhiều mã giảm giá</li>
        </ul>
      </div>
      <div class="badge">
        <span>-50%</span>
      </div>
    </div>
  </section>
</template>

<script>
export default {
  name: 'PromoBanner',
};
</script>

<style scoped lang="scss">
// Dark gaming theme (sharp, squared)
$primary: #ff4655;
$primary-dark: #d63845;
$secondary: #00d9ff;
$dark: #0a0a0a;
$dark-card: #121212;
$dark-light: #1a1a1a;
$dark-border: #2a2a2a;
$text-white: #ffffff;
$text-gray: #9a9a9a;

.promo-banner {
  background: $dark;
  border-bottom: 1px solid $dark-border;
}

.wrap {
  max-width: 1200px;
  margin: 0 auto;
  padding: 28px 16px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.eyebrow {
  color: $secondary;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.title {
  color: $text-white;
  font-size: 28px;
  font-weight: 900;
  line-height: 1.25;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.subtitle {
  color: $text-gray;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  text-decoration: none;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  border: 1px solid $dark-border;
  color: $text-white;
  background: $dark-light;
  transition: all 0.2s;

  i { font-size: 14px; }

  &:hover {
    border-color: $primary;
    color: $primary;
  }
}

.btn-primary {
  background: $primary;
  border-color: $primary;

  &:hover {
    background: $primary-dark;
    color: $text-white;
  }
}

.features {
  display: flex;
  flex-wrap: wrap;
  gap: 14px 20px;
  margin-top: 8px;
  padding: 0;
  list-style: none;

  li {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: $text-gray;
    font-size: 13px;

    i { color: $primary; }
  }
}

.badge {
  position: relative;
  align-self: stretch;
  display: flex;
  align-items: center;
  padding-left: 16px;
  border-left: 3px solid $primary;

  span {
    color: $primary;
    font-weight: 900;
    font-size: 28px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

@media (max-width: 900px) {
  .wrap {
    grid-template-columns: 1fr;
  }
  .badge {
    display: none;
  }
}
</style>
