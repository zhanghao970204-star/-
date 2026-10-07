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
        <div class="fr-popup__head">
          <p class="fr-popup__mission">
            {{ $lang.fr_limited_offer || "Limited Time Offer" }}
          </p>
          <p class="fr-popup__subtitle">
            {{ $lang.fr_title_short || "First" }}
            <span class="fr-popup__highlight">{{
              $lang.fr_bonus || "Recharge"
            }}</span>
          </p>
          <button
            type="button"
            class="fr-popup__close"
            @click="handleClose"
          >
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
        </div>

        <div class="fr-popup__body">
          <div v-if="headerCountdown" class="fr-popup__timer">
            <span class="fr-popup__timer-label">{{
              headerCountdownLabel
            }}</span>
            <span class="fr-popup__timer-digits">{{ headerCountdown }}</span>
          </div>

          <!-- Unpurchased: show price + buy button -->
          <div v-if="!isPurchased" class="fr-popup__action">
            <div class="fr-popup__price-card">
              <div class="fr-popup__price-main">
                <span class="fr-popup__price-currency">{{ liveCurrency }}</span>
                <span class="fr-popup__price">{{
                  $formatNumberWithCommas(price)
                }}</span>
              </div>
              <div v-if="originalPrice" class="fr-popup__price-meta">
                <span class="fr-popup__original-price"
                  >{{ liveCurrency }}
                  {{ $formatNumberWithCommas(originalPrice) }}</span
                >
                <span v-if="discountPercent > 0" class="fr-popup__discount"
                  >-{{ discountPercent }}%</span
                >
              </div>
            </div>
            <button
              class="fr-popup__btn"
              :disabled="!price"
              @click="buyGiftPack"
            >
              {{ ctaText }}
            </button>
            <p class="fr-popup__up-to">
              {{ $lang.fr_up_to_prefix || "Receive up to" }}
              <span class="fr-popup__up-to-percent">{{ upToBonusText }}</span>
              {{ $lang.fr_up_to_suffix || "rewards." }}
            </p>
            <p class="fr-popup__disclaimer">
              {{ $lang.fd_limited_one || "Limited to one purchase per user." }}
            </p>
          </div>

          <!-- Purchased: show 3-day claim list -->
          <div v-else class="fr-popup__action">
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
      const total = this.creditTotalAmount;
      if (!total) return "";
      const amount = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(total)
        : total;
      const currency = this.liveCurrency || "";
      return "+ " + currency + " " + amount;
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
      return this.$lang.fd_critical_deadline || "Ends In";
    },
    headerCountdown() {
      const target = this.headerTargetSec;
      if (!target) return "";
      const diff = target - this.nowTs;
      if (diff <= 0) return "";
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      if (d > 0) {
        return (
          d +
          "d " +
          String(h).padStart(2, "0") +
          ":" +
          String(m).padStart(2, "0") +
          ":" +
          String(s).padStart(2, "0")
        );
      }
      return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
      );
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
/* ====== First Recharge Popup（通用确认弹窗壳） ====== */
@fr-yellow: @primary-color;
@fr-red: #ea4e3d;
@muted: #d7a2fa;
@panel-head: #430063;
@order-bg: #2c1137;
@order-border: #9346a9;

.fr-popup-wrapper {
  width: 88% !important;
  max-width: 360px;
  background: transparent !important;
  overflow: visible !important;
}

.fr-popup {
  position: relative;
  width: 100%;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  border-radius: 18px;
  overflow: hidden;

  &__head {
    position: relative;
    background: @panel-head;
    padding: 14px 40px 12px;
    text-align: center;
  }

  &__close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
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

  &__mission {
    margin: 0 0 6px;
    font-size: 11px;
    font-weight: 800;
    color: fade(#fff, 75%);
    letter-spacing: 2px;
    text-transform: uppercase;
  }

  &__subtitle {
    margin: 0;
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__highlight {
    color: @fr-yellow;
  }

  &__body {
    padding: 14px 14px 18px;
    background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  }

  &__timer {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 12px;
    padding: 8px 14px;
    border-radius: 12px;
    background: @order-bg;
    border: 1px solid fade(@fr-red, 45%);

    &-label {
      font-size: 9px;
      font-weight: 800;
      color: fade(@fr-red, 90%);
      text-transform: uppercase;
      letter-spacing: 2px;
      margin-bottom: 2px;
    }

    &-digits {
      font-size: 22px;
      font-weight: 900;
      color: @fr-red;
      letter-spacing: 1px;
    }
  }

  &__action {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__price-card {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    margin-bottom: 14px;
    border-radius: 12px;
    background: @order-bg;
    border: 1px solid @order-border;
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
    font-size: 34px;
    font-weight: 900;
    color: @fr-yellow;
    line-height: 1;
    letter-spacing: -1px;
  }

  &__price-meta {
    margin-top: 6px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__original-price {
    font-size: 13px;
    color: fade(#fff, 45%);
    text-decoration: line-through;
  }

  &__discount {
    font-size: 11px;
    font-weight: 900;
    color: #fff;
    background: fade(@btn-3d-green-to, 85%);
    padding: 2px 8px;
    border-radius: 6px;
    letter-spacing: 0.5px;
  }

  &__btn {
    .btn-3d-green();
    font-size: 15px;
  }

  &__disclaimer {
    margin-top: 10px;
    font-size: 9px;
    color: @muted;
    text-transform: uppercase;
    font-weight: 700;
    letter-spacing: 1px;
    text-align: center;
  }

  &__up-to {
    margin-top: 10px;
    text-align: center;
    font-size: 13px;
    color: fade(#fff, 85%);
    font-weight: 600;
  }

  &__up-to-percent {
    display: inline-block;
    margin: 0 4px;
    padding: 2px 8px;
    font-size: 14px;
    font-weight: 900;
    color: @fr-yellow;
    background: fade(@order-bg, 90%);
    border: 1px solid @order-border;
    border-radius: 6px;
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
