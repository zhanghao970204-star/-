<template>
  <div class="newbie-gift">
    <!-- Header -->
    <nav class="ng-header">
      <button class="ng-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="ng-header__title">{{ $lang.ng_title }}</h1>
      <div class="ng-header__spacer"></div>
    </nav>

    <main class="ng-main">
      <!-- Hero Section -->
      <section class="ng-hero">
        <div class="ng-hero__img-wrap">
          <img
            class="ng-hero__img"
            src="../../../assets/img/activity/activity_banner/newbee/1.png"
          />
          <!-- Best Value Badge -->
          <div class="ng-hero__badge">{{ $lang.ng_best_value || 'BEST VALUE' }}</div>
        </div>

        <!-- Countdown Timer -->
        <div class="ng-timer">
          <span class="ng-timer__label">{{ $lang.ng_limited_time }}</span>
          <div class="ng-timer__tube" :class="{ 'ng-timer__tube--green': purchased }">
            <div class="ng-timer__pulse"></div>
            <span class="ng-timer__digits" :class="{ 'ng-timer__digits--green': purchased }">
              {{ countdownDisplay }}
            </span>
          </div>
        </div>
      </section>

      <!-- Reward Track -->
      <section class="ng-rewards">
        <div
          v-for="(day, idx) in days"
          :key="idx"
          class="ng-reward-card"
          :class="{
            'ng-reward-card--active': day.status === 'active',
            'ng-reward-card--locked': day.status === 'locked',
            'ng-reward-card--claimed': day.status === 'claimed'
          }"
        >
          <!-- Icon -->
          <div class="ng-reward-card__icon" :class="{ 'ng-reward-card__icon--active': day.status === 'active' || day.status === 'claimed' }">
            <img :src="day.icon" class="ng-reward-card__icon-img" />
          </div>

          <!-- Info -->
          <div class="ng-reward-card__info">
            <div class="ng-reward-card__head">
              <span v-if="day.status === 'active'" class="ng-badge ng-badge--active">{{ $lang.ng_active || 'Active' }}</span>
              <span v-if="day.status === 'claimed'" class="ng-badge ng-badge--claimed">{{ $lang.ng_claimed }}</span>
              <h3 class="ng-reward-card__title">{{ day.title }}</h3>
            </div>
            <p class="ng-reward-card__desc" v-html="day.desc"></p>
          </div>

          <!-- Button -->
          <button
            v-if="day.status === 'active'"
            class="ng-reward-card__btn ng-reward-card__btn--active"
            @click="claimReward(idx + 1)"
          >
            {{ $lang.ng_claim }}
          </button>
          <button
            v-else-if="day.status === 'claimed'"
            class="ng-reward-card__btn ng-reward-card__btn--disabled"
            disabled
          >
            {{ $lang.ng_claimed }}
          </button>
          <button
            v-else
            class="ng-reward-card__btn ng-reward-card__btn--locked"
            disabled
          >
            <van-icon name="lock" size="12" />
            <span v-if="day.countdown">{{ day.countdown }}</span>
            <span v-else>{{ $lang.ng_claim }}</span>
          </button>
        </div>
      </section>

      <div class="ng-spacer"></div>
    </main>

    <!-- Footer (only when not purchased) -->
    <div v-if="!purchased" class="ng-footer">
      <div class="ng-footer__row">
        <div class="ng-footer__price">
          <span class="ng-footer__price-label">{{ $lang.ng_limited_price }}</span>
          <div class="ng-footer__price-row">
            <span class="ng-footer__price-current">{{ getCurrency }}{{ $formatNumberWithCommas(price) }}</span>
            <span v-if="originalPrice && Number(originalPrice) > Number(price)" class="ng-footer__price-original">{{ getCurrency }}{{ $formatNumberWithCommas(originalPrice) }}</span>
          </div>
        </div>
        <div class="ng-footer__value">
          <span class="ng-footer__value-pct">{{ creditAmountText }}</span>
          <p class="ng-footer__value-label">{{ $lang.ng_total_value || 'TOTAL VALUE' }}</p>
        </div>
      </div>
      <button class="ng-footer__buy" @click="buyNow">
        {{ $lang.ng_buy_now }}
      </button>
      <p class="ng-footer__disclaimer">{{ $lang.ng_disclaimer }}</p>
    </div>

    <!-- Treasure Chest Popup -->
    <van-popup
      v-model:show="showChestPopup"
      round
      :close-on-click-overlay="true"
      class="ng-popup-wrapper"
    >
      <div class="ng-popup">
        <!-- Header -->
        <div class="ng-popup__header">
          <h2 class="ng-popup__title">{{ $lang.ng_title }}</h2>
          <button class="ng-popup__close" @click="showChestPopup = false">
            <van-icon name="cross" size="20" color="rgba(255,255,255,0.7)" />
          </button>
        </div>

        <!-- Chest Image -->
        <div class="ng-popup__hero">
          <div class="ng-popup__hero-glow"></div>
          <img
            class="ng-popup__hero-img"
            src="../../../assets/img/refer_friend/img_isOpen_box.png"
          />
        </div>

        <!-- Countdown -->
        <div class="ng-popup__timer">
          <span class="ng-timer__label">{{ $lang.ng_limited_time }}</span>
          <div class="ng-timer__tube">
            <div class="ng-timer__pulse"></div>
            <span class="ng-timer__digits">{{ countdownDisplay }}</span>
          </div>
        </div>

        <!-- Total Reward Summary -->
        <div class="ng-popup__summary">
          <span class="ng-popup__summary-label">{{ $lang.ng_total_reward }}</span>
          <div class="ng-popup__summary-value">100% Bonus + 800 Coins</div>
        </div>

        <!-- Footer -->
        <div class="ng-popup__footer">
          <div class="ng-popup__total-value">
            <span>300% Total Value</span>
          </div>
          <button class="ng-popup__buy" @click="buyNow">
            {{ $lang.ng_buy_now }}
          </button>
          <p class="ng-popup__disclaimer">{{ $lang.ng_disclaimer }}</p>
        </div>
      </div>
    </van-popup>

    <!-- Background Ambient -->
    <div class="ng-ambient">
      <div class="ng-ambient__green"></div>
      <div class="ng-ambient__yellow"></div>
    </div>
    <service-popup
      v-model="showPayIframe"
      :srcValue="payIframeUrl"
      popupHeight="90vh"
    ></service-popup>
    <gift-pay-sheet
      v-model="showPaySheet"
      :amount="price"
      :promo-type="promoType || 'new_player_giftpack'"
      @success="onGiftPaySuccess"
    />
  </div>
</template>

<script>
import { NewPlayerGiftPackInit, ReceiveNewPlayerGiftPack } from '@/api/common'
import { reportPromoPanel } from '@/utils/common'
import {
  goPayUrl,
  closePayWindow
} from '@/utils/payRedirect'
import GiftPaySheet from '@/components/GiftPaySheet.vue'

export default {
  name: 'NewbieGift',
  components: { GiftPaySheet },
  data() {
    return {
      purchased: false,
      showChestPopup: false,
      countdownTimer: null,
      price: '',
      originalPrice: '',
      promoType: '',
      immediateBonus: 0,
      day2Max: 0,
      day3Max: 0,
      day1Status: 0, // 0=未开始 1=可领取 2=已领取
      day2Status: 0,
      day3Status: 0,
      day1AvailableTime: 0,
      day2AvailableTime: 0,
      day3AvailableTime: 0,
      nowTs: Math.floor(Date.now() / 1000),
      expireTime: 0,
      visible: 0,
      loading: false,
      showPayIframe: false,
      payIframeUrl: '',
      showPaySheet: false
    }
  },
  computed: {
    toSec() {
      return (t) => {
        const n = Number(t) || 0
        return n > 1e12 ? Math.floor(n / 1000) : n
      }
    },
    countdownTarget() {
      // 未购买 → 到 expireTime；已购买 → 下一个未到的 dayNAvailableTime
      if (this.purchased) {
        const times = [
          this.toSec(this.day1AvailableTime),
          this.toSec(this.day2AvailableTime),
          this.toSec(this.day3AvailableTime)
        ].filter(t => t > this.nowTs).sort((a, b) => a - b)
        return times[0] || 0
      }
      return this.toSec(this.expireTime)
    },
    countdownSeconds() {
      if (!this.countdownTarget) return 0
      const diff = this.countdownTarget - this.nowTs
      return diff > 0 ? diff : 0
    },
    countdownDisplay() {
      const total = this.countdownSeconds
      if (!total) return '00:00:00'
      const d = Math.floor(total / 86400)
      const h = Math.floor((total % 86400) / 3600)
      const m = Math.floor((total % 3600) / 60)
      const s = total % 60
      if (d > 0) {
        return d + 'd ' + String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0')
      }
      return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
      )
    },
    /** 入账金额 = price + immediateBonus + day2Max + day3Max */
    creditTotalAmount() {
      return (
        (Number(this.price) || 0) +
        (Number(this.immediateBonus) || 0) +
        (Number(this.day2Max) || 0) +
        (Number(this.day3Max) || 0)
      )
    },
    /** 百分比 = price / originalPrice * 100（与弹窗同一套） */
    priceRatioPercent() {
      const p = Number(this.price) || 0
      const o = Number(this.originalPrice) || 0
      if (!o || p <= 0) return 0
      return Math.round((p / o) * 100)
    },
    /** 角标：+ MXN 158（与弹窗同一套计算） */
    creditAmountText() {
      const total = this.creditTotalAmount
      if (!total) return ''
      const amount = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(total)
        : total
      const currency = this.getCurrency || ''
      return '+ ' + currency + ' ' + amount
    },
    days() {
      const pct = this.priceRatioPercent
      const day1Desc = String(this.$lang.ng_day1_desc || '').replace(
        /\{percent\}/g,
        String(pct),
      )
      const dayConfigs = [
        {
          title: this.$lang.ng_day1_title,
          desc: day1Desc,
          icon: require('../../../assets/img/bonus/coin.png'),
          apiStatus: this.day1Status,
          availableTime: this.toSec(this.day1AvailableTime)
        },
        {
          title: this.$lang.ng_day2_title,
          desc: this.$lang.ng_day2_desc,
          icon: require('../../../assets/img/refer_friend/img_box_unopened.png'),
          apiStatus: this.day2Status,
          availableTime: this.toSec(this.day2AvailableTime)
        },
        {
          title: this.$lang.ng_day3_title,
          desc: this.$lang.ng_day3_desc,
          icon: require('../../../assets/img/refer_friend/img_open_box.png'),
          apiStatus: this.day3Status,
          availableTime: this.toSec(this.day3AvailableTime)
        }
      ]
      return dayConfigs.map(cfg => {
        let status = 'locked'
        if (cfg.apiStatus === 2) {
          status = 'claimed'
        } else if (cfg.apiStatus === 1) {
          status = 'active'
        }
        let countdown = ''
        if (this.purchased && status === 'locked' && cfg.availableTime > this.nowTs) {
          const diff = cfg.availableTime - this.nowTs
          const d = Math.floor(diff / 86400)
          const h = Math.floor((diff % 86400) / 3600)
          const m = Math.floor((diff % 3600) / 60)
          if (d > 0) countdown = d + 'd ' + h + 'h'
          else if (h > 0) countdown = h + 'h ' + m + 'm'
          else countdown = m + 'm'
        }
        return { ...cfg, status, countdown }
      })
    }
  },
  watch: {
    showPayIframe(v) {
      if (!v) this.payIframeUrl = ''
    }
  },
  mounted() {
    reportPromoPanel('new_player_giftpack', 1)
    this.initData()
    this.startCountdown()
  },
  beforeUnmount() {
    reportPromoPanel('new_player_giftpack', 2)
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer)
    }
  },
  methods: {
    async initData() {
      try {
        const res = await NewPlayerGiftPackInit({})
        if (res && res.content) {
          const d = res.content
          this.purchased = d.purchased === 1
          this.day1Status = d.day1Status || 0
          this.day2Status = d.day2Status || 0
          this.day3Status = d.day3Status || 0
          this.day1AvailableTime = d.day1AvailableTime || 0
          this.day2AvailableTime = d.day2AvailableTime || 0
          this.day3AvailableTime = d.day3AvailableTime || 0
          this.expireTime = d.expireTime || 0
          this.visible = d.visible || 0
          this.promoType = d.promoType || ''
          if (d.price) {
            this.price = d.price
          }
          if (d.originalPrice) {
            this.originalPrice = d.originalPrice
          }
          this.immediateBonus = Number(d.immediateBonus) || 0
          this.day2Max = Number(d.day2Max) || 0
          this.day3Max = Number(d.day3Max) || 0
        }
      } catch (e) {
        console.log('initData error', e)
      }
    },
    startCountdown() {
      this.nowTs = Math.floor(Date.now() / 1000)
      this.countdownTimer = setInterval(() => {
        this.nowTs = Math.floor(Date.now() / 1000)
      }, 1000)
    },
    async claimReward(dayIndex) {
      if (this.loading) return
      this.loading = true
      try {
        const res = await ReceiveNewPlayerGiftPack({ dayIndex })
        if (res && res.content && res.content.receiveSuccess === 1) {
          // Update the day status to claimed
          if (dayIndex === 1) this.day1Status = 2
          else if (dayIndex === 2) this.day2Status = 2
          else if (dayIndex === 3) this.day3Status = 2
          const amount = res.content.amount || 0
          this.$toast({
            message: `+${this.getCurrency}${this.$formatNumberWithCommas(amount)}`,
            icon: 'success'
          })
          // Refresh data to get updated statuses
          this.initData()
        } else {
          this.$toast(res?.msg || 'Error')
        }
      } catch (e) {
        this.$toast(e?.msg || 'Error')
      } finally {
        this.loading = false
      }
    },
    buyNow() {
      if (!this.price || this.showPaySheet) return
      this.showChestPopup = false
      this.showPaySheet = true
    },
    onGiftPaySuccess({ url, payWin, isUsRedirect }) {
      if (url) {
        if (isUsRedirect) {
          goPayUrl(payWin, url)
        } else {
          closePayWindow(payWin)
          this.payIframeUrl = url
          this.showPayIframe = true
        }
      } else {
        closePayWindow(payWin)
        this.$toast({ message: this.$lang.bonus_txt16 || 'Success', icon: 'success' })
      }
    },
    openChestPopup() {
      this.showChestPopup = true
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@secondary: #ffa300;
@bg-dark: #1f1c17;
@navy-800: #15110a;
@navy-700: #2a2418;
@red: #dc2626;

.newbie-gift {
  min-height: 100vh;
  background: @bg-dark;
  color: #f1f5f9;
  position: relative;
  overflow: hidden;
}

// ====== HEADER ======
.ng-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  max-width: 450px;
  margin: 0 auto;
  z-index: 50;
  background: @bg-dark;
  backdrop-filter: blur(12px);

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: @wihte-color;
    text-shadow: 0 0 15px rgba(248, 245, 16, 0.6);
  }

  &__spacer {
    width: 40px;
  }
}

// ====== MAIN ======
.ng-main {
  max-width: 450px;
  margin: 0 auto;
  padding-top: 72px;
  padding-bottom: 200px;
}

// ====== HERO ======
.ng-hero {
  padding: 8px 16px 32px;

  &__img-wrap {
    width: 100%;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
    margin-bottom: 24px;
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 12px;
  }

  &__badge {
    position: absolute;
    top: 16px;
    right: 16px;
    background: @secondary;
    color: #573900;
    font-weight: 900;
    font-size: 12px;
    padding: 4px 12px;
    border-radius: 9999px;
    animation: pulse-badge 2s ease-in-out infinite;
  }
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

// ====== TIMER ======
.ng-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;

  &__label {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
  }

  &__tube {
    width: 100%;
    max-width: 280px;
    padding: 12px;
    border-radius: 16px;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(4px);
    position: relative;
    overflow: hidden;

    &--green {
      .ng-timer__pulse {
        background: fade(@primary, 5%);
      }
    }
  }

  &__pulse {
    position: absolute;
    inset: 0;
    background: fade(@red, 5%);
    animation: timer-pulse 2s ease-in-out infinite;
  }

  &__digits {
    font-size: 36px;
    font-weight: 900;
    letter-spacing: 3px;
    color: @red;
    z-index: 10;
    text-shadow: 0 0 10px fade(@red, 50%);
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));

    &--green {
      color: @primary;
      text-shadow: 0 0 10px fade(@primary, 50%);
    }
  }
}

@keyframes timer-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

// ====== REWARD CARDS ======
.ng-rewards {
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ng-reward-card {
  background: fade(@navy-800, 50%);
  box-shadow:
    inset 0 1px 1px rgba(255, 255, 255, 0.1),
    0 4px 6px -1px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(255, 162, 0, 0.35);
  padding: 16px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.7;
  filter: grayscale(0.5);

  &--active,
  &--claimed {
    background: @navy-800;
    border-left: 4px solid @primary;
    box-shadow:
      inset 0 1px 1px rgba(255, 255, 255, 0.1),
      0 4px 6px -1px rgba(0, 0, 0, 0.5),
      0 10px 20px fade(@primary, 5%);
    opacity: 1;
    filter: none;
  }

  &__icon {
    width: 64px;
    height: 64px;
    background: @navy-700;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(255, 162, 0, 0.35);

    &--active {
      background: fade(@primary, 20%);
      border-color: fade(@primary, 30%);
    }

    &-img {
      width: 48px;
      height: 48px;
      object-fit: contain;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__title {
    font-size: 14px;
    font-weight: 700;
    color: @wihte-color;
  }

  &__desc {
    font-size: 12px;
    color: #a89b7c;
    margin-top: 4px;
    line-height: 1.4;

    :deep(.highlight) {
      color: @primary;
      font-weight: 700;
    }
  }

  &__btn {
    flex-shrink: 0;
    font-size: 12px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.3px;
    padding: 8px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;

    &--active {
      background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
      color: #573900;
      box-shadow: 0 0 10px fade(@primary, 40%);

      &:active {
        transform: scale(0.95);
      }
    }

    &--disabled {
      background: fade(#2a2418, 80%);
      color: #a89b7c;
      cursor: not-allowed;
      border: 1px solid rgba(255, 162, 0, 0.2);
      box-shadow: none;
    }

    &--locked {
      background: fade(#2a2418, 80%);
      color: #a89b7c;
      cursor: not-allowed;
      border: 1px solid rgba(255, 162, 0, 0.2);
    }
  }
}

.ng-badge {
  font-size: 10px;
  font-weight: 900;
  text-transform: uppercase;
  padding: 2px 8px;
  border-radius: 4px;

  &--active {
    color: @primary;
    background: fade(@primary, 10%);
  }

  &--claimed {
    color: #a89b7c;
    background: #15110a;
  }
}

.ng-spacer {
  height: 40px;
}

// ====== FOOTER ======
.ng-footer {
  position: fixed;
  bottom: 30px;
  left: 0;
  right: 0;
  background: fade(@bg-dark, 95%);
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding: 16px;
  max-width: 450px;
  margin: 0 auto;
  z-index: 50;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  &__price {
    display: flex;
    flex-direction: column;

    &-label {
      font-size: 10px;
      color: #a89b7c;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
    }

    &-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    &-current {
      font-size: 30px;
      font-weight: 900;
      color: @secondary;
      text-shadow: 0 0 15px fade(@secondary, 60%);
    }

    &-original {
      font-size: 14px;
      color: #a89b7c;
      text-decoration: line-through;
    }
  }

  &__value {
    text-align: right;

    &-pct {
      font-size: 20px;
      font-weight: 900;
      color: @primary;
    }

    &-label {
      font-size: 10px;
      color: #a89b7c;
      font-weight: 700;
    }
  }

  &__buy {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-weight: 900;
    padding: 16px;
    border-radius: 10px;
    border: none;
    font-size: 16px;
    text-transform: uppercase;
    letter-spacing: 3px;
    box-shadow: 0 0 20px fade(@primary, 40%);
    cursor: pointer;

    &:active {
      transform: scale(0.98);
    }
  }

  &__disclaimer {
    text-align: center;
    font-size: 10px;
    color: #a89b7c;
    margin-top: 12px;
    font-weight: 500;
  }
}

// ====== POPUP ======
.ng-popup-wrapper {
  background: transparent !important;
  overflow: visible !important;
}

.ng-popup {
  width: 100%;
  max-width: 420px;
  background: @bg-dark;
  border-radius: 12px;
  border: 1px solid rgba(255, 162, 0, 0.45);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  &__title {
    font-size: 18px;
    font-weight: 800;
    color: @primary;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 0 10px fade(@primary, 50%);
  }

  &__close {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__hero {
    width: 100%;
    aspect-ratio: 4 / 3;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: linear-gradient(to bottom, fade(@primary, 10%), transparent);

    &-glow {
      position: absolute;
      inset: 0;
      opacity: 0.2;
      background: radial-gradient(circle at center, @primary, transparent, transparent);
    }

    &-img {
      width: 256px;
      height: 256px;
      object-fit: contain;
      position: relative;
      z-index: 10;
    }
  }

  &__timer {
    padding: 0 24px;
    margin-top: -32px;
    position: relative;
    z-index: 20;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
  }

  &__summary {
    margin: 20px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 162, 0, 0.45);
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    &-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: @red;
      display: block;
      margin-bottom: 4px;
    }

    &-value {
      font-size: 20px;
      font-weight: 900;
      color: @secondary;
    }
  }

  &__footer {
    padding: 24px;
    padding-top: 8px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent);
    margin-top: auto;
  }

  &__total-value {
    text-align: center;
    margin-bottom: 16px;

    span {
      font-size: 18px;
      font-weight: 900;
      color: @primary;
      text-transform: uppercase;
      letter-spacing: 3px;
      text-shadow: 0 0 10px fade(@primary, 50%);
    }
  }

  &__buy {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-weight: 900;
    padding: 20px;
    border-radius: 12px;
    border: none;
    font-size: 18px;
    text-transform: uppercase;
    letter-spacing: 4px;
    box-shadow: 0 10px 30px fade(@primary, 40%);
    cursor: pointer;

    &:active {
      transform: scale(0.95);
    }
  }

  &__disclaimer {
    text-align: center;
    font-size: 10px;
    color: rgba(255, 255, 255, 0.3);
    margin-top: 12px;
    font-weight: 500;
  }
}

// ====== AMBIENT ======
.ng-ambient {
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
    right: -10%;
    width: 256px;
    height: 256px;
    background: fade(@primary, 10%);
    filter: blur(100px);
    border-radius: 50%;
  }

  &__yellow {
    position: absolute;
    bottom: 20%;
    left: -10%;
    width: 320px;
    height: 320px;
    background: fade(@secondary, 5%);
    filter: blur(120px);
    border-radius: 50%;
  }
}

// ====== RESPONSIVE ======
@media (min-width: 769px) {
  .ng-main {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
