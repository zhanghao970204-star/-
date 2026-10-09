<template>
  <div>
    <van-popup
      :show="modelValue"
      @update:show="$emit('update:modelValue', $event)"
      round
      :close-on-click-overlay="true"
      class="tb-popup-wrapper"
    >
      <div class="tb-popup">
        <button type="button" class="tb-popup__close" @click="handleClose">
          <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
            <path
              d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
              fill="none"
              stroke="#fff"
              stroke-width="2.6"
              stroke-linecap="round"
            />
          </svg>
        </button>

        <div class="tb-popup__visual">
          <img
            class="tb-popup__hero"
            src="@/assets/img/bonus/treasurebox/hero.png"
            alt=""
          />
          <img
            class="tb-popup__title-img"
            src="@/assets/img/bonus/treasurebox/title.png"
            alt="Mission Briefing"
          />
        </div>

        <div class="tb-popup__body">
          <p class="tb-popup__value-label">
            {{ $lang.fd_total_reward_value || "Total Reward Value" }}
          </p>
          <div class="tb-popup__price-wrap">
            <div v-if="extraRewardText" class="tb-popup__ribbon">
              <img
                class="tb-popup__ribbon-bg"
                src="@/assets/img/bonus/firstrecharge/ribbon.png"
                alt=""
              />
              <div class="tb-popup__ribbon-inner">
                <span>+{{ extraRewardText }}</span>
              </div>
            </div>
            <div class="tb-popup__value-bar">
              <img
                class="tb-popup__value-bar-bg"
                src="@/assets/img/bonus/firstrecharge/price_bar.png"
                alt=""
              />
              <div class="tb-popup__value-main">
                <span class="tb-popup__value-currency">{{ liveCurrency }}</span>
                <span class="tb-popup__value-amount">{{
                  $formatNumberWithCommas(totalValue)
                }}</span>
              </div>
            </div>
          </div>

          <p class="tb-popup__subtitle">
            {{ $lang.tb_treasure_box || "Treasure" }}
            <span class="tb-popup__highlight">{{ $lang.tb_box || "Box" }}</span>
          </p>

          <div class="tb-popup__timer">
            <p class="tb-popup__timer-label">
              {{ $lang.fd_critical_deadline || "Critical Deadline" }}
            </p>
            <div class="tb-popup__timer-row">
              <span class="tb-popup__timer-cell">
                <img
                  src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                  alt=""
                />
                <em>{{ countdownParts.h }}</em>
              </span>
              <span class="tb-popup__timer-colon">:</span>
              <span class="tb-popup__timer-cell">
                <img
                  src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                  alt=""
                />
                <em>{{ countdownParts.m }}</em>
              </span>
              <span class="tb-popup__timer-colon">:</span>
              <span class="tb-popup__timer-cell">
                <img
                  src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                  alt=""
                />
                <em>{{ countdownParts.s }}</em>
              </span>
            </div>
          </div>

          <div class="tb-popup__energy">
            <div class="tb-popup__energy-track">
              <div
                class="tb-popup__energy-fill"
                :style="{ width: tbEnergy + '%' }"
              ></div>
            </div>
            <p class="tb-popup__energy-text">
              {{ $lang.fd_energy_critical || "Energy Level: Critical Status" }}
            </p>
          </div>

          <button
            type="button"
            class="tb-popup__btn"
            :disabled="tbPaying"
            @click="claimTreasureBox"
          >
            <template v-if="tbPaying">{{
              $lang.common_loading || "Loading..."
            }}</template>
            <template v-else>
              <span class="tb-popup__btn-main">{{
                $lang.fd_claim_now || "Claim Now"
              }}</span>
              <span v-if="price" class="tb-popup__btn-sub">
                <em>{{ liveCurrency }} {{ $formatNumberWithCommas(price) }}</em>
              </span>
            </template>
          </button>

          <p class="tb-popup__disclaimer">
            {{
              $lang.fd_offer_ends_energy || "Offer ends when energy runs out"
            }}
          </p>
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
import { VnRechargeInitS, Pay } from "@/api/common";
import { reportPromoPanel } from "@/utils/common";
import {
  isUsPayRedirect,
  openUsPayBlankWindow,
  goPayUrl,
  closePayWindow,
} from "@/utils/payRedirect";

export default {
  name: "TreasureBoxPopup",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    price: {
      type: [Number, String],
      default: 0,
    },
    totalValue: {
      type: [Number, String],
      default: 0,
    },
    countdownSeconds: {
      type: Number,
      default: 86399,
    },
    energy: {
      type: Number,
      default: 65,
    },
    rewards: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      tbEnergy: this.energy,
      tbCountdownSeconds: this.countdownSeconds,
      tbCountdownTimer: null,
      tbPaying: false,
      showPayIframe: false,
      payIframeUrl: "",
    };
  },
  computed: {
    liveCurrency() {
      return localStorage.getItem("currency") || this.getCurrency || "";
    },
    extraRewardText() {
      if (!Array.isArray(this.rewards) || this.rewards.length === 0) return "";
      return this.rewards
        .map((r) => (r && r.amount != null ? r.amount : ""))
        .filter(Boolean)
        .join(" + ");
    },
    countdownParts() {
      const h = Math.floor(this.tbCountdownSeconds / 3600);
      const m = Math.floor((this.tbCountdownSeconds % 3600) / 60);
      const s = this.tbCountdownSeconds % 60;
      return {
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      };
    },
  },
  watch: {
    modelValue(v, oldV) {
      if (v) {
        this.tbCountdownSeconds = this.countdownSeconds;
        this.tbEnergy = this.energy;
        this.startTbCountdown();
        if (!oldV) reportPromoPanel("treasure_box", 1);
      } else {
        this.clearCountdown();
        if (oldV) reportPromoPanel("treasure_box", 2);
      }
    },
    countdownSeconds(v) {
      if (!this.modelValue) {
        this.tbCountdownSeconds = v;
      }
    },
    showPayIframe(v) {
      if (!v) this.payIframeUrl = "";
    },
  },
  beforeUnmount() {
    this.clearCountdown();
  },
  methods: {
    handleClose() {
      this.$emit("update:modelValue", false);
    },
    startTbCountdown() {
      if (this.tbCountdownTimer) clearInterval(this.tbCountdownTimer);
      this.tbCountdownTimer = setInterval(() => {
        if (this.tbCountdownSeconds > 0) {
          this.tbCountdownSeconds--;
        } else {
          this.clearCountdown();
        }
      }, 1000);
    },
    clearCountdown() {
      if (this.tbCountdownTimer) {
        clearInterval(this.tbCountdownTimer);
        this.tbCountdownTimer = null;
      }
    },
    async claimTreasureBox() {
      if (this.tbPaying) return;
      this.tbPaying = true;
      const isUsRedirect = isUsPayRedirect();
      const payWin = isUsRedirect ? openUsPayBlankWindow() : null;
      try {
        const initRes = await VnRechargeInitS();
        if (
          initRes.status !== "ok" ||
          !initRes.content.paymentList ||
          initRes.content.paymentList.length === 0
        ) {
          closePayWindow(payWin);
          this.$toast({
            message: initRes.msg || "No payment method",
            icon: "cross",
          });
          return;
        }
        const first = initRes.content.paymentList[0];
        const payRes = await Pay({
          paymentAmount: this.price,
          paymentId: first.paymentId,
          paymentKey: first.paymentKey,
          paymentType: first.paymentType,
          rechargeFees: first.rechargeFees,
          phone: initRes.content._account,
          promoType: "treasure_box",
        });
        if (payRes.status === "ok") {
          this.$emit("update:modelValue", false);
          const payUrl = payRes.content && payRes.content.url;
          if (payUrl) {
            if (isUsRedirect) {
              goPayUrl(payWin, payUrl);
            } else {
              closePayWindow(payWin);
              this.$nextTick(() => {
                this.payIframeUrl = payUrl;
                this.showPayIframe = true;
              });
            }
          } else {
            closePayWindow(payWin);
            this.$toast({
              message: this.$lang.bonus_txt16 || "Success",
              icon: "success",
            });
          }
          this.$emit("payment-closed");
        } else {
          closePayWindow(payWin);
          this.$toast({
            message: payRes.msg || "Payment failed",
            icon: "cross",
          });
        }
      } catch (e) {
        closePayWindow(payWin);
        console.error("claimTreasureBox error", e);
        this.$toast({
          message: this.$lang.network_error || "Network error",
          icon: "cross",
        });
      } finally {
        this.tbPaying = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@tb-yellow: #fbff00;
@muted: #9b7ab8;

.tb-popup-wrapper {
  width: 86% !important;
  max-width: 360px;
  background: transparent !important;
  overflow: visible !important;
}

.tb-popup {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #2b0740 0%, #1a0428 55%, #12021a 100%);
  border-radius: 22px;
  border: 1px solid fade(#9b4dff, 45%);
  overflow: visible;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.55);

  &__close {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 5;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__visual {
    position: relative;
    padding: 8px 10px 0;
    text-align: center;
  }

  &__hero {
    display: block;
    width: 90px;
    height: 90px;
    margin: 0 auto -6px;
    object-fit: contain;
    pointer-events: none;
    /* 资源自带黑底，用 screen 去掉纯黑 */
    mix-blend-mode: screen;
  }

  &__title-img {
    display: block;
    width: 92%;
    max-width: 310px;
    margin: -18px auto 0;
    height: auto;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  &__body {
    padding: 6px 16px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__value-label {
    margin: 0 0 6px;
    font-size: 10px;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: 1.5px;
    text-transform: uppercase;
  }

  /* 复用首充：price_bar + ribbon */
  &__price-wrap {
    position: relative;
    width: 100%;
  }

  &__ribbon {
    position: absolute;
    left: 50%;
    top: 0;
    z-index: 2;
    width: 42%;
    max-width: 140px;
    transform: translateX(-50%);
  }

  &__ribbon-bg {
    display: block;
    width: 100%;
    height: auto;
  }

  &__ribbon-inner {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 10px 2px;
    box-sizing: border-box;
    font-size: 11px;
    font-weight: 900;
    color: #fff;
    white-space: nowrap;
  }

  &__value-bar {
    position: relative;
    width: 100%;
  }

  &__value-bar-bg {
    display: block;
    width: 100%;
    height: auto;
  }

  &__value-main {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 28px;
    box-sizing: border-box;
    white-space: nowrap;
  }

  &__value-currency {
    font-size: 28px;
    font-weight: 600;
    color: @tb-yellow;
  }

  &__value-amount {
    font-size: 28px;
    font-weight: 600;
    color: @tb-yellow;
    line-height: 1;
    letter-spacing: -0.5px;
    text-shadow: 0 0 10px fade(@tb-yellow, 35%);
  }

  &__subtitle {
    margin: 8px 0 10px;
    font-size: 12px;
    font-weight: 700;
    color: fade(#fff, 70%);
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__highlight {
    color: @tb-yellow;
  }

  &__timer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 12px;
  }

  &__timer-label {
    margin: 0 0 10px;
    font-size: 13px;
    font-weight: 800;
    color: #fff;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.45);
  }

  &__timer-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  &__timer-cell {
    position: relative;
    width: 56px;
    height: 56px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      pointer-events: none;
    }

    em {
      position: relative;
      z-index: 1;
      font-style: normal;
      font-size: 26px;
      font-weight: 600;
      color: #fff;
      font-variant-numeric: tabular-nums;
      line-height: 1;
      text-shadow:
        -1.5px -1.5px 0 #1a0428,
        1.5px -1.5px 0 #1a0428,
        -1.5px 1.5px 0 #1a0428,
        1.5px 1.5px 0 #1a0428,
        0 -1.5px 0 #1a0428,
        0 1.5px 0 #1a0428,
        -1.5px 0 0 #1a0428,
        1.5px 0 0 #1a0428,
        0 3px 6px rgba(0, 0, 0, 0.35);
    }
  }

  &__timer-colon {
    font-size: 26px;
    font-weight: 900;
    color: #fff;
    line-height: 1;
    margin-top: -2px;
    text-shadow:
      -1.5px -1.5px 0 #1a0428,
      1.5px -1.5px 0 #1a0428,
      -1.5px 1.5px 0 #1a0428,
      1.5px 1.5px 0 #1a0428,
      0 -1.5px 0 #1a0428,
      0 1.5px 0 #1a0428,
      -1.5px 0 0 #1a0428,
      1.5px 0 0 #1a0428,
      0 3px 6px rgba(0, 0, 0, 0.35);
  }

  &__energy {
    width: 100%;
    margin-bottom: 12px;

    /* 设计稿：轨道底 #670995→#A414E7，描边 #FFDD64→#FFB303，内阴影 #4F0572 */
    &-track {
      width: 100%;
      height: 16px;
      border-radius: 999px;
      padding: 2px;
      box-sizing: border-box;
      border: 1px solid transparent;
      background:
        linear-gradient(90deg, #670995 0%, #a414e7 100%) padding-box,
        linear-gradient(90deg, #ffdd64 0%, #ffb303 100%) border-box;
      box-shadow:
        inset 0 -4px 4px #4f0572,
        inset 0 4px 4px #4f0572;
      overflow: hidden;
    }

    /* 设计稿填充：#E1FF81 → #CDF744 → #9DEF06 */
    &-fill {
      height: 100%;
      min-width: 0;
      border-radius: 999px;
      background: linear-gradient(90deg, #e1ff81 0%, #cdf744 50%, #9def06 100%);
      box-shadow: 0 0 6px fade(#9def06, 55%);
    }

    &-text {
      margin: 6px 0 0;
      font-size: 9px;
      color: #d7a2fa;
      text-transform: uppercase;
      font-weight: 800;
      letter-spacing: 1px;
      text-align: center;
    }
  }

  /* 复用首充绿色 3D 按钮 */
  &__btn {
    .btn-3d-green();
    width: 100%;
    height: auto;
    min-height: 52px;
    padding: 8px 12px 10px;
    flex-direction: column;
    gap: 2px;
    font-size: 16px;

    &:disabled {
      opacity: 0.6;
    }
  }

  &__btn-main {
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    color: #fff;
  }

  &__btn-sub {
    font-size: 12px;
    font-weight: 700;
    color: fade(#fff, 92%);
    text-transform: none;
    letter-spacing: 0;

    em {
      font-style: normal;
      color: @tb-yellow;
      font-weight: 900;
    }
  }

  &__disclaimer {
    margin-top: 10px;
    font-size: 9px;
    color: @muted;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 0.8px;
    text-align: center;
  }
}
</style>
