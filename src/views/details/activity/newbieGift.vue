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

      <!-- Reward Track：单条背景 + 管子箭头衔接 -->
      <section class="ng-rewards">
        <div class="ng-rewards__track">
          <img
            class="ng-rewards__pipe-arrow ng-rewards__pipe-arrow--0"
            src="../../../assets/img/activity/newbieGift/pipe_arrow.png"
            alt=""
          />
          <template v-for="(day, idx) in days" :key="idx">
            <div
              class="ng-reward-card"
              :class="{
                'ng-reward-card--active': day.status === 'active',
                'ng-reward-card--locked': day.status === 'locked',
                'ng-reward-card--claimed': day.status === 'claimed',
                [`ng-reward-card--day${idx + 1}`]: true,
              }"
            >
              <div class="ng-reward-card__shell">
                <h3 class="ng-reward-card__title">{{ day.title }}</h3>
                <div class="ng-reward-card__body">
                  <div class="ng-reward-card__icon">
                    <img
                      :src="day.icon"
                      class="ng-reward-card__icon-img"
                      alt=""
                    />
                  </div>
                  <div class="ng-reward-card__info">
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
            </div>
            <img
              v-if="idx < days.length - 1"
              class="ng-rewards__pipe-arrow"
              :class="`ng-rewards__pipe-arrow--${idx + 1}`"
              src="../../../assets/img/activity/newbieGift/pipe_arrow.png"
              alt=""
            />
          </template>
        </div>
      </section>

      <div class="ng-spacer"></div>
    </main>

    <!-- Footer (only when not purchased) -->
    <div v-if="!purchased" class="ng-footer">
      <button
        type="button"
        class="ng-footer__panel"
        :aria-label="$lang.ng_buy_now || 'Buy now'"
        @click="buyNow"
      >
        <img
          class="ng-footer__bg"
          src="../../../assets/img/activity/newbieGift/footer_bar_bg.png"
          alt=""
        />
        <div class="ng-footer__overlay">
          <div class="ng-footer__value">
            <span class="ng-footer__value-label">
              {{ $lang.ng_total_value || "TOTAL VALUE" }}
            </span>
            <span class="ng-footer__value-pct">{{ creditAmountText }}</span>
          </div>
          <div class="ng-footer__action">
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
        </div>
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
  /* 底部固定购买栏，避免被挡住 */
  padding-bottom: calc(160px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
}

// ====== HERO（375×190，通栏无左右边距） ======
.ng-hero {
  padding: 0 0 4px;

  &__img-wrap {
    width: 100%;
    height: 190px;
    overflow: hidden;
    position: relative;
    margin-bottom: 20px;
  }

  &__img {
    width: 100%;
    height: 190px;
    display: block;
    object-fit: cover;
    object-position: center top;
  }
}

// ====== TIMER ======
.ng-timer {
  display: flex;
  justify-content: center;
  padding: 0 14px;
  margin: 2px 0 -10px;
  position: relative;
  z-index: 2;

  &__frame {
    position: relative;
    width: 100%;
    max-width: none;
    height: 118px;
  }

  &__bg {
    width: 100%;
    height: 118px;
    display: block;
    object-fit: fill;
    pointer-events: none;
  }

  &__inner {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    pointer-events: none;
  }

  /* 第一处：LIMITED TIME REMAINING */
  &__label {
    position: absolute;
    left: 50%;
    top: 20%;
    transform: translate(-50%, -50%);
    font-family: Manrope, sans-serif;
    font-size: 16px;
    font-weight: 800;
    line-height: 14px;
    letter-spacing: 0;
    text-align: center;
    text-transform: uppercase;
    white-space: nowrap;
    background: linear-gradient(180deg, #fdfdb7 0%, #fcb91f 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 1px 0 #000);
  }

  /* 第二处：倒计时数字 */
  &__digits {
    position: absolute;
    left: 50%;
    top: 62%;
    transform: translate(-50%, -50%);
    width: 100%;
    font-family: Manrope, sans-serif;
    font-size: 34px;
    font-weight: 700;
    line-height: 1;
    letter-spacing: 0;
    text-transform: uppercase;
    text-align: center;
    color: #fff;
    -webkit-text-stroke: 1px #b45160;
    paint-order: stroke fill;
    text-shadow: 0 2px 0 #1f0002;
  }

  &__frame--done &__digits {
    color: #fff;
  }
}

// 轨道图 681×1024：红卡 42–331、红管 333–373、绿卡叠在中间留白、绿管 672–713、蓝卡 714–1024
.ng-rewards {
  padding: 0 4px;
  margin-top: -8px;

  &__track {
    position: relative;
    width: 100%;
    max-width: 390px;
    margin: 0 auto;
    aspect-ratio: 681 / 1024;
    background: url("../../../assets/img/activity/newbieGift/card_track_bg.png")
      no-repeat center top;
    background-size: 100% 100%;
    margin-top: 10px;
  }

  &__pipe-arrow {
    position: absolute;
    /* 管子中心在图宽 352/681，不是 50% */
    left: 51.7%;
    z-index: 6;
    display: block;
    width: 22px;
    height: 14px;
    margin: 0;
    object-fit: contain;
    pointer-events: none;
    transform: translate(-50%, -50%);

    /* 倒计时下方红管 */
    &--0 {
      top: 2.5%;
    }

    /* 红卡与绿卡之间的红管 */
    &--1 {
      top: 34.8%;
    }

    /* 绿管中线 693/1024 */
    &--2 {
      top: 67.8%;
    }
  }
}

.ng-reward-card {
  position: absolute;
  left: 0;
  box-sizing: border-box;
  width: 100%;
  pointer-events: none;

  &--day1 {
    top: 4.1%;
    height: 28.2%;
    z-index: 2;
  }

  &--day2 {
    top: 36.5%;
    left: 50%;
    width: 86%;
    height: 29.2%;
    transform: translateX(-50%);
    z-index: 4;
  }

  &--day3 {
    top: 69.7%;
    height: 29.6%;
    z-index: 2;
  }

  &__shell {
    pointer-events: auto;
    position: relative;
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    background-repeat: no-repeat;
    background-position: center top;
    background-size: 100% 100%;
  }

  &--day2 &__shell {
    background-image: url("../../../assets/img/activity/newbieGift/card_day2.png");
  }

  &__title {
    position: absolute;
    left: 8%;
    right: 8%;
    top: 4%;
    margin: 0;
    font-family: Manrope, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    line-height: 14px;
    letter-spacing: 0;
    text-align: center;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  }

  &--day2 &__title {
    top: 2%;
  }

  &__body {
    position: absolute;
    top: 22%;
    height: 44%;
    display: flex;
    align-items: center;
    gap: 10px;
    box-sizing: border-box;
  }

  &--day1 &__body {
    left: 11%;
    right: 10%;
  }

  &--day2 &__body {
    left: 5%;
    right: 10%;
  }

  &--day3 &__body {
    left: 9%;
    right: 10%;
  }

  &__icon {
    width: 50px;
    height: 50px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;

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

  &__desc {
    margin: 0;
    font-family: Manrope, sans-serif;
    font-size: 16px;
    font-weight: 700;
    color: #ffffff;
    line-height: 18px;

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
    width: 18px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__btn {
    position: absolute;
    left: 50%;
    bottom: 5%;
    transform: translateX(-50%);
    width: 58%;
    max-width: 149px;
    height: 36px;
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
  height: 12px;
}

// ====== FOOTER：背景图内展示，固定 Tabbar 上方 ======
.ng-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 0 0 env(safe-area-inset-bottom, 0px);
  max-width: 450px;
  margin: 0 auto;
  z-index: 50;
  box-sizing: border-box;
  background: transparent;

  /* 盖住滑到购买栏后面的内容 */
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    z-index: -1;
    width: 100vw;
    max-width: 450px;
    top: 0;
    bottom: 0;
    background: @page;
    transform: translateX(-50%);
    pointer-events: none;
  }

  &__panel {
    position: relative;
    display: block;
    width: 100%;
    aspect-ratio: 772 / 253;
    min-height: 107px;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: pointer;
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    pointer-events: none;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    pointer-events: none;
  }

  /* 紫色胶囊：TOTAL VALUE */
  &__value {
    position: absolute;
    left: 52%;
    top: 26%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    width: 38%;
    min-width: 120px;
  }

  &__value-label {
    font-family: Manrope, sans-serif;
    font-size: 8px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 1.1;
  }

  &__value-pct {
    margin-top: 2px;
    font-family: Manrope, sans-serif;
    font-size: 16px;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
    text-transform: uppercase;
    background: linear-gradient(180deg, #f0ff25 0%, #e6a408 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.5));
  }

  /* 绿色按钮区：LIMITED PRICE + 价格 */
  &__action {
    position: absolute;
    left: 15%;
    right: 15%;
    top: 40%;
    bottom: 16%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 2px;
  }

  &__price-label {
    font-family: Manrope, sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0;
    line-height: 14px;
    -webkit-text-stroke: 0.5px #000;
    paint-order: stroke fill;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  }

  &__price-row {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 8px;
    flex-wrap: nowrap;
    margin-top: 2px;
  }

  &__price-current {
    font-family: Manrope, sans-serif;
    font-size: 24px;
    font-weight: 800;
    line-height: 1;
    text-transform: uppercase;
    background: linear-gradient(180deg, #f0ff25 0%, #e6a408 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    -webkit-text-fill-color: transparent;
    filter: drop-shadow(0 1px 0 rgba(0, 0, 0, 0.5))
      drop-shadow(0 0 3.5px rgba(255, 0, 0, 0.57));
  }

  &__price-original {
    font-family: Manrope, sans-serif;
    font-size: 12px;
    font-weight: 700;
    color: #084029;
    text-decoration: line-through;
    line-height: 1;
    text-transform: uppercase;
  }

  &__disclaimer {
    text-align: center;
    font-size: 10px;
    color: #c9c9c9;
    margin: -10px auto 10px;
    font-weight: 500;
    line-height: 1.35;
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
