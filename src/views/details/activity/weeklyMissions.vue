<template>
  <div class="mc-page">
    <!-- Header -->
    <header class="mc-header">
      <button class="mc-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="mc-header__title">{{ $lang.mc_title }}</h1>
      <div class="mc-header__spacer"></div>
    </header>

    <!-- Tab Toggle -->
    <div class="mc-tabs">
      <button
        class="mc-tabs__btn"
        :class="{ 'mc-tabs__btn--active': activeTab === 'newbie' }"
        @click="switchTab('newbie')"
      >{{ $lang.mc_newbie || 'Newbie' }}</button>
      <button
        class="mc-tabs__btn"
        :class="{
          'mc-tabs__btn--active': activeTab === 'daily',
          'mc-tabs__btn--locked': !newbieCompleted
        }"
        @click="switchTab('daily')"
      >
        <van-icon v-if="!newbieCompleted" name="lock" size="12" style="margin-right: 4px;" />
        {{ $lang.mc_daily }}
      </button>
      <button
        class="mc-tabs__btn"
        :class="{
          'mc-tabs__btn--active': activeTab === 'weekly',
          'mc-tabs__btn--locked': !newbieCompleted
        }"
        @click="switchTab('weekly')"
      >
        <van-icon v-if="!newbieCompleted" name="lock" size="12" style="margin-right: 4px;" />
        {{ $lang.mc_weekly }}
      </button>
    </div>

    <div v-if="loading" class="mc-loading">
      <van-loading color="#ffa300" size="32" />
    </div>

    <template v-else>
      <!-- Locked state for daily/weekly when newbie not completed -->
      <div v-if="activeTab !== 'newbie' && !newbieCompleted" class="mc-locked">
        <van-icon name="lock" size="48" color="#a89b7c" />
        <p class="mc-locked__title">{{ $lang.mc_locked_title || 'Locked' }}</p>
        <p class="mc-locked__desc">{{ $lang.mc_locked_desc || 'Complete all newbie tasks to unlock' }}</p>
        <button class="mc-locked__btn" @click="switchTab('newbie')">{{ $lang.mc_go_newbie || 'Go to Newbie Tasks' }}</button>
      </div>

      <template v-else>
      <!-- Cumulative Rewards -->
      <section class="mc-cumulative">
        <div class="mc-cumulative__header">
          <p class="mc-cumulative__label">{{ $lang.mc_activity_points }}</p>
          <div class="mc-cumulative__reset">
            <van-icon name="clock-o" size="12" color="#a89b7c" />
            <span>{{ $lang.mc_reset_in }} {{ resetCountdown }}</span>
          </div>
        </div>
        <p class="mc-cumulative__score">
          <span class="mc-cumulative__current">{{ currentSection.currentPoints }}</span>
          <span class="mc-cumulative__sep"> / </span>
          <span class="mc-cumulative__total">{{ maxThreshold }}</span>
        </p>

        <!-- Milestone chests -->
        <div class="mc-milestones">
          <div
            v-for="m in currentSection.milestones"
            :key="m.threshold"
            class="mc-milestone"
            :class="{
              'mc-milestone--reached': currentSection.currentPoints >= m.threshold,
              'mc-milestone--claimed': m.claimed
            }"
            :style="{ left: (m.threshold / maxThreshold * 100) + '%' }"
            @click="claimMilestone(m)"
          >
            <div class="mc-milestone__chest">
              <img
                :src="currentSection.currentPoints >= m.threshold || m.claimed
                  ? require('../../../assets/img/activity/activity_icon/task/open.png')
                  : require('../../../assets/img/activity/activity_icon/task/close.png')"
                class="mc-milestone__img"
              />
              <van-icon v-if="m.claimed" name="success" class="mc-milestone__check" size="12" color="#ffa300" />
              <span v-if="m.rewardAmount" class="mc-milestone__reward">{{ getCurrency }} {{ $formatNumberWithCommas(m.rewardAmount) }}</span>
            </div>
            <span class="mc-milestone__pts">{{ m.threshold }}</span>
          </div>
        </div>

        <!-- Progress bar -->
        <div class="mc-bar">
          <div class="mc-bar__fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </section>

      <!-- Task List -->
      <section class="mc-tasks">
        <h3 class="mc-tasks__title">
          {{ activeTab === 'newbie' ? ($lang.mc_newbie_missions || 'Newbie Missions') : activeTab === 'daily' ? $lang.mc_todays_missions : $lang.mc_weekly_missions }}
        </h3>

        <div
          v-for="task in currentSection.tasks"
          :key="task.code"
          class="mc-task"
          :class="{
            'mc-task--claimable': task.status === 'claimable',
            'mc-task--claimed': task.status === 'claimed'
          }"
        >
          <div class="mc-task__icon">
            <img
              v-if="task.iconUrl"
              :src="task.iconUrl"
              class="mc-task__icon-img"
            />
            <van-icon v-else name="medal-o" size="24" color="#ffa300" />
          </div>
          <div class="mc-task__body">
            <p class="mc-task__name">{{ task.name }}</p>
            <p class="mc-task__progress">{{ task.progress }}</p>
          </div>
          <div class="mc-task__right">
            <div class="mc-task__rewards">
              <span class="mc-task__reward mc-task__reward--pts">+{{ task.rewardAmount }} AP</span>
              <span v-if="task.rewardGold" class="mc-task__reward mc-task__reward--gold">+{{ $formatNumberWithCommas(task.rewardGold) }} {{ getCurrency }}</span>
            </div>
            <button
              class="mc-task__btn"
              :class="{
                'mc-task__btn--claimable': task.status === 'claimable',
                'mc-task__btn--claimed': task.status === 'claimed'
              }"
              :disabled="task.status === 'claimed'"
              @click="handleTaskAction(task)"
            >
              <template v-if="task.status === 'claimable'">{{ $lang.mc_claim }}</template>
              <template v-else-if="task.status === 'claimed'">{{ $lang.mc_claimed }}</template>
              <template v-else>{{ $lang.mc_go }}</template>
            </button>
          </div>
        </div>
      </section>

      <!-- Rules -->
      <section class="mc-rules">
        <div class="mc-rules__card">
          <p class="mc-rules__heading">{{ $lang.mc_rules_title }}</p>
          <ol class="mc-rules__list">
            <li>{{ $lang.mc_rule_1 }}</li>
            <li>{{ $lang.mc_rule_2 }}</li>
            <li>{{ $lang.mc_rule_3 }}</li>
            <li>{{ $lang.mc_rule_4 }}</li>
          </ol>
        </div>
      </section>
      </template>
    </template>
  </div>
</template>

<script>
import { TaskCenterNewbieInit, TaskCenterDailyInit, TaskCenterWeeklyInit, ClaimTaskReward, ClaimProgressReward } from '@/api/common'
import { reportPromoPanel } from '@/utils/common'

const TAB_TO_PROMO = {
  newbie: 'task_newbie',
  daily: 'task_daily',
  weekly: 'task_weekly'
}

export default {
  name: 'WeeklyMissions',
  data() {
    return {
      activeTab: 'newbie',
      loading: true,
      resetCountdown: '00:00:00',
      countdownTimer: null,
      resetTs: 0,
      newbieCompleted: false,
      dailyLoaded: false,
      weeklyLoaded: false,
      newbie: {
        category: 'newbie',
        currentPoints: 0,
        totalPoints: 0,
        milestones: [],
        tasks: []
      },
      daily: {
        category: 'daily',
        currentPoints: 0,
        totalPoints: 0,
        milestones: [],
        tasks: []
      },
      weekly: {
        category: 'weekly',
        currentPoints: 0,
        totalPoints: 0,
        milestones: [],
        tasks: []
      }
    }
  },
  computed: {
    currentSection() {
      return this[this.activeTab]
    },
    maxThreshold() {
      const ms = this.currentSection.milestones
      if (!ms.length) return 3000
      return ms[ms.length - 1].threshold
    },
    progressPercent() {
      if (!this.maxThreshold) return 0
      return Math.min(
        Math.round((this.currentSection.currentPoints / this.maxThreshold) * 100),
        100
      )
    }
  },
  mounted() {
    reportPromoPanel(TAB_TO_PROMO[this.activeTab], 1)
    this.fetchData()
  },
  beforeUnmount() {
    reportPromoPanel(TAB_TO_PROMO[this.activeTab], 2)
    clearInterval(this.countdownTimer)
  },
  methods: {
    async fetchData() {
      try {
        // Step 1: Call newbie init first — get newbie tasks + newbieCompleted flag
        const res = await TaskCenterNewbieInit({})
        if (res && res.status === 'ok' && res.content) {
          const c = res.content
          this.newbieCompleted = !!c.newbieCompleted
          this.parseSection('newbie', c.newbie, 'newbie')

          // Step 2: If newbie completed, fetch daily & weekly
          if (this.newbieCompleted) {
            await this.fetchDailyWeekly()
          }
        }
      } catch (e) {
        console.error('TaskCenter fetch error', e)
      } finally {
        this.loading = false
      }
    },
    async fetchDailyWeekly() {
      try {
        const [dailyRes, weeklyRes] = await Promise.all([
          TaskCenterDailyInit({}),
          TaskCenterWeeklyInit({})
        ])
        if (dailyRes && dailyRes.status === 'ok' && dailyRes.content) {
          this.parseSection('daily', dailyRes.content.daily, 'daily')
          this.dailyLoaded = true
        }
        if (weeklyRes && weeklyRes.status === 'ok' && weeklyRes.content) {
          this.parseSection('weekly', weeklyRes.content.weekly, 'weekly')
          this.weeklyLoaded = true
        }
      } catch (e) {
        console.error('fetchDailyWeekly error', e)
      }
    },
    switchTab(tab) {
      if (tab === this.activeTab) return
      reportPromoPanel(TAB_TO_PROMO[this.activeTab], 2)
      reportPromoPanel(TAB_TO_PROMO[tab], 1)
      if (tab !== 'newbie' && !this.newbieCompleted) {
        this.activeTab = tab
        return
      }
      this.activeTab = tab
    },
    parseSection(type, data, category) {
      if (!data) return
      this[type].category = category
      this[type].currentPoints = data.points || 0
      this[type].totalPoints = data.totalPoints || 0
      this[type].milestones = (data.milestones || []).map(m => ({
        threshold: m.threshold,
        rewardAmount: m.rewardAmount || m.reward || m.amount || 0,
        canClaim: !!m.canClaim,
        claimed: !!m.claimed
      }))
      this[type].tasks = (data.tasks || []).map(t => ({
        code: t.code,
        name: t.name || '',
        desc: t.desc || '',
        progress: t.progressText || '',
        rewardAmount: t.points || 0,
        rewardGold: t.rewardGold || 0,
        iconUrl: t.iconUrl || null,
        status: this.getTaskStatus(t),
        rawStatus: t.status || '',
        canClaimReward: !!t.canClaimReward,
        actionUrl: t.actionUrl || null
      }))
    },
    getTaskStatus(t) {
      if (t.canClaimReward) return 'claimable'
      if (t.status === 'completed') return 'claimed'
      return 'inProgress'
    },
    startCountdown() {
      clearInterval(this.countdownTimer)
      this.countdownTimer = setInterval(() => {
        const now = Date.now()
        const diff = Math.max(0, this.resetTs - now)
        if (diff === 0) {
          clearInterval(this.countdownTimer)
          this.resetCountdown = '00:00:00'
          return
        }
        const h = Math.floor(diff / 3600000)
        const m = Math.floor((diff % 3600000) / 60000)
        const s = Math.floor((diff % 60000) / 1000)
        this.resetCountdown =
          String(h).padStart(2, '0') + ':' +
          String(m).padStart(2, '0') + ':' +
          String(s).padStart(2, '0')
      }, 1000)
    },
    async handleTaskAction(task) {
      if (task.status === 'inProgress') {
        const route = task.actionUrl || this.getTaskRoute(task.code)
        if (route) this.$jumpTo(route)
        return
      }
      if (task.status === 'claimable') {
        try {
          const res = await ClaimTaskReward({
            category: this.currentSection.category || this.activeTab,
            taskCode: task.code
          })
          if (res && res.status === 'ok') {
            const amount = (res.content && res.content.amount) || task.rewardAmount
            this.$toast({ message: `+${this.$formatNumberWithCommas(amount)} ${this.getCurrency || ''}`, icon: 'success' })
            task.status = 'claimed'
            this.currentSection.currentPoints += task.rewardAmount
          } else {
            this.$toast(res.msg || this.$lang.mc_claim_failed)
          }
        } catch (e) {
          console.error('ClaimTaskReward error', e)
        }
      }
    },
    getTaskRoute(code) {
      const routeMap = {
        NEWBIE_INVITE_1: '/luckyReferral',
        NEWBIE_FIRST_RECHARGE: '/rechargeCont',
        NEWBIE_WITHDRAW_1: '/bank',
        DAILY_RECHARGE: '/rechargeCont',
        DAILY_BET: '/home',
        WEEKLY_RECHARGE: '/rechargeCont',
        WEEKLY_BET: '/home'
      }
      return routeMap[code] || null
    },
    async claimMilestone(m) {
      if (m.claimed) return
      if (!m.canClaim && this.currentSection.currentPoints < m.threshold) return
      try {
        const res = await ClaimProgressReward({
          category: this.currentSection.category || this.activeTab,
          threshold: m.threshold
        })
        if (res && res.status === 'ok') {
          const amount = (res.content && res.content.amount) || m.rewardAmount
          this.$toast({ message: `+${this.$formatNumberWithCommas(amount)} ${this.getCurrency || ''}`, icon: 'success' })
          m.claimed = true
        } else {
          this.$toast(res.msg || this.$lang.mc_claim_failed)
        }
      } catch (e) {
        console.error('ClaimProgressReward error', e)
      }
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@gold: #ffa300;
@bg: #1f1c17;
@card: #15110a;

.mc-page {
  min-height: 100vh;
  background: @bg;
  padding-bottom: 40px;
}

.mc-loading {
  display: flex;
  justify-content: center;
  padding: 60px 0;
}

// ====== HEADER ======
.mc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: @bg;

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: @wihte-color;
    text-transform: uppercase;
  }

  &__spacer { width: 40px; }
}

// ====== TABS ======
.mc-tabs {
  display: flex;
  margin: 0 16px 16px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  padding: 4px;
  gap: 4px;

  &__btn {
    flex: 1;
    padding: 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    border: none;
    background: none;
    color: #a89b7c;
    cursor: pointer;
    transition: all 0.2s;

    &--active {
      background: @primary;
      color: @black-color;
      box-shadow: 0 0 12px rgba(255, 163, 0, 0.4);
    }

    &--locked {
      color: #a89b7c;
      cursor: not-allowed;
      opacity: 0.5;
    }
  }
}

// ====== LOCKED STATE ======
.mc-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 24px;
  text-align: center;

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: @wihte-color;
    margin-top: 16px;
    margin-bottom: 8px;
  }

  &__desc {
    font-size: 13px;
    color: #a89b7c;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  &__btn {
    background: @primary;
    color: @black-color;
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 24px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 12px rgba(255, 163, 0, 0.4);

    &:active {
      transform: scale(0.96);
    }
  }
}

// ====== CUMULATIVE ======
.mc-cumulative {
  margin: 0 16px 16px;
  background: @card;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid rgba(255, 162, 0, 0.35);

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
  }

  &__label {
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #a89b7c;
  }

  &__reset {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: #a89b7c;
  }

  &__score {
    margin-bottom: 16px;
  }

  &__current {
    font-size: 28px;
    font-weight: 900;
    color: @primary;
  }

  &__sep {
    font-size: 18px;
    color: #a89b7c;
    margin: 0 2px;
  }

  &__total {
    font-size: 18px;
    color: #a89b7c;
  }
}

// ====== MILESTONES ======
.mc-milestones {
  position: relative;
  height: 70px;
  margin-bottom: 8px;
}

.mc-milestone {
  position: absolute;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  opacity: 0.4;
  filter: grayscale(1);
  transition: all 0.3s;

  &--reached {
    opacity: 1;
    filter: none;
    animation: chest-glow 2s ease-in-out infinite;
  }

  &--claimed {
    opacity: 0.7;
    filter: none;
  }

  &__chest {
    position: relative;
    width: 40px;
    height: 40px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__check {
    position: absolute;
    bottom: -2px;
    right: -2px;
    background: @bg;
    border-radius: 50%;
  }

  &__pts {
    font-size: 10px;
    font-weight: 700;
    color: #a89b7c;
  }

  &__reward {
    position: absolute;
    bottom: -14px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 8px;
    font-weight: 700;
    color: #ffa300;
    white-space: nowrap;
  }
}

@keyframes chest-glow {
  0%, 100% { filter: drop-shadow(0 0 6px rgba(255,163,0,0.6)); }
  50% { filter: drop-shadow(0 0 14px rgba(255,163,0,1)); }
}

// ====== PROGRESS BAR ======
.mc-bar {
  background: rgba(255,255,255,0.08);
  border-radius: 50px;
  height: 8px;
  overflow: hidden;
  margin-top: 4px;

  &__fill {
    height: 100%;
    background: linear-gradient(90deg, #e9a843, @primary);
    border-radius: 50px;
    transition: width 0.6s ease;
    box-shadow: 0 0 8px rgba(255,163,0,0.5);
  }
}

// ====== TASKS ======
.mc-tasks {
  padding: 0 16px;
  margin-bottom: 16px;

  &__title {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #a89b7c;
    margin-bottom: 12px;
    padding-left: 4px;
  }
}

.mc-task {
  display: flex;
  align-items: center;
  gap: 12px;
  background: @card;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 8px;
  border: 1px solid rgba(255, 162, 0, 0.35);
  transition: opacity 0.2s;

  &--claimable {
    border-left: 4px solid @primary;
  }

  &--claimed {
    opacity: 0.6;
  }

  &__icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    background: rgba(255,163,0,0.1);
    border: 1px solid rgba(255,163,0,0.2);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: @wihte-color;
    margin-bottom: 2px;
  }

  &__progress {
    font-size: 11px;
    color: #a89b7c;
  }

  &__right {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 6px;
    flex-shrink: 0;
  }

  &__rewards {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 2px;
  }

  &__reward {
    font-size: 11px;
    font-weight: 700;
    color: @gold;

    &--pts {
      color: @gold;
    }

    &--gold {
      color: @primary;
    }
  }

  &__btn {
    font-size: 10px;
    font-weight: 900;
    padding: 6px 10px;
    border-radius: 6px;
    border: 1px solid rgba(255,163,0,0.4);
    background: rgba(255,163,0,0.1);
    color: @primary;
    cursor: pointer;
    white-space: nowrap;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &--claimable {
      background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
      color: #573900;
      border-color: transparent;
      box-shadow: 0 0 8px rgba(255,163,0,0.4);
    }

    &--claimed {
      background: rgba(255,255,255,0.05);
      border-color: transparent;
      color: #a89b7c;
      cursor: not-allowed;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}

// ====== RULES ======
.mc-rules {
  padding: 0 16px;

  &__card {
    background: @card;
    border-radius: 10px;
    padding: 16px;
    border: 1px solid rgba(255, 162, 0, 0.35);
  }

  &__heading {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 2px;
    color: #a89b7c;
    margin-bottom: 12px;
  }

  &__list {
    padding-left: 16px;
    margin: 0;

    li {
      font-size: 12px;
      color: #a89b7c;
      line-height: 1.8;
    }
  }
}

@media (min-width: 769px) {
  .mc-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
