<template>
  <div>
    <!-- First Recharge Popup -->
    <van-popup
      :show="modelValue"
      @update:show="$emit('update:modelValue', $event)"
      round
      :close-on-click-overlay="true"
      class="fr-popup-wrapper"
    >
      <div class="fr-popup">
        <button class="fr-popup__close" @click="handleClose">
          <van-icon name="cross" size="18" color="rgba(255,255,255,0.4)" />
        </button>

        <!-- Header -->
        <div class="fr-popup__header">
          <div class="fr-popup__grid-bg"></div>
          <p class="fr-popup__mission">{{ $lang.fr_limited_offer || 'Limited Time Offer' }}</p>
          <p class="fr-popup__subtitle">
            {{ $lang.fr_title_short || 'First' }} <span class="fr-popup__highlight">{{ $lang.fr_bonus || 'Recharge' }}</span>
          </p>

          <!-- Countdown: before purchase → buy deadline; after purchase → next claim unlock -->
          <div v-if="headerCountdown" class="fr-popup__timer">
            <span class="fr-popup__timer-label">{{ headerCountdownLabel }}</span>
            <span class="fr-popup__timer-digits">{{ headerCountdown }}</span>
          </div>
        </div>

        <!-- Unpurchased: show price + buy button -->
        <div v-if="!isPurchased" class="fr-popup__action">
          <div class="fr-popup__price-card">
            <div class="fr-popup__price-main">
              <span class="fr-popup__price-currency">{{ liveCurrency }}</span>
              <span class="fr-popup__price">{{ $formatNumberWithCommas(price) }}</span>
            </div>
            <div v-if="originalPrice" class="fr-popup__price-meta">
              <span class="fr-popup__original-price">{{ liveCurrency }} {{ $formatNumberWithCommas(originalPrice) }}</span>
              <span v-if="discountPercent > 0" class="fr-popup__discount">-{{ discountPercent }}%</span>
            </div>
          </div>
          <button class="fr-popup__btn" :disabled="!price" @click="buyGiftPack">
            {{ ctaText }}
          </button>
          <p class="fr-popup__up-to">
            {{ $lang.fr_up_to_prefix || 'Receive up to' }}
            <span class="fr-popup__up-to-percent">{{ upToBonusText }}</span>
            {{ $lang.fr_up_to_suffix || 'rewards.' }}
          </p>
          <p class="fr-popup__disclaimer">{{ $lang.fd_limited_one || 'Limited to one purchase per user.' }}</p>
        </div>

        <!-- Purchased: show 3-day claim list -->
        <div v-else class="fr-popup__action">
          <div class="fr-popup__days">
            <div
              v-for="day in dayList"
              :key="day.index"
              class="fr-popup__day"
              :class="{ 'is-claimable': day.status === 1, 'is-claimed': day.status === 2, 'is-locked': day.status === 0 }"
            >
              <div class="fr-popup__day-label">
                <span class="fr-popup__day-title">{{ ($lang.fr_day || 'Day') + ' ' + day.index }}</span>
                <span v-if="day.amountText" class="fr-popup__day-amount">{{ day.amountText }}</span>
              </div>
              <button
                v-if="day.status === 1"
                class="fr-popup__day-btn is-claim"
                :disabled="claimingDay === day.index"
                @click="claimDay(day.index)"
              >
                {{ claimingDay === day.index ? '...' : ($lang.fd_claim_now || 'Claim') }}
              </button>
              <span v-else-if="day.status === 2" class="fr-popup__day-btn is-done">
                {{ $lang.fr_claimed || 'Claimed' }}
              </span>
              <span v-else class="fr-popup__day-btn is-lock">
                {{ day.availableText || ($lang.fr_locked || 'Locked') }}
              </span>
            </div>
          </div>
          <p class="fr-popup__disclaimer">{{ $lang.fr_daily_hint || 'Return each day to claim your reward.' }}</p>
        </div>
      </div>
    </van-popup>
    <service-popup
      v-model="showPayIframe"
      :srcValue="payIframeUrl"
      popupHeight="90vh"
    ></service-popup>
    <gift-pay-sheet
      v-model="showPaySheet"
      :amount="price"
      :promo-type="promoType"
      @success="onGiftPaySuccess"
    />
  </div>
</template>

<script>
import { ReceiveNewPlayerGiftPack } from '@/api/common'
import { reportPromoPanel } from '@/utils/common'
import {
  goPayUrl,
  closePayWindow
} from '@/utils/payRedirect'
import GiftPaySheet from '@/components/GiftPaySheet.vue'

export default {
  name: 'FirstRechargePopup',
  components: { GiftPaySheet },
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    packData: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      claimingDay: 0,
      nowTs: Math.floor(Date.now() / 1000),
      tickTimer: null,
      showPayIframe: false,
      payIframeUrl: '',
      showPaySheet: false
    }
  },
  computed: {
    // 实时国家货币（避免 App 启动早于登录时 mixin 拍下空快照）
    liveCurrency() {
      return localStorage.getItem('currency') || this.getCurrency || ''
    },
    isPurchased() {
      return this.packData && Number(this.packData.purchased) === 1
    },
    price() {
      return (this.packData && this.packData.price) || 0
    },
    originalPrice() {
      return (this.packData && this.packData.originalPrice) || ''
    },
    promoType() {
      return (this.packData && this.packData.promoType) || 'first_recharge_new_1'
    },
    ctaText() {
      return this.$lang.fr_recharge_now || 'Recharge Now'
    },
    /** 百分比 = price / originalPrice * 100（与页面 Day1 文案同一套） */
    discountPercent() {
      const p = Number(this.price) || 0
      const o = Number(this.originalPrice) || 0
      if (!o || p <= 0) return 0
      return Math.round((p / o) * 100)
    },
    /** 入账金额 = price + immediateBonus + day2Max + day3Max */
    creditTotalAmount() {
      const d = this.packData || {}
      return (
        (Number(d.price) || 0) +
        (Number(d.immediateBonus) || 0) +
        (Number(d.day2Max) || 0) +
        (Number(d.day3Max) || 0)
      )
    },
    /** 展示：+ MXN 158（货币在加号后、金额前） */
    upToBonusText() {
      const total = this.creditTotalAmount
      if (!total) return ''
      const amount = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(total)
        : total
      const currency = this.liveCurrency || ''
      return '+ ' + currency + ' ' + amount
    },
    headerTargetSec() {
      if (!this.packData) return 0
      const toSec = (t) => {
        const n = Number(t) || 0
        return n > 1e12 ? Math.floor(n / 1000) : n
      }
      if (this.isPurchased) {
        const times = [1, 2, 3]
          .map(i => toSec(this.packData['day' + i + 'AvailableTime']))
          .filter(t => t > this.nowTs)
          .sort((a, b) => a - b)
        return times[0] || 0
      }
      return toSec(this.packData.expireTime)
    },
    headerCountdownLabel() {
      if (this.isPurchased) return this.$lang.fr_next_unlock || 'Next Unlock'
      return this.$lang.fd_critical_deadline || 'Ends In'
    },
    headerCountdown() {
      const target = this.headerTargetSec
      if (!target) return ''
      const diff = target - this.nowTs
      if (diff <= 0) return ''
      const d = Math.floor(diff / 86400)
      const h = Math.floor((diff % 86400) / 3600)
      const m = Math.floor((diff % 3600) / 60)
      const s = diff % 60
      if (d > 0) {
        return d + 'd ' +
          String(h).padStart(2, '0') + ':' +
          String(m).padStart(2, '0') + ':' +
          String(s).padStart(2, '0')
      }
      return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
      )
    },
    dayList() {
      if (!this.packData) return []
      // 货币始终用本地国家
      const currency = this.liveCurrency || this.packData.currency || ''
      const fmt = (n) => this.$formatNumberWithCommas ? this.$formatNumberWithCommas(n) : n
      const amountFor = (i) => {
        if (i === 1) {
          const v = Number(this.packData.immediateBonus || 0)
          return v ? (currency + ' ' + fmt(v)) : ''
        }
        if (i === 3) return '???'
        const min = Number(this.packData['day' + i + 'Min'] || 0)
        const max = Number(this.packData['day' + i + 'Max'] || 0)
        if (!min && !max) return ''
        if (!min || !max || min === max) {
          return currency + ' ' + fmt(min || max)
        }
        return currency + ' ' + fmt(min) + ' ~ ' + fmt(max)
      }
      return [1, 2, 3].map(i => {
        const status = Number(this.packData['day' + i + 'Status'] || 0)
        let availableTime = Number(this.packData['day' + i + 'AvailableTime'] || 0)
        if (availableTime > 1e12) availableTime = Math.floor(availableTime / 1000)
        let availableText = ''
        if (status === 0 && availableTime > 0) {
          const diff = availableTime - this.nowTs
          if (diff > 0) {
            const h = Math.floor(diff / 3600)
            const m = Math.floor((diff % 3600) / 60)
            availableText = h + 'h ' + m + 'm'
          }
        }
        return { index: i, status, availableTime, availableText, amountText: amountFor(i) }
      })
    }
  },
  watch: {
    modelValue(v, oldV) {
      if (v) {
        this.startTick()
        if (!oldV) reportPromoPanel('new_player_giftpack', 1)
      } else {
        this.stopTick()
        if (oldV) reportPromoPanel('new_player_giftpack', 2)
      }
    },
    showPayIframe(v) {
      if (!v) this.payIframeUrl = ''
    }
  },
  beforeUnmount() {
    this.stopTick()
  },
  methods: {
    handleClose() {
      this.$emit('update:modelValue', false)
    },
    startTick() {
      this.stopTick()
      this.nowTs = Math.floor(Date.now() / 1000)
      this.tickTimer = setInterval(() => {
        this.nowTs = Math.floor(Date.now() / 1000)
      }, 1000)
    },
    stopTick() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer)
        this.tickTimer = null
      }
    },
    buyGiftPack() {
      if (!this.price || this.showPaySheet) return
      this.showPaySheet = true
    },
    onGiftPaySuccess({ url, payWin, isUsRedirect }) {
      this.$emit('update:modelValue', false)
      if (url) {
        if (isUsRedirect) {
          goPayUrl(payWin, url)
        } else {
          closePayWindow(payWin)
          this.$nextTick(() => {
            this.payIframeUrl = url
            this.showPayIframe = true
          })
        }
      } else {
        closePayWindow(payWin)
        this.$toast({ message: this.$lang.bonus_txt16 || 'Success', icon: 'success' })
      }
      this.$emit('refresh')
    },
    async claimDay(dayIndex) {
      if (this.claimingDay) return
      this.claimingDay = dayIndex
      try {
        const res = await ReceiveNewPlayerGiftPack({ dayIndex })
        if (res && res.status === 'ok') {
          const amount = res.content && (res.content.amount || res.content.reward)
          const msg = amount
            ? '+' + this.$formatNumberWithCommas(amount) + ' ' + (this.getCurrency || '')
            : (this.$lang.bonus_txt16 || 'Success')
          this.$toast({ message: msg, icon: 'success' })
          this.$emit('refresh')
        } else {
          this.$toast({ message: (res && res.msg) || 'Failed', icon: 'cross' })
        }
      } catch (e) {
        console.error('claimDay error', e)
        this.$toast({ message: this.$lang.network_error || 'Network error', icon: 'cross' })
      } finally {
        this.claimingDay = 0
      }
    }
  }
}
</script>

<style lang="less" scoped>
/* ====== First Recharge Popup ====== */
@fr-primary: @primary-color;
@fr-accent: @primary-color2;
@fr-yellow: @primary-color3;
@fr-green: @primary-color;
@fr-red: #dc2626;
@fr-bg: #15110a;
@muted: #a89b7c;
@gold-soft: #ffe4b5;

.fr-popup-wrapper {
  background: transparent !important;
  overflow: visible !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.fr-popup {
  position: relative;
  width: 300px;
  background: @fr-bg;
  border: 2px solid fade(@border-color, 55%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6),
              0 0 24px fade(@primary-color, 20%);

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__header {
    position: relative;
    padding: 28px 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid fade(@border-color, 18%);
    background: linear-gradient(180deg, fade(@primary-color, 18%), fade(@cont-bg, 40%));
    overflow: hidden;
  }

  &__grid-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(fade(@fr-accent, 18%) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.4;
    pointer-events: none;
  }

  &__mission {
    position: relative;
    z-index: 1;
    font-size: 11px;
    font-weight: 900;
    color: @fr-yellow;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 10px;
  }

  &__subtitle {
    position: relative;
    z-index: 1;
    font-size: 18px;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.9);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
  }

  &__highlight {
    color: @fr-yellow;
  }

  &__timer {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: rgba(0, 0, 0, 0.4);
    padding: 8px 14px;
    border-radius: 10px;
    border: 1px solid fade(@fr-red, 20%);

    &-label {
      font-size: 9px;
      font-weight: 900;
      color: fade(@fr-red, 80%);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }

    &-digits {
      font-size: 22px;
      font-weight: 900;
      color: @fr-red;
      letter-spacing: 1px;
      text-shadow: 0 0 12px fade(@fr-red, 60%);
    }
  }

  &__action {
    padding: 16px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__price-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 14px 12px 12px;
    margin-bottom: 14px;
    border-radius: 12px;
    background: linear-gradient(180deg, fade(@primary-color3, 14%), fade(@primary-color, 10%));
    border: 1px solid fade(@border-color, 35%);
  }

  &__price-main {
    display: flex;
    align-items: baseline;
    gap: 6px;
  }

  &__price-currency {
    font-size: 16px;
    font-weight: 900;
    color: @fr-yellow;
  }

  &__price {
    font-size: 36px;
    font-weight: 900;
    color: @fr-yellow;
    line-height: 1;
    letter-spacing: -1px;
    text-shadow: 0 0 12px fade(@fr-yellow, 35%);
  }

  &__price-meta {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__original-price {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.4);
    text-decoration: line-through;
  }

  &__discount {
    font-size: 11px;
    font-weight: 900;
    color: @primary-text-on;
    background: @primary-gradient;
    padding: 2px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }

  &__btn {
    width: 100%;
    background: @primary-gradient;
    color: @primary-text-on;
    font-weight: 900;
    font-size: 15px;
    padding: 12px;
    border-radius: 24px;
    border: none;
    text-transform: uppercase;
    box-shadow: 0 4px 14px rgba(255, 163, 0, 0.28);
    cursor: pointer;

    &:active {
      box-shadow: 0 2px 8px rgba(255, 163, 0, 0.2);
      transform: scale(0.98);
      opacity: 0.92;
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  &__disclaimer {
    margin-top: 10px;
    font-size: 9px;
    color: @muted;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
  }

  &__up-to {
    margin-top: 10px;
    text-align: center;
    font-size: 13px;
    color: @gold-soft;
    font-weight: 600;
  }

  &__up-to-percent {
    display: inline-block;
    margin: 0 4px;
    padding: 2px 8px;
    font-size: 16px;
    font-weight: 900;
    color: @primary-color;
    background: fade(@primary-color, 15%);
    border: 1px solid fade(@border-color, 45%);
    border-radius: 6px;
    text-shadow: 0 0 6px fade(@primary-color, 40%);
  }

  &__days {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__day {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 10px;
    background: fade(@cell-bg, 60%);
    border: 1px solid fade(@border-color, 18%);

    &.is-claimable {
      border-color: @fr-green;
      box-shadow: 0 0 10px fade(@fr-green, 30%);
    }

    &.is-claimed {
      opacity: 0.55;
    }
  }

  &__day-label {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__day-title {
    font-size: 13px;
    font-weight: 800;
    color: @wihte-color;
  }

  &__day-amount {
    font-size: 11px;
    font-weight: 700;
    color: @fr-yellow;
    letter-spacing: 0.3px;
    text-shadow: 0 0 6px fade(@fr-yellow, 25%);
  }

  &__day-btn {
    min-width: 78px;
    text-align: center;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 800;
    border: none;
    cursor: pointer;

    &.is-claim {
      background: @primary-gradient;
      color: @primary-text-on;
    }

    &.is-done {
      background: fade(@wihte-color, 6%);
      color: fade(@wihte-color, 50%);
    }

    &.is-lock {
      background: fade(@wihte-color, 4%);
      color: fade(@wihte-color, 35%);
      font-size: 11px;
    }

    &:disabled {
      opacity: 0.6;
    }
  }
}
</style>
