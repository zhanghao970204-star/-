<template>
  <div id="app">
    <div id="app-content">
      <router-view v-slot="{ Component, route }">
        <keep-alive>
          <component
            :is="Component"
            v-if="Component && isRootKeepAlive(route)"
            :key="rootKeepAliveKey(route)"
          />
        </keep-alive>
        <component
          :is="Component"
          v-if="Component && !isRootKeepAlive(route)"
          :key="route.fullPath"
        />
      </router-view>

      <!-- Global Bouncing Red Envelope -->
      <div
        v-if="redPacketVisible && !redPacketClosed && isHomePage"
        class="global-red-envelope"
        :class="floaterClass('red')"
        :style="floaterStyle('red', { bottom: redBottom + 'px' })"
        @pointerdown="onFloaterDown('red', $event)"
        @click="onFloaterClick(goToRedPacket)"
      >
        <img
          src="./assets/img/bonus/red_packet.png"
          class="global-red-envelope__img"
          draggable="false"
        />
        <span
          class="global-floater-close"
          @pointerdown.stop
          @click.stop="redPacketClosed = true"
        >
          <van-icon name="cross" size="12" color="var(--wihte-color)" />
        </span>
      </div>

      <!-- Global Treasure Box (treasure_box activity) -->
      <div
        v-if="tbVisible && !tbClosed && isHomePage"
        class="global-treasure-box"
        :class="floaterClass('tb')"
        :style="floaterStyle('tb', { bottom: tbBottom + 'px' })"
        @pointerdown="onFloaterDown('tb', $event)"
        @click="onFloaterClick(openTreasureBox)"
      >
        <div class="global-treasure-box__shine"></div>
        <img
          src="./assets/img/activity/activity_icon/task/close.png"
          class="global-treasure-box__img"
          draggable="false"
        />
        <span class="global-treasure-box__dot"></span>
        <span
          class="global-floater-close"
          @pointerdown.stop
          @click.stop="tbClosed = true"
        >
          <van-icon name="cross" size="12" color="var(--wihte-color)" />
        </span>
      </div>

      <!-- Global First Recharge (first_recharge activity) -->
      <div
        v-if="frVisible && !frClosed && isHomePage"
        class="global-first-recharge"
        :class="floaterClass('fr')"
        :style="floaterStyle('fr', { bottom: frBottom + 'px' })"
        @pointerdown="onFloaterDown('fr', $event)"
        @click="onFloaterClick(openFirstRecharge)"
      >
        <div class="global-first-recharge__shine"></div>
        <img
          src="./assets/img/activity/activity_icon/task/close.png"
          class="global-first-recharge__img"
          draggable="false"
        />
        <span v-if="frRedDot" class="global-first-recharge__dot"></span>
        <span v-if="frCountdownText" class="global-first-recharge__timer">{{
          frCountdownText
        }}</span>
        <span
          class="global-floater-close"
          @pointerdown.stop
          @click.stop="frClosed = true"
        >
          <van-icon name="cross" size="12" color="var(--wihte-color)" />
        </span>
      </div>

      <!-- Lucky Spin image popup (replaces floating turntable entry) -->
      <van-popup
        v-model:show="lrPopupVisible"
        class="lucky-spin-popup"
        :close-on-click-overlay="false"
        :style="{ background: 'transparent', overflow: 'visible' }"
      >
        <div class="lucky-spin-popup__wrap">
          <img
            src="./assets/img/activity/turntable/lucky_spin_popup.png"
            class="lucky-spin-popup__img"
            alt="Lucky Spin"
            @click="onLuckySpinClick"
          />
          <span
            class="lucky-spin-popup__close"
            @click.stop="closeLuckySpinPopup"
          >
            <van-icon name="cross" size="16" color="#fff" />
          </span>
        </div>
      </van-popup>

      <!-- Daily Check-in image popup -->
      <van-popup
        v-model:show="checkInPopupVisible"
        class="checkin-promo-popup"
        :close-on-click-overlay="false"
        :style="{ background: 'transparent', overflow: 'visible' }"
      >
        <div class="checkin-promo-popup__wrap">
          <img
            src="./assets/img/activity/checkin/daily_checkin_popup.png"
            class="checkin-promo-popup__img"
            alt="Daily Check-in"
          />
          <button
            type="button"
            class="checkin-promo-popup__btn"
            @click="onCheckInPopupGo"
          >
            {{ $lang.checkin_go_it || "GO TO IT" }}
          </button>
          <span
            class="checkin-promo-popup__close"
            @click.stop="closeCheckInPopup"
          >
            <van-icon name="cross" size="16" color="#fff" />
          </span>
        </div>
      </van-popup>

      <!-- Global Telegram (getCsLink scene=floating) -->
      <div
        v-if="tgFloaterOn"
        class="global-tg-float"
        :class="floaterClass('tg')"
        :style="floaterStyle('tg', { bottom: tgBottom + 'px' })"
        @pointerdown="onFloaterDown('tg', $event)"
        @click="onFloaterClick(openTgFloat)"
      >
        <img
          src="./assets/img/otgame/zjm_40.png"
          class="global-tg-float__img"
          draggable="false"
        />
        <span
          class="global-floater-close"
          @pointerdown.stop
          @click.stop="tgClosed = true"
        >
          <van-icon name="cross" size="12" color="var(--wihte-color)" />
        </span>
      </div>

      <!-- Global Treasure Box Popup (shared with Activity page) -->
      <treasure-box-popup
        v-model="showTreasureBoxPopup"
        :price="tbPrice"
        :total-value="tbTotalValue"
        :rewards="tbRewards"
        :countdown-seconds="tbCountdownSeconds"
        @payment-closed="checkTreasureBox"
      />

      <!-- Global First Recharge Popup -->
      <first-recharge-popup
        v-model="showFirstRechargePopup"
        :pack-data="frPackData"
        @refresh="checkFirstRecharge"
      />

      <!-- <div
        v-if="!isGamePage"
        class="global-cs-btn"
        @click="openCs"
      >
        <van-icon name="service-o" size="26" color="#fff" />
      </div> -->
    </div>
  </div>
</template>
<script>
import { defineAsyncComponent } from "vue";
import {
  RedPacket,
  GoogleAuthCodeLogin,
  Init,
  TreasureBoxInit,
  NewPlayerGiftPackInit,
  GetCsLink,
} from "@/api/common";
import {
  openCustomerService,
  getFirstCsLinkByScene,
  getCsItemUrl,
} from "@/utils/csLink";

export default {
  name: "App",
  components: {
    TreasureBoxPopup: defineAsyncComponent(
      () => import("@/components/TreasureBoxPopup.vue"),
    ),
    FirstRechargePopup: defineAsyncComponent(
      () => import("@/components/FirstRechargePopup.vue"),
    ),
  },
  data() {
    return {
      redPacketVisible: false,
      redPacketClosed: false,
      // Treasure box (treasure_box activity) state
      tbVisible: false,
      tbClosed: false,
      frClosed: false,
      tbPrice: 0,
      tbTotalValue: 0,
      tbRewards: [],
      tbCountdownSeconds: 86399,
      tbTickTimer: null,
      showTreasureBoxPopup: false,
      // First recharge activity state (新手大礼包)
      frVisible: false,
      frRedDot: false,
      frPackData: null,
      showFirstRechargePopup: false,
      frAutoShown: false,
      frNowTs: Math.floor(Date.now() / 1000),
      frTickTimer: null,
      // Lucky referral popup (replaces floating entry)
      lrPopupVisible: false,
      lrPopupClosed: false,
      // Daily check-in promo popup
      checkInPopupVisible: false,
      checkInPopupClosed: false,
      tgVisible: false,
      tgClosed: false,
      tgUrl: "",
      floaterXY: { red: null, tb: null, fr: null, tg: null },
      floaterDrag: null,
      floaterSkipClick: false,
    };
  },
  computed: {
    isHomePage() {
      return this.$route.name === "Home";
    },
    isGamePage() {
      return this.$route.path.includes("gameHall");
    },
    tgFloaterOn() {
      return this.tgVisible && !this.tgClosed && this.isHomePage;
    },
    tbCountdownText() {
      const total = this.tbCountdownSeconds > 0 ? this.tbCountdownSeconds : 0;
      const h = Math.floor(total / 3600);
      const m = Math.floor((total % 3600) / 60);
      const s = total % 60;
      return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
      );
    },
    frCountdownText() {
      if (!this.frPackData) return "";
      const toSec = (t) => {
        const n = Number(t) || 0;
        return n > 1e12 ? Math.floor(n / 1000) : n;
      };
      // 已购买后不显示任何倒计时
      if (Number(this.frPackData.purchased) === 1) return "";
      // 未购买：到 expireTime 的倒计时
      const target = toSec(this.frPackData.expireTime);
      if (!target) return "";
      const diff = target - this.frNowTs;
      if (diff <= 0) return "";
      const d = Math.floor(diff / 86400);
      const h = Math.floor((diff % 86400) / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      if (d > 0)
        return (
          d +
          "d " +
          String(h).padStart(2, "0") +
          ":" +
          String(m).padStart(2, "0")
        );
      return (
        String(h).padStart(2, "0") +
        ":" +
        String(m).padStart(2, "0") +
        ":" +
        String(s).padStart(2, "0")
      );
    },
    // TG 在左侧 bottom 100；右侧活动图标与之横向对齐，多个时向上叠放（每级约 80px）
    tgBottom() {
      return 100;
    },
    redBottom() {
      return 100;
    },
    tbBottom() {
      return this.redPacketVisible && this.isHomePage ? 180 : 100;
    },
    frBottom() {
      let base = 100;
      if (this.redPacketVisible && this.isHomePage) base += 80;
      if (this.tbVisible && this.isHomePage) base += 80;
      return base;
    },
  },
  mounted() {
    this.checkRedPacket();
    this.checkTreasureBox();
    this.checkFirstRecharge();
    this.checkLuckyReferral();
    this.checkDailyCheckInPopup();
    this.checkCsFloatLink();
    this.checkGoogleCallback();
    window.addEventListener("resize", this.onFloaterResize);
  },
  beforeUnmount() {
    this.stopTbTick();
    this.stopFrTick();
    this.unbindFloaterDrag();
    window.removeEventListener("resize", this.onFloaterResize);
  },
  watch: {
    // 切换路由到首页时重新拉宝箱 / 转盘入口状态
    $route(to, from) {
      if (to.path !== from.path && to.path.includes("/home")) {
        this.checkTreasureBox();
        this.checkLuckyReferral();
        this.checkDailyCheckInPopup();
        this.checkCsFloatLink();
      } else if (to.path !== from.path) {
        this.lrPopupVisible = false;
        this.checkInPopupVisible = false;
      }
    },
    // 宝箱购买弹窗关闭时（用户可能完成/取消付款）重新拉宝箱状态
    showTreasureBoxPopup(val, oldVal) {
      if (oldVal && !val) {
        this.checkTreasureBox();
      }
    },
  },
  methods: {
    /**
     * App 层渲染的是布局壳（Index），不是子 Tab。
     * 不能用子路由 name(Home/Menu/Mine) 当 key，否则每次切 Tab 整页 Index/TopNav 重挂载，接口全重复打。
     */
    isRootKeepAlive(route) {
      if (!route || !route.matched || !route.matched.length) return false;
      if (route.matched.length > 1) return true;
      return !!route.meta.keepAlive;
    },
    rootKeepAliveKey(route) {
      if (route.matched && route.matched.length > 1) {
        return route.matched[0].path || "app-layout";
      }
      return route.name || route.fullPath;
    },
    async checkRedPacket() {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await RedPacket({});
        if (res && res.status === "ok" && res.content) {
          this.redPacketVisible = true;
        }
      } catch (e) {
        // silent
      }
    },
    async checkTreasureBox() {
      // Only show the treasure box float to logged-in users (mirrors red envelope behavior)
      if (!localStorage.getItem("token")) return;
      try {
        const res = await TreasureBoxInit({});
        if (res && res.status === "ok" && res.content) {
          const c = res.content;
          const visible = c.visible !== 0 && Number(c.purchased) !== 1;
          this.tbVisible = visible;
          // 重新拉到后端有效状态时，清掉本地关闭标记，让浮标重新可见
          if (visible) this.tbClosed = false;
          if (c.price !== undefined) this.tbPrice = c.price;
          if (c.totalValue !== undefined) this.tbTotalValue = c.totalValue;
          else if (c.price !== undefined) this.tbTotalValue = c.price;
          this.tbRewards = Array.isArray(c.rewards) ? c.rewards : [];
          if (c.countdownSeconds !== undefined)
            this.tbCountdownSeconds = c.countdownSeconds;
          if (this.tbVisible) this.startTbTick();
        }
      } catch (e) {
        // silent
      }
    },
    startTbTick() {
      this.stopTbTick();
      this.tbTickTimer = setInterval(() => {
        if (this.tbCountdownSeconds > 0) {
          this.tbCountdownSeconds--;
        } else {
          this.stopTbTick();
        }
      }, 1000);
    },
    stopTbTick() {
      if (this.tbTickTimer) {
        clearInterval(this.tbTickTimer);
        this.tbTickTimer = null;
      }
    },
    openTreasureBox() {
      this.showTreasureBoxPopup = true;
    },
    async checkFirstRecharge() {
      if (!localStorage.getItem("token")) return;
      try {
        const res = await NewPlayerGiftPackInit({});
        if (res && res.status === "ok" && res.content) {
          const c = res.content;
          this.frVisible = Number(c.visible) === 1;
          this.frRedDot = Number(c.showRedDot) === 1;
          this.frPackData = c;
          if (this.frVisible) {
            this.startFrTick();
            if (!this.frAutoShown) {
              this.frAutoShown = true;
              this.showFirstRechargePopup = true;
            }
          } else {
            this.stopFrTick();
          }
        } else {
          this.frVisible = false;
          this.frRedDot = false;
          this.frPackData = null;
          this.stopFrTick();
        }
      } catch (e) {
        // silent
      }
    },
    startFrTick() {
      this.stopFrTick();
      this.frNowTs = Math.floor(Date.now() / 1000);
      this.frTickTimer = setInterval(() => {
        this.frNowTs = Math.floor(Date.now() / 1000);
      }, 1000);
    },
    stopFrTick() {
      if (this.frTickTimer) {
        clearInterval(this.frTickTimer);
        this.frTickTimer = null;
      }
    },
    openFirstRecharge() {
      this.showFirstRechargePopup = true;
    },
    goToRedPacket() {
      this.$jumpTo("/redPacket");
    },
    checkLuckyReferral() {
      // 登录后在首页弹出转盘宣传图（替代原悬浮入口）
      if (!localStorage.getItem("token") || this.lrPopupClosed) {
        this.lrPopupVisible = false;
        return;
      }
      this.lrPopupVisible = this.isHomePage;
    },
    closeLuckySpinPopup() {
      this.lrPopupVisible = false;
      this.lrPopupClosed = true;
      this.checkDailyCheckInPopup();
    },
    onLuckySpinClick() {
      this.closeLuckySpinPopup();
      this.$jumpTo("/luckyReferral");
    },
    checkDailyCheckInPopup() {
      if (!localStorage.getItem("token") || this.checkInPopupClosed) {
        this.checkInPopupVisible = false;
        return;
      }
      // 与转盘弹窗错开：转盘关闭后再出签到宣传
      this.checkInPopupVisible = this.isHomePage && !this.lrPopupVisible;
    },
    closeCheckInPopup() {
      this.checkInPopupVisible = false;
      this.checkInPopupClosed = true;
    },
    onCheckInPopupGo() {
      this.closeCheckInPopup();
      this.$jumpTo("/dailyCheckIn");
    },
    async checkCsFloatLink() {
      try {
        const data = await GetCsLink();
        const content = data && data.content ? data.content : data;
        const item = getFirstCsLinkByScene(content, "floating");
        this.tgUrl = getCsItemUrl(item);
        this.tgVisible = !!this.tgUrl;
      } catch (e) {
        this.tgVisible = false;
        this.tgUrl = "";
      }
    },
    openTgFloat() {
      if (this.tgUrl) window.open(this.tgUrl, "_blank");
    },
    openCs() {
      openCustomerService();
    },
    floaterClass(key) {
      return {
        "is-dragging": this.floaterDrag && this.floaterDrag.key === key,
        "is-dragged": !!this.floaterXY[key],
      };
    },
    floaterStyle(key, extra) {
      const pos = this.floaterXY[key];
      if (pos) {
        return {
          left: pos.left + "px",
          top: pos.top + "px",
          right: "auto",
          bottom: "auto",
        };
      }
      return extra || {};
    },
    clampFloater(left, top, w, h) {
      const maxL = Math.max(0, window.innerWidth - w);
      const maxT = Math.max(0, window.innerHeight - h);
      return {
        left: Math.min(Math.max(0, left), maxL),
        top: Math.min(Math.max(0, top), maxT),
      };
    },
    onFloaterDown(key, e) {
      if (e.pointerType === "mouse" && e.button !== 0) return;
      if (e.target.closest && e.target.closest(".global-floater-close")) return;
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      this.floaterDrag = {
        key,
        pointerId: e.pointerId,
        el,
        startX: e.clientX,
        startY: e.clientY,
        origLeft: rect.left,
        origTop: rect.top,
        w: rect.width,
        h: rect.height,
        moved: false,
      };
      try {
        el.setPointerCapture(e.pointerId);
      } catch (err) {
        /* ignore */
      }
      window.addEventListener("pointermove", this.onFloaterMove, {
        passive: false,
      });
      window.addEventListener("pointerup", this.onFloaterUp);
      window.addEventListener("pointercancel", this.onFloaterUp);
    },
    onFloaterMove(e) {
      const d = this.floaterDrag;
      if (!d || d.key == null) return;
      if (e.cancelable) e.preventDefault();
      const dx = e.clientX - d.startX;
      const dy = e.clientY - d.startY;
      if (!d.moved && dx * dx + dy * dy < 64) return;
      d.moved = true;
      this.floaterXY[d.key] = this.clampFloater(
        d.origLeft + dx,
        d.origTop + dy,
        d.w,
        d.h,
      );
    },
    onFloaterUp() {
      const d = this.floaterDrag;
      if (d && d.moved) this.floaterSkipClick = true;
      this.unbindFloaterDrag();
    },
    unbindFloaterDrag() {
      const d = this.floaterDrag;
      if (d && d.el) {
        try {
          d.el.releasePointerCapture(d.pointerId);
        } catch (err) {
          /* ignore */
        }
      }
      this.floaterDrag = null;
      window.removeEventListener("pointermove", this.onFloaterMove);
      window.removeEventListener("pointerup", this.onFloaterUp);
      window.removeEventListener("pointercancel", this.onFloaterUp);
    },
    onFloaterClick(handler) {
      if (this.floaterSkipClick) {
        this.floaterSkipClick = false;
        return;
      }
      if (typeof handler === "function") handler();
    },
    onFloaterResize() {
      ["red", "tb", "fr", "tg"].forEach((key) => {
        const pos = this.floaterXY[key];
        if (!pos) return;
        this.floaterXY[key] = this.clampFloater(pos.left, pos.top, 56, 68);
      });
    },
    checkGoogleCallback() {
      console.log("[Google OAuth] App.vue checkGoogleCallback called");
      console.log("[Google OAuth] URL:", window.location.href);
      console.log(
        "[Google OAuth] localStorage googleAuthCode:",
        localStorage.getItem("googleAuthCode") ? "exists" : "null",
      );
      console.log(
        "[Google OAuth] localStorage googleToUrl:",
        localStorage.getItem("googleToUrl"),
      );
      // Check URL first, then localStorage (saved by router guard before redirects)
      const urlParams = new URLSearchParams(window.location.search);
      let code = urlParams.get("code");
      if (code) {
        console.log("[Google OAuth] Found code in URL params");
        // Clean URL params
        const url = new URL(window.location.href);
        url.searchParams.delete("code");
        url.searchParams.delete("scope");
        url.searchParams.delete("authuser");
        url.searchParams.delete("prompt");
        window.history.replaceState({}, document.title, url.toString());
        localStorage.removeItem("googleAuthCode");
        this.handleGoogleCallback(code);
      } else {
        code = localStorage.getItem("googleAuthCode");
        if (code) {
          console.log("[Google OAuth] Found code in localStorage");
          localStorage.removeItem("googleAuthCode");
          this.handleGoogleCallback(code);
        } else {
          console.log("[Google OAuth] No code found anywhere");
        }
      }
    },
    async handleGoogleCallback(code) {
      const toUrl =
        localStorage.getItem("googleToUrl") ||
        window.location.origin + window.location.pathname;
      console.log(
        "[Google OAuth] handleGoogleCallback, code length:",
        code.length,
        "toUrl:",
        toUrl,
      );
      try {
        const data = await GoogleAuthCodeLogin({
          code: code,
          toUrl: toUrl,
          isWap: true,
        });
        console.log(
          "[Google OAuth] GoogleAuthCodeLogin response:",
          JSON.stringify(data).substring(0, 500),
        );
        if (data.status === "ok" && data.content) {
          const prefix =
            localStorage.getItem("country") || this.$route.params.prefix || "";
          if (!data.content.needBindPhone) {
            // Already registered, login success
            localStorage.setItem("token", data.content.accessToken);
            localStorage.removeItem("googleToUrl");
            console.log(
              "[Google OAuth] Login success, token set, checking phone bind...",
            );
            // Check if phone is bound
            await this.checkPhoneBind();
          } else {
            // Need to bind phone — navigate to binding page
            console.log(
              "[Google OAuth] needBindPhone=true, redirecting to googlePhoneBind, prefix:",
              prefix,
            );
            localStorage.setItem("googleThirdUuid", data.content.thirdUuid);
            localStorage.removeItem("googleToUrl");
            window.location.href = "/" + prefix + "/googlePhoneBind";
          }
        } else {
          console.error("[Google OAuth] Login failed:", data.msg);
          const prefix = localStorage.getItem("country") || "";
          localStorage.removeItem("googleToUrl");
          window.location.href = "/" + prefix + "/home";
        }
      } catch (e) {
        console.error("[Google OAuth] handleGoogleCallback error:", e);
        const prefix = localStorage.getItem("country") || "";
        localStorage.removeItem("googleToUrl");
        window.location.href = "/" + prefix + "/home";
      }
    },
    async checkPhoneBind() {
      const prefix =
        localStorage.getItem("country") || this.$route.params.prefix || "";
      try {
        const res = await Init();
        console.log(
          "[Google OAuth] Init response phoneNo:",
          res && res.content && res.content.phoneNo,
        );
        if (res && res.status === "ok" && res.content) {
          if (!res.content.phoneNo) {
            // No phone bound — force bind
            console.log(
              "[Google OAuth] No phone bound, redirecting to phoneUnbound",
            );
            window.location.href = "/" + prefix + "/phoneUnbound?fromGoogle=1";
          } else {
            // Phone already bound — go to home
            console.log("[Google OAuth] Phone bound, going to home");
            window.location.href = "/" + prefix + "/home";
          }
        } else {
          window.location.href = "/" + prefix + "/home";
        }
      } catch (e) {
        console.error("[Google OAuth] checkPhoneBind error", e);
        window.location.href = "/" + prefix + "/home";
      }
    },
  },
};
</script>
<style>
html,
body {
  margin: 0;
  padding: 0;
  color: var(--wihte-color);
  font-size: 12px;
}
ul,
p,
h3 {
  margin: 0;
  padding: 0;
}
/* #app-content {
  background-color: #0e131c;
} */
/* 基础样式 */
#app {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  transition: all 0.3s ease;
  background-color: var(--background-color, #1f1c17);
  color: var(--font-color, #fff);
}

/* 移动端样式 */
@media (max-width: 768px) {
  body {
    background-color: var(--background-color, #1f1c17);
    min-height: 100vh;
    background-size: cover;
    height: 100vh;
    overflow-y: scroll;
  }
  #app {
    /* 移动端全屏显示 */
    width: 100%;
    padding: 0;
    height: 100vh;
    overflow: scroll;
    background-color: var(--background-color, #1f1c17);
  }
}

/* PC 端样式：整站内容最大宽度 450px 居中 */
@media (min-width: 769px) {
  html,
  body {
    background-color: #0a0908;
    height: 100%;
    overflow: hidden;
  }

  #app {
    width: 450px !important;
    max-width: 450px !important;
    margin: 0 auto !important;
    height: 100vh;
    overflow: hidden;
    position: relative;
    background-color: var(--background-color, #1f1c17);
    box-shadow: 0 0 40px rgba(0, 0, 0, 0.45);
  }

  #app-content {
    width: 100%;
    max-width: 450px;
    margin: 0 auto;
    min-height: 100%;
    height: 100vh;
    overflow-x: hidden;
    overflow-y: auto;
    background-color: var(--background-color, #1f1c17);
    background-size: cover;
    -webkit-overflow-scrolling: touch;
  }

  .van-nav-bar {
    width: 450px !important;
    max-width: 450px !important;
  }
  .van-nav-bar--fixed {
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%);
    top: 0 !important;
  }

  /* 遮罩限制在 450 内容内 */
  .van-overlay {
    left: 50% !important;
    right: auto !important;
    width: 450px !important;
    max-width: 450px !important;
    transform: translateX(-50%);
  }

  /* 居中弹窗：相对 450 内容水平居中 */
  .van-popup--center {
    left: 50% !important;
    top: 50% !important;
    right: auto !important;
    width: auto !important;
    max-width: 430px !important;
    transform: translate(-50%, -50%) !important;
  }

  .van-sticky--fixed {
    width: 450px !important;
    max-width: 450px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%);
    top: 0 !important;
  }

  .van-popup--bottom {
    left: 50% !important;
    right: auto !important;
    width: 450px !important;
    max-width: 450px !important;
    transform: translateX(-50%) !important;
  }

  .van-popup--left {
    left: calc(50% - 225px) !important;
    max-width: 450px !important;
  }
  .van-popup--right {
    right: calc(50% - 225px) !important;
    left: auto !important;
    max-width: 450px !important;
  }

  .van-tabbar--fixed {
    width: 450px !important;
    max-width: 450px !important;
    left: 50% !important;
    right: auto !important;
    transform: translate(-50%, -50%);
    bottom: -30px;
  }

  /* 右侧活动浮动按钮贴在 450 内容右侧内 */
  .global-red-envelope:not(.is-dragged),
  .global-treasure-box:not(.is-dragged),
  .global-first-recharge:not(.is-dragged),
  .global-cs-btn {
    right: auto !important;
    left: calc(50% + 225px - 72px) !important;
  }

  /* TG 保持在内容区左侧 */
  .global-tg-float:not(.is-dragged) {
    right: auto !important;
    left: calc(50% - 225px + 16px) !important;
  }
}
/* ====== Global Red Envelope ====== */
.global-red-envelope {
  position: fixed;
  right: 16px;
  bottom: 100px;
  z-index: 999;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  animation: global-red-bounce 1.5s ease-in-out infinite;
  transition: bottom 0.3s ease;
}
.global-red-envelope__img {
  width: 56px;
  height: 56px;
  object-fit: contain;
  filter: drop-shadow(0 4px 12px rgba(255, 50, 50, 0.4));
  pointer-events: none;
  -webkit-user-drag: none;
}
@keyframes global-red-bounce {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-12px);
  }
}

/* ====== Global Treasure Box (first deposit gift) ====== */
.global-floater-close {
  position: absolute !important;
  top: -6px !important;
  right: -6px !important;
  left: auto !important;
  bottom: auto !important;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.6);
}
.global-floater-close:active {
  transform: scale(0.9);
}
.global-treasure-box {
  position: fixed;
  right: 16px;
  z-index: 999;
  width: 56px;
  height: 56px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  animation: tb-float 1.8s ease-in-out infinite;
  /* bottom is bound inline so we can react to red-envelope visibility */
  transition: bottom 0.3s ease;
}
.global-treasure-box__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: tb-glow 2s ease-in-out infinite;
  pointer-events: none;
  -webkit-user-drag: none;
}
.global-treasure-box__shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  pointer-events: none;
  overflow: hidden;
}
.global-treasure-box__shine::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(255, 245, 120, 0.55) 50%,
    rgba(255, 255, 255, 0) 60%,
    transparent 100%
  );
  transform: rotate(25deg);
  animation: tb-shine 3s ease-in-out infinite;
}
.global-treasure-box__dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 8px rgba(255, 59, 48, 0.8);
  animation: tb-dot-pulse 0.9s ease-in-out infinite;
}
.global-treasure-box__timer {
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(10, 14, 26, 0.9);
  border: 1px solid rgba(248, 245, 16, 0.45);
  color: #f8f510;
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.5px;
  white-space: nowrap;
  text-shadow: 0 0 6px rgba(248, 245, 16, 0.5);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
@keyframes tb-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
@keyframes tb-glow {
  0%,
  100% {
    filter: drop-shadow(0 4px 10px rgba(248, 245, 16, 0.35))
      drop-shadow(0 0 6px rgba(248, 245, 16, 0.25));
  }
  50% {
    filter: drop-shadow(0 6px 16px rgba(248, 245, 16, 0.75))
      drop-shadow(0 0 14px rgba(248, 245, 16, 0.55));
  }
}
@keyframes tb-shine {
  0% {
    left: -60%;
  }
  60% {
    left: 120%;
  }
  100% {
    left: 120%;
  }
}
@keyframes tb-dot-pulse {
  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35);
    opacity: 0.8;
  }
}

/* ====== Global First Recharge Floater ====== */
.global-first-recharge {
  position: fixed;
  right: 16px;
  z-index: 999;
  width: 56px;
  height: 56px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  animation: fr-float 2s ease-in-out infinite;
  transition: bottom 0.3s ease;
}
.global-first-recharge__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  animation: fr-glow 2.2s ease-in-out infinite;
  pointer-events: none;
  -webkit-user-drag: none;
}
.global-first-recharge__dot {
  position: absolute;
  top: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ff3b30;
  box-shadow: 0 0 8px rgba(255, 59, 48, 0.8);
  animation: tb-dot-pulse 0.9s ease-in-out infinite;
  z-index: 2;
}
.global-first-recharge__shine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  pointer-events: none;
  overflow: hidden;
}
.global-first-recharge__shine::before {
  content: "";
  position: absolute;
  top: -50%;
  left: -60%;
  width: 40%;
  height: 200%;
  background: linear-gradient(
    120deg,
    transparent 0%,
    rgba(255, 255, 255, 0) 40%,
    rgba(216, 130, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 60%,
    transparent 100%
  );
  transform: rotate(25deg);
  animation: fr-shine 3.2s ease-in-out infinite;
}
.global-first-recharge__timer {
  position: absolute;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  padding: 2px 6px;
  border-radius: 8px;
  background: rgba(10, 14, 26, 0.9);
  border: 1px solid rgba(168, 28, 230, 0.5);
  color: #ffcd34;
  font-size: 10px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 0.5px;
  white-space: nowrap;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
@keyframes fr-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
@keyframes fr-glow {
  0%,
  100% {
    filter: drop-shadow(0 4px 10px rgba(168, 28, 230, 0.35))
      drop-shadow(0 0 6px rgba(168, 28, 230, 0.25));
  }
  50% {
    filter: drop-shadow(0 6px 16px rgba(168, 28, 230, 0.75))
      drop-shadow(0 0 14px rgba(168, 28, 230, 0.55));
  }
}
@keyframes fr-shine {
  0% {
    left: -60%;
  }
  60% {
    left: 120%;
  }
  100% {
    left: 120%;
  }
}

/* ====== Lucky Spin Popup ====== */
.lucky-spin-popup {
  background: transparent !important;
  overflow: visible !important;
}
.lucky-spin-popup__wrap {
  position: relative;
  width: min(86vw, 360px);
  margin: 0 auto;
}
.lucky-spin-popup__img {
  display: block;
  width: 100%;
  height: auto;
  cursor: pointer;
  border-radius: 12px;
}
.lucky-spin-popup__close {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.lucky-spin-popup__close:active {
  transform: scale(0.92);
}

/* ====== Daily Check-in Promo Popup ====== */
.checkin-promo-popup {
  background: transparent !important;
  overflow: visible !important;
}
.checkin-promo-popup__wrap {
  position: relative;
  width: min(86vw, 360px);
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.checkin-promo-popup__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}
.checkin-promo-popup__btn {
  width: 88%;
  height: 46px;
  border: none;
  border-radius: 23px;
  background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
  color: #1a1408;
  font-size: 16px;
  font-weight: 800;
  letter-spacing: 0.04em;
  cursor: pointer;
  text-transform: uppercase;
}
.checkin-promo-popup__btn:active {
  transform: scale(0.97);
  opacity: 0.92;
}
.checkin-promo-popup__close {
  position: absolute;
  top: -10px;
  right: -10px;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 2;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
}
.checkin-promo-popup__close:active {
  transform: scale(0.92);
}

/* ====== Global Telegram Floater ====== */
@keyframes lr-float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
.global-tg-float {
  position: fixed;
  left: 16px;
  right: auto;
  bottom: 100px;
  z-index: 999;
  width: 56px;
  height: 56px;
  cursor: grab;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  animation: lr-float 1.9s ease-in-out infinite;
  transition: bottom 0.3s ease;
}
.global-tg-float__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
  -webkit-user-drag: none;
  filter: drop-shadow(0 4px 12px rgba(47, 111, 237, 0.45));
}

.global-red-envelope.is-dragging,
.global-treasure-box.is-dragging,
.global-first-recharge.is-dragging,
.global-tg-float.is-dragging {
  animation: none !important;
  transition: none !important;
  cursor: grabbing;
}

.global-red-envelope.is-dragged,
.global-treasure-box.is-dragged,
.global-first-recharge.is-dragged,
.global-tg-float.is-dragged {
  animation: none;
  transition: none;
}

.global-cs-btn {
  position: fixed;
  right: 16px;
  bottom: 78px;
  z-index: 998;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: #2f6fed;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(47, 111, 237, 0.45);
  cursor: pointer;
}
</style>
