<template>
  <div class="game-history">
    <!-- HEADER -->
    <div class="history-header">
      <div class="header-content">
        <i class="fas fa-gamepad"></i>
        <h2>Lịch Sử Chơi Game</h2>
      </div>
      <div class="header-stats">
        <span class="stat-badge">
          <i class="fas fa-chart-bar"></i>
          {{ totalGames }} lần chơi
        </span>
      </div>
    </div>

    <!-- TABLE -->
    <div class="table-section">
      <div class="table-wrapper">
        <table class="game-table">
          <thead>
            <tr>
              <th>ID Lần Chơi</th>
              <th>Thời Gian</th>
              <th>Mục Chơi</th>
              <th>Loại</th>
              <th>Phần Thưởng</th>
              <th>Giá Trị</th>
              <th>Chi Tiết</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(game, index) in gameHistory" :key="index" class="game-row">
              <!-- ID -->
              <td class="cell-id">
                <span class="id-badge">{{ game.id }}</span>
              </td>

              <!-- THỜI GIAN -->
              <td class="cell-time">
                <div class="time-content">
                  <div class="date">{{ formatDate(game.createdAt) }}</div>
                  <div class="time">{{ formatTime(game.createdAt) }}</div>
                </div>
              </td>

              <!-- MỤC CHƠI -->
              <td class="cell-game">
                <div class="game-name">
                  <span class="game-badge">{{ game.gameName }}</span>
                  <span class="game-desc">{{ game.description }}</span>
                </div>
              </td>

              <!-- LOẠI -->
              <td class="cell-type">
                <span class="type-badge" :class="'type-' + game.type">
                  <i :class="getTypeIcon(game.type)"></i>
                  {{ getTypeName(game.type) }}
                </span>
              </td>

              <!-- PHẦN THƯỞNG -->
              <td class="cell-prize">
                <div class="prize-info">
                  <span class="prize-name">{{ game.prize }}</span>
                  <span class="prize-tier">{{ game.prizeTier }}</span>
                </div>
              </td>

              <!-- GIÁ TRỊ -->
              <td class="cell-value">
                <span class="value-badge" :class="{ win: game.isWin }">
                  <i :class="game.isWin ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                  {{ formatPrice(game.value) }}
                </span>
              </td>

              <!-- CHI TIẾT -->
              <td class="cell-action">
                <button class="btn-detail" @click="openDetail(game)" title="Chi tiết">
                  <i class="fa-chevron-right fas"></i>
                </button>
              </td>
            </tr>

            <!-- EMPTY STATE -->
            <tr v-if="gameHistory.length === 0" class="empty-row">
              <td colspan="7">
                <div class="empty-state">
                  <i class="fas fa-inbox"></i>
                  <p>Chưa có lịch sử chơi game</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- PAGINATION -->
    <div class="pagination-section" v-if="totalPages > 1">
      <div class="pagination">
        <button
          class="page-btn prev"
          :disabled="page === 1"
          @click="changePage(page - 1)"
        >
          <i class="fa-chevron-left fas"></i>
        </button>

        <div class="page-numbers">
          <button
            v-for="p in visiblePages"
            :key="p"
            class="page-btn number"
            :class="{ active: page === p }"
            @click="changePage(p)"
          >
            {{ p }}
          </button>
        </div>

        <button
          class="page-btn next"
          :disabled="page === totalPages"
          @click="changePage(page + 1)"
        >
          <i class="fa-chevron-right fas"></i>
        </button>
      </div>

      <div class="page-info">
        Trang {{ page }} / {{ totalPages }}
      </div>
    </div>

    <!-- STATS SECTION -->
    <div class="stats-section">
      <div class="stat-card">
        <div class="stat-icon wins">
          <i class="fas fa-trophy"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Lần Thắng</span>
          <span class="stat-value">{{ stats.wins }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon losses">
          <i class="fas fa-times-circle"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Lần Thua</span>
          <span class="stat-value">{{ stats.losses }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon earned">
          <i class="fas fa-coins"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Tổng Thắng</span>
          <span class="stat-value">{{ formatPrice(stats.totalEarned) }}</span>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon rate">
          <i class="fas fa-chart-pie"></i>
        </div>
        <div class="stat-content">
          <span class="stat-label">Tỷ Lệ Thắng</span>
          <span class="stat-value">{{ stats.winRate }}%</span>
        </div>
      </div>
    </div>

    <!-- MOBILE TIP -->
    <div class="mobile-tip">
      <i class="fas fa-mobile-alt"></i>
      <span>Trên điện thoại, vuốt bảng từ phải sang trái để xem đầy đủ thông tin</span>
    </div>

    <!-- DETAIL MODAL -->
    <transition name="modal">
      <div v-if="showDetail" class="modal-overlay" @click="closeDetail">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3 class="modal-title">
              <i class="fas fa-gamepad"></i>
              Chi Tiết Lần Chơi
            </h3>
            <button class="btn-close" @click="closeDetail">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <div class="modal-body" v-if="selectedGame">
            <div class="detail-grid">
              <div class="detail-item">
                <span class="detail-label">ID Lần Chơi</span>
                <span class="detail-value code">{{ selectedGame.id }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tên Game</span>
                <span class="detail-value">{{ selectedGame.gameName }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Thời Gian</span>
                <span class="detail-value">{{ formatFullDate(selectedGame.createdAt) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Loại</span>
                <span class="detail-value">{{ getTypeName(selectedGame.type) }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Phần Thưởng</span>
                <span class="detail-value">{{ selectedGame.prize }} ({{ selectedGame.prizeTier }})</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Giá Trị</span>
                <span class="detail-value highlight" :class="{ win: selectedGame.isWin }">
                  {{ selectedGame.isWin ? '+' : '-' }}{{ formatPrice(selectedGame.value) }}
                </span>
              </div>
              <div class="detail-item" v-if="selectedGame.description">
                <span class="detail-label">Mô Tả</span>
                <span class="detail-value">{{ selectedGame.description }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Trạng Thái</span>
                <span class="detail-value">
                  <span class="status-badge" :class="{ win: selectedGame.isWin }">
                    <i :class="selectedGame.isWin ? 'fas fa-check-circle' : 'fas fa-times-circle'"></i>
                    {{ selectedGame.isWin ? 'Thắng' : 'Thua' }}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'GameHistory',
  data() {
    return {
      page: 1,
      limit: 10,
      showDetail: false,
      selectedGame: null,
      gameHistory: [
        {
          id: '845512',
          gameName: 'Liên Minh Huyền Thoại',
          description: 'Random Nick Level 30',
          type: 'random',
          prize: 'Nick Cấp 30',
          prizeTier: 'Gold',
          value: 200000,
          isWin: true,
          createdAt: new Date('2024-06-16'),
        },
        {
          id: '845511',
          gameName: 'Liên Minh Huyền Thoại',
          description: 'Random Nick Level 30',
          type: 'random',
          prize: 'Nick Cấp 20',
          prizeTier: 'Silver',
          value: 100000,
          isWin: true,
          createdAt: new Date('2024-06-15'),
        },
        {
          id: '845510',
          gameName: 'Dota 2',
          description: 'Spin Game',
          type: 'spin',
          prize: 'Không có phần thưởng',
          prizeTier: 'None',
          value: 50000,
          isWin: false,
          createdAt: new Date('2024-06-14'),
        },
      ],
    };
  },

  computed: {
    totalGames() {
      return this.gameHistory.length;
    },

    totalPages() {
      return Math.ceil(this.gameHistory.length / this.limit);
    },

    visiblePages() {
      const pages = [];
      const maxVisible = 5;
      let start = Math.max(1, this.page - Math.floor(maxVisible / 2));
      let end = Math.min(this.totalPages, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      return pages;
    },

    stats() {
      const wins = this.gameHistory.filter(g => g.isWin).length;
      const losses = this.gameHistory.filter(g => !g.isWin).length;
      const totalEarned = this.gameHistory
        .filter(g => g.isWin)
        .reduce((sum, g) => sum + g.value, 0);
      const winRate =
        this.totalGames > 0
          ? Math.round((wins / this.totalGames) * 100)
          : 0;

      return {
        wins,
        losses,
        totalEarned,
        winRate,
      };
    },
  },

  methods: {
    getTypeName(type) {
      const types = {
        random: 'Random',
        spin: 'Spin',
        daily: 'Daily',
        event: 'Event',
      };
      return types[type] || 'Unknown';
    },

    getTypeIcon(type) {
      const icons = {
        random: 'fas fa-dice',
        spin: 'fas fa-ring',
        daily: 'fas fa-calendar-alt',
        event: 'fas fa-star',
      };
      return icons[type] || 'fas fa-gamepad';
    },

    changePage(newPage) {
      if (newPage >= 1 && newPage <= this.totalPages) {
        this.page = newPage;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },

    openDetail(game) {
      this.selectedGame = game;
      this.showDetail = true;
      document.body.style.overflow = 'hidden';
    },

    closeDetail() {
      this.showDetail = false;
      this.selectedGame = null;
      document.body.style.overflow = '';
    },

    formatDate(date) {
      const d = new Date(date);
      return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
    },

    formatTime(date) {
      const d = new Date(date);
      return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
    },

    formatFullDate(date) {
      const d = new Date(date);
      return d.toLocaleString('vi-VN');
    },

    formatPrice(num) {
      return (num || 0).toLocaleString('vi-VN') + 'đ';
    },
  },
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

$green: #10b981;
$green-light: #ecfdf5;
$blue: #3b82f6;
$blue-light: #eff6ff;
$purple: #a855f7;
$purple-light: #faf5ff;
$red: #ef4444;
$red-light: #fef2f2;
$yellow: #f59e0b;
$yellow-light: #fffbeb;

$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 12px rgba(0, 0, 0, 0.08);
$shadow-lg: 0 10px 25px rgba(0, 0, 0, 0.1);

.game-history {
  padding: 0;

  // HEADER
  .history-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 24px;
    background: linear-gradient(135deg, rgba($primary, 0.08), rgba($primary, 0.03));
    border-bottom: 2px solid $border;

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;

      i {
        font-size: 20px;
        color: $primary;
      }

      h2 {
        font-size: 18px;
        font-weight: 700;
        color: $text-main;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }

    .header-stats {
      .stat-badge {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 8px 16px;
        background: rgba(255, 107, 53, 0.1);
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        color: $primary;
        border: 1px solid rgba(255, 107, 53, 0.2);

        i {
          font-size: 14px;
        }
      }
    }
  }

  // TABLE SECTION
  .table-section {
    overflow-x: auto;
    border-top: 1px solid $border;

    &::-webkit-scrollbar {
      height: 6px;
    }



    &::-webkit-scrollbar-thumb {
      background: rgba(255, 107, 53, 0.3);
      border-radius: 3px;

      &:hover {
        background: rgba(255, 107, 53, 0.5);
      }
    }
  }

  .table-wrapper {
    min-width: 1000px;
  }

  .game-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 13px;

    thead {
      background: $bg-light;
      border-bottom: 2px solid $primary;

      th {
        padding: 12px 14px;
        text-align: left;
        font-weight: 700;
        color: $text-main;
        text-transform: uppercase;
        font-size: 11px;
        letter-spacing: 0.5px;
        white-space: nowrap;
      }
    }

    tbody {
      .game-row {
        border-bottom: 1px solid $border;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 107, 53, 0.03);
        }

        &:last-child {
          border-bottom: none;
        }
      }

      td {
        padding: 14px;
        vertical-align: middle;
      }
    }

    // CELLS
    .cell-id {
      .id-badge {
        display: inline-block;
        padding: 4px 8px;
        background: $bg-light;
        color: $text-sub;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        
      }
    }

    .cell-time {
      .time-content {
        .date {
          font-weight: 700;
          color: $text-main;
          font-size: 12px;
          margin-bottom: 2px;
        }

        .time {
          color: $text-light;
          font-size: 11px;
        }
      }
    }

    .cell-game {
      .game-name {
        display: flex;
        flex-direction: column;
        gap: 4px;

        .game-badge {
          display: inline-block;
          width: fit-content;
          padding: 4px 10px;
          background: $primary;
          color: white;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.2px;
        }

        .game-desc {
          font-size: 11px;
          color: $text-sub;
        }
      }
    }

    .cell-type {
      .type-badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 5px 10px;
        border-radius: 4px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.3px;

        i {
          font-size: 11px;
        }

        &.type-random {
          background: $blue-light;
          color: $blue;
        }

        &.type-spin {
          background: $purple-light;
          color: $purple;
        }

        &.type-daily {
          background: $yellow-light;
          color: darken($yellow, 10%);
        }

        &.type-event {
          background: $green-light;
          color: $green;
        }
      }
    }

    .cell-prize {
      .prize-info {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .prize-name {
          font-size: 12px;
          font-weight: 600;
          color: $text-main;
        }

        .prize-tier {
          font-size: 11px;
          color: $text-light;
        }
      }
    }

    .cell-value {
      .value-badge {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 6px 12px;
        border-radius: 4px;
        font-weight: 700;
        font-size: 12px;
        background: $red-light;
        color: $red;

        i {
          font-size: 11px;
        }

        &.win {
          background: $green-light;
          color: $green;
        }
      }
    }

    .cell-action {
      .btn-detail {
        width: 36px;
        height: 36px;
        border: none;
        background: $bg-light;
        color: $primary;
        border-radius: 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        font-size: 14px;

        &:hover {
          background: $primary;
          color: white;
          transform: translateX(2px);
        }
      }
    }
  }

  // EMPTY STATE
  .empty-row {
    border: none;

    .empty-state {
      padding: 60px 20px;
      text-align: center;
      color: $text-light;

      i {
        font-size: 48px;
        opacity: 0.3;
        display: block;
        margin-bottom: 12px;
      }

      p {
        margin: 0;
        font-size: 14px;
        color: $text-sub;
      }
    }
  }

  // PAGINATION
  .pagination-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-top: 1px solid $border;
    background: $bg-light;
    gap: 20px;

    .pagination {
      display: flex;
      align-items: center;
      gap: 6px;

      .page-btn {
        width: 36px;
        height: 36px;
        border: 1px solid $border;
        background: white;
        color: $text-main;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover:not(:disabled) {
          border-color: $primary;
          color: $primary;
          transform: translateY(-1px);
        }

        &.active {
          background: linear-gradient(135deg, $primary, $primary-dark);
          color: white;
          border-color: $primary;
        }

        &:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        i {
          font-size: 14px;
        }
      }

      .page-numbers {
        display: flex;
        gap: 6px;
      }
    }

    .page-info {
      font-size: 12px;
      color: $text-sub;
      font-weight: 600;
      white-space: nowrap;
    }
  }

  // STATS SECTION
  .stats-section {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 24px;
    background: linear-gradient(135deg, $bg-light, $bg-darker);
    border-top: 1px solid $border;

    .stat-card {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 16px;
      background: white;
      border-radius: 10px;
      border: 1px solid $border-light;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-2px);
        box-shadow: $shadow-md;
      }

      .stat-icon {
        width: 48px;
        height: 48px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 20px;
        flex-shrink: 0;

        &.wins {
          background: linear-gradient(135deg, $green, darken($green, 10%));
        }

        &.losses {
          background: linear-gradient(135deg, $red, darken($red, 10%));
        }

        &.earned {
          background: linear-gradient(135deg, #fbbf24, #f59e0b);
        }

        &.rate {
          background: linear-gradient(135deg, $purple, darken($purple, 10%));
        }
      }

      .stat-content {
        display: flex;
        flex-direction: column;
        gap: 2px;

        .stat-label {
          font-size: 11px;
          font-weight: 700;
          color: $text-light;
          text-transform: uppercase;
          letter-spacing: 0.3px;
        }

        .stat-value {
          font-size: 18px;
          font-weight: 800;
          color: $text-main;
        }
      }
    }
  }

  // MOBILE TIP
  .mobile-tip {
    display: none;
    align-items: center;
    gap: 10px;
    margin: 0 20px 20px 20px;
    padding: 12px 14px;
    background: #dbeafe;
    color: #1e40af;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 500;
    border-left: 4px solid #1e40af;

    i {
      font-size: 14px;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      display: flex;
    }
  }

  // MODAL
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 9999;
    padding: 20px;
    backdrop-filter: blur(4px);

    .modal-content {
      background: white;
      border-radius: 12px;
      width: 100%;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      box-shadow: $shadow-lg;
      animation: slideUp 0.3s ease;

      .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px;
        background: linear-gradient(135deg, $primary, $primary-dark);
        color: white;
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);

        .modal-title {
          font-size: 16px;
          font-weight: 700;
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;

          i {
            font-size: 18px;
          }
        }

        .btn-close {
          width: 32px;
          height: 32px;
          border: none;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.25);
            transform: rotate(90deg);
          }

          i {
            font-size: 16px;
          }
        }
      }

      .modal-body {
        padding: 20px;

        .detail-grid {
          display: grid;
          gap: 16px;

          .detail-item {
            display: flex;
            flex-direction: column;
            gap: 6px;
            padding: 12px;
            background: $bg-light;
            border-radius: 8px;
            border-left: 3px solid $primary;

            .detail-label {
              font-size: 11px;
              font-weight: 700;
              color: $text-light;
              text-transform: uppercase;
              letter-spacing: 0.3px;
            }

            .detail-value {
              font-size: 13px;
              font-weight: 600;
              color: $text-main;

              &.code {
                
                font-size: 12px;
              }

              &.highlight {
                color: $red;

                &.win {
                  color: $green;
                }
              }

              .status-badge {
                display: inline-flex;
                align-items: center;
                gap: 6px;
                padding: 6px 12px;
                border-radius: 6px;
                font-size: 12px;
                font-weight: 600;
                background: $red-light;
                color: $red;

                i {
                  font-size: 13px;
                }

                &.win {
                  background: $green-light;
                  color: $green;
                }
              }
            }
          }
        }
      }
    }
  }
}

// ANIMATIONS
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter,
.modal-leave-to {
  opacity: 0;

  .modal-content {
    transform: translateY(30px);
  }
}

// RESPONSIVE
@media (max-width: 768px) {
  .game-history {
    .history-header {
      padding: 16px;
      flex-direction: column;
      gap: 10px;
      align-items: flex-start;

      .header-content h2 {
        font-size: 16px;
      }
    }

    .game-table {
      font-size: 12px;

      thead th {
        padding: 10px;
        font-size: 10px;
      }

      tbody td {
        padding: 10px;
      }
    }

    .pagination-section {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      .pagination {
        justify-content: center;
      }

      .page-info {
        text-align: center;
      }
    }

    .stats-section {
      padding: 16px;
      gap: 12px;
      grid-template-columns: repeat(2, 1fr);

      .stat-card {
        gap: 10px;
        padding: 12px;

        .stat-icon {
          width: 40px;
          height: 40px;
          font-size: 16px;
        }

        .stat-content .stat-value {
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .game-history {
    .history-header {
      padding: 12px;

      .header-content {
        h2 {
          font-size: 14px;
        }

        i {
          font-size: 18px;
        }
      }

      .header-stats .stat-badge {
        font-size: 11px;
        padding: 6px 10px;
      }
    }

    .game-table {
      font-size: 11px;
      min-width: 800px;

      thead th {
        padding: 8px;
        font-size: 9px;
      }

      tbody td {
        padding: 8px;
      }
    }

    .stats-section {
      padding: 12px;
      gap: 10px;
      grid-template-columns: repeat(2, 1fr);

      .stat-card {
        padding: 10px;
        gap: 8px;

        .stat-icon {
          width: 36px;
          height: 36px;
          font-size: 14px;
        }

        .stat-content .stat-value {
          font-size: 14px;
        }
      }
    }
  }
}
</style>