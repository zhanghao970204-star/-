<template>
  <div class="newbie-gift">
    <title-bar :title="$lang.ng_title"></title-bar>

    <main class="ng-main">
      <!-- Hero Section -->
      <section class="ng-hero">
        <div class="ng-hero__img-wrap">
          <img
            class="ng-hero__img"
            src="../../../assets/img/activity/newbieGift/hero.png"
            alt=""
          />
        </div>

        <!-- Countdown Timer -->
        <div class="ng-timer">
          <div
            class="ng-timer__frame"
            :class="{ 'ng-timer__frame--done': purchased }"
          >
            <img
              class="ng-timer__bg"
              src="../../../assets/img/activity/newbieGift/timer_frame.png"
              alt=""
            />
            <div class="ng-timer__inner">
              <span class="ng-timer__label">{{ $lang.ng_limited_time }}</span>
              <span class="ng-timer__digits">{{ countdownDisplay }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Reward Track：上内容区 + 下居中按钮 -->
      <section class="ng-rewards">
        <div
          v-for="(day, idx) in days"
          :key="idx"
          class="ng-reward-card"
          :class="{
            'ng-reward-card--active': day.status === 'active',
            'ng-reward-card--locked': day.status === 'locked',
            'ng-reward-card--claimed': day.status === 'claimed',
          }"
        >
          <div class="ng-reward-card__body">
            <div class="ng-reward-card__icon">
              <img :src="day.icon" class="ng-reward-card__icon-img" alt="" />
            </div>
            <div class="ng-reward-card__info">
              <h3 class="ng-reward-card__title">{{ day.title }}</h3>
              <p class="ng-reward-card__desc" v-html="day.desc"></p>
            </div>
          </div>

          <button
            v-if="day.status === 'active'"
            class="ng-reward-card__btn ng-reward-card__btn--active btn-3d-green"
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
            <img
              class="ng-reward-card__lock"
              src="../../../assets/img/activity/newbieGift/lock.png"
              alt=""
            />
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
          <span class="ng-footer__price-label">{{
            $lang.ng_limited_price
          }}</span>
          <div class="ng-footer__price-row">
            <span class="ng-footer__price-current"
              >{{ getCurrency }}{{ $formatNumberWithCommas(price) }}</span
            >
            <span
              v-if="originalPrice && Number(originalPrice) > Number(price)"
              class="ng-footer__price-original"
              >{{ getCurrency
              }}{{ $formatNumberWithCommas(originalPrice) }}</span
            >
          </div>
        </div>
        <div class="ng-footer__value">
          <span class="ng-footer__value-pct">{{ creditAmountText }}</span>
          <p class="ng-footer__value-label">
            {{ $lang.ng_total_value || "TOTAL VALUE" }}
          </p>
        </div>
      </div>
      <button class="ng-footer__buy btn-3d-green" @click="buyNow">
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
          <div class="ng-timer__frame">
            <img
              class="ng-timer__bg"
              src="../../../assets/img/activity/newbieGift/timer_frame.png"
              alt=""
            />
            <div class="ng-timer__inner">
              <span class="ng-timer__label">{{ $lang.ng_limited_time }}</span>
              <span class="ng-timer__digits">{{ countdownDisplay }}</span>
            </div>
          </div>
        </div>

        <!-- Total Reward Summary -->
        <div class="ng-popup__summary">
          <span class="ng-popup__summary-label">{{
            $lang.ng_total_reward
          }}</span>
          <div class="ng-popup__summary-value">100% Bonus + 800 Coins</div>
        </div>

        <!-- Footer -->
        <div class="ng-popup__footer">
          <div class="ng-popup__total-value">
            <span>300% Total Value</span>
          </div>
          <button class="ng-popup__buy btn-3d-green" @click="buyNow">
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
import { NewPlayerGiftPackInit, ReceiveNewPlayerGiftPack } from "@/api/common";
import { reportPromoPanel } from "@/utils/common";
import { goPayUrl, closePayWindow } from "@/utils/payRedirect";
import GiftPaySheet from "@/components/GiftPaySheet.vue";

export default {
  name: "NewbieGift",
  components: { GiftPaySheet },
  data() {
    return {
      purchased: false,
      showChestPopup: false,
      countdownTimer: null,
      price: "",
      originalPrice: "",
      promoType: "",
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
      payIframeUrl: "",
      showPaySheet: false,
    };
  },
  computed: {
    toSec() {
      return (t) => {
        const n = Number(t) || 0;
        return n > 1e12 ? Math.floor(n / 1000) : n;
      };
    },
    countdownTarget() {
      // 未购买 → 到 expireTime；已购买 → 下一个未到的 dayNAvailableTime
      if (this.purchased) {
        const times = [
          this.toSec(this.day1AvailableTime),
          this.toSec(this.day2AvailableTime),
          this.toSec(this.day3AvailableTime),
        ]
          .filter((t) => t > this.nowTs)
          .sort((a, b) => a - b);
        return times[0] || 0;
      }
      return this.toSec(this.expireTime);
    },
    countdownSeconds() {
      if (!this.countdownTarget) return 0;
      const diff = this.countdownTarget - this.nowTs;
      return diff > 0 ? diff : 0;
    },
    countdownDisplay() {
      const total = this.countdownSeconds;
      if (!total) return "00:00:00";
      const d = Math.floor(total / 86400);
      const h = Math.floor((total % 86400) / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      if (d > 0) {
        return (
          d +
          "d " +
          String(h).padStart(2, "0") +
          ":" +
          String(m).padStart(2, "0")
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
    /** 入账金额 = price + immediateBonus + day2Max + day3Max */
    creditTotalAmount() {
      return (
        (Number(this.price) || 0) +
        (Number(this.immediateBonus) || 0) +
        (Number(this.day2Max) || 0) +
        (Number(this.day3Max) || 0)
      );
    },
    /** 百分比 = price / originalPrice * 100（与弹窗同一套） */
    priceRatioPercent() {
      const p = Number(this.price) || 0;
      const o = Number(this.originalPrice) || 0;
      if (!o || p <= 0) return 0;
      return Math.round((p / o) * 100);
    },
    /** 角标：+ MXN 158（与弹窗同一套计算） */
    creditAmountText() {
      const total = this.creditTotalAmount;
      if (!total) return "";
      const amount = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(total)
        : total;
      const currency = this.getCurrency || "";
      return "+ " + currency + " " + amount;
    },
    days() {
      const pct = this.priceRatioPercent;
      const day1Desc = String(this.$lang.ng_day1_desc || "").replace(
        /\{percent\}/g,
        String(pct),
      );
      const dayConfigs = [
        {
          title: this.$lang.ng_day1_title,
          desc: day1Desc,
          icon: require("../../../assets/img/activity/newbieGift/icon_day1.png"),
          apiStatus: this.day1Status,
          availableTime: this.toSec(this.day1AvailableTime),
        },
        {
          title: this.$lang.ng_day2_title,
          desc: this.$lang.ng_day2_desc,
          icon: require("../../../assets/img/activity/newbieGift/icon_day2.png"),
          apiStatus: this.day2Status,
          availableTime: this.toSec(this.day2AvailableTime),
        },
        {
          title: this.$lang.ng_day3_title,
          desc: this.$lang.ng_day3_desc,
          icon: require("../../../assets/img/activity/newbieGift/icon_day3.png"),
          apiStatus: this.day3Status,
          availableTime: this.toSec(this.day3AvailableTime),
        },
      ];
      return dayConfigs.map((cfg) => {
        let status = "locked";
        if (cfg.apiStatus === 2) {
          status = "claimed";
        } else if (cfg.apiStatus === 1) {
          status = "active";
        }
        let countdown = "";
        if (
          this.purchased &&
          status === "locked" &&
          cfg.availableTime > this.nowTs
        ) {
          const diff = cfg.availableTime - this.nowTs;
          const d = Math.floor(diff / 86400);
          const h = Math.floor((diff % 86400) / 3600);
          const m = Math.floor((diff % 3600) / 60);
          if (d > 0) countdown = d + "d " + h + "h";
          else if (h > 0) countdown = h + "h " + m + "m";
          else countdown = m + "m";
        }
        return { ...cfg, status, countdown };
      });
    },
  },
  watch: {
    showPayIframe(v) {
      if (!v) this.payIframeUrl = "";
    },
  },
  mounted() {
    reportPromoPanel("new_player_giftpack", 1);
    this.initData();
    this.startCountdown();
  },
  beforeUnmount() {
    reportPromoPanel("new_player_giftpack", 2);
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
  },
  methods: {
    async initData() {
      try {
        const res = await NewPlayerGiftPackInit({});
        if (res && res.content) {
          const d = res.content;
          this.purchased = d.purchased === 1;
          this.day1Status = d.day1Status || 0;
          this.day2Status = d.day2Status || 0;
          this.day3Status = d.day3Status || 0;
          this.day1AvailableTime = d.day1AvailableTime || 0;
          this.day2AvailableTime = d.day2AvailableTime || 0;
          this.day3AvailableTime = d.day3AvailableTime || 0;
          this.expireTime = d.expireTime || 0;
          this.visible = d.visible || 0;
          this.promoType = d.promoType || "";
          if (d.price) {
            this.price = d.price;
          }
          if (d.originalPrice) {
            this.originalPrice = d.originalPrice;
          }
          this.immediateBonus = Number(d.immediateBonus) || 0;
          this.day2Max = Number(d.day2Max) || 0;
          this.day3Max = Number(d.day3Max) || 0;
        }
      } catch (e) {
        console.log("initData error", e);
      }
    },
    startCountdown() {
      this.nowTs = Math.floor(Date.now() / 1000);
      this.countdownTimer = setInterval(() => {
        this.nowTs = Math.floor(Date.now() / 1000);
      }, 1000);
    },
    async claimReward(dayIndex) {
      if (this.loading) return;
      this.loading = true;
      try {
        const res = await ReceiveNewPlayerGiftPack({ dayIndex });
        if (res && res.content && res.content.receiveSuccess === 1) {
          // Update the day status to claimed
          if (dayIndex === 1) this.day1Status = 2;
          else if (dayIndex === 2) this.day2Status = 2;
          else if (dayIndex === 3) this.day3Status = 2;
          const amount = res.content.amount || 0;
          this.$toast({
            message: `+${this.getCurrency}${this.$formatNumberWithCommas(amount)}`,
            icon: "success",
          });
          // Refresh data to get updated statuses
          this.initData();
        } else {
          this.$toast(res?.msg || "Error");
        }
      } catch (e) {
        this.$toast(e?.msg || "Error");
      } finally {
        this.loading = false;
      }
    },
    buyNow() {
      if (!this.price || this.showPaySheet) return;
      this.showChestPopup = false;
      this.showPaySheet = true;
    },
    onGiftPaySuccess({ url, payWin, isUsRedirect }) {
      if (url) {
        if (isUsRedirect) {
          goPayUrl(payWin, url);
        } else {
          closePayWindow(payWin);
          this.payIframeUrl = url;
          this.showPayIframe = true;
        }
      } else {
        closePayWindow(payWin);
        this.$toast({
          message: this.$lang.bonus_txt16 || "Success",
          icon: "success",
        });
      }
    },
    openChestPopup() {
      this.showChestPopup = true;
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffd467;
@highlight-from: #fdfdb7;
@highlight-to: #fcb91f;
@page: #12021a;
@muted: #d2c4f0;
@card-from: #8527b7;
@card-to: #4339b6;
@card-border: #cbb111;
@tabbar-h: calc(
  var(--tabbar-bar-height, 66px) + env(safe-area-inset-bottom, 0px)
);
@footer-h: 150px;

.newbie-gift {
  min-height: 100vh;
  background: @page;
  color: #fff;
  position: relative;
  overflow: hidden;
}

// ====== MAIN ======
.ng-main {
  max-width: 450px;
  margin: 0 auto;
  /* 底部固定栏 + Tabbar，避免被挡住 */
  padding-bottom: calc(@footer-h + @tabbar-h + 24px);
  box-sizing: border-box;
}

// ====== HERO ======
.ng-hero {
  padding: 4px 12px 16px;

  &__img-wrap {
    width: 100%;
    overflow: hidden;
    position: relative;
    margin-bottom: 10px;
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }
}

// ====== TIMER：标题在顶帽，倒计时在下区，均为白色 ======
.ng-timer {
  display: flex;
  justify-content: center;
  margin-bottom: 4px;

  &__frame {
    position: relative;
    width: 100%;
    max-width: 320px;
  }

  &__bg {
    width: 100%;
    height: auto;
    display: block;
    pointer-events: none;
  }

  &__inner {
    position: absolute;
    left: 9%;
    right: 9%;
    top: 6%;
    bottom: 10%;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
  }

  &__label {
    flex: 0 0 auto;
    margin-top: 18px;
    font-size: 10px;
    font-weight: 800;
    color: #ffffff;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 1.2px;
    line-height: 1.15;
    white-space: nowrap;
  }

  &__digits {
    margin-top: 10px;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    font-size: 30px;
    font-weight: 900;
    letter-spacing: 2px;
    color: #ffffff;
    text-align: center;
    text-transform: uppercase;
    line-height: 1;
    /* 设计稿：白字 + 0 2 #1F0002 */
    text-shadow: 0 2px 0 #1f0002;
  }

  &__frame--done &__digits {
    color: #ffffff;
  }
}

// ====== REWARD CARDS：上内容 / 下居中按钮 ======
.ng-rewards {
  padding: 8px 12px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ng-reward-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 10px;
  padding: 8px 8px 12px;
  border-radius: 14px;
  /* 设计稿背景 #8527B7→#4339B6，描边 2px #CBB111 */
  background: linear-gradient(180deg, @card-from 0%, @card-to 100%);
  border: 2px solid @card-border;
  box-sizing: border-box;

  &__body {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px;
    border-radius: 10px;
    background: #0f0515;
    box-sizing: border-box;
    border: 1px solid #764993;
  }

  &__icon {
    width: 56px;
    height: 56px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;

    &-img {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #ffffff;
    line-height: 1.25;
  }

  &__desc {
    margin: 4px 0 0;
    font-size: 12px;
    color: @muted;
    line-height: 1.35;

    :deep(.highlight) {
      font-weight: 800;
      background: linear-gradient(
        180deg,
        @highlight-from 0%,
        @highlight-to 100%
      );
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      -webkit-text-fill-color: transparent;
      filter: drop-shadow(0 1px 0 #000);
    }
  }

  &__lock {
    width: 16px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__btn {
    align-self: center;
    width: 168px;
    max-width: 80%;
    height: 40px;
    padding: 0 18px;
    font-size: 13px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    border-radius: 19.5px;
    border: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    color: #fff;

    &--active {
      /* 点亮：通用绿色按钮 */
    }

    /* 置灰：#929292→#7F7D7D + 内阴影 */
    &--disabled,
    &--locked {
      background: linear-gradient(180deg, #929292 0%, #7f7d7d 100%);
      color: #fff;
      cursor: not-allowed;
      box-shadow:
        inset 0 5px 4.7px #a1a1a1,
        inset 0 -3px 0 #676666;
      opacity: 1;
    }
  }
}

.ng-spacer {
  height: 16px;
}

// ====== FOOTER：抬到 Tabbar 上方 ======
.ng-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: @tabbar-h;
  background: fade(@page, 96%);
  backdrop-filter: blur(16px);
  border-top: 1px solid fade(@gold, 28%);
  padding: 12px 16px 14px;
  max-width: 450px;
  margin: 0 auto;
  z-index: 50;
  box-sizing: border-box;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
  }

  &__price {
    display: flex;
    flex-direction: column;

    &-label {
      font-size: 10px;
      color: #ffffff;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 1.5px;
    }

    &-row {
      display: flex;
      align-items: baseline;
      gap: 6px;
    }

    &-current {
      font-size: 18px;
      font-weight: 600;
      color: #fbff00;
      text-shadow: 0 0 12px fade(@gold, 45%);
    }

    &-original {
      font-size: 13px;
      color: @muted;
      text-decoration: line-through;
    }
  }

  &__value {
    text-align: right;

    &-pct {
      font-size: 18px;
      font-weight: 600;
      color: #fbff00;
    }

    &-label {
      font-size: 10px;
      color: #ffffff;
      font-weight: 700;
    }
  }

  &__buy {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
  }

  &__disclaimer {
    text-align: center;
    font-size: 10px;
    color: @muted;
    margin-top: 10px;
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
  background: @page;
  border-radius: 14px;
  border: 2px solid @card-border;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-bottom: 1px solid fade(@gold, 25%);
  }

  &__title {
    font-size: 18px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 2px;
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
    background: linear-gradient(180deg, fade(@card-from, 35%), transparent);

    &-glow {
      position: absolute;
      inset: 0;
      opacity: 0.25;
      background: radial-gradient(
        circle at center,
        fade(@gold, 55%),
        transparent 70%
      );
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
    margin-top: -28px;
    position: relative;
    z-index: 20;
    display: flex;
    justify-content: center;

    .ng-timer__frame {
      max-width: 260px;
    }
  }

  &__summary {
    margin: 20px 24px;
    background: linear-gradient(180deg, @card-from 0%, @card-to 100%);
    border: 2px solid @card-border;
    border-radius: 12px;
    padding: 16px;
    text-align: center;

    &-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: @muted;
      display: block;
      margin-bottom: 4px;
    }

    &-value {
      font-size: 20px;
      font-weight: 900;
      color: @gold;
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
      color: @gold;
      text-transform: uppercase;
      letter-spacing: 3px;
    }
  }

  &__buy {
    width: 100%;
    height: 48px;
    font-size: 16px;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
  }

  &__disclaimer {
    text-align: center;
    font-size: 10px;
    color: @muted;
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
    background: fade(#9f24c9, 18%);
    filter: blur(100px);
    border-radius: 50%;
  }

  &__yellow {
    position: absolute;
    bottom: 20%;
    left: -10%;
    width: 320px;
    height: 320px;
    background: fade(@gold, 8%);
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
