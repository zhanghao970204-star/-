<template>
  <div class="vip-page">
    <!-- Header -->
    <div class="vip-header">
      <van-icon
        name="arrow-left"
        size="22"
        color="#FFE4B5"
        @click="$router.go(-1)"
      />
      <h1 class="vip-header__title">{{ $lang.vip_title }}</h1>
      <div class="vip-header__balance">
        <span>{{ getCurrency }} {{ $formatNumberWithCommas(balance) }}</span>
        <div class="vip-header__add" @click="$jumpTo('/rechargeCont')">
          <van-icon name="plus" size="12" color="#1a1208" />
        </div>
      </div>
    </div>

    <div class="vip-card-wrap">
      <div
        class="vip-top-card"
        :class="{ 'is-locked': isLocked }"
        :style="{ background: vipCardStyle.cardBg }"
      >
        <div class="vip-card-fx">
          <div
            class="vip-card-fx-glow"
            :style="{ background: vipCardStyle.glowBg }"
          ></div>
          <div class="vip-card-fx-shower">
            <span
              v-for="line in cardShowerList"
              :key="`${currentViewLevel}-${line.id}`"
              class="vip-card-fx-line"
              :style="{
                right: line.right,
                top: line.top,
                width: line.width,
                height: line.height,
                '--line-opacity': line.opacity,
                animationDuration: line.duration,
                animationDelay: getShowerDelay(line),
              }"
            ></span>
          </div>
        </div>

        <div class="vip-top-card__arrow" @click="prevLevel">
          <van-icon name="arrow-left" size="16" color="#FFE4B5" />
        </div>

        <div class="vip-top-card__body">
          <div class="vip-top-card__badge" :class="{ 'is-dim': isLocked }">
            <div class="vip-top-card__badge-glow"></div>
            <div
              class="vip-top-card__badge-img"
              :style="badgeSpriteStyle(currentViewLevel, VIP_BADGE_H)"
            ></div>
          </div>

          <div class="vip-top-card__info">
            <div class="vip-top-card__head">
              <div class="vip-top-card__level">VIP {{ currentViewLevel }}</div>
              <div
                class="vip-top-card__tag"
                :class="{
                  'is-current': currentViewLevel === currentLevel,
                  'is-achieved': currentViewLevel < currentLevel,
                  'is-locked': currentViewLevel > currentLevel,
                }"
                :style="
                  currentViewLevel === currentLevel
                    ? { background: vipCardStyle.tagBg }
                    : null
                "
              >
                {{ levelTagText }}
              </div>
            </div>

            <div class="vip-top-card__xp">
              <img class="vip-top-card__xp-ico" :src="xpIcon" alt="" />
              <span>
                <span class="xp-cur">{{
                  $formatNumberWithCommas(rechargeAmount)
                }}</span>
                / {{ $formatNumberWithCommas(nextRechargeAmount) }}
              </span>
            </div>
            <div class="vip-top-card__bar">
              <div
                class="vip-top-card__fill"
                :style="{ width: rechargePercent + '%' }"
              ></div>
            </div>
            <div class="vip-top-card__tip">
              {{ $lang.vip_next_level || "NEXT LEVEL" }}
              <span class="need-num">{{
                $formatNumberWithCommas(
                  Math.max(0, nextRechargeAmount - rechargeAmount),
                )
              }}</span>
              →
              <span class="next-vip">VIP {{ currentLevel + 1 }}</span>
            </div>
          </div>
        </div>

        <div class="vip-top-card__arrow" @click="nextLevel">
          <van-icon name="arrow" size="16" color="#FFE4B5" />
        </div>
      </div>
    </div>

    <div v-if="currentViewLevel > 0" class="vip-benefits">
      <div class="vip-benefits__title">
        <span class="vip-benefits__dot"></span>
        {{ $lang.vip_exclusive_privileges || "Benefits" }}
      </div>
      <div class="benefit-grid">
        <div
          v-for="(item, idx) in privileges"
          :key="idx"
          class="benefit-card"
          :class="{
            'is-locked': isLocked,
            'is-full': item.full,
            'is-claimable':
              item.claimKey && !isLocked && getGiftStatus(item.claimKey) === 1,
          }"
          @click="onBenefitClick(item)"
        >
          <div class="benefit-card-icon-wrap">
            <van-icon :name="item.icon" size="22" color="#ffa300" />
          </div>
          <div class="benefit-card-text">
            <div class="tit">{{ item.label }}</div>
            <div class="describe">{{ item.value }}</div>
            <div
              v-if="item.claimKey && !isLocked"
              class="claim-status"
              :class="{
                'is-ready': getGiftStatus(item.claimKey) === 1,
                'is-done': getGiftStatus(item.claimKey) === 2,
              }"
            >
              {{
                getGiftClaiming(item.claimKey)
                  ? "..."
                  : btnText(getGiftStatus(item.claimKey))
              }}
            </div>
          </div>
          <van-icon
            v-if="isLocked"
            class="benefit-card-arrow"
            name="lock"
            color="#e9b65a"
          />
          <van-icon
            v-else
            class="benefit-card-arrow"
            name="arrow"
            color="#e9b65a"
          />
        </div>
      </div>
    </div>

    <div v-if="vipList.length" class="vip-levels">
      <div class="vip-benefits__title">
        <span class="vip-benefits__dot"></span>
        Level
      </div>

      <div
        v-if="canShowTopLevelExpand"
        class="lv-show-more"
        @click="toggleLevelSteps"
      >
        <div class="lv-flow-arrow" :class="{ 'is-up': !showAllSteps }">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
            <defs>
              <linearGradient
                id="lvArrowGradTop"
                x1="9.5"
                y1="0"
                x2="9.5"
                y2="18"
              >
                <stop stop-color="#F7DD9A" />
                <stop offset="1" stop-color="#FFA300" />
              </linearGradient>
            </defs>
            <path
              class="lv-arrow-chevron lv-arrow-chevron-1"
              d="M9.04702 17.589L18.274 11.9263L16.9385 10L9.04702 13.7945L1.26535 10.2919L0.000244141 12.1599L9.04702 17.589Z"
              fill="url(#lvArrowGradTop)"
            />
            <path
              class="lv-arrow-chevron lv-arrow-chevron-2"
              d="M9.04702 7.58905L18.274 1.92632L16.9385 0L9.04702 3.79446L1.26535 0.291917L0.000244141 2.15991L9.04702 7.58905Z"
              fill="url(#lvArrowGradTop)"
            />
          </svg>
        </div>
      </div>

      <div class="lv-list">
        <div
          v-for="item in displayVipList"
          :key="item.vipLevel"
          class="lv-item"
        >
          <div class="lv-track">
            <div
              class="lv-dot"
              :class="{
                'is-achieved': item.vipLevel < currentLevel,
                'is-current': item.vipLevel === currentLevel,
                'is-locked': item.vipLevel > currentLevel,
              }"
            >
              <van-icon
                v-if="item.vipLevel > currentLevel"
                name="lock"
                class="lv-dot-lock"
              />
            </div>
          </div>

          <div
            class="lv-card"
            :class="{
              'is-current': item.vipLevel === currentLevel,
              'is-locked': item.vipLevel > currentLevel,
            }"
            @click="onLevelCardClick(item)"
          >
            <div class="lv-card-body">
              <div
                class="lv-card-badge"
                :class="{ 'is-dim': item.vipLevel > currentLevel }"
                :style="badgeSpriteStyle(item.vipLevel, LV_BADGE_H)"
              ></div>
              <div class="lv-card-content">
                <div class="lv-card-head">
                  <div class="lv-card-head-left">
                    <div class="lv-card-level">VIP {{ item.vipLevel }}</div>
                    <div
                      class="lv-card-tag"
                      :class="`is-${getLevelStatus(item)}`"
                    >
                      {{ getLevelStatusText(item) }}
                    </div>
                  </div>
                </div>

                <div v-if="item.vipLevel === currentLevel" class="lv-card-exp">
                  <span class="exp-cur">{{
                    $formatNumberWithCommas(rechargeAmount)
                  }}</span>
                  / {{ $formatNumberWithCommas(nextRechargeAmount) }}
                </div>
                <div
                  v-else-if="item.vipLevel > currentLevel"
                  class="lv-card-unlock"
                >
                  {{ getUnlockText(item) }}
                </div>

                <div
                  v-if="item.vipLevel === currentLevel && !isMaxVip"
                  class="lv-card-progress"
                >
                  <div
                    class="lv-card-progress-fill"
                    :style="{ width: rechargePercent + '%' }"
                  ></div>
                </div>

                <div class="lv-benefit-grid">
                  <div
                    v-for="col in getLevelBenefitCols(item)"
                    :key="col.key"
                    class="lv-benefit-col"
                  >
                    <div class="lv-benefit-label">{{ col.label }}</div>
                    <div class="lv-benefit-val">{{ col.value }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="canShowBottomLevelExpand"
        class="lv-show-more"
        @click="toggleLevelSteps"
      >
        <div class="lv-flow-arrow" :class="{ 'is-up': showAllSteps }">
          <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
            <defs>
              <linearGradient
                id="lvArrowGradBottom"
                x1="9.5"
                y1="0"
                x2="9.5"
                y2="18"
              >
                <stop stop-color="#F7DD9A" />
                <stop offset="1" stop-color="#FFA300" />
              </linearGradient>
            </defs>
            <path
              class="lv-arrow-chevron lv-arrow-chevron-1"
              d="M9.04702 17.589L18.274 11.9263L16.9385 10L9.04702 13.7945L1.26535 10.2919L0.000244141 12.1599L9.04702 17.589Z"
              fill="url(#lvArrowGradBottom)"
            />
            <path
              class="lv-arrow-chevron lv-arrow-chevron-2"
              d="M9.04702 7.58905L18.274 1.92632L16.9385 0L9.04702 3.79446L1.26535 0.291917L0.000244141 2.15991L9.04702 7.58905Z"
              fill="url(#lvArrowGradBottom)"
            />
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  VipInit,
  GetVipAwardInit,
  GetVipAward,
  GetSignIn,
  SignIn,
  CashBackInit,
  GetCashBack,
  GameBalanceList,
} from "@/api/common";
import xpIcon from "@/assets/img/vip/xp.png";

// viptb.png：VIP0–VIP20 共 21 帧（4636×280）
const VIP_SPRITE_W = 4636;
const VIP_SPRITE_H = 280;
const VIP_BADGE_FRAMES = 21;
const VIP_BADGE_H = 110;
const LV_BADGE_H = 55;

const vipCardBgs = [
  "#15110A",
  "#241404",
  "#04061B",
  "#13161B",
  "#0D041B",
  "#041B0F",
  "#180202",
  "#040D1B",
  "#000000",
  "#000000",
  "#0D041B",
  "#002828",
  "#180202",
  "#04061B",
  "#041B0F",
  "#0D041B",
  "#040D1B",
  "#000000",
  "#180202",
  "#1B1704",
];

const vipTagGradients = [
  ["#545000", "#1B0B03"],
  ["#FFD220", "#463600"],
  ["#165B85", "#030A1B"],
  ["#1D738B", "#030E1B"],
  ["#330853", "#0D031B"],
  ["#00540D", "#031B0F"],
  ["#851616", "#1B0303"],
  ["#1D518B", "#030D1B"],
  ["#5F5F5F", "#000000"],
  ["#969696", "#191919"],
  ["#330853", "#0D031B"],
  ["#005154", "#031B0F"],
  ["#851616", "#1B0303"],
  ["#165B85", "#030A1B"],
  ["#00540D", "#031B0F"],
  ["#330853", "#0D031B"],
  ["#1D518B", "#030D1B"],
  ["#969696", "#191919"],
  ["#851616", "#1B0303"],
  ["#FFD220", "#463600"],
];

const vipGlowColors = [
  "#594506",
  "#62520A",
  "#0A285E",
  "#0C4458",
  "#390A5C",
  "#04570B",
  "#5C0808",
  "#042454",
  "#5E5E5E",
  "#5F5F5F",
  "#3A0A5E",
  "#0B4949",
  "#5A0808",
  "#09265B",
  "#04590B",
  "#360959",
  "#042557",
  "#5E5E5E",
  "#5B0808",
  "#5C530A",
];

const cardShowerList = [
  {
    id: 1,
    right: "0px",
    top: "-6px",
    width: "1px",
    height: "18px",
    duration: "3.1s",
    opacity: 0.55,
  },
  {
    id: 2,
    right: "8px",
    top: "-10px",
    width: "1.5px",
    height: "58px",
    duration: "4.4s",
    opacity: 0.35,
  },
  {
    id: 3,
    right: "16px",
    top: "-16px",
    width: "1px",
    height: "28px",
    duration: "2.8s",
    opacity: 0.48,
  },
  {
    id: 4,
    right: "24px",
    top: "-8px",
    width: "1px",
    height: "42px",
    duration: "3.7s",
    opacity: 0.4,
  },
  {
    id: 5,
    right: "32px",
    top: "-14px",
    width: "1.5px",
    height: "20px",
    duration: "2.7s",
    opacity: 0.52,
  },
  {
    id: 6,
    right: "40px",
    top: "-4px",
    width: "1px",
    height: "48px",
    duration: "4s",
    opacity: 0.32,
  },
  {
    id: 7,
    right: "48px",
    top: "-12px",
    width: "1px",
    height: "16px",
    duration: "2.4s",
    opacity: 0.58,
  },
  {
    id: 8,
    right: "56px",
    top: "-8px",
    width: "1.5px",
    height: "34px",
    duration: "3.5s",
    opacity: 0.38,
  },
  {
    id: 9,
    right: "64px",
    top: "-18px",
    width: "1px",
    height: "64px",
    duration: "4.6s",
    opacity: 0.28,
  },
  {
    id: 10,
    right: "72px",
    top: "-20px",
    width: "1px",
    height: "26px",
    duration: "3.2s",
    opacity: 0.45,
  },
  {
    id: 11,
    right: "80px",
    top: "-6px",
    width: "1.5px",
    height: "40px",
    duration: "3.6s",
    opacity: 0.34,
  },
  {
    id: 12,
    right: "88px",
    top: "-22px",
    width: "1px",
    height: "32px",
    duration: "3s",
    opacity: 0.42,
  },
  {
    id: 13,
    right: "4px",
    top: "-18px",
    width: "1px",
    height: "36px",
    duration: "3.3s",
    opacity: 0.36,
  },
  {
    id: 14,
    right: "20px",
    top: "-22px",
    width: "1.5px",
    height: "24px",
    duration: "2.6s",
    opacity: 0.5,
  },
  {
    id: 15,
    right: "36px",
    top: "-20px",
    width: "1px",
    height: "52px",
    duration: "4.1s",
    opacity: 0.3,
  },
  {
    id: 16,
    right: "52px",
    top: "-24px",
    width: "1px",
    height: "30px",
    duration: "3.1s",
    opacity: 0.44,
  },
  {
    id: 17,
    right: "68px",
    top: "-10px",
    width: "1.5px",
    height: "46px",
    duration: "3.8s",
    opacity: 0.33,
  },
  {
    id: 18,
    right: "84px",
    top: "-14px",
    width: "1px",
    height: "22px",
    duration: "2.7s",
    opacity: 0.46,
  },
];

function getVipStyle(levelId) {
  const lv = Number(levelId) || 1;
  const len = vipCardBgs.length;
  const idx = (((lv - 1) % len) + len) % len;
  const glow = vipGlowColors[idx].replace("#", "");
  const r = parseInt(glow.slice(0, 2), 16);
  const g = parseInt(glow.slice(2, 4), 16);
  const b = parseInt(glow.slice(4, 6), 16);
  const color = vipGlowColors[idx];
  const [tagTop, tagBottom] = vipTagGradients[idx];
  return {
    cardBg: vipCardBgs[idx],
    tagBg: `linear-gradient(180deg, ${tagTop} 0%, ${tagBottom} 100%)`,
    glowBg: `radial-gradient(circle, ${color} 0%, rgba(${r}, ${g}, ${b}, 0.72) 30%, rgba(${r}, ${g}, ${b}, 0.35) 50%, rgba(${r}, ${g}, ${b}, 0.12) 65%, transparent 78%)`,
  };
}

export default {
  name: "VipLevels",
  data() {
    return {
      VIP_BADGE_H,
      LV_BADGE_H,
      xpIcon,
      cardShowerList,
      balance: 0,
      currentLevel: 0,
      currentViewLevel: 0,
      vipList: [],
      betAmount: 0,
      rechargeAmount: 0,
      nextBetAmount: 0,
      nextRechargeAmount: 0,
      upgradeRuleList: [],
      claimingUpgrade: false,
      signStatus: 0,
      signAward: 0,
      signRuleList: [],
      betRebateRuleList: [],
      claimingSign: false,
      cashBackStatus: 0,
      cashBackAmount: 0,
      claimingCashBack: false,
      showAllSteps: false,
    };
  },
  computed: {
    totalLevels() {
      if (!this.vipList.length) return 0;
      return Math.max(...this.vipList.map((v) => Number(v.vipLevel) || 0));
    },
    isMaxVip() {
      return this.currentLevel >= this.totalLevels;
    },
    rechargePercent() {
      return this.nextRechargeAmount > 0
        ? Math.min((this.rechargeAmount / this.nextRechargeAmount) * 100, 100)
        : 100;
    },
    betPercent() {
      return this.nextBetAmount > 0
        ? Math.min((this.betAmount / this.nextBetAmount) * 100, 100)
        : 100;
    },
    upgradeStatus() {
      if (!Array.isArray(this.upgradeRuleList)) return 0;
      const rule = this.upgradeRuleList.find(
        (r) => r.vipLevel === this.currentViewLevel,
      );
      return rule ? rule.receiveStatus : 0;
    },
    upgradeAward() {
      if (!Array.isArray(this.upgradeRuleList)) return 0;
      const rule = this.upgradeRuleList.find(
        (r) => r.vipLevel === this.currentViewLevel,
      );
      return rule ? rule.reward : 0;
    },
    isLocked() {
      return this.currentViewLevel > this.currentLevel;
    },
    levelTagText() {
      if (this.currentViewLevel === this.currentLevel) return "Current Level";
      if (this.currentViewLevel < this.currentLevel) return "Achieved";
      return "Locked";
    },
    vipCardStyle() {
      return getVipStyle(this.currentViewLevel);
    },
    currentViewConfig() {
      return (
        this.vipList.find((v) => v.vipLevel === this.currentViewLevel) || {}
      );
    },
    currentLevelConfig() {
      return this.vipList.find((v) => v.vipLevel === this.currentLevel) || {};
    },
    signViewReward() {
      const effectiveLevel = Math.max(this.currentViewLevel, this.currentLevel);
      if (effectiveLevel === this.currentLevel && this.signAward > 0) {
        return this.signAward;
      }
      const rule = this.signRuleList.find((r) => r.vipLevel === effectiveLevel);
      return rule ? rule.reward : 0;
    },
    vipBetRebateRatio() {
      const rule = this.betRebateRuleList.find(
        (item) =>
          Number(item.vipLevel ?? item.level) === this.currentViewLevel,
      );
      if (!rule) return null;
      return (
        rule.betRebateRatio ??
        rule.betRebate ??
        rule.betRebateRate ??
        rule.rebateRatio ??
        rule.rebateRate ??
        rule.rebate ??
        rule.betFlowRatio ??
        rule.ratio ??
        rule.rate ??
        rule.percent ??
        null
      );
    },
    privileges() {
      const c = this.getCurrency;
      const cfg = this.currentViewConfig;
      return [
        {
          icon: "gift-o",
          label: this.$lang.vip_level_up_reward,
          value: c + " " + this.$formatNumberWithCommas(cfg.upgradeBonus || 0),
          claimKey: "upgrade",
        },
        {
          icon: "calendar-o",
          label: this.$lang.vip_daily_reward,
          value:
            c + " " + this.$formatNumberWithCommas(this.signViewReward || 0),
          claimKey: "sign",
        },
        {
          icon: "balance-o",
          label: this.$lang.vip_bet_rebate || "Betting Rebate",
          value: this.formatRatio(this.vipBetRebateRatio),
          isDisplayOnly: true,
        },
        {
          icon: "exchange",
          label: this.$lang.vip_loss_rebate,
          value: c + " " + this.$formatNumberWithCommas(cfg.signBalLimit || 0),
          claimKey: "cashBack",
        },
      ];
    },
    sortedVipList() {
      return [...this.vipList].sort(
        (a, b) => (Number(a.vipLevel) || 0) - (Number(b.vipLevel) || 0),
      );
    },
    displayVipList() {
      if (this.showAllSteps) return this.sortedVipList;
      return this.sortedVipList
        .filter((item) => (Number(item.vipLevel) || 0) >= this.currentLevel)
        .slice(0, 5);
    },
    canShowTopLevelExpand() {
      return this.currentLevel > 1;
    },
    canShowBottomLevelExpand() {
      return this.currentLevel !== this.totalLevels && this.totalLevels > 0;
    },
  },
  mounted() {
    if (this.token) {
      this.loadBalance();
      this.loadVipInit();
      this.loadGiftStatuses();
    }
  },
  methods: {
    badgeFrameIndex(level) {
      // 精灵图第 0 帧即 VIP0
      const lv = Math.max(0, Number(level) || 0);
      return Math.min(lv, VIP_BADGE_FRAMES - 1);
    },
    badgeSpriteStyle(level, displayH) {
      const idx = this.badgeFrameIndex(level);
      const h = displayH || VIP_BADGE_H;
      const scale = h / VIP_SPRITE_H;
      const spriteW = VIP_SPRITE_W * scale;
      const frameW = spriteW / VIP_BADGE_FRAMES;
      return {
        width: `${frameW}px`,
        height: `${h}px`,
        backgroundSize: `${spriteW}px ${h}px`,
        backgroundPosition: `-${idx * frameW}px 0`,
      };
    },
    getShowerDelay(line) {
      const dur = parseFloat(line.duration);
      const phase = (line.id - 1) / cardShowerList.length;
      return `-${(dur * phase).toFixed(2)}s`;
    },
    toggleLevelSteps() {
      this.showAllSteps = !this.showAllSteps;
    },
    getLevelStatus(item) {
      const lv = Number(item.vipLevel) || 0;
      if (lv === this.currentLevel) return "current";
      if (lv < this.currentLevel) return "achieved";
      return "locked";
    },
    getLevelStatusText(item) {
      const s = this.getLevelStatus(item);
      if (s === "current") return "Current Level";
      if (s === "achieved") return "Achieved";
      return "Locked";
    },
    getUnlockText(item) {
      const n =
        item.rechargeAmount ??
        item.needRechargeAmount ??
        item.experience ??
        item.needAmount;
      if (n != null && n !== "") {
        return `Unlock at ${this.$formatNumberWithCommas(n)}`;
      }
      return `VIP ${item.vipLevel}`;
    },
    getLevelBenefitCols(item) {
      const c = this.getCurrency;
      const daily =
        (this.signRuleList.find((r) => r.vipLevel === item.vipLevel) || {})
          .reward || 0;
      return [
        {
          key: "upgrade",
          label: this.$lang.vip_level_up_reward || "VIP Upgrade",
          value: c + this.$formatNumberWithCommas(item.upgradeBonus || 0),
        },
        {
          key: "daily",
          label: this.$lang.vip_daily_reward || "Daily Reward",
          value: c + this.$formatNumberWithCommas(daily),
        },
        {
          key: "betFlow",
          label: this.$lang.vip_bet_rebate || "Betting Rebate",
          value: this.formatRatio(item.betFlowRatio),
        },
        {
          key: "rescue",
          label: this.$lang.vip_rescue_fund || "Rescue Bonus",
          value: this.formatRatio(item.rescueRatio),
        },
      ];
    },
    onLevelCardClick(item) {
      this.currentViewLevel = Number(item.vipLevel) || 0;
    },
    onBenefitClick(item) {
      if (this.isLocked || item.isDisplayOnly) return;
      if (!item.claimKey) return;
      if (this.getGiftStatus(item.claimKey) === 1) {
        this.claimByKey(item.claimKey);
        return;
      }
      this.$toast(this.statusText(this.getGiftStatus(item.claimKey)));
    },
    formatRatio(value) {
      if (value == null || value === "") return "--";
      const stringValue = String(value).trim();
      if (stringValue.endsWith("%")) return stringValue;
      const n = Number(stringValue);
      if (Number.isNaN(n)) return "--";
      return `${this.$formatNumberWithCommas(n * 100)}%`;
    },
    parseRuleList(ruleList) {
      let list = ruleList;
      if (typeof list === "string") {
        try {
          list = JSON.parse(list);
        } catch (e) {
          return [];
        }
      }
      if (Array.isArray(list)) return list;
      if (!list || typeof list !== "object") return [];
      if (Array.isArray(list.ruleList)) return list.ruleList;
      if (list.vipLevel != null || list.level != null) return [list];
      return Object.keys(list).map((vipLevel) => ({
        vipLevel: Number(vipLevel),
        ratio: list[vipLevel],
      }));
    },
    statusText(s) {
      if (s === 0) return this.$lang.vip_not_reached || "Not reached";
      if (s === 1) return this.$lang.vip_claimable || "Claimable";
      if (s === 2) return this.$lang.vip_claimed || "Claimed";
      return "--";
    },
    btnText(s) {
      if (s === 0) return this.$lang.vip_not_reached || "Locked";
      if (s === 1) return this.$lang.ng_claim || "Claim";
      if (s === 2) return this.$lang.vip_claimed || "Claimed";
      return "--";
    },
    getGiftStatus(key) {
      const map = {
        upgrade: this.upgradeStatus,
        sign: this.signStatus,
        cashBack: this.cashBackStatus,
      };
      return map[key] || 0;
    },
    getGiftClaiming(key) {
      const map = {
        upgrade: this.claimingUpgrade,
        sign: this.claimingSign,
        cashBack: this.claimingCashBack,
      };
      return map[key] || false;
    },
    claimByKey(key) {
      const map = {
        upgrade: this.claimUpgrade,
        sign: this.claimSign,
        cashBack: this.claimCashBack,
      };
      if (map[key]) map[key](this.currentViewLevel);
    },
    async loadBalance() {
      try {
        const data = await GameBalanceList();
        if (data && data.status === "ok" && data.content) {
          const c = data.content;
          this.balance = c.totalBalance || c.balance || 0;
        }
      } catch (e) {
        console.error("GameBalanceList error", e);
      }
    },
    async loadVipInit() {
      try {
        const data = await VipInit();
        if (data.status === "ok") {
          const c = data.content;
          this.currentLevel = c.vipLevel || 0;
          this.currentViewLevel = c.vipLevel || 0;
          this.vipList = c.vipList || [];
          this.betAmount = c.betAmount || 0;
          this.rechargeAmount = c.rechargeAmount || 0;
          this.nextBetAmount = c.nextBetAmount || 0;
          this.nextRechargeAmount = c.nextRechargeAmount || 0;
        }
      } catch (e) {
        console.error("loadVipInit error", e);
      }
    },
    prevLevel() {
      if (this.currentViewLevel > 0) this.currentViewLevel--;
    },
    nextLevel() {
      if (this.currentViewLevel < this.totalLevels) this.currentViewLevel++;
    },
    async loadGiftStatuses() {
      try {
        const [upRes, signRes, cbRes] = await Promise.all([
          GetVipAwardInit({}),
          GetSignIn({}),
          CashBackInit({}),
        ]);
        if (upRes && upRes.status === "ok" && upRes.content) {
          let rl = upRes.content.ruleList;
          if (typeof rl === "string") {
            try {
              rl = JSON.parse(rl);
            } catch (e) {
              rl = [];
            }
          }
          this.upgradeRuleList = Array.isArray(rl) ? rl : [];
          this.betRebateRuleList = this.parseRuleList(
            upRes.content.betRebateRule,
          );
        }
        if (signRes && signRes.status === "ok" && signRes.content) {
          this.signStatus = signRes.content.receiveStatus || 0;
          this.signAward = signRes.content.awardAmount || 0;
          let srl = signRes.content.ruleList;
          if (typeof srl === "string") {
            try {
              srl = JSON.parse(srl);
            } catch (e) {
              srl = [];
            }
          }
          this.signRuleList = Array.isArray(srl) ? srl : [];
        }
        if (cbRes && cbRes.status === "ok" && cbRes.content) {
          this.cashBackStatus = cbRes.content.receiveStatus || 0;
          this.cashBackAmount = cbRes.content.backAmount || 0;
        }
      } catch (e) {
        console.error("loadGiftStatuses error", e);
      }
    },
    async claimUpgrade(targetLevel) {
      if (this.claimingUpgrade) return;
      this.claimingUpgrade = true;
      try {
        const level = targetLevel != null ? targetLevel : this.currentViewLevel;
        const res = await GetVipAward({ targetVipLevel: level });
        if (res && res.status === "ok" && res.content) {
          const rule = this.upgradeRuleList.find((r) => r.vipLevel === level);
          if (rule) rule.receiveStatus = 2;
          const amount = res.content.awardAmount || this.upgradeAward || 0;
          this.$toast({
            message:
              "+" + this.getCurrency + this.$formatNumberWithCommas(amount),
            icon: "success",
          });
        } else {
          this.$toast(res.msg || "Error");
        }
      } catch (e) {
        this.$toast(e.msg || "Error");
      } finally {
        this.claimingUpgrade = false;
      }
    },
    async claimSign() {
      if (this.claimingSign) return;
      this.claimingSign = true;
      try {
        const res = await SignIn({});
        if (res && res.status === "ok" && res.content) {
          const amount = res.content.awardAmount || this.signAward || 0;
          this.signStatus = 2;
          this.signAward = amount;
          this.$toast({
            message:
              "+" + this.getCurrency + this.$formatNumberWithCommas(amount),
            icon: "success",
          });
        } else {
          this.$toast(res.msg || "Error");
        }
      } catch (e) {
        this.$toast(e.msg || "Error");
      } finally {
        this.claimingSign = false;
      }
    },
    async claimCashBack() {
      if (this.claimingCashBack) return;
      this.claimingCashBack = true;
      try {
        const res = await GetCashBack({});
        if (res && res.status === "ok" && res.content) {
          this.cashBackStatus = res.content.receiveStatus || 2;
          const amount = res.content.backAmount || this.cashBackAmount || 0;
          this.$toast({
            message:
              "+" + this.getCurrency + this.$formatNumberWithCommas(amount),
            icon: "success",
          });
        } else {
          this.$toast(res.msg || "Error");
        }
      } catch (e) {
        this.$toast(e.msg || "Error");
      } finally {
        this.claimingCashBack = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@bg: #1f1c17;
@gold-deep: #e9a843;
@gold-grad: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
@btn-grad: linear-gradient(180deg, #ffd220 0%, #e9a843 100%);
@muted: #a8a095;

.vip-page {
  min-height: 100vh;
  background: @bg url(@/assets/img/vip/hybj.png) 0 0 no-repeat;
  background-size: contain;
  color: #fff;
  padding-bottom: 24px;
}

.vip-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: rgba(31, 28, 23, 0.92);
  border-bottom: 1px solid #e9b65a4d;
  backdrop-filter: blur(10px);
  height: 50px;
  display: flex;
  align-items: center;
  padding: 0 16px;
  justify-content: space-between;

  &__title {
    font-size: 15px;
    font-weight: 600;
    color: #fff;
  }

  &__balance {
    background: rgba(29, 20, 0, 0.65);
    border-radius: 20px;
    padding: 4px 4px 4px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #ffe4b5;
    border: 1px solid fade(@gold-deep, 35%);
  }

  &__add {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: @btn-grad;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}

/* ① 顶部 VIP 卡 */
.vip-card-wrap {
  width: 94%;
  margin: 12px auto 0;
}

.vip-top-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
  min-height: 128px;
  border-radius: 12px;
  border: 1px solid @gold-deep;
  background: #15110a;
  padding: 0 6px;
  box-sizing: border-box;
  overflow: hidden;

  &.is-locked {
    border-color: rgba(233, 168, 67, 0.35);
    filter: grayscale(0.35);
  }

  &__arrow {
    position: relative;
    z-index: 2;
    width: 28px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__body {
    position: relative;
    z-index: 1;
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
  }

  &__badge {
    position: relative;
    width: 90px;
    height: 110px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &.is-dim {
      opacity: 0.45;
    }
  }

  &__badge-glow {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 76px;
    height: 76px;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    z-index: 0;
  }

  &__badge-img {
    position: relative;
    z-index: 1;
    background-image: url(@/assets/img/vip/viptb.png);
    background-repeat: no-repeat;
    filter: drop-shadow(0 4px 14px rgba(255, 160, 50, 0.45));
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__head {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
  }

  &__level {
    font-size: 26px;
    font-weight: 800;
    font-style: italic;
    background: @gold-grad;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    transform: skew(-8deg);
    line-height: 1;
  }

  &__tag {
    padding: 3px 8px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    border: 1px solid @gold-deep;
    color: #fff;

    &.is-current {
      color: #fff;
    }

    &.is-achieved {
      background: linear-gradient(
        180deg,
        #b68063 0%,
        #f8d7a4 50%,
        #b68063 100%
      );
      color: #1a1408;
      border-color: transparent;
    }

    &.is-locked {
      background: linear-gradient(180deg, #b0b0b0 0%, #606060 100%);
      color: #fff;
      border-color: transparent;
    }
  }

  &__xp {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    line-height: 20px;
    color: #ccc;
    margin-bottom: 6px;

    .xp-cur {
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      line-height: 20px;
    }
  }

  &__xp-ico {
    width: 20px;
    height: 20px;
    object-fit: contain;
    flex-shrink: 0;
    display: block;
  }

  &__bar {
    height: 6px;
    background: #2a2620;
    border: 1px solid #4d4d4d;
    border-radius: 999px;
    overflow: hidden;
  }

  &__fill {
    height: 100%;
    background: @gold-grad;
    border-radius: 999px;
  }

  &__tip {
    margin-top: 8px;
    font-size: 10px;
    color: #ccc;

    .need-num {
      color: #fff;
      font-weight: 700;
      margin: 0 2px;
    }

    .next-vip {
      color: #fdd35b;
      font-weight: 700;
    }
  }
}

.vip-card-fx {
  position: absolute;
  top: 0;
  right: 0;
  width: 62%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  border-top-right-radius: 12px;
}

.vip-card-fx-glow {
  position: absolute;
  top: -28px;
  right: -28px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  filter: blur(12px);
}

.is-locked .vip-card-fx-glow {
  background: radial-gradient(
    circle,
    rgba(9, 32, 78, 0.35) 0%,
    transparent 70%
  ) !important;
}

.vip-card-fx-shower {
  position: absolute;
  inset: 0;
}

.vip-card-fx-line {
  position: absolute;
  border-radius: 999px;
  transform-origin: center center;
  opacity: 0;
  transform: rotate(45deg) translateY(-100px);
  background: linear-gradient(
    180deg,
    transparent 0%,
    rgba(255, 210, 140, 0.15) 22%,
    rgba(255, 240, 210, 0.95) 50%,
    rgba(255, 190, 110, 0.3) 78%,
    transparent 100%
  );
  box-shadow: 0 0 6px rgba(255, 200, 130, 0.4);
  animation: vip-card-fx-fall linear infinite;
  animation-fill-mode: backwards;
}

@keyframes vip-card-fx-fall {
  0% {
    transform: rotate(45deg) translateY(-100px);
    opacity: 0;
  }
  10% {
    opacity: var(--line-opacity, 0.5);
  }
  90% {
    opacity: var(--line-opacity, 0.5);
  }
  100% {
    transform: rotate(45deg) translateY(130px);
    opacity: 0;
  }
}

/* Benefits 网格 */
.vip-benefits,
.vip-levels {
  width: 94%;
  margin: 16px auto 0;
}

.vip-benefits__title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 12px;
}

.vip-benefits__dot {
  width: 7px;
  height: 7px;
  border-radius: 10px;
  background: @gold-grad;
  border: 2px solid #665433;
  box-sizing: content-box;
}

.benefit-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 0;
}

.benefit-card {
  width: 49%;
  min-height: 62px;
  border-radius: 8px;
  border: 1px solid #605037;
  background: transparent;
  padding: 8px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;

  &.is-full {
    width: 100%;
  }

  &.is-locked {
    opacity: 0.55;
  }

  &.is-claimable {
    border-color: @gold-deep;
    background: rgba(233, 168, 67, 0.08);
  }
}

.benefit-card-icon-wrap {
  width: 40px;
  height: 40px;
  border-radius: 6px;
  background: rgba(233, 168, 67, 0.16);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.benefit-card-text {
  flex: 1;
  min-width: 0;

  .tit {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
  }

  .describe {
    margin-top: 2px;
    font-size: 12px;
    font-weight: 700;
    color: #fdd35b;
  }

  .claim-status {
    margin-top: 2px;
    font-size: 10px;
    color: @muted;

    &.is-ready {
      color: #ffd467;
      font-weight: 700;
    }

    &.is-done {
      color: @muted;
    }
  }
}

.benefit-card-arrow {
  flex-shrink: 0;
  font-size: 14px;
}

/* ④ Level 时间轴 */
.lv-show-more {
  display: flex;
  justify-content: center;
  padding: 4px 0;
  cursor: pointer;
}

.lv-flow-arrow {
  display: flex;
  align-items: center;
  justify-content: center;

  &.is-up {
    transform: rotate(180deg);
  }

  .lv-arrow-chevron-1 {
    animation: lv-arrow-flow 1.4s ease-in-out infinite;
  }

  .lv-arrow-chevron-2 {
    animation: lv-arrow-flow 1.4s ease-in-out infinite 0.22s;
  }
}

@keyframes lv-arrow-flow {
  0%,
  100% {
    opacity: 0.35;
    transform: translateY(-3px);
  }
  50% {
    opacity: 1;
    transform: translateY(3px);
  }
}

.lv-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.lv-item {
  display: flex;
  gap: 5px;
  align-items: stretch;
}

.lv-track {
  width: 13px;
  flex-shrink: 0;
  position: relative;
  align-self: stretch;
  padding-top: 31px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 37.5px;
    bottom: -43.5px;
    width: 1px;
    margin-left: -0.5px;
    background: #665433;
  }
}

.lv-item:last-child .lv-track::after {
  display: none;
}

.lv-dot {
  width: 13px;
  height: 13px;
  border-radius: 50%;
  flex-shrink: 0;
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;

  &.is-achieved,
  &.is-current {
    border: 2px solid #665433;
    background: linear-gradient(180deg, #f4d98c 0%, #dd9711 100%);
  }

  &.is-locked {
    background: #2e2e2e;
    border: 1px solid #9d9d9d;

    .lv-dot-lock {
      font-size: 7px;
      color: #d7d7d7;
    }
  }
}

.lv-card {
  flex: 1;
  min-width: 0;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  background: #2d2d2d;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;

  &.is-current {
    position: relative;
    border: none;
    background: linear-gradient(180deg, #3a3124 0%, #2a2218 100%);
    box-shadow:
      inset 0 0 6px 0 rgba(246, 190, 37, 0.5),
      0 0 4px 0 rgba(255, 208, 0, 0.5);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 10px;
      padding: 0.5px;
      background: linear-gradient(180deg, #f7dd9a 0%, #ffa300 100%);
      -webkit-mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#fff 0 0) content-box,
        linear-gradient(#fff 0 0);
      mask-composite: exclude;
      pointer-events: none;
    }

    .lv-benefit-val,
    .exp-cur {
      color: #fdd35b;
    }
  }

  &.is-locked {
    .lv-card-level {
      background: linear-gradient(180deg, #e0e0e0 0%, #676767 100%);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }

    .lv-benefit-val {
      color: #fff;
    }
  }
}

.lv-card-body {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 4px;
  padding: 10px 8px 10px 4px;
}

.lv-card-badge {
  flex-shrink: 0;
  background-image: url(@/assets/img/vip/viptb.png);
  background-repeat: no-repeat;
  align-self: flex-start;

  &.is-dim {
    opacity: 0.6;
  }
}

.lv-card-content {
  flex: 1;
  min-width: 0;
}

.lv-card-head {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.lv-card-head-left {
  display: flex;
  align-items: center;
  gap: 6px;
  min-width: 0;
}

.lv-card-level {
  flex-shrink: 0;
  min-width: 50px;
  font-size: 16px;
  font-weight: 700;
  font-style: italic;
  line-height: 16px;
  background: linear-gradient(180deg, #f7dd9a 0%, #ffa300 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transform: skew(-8deg);
}

.lv-card-tag {
  flex-shrink: 0;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 8px;
  font-weight: 600;
  line-height: 11px;
  white-space: nowrap;

  &.is-achieved {
    background: linear-gradient(180deg, #b68063 0%, #f8d7a4 50%, #b68063 100%);
    color: #1a1408;
  }

  &.is-current {
    background: linear-gradient(180deg, #f4d98c 0%, #dd9711 100%);
    color: #1a1408;
  }

  &.is-locked {
    padding: 3px 10px;
    border-radius: 20px;
    background: linear-gradient(180deg, #b0b0b0 0%, #606060 100%);
    color: #fff;
  }
}

.lv-card-exp {
  width: 100%;
  margin-bottom: 4px;
  font-size: 9px;
  line-height: 11px;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  .exp-cur {
    color: #fdd35b;
    font-weight: 500;
  }
}

.lv-card-unlock {
  width: 100%;
  margin-bottom: 4px;
  font-size: 9px;
  line-height: 11px;
  font-weight: 500;
  color: #fdd35b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.lv-card-progress {
  height: 6px;
  margin: 0 0 6px;
  background: #2a2620;
  border-radius: 999px;
  overflow: hidden;
}

.lv-card-progress-fill {
  height: 100%;
  background: @gold-grad;
  border-radius: 999px;
}

.lv-benefit-grid {
  display: flex;
  flex-wrap: nowrap;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.lv-benefit-col {
  flex: 0 0 auto;
  min-width: 72px;
  padding: 0 8px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    border-right: none;
  }
}

.lv-benefit-label {
  font-size: 9px;
  color: #999;
  white-space: nowrap;
}

.lv-benefit-val {
  margin-top: 2px;
  font-size: 10px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;
}

@media (min-width: 769px) {
  .vip-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
