<template>
  <div class="lucky-wheel-pro">
    <!-- Animated Background -->
    <div class="background-elements">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <!-- Header Section -->
    <div class="pro-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo-icon">🎰</div>
          <div class="logo-text">
            <h1>SPIN FORTUNE</h1>
            <p>Premium Lucky Wheel</p>
          </div>
        </div>

        <div class="user-stats">
          <div class="stat-item">
            <div class="stat-label">💎 Diamonds</div>
            <div class="stat-value">{{ userPoints }}</div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (userPoints / 50000) * 100 + '%' }"></div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">🎲 Spins Left</div>
            <div class="stat-value">{{ spinsLeft }}/{{ maxSpins }}</div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (spinsLeft / maxSpins) * 100 + '%' }"></div>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-label">⭐ Level</div>
            <div class="stat-value">{{ userLevel }}</div>
            <div class="stat-bar">
              <div class="stat-progress" :style="{ width: (levelProgress / 100) * 100 + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="pro-content">
      <!-- Left Sidebar - Prizes Info -->
      <div class="left-sidebar">
        <div class="sidebar-card prizes-showcase">
          <div class="card-header">
            <h2>Available Prizes</h2>
            <span class="badge">{{ prizes.length }} Items</span>
          </div>

          <div class="prizes-grid">
            <div 
              v-for="(prize, index) in prizes"
              :key="index"
              class="prize-card"
              :class="{ highlight: selectedPrizeIndex === index }"
              @mouseenter="selectedPrizeIndex = index"
            >
              <div class="prize-card-header" :style="{ background: prize.color }">
                <div class="prize-rarity" :class="prize.rarity">{{ prize.rarity }}</div>
                <div class="prize-icon-large">{{ prize.icon }}</div>
              </div>
              <div class="prize-card-body">
                <h4>{{ prize.name }}</h4>
                <p>{{ prize.description }}</p>
                <div class="prize-meta">
                  <span class="chance">{{ prize.probability }}%</span>
                  <span class="value">+{{ prize.reward.amount }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistics -->
        <div class="sidebar-card stats-card">
          <h3>Your Statistics</h3>
          <div class="stats-content">
            <div class="stat-row">
              <span>Total Spins</span>
              <strong>{{ totalSpins }}</strong>
            </div>
            <div class="stat-row">
              <span>Wins</span>
              <strong class="text-success">{{ totalWins }}</strong>
            </div>
            <div class="stat-row">
              <span>Best Prize</span>
              <strong class="text-warning">{{ bestPrize }}</strong>
            </div>
            <div class="stat-row">
              <span>Streak</span>
              <strong class="text-info">{{ currentStreak }}x</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- Center - Wheel Section -->
      <div class="center-section">
        <!-- Wheel Container -->
        <div class="wheel-container">
          <!-- Light Effects -->
          <div class="light-rays">
            <div class="ray" v-for="i in 12" :key="`ray-${i}`" :style="{ transform: `rotate(${i * 30}deg)` }"></div>
          </div>

          <!-- Pointer/Indicator -->
          <div class="wheel-pointer">
            <div class="pointer-inner"></div>
          </div>

          <!-- Main Wheel -->
          <div class="wheel-frame">
            <svg
              ref="wheelSvg"
              class="wheel-svg"
              :class="{ 'is-spinning': isSpinning }"
              :style="{ transform: `rotate(${wheelRotation}deg)` }"
              viewBox="0 0 500 500"
              width="600"
              height="600"
            >
              <!-- Wheel shadow -->
              <defs>
                <filter id="wheelShadow" x="-50%" y="-50%" width="200%" height="200%">
                  <feDropShadow dx="0" dy="4" stdDeviation="6" flood-opacity="0.3"/>
                </filter>
                <radialGradient id="wheelGrad" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.1" />
                  <stop offset="100%" style="stop-color:#000000;stop-opacity:0.1" />
                </radialGradient>
              </defs>

              <!-- Background Circle with Gradient -->
              <circle cx="250" cy="250" r="240" fill="url(#wheelGrad)" stroke="#fff" stroke-width="2" filter="url(#wheelShadow)"/>

              <!-- Prize Segments -->
              <g v-for="(prize, index) in prizes" :key="`segment-${index}`">
                <!-- Main segment -->
                <path
                  :d="getSegmentPath(index)"
                  :fill="prize.color"
                  stroke="#ffffff"
                  stroke-width="3"
                  opacity="0.95"
                />

                <!-- Segment shine effect -->
                <path
                  :d="getSegmentPath(index)"
                  :fill="'url(#wheelGrad)'"
                  stroke="none"
                  opacity="0.2"
                />

                <!-- Icon -->
                <g :transform="`rotate(${getSegmentAngle(index)} 250 250)`">
                  <text
                    x="250"
                    y="95"
                    text-anchor="middle"
                    fill="#ffffff"
                    font-size="36"
                    font-weight="bold"
                    filter="url(#wheelShadow)"
                    class="segment-icon"
                  >
                    {{ prize.icon }}
                  </text>
                </g>

                <!-- Text with outline for better readability -->
                <g :transform="`rotate(${getSegmentAngle(index)} 250 250)`">
                  <text
                    x="250"
                    y="145"
                    text-anchor="middle"
                    fill="#ffffff"
                    font-size="14"
                    font-weight="bold"
                    stroke="#333333"
                    stroke-width="1"
                    class="segment-text"
                  >
                    {{ prize.name }}
                  </text>
                </g>
              </g>

              <!-- Center Circle - Decorative -->
              <circle cx="250" cy="250" r="70" fill="#1a1a2e" stroke="#FFD700" stroke-width="3"/>
              <circle cx="250" cy="250" r="60" fill="url(#wheelGrad)" stroke="#FFA500" stroke-width="2"/>
              
              <!-- Center Decoration Ring -->
              <circle cx="250" cy="250" r="55" fill="none" stroke="#FFD700" stroke-width="1" opacity="0.5"/>
              <circle cx="250" cy="250" r="50" fill="none" stroke="#FFA500" stroke-width="1" opacity="0.5"/>

              <!-- Center Text -->
              <text
                x="250"
                y="250"
                text-anchor="middle"
                dominant-baseline="middle"
                fill="#FFD700"
                font-size="28"
                font-weight="bold"
                letter-spacing="2"
              >
                SPIN
              </text>
            </svg>

            <!-- Wheel Border Ring -->
            <div class="wheel-ring"></div>
          </div>
        </div>

        <!-- Control Panel -->
        <div class="control-panel">
          <div class="spin-info-box">
            <div class="info-row">
              <span class="info-label">Cost per Spin:</span>
              <span class="info-value highlight">{{ spinCost }} 💎</span>
            </div>
            <div class="info-row">
              <span class="info-label">Next Reset:</span>
              <span class="info-value">{{ resetTime }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Multiplier:</span>
              <span class="info-value" :class="{ 'text-warning': multiplier > 1 }">
                {{ multiplier }}x
              </span>
            </div>
          </div>

          <!-- Spin Button -->
          <button
            class="spin-button-pro"
            :class="{ 
              'is-disabled': isSpinning || spinsLeft === 0 || userPoints < spinCost,
              'is-spinning': isSpinning
            }"
            :disabled="isSpinning || spinsLeft === 0 || userPoints < spinCost"
            @click="spinWheel"
          >
            <div class="button-content">
              <span v-if="!isSpinning && spinsLeft > 0 && userPoints >= spinCost" class="button-text">
                TAP TO SPIN
              </span>
              <span v-else-if="spinsLeft === 0" class="button-text">NO SPINS LEFT</span>
              <span v-else-if="userPoints < spinCost" class="button-text">INSUFFICIENT FUNDS</span>
              <span v-else class="button-text spinning-text">SPINNING...</span>
              
              <div class="button-glow"></div>
            </div>
          </button>

          <!-- Quick Buy Spins -->
          <div class="quick-actions">
            <button class="action-btn" @click="buySpins(3)" :title="`Buy 3 spins for ${spinCost * 3 * 0.9} 💎`">
              <span class="action-icon">+3</span>
              <span class="action-label">Buy Spins</span>
            </button>
            <button class="action-btn" @click="useBooster" :title="boosterAvailable ? 'Use Booster' : 'No Booster'">
              <span class="action-icon">⚡</span>
              <span class="action-label">Booster</span>
            </button>
            <button class="action-btn" @click="showPrizeDetails" title="View Details">
              <span class="action-icon">ℹ️</span>
              <span class="action-label">Details</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Right Sidebar - History & Rewards -->
      <div class="right-sidebar">
        <!-- Recent Wins -->
        <div class="sidebar-card recent-wins">
          <div class="card-header">
            <h2>Recent Wins</h2>
            <span class="badge">Today</span>
          </div>

          <div class="wins-container">
            <div v-if="winHistory.length === 0" class="empty-state">
              <div class="empty-icon">🎰</div>
              <p>No wins yet</p>
              <small>Start spinning to win!</small>
            </div>

            <div v-for="(win, index) in winHistory" :key="index" class="win-item" :class="{ 'new-win': index === 0 }">
              <div class="win-avatar" :style="{ background: win.color }">{{ win.icon }}</div>
              <div class="win-details">
                <h4>{{ win.name }}</h4>
                <small class="win-time">{{ formatTime(win.time) }}</small>
              </div>
              <div class="win-value">+{{ win.reward.amount }}</div>
            </div>
          </div>
        </div>

        <!-- Pending Rewards -->
        <div v-if="pendingRewards.length > 0" class="sidebar-card pending-rewards">
          <div class="card-header">
            <h2>Pending Rewards</h2>
            <span class="badge">{{ pendingRewards.length }}</span>
          </div>

          <div class="rewards-list">
            <div v-for="(reward, index) in pendingRewards" :key="index" class="reward-item">
              <div class="reward-icon" :style="{ background: reward.color }">{{ reward.icon }}</div>
              <div class="reward-info">
                <strong>{{ reward.name }}</strong>
                <small>{{ reward.description }}</small>
              </div>
              <button class="claim-reward-btn" @click="claimReward(index)">Claim</button>
            </div>
          </div>
        </div>

        <!-- Achievements -->
        <div class="sidebar-card achievements">
          <div class="card-header">
            <h2>Achievements</h2>
            <span class="badge">{{ unlockedAchievements }}/{{ achievements.length }}</span>
          </div>

          <div class="achievements-grid">
            <div 
              v-for="(achievement, index) in achievements" 
              :key="index"
              class="achievement-badge"
              :class="{ unlocked: achievement.unlocked }"
              :title="achievement.description"
            >
              {{ achievement.icon }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Result Modal -->
    <transition name="modal-fade">
      <div v-if="showResultModal" class="modal-overlay" @click="closeResultModal">
        <div class="modal-content" @click.stop>
          <button class="modal-close" @click="closeResultModal">✕</button>

          <!-- Big Win Animation -->
          <div v-if="isBigWin" class="big-win-container">
            <div class="confetti" v-for="i in 20" :key="`confetti-${i}`"></div>
            <h2 class="big-win-text">JACKPOT!</h2>
          </div>

          <!-- Result Container -->
          <div class="result-display">
            <div class="result-icon-large" :style="{ color: currentWin.color }">
              {{ currentWin.icon }}
            </div>
            <h2 class="result-title">{{ currentWin.name }}</h2>
            <p class="result-description">{{ currentWin.description }}</p>

            <div class="result-reward">
              <span class="reward-label">You Won:</span>
              <span class="reward-amount">+{{ currentWin.reward.amount }}</span>
            </div>

            <div v-if="spinBonus > 0" class="bonus-indicator">
              <span class="bonus-icon">⭐</span>
              <span>BONUS: +{{ spinBonus }}%</span>
            </div>
          </div>

          <!-- Actions -->
          <div class="modal-actions">
            <button class="btn-primary" @click="collectReward">
              <span class="btn-text">Collect Reward</span>
              <span class="btn-icon">🎁</span>
            </button>
            <button class="btn-secondary" @click="closeResultModal">Continue</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Premium Features Popup -->
    <transition name="modal-fade">
      <div v-if="showPremiumModal" class="modal-overlay" @click="showPremiumModal = false">
        <div class="modal-content premium-modal" @click.stop>
          <button class="modal-close" @click="showPremiumModal = false">✕</button>
          <h2>Premium Features</h2>
          <div class="premium-features">
            <div class="feature-item">
              <span class="feature-icon">⚡</span>
              <div>
                <strong>Booster</strong>
                <small>2x spin rewards for 10 spins</small>
              </div>
              <button class="btn-buy">{{ boosterPrice }} 💎</button>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🎲</span>
              <div>
                <strong>Daily Spins</strong>
                <small>+5 extra spins every day</small>
              </div>
              <button class="btn-buy">{{ dailySpinsPrice }} 💎</button>
            </div>
            <div class="feature-item">
              <span class="feature-icon">👑</span>
              <div>
                <strong>VIP Pass</strong>
                <small>Unlimited spins + 50% discount</small>
              </div>
              <button class="btn-buy">{{ vipPassPrice }} 💎</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Sound & Particle Effects -->
    <div v-if="showParticles" class="particles-container">
      <div class="particle" v-for="i in particleCount" :key="`particle-${i}`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LuckyWheelPro',
  data() {
    return {
      // User Data
      userPoints: 15000,
      userLevel: 12,
      levelProgress: 65,
      maxSpins: 5,
      spinsLeft: 3,
      
      // Wheel Data
      wheelRotation: 0,
      isSpinning: false,
      spinDuration: 6000, // milliseconds
      spinCost: 100,
      spinBonus: 0,
      resetTime: '02:15:30',
      multiplier: 1,
      boosterAvailable: true,
      
      // Prize Data
      selectedPrizeIndex: 0,
      currentWin: null,
      isBigWin: false,
      showResultModal: false,
      showPremiumModal: false,
      
      // History & Stats
      winHistory: [],
      pendingRewards: [],
      totalSpins: 47,
      totalWins: 18,
      bestPrize: 'Jackpot x1000',
      currentStreak: 3,
      
      // Particles
      showParticles: false,
      particleCount: 30,
      
      // Premium Prices
      boosterPrice: 500,
      dailySpinsPrice: 300,
      vipPassPrice: 2000,

      // Achievements
      achievements: [
        { icon: '🎯', description: '10 Spins', unlocked: true },
        { icon: '🌟', description: '50 Spins', unlocked: true },
        { icon: '👑', description: 'Get Jackpot', unlocked: false },
        { icon: '💰', description: 'Win 1000 Diamonds', unlocked: true },
        { icon: '⚡', description: 'Use Booster', unlocked: false },
        { icon: '🔥', description: 'Win Streak 5x', unlocked: false },
      ],

      prizes: [
        {
          name: 'Gold x100',
          description: 'Premium Currency',
          icon: '🪙',
          color: '#FFD700',
          rarity: 'Common',
          reward: { type: 'gold', amount: 100 },
          probability: 20
        },
        {
          name: 'Silver x50',
          description: 'Secondary Currency',
          icon: '🔗',
          color: '#C0C0C0',
          rarity: 'Common',
          reward: { type: 'silver', amount: 50 },
          probability: 20
        },
        {
          name: 'Gems x20',
          description: 'Rare Crystals',
          icon: '💎',
          color: '#00CED1',
          rarity: 'Rare',
          reward: { type: 'gem', amount: 20 },
          probability: 15
        },
        {
          name: 'Mystery Box',
          description: 'Surprise Treasure',
          icon: '🎁',
          color: '#FF69B4',
          rarity: 'Rare',
          reward: { type: 'box', amount: 1 },
          probability: 15
        },
        {
          name: 'Premium Ticket',
          description: 'Exclusive Reward',
          icon: '🎫',
          color: '#9370DB',
          rarity: 'Epic',
          reward: { type: 'ticket', amount: 1 },
          probability: 8
        },
        {
          name: 'JACKPOT x1000',
          description: 'ULTIMATE PRIZE!',
          icon: '👑',
          color: '#FF4500',
          rarity: 'Legendary',
          reward: { type: 'jackpot', amount: 1000 },
          probability: 2
        }
      ]
    }
  },

  computed: {
    segmentAngle() {
      return 360 / this.prizes.length;
    },
    unlockedAchievements() {
      return this.achievements.filter(a => a.unlocked).length;
    }
  },

  methods: {
    getSegmentAngle(index) {
      return index * this.segmentAngle + this.segmentAngle / 2;
    },

    getSegmentPath(index) {
      const angle = this.segmentAngle;
      const startAngle = (index * angle - 90) * (Math.PI / 180);
      const endAngle = ((index + 1) * angle - 90) * (Math.PI / 180);
      
      const x1 = 250 + 240 * Math.cos(startAngle);
      const y1 = 250 + 240 * Math.sin(startAngle);
      const x2 = 250 + 240 * Math.cos(endAngle);
      const y2 = 250 + 240 * Math.sin(endAngle);

      const largeArc = angle > 180 ? 1 : 0;

      return `M 250 250 L ${x1} ${y1} A 240 240 0 ${largeArc} 1 ${x2} ${y2} Z`;
    },

    spinWheel() {
      if (this.isSpinning || this.spinsLeft === 0 || this.userPoints < this.spinCost) {
        return;
      }

      this.isSpinning = true;
      this.userPoints -= this.spinCost;
      this.spinsLeft -= 1;
      this.totalSpins += 1;

      // Select winning prize
      const winnerIndex = this.selectWinner();
      const prize = this.prizes[winnerIndex];

      // Calculate realistic spinning motion
      const targetRotation = this.calculateSpinRotation(winnerIndex);
      const startRotation = this.wheelRotation;

      // Easing function for realistic deceleration
      const spinAnimation = (progress) => {
        // Ease-out cubic for natural deceleration
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const rotation = startRotation + (targetRotation - startRotation) * easeProgress;
        this.$refs.wheelSvg.style.transform = `rotate(${rotation}deg)`;
      };

      // Animate with custom timing
      const startTime = performance.now();
      const animate = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / this.spinDuration, 1);

        spinAnimation(progress);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          // Animation complete
          this.wheelRotation = targetRotation;
          this.isSpinning = false;
          this.currentWin = prize;
          this.isBigWin = winnerIndex === 5; // Jackpot
          this.spinBonus = this.multiplier > 1 ? 50 : 0;
          
          // Add to history
          this.winHistory.unshift({
            ...prize,
            time: new Date()
          });

          if (this.winHistory.length > 10) {
            this.winHistory.pop();
          }

          this.pendingRewards.push(prize);
          this.totalWins += 1;
          this.currentStreak += 1;
          
          // Show particles
          this.showParticles = true;
          setTimeout(() => { this.showParticles = false; }, 1000);

          // Show result modal
          this.showResultModal = true;

          // Update achievements
          this.checkAchievements();
        }
      };

      requestAnimationFrame(animate);
    },

    calculateSpinRotation(winnerIndex) {
      // center of the segment (deg)
      const segmentCenter = winnerIndex * this.segmentAngle + this.segmentAngle / 2;

      // rotate so that segmentCenter ends at top (0deg)
      const baseTarget = 360 - segmentCenter;

      // small random offset within the segment to avoid deterministic stops
      const maxOffset = this.segmentAngle * 0.4; // +/- 40% of a segment
      const randomOffset = (Math.random() - 0.5) * 2 * maxOffset;

      // add a random number of full rotations for more natural feel
      const fullRotations = 5 + Math.floor(Math.random() * 3); // 5-7 full spins
      const spins = fullRotations * 360;

      return this.wheelRotation + spins + baseTarget + randomOffset;
    },

    selectWinner() {
      // use the sum of probabilities (don't assume 100)
      const totalProb = this.prizes.reduce((sum, p) => sum + (p.probability || 0), 0);
      const rand = Math.random() * totalProb;
      let cumulative = 0;

      for (let i = 0; i < this.prizes.length; i++) {
        cumulative += this.prizes[i].probability || 0;
        if (rand <= cumulative) {
          return i;
        }
      }

      // fallback: if something unexpected, pick random index instead of always 0
      return Math.floor(Math.random() * this.prizes.length);
    },

    collectReward() {
      if (this.currentWin) {
        this.userPoints += this.currentWin.reward.amount * this.multiplier;
        
        // Remove from pending
        this.pendingRewards = this.pendingRewards.filter(r => r.name !== this.currentWin.name);
        
        this.closeResultModal();
      }
    },

    claimReward(index) {
      const reward = this.pendingRewards[index];
      this.userPoints += reward.reward.amount;
      this.pendingRewards.splice(index, 1);
    },

    closeResultModal() {
      this.showResultModal = false;
    },

    buySpins(count) {
      const cost = Math.floor(this.spinCost * count * 0.9); // 10% discount
      if (this.userPoints >= cost) {
        this.userPoints -= cost;
        this.spinsLeft += count;
      }
    },

    useBooster() {
      if (this.boosterAvailable) {
        this.multiplier = 2;
        this.boosterAvailable = false;
        setTimeout(() => { this.boosterAvailable = true; }, 10000);
      }
    },

    showPrizeDetails() {
      this.showPremiumModal = true;
    },

    formatTime(time) {
      const now = new Date();
      const diff = Math.floor((now - time) / 1000);

      if (diff < 60) return 'Just now';
      if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
      if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
      return `${Math.floor(diff / 86400)}d ago`;
    },

    checkAchievements() {
      // Check 10 spins
      if (this.totalSpins >= 10 && !this.achievements[0].unlocked) {
        this.achievements[0].unlocked = true;
      }
      // Check 50 spins
      if (this.totalSpins >= 50 && !this.achievements[1].unlocked) {
        this.achievements[1].unlocked = true;
      }
    }
  },

  mounted() {
    this.winHistory = [
      { ...this.prizes[2], time: new Date(Date.now() - 300000) },
      { ...this.prizes[0], time: new Date(Date.now() - 600000) }
    ];
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.lucky-wheel-pro {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  color: #fff;
  font-family: 'Inter', 'Segoe UI', sans-serif;
  position: relative;
  overflow: hidden;
}

/* Animated Background */
.background-elements {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
  animation: float 20s infinite ease-in-out;
}

.orb-1 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, #667eea, transparent);
  top: -100px;
  left: -100px;
  animation-delay: 0s;
}

.orb-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #764ba2, transparent);
  bottom: -50px;
  right: -50px;
  animation-delay: 5s;
}

.orb-3 {
  width: 250px;
  height: 250px;
  background: radial-gradient(circle, #f093fb, transparent);
  bottom: 100px;
  left: 50%;
  animation-delay: 10s;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(20px, -20px); }
  50% { transform: translate(-20px, 20px); }
  75% { transform: translate(20px, 20px); }
}

/* Header */
.pro-header {
  position: relative;
  z-index: 10;
  background: rgba(15, 12, 41, 0.7);
  backdrop-filter: blur(10px);
  padding: 20px 40px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header-content {
  max-width: 1600px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 15px;
}

.logo-icon {
  font-size: 2.5em;
  filter: drop-shadow(0 0 10px rgba(255, 215, 0, 0.5));
}

.logo-text h1 {
  font-size: 1.8em;
  font-weight: 800;
  letter-spacing: 2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-text p {
  font-size: 0.8em;
  color: #aaa;
  letter-spacing: 1px;
}

.user-stats {
  display: flex;
  gap: 30px;
}

.stat-item {
  background: rgba(255, 255, 255, 0.05);
  padding: 15px 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  min-width: 150px;
}

.stat-label {
  font-size: 0.75em;
  color: #aaa;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 8px;
  display: block;
}

.stat-value {
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 8px;
  display: block;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-bar {
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.stat-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* Main Content */
.pro-content {
  position: relative;
  z-index: 10;
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px;
  display: grid;
  grid-template-columns: 320px 1fr 320px;
  gap: 30px;
  min-height: calc(100vh - 120px);
}

/* Sidebars */
.left-sidebar,
.right-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h2 {
  font-size: 1.1em;
  font-weight: 700;
}

.badge {
  background: linear-gradient(135deg, #667eea, #764ba2);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75em;
  font-weight: 600;
}

/* Prizes Grid */
.prizes-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 10px;
  max-height: 600px;
  overflow-y: auto;
}

.prize-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.prize-card:hover,
.prize-card.highlight {
  border-color: rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(5px);
}

.prize-card-header {
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  position: relative;
  overflow: hidden;
}

.prize-rarity {
  font-size: 0.7em;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
}

.prize-rarity.Common { color: #aaa; }
.prize-rarity.Rare { color: #4da8ff; }
.prize-rarity.Epic { color: #b347ff; }
.prize-rarity.Legendary { color: #ffb020; }

.prize-icon-large {
  font-size: 2.5em;
}

.prize-card-body {
  padding: 10px;
}

.prize-card-body h4 {
  font-size: 0.9em;
  margin-bottom: 3px;
}

.prize-card-body p {
  font-size: 0.75em;
  color: #aaa;
  margin-bottom: 8px;
}

.prize-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8em;
}

.chance {
  color: #aaa;
}

.value {
  color: #4da8ff;
  font-weight: 600;
}

/* Stats Card */
.stats-card .stats-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.9em;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-row:last-child {
  border-bottom: none;
}

.stat-row strong {
  color: #667eea;
  font-weight: 600;
}

.text-success { color: #4caf50 !important; }
.text-warning { color: #ff9800 !important; }
.text-info { color: #2196f3 !important; }

/* Center Section */
.center-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.wheel-container {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  min-height: 700px;
  flex: 1;
}

.light-rays {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.ray {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 2px;
  height: 200px;
  background: linear-gradient(to bottom, rgba(255, 215, 0, 0.3), transparent);
  transform-origin: top center;
  opacity: 0;
  animation: rayPulse 3s ease-in-out infinite;
}

@keyframes rayPulse {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}

.wheel-pointer {
  position: absolute;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.pointer-inner {
  width: 0;
  height: 0;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  border-top: 35px solid #FFD700;
  filter: drop-shadow(0 3px 8px rgba(255, 215, 0, 0.6));
  animation: pointerPulse 0.8s ease-in-out infinite;
}

@keyframes pointerPulse {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(1.1); }
}

.wheel-frame {
  position: relative;
  width: 600px;
  height: 600px;
}

.wheel-svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 10px 30px rgba(0, 0, 0, 0.4));
  transform-origin: center;
  transition: none;
}

.wheel-svg.is-spinning {
  filter: drop-shadow(0 15px 40px rgba(102, 126, 234, 0.5));
}

.segment-icon {
  font-weight: bold;
  text-anchor: middle;
}

.segment-text {
  text-anchor: middle;
  font-family: 'Inter', sans-serif;
  font-size: 14px;
}

.wheel-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 610px;
  height: 610px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  box-shadow: inset 0 0 30px rgba(255, 215, 0, 0.1);
}

/* Control Panel */
.control-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 20px;
}

.spin-info-box {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 20px;
}

.info-row {
  background: rgba(0, 0, 0, 0.2);
  padding: 12px;
  border-radius: 8px;
  text-align: center;
}

.info-label {
  display: block;
  font-size: 0.8em;
  color: #aaa;
  margin-bottom: 5px;
}

.info-value {
  display: block;
  font-size: 1.2em;
  font-weight: 700;
  color: #fff;
}

.info-value.highlight {
  color: #FFD700;
}

/* Spin Button Pro */
.spin-button-pro {
  width: 100%;
  padding: 20px;
  font-size: 1.1em;
  font-weight: 800;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  margin-bottom: 15px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  text-transform: uppercase;
  letter-spacing: 2px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
}

.spin-button-pro:not(.is-disabled):hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
}

.spin-button-pro.is-disabled {
  background: #555;
  cursor: not-allowed;
  opacity: 0.5;
}

.spin-button-pro.is-spinning {
  animation: spinButtonPulse 0.5s ease-in-out infinite;
}

@keyframes spinButtonPulse {
  0%, 100% { box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); }
  50% { box-shadow: 0 8px 35px rgba(255, 215, 0, 0.6); }
}

.button-content {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.button-text {
  display: inline-block;
}

.spinning-text {
  animation: spinText 1s ease-in-out infinite;
}

@keyframes spinText {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

.button-glow {
  position: absolute;
  inset: -2px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 12px;
  opacity: 0;
  z-index: -1;
}

/* Quick Actions */
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.75em;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5em;
}

.action-label {
  font-weight: 600;
  text-transform: uppercase;
}

/* Recent Wins */
.wins-container {
  max-height: 400px;
  overflow-y: auto;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #aaa;
}

.empty-icon {
  font-size: 2em;
  margin-bottom: 10px;
}

.win-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: center;
  transition: all 0.3s ease;
}

.win-item.new-win {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.5);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.win-avatar {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  flex-shrink: 0;
}

.win-details {
  flex: 1;
}

.win-details h4 {
  font-size: 0.9em;
  margin-bottom: 2px;
}

.win-time {
  color: #aaa;
  font-size: 0.8em;
}

.win-value {
  font-weight: 700;
  color: #4caf50;
  font-size: 0.9em;
}

/* Pending Rewards */
.pending-rewards .rewards-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.reward-item {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 12px;
  background: rgba(255, 215, 0, 0.1);
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 8px;
}

.reward-icon {
  width: 35px;
  height: 35px;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
  flex-shrink: 0;
}

.reward-info {
  flex: 1;
  font-size: 0.85em;
}

.reward-info strong {
  display: block;
  margin-bottom: 2px;
}

.reward-info small {
  color: #aaa;
}

.claim-reward-btn {
  padding: 6px 12px;
  background: #4caf50;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  font-size: 0.75em;
  font-weight: 600;
  transition: all 0.3s ease;
}

.claim-reward-btn:hover {
  background: #45a049;
  transform: scale(1.05);
}

/* Achievements */
.achievements-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.achievement-badge {
  width: 100%;
  aspect-ratio: 1;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.5em;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0.5;
}

.achievement-badge:hover {
  border-color: rgba(255, 255, 255, 0.3);
}

.achievement-badge.unlocked {
  opacity: 1;
  border-color: rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: linear-gradient(135deg, rgba(15, 12, 41, 0.95), rgba(48, 43, 99, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  position: relative;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-close {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 50%;
  color: white;
  font-size: 1.2em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: rotate(90deg);
}

/* Big Win Animation */
.big-win-container {
  position: relative;
  height: 100px;
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.big-win-text {
  font-size: 3em;
  font-weight: 900;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: bigWinBounce 0.6s ease infinite;
}

@keyframes bigWinBounce {
  0%, 100% { transform: scale(1) rotate(-5deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  background: #FFD700;
  border-radius: 50%;
  animation: confettiFall 2s ease-out forwards;
}

@keyframes confettiFall {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0) rotate(0);
  }
  100% {
    opacity: 0;
    /* Use a fixed horizontal offset for CSS (randomness must be applied from JS if needed) */
    transform: translateY(300px) translateX(100px) rotate(720deg);
  }
}

/* Result Display */
.result-display {
  text-align: center;
  padding: 20px 0;
}

.result-icon-large {
  font-size: 4em;
  margin-bottom: 15px;
  display: block;
  animation: resultIconBounce 0.6s ease;
}

@keyframes resultIconBounce {
  0% { transform: scale(0.5); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.result-title {
  font-size: 2em;
  margin-bottom: 10px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.result-description {
  color: #aaa;
  margin-bottom: 20px;
  font-size: 0.9em;
}

.result-reward {
  background: rgba(255, 215, 0, 0.1);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.reward-label {
  display: block;
  color: #aaa;
  font-size: 0.9em;
  margin-bottom: 10px;
}

.reward-amount {
  display: block;
  font-size: 2em;
  font-weight: 800;
  color: #FFD700;
}

.bonus-indicator {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.1), rgba(76, 175, 80, 0.2));
  border: 1px solid rgba(76, 175, 80, 0.5);
  border-radius: 8px;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  color: #4caf50;
  font-weight: 600;
}

/* Modal Actions */
.modal-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
}

.btn-primary,
.btn-secondary {
  padding: 14px;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95em;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.15);
}

/* Premium Modal */
.premium-modal {
  max-width: 600px;
}

.premium-modal h2 {
  margin-bottom: 20px;
}

.premium-features {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.feature-item {
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 15px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.feature-icon {
  font-size: 1.8em;
  flex-shrink: 0;
}

.feature-item div {
  flex: 1;
}

.feature-item strong {
  display: block;
  margin-bottom: 3px;
}

.feature-item small {
  color: #aaa;
  font-size: 0.85em;
}

.btn-buy {
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-buy:hover {
  transform: scale(1.05);
}

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter,
.modal-fade-leave-to {
  opacity: 0;
}

/* Particles */
.particles-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 999;
}

.particle {
  position: fixed;
  width: 10px;
  height: 10px;
  background: #FFD700;
  border-radius: 50%;
  animation: particleFall 1s ease-out forwards;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.8);
}
@keyframes particleFall {
  0% {
    opacity: 1;
    transform: translateY(0) translateX(0) scale(1);
  }
  100% {
    opacity: 0;
    /* Use a fixed horizontal offset for CSS (randomness must be applied from JS if needed) */
    transform: translateY(500px) translateX(150px) scale(0);
  }
}


/* Responsive */
@media (max-width: 1400px) {
  .pro-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .left-sidebar,
  .right-sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .wheel-container {
    min-height: 500px;
  }

  .wheel-frame {
    width: 400px;
    height: 400px;
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
  }

  .user-stats {
    width: 100%;
    flex-direction: column;
  }

  .spin-info-box {
    grid-template-columns: 1fr;
  }

  .left-sidebar,
  .right-sidebar {
    grid-template-columns: 1fr;
  }

  .wheel-frame {
    width: 300px;
    height: 300px;
  }

  .modal-actions {
    grid-template-columns: 1fr;
  }

  .modal-content {
    padding: 20px;
  }
}

/* Scrollbar Styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: rgba(102, 126, 234, 0.5);
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(102, 126, 234, 0.7);
}
</style>