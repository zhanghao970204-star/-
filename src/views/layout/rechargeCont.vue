<template>
  <div class="rc-page">
    <div class="rc-header">
      <div class="rc-header__left">
        <van-icon
          @click="goLeft()"
          name="arrow-left"
          size="20"
          color="#ffe4b5"
        />
        <span class="rc-header__title">{{ $lang.Depósito }}</span>
        <div class="rc-header__balance">
          <img src="../../assets/img/otgame/amount.png" width="15" />
          <span>{{ blance }}</span>
        </div>
      </div>
      <p @click="goToRecord" class="rc-header__record">
        {{ $lang.common_txt256 }}
      </p>
    </div>

    <div class="RechargeCont-cont">
      <div v-if="payTypeList.length > 1" class="rc-pay-type">
        <div
          v-for="(item, index) in payTypeList"
          :key="item.paymentId || index"
          class="rc-pay-type__item"
          :class="{ 'is-active': selectPayTypeIndex === index }"
          @click="selectPayType(index)"
        >
          <img
            class="rc-pay-type__icon"
            :src="item.typeIcon || item.paymentIcon"
            alt=""
          />
          <span class="rc-pay-type__line"></span>
          <p class="rc-pay-type__name">{{ item.typeName }}</p>
        </div>
      </div>

      <div class="rc-section-head">
        <p class="rc-section-head__title">{{ $lang.common_txt308 }}</p>
        <p class="rc-section-head__link" @click="$jumpTo('/vipLevels')">
          {{ $lang.common_txt309 }}
        </p>
      </div>

      <div
        v-if="
          paymentList.length > 0 &&
          paymentList[selectIndex].paymentId === 'USDT'
        "
      >
        <div class="rc-wl-list">
          <div
            v-for="(item, index) in ['Tron(TRC20)', 'Ethereum(ERC20)']"
            :key="index"
            class="rc-wl-item"
            :class="{ 'active-type2': selectWl === index }"
            @click="getSelectWl(index)"
          >
            {{ item }}
          </div>
        </div>
      </div>

      <div class="amount-box-list d-flex-s">
        <div
          class="amount-box-list-item"
          v-for="(item, index) in dataList"
          :key="index"
          :class="{ active: index === selectAmountIndex || item.isActive }"
          @click="selectAmount(index, item)"
        >
          <div class="t-c">
            <span
              v-if="showActivityBonus && item.bonus"
              class="amount-bonus-badge"
              >+{{ $formatNumberWithCommas(item.bonus) }}</span
            >
            <span class="amount-box-list-item__val">
              {{ $formatNumberWithCommas(item.amount) }}</span
            >
          </div>
        </div>
      </div>

      <p class="rc-hint">{{ $lang.common_txt311 }} {{ displayMinAmount }}</p>
      <van-field
        v-model="amount"
        :placeholder="$lang.common_txt143"
        class="custom-field m-t-5"
        type="number"
        :style="{
          borderColor: focus ? 'var(--border-color)' : 'var(--border-color)',
        }"
        @input="handleInput"
        @focus="focus = true"
        @blur="focus = false"
      >
        <template #left-icon>
          <div class="d-flex">
            <span class="rc-field-currency"
              >{{
                paymentList.length > 0 &&
                paymentList[selectIndex].paymentId !== "USDT"
                  ? getCurrency
                  : "U"
              }}
            </span>
            <span class="rc-field-divider">|</span>
          </div>
        </template>
      </van-field>

      <div class="t-c rc-submit-wrap">
        <van-button
          @click="submit"
          size="large"
          class="custom-button f-t-18 rc-submit-btn"
          :class="{ 'active-b': isLoading }"
          :disabled="isLoading"
        >
          {{ $lang.common_txt314 }} {{ getCurrency }} {{ amount }}
        </van-button>
      </div>

      <div class="rc-bonus-panel">
        <div
          v-if="showRechargeActivity"
          class="rc-activity-row"
          :class="{ 'is-active': agree }"
          @click="agree = !agree"
        >
          <van-checkbox
            v-model="agree"
            shape="round"
            checked-color="#ffa300"
            icon-size="18px"
            class="rc-activity-row__check"
            @click.stop
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
          <span class="rc-vip-badge" :style="vipBadgeStyle"></span>
          <span class="rc-vip-text">VIP {{ InitDate.vipLevel || 0 }}</span>
          <span class="rc-vip-desc m-l-5">{{ $lang.common_txt312 }}</span>
        </p>
        <div class="rc-total-card">
          <div class="f-t-15">
            <span class="rc-total-card__label">
              {{ $lang.common_txt313 }}
            </span>
            <span class="rc-total-card__val">{{
              $formatNumberWithCommas(totalMount)
            }}</span>
          </div>
        </div>
        <p
          v-if="
            paymentList.length > 0 &&
            paymentList[selectIndex].paymentId === 'USDT'
          "
          class="rc-usdt-rate"
        >
          ≈ {{ $formatNumberWithCommas(TotalHl) }}{{ getCurrency }} ({{
            $lang.common_txt247
          }})
        </p>
      </div>
      <!-- 账号提示与支付方式无关；仅加密货币（USDT）隐藏 -->
      <div v-if="paymentKey !== 'usdt'">
        <div class="rc-account-row">
          <img :src="GET_ICONURL" width="25" />
          <span class="rc-account-row__code">{{ GET_AREACODE }}</span>
          <span>{{ account }}</span>
        </div>
        <div class="rc-account-tip">
          {{ $lang.common_txt362 }}
        </div>
      </div>
      <div class="deposit_share t-c">
        <p class="deposit_share__title">
          {{ $lang.common_txt315 }}
        </p>
        <p
          class="deposit_share__desc"
          v-html="$lang.common_txt316"
          @click="onCsDescClick"
        ></p>
        <div
          class="deposit_share__cs"
          role="button"
          @click="openTgCustomerService"
        >
          <van-icon name="service-o" size="22" color="#000" />
        </div>
      </div>

      <div class="rc-divider-row">
        <img src="../../assets/img/otgame/cdk_4.png" height="12" width="28%" />
        <p>{{ $lang.common_txt317 }}</p>
        <img src="../../assets/img/otgame/cdk_3.png" height="12" width="28%" />
      </div>
      <div v-html="$lang.common_txt30" class="l-h-20 rc-footer-note"></div>
    </div>

    <div class="rc-pay-bar">
      <div class="rc-pay-bar__inner">
        <div class="rc-pay-tabs" v-drag-scroll v-if="paymentList.length">
          <div
            v-for="(item, index) in paymentList"
            :key="index"
            class="rc-pay-tab"
            :class="{ 'active-type': selectIndex === index }"
            @click="tabIndex(index)"
          >
            <img :src="item.paymentIconUrl" class="rc-pay-tab__icon" alt="" />
            <p>{{ item.paymentName }}</p>
          </div>
        </div>

        <div
          class="rc-pay-notice"
          :class="payNoticeClass"
        >
          <img src="../../assets/img/otgame/Withdraw_1.png" width="15" />
          <span class="rc-pay-notice__text">{{ $lang.common_txt257 }}</span>
        </div>
      </div>
    </div>

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

// viptb.png：VIP0–VIP20 共 21 帧（与 vipLevels / mine 一致）
const VIP_SPRITE_W = 4636;
const VIP_SPRITE_H = 280;
const VIP_BADGE_FRAMES = 21;
const VIP_RC_BADGE_H = 22;

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
      awardRules: "",
      payInfoShow: false,
      paymentIconUrl: "",
      csUrl: "",
      showPayIframe: false,
      payIframeUrl: "",
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
    vipBadgeStyle() {
      const lv = Math.max(0, Number(this.InitDate.vipLevel) || 0);
      const idx = Math.min(lv, VIP_BADGE_FRAMES - 1);
      const scale = VIP_RC_BADGE_H / VIP_SPRITE_H;
      const spriteW = VIP_SPRITE_W * scale;
      const frameW = spriteW / VIP_BADGE_FRAMES;
      return {
        width: `${frameW}px`,
        height: `${VIP_RC_BADGE_H}px`,
        backgroundSize: `${spriteW}px ${VIP_RC_BADGE_H}px`,
        backgroundPosition: `-${idx * frameW}px 0`,
      };
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
        this.activities.length > 0 ||
        this.firstRecharge ||
        this.hasPromoBonus
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
  },
  mounted() {
    if (this.token) {
      this.VnRechargeInitS();
      this.Init();
      this.prefetchCsUrl();
    }
  },
  methods: {
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
      openCustomerService({ url: this.csUrl, scene: "floating" }).then(
        (ok) => {
          // 打开成功后刷新预取，避免链接过期
          if (ok) this.prefetchCsUrl();
        }
      );
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
/* y7 黑金风格 */
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@gold-grad: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@muted: #a89b7c;
@card-bg: #15110a;
@cell: #2a2418;

.rc-page {
  min-height: 100vh;
  background: @bg;
  color: #fff;
  /* 预留底部固定支付栏 + Tabbar，避免 Deposit Tips 被挡住 */
  padding-bottom: 220px;
  box-sizing: border-box;
}

.rc-header {
  height: 55px;
  background: rgba(31, 28, 23, 0.92);
  border-bottom: 1px solid fade(@gold-deep, 30%);
  backdrop-filter: blur(10px);
  padding: 0 10px;
  position: sticky;
  top: 0;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;

  &__left {
    display: flex;
    align-items: center;
  }

  &__title {
    font-size: 16px;
    font-weight: 600;
    margin-left: 10px;
    color: #fff;
  }

  &__balance {
    display: flex;
    align-items: center;
    margin-left: 16px;
    background: rgba(29, 20, 0, 0.65);
    border: 1px solid fade(@gold-deep, 35%);
    border-radius: 20px;
    padding: 2px 10px 2px 8px;
    gap: 5px;

    span {
      color: @gold-soft;
      min-width: 50px;
      font-size: 14px;
      font-weight: 600;
    }
  }

  &__record {
    font-size: 14px;
    color: @gold-deep;
    text-decoration: underline;
    cursor: pointer;
  }
}

.rc-section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 15px;

  &__title {
    font-size: 15px;
    font-weight: 700;
    background: @gold-grad;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  &__link {
    color: @gold;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
}

.rc-wl-list {
  display: flex;
  margin-top: 10px;
}

.rc-wl-item {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  margin-right: 10px;
  margin-bottom: 10px;
  background: @cell;
  border: 1px solid fade(@gold-deep, 25%);
  color: @muted;
  cursor: pointer;
}

.rc-hint {
  color: @muted;
  margin-top: 5px;
  font-size: 13px;
}

.rc-field-currency {
  font-size: 15px;
  margin-right: 10px;
  color: @gold-soft;
}

.rc-field-divider {
  margin-top: -3px;
  color: fade(@gold-deep, 50%);
}

.rc-vip-row {
  margin-top: 8px;
  display: flex;
  align-items: center;
  cursor: pointer;
  color: @gold-soft;
  font-size: 13px;
  gap: 4px;
}

.rc-vip-badge {
  flex-shrink: 0;
  background-image: url(@/assets/img/vip/viptb.png);
  background-image: image-set(
    url("@/assets/img/vip/viptb.webp") type("image/webp"),
    url("@/assets/img/vip/viptb.png") type("image/png")
  );
  background-repeat: no-repeat;
}

.rc-vip-text {
  font-size: 14px;
  font-weight: 700;
  transform: skew(-10deg);
  background: @gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  line-height: 1;
}

.rc-vip-desc {
  color: @muted;
  font-size: 12px;
}

.rc-total-card {
  background: @card-bg;
  border: 1px solid fade(@gold-deep, 40%);
  border-radius: 8px;
  padding: 10px;
  margin-top: 5px;

  &__label {
    color: @gold-deep;
  }

  &__val {
    color: @gold;
    font-weight: 700;
    margin-left: 4px;
  }
}

.rc-usdt-rate {
  font-size: 13px;
  margin-top: 5px;
  margin-left: 10px;
  color: @muted;
}

.rc-submit-wrap {
  margin: 16px 0 12px;
}

.rc-bonus-panel {
  margin-bottom: 8px;
}

.rc-bonus-panel .rc-activity-row {
  margin-top: 0;
}

.rc-bonus-panel .rc-vip-row {
  margin-top: 6px;
}

.rc-bonus-panel .rc-total-card {
  margin-top: 4px;
}

.rc-submit-btn {
  width: 100%;
  height: 48px !important;
  background: @btn-grad !important;
  color: #573900 !important;
  border: none !important;
  border-radius: 24px !important;
  font-weight: 800 !important;
  box-shadow: 0 4px 16px rgba(255, 163, 0, 0.28);
}

.rc-account-row {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  margin: 15px 0 20px;

  &__code {
    font-weight: bold;
    margin-left: 3px;
    margin-right: 10px;
    color: @gold-soft;
  }
}

.rc-account-tip {
  color: @muted;
  font-size: 15px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 15px;
  line-height: 20px;
}

.rc-divider-row {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;

  p {
    margin: 0 20px;
    color: @gold-deep;
    font-size: 13px;
  }
}

.rc-footer-note {
  width: 96%;
  margin: 0 auto;
  color: @muted;
}

.deposit_share {
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid fade(@gold, 35%);
  border-radius: 10px;
  padding: 12px 10px;

  &__title {
    font-size: 15px;
    font-weight: 700;
    background: @gold-grad;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  &__desc {
    margin-top: 5px;
    line-height: 20px;
    color: @muted;

    :deep(.js-cs-link) {
      color: @gold;
      text-decoration: underline;
      text-underline-offset: 2px;
      cursor: pointer;
      font-weight: 700;
      -webkit-tap-highlight-color: transparent;
    }
  }

  &__icon {
    cursor: pointer;
    margin-top: 6px;
  }

  &__cs {
    position: relative;
    z-index: 2;
    width: 44px;
    height: 44px;
    margin: 8px auto 0;
    border-radius: 50%;
    background: @gold-grad;
    border: 1px solid fade(@gold, 45%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
  }
}

.rc-pay-type {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  margin: 0 0 2px;
  padding: 2px 2px 6px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }

  &__item {
    flex: 0 0 auto;
    min-width: 72px;
    height: 72px;
    background: linear-gradient(180deg, #332c22 0%, #2a2418 100%);
    border: 1px solid rgba(233, 168, 67, 0.22);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    cursor: pointer;
    box-sizing: border-box;
    padding: 6px 8px 5px;
    box-shadow: inset 0 1px 0 rgba(255, 228, 181, 0.06);
  }

  &__item.is-active {
    border: 1.5px solid #d4b275;
    box-shadow:
      0 0 6px rgba(212, 178, 117, 0.5),
      0 0 2px rgba(255, 215, 130, 0.85),
      inset 0 1px 0 rgba(255, 228, 181, 0.12);
    background: linear-gradient(180deg, #3a3226 0%, #2c251a 100%);
  }

  &__icon {
    width: 30px;
    height: 30px;
    object-fit: contain;
    object-position: center;
    display: block;
    flex-shrink: 0;
  }

  &__line {
    display: block;
    width: 68%;
    height: 1px;
    margin: 2px 0 4px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(212, 178, 117, 0.15) 18%,
      #5e4d34 50%,
      rgba(212, 178, 117, 0.15) 82%,
      transparent 100%
    );
  }

  &__name {
    margin: 0;
    font-size: 11px;
    font-weight: 600;
    line-height: 1.15;
    color: #fff;
    max-width: 100%;
    text-align: center;
    letter-spacing: 0.1px;
    white-space: nowrap;
  }
}

.RechargeCont-cont {
  padding: 3% 5% 0% 5%;
  overflow-y: auto;
  min-height: 73vh;
  max-height: 77vh;
  border-radius: 20px 20px 0 0;
  background: @bg;
}

.type-item {
  width: 25%;
  position: relative;
  border-radius: 10px;
  background: @cell;
  padding: 10px 0;
  margin-right: 10px;
  margin-bottom: 10px;
  border: 1px solid fade(@gold-deep, 25%);
}

.active-bor {
  background: fade(@gold, 18%);
  color: @gold-soft;
  border: 1px solid @gold-deep !important;
}

.custom-badge {
  position: absolute;
  top: -2px;
  left: -1px;
  background: url(../../assets/img/otgame/recharge_4.png) no-repeat;
  width: 38px;
  height: 33px;
  background-size: 100% 100%;
}

.tool-tips-tail {
  position: absolute;
  top: 13px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 0px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid @gold;
}

.amount-box-list {
  flex-flow: wrap row;
}

.amount-box-list::after {
  content: "";
  width: 31.5%;
  height: 0;
}

.amount-box-list-item {
  position: relative;
  border-radius: 8px;
  width: 31.5%;
  margin-bottom: 10px;
  background: @cell;
  border: 1px solid fade(@gold-deep, 22%);
  padding: 10px 0;
  color: @muted;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    color 0.15s;

  &__val {
    width: 100%;
    text-align: center;
    font-weight: 700;
    font-size: 14px;
  }
}

.amount-bonus-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: @gold-grad;
  color: #573900;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 0 8px 0 8px;
  font-weight: bold;
}

.rc-activity-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 6px;
  padding: 10px 12px;
  background: rgba(42, 36, 24, 0.65);
  border: 1px solid fade(@gold-deep, 22%);
  border-radius: 8px;
  cursor: pointer;
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &.is-active {
    background: rgba(255, 163, 0, 0.14);
    border-color: fade(@gold-deep, 55%);
    box-shadow: 0 0 0 1px fade(@gold, 18%);
  }

  &__check {
    flex-shrink: 0;
  }

  &__text {
    flex: 1;
    margin: 0;
    color: @gold;
    font-size: 13px;
    line-height: 1.45;
    font-weight: 600;
  }

  :deep(.van-checkbox__icon) {
    font-size: 18px;
  }

  :deep(.van-checkbox__icon .van-icon) {
    border: 1px solid @gold-deep !important;
    background: @cell;
    border-radius: 50%;
  }

  :deep(.van-checkbox__icon--checked .van-icon) {
    background: @gold !important;
    border-color: @gold !important;
    color: #573900 !important;
  }
}

.first-recharge-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(
    90deg,
    rgba(255, 163, 0, 0.18),
    rgba(233, 168, 67, 0.06)
  );
  border: 1px solid fade(@gold-deep, 40%);
  border-radius: 8px;
  padding: 8px 12px;
  margin-bottom: 10px;

  &__check {
    flex-shrink: 0;
    margin-right: 2px;
  }

  &__text {
    color: @gold;
    font-size: 13px;
    font-weight: bold;
    line-height: 1.35;
  }
}

.active {
  color: #573900 !important;
  background: @btn-grad !important;
  border-color: @gold-deep !important;
  box-shadow: 0 2px 10px rgba(255, 163, 0, 0.25);
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

/* 底部支付方式栏 */
.rc-pay-bar {
  position: fixed;
  bottom: 70px;
  left: 0;
  right: 0;
  margin: 0 auto;
  max-width: 450px;
  background: rgba(31, 28, 23, 0.98);
  border-top: 1px solid fade(@gold-deep, 30%);
  backdrop-filter: blur(8px);
  z-index: 200;

  &__inner {
    padding: 10px;
  }
}

.rc-pay-tabs {
  display: flex;
  align-items: flex-end;
  gap: 10px;
  height: 70px;
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  scrollbar-width: none;
  cursor: grab;
  position: relative;
  z-index: 1;
  margin-bottom: -1px;

  &::-webkit-scrollbar {
    display: none;
  }
}

.rc-pay-tab {
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  flex: 0 0 auto;
  height: 58px;
  min-width: 58px;
  max-width: 72px;
  background: @cell;
  border: 1px solid fade(@gold-deep, 20%);
  border-radius: 10px;
  padding: 6px 6px 4px;
  color: @muted;
  cursor: pointer;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;

  &__icon {
    width: 32px;
    height: 22px;
    object-fit: contain;
    object-position: center;
    display: block;
    flex-shrink: 0;
  }

  p {
    margin: 4px 0 0;
    line-height: 1.2;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.rc-pay-notice {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  border: 1px solid @gold-deep;
  border-radius: 10px;
  padding: 6px 0;
  background: @card-bg;

  &__text {
    margin-left: 10px;
    color: @gold;
    font-weight: 600;
  }
}

.active-type {
  border: 1px solid @gold-deep !important;
  border-bottom: none !important;
  background: @card-bg !important;
  border-radius: 10px 10px 0 0 !important;
  height: 70px !important;
  margin-bottom: 0 !important;
  color: @gold-soft !important;
  position: relative;
  z-index: 2;
}

.active-type2 {
  color: #573900 !important;
  background: @btn-grad !important;
  border: 1px solid @gold-deep !important;
  font-weight: 700;
}

.rc-pay-notice.is-attach-left {
  margin-top: 0 !important;
  border-radius: 0 10px 10px 10px !important;
}

.rc-pay-notice.is-attach-right {
  margin-top: 0 !important;
  border-radius: 10px 0 10px 10px !important;
}

.rc-pay-notice.is-attach-mid {
  margin-top: 0 !important;
  border-radius: 0 0 10px 10px !important;
}

/* 弹窗 */
.rc-popup {
  background: @bg !important;
  width: 90%;
  border-radius: 12px !important;
  padding: 20px;
  border: 1px solid fade(@gold-deep, 45%);

  &__title {
    margin-top: 20px;
    font-size: 15px;
    text-align: center;
    font-weight: 700;
    color: @gold-soft;
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
    color: @gold-soft;
  }

  &__pay-icon {
    width: 36px;
    height: 24px;
    object-fit: contain;
    object-position: center;
    display: block;
    flex-shrink: 0;
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
