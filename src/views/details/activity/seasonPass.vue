<template>
  <div class="season-page">
    <!-- Header -->
    <header class="sp-header">
      <button class="sp-header__btn" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="sp-header__title">{{ $lang.season_pass_title || 'Season Pass' }}</h1>
      <button class="sp-header__btn sp-header__btn--right" @click="$jumpTo('/seasonHistory')">
        <van-icon name="clock-o" size="20" color="#ffa300" />
      </button>
    </header>

    <main class="sp-main">
      <!-- Progress Section -->
      <section class="sp-progress">
        <div class="sp-progress__row">
          <div>
            <p class="sp-progress__label">{{ $lang.season_current_progress || 'Current Progress' }}</p>
            <p class="sp-progress__value">{{ currentPoints }} <span class="sp-progress__unit">PTS</span></p>
          </div>
          <p class="sp-progress__next">{{ $lang.season_next_reward || 'Next Reward' }}: {{ nextReward }} PTS</p>
        </div>
        <div class="sp-progress__bar">
          <div class="sp-progress__fill" :style="{ width: progressPercent + '%' }">
            <div class="sp-progress__fill-shine"></div>
          </div>
        </div>
      </section>

      <!-- Upgrade Pass Card -->
      <section class="sp-upgrade">
        <div class="sp-upgrade__card">
          <div class="sp-upgrade__head">
            <div>
              <h3 class="sp-upgrade__title">{{ $lang.season_upgrade_pass || 'UPGRADE PASS' }}</h3>
              <p class="sp-upgrade__subtitle">{{ $lang.season_unlock_premium || 'Unlock Premium Tiers' }}</p>
            </div>
            <!-- Treasure Chest Icon -->
            <div class="sp-chest-icon">
              <div class="sp-chest-icon__body">
                <div class="sp-chest-icon__lid"></div>
                <div class="sp-chest-icon__band sp-chest-icon__band--left"></div>
                <div class="sp-chest-icon__band sp-chest-icon__band--right"></div>
                <div class="sp-chest-icon__lock"></div>
              </div>
            </div>
          </div>

          <div class="sp-upgrade__tiers">
            <!-- Junior -->
            <div class="sp-tier">
              <div class="sp-tier__header">
                <div class="sp-shield-sm"></div>
                <span class="sp-tier__name sp-tier__name--silver">{{ $lang.season_junior || 'Junior' }}</span>
              </div>
              <p class="sp-tier__desc">{{ $lang.season_junior_desc || 'Silver rewards & standard XP boosts' }}</p>
            </div>
            <!-- Senior -->
            <div class="sp-tier">
              <div class="sp-tier__header">
                <div class="sp-chest-sm">
                  <div class="sp-chest-sm__lid"></div>
                  <div class="sp-chest-sm__lock"></div>
                </div>
                <span class="sp-tier__name sp-tier__name--gold">{{ $lang.season_senior || 'Senior' }}</span>
              </div>
              <p class="sp-tier__desc sp-tier__desc--bright">{{ $lang.season_senior_desc || 'Gold items & max XP multipliers' }}</p>
            </div>
          </div>

          <div class="sp-upgrade__actions">
            <button class="sp-btn sp-btn--silver">{{ $lang.season_unlock_junior || 'Unlock Junior' }}</button>
            <button class="sp-btn sp-btn--primary">{{ $lang.season_go_senior || 'Go Senior Pro' }}</button>
          </div>

          <!-- Decorative blurs -->
          <div class="sp-upgrade__blur sp-upgrade__blur--top"></div>
          <div class="sp-upgrade__blur sp-upgrade__blur--bottom"></div>
        </div>
      </section>

      <!-- Reward Track -->
      <section class="sp-track">
        <h2 class="sp-track__title">
          <span class="sp-track__line"></span>
          {{ $lang.season_reward_track || 'Reward Track' }}
        </h2>

        <!-- Column Headers -->
        <div class="sp-track__header">
          <div class="sp-track__col sp-track__col--pts">{{ $lang.season_points || 'Points' }}</div>
          <div class="sp-track__col">{{ $lang.season_basic || 'Basic' }}</div>
          <div class="sp-track__col">{{ $lang.season_junior || 'Junior' }}</div>
          <div class="sp-track__col">{{ $lang.season_senior || 'Senior' }}</div>
        </div>

        <!-- Milestone Rows -->
        <div class="sp-track__rows">
          <div
            v-for="(ms, idx) in milestones"
            :key="idx"
            class="sp-milestone"
          >
            <!-- Points Column -->
            <div class="sp-milestone__pts" :class="{ 'sp-milestone__pts--active': currentPoints >= ms.points - 100 }">
              <span class="sp-milestone__pts-val">{{ ms.points }}</span>
              <span class="sp-milestone__pts-label">Points</span>
            </div>

            <!-- Basic Column -->
            <div class="sp-milestone__reward" :class="{ 'sp-milestone__reward--dim': ms.basic.status === 'locked' }">
              <div class="sp-coin-icon">
                <span class="sp-coin-icon__letter">G</span>
              </div>
              <span class="sp-milestone__name">{{ ms.basic.name }}</span>
              <button
                class="sp-claim-btn"
                :class="'sp-claim-btn--' + ms.basic.status"
                @click="handleClaim('basic', ms)"
              >{{ getStatusLabel(ms.basic.status) }}</button>
            </div>

            <!-- Junior Column -->
            <div class="sp-milestone__reward" :class="{ 'sp-milestone__reward--dim': ms.junior.status === 'locked' }">
              <div class="sp-shield-icon"></div>
              <span class="sp-milestone__name">{{ ms.junior.name }}</span>
              <button
                class="sp-claim-btn"
                :class="'sp-claim-btn--' + ms.junior.status"
              >{{ getStatusLabel(ms.junior.status) }}</button>
              <div v-if="ms.junior.status === 'locked'" class="sp-lock-badge">
                <van-icon name="lock" size="10" color="var(--wihte-color)" />
              </div>
            </div>

            <!-- Senior Column -->
            <div class="sp-milestone__reward" :class="{ 'sp-milestone__reward--dim': ms.senior.status === 'locked' }">
              <div class="sp-chest-icon-sm">
                <div class="sp-chest-icon-sm__body">
                  <div class="sp-chest-icon-sm__lid"></div>
                  <div class="sp-chest-icon-sm__lock"></div>
                </div>
              </div>
              <span class="sp-milestone__name">{{ ms.senior.name }}</span>
              <button
                class="sp-claim-btn"
                :class="'sp-claim-btn--' + ms.senior.status + (ms.senior.status === 'claimed' ? ' sp-claim-btn--gold' : '')"
              >{{ getStatusLabel(ms.senior.status) }}</button>
              <div v-if="ms.senior.status === 'locked'" class="sp-lock-badge">
                <van-icon name="lock" size="10" color="var(--wihte-color)" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- Win Ticker Footer -->
    <div class="sp-ticker">
      <div class="sp-ticker__track">
        <div
          v-for="(msg, idx) in marqueeMessages"
          :key="idx"
          class="sp-ticker__item"
          :class="{ 'sp-ticker__item--alt': idx % 2 !== 0 }"
        >
          <van-icon :name="idx % 2 === 0 ? 'star' : 'fire'" size="16" color="#ffa300" />
          <span v-html="msg"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SeasonPass',
  data() {
    return {
      currentPoints: 450,
      nextReward: 500,
      milestones: [
        {
          points: 500,
          basic: { name: '500 Gold Coins', status: 'claimed' },
          junior: { name: '1000 Gold Coins', status: 'locked' },
          senior: { name: 'Shopping Voucher', status: 'claimed' }
        },
        {
          points: 1000,
          basic: { name: '500 Gold Coins', status: 'claimable' },
          junior: { name: '1000 Gold Coins', status: 'locked' },
          senior: { name: 'Shopping Voucher', status: 'locked' }
        },
        {
          points: 1500,
          basic: { name: '500 Gold Coins', status: 'claimable' },
          junior: { name: '1000 Gold Coins', status: 'locked' },
          senior: { name: 'Shopping Voucher', status: 'locked' }
        }
      ],
      marqueeMessages: [
        'User123 obtained Senior Reward <span style="color:#f8f510;text-decoration:underline;">+50,000 GOLD!</span>',
        'ProPlayer88 reached Level 45!',
        'LuckyWinner777 unlocked Junior Pass!'
      ]
    }
  },
  computed: {
    progressPercent() {
      if (!this.nextReward) return 0
      return Math.min(100, (this.currentPoints / this.nextReward) * 100)
    }
  },
  methods: {
    getStatusLabel(status) {
      if (status === 'claimed') return this.$lang.season_claimed || 'CLAIMED'
      if (status === 'claimable') return this.$lang.season_claim || 'Claim'
      return this.$lang.season_claim || 'Claim'
    },
    handleClaim(tier, milestone) {
      if (tier === 'basic' && milestone.basic.status === 'claimable') {
        // TODO: call API when available
        this.$toast(this.$lang.season_claim || 'Claim')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@gold: #ffa300;
@silver: #C0C0C0;
@bg-dark: #1f1c17;
@surface: rgba(255, 255, 255, 0.05);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@muted: #a89b7c;
@card-solid: #15110a;

.season-page {
  min-height: 100vh;
  background: @bg-dark;
  color: #e2e8f0;
}

// ====== HEADER ======
.sp-header {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  background: fade(@bg-dark, 80%);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &__btn {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    border-radius: 50%;

    &:active {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__title {
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #f1f5f9;
  }
}

.sp-main {
  flex: 1;
  overflow-y: auto;
  padding-bottom: 80px;
}

// ====== PROGRESS ======
.sp-progress {
  padding: 16px;

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
  }

  &__label {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: #a89b7c;
    font-weight: 700;
  }

  &__value {
    font-size: 24px;
    font-weight: 900;
    color: @primary;
    font-style: italic;
    line-height: 1.1;
  }

  &__unit {
    font-size: 12px;
    font-weight: 400;
    color: #cbd5e1;
    font-style: normal;
  }

  &__next {
    font-size: 10px;
    color: #a89b7c;
  }

  &__bar {
    height: 16px;
    width: 100%;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
    padding: 2px;
  }

  &__fill {
    height: 100%;
    background: @primary;
    border-radius: 999px;
    box-shadow: 0 0 10px fade(@primary, 50%);
    position: relative;
    transition: width 0.5s;
  }

  &__fill-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3));
    border-radius: 999px;
  }
}

// ====== UPGRADE PASS CARD ======
.sp-upgrade {
  padding: 0 16px 8px;

  &__card {
    position: relative;
    overflow: hidden;
    border-radius: 16px;
    border: 1px solid fade(@primary, 30%);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), fade(@primary, 5%));
    padding: 20px;
    box-shadow: 0 0 15px fade(@gold, 30%);
  }

  &__head {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    position: relative;
    z-index: 10;
  }

  &__title {
    color: @primary;
    font-size: 18px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    font-style: italic;
  }

  &__subtitle {
    color: #a89b7c;
    font-size: 10px;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.1em;
    margin-top: 4px;
  }

  &__tiers {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-top: 16px;
    position: relative;
    z-index: 10;
  }

  &__actions {
    display: flex;
    gap: 8px;
    margin-top: 16px;
    position: relative;
    z-index: 10;
  }

  &__blur {
    position: absolute;
    border-radius: 50%;
    filter: blur(60px);

    &--top {
      top: -40px;
      right: -40px;
      width: 128px;
      height: 128px;
      background: fade(@primary, 10%);
    }

    &--bottom {
      bottom: -40px;
      left: -40px;
      width: 96px;
      height: 96px;
      background: fade(@gold, 5%);
    }
  }
}

// Tier info blocks
.sp-tier {
  &__header {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__name {
    font-size: 11px;
    font-weight: 900;
    text-transform: uppercase;

    &--silver {
      color: @silver;
    }

    &--gold {
      color: @gold;
    }
  }

  &__desc {
    color: #a89b7c;
    font-size: 10px;
    line-height: 1.3;
    margin-top: 4px;

    &--bright {
      color: #f1f5f9;
      font-weight: 500;
    }
  }
}

// Buttons
.sp-btn {
  padding: 10px 0;
  border-radius: 12px;
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &--silver {
    flex: 1;
    background: fade(@silver, 10%);
    border: 1px solid fade(@silver, 30%);
    color: @silver;

    &:active {
      background: fade(@silver, 20%);
    }
  }

  &--primary {
    flex: 1.5;
    background: @btn-grad;
    color: #573900;
    box-shadow: 0 0 15px fade(@primary, 40%);

    &:active {
      opacity: 0.9;
    }
  }
}

// ====== REWARD TRACK ======
.sp-track {
  margin-top: 32px;
  padding: 0 16px;

  &__title {
    color: #f1f5f9;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    margin-bottom: 24px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__line {
    display: inline-block;
    width: 32px;
    height: 1px;
    background: @primary;
  }

  &__header {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 8px;
    padding: 0 8px;
    margin-bottom: 16px;
  }

  &__col {
    font-size: 10px;
    font-weight: 700;
    color: #a89b7c;
    text-transform: uppercase;
    text-align: center;

    &--pts {
      text-align: left;
    }
  }

  &__rows {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
}

// ====== MILESTONE ROW ======
.sp-milestone {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  gap: 8px;
  align-items: center;
  background: @surface;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);

  &__pts {
    display: flex;
    flex-direction: column;

    &--active &-val {
      color: @primary;
    }
  }

  &__pts-val {
    font-size: 14px;
    font-weight: 700;
    font-style: italic;
    color: #cbd5e1;
  }

  &__pts-label {
    font-size: 8px;
    color: #a89b7c;
    text-transform: uppercase;
  }

  &__reward {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    position: relative;

    &--dim {
      opacity: 0.6;
    }
  }

  &__name {
    font-size: 7px;
    font-weight: 700;
    color: #cbd5e1;
    text-transform: uppercase;
    text-align: center;
    white-space: nowrap;
  }
}

// ====== CLAIM BUTTONS ======
.sp-claim-btn {
  font-size: 8px;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 2px;
  text-transform: uppercase;
  width: 100%;
  border: none;
  cursor: pointer;

  &--claimed {
    background: @btn-grad;
    color: #573900;
    box-shadow: 0 0 20px fade(@primary, 80%);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  &--gold {
    background: @gold !important;
    color: #573900 !important;
    box-shadow: 0 0 20px fade(@gold, 80%) !important;
  }

  &--claimable {
    background: @btn-grad;
    color: #573900;
    box-shadow: 0 0 10px fade(@primary, 30%);
  }

  &--locked {
    background: rgba(255, 255, 255, 0.1);
    color: #a89b7c;
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

// ====== LOCK BADGE ======
.sp-lock-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #15110a;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.2);
  z-index: 20;
}

// ====== CSS ICONS ======

// Gold Coin
.sp-coin-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff720, #FFD700, #B8860B);
  position: relative;
  box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.6), 2px 4px 8px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 50%);
    opacity: 0.7;
  }

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.4);
  }

  &__letter {
    font-size: 16px;
    font-weight: 900;
    color: #5c4a00;
    position: relative;
    z-index: 1;
    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.5);
  }
}

// Shield (small, for tier header)
.sp-shield-sm {
  width: 18px;
  height: 18px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fff720, #FFD700, #B8860B);
    border-radius: 2px;
    transform: rotate(45deg);
    box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.5), 1px 2px 4px rgba(0, 0, 0, 0.4);
  }
}

// Shield icon (for milestone)
.sp-shield-icon {
  width: 36px;
  height: 36px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #fff720, #FFD700, #B8860B);
    border-radius: 4px;
    transform: rotate(45deg);
    box-shadow: inset -2px -2px 4px rgba(0, 0, 0, 0.5), 2px 4px 8px rgba(0, 0, 0, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 35% 35%, rgba(255, 255, 255, 1) 0%, transparent 60%);
    border-radius: 4px;
    transform: rotate(45deg);
    opacity: 0.7;
  }
}

// Small chest for tier header
.sp-chest-sm {
  width: 16px;
  height: 12px;
  background: linear-gradient(to bottom, #4d3a2b, #2a1b12);
  border-radius: 1px;
  position: relative;
  box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.6);
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);

  &__lid {
    position: absolute;
    top: -4px;
    left: 0;
    width: 100%;
    height: 6px;
    background: linear-gradient(to top, #5c4033, #8b5e3c);
    border-radius: 3px 3px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);
  }

  &__lock {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 4px;
    height: 6px;
    background: linear-gradient(135deg, #f8f510, #B8860B);
    border-radius: 1px;
  }
}

// Small chest for milestone
.sp-chest-icon-sm {
  margin-bottom: 2px;

  &__body {
    width: 32px;
    height: 24px;
    background: linear-gradient(to bottom, #4d3a2b, #2a1b12);
    border-radius: 2px;
    position: relative;
    box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 0 15px fade(@gold, 50%);
    border-bottom: 2px solid rgba(0, 0, 0, 0.6);
  }

  &__lid {
    position: absolute;
    top: -10px;
    left: 0;
    width: 100%;
    height: 14px;
    background: linear-gradient(to top, #5c4033, #8b5e3c);
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 8px;
      width: 16px;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 9px;
      filter: blur(0.5px);
    }
  }

  &__lock {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 12px;
    background: linear-gradient(135deg, #fff720, #B8860B);
    border-radius: 2px;
    border: 1px solid #8b6914;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.4);
  }
}

// Large chest for upgrade card
.sp-chest-icon {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 15px rgba(255, 215, 0, 0.4));

  &__body {
    width: 40px;
    height: 32px;
    background: linear-gradient(to bottom, #4d3a2b, #2a1b12);
    border-radius: 2px;
    position: relative;
    box-shadow: 2px 6px 10px rgba(0, 0, 0, 0.6), 0 0 15px fade(@gold, 50%);
    border-bottom: 2px solid rgba(0, 0, 0, 0.6);
  }

  &__lid {
    position: absolute;
    top: -12px;
    left: 0;
    width: 100%;
    height: 16px;
    background: linear-gradient(to top, #5c4033, #8b5e3c);
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.6);

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 10px;
      width: 20px;
      height: 2px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 9px;
      filter: blur(0.5px);
    }
  }

  &__band {
    position: absolute;
    top: -12px;
    width: 8px;
    height: 44px;
    background: linear-gradient(to right, #ffe4b5, @wihte-color, #a89b7c);
    border-left: 1px solid rgba(168, 155, 124, 0.5);
    border-right: 1px solid rgba(168, 155, 124, 0.5);
    box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);

    &--left {
      left: 8px;
    }

    &--right {
      right: 8px;
    }
  }

  &__lock {
    position: absolute;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 16px;
    background: linear-gradient(135deg, #f8f510, #B8860B);
    border-radius: 2px;
    border: 1px solid #8b6914;
    box-shadow: 0 0 5px rgba(255, 215, 0, 0.4);

    &::before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 6px;
      height: 4px;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 1px;
      filter: blur(0.3px);
    }
  }
}

// ====== WIN TICKER FOOTER ======
.sp-ticker {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: fade(@bg-dark, 90%);
  backdrop-filter: blur(20px);
  border-top: 2px solid fade(@primary, 50%);
  padding: 12px 0;
  overflow: hidden;
  box-shadow: 0 -10px 30px fade(@primary, 20%);
  z-index: 40;

  &__track {
    display: flex;
    gap: 48px;
    white-space: nowrap;
    animation: marquee-fast 15s linear infinite;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 900;
    font-style: italic;
    color: @primary;

    &--alt {
      color: #f1f5f9;
    }
  }
}

@keyframes marquee-fast {
  0% { transform: translateX(100%); }
  100% { transform: translateX(-150%); }
}

// ====== RESPONSIVE ======
@media (min-width: 769px) {
  .season-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
