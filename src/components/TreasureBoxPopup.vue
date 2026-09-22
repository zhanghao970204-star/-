<template>
  <div>
    <!-- Treasure Box Popup -->
    <van-popup
      :show="modelValue"
      @update:show="$emit('update:modelValue', $event)"
      round
      :close-on-click-overlay="true"
      class="tb-popup-wrapper"
    >
      <div class="tb-popup">
        <button class="tb-popup__close" @click="handleClose">
          <van-icon name="cross" size="18" color="rgba(255,255,255,0.4)" />
        </button>

        <!-- Header -->
        <div class="tb-popup__header">
          <div class="tb-popup__grid-bg"></div>
          <p class="tb-popup__mission">{{ $lang.fd_mission_briefing || 'Mission Briefing' }}</p>

          <span class="tb-popup__value-label">{{ $lang.fd_total_reward_value || 'Total Reward Value' }}</span>
          <div class="tb-popup__value-row">
            <span class="tb-popup__value-currency">{{ liveCurrency }}</span>
            <span class="tb-popup__value-amount">{{ totalValue }}</span>
            <span class="tb-popup__value-plus">+</span>
            <span v-if="extraRewardText" class="tb-popup__value-extra">{{ extraRewardText }}</span>
          </div>
          <p class="tb-popup__subtitle">
            {{ $lang.tb_treasure_box || 'Treasure' }} <span class="tb-popup__highlight">{{ $lang.tb_box || 'Box' }}</span>
          </p>

          <!-- Countdown -->
          <div class="tb-popup__timer">
            <span class="tb-popup__timer-label">{{ $lang.fd_critical_deadline || 'Critical Deadline' }}</span>
            <span class="tb-popup__timer-digits">{{ tbCountdown }}</span>
          </div>
        </div>

        <!-- Action -->
        <div class="tb-popup__action">
          <div class="tb-popup__energy">
            <div class="tb-popup__energy-track">
              <div class="tb-popup__energy-fill" :style="{ width: tbEnergy + '%' }"></div>
            </div>
            <p class="tb-popup__energy-text">{{ $lang.fd_energy_critical || 'Energy Level: Critical Status' }}</p>
          </div>

          <button class="tb-popup__btn" :disabled="tbPaying" @click="claimTreasureBox">
            <template v-if="tbPaying">{{ $lang.common_loading || 'Loading...' }}</template>
            <template v-else>
              <span class="tb-popup__btn-label">{{ $lang.fd_claim_now || 'Claim Now' }}</span>
              <span v-if="price" class="tb-popup__btn-price">
                {{ liveCurrency }} {{ $formatNumberWithCommas(price) }}
              </span>
            </template>
          </button>
          <p class="tb-popup__disclaimer">{{ $lang.fd_offer_ends_energy || 'Offer ends when energy runs out' }}</p>
        </div>
      </div>
    </van-popup>
    <service-popup
      v-model="showPayIframe"
      :srcValue="payIframeUrl"
      popupHeight="90vh"
    ></service-popup>
  </div>
</template>

<script>
import { VnRechargeInitS, Pay } from '@/api/common'
import { reportPromoPanel } from '@/utils/common'
import {
  isUsPayRedirect,
  openUsPayBlankWindow,
  goPayUrl,
  closePayWindow
} from '@/utils/payRedirect'

export default {
  name: 'TreasureBoxPopup',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    },
    // Treasure box price used for payment
    price: {
      type: [Number, String],
      default: 0
    },
    // Total reward value shown on header
    totalValue: {
      type: [Number, String],
      default: 0
    },
    // Initial countdown seconds
    countdownSeconds: {
      type: Number,
      default: 86399
    },
    // Energy bar percentage (0-100)
    energy: {
      type: Number,
      default: 65
    },
    // Extra rewards from backend (array of { amount, type })
    rewards: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      tbEnergy: this.energy,
      tbCountdownSeconds: this.countdownSeconds,
      tbCountdownTimer: null,
      tbPaying: false,
      showPayIframe: false,
      payIframeUrl: ''
    }
  },
  computed: {
    // 实时从 localStorage 取，避免 App 初始化时还没登录拿到的快照过期
    liveCurrency() {
      return localStorage.getItem('currency') || this.getCurrency || ''
    },
    extraRewardText() {
      if (!Array.isArray(this.rewards) || this.rewards.length === 0) return ''
      return this.rewards
        .map(r => r && r.amount != null ? r.amount : '')
        .filter(Boolean)
        .join(' + ')
    },
    tbCountdown() {
      const h = Math.floor(this.tbCountdownSeconds / 3600)
      const m = Math.floor((this.tbCountdownSeconds % 3600) / 60)
      const s = this.tbCountdownSeconds % 60
      return (
        String(h).padStart(2, '0') + ':' +
        String(m).padStart(2, '0') + ':' +
        String(s).padStart(2, '0')
      )
    }
  },
  watch: {
    modelValue(v, oldV) {
      if (v) {
        // reset countdown from latest prop each time popup opens
        this.tbCountdownSeconds = this.countdownSeconds
        this.tbEnergy = this.energy
        this.startTbCountdown()
        if (!oldV) reportPromoPanel('treasure_box', 1)
      } else {
        this.clearCountdown()
        if (oldV) reportPromoPanel('treasure_box', 2)
      }
    },
    countdownSeconds(v) {
      // Only reset when the popup is closed, otherwise we keep the running timer
      if (!this.modelValue) {
        this.tbCountdownSeconds = v
      }
    },
    showPayIframe(v) {
      if (!v) this.payIframeUrl = ''
    }
  },
  beforeUnmount() {
    this.clearCountdown()
  },
  methods: {
    handleClose() {
      this.$emit('update:modelValue', false)
    },
    startTbCountdown() {
      if (this.tbCountdownTimer) clearInterval(this.tbCountdownTimer)
      this.tbCountdownTimer = setInterval(() => {
        if (this.tbCountdownSeconds > 0) {
          this.tbCountdownSeconds--
        } else {
          this.clearCountdown()
        }
      }, 1000)
    },
    clearCountdown() {
      if (this.tbCountdownTimer) {
        clearInterval(this.tbCountdownTimer)
        this.tbCountdownTimer = null
      }
    },
    async claimTreasureBox() {
      if (this.tbPaying) return
      this.tbPaying = true
      const isUsRedirect = isUsPayRedirect()
      const payWin = isUsRedirect ? openUsPayBlankWindow() : null
      try {
        const initRes = await VnRechargeInitS()
        if (initRes.status !== 'ok' || !initRes.content.paymentList || initRes.content.paymentList.length === 0) {
          closePayWindow(payWin)
          this.$toast({ message: initRes.msg || 'No payment method', icon: 'cross' })
          return
        }
        const first = initRes.content.paymentList[0]
        const payRes = await Pay({
          paymentAmount: this.price,
          paymentId: first.paymentId,
          paymentKey: first.paymentKey,
          paymentType: first.paymentType,
          rechargeFees: first.rechargeFees,
          phone: initRes.content._account,
          promoType: 'treasure_box'
        })
        if (payRes.status === 'ok') {
          this.$emit('update:modelValue', false)
          const payUrl = payRes.content && payRes.content.url
          if (payUrl) {
            if (isUsRedirect) {
              goPayUrl(payWin, payUrl)
            } else {
              closePayWindow(payWin)
              this.$nextTick(() => {
                this.payIframeUrl = payUrl
                this.showPayIframe = true
              })
            }
          } else {
            closePayWindow(payWin)
            this.$toast({ message: this.$lang.bonus_txt16 || 'Success', icon: 'success' })
          }
          this.$emit('payment-closed')
        } else {
          closePayWindow(payWin)
          this.$toast({ message: payRes.msg || 'Payment failed', icon: 'cross' })
        }
      } catch (e) {
        closePayWindow(payWin)
        console.error('claimTreasureBox error', e)
        this.$toast({ message: this.$lang.network_error || 'Network error', icon: 'cross' })
      } finally {
        this.tbPaying = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
/* ====== Treasure Box Popup (Compact) ====== */
@tb-primary: @primary-color;
@tb-yellow: @primary-color3;
@tb-red: #dc2626;
@tb-bg: #15110a;
@muted: #a89b7c;

.tb-popup-wrapper {
  background: transparent !important;
  overflow: visible !important;
  display: flex;
  justify-content: center;
  align-items: center;
}

.tb-popup {
  position: relative;
  width: 300px;
  background: @tb-bg;
  border: 2px solid fade(@border-color, 50%);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.6),
              0 0 20px fade(@primary-color, 15%);

  &__close {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 10;
    background: none;
    border: none;
    cursor: pointer;
  }

  /* ---- Header Section ---- */
  &__header {
    position: relative;
    padding: 28px 20px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    border-bottom: 1px solid fade(@border-color, 18%);
    background: linear-gradient(180deg, fade(@primary-color, 14%), fade(@cont-bg, 45%));
    overflow: hidden;
  }

  &__grid-bg {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(fade(@tb-primary, 14%) 1px, transparent 1px);
    background-size: 20px 20px;
    opacity: 0.3;
    pointer-events: none;
  }

  &__mission {
    position: relative;
    z-index: 1;
    font-size: 11px;
    font-weight: 900;
    color: @muted;
    letter-spacing: 3px;
    text-transform: uppercase;
    margin-bottom: 16px;
  }

  &__value-label {
    position: relative;
    z-index: 1;
    font-size: 9px;
    font-weight: 700;
    color: fade(@muted, 80%);
    text-transform: uppercase;
    letter-spacing: 3px;
    margin-bottom: 4px;
  }

  &__value-row {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: nowrap;
    white-space: nowrap;
  }

  &__value-currency {
    font-size: 18px;
    font-weight: 900;
    color: @tb-yellow;
    margin-top: 10px;
  }

  &__value-amount {
    font-size: 56px;
    line-height: 1;
    font-weight: 900;
    color: @tb-yellow;
    letter-spacing: -2px;
    filter: drop-shadow(0 0 16px fade(@tb-yellow, 35%));
  }

  &__value-plus {
    font-size: 18px;
    font-weight: 900;
    color: @tb-yellow;
    margin-top: 10px;
    margin-left: 2px;
  }

  &__value-extra {
    font-size: 22px;
    line-height: 1;
    font-weight: 900;
    color: @tb-yellow;
    margin-left: 2px;
    margin-top: 8px;
    filter: drop-shadow(0 0 10px fade(@tb-yellow, 35%));
  }

  &__subtitle {
    position: relative;
    z-index: 1;
    font-size: 12px;
    font-weight: 700;
    color: fade(@wihte-color, 65%);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
    margin-bottom: 12px;
  }

  &__highlight {
    color: @tb-yellow;
  }

  /* ---- Countdown ---- */
  &__timer {
    position: relative;
    z-index: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 220px;
    background: rgba(0, 0, 0, 0.4);
    padding: 10px 16px;
    border-radius: 12px;
    border: 1px solid fade(@tb-red, 20%);

    &-label {
      font-size: 9px;
      font-weight: 900;
      color: fade(@tb-red, 80%);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 4px;
    }

    &-digits {
      font-size: 26px;
      font-weight: 900;
      color: @tb-red;
      letter-spacing: 1px;
      text-shadow: 0 0 12px fade(@tb-red, 60%);
    }
  }

  /* ---- Action Section ---- */
  &__action {
    padding: 16px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__energy {
    width: 100%;
    margin-bottom: 12px;

    &-track {
      width: 100%;
      height: 10px;
      background: #1f1c17;
      border-radius: 999px;
      padding: 2px;
      border: 1px solid fade(@border-color, 20%);
      box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.5);
    }

    &-fill {
      height: 100%;
      background: @primary-gradient-h;
      border-radius: 999px;
      box-shadow: 0 0 8px fade(@tb-primary, 50%);
    }

    &-text {
      font-size: 8px;
      color: @muted;
      text-transform: uppercase;
      font-weight: 900;
      letter-spacing: 1px;
      margin-top: 4px;
      text-align: center;
    }
  }

  &__btn {
    width: 100%;
    background: @primary-gradient;
    color: @primary-text-on;
    font-weight: 900;
    padding: 10px 12px;
    border-radius: 10px;
    border: none;
    text-transform: uppercase;
    box-shadow: 0 4px 0 @primary-color2;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
    line-height: 1.2;

    &:active {
      box-shadow: none;
      transform: translateY(4px);
    }

    &:disabled {
      opacity: 0.6;
    }
  }

  &__btn-label {
    font-size: 16px;
    letter-spacing: 0.5px;
  }

  &__btn-price {
    font-size: 12px;
    font-weight: 700;
    opacity: 0.7;
    text-transform: none;
    letter-spacing: 0;
  }

  &__disclaimer {
    margin-top: 8px;
    font-size: 8px;
    color: @muted;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
  }
}
</style>
