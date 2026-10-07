<template>
  <div class="vip-page">
    <top-nav class="vip-page__topnav" />
    <div class="vip-page__nav-pad"></div>

    <!-- 图一：舞台 Hero + 卡片轮播 -->
    <section class="vip-hero">
      <img class="vip-hero__bg" :src="imgHeroBg" alt="" />

      <div class="vip-hero__head">
        <button type="button" class="vip-hero__back" @click="$router.go(-1)">
          <img class="vip-hero__back-bg" :src="imgBackCircle" alt="" />
          <img class="vip-hero__back-ico" :src="imgBackIco" alt="" />
        </button>
        <img class="vip-hero__logo" :src="imgLogo" alt="CLUB VIP" />
      </div>

      <div class="vip-carousel">
        <img
          v-if="peekPrevCardSrc"
          class="vip-carousel__peek is-left"
          :src="peekPrevCardSrc"
          alt=""
        />
        <img
          v-if="peekNextCardSrc"
          class="vip-carousel__peek is-right"
          :src="peekNextCardSrc"
          alt=""
        />

        <div class="vip-carousel__center">
          <button
            v-if="peekPrevCardSrc"
            type="button"
            class="vip-carousel__arrow"
            aria-label="prev"
            @click="prevLevel"
          >
            <img :src="imgArrow" alt="" />
          </button>

          <div class="vip-carousel__main" :class="{ 'is-locked': isLocked }">
            <img class="vip-carousel__card" :src="viewPairCardSrc" alt="" />
            <span class="vip-carousel__lv" :style="viewLevelTagStyle">
              VIP {{ currentViewLevel }}
            </span>
            <span
              class="vip-carousel__tag"
              :class="{
                'is-current': currentViewLevel === currentLevel,
                'is-achieved': currentViewLevel < currentLevel,
                'is-locked': currentViewLevel > currentLevel,
              }"
              :style="
                currentViewLevel > currentLevel ? null : viewLevelTagStyle
              "
            >
              {{ levelTagText }}
            </span>
          </div>

          <button
            v-if="peekNextCardSrc"
            type="button"
            class="vip-carousel__arrow is-next"
            aria-label="next"
            @click="nextLevel"
          >
            <img :src="imgArrow" alt="" />
          </button>
        </div>
      </div>

      <!-- VIP PROGRESS：落在舞台反光地面上 —— 底座 23434 + 箭头条 23445 + 钻石框 23443 -->
      <section class="vip-progress">
        <h2 class="vip-progress__title">VIP PROGRESS</h2>
        <div class="vip-progress__stage">
          <img class="vip-progress__base" :src="imgBase" alt="" />
          <div class="vip-progress__hud">
            <div class="vip-progress__badge">
              <img class="vip-progress__badge-bg" :src="imgBadge" alt="" />
              <span class="vip-progress__badge-txt">
                <i>VIP</i>
                <em>{{ currentViewLevel }}</em>
              </span>
            </div>
            <div class="vip-progress__bar">
              <img class="vip-progress__bar-bg" :src="imgProgressBar" alt="" />
              <div class="vip-progress__track">
                <div
                  class="vip-progress__fill"
                  :style="{ width: rechargePercent + '%' }"
                ></div>
              </div>
              <i
                class="vip-progress__knob"
                :style="{ left: progressKnobLeft }"
              ></i>
              <span class="vip-progress__num">
                {{ $formatNumberWithCommas(rechargeAmount) }} /
                {{ $formatNumberWithCommas(nextRechargeAmount) }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </section>

    <!-- Exclusive Privileges -->
    <section v-if="currentViewLevel > 0" class="vip-benefits">
      <h2 class="vip-section-title">
        {{ $lang.vip_exclusive_privileges || "Exclusive Privileges" }}
      </h2>
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
          <img class="benefit-card__bg" :src="imgPrivilegeBg" alt="" />
          <div class="benefit-card__icon">
            <img class="benefit-card__frame" :src="imgIconFrame" alt="" />
            <img
              class="benefit-card__pic"
              :src="privilegeIcons[idx] || privilegeIcons[0]"
              alt=""
            />
            <van-icon v-if="isLocked" class="benefit-card__lock" name="lock" />
          </div>
          <div class="benefit-card__text">
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
        </div>
      </div>
    </section>

    <!-- 图二：Level 列表 -->
    <section v-if="vipList.length" class="vip-levels">
      <h2 class="vip-section-title">Level</h2>

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
              <img
                class="lv-card-badge"
                :class="{ 'is-dim': item.vipLevel > currentLevel }"
                :src="resolveVipPairIcon(item.vipLevel)"
                alt=""
              />
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
    </section>
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
import TopNav from "@/components/TopNav.vue";
import xpIcon from "@/assets/img/vip/xp.png";

function vipAsset(name) {
  return new URL(`../../../assets/img/vip/${name}`, import.meta.url).href;
}

const vipPairModules = import.meta.glob("@/assets/img/vip/*_*.png", {
  eager: true,
  import: "default",
});

/** 两级共用：1-2 / 3-4 ... 13-14（与我的页 vip 图标规则一致） */
function vipPairStart(level) {
  const lv = Math.max(0, Number(level) || 0);
  const start = lv <= 0 ? 1 : Math.floor((lv - 1) / 2) * 2 + 1;
  return Math.min(start, 13);
}

function resolveVipPairIcon(level) {
  const start = vipPairStart(level);
  const name = `${start}_${start + 1}.png`;
  const hit = Object.keys(vipPairModules).find((k) => k.endsWith(`/${name}`));
  if (hit) return vipPairModules[hit];
  const fallback = Object.keys(vipPairModules).find((k) =>
    k.endsWith("/1_2.png"),
  );
  return fallback ? vipPairModules[fallback] : "";
}

/** 两级共用一张 VIP 卡片：0-2 / 3-4 / 5-6 / 7-8 / 9-10 / 11-12 / 13 */
const VIP_PAIR_CARDS = [
  vipAsset("image 23435.png"), // 0-2 青铜
  vipAsset("Group 1707485596.png"), // 3-4 紫丁香
  vipAsset("Group 1707485597.png"), // 5-6 金红心
  vipAsset("Group 1707485598.png"), // 7-8 绿黑桃
  vipAsset("Group 1707485599.png"), // 9-10 蓝钻
  vipAsset("Group 1707485600.png"), // 11-12 紫金冠
  vipAsset("Group 1707485594.png"), // 13 黑金冠
];

function resolveVipPairCard(level) {
  const start = vipPairStart(level);
  const idx = Math.min(Math.floor((start - 1) / 2), VIP_PAIR_CARDS.length - 1);
  return VIP_PAIR_CARDS[Math.max(0, idx)];
}

/** 卡片等级档：0-2 / 3-4 / 5-6 / 7-8 / 9-10 / 11-12 / 13+ */
function vipCardTierIndex(level) {
  const lv = Math.max(0, Number(level) || 0);
  if (lv <= 2) return 0;
  if (lv <= 4) return 1;
  if (lv <= 6) return 2;
  if (lv <= 8) return 3;
  if (lv <= 10) return 4;
  if (lv <= 12) return 5;
  return 6;
}

/** 各档卡片底色 / 边框渐变 / 内阴影（设计稿） */
const VIP_CARD_TIERS = [
  {
    bg: ["#7E442E", "#7E442E"],
    border: ["#FDFFFE", "#EECDAB"],
    shadow: "#402013",
  },
  {
    bg: ["#35084B", "#482762"],
    border: ["#FCFEFF", "#D0D1D8"],
    shadow: "#200C3F",
  },
  {
    bg: ["#750002", "#750002"],
    border: ["#FFF5CE", "#FFE683"],
    shadow: "#240000",
  },
  {
    bg: ["#003918", "#003918"],
    border: ["#FFF5CE", "#FFE683"],
    shadow: "#010101",
  },
  {
    bg: ["#1156BF", "#1156BF"],
    border: ["#E0F5FE", "#416197"],
    shadow: "#010101",
  },
  {
    bg: ["#522074", "#522074"],
    border: ["#D983C9", "#B122ED"],
    shadow: "#010101",
  },
  {
    bg: ["#2F0302", "#2F0302"],
    border: ["#FEE8A7", "#B76320"],
    shadow: "#170000",
  },
];

function resolveVipCardTier(level) {
  return VIP_CARD_TIERS[vipCardTierIndex(level)];
}

/** 等级角标 / Current Level 胶囊样式 */
function resolveVipLevelTagStyle(level) {
  const t = resolveVipCardTier(level);
  return {
    background: `linear-gradient(${t.bg[0]}, ${t.bg[1]}) padding-box, linear-gradient(180deg, ${t.border[0]}, ${t.border[1]}) border-box`,
    border: "1px solid transparent",
    boxShadow: `inset 0 3px 8px ${t.shadow}`,
    color: "#fff",
  };
}

const IMG_HERO_BG = vipAsset("image 23433.png");
const IMG_LOGO = vipAsset("image 23453.png");
const IMG_BACK_CIRCLE = vipAsset("Ellipse 348.png");
const IMG_BACK_ICO = vipAsset("back 1.png");
const IMG_ARROW = vipAsset("vip_arrow.png");
/** 进度条左侧钻石徽章框（资源名 image 23443） */
const IMG_BADGE = vipAsset("image 23443.png");
const IMG_PROGRESS_BAR = vipAsset("image 23445.png");
const IMG_BASE = vipAsset("image 23434.png");
const IMG_PRIVILEGE_BG = vipAsset("Rectangle 666.png");
const IMG_ICON_FRAME = vipAsset("Rectangle 34626434.png");
const PRIVILEGE_ICONS = [
  vipAsset("3042c070-6679-490a-8784-101c9d3c2617 1.png"),
  vipAsset("image 23408.png"),
  vipAsset("image 23412.png"),
  vipAsset("image 23452.png"),
];

const vipCardBgs = [
  "#12021a",
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
  // 与图标/卡片一致：两级共用同一套配色
  const lv = vipPairStart(levelId);
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
  components: { TopNav },
  data() {
    return {
      xpIcon,
      cardShowerList,
      imgHeroBg: IMG_HERO_BG,
      imgLogo: IMG_LOGO,
      imgBackCircle: IMG_BACK_CIRCLE,
      imgBackIco: IMG_BACK_ICO,
      imgArrow: IMG_ARROW,
      imgBadge: IMG_BADGE,
      imgProgressBar: IMG_PROGRESS_BAR,
      imgBase: IMG_BASE,
      imgPrivilegeBg: IMG_PRIVILEGE_BG,
      imgIconFrame: IMG_ICON_FRAME,
      privilegeIcons: PRIVILEGE_ICONS,
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
    progressKnobLeft() {
      const p = Math.min(Math.max(this.rechargePercent, 0), 100);
      return `${7 + p * 0.87}%`;
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
    viewPairIconSrc() {
      return resolveVipPairIcon(this.currentViewLevel);
    },
    viewPairCardSrc() {
      return resolveVipPairCard(this.currentViewLevel);
    },
    /** 资源卡最高档约 13，接口未回列表时也能左右露边 */
    maxViewLevel() {
      return Math.max(this.totalLevels || 0, 13);
    },
    viewLevelTagStyle() {
      return resolveVipLevelTagStyle(this.currentViewLevel);
    },
    peekPrevCardSrc() {
      if (this.currentViewLevel <= 0) return "";
      return resolveVipPairCard(this.currentViewLevel - 1);
    },
    peekNextCardSrc() {
      if (this.currentViewLevel >= this.maxViewLevel) return "";
      return resolveVipPairCard(this.currentViewLevel + 1);
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
        (item) => Number(item.vipLevel ?? item.level) === this.currentViewLevel,
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
    resolveVipPairIcon,
    resolveVipPairCard,
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
      if (this.currentViewLevel < this.maxViewLevel) this.currentViewLevel++;
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
@bg: #15031d;
@gold: #ffd400;
@purple: #7400ae;

.vip-page {
  min-height: 100vh;
  background: @bg url(@/assets/img/common/page_bg.png) 0 0 repeat;
  background-attachment: fixed;
  color: #fff;
  padding-bottom: 28px;
  box-sizing: border-box;
  overflow-x: hidden;
}

.vip-page__topnav {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 100;
}

.vip-page__nav-pad {
  height: 60px;
}

/* ===== 图一 Hero：背景固定 424px，内容上移缩小塞进背景内 ===== */
.vip-hero {
  position: relative;
  width: 100%;
  height: 424px;
  padding: 0;
  overflow: hidden;
  box-sizing: border-box;
}

.vip-hero__bg {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  width: 100%;
  max-width: 450px;
  height: 424px;
  object-fit: cover;
  object-position: center top;
  z-index: 0;
  pointer-events: none;
}

/* 返回在 Logo 左上方；整块头部收紧 */
.vip-hero__head {
  position: relative;
  z-index: 2;
  height: 72px;
  padding: 0 8px;
  box-sizing: border-box;
}

.vip-hero__back {
  position: absolute;
  left: 8px;
  top: 2px;
  z-index: 3;
  width: 34px;
  height: 34px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.vip-hero__back-bg {
  position: absolute;
  inset: 0;
  width: 40px;
  height: 40px;
  object-fit: contain;
}

.vip-hero__back-ico {
  position: absolute;
  left: 60%;
  top: 60%;
  height: 20px;
  transform: translate(-58%, -50%);
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.vip-hero__logo {
  position: relative;
  z-index: 1;
  display: block;
  width: 80%;
  margin: 4px auto 0;
  object-fit: contain;
  pointer-events: none;
  filter: drop-shadow(0 0 12px rgba(255, 100, 255, 0.3));
}

/* 中间主卡大，两侧卡缩小露边（图一图二） */
.vip-carousel {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 148px;
  margin: 50px 0 0;
  overflow: hidden;
}

.vip-carousel__peek {
  position: absolute;
  top: 50%;
  width: 52%;
  max-width: 188px;
  height: auto;
  object-fit: contain;
  opacity: 0.92;
  filter: brightness(0.72);
  pointer-events: none;
  z-index: 0;

  &.is-left {
    left: 0;
    transform: translate(-58%, -50%) scale(0.72);
    transform-origin: center center;
  }

  &.is-right {
    right: 0;
    transform: translate(58%, -50%) scale(0.72);
    transform-origin: center center;
  }
}

.vip-carousel__center {
  position: relative;
  z-index: 2;
  width: 58%;
  max-width: 218px;
  height: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.vip-carousel__arrow {
  position: absolute;
  z-index: 4;
  top: 50%;
  left: -26px;
  transform: translateY(-50%);
  width: 22px;
  height: 30px;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;

  img {
    display: block;
    width: 18px;
    height: 24px;
    margin: 0 auto;
    object-fit: contain;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.35));
  }

  &.is-next {
    left: auto;
    right: -26px;

    img {
      transform: scaleX(-1);
    }
  }
}

.vip-carousel__main {
  position: relative;
  z-index: 2;
  width: 100%;
  filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5));

  &.is-locked {
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.5)) grayscale(0.12)
      brightness(0.92);
  }
}

.vip-carousel__card {
  display: block;
  width: 100%;
  height: auto;
  object-fit: contain;
}

.vip-carousel__lv {
  position: absolute;
  left: 8px;
  top: 8px;
  z-index: 2;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  line-height: 1.2;
  pointer-events: none;
  box-sizing: border-box;
}

.vip-carousel__tag {
  position: absolute;
  left: 50%;
  bottom: 10%;
  transform: translateX(-50%);
  z-index: 2;
  min-width: 86px;
  text-align: center;
  padding: 3px 12px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
  color: #fff;
  pointer-events: none;
  box-sizing: border-box;

  &.is-locked {
    background: linear-gradient(180deg, #5a5a5a 0%, #2e2e2e 100%) !important;
    background-image: none !important;
    border: 1px solid rgba(180, 180, 180, 0.35) !important;
    box-shadow: inset 0 3px 8px #111 !important;
    color: #ddd !important;
  }
}

/* ===== VIP PROGRESS：收进 424 背景底部 ===== */
.vip-progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 0 0 2px;
  box-sizing: border-box;
}

.vip-progress__title {
  position: absolute;
  left: 0;
  right: 0;
  top: 18%;
  z-index: 3;
  margin: 0;
  text-align: center;
  font-size: 21px;
  font-weight: 900;
  letter-spacing: 1px;
  color: #fff;
  text-shadow:
    0 2px 0 #3a0a78,
    0 0 10px rgba(180, 60, 255, 0.95);
  pointer-events: none;
}

.vip-progress__stage {
  position: relative;
  width: 100%;
  height: 168px;
  margin-top: 0;
}

.vip-progress__base {
  position: absolute;
  left: 50%;
  bottom: 0;
  transform: translateX(-50%);
  width: 100%;
  height: 100%;
  object-fit: contain;
  object-position: center bottom;
  z-index: 0;
  pointer-events: none;
}

/* 文案+进度条下移，落在底座顶层台面 */
.vip-progress__hud {
  position: absolute;
  left: 50%;
  top: 34%;
  transform: translateX(-50%);
  z-index: 2;
  width: 90%;
  max-width: 340px;
  height: 72px;
  display: flex;
  align-items: center;
}

.vip-progress__badge {
  position: relative;
  z-index: 3;
  width: 72px;
  height: 72px;
  flex-shrink: 0;
  margin-right: -40px;
  display: flex;
  align-items: center;
  justify-content: center;
  filter: drop-shadow(0 0 10px rgba(80, 180, 255, 0.55));
}

.vip-progress__badge-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.vip-progress__badge-txt {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  line-height: 1;
  pointer-events: none;

  i {
    font-style: normal;
    font-size: 9px;
    font-weight: 800;
    letter-spacing: 0.4px;
    color: #ffe27a;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  }

  em {
    margin-top: 1px;
    font-style: normal;
    font-size: 18px;
    font-weight: 900;
    color: #ffe27a;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85);
  }
}

/* 进度条与左侧钻石垂直居中对齐；金色进度在箭头上半槽 */
.vip-progress__bar {
  position: relative;
  flex: 1;
  min-width: 0;
  height: 72px;
  display: block;
}

.vip-progress__bar-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  pointer-events: none;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
}

.vip-progress__track {
  position: absolute;
  z-index: 1;
  left: 7%;
  top: 30%;
  width: 85.5%;
  height: 12px;
  border-radius: 2px;
  background: transparent;
  overflow: hidden;
}

.vip-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, #ffe27a 0%, #ffb000 48%, #ff8a00 100%);
  box-shadow: 0 0 8px rgba(255, 180, 40, 0.75);
}

.vip-progress__knob {
  position: absolute;
  z-index: 3;
  top: calc(38% + 4px);
  width: 15px;
  height: 15px;
  margin-left: -5px;
  margin-top: -12px;
  border-radius: 50%;
  background: radial-gradient(
    circle at 35% 30%,
    #fff6c8 0%,
    #ffd24a 42%,
    #e09000 100%
  );
  box-shadow:
    0 0 8px rgba(255, 200, 60, 0.95),
    0 0 0 2px rgba(255, 220, 120, 0.4);
  pointer-events: none;
}

.vip-progress__num {
  position: absolute;
  z-index: 2;
  left: 50%;
  top: 58%;
  transform: translate(-50%, -50%);
  font-size: 10px;
  font-weight: 800;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.9);
  white-space: nowrap;
  pointer-events: none;
}

/* ===== Privileges ===== */
.vip-section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 800;
  color: #fff;
}

.vip-benefits,
.vip-levels {
  width: 92%;
  max-width: 420px;
  margin: 22px auto 0;
}

.vip-benefits {
  position: relative;
  margin-top: 18px;
  padding-top: 16px;

  /* 分割线：#BA64DD → #4F00CE */
  &::before {
    content: "";
    position: absolute;
    left: 50%;
    top: 0;
    width: 100vw;
    height: 1px;
    transform: translateX(-50%);
    background: linear-gradient(90deg, #ba64dd 0%, #4f00ce 100%);
    pointer-events: none;
  }

  .vip-section-title {
    text-align: center;
  }
}

.benefit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.benefit-card {
  position: relative;
  overflow: hidden;
  padding: 10px 10px 10px 12px;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &.is-full {
    grid-column: 1 / -1;
  }

  &.is-locked {
    opacity: 0.85;
  }

  &.is-claimable {
    box-shadow: 0 0 0 1px fade(@gold, 55%);
  }
}

.benefit-card__bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
}

.benefit-card__icon {
  position: relative;
  z-index: 1;
  width: 52px;
  height: 40px;
  flex-shrink: 0;
}

.benefit-card__frame {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
}

.benefit-card__pic {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -50%);
  width: 34px;
  height: 30px;
  object-fit: contain;
}

.benefit-card__lock {
  position: absolute;
  right: 2px;
  bottom: 2px;
  z-index: 2;
  font-size: 12px !important;
  color: #fff !important;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.6));
}

.benefit-card__text {
  position: relative;
  z-index: 1;
  flex: 1;
  min-width: 0;

  .tit {
    font-size: 11px;
    font-weight: 600;
    color: #fff;
    line-height: 1.25;
  }

  .describe {
    margin-top: 3px;
    font-size: 14px;
    font-weight: 800;
    color: @gold;
    line-height: 1.2;
  }

  .claim-status {
    margin-top: 2px;
    font-size: 10px;
    color: #c9b4e8;

    &.is-ready {
      color: #ffd467;
      font-weight: 700;
    }

    &.is-done {
      color: #9b86c9;
    }
  }
}

/* ===== 图二 Level 列表 ===== */
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
  gap: 8px;
}

.lv-item {
  display: flex;
  gap: 8px;
  align-items: stretch;
}

.lv-track {
  width: 16px;
  flex-shrink: 0;
  position: relative;
  align-self: stretch;
  padding-top: 28px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 36px;
    bottom: -40px;
    width: 2px;
    margin-left: -1px;
    background: linear-gradient(
      180deg,
      #9b3dff 0%,
      rgba(116, 0, 174, 0.35) 100%
    );
  }
}

.lv-item:last-child .lv-track::after {
  display: none;
}

.lv-dot {
  width: 16px;
  height: 16px;
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
    background: linear-gradient(180deg, #ffe27a 0%, #e8a820 100%);
    box-shadow: 0 0 8px rgba(255, 200, 60, 0.55);
  }

  &.is-locked {
    background: #411c59;
    border: 1px solid #411c59;

    .lv-dot-lock {
      font-size: 9px;
      color: #fff;
    }
  }
}

.lv-card {
  flex: 1;
  min-width: 0;
  border-radius: 14px;
  background: #411c59;
  border: 1px solid #411c59;
  box-sizing: border-box;
  overflow: hidden;
  cursor: pointer;

  &.is-current {
    position: relative;
    border: none;
    background: linear-gradient(135deg, #7a2fd0 0%, #3b1490 45%, #24105a 100%);
    box-shadow: 0 0 14px rgba(180, 80, 255, 0.35);

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 14px;
      padding: 1.5px;
      background: linear-gradient(180deg, #ffe27a 0%, #ffb000 100%);
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
  }

  &.is-locked {
    background: #411c59;
    border-color: #411c59;
  }
}

.lv-card-body {
  position: relative;
  z-index: 1;
  display: flex;
  gap: 8px;
  padding: 12px 10px 12px 8px;
}

.lv-card-badge {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  object-fit: contain;
  align-self: flex-start;

  &.is-dim {
    opacity: 0.7;
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
  gap: 8px;
  min-width: 0;
}

.lv-card-level {
  flex-shrink: 0;
  font-size: 16px;
  font-weight: 800;
  line-height: 1;
  color: #fff;
}

.lv-card.is-current .lv-card-level {
  color: @gold;
}

.lv-card-tag {
  flex-shrink: 0;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 10px;
  font-weight: 700;
  line-height: 12px;
  white-space: nowrap;

  &.is-current {
    background: linear-gradient(180deg, #ffe27a 0%, #e8a820 100%);
    color: #1a1208;
  }

  &.is-achieved {
    background: linear-gradient(180deg, #b68063 0%, #f8d7a4 50%, #b68063 100%);
    color: #1a1408;
  }

  &.is-locked {
    background: rgba(255, 255, 255, 0.88);
    color: #333;
  }
}

.lv-card-exp {
  width: 100%;
  margin-bottom: 4px;
  font-size: 11px;
  line-height: 14px;
  color: #c9b4e8;

  .exp-cur {
    color: #fff;
    font-weight: 700;
  }
}

.lv-card-unlock {
  width: 100%;
  margin-bottom: 4px;
  font-size: 11px;
  line-height: 14px;
  font-weight: 600;
  color: @gold;
}

.lv-card-progress {
  height: 6px;
  margin: 0 0 8px;
  background: rgba(10, 4, 24, 0.55);
  border-radius: 999px;
  overflow: hidden;
}

.lv-card-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffe27a 0%, #ffb000 100%);
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
  border-right: 1px solid #b492fd;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    border-right: none;
  }
}

.lv-benefit-label {
  font-size: 9px;
  color: #b8a8d4;
  white-space: nowrap;
}

.lv-benefit-val {
  margin-top: 2px;
  font-size: 11px;
  font-weight: 700;
  color: @gold;
  white-space: nowrap;
}

@media (min-width: 769px) {
  .vip-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
