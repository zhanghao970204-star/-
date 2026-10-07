<template>
  <div class="rc-page">
    <!-- 图一：WALLET 头图 + 金额卡 + Pay；支付渠道在图二弹层选择 -->
    <div class="RechargeCont-cont">
      <section class="rc-wallet">
        <img
          class="rc-wallet__bg"
          src="../../assets/img/recharge/wupeng.png"
          alt=""
        />
        <div class="rc-wallet__inner">
          <h2 class="rc-wallet__title">WALLET</h2>
          <div class="rc-wallet__actions">
            <button
              type="button"
              class="rc-wallet__btn btn-press"
              @click="goToRecord"
            >
              <div
                style="
                  border-radius: 999px;
                  border: 1px solid #8b57d5;
                  background: #280d4e;
                  padding: 3px;
                "
              >
                <img :src="imgHistory" alt="" />
              </div>
              <span>{{ $lang.rp_history || "History" }}</span>
            </button>
            <button
              type="button"
              class="rc-wallet__btn btn-press"
              @click="$jumpTo('/Support')"
            >
              <div
                style="
                  border-radius: 999px;
                  border: 1px solid #8b57d5;
                  background: #280d4e;
                  padding: 3px;
                "
              >
                <img :src="imgContact" alt="" />
              </div>
              <span>{{ $lang.common_txt22 }}</span>
            </button>
          </div>
        </div>
      </section>

      <div class="rc-section-head">
        <p class="rc-section-head__title">{{ $lang.common_txt308 }}</p>
      </div>

      <div class="amount-box-list">
        <div
          class="amount-card"
          v-for="(item, index) in dataList"
          :key="index"
          :class="{ active: index === selectAmountIndex || item.isActive }"
          @click="selectAmount(index, item)"
        >
          <img
            class="amount-card__bg"
            :src="
              index === selectAmountIndex || item.isActive
                ? imgCardActive
                : imgCard
            "
            alt=""
          />
          <span
            v-if="showActivityBonus && item.bonus"
            class="amount-card__ribbon"
          >
            <img class="amount-card__ribbon-bg" :src="imgRibbon" alt="" />
            <em>+{{ $formatNumberWithCommas(item.bonus) }}</em>
          </span>
          <img class="amount-card__coin" :src="coinSrc(index)" alt="" />
          <div class="amount-card__price">
            <img class="amount-card__price-bg" :src="imgPriceBg" alt="" />
            <span>$ {{ $formatNumberWithCommas(item.amount) }}</span>
          </div>
        </div>
      </div>

      <p class="rc-hint">{{ $lang.common_txt311 }} {{ displayMinAmount }}</p>
      <van-field
        v-model="amount"
        :placeholder="$lang.common_txt143"
        class="custom-field m-t-5 rc-amount-field"
        type="number"
        @input="handleInput"
        @focus="focus = true"
        @blur="focus = false"
      >
        <template #left-icon>
          <div class="d-flex">
            <span class="rc-field-currency">{{
              paymentList.length > 0 &&
              paymentList[selectIndex] &&
              paymentList[selectIndex].paymentId !== "USDT"
                ? getCurrency
                : "U"
            }}</span>
            <span class="rc-field-divider">|</span>
          </div>
        </template>
      </van-field>

      <div class="rc-bonus-panel">
        <div
          v-if="showRechargeActivity"
          class="rc-activity-row"
          :class="{ 'is-active': agree }"
          @click="agree = !agree"
        >
          <img
            class="rc-activity-row__icon"
            :src="agree ? imgCheck : imgUncheck"
            alt=""
          />
          <p
            v-if="promoCode === 'first_recharge_new_1'"
            class="rc-activity-row__text"
          >
            {{ $lang.RechargeCont_txt6 }} {{ getCurrency
            }}{{ activityBonusSample }}
          </p>
          <p
            v-else-if="promoCode === 'first_recharge_new_2'"
            class="rc-activity-row__text"
          >
            {{ $lang.RechargeCont_txt7 }}
          </p>
          <p v-else class="rc-activity-row__text">{{ activityBannerText }}</p>
        </div>
        <p class="rc-vip-row" @click="$jumpTo('/vipLevels')">
          <img class="rc-vip-badge" :src="vipPairIconSrc" alt="" />
          <span class="rc-vip-text">VIP {{ InitDate.vipLevel || 0 }}</span>
          <span class="rc-vip-desc m-l-5">{{ $lang.common_txt312 }}</span>
          <span class="rc-vip-link">{{ $lang.common_txt309 }}</span>
        </p>
        <div class="rc-total-card">
          <span class="rc-total-card__label">{{ $lang.common_txt313 }}</span>
          <span class="rc-total-card__val">{{
            $formatNumberWithCommas(totalMount)
          }}</span>
        </div>
      </div>

      <div class="t-c rc-submit-wrap">
        <button
          type="button"
          class="rc-pay-btn"
          :disabled="isLoading"
          @click="openConfirmPay"
        >
          <span
            v-if="showActivityBonus && currentBonus > 0"
            class="rc-pay-btn__badge"
          >
            +{{ $formatNumberWithCommas(currentBonus) }}
          </span>
          {{ $lang.common_txt314 }} {{ getCurrency }} {{ amount }}
        </button>
      </div>

      <div v-if="paymentKey !== 'usdt'" class="rc-account-block">
        <div class="rc-account-row">
          <img :src="GET_ICONURL" width="25" />
          <span class="rc-account-row__code">{{ GET_AREACODE }}</span>
          <span>{{ account }}</span>
        </div>
      </div>

      <div class="rc-divider-row">
        <img :src="imgLineL" height="2" width="28%" />
        <p>{{ $lang.common_txt317 }}</p>
        <img :src="imgLineR" height="2" width="28%" />
      </div>
      <div v-html="$lang.common_txt30" class="l-h-20 rc-footer-note"></div>
    </div>

    <!-- 图二：选择支付类型 / 方式 + 订单金额 -->
    <van-popup
      v-model:show="confirmShow"
      position="center"
      round
      class="rc-confirm"
      :close-on-click-overlay="true"
    >
      <div class="rc-confirm__head">
        {{ $lang.common_txt363 }}
        <button
          type="button"
          class="rc-confirm__close"
          @click="confirmShow = false"
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
      <div class="rc-confirm__body">
        <p v-if="payTypeList.length" class="rc-confirm__label">
          {{ $lang.rc_select_channel || "Select Channel" }}
        </p>
        <div v-if="payTypeList.length" class="rc-confirm__grid">
          <div
            v-for="(item, index) in payTypeList"
            :key="'pt-' + (item.paymentId || index)"
            class="rc-confirm__chip"
            :class="{ 'is-active': selectPayTypeIndex === index }"
            @click="selectPayType(index)"
          >
            <img
              class="rc-confirm__chip-bg"
              :src="selectPayTypeIndex === index ? imgChipOn : imgChipOff"
              alt=""
            />
            <img
              class="rc-confirm__chip-icon"
              :src="item.typeIcon || item.paymentIcon"
              alt=""
            />
            <img
              class="rc-confirm__chip-line"
              :src="
                selectPayTypeIndex === index ? imgChipLineOn : imgChipLineOff
              "
              alt=""
            />
            <span>{{ item.typeName }}</span>
          </div>
        </div>

        <p class="rc-confirm__label">
          {{ $lang.rc_select_method || "Select Payment Method" }}
        </p>
        <div class="rc-confirm__grid">
          <div
            v-for="(item, index) in paymentList"
            :key="'pm-' + index"
            class="rc-confirm__chip"
            :class="{ 'is-active': selectIndex === index }"
            @click="tabIndex(index)"
          >
            <img
              class="rc-confirm__chip-bg"
              :src="selectIndex === index ? imgChipOn : imgChipOff"
              alt=""
            />
            <img
              class="rc-confirm__chip-icon"
              :src="item.paymentIconUrl"
              alt=""
            />
            <img
              class="rc-confirm__chip-line"
              :src="selectIndex === index ? imgChipLineOn : imgChipLineOff"
              alt=""
            />
            <span>{{ item.paymentName }}</span>
          </div>
        </div>

        <div
          v-if="
            paymentList.length > 0 &&
            paymentList[selectIndex] &&
            paymentList[selectIndex].paymentId === 'USDT'
          "
          class="rc-wl-list"
        >
          <div
            v-for="(item, index) in ['Tron(TRC20)', 'Ethereum(ERC20)']"
            :key="'wl-' + index"
            class="rc-wl-item"
            :class="{ 'active-type2': selectWl === index }"
            @click="getSelectWl(index)"
          >
            {{ item }}
          </div>
        </div>

        <p class="rc-confirm__label">
          {{ $lang.rc_confirm_order || "Confirm Order" }}
        </p>
        <div class="rc-confirm__order">
          <div class="rc-confirm__row">
            <span>{{ $lang.common_txt143 || "Amount" }}</span>
            <em
              >{{ getCurrency }} {{ $formatNumberWithCommas(amount || 0) }}</em
            >
          </div>
          <div class="rc-confirm__row">
            <span>{{ $lang.rc_bonus || "Bonus" }}</span>
            <em>+{{ $formatNumberWithCommas(currentBonus) }}</em>
          </div>
          <div class="rc-confirm__row">
            <span>{{ $lang.common_txt313 }}</span>
            <em>{{ $formatNumberWithCommas(totalMount) }}</em>
          </div>
        </div>

        <button
          type="button"
          class="rc-confirm__pay"
          :disabled="isLoading"
          @click="submit"
        >
          {{ $lang.rc_confirm_pay || "CONFIRM & PAY" }}
        </button>
      </div>
    </van-popup>

    <van-popup
      v-model:show="orangShow"
      closeable
      close-icon-position="top-right"
      class="rc-popup"
    >
      <div>
        <div class="rc-popup__title">
          {{ $lang.common_txt363 }}
        </div>
        <div class="rc-popup__body">
          <div style="display: inline-block">
            <span v-html="$lang.common_txt365"></span>
            <span class="info-color">{{ awardRules }}{{ amount }}#</span>
            <span v-html="$lang.common_txt368"></span>
          </div>
          <p class="m-t-10 info-color t-c">
            <span>{{ $lang.common_txt366 }}</span>
            {{ amount }} <span>{{ $lang.common_txt367 }}</span>
          </p>
        </div>

        <van-field
          v-model="uLine"
          class="custom-field m-t-10"
          type="number"
          :placeholder="$lang.common_txt364"
          :maxlength="6"
        >
        </van-field>
        <van-button
          @click="submit"
          size="large"
          class="custom-button f-t-18 m-t-20 rc-submit-btn"
        >
          {{ $lang.Confirmar }}
        </van-button>
      </div>
    </van-popup>
    <van-popup
      v-model:show="payInfoShow"
      closeable
      close-icon-position="top-right"
      class="rc-popup"
    >
      <div>
        <div class="rc-popup__pay-head">
          <img :src="paymentIconUrl" class="rc-popup__pay-icon" alt="" />
          <span>{{ paymentName }}</span>
        </div>
        <div class="rc-popup__body">
          <p class="info-color">
            {{ $lang.common_txt370 }} {{ paymentName }}
            {{ $lang.common_txt374 }}
          </p>
          <p v-html="$lang.common_txt371"></p>
          <p v-html="$lang.common_txt372"></p>
          <p class="rc-popup__muted">{{ $lang.common_txt373 }}</p>
        </div>
        <van-button
          @click="payInfoShow = false"
          size="large"
          class="custom-button f-t-18 m-t-20 rc-submit-btn"
        >
          {{ $lang.Confirmar }}
        </van-button>
      </div>
    </van-popup>
    <van-overlay :show="showOverlay" class="full-screen-overlay">
      <div class="loading-container">
        <van-loading size="30" vertical color="var(--wihte-color)">{{
          $lang.common_txt67
        }}</van-loading>
      </div>
    </van-overlay>
    <service-popup
      v-model="showPayIframe"
      :srcValue="payIframeUrl"
      popupHeight="90vh"
    ></service-popup>
  </div>
</template>

<script>
import {
  Init,
  Pay,
  GetIsFbReport,
  VnRechargeInitS,
  RefreshExchangeRate,
} from "@/api/common";
import {
  isUsPayRedirect,
  openUsPayBlankWindow,
  goPayUrl,
  closePayWindow,
} from "@/utils/payRedirect";
import { fetchCsUrl, openCustomerService } from "@/utils/csLink";

const vipPairModules = import.meta.glob("@/assets/img/vip/*_*.png", {
  eager: true,
  import: "default",
});

function resolveVipPairIcon(level) {
  const lv = Math.max(0, Number(level) || 0);
  const start = lv <= 0 ? 1 : Math.floor((lv - 1) / 2) * 2 + 1;
  const clampedStart = Math.min(start, 13);
  const name = `${clampedStart}_${clampedStart + 1}.png`;
  const hit = Object.keys(vipPairModules).find((k) => k.endsWith(`/${name}`));
  if (hit) return vipPairModules[hit];
  const fallback = Object.keys(vipPairModules).find((k) =>
    k.endsWith("/1_2.png"),
  );
  return fallback ? vipPairModules[fallback] : "";
}

function rcAsset(name) {
  return new URL(`../../assets/img/recharge/${name}`, import.meta.url).href;
}

const AMOUNT_COIN_IMGS = [
  rcAsset("image 23424.png"),
  rcAsset("image 23424 (1).png"),
  rcAsset("image 23424 (2).png"),
  rcAsset("image 23424 (3).png"),
  rcAsset("image 23424 (4).png"),
  rcAsset("image 23424 (5).png"),
  rcAsset("image 23424 (6).png"),
  rcAsset("image 23424 (7).png"),
];
const IMG_HISTORY = rcAsset("0fb7527a-9065-4851-ae85-9e675d0f3397 1.png");
const IMG_CONTACT = rcAsset("55cd8f0e-6e58-4776-98b2-fefc18f36364 2.png");
const IMG_RIBBON = rcAsset("image 23425.png");
const IMG_PRICE_BG = rcAsset("Rectangle 34626414.png");
const IMG_CHECK = rcAsset("image 23135.png");
const IMG_UNCHECK = rcAsset("Ellipse 346.png");
const IMG_CARD = rcAsset("Rectangle 34626420 (1).png");
const IMG_CARD_ACTIVE = rcAsset("Rectangle 34626420.png");
const IMG_LINE_L = rcAsset("Rectangle 133.png");
const IMG_LINE_R = rcAsset("Rectangle 34626426.png");
const IMG_CHIP_ON = rcAsset("Rectangle 480.png");
const IMG_CHIP_OFF = rcAsset("Rectangle 34626424.png");

export default {
  name: "RechargeCont",
  data() {
    return {
      paymentName: "",
      uLine: "",
      showOverlay: false, // 控制遮罩层的显示与隐藏
      showBg: false,
      isLoading: false,
      agree: false,
      selectIndex: 0,
      selectAmountIndex: null,
      amount: "",
      focus: false,
      dataList: [],
      paymentType: "",
      paymentKey: "",
      paymentId: "",
      rechargeFees: 0,
      visible: false,
      paymentList: [],
      allPaymentList: [],
      payTypeList: [],
      selectPayTypeIndex: 0,
      activities: [],
      firstRecharge: false,
      selectWl: 0,
      exchRate: 0, //汇率
      blance: 0,
      minAmount: 0,
      InitDate: {},
      totalMount: 0,
      account: "",
      orangShow: false,
      confirmShow: false,
      awardRules: "",
      payInfoShow: false,
      paymentIconUrl: "",
      csUrl: "",
      showPayIframe: false,
      payIframeUrl: "",
      imgHistory: IMG_HISTORY,
      imgContact: IMG_CONTACT,
      imgRibbon: IMG_RIBBON,
      imgPriceBg: IMG_PRICE_BG,
      imgCheck: IMG_CHECK,
      imgUncheck: IMG_UNCHECK,
      imgCard: IMG_CARD,
      imgCardActive: IMG_CARD_ACTIVE,
      imgLineL: IMG_LINE_L,
      imgLineR: IMG_LINE_R,
      imgChipOn: IMG_CHIP_ON,
      imgChipOff: IMG_CHIP_OFF,
      imgChipLineOn: IMG_LINE_L,
      imgChipLineOff: IMG_LINE_R,
    };
  },
  watch: {
    // 仅在支付列表整体替换时重置（勿 deep，否则改 quickSelect 会把选中打回第 0 项）
    paymentList() {
      if (this.paymentList.length > 0) {
        this.tabIndex(0);
        if (
          this.paymentList[0].quickSelect &&
          this.paymentList[0].quickSelect.length > 1
        ) {
          this.selectAmount(1, this.paymentList[0].quickSelect[1]);
          this.amount = this.paymentList[0].quickSelect[1].amount;
        } else if (
          this.paymentList[0].quickSelect &&
          this.paymentList[0].quickSelect.length > 0
        ) {
          this.selectAmount(0, this.paymentList[0].quickSelect[0]);
          this.amount = this.paymentList[0].quickSelect[0].amount;
        }
        if (this.paymentList[0].paymentId === "USDT") {
          this.RefreshExchangeRate();
        }
        if (this.showRechargeActivity) {
          this.agree = true;
        }
      }
    },
    showPayIframe(v) {
      if (!v) this.payIframeUrl = "";
    },
    agree() {
      if (
        this.selectAmountIndex != null &&
        this.dataList[this.selectAmountIndex]
      ) {
        this.selectAmount(
          this.selectAmountIndex,
          this.dataList[this.selectAmountIndex],
        );
        return;
      }
      const active = this.dataList.find((item) => item.isActive);
      if (active) {
        const index = this.dataList.indexOf(active);
        this.selectAmount(index, active);
        return;
      }
      if (this.amount) {
        this.handleInput(this.amount);
      }
    },
  },
  computed: {
    TotalHl() {
      return this.amount * this.exchRate;
    },
    displayMinAmount() {
      const n = Number(this.minAmount);
      if (!isFinite(n) || n <= 0) return this.minAmount || "";
      return this.$formatNumberWithCommas ? this.$formatNumberWithCommas(n) : n;
    },
    vipPairIconSrc() {
      return resolveVipPairIcon(this.InitDate.vipLevel);
    },
    payNoticeClass() {
      const len = this.paymentList.length;
      if (!len) return "";
      if (len === 1 || this.selectIndex === 0) return "is-attach-left";
      if (this.selectIndex === len - 1) return "is-attach-right";
      return "is-attach-mid";
    },
    promoCode() {
      if (this.activities.length > 0) {
        return this.activities[0].code || "";
      }
      if (this.firstRecharge) return "first_recharge_new_1";
      if (this.hasPromoBonus) return "first_recharge_new_2";
      return "";
    },
    hasPromoBonus() {
      return this.dataList.some((item) => parseFloat(item.bonus) > 0);
    },
    showRechargeActivity() {
      return (
        this.activities.length > 0 || this.firstRecharge || this.hasPromoBonus
      );
    },
    showActivityBonus() {
      return !this.showRechargeActivity || this.agree;
    },
    activityBonusSample() {
      const item = this.dataList.find((row) => parseFloat(row.bonus) > 0);
      if (!item) return "";
      return this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(item.bonus)
        : item.bonus;
    },
    activityBannerText() {
      if (this.promoCode === "first_recharge_new_2") {
        return this.$lang.RechargeCont_txt7;
      }
      if (this.promoCode === "first_recharge_new_1") {
        const sample = this.dataList.find((item) => parseFloat(item.bonus) > 0);
        const bonus = sample ? this.$formatNumberWithCommas(sample.bonus) : "";
        return `${this.$lang.RechargeCont_txt6} ${this.getCurrency}${bonus}`;
      }
      return this.$lang.rc_first_deposit_bonus || "First Deposit Bonus";
    },
    currentBonus() {
      if (!this.showActivityBonus) return 0;
      const row =
        this.selectAmountIndex != null
          ? this.dataList[this.selectAmountIndex]
          : null;
      if (row && row.bonus) return this.truncateTo2(row.bonus);
      const amt = this.truncateTo2(this.amount);
      const total = this.truncateTo2(this.totalMount);
      return total > amt ? this.truncateTo2(total - amt) : 0;
    },
  },
  mounted() {
    if (this.token) {
      this.VnRechargeInitS();
      this.Init();
      this.prefetchCsUrl();
    }
  },
  methods: {
    coinSrc(index) {
      const list = AMOUNT_COIN_IMGS;
      return list[index] || list[list.length - 1];
    },
    openConfirmPay() {
      if (!this.amount || Number(this.amount) <= 0) {
        this.$toast({
          message: this.$lang.RechargeCont_txt8 || this.$lang.common_txt143,
          icon: "cross",
        });
        return;
      }
      const keepAmount = this.amount;
      const keepIdx = this.selectAmountIndex;
      // 默认第一种支付类型 / 方式（不改动原 Pay 逻辑）
      if (this.payTypeList.length && this.selectPayTypeIndex !== 0) {
        this.selectPayTypeIndex = 0;
        this.applyPayTypeFilter();
      } else if (this.paymentList.length && this.selectIndex !== 0) {
        this.tabIndex(0);
      } else if (!this.paymentList.length) {
        this.selectPayTypeIndex = 0;
        this.applyPayTypeFilter();
      }
      this.$nextTick(() => {
        if (keepIdx != null && this.dataList[keepIdx]) {
          this.selectAmount(keepIdx, this.dataList[keepIdx]);
        } else if (keepAmount) {
          this.amount = keepAmount;
          this.handleInput(keepAmount);
        }
      });
      this.confirmShow = true;
    },
    goToRecord() {
      this.$jumpTo("/recordOrder");
    },
    async prefetchCsUrl() {
      try {
        this.csUrl = (await fetchCsUrl("floating")) || "";
      } catch (e) {
        this.csUrl = "";
      }
    },
    openTgCustomerService() {
      openCustomerService({ url: this.csUrl, scene: "floating" }).then((ok) => {
        // 打开成功后刷新预取，避免链接过期
        if (ok) this.prefetchCsUrl();
      });
    },
    onCsDescClick(e) {
      const el = e && e.target;
      if (el && el.closest && el.closest(".js-cs-link")) {
        this.openTgCustomerService();
      }
    },
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.InitDate = data.content;
      }
    },
    goLeft() {
      this.$router.go(-1);
    },
    async RefreshExchangeRate() {
      const data = await RefreshExchangeRate({
        exccType: "USDT",
        rwType: "r",
      });
      if (data.status === "ok") {
        this.exchRate = data.content.exchRate;
      }
    },
    getSelectWl(i) {
      this.selectWl = i;
    },
    goToRechage() {
      this.$jumpTo("/recordOrder");
    },
    goBack() {
      this.visible = false;
    },
    async VnRechargeInitS() {
      const data = await VnRechargeInitS();
      if (data.status === "ok") {
        this.allPaymentList = data.content.paymentList || [];
        this.payTypeList = data.content.payTypeList || [];
        this.selectPayTypeIndex = 0;
        this.applyPayTypeFilter();
        this.activities = data.content.activities || [];
        this.firstRecharge = data.content.firstRecharge === true;
        this.blance = data.content._balUsable;
        this.account = data.content._account;
        this.$nextTick(() => {
          if (this.showRechargeActivity) {
            this.agree = true;
          }
        });
      }
    },
    async GetIsFbReport(v) {
      const data = await GetIsFbReport({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.isReport) {
          if (data.content.target === "ks") {
            window.kwaiq.load(data.content.fbPixId);
            window.kwaiq.instance(data.content.fbPixId).track("addToCart", {
              value: parseInt(v * 0.1),
              currency: "NGN",
            });

            console.log("add_to_cart");
          } else {
            this.$pixel.setFbId(data.content.fbPixId);
            this.$pixel.callTrackHasPara("track", "AddToCart", v * 0.1, "NGN"); // 上报
            const jsonData = `"""{"data":[{"event_name": "Lead","content_name": "Recharge Form","value": ${parseInt(
              v * 0.1,
            )},"currency": "NGN"}]}"""`;
            this.$pixel.sendEventToAndroid(jsonData);
          }
        }
      }
    },
    async submit() {
      if (
        this.paymentList.length > 0 &&
        this.paymentKey === "orange" &&
        !this.orangShow &&
        this.GET_PLATFORM !== "cgbet"
      ) {
        this.orangShow = true;
        return;
      }
      if (this.orangShow) {
        if (this.uLine.length < 6) {
          this.$toast({
            message: this.$lang.common_txt375,
            icon: "cross",
          });
          return;
        }
      }
      this.isLoading = true;
      this.showOverlay = true;
      // 修复：添加长度判断，避免数组越界
      if (
        this.paymentList.length > 0 &&
        this.paymentList[this.selectIndex].paymentId === "USDT"
      ) {
        if (this.selectWl === 0) {
          this.uLine = "TRON";
        } else if (this.selectWl === 1) {
          this.uLine = "ETH";
        }
      }
      const isUsRedirect = isUsPayRedirect();
      const openPayTab =
        isUsRedirect &&
        this.paymentList.length > 0 &&
        this.paymentKey !== "usdt";
      let payWin = null;
      if (openPayTab) {
        payWin = openUsPayBlankWindow();
      }
      const data = await Pay({
        paymentAmount: this.amount,
        paymentId: this.paymentId,
        paymentKey: this.paymentKey,
        paymentType: this.paymentType,
        rechargeFees: this.rechargeFees,
        uLine: this.uLine,
        phone: this.account,
        promoType:
          this.showRechargeActivity && this.agree
            ? this.promoCode || "first_recharge_new_1"
            : null,
      });
      if (data.status === "ok") {
        this.orangShow = false;
        this.confirmShow = false;
        this.GetIsFbReport(this.amount);
        const payUrl = data.content && data.content.url;
        if (this.paymentList.length > 0 && this.paymentKey === "usdt") {
          closePayWindow(payWin);
          let obj = {
            orderNo: data.content.orderNo,
            paymentAmount: data.content.paymentAmount,
            paymentId: data.content.paymentId,
            url: payUrl,
            wlType: this.selectWl === 0 ? "TRC20" : "ERC20",
          };
          if (!sessionStorage.getItem("payOrderData")) {
            sessionStorage.setItem("payOrderData", JSON.stringify(obj));
          } else if (
            JSON.parse(sessionStorage.getItem("payOrderData")).orderNo !==
            data.content.orderNo
          ) {
            sessionStorage.setItem("payOrderData", JSON.stringify(obj));
          }
          this.$jumpTo("/payOrder");
        } else if (payUrl) {
          if (isUsRedirect) {
            goPayUrl(payWin, payUrl);
          } else {
            closePayWindow(payWin);
            this.payIframeUrl = payUrl;
            this.showPayIframe = true;
          }
        } else if (
          this.paymentList.length > 0 &&
          !["usdt", "wave", "orange"].includes(this.paymentKey)
        ) {
          closePayWindow(payWin);
          this.payInfoShow = true;
        } else {
          closePayWindow(payWin);
        }
      } else {
        closePayWindow(payWin);
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
      this.isLoading = false;
      this.showOverlay = false;
    },
    selectPayType(i) {
      if (this.selectPayTypeIndex === i) return;
      this.selectPayTypeIndex = i;
      this.applyPayTypeFilter();
    },
    applyPayTypeFilter() {
      const type = this.payTypeList[this.selectPayTypeIndex];
      if (!type || !this.payTypeList.length) {
        this.paymentList = this.allPaymentList;
        return;
      }
      this.paymentList = this.allPaymentList.filter(
        (p) => String(p.paymentId) === String(type.paymentId),
      );
    },
    tabIndex(i) {
      if (!this.paymentList[i]) return;
      const pay = this.paymentList[i] || {};
      const rawMin =
        pay.minAmount ??
        pay.minimumAmount ??
        pay.miniAmount ??
        pay.minDeposit ??
        pay.minimum;
      this.minAmount = rawMin != null && rawMin !== "" ? rawMin : 0;
      this.selectIndex = i;
      this.dataList = this.paymentList[i].quickSelect || [];
      this.dataList.forEach((item) => {
        item.isActive = false;
      });
      this.paymentId = this.paymentList[i].paymentId;
      this.paymentKey = this.paymentList[i].paymentKey;
      this.paymentType = this.paymentList[i].paymentType;
      this.rechargeFees = this.paymentList[i].rechargeFees;
      this.awardRules = this.paymentList[i].awardRules;
      this.paymentIconUrl = this.paymentList[i].paymentIconUrl;
      this.paymentName = this.paymentList[i].paymentName;
      // 如果切换到USDT支付方式，刷新汇率
      if (this.paymentList[i].paymentId === "USDT") {
        this.RefreshExchangeRate();
      }
      this.$nextTick(() => {
        const tabs = this.$el && this.$el.querySelector(".rc-pay-tabs");
        const active = tabs && tabs.querySelector(".rc-pay-tab.active-type");
        if (active && active.scrollIntoView) {
          const last = i === this.paymentList.length - 1;
          const first = i === 0;
          active.scrollIntoView({
            behavior: "smooth",
            inline: last ? "end" : first ? "start" : "center",
            block: "nearest",
          });
        }
      });
    },
    // 截取到小数点后两位（不四舍五入）
    truncateTo2(val) {
      const n = Number(val);
      if (!isFinite(n) || n === 0) return 0;
      const sign = n < 0 ? -1 : 1;
      const [integer, decimal = ""] = String(Math.abs(n)).split(".");
      const truncated = decimal ? `${integer}.${decimal.slice(0, 2)}` : integer;
      return sign * Number(truncated);
    },
    selectAmount(i, v) {
      this.dataList.forEach((item, idx) => {
        item.isActive = idx === i;
      });
      this.selectAmountIndex = i;
      this.amount = v.amount;
      const amount = this.truncateTo2(v.amount);
      this.totalMount =
        this.showActivityBonus && v.bonus
          ? this.truncateTo2(amount + this.truncateTo2(v.bonus))
          : amount;
    },
    handleInput(i) {
      let matchedBonus = 0;
      let matchedIndex = null;
      const inputAmount = this.truncateTo2(i);
      this.dataList.forEach((item, index) => {
        const matched = this.truncateTo2(item.amount) === inputAmount;
        item.isActive = matched;
        if (matched) {
          matchedIndex = index;
          if (this.showActivityBonus && item.bonus) {
            matchedBonus = this.truncateTo2(item.bonus);
          }
        }
      });
      this.selectAmountIndex = matchedIndex;
      this.totalMount =
        this.showActivityBonus && matchedBonus
          ? this.truncateTo2(inputAmount + matchedBonus)
          : inputAmount || 0;
    },
  },
};
</script>

<style lang="less" scoped>
/* 图一 / 图二：紫金钱包充值 */
@page-bg: #15031d;
@panel: #4b0e5d;
@panel-soft: #512275;
@gold: #ffd404;
@muted: #d7a2fa;
@green: #12c27a;
@green-deep: #0a8f56;

.rc-page {
  min-height: 100vh;
  color: #fff;
  padding-bottom: 100px;
  box-sizing: border-box;
}

.RechargeCont-cont {
  padding: 8px 12px 24px;
  box-sizing: border-box;
}

.rc-wallet {
  position: relative;
  margin: 0 -4px 8px;
  overflow: hidden;

  &__bg {
    display: block;
    width: 100%;
    height: auto;
    vertical-align: top;
  }

  /* 6 瓣波浪：标题占左，History / Contact 落在右两瓣 */
  &__inner {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    height: 72%;
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    align-items: center;
    box-sizing: border-box;
    padding: 0 2% 0 3%;
  }

  &__title {
    grid-column: 1 / 5;
    margin: 0;
    padding-left: 6px;
    font-size: 24px;
    font-weight: 800;
    letter-spacing: 0.6px;
    color: #fff;
    text-shadow: 0 3px 0 rgba(90, 40, 160, 0.45);
    line-height: 1;
  }

  &__actions {
    grid-column: 5 / 7;
    display: grid;
    grid-template-columns: 1fr 1fr;
    align-items: center;
    justify-items: center;
    background: none;
    padding: 0;
    gap: 0;
  }

  &__btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 2px;
    width: 100%;
    padding: 0;
    border: none;
    border-radius: 0;
    background: transparent;
    color: @gold;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    box-shadow: none;

    img {
      width: 28px;
      height: 28px;
      object-fit: contain;
      display: block;
    }
  }
}

.rc-section-head {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 0 16px;

  &__title {
    margin: 10px 0 5px;
    font-size: 15px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2px;
  }
}

.amount-box-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px 10px;
}

.amount-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 134px;
  min-height: 134px;
  box-sizing: border-box;
  border-radius: 16px;
  background: transparent;
  border: none;
  cursor: pointer;
  overflow: visible;

  &.active {
    z-index: 2;
    padding-bottom: 38px;
  }

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
    z-index: 0;
    pointer-events: none;
    border-radius: 16px;
  }

  /* 整张高亮图放大，中间和未选中一样大；不裁圆角，四角用图片自带透明 */
  &.active &__bg {
    inset: auto;
    left: 50%;
    top: 50%;
    width: calc(100% * 187 / 158);
    height: calc(100% * 222 / 192);
    transform: translate(-50%, -50%);
    border-radius: 0;
  }

  &__ribbon {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 6;
    width: 100%;
    min-height: 27px;
    display: flex;
    align-items: center;
    justify-content: center;

    em {
      position: relative;
      z-index: 1;
      font-style: normal;
      font-size: 14px;
      font-weight: 800;
      color: #fff;
      line-height: 1;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.35);
    }
  }

  &__ribbon-bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  &__coin {
    position: relative;
    z-index: 2;
    width: 72px;
    height: 72px;
    object-fit: contain;
    margin: 8px 0 10px;
  }

  &__price {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 38px;
    display: flex;
    align-items: center;
    justify-content: center;

    span {
      position: relative;
      z-index: 1;
      font-size: 14px;
      font-weight: 800;
      color: #fff;
    }
  }

  &.active &__price {
    position: absolute;
    left: 50%;
    bottom: 2px;
    width: 96%;
    transform: translateX(-50%);
    height: 36px;
  }

  &__price-bg {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }
}

.rc-hint {
  color: @muted;
  margin: 12px 0 0;
  font-size: 13px;
}

.rc-amount-field {
  margin-top: 8px !important;
  height: 48px !important;
  background: #000 !important;
  border: none !important;
  border-radius: 25px !important;
  padding: 0 16px !important;
  box-sizing: border-box;

  &:focus-within {
    box-shadow: 0 0 0 1px #ffd400;
  }
}

.rc-field-currency {
  font-size: 15px;
  margin-right: 10px;
  color: #fff;
}

.rc-field-divider {
  margin-top: -3px;
  color: fade(#fff, 45%);
}

.rc-bonus-panel {
  margin: 12px 0 4px;
}

.rc-activity-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  padding: 8px 4px;
  cursor: pointer;

  &__icon {
    width: 22px;
    height: 22px;
    object-fit: contain;
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
    margin: 0;
    color: #fff;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 600;
  }
}

.rc-vip-row {
  margin: 6px 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  cursor: pointer;
  color: @gold;
  font-size: 13px;
  gap: 4px;
}

.rc-vip-badge {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  object-fit: contain;
  display: block;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

.rc-vip-text {
  font-size: 14px;
  font-weight: 800;
  color: @gold;
}

.rc-vip-desc {
  color: @gold;
  font-size: 12px;
}

.rc-vip-link {
  margin-left: auto;
  color: @gold;
  text-decoration: underline;
  font-size: 12px;
  font-weight: 700;
}

.rc-total-card {
  background: #0d0218;
  border-radius: 999px;
  padding: 12px 16px;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  &__label {
    color: #fff;
    font-size: 14px;
    font-weight: 700;
  }

  &__val {
    color: #fff;
    font-weight: 800;
    font-size: 16px;
  }
}

.rc-submit-wrap {
  margin: 16px 0 12px;
}

.rc-pay-btn {
  .btn-3d-green();
  position: relative;
  height: 50px;
  font-size: 16px;

  &__badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    min-width: 52px;
    padding: 2px 10px;
    border-radius: 8px;
    background: #e11d48;
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    line-height: 1.3;
  }
}

.rc-account-block {
  margin: 8px 0 4px;
}

.rc-account-row {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  gap: 6px;

  &__code {
    font-weight: bold;
    color: @muted;
  }
}

.rc-divider-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 18px;

  p {
    margin: 0 12px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
  }
}

.rc-footer-note {
  width: 96%;
  margin: 10px auto 0;
  color: @muted;
  font-size: 12px;
  line-height: 1.6;
}

.rc-wl-list {
  display: flex;
  margin: 8px 0 4px;
  gap: 8px;
}

.rc-wl-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f3f4f6;
  color: #333;
  cursor: pointer;
  font-size: 12px;
  font-weight: 700;
}

.active-type2 {
  color: #fff !important;
  background: linear-gradient(180deg, #ffb347 0%, #ff8a00 100%) !important;
}

/* 图二确认弹层 */
.rc-confirm {
  width: 88% !important;
  max-width: 360px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  overflow: hidden;
  border-radius: 18px !important;

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

  &__head {
    position: relative;
    background: @panel-soft;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: 800;
    padding: 14px 40px;
  }

  &__body {
    padding: 14px 14px 18px;
    background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  }

  &__label {
    margin: 10px 0 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 800;
  }

  &__grid {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  &__chip {
    position: relative;
    width: calc(33.33% - 7px);
    min-height: 78px;
    border-radius: 14px;
    background: transparent;
    box-shadow: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 4px;
    padding: 10px 6px 8px;
    box-sizing: border-box;
    cursor: pointer;
    color: #333;
    font-size: 11px;
    font-weight: 700;
    overflow: hidden;

    &-bg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: fill;
      z-index: 0;
      pointer-events: none;
    }

    &-icon {
      position: relative;
      z-index: 1;
      width: 28px;
      height: 22px;
      object-fit: contain;
    }

    &-line {
      position: relative;
      z-index: 1;
      width: 70%;
      height: 1px;
      object-fit: fill;
    }

    span {
      position: relative;
      z-index: 1;
    }

    &.is-active {
      background: transparent;
      color: #fff;
      box-shadow: none;
    }
  }

  &__order {
    margin-top: 4px;
    padding: 10px 12px;
    border-radius: 12px;
    background: #2c1137;
    border: 1px solid #9346a9;
  }

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 0;
    border-bottom: 1px dashed #9346a9;
    color: #fff;
    font-size: 13px;

    &:last-child {
      border-bottom: none;
    }

    em {
      font-style: normal;
      color: @gold;
      font-weight: 800;
    }
  }

  &__pay {
    .btn-3d-green();
    margin-top: 16px;
    font-size: 16px;
  }
}

.rc-submit-btn {
  width: 100%;
  height: 48px !important;
  background: linear-gradient(180deg, #3be59f 0%, #00b56a 100%) !important;
  color: #fff !important;
  border: none !important;
  border-radius: 24px !important;
  font-weight: 800 !important;
}

.full-screen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

:deep(.van-loading) {
  background-color: transparent !important;
  background: transparent !important;
}

:deep(.van-field__control) {
  color: #fff;
}

.rc-popup {
  background: @page-bg !important;
  width: 90%;
  border-radius: 12px !important;
  padding: 20px;
  border: 1px solid fade(@panel-soft, 45%);

  &__title {
    margin-top: 20px;
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    color: #fff;
  }

  &__pay-head {
    margin-top: 10px;
    font-size: 18px;
    text-align: center;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: #fff;
  }

  &__pay-icon {
    width: 36px;
    height: 24px;
    object-fit: contain;
    display: block;
  }

  &__body {
    line-height: 20px;
    margin-top: 10px;
    color: #fff;
  }

  &__muted {
    margin-top: 20px;
    color: @muted;
  }
}
</style>
