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
        <button type="button" class="fr-popup__close" @click="handleClose">
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

        <div class="fr-popup__visual">
          <img
            class="fr-popup__hero"
            src="@/assets/img/bonus/firstrecharge/hero.png"
            alt=""
          />
          <img
            class="fr-popup__title-img"
            src="@/assets/img/bonus/firstrecharge/title.png"
            alt=""
          />
        </div>

        <div class="fr-popup__body">
          <!-- Unpurchased: price + timer + buy -->
          <div v-if="!isPurchased" class="fr-popup__action">
            <div class="fr-popup__price-wrap">
              <div v-if="originalPrice" class="fr-popup__ribbon">
                <img
                  class="fr-popup__ribbon-bg"
                  src="@/assets/img/bonus/firstrecharge/ribbon.png"
                  alt=""
                />
                <div class="fr-popup__ribbon-inner">
                  <span class="fr-popup__original-price"
                    >{{ liveCurrency }}
                    {{ $formatNumberWithCommas(originalPrice) }}</span
                  >
                  <span v-if="discountPercent > 0" class="fr-popup__discount"
                    >-{{ discountPercent }}%</span
                  >
                </div>
              </div>
              <div class="fr-popup__price-bar">
                <img
                  class="fr-popup__price-bar-bg"
                  src="@/assets/img/bonus/firstrecharge/price_bar.png"
                  alt=""
                />
                <div class="fr-popup__price-main">
                  <span class="fr-popup__price-currency">{{
                    liveCurrency
                  }}</span>
                  <span class="fr-popup__price">{{
                    $formatNumberWithCommas(price)
                  }}</span>
                </div>
              </div>
            </div>

            <div v-if="countdownParts" class="fr-popup__timer">
              <p class="fr-popup__timer-label">
                {{ headerCountdownLabel }}
              </p>
              <div class="fr-popup__timer-row">
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.h }}</em>
                </span>
                <span class="fr-popup__timer-colon">:</span>
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.m }}</em>
                </span>
                <span class="fr-popup__timer-colon">:</span>
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.s }}</em>
                </span>
              </div>
            </div>

            <button
              class="fr-popup__btn"
              :disabled="!price"
              @click="buyGiftPack"
            >
              <span class="fr-popup__btn-main">{{ ctaText }}</span>
              <span v-if="upToBonusPlain" class="fr-popup__btn-sub">
                {{ $lang.fr_up_to_prefix || "Receive up to" }}
                <em>{{ upToBonusPlain }}</em>
                {{ $lang.fr_rewards || "Rewards" }}
              </span>
            </button>
            <p class="fr-popup__disclaimer">
              {{ $lang.fd_limited_one || "Limited to one purchase per user." }}
            </p>
          </div>

          <!-- Purchased: 3-day claim list -->
          <div v-else class="fr-popup__action">
            <div v-if="countdownParts" class="fr-popup__timer">
              <p class="fr-popup__timer-label">
                {{ headerCountdownLabel }}
              </p>
              <div class="fr-popup__timer-row">
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.h }}</em>
                </span>
                <span class="fr-popup__timer-colon">:</span>
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.m }}</em>
                </span>
                <span class="fr-popup__timer-colon">:</span>
                <span class="fr-popup__timer-cell">
                  <img
                    src="@/assets/img/bonus/firstrecharge/timer_cell.png"
                    alt=""
                  />
                  <em>{{ countdownParts.s }}</em>
                </span>
              </div>
            </div>
            <div class="fr-popup__days">
              <div
                v-for="day in dayList"
                :key="day.index"
                class="fr-popup__day"
                :class="{
                  'is-claimable': day.status === 1,
                  'is-claimed': day.status === 2,
                  'is-locked': day.status === 0,
                }"
              >
                <div class="fr-popup__day-label">
                  <span class="fr-popup__day-title">{{
                    ($lang.fr_day || "Day") + " " + day.index
                  }}</span>
                  <span v-if="day.amountText" class="fr-popup__day-amount">{{
                    day.amountText
                  }}</span>
                </div>
                <button
                  v-if="day.status === 1"
                  class="fr-popup__day-btn is-claim"
                  :disabled="claimingDay === day.index"
                  @click="claimDay(day.index)"
                >
                  {{
                    claimingDay === day.index
                      ? "..."
                      : $lang.fd_claim_now || "Claim"
                  }}
                </button>
                <span
                  v-else-if="day.status === 2"
                  class="fr-popup__day-btn is-done"
                >
                  {{ $lang.fr_claimed || "Claimed" }}
                </span>
                <span v-else class="fr-popup__day-btn is-lock">
                  {{ day.availableText || $lang.fr_locked || "Locked" }}
                </span>
              </div>
            </div>
            <p class="fr-popup__disclaimer">
              {{
                $lang.fr_daily_hint || "Return each day to claim your reward."
              }}
            </p>
          </div>
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
import { ReceiveNewPlayerGiftPack } from "@/api/common";
import { reportPromoPanel } from "@/utils/common";
import { goPayUrl, closePayWindow } from "@/utils/payRedirect";
import GiftPaySheet from "@/components/GiftPaySheet.vue";

export default {
  name: "FirstRechargePopup",
  components: { GiftPaySheet },
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    packData: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      claimingDay: 0,
      nowTs: Math.floor(Date.now() / 1000),
      tickTimer: null,
      showPayIframe: false,
      payIframeUrl: "",
      showPaySheet: false,
    };
  },
  computed: {
    // 实时国家货币（避免 App 启动早于登录时 mixin 拍下空快照）
    liveCurrency() {
      return localStorage.getItem("currency") || this.getCurrency || "";
    },
    isPurchased() {
      return this.packData && Number(this.packData.purchased) === 1;
    },
    price() {
      return (this.packData && this.packData.price) || 0;
    },
    originalPrice() {
      return (this.packData && this.packData.originalPrice) || "";
    },
    promoType() {
      return (
        (this.packData && this.packData.promoType) || "first_recharge_new_1"
      );
    },
    ctaText() {
      return this.$lang.fr_recharge_now || "Recharge Now";
    },
    /** 百分比 = price / originalPrice * 100（与页面 Day1 文案同一套） */
    discountPercent() {
      const p = Number(this.price) || 0;
      const o = Number(this.originalPrice) || 0;
      if (!o || p <= 0) return 0;
      return Math.round((p / o) * 100);
    },
    /** 入账金额 = price + immediateBonus + day2Max + day3Max */
    creditTotalAmount() {
      const d = this.packData || {};
      return (
        (Number(d.price) || 0) +
        (Number(d.immediateBonus) || 0) +
        (Number(d.day2Max) || 0) +
        (Number(d.day3Max) || 0)
      );
    },
    /** 展示：+ MXN 158（货币在加号后、金额前） */
    upToBonusText() {
      const plain = this.upToBonusPlain;
      return plain ? "+ " + plain : "";
    },
    /** 按钮副文案用：USD 19.99 */
    upToBonusPlain() {
      const total = this.creditTotalAmount;
      if (!total) return "";
      const amount = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(total)
        : total;
      const currency = this.liveCurrency || "";
      return (currency + " " + amount).trim();
    },
    headerTargetSec() {
      if (!this.packData) return 0;
      const toSec = (t) => {
        const n = Number(t) || 0;
        return n > 1e12 ? Math.floor(n / 1000) : n;
      };
      if (this.isPurchased) {
        const times = [1, 2, 3]
          .map((i) => toSec(this.packData["day" + i + "AvailableTime"]))
          .filter((t) => t > this.nowTs)
          .sort((a, b) => a - b);
        return times[0] || 0;
      }
      return toSec(this.packData.expireTime);
    },
    headerCountdownLabel() {
      if (this.isPurchased) return this.$lang.fr_next_unlock || "Next Unlock";
      return this.$lang.fd_critical_deadline || "CRITICAL DEADLINE";
    },
    headerCountdown() {
      const parts = this.countdownParts;
      if (!parts) return "";
      return parts.h + ":" + parts.m + ":" + parts.s;
    },
    countdownParts() {
      const target = this.headerTargetSec;
      if (!target) return null;
      const diff = target - this.nowTs;
      if (diff <= 0) return null;
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      return {
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      };
    },
    dayList() {
      if (!this.packData) return [];
      // 货币始终用本地国家
      const currency = this.liveCurrency || this.packData.currency || "";
      const fmt = (n) =>
        this.$formatNumberWithCommas ? this.$formatNumberWithCommas(n) : n;
      const amountFor = (i) => {
        if (i === 1) {
          const v = Number(this.packData.immediateBonus || 0);
          return v ? currency + " " + fmt(v) : "";
        }
        if (i === 3) return "???";
        const min = Number(this.packData["day" + i + "Min"] || 0);
        const max = Number(this.packData["day" + i + "Max"] || 0);
        if (!min && !max) return "";
        if (!min || !max || min === max) {
          return currency + " " + fmt(min || max);
        }
        return currency + " " + fmt(min) + " ~ " + fmt(max);
      };
      return [1, 2, 3].map((i) => {
        const status = Number(this.packData["day" + i + "Status"] || 0);
        let availableTime = Number(
          this.packData["day" + i + "AvailableTime"] || 0,
        );
        if (availableTime > 1e12)
          availableTime = Math.floor(availableTime / 1000);
        let availableText = "";
        if (status === 0 && availableTime > 0) {
          const diff = availableTime - this.nowTs;
          if (diff > 0) {
            const h = Math.floor(diff / 3600);
            const m = Math.floor((diff % 3600) / 60);
            availableText = h + "h " + m + "m";
          }
        }
        return {
          index: i,
          status,
          availableTime,
          availableText,
          amountText: amountFor(i),
        };
      });
    },
  },
  watch: {
    modelValue(v, oldV) {
      if (v) {
        this.startTick();
        if (!oldV) reportPromoPanel("new_player_giftpack", 1);
      } else {
        this.stopTick();
        if (oldV) reportPromoPanel("new_player_giftpack", 2);
      }
    },
    showPayIframe(v) {
      if (!v) this.payIframeUrl = "";
    },
  },
  beforeUnmount() {
    this.stopTick();
  },
  methods: {
    handleClose() {
      this.$emit("update:modelValue", false);
    },
    startTick() {
      this.stopTick();
      this.nowTs = Math.floor(Date.now() / 1000);
      this.tickTimer = setInterval(() => {
        this.nowTs = Math.floor(Date.now() / 1000);
      }, 1000);
    },
    stopTick() {
      if (this.tickTimer) {
        clearInterval(this.tickTimer);
        this.tickTimer = null;
      }
    },
    buyGiftPack() {
      if (!this.price || this.showPaySheet) return;
      this.showPaySheet = true;
    },
    onGiftPaySuccess({ url, payWin, isUsRedirect }) {
      this.$emit("update:modelValue", false);
      if (url) {
        if (isUsRedirect) {
          goPayUrl(payWin, url);
        } else {
          closePayWindow(payWin);
          this.$nextTick(() => {
            this.payIframeUrl = url;
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
      this.$emit("refresh");
    },
    async claimDay(dayIndex) {
      if (this.claimingDay) return;
      this.claimingDay = dayIndex;
      try {
        const res = await ReceiveNewPlayerGiftPack({ dayIndex });
        if (res && res.status === "ok") {
          const amount =
            res.content && (res.content.amount || res.content.reward);
          const msg = amount
            ? "+" +
              this.$formatNumberWithCommas(amount) +
              " " +
              (this.getCurrency || "")
            : this.$lang.bonus_txt16 || "Success";
          this.$toast({ message: msg, icon: "success" });
          this.$emit("refresh");
        } else {
          this.$toast({ message: (res && res.msg) || "Failed", icon: "cross" });
        }
      } catch (e) {
        console.error("claimDay error", e);
        this.$toast({
          message: this.$lang.network_error || "Network error",
          icon: "cross",
        });
      } finally {
        this.claimingDay = 0;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/* ====== First Recharge Popup（资源版） ====== */
@fr-yellow: #fbff00;
@order-bg: #2a0a3d;
@order-border: #7a2190;
@muted: #9b7ab8;

.fr-popup-wrapper {
  width: 86% !important;
  max-width: 360px;
  background: transparent !important;
  overflow: visible !important;
}

.fr-popup {
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
    width: 92%;
    max-width: 300px;
    margin: 0 auto -6px;
    height: auto;
    pointer-events: none;
  }

  &__title-img {
    display: block;
    width: 94%;
    max-width: 320px;
    margin: -68px auto 0;
    height: auto;
    position: relative;
    z-index: 1;
    pointer-events: none;
  }

  &__body {
    padding: 4px 16px 16px;
  }

  &__action {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__price-wrap {
    position: relative;
    width: 100%;
    margin: 4px 0 10px;
    padding-top: 14px;
  }

  &__ribbon {
    position: absolute;
    left: 50%;
    top: 0;
    z-index: 2;
    width: 52%;
    max-width: 168px;
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
    gap: 4px;
    padding: 0 12px 2px;
    box-sizing: border-box;
  }

  &__original-price {
    font-size: 11px;
    font-weight: 800;
    color: #fff;
    text-decoration: line-through;
    white-space: nowrap;
  }

  &__discount {
    font-size: 10px;
    font-weight: 900;
    color: #fff;
    background: #c2183a;
    border-radius: 999px;
    padding: 1px 6px;
    line-height: 1.3;
  }

  &__price-bar {
    position: relative;
    width: 100%;
  }

  &__price-bar-bg {
    display: block;
    width: 100%;
    height: auto;
  }

  &__price-main {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 0 28px;
    box-sizing: border-box;
  }

  &__price-currency {
    font-size: 28px;
    font-weight: 600;
    color: @fr-yellow;
  }

  &__price {
    font-size: 28px;
    font-weight: 600;
    color: @fr-yellow;
    line-height: 1;
    letter-spacing: -0.5px;
    text-shadow: 0 0 10px fade(@fr-yellow, 35%);
  }

  &__timer {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 2px 0 12px;
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
      /* 多层 text-shadow 模拟描边，兼容性好于仅用 -webkit-text-stroke */
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

  &__btn {
    .btn-3d-green();
    height: auto;
    min-height: 52px;
    padding: 8px 12px 10px;
    flex-direction: column;
    gap: 2px;
    font-size: 16px;
  }

  &__btn-main {
    font-size: 16px;
    font-weight: 900;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  &__btn-sub {
    font-size: 11px;
    font-weight: 700;
    color: fade(#fff, 92%);
    text-transform: none;
    letter-spacing: 0;

    em {
      font-style: normal;
      color: @fr-yellow;
      font-weight: 900;
      margin: 0 2px;
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

  &__days {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;
  }

  &__day {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 12px;
    border-radius: 12px;
    background: @order-bg;
    border: 1px solid @order-border;

    &.is-claimable {
      border-color: @btn-3d-green-from;
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
    color: #fff;
  }

  &__day-amount {
    font-size: 11px;
    font-weight: 700;
    color: @fr-yellow;
  }

  &__day-btn {
    min-width: 78px;
    text-align: center;
    padding: 6px 12px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 800;
    border: none;
    cursor: pointer;

    &.is-claim {
      background: @btn-3d-green-grad;
      color: #fff;
      box-shadow:
        inset 0 2px 2px 0 @btn-3d-green-highlight,
        inset 0 -2px 0 0 @btn-3d-green-lip;
    }

    &.is-done {
      background: fade(#fff, 8%);
      color: fade(#fff, 50%);
    }

    &.is-lock {
      background: fade(#fff, 6%);
      color: fade(#fff, 40%);
      font-size: 11px;
    }

    &:disabled {
      opacity: 0.6;
    }
  }
}
</style>
