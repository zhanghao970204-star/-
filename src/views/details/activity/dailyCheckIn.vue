<template>
  <div class="checkin-page-wrap">
    <!-- Header -->
    <header class="checkin-header">
      <div class="checkin-header__back" @click="goBack">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </div>
      <h1 class="checkin-header__title">
        {{ $lang.activity_daily_checkin || "DAILY SIGN IN" }}
      </h1>
      <div class="checkin-header__right" @click="goRewardHistory">
        <van-icon name="clock-o" size="12" color="#ffa300" />
        <span>{{ $lang.reward_history || "Reward History" }}</span>
      </div>
    </header>

    <!-- Banner Info -->
    <div class="checkin-banner">
      <h2 class="checkin-banner__title">
        {{ $lang.reward_your_rewards || "Your Rewards" }}
      </h2>
      <p class="checkin-banner__desc">
        {{
          $lang.checkin_premium_desc ||
          "Premium rewards are unlocked after daily payment. Accumulate 10 deposits for a Mega Spin!"
        }}
      </p>
    </div>

    <!-- Grid of Days -->
    <div class="checkin-grid">
      <div
        v-for="item in dayList"
        :key="item.day"
        class="checkin-card"
        :class="{
          'checkin-card--claimed':
            item.status === 'claimed' && !item.premiumClaimed,
          'checkin-card--claimed-both':
            item.status === 'claimed' && item.premiumClaimed,
          'checkin-card--active': item.status === 'active',
          'checkin-card--missed': item.status === 'missed',
          'checkin-card--locked': item.status === 'locked',
          'checkin-card--special': item.isSpecial,
        }"
      >
        <!-- Day Label -->
        <span class="checkin-card__day"
          >{{ $lang.activity_day || "Day" }} {{ item.day }}</span
        >

        <!-- Claimed State -->
        <template v-if="item.status === 'claimed'">
          <div class="checkin-card__icons">
            <!-- Regular coin - always green glow when claimed -->
            <div class="checkin-card__icon-group">
              <div
                class="checkin-card__icon-circle checkin-card__icon-circle--claimed-coin"
              >
                <img
                  src="@/assets/img/activity/activity_icon/checkin/coin.png"
                  alt="coin"
                  width="16"
                  height="16"
                />
              </div>
              <span class="checkin-card__amount-claimed-coin"
                >{{ item.regularAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
            <!-- Diamond - gold glow if premium claimed, claim button if paySignStatus=1, deposit tip otherwise -->
            <div v-if="item.premiumClaimed" class="checkin-card__icon-group">
              <div
                class="checkin-card__icon-circle checkin-card__icon-circle--claimed-diamond"
              >
                <img
                  src="@/assets/img/activity/activity_icon/checkin/diamond.png"
                  alt="diamond"
                  width="16"
                  height="16"
                />
              </div>
              <span class="checkin-card__amount-claimed-diamond"
                >{{ item.premiumAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
            <div
              v-else
              class="checkin-card__icon-group checkin-card__icon-group--clickable"
              @click="
                item.paySignStatus === 1
                  ? handleClaim('deposit')
                  : handlePremiumTip()
              "
            >
              <div
                class="checkin-card__icon-circle"
                :class="
                  item.paySignStatus === 1
                    ? 'checkin-card__icon-circle--claimed-diamond'
                    : 'checkin-card__icon-circle--premium-diamond'
                "
              >
                <img
                  src="@/assets/img/activity/activity_icon/checkin/diamond.png"
                  alt="diamond"
                  width="16"
                  height="16"
                />
                <van-icon
                  v-if="item.paySignStatus !== 1"
                  name="lock"
                  size="8"
                  color="var(--wihte-color)"
                  class="checkin-card__mini-lock"
                />
              </div>
              <span class="checkin-card__amount-premium-locked"
                >{{ item.premiumAmount }}
                {{ $lang.checkin_coins || "Coins" }}</span
              >
            </div>
          </div>
          <span
            v-if="item.premiumClaimed"
            class="checkin-card__status checkin-card__status--claimed-both"
            >{{ $lang.reward_claimed || "CLAIMED" }}</span
          >
          <button
            v-else-if="item.paySignStatus === 1"
            class="checkin-card__claim-btn checkin-card__claim-btn--premium-small"
            @click="handleClaim('deposit')"
          >
            {{ $lang.checkin_deposit_for || "DEPOSIT FOR" }}
            {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
          </button>
          <button
            v-else
            class="checkin-card__claim-btn checkin-card__claim-btn--premium-small"
            @click="handlePremiumTip"
          >
            {{ $lang.reward_go_deposit || "Go To Deposit" }}
          </button>
        </template>

        <!-- Active State -->
        <template v-else-if="item.status === 'active'">
          <div class="checkin-card__active-content">
            <!-- Regular Claim -->
            <div class="checkin-card__claim-group">
              <div
                class="checkin-card__icon-circle checkin-card__icon-circle--active-coin"
              >
                <img
                  src="@/assets/img/activity/activity_icon/checkin/coin.png"
                  alt="coin"
                  width="16"
                  height="16"
                />
              </div>
              <button
                class="checkin-card__claim-btn checkin-card__claim-btn--regular"
                @click="handleClaim('regular')"
              >
                {{ $lang.reward_claim_coins || "CLAIM" }}
                {{ item.regularAmount }} {{ $lang.checkin_coins || "Coins" }}
              </button>
            </div>
            <!-- Premium Claim: only enabled when paySignStatus === 1 (deposited today) -->
            <div class="checkin-card__claim-group">
              <div
                class="checkin-card__icon-circle"
                :class="
                  item.paySignStatus === 1
                    ? 'checkin-card__icon-circle--claimed-diamond'
                    : 'checkin-card__icon-circle--premium-diamond'
                "
              >
                <img
                  src="@/assets/img/activity/activity_icon/checkin/diamond.png"
                  alt="diamond"
                  width="16"
                  height="16"
                />
                <van-icon
                  v-if="item.paySignStatus !== 1"
                  name="lock"
                  size="8"
                  color="var(--wihte-color)"
                  class="checkin-card__mini-lock"
                />
              </div>
              <button
                v-if="item.paySignStatus === 1"
                class="checkin-card__claim-btn checkin-card__claim-btn--premium"
                @click="handleClaim('deposit')"
              >
                {{ $lang.checkin_deposit_for || "DEPOSIT FOR" }}
                {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
              </button>
              <button
                v-else
                class="checkin-card__claim-btn checkin-card__claim-btn--premium"
                @click="handlePremiumTip"
              >
                {{ $lang.checkin_deposit_for || "DEPOSIT FOR" }}
                {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
              </button>
            </div>
          </div>
        </template>

        <template v-else-if="item.status === 'missed'">
          <div class="checkin-card__locked-icon">
            <van-icon name="cross" size="20" color="#ef4444" />
          </div>
          <div class="checkin-card__locked-amounts">
            <span class="checkin-card__amount-small"
              >{{ item.regularAmount }}
              {{ $lang.checkin_coins || "Coins" }}</span
            >
            <span class="checkin-card__amount-small"
              >{{ item.premiumAmount }}
              {{ $lang.checkin_coins || "Coins" }}</span
            >
          </div>
          <span class="checkin-card__status checkin-card__status--missed">{{
            $lang.checkin_missed || "MISSED"
          }}</span>
        </template>

        <!-- Locked State -->
        <template v-else-if="item.status === 'locked'">
          <div class="checkin-card__locked-icon">
            <van-icon
              v-if="item.isSpecial"
              name="lock"
              size="24"
              color="#fbbf24"
            />
            <template v-else>
              <van-icon name="lock" size="20" color="#a89b7c" />
            </template>
          </div>
          <div class="checkin-card__locked-amounts">
            <span
              :class="
                item.isSpecial
                  ? 'checkin-card__amount-special-dim'
                  : 'checkin-card__amount-small'
              "
              >{{ item.regularAmount }}
              {{ $lang.checkin_coins || "Coins" }}</span
            >
            <span
              :class="
                item.isSpecial
                  ? 'checkin-card__amount-special'
                  : 'checkin-card__amount-premium-locked'
              "
            >
              {{ item.premiumAmount }} {{ $lang.checkin_coins || "Coins" }}
            </span>
          </div>
          <span
            class="checkin-card__status"
            :class="{ 'checkin-card__status--special': item.isSpecial }"
          >
            {{ $lang.reward_locked || "LOCKED" }}
          </span>
        </template>
      </div>
    </div>

    <!-- Bottom CTA -->
    <div class="checkin-bottom-cta">
      <button class="checkin-bottom-cta__btn" @click="goDeposit">
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
    goBack() {
      this.$router.go(-1);
    },
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
@primary: #ffa300;
@bg-dark: #1f1c17;
@surface: rgba(255, 255, 255, 0.03);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);

.checkin-page-wrap {
  min-height: 100vh;
  background: @bg-dark;
  padding-bottom: 100px;
}

// Header
.checkin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: fade(@bg-dark, 80%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    border-radius: 50%;
    &:active {
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &__title {
    color: @wihte-color;
    font-size: 14px;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    flex: 1;
    text-align: center;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    span {
      color: @primary;
      font-size: 10px;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  }
}

// Banner
.checkin-banner {
  padding: 24px 20px 16px;

  &__title {
    color: @wihte-color;
    font-size: 24px;
    font-weight: bold;
    margin-bottom: 8px;
  }

  &__desc {
    color: #a89b7c;
    font-size: 12px;
    line-height: 1.5;
  }
}

// Grid
.checkin-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 8px 20px 20px;
}

// Card Base
.checkin-card {
  background: @surface;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  &__day {
    font-size: 10px;
    font-weight: bold;
    text-transform: uppercase;
    color: #a89b7c;
  }

  // Claimed (regular only - Day 1 style)
  &--claimed {
    opacity: 0.7;
    border-color: fade(@primary, 20%);
  }

  // Claimed (both regular + premium - Day 2 style)
  &--claimed-both {
    opacity: 0.9;
    border-color: fade(@primary, 40%);
    background: fade(@primary, 5%);
  }

  // Active (neon glow)
  &--active {
    border-color: fade(@primary, 40%);
    background: fade(@primary, 5%);
    box-shadow:
      0 0 10px fade(@primary, 60%),
      inset 0 0 5px fade(@primary, 30%);

    .checkin-card__day {
      color: @primary;
    }
  }

  // Missed (过去未签到)
  &--missed {
    opacity: 0.5;
    border-color: fade(#ef4444, 15%);
  }

  // Special (Day 12)
  &--special {
    background: linear-gradient(135deg, fade(#fbbf24, 5%), transparent);
    border-color: fade(#fbbf24, 20%);

    .checkin-card__day {
      color: #fbbf24;
    }

    .checkin-card__locked-icon {
      background: fade(#fbbf24, 10%);
      border-color: fade(#fbbf24, 30%);
    }
  }

  // Icons row (claimed state)
  &__icons {
    display: flex;
    gap: 12px;
    width: 100%;
    justify-content: center;
  }

  &__icon-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }

  &__icon-circle {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    &--coin {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    &--diamond {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    &--claimed-coin {
      background: fade(@primary, 20%);
      border: 1px solid fade(@primary, 50%);
      box-shadow: 0 0 15px fade(@primary, 40%);
    }

    &--claimed-diamond {
      background: fade(#ffd700, 20%);
      border: 1px solid fade(#ffd700, 50%);
      box-shadow: 0 0 15px fade(#ffd700, 40%);
    }

    &--active-coin {
      background: fade(@primary, 20%);
      border: 1px solid fade(@primary, 50%);
      box-shadow: 0 0 15px fade(@primary, 40%);
    }

    &--premium-diamond {
      background: fade(#fbbf24, 10%);
      border: 1px solid fade(#fbbf24, 30%);
      position: relative;
    }
  }

  &__mini-lock {
    position: absolute;
  }

  &__amount-small {
    font-size: 8px;
    color: #a89b7c;
    font-weight: 500;
  }

  &__amount-premium-locked {
    font-size: 8px;
    color: fade(#f59e0b, 50%);
    font-weight: 500;
  }

  &__amount-claimed-coin {
    font-size: 8px;
    color: @primary;
    font-weight: bold;
  }

  &__amount-claimed-diamond {
    font-size: 8px;
    color: #ffd700;
    font-weight: bold;
  }

  &__icon-group--dimmed {
    opacity: 0.3;
  }

  &__icon-group--clickable {
    cursor: pointer;
    &:active {
      opacity: 0.7;
    }
  }

  &__amount-special {
    font-size: 8px;
    color: #fbbf24;
    font-weight: bold;
  }

  &__amount-special-dim {
    font-size: 8px;
    color: fade(#fbbf24, 60%);
    font-weight: 500;
  }

  &__status {
    font-size: 10px;
    color: #a89b7c;
    text-transform: uppercase;
    font-weight: bold;
    margin-top: 4px;
    letter-spacing: 0.05em;

    &--claimed {
      color: @primary;
      letter-spacing: 0.05em;
    }

    &--special {
      color: #fbbf24;
      font-weight: 900;
      letter-spacing: 0.1em;
    }

    &--claimed-both {
      color: @primary;
      font-weight: 900;
      letter-spacing: 0.15em;
    }

    &--missed {
      color: #ef4444;
      font-weight: 600;
    }
  }

  // Active content
  &__active-content {
    display: flex;
    flex-direction: column;
    gap: 12px;
    width: 100%;
    align-items: center;
  }

  &__claim-group {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    width: 100%;
  }

  &__claim-btn {
    width: 100%;
    border: none;
    font-size: 8px;
    font-weight: 900;
    padding: 6px 4px;
    border-radius: 999px;
    text-transform: uppercase;
    cursor: pointer;
    text-align: center;
    line-height: 1.2;

    &--regular {
      background: @btn-grad;
      color: #573900;
    }

    &--premium {
      background: #fbbf24;
      color: #573900;
      font-size: 7px;
    }

    &--premium-small {
      background: #fbbf24;
      color: #573900;
      font-size: 7px;
      width: 100%;
      border: none;
      padding: 4px 4px;
      border-radius: 999px;
      text-transform: uppercase;
      cursor: pointer;
      text-align: center;
      font-weight: 900;
      line-height: 1.2;
    }
  }

  // Locked content
  &__locked-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__locked-amounts {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2px;
  }
}

// Bottom CTA
.checkin-bottom-cta {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  padding: 20px;
  background: linear-gradient(
    to top,
    @bg-dark,
    fade(@bg-dark, 90%),
    transparent
  );
  z-index: 40;

  &__btn {
    width: 100%;
    background: @btn-grad;
    color: #573900;
    font-size: 18px;
    font-weight: 900;
    padding: 16px;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    box-shadow: 0 0 20px fade(@primary, 30%);

    &:active {
      transform: scale(0.98);
    }
  }
}

// PC
@media (min-width: 769px) {
  .checkin-page-wrap {
    max-width: 450px;
    margin: 0 auto;
    border-left: 1px solid fade(#2a2418, 50%);
    border-right: 1px solid fade(#2a2418, 50%);
  }
}
</style>
