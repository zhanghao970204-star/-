<template>
  <div class="mc-page">
    <title-bar :title="$lang.mc_title"></title-bar>

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
        <img
          v-if="!newbieCompleted"
          class="mc-tabs__lock"
          :class="{ 'is-on': activeTab === 'daily' }"
          src="../../../assets/img/activity/mission/lock_tab.png"
          alt=""
        />
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
        <img
          v-if="!newbieCompleted"
          class="mc-tabs__lock"
          :class="{ 'is-on': activeTab === 'weekly' }"
          src="../../../assets/img/activity/mission/lock_tab.png"
          alt=""
        />
        {{ $lang.mc_weekly }}
      </button>
    </div>

    <!-- Locked state for daily/weekly when newbie not completed -->
    <div v-if="activeTab !== 'newbie' && !newbieCompleted" class="mc-locked">
      <img
        class="mc-locked__icon"
        src="../../../assets/img/activity/mission/lock.png"
        alt=""
      />
      <p class="mc-locked__title">{{ $lang.mc_locked_title || 'Locked' }}</p>
      <p class="mc-locked__desc">{{ $lang.mc_locked_desc || 'Complete all newbie tasks to unlock' }}</p>
      <button class="mc-locked__btn btn-3d-green" @click="switchTab('newbie')">{{ $lang.mc_go_newbie || 'Go to Newbie Tasks' }}</button>
    </div>

    <template v-else>
      <!-- Cumulative Rewards -->
      <section class="mc-cumulative">
        <div class="mc-cumulative__header">
          <p class="mc-cumulative__label">{{ $lang.mc_activity_points }}</p>
          <div class="mc-cumulative__reset">
            <img
              class="mc-cumulative__clock"
              src="../../../assets/img/activity/mission/clock.png"
              alt=""
            />
            <span>{{ $lang.mc_reset_in }} {{ resetCountdown }}</span>
          </div>
        </div>
        <p class="mc-cumulative__score">
          <span class="mc-cumulative__current">{{ currentSection.currentPoints }}</span>
          <span class="mc-cumulative__sep">/</span>
          <span class="mc-cumulative__total">{{ maxThreshold }}</span>
        </p>

        <!-- 三档均匀居中；进度百分比与领取逻辑不变 -->
        <div class="mc-track">
          <div class="mc-milestones">
            <div
              v-for="(m, index) in currentSection.milestones"
              :key="m.threshold"
              class="mc-milestone"
              :class="{
                'mc-milestone--reached': currentSection.currentPoints >= m.threshold,
                'mc-milestone--claimed': m.claimed
              }"
              :style="{ left: milestoneSlotLeft(index) }"
              @click="claimMilestone(m)"
            >
              <div class="mc-milestone__chest">
                <img
                  :src="currentSection.currentPoints >= m.threshold || m.claimed
                    ? require('../../../assets/img/activity/mission/chest_open.png')
                    : require('../../../assets/img/activity/mission/chest_closed.png')"
                  class="mc-milestone__img"
                />
                <span v-if="m.claimed" class="mc-milestone__check" aria-hidden="true"></span>
              </div>
              <span v-if="m.rewardAmount" class="mc-milestone__reward">{{ getCurrency }} {{ $formatNumberWithCommas(m.rewardAmount) }}</span>
            </div>
          </div>

          <div class="mc-bar-slot">
            <div class="mc-bar">
              <div class="mc-bar__fill" :style="{ width: progressPercent + '%' }"></div>
            </div>
            <div
              v-for="(m, index) in currentSection.milestones"
              :key="'pts-' + m.threshold"
              class="mc-pts"
              :class="{ 'mc-pts--reached': currentSection.currentPoints >= m.threshold }"
              :style="{ left: milestoneSlotLeft(index) }"
            >{{ m.threshold }}</div>
          </div>
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
          <div class="mc-task__main">
            <div class="mc-task__icon">
              <img
                :src="taskIconSrc(task)"
                class="mc-task__icon-img"
                alt=""
              />
            </div>
            <div class="mc-task__body">
              <p class="mc-task__name">{{ task.name }}</p>
              <p class="mc-task__progress">{{ task.progress }}</p>
            </div>
            <div class="mc-task__rewards">
              <span class="mc-task__reward mc-task__reward--pts">+{{ task.rewardAmount }} AP</span>
              <span v-if="task.rewardGold" class="mc-task__reward mc-task__reward--gold">+{{ $formatNumberWithCommas(task.rewardGold) }} {{ getCurrency }}</span>
            </div>
          </div>
          <button
            class="mc-task__btn btn-3d-green"
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
      loading: false,
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
    /** 三档按序号均分并整体居中，不按 threshold 贴到右端 */
    milestoneSlotLeft(index) {
      const n = (this.currentSection.milestones || []).length || 1
      return ((index + 1) / (n + 1)) * 100 + '%'
    },
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
    /**
     * 任务左侧图标（按设计稿顺序资源）：
     * 1登录大门 2金猪充值 3筹码投注 4好友邀请 5签到日历 6礼盒
     */
    taskIconSrc(task) {
      const icons = {
        login: require('../../../assets/img/activity/mission/icon_login.png'),
        piggy: require('../../../assets/img/activity/mission/icon_piggy.png'),
        chips: require('../../../assets/img/activity/mission/icon_chips.png'),
        friends: require('../../../assets/img/activity/mission/icon_friends.png'),
        checkin: require('../../../assets/img/activity/mission/icon_checkin.png'),
        gift: require('../../../assets/img/activity/mission/icon_gift.png')
      }
      const c = String((task && task.code) || '').toUpperCase()
      const n = String((task && task.name) || '').toLowerCase()
      // 连续登录/签到优先于「登录」（避免命中 login 错配大门）
      if (
        c.includes('CHECKIN') ||
        c.includes('CHECK_IN') ||
        c.includes('CONSECUTIVE') ||
        n.includes('consecutive') ||
        n.includes('check-in') ||
        n.includes('check in') ||
        n.includes('checkin') ||
        n.includes('días') ||
        n.includes('dias consecut') ||
        /\d+\s*(consecutive\s*)?days/.test(n) ||
        /log\s*in\s+for\s+\d+/.test(n)
      ) {
        return icons.checkin
      }
      if (
        c.includes('LOGIN') ||
        n.includes('log in') ||
        n.includes('login') ||
        n.includes('entrar')
      ) {
        return icons.login
      }
      if (
        c.includes('RECHARGE') ||
        c.includes('DEPOSIT') ||
        n.includes('recharge') ||
        n.includes('deposit') ||
        n.includes('depósito') ||
        n.includes('deposito')
      ) {
        return icons.piggy
      }
      if (c.includes('BET') || n.includes('bet') || n.includes('apuesta') || n.includes('aposta')) {
        return icons.chips
      }
      if (
        c.includes('INVITE') ||
        c.includes('FRIEND') ||
        c.includes('REFERRAL') ||
        n.includes('invite') ||
        n.includes('friend') ||
        n.includes('amigo')
      ) {
        return icons.friends
      }
      if (
        c.includes('WITHDRAW') ||
        c.includes('GIFT') ||
        c.includes('BONUS') ||
        n.includes('withdraw') ||
        n.includes('withdrawal') ||
        n.includes('saque') ||
        n.includes('retiro') ||
        n.includes('gift') ||
        n.includes('bonus')
      ) {
        return icons.gift
      }
      // 按列表顺序兜底：登录→金猪→筹码→好友→签到→礼盒
      const list = (this.currentSection && this.currentSection.tasks) || []
      const idx = list.findIndex((t) => t && t.code === (task && task.code))
      const order = [icons.login, icons.piggy, icons.chips, icons.friends, icons.checkin, icons.gift]
      if (idx >= 0 && idx < order.length) return order[idx]
      if (task && task.iconUrl) return task.iconUrl
      return icons.login
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
@gold: #ffd467;
@lime: #7cff4a;
@page: #12021a;
@muted: #d2c4f0;
@tab-nav-fill: #1d022c;
@tab-border-grad: linear-gradient(90deg, #e93dfe 0%, #3245a2 100%);
@tab-btn-grad: linear-gradient(135deg, #9f24c9 0%, #3b4edc 100%);

.mc-page {
  min-height: 100vh;
  background: transparent;
  color: #fff;
  padding-bottom: 40px;
  box-sizing: border-box;
}

// ====== TABS (share.vue pill style) ======
.mc-tabs {
  display: flex;
  align-items: center;
  gap: 2px;
  margin: 8px 12px 14px;
  padding: 1px;
  min-height: 37px;
  border-radius: 22.5px;
  border: 1px solid transparent;
  background:
    linear-gradient(@tab-nav-fill, @tab-nav-fill) padding-box,
    @tab-border-grad border-box;
  box-shadow: 0 0 12px fade(#e93dfe, 28%);
  box-sizing: border-box;

  &__btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
    height: 31px;
    margin: 2px;
    padding: 0 6px;
    border: none;
    border-radius: 16px;
    background: transparent;
    color: #d7a2fa;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.15;
    text-transform: none;
    letter-spacing: 0;
    white-space: nowrap;
    cursor: pointer;
    box-sizing: border-box;
    transition: all 0.2s;

    &--active {
      background: @tab-btn-grad;
      color: #fff;
      font-weight: 800;
      box-shadow: 0 2px 10px fade(#9f24c9, 45%);
    }

    &--locked {
      cursor: pointer;
      opacity: 1;
    }
  }

  &__lock {
    width: 12px;
    height: 12px;
    object-fit: contain;
    flex-shrink: 0;
    /* 未选中：紫色锁；选中：提亮为白色 */
    opacity: 0.95;

    &.is-on {
      filter: brightness(0) invert(1);
    }
  }
}

// ====== LOCKED STATE ======
.mc-locked {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 8px 16px;
  padding: 48px 24px 36px;
  text-align: center;
  background: #3a1a5c;
  border-radius: 16px;

  &__icon {
    width: 72px;
    height: auto;
    object-fit: contain;
    margin-bottom: 8px;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: #d2c4f0;
    margin: 8px 0;
  }

  &__desc {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 24px;
    line-height: 1.5;
  }

  &__btn {
    width: auto;
    min-width: 220px;
    height: 44px;
    padding: 0 24px;
    font-size: 13px;
  }
}

// ====== CUMULATIVE（按设计稿还原样式，逻辑不变） ======
.mc-cumulative {
  position: relative;
  margin: 0 12px 16px;
  padding: 14px 12px 16px;
  border-radius: 16px;
  overflow: hidden;
  background:
    url('../../../assets/img/activity/mission/card_bg.png') center / cover no-repeat,
    radial-gradient(ellipse at 50% 40%, #7a2bb8 0%, #4a0e82 55%, #3a0a6a 100%);
  box-sizing: border-box;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
    gap: 8px;
  }

  &__label {
    font-size: 12px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    color: #fff;
  }

  /* 设计稿：横渐变底 #4F0576→#9712D8，描边 #FFDF68→#FFB404，字白 */
  &__reset {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 5px 11px;
    border-radius: 999px;
    border: 1.5px solid transparent;
    background:
      linear-gradient(90deg, #4f0576 0%, #9712d8 100%) padding-box,
      linear-gradient(180deg, #ffdf68 0%, #ffb404 100%) border-box;
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    white-space: nowrap;
  }

  &__clock {
    width: 12px;
    height: 12px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  &__score {
    margin-bottom: 6px;
    line-height: 1.05;
    filter: drop-shadow(0 2px 0 #462272);
  }

  &__current,
  &__sep,
  &__total {
    font-weight: 900;
    background: linear-gradient(180deg, #ffd149 0%, #feb403 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
  }

  &__current {
    font-size: 32px;
  }

  &__sep {
    font-size: 24px;
    margin: 0 1px;
  }

  &__total {
    font-size: 24px;
  }
}

// 与进度条共用左右留白，末档 center 落在条的右端内侧，不再被卡片 overflow 裁掉
.mc-track {
  position: relative;
  margin-top: 4px;
  padding: 0 8px;
  box-sizing: border-box;
}

// ====== MILESTONES ======
.mc-milestones {
  position: relative;
  height: 78px;
}

.mc-milestone {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  cursor: pointer;
  z-index: 2;

  &:not(.mc-milestone--reached):not(.mc-milestone--claimed) {
    opacity: 1;
    filter: none;
  }

  &--reached:not(.mc-milestone--claimed) {
    animation: chest-glow 1.4s ease-in-out infinite;
  }

  &--claimed {
    animation: none;
  }

  &__chest {
    position: relative;
    width: 58px;
    height: 64px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    mix-blend-mode: screen;
  }

  /* 已领勾：22px、金边 #FFDD64→#FFB303、深紫底、白勾+金光 */
  &__check {
    position: absolute;
    right: -2px;
    bottom: 4px;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    border: 2px solid transparent;
    background:
      linear-gradient(180deg, #2a0a45 0%, #12021a 100%) padding-box,
      linear-gradient(180deg, #ffdd64 0%, #ffb303 100%) border-box;
    box-shadow:
      0 0 8px rgba(255, 179, 3, 0.55),
      0 2px 4px rgba(0, 0, 0, 0.45);
    box-sizing: border-box;
    z-index: 3;

    &::after {
      content: '';
      position: absolute;
      left: 6px;
      top: 3px;
      width: 6px;
      height: 10px;
      border: solid #fff;
      border-width: 0 2.5px 2.5px 0;
      transform: rotate(45deg);
      filter: drop-shadow(0 0 2px rgba(255, 221, 100, 0.8));
    }
  }

  &__reward {
    font-size: 9px;
    font-weight: 700;
    line-height: 1.1;
    color: #fff;
    white-space: nowrap;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.45);
  }
}

/* 未领取：更快更亮青金呼吸光 + 轻微缩放 */
@keyframes chest-glow {
  0%, 100% {
    transform: translateX(-50%) scale(1);
    filter:
      drop-shadow(0 0 2px rgba(225, 255, 129, 0.95))
      drop-shadow(0 0 10px rgba(157, 239, 6, 0.75))
      drop-shadow(0 0 18px rgba(124, 255, 74, 0.45));
  }
  50% {
    transform: translateX(-50%) scale(1.08);
    filter:
      drop-shadow(0 0 4px #e1ff81)
      drop-shadow(0 0 16px rgba(157, 239, 6, 1))
      drop-shadow(0 0 28px rgba(124, 255, 74, 0.85));
  }
}

// ====== PROGRESS BAR（刻度圆压在条上，和宝箱同一 left%） ======
.mc-bar-slot {
  position: relative;
  height: 28px;
  margin-top: 2px;
}

.mc-bar {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: 16px;
  margin-top: -8px;
  border-radius: 999px;
  border: 1px solid transparent;
  overflow: hidden;
  box-sizing: border-box;
  z-index: 1;
  /* 槽：#670995→#A414E7，描边 #FFDD64→#FFB303，内阴影 #4F0572 */
  background:
    linear-gradient(180deg, #670995 0%, #a414e7 100%) padding-box,
    linear-gradient(180deg, #ffdd64 0%, #ffb303 100%) border-box;
  box-shadow:
    inset 0 -4px 4px #4f0572,
    inset 0 4px 4px #4f0572;

  &__fill {
    height: 100%;
    /* 进度：#E1FF81 → #CDF744 → #9DEF06 */
    background: linear-gradient(90deg, #e1ff81 0%, #cdf744 52%, #9def06 100%);
    border-radius: 999px;
    transition: width 0.6s ease;
  }
}

.mc-pts {
  position: absolute;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  min-width: 26px;
  height: 26px;
  padding: 0 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #8e8e98;
  border: 1px solid rgba(255, 255, 255, 0.28);
  font-size: 11px;
  font-weight: 800;
  color: #fff;
  box-sizing: border-box;

  /* 已达成：#DFFE7C→#9DEE05，描边 #732593 */
  &--reached {
    background: linear-gradient(180deg, #dffe7c 0%, #9dee05 100%);
    border-color: #732593;
    color: #17300c;
  }
}

// ====== TASKS ======
.mc-tasks {
  padding: 0 12px;
  margin-bottom: 16px;

  &__title {
    font-size: 14px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #fff;
    margin-bottom: 12px;
    padding-left: 2px;
  }
}

.mc-task {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 5px 5px 12px;
  border-radius: 14px;
  /* 设计稿：背景 #8B3CBF → #411C59，描边 2px #CBB111 */
  background: linear-gradient(180deg, #8b3cbf 0%, #411c59 100%);
  border: 2px solid #cbb111;
  box-sizing: border-box;
  transition: opacity 0.2s;

  &--claimed {
    opacity: 0.72;
  }

  &__main {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 12px 10px;
    border-radius: 10px;
    background: @page;
    box-sizing: border-box;
  }

  &__icon {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: visible;
    background: transparent;
    border: none;

    &-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      /* 资源自带黑底时去掉 */
      mix-blend-mode: screen;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__name {
    font-size: 13px;
    font-weight: 600;
    color: #f3e6ff;
    margin-bottom: 4px;
    line-height: 1.3;
  }

  &__progress {
    font-size: 12px;
    font-weight: 600;
    color: #fff;
  }

  &__rewards {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
    flex-shrink: 0;
  }

  &__reward {
    font-size: 12px;
    font-weight: 800;
    color: @gold;
    white-space: nowrap;

    &--pts,
    &--gold {
      color: @gold;
    }
  }

  &__btn {
    width: auto;
    min-width: 148px;
    max-width: 180px;
    height: 40px;
    padding: 0 28px;
    margin: 0 auto;
    font-size: 14px;
    font-weight: 900;

    &--claimed {
      opacity: 0.55;
      cursor: not-allowed;
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}

// ====== RULES ======
.mc-rules {
  padding: 0 12px;

  &__card {
    background: rgba(18, 2, 26, 0.72);
    border-radius: 12px;
    padding: 16px;
    border: 1px solid fade(@gold, 35%);
  }

  &__heading {
    font-size: 12px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: @muted;
    margin-bottom: 12px;
  }

  &__list {
    padding-left: 16px;
    margin: 0;

    li {
      font-size: 12px;
      color: @muted;
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
