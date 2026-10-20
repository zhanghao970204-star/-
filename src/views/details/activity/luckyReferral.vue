<template>
  <div class="lucky-referral">
    <!-- Header -->
    <header class="lr-header">
      <button type="button" class="lr-header__back" @click="$router.go(-1)">
        <img
          class="lr-header__back-bg"
          src="@/assets/img/vip/Ellipse 348.png"
          alt=""
        />
      </button>
      <img
        class="lr-header__title-img"
        src="@/assets/img/activity/turntable/lr_title.png"
        :alt="$lang.lr_title || 'LUCKY REFERRAL'"
      />
      <div class="lr-header__spacer" aria-hidden="true"></div>
    </header>

    <div class="lr-content">
      <!-- 3D Wheel -->
      <section class="lr-zpbox">
        <div class="lr-zpbox__pointer"></div>
        <NewRoundTurntable
          ref="turntable"
          class="lr-zpbox__turntable"
          :prize-data="prizeList"
          :during-time="2"
          @endRotation="onSpinEnd"
        >
          <template #item="{ item }">
            <div class="lr-prize">
              <div class="lr-prize__img">
                <img
                  class="lr-prize__icon"
                  :src="item.icon"
                  alt=""
                  draggable="false"
                />
              </div>
            </div>
          </template>
        </NewRoundTurntable>
      </section>

      <!-- Spin Button -->
      <div
        class="lr-spin-but"
        :class="{ 'lr-spin-but--disabled': isSpinning }"
        @click="spin"
      >
        {{
          isSpinning
            ? $lang.lr_spinning || "SPINNING..."
            : remainingSpins + " Spins"
        }}
      </div>

      <!-- Progress / Claim Card -->
      <section class="lr-kpbox">
        <button
          type="button"
          class="lr-kpbox__claim"
          :class="canClaim ? 'btn-3d-yellow' : 'lr-kpbox__claim--grey'"
          :disabled="!canClaim"
          @click="claimReward"
        >
          {{ $lang.lr_claim_reward }}
        </button>

        <p class="lr-kpbox__label">{{ $lang.lr_current_earnings }}</p>
        <div class="lr-kpbox__amount">
          <span class="lr-kpbox__currency">{{ getCurrency }}</span>
          <span class="lr-kpbox__value">{{
            $formatNumberWithCommas(currentEarnings)
          }}</span>
          <span class="lr-kpbox__target"
            >/ {{ $formatNumberWithCommas(targetReward) }}</span
          >
        </div>

        <div class="lr-kpbox__bar">
          <van-progress
            class="lr-kpbox__prog"
            :percentage="progressPercent"
            :show-pivot="false"
            track-color="transparent"
            color="linear-gradient(180deg, #F7DD9A 0%, #FFA300 100%)"
            stroke-width="12"
          />
          <span
            class="lr-kpbox__pct"
            :style="{
              left: `clamp(18px, ${progressPercent}%, calc(100% - 18px))`,
            }"
            >{{ progressPercent }}%</span
          >
        </div>

        <p class="lr-kpbox__hint">{{ $lang.lr_spins_hint }}</p>

        <button class="lr-kpbox__invite" @click="showNoSpins = true">
          <span class="lr-kpbox__invite-inner">
            <img
              src="@/assets/img/activity/turntable/invite_link_icon.png"
              alt=""
            />
            <span>{{
              $lang.lr_invite_spins || "Invite Friends to Earn Spins"
            }}</span>
          </span>
        </button>
      </section>

      <!-- Referral Link -->
      <section class="lr-referral">
        <label class="lr-referral__label">{{ $lang.lr_referral_link }}</label>
        <div class="lr-referral__card">
          <p class="lr-referral__my">{{ $lang.common_txt57 }}</p>
          <div class="lr-referral__row">
            <div class="lr-referral__link">{{ referralLink }}</div>
            <button type="button" class="lr-referral__copy" @click="copyLink">
              {{ $lang.lr_copy }}
            </button>
          </div>
          <div class="lr-rules">
            <p class="lr-rules__text">
              <span class="lr-rules__highlight">{{
                $lang.lr_rules_highlight
              }}</span>
              {{ $lang.lr_rules_desc }}
            </p>
          </div>
        </div>
      </section>

      <!-- Recent Winners -->
      <section class="lr-winners">
        <div class="lr-winners__header">
          <h3 class="lr-winners__title">{{ $lang.lr_recent_winners }}</h3>
        </div>
        <div class="lr-winners__table">
          <div class="lr-winners__thead">
            <span>{{ $lang.lr_player_name }}</span>
            <span>{{ $lang.lr_reward_amount }}</span>
          </div>
          <div class="lr-winners__marquee">
            <div class="lr-winners__marquee-content">
              <div
                v-for="(winner, idx) in winnersDouble"
                :key="idx"
                class="lr-winners__row"
              >
                <span class="lr-winners__name">{{ winner.name }}</span>
                <span class="lr-winners__amount">
                  {{ getCurrency }} {{ $formatNumberWithCommas(winner.amount) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <!-- Insufficient Spins：通用弹窗样式（同支付确认壳）+ 分享内容 -->
    <van-popup
      v-model:show="showNoSpins"
      position="center"
      round
      class="lr-confirm"
      :close-on-click-overlay="true"
    >
      <div class="lr-confirm__head">
        {{ $lang.lr_insufficient_spins }}
        <button
          type="button"
          class="lr-confirm__x"
          @click="showNoSpins = false"
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
      <div class="lr-confirm__body">
        <p class="lr-confirm__desc">{{ $lang.lr_invite_more }}</p>

        <div class="lr-confirm__socials">
          <a class="lr-confirm__social" @click="shareToSocial('x')">
            <img
              src="../../../assets/img/otgame/pinduoduo_24.png"
              width="48"
              alt=""
            />
          </a>
          <a class="lr-confirm__social" @click="shareToSocial('facebook')">
            <img
              src="../../../assets/img/otgame/zjm_39.png"
              width="48"
              alt=""
            />
          </a>
          <a class="lr-confirm__social" @click="shareToSocial('youtube')">
            <img
              src="../../../assets/img/otgame/zjm_42.png"
              width="48"
              alt=""
            />
          </a>
          <a class="lr-confirm__social" @click="shareToSocial('ins')">
            <img src="../../../assets/img/otgame/ins.png" width="48" alt="" />
          </a>
        </div>

        <p class="lr-confirm__ref-label">{{ $lang.lr_referral_link }}</p>
        <div class="lr-confirm__ref-row">
          <div class="lr-confirm__ref-link">{{ referralLink }}</div>
          <button type="button" class="lr-confirm__ref-copy" @click="copyLink">
            {{ $lang.lr_copy }}
          </button>
        </div>

        <button
          type="button"
          class="lr-confirm__close btn-3d-green"
          @click="showNoSpins = false"
        >
          {{ $lang.lr_close || "Close" }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  GetLuckyRoulette,
  LuckyRoulette,
  ReceiveLuckyRouletteBonus,
  GetLuckyRouletteLatestAwards,
} from "@/api/common";
import { reportPromoPanel } from "@/utils/common";
import {
  playWheelSound,
  playWheelResultSound,
  playClickSound,
} from "@/utils/sound";
import NewRoundTurntable from "@/components/activity/NewRoundTurntable.vue";
import mysteryCoin from "@/assets/img/activity/turntable/mystery_coin.png";
import mysteryBox from "@/assets/img/activity/turntable/mystery_box.png";

export default {
  name: "LuckyReferral",
  components: { NewRoundTurntable },
  data() {
    return {
      targetReward: 0,
      currentEarnings: 0,
      remainingSpins: 0,
      invitedCount: 0,
      isOpen: 0,
      receiveStatus: 0,
      freeTimes: 0,
      minInviteCountToReward: 0,
      isSpinning: false,
      showNoSpins: false,
      winners: [],
      _pendingSpinResult: null,
      // 与图一一致：5 个问号金币 + 1 个问号宝箱，不展示金额
      prizeList: [
        { icon: mysteryCoin },
        { icon: mysteryCoin },
        { icon: mysteryBox },
        { icon: mysteryCoin },
        { icon: mysteryCoin },
        { icon: mysteryCoin },
      ],
    };
  },
  computed: {
    progressPercent() {
      if (!this.targetReward) return 0;
      return Math.min(
        Math.round((this.currentEarnings / this.targetReward) * 1000) / 10,
        100,
      );
    },
    canClaim() {
      return this.receiveStatus === 1;
    },
    referralLink() {
      const code = localStorage.getItem("shareCode") || "";
      return `${window.location.origin}/${this.GET_COUNTRY}/home?id=${code}`;
    },
    winnersDouble() {
      return [...this.winners, ...this.winners];
    },
  },
  mounted() {
    reportPromoPanel("lucky_roulette", 1);
    this.fetchData();
    this.fetchWinners();
  },
  beforeUnmount() {
    reportPromoPanel("lucky_roulette", 2);
  },
  methods: {
    async fetchData() {
      try {
        const res = await GetLuckyRoulette({});
        if (res && res.content) {
          const d = res.content;
          this.currentEarnings = d.bonusSum || 0;
          this.remainingSpins = d.drawCount || 0;
          this.invitedCount = d.invitedCount || 0;
          this.isOpen = d.isOpen || 0;
          this.receiveStatus = d.receiveStatus || 0;
          if (d.rules) {
            this.targetReward = d.rules.bonusAmount || 0;
            this.freeTimes = d.rules.freeTimes || 0;
            this.minInviteCountToReward = d.rules.minInviteCountToReward || 0;
          }
        }
      } catch (e) {
        console.log("fetchData error", e);
      }
    },
    async fetchWinners() {
      try {
        const res = await GetLuckyRouletteLatestAwards({});
        if (res && res.content && res.content.list) {
          this.winners = res.content.list.map((item) => ({
            name: item.userAccount || "",
            amount: item.amount || 0,
          }));
        }
      } catch (e) {
        console.log("fetchWinners error", e);
      }
    },
    async spin() {
      if (this.isSpinning) return;
      if (this.remainingSpins <= 0) {
        playClickSound();
        this.showNoSpins = true;
        return;
      }
      this.isSpinning = true;
      this._pendingSpinResult = null;
      try {
        const res = await LuckyRoulette({});
        this._pendingSpinResult = res;
        const index = Math.floor(Math.random() * this.prizeList.length);
        if (this.$refs.turntable && this.$refs.turntable.rotate) {
          playWheelSound();
          this.$refs.turntable.rotate(index);
        } else {
          this.onSpinEnd();
        }
      } catch (e) {
        console.log("spin error", e);
        this.isSpinning = false;
        this._pendingSpinResult = null;
      }
    },
    onSpinEnd() {
      const res = this._pendingSpinResult;
      this._pendingSpinResult = null;
      this.isSpinning = false;
      playWheelResultSound();
      if (res && res.content) {
        const d = res.content;
        const prevEarnings = this.currentEarnings;
        this.currentEarnings = d.bonusSum || 0;
        this.remainingSpins = d.drawCount || 0;
        this.receiveStatus = d.receiveStatus || 0;
        this.invitedCount = d.invitedCount || 0;
        const earned = this.currentEarnings - prevEarnings;
        if (earned > 0) {
          this.$toast({
            message: `+${this.getCurrency} ${this.$formatNumberWithCommas(earned)}`,
            icon: "success",
          });
        }
      }
    },
    async claimReward() {
      if (!this.canClaim) return;
      try {
        const res = await ReceiveLuckyRouletteBonus({});
        if (res && res.content) {
          const d = res.content;
          this.receiveStatus = d.receiveStatus || 0;
          this.currentEarnings = d.bonusSum || 0;
          this.remainingSpins = d.drawCount || 0;
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
        }
      } catch (e) {
        console.log("claimReward error", e);
      }
    },
    copyLink() {
      const textarea = document.createElement("textarea");
      textarea.value = this.referralLink;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso || "Success",
        icon: "success",
      });
    },
    shareToSocial(platform) {
      const links = {
        facebook: "https://www.facebook.com",
        ins: "https://instagram.com",
        x: "https://x.com",
        youtube: "https://youtube.com",
      };
      if (links[platform]) {
        window.open(links[platform], "_blank");
      }
    },
  },
};
</script>

<style lang="less" scoped>
@primary: #ffa300;
@gold: #ffa300;
@bg-dark: #1a0a28;
@card-bg: #12021a;
@red: #dc2626;

.lucky-referral {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  background: #10001a
    url("@/assets/img/activity/turntable/spin_main_turntable_bg-DPH0ZmqR.webp")
    center top / 100% auto no-repeat;
  padding-bottom: 30px;
  position: relative;
}

.lr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 8px 8px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  box-sizing: border-box;

  &__back {
    position: relative;
    flex-shrink: 0;
    width: 34px;
    height: 34px;
    border: none;
    padding: 0;
    background: transparent;
    cursor: pointer;
  }

  &__back-bg {
    position: absolute;
    inset: 0;
    width: 40px;
    height: 40px;
    object-fit: contain;
    pointer-events: none;
  }

  &__title-img {
    flex: 1;
    display: block;
    max-width: 280px;
    width: 72%;
    height: auto;
    max-height: 60px;
    margin: 0 auto;
    object-fit: contain;
    pointer-events: none;
  }

  &__spacer {
    width: 40px;
  }
}

.lr-content {
  width: 375px;
  max-width: 100%;
  margin: 0 auto;
  overflow: visible;
  box-sizing: border-box;
}

/* 小屏整页按 375 等比缩放，保持转盘坐标系 1:1 */
@media (max-width: 374px) {
  .lr-content {
    width: 375px;
    transform: scale(calc(100vw / 375));
    transform-origin: top center;
    margin-bottom: calc(100vh * (100vw / 375 - 1));
  }
}

// ====== 3D WHEEL（7y rem→px 1:1） ======
.lr-zpbox {
  width: 375px;
  height: 275px;
  background: url("@/assets/img/activity/turntable/eBKa9iWU.webp") 0 0 / contain
    no-repeat;
  position: relative;
  margin: 0 auto;
  flex-shrink: 0;

  &__pointer {
    width: 102px;
    height: 76px;
    background: url("@/assets/img/activity/turntable/BmnvYMp7.webp") 0 0 /
      contain no-repeat;
    position: absolute;
    left: 50%;
    z-index: 104;
    top: 26%;
    transform: translate(-50%, -50%);
    animation: lr-pointer-float 2s infinite ease-in-out;
    pointer-events: none;
  }
}

@keyframes lr-pointer-float {
  0% {
    transform: translate(-50%);
  }
  50% {
    transform: translate(-50%, -6px);
  }
  100% {
    transform: translate(-50%);
  }
}

/* 对齐 7y .turntable / .turntable-img */
.lr-prize {
  width: 70px;
  text-align: center;

  &__img {
    margin: 0 auto;
    width: 48px;
    height: 48px;
  }

  &__icon {
    width: 100%;
    height: 100%;
    object-fit: contain;
    -webkit-user-drag: none;
    pointer-events: none;
    filter: drop-shadow(0 2px 6px rgba(0, 0, 0, 0.55));
  }
}

// ====== SPIN BUTTON ======
.lr-spin-but {
  width: 237px;
  height: 80px;
  line-height: 35px;
  font-weight: 700;
  margin: -8px auto 0;
  text-align: center;
  transform: skew(-6deg);
  font-size: 24px;
  color: #fff;
  background: url("@/assets/img/activity/turntable/fxbut.png") 0 0 / contain
    no-repeat;
  background-image: image-set(
    url("@/assets/img/activity/turntable/fxbut.webp") type("image/webp"),
    url("@/assets/img/activity/turntable/fxbut.png") type("image/png")
  );
  text-shadow:
    2px 0 0 #ea3d99,
    0 2px 0 #ea3d99,
    -2px 0 0 #ea3d99,
    0 -2px 0 #ea3d99;
  cursor: pointer;
  user-select: none;

  &--disabled {
    opacity: 0.75;
    pointer-events: none;
  }

  &:active:not(.lr-spin-but--disabled) {
    opacity: 0.9;
  }
}

// ====== PROGRESS CARD ======
.lr-kpbox {
  width: 92%;
  margin: 12px auto 0;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 10px 15px 10px;
  position: relative;
  overflow: hidden;
  background: linear-gradient(90deg, #a936d3 0%, #4b35c2 100%);
  border: 1px solid #ffbf00;

  &__claim {
    position: absolute;
    top: 20px;
    right: 14px;
    z-index: 2;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 96px;
    width: auto;
    height: 28px !important;
    padding: 0 14px 2px;
    border: none;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    letter-spacing: 0;
    text-transform: none;
    box-sizing: border-box;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 1;
    }

    &--grey {
      background: linear-gradient(180deg, #9a9a9a 0%, #6a6a6a 100%);
      box-shadow:
        inset 0 2px 2px 0 rgba(255, 255, 255, 0.28),
        inset 0 -3px 0 0 #555;
      color: #f2f2f2;
    }
  }

  &__label {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
    margin-top: 4px;
    padding-right: 110px;
  }

  &__amount {
    font-weight: 700;
    font-size: 22px;
    max-width: 100%;
    padding: 8px 0;
    display: flex;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 4px;
    box-sizing: border-box;
  }

  &__currency,
  &__value {
    background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  &__target {
    font-size: 13px;
    color: rgba(255, 255, 255, 0.65);
    font-weight: 600;
  }

  &__bar {
    position: relative;
    margin-top: 4px;
    padding-bottom: 22px;
  }

  &__prog {
    margin-top: 0;
  }

  &__pct {
    position: absolute;
    top: 20px;
    z-index: 1;
    transform: translateX(-50%);
    min-width: 36px;
    height: 18px;
    padding: 0 7px;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 999px;
    background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
    color: #1a1208;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    white-space: nowrap;
    pointer-events: none;

    &::before {
      content: "";
      position: absolute;
      left: 50%;
      top: -4px;
      transform: translateX(-50%);
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 5px solid #ffb84a;
    }
  }

  &__hint {
    padding: 4px 0 12px;
    box-sizing: border-box;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    line-height: 1.4;
    word-break: break-word;
  }

  &__invite {
    min-height: 45px;
    padding: 0 16px;
    font-size: 13px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    background: linear-gradient(180deg, #4f8eff 0%, #487af5 100%);
    color: #fff;
    border-radius: 999px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    box-shadow:
      inset 0 5px 4.7px rgba(107, 150, 255, 0.75),
      inset 0 -3px 0 0 #2a4b9a;

    &:active {
      opacity: 0.92;
    }
  }

  &__invite-inner {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    max-width: 100%;
    line-height: 1.2;
    text-align: center;

    span {
      text-align: center;
    }

    img {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      object-fit: contain;
      display: block;
    }
  }
}

:deep(.lr-kpbox__prog.van-progress) {
  height: 16px !important;
  padding: 1px;
  border-radius: 33px;
  overflow: hidden;
  background: #170e3c !important;
  border: 1px solid #8d66e2;
  box-sizing: border-box;
}

:deep(.lr-kpbox__prog .van-progress__portion) {
  top: 1px;
  left: 1px;
  height: calc(100% - 2px);
  max-width: calc(100% - 2px);
  border-radius: 33px;
  background: linear-gradient(180deg, #f7dd9a 0%, #ffa300 100%) !important;
}

// ====== REFERRAL（背景、按钮复用分享页） ======
.lr-referral {
  padding: 0 16px;
  margin-top: 15px;

  &__label {
    font-size: 20px;
    font-weight: 700;
    text-transform: capitalize;
    letter-spacing: 0;
    color: @wihte-color;
    margin-bottom: 8px;
    display: block;
    text-align: center;
  }

  &__card {
    position: relative;
    overflow: hidden;
    box-sizing: border-box;
    padding: 76px 16px 25px;
    background-color: #361a50;
    background-image: url("@/assets/img/share/share_list2.png");
    background-repeat: no-repeat;
    background-position: top center;
    background-size: 100% 100%;
    box-shadow: 0 0 22px fade(#9b6dff, 40%);
  }

  &__my {
    margin: 18px 0 0px;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
    color: #edd8fb;
    text-align: center;
  }

  &__row {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    min-width: 0;
    height: 68px;
    box-sizing: border-box;
    padding: 7px 21px 0 25px;
    background-image: url("@/assets/img/share/share_link_bg.png");
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 100% 100%;
  }

  &__link {
    flex: 1;
    min-width: 0;
    font-size: 12px;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 700;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
  }

  &__copy {
    flex-shrink: 0;
    width: 54px;
    height: 26px;
    padding: 0;
    border: none;
    outline: none;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(180deg, #e5d939 0%, #e68014 100%);
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    text-transform: uppercase;
    border-radius: 19.5px;
    text-shadow: 0 1px 0 rgba(0, 0, 0, 0.5);
    box-shadow:
      inset 0 5px 4.7px 0 #fff47c,
      inset 0 -3px 0 0 #82520b;
  }
}

// ====== RULES ======
.lr-rules {
  margin: 12px 4px 0;
  padding: 10px 12px;
  border-radius: 12px;
  background: fade(#8542c6, 40%);
  border: 1px solid #e8b7fc;
  text-align: center;
  font-weight: 700;

  &__text {
    margin: 0;
    font-size: 12px;
    line-height: 1.5;
    color: #fff;
  }

  &__highlight {
    color: #fff;
    font-weight: 700;
  }
}

// ====== WINNERS ======
.lr-winners {
  padding: 0px 16px 16px;
  margin-top: 8px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 4px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 20px;
    font-weight: 700;
    text-transform: capitalize;
    letter-spacing: 0;
    color: @wihte-color;
    text-align: center;
  }

  &__table {
    background: transparent;
    border-radius: 10px;
    overflow: hidden;
  }

  &__thead {
    display: flex;
    justify-content: space-between;
    padding: 8px 0 15px;
    font-size: 12px;
    text-transform: uppercase;
    color: #b784d9;
    font-weight: 700;
  }

  &__marquee {
    height: 220px;
    overflow: hidden;
    position: relative;
  }

  &__marquee-content {
    display: flex;
    flex-direction: column;
    animation: marquee-vertical 15s linear infinite;
  }

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding: 10px 16px;
    background: #512275;
    border: none;
    border-radius: 16px;
    font-size: 12px;
  }

  &__name {
    font-weight: 600;
    color: #e5e7eb;
  }

  &__amount {
    font-weight: 700;
    font-size: 14px;
    color: #fbff00;
  }
}

@keyframes marquee-vertical {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-50%);
  }
}

/* 通用弹窗壳（对齐充值 Payment Confirmation） */
.lr-confirm {
  width: 88% !important;
  max-width: 360px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  overflow: hidden;
  border-radius: 18px !important;

  &__head {
    position: relative;
    background: #430063;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: 800;
    padding: 14px 40px;
  }

  &__x {
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

  &__body {
    padding: 16px 14px 18px;
    background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
    display: flex;
    flex-direction: column;
    align-items: stretch;
  }

  &__desc {
    margin: 0 0 16px;
    color: #fff;
    font-size: 14px;
    line-height: 1.45;
    text-align: center;
    font-weight: 600;
  }

  &__socials {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
    margin-bottom: 16px;
  }

  &__social {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 48px;
      height: 48px;
      object-fit: contain;
      display: block;
      border-radius: 50%;
    }
  }

  &__ref-label {
    margin: 0 0 8px;
    font-size: 12px;
    font-weight: 800;
    color: #fff;
  }

  &__ref-row {
    display: flex;
    align-items: center;
    background: #12021a;
    border-radius: 12px;
    padding: 4px;
    border: 1px solid fade(#ffa300, 45%);
    min-width: 0;
    margin-bottom: 16px;
  }

  &__ref-link {
    flex: 1;
    min-width: 0;
    padding: 8px 12px;
    color: #d1d5db;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__ref-copy {
    flex-shrink: 0;
    background: @red;
    color: #fff;
    font-size: 12px;
    font-weight: 700;
    padding: 8px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;

    &:active {
      opacity: 0.85;
    }
  }

  &__close {
    width: 100%;
    margin-top: 2px;
  }
}

@media (min-width: 769px) {
  .lucky-referral {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
