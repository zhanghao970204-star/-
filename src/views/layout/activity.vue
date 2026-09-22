<template>
  <div class="activity-page">
    <!-- Page Title -->
    <div class="page-header">
      <h1 class="page-title">{{ $lang.activity_tab }}</h1>
    </div>

    <!-- Tier 1: Hero Banners (Stacked 16:9) -->
    <section class="hero-section">
      <div
        class="hero-card hero-card--checkin"
        @click="goTo('/dailyCheckIn')"
      >
        <!-- <div class="hero-card__content">
          <h2 class="hero-card__title">{{ $lang.activity_daily_checkin }}</h2>
          <p class="hero-card__desc">{{ $lang.activity_daily_checkin_desc }}</p>
        </div> -->
        <div class="hero-card__badge">{{ $lang.activity_active }}</div>
      </div>

      <div
        class="hero-card hero-card--vip-club"
        @click="goTo('/vipLevels')"
      >
        <!-- <div class="hero-card__content">
          <h2 class="hero-card__title">{{ $lang.activity_invite_earn }}</h2>
          <p class="hero-card__desc">{{ $lang.activity_invite_earn_desc }}</p>
        </div> -->
      </div>

      <transition name="hero-slide">
        <div
          v-if="tbVisible"
          class="hero-card hero-card--vip"
          @click="openTreasureBox"
        >
          <!-- <div class="hero-card__content">
            <h2 class="hero-card__title">{{ $lang.activity_season_pass }}</h2>
            <p class="hero-card__desc">{{ $lang.activity_season_pass_desc }}</p>
          </div> -->
        </div>
      </transition>
    </section>

    <!-- Tier 2: Grid Banners (2-column) -->
    <section class="grid-section">
      <h3 class="section-title">{{ $lang.activity_limited_offers }}</h3>
      <div class="grid-cards">
        <div v-if="newbieVisible" class="grid-card" @click="goTo('/newbieGift')">
          <div class="grid-card__img grid-card__img--gold">
          </div>
          <div class="grid-card__info">
            <p class="grid-card__title">{{ $lang.activity_welcome_bonus }}</p>
            <p class="grid-card__desc">{{ $lang.activity_welcome_bonus_desc }}</p>
          </div>
        </div>
        <div class="grid-card" @click="goTo('/redPacket')">
          <div class="grid-card__img grid-card__img--green">
          </div>
          <div class="grid-card__info">
            <p class="grid-card__title">{{ $lang.activity_first_deposit_chest }}</p>
            <p class="grid-card__desc">{{ $lang.activity_first_deposit_chest_desc }}</p>
          </div>
        </div>
        <!-- <div class="grid-card" @click="goTo('/seasonPass')">
          <div class="grid-card__img grid-card__img--blue">
          </div>
          <div class="grid-card__info">
            <p class="grid-card__title">{{ $lang.activity_super_value }}</p>
            <p class="grid-card__desc">{{ $lang.activity_super_value_desc }}</p>
          </div>
        </div> -->
      </div>
    </section>

    <!-- Tier 3: List Banners -->
    <section class="list-section">
      <h3 class="section-title">{{ $lang.activity_more_events }}</h3>
      <div class="list-items">
        <!--  -->
        <div class="list-item" @click="goTo('/luckyReferral')">
          <div class="list-item__icon">
            <img src="@/assets/img/activity/activity_icon/activity_1.png" alt="" style="width: 100%; height: 100%;">
          </div>
          <div class="list-item__body">
            <p class="list-item__title">{{ $lang.activity_lucky_spin }}</p>
            <!-- <p class="list-item__desc">{{ $lang.activity_lucky_spin_desc }}</p> -->
          </div>
          <van-button size="mini" class="list-item__btn">
            {{ $lang.activity_spin }}
          </van-button>
        </div>
        <div class="list-item" @click="goTo('/weeklyMissions')">
          <div class="list-item__icon">
            <img src="@/assets/img/activity/activity_icon/activity_2.png" alt="" style="width: 100%; height: 100%;">
          </div>
          <div class="list-item__body">
            <p class="list-item__title">{{ $lang.activity_weekly_missions }}</p>
            <p class="list-item__desc">{{ $lang.activity_weekly_missions_desc }}</p>
          </div>
          <van-button size="mini" class="list-item__btn">
            {{ $lang.activity_view }}
          </van-button>
        </div>
        <div class="list-item" v-if="redPacketVisible" @click="goTo('/redPacket')">
          <div class="list-item__icon">
            <img src="@/assets/img/activity/activity_icon/activity_3.png" alt="" style="width: 100%; height: 100%;">
          </div>
          <div class="list-item__body">
            <p class="list-item__title">{{ $lang.activity_red_envelope }}</p>
            <p class="list-item__desc">{{ $lang.activity_red_envelope_desc }}</p>
          </div>
          <van-button size="mini" class="list-item__btn list-item__btn--outline">
            {{ $lang.activity_join }}
          </van-button>
        </div>
      </div>
    </section>
    <login v-model="showLogin" overlay></login>

    <!-- Treasure Box Popup (shared component) -->
    <treasure-box-popup
      v-model="showTreasureBox"
      :price="tbPrice"
      :total-value="tbTotalValue"
      :rewards="tbRewards"
      :countdown-seconds="tbCountdownSeconds"
    />
  </div>
</template>

<script>
import { TreasureBoxInit, RedPacket, NewPlayerGiftPackInit } from '@/api/common'
import TreasureBoxPopup from '@/components/TreasureBoxPopup.vue'

export default {
  name: 'Activity',
  components: { TreasureBoxPopup },
  data() {
    return {
      showLogin: false,
      showTreasureBox: false,
      tbTotalValue: 0,
      tbPrice: 0,
      tbRewards: [],
      tbCountdownSeconds: 86399,
      tbVisible: false,
      newbieVisible: false,
      redPacketVisible: false,
      redPacketData: null
    }
  },
  mounted() {
    this.initActivityStatus()
  },
  methods: {
    async initActivityStatus() {
      // Check treasure box visibility
      try {
        const res = await TreasureBoxInit({})
        if (res && res.status === 'ok' && res.content) {
          const c = res.content
          this.tbVisible = c.visible !== 0
          if (c.price !== undefined) this.tbPrice = c.price
          if (c.totalValue !== undefined) this.tbTotalValue = c.totalValue
          else if (c.price !== undefined) this.tbTotalValue = c.price
          this.tbRewards = Array.isArray(c.rewards) ? c.rewards : []
          if (c.countdownSeconds !== undefined) this.tbCountdownSeconds = c.countdownSeconds
        }
      } catch (e) {
        console.error('TreasureBoxInit error', e)
      }
      // Check newbie gift visibility
      try {
        const ngRes = await NewPlayerGiftPackInit({})
        if (ngRes && ngRes.status === 'ok' && ngRes.content) {
          this.newbieVisible = ngRes.content.visible === 1
        }
      } catch (e) {
        console.error('NewPlayerGiftPackInit error', e)
      }
      // Check red packet visibility
      if (this.token) {
        try {
          const res = await RedPacket({})
          if (res && res.status === 'ok' && res.content) {
            this.redPacketData = res.content
            this.redPacketVisible = true
          }
        } catch (e) {
          console.error('RedPacket init error', e)
        }
      }
    },
    goTo(path) {
      if (!this.token) {
        this.showLogin = true
        return
      }
      this.$jumpTo(path)
    },
    openTreasureBox() {
      if (!this.token) {
        this.showLogin = true
        return
      }
      this.showTreasureBox = true
    }
  }
}
</script>

<style lang="less" scoped>
/* y7 黑金风格 */
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@gold-grad: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@muted: #a89b7c;
@card-bg: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);

.activity-page {
  padding: 0 16px 100px;
  min-height: 100vh;
  background: @bg;
  color: #fff;
}

.page-header {
  padding: 16px 0 12px;
}

.page-title {
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  letter-spacing: -0.5px;
  background: @gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

/* Tier 1: Hero Banners */
.hero-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-card {
  position: relative;
  aspect-ratio: 21 / 9;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid fade(@gold, 45%);
  box-shadow: 0 0 18px rgba(255, 163, 0, 0.18);
  transition: transform 0.15s;

  &:active {
    transform: scale(0.98);
  }

  &--checkin {
    background: url('../../assets/img/activity/activity_banner/activity_checkin.png')
      no-repeat center center;
    background-size: cover;
  }

  &--vip-club {
    background: url('../../assets/img/activity/activity_banner/activity_vip_club.png')
      no-repeat center center;
    background-size: cover;
  }

  &--invite {
    background: url('../../assets/img/activity/activity_banner/activity_invite.png')
      no-repeat center center;
    background-size: cover;
  }

  &--vip {
    background: url('../../assets/img/activity/activity_banner/activity_vip.png')
      no-repeat center center;
    background-size: cover;
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    padding: 20px;
  }

  &__title {
    font-size: 22px;
    font-weight: 900;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: -1px;
    margin-bottom: 4px;
  }

  &__desc {
    font-size: 13px;
    font-weight: 500;
    color: @gold;
  }

  &__badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: @btn-grad;
    color: #573900;
    font-size: 10px;
    font-weight: 700;
    padding: 4px 10px;
    border-radius: 20px;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(255, 163, 0, 0.35);
  }
}

/* Tier 2: Grid Banners */
.grid-section {
  margin-top: 24px;
}

.section-title {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: @gold-deep;
  margin-bottom: 12px;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.grid-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.15s;

  &:active {
    transform: scale(0.97);
  }

  &__img {
    aspect-ratio: 1;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid fade(@gold-deep, 40%);
    background: #15110a;
    position: relative;
    overflow: hidden;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);

    &--gold {
      background: url('../../assets/img/activity/activity_icon/activity_gold.png')
        no-repeat center center;
      background-size: cover;
    }

    &--green {
      background: url('../../assets/img/activity/activity_icon/activity_green.png')
        no-repeat center center;
      background-size: cover;
    }

    &--blue {
      background: url('../../assets/img/activity/activity_icon/activity_blue.png')
        no-repeat center center;
      background-size: cover;
    }
  }

  &__info {
    padding: 0 2px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: @gold-soft;
  }

  &__desc {
    font-size: 12px;
    color: @muted;
    margin-top: 2px;
  }
}

/* Tier 3: List Banners */
.list-section {
  margin-top: 24px;
}

.list-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.list-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: @card-bg;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid fade(@gold, 35%);
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;

  &:active {
    transform: scale(0.98);
  }

  &__icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    border-radius: 0;
    overflow: visible;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }

  &__desc {
    font-size: 10px;
    color: @muted;
    margin-top: 2px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__btn {
    flex-shrink: 0;
    background: @btn-grad !important;
    color: #573900 !important;
    font-weight: 900;
    font-size: 10px;
    border: none !important;
    border-radius: 16px !important;
    padding: 8px 12px;
    text-transform: uppercase;
    height: auto;
    line-height: 1;
    box-shadow: 0 2px 10px rgba(255, 163, 0, 0.25);

    &--outline {
      background: transparent !important;
      border: 1px solid @gold-deep !important;
      color: @gold !important;
      box-shadow: none;
    }
  }
}

/* Hero card slide-in transition */
.hero-slide-enter-active {
  transition: all 0.5s ease;
}
.hero-slide-enter {
  opacity: 0;
  max-height: 0;
  margin-top: -16px;
  transform: scale(0.95);
}
.hero-slide-enter-to {
  opacity: 1;
  max-height: 200px;
  margin-top: 0;
  transform: scale(1);
}
</style>
