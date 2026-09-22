<template>
  <div
    class="nav-cont"
    ref="dropdownRef"
    :class="{ shadow: !isShadowVisible }"
    :style="{ top: `${topOffset}px` }"
  >
    <div class="d-flex-s" style="width: 100%">
      <div class="nav--coo">
        <img
          class="nav-logo"
          src="@/assets/img/login/logo.webp"
          alt="WOLF KING"
        />
        <!-- <div
          @click="show = !show"
          class="m-r-10"
          style="background: #33363d; border-radius: 8px; padding: 6px 7px"
        > -->
        <!-- <div
          @click="goOpen()"
          class="nav--gn m-r-10"
          :class="{ 'tran-xz': show }"
        ></div> -->
        <!-- 
        <div v-if="token" class="sidedrawer-top">
          <img
            :src="vipImg(`V${InitDate.vipLevel ? InitDate.vipLevel : 0}`)"
            height="28"
            style="position: absolute"
          />
          <img
            src="../assets/img/otgame/vipgif.gif"
            height="28"
            style="position: absolute"
          />
        </div> -->

        <div v-if="!token" class="topnav-country-wrap">
          <div class="d-flex topnav-country-trigger" @click="toggleCountryDrop">
            <img :src="GET_ICONURL" width="25" />
            <span class="m-l-5 m-r-5">{{ GET_COUNTRYNAME }}</span>
            <van-icon :name="showCountryDrop ? 'arrow-up' : 'arrow-down'" />
          </div>
          <div v-if="showCountryDrop" class="topnav-country-dropdown">
            <div
              v-for="(item, idx) in countryList"
              :key="idx"
              class="topnav-country-dropdown__item"
              @click="selectCountryNav(item)"
            >
              <img :src="item.iconUrl" width="24" />
              <span>{{ item.countryName }}</span>
              <span class="topnav-country-dropdown__code">{{
                item.areaCode
              }}</span>
            </div>
            <div
              v-if="countryList.length === 0"
              class="topnav-country-dropdown__item"
              style="justify-content: center; color: #a89b7c"
            >
              Loading...
            </div>
          </div>
        </div>
        <!-- </div> -->

        <!-- <img src="../assets/img/common/logo_h.png" height="46" /> -->
        <!-- <div class="nav--log"></div> -->
      </div>
      <div class="nav--coe" :key="timer">
        <div v-if="token" class="nav--ct">
          <div class="d-flex nav-coe-ll nav-balance">
            <div class="balance-text d-flex">
              {{ GET_CURRENCYUNIT }}
              <div class="m-l-10 m-r-5">
                <p class="nav-balance__main">
                  {{ $formatNumberWithCommas(InitDate2.balance) }}
                </p>
              </div>
            </div>
            <img
              :class="{ rotating: isRotating }"
              @click="toggleRotation"
              src="../assets/img/otgame/xz-xx.png"
              class="nav-refresh"
            />
            <div class="nav-deposit-btn m-l-10" @click="gotoDep">
              <van-icon name="shopping-cart-o" size="16" color="#573900" />
            </div>
          </div>
          <div class="nav-mail-btn" @click="gotoShare">
            <van-icon name="envelop-o" size="18" color="#ffe4b5" />
          </div>
        </div>

        <div v-if="!token" class="xg-btn2" @click="goLogin(0)">
          {{ $lang.Entrar }}
        </div>
        <div v-if="!token" class="xg-btn" @click="goLogin(1)">
          {{ $lang.Registro }}
        </div>
      </div>
    </div>
    <div>
      <van-popup
        v-model:show="show"
        class="custom-popup"
        position="left"
        :closeable="false"
        :style="{ width: '80%', height: '100%' }"
        :close-on-click-overlay="true"
      >
        <div class="content">
          <div class="sidedrawer">
            <div class="d-flex">
              <img
                @click="show = false"
                src="../assets/img/otgame/cebianlan_1.png"
                width="20"
                height="18"
              />
              <img
                src="../assets/img/common/logo_h.png"
                height="20"
                class="m-l-10"
              />
              <div class="m-l-20 sidedrawer-top">
                <img
                  :src="vipImg(`V${InitDate.vipLevel ? InitDate.vipLevel : 0}`)"
                  height="22"
                  style="position: absolute"
                />
                <img
                  src="../assets/img/otgame/vipgif.gif"
                  height="22"
                  style="position: absolute"
                />
              </div>
            </div>
            <div class="d-flex-s m-t-10">
              <p class="d-flex nav-con-l" @click="gotoActive(0)">
                <img src="../assets/img/common/home_recharge.png" width="15" />
                <span class="m-l-5">{{ $lang.Depósito }}</span>
              </p>
              <p class="d-flex nav-con-r" @click="gotoActive(1)">
                <img
                  src="../assets/img/common/home_withdrawal.png"
                  width="15"
                />
                <span class="m-l-5">{{ $lang.Saque }}</span>
              </p>
            </div>

            <p class="m-t-15 m-b-10">{{ $lang.common_txt278 }}</p>
            <div class="d-flex-s" style="flex-flow: wrap row">
              <img
                v-for="(item, index) in [
                  `https://file.otgame.bet/static/${getCurrency}/5.png`,
                  `https://file.otgame.bet/static/${getCurrency}/2.png`,
                  `https://file.otgame.bet/static/${getCurrency}/3.png`,
                  `https://file.otgame.bet/static/${getCurrency}/4.png`,
                ]"
                :key="index"
                :src="item"
                width="49%"
                class="m-b-5"
                @click="goToAAA(index)"
              />
            </div>
          </div>

          <div style="padding: 0 10px 10px 10px">
            <div class="d-flex-s">
              <img
                v-for="(item, index) in [
                  require('@/assets/img/otgame/LuckyWheel.png'),
                  require('@/assets/img/otgame/LuckyDraw.png'),
                ]"
                :key="index"
                :src="item"
                width="49%"
                @click="goToBBB(index)"
              />
            </div>

            <div
              style="
                background: #2a2418;
                border-radius: 6px;
                padding: 10px 5px;
                margin-top: 15px;
              "
            >
              <p>{{ $lang.common_txt279 }}</p>
              <div class="d-flex m-t-10">
                <img
                  style="margin-right: 15px"
                  v-for="(item, index) in [
                    require('@/assets/img/otgame/zjm_39.png'),
                    require('@/assets/img/otgame/pinduoduo_24.png'),
                    require('@/assets/img/otgame/ins.png'),
                    require('@/assets/img/otgame/zjm_42.png'),
                  ]"
                  :key="index"
                  :src="item"
                  width="34"
                />
              </div>
            </div>

            <div
              style="
                background: #2a2418;
                border-radius: 6px;
                padding: 10px 5px;
                margin-top: 10px;
              "
            >
              <p>{{ $lang.common_txt280 }}</p>
              <div class="d-flex m-t-10" style="align-items: flex-start">
                <div
                  v-for="(item, index) in [
                    {
                      src: require('@/assets/img/otgame/zjm_40.png'),
                      label: $lang.home_tg_group,
                    },
                    {
                      src: require('@/assets/img/otgame/zjm_40.png'),
                      label: $lang.home_tg_channel,
                    },
                  ]"
                  :key="index"
                  style="
                    margin-right: 15px;
                    text-align: center;
                    cursor: pointer;
                  "
                  @click="goToDDD(index)"
                >
                  <img :src="item.src" width="34" alt="" />
                  <p style="font-size: 10px; margin-top: 4px; color: #fff">
                    {{ item.label }}
                  </p>
                </div>
              </div>
            </div>

            <div
              style="
                background: #2a2418;
                border-radius: 6px;
                padding: 0 10px;
                margin-top: 15px;
              "
            >
              <div
                class="d-flex"
                v-for="(item, index) in mtList"
                :key="index"
                style="padding: 10px 0; border-bottom: 1px solid var(--cont-bg)"
                :class="{ 'no-border-bottom': index === mtList.length - 1 }"
                @click="goToCCC(index)"
              >
                <img :src="item.icon" width="13" />
                <span class="m-l-10">{{ item.name }}</span>
              </div>
            </div>

            <div
              class="d-flex-s"
              style="
                background: #2a2418;
                border-radius: 6px;
                padding: 10px;
                margin-top: 15px;
              "
              @click="isOpen = !isOpen"
            >
              <div class="d-flex">
                <img src="../assets/img/otgame/yuyan.png" width="13" />
                <span class="m-l-10">{{ GET_COUNTRYNAME }}</span>
              </div>
              <van-icon :name="!isOpen ? 'arrow-down' : 'arrow-up'" />
            </div>
            <div class="selector-content" v-if="isOpen">
              <div class="language-item">English</div>
            </div>

            <div class="foot_img">
              <img src="../assets/img/otgame/dibeijing.jpg" width="100%" />
              <p
                style="
                  text-align: center;
                  text-decoration: underline;
                  color: #72c9d1;
                  margin-top: -20px;
                "
              >
                {{ $lang.common_txt286 }} BISONFUN
              </p>
            </div>
          </div>
        </div>
      </van-popup>
    </div>

    <login
      v-model="showPopup"
      closeable
      close-icon="cross"
      overlay
      @close-key="closeValue"
      :loginType="loginType"
    ></login>
    <service-popup v-model="showPopup2" :srcValue="srcValue"></service-popup>
    <lucky-roulette v-model="isShowPopup" overlay></lucky-roulette>
  </div>
</template>
<script>
import {
  Init,
  GameBalanceList,
  GetCsLink,
  GetHomeGameList,
  // GetIsFbReport,
  fbReportSuccess,
  GetLotteryList,
  GetPlatformList,
} from "@/api/common";
import {
  logoutIfReloginRequiredWithToken,
  clearTokenIfReloginRequired,
} from "@/utils/platformAuth";
import { vipImg } from "@/utils/vipAssets";
import { normalizeHomeDataList } from "@/utils/homeGameList";
import { applyCountryLanguage } from "@/utils/locale";
export default {
  name: "TopNav",
  components: {},
  props: {
    topOffset: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      isOpen: false,
      mtList: [
        {
          icon: require("@/assets/img/otgame/cebianlan_15.png"),
          name: this.$lang.common_txt281,
        },
        {
          icon: require("@/assets/img/otgame/cebianlan_12.png"),
          name: this.$lang.common_txt282,
        },
        {
          icon: require("@/assets/img/otgame/cebianlan_13.png"),
          name: this.$lang.common_txt283,
        },
        {
          icon: require("@/assets/img/otgame/cdk.png"),
          name: this.$lang.common_txt284,
        },
        {
          icon: require("@/assets/img/otgame/hezuo.png"),
          name: this.$lang.common_txt285,
        },
      ],
      showLang: false,
      showCountryDrop: false,
      countryList: [],
      lotList2: [],
      isShadowVisible: false,
      isShowXl: false,
      isShowPopup: false,
      selectIndex: 0,
      srcValue: "",
      dataList: [],
      loginType: 0,
      timer: null,
      showPopup: false,
      showPopup2: false,
      InitDate: {}, //数据
      InitDate2: {
        balance: 0,
      }, //数据2
      show: false,
      // closeIcon: require('@/assets/img/common/menu.png'), // 引入本地图片作为关闭图标,
      isRotating: false, // 控制旋转状态
      isService: false,
      whatList: [],
      pgDate: {},
      selectMenIndex: 0,
    };
  },
  mounted() {
    this._scrollRaf = 0;
    window.addEventListener("scroll", this.handleScroll, { passive: true });

    if (this.token) {
      this.Init();
      this.GetGameBalanceList();
      this.$bus.on("refsh-amount", () => {
        this.GetGameBalanceList();
      });
    }
    this.ensureCountryInfo();
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    if (this._scrollRaf) {
      cancelAnimationFrame(this._scrollRaf);
      this._scrollRaf = 0;
    }

    // this.$bus.off('tab-list')
    this.$bus.off("srefh-amount");

    // 解绑全局点击事件
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    vipImg,
    toggleCountryDrop() {
      this.showCountryDrop = !this.showCountryDrop;
      if (this.showCountryDrop && this.countryList.length === 0) {
        this.fetchCountryList();
      }
    },
    async ensureCountryInfo() {
      const country = localStorage.getItem("country");
      if (!country) return;
      const invalid = (v) => !v || v === "null" || v === "undefined";
      if (
        !invalid(localStorage.getItem("countryName")) &&
        !invalid(localStorage.getItem("iconUrl")) &&
        !invalid(localStorage.getItem("areaCode"))
      ) {
        return;
      }
      try {
        const data = await GetPlatformList();
        if (
          data.status !== "ok" ||
          !data.content ||
          !Array.isArray(data.content.list)
        )
          return;
        const match = data.content.list.find((i) => i.country === country);
        if (!match) return;
        const prevPlatform = localStorage.getItem("platform");
        if (
          clearTokenIfReloginRequired(prevPlatform, match.platform) &&
          this.$bus
        ) {
          this.$bus.emit("openLogin");
        }
        localStorage.setItem("countryName", match.countryName || "");
        localStorage.setItem("iconUrl", match.iconUrl || "");
        localStorage.setItem("currency", match.currency || "");
        localStorage.setItem("currencyUnit", match.currencyUnit || "");
        localStorage.setItem("areaCode", match.areaCode || "");
        localStorage.setItem("platform", match.platform || "");
        if (!localStorage.getItem("defaultLanguage")) {
          applyCountryLanguage(match);
        }
        this.GET_COUNTRYNAME = match.countryName || "";
        this.GET_ICONURL = match.iconUrl || "";
        this.GET_CURRENCYUNIT = match.currencyUnit || "";
        this.GET_AREACODE = match.areaCode || "";
        this.GET_PLATFORM = match.platform || "";
        this.getCurrency = match.currency || "";
      } catch (e) {
        console.error("ensureCountryInfo error", e);
      }
    },
    async fetchCountryList() {
      try {
        const data = await GetPlatformList();
        if (data.status === "ok") {
          this.countryList = data.content.list;
        }
      } catch (e) {
        console.error("fetchCountryList error", e);
      }
    },
    selectCountryNav(item) {
      const prevPlatform = localStorage.getItem("platform");
      logoutIfReloginRequiredWithToken(prevPlatform, item.platform);
      localStorage.setItem("currency", item.currency);
      localStorage.setItem("areaCode", item.areaCode);
      localStorage.setItem("currencyUnit", item.currencyUnit);
      localStorage.setItem("platform", item.platform);
      applyCountryLanguage(item);
      localStorage.setItem("iconUrl", item.iconUrl);
      localStorage.setItem("countryName", item.countryName);
      localStorage.setItem("country", item.country);
      this.showCountryDrop = false;
      this.$router.replace("/" + item.country + "/home");
      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
    goOpen() {
      this.show = !this.show;
      // if (this.show) {
      //   this.GetLotteryList()
      // }
    },
    async GetLotteryList() {
      const data = await GetLotteryList();
      if (data.status === "ok") {
        this.lotList2 = data.content.allLotteryList.filter((i) =>
          ["L"].includes(i.freqType),
        );
      }
    },
    goToLotDetail(i) {
      this.$jumpTo("/lotteryDetail", {
        lotteryType: i.lotteryType,
        lotteryName: i.lotteryName,
      });
    },
    goToLotDetail3(i) {
      if (i === 0) {
        this.$jumpTo("/lotteryDetail", {
          lotteryType: "tron16x660",
          lotteryName: "TRON 16/6 1min",
        });
      } else if (i === 1) {
        this.$jumpTo("/lotteryDetail", {
          lotteryType: "eth16x660",
          lotteryName: "ETH 16/6 1min",
        });
      } else if (i === 2) {
        this.$jumpTo("/lotteryDetail", {
          lotteryType: "bnb16x660",
          lotteryName: "BNB 16/6 1min",
        });
      }
    },
    gotoActive(i) {
      if (this.token) {
        if (i === 0) {
          this.$jumpTo("./rechargeCont");
        } else {
          this.$jumpTo("./bankAdd");
        }
      } else {
        this.showPopup = true;
      }
    },

    handleScroll() {
      if (this._scrollRaf) return;
      this._scrollRaf = requestAnimationFrame(() => {
        this._scrollRaf = 0;
        const scrollTop = window.pageYOffset;
        const next = scrollTop > 0;
        if (this.isShadowVisible !== next) {
          this.isShadowVisible = next;
        }
      });
    },
    copyText2() {
      const textarea = document.createElement("textarea");
      textarea.value = this.InitDate.inviteCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
    async GetHomeGameList() {
      const data = await GetHomeGameList();
      if (data.status === "ok") {
        this.pgDate = data.content;
        const normalized = normalizeHomeDataList(
          (this.pgDate && this.pgDate.dataList) || [],
        );
        const typesArr = normalized.flatMap((item) => item.types || []);

        const newList = [
          {
            name: "Lobby",
            icon: require("@/assets/img/common/all_home.png"),
            types: typesArr,
          },
          ...normalized,
        ];

        this.dataList.splice(0, this.dataList.length, ...newList);

        this.dataList.forEach((i) => {
          if (Array.isArray(i.types)) {
            i.types.sort((a, b) => (a.order || 0) - (b.order || 0));
          }
        });

        let newArr = (this.dataList[0].types || []).filter(
          (i) => i.code === "3000602",
        );
        this.isOtgame = newArr.flatMap((item) =>
          (item.games || []).filter((game) => game.gameName === "Lucky Ball"),
        );
        let newDataList = JSON.parse(
          JSON.stringify(this.dataList[0].types || []),
        );
        this.dataList[0].homeIcon = require("@/assets/img/common/all_home.png");
        for (let i = 0; i < newDataList.length; i++) {
          this.dataList[i + 1] = {
            homeIcon: newDataList[i].homeIcon,
            icon: newDataList[i].icon,
            name: newDataList[i].name,
            types: [newDataList[i]],
          };
        }
      }
    },
    toggleDropdown() {
      this.isShowXl = !this.isShowXl;
    },
    closeDropdown() {
      this.isShowXl = false;
    },
    handleOutsideClick(event) {
      // 判断点击位置是否在下拉框组件内部
      if (!this.$refs.dropdownRef.contains(event.target)) {
        this.closeDropdown();
      }
    },
    goToSaque() {
      this.$jumpTo("/bankAdd");
    },
    goToRegistro() {
      this.$jumpTo("/recordOrder");
    },
    goToRecord() {
      this.$jumpTo("/recordOrder");
    },
    // goToShare() {
    //   if (this.$route.path === '/share') {
    //     console.log(this.$route.path)
    //   } else {
    //     this.$router.push('./share')
    //   }
    // },
    goToDetail(i) {
      if (i === 0) {
        this.isShowPopup = true;
      } else if (i === 1) {
        this.$jumpTo("/vipSignIn");
      } else if (i === 2) {
        this.$jumpTo("/activityFistRecharge");
      } else if (i === 3) {
        this.$jumpTo("/referFriend");
      } else if (i === 4) {
        this.$jumpTo("/redPacket");
      } else if (i === 5) {
        this.$jumpTo("/cashBack");
      } else if (i === 6) {
        this.$jumpTo("/signIn");
      }
    },
    goHome() {
      if (this.$route.path.includes("/home")) {
        console.log(this.$route.path);
        // window.location.reload()
      } else {
        this.$jumpTo("/home", {}, { replace: true });
      }
    },
    getSelect(v) {
      this.selectIndex = v;
      // if (this.$route.path === '/home') {
      //   this.$bus.emit('message-sent', v)
      // } else {
      //   this.$router.push({ path: '/home', query: { gameTab: v } })
      //   this.$bus.emit('message-sent', v)
      // }
      this.$jumpTo("/category", { gameTab: v });
      this.show = false;
    },
    // async GetHomeGameList() {
    //   const data = await GetHomeGameList()
    //   if (data.status === 'ok') {
    // this.dataList = data.content.dataList
    // this.dataList.forEach((i) => {
    //   (i)['isShow'] = false
    // })
    //   }
    // },
    goLogin(v) {
      this.loginType = v;
      this.showPopup = true;
    },
    async GetCsLink() {
      const data = await GetCsLink();
      if (data.content.url2 && data.content.url2.some((item) => "tg" in item)) {
        this.isService = true;
        this.whatList = data.content.url2 || [];
      } else {
        this.isService = false;
      }
    },
    closeValue() {
      this.Init();
      window.location.reload();
    },
    // goDetail(i) {
    //   if (i === 0) {
    //     const targetKey3 = 'tg'
    //     window.open(
    //       this.whatList.find((item) => targetKey3 in item)?.[targetKey3],
    //       '_blank'
    //     )
    //   }
    // },
    goToAAA(i) {
      if (i === 0) {
        this.$jumpTo("/referFriend");
      } else if (i === 1) {
        this.$jumpTo("/Alliance");
      } else if (i === 2) {
        this.$jumpTo("/vipSignIn");
      } else if (i === 3) {
        this.$jumpTo("/redPacket");
      }
    },
    goToBBB(i) {
      if (i === 0) {
        this.$jumpTo("/Crowdfunding");
      } else if (i === 1) {
        this.$jumpTo("/activityFistRecharge");
      }
    },
    goToCCC(i) {
      if (i === 0) {
        this.$jumpTo("/myCollection");
      } else if (i === 1) {
        this.$jumpTo("/privacy");
      } else if (i === 2) {
        this.$jumpTo("/Support");
      } else if (i === 3) {
        this.$jumpTo("/redPacket");
      } else if (i === 4) {
        this.$jumpTo("/Alliance");
      }
    },
    goToDDD(i) {
      if (i === 0) {
        window.open("https://t.me/OTGAME777", "_blank");
      } else if (i === 1) {
        window.open("https://t.me/OTgamel", "_blank");
      }
    },
    gotoGame2(i) {
      if (i === 0) {
        this.$jumpTo("/activityFistRecharge");
      } else if (i === 1) {
        this.$jumpTo("/activityCooperate");
      } else if (i === 2) {
        this.$jumpTo("/signIn");
      } else if (i === 3) {
        if (!this.token) {
          this.$emit("getLoging");
        } else {
          this.$jumpTo("/vip");
        }
      }
      this.show = false;
    },
    // gotoGame(i) {
    //   this.$bus.emit('message-sent', i)
    //   this.show = false
    // },
    async GetGameBalanceList() {
      const data = await GameBalanceList();
      if (data.status === "ok") {
        this.InitDate2 = data.content;
      }
    },
    async fbReportSuccess() {
      await fbReportSuccess();
    },
    // async GetIsFbReport(v) {
    //   const data = await GetIsFbReport({
    //     inviteCode: localStorage.getItem('id')
    //   })
    //   if (data.status === 'ok') {
    //     if (data.content.isReport) {
    //       if (data.content.target === 'ks') {
    //         window.kwaiq.load(data.content.fbPixId)
    //         window.kwaiq.instance(data.content.fbPixId).track('purchase', {
    //           amount: v * 0.1,
    //           currency: 'BRL'
    //         })
    //         // window.kwaiq.track('purchase', {
    //         //   amount: v * 0.1,
    //         //   currency: 'BRL'
    //         // })
    //         this.fbReportSuccess()
    //         console.log('Purchase')
    //       } else {
    //         this.$pixel.setFbId(data.content.fbPixId)
    //         this.$pixel.callTrackHasPara('track', 'Purchase', v * 0.1, 'BRL') // 上报
    //         const jsonData = `"""{"data":[{"event_name": "Purchase", "value": ${
    //           v * 0.1
    //         }, "currency": "BRL","content_type": "product"}]}"""`
    //         this.$pixel.sendEventToAndroid(jsonData)
    //         this.fbReportSuccess()
    //       }
    //     }
    //   }
    // },
    // 加载数据
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.InitDate = data.content;
        localStorage.setItem("shareCode", data.content.inviteCode);

        if (data.content.fbPixJson) {
          let newObj = JSON.parse(data.content.fbPixJson);
          // let newObj = JSON.parse(
          //   '{"pixIsSend":1,"fbUrlPara":"fbid=3633995890229347&target=fb&fbclid=IwZXh0bgNhZW0BMABhZGlkAasin9CXST4BHhLUU0KaZSVVWlrgJh38zhz_ByG2X0Y3rnwlqwphWJbU7cxAag-Mqbz43Qds_aem_1_7l4hrqOCSn-51gneQ5wg&utm_medium=paid&utm_source=fb&utm_id=120227708038730174&utm_content=120227884522230174&utm_term=120227708038740174&utm_campaign=120227708038730174#/?id=dp0vg2dx"}'
          // )

          if (newObj.pixIsSend && newObj.pixIsSend === 1) {
            this.$jumpTo("?" + newObj.fbUrlPara, {}, { replace: true });
            const paramsArray = newObj.fbUrlPara.split("&");
            const params = {};
            paramsArray.forEach((param) => {
              const [key, value] = param.split("=");
              params[key] = value;
            });
            if (params["target"] === "ks") {
              window.kwaiq.load(params["fbid"]);
              window.kwaiq.instance(params["fbid"]).track("purchase", {
                amount: newObj.firstDepositAmount * 0.1,
                currency: "NGN",
              });
              this.fbReportSuccess();
              console.log("Purchase");
            } else if (params["target"] === "fb") {
              this.$pixel.setFbId(params["fbid"]);
              window.fbq("track", "Purchase", {
                value: parseInt(newObj.firstDepositAmount * 0.1), // 自定义金额
                currency: "NGN",
                // content_ids: ['12345'], // 可选，产品 ID
                // content_name: 'Product Name', // 可选，产品名称
                // content_category: 'Category', // 可选，产品分类
                // content_price: amount, // 可选，产品价格
                // num_items: 1, // 可选，购买数量
                event_time: Date.now(),
                // action_source: window.location.href + '?' + newObj.fbUrlPara,
                event_id: `ORDER${data.content._uid}`, // 可选，订单 ID
                user_data: {
                  fbc: params["fbclid"],
                  // client_ip_address: clientIp
                },
                custom_data: {
                  value: parseInt(newObj.firstDepositAmount * 0.1), // 自定义金额
                  currency: "NGN",
                },
              });

              // this.$pixel.callTrackHasPara(
              //   'track',
              //   'Purchase',
              //   newObj.firstDepositAmount * 0.1,
              //   'BRL'
              // ) // 上报
              const jsonData = `"""{"data":[{"event_name": "Purchase", "value": ${parseInt(
                newObj.firstDepositAmount * 0.1,
              )}, "currency": "NGN","content_type": "product"}]}"""`;
              this.$pixel.sendEventToAndroid(jsonData);
              this.fbReportSuccess();
            }

            // this.GetIsFbReport(newObj.firstDepositAmount)
          }
        }
      }
    },
    gotoShare() {
      this.$jumpTo("/email");
      // if (this.$route.name !== 'Recharge') {
      //   this.$router.push('/recharge')
      // }
    },
    InviteGo() {
      this.$jumpTo("/share");
    },
    // copyText() {
    //   const textarea = document.createElement('textarea')
    //   textarea.value = this.InitDate.inviteCode
    //   document.body.appendChild(textarea)
    //   textarea.select()
    //   document.execCommand('copy')
    //   document.body.removeChild(textarea)
    //   this.$toast({
    //     message: 'Success',
    //     icon: 'success'
    //   })
    // },
    toggleRotation() {
      if (this.isRotating) return; // 如果已经在旋转，直接返回
      this.isRotating = true;
      // 动画结束后重置状态
      setTimeout(() => {
        this.isRotating = false;
      }, 1000); // 动画持续时间
      this.GetGameBalanceList();
      this.timer++;
    },
    gotoDep() {
      this.$jumpTo("/rechargeCont");
    },
  },
  watch: {
    $route() {
      // 路由变化时关闭弹窗
      this.show = false;
    },
  },
};
</script>
<style lang="less" scoped>
.topnav-country-wrap {
  position: relative;
}
.topnav-country-trigger {
  justify-content: center;
  background: linear-gradient(96.49deg, #1d1400 2.73%, #000000 97.68%);
  border: 1px solid rgba(233, 182, 90, 0.28);
  border-radius: 8px;
  padding: 7px 10px;
  cursor: pointer;
}
.topnav-country-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 200px;
  z-index: 200;
  background: linear-gradient(96.49deg, #1d1400 2.73%, #000000 97.68%);
  border: 1px solid rgba(233, 182, 90, 0.25);
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  margin-top: 4px;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    color: @wihte-color;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      border-bottom: none;
    }
    &:active {
      background: rgba(233, 182, 90, 0.12);
    }
  }

  &__code {
    margin-left: auto;
    color: #e9b65a;
    font-size: 12px;
    font-weight: 600;
  }
}
.selector-content {
  background: #15110a;
  padding: 0 10px;
  border-radius: 6px;
  border: 1px solid fade(#e9a843, 30%);
  .language-item {
    padding: 10px 20px;
  }
}
.no-border-bottom {
  border-bottom: none !important;
}
.sidedrawer {
  background: url(../assets/img/otgame/bj.png) no-repeat;
  background-size: 100% 100%;
  padding: 10px;
  // height: 150px;
  align-items: flex-start;
}
.sidedrawer-top {
  position: relative;
  height: 22px;
}
.nav-cont {
  width: 100%;
  max-width: 450px;
  height: 60px;
  background: #1f1c17;
  border-bottom: 1px solid #e9b65a4d;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1999;
  padding-top: 0;
  margin: 0 auto;
  box-sizing: border-box;
}
.nav-cont > .d-flex-s {
  min-width: 0;
  flex-wrap: nowrap;
}
// .shadow {
//   background: url('../assets/img/home/bg-show.png') no-repeat !important;
//   background-size: 100% 100% !important;
// }
.nav--coo {
  // width: 35%;
  margin-left: 10px;
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1 1 auto;
  gap: 6px;
}
.nav--coo > img,
.nav-logo {
  flex-shrink: 0;
  // height: 34px;
  width: auto;
  max-width: 120px;
  object-fit: contain;
  display: block;
}
.topnav-country-wrap {
  position: relative;
  min-width: 0;
  flex-shrink: 1;
}
.topnav-country-wrap > .d-flex > span {
  max-width: 90px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.nav--gn {
  background-image: url("../assets/img/common/menu.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 20px; /* 或者指定具体的宽度 */
  height: 18px;
}
.nav--log {
  background-image: url("../assets/img/common/logo_h.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 86px; /* 或者指定具体的宽度 */
  height: 15px;
}
.nav--coe {
  display: flex;
  align-items: center;
  // width: 65%;
  justify-content: right;
  margin-right: 10px;
  flex-shrink: 0;
}
.nav--ct {
  // height: 25px;
  // border-radius: 32px;
  // padding: 3px 2px 3px 0;
  display: flex;
  // border: 1px solid @border-color; /* 白色边框 */
  align-items: center;
  // .nav--ct-l {
  //   width: 15px;
  //   height: 15px;
  //   border-radius: 50%;
  //   background-color: @primary-color;
  //   text-align: center;

  // }
}

.nav--r {
  margin-left: 10px;
  padding: 5px 9px 3px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  border-radius: 6px;
  text-align: center;
  color: #573900;
  font-weight: 700;
}

.nav-balance {
  background: rgba(29, 20, 0, 0.65);
  border: 1px solid fade(#e9a843, 35%);
  border-radius: 20px;
  padding: 2px 6px 2px 10px;
  align-items: center;

  &__main {
    color: #ffa300;
    font-weight: 600;
    line-height: 1.2;
  }
}

.nav-refresh {
  width: 15px;
  cursor: pointer;
  opacity: 0.9;
}

.nav-deposit-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(255, 163, 0, 0.35);
  flex-shrink: 0;

  &:active {
    transform: scale(0.94);
    opacity: 0.92;
  }
}

.nav-mail-btn {
  background: rgba(29, 20, 0, 0.65);
  border: 1px solid fade(#e9a843, 35%);
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-left: 6px;
  flex-shrink: 0;

  &:active {
    opacity: 0.85;
  }
}
/* 定义旋转动画 */
@keyframes rotate-and-back {
  0%,
  100% {
    transform: rotate(0deg); /* 初始和最终状态 */
  }
  50% {
    transform: rotate(360deg); /* 顺时针旋转360度 */
  }
}

/* 动画类 */
.rotating {
  animation: rotate-and-back 1s linear forwards; /* 4秒完成动画，线性过渡，动画结束后保留状态 */
}
.custom-popup {
  padding-bottom: 3%;
  background-color: #1f1c17;
  background-size: 100% 100%;
  height: 100%;
  width: 100%;
}
// :deep(.van-overlay) {
//   height: 94% !important;
//   margin-top: 50px;
// }
// .van-popup--left {
//   top: 47%;
// }
// .content {
//   width: 100%;
//   padding: 0 10px;
// }
.content-avatar {
  position: relative;
  width: 100%;
  text-align: center;
}
.content-avatar-a {
  width: 100px;
  height: 100px;
}
.content-avatar-b {
  width: 33px;
  height: 30px;
  position: absolute;
  top: 65px;
  right: 113px;
}
.content-two {
  display: flex;
  justify-content: space-between;
}
.content-two--button {
  width: 48%;
  border-radius: 10px;
  font-size: 15px;
  font-weight: bold;
}
.van-button__icon {
  font-size: 25px;
  right: 8px;
}
.content-three {
  margin-top: 5px;
  flex-flow: wrap row;
  text-align: center;
}
.content-three-list {
  font-weight: bold;
  background: #2a2418;
  border-radius: 10px;
  margin-bottom: 5px;
  color: @font-color;
  width: 48%;
  padding: 8px 0;
  text-align: center;
  box-shadow: 0 0px 1px 1px rgba(0, 0, 0, 0.2); /* 四周黑色阴影 */

  // .content-three-list--i {
  //   background: @background-color;
  //   padding: 5px 10px;
  //   margin-bottom: 5px;
  //   border-radius: 10px;
  // }
}
.content-four {
  font-weight: bold;
  background: @cont-bg;
  padding: 15px 12px 15px;
  border-radius: 10px;
  margin-top: 15px;
}
.content-four--list {
  padding: 12px 0;
  display: flex;
  align-items: center;
}
.buttoncustom- {
  padding: 16px 10px 15px !important; /* 增加内边距 */
  font-size: 12px; /* 设置字体大小 */
  border-radius: 9px;
  margin-right: 6px;
  border: none !important;
}
.active-select {
  background: @primary-color3;
  color: @wihte-color;
}
.balance-text {
  // color: #ffcd28; /* 设置文字颜色 */
  font-size: 13px; /* 设置文字大小 */
  margin-right: 6px;
  // color: #2a2418;
}

.tran-xz {
  transform: rotate(180deg);
}
.nav-btn {
  width: 100%;
  padding: 10px 45px 10px 20px;
  border-radius: 5px;
  background: #2a2418;
  box-shadow: 0 0px 1px 1px rgba(0, 0, 0, 0.2); /* 四周黑色阴影 */
}
.activi-hd {
  background: #2a2418;
  padding: 5px;
  border-radius: 5px;
}
.triangle {
  width: 0; /* 宽度为0 */
  height: 0; /* 高度为0 */
  border-left: 4px solid transparent; /* 左边框透明 */
  border-right: 4px solid transparent; /* 右边框透明 */
  border-top: 7px solid; /* 底边框为红色 */
}

.triangle-xz {
  border-top: none; /* 底边框为红色 */
  border-bottom: 7px solid; /* 底边框为红色 */
}
.cz-xl {
  background: linear-gradient(to bottom, #ef6279, #d32144, #d32144, #d32144);
  box-shadow: 0 0 5px rgba(211, 33, 68, 1); /* 阴影效果 */
  border-bottom: 2px solid #80132b !important;
  border-radius: 15px;
  padding: 5px;
  font-size: 11px;
  position: relative;
}
.cz-xlx {
  position: absolute;
  font-size: 10px;
  background: @cont-bg;
  border-radius: 10px;
  padding: 3px;
  top: 25px;
  width: 100%;
  right: 1px;
  p {
    padding: 5px;
  }
}
.custom-button {
  height: 30px;
  padding: 0 10px;
  border-radius: 8px !important;
  font-weight: 100 !important;
  width: 82px;
  font-size: 12px !important;
}
.xg-btn {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  font-weight: 700 !important;
  height: 30px;
  min-width: 70px;
  padding: 0 10px;
  border-radius: 16px;
  color: #573900;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-sizing: border-box;
}
.xg-btn2 {
  background: transparent;
  border: 1px solid rgba(233, 182, 90, 0.75);
  font-weight: 700 !important;
  margin-right: 8px;
  height: 30px;
  min-width: 70px;
  padding: 0 10px;
  border-radius: 16px;
  color: #f3c059;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  box-sizing: border-box;
}
.nav-cont-t {
  margin-top: 20px;
  background: #2a2418;
  padding: 10px;
  border-radius: 12px;
}
.nav-con-l {
  width: 48%;
  justify-content: center;
  padding: 6px 0;
  border-radius: 6px;
  background-image: linear-gradient(90deg, #d78924, #ec9823);
  padding: 10px;
}
.nav-con-r {
  width: 48%;
  justify-content: center;
  padding: 6px 0;
  border-radius: 6px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  padding: 10px;
}
.nav-coe-ll {
  color: @wihte-color;
  border-radius: 8px;
  margin-right: 10px;
  padding: 5px 6px;
}
.select-Men {
  background: #ffa300 !important;
  color: #573900 !important;
}
.men-i {
  width: 48%;
  text-align: center;
  color: #a89b7c;
  font-weight: bold;
  background: @wihte-color;
  border-radius: 10px;
  padding: 5px 0;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
}
/* PC 端样式 */
@media (min-width: 769px) {
  .custom-popup {
    width: 336px !important;
    left: 56%;
    transform: translate(-112%, -50%);
    padding-top: 0px !important;
    padding-bottom: 0 !important;
    // margin-top: 38px;
    height: 100% !important;
  }
  :deep(.van-overlay) {
    height: 100% !important;
  }
}
</style>
