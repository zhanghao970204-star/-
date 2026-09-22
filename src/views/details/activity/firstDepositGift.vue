<template>
  <div class="first-deposit">
    <!-- Header -->
    <header class="fd-header">
      <div class="fd-header__left">
        <button class="fd-header__back" @click="$router.go(-1)">
          <van-icon name="arrow-left" size="22" color="var(--wihte-color)" />
        </button>
      </div>
      <div class="fd-header__center">
        <h1 class="fd-header__title">{{ $lang.fd_title }}</h1>
      </div>
      <div class="fd-header__right">
        <div class="fd-header__balance">
          <span class="fd-header__balance-text">{{ getCurrency }} {{ $formatNumberWithCommas(balance) }}</span>
          <button class="fd-header__balance-add" @click="goDeposit">
            <van-icon name="plus" size="12" color="#573900" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="fd-main">
      <!-- Top Section: Exclusive Offer + Total Value -->
      <div class="fd-hero">
        <p class="fd-hero__tag">{{ $lang.fd_exclusive_offer }}</p>
        <h2 class="fd-hero__subtitle">{{ $lang.fd_title }}</h2>

        <div class="fd-hero__value-wrap">
          <!-- Glow -->
          <div class="fd-hero__glow"></div>
          <div class="fd-hero__value-inner">
            <span class="fd-hero__value-label">{{ $lang.fd_total_value }}</span>
            <div class="fd-hero__value-row">
              <span class="fd-hero__value-amount">
                <span class="fd-hero__value-currency">{{ getCurrency }}</span>{{ displayValue }}
              </span>
              <span class="fd-hero__value-plus">+</span>
            </div>
            <div class="fd-hero__value-divider">
              <div class="fd-hero__value-line"></div>
              <span class="fd-hero__value-badge">{{ $lang.fd_premium_bundle }}</span>
              <div class="fd-hero__value-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Timer + Energy Bar -->
      <section class="fd-timer-section">
        <div class="fd-timer-row">
          <div class="fd-energy">
            <div class="fd-energy__track">
              <div class="fd-energy__fill" :style="{ width: energyPercent + '%' }"></div>
            </div>
            <p class="fd-energy__text">{{ $lang.fd_energy_expires }}</p>
          </div>
          <div class="fd-countdown">
            <span class="fd-countdown__label">{{ $lang.fd_limit }}</span>
            <span class="fd-countdown__digits">{{ countdownDisplay }}</span>
          </div>
        </div>
      </section>

      <!-- Reward Grid -->
      <div class="fd-grid">
        <div
          v-for="(reward, idx) in rewards"
          :key="idx"
          class="fd-grid__card"
        >
          <div class="fd-grid__icon-wrap">
            <img :src="reward.icon" class="fd-grid__icon" />
          </div>
          <span class="fd-grid__name">{{ reward.name }}</span>
          <span class="fd-grid__value">{{ $lang.fd_value }}: {{ getCurrency }}{{ reward.value }}</span>
        </div>
      </div>

      <!-- Action Area -->
      <div class="fd-action">
        <button class="fd-action__btn" @click="goDeposit">
          <van-icon name="balance-o" size="24" color="#573900" />
          <span>{{ $lang.fd_quick_deposit }}</span>
        </button>
        <div class="fd-action__info">
          <p class="fd-action__return">{{ $lang.fd_return_300 }}</p>
          <p class="fd-action__limit">{{ $lang.fd_limited_one }}</p>
        </div>
      </div>
    </main>

    <!-- Popup Modal -->
    <van-popup
      v-model:show="showPopup"
      round
      :close-on-click-overlay="true"
      class="fd-popup-wrapper"
    >
      <div class="fd-popup">
        <!-- Close -->
        <button class="fd-popup__close" @click="showPopup = false">
          <van-icon name="cross" size="20" color="rgba(255,255,255,0.3)" />
        </button>

        <!-- Header Section -->
        <section class="fd-popup__header">
          <div class="fd-popup__grid-bg"></div>
          <h1 class="fd-popup__mission">{{ $lang.fd_mission_briefing }}</h1>

          <div class="fd-popup__value-wrap">
            <span class="fd-popup__value-label">{{ $lang.fd_total_reward_value }}</span>
            <div class="fd-popup__value-glow"></div>
            <div class="fd-popup__value-row">
              <span class="fd-popup__value-currency">{{ getCurrency }}</span>
              <span class="fd-popup__value-amount">{{ totalValue }}</span>
              <span class="fd-popup__value-plus">+</span>
            </div>
            <span class="fd-popup__value-subtitle">
              {{ $lang.fd_title_short }} <span class="fd-popup__value-highlight">{{ $lang.fd_gift }}</span>
            </span>
          </div>

          <!-- Countdown in popup -->
          <div class="fd-popup__timer">
            <span class="fd-popup__timer-label">{{ $lang.fd_critical_deadline }}</span>
            <span class="fd-popup__timer-digits">{{ countdownDisplay }}</span>
          </div>
        </section>

        <!-- Action Section -->
        <section class="fd-popup__action">
          <div class="fd-popup__energy">
            <div class="fd-popup__energy-track">
              <div class="fd-popup__energy-fill" :style="{ width: energyPercent + '%' }"></div>
              <div class="fd-popup__energy-marker" :style="{ left: energyPercent + '%' }"></div>
            </div>
            <p class="fd-popup__energy-text">{{ $lang.fd_energy_critical }}</p>
          </div>

          <button class="fd-popup__btn" @click="goDeposit">{{ $lang.fd_claim_now }}</button>
          <p class="fd-popup__disclaimer">{{ $lang.fd_offer_ends_energy }}</p>
        </section>
      </div>
    </van-popup>

    <!-- Background Ambient -->
    <div class="fd-ambient">
      <div class="fd-ambient__green"></div>
      <div class="fd-ambient__yellow"></div>
    </div>
  </div>
</template>

<script>
import { TreasureBoxInit } from '@/api/common'

export default {
  name: 'FirstDepositGift',
  data() {
    return {
      showPopup: false,
      countdownSeconds: 86399,
      countdownTimer: null,
      balance: 0,
      totalValue: 178,
      displayValue: 0,
      energyPercent: 65,
      rewards: [
        {
          name: 'Spin Voucher',
          value: 50,
          icon: require('../../../assets/img/activity/activity_icon/first_deposit/1.png')
        },
        {
          name: 'Cash Bundle',
          value: 100,
          icon: require('../../../assets/img/activity/activity_icon/first_deposit/2.png')
        },
        {
          name: 'Entry Pass',
          value: 30,
          icon: require('../../../assets/img/activity/activity_icon/first_deposit/3.png')
        },
        {
          name: 'Crystal Shard',
          value: 20,
          icon: require('../../../assets/img/activity/activity_icon/first_deposit/4.png')
        }
      ]
    }
  },
  computed: {
    countdownDisplay() {
      const h = Math.floor(this.countdownSeconds / 3600)
      const m = Math.floor((this.countdownSeconds % 3600) / 60)
      const s = this.countdownSeconds % 60
      return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
      )
    }
  },
  mounted() {
    this.initData()
    this.startCountdown()
    this.animateValue()
  },
  beforeUnmount() {
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },
  methods: {
    async initData() {
      try {
        const res = await TreasureBoxInit({})
        if (res && res.data) {
          const data = res.data
          if (data.balance !== undefined) {
            this.balance = data.balance
          }
          if (data.totalValue) {
            this.totalValue = data.totalValue
          }
          if (data.countdownSeconds) {
            this.countdownSeconds = data.countdownSeconds
          }
          if (data.energyPercent) {
            this.energyPercent = data.energyPercent
          }
          if (data.rewards) {
            this.rewards = data.rewards
          }
        }
      } catch (e) {
        console.log('initData error', e)
      }
    },
    startCountdown() {
      this.countdownTimer = setInterval(() => {
        if (this.countdownSeconds > 0) {
          this.countdownSeconds--
          // Decrease energy slightly with time
          this.energyPercent = Math.max(0, this.energyPercent - 0.001)
        } else {
          clearInterval(this.countdownTimer)
        }
      }, 1000)
    },
    goDeposit() {
      this.showPopup = false
      this.$jumpTo('/rechargeCont')
    },
    openPopup() {
      this.showPopup = true
    },
    animateValue() {
      const duration = 2000
      const target = this.totalValue
      let startTime = null
      const step = (timestamp) => {
        if (!startTime) startTime = timestamp
        const progress = Math.min((timestamp - startTime) / duration, 1)
        // easeOutExpo for a fast start that slows down
        const eased = 1 - Math.pow(1 - progress, 3)
        this.displayValue = Math.floor(eased * target)
        if (progress < 1) {
          requestAnimationFrame(step)
        } else {
          this.displayValue = target
        }
      }
      requestAnimationFrame(step)
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@yellow: #ffa300;
@red: #dc2626;
@bg-dark: #1f1c17;
@card-dark: #15110a;

.first-deposit {
  min-height: 100vh;
  background: @bg-dark;
  color: #f1f5f9;
  position: relative;
  overflow: hidden;
}

// ====== HEADER ======
.fd-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: @bg-dark;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  height: 56px;
  display: flex;
  align-items: center;
  padding: 0 16px;

  &__left {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__back {
    padding: 4px;
    background: none;
    border: none;
    cursor: pointer;
    border-radius: 50%;
  }

  &__center {
    flex: 1;
    text-align: center;
    padding: 0 8px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: @wihte-color;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__balance {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 9999px;
    padding: 4px 4px 4px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    border: 1px solid rgba(100, 116, 139, 0.3);

    &-text {
      font-size: 14px;
      font-weight: 700;
      color: @wihte-color;
      white-space: nowrap;
    }

    &-add {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: @primary;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
    }
  }
}

// ====== MAIN ======
.fd-main {
  padding: 80px 16px 100px;
  max-width: 450px;
  margin: 0 auto;
}

// ====== HERO ======
.fd-hero {
  text-align: center;
  padding-top: 32px;
  padding-bottom: 48px;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__tag {
    font-size: 12px;
    font-weight: 700;
    color: @primary;
    letter-spacing: 4px;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  &__subtitle {
    font-size: 18px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    opacity: 0.6;
    letter-spacing: 0.5px;
    margin-bottom: 40px;
  }

  &__value-wrap {
    position: relative;
  }

  &__glow {
    position: absolute;
    inset: -48px;
    background: fade(@yellow, 10%);
    filter: blur(60px);
    border-radius: 50%;
  }

  &__value-inner {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__value-label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 700;
    letter-spacing: 5px;
    text-transform: uppercase;
    margin-bottom: 0;
  }

  &__value-row {
    display: flex;
    align-items: baseline;
  }

  &__value-amount {
    font-size: 110px;
    line-height: 0.9;
    font-weight: 900;
    font-style: italic;
    color: @yellow;
    filter: drop-shadow(0 0 30px fade(@yellow, 40%));
  }

  &__value-currency {
    font-size: 40px;
    vertical-align: top;
    margin-right: 4px;
  }

  &__value-plus {
    font-size: 36px;
    font-weight: 900;
    font-style: italic;
    color: @yellow;
    margin-left: 8px;
    filter: drop-shadow(0 0 15px fade(@yellow, 30%));
  }

  &__value-divider {
    margin-top: 32px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__value-line {
    height: 1px;
    width: 24px;
    background: linear-gradient(to right, transparent, fade(@primary, 50%));

    &:last-child {
      background: linear-gradient(to left, transparent, fade(@primary, 50%));
    }
  }

  &__value-badge {
    font-size: 10px;
    font-weight: 900;
    color: @primary;
    text-transform: uppercase;
    letter-spacing: 3px;
  }
}

// ====== TIMER SECTION ======
.fd-timer-section {
  padding: 0 16px 32px;
}

.fd-timer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.fd-energy {
  flex: 1;

  &__track {
    width: 100%;
    height: 12px;
    background: rgba(15, 23, 42, 1);
    border-radius: 9999px;
    padding: 2px;
    box-shadow:
      inset 0 -8px 12px rgba(0, 0, 0, 0.6),
      0 10px 20px rgba(0, 0, 0, 0.8);
    border: 1px solid rgba(255, 162, 0, 0.35);
    margin-bottom: 4px;
  }

  &__fill {
    height: 100%;
    background: linear-gradient(to right, #e9a843, @primary);
    border-radius: 9999px;
    box-shadow: 0 0 8px @primary;
    transition: width 1s linear;
  }

  &__text {
    font-size: 8px;
    color: #a89b7c;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 2px;
  }
}

.fd-countdown {
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  &__label {
    font-size: 10px;
    color: rgba(255, 255, 255, 0.4);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    line-height: 1;
  }

  &__digits {
    font-size: 24px;
    font-weight: 900;
    letter-spacing: 1px;
    color: @red;
    text-shadow: 0 0 10px fade(@red, 50%);
    filter: drop-shadow(0 0 10px fade(@red, 50%));
  }
}

// ====== REWARD GRID ======
.fd-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 40px;

  &__card {
    background: rgba(30, 41, 59, 0.5);
    border: 1px solid rgba(100, 116, 139, 0.3);
    border-radius: 10px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  &__icon-wrap {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
  }

  &__icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__name {
    font-size: 12px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: -0.3px;
  }

  &__value {
    font-size: 10px;
    font-weight: 700;
    color: @primary;
  }
}

// ====== ACTION ======
.fd-action {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;

  &__btn {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    height: 64px;
    border-radius: 10px;
    border: none;
    font-weight: 900;
    font-size: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    box-shadow: 0 0 20px fade(@primary, 40%);
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;

    &:active {
      transform: scale(0.95);
    }
  }

  &__info {
    text-align: center;
  }

  &__return {
    font-size: 14px;
    font-weight: 700;
    color: @primary;
  }

  &__limit {
    font-size: 11px;
    color: #a89b7c;
  }
}

// ====== POPUP ======
.fd-popup-wrapper {
  background: transparent !important;
  overflow: visible !important;
}

.fd-popup {
  position: relative;
  width: 100%;
  max-width: 380px;
  background: @bg-dark;
  border: 4px solid rgba(30, 41, 59, 1);
  border-radius: 40px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);

  &__close {
    position: absolute;
    top: 16px;
    right: 16px;
    z-index: 60;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__header {
    position: relative;
    width: 100%;
    padding: 40px 24px 24px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    background: rgba(15, 23, 42, 0.4);
  }

  &__grid-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(fade(@primary, 10%) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }

  &__mission {
    font-size: 14px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 48px;
    z-index: 10;
  }

  &__value-wrap {
    z-index: 10;
    width: 100%;
    margin-bottom: 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__value-label {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.5);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 5px;
    margin-bottom: 16px;
  }

  &__value-glow {
    position: absolute;
    inset: -32px;
    background: fade(@yellow, 10%);
    filter: blur(48px);
    border-radius: 50%;
  }

  &__value-row {
    display: flex;
    align-items: flex-start;
    position: relative;
  }

  &__value-currency {
    font-size: 36px;
    font-weight: 900;
    color: @yellow;
    margin-top: 24px;
  }

  &__value-amount {
    font-size: 128px;
    line-height: 1;
    font-weight: 900;
    color: @yellow;
    letter-spacing: -4px;
    filter: drop-shadow(0 0 30px fade(@yellow, 40%));
  }

  &__value-plus {
    font-size: 36px;
    font-weight: 900;
    color: @yellow;
    margin-top: 24px;
    margin-left: 4px;
  }

  &__value-subtitle {
    font-size: 18px;
    font-weight: 900;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-top: 8px;
  }

  &__value-highlight {
    color: @yellow;
  }

  &__timer {
    z-index: 10;
    width: 100%;
    max-width: 280px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    padding: 16px;
    border-radius: 16px;
    border: 1px solid fade(@red, 20%);

    &-label {
      font-size: 10px;
      color: fade(@red, 80%);
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 4px;
      margin-bottom: 8px;
    }

    &-digits {
      font-size: 48px;
      font-weight: 900;
      letter-spacing: -1px;
      color: @red;
      text-shadow: 0 0 20px fade(@red, 80%);
      filter: drop-shadow(0 0 20px fade(@red, 80%));
    }
  }

  &__action {
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(15, 23, 42, 0.2);
    padding-top: 48px;
  }

  &__energy {
    width: 100%;
    margin-bottom: 8px;

    &-track {
      width: 100%;
      height: 12px;
      background: rgba(2, 6, 23, 1);
      border-radius: 9999px;
      padding: 2px;
      box-shadow:
        inset 0 -4px 8px rgba(0, 0, 0, 0.6),
        0 5px 15px rgba(0, 0, 0, 0.8);
      border: 1px solid rgba(255, 162, 0, 0.35);
      margin-bottom: 8px;
      position: relative;
    }

    &-fill {
      height: 100%;
      background: linear-gradient(to right, #e9a843, @primary);
      border-radius: 9999px;
      box-shadow: 0 0 10px @primary;
      transition: width 1s linear;
    }

    &-marker {
      position: absolute;
      top: -4px;
      width: 1px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
    }

    &-text {
      font-size: 9px;
      color: #a89b7c;
      text-transform: uppercase;
      font-weight: 900;
      letter-spacing: 2px;
    }
  }

  &__btn {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-weight: 900;
    font-size: 24px;
    padding: 20px;
    border-radius: 12px;
    border: none;
    text-transform: uppercase;
    letter-spacing: -0.5px;
    box-shadow:
      0 6px 0 #df8a1b,
      0 0 20px fade(@primary, 40%);
    cursor: pointer;
    animation: pulse-glow 2s infinite ease-in-out;

    &:active {
      box-shadow: 0 0 20px fade(@primary, 40%);
      transform: translateY(6px);
    }
  }

  &__disclaimer {
    margin-top: 16px;
    font-size: 8px;
    color: rgba(100, 116, 139, 1);
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 3px;
  }
}

@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 6px 0 #df8a1b, 0 0 20px 2px fade(@primary, 40%); }
  50% { box-shadow: 0 6px 0 #df8a1b, 0 0 30px 6px fade(@primary, 60%); }
}

// ====== AMBIENT ======
.fd-ambient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
  overflow: hidden;

  &__green {
    position: absolute;
    top: -10%;
    left: -10%;
    width: 40%;
    height: 40%;
    background: fade(@primary, 5%);
    filter: blur(120px);
    border-radius: 50%;
  }

  &__yellow {
    position: absolute;
    bottom: -10%;
    right: -10%;
    width: 40%;
    height: 40%;
    background: fade(@yellow, 5%);
    filter: blur(120px);
    border-radius: 50%;
  }
}

// ====== RESPONSIVE ======
@media (min-width: 769px) {
  .fd-main {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
