<template>
  <div class="content" :key="timer">
    <div
      class="close-img"
      v-if="!showPopup"
      style="z-index: 9999999"
      :style="{ top: dragTop + 'px', left: dragLeft + 'px' }"
      @touchstart="handleDragStart"
      @touchmove="handleDragMove"
      @mousedown="handleDragStart"
      @mousemove="handleDragMove"
    >
      <img
        @click="goback"
        src="../../../assets/img/common/back.png"
        width="20"
      />
      <p>{{ $lang.common_txt62 }}</p>
    </div>

    <common-popup
      v-if="hall.from === 'game'"
      v-model="showPopup"
      :config="{
        isTitle: true,
        title: '',
        content: textContent,
        bt1: btn1Text,
        bt2: btn2Text,
      }"
      @close="close"
      @confirm="confirm"
    ></common-popup>

    <div v-if="hall.from === 'game'" class="iframe-wrapper">
      <iframe
        class="iframe-wrapper-s"
        v-if="hall.from === 'game'"
        :src="forwardUrl"
        ref="myIframe"
        :style="iframeStyle"
      ></iframe>
    </div>

    <iframe
      v-if="isEmbedHall"
      :src="embedUrl"
      scrolling="auto"
      style="width: 100%; height: 100%"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import { GameBalanceList, ForwardGame } from "@/api/common";

// 进游戏参数：优先 query；兼容旧的 params 和 localStorage（刷新 / 旧入口）
function readHallParams(route) {
  const q = (route && route.query) || {};
  const p = (route && route.params) || {};
  const pick = (k) => (q[k] != null && q[k] !== "" ? q[k] : p[k]);
  let from = pick("from") || "";
  let gid = pick("gid") || "";
  // 内嵌大厅（充值页等进入）不带游戏参数，不能用上次进游戏的缓存兜底
  if (!from && !gid && !sessionStorage.getItem("gameHallEmbed")) {
    from = localStorage.getItem("hallFrome") || "";
    gid = localStorage.getItem("hallGid") || "";
  }
  return {
    from,
    gid,
    isDemo: pick("isDemo") || 0,
    typeCate: pick("typeCate"),
    gameTab: pick("gameTab"),
  };
}
export default {
  name: "GameHall",
  components: {},
  data() {
    return {
      iframeStyle: {
        height: "0px",
        marginTop: "0px",
      },
      showPopup: false,
      balance: 0,
      forwardUrl: "",
      embedFrom: "",
      embedUrl: "",
      textContent: "",
      btn1Text: "",
      btn2Text: "",
      timer: null,
      isRechargeGame: false,
      isWirthgeGame: false,
      popupKind: "",
      hall: readHallParams(this.$route),
      // 拖动相关数据
      dragTop: 5,
      dragLeft: 5,
      startX: 0,
      startY: 0,
      startTop: 0,
      startLeft: 0,
      // 新增：标记是否正在拖动
      isDragging: false,
    };
  },
  computed: {
    isEmbedHall() {
      return ["recharge", "home", "what"].includes(this.embedFrom);
    },
  },
  mounted() {
    this.loadEmbedFromStorage();
    if (this.token && this.hall.from === "game") {
      if (!this.hall.gid) {
        this.showBlockPopup(
          this.$lang.game_not_found ||
            "This game could not be found. Please return to the lobby and try again.",
        );
      } else {
        this.adjustIframeHeight();
        this.addEventListeners();
        window.addEventListener("resize", this.setIframeHeight);
        this.GetGameBalanceList();
      }
    } else if (this.hall.from === "game") {
      this.showBlockPopup(
        this.$lang.game_login_required || "Please log in to play this game.",
      );
    } else if (!this.isEmbedHall) {
      this.hall.from = "game";
      this.$nextTick(() => {
        this.showBlockPopup(
          this.$lang.game_not_found ||
            "This game could not be found. Please return to the lobby and try again.",
        );
      });
    }
    // 新增：监听鼠标松开事件（全局，防止鼠标移出元素后无法结束拖动）
    window.addEventListener("mouseup", this.handleDragEnd);
    window.addEventListener("touchend", this.handleDragEnd);
  },
  beforeUnmount() {
    this.removeEventListeners();
    // 新增：移除全局鼠标松开监听
    window.removeEventListener("mouseup", this.handleDragEnd);
    window.removeEventListener("touchend", this.handleDragEnd);
  },

  methods: {
    loadEmbedFromStorage() {
      try {
        const raw = sessionStorage.getItem("gameHallEmbed");
        if (!raw) return;
        const data = JSON.parse(raw);
        this.embedFrom = data.from || "";
        this.embedUrl = data.url || data.otherUrl || "";
      } catch (e) {
        this.embedFrom = "";
        this.embedUrl = "";
      }
    },
    // 合并：处理拖动开始（兼容触摸和鼠标）
    handleDragStart(e) {
      // 区分触摸和鼠标事件
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.startX = clientX;
      this.startY = clientY;
      this.startTop = this.dragTop;
      this.startLeft = this.dragLeft;
      // 标记开始拖动
      this.isDragging = true;
      e.stopPropagation();
    },
    // 合并：处理拖动移动（兼容触摸和鼠标）
    handleDragMove(e) {
      // 只有拖动中才执行逻辑
      if (!this.isDragging) return;

      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      // 计算移动距离
      const moveX = clientX - this.startX;
      const moveY = clientY - this.startY;

      // 计算新位置
      let newLeft = this.startLeft + moveX;
      let newTop = this.startTop + moveY;

      // 获取元素实际尺寸（避免硬编码，更灵活）
      const el = document.querySelector(".close-img");
      if (!el) return;
      const elWidth = el.offsetWidth;
      const elHeight = el.offsetHeight;
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // 边界限制：不超出屏幕
      newLeft = Math.max(0, Math.min(newLeft, screenWidth - elWidth));
      newTop = Math.max(0, Math.min(newTop, screenHeight - elHeight));

      // 更新位置
      this.dragLeft = newLeft;
      this.dragTop = newTop;

      // 阻止默认行为（防止滚动）
      e.preventDefault();
      e.stopPropagation();
    },
    // 新增：处理拖动结束
    handleDragEnd() {
      this.isDragging = false;
    },

    adjustIframeHeight() {
      if (window.visualViewport) {
        this.iframeStyle = {
          height: window.visualViewport.height + "px",
          marginTop: window.visualViewport.offsetTop + "px",
        };
      } else {
        this.iframeStyle.height = window.innerHeight + "px";
      }
    },

    addEventListeners() {
      if (window.visualViewport) {
        window.visualViewport.addEventListener(
          "resize",
          this.adjustIframeHeight,
        );
        window.visualViewport.addEventListener(
          "scroll",
          this.adjustIframeHeight,
        );
      } else {
        window.addEventListener("resize", this.adjustIframeHeight);
      }
    },

    removeEventListeners() {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener(
          "resize",
          this.adjustIframeHeight,
        );
        window.visualViewport.removeEventListener(
          "scroll",
          this.adjustIframeHeight,
        );
      } else {
        window.removeEventListener("resize", this.adjustIframeHeight);
      }
    },
    setViewHeight() {
      const viewHeight =
        window.innerHeight / document.documentElement.offsetHeight;
      if (viewHeight < 0.9) {
        document.body.style.paddingBottom = "50px";
      } else {
        document.body.style.paddingBottom = "0px";
      }
    },
    async ForwardGame() {
      const data = await ForwardGame({ gid: this.hall.gid });
      if (data.status === "ok") {
        let closeGame = data.content.closeGame;
        let needRecharge = data.content.needRecharge;
        let vipLevel = data.content.vipLevel;
        let onlyPg = data.content.onlyPg;
        let wdFirst = data.content.wdFirst;
        if (onlyPg) {
          this.showBlockPopup(this.$lang.common_txt155);
        } else if (wdFirst) {
          this.showBlockPopup(this.$lang.common_txt156);
          this.isWirthgeGame = true;
        } else if (needRecharge) {
          this.popupKind = "recharge";
          this.showPopup = true;
          this.btn1Text = this.$lang.common_back || "Back";
          this.btn2Text = this.$lang.common_go_deposit || "Deposit";
          this.textContent =
            this.$lang.game_need_first_deposit ||
            "Bonus funds can't be used to play this game yet. Make your first deposit to unlock all games.";
          this.isRechargeGame = true;
        } else if (vipLevel) {
          this.showBlockPopup(
            this.$lang.game_vip_required ||
              "Your VIP level is not high enough to play this game. Upgrade your VIP level to unlock it.",
          );
        } else if (closeGame) {
          this.showBlockPopup(this.$lang.common_txt160);
        } else {
          this.forwardUrl = data.content.forwardUrl || "";
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    async GetGameBalanceList() {
      const data = await GameBalanceList();
      if (data.status === "ok") {
        this.balance = data.content.balance;
        // 进入游戏前不再因余额为 0/过低拦截；是否可投注由游戏内/服务端投注接口校验
        this.$nextTick(() => {
          this.ForwardGame();
        });
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    showBlockPopup(text) {
      this.popupKind = "block";
      this.showPopup = true;
      this.btn1Text = "isClose";
      this.btn2Text = this.$lang.common_back || "Back";
      this.textContent = text;
    },
    goback() {
      if (this.isEmbedHall) {
        this.$router.go(-1);
        return;
      }
      this.popupKind = "exit";
      this.showPopup = true;
      this.btn1Text = "Cancel";
      this.btn2Text = "Confirm";
      this.textContent = this.$lang.gameHall_txt5;
    },
    // 回到进入游戏前的页面；直接打开（无历史）时回首页
    leaveGame() {
      const state = window.history.state;
      if (state && state.back) {
        this.$router.back();
      } else if (Number(this.hall.typeCate) === 1) {
        this.$jumpTo(
          "/category",
          { gameTab: this.hall.gameTab },
          { replace: true },
        );
      } else {
        this.$jumpTo("/home", {}, { replace: true });
      }
    },
    close() {
      if (this.popupKind === "exit") {
        this.showPopup = false;
      } else {
        this.leaveGame();
      }
    },
    confirm() {
      if (this.popupKind === "recharge") {
        this.$jumpTo("/rechargeCont", {}, { replace: true });
        return;
      }
      this.leaveGame();
    },
  },
};
</script>

<style lang="less" scoped>
.content {
  width: 100%;
  height: 100vh;
  background: #1a0a28 !important;
}
.close-img {
  position: fixed;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  border-radius: 999px;
  padding: 8px 10px;
  border: 1px solid #e9a843;
  text-align: center;
  color: #ffffff;
  min-width: 52px;
  max-width: 86px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* 优化PC端光标 */
  cursor: move;
  /* 禁止文本选中 */
  user-select: none;
  /* 禁止触摸默认行为 */
  touch-action: none;

  img {
    display: block;
    flex-shrink: 0;
  }

  p {
    margin: 4px 0 0;
    padding: 0;
    font-size: 10px;
    line-height: 1.15;
    font-weight: 700;
    max-width: 100%;
    word-break: break-word;
    overflow-wrap: anywhere;
  }
}
.iframe-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom);
  height: calc(100vh - env(safe-area-inset-bottom));
  .iframe-wrapper-s {
    width: 100%;
    border: 0;
    display: block;
    overflow-y: auto;
  }
}
</style>
