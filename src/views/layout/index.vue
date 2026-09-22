<template>
  <div class="content">
    <div id="md-hddb"></div>
    <top-download @layout-change="handleTopDownloadLayout"></top-download>
    <top-nav
      ref="topNav"
      v-if="isTopNavVisible"
      :key="timer"
      :top-offset="topDownloadHeight"
      @getLoging="getLoging"
    ></top-nav>

    <div
      v-if="topNavPlaceholderHeight"
      :style="{ height: `${topNavPlaceholderHeight}px` }"
    ></div>

    <!-- <div v-if="$route.path.includes('/home')" class="otag-gg" @click="showNoticePopup = true">
      <van-notice-bar class="notice-bar-style">
        <template #left-icon>
          <img
            src="../../assets/img/common/com-lb.png"
            style="width: 15px"
            class="m-r-10 notice-bar-icon"
          />
        </template>
        <div class="d-flex notice-bar-text">
          {{ $lang.common_txt357 }}
        </div>
      </van-notice-bar>
    </div> -->

    <van-popup
      v-model:show="showNoticePopup"
      round
      :close-on-click-overlay="true"
      class="notice-popup"
    >
      <div class="notice-popup__content">
        <div class="notice-popup__header">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffa300">
            <path
              d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            />
          </svg>
          <span>{{ $lang.notice_title || "Notice" }}</span>
          <van-icon
            name="cross"
            size="18"
            color="#a89b7c"
            @click="showNoticePopup = false"
          />
        </div>
        <div class="notice-popup__body">
          {{ $lang.common_txt357 }}
        </div>
      </div>
    </van-popup>

    <div
      v-if="$route.path.includes('/home') && bannerList.length"
      class="content-swiper-bg"
      style="margin-top: 10px"
    >
      <van-swipe
        ref="bannerSwipe"
        :autoplay="3500"
        class="swipe-fixed-height"
        :show-indicators="false"
        @change="onBannerChange"
      >
        <van-swipe-item
          v-for="(item, index) in bannerList"
          :key="item.advertisementImg || index"
          @click="onBannerClick(item)"
        >
          <img
            class="content-swiper--img"
            :src="item.advertisementImg"
            alt=""
            loading="lazy"
            decoding="async"
            @error="onBannerImgError"
          />
        </van-swipe-item>
      </van-swipe>
      <div class="banner-arrow-wrap">
        <div class="banner-arrow banner-arrow-left" @click="bannerPrev">
          <van-icon name="arrow-left" size="16" color="var(--wihte-color)" />
        </div>
        <div class="banner-arrow banner-arrow-right" @click="bannerNext">
          <van-icon name="arrow" size="16" color="var(--wihte-color)" />
        </div>
      </div>
      <div class="banner-indicators">
        <span
          v-for="(item, index) in bannerList.length"
          :key="index"
          class="banner-dot"
          :class="{ active: currentBannerIndex === index }"
        ></span>
      </div>
    </div>
    <router-view v-slot="{ Component, route }">
      <keep-alive>
        <component
          :is="Component"
          v-if="Component && route.meta.keepAlive"
          :key="route.name"
        />
      </keep-alive>
      <component
        :is="Component"
        v-if="Component && !route.meta.keepAlive"
        :key="route.fullPath"
      />
    </router-view>

    <Tabbar @need-login="handleOpenLogin" />

    <login v-model="showPopup" overlay @close-key="close"></login>
    <!-- <lucky-roulette
      v-model="isShowPopup"
      @login-key="LoginKey"
      overlay
    ></lucky-roulette> -->
    <!-- <div v-if="!['/Country'].includes($route.path)" class="fj-cont">
      <div v-if="isFjShow" class="d-flex">
        <img
          class="fj-cont-i"
          @click="goTofj(1)"
          src="../../assets/img/common/img_tg.png"
          width="50"
        />
      </div>
    </div> -->
    <!-- <van-popup
      v-if="['/lottery', '/home'].includes($route.path)"
      v-model:show="showDialog"
      class="custom-popup2"
      :closeable="false"
      :close-on-click-overlay="false"
    >
      <div v-if="isff2" class="cont-redim"></div>

      <div v-if="isff" class="cont-redim2"></div>

      <div v-if="isff2" class="d-flex-s m-t-10">
        <div class="d-flex">
          <van-checkbox
            v-model="agree"
            shape="square"
            icon-size="16px"
            icon-color="#202A39"
            style="
              border: 1px solid #6f7887;
              margin-right: 3px;
              border-radius: 5px;
            "
          ></van-checkbox>
          <p style="color: var(--wihte-color); font-size: 11px">{{ $lang.home_txt7 }}</p>
        </div>
        <div class="d-flex">
          <van-checkbox
            v-model="agree2"
            shape="square"
            icon-size="16px"
            icon-color="#202A39"
            style="
              border: 1px solid #6f7887;
              margin-right: 3px;
              border-radius: 5px;
            "
          ></van-checkbox>
          <p style="color: var(--wihte-color); font-size: 11px">{{ $lang.home_txt8 }}</p>
        </div>
      </div>
      <img
        class="m-t-10"
        @click="closeF()"
        src="../../assets/img/lucky_jackpot/img_cancel.png"
        width="38"
      />
    </van-popup> -->
    <activity-popup
      v-if="$route.path.includes('/lottery') || $route.path.includes('/home')"
      v-model="isShowPopup2"
      @closeActive="closeActive"
      @closeActive2="closeActive2"
    ></activity-popup>
  </div>
</template>

<script>
import TopDownload from "../../components/TopDownload.vue"; //顶部下载
import TopNav from "../../components/TopNav.vue"; //顶部导航栏
import Tabbar from "../../components/Tabbar.vue";
import {
  Init,
  VnRechargeInitS,
  GameBalanceList,
  WithdrawInit,
  ActivitygetRegisterAward,
  GetInvitationID,
  GetBannerList,
} from "@/api/common";
import { consumeOpenLoginAfterPlatformSwitch } from "@/utils/platformAuth";
export default {
  components: {
    TopDownload,
    TopNav,
    Tabbar,
  },
  name: "LayoutIndex",
  computed: {
    isTopNavVisible() {
      return this.$route.path.includes("/home");
    },
    topNavPlaceholderHeight() {
      return this.topDownloadHeight + (this.isTopNavVisible ? 60 : 0);
    },
    // 获取当前路由前缀，确保 tabbar 路径正确匹配
    routePrefix() {
      return this.$route.params.prefix || localStorage.getItem("country") || "";
    },
  },
  data() {
    return {
      active: 0,
      agree2: false,
      agree: false,
      MenList: [
        {
          img: require("@/assets/img/home/men_1.png"),
          name: this.$lang.common_txt138,
        },
        {
          img: require("@/assets/img/home/men_2.png"),
          name: this.$lang.common_txt139,
        },
      ],
      isFjShow: true,
      isFjShow2: true,
      showDialog: false,
      isShowPopup: false,
      isShowPopup2: false,
      timer: null,
      topDownloadHeight: 0,
      showPopup: false, //登录弹窗开关
      // tabBar: [
      //   {
      //     title: this.$lang.Início,
      //     to: '/home',
      //     img: require('@/assets/img/menu_home_original.png'),
      //     img_a: require('@/assets/img/menu_home_click.png')
      //   },
      //   {
      //     title: this.$lang.Depósito,
      //     to: '/rechargeCont',
      //     img: require('@/assets/img/menu_wallet_original.png'),
      //     img_a: require('@/assets/img/menu_wallet_click.png')
      //   },
      //   {
      //     title: this.$lang.common_txt26,
      //     to: '/Crowdfunding',
      //     img: require('@/assets/img/menu_agent_original.png'),
      //     img_a: require('@/assets/img/menu_agent_click.png')
      //   },
      //   {
      //     title: this.$lang.common_txt23,
      //     to: '/Support',
      //     img: require('@/assets/img/menu_activity_original.png'),
      //     img_a: require('@/assets/img/menu_activity_click.png')
      //   },

      //   {
      //     title: this.$lang.Meu,
      //     to: '/mine',
      //     img: require('@/assets/img/menu_personal_original.png'),
      //     img_a: require('@/assets/img/menu_personal_click.png')
      //   }
      // ],
      // selectMenIndex: this.$route.path === '/home' ? 1 : 0
      selectMenIndex: 0,
      isff: true,
      isff2: false,
      currentBannerIndex: 0,
      bannerList: [],
      showNoticePopup: false,
    };
  },
  watch: {
    $route: {
      handler(to) {
        if (to.query.isValue === "isLogin") {
          this.showPopup = true;
        }
      },
      immediate: true,
    },
  },
  mounted() {
    this.$nextTick(() => {
      const app = document.getElementById("app");
      const content = document.getElementById("app-content");
      window.scrollTo(0, 0);
      if (app) app.scrollTop = 0;
      if (content) content.scrollTop = 0;
    });
    // 页面加载时判断是否需要显示弹窗
    this.checkPopupStatus();
    // this.ActivitygetRegisterAward()
    const today = new Date().toISOString().split("T")[0];

    if (sessionStorage.getItem("neverShowToday2") === today) {
      this.showDialog = false;
    } else if (localStorage.getItem("neverShow2")) {
      // 检查永久不显示
      this.showDialog = false;
    } else {
      this.showDialog = true;
    }

    // 全局监听登录弹窗事件（未登录接口、活动页等场景统一触发）
    this.$bus.on("openLogin", this.handleOpenLogin);
    this.$nextTick(() => {
      if (consumeOpenLoginAfterPlatformSwitch() && this.$bus) {
        this.$bus.emit("openLogin");
      }
    });
  },
  beforeUnmount() {
    this.$bus.off("openLogin", this.handleOpenLogin);
  },
  async created() {
    this.fetchBannerList();
    if (this.$route.query.id) {
      await localStorage.setItem("id", this.$route.query.id);
      await GetInvitationID();
    }
    if (!localStorage.getItem("fbExpand")) {
      localStorage.setItem(
        "fbExpand",
        this.$pixel.getUrlFBParams().replace("#/home?", "&"),
      );
    }
  },
  methods: {
    handleTopDownloadLayout({ height }) {
      this.topDownloadHeight = height;
    },
    handleOpenLogin() {
      this.showPopup = true;
    },
    async GetInvitationID() {
      const data = await GetInvitationID({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.invitCode) {
          localStorage.setItem("id", data.content.invitCode);
        }
      }
    },
    goToDetail3(i) {
      if (i === 0) {
        this.$jumpTo("/Crowdfunding");
      } else if (i === 1) {
        this.$jumpTo("/Alliance");
      } else if (i === 2) {
        this.$jumpTo("/vipSignIn");
      } else if (i === 3) {
        this.$jumpTo("/redPacket");
      } else if (i === 4) {
        this.$jumpTo("/referFriend");
      } else if (i === 5) {
        this.$jumpTo("/cashBack");
      } else if (i === 6) {
        this.$jumpTo("/signIn");
      } else if (i === 7) {
        this.$jumpTo("/activityFistRecharge");
      } else if (i === 8) {
        this.$jumpTo("/Support");
      }
    },
    onBannerChange(index) {
      this.currentBannerIndex = index;
    },
    bannerPrev() {
      if (this.currentBannerIndex > 0) {
        this.$refs.bannerSwipe.swipeTo(this.currentBannerIndex - 1);
      } else {
        this.$refs.bannerSwipe.swipeTo(this.bannerList.length - 1);
      }
    },
    bannerNext() {
      if (this.currentBannerIndex < this.bannerList.length - 1) {
        this.$refs.bannerSwipe.swipeTo(this.currentBannerIndex + 1);
      } else {
        this.$refs.bannerSwipe.swipeTo(0);
      }
    },
    async fetchBannerList() {
      try {
        const data = await GetBannerList({});
        if (data.status === "ok" && data.content && data.content.bannerList) {
          this.bannerList = data.content.bannerList
            .filter((item) => item && item.advertisementImg)
            .sort((a, b) => b.ordered - a.ordered);
        }
      } catch (e) {
        console.error("fetchBannerList error", e);
      }
    },
    onBannerImgError(e) {
      if (e && e.target) e.target.style.display = "none";
    },
    onBannerClick(item) {
      const jump = this.resolveBannerJump(item);
      if (!jump) return;
      if (jump.type === "route") {
        const routePath = String(jump.target || "").split("?")[0] || "";
        if (
          this.isBannerAuthRoute(routePath) &&
          !localStorage.getItem("token")
        ) {
          this.$bus.emit("openLogin");
          return;
        }
        this.$jumpTo(jump.target);
        return;
      }
      window.open(jump.target, "_blank");
    },
    isBannerAuthRoute(path) {
      const p = String(path || "").replace(/^\/[A-Za-z]{2}(?=\/)/, "") || path;
      const authRoutes = [
        "/dailyCheckIn",
        "/newbieGift",
        "/luckyReferral",
        "/firstDepositGift",
        "/seasonPass",
        "/weeklyMissions",
        "/referFriend",
        "/rewardHistory",
        "/cashBack",
        "/redPacket",
        "/signIn",
        "/activityFistRecharge",
        "/activityRecharge",
        "/activityCooperate",
        "/teamRebates",
        "/rechargeCont",
        "/mine",
        "/share",
        "/vipLevels",
        "/vip",
      ];
      return authRoutes.some((r) => p === r || p.startsWith(r + "/"));
    },
    resolveBannerJump(item) {
      if (!item) return null;
      const candidates = [];
      const pushVal = (v) => {
        if (typeof v === "string" && v.trim()) candidates.push(v.trim());
      };

      let extra = item.extendJson;
      if (typeof extra === "string") {
        const trimmed = extra.trim();
        if (trimmed.startsWith("{") || trimmed.startsWith("[")) {
          try {
            extra = JSON.parse(trimmed);
          } catch (e) {
            extra = trimmed;
          }
        }
      }
      if (extra && typeof extra === "object") {
        pushVal(extra.url);
        pushVal(extra.link);
        pushVal(extra.jumpUrl);
        pushVal(extra.skipUrl);
        pushVal(extra.path);
        pushVal(extra.route);
        pushVal(extra.href);
        pushVal(extra.target);
        pushVal(extra.page);
      } else {
        pushVal(extra);
      }

      pushVal(item.jumpUrl);
      pushVal(item.linkUrl);
      pushVal(item.skipUrl);
      pushVal(item.advertisementUrl);
      pushVal(item.url);
      pushVal(item.link);
      pushVal(item.href);

      // 优先非首页目标，避免 advertisementUrl 指到 /home 盖住真正跳转
      const isHomeLike = (raw) => {
        try {
          let path = raw;
          if (/^https?:\/\//i.test(raw)) {
            const u = new URL(raw);
            path = u.pathname || "/";
          }
          path = String(path).split("?")[0];
          path = path.startsWith("/") ? path : `/${path}`;
          path = path.replace(/\/+$/, "") || "/";
          path = path.replace(/^\/[A-Za-z]{2}(?=\/|$)/, "") || "/";
          return path === "/" || path === "/home";
        } catch (e) {
          return false;
        }
      };
      const useful = candidates.filter((c) => {
        const raw = String(c).trim();
        if (!raw || raw === "#" || raw === "/") return false;
        return !isHomeLike(raw);
      });
      const target = useful[0] || candidates[0];
      if (!target) return null;

      if (/^https?:\/\//i.test(target)) {
        try {
          const u = new URL(target);
          if (u.origin === window.location.origin) {
            let path = u.pathname || "/home";
            path = path.replace(/^\/[A-Za-z]{2}(?=\/)/, "") || "/home";
            return { type: "route", target: path + (u.search || "") };
          }
        } catch (e) {
          /* ignore */
        }
        return { type: "http", target };
      }
      if (target.startsWith("//")) {
        return { type: "http", target: window.location.protocol + target };
      }
      let path = target.startsWith("/") ? target : `/${target}`;
      path = path.replace(/^\/[A-Za-z]{2}(?=\/)/, "") || path;
      return { type: "route", target: path };
    },
    closeActive() {
      this.showDialog = false;
    },
    closeActive2() {
      this.showDialog = true;
    },
    async ActivitygetRegisterAward() {
      const data = await ActivitygetRegisterAward();
      if (data.status === "ok") {
        if (data.content.receiveStatus === 1) {
          this.isShowPopup2 = true;
        } else {
          this.isShowPopup2 = false;
        }
      } else if (data.status === "need_login") {
        this.isShowPopup2 = true;
      }
    },
    goToMen(i) {
      this.selectMenIndex = i;
      if (i === 0) {
        this.$jumpTo("/lottery");
      } else {
        this.$jumpTo("/home");
      }
    },
    goTofj(i) {
      if (i === 1) {
        window.open("https://t.me/OTgamel");
      }
      // if (i === 1) {
      //   this.$router.push('./activityFistRecharge')
      // } else if (i === 2) {
      //   this.$router.push('./cashBack')
      // }
    },
    closeF2(i) {
      if (i === 1) {
        this.isFjShow = false;
      } else if (i === 2) {
        this.isFjShow2 = false;
      }
    },
    closeF() {
      if (this.agree) {
        // 今日不显示
        const today = new Date().toISOString().split("T")[0];
        sessionStorage.setItem("neverShowToday2", today);
      }
      if (this.agree2) {
        // 永久不显示
        localStorage.setItem("neverShow2", true);
      }
      if (this.isff2) {
        this.showDialog = false;
      }
      this.isff = false;
      if (!this.isff) {
        this.isff2 = true;
        return;
      }
    },
    submit2() {
      localStorage.removeItem("isRegister");
      this.showDialog = false;
      // this.$router.push('/recharge')
      this.$jumpTo("/rechargeCont");
    },
    getLoging() {
      this.showPopup = true;
    },
    LoginKey() {
      this.showPopup = true;
    },
    // 检查是否需要显示弹窗
    checkPopupStatus() {
      const today = this.getTodayString();
      const lastShownDate = localStorage.getItem("popupLastShownDate");
      const isClosedToday = localStorage.getItem("popupClosedToday") === "true";

      // 如果今天已经显示过或者今天关闭过，则不显示
      if (lastShownDate === today || isClosedToday) {
        this.isShowPopup = false;
        // this.isShowPopup2 = false
      } else {
        this.isShowPopup = true;
        // this.isShowPopup2 = true

        // 记录今天已经显示过弹窗
        localStorage.setItem("popupLastShownDate", today);
      }
      // if (localStorage.getItem('isRegister') === 'isRegister') {
      //   this.showDialog = true
      // }
    },
    // 打开弹窗
    openPopup() {
      const today = this.getTodayString();
      // 如果今天没有显示过弹窗且没有被关闭过，则可以手动打开
      if (
        !localStorage.getItem("popupLastShownDate") ||
        localStorage.getItem("popupLastShownDate") !== today
      ) {
        this.isShowPopup = true;
        // this.isShowPopup2 = true
        localStorage.setItem("popupLastShownDate", today);
      }
    },
    // 关闭弹窗
    closePopup() {
      this.isShowPopup = false;
      // 记录今天关闭过弹窗
      localStorage.setItem("popupClosedToday", "true");
    },
    // 获取当前日期字符串（格式：YYYY-MM-DD）
    getTodayString() {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    close() {},
    async GameBalanceList() {
      const data = await GameBalanceList();
      console.log(data);
    },
    async WithdrawInit() {
      const data = await WithdrawInit();
      console.log(data);
    },
    async VnRechargeInitS() {
      const data = await VnRechargeInitS();
      if (data.status === "ok") {
        console.log("-");
      }
    },
    // 登录
    async isLogin(i) {
      // 第一个tab点击后由 van-tabbar 的 route 属性自动处理路由跳转和高亮
      if (i === 0) return;
      // 1. 通过 id 获取目标元素
      const target = document.getElementById("md-hddb");
      if (!target) return; // 防止 id 不存在报错
      target.scrollIntoView({
        behavior: "auto", // 滚动行为：smooth（平滑）/ auto（瞬间，默认）
        block: "start", // 对齐方式：start（顶部对齐）/ center（居中）/ end（底部对齐）
        inline: "nearest", // 水平对齐（默认即可）
      });
      if (i !== 2 && i !== 3) {
        const data = await Init();
        if (data.status === "need_login") {
          this.showPopup = true;
          this.timer++;
        }
      }
      // this.$nextTick(() => {
      //   window.scrollTo(0, 0)
      // })
      if (i === 2 && localStorage.getItem("token")) {
        this.GameBalanceList();
        this.WithdrawInit();
      }
      // if (!localStorage.getItem('token')) {
      //   console.error = (message, ...args) => {
      //     if (message.includes('Navigation cancelled')) {
      //       return // 忽略这个特定的错误
      //     }
      //     this.$router.push('/')
      //     console.error(message, ...args)
      //   }
      //   this.timer++
      //   this.showPopup = true
      // }
    },
  },
};
</script>

<style lang="less" scoped>
/* 公告栏 - 图中样式：深色背景、圆角、阴影、白字 */
.otag-gg {
  padding: 0 15px;
  margin-bottom: 4px;
}
:deep(.van-notice-bar.notice-bar-style) {
  background-color: #1f1c17 !important;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  padding: 5px 15px;
  color: @wihte-color;
  height: 30px;
}
:deep(.van-notice-bar.notice-bar-style .van-notice-bar__content) {
  color: @wihte-color;
}
.notice-bar-text {
  color: @wihte-color !important;
  font-size: 13px;
}
.notice-bar-icon {
  filter: brightness(1.1);
}

// .con-sw-bg {
//   background: url(../../assets/img/otgame/kuang_05.png) no-repeat;
//   background-size: 100% 100%;
//   height: 195px;
//   width: 96%;
//   margin: 0 auto;
//   left: 0;
//   right: 0;
//   position: absolute;
//   top: -10px;
// }
/* PC 端样式 */
@media (min-width: 769px) {
  .cont-redim {
    height: 477px !important;
    padding-top: 383px !important;
  }
  .cont-redim2 {
    height: 477px !important;
    padding-top: 383px !important;
  }
  .custom-popup2 {
    width: 370px !important;
  }
  :deep(.van-sticky--fixed) {
    top: 110px !important;
  }
}
:deep(.van-overlay) {
  z-index: 1999 !important;
}
.custom-popup2 {
  width: 86%;
  text-align: center;
  background-color: transparent; /* 设置背景色 */
  // z-index: 2004 !important;
  .cont-redim {
    // padding-top: 330px;
    background: url(../../assets/img/common/syhd.png) no-repeat;
    background-size: 100% 100%;
    height: 420px;
    border-radius: 15px;
  }
  .cont-redim2 {
    // padding-top: 330px;
    background: url(../../assets/img/common/home_111.png) no-repeat;
    background-size: 100% 100%;
    height: 450px;
    border-radius: 15px;
  }

  :deep(.van-checkbox__icon .van-icon) {
    border: none;
  }
  :deep(.van-checkbox__icon--checked .van-icon) {
    background-color: @primary-color3 !important;
  }
  .van-overlay {
    z-index: 2001 !important;
  }
}
.fj-cont {
  position: fixed;
  bottom: 160px;
  right: 20px;
  text-align: right;
  z-index: 999;
}
.fj-cont-i {
  animation: enlargeAndShake 1.8s ease-in-out infinite;
  transform-origin: bottom; /* 将旋转中心点设置为底部 */
}
@keyframes enlargeAndShake {
  0% {
    transform: scale(1) rotate(0deg);
  }
  20% {
    transform: scale(1.2) rotate(0deg);
  }
  40% {
    transform: scale(1.2) rotate(-10deg); /* 放大并左晃 */
  }
  60% {
    transform: scale(1.2) rotate(10deg); /* 放大并右晃 */
  }
  80% {
    transform: scale(1.2) rotate(-10deg); /* 放大并左晃 */
  }
  100% {
    transform: scale(1.2) rotate(0deg);
  }
}
.select-Men {
  background: #ffa300 !important;
  color: #573900 !important;
}
.content-swiper--img {
  width: 94%;
  margin: 0 auto;
  height: 182px;
  object-fit: cover;
  display: block;
  border-radius: 10px;
  cursor: pointer;
}
.swipe-fixed-height {
  width: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
.content-swiper-bg {
  position: relative;
  :deep(.van-swipe__indicator) {
    width: 25px;
    border-radius: 12px;
    color: transparent !important;
  }
  :deep(.van-swipe__indicator--active) {
    // width: 35px;
    color: @wihte-color !important;
  }
  :deep(.van-swipe__indicator--active) {
    background: @wihte-color !important;
  }
}
.banner-arrow-wrap {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 8px;
  z-index: 10;
  pointer-events: none;
}
.banner-arrow {
  width: 32px;
  height: 32px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  pointer-events: auto;
  transition: opacity 0.2s;
}
.banner-arrow:active {
  opacity: 0.7;
}
.banner-indicators {
  position: absolute;
  bottom: 8px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 6px;
  z-index: 10;
}
.banner-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  transition: all 0.3s;
}
.banner-dot.active {
  background: @wihte-color;
  width: 18px;
  border-radius: 3px;
}
/* 公告弹窗 */
.notice-popup {
  background: #15110a !important;
  width: 85%;
  max-width: 400px;
  border-radius: 12px !important;
  border: 1px solid rgba(255, 162, 0, 0.45);
}
.notice-popup__content {
  padding: 20px;
}
.notice-popup__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  span {
    flex: 1;
    margin-left: 8px;
    font-size: 16px;
    font-weight: bold;
    color: @wihte-color;
  }
}
.notice-popup__body {
  color: #a89b7c;
  font-size: 14px;
  line-height: 1.6;
  max-height: 50vh;
  overflow-y: auto;
}
</style>
