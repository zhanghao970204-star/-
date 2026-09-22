<template>
  <div class="sh-page">
    <!-- Header -->
    <header class="sh-header">
      <button class="sh-header__btn" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="sh-header__title">{{ $lang.season_history_title || 'Season History' }}</h1>
      <div class="sh-header__btn" style="visibility:hidden;"></div>
    </header>

    <!-- Current Season Summary -->
    <section class="sh-current">
      <div class="sh-current__badge">{{ $lang.season_history_current || 'CURRENT' }}</div>
      <div class="sh-current__card">
        <div class="sh-current__info">
          <h3 class="sh-current__name">{{ currentSeason.name }}</h3>
          <p class="sh-current__date">{{ currentSeason.dateRange }}</p>
        </div>
        <div class="sh-current__progress">
          <div class="sh-current__pts">
            <span class="sh-current__pts-val">{{ currentSeason.points }}</span>
            <span class="sh-current__pts-label">PTS</span>
          </div>
          <div class="sh-current__bar">
            <div class="sh-current__fill" :style="{ width: currentSeason.progress + '%' }"></div>
          </div>
          <p class="sh-current__target">{{ $lang.season_history_target || 'Target' }}: {{ currentSeason.target }} PTS</p>
        </div>
        <div class="sh-current__rewards">
          <div class="sh-current__reward-item">
            <div class="sh-coin-mini"><span>G</span></div>
            <div>
              <p class="sh-current__reward-val">{{ currentSeason.basicClaimed }}/{{ currentSeason.basicTotal }}</p>
              <p class="sh-current__reward-label">{{ $lang.season_basic || 'Basic' }}</p>
            </div>
          </div>
          <div class="sh-current__reward-item">
            <div class="sh-shield-mini"></div>
            <div>
              <p class="sh-current__reward-val">{{ currentSeason.juniorClaimed }}/{{ currentSeason.juniorTotal }}</p>
              <p class="sh-current__reward-label">{{ $lang.season_junior || 'Junior' }}</p>
            </div>
          </div>
          <div class="sh-current__reward-item">
            <div class="sh-chest-mini">
              <div class="sh-chest-mini__lid"></div>
              <div class="sh-chest-mini__lock"></div>
            </div>
            <div>
              <p class="sh-current__reward-val">{{ currentSeason.seniorClaimed }}/{{ currentSeason.seniorTotal }}</p>
              <p class="sh-current__reward-label">{{ $lang.season_senior || 'Senior' }}</p>
            </div>
          </div>
        </div>
        <button class="sh-current__btn" @click="$jumpTo('/seasonPass')">
          {{ $lang.season_history_view_current || 'View Current Season' }}
        </button>
      </div>
    </section>

    <!-- Past Seasons List -->
    <section class="sh-past">
      <h2 class="sh-past__title">
        <span class="sh-past__line"></span>
        {{ $lang.season_history_past || 'Past Seasons' }}
      </h2>

      <div class="sh-past__list">
        <div
          v-for="(season, idx) in pastSeasons"
          :key="idx"
          class="sh-season-card"
        >
          <div class="sh-season-card__top">
            <div>
              <h4 class="sh-season-card__name">{{ season.name }}</h4>
              <p class="sh-season-card__date">{{ season.dateRange }}</p>
            </div>
            <div class="sh-season-card__status" :class="'sh-season-card__status--' + season.status">
              {{ season.status === 'completed' ? ($lang.season_history_completed || 'COMPLETED') : ($lang.season_history_expired || 'EXPIRED') }}
            </div>
          </div>

          <!-- Progress -->
          <div class="sh-season-card__progress">
            <div class="sh-season-card__bar">
              <div class="sh-season-card__fill" :style="{ width: season.progress + '%' }"></div>
            </div>
            <span class="sh-season-card__pts">{{ season.points }}/{{ season.target }} PTS</span>
          </div>

          <!-- Rewards Summary -->
          <div class="sh-season-card__rewards">
            <div class="sh-season-card__reward">
              <div class="sh-coin-mini"><span>G</span></div>
              <span>{{ season.basicClaimed }}/{{ season.basicTotal }}</span>
            </div>
            <div class="sh-season-card__reward">
              <div class="sh-shield-mini"></div>
              <span>{{ season.juniorClaimed }}/{{ season.juniorTotal }}</span>
            </div>
            <div class="sh-season-card__reward">
              <div class="sh-chest-mini">
                <div class="sh-chest-mini__lid"></div>
                <div class="sh-chest-mini__lock"></div>
              </div>
              <span>{{ season.seniorClaimed }}/{{ season.seniorTotal }}</span>
            </div>
            <div class="sh-season-card__total">
              <van-icon name="gold-coin-o" size="14" color="#ffa300" />
              <span>+{{ season.totalGold }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="pastSeasons.length === 0" class="sh-empty">
        <van-icon name="records" size="48" color="#a89b7c" />
        <p>{{ $lang.season_history_empty || 'No past seasons yet' }}</p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SeasonHistory',
  data() {
    return {
      currentSeason: {
        name: 'Season 3 — Golden Rush',
        dateRange: 'Feb 15 - Mar 15, 2026',
        points: 450,
        target: 1500,
        progress: 30,
        basicClaimed: 1,
        basicTotal: 3,
        juniorClaimed: 0,
        juniorTotal: 3,
        seniorClaimed: 1,
        seniorTotal: 3
      },
      pastSeasons: [
        {
          name: 'Season 2 — Silver Storm',
          dateRange: 'Jan 15 - Feb 14, 2026',
          points: 1200,
          target: 1500,
          progress: 80,
          status: 'completed',
          basicClaimed: 3,
          basicTotal: 3,
          juniorClaimed: 0,
          juniorTotal: 3,
          seniorClaimed: 0,
          seniorTotal: 3,
          totalGold: '1,500'
        },
        {
          name: 'Season 1 — Launch Party',
          dateRange: 'Dec 15, 2025 - Jan 14, 2026',
          points: 800,
          target: 1500,
          progress: 53,
          status: 'expired',
          basicClaimed: 2,
          basicTotal: 3,
          juniorClaimed: 0,
          juniorTotal: 3,
          seniorClaimed: 0,
          seniorTotal: 3,
          totalGold: '1,000'
        }
      ]
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

.sh-page {
  min-height: 100vh;
  background: @bg-dark;
  color: #e2e8f0;
  padding-bottom: 40px;
}

// ====== HEADER ======
.sh-header {
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

// ====== CURRENT SEASON ======
.sh-current {
  padding: 16px;
  position: relative;

  &__badge {
    display: inline-block;
    background: @btn-grad;
    color: #573900;
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 0.15em;
    padding: 4px 12px;
    border-radius: 999px;
    margin-bottom: 12px;
    box-shadow: 0 0 10px fade(@primary, 50%);
  }

  &__card {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.08), fade(@primary, 5%));
    border: 1px solid fade(@primary, 20%);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 0 20px fade(@primary, 10%);
  }

  &__info {
    margin-bottom: 16px;
  }

  &__name {
    font-size: 16px;
    font-weight: 800;
    color: #f1f5f9;
    letter-spacing: 0.02em;
  }

  &__date {
    font-size: 11px;
    color: #a89b7c;
    margin-top: 4px;
  }

  &__progress {
    margin-bottom: 16px;
  }

  &__pts {
    display: flex;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 8px;

    &-val {
      font-size: 28px;
      font-weight: 900;
      color: @primary;
      font-style: italic;
    }

    &-label {
      font-size: 12px;
      color: #cbd5e1;
    }
  }

  &__bar {
    height: 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
    padding: 2px;
  }

  &__fill {
    height: 100%;
    background: @primary;
    border-radius: 999px;
    box-shadow: 0 0 8px fade(@primary, 50%);
    transition: width 0.5s;
  }

  &__target {
    font-size: 10px;
    color: #a89b7c;
    margin-top: 6px;
    text-align: right;
  }

  &__rewards {
    display: flex;
    gap: 16px;
    margin-bottom: 16px;
    padding: 12px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  &__reward-item {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__reward-val {
    font-size: 14px;
    font-weight: 800;
    color: #f1f5f9;
  }

  &__reward-label {
    font-size: 9px;
    color: #a89b7c;
    text-transform: uppercase;
    font-weight: 700;
  }

  &__btn {
    width: 100%;
    padding: 12px;
    background: @btn-grad;
    color: #573900;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    box-shadow: 0 0 15px fade(@primary, 40%);

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }
}

// ====== PAST SEASONS ======
.sh-past {
  padding: 0 16px;
  margin-top: 24px;

  &__title {
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: #f1f5f9;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 16px;
  }

  &__line {
    display: inline-block;
    width: 32px;
    height: 1px;
    background: @primary;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
}

// ====== SEASON CARD ======
.sh-season-card {
  .record-list-card();
  border-radius: 16px;
  padding: 16px;

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    color: #e2e8f0;
  }

  &__date {
    font-size: 10px;
    color: #a89b7c;
    margin-top: 2px;
  }

  &__status {
    font-size: 9px;
    font-weight: 900;
    letter-spacing: 0.1em;
    padding: 4px 10px;
    border-radius: 999px;
    white-space: nowrap;

    &--completed {
      background: fade(@primary, 15%);
      color: @primary;
      border: 1px solid fade(@primary, 30%);
    }

    &--expired {
      background: rgba(239, 68, 68, 0.1);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.2);
    }
  }

  &__progress {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }

  &__bar {
    flex: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 999px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: @primary;
    border-radius: 999px;
    transition: width 0.5s;
  }

  &__pts {
    font-size: 10px;
    font-weight: 700;
    color: #a89b7c;
    white-space: nowrap;
  }

  &__rewards {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
  }

  &__reward {
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      font-size: 11px;
      font-weight: 700;
      color: #a89b7c;
    }
  }

  &__total {
    margin-left: auto;
    display: flex;
    align-items: center;
    gap: 4px;

    span {
      font-size: 13px;
      font-weight: 900;
      color: @gold;
    }
  }
}

// ====== MINI ICONS ======
.sh-coin-mini {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, #fff720, #FFD700, #B8860B);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.4), 1px 2px 4px rgba(0, 0, 0, 0.3);
  flex-shrink: 0;

  span {
    font-size: 10px;
    font-weight: 900;
    color: #5c4a00;
  }
}

.sh-shield-mini {
  width: 20px;
  height: 20px;
  position: relative;
  flex-shrink: 0;

  &::before {
    content: '';
    position: absolute;
    inset: 2px;
    background: linear-gradient(135deg, #fff720, #FFD700, #B8860B);
    border-radius: 2px;
    transform: rotate(45deg);
    box-shadow: inset -1px -1px 2px rgba(0, 0, 0, 0.5), 1px 2px 3px rgba(0, 0, 0, 0.4);
  }
}

.sh-chest-mini {
  width: 20px;
  height: 14px;
  background: linear-gradient(to bottom, #4d3a2b, #2a1b12);
  border-radius: 1px;
  position: relative;
  box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.5);
  border-bottom: 1px solid rgba(0, 0, 0, 0.6);
  flex-shrink: 0;

  &__lid {
    position: absolute;
    top: -5px;
    left: 0;
    width: 100%;
    height: 7px;
    background: linear-gradient(to top, #5c4033, #8b5e3c);
    border-radius: 4px 4px 0 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.4);
  }

  &__lock {
    position: absolute;
    top: 1px;
    left: 50%;
    transform: translateX(-50%);
    width: 5px;
    height: 6px;
    background: linear-gradient(135deg, #f8f510, #B8860B);
    border-radius: 1px;
  }
}

// ====== EMPTY ======
.sh-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;

  p {
    color: #a89b7c;
    font-size: 14px;
  }
}

// ====== RESPONSIVE ======
@media (min-width: 769px) {
  .sh-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
