<template>
  <div class="content" style="min-height: 100vh; overflow: auto">
    <!-- <div class="d-flex-s">
      <div
        v-for="(item, index) in MenList"
        :key="index"
        @click="goToMen(index)"
        :class="{ 'select-Men': selectMenIndex === index }"
        style="width: 50%; border-bottom: 1px solid #d1e6e2"
      >
        <div class="d-flex" style="justify-content: center; padding: 12px 0">
          <img :src="item.img" width="30" class="m-r-5" />
          <p class="f-t-15 f-w">{{ item.name }}</p>
        </div>
      </div>
    </div> -->
    <div class="mask-cont m-t-10">
      <!-- <div
        class="d-flex"
        style="
          width: 95%;
          margin: 5px auto;
          justify-content: space-between;
          overflow: auto;
        "
      >
        <img
          v-for="(item, index) in [
            `https://file.otgame.bet/static/${getCurrency}/10.png`,
            `https://file.otgame.bet/static/${getCurrency}/11.png`,
            `https://file.otgame.bet/static/${getCurrency}/12.png`,
            `https://file.otgame.bet/static/${getCurrency}/13.png`,
            `https://file.otgame.bet/static/${getCurrency}/14.png`
          ]"
          :key="index"
          :src="item"
          width="31.5%"
          style="border-radius: 10px; margin-right: 10px"
          @click="gotoAc(index)"
        />
      </div> -->
      <!-- <div class="container">
        <common-swiper
          :slides="images"
          :interval="5000"
          :transitionDuration="1000"
          :showArrows="true"
          :showIndicators="true"
        >
          <template #default="{ item }">
            <img
              :src="item"
              style="width: 100%; height: 100%; object-fit: cover"
            />
          </template>
        </common-swiper>
      </div> -->
      <!-- <div class="content-jack">
        <div class="content-jack--c">
          <div class="content-jack--i">
            <div class="number-display">
              <div v-for="(char, index) in formattedNumber" :key="index">
                <img
                  :src="getImagePath(char)"
                  class="number-image"
                  :class="{ 'font-bd': ['.', ','].includes(char) }"
                />
              </div>
            </div>
          </div>
        </div>
      </div> -->

      <!-- <div class="content-winner">
        <div class="d-flex">
          <img
            src="../../assets/img/common/game-icon.png"
            width="20px"
            style="margin-top: -2px"
          />
          <p class="f-t-15 m-l-5 f-w">{{ $lang.home_txt2 }}</p>
        </div>
        <div
          class="winner-carousel-wrap"
          ref="winnerCarouselWrap"
          @touchstart="onWinnerTouchStart"
          @touchmove="onWinnerTouchMove"
          @touchend="onWinnerTouchEnd"
        >
          <div
            class="winner-carousel-track"
            :class="{ 'winner-carousel-no-transition': winnerNoTransition }"
            :style="winnerTrackStyle"
            ref="winnerCarouselTrack"
          >
            <div
              v-for="(item, index) in winnerDisplayList"
              :key="'winner-' + index"
              class="item-sider winner-carousel-item"
            >
              <div style="position: relative">
                <van-image
                  class="swiper-slide--img"
                  :src="item.gameIcon"
                  lazy-load
                  style="height: 82px"
                >
                  <template v-slot:loading>
                    <van-loading size="20" color="#ffa300" vertical />
                  </template>
                </van-image>

                <p
                  class="d-flex"
                  style="
                    position: absolute;
                    right: 0;
                    left: 0;
                    bottom: 2px;
                    margin: 0 auto;
                    font-size: 10px;
                    background: rgba(15, 20, 30, 0.72);
                    height: 35px;
                    justify-content: center;
                    padding-bottom: 5px;
                    padding-top: 5px;
                    border-radius: 0 0 8px 8px;
                    color: var(--wihte-color);
                    text-align: center;
                  "
                >
                  {{ item.gameName }}
                </p>
              </div>

              <div class="item-sider--t">
                <div class="d-flex" style="margin: 8px 0 0">
                  <img
                    src="../../assets/img/common/logo_winner.png"
                    width="10"
                  />
                  <p class="m-l-5">{{ item.userName }}</p>
                </div>
                <p class="primary-color content-winner--t">
                  {{ $formatNumberWithCommas(item.amount) || 0 }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <div class="content-serach" @click="$jumpTo('/searchGame')">
        <div class="search-entry-wrap">
          <img
            src="../../assets/img/common/ssk_com.png"
            width="18"
            class="search-entry-icon"
          />
          <span class="search-entry-placeholder">{{
            $lang.menu_search_placeholder
          }}</span>
        </div>
      </div>
      <div v-if="pgDate.dataList" class="content-tab" ref="targetElement">
        <div class="content-tab--s">
          <van-loading v-if="loading" color="#ffa300" vertical> </van-loading>
        </div>
        <van-tabs
          class="home-category-tabs"
          type="card"
          @click-tab="tabSelect"
          v-model:active="activeTab"
          title-inactive-color="#fff"
          title-active-color="#573900"
          :ellipsis="false"
          swipe-threshold="3"
          lazy-render
        >
          <van-tab v-for="(item, index) in pgDate.dataList" :key="index + 'xx'">
            <template #title>
              <img :src="item.icon" class="tab-icon" />
              <span class="tab-text">{{ item.name }}</span>
            </template>

            <div
              class="content-tab--c"
              style="margin-left: 12px; margin-right: 12px"
            >
              <div v-if="index === 0 && hotGames.length" class="home-hot">
                <div class="home-hot__title">
                  <span class="home-hot__name">🔥 Hot</span>
                </div>
                <div
                  class="home-hot__marquee"
                  @touchstart.passive="onHotTouchStart"
                  @touchmove="onHotTouchMove"
                  @touchend.passive="onHotTouchEnd"
                  @touchcancel.passive="onHotTouchEnd"
                >
                  <div
                    ref="hotTrack"
                    class="home-hot__track"
                    :style="hotTrackStyle"
                  >
                    <div
                      v-for="copy in 2"
                      :key="'hot-copy-' + copy"
                      class="home-hot__group"
                    >
                      <div
                        v-for="hot in hotGames"
                        :key="copy + '-' + (hot.gid || hot.gameCode)"
                        class="home-hot__item"
                        @click="goToHotGame(hot)"
                      >
                        <img
                          class="home-hot__cover"
                          :src="hot.gameIcon"
                          :alt="hot.gameName"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="item.sortType === 1" class="vendor-grid">
                <div
                  v-for="(item2, index2) in item.types"
                  :key="index2"
                  class="vendor-grid__item"
                  @click="goVendor(item2)"
                >
                  <img :src="item2.icon" class="vendor-grid__icon" />
                </div>
              </div>
              <div
                v-else
                v-for="(item2, index2) in getVisibleTypes(item)"
                :key="item2.code || item2.name || index2"
              >
                <resher-siper2
                  v-if="!allOpen && item2"
                  :siderData="item2"
                  :siderIndex="index"
                  @getBack="getBacks"
                  ref="swipe2"
                ></resher-siper2>
              </div>
            </div>
            <!-- <keep-alive>
              <resher-content
                v-if="
                  item.types[typeIndex] &&
                  item.types[typeIndex].games.length > 12 &&
                  allOpen
                "
                :contData="item.types[typeIndex]"
              ></resher-content>
            </keep-alive> -->
          </van-tab>

          <div class="content-bbttom" style="padding: 20px 0 50px">
            <div style="width: 90%; margin: 0 auto">
              <p class="t-c">{{ $lang.common_txt358 }}</p>

              <div class="t-c m-t-20 home-community-icons">
                <img
                  v-for="(item, index) in [
                    {
                      src: require('@/assets/img/otgame/pinduoduo_21.png'),
                      url: 'https://facebook.com',
                    },
                    {
                      src: require('@/assets/img/otgame/pinduoduo_24.png'),
                      url: 'https://twitter.com',
                    },
                    {
                      src: require('@/assets/img/otgame/ins.png'),
                      url: 'https://instagram.com',
                    },
                    {
                      src: require('@/assets/img/otgame/zjm_42.png'),
                      url: 'https://tiktok.com',
                    },
                  ]"
                  :key="index"
                  :src="item.src"
                  class="home-community-icon"
                  @click="openLink(item.url)"
                />
              </div>

              <!-- <img src="../../assets/img/common/logo_h.png" width="100" />
              <p class="m-t-10">
                {{ $lang.common_txt164 }}
              </p> -->

              <!-- <p class="content-line m-t-10"></p> -->
              <!-- <img src="../../assets/img/common/cmc_1.png" width="90%" /> -->
              <p class="content-line m-t-10"></p>

              <template v-if="tgChannelList.length">
                <p class="t-c">{{ $lang.common_txt359 }}</p>
                <div class="home-tg-list">
                  <div
                    v-for="(item, index) in tgChannelList"
                    :key="index"
                    class="home-tg-item"
                    @click="openLink(item.url)"
                  >
                    <img :src="item.src" width="34" alt="" />
                    <span class="home-tg-item__label">{{ item.label }}</span>
                  </div>
                </div>
              </template>
              <p class="content-line m-t-10"></p>
              <home-support-footer />
            </div>
          </div>
        </van-tabs>
      </div>
    </div>

    <!-- <menu-home></menu-home> -->
    <login v-model="showPopup" overlay></login>
    <lucky-roulette v-model="isShowPopup" overlay></lucky-roulette>

    <van-popup
      v-model:show="showDialog"
      class="custom-popup2"
      :closeable="false"
      :close-on-click-overlay="false"
    >
      <div class="cont-redim">
        <!-- <van-button
          @click="submit2"
          size="large"
          class="custom-button"
          style="width: 80%"
        >
          {{ $lang.home_txt9 }}
        </van-button> -->
        <!-- <div
          style="width: 55%; height: 58px; margin: 0 auto"
          @click="submit2"
        ></div> -->
      </div>
      <div class="d-flex-s m-t-10">
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
          <p style="color: var(--wihte-color); font-size: 11px">
            {{ $lang.home_txt7 }}
          </p>
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
          <p style="color: var(--wihte-color); font-size: 11px">
            {{ $lang.home_txt8 }}
          </p>
        </div>
      </div>
      <!-- <div v-if="isCountdownActive" class="counw-cont">
        <div>
          <div class="d-flex-s f-w">
            <p class="counw-cont-bg2">MIN</p>
            <p class="counw-cont-bg2">SEC</p>
          </div>
          <div class="d-flex-s">
            <p class="counw-cont-bg m-r-10">{{ formattedMinutes }}</p>
            <p class="f-w" style="font-size: 25px; color: var(--wihte-color)">:</p>
            <p class="counw-cont-bg m-l-10">{{ formattedSeconds }}</p>
          </div>
        </div>
      </div>  -->

      <img
        class="m-t-10"
        @click="closeF()"
        src="../../assets/img/lucky_jackpot/img_cancel.png"
        width="38"
      />
    </van-popup>
    <activity-popup
      v-model="isShowPopup2"
      @closeActive="closeActive"
      @closeActive2="closeActive2"
    ></activity-popup>
  </div>
</template>
<script>
import {
  GetHomeWinningGameList,
  GetHomeGameList,
  GetIsFbReport,
  ActivitygetRegisterAward,
  GetPlatformList,
  GetInvitationID,
  GetCsLink,
} from "@/api/common";
import { getCsLinksByScene, getCsItemUrl } from "@/utils/csLink";
import { logoutIfReloginRequiredWithToken } from "@/utils/platformAuth";
import { normalizeCountryCode } from "@/utils/country";
import { applyCountryLanguage } from "@/utils/locale";
import { normalizeHomeDataList, getCategoryGames } from "@/utils/homeGameList";
// import ResherSiper from '../../components/home/ResherSiper.vue'
import ResherSiper2 from "../../components/home/ResherSiper2.vue";
import HomeSupportFooter from "../../components/home/HomeSupportFooter.vue";
export default {
  name: "Home",
  components: { ResherSiper2, HomeSupportFooter },

  data() {
    return {
      selectMenIndex: 1,
      totalSeconds: 1800,
      timer5: null,
      isCountdownActive: true,
      agree2: false,
      agree: false,
      isRegister: localStorage.getItem("isRegister"),
      showDialog: false,
      isShowPopup2: false,
      isShowPopup: false,
      showPopup: false,
      itemWidth: 72,
      activeTab: 0,
      prizeAmount: 11002030,
      typeIndex: null,
      allOpen: false,
      loading: false,
      winDate: [],
      pgDate: {},
      winnerOffsetX: 0,
      winnerTouchStartX: 0,
      winnerNoTransition: false,
      winnerAutoplayTimer: null,
      winnerItemWidth: 65,
      winnerGap: 10,
      timer: null,
      serachName: "",
      filteredDataList: [],
      allItems: [],
      currentPage: 0,
      itemsPerPage: 5,
      timer3: null,
      isOtgame: [],
      // Lobby 游戏分类分批挂载
      visibleTypeCount: 3,
      typeRevealTimer: null,
      // Hot 区游戏（dataList 第一项，不进 tab）
      hotGames: [],
      hotOffsetX: 0,
      hotRafId: null,
      hotResumeTimer: null,
      hotPaused: false,
      hotTouchAxis: null,
      hotTouchStartX: 0,
      hotTouchStartY: 0,
      hotTouchLastX: 0,
      hotSetWidth: 0,
      csHomeLinks: [],
    };
  },
  watch: {
    activeTab(val) {
      this.resetVisibleTypes();
      if (val === 0 && this.hotGames.length) {
        this.$nextTick(() => this.startHotAutoScroll());
      } else {
        this.stopHotAutoScroll();
      }
    },
  },
  computed: {
    formattedMinutes() {
      return Math.floor(this.totalSeconds / 60);
    },
    formattedSeconds() {
      return this.formatNumber(this.totalSeconds % 60);
    },
    winnerList() {
      return (this.winDate && this.winDate.dataList) || [];
    },
    winnerDisplayList() {
      const list = this.winnerList;
      if (!list.length) return [];
      return [...list, ...list, ...list];
    },
    winnerTrackStyle() {
      const w = this.winnerItemWidth + this.winnerGap;
      const total = this.winnerDisplayList.length * w;
      return {
        width: total + "px",
        transform: `translate3d(${this.winnerOffsetX}px, 0, 0)`,
      };
    },
    hotTrackStyle() {
      return {
        transform: `translate3d(${-this.hotOffsetX}px, 0, 0)`,
      };
    },
    tgChannelList() {
      const labels = [this.$lang.home_tg_group, this.$lang.home_tg_channel];
      const defaultIcon = require("@/assets/img/otgame/zjm_40.png");
      return (this.csHomeLinks || []).map((item, i) => ({
        src: item.icon || item.linkIcon || defaultIcon,
        label:
          item.linkTitle ||
          item.remark ||
          item.title ||
          labels[i] ||
          item.linkName ||
          "",
        url: getCsItemUrl(item),
      }));
    },
  },
  created() {
    this.GetInvitationID();
    this.GetHomeGameList();
    this.fetchCsHomeLinks();
    // 中奖轮播 UI 已注释，暂不请求，避免多余接口与失败时 loading 卡住
  },
  async mounted() {
    this.GetPlatformList();
    const today = new Date().toISOString().split("T")[0];

    if (sessionStorage.getItem("neverShowToday2") === today) {
      this.showDialog = false;
    } else if (localStorage.getItem("neverShow2")) {
      this.showDialog = false;
    } else {
      // this.showDialog = true
    }
    // if (
    //   localStorage.getItem('isRegister') === 'isRegister' &&
    //   this.isShowPopup2 === false
    // ) {
    //   this.showDialog = true
    // this.resetCountdown()
    // }
    this.$bus.on("message-sent", (v) => {
      this.scrollToTarget();
      this.activeTab = v;
    });
  },
  activated() {
    if (this.winnerList.length) {
      this.winnerStartAutoplay();
    }
    this.$nextTick(() => this.startHotAutoScroll());
  },
  deactivated() {
    this.winnerStopAutoplay();
    this.stopTypeReveal();
    this.stopCountdown();
    this.stopHotAutoScroll();
    this.clearHotResumeTimer();
    if (this.timer3) {
      clearInterval(this.timer3);
      this.timer3 = null;
    }
  },
  beforeUnmount() {
    this.winnerStopAutoplay();
    this.stopTypeReveal();
    this.stopCountdown();
    this.stopHotAutoScroll();
    this.clearHotResumeTimer();
    if (this.timer3) {
      clearInterval(this.timer3);
      this.timer3 = null;
    }
    this.$bus.off("message-sent");
  },
  methods: {
    clearHotResumeTimer() {
      if (this.hotResumeTimer) {
        clearTimeout(this.hotResumeTimer);
        this.hotResumeTimer = null;
      }
    },
    measureHotSetWidth() {
      const track = this.$refs.hotTrack;
      if (track && track.scrollWidth > 0) {
        this.hotSetWidth = track.scrollWidth / 2;
        return this.hotSetWidth;
      }
      // 图片未加载完时用固定尺寸估算：145 宽 + 10 间距
      const n = this.hotGames.length;
      this.hotSetWidth = n > 0 ? n * 155 : 0;
      return this.hotSetWidth;
    },
    wrapHotOffset() {
      const w = this.hotSetWidth || this.measureHotSetWidth();
      if (!w) return;
      while (this.hotOffsetX >= w) this.hotOffsetX -= w;
      while (this.hotOffsetX < 0) this.hotOffsetX += w;
    },
    stopHotAutoScroll() {
      if (this.hotRafId) {
        cancelAnimationFrame(this.hotRafId);
        this.hotRafId = null;
      }
    },
    startHotAutoScroll() {
      this.stopHotAutoScroll();
      if (!this.hotGames.length) return;
      this.hotPaused = false;
      this.$nextTick(() => {
        this.measureHotSetWidth();
        if (!this.hotSetWidth) return;
        const tick = () => {
          // 每帧再量一次，等图片加载后校正宽度
          if (!this.hotSetWidth || this.hotSetWidth < 10) {
            this.measureHotSetWidth();
          }
          if (!this.hotPaused && this.hotSetWidth) {
            this.hotOffsetX += 0.55;
            this.wrapHotOffset();
          }
          this.hotRafId = requestAnimationFrame(tick);
        };
        this.hotRafId = requestAnimationFrame(tick);
      });
    },
    onHotTouchStart(e) {
      if (!e.touches || !e.touches.length) return;
      this.clearHotResumeTimer();
      this.hotPaused = true;
      this.measureHotSetWidth();
      const t = e.touches[0];
      this.hotTouchAxis = null;
      this.hotTouchStartX = t.clientX;
      this.hotTouchStartY = t.clientY;
      this.hotTouchLastX = t.clientX;
    },
    onHotTouchMove(e) {
      if (!e.touches || !e.touches.length) return;
      const t = e.touches[0];
      const dx = t.clientX - this.hotTouchStartX;
      const dy = t.clientY - this.hotTouchStartY;
      if (!this.hotTouchAxis) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        this.hotTouchAxis = Math.abs(dx) >= Math.abs(dy) ? "x" : "y";
      }
      // 纵向：不拦截，交给页面滚动
      if (this.hotTouchAxis === "y") return;
      e.preventDefault();
      const delta = t.clientX - this.hotTouchLastX;
      this.hotTouchLastX = t.clientX;
      this.hotOffsetX -= delta;
      this.wrapHotOffset();
    },
    onHotTouchEnd() {
      this.hotTouchAxis = null;
      this.clearHotResumeTimer();
      this.hotResumeTimer = setTimeout(() => {
        this.hotPaused = false;
        if (!this.hotRafId) this.startHotAutoScroll();
        this.hotResumeTimer = null;
      }, 1200);
    },
    getVisibleTypes(item) {
      if (!item || !Array.isArray(item.types)) return [];
      // 厂商宫格很轻，一次全量
      if (item.sortType === 1) return item.types;
      return item.types.slice(0, this.visibleTypeCount);
    },
    stopTypeReveal() {
      if (this.typeRevealTimer == null) return;
      if (typeof window.cancelIdleCallback === "function") {
        try {
          window.cancelIdleCallback(this.typeRevealTimer);
        } catch (e) {
          /* ignore */
        }
      }
      clearTimeout(this.typeRevealTimer);
      this.typeRevealTimer = null;
    },
    resetVisibleTypes() {
      this.stopTypeReveal();
      this.visibleTypeCount = 3;
      this.$nextTick(() => this.scheduleRevealTypes());
    },
    scheduleRevealTypes() {
      const tab = this.pgDate.dataList && this.pgDate.dataList[this.activeTab];
      if (!tab || tab.sortType === 1 || !Array.isArray(tab.types)) return;
      const total = tab.types.length;
      if (this.visibleTypeCount >= total) return;

      const expand = () => {
        const current =
          this.pgDate.dataList && this.pgDate.dataList[this.activeTab];
        if (!current || !Array.isArray(current.types)) return;
        if (this.visibleTypeCount >= current.types.length) return;
        this.visibleTypeCount = Math.min(
          this.visibleTypeCount + 2,
          current.types.length,
        );
        if (this.visibleTypeCount < current.types.length) {
          const ric = window.requestIdleCallback;
          if (typeof ric === "function") {
            // timeout 过大时 idle 一有空就刷；过小会约每 120ms 挂一批图，网络一直忙、标签页一直转
            this.typeRevealTimer = ric(() => expand(), { timeout: 900 });
          } else {
            this.typeRevealTimer = setTimeout(expand, 450);
          }
        }
      };

      const ric = window.requestIdleCallback;
      if (typeof ric === "function") {
        this.typeRevealTimer = ric(() => expand(), { timeout: 900 });
      } else {
        this.typeRevealTimer = setTimeout(expand, 450);
      }
    },
    async fetchCsHomeLinks() {
      try {
        const data = await GetCsLink();
        const content = data && data.content ? data.content : data;
        this.csHomeLinks = getCsLinksByScene(content, "home");
      } catch (e) {
        this.csHomeLinks = [];
      }
    },
    openLink(url) {
      if (!url) return;
      window.open(url, "_blank");
    },
    async GetInvitationID() {
      const data = await GetInvitationID({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.invitCode) {
          localStorage.setItem("id", data.content.invitCode);
          setTimeout(() => {
            this.GetIsFbReport();
          }, 200);
        }
      }
    },
    async GetPlatformList() {
      const data = await GetPlatformList();
      if (data.status === "ok") {
        const list = data.content.list || [];
        const path = this.$route.path; // 此时path的值是 "/NG/home"
        // 按/分割路径，过滤空字符串（避免开头/导致的空元素）
        const pathArr = path.split("/").filter((item) => item);
        // 分割后数组是 ["NG", "home"]，取第一个元素就是NG
        if (pathArr.length > 1) {
          const currentCountry = normalizeCountryCode(pathArr[0]);
          let newArr = list.filter((item) => item.country === currentCountry);
          if (newArr.length === 0) {
            return;
          }
          const prevPlatform = localStorage.getItem("platform");
          logoutIfReloginRequiredWithToken(prevPlatform, newArr[0].platform);
          const next = newArr[0];
          if (next.currency) localStorage.setItem("currency", next.currency);
          if (next.areaCode) localStorage.setItem("areaCode", next.areaCode);
          if (next.currencyUnit)
            localStorage.setItem("currencyUnit", next.currencyUnit);
          if (next.platform) localStorage.setItem("platform", next.platform);
          // 无语言时按本地国家→语言映射补齐；有手动选择则不覆盖
          if (!localStorage.getItem("defaultLanguage")) {
            applyCountryLanguage(next);
          }
          if (next.iconUrl) localStorage.setItem("iconUrl", next.iconUrl);
          if (next.countryName)
            localStorage.setItem("countryName", next.countryName);
          if (next.country) localStorage.setItem("country", next.country);
          // setTimeout(() => {
          //   window.location.reload()
          // }, 200)
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    // noticeText(dataArr) {
    //   if (dataArr) {
    //     return dataArr
    //       .map(
    //         (item) =>
    //           `${item.userName} : ${
    //             this.$lang.home_txt
    //           } ${this.$formatNumberWithCommas(item.amount)} ${
    //             this.$lang.BRL
    //           }  `
    //       )
    //       .join('  |  ') // 使用分隔符区分不同通知
    //   }
    // },
    gotoAc(i) {
      if (i === 0) {
        this.$jumpTo("/Crowdfunding");
      } else if (i === 1) {
        this.$jumpTo("/signIn");
      } else if (i === 2) {
        this.$jumpTo("/redPacket");
      } else if (i === 3) {
        this.$jumpTo("/referFriend");
      } else if (i === 4) {
        this.$jumpTo("/cashBack");
      }
    },
    serachGo() {
      this.$jumpTo("/category");
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
    resetCountdown() {
      // 重置倒计时
      this.stopCountdown();
      this.isCountdownActive = true;
      this.totalSeconds = 1800; // 重置为30分钟
      const endTime = Math.floor(Date.now() / 1000) + this.totalSeconds;
      localStorage.setItem("countdownEndTime", endTime);
      this.startCountdown();
    },
    formatNumber(num) {
      return num.toString().padStart(2, "0");
    },
    startCountdown() {
      this.timer5 = setInterval(() => {
        this.totalSeconds--;

        if (this.totalSeconds <= 0) {
          this.stopCountdown();
          this.isCountdownActive = false;
          localStorage.removeItem("countdownEndTime");
        }
      }, 1000);
    },
    stopCountdown() {
      if (this.timer5) {
        clearInterval(this.timer5);
        this.timer5 = null;
      }
    },
    initCountdown() {
      const storedEndTime = localStorage.getItem("countdownEndTime");

      if (storedEndTime) {
        const endTime = parseInt(storedEndTime);
        const currentTime = Math.floor(Date.now() / 1000);

        if (currentTime < endTime) {
          this.totalSeconds = endTime - currentTime;
          this.startCountdown();
        } else {
          this.isCountdownActive = false;
        }
      } else {
        const endTime = Math.floor(Date.now() / 1000) + this.totalSeconds;
        localStorage.setItem("countdownEndTime", endTime);
        this.startCountdown();
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
      this.showDialog = false;
    },
    submit2() {
      localStorage.removeItem("isRegister");
      sessionStorage.removeItem("neverShowToday2");
      localStorage.removeItem("neverShow2");
      this.showDialog = false;
      // this.$router.push('/recharge')
      if (this.token) {
        this.isShowPopup2 = false;
        this.$jumpTo("/rechargeCont");
      } else {
        this.isShowPopup2 = false;
        this.showPopup = true;
      }
    },
    async GetIsFbReport() {
      const data = await GetIsFbReport({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        // 设置 Facebook Pixel ID
        if (data.content.isReport) {
          if (data.content.target === "ks") {
            const pixId = data.content.fbPixId;
            const run = () => {
              if (!window.kwaiq || !pixId) return;
              try {
                window.kwaiq.load(pixId);
                window.kwaiq.instance(pixId).track("contentView");
              } catch (e) {
                /* CDN 不可达时忽略 */
              }
            };
            if (typeof window.requestIdleCallback === "function") {
              window.requestIdleCallback(run, { timeout: 2500 });
            } else {
              setTimeout(run, 1200);
            }
          } else {
            console.log(123);

            this.$pixel.setFbId(data.content.fbPixId);
            this.$pixel.callTrack("track", "ViewContent");
            const jsonData = `"""{"data":[{"event_name": "ViewContent", "content_name": "Open Home Page", "content_category": "Electronics", "content_ids": [], "content_type": "product", "value": 0.00, "currency": "NGN"}]}"""`;
            this.$pixel.sendEventToAndroid(jsonData);
          }
        }
      }
    },

    getImagePath(char) {
      return this.numberImages[char];
    },
    // addRandomValue() {
    //   // 随机增加整数部分 1-100
    //   const integerRandom = Math.floor(Math.random() * 100) + 1
    //   // 随机增加小数部分 0.01-0.99
    //   const decimalRandom = (Math.floor(Math.random() * 100) / 100).toFixed(2)
    //   // 将小数部分转换为数值
    //   const decimalValue = parseFloat(decimalRandom)
    //   // 更新当前值
    //   this.currentValue += integerRandom + decimalValue
    //   // 确保小数点后两位
    //   this.currentValue = parseFloat(this.currentValue.toFixed(2))
    //   // 保存到 localStorage
    //   localStorage.setItem('savedValue', this.currentValue)
    // },
    // startTimer() {
    //   this.timer2 = setInterval(() => {
    //     this.addRandomValue()
    //   }, 1000)
    // },
    startTimer2() {
      this.timer3 = setInterval(() => {
        this.currentPage++;
        if (this.currentPage * this.itemsPerPage >= this.allItems.length) {
          this.currentPage = 0;
        }
      }, 3000); // 每 3 秒切换一次
    },
    loadSavedValue() {
      const savedValue = localStorage.getItem("savedValue");
      if (savedValue) {
        // if (savedValue > 99999999) {
        //   this.currentValue = 10029898.87
        // } else {
        this.currentValue = parseFloat(savedValue);
        // }
      }
    },
    gotoRefer() {
      this.$jumpTo("/referFriend");
    },
    async scrollToTarget() {
      if (!this.$refs.targetElement) return;
      const { default: scrollIntoView } =
        await import("scroll-into-view-if-needed");
      scrollIntoView(this.$refs.targetElement, {
        behavior: "smooth",
        block: "start",
      });
    },
    getBacks() {
      this.scrollToTarget();
    },
    tabSelect() {
      this.allOpen = false;
      this.resetVisibleTypes();
    },
    goVendor(vendor) {
      this.$jumpTo("/category", { vendorCode: vendor.code });
    },
    // 是否展开全部
    openAll(item, index) {
      this.allOpen = true;
      this.typeIndex = index;
      this.$jumpTo("/category");
      // scrollIntoView(this.$refs.targetElement, {
      //   behavior: 'smooth', // 平滑滚动
      //   block: 'start' // 垂直方向对齐方式
      // })
    },
    goToHotGame(game) {
      if (!game) return;
      if (this.token || localStorage.getItem("token")) {
        this.$launchGame({
          type: "hall",
          gid: game.gid,
          isDemo: 0,
          from: "game",
        });
      } else if (this.$bus) {
        this.$bus.emit("openLogin");
      }
    },
    async GetHomeGameList() {
      const data = await GetHomeGameList();
      if (data.status === "ok") {
        this.pgDate = data.content || {};
        const rawList = Array.isArray(this.pgDate.dataList)
          ? this.pgDate.dataList
          : [];
        // Hot 取数组第一项；兼容扁平 games / 树形 types
        const hotList = getCategoryGames(rawList[0]);
        this.hotGames = hotList;
        this.$nextTick(() => this.startHotAutoScroll());
        // 过滤掉第一项 Hot、以及 sortType === 2
        // 兼容 partType=1 扁平列表 与 partType=3 树形：统一成 types[].games
        const rest = normalizeHomeDataList(
          rawList.slice(1).filter((item) => item && item.sortType !== 2),
        );

        const typesArr = rest
          .filter((item) => item.sortType !== 1)
          .flatMap((item) => item.types || [])
          .filter((type) => type && Array.isArray(type.games));

        this.pgDate.dataList = [
          {
            name: "Lobby",
            icon: require("@/assets/img/common/all_home.png"),
            types: typesArr,
            sortType: 0,
          },
          ...rest,
        ];
        this.resetVisibleTypes();
      }
    },
    async GetHomeWinningGameList() {
      this.loading = true;
      try {
        const data = await GetHomeWinningGameList();
        if (data.status === "ok") {
          this.winDate = data.content;
          this.allItems = data.content.dataList;
          this.winnerOffsetX = -(
            this.winnerList.length *
            (this.winnerItemWidth + this.winnerGap)
          );
          this.$nextTick(() => this.winnerStartAutoplay());
        }
      } finally {
        this.loading = false;
      }
    },
    // 中奖轮播：将 offset 限制在中间段，避免露馅
    winnerClampOffset() {
      const list = this.winnerList;
      if (!list.length) return;
      const w = this.winnerItemWidth + this.winnerGap;
      const segment = list.length * w;
      if (this.winnerOffsetX >= 0) {
        this.winnerNoTransition = true;
        this.winnerOffsetX = -segment;
        this.$nextTick(() => {
          this.winnerNoTransition = false;
        });
      } else if (this.winnerOffsetX <= -segment * 2) {
        this.winnerNoTransition = true;
        this.winnerOffsetX = -segment;
        this.$nextTick(() => {
          this.winnerNoTransition = false;
        });
      }
    },
    onWinnerTouchStart(e) {
      this.winnerStopAutoplay();
      this.winnerTouchStartX = e.touches[0].clientX;
    },
    onWinnerTouchMove(e) {
      const dx = e.touches[0].clientX - this.winnerTouchStartX;
      this.winnerTouchStartX = e.touches[0].clientX;
      this.winnerOffsetX += dx;
    },
    onWinnerTouchEnd() {
      this.winnerClampOffset();
      this.winnerStartAutoplay();
    },
    winnerStartAutoplay() {
      this.winnerStopAutoplay();
      if (!this.winnerList.length) return;
      const w = this.winnerItemWidth + this.winnerGap;
      this.winnerAutoplayTimer = setInterval(() => {
        this.winnerOffsetX -= w;
        this.winnerClampOffset();
      }, 3000);
    },
    winnerStopAutoplay() {
      if (this.winnerAutoplayTimer) {
        clearInterval(this.winnerAutoplayTimer);
        this.winnerAutoplayTimer = null;
      }
    },
    goToDetail(i) {
      if (i === 0) {
        this.$jumpToh("/vipSignIn");
      } else if (i === 1) {
        this.$jumpTo("/cashBack");
      } else if (i === 2) {
        this.$jumpTo("/signIn");
      } else if (i === 3) {
        this.$jumpTo("/share");
      }
    },
  },
};
</script>
<style lang="less" scoped>
.otag-gg {
  // background: url('../../assets/img/otgame/gonggao_07.png') no-repeat;
  height: 45px;
  background-size: 100% 100%;
}
.image-bottom—container {
  display: flex; /* 使用 Flex 布局 */
  flex-direction: row; /* 水平排列 */
  justify-content: space-between; /* 可选值：space-between / center / space-around / space-evenly */
  align-items: center; /* 垂直居中 */
  padding-bottom: 15px;
}
.image—logo {
  width: auto;
  height: 30px;
  object-fit: cover;
  border-radius: 0px;
}
.image-bottom—text {
  font-size: 12px;
  word-wrap: break-word;
}
.content {
  // padding-top: 60px;
  margin-bottom: 12%;
  // background: @background-color;
  // background: url('../../assets/img/page_bg2.png') no-repeat center center;
  background-size: cover;
  // height: 100vh;
  // overflow-y: scroll;
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
  :deep(.van-overlay) {
    z-index: 1999 !important;
  }
  .notice-swipe {
    height: 20px;
    line-height: 20px;
    display: flex;
    overflow-x: auto;
    white-space: nowrap;
  }
}
.content-swiper {
  width: 100%;
  text-align: center;
}
// ====== BANNER SWIPER ======
.banner-swiper {
  padding: 0 12px;
  margin-bottom: 10px;

  &__swipe {
    border-radius: 10px;
    overflow: hidden;
  }

  &__img {
    width: 100%;
    display: block;
    border-radius: 10px;
  }

  :deep(.van-swipe__indicator--active) {
    background: #ffa300;
    width: 16px;
    border-radius: 4px;
  }

  :deep(.van-swipe__indicator) {
    background: rgba(255, 255, 255, 0.4);
  }
}
.content-swiper--img {
  border-radius: 10px;
  width: 100%;
  margin-top: 10px;
  padding: 0 15px;
}
.content-serach {
  margin: 10px auto 10px;
  width: 94%;
  scroll-margin-top: 32px; /* 向上偏移 50px */
}
.search-entry-wrap {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  background: linear-gradient(96.49deg, #1d1400 2.73%, #000000 97.68%);
  border: 1px solid rgba(233, 182, 90, 0.2);
  border-radius: 10px;
  cursor: pointer;
  .search-entry-icon {
    flex-shrink: 0;
    margin-right: 8px;
    opacity: 0.9;
  }
  .search-entry-placeholder {
    color: rgba(168, 155, 124, 0.9);
    font-size: 14px;
  }
}
.custom-field {
  padding: 5px;
  background: linear-gradient(96.49deg, #1d1400 2.73%, #000000 97.68%);
  border-radius: 10px;
  border: 1px solid rgba(233, 182, 90, 0.2);
  :deep(.van-field__control) {
    color: @wihte-color;
  }
}
.van-cell {
  color: @wihte-color;
}
:deep(.van-field__value) {
  caret-color: #ffa300; /* 输入框光标颜色 */
}
.custom-button {
  padding: 16px 5px;
  background-color: @primary-color; /* 按钮背景颜色 */
  color: @wihte-color; /* 按钮文字颜色 */
  border: none; /* 去除边框 */
  border-radius: 8px;
  font-size: 12px;
}
.content-winner {
  width: 94%;
  margin: 15px auto 0;
}
/* 自定义中奖轮播：从左到右、可左右滑动、无限循环 */
.winner-carousel-wrap {
  margin-top: 15px;
  overflow: hidden;
  touch-action: pan-y pinch-zoom;
  height: 145px;
}
.winner-carousel-track {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
  transition: transform 0.3s ease-out;
}
.winner-carousel-no-transition {
  transition: none !important;
}
.winner-carousel-item {
  flex-shrink: 0;
  width: 65px;
  margin-right: 10px;
}

.content-winne--swiper {
  .swiper-slide {
    text-align: center;
    font-size: 10px;
  }
  .swiper-slide .swiper-slide--img {
    border-radius: 8px;
    height: 80px;
    width: 120px;
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
}
.tab-icon {
  height: 22px;
  width: auto;
  max-width: 40px;
  margin-right: 6px;
  object-fit: contain;
  object-position: center;
  flex-shrink: 0;
  display: block;
}

.content-tab {
  margin: 0 auto;
  width: 100%;
}

/* y7 风格分类 tab */
.home-category-tabs {
  width: 100%;
  margin: 8px auto 0;

  .tab-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 72px;
    line-height: 1;
  }

  :deep(.van-tabs__nav--card) {
    margin: 0 !important;
    border: none;
  }

  :deep(.van-tab__text) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: max-content;
    font-size: 13px;
    line-height: 1;
  }

  :deep(.van-tabs__nav) {
    height: 50px;
    box-sizing: border-box;
    background: none;
    align-items: center;
  }

  :deep(.van-tabs__content) {
    padding-top: 12px;
  }

  :deep(.van-tabs__wrap) {
    height: 51px;
    border-radius: 30px 0 0 30px;
    border: 1px solid #ffa20071;
    padding: 0 5px;
    box-sizing: border-box;
    background: #2e2d2b;
  }

  :deep(.van-tab) {
    height: 40px;
    line-height: 1;
    border-radius: 30px;
    padding: 0 12px;
    margin: auto;
    flex: none;
    color: #fff;
    font-size: 12px;
    border-right: none;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  :deep(.van-tab--active) {
    font-size: 13px;
    font-weight: 700;
    background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
    color: #573900 !important;
  }

  :deep(.van-tabs__line) {
    display: none;
  }
}

:deep(.van-sticky--fixed) {
  top: 50px;
}

/* Hot：自动无缝滚动 + 触摸时可左右滑动 */
.home-hot {
  margin: 0 0 14px;

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-weight: 700;
    font-size: 16px;
    color: #fff;
  }

  &__marquee {
    overflow: hidden;
    width: 100%;
    padding: 2px 0 8px;
    touch-action: pan-y;
    cursor: grab;
  }

  &__track {
    display: flex;
    width: max-content;
    will-change: transform;
  }

  &__group {
    display: flex;
    flex-wrap: nowrap;
    gap: 10px;
    padding-right: 10px;
  }

  &__item {
    flex: 0 0 145px;
    width: 145px;
    cursor: pointer;
  }

  &__cover {
    width: 145px;
    height: auto;
    display: block;
    border-radius: 10px;
    object-fit: cover;
    pointer-events: none;
  }
}
.vendor-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  padding: 10px 0;
}
.vendor-grid__item {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:active {
    opacity: 0.7;
  }
}
.vendor-grid__icon {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: contain;
  background: #2a2418;
}
.vendor-grid__name {
  margin-top: 6px;
  font-size: 11px;
  color: #c4c4c4;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 70px;
}
.content-tab--ct {
  margin: 0 0 5px;
  justify-content: space-between;
}
.content-tab--ctt {
  // background-color: #262e3d;
  border-radius: 10px;
  padding: 6px 9px;
}
.content-tab--ctt2 {
  background: url(../../assets/img/home/selecct-game.png) no-repeat; /* 浅蓝色透明背景 */
  background-size: 100% 100%;
  min-width: 42px;
  text-align: center;
  padding: 5px 0;
  color: @font-color;
}
.home-community-icons {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
}

.home-community-icon {
  width: 35px;
  height: auto;
  max-width: 100%;
  display: block;
  cursor: pointer;
}

.content-bbttom {
  width: 100%;
  // padding-bottom: 10%;
  // padding-top: 12px;
  // margin-top: 3%;
  // background: url('../../assets/img/home/home_bottom_bg.jpg') no-repeat;
  // height: 435px;
  // background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  padding-bottom: 15px;
}

.content-line {
  margin: 15px auto;
  width: 100%;
  height: 1px;
  background: #2a2418;
  opacity: 0.7;
}
.home-tg-list {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin-top: 20px;
}
.home-tg-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}
.home-tg-item__label {
  margin-top: 6px;
  font-size: 11px;
  color: #fff;
  letter-spacing: 0.3px;
}
.content-bbttom--3 {
  width: 88%;
  margin: 2% auto 0;
}
.item-sider {
  width: 65px; /* 单个元素的宽度 */
  // height: 85px; /* 单个元素的高度 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  :deep(.van-image__img) {
    border-radius: 8px;
  }
}
.my-swipe {
  margin-top: 15px;
  position: relative;
  height: 108px;
  text-align: center;
}
.item-sider--t {
  position: relative;
  bottom: 0;
  font-size: 9px;
  text-align: center;
}
.jackpot-c {
  padding: 2.5%;
}
.jackpot-bg {
  position: relative;
  margin-top: 5px;
  background-image: url("../../assets/img/home/home_jack_pot_item_bg.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  height: 140px;
  padding: 30px 0 0 10px;
}
.jackpot-bg--i {
  position: absolute;
  width: 120px;
  left: 63px;
  top: -3px;
}
.jackpot-bg--i2 {
  position: absolute;
  width: 67px;
  left: 89px;
  top: 0;
}
.prize-pool {
  font-size: 30px;
}
.rolling-number {
  font-weight: bold; /* 加粗 */
  font-size: 32px; /* 字体大小 */
  letter-spacing: 5px; /* 字间距 */
}
.rolling-number span {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  line-height: 24px;
  white-space: nowrap;
  animation: roll 1s steps(3) infinite;
}
@keyframes roll {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}
.game-bg {
  background-image: url("../../assets/img/home/home_six_game.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  height: 50px;
  width: 60%;
  margin-top: 10px;
  padding-left: 5px;
  img {
    width: 30px;
    margin: 5px 5px 0 0;
  }
}
.search-content {
  padding: 3%;
  :deep(.van-image__img) {
    border-radius: 11px;
  }
  .resher-content--b {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-flow: wrap row;
  }
  .resher-content--img {
    width: 31.2%;
    // height: 145px;
    margin-bottom: 10px;
  }
  .resher-content--b > div:last-child {
    margin-right: 31.2%; /* 或者padding-right */
  }
}
:deep(.custm-swiper) {
  width: 100%;
  .van-swipe__indicator {
    width: 13px;
    border-radius: 12px;
    color: transparent !important;
  }
  .van-swipe__indicator--active {
    width: 35px;
    color: transparent !important;
  }
}
.content-c2 {
  width: 88%;
  margin: 8px auto 0;
  text-align: center;
  img {
    margin-bottom: 5px;
    width: 42px;
  }
}
.content-c3--Copy {
  background: url("../../assets/img/common/top-3-game.png") no-repeat; /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  width: 92%;
  height: 70px;
  margin: 0 auto 18px;
  padding: 10px 20px;
}
.content-c3 {
  background: url("../../assets/img/common/top-2-game.png") no-repeat; /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  width: 92%;
  height: 70px;
  margin: 0 auto 18px;
  padding: 10px 20px;
  .content-c3--f {
    background: #f8da29;
    color: @black-color;
    padding: 5px;
    text-align: center;
    border-radius: 15px;
    width: 210px;
    font-size: 10px;
    font-weight: bold;
    margin-top: 3px;
  }
}
.content-jack {
  .content-jack--c {
    margin-top: 12px;
    margin-bottom: 12px;
    width: 100%;
    .content-jack--i {
      background: url("../../assets/img/common/jiangc-1.png") no-repeat center
        center;
      background-size: 100% 100%;
      text-align: center;
      height: 103px;
      padding-top: 48px;
      width: 90%;
      margin: 0 auto;
    }
  }
}
.number-display {
  display: flex;
  align-items: flex-end;
  gap: 5px; /* 调整图片间距 */
  justify-content: center;
}

.number-image {
  // width: 14px;
  height: 20px;
  object-fit: cover;
}
.font-bd {
  width: 6px;
  height: 7px;
}
.jackt-temp {
  width: 94%;
  margin: 0 auto;
}
.jackt-temp2 {
  width: 94%;
  margin: 5px auto 0;
  background: #2a2418;
  border-radius: 7px;
  padding: 8px 10px;
}
.content-tab--s {
  :deep(.van-loading) {
    background: transparent;
  }
}
.notice-bar {
  display: flex;
  align-items: center;
  margin: 10px;
  font-size: 14px;
  color: @black-color;
}

.notice-text-wrapper {
  display: flex;
  align-items: center;
  background-color: #edf9f5a8;
  margin-right: 10px;
  border-radius: 6px;
  padding: 6px;
  flex: 1;
  overflow: hidden;
  position: relative;
}

.inner-icon {
  width: 18px;
  height: 14px;
  flex-shrink: 0;
  margin-right: 6px;
}

.scroll-container {
  overflow: hidden;
  white-space: nowrap;
  flex: 1;
  position: relative;
}

.notice-text {
  display: inline-block;
  white-space: nowrap;
  font-weight: 500;
  animation: scroll-text 10s linear infinite;
  animation-play-state: running !important;
}

.notice-text-wrapper:hover .notice-text {
  animation-play-state: paused;
}

@keyframes scroll-text {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(-100%);
  }
}

.news-icon {
  height: 21px;
  width: auto;
  flex-shrink: 0;
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
.counw-cont {
  display: flex;
  justify-content: center;
  .counw-cont-bg {
    background: linear-gradient(to bottom, #fe1300, #ff4a01, #ff8a00);
    font-weight: bold;
    padding: 8px 20px;
    border-radius: 8px;
    font-size: 25px;
    color: @wihte-color;
  }
  .counw-cont-bg2 {
    padding: 8px 20px;
    color: @wihte-color;
  }
}
// .mask-cont {
//   background: url(../../assets/img/home/mask_bg.png) no-repeat;
//   background-size: 100% 100%;
//   background: linear-gradient(to right, #14141e, #14141e, #14141e, #3a1c2b);
//   padding-bottom: 10px;
// }
// .content-swiper-bg {
//   background: url('../../assets/img/home/bg-show2.png') no-repeat;
//   background-size: 100% 100%;
// }
.van-notice-bar {
  // height: 32px;
  width: 93%;
  border-radius: 10px;
  margin-left: 3%;
  padding: 0 10px;
  background: rgba(255, 255, 255, 0.04);
}
.bot-swiper-b {
  :deep(.van-swipe__indicator--active) {
    width: 25px !important;
    border-radius: 10px !important;
  }
  :deep(.van-swipe__indicator) {
    width: 12px;
    border-radius: 10px !important;
  }
  :deep(.van-swipe__indicators) {
    bottom: 0px;
  }
}
.content-bbttom--1 {
  text-align: center;
}
.content-bbttom--1 :first-child img {
  width: 138px;
  height: 28px;
  margin-top: 15px;
}
.content-bbttom--1 :nth-child(2) img {
  width: 40px;
  height: 50px;
}
.content-bbttom--1 :nth-child(3) img {
  width: 50px;
  height: 50px;
  margin-left: 10px;
}
.select-Men {
  background: #ffa300 !important;
  color: #573900 !important;
  border-bottom: 1px solid #ffa300 !important;
}
/* PC 端样式 */
@media (min-width: 769px) {
  .cont-redim {
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
</style>
