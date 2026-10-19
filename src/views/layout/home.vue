<template>
  <div class="content">
    <div class="mask-cont">
      <div class="home-act-list">
        <div
          v-for="item in homeActList"
          :key="item.key"
          class="home-act-list__item"
          :class="'is-' + item.key"
          @click="onHomeActClick(item)"
        >
          <div class="home-act-list__art">
            <img class="home-act-list__entry" :src="item.entryImg" alt="" />
          </div>
          <button
            type="button"
            class="home-act-list__btn"
            :class="
              item.key === 'envelope' && isCountdownActive
                ? 'is-timer'
                : 'btn-3d-green'
            "
          >
            <span class="home-act-list__btn-text">
              <template v-if="item.key === 'envelope' && isCountdownActive">
                {{ envelopeCountdownText }}
              </template>
              <template v-else>{{ item.btn }}</template>
            </span>
          </button>
        </div>
      </div>

      <div v-if="pgDate.dataList" class="content-tab" ref="targetElement">
        <div class="content-tab--s">
          <van-loading v-if="loading" color="#ffa300" vertical> </van-loading>
        </div>
        <div class="home-cat-bar">
          <div class="home-cat-bar__search" @click="$jumpTo('/searchGame')">
            <img
              class="home-cat-bar__search-icon"
              src="@/assets/img/home/top_search.png"
              alt=""
            />
          </div>
          <van-tabs
            class="home-category-tabs"
            type="card"
            @click-tab="tabSelect"
            v-model:active="activeTab"
            title-inactive-color="#fff"
            title-active-color="#fff"
            :ellipsis="false"
            swipe-threshold="3"
            lazy-render
          >
            <van-tab
              v-for="(item, index) in pgDate.dataList"
              :key="index + 'xx'"
            >
              <template #title>
                <span class="tab-text">{{ item.name }}</span>
              </template>

              <div
                class="content-tab--c"
                style="margin-left: 12px; margin-right: 12px"
              >
                <!-- 类型不足 3 个：插图直接放在分类栏下方 -->
                <div
                  v-if="index === 0 && shouldShowStakeChestBeforeTypes(item)"
                  class="home-stake-chest"
                  role="button"
                  @click="goWeeklyMissions"
                >
                  <img
                    class="home-stake-chest__img"
                    :src="stakeRewardChestImg"
                    alt=""
                  />
                </div>

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
                            loading="lazy"
                            decoding="async"
                          />
                          <img class="home-hot__frame" :src="hotFrame" alt="" />
                          <img
                            v-if="hotWinSrc(hot.maxWinText)"
                            class="home-hot__mult"
                            :src="hotWinSrc(hot.maxWinText)"
                            alt=""
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
                    <img
                      :src="item2.icon"
                      class="vendor-grid__icon"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>
                <template v-else>
                  <template
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
                    <!-- 第 3 个分类游戏后插入 -->
                    <div
                      v-if="
                        index === 0 &&
                        shouldShowStakeChestAfterType(item, index2)
                      "
                      class="home-stake-chest"
                      role="button"
                      @click="goWeeklyMissions"
                    >
                      <img
                        class="home-stake-chest__img"
                        :src="stakeRewardChestImg"
                        alt=""
                      />
                    </div>
                  </template>
                </template>
              </div>
            </van-tab>

            <div class="content-bbttom">
              <div class="content-bbttom__inner">
                <img
                  class="content-bbttom__brand"
                  loading="lazy"
                  decoding="async"
                  src="@/assets/img/tabbar/tabqb.png"
                  alt=""
                />
                <p class="t-c" style="font-size: 18px; font-weight: 700">
                  {{ $lang.common_txt358 }}
                </p>

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
                    loading="lazy"
                    decoding="async"
                    @click="openLink(item.url)"
                  />
                </div>

                <p class="content-line m-t-10"></p>

                <template v-if="tgChannelList.length">
                  <p class="t-c" style="font-size: 14px; font-weight: 700">
                    {{ $lang.common_txt359 }}
                  </p>
                  <div class="home-tg-list">
                    <div
                      v-for="(item, index) in tgChannelList"
                      :key="index"
                      class="home-tg-item"
                      @click="openLink(item.url)"
                    >
                      <img
                        :src="item.src"
                        width="34"
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
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
    </div>

    <login v-model="showPopup" overlay></login>
    <lucky-roulette v-model="isShowPopup" overlay></lucky-roulette>
  </div>
</template>
<script>
import {
  GetHomeGameList,
  GetIsFbReport,
  GetPlatformList,
  GetInvitationID,
  GetCsLink,
} from "@/api/common";
import { getCsLinksByScene, getCsItemUrl } from "@/utils/csLink";
import { logoutIfReloginRequiredWithToken } from "@/utils/platformAuth";
import { normalizeCountryCode } from "@/utils/country";
import { applyCountryLanguage } from "@/utils/locale";
import { normalizeHomeDataList, getCategoryGames } from "@/utils/homeGameList";
import ResherSiper2 from "../../components/home/ResherSiper2.vue";
import HomeSupportFooter from "../../components/home/HomeSupportFooter.vue";
import actEntrySpin from "@/assets/img/home/act/entry_spin.png";
import actEntryEnvelope from "@/assets/img/home/act/entry_envelope.png";
import actEntryCheckin from "@/assets/img/home/act/entry_checkin.png";
import actEntryChest from "@/assets/img/home/act/entry_chest.png";
import actEntryRescue from "@/assets/img/home/act/entry_rescue.png";
import stakeRewardChestImg from "@/assets/img/home/stake_reward_chest.png";
import hotFrame from "@/assets/img/home/hot/frame.png";
import hotX1000 from "@/assets/img/home/hot/x_1000.png";
import hotX2000 from "@/assets/img/home/hot/x_2000.png";
import hotX3000 from "@/assets/img/home/hot/x_3000.png";
import hotX4000 from "@/assets/img/home/hot/x_4000.png";
import hotX5000 from "@/assets/img/home/hot/x_5000.png";
import hotX6000 from "@/assets/img/home/hot/x_6000.png";
import hotX7000 from "@/assets/img/home/hot/x_7000.png";
import hotX8000 from "@/assets/img/home/hot/x_8000.png";
import hotX9000 from "@/assets/img/home/hot/x_9000.png";

const HOT_WIN_IMGS = {
  1000: hotX1000,
  2000: hotX2000,
  3000: hotX3000,
  4000: hotX4000,
  5000: hotX5000,
  6000: hotX6000,
  7000: hotX7000,
  8000: hotX8000,
  9000: hotX9000,
};
export default {
  name: "Home",
  components: { ResherSiper2, HomeSupportFooter },

  data() {
    return {
      stakeRewardChestImg,
      hotFrame,
      totalSeconds: 1800,
      timer5: null,
      isCountdownActive: true,
      isShowPopup: false,
      showPopup: false,
      activeTab: 0,
      allOpen: false,
      loading: false,
      pgDate: {},
      visibleTypeCount: 3,
      typeRevealTimer: null,
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
    envelopeCountdownText() {
      const t = Math.max(0, this.totalSeconds | 0);
      const h = this.formatNumber(Math.floor(t / 3600));
      const m = this.formatNumber(Math.floor((t % 3600) / 60));
      const s = this.formatNumber(t % 60);
      return `${h}:${m}:${s}`;
    },
    homeActList() {
      const L = this.$lang || {};
      return [
        {
          key: "spin",
          path: "/luckyReferral",
          entryImg: actEntrySpin,
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "envelope",
          path: "/redPacket",
          entryImg: actEntryEnvelope,
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "checkin",
          path: "/dailyCheckIn",
          entryImg: actEntryCheckin,
          btn: L.activity_card_daily_btn || "DAILY",
        },
        {
          key: "chest",
          action: "treasure",
          entryImg: actEntryChest,
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "rescue",
          path: "/weeklyMissions",
          entryImg: actEntryRescue,
          btn: L.activity_spin || "SPIN",
        },
      ];
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
  },
  async mounted() {
    this.GetPlatformList();
    this.initCountdown();
    this.$bus.on("message-sent", (v) => {
      this.scrollToTarget();
      this.activeTab = v;
    });
  },
  activated() {
    if (this.isCountdownActive && !this.timer5) {
      this.initCountdown();
    }
    this.$nextTick(() => this.startHotAutoScroll());
  },
  deactivated() {
    this.stopTypeReveal();
    this.stopCountdown();
    this.stopHotAutoScroll();
    this.clearHotResumeTimer();
  },
  beforeUnmount() {
    this.stopTypeReveal();
    this.stopCountdown();
    this.stopHotAutoScroll();
    this.clearHotResumeTimer();
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
      // 图片未加载完时用固定尺寸估算：137 宽 + 10 间距
      const n = this.hotGames.length;
      this.hotSetWidth = n > 0 ? n * 147 : 0;
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
    getGameTypeCount(item) {
      if (!item || !Array.isArray(item.types)) return 0;
      return item.types.length;
    },
    shouldShowStakeChestBeforeTypes(item) {
      if (!item || item.sortType === 1) return false;
      return this.getGameTypeCount(item) < 3;
    },
    shouldShowStakeChestAfterType(item, index2) {
      if (!item || item.sortType === 1) return false;
      return this.getGameTypeCount(item) >= 3 && index2 === 2;
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
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    onHomeActClick(item) {
      if (!this.token) {
        this.$bus.emit("openLogin");
        return;
      }
      if (item.action === "treasure") {
        this.$bus.emit("openTreasureBox");
        return;
      }
      if (item.path) this.$jumpTo(item.path);
    },
    goWeeklyMissions() {
      if (!this.token) {
        this.$bus.emit("openLogin");
        return;
      }
      this.$jumpTo("/weeklyMissions");
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
    hotWinSrc(text) {
      const n = parseInt(
        String(text == null ? "" : text).replace(/[^\d]/g, ""),
        10,
      );
      if (!n) return "";
      return HOT_WIN_IMGS[n] || "";
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
  },
};
</script>
<style lang="less" scoped>
.content {
  margin-bottom: 0;
  background-size: cover;
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
.content-serach {
  display: none;
}
.search-entry-wrap {
  display: none;
}

.home-cat-bar {
  position: relative;
  margin: 2px 0 0;
  box-sizing: border-box;

  /* 分类栏整宽上下边框（含左侧搜索） */
  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    pointer-events: none;
    z-index: 5;
  }

  &::before {
    top: 0;
    background: linear-gradient(90deg, #ed3bfe 0%, #9159fe 100%);
  }

  &::after {
    top: 46px;
    background: linear-gradient(90deg, #ac65f9 0%, #486dfe 100%);
  }

  &__search {
    position: absolute;
    left: 0;
    top: 0;
    z-index: 3;
    width: 44px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: linear-gradient(180deg, #7400ae 0%, #53027b 100%);
    box-sizing: border-box;
    /* 与分类栏同色，避免压住 Tab 文字 */
    pointer-events: auto;
  }

  &__search-icon {
    width: 15px;
    height: 15px;
    object-fit: contain;
    display: block;
  }
}

.content-tab {
  margin: 0 auto;
  width: 100%;
}

/* 图二：紫底分类栏 + 选中黑底金边胶囊 */
.home-category-tabs {
  width: 100%;
  margin: 0;

  .tab-text {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 88px;
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
    font-size: 14px;
    line-height: 1;
  }

  :deep(.van-tabs__nav) {
    height: 50px;
    box-sizing: border-box;
    background: none;
    align-items: center;
    /* 给左侧搜索留空，避免挡住第一个 Tab */
    padding-left: 44px;
  }

  :deep(.van-tabs__content) {
    padding-top: 12px;
  }

  :deep(.van-tabs__wrap) {
    position: relative;
    height: 48px;
    border-radius: 0;
    border: none;
    padding: 0 6px 0 0;
    box-sizing: border-box;
    background: linear-gradient(180deg, #7400ae 0%, #53027b 100%);
    overflow: hidden;
  }

  :deep(.van-tab) {
    height: 28px;
    line-height: 1;
    border-radius: 999px;
    padding: 0 12px;
    margin: auto 4px;
    flex: none;
    color: #fff;
    font-size: 14px;
    font-weight: 500;
    border-right: none;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
  }

  :deep(.van-tab--active) {
    font-size: 14px;
    font-weight: 500;
    background: #210031;
    color: #fff !important;
    border: 1.5px solid #ffd404;
    box-sizing: border-box;
  }

  :deep(.van-tabs__line) {
    display: none;
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
/* 自定义中奖轮播：从左到右、可左右滑动、无限循环 */

:deep(.van-sticky--fixed) {
  top: 50px;
}

/* Hot：自动无缝滚动 + 触摸时可左右滑动 */
.home-stake-chest {
  width: 100%;
  margin: 0 0 12px;
  box-sizing: border-box;
  cursor: pointer;

  &__img {
    display: block;
    width: 100%;
    height: 254px;
    object-fit: contain;
    margin: 0px 0 -25px;
  }
}

.home-hot {
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
    padding: 2px 0 0px;
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
    position: relative;
    flex: 0 0 137px;
    width: 137px;
    height: 209px;
    cursor: pointer;
  }

  &__cover {
    position: absolute;
    left: 11.7%;
    top: 20%;
    width: 100px;
    height: 155px;
    display: block;
    object-fit: cover;
    border-radius: 2px;
    pointer-events: none;
    z-index: 0;
  }

  &__frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
    object-fit: fill;
    pointer-events: none;
    z-index: 1;
  }

  &__mult {
    position: absolute;
    left: 50%;
    top: 9.8%;
    width: 50.4%;
    height: auto;
    transform: translateX(-50%);
    display: block;
    pointer-events: none;
    z-index: 2;
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
  background: #2d1545;
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
  margin-top: 12px;
  /* 盖住 content-main 的 tabbar 等高底部留白，保持纯黑衔接 */
  margin-bottom: calc(
    -1 * (var(--tabbar-bar-height, 66px) + env(safe-area-inset-bottom, 0px))
  );
  padding: 20px 0
    calc(
      24px + var(--tabbar-bar-height, 66px) + env(safe-area-inset-bottom, 0px)
    );
  background: #000000;
  box-sizing: border-box;
  position: relative;
  z-index: 1;

  &__inner {
    width: 90%;
    margin: 0 auto;
  }

  &__brand {
    display: block;
    height: 65px;
    margin: 0 auto 15px;
  }
}

.content-line {
  margin: 15px auto;
  width: min(355px, calc(100% - 20px));
  height: 0.5px;
  border: none;
  background: linear-gradient(90deg, #000000 0%, #6c6c7d 50%, #000000 100%);
  opacity: 1;
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
.my-swipe {
  margin-top: 15px;
  position: relative;
  height: 108px;
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

.content-tab--s {
  :deep(.van-loading) {
    background: transparent;
  }
}

/* 首页活动入口：按参考图单独控制每项大小与间距 */
.home-act-list {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0;
  margin: -5px 8px 10px;
  padding: 2px 0 4px;
  box-sizing: border-box;

  &__item {
    flex: 1 1 0;
    width: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
  }

  &__art {
    width: 100%;
    height: 65px;
    flex-shrink: 0;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    overflow: hidden;
  }

  &__entry {
    display: block;
    max-width: 100%;
    object-fit: contain;
    object-position: center bottom;
  }

  /* 各入口视觉大小，宽度不超过列宽，保证五列等比 */
  &__item.is-spin &__entry {
    max-width: 80px;
    height: 60px;
    margin-bottom: -7px;
  }
  &__item.is-envelope &__entry {
    width: 100%;
    max-width: 60px;
    height: 68px;
    margin-bottom: -5px;
  }
  &__item.is-checkin &__entry {
    width: 100%;
    max-width: 55px;
    height: 64px;
    margin-bottom: -5px;
  }
  &__item.is-chest &__entry {
    max-width: 70px;
    height: 58px;
    margin-bottom: -2px;
  }
  &__item.is-rescue &__entry {
    width: 100%;
    max-width: 63px;
    height: 66px;
  }

  &__btn {
    display: inline-flex !important;
    align-items: center !important;
    justify-content: center !important;
    width: 62px !important;
    min-width: 62px !important;
    max-width: 62px !important;
    height: 20px !important;
    margin-top: 4px;
    padding: 0 2px !important;
    border: none;
    border-radius: 999px;
    font-size: 10px !important;
    font-weight: 800 !important;
    letter-spacing: 0;
    line-height: 1 !important;
    text-transform: uppercase;
    white-space: nowrap;
    box-sizing: border-box;
    box-shadow:
      inset 0 1px 1px 0 fade(#a2e7cb, 75%),
      inset 0 -2px 0 0 #006c3f !important;

    &:active:not(:disabled) {
      transform: translateY(1px);
      box-shadow:
        inset 0 1px 1px 0 fade(#a2e7cb, 60%),
        inset 0 -1px 0 0 #006c3f !important;
    }

    &.is-timer {
      width: 64px;
      min-width: 64px;
      max-width: 64px;
      background: linear-gradient(180deg, #8b3bb8 0%, #5c1f8a 100%) !important;
      color: #fff !important;
      box-shadow:
        inset 0 1px 1px 0 fade(#c48be8, 55%),
        inset 0 -2px 0 0 #3d1460 !important;
      font-variant-numeric: tabular-nums;
      font-size: 10px !important;
      font-weight: 800 !important;
      letter-spacing: 0;
      padding: 0 2px !important;
    }
  }

  &__btn-text {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    line-height: 1;
    box-sizing: border-box;
  }
}

/* PC 端样式 */
@media (min-width: 769px) {
  :deep(.van-sticky--fixed) {
    top: 110px !important;
  }
}
</style>
