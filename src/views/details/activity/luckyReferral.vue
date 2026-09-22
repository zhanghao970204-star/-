<template>
  <div class="lucky-referral">
    <!-- Header -->
    <header class="lr-header">
      <button class="lr-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="lr-header__title">{{ $lang.lr_title || 'LUCKY REFERRAL' }}</h1>
      <div class="lr-header__spacer"></div>
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
                <img class="lr-prize__icon" :src="item.icon" alt="" draggable="false" />
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
        {{ isSpinning ? ($lang.lr_spinning || 'SPINNING...') : remainingSpins + ' Spins' }}
      </div>

      <!-- Progress / Claim Card -->
      <section class="lr-kpbox">
        <button
          class="lr-kpbox__claim"
          :class="{ 'lr-kpbox__claim--active': canClaim }"
          :disabled="!canClaim"
          @click="claimReward"
        >
          {{ $lang.lr_claim_reward }}
        </button>

        <p class="lr-kpbox__label">{{ $lang.lr_current_earnings }}</p>
        <div class="lr-kpbox__amount">
          <span class="lr-kpbox__currency">{{ getCurrency }}</span>
          <span class="lr-kpbox__value">{{ $formatNumberWithCommas(currentEarnings) }}</span>
          <span class="lr-kpbox__target">/ {{ $formatNumberWithCommas(targetReward) }}</span>
        </div>

        <van-progress
          class="lr-kpbox__prog"
          :percentage="progressPercent"
          track-color="#8D8D8D"
          color="linear-gradient(90deg, #F7DD9A 0%, #FFA300 100%)"
          stroke-width="8"
        />

        <p class="lr-kpbox__hint">{{ $lang.lr_spins_hint }}</p>

        <button class="lr-kpbox__invite" @click="showNoSpins = true">
          <img src="@/assets/img/activity/turntable/Frame.svg" alt="" />
          <span>{{ $lang.lr_invite_spins || 'Invite Friends to Earn Spins' }}</span>
        </button>
      </section>

      <!-- Referral Link -->
      <section class="lr-referral">
        <label class="lr-referral__label">{{ $lang.lr_referral_link }}</label>
        <div class="lr-referral__row">
          <div class="lr-referral__link">{{ referralLink }}</div>
          <button class="lr-referral__copy" @click="copyLink">{{ $lang.lr_copy }}</button>
        </div>
      </section>

      <!-- Rules -->
      <section class="lr-rules">
        <p class="lr-rules__text">
          <span class="lr-rules__highlight">{{ $lang.lr_rules_highlight }}</span>
          {{ $lang.lr_rules_desc }}
        </p>
      </section>

      <!-- Recent Winners -->
      <section class="lr-winners">
        <div class="lr-winners__header">
          <h3 class="lr-winners__title">{{ $lang.lr_recent_winners }}</h3>
          <span class="lr-winners__live">{{ $lang.lr_live_feed || 'Live Feed' }}</span>
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

    <!-- Insufficient Spins Popup -->
    <van-popup
      v-model:show="showNoSpins"
      round
      :close-on-click-overlay="true"
      class="lr-popup-wrapper"
    >
      <div class="lr-popup">
        <div class="lr-popup__icon">
          <van-icon name="warning-o" size="40" color="#ffa300" />
        </div>
        <h2 class="lr-popup__title">{{ $lang.lr_insufficient_spins }}</h2>
        <p class="lr-popup__desc">{{ $lang.lr_invite_more }}</p>

        <div class="lr-popup__socials">
          <a class="lr-popup__social" @click="shareToSocial('x')">
            <img src="../../../assets/img/otgame/pinduoduo_24.png" width="48" alt="" />
          </a>
          <a class="lr-popup__social" @click="shareToSocial('facebook')">
            <img src="../../../assets/img/otgame/zjm_39.png" width="48" alt="" />
          </a>
          <a class="lr-popup__social" @click="shareToSocial('youtube')">
            <img src="../../../assets/img/otgame/zjm_42.png" width="48" alt="" />
          </a>
          <a class="lr-popup__social" @click="shareToSocial('ins')">
            <img src="../../../assets/img/otgame/ins.png" width="48" alt="" />
          </a>
        </div>

        <div class="lr-popup__ref">
          <p class="lr-popup__ref-label">{{ $lang.lr_referral_link }}</p>
          <div class="lr-popup__ref-row">
            <div class="lr-popup__ref-link">{{ referralLink }}</div>
            <button class="lr-popup__ref-copy" @click="copyLink">{{ $lang.lr_copy }}</button>
          </div>
        </div>

        <button class="lr-popup__close" @click="showNoSpins = false">
          {{ $lang.lr_close }}
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
  GetLuckyRouletteLatestAwards
} from '@/api/common'
import { reportPromoPanel } from '@/utils/common'
import NewRoundTurntable from '@/components/activity/NewRoundTurntable.vue'
import mysteryCoin from '@/assets/img/activity/turntable/mystery_coin.png'
import mysteryBox from '@/assets/img/activity/turntable/mystery_box.png'

export default {
  name: 'LuckyReferral',
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
        { icon: mysteryCoin }
      ]
    }
  },
  computed: {
    progressPercent() {
      if (!this.targetReward) return 0
      return Math.min(
        Math.round((this.currentEarnings / this.targetReward) * 1000) / 10,
        100
      )
    },
    canClaim() {
      return this.receiveStatus === 1
    },
    referralLink() {
      const code = localStorage.getItem('shareCode') || ''
      return `${window.location.origin}/${this.GET_COUNTRY}/home?id=${code}`
    },
    winnersDouble() {
      return [...this.winners, ...this.winners]
    }
  },
  mounted() {
    reportPromoPanel('lucky_roulette', 1)
    this.fetchData()
    this.fetchWinners()
  },
  beforeUnmount() {
    reportPromoPanel('lucky_roulette', 2)
  },
  methods: {
    async fetchData() {
      try {
        const res = await GetLuckyRoulette({})
        if (res && res.content) {
          const d = res.content
          this.currentEarnings = d.bonusSum || 0
          this.remainingSpins = d.drawCount || 0
          this.invitedCount = d.invitedCount || 0
          this.isOpen = d.isOpen || 0
          this.receiveStatus = d.receiveStatus || 0
          if (d.rules) {
            this.targetReward = d.rules.bonusAmount || 0
            this.freeTimes = d.rules.freeTimes || 0
            this.minInviteCountToReward = d.rules.minInviteCountToReward || 0
          }
        }
      } catch (e) {
        console.log('fetchData error', e)
      }
    },
    async fetchWinners() {
      try {
        const res = await GetLuckyRouletteLatestAwards({})
        if (res && res.content && res.content.list) {
          this.winners = res.content.list.map(item => ({
            name: item.userAccount || '',
            amount: item.amount || 0
          }))
        }
      } catch (e) {
        console.log('fetchWinners error', e)
      }
    },
    async spin() {
      if (this.isSpinning) return
      if (this.remainingSpins <= 0) {
        this.showNoSpins = true
        return
      }
      this.isSpinning = true
      this._pendingSpinResult = null
      try {
        const res = await LuckyRoulette({})
        this._pendingSpinResult = res
        const index = Math.floor(Math.random() * this.prizeList.length)
        if (this.$refs.turntable && this.$refs.turntable.rotate) {
          this.$refs.turntable.rotate(index)
        } else {
          this.onSpinEnd()
        }
      } catch (e) {
        console.log('spin error', e)
        this.isSpinning = false
        this._pendingSpinResult = null
      }
    },
    onSpinEnd() {
      const res = this._pendingSpinResult
      this._pendingSpinResult = null
      this.isSpinning = false
      if (res && res.content) {
        const d = res.content
        const prevEarnings = this.currentEarnings
        this.currentEarnings = d.bonusSum || 0
        this.remainingSpins = d.drawCount || 0
        this.receiveStatus = d.receiveStatus || 0
        this.invitedCount = d.invitedCount || 0
        const earned = this.currentEarnings - prevEarnings
        if (earned > 0) {
          this.$toast({
            message: `+${this.getCurrency} ${this.$formatNumberWithCommas(earned)}`,
            icon: 'success'
          })
        }
      }
    },
    async claimReward() {
      if (!this.canClaim) return
      try {
        const res = await ReceiveLuckyRouletteBonus({})
        if (res && res.content) {
          const d = res.content
          this.receiveStatus = d.receiveStatus || 0
          this.currentEarnings = d.bonusSum || 0
          this.remainingSpins = d.drawCount || 0
          this.$toast({
            message: this.$lang.Sucesso || 'Success',
            icon: 'success'
          })
        }
      } catch (e) {
        console.log('claimReward error', e)
      }
    },
    copyLink() {
      const textarea = document.createElement('textarea')
      textarea.value = this.referralLink
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$toast({
        message: this.$lang.Sucesso || 'Success',
        icon: 'success'
      })
    },
    shareToSocial(platform) {
      const links = {
        facebook: `https://www.facebook.com`,
        ins: `https://instagram.com`,
        x: `https://x.com`,
        youtube: `https://youtube.com`
      }
      if (links[platform]) {
        window.open(links[platform], '_blank')
      }
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@gold: #ffa300;
@bg-dark: #1f1c17;
@card-bg: #15110a;
@red: #dc2626;

.lucky-referral {
  min-height: 100vh;
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
  box-sizing: border-box;
  background: @bg-dark url('@/assets/img/activity/turntable/spin_main_turntable_bg-DPH0ZmqR.webp')
    center top / 100% auto no-repeat;
  padding-bottom: 30px;
  position: relative;
}

.lr-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: transparent;
  box-sizing: border-box;

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    letter-spacing: 2px;
    color: @wihte-color;
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
  background: url('@/assets/img/activity/turntable/eBKa9iWU.webp') 0 0 / contain no-repeat;
  position: relative;
  margin: 0 auto;
  flex-shrink: 0;

  &__pointer {
    width: 102px;
    height: 76px;
    background: url('@/assets/img/activity/turntable/BmnvYMp7.webp') 0 0 / contain no-repeat;
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
  background: url('@/assets/img/activity/turntable/fxbut.png') 0 0 / contain no-repeat;
  background-image: image-set(
    url('@/assets/img/activity/turntable/fxbut.webp') type('image/webp'),
    url('@/assets/img/activity/turntable/fxbut.png') type('image/png')
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
  border-radius: 8px;
  box-sizing: border-box;
  padding: 15px 15px 18px;
  background: url('@/assets/img/activity/turntable/fxkp.png') 0 0 / 100% 100% no-repeat;
  position: relative;
  overflow: hidden;

  &__claim {
    position: absolute;
    top: 24px;
    right: 16px;
    background: #6666667c;
    font-size: 12px;
    color: #fff;
    padding: 8px 16px;
    border-radius: 15px;
    border: none;
    cursor: not-allowed;
    z-index: 2;

    &--active {
      background: linear-gradient(90deg, #b58f46 0%, #eebe6a 38.46%, #fbfb77 100%) !important;
      color: #282215;
      cursor: pointer;
    }
  }

  &__label {
    font-size: 12px;
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

  &__prog {
    margin-top: 4px;
  }

  &__hint {
    padding: 12px 0;
    box-sizing: border-box;
    font-size: 12px;
    color: #fff;
    line-height: 1.4;
    word-break: break-word;
  }

  &__invite {
    min-height: 45px;
    padding: 0 12px;
    font-size: 13px;
    font-weight: 700;
    width: 100%;
    text-align: center;
    background: linear-gradient(90deg, #b58f46 0%, #eebe6a 38.46%, #fbfb77 100%);
    color: #000;
    border-radius: 20px;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;

    span {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    img {
      width: 19px;
      height: 19px;
      flex-shrink: 0;
    }

    &:active {
      opacity: 0.9;
    }
  }
}

:deep(.lr-kpbox__prog .van-progress__pivot) {
  color: #282215;
}

// ====== REFERRAL ======
.lr-referral {
  padding: 0 16px;
  margin-top: 24px;

  &__label {
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #a89b7c;
    padding-left: 4px;
    margin-bottom: 8px;
    display: block;
  }

  &__row {
    display: flex;
    gap: 8px;
  }

  &__link {
    flex: 1;
    background: @card-bg;
    border: 1px solid rgba(107, 114, 128, 0.3);
    border-radius: 10px;
    padding: 12px 16px;
    font-size: 12px;
    color: #d1d5db;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &__copy {
    background: @red;
    color: @wihte-color;
    font-size: 12px;
    font-weight: 700;
    padding: 12px 20px;
    border-radius: 10px;
    border: none;
    cursor: pointer;

    &:active {
      opacity: 0.8;
    }
  }
}

// ====== RULES ======
.lr-rules {
  margin: 16px 16px 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 16px;
  border-radius: 10px;
  border-left: 4px solid @primary;

  &__text {
    font-size: 12px;
    line-height: 1.6;
    color: #a89b7c;
  }

  &__highlight {
    color: @wihte-color;
    font-weight: 700;
  }
}

// ====== WINNERS ======
.lr-winners {
  padding: 16px;
  margin-top: 8px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 4px;
    margin-bottom: 12px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: @wihte-color;
  }

  &__live {
    font-size: 10px;
    background: rgba(107, 114, 128, 0.3);
    padding: 4px 8px;
    border-radius: 4px;
    color: #a89b7c;
  }

  &__table {
    background: transparent;
    border-radius: 10px;
    overflow: hidden;
  }

  &__thead {
    display: flex;
    justify-content: space-between;
    padding: 8px 16px;
    font-size: 10px;
    text-transform: uppercase;
    color: #a89b7c;
    font-weight: 600;
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
    background: transparent url('@/assets/img/activity/turntable/tab.png') 0 0 / 100% 100% no-repeat;
    border: 1px solid #e9b65a4d;
    border-radius: 8px;
    font-size: 12px;
  }

  &__name {
    font-weight: 600;
    color: #e5e7eb;
  }

  &__amount {
    color: #ffe8e8;
    font-weight: 700;
    font-size: 16px;
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

// ====== POPUP ======
.lr-popup-wrapper {
  background: transparent !important;
  overflow: visible !important;
}

.lr-popup {
  width: calc(100vw - 40px);
  max-width: 360px;
  box-sizing: border-box;
  background: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 163, 0, 0.2);
  box-shadow: 0 0 20px rgba(255, 163, 0, 0.15);
  border-radius: 10px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;

  &__icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 24px;
    font-weight: 700;
    color: @wihte-color;
  }

  &__desc {
    font-size: 14px;
    color: #a89b7c;
    text-align: center;
    padding: 0 16px;
  }

  &__socials {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 8px;
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

  &__ref {
    width: 100%;

    &-label {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #a89b7c;
      margin-bottom: 8px;
      padding-left: 4px;
    }

    &-row {
      display: flex;
      align-items: center;
      background: #15110a;
      border-radius: 10px;
      padding: 4px;
      border: 1px solid rgba(255, 162, 0, 0.45);
      min-width: 0;
    }

    &-link {
      flex: 1;
      min-width: 0;
      padding: 8px 12px;
      color: #d1d5db;
      font-size: 13px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    &-copy {
      flex-shrink: 0;
      background: @red;
      color: @wihte-color;
      font-size: 12px;
      font-weight: 700;
      padding: 8px 24px;
      border-radius: 8px;
      border: none;
      cursor: pointer;

      &:active {
        opacity: 0.8;
      }
    }
  }

  &__close {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-weight: 900;
    padding: 16px;
    border-radius: 10px;
    font-size: 18px;
    border: none;
    cursor: pointer;
    box-shadow: 0 0 20px rgba(255, 163, 0, 0.4);

    &:active {
      transform: scale(0.98);
    }
  }
}

@media (min-width: 769px) {
  .lucky-referral {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
