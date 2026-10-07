<template>
  <div class="checkin-page">
    <title-bar :title="$lang.activity_daily_checkin || 'Daily Check-in'">
      <template #right>
        <button type="button" class="checkin-history" @click="goRewardHistory">
          <span class="checkin-history__icon">
            <van-icon name="clock-o" size="12" color="#ffd467" />
          </span>
          <span>{{ $lang.reward_history || "Reward History" }}</span>
        </button>
      </template>
    </title-bar>

    <img
      class="checkin-hero"
      src="@/assets/img/activity/checkin/hero.png"
      alt=""
    />

    <div class="checkin-banner">
      <img
        class="checkin-banner__img"
        src="@/assets/img/activity/checkin/banner.png"
        alt=""
      />
      <p class="checkin-banner__label">
        {{ $lang.reward_your_rewards || "Your Rewards" }}
      </p>
    </div>

    <div class="checkin-grid">
      <div
        v-for="item in dayList"
        :key="item.day"
        class="checkin-card"
        :class="{
          'checkin-card--active': item.status === 'active',
          'checkin-card--missed': item.status === 'missed',
          'checkin-card--locked': item.status === 'locked',
        }"
      >
        <span class="checkin-card__day"
          >{{ $lang.activity_day || "Day" }} {{ item.day }}</span
        >

        <div
          class="checkin-card__body"
          :class="{ 'checkin-card__body--well': item.status !== 'active' }"
        >
          <template v-if="item.status === 'active'">
            <div class="checkin-card__stage">
              <img
                class="checkin-card__treasure"
                src="@/assets/img/activity/checkin/treasure.png"
                alt=""
              />
            </div>
          </template>
          <template v-else-if="item.status === 'missed'">
            <img
              class="checkin-card__icon"
              src="@/assets/img/activity/checkin/miss.png"
              alt=""
            />
            <div class="checkin-card__amounts">
              <span class="checkin-card__amt checkin-card__amt--gold"
                >{{ item.regularAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
              <span class="checkin-card__amt checkin-card__amt--green"
                >{{ item.premiumAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
          </template>
          <template v-else-if="item.status === 'locked'">
            <img
              class="checkin-card__icon checkin-card__icon--lock"
              src="@/assets/img/activity/checkin/lock.png"
              alt=""
            />
            <div class="checkin-card__amounts">
              <span class="checkin-card__amt checkin-card__amt--gold"
                >{{ item.regularAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
              <span class="checkin-card__amt checkin-card__amt--green"
                >{{ item.premiumAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
          </template>
          <template v-else>
            <div class="checkin-card__amounts">
              <span class="checkin-card__amt checkin-card__amt--gold"
                >{{ item.regularAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
              <span class="checkin-card__amt checkin-card__amt--green"
                >{{ item.premiumAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
          </template>
        </div>

        <div class="checkin-card__foot">
          <template v-if="item.status === 'active'">
            <button
              type="button"
              class="checkin-card__btn checkin-card__btn--gold"
              @click="handleClaim('regular')"
            >
              {{ $lang.reward_claim_coins || "CLAIM" }}
              {{ item.regularAmount }} {{ $lang.checkin_coins || "Coins" }}
            </button>
            <button
              type="button"
              class="checkin-card__btn checkin-card__btn--green"
              @click="
                item.paySignStatus === 1
                  ? handleClaim('deposit')
                  : handlePremiumTip()
              "
            >
              {{ $lang.checkin_deposit_for || "DEPOSIT FOR" }}
              {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
            </button>
          </template>
          <template v-else-if="item.status === 'claimed'">
            <button
              v-if="!item.premiumClaimed"
              type="button"
              class="checkin-card__btn checkin-card__btn--green"
              @click="
                item.paySignStatus === 1
                  ? handleClaim('deposit')
                  : handlePremiumTip()
              "
            >
              {{ $lang.checkin_deposit_for || "DEPOSIT FOR" }}
              {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
            </button>
            <span v-else class="checkin-card__pill">{{
              $lang.reward_claimed || "CLAIMED"
            }}</span>
          </template>
          <span
            v-else-if="item.status === 'missed'"
            class="checkin-card__pill"
            >{{ $lang.checkin_missed || "MISSED" }}</span
          >
          <span v-else class="checkin-card__pill">{{
            $lang.reward_locked || "LOCKED"
          }}</span>
        </div>
      </div>
    </div>

    <div class="checkin-bottom">
      <button type="button" class="checkin-bottom__btn" @click="goDeposit">
        {{ $lang.reward_go_deposit || "Go To Deposit" }}
      </button>
    </div>
  </div>
</template>

<script>
import { GetSignDaily, SignDaily } from "@/api/common";
import { reportPromoPanel } from "@/utils/common";

export default {
  name: "DailyCheckIn",
  data() {
    return {
      loading: false,
      dayList: [],
    };
  },
  async mounted() {
    reportPromoPanel("sign_daily", 1);
    await this.fetchSignData();
  },
  beforeUnmount() {
    reportPromoPanel("sign_daily", 2);
  },
  methods: {
    goRewardHistory() {
      this.$jumpTo("/rewardHistory");
    },
    goDeposit() {
      this.$jumpTo("/rechargeCont");
    },
    async fetchSignData() {
      try {
        this.loading = true;
        const res = await GetSignDaily();
        if (res.status === "ok" && res.content) {
          const signList = res.content.signList || [];
          const now = new Date();
          const todayDay = now.getDate();
          const year = now.getFullYear();
          const month = now.getMonth();
          // 本月总天数
          const daysInMonth = new Date(year, month + 1, 0).getDate();
          // 展示范围: 前3天 ~ 月底
          const startDay = Math.max(1, todayDay - 3);

          this.dayList = signList
            .filter((item) => {
              const d = new Date(item.date);
              const day = d.getDate();
              return day >= startDay && day <= daysInMonth;
            })
            .map((item, index, arr) => {
              const d = new Date(item.date);
              const day = d.getDate();
              const regularAmount = item.freeSignReward || 0;
              const premiumAmount = item.paySignReward || 0;
              const isSpecial = index === arr.length - 1; // 最后一天为特殊卡

              let status = "locked";
              let premiumClaimed = false;

              if (item.isFreeSign === 1) {
                // 已签到(免费)
                status = "claimed";
                premiumClaimed = item.isPaySign === 1;
              } else if (day === todayDay) {
                // 今天 - 可签到
                status = "active";
              } else if (day < todayDay) {
                // 过去未签到 - 错过
                status = "missed";
              } else {
                // 未来 - 不可签到
                status = "locked";
              }

              return {
                day,
                regularAmount,
                premiumAmount,
                status,
                premiumClaimed,
                isSpecial,
                date: item.date,
                paySignStatus: item.paySignStatus || 0,
              };
            });
        } else if (res.status === "need_login") {
          this.$bus.emit("openLogin");
        }
      } catch (e) {
        console.error("fetchSignData error:", e);
      } finally {
        this.loading = false;
      }
    },
    async handleClaim(type) {
      try {
        const claimType = type === "regular" ? 0 : 1;
        const res = await SignDaily({ type: claimType });
        if (res.status === "ok") {
          this.$toast({
            message:
              this.$lang.activity_checkin_success || "Check-in successful!",
            icon: "success",
          });
          await this.fetchSignData();
        } else if (res.status === "need_login") {
          this.$bus.emit("openLogin");
        } else {
          this.$toast({ message: res.msg || "Error", icon: "cross" });
        }
      } catch (e) {
        console.error("handleClaim error:", e);
      }
    },
    handlePremiumTip() {
      this.$toast({
        message:
          this.$lang.reward_deposit_tip ||
          "Deposit today to unlock premium rewards!",
        icon: "warning-o",
      });
      this.goDeposit();
    },
  },
};
</script>

<style lang="less" scoped>
.checkin-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 96px;

  :deep(.van-nav-bar__title) {
    text-transform: uppercase;
    letter-spacing: 0.02em;
    font-size: 15px;
    max-width: 46%;
  }

  :deep(.van-nav-bar__right) {
    padding-right: 8px;
  }
}

.checkin-history {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px 0 3px;
  border: 1px solid #590581;
  border-radius: 999px;
  background: #250a3d;

  font-size: 10px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;

  &__icon {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
}

.checkin-hero {
  display: block;
  width: 100%;
  height: auto;
}

.checkin-banner {
  position: relative;
  margin: -16px 12px 2px;

  &__img {
    display: block;
    width: 100%;
    height: auto;
  }

  &__label {
    position: absolute;
    left: 14%;
    right: 14%;
    bottom: 16%;
    margin: 0;
    text-align: center;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    pointer-events: none;
  }
}

.checkin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px 7px;
  padding: 4px 12px 16px;
}

.checkin-card {
  aspect-ratio: 165 / 220;
  background: url("@/assets/img/activity/checkin/card_purple.png") center / 100%
    100% no-repeat;
  border-radius: 16px;
  padding: 8px 7px 7px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  box-sizing: border-box;

  &--active {
    background-image: url("@/assets/img/activity/checkin/card_gold.png");
    padding: 8px 8px 8px;

    .checkin-card__day {
      color: #fff8d6;
    }
  }

  &__day {
    flex-shrink: 0;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: #fff;
    line-height: 1.1;
  }

  &__body {
    flex: 1;
    width: 100%;
    min-height: 0;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;

    &--well {
      border-radius: 12px;
      background: #07040f;
      padding: 8px 4px 8px;
    }
  }

  &__stage {
    width: 100%;
    flex: 1;
    min-height: 0;
    border-radius: 10px;
    background: #050308;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    width: 40px;
    height: 40px;
    object-fit: contain;
    display: block;
    flex-shrink: 0;

    &--lock {
      width: 36px;
      height: 40px;
    }
  }

  &__treasure {
    width: 52px;
    height: 52px;
    object-fit: contain;
    display: block;
  }

  &__amounts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
  }

  &__amt {
    font-size: 11px;
    font-weight: 800;
    line-height: 1.05;
    text-transform: uppercase;
    white-space: nowrap;

    &--green {
      color: #2ee56a;
    }

    &--gold {
      color: #ffe14a;
    }
  }

  &__foot {
    flex-shrink: 0;
    width: 100%;
    margin-top: 6px;
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  &__pill {
    width: 100%;
    height: 24px;
    border-radius: 999px;
    background: #8d8d96;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.04em;
    display: flex;
    align-items: center;
    justify-content: center;
    text-transform: uppercase;
  }

  &__btn {
    width: 100%;
    text-align: center;
    white-space: nowrap;

    &--gold {
      .btn-3d-yellow();
      height: 24px;
      padding: 0 2px;
      color: #fff;
      font-size: 8px;
      letter-spacing: 0;
      text-shadow: none;
      white-space: nowrap;
    }

    &--green {
      .btn-3d-green();
      height: 24px;
      padding: 0 2px;
      font-size: 7px;
      letter-spacing: 0;
      white-space: nowrap;
    }
  }
}

.checkin-bottom {
  position: fixed;
  left: 50%;
  bottom: 0;
  z-index: 40;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  padding: 12px 16px calc(12px + env(safe-area-inset-bottom, 0px));
  box-sizing: border-box;
  background: linear-gradient(
    to top,
    fade(#27033c, 96%) 40%,
    fade(#27033c, 0%) 100%
  );
  pointer-events: none;

  &__btn {
    .btn-3d-green();
    pointer-events: auto;
    font-size: 16px;
    letter-spacing: 0.04em;
  }
}

@media (min-width: 769px) {
  .checkin-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
