import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { setupVant } from "./utils/vant-ui.js";
import store from "./store";
import "./assets/styles/variables.less";
import "./assets/fonts/iconfont/iconfont.css";

import { setupGlobalMethods } from "./utils/globalMethods";
import globalMixin from "./utils/globalMixin";
import FacebookPixelPlugin from "./utils/facebookPixelPlugin";
import dayjs from "dayjs";
import { createI18n } from "vue-i18n";
import dragScroll from "./utils/dragScroll";
import bus from "./utils/eventBus";
import toast from "./utils/toast";
import { getFingerprint } from "./utils/common.js";
import { readCountryCode } from "./utils/country.js";
import { resetPageScrollAfterRoute } from "./utils/scrollReset.js";
import {
  resolveClientIdSync,
  getClientId,
  peekFlutterUuid,
} from "./utils/nativeDevice.js";
import { installGlobalClickSound } from "./utils/sound.js";
// import VConsole from 'vconsole'

// App / 调试：打开 vConsole（?vconsole=0 可关）
// ;(function initVConsole() {
//   try {
//     const q = new URLSearchParams(location.search || '')
//     if (q.get('vconsole') === '0') return
//     // eslint-disable-next-line no-new
//     new VConsole({ theme: 'dark' })
//   } catch (e) {
//     /* ignore */
//   }
// })()

// 传后端 uuid：Flutter uuid → Vue 本地指纹
(function warmFingerprint() {
  try {
    const id = resolveClientIdSync();
    if (id) {
      window.fingerprint = id;
      if (peekFlutterUuid()) return;
    }
    const cached = localStorage.getItem("ot_fp_vid");
    if (cached && !window.fingerprint) {
      window.fingerprint = cached;
    }
  } catch (e) {
    /* ignore */
  }
  getClientId(1500).then((id) => {
    if (id) {
      window.fingerprint = id;
      return;
    }
    getFingerprint().then((fp) => {
      if (fp && !peekFlutterUuid()) {
        window.fingerprint = fp;
      }
    });
  });
})();

const localeLoaders = {
  en: () => import("./lang/en"),
  es: () => import("./lang/es"),
  fr: () => import("./lang/fr"),
  pt: () => import("./lang/pt"),
};

async function loadLocaleMessages(locale) {
  const key = localeLoaders[locale] ? locale : "en";
  const messages = {};
  const mod = await localeLoaders[key]();
  messages[key] = mod.default || mod;
  // fallbackLocale 需要 en
  if (key !== "en") {
    const enMod = await localeLoaders.en();
    messages.en = enMod.default || enMod;
  }
  return { locale: key, messages };
}

async function bootstrap() {
  const locale = localStorage.getItem("defaultLanguage") || "en";
  const { locale: resolvedLocale, messages } = await loadLocaleMessages(locale);

  const i18n = createI18n({
    legacy: true,
    locale: resolvedLocale,
    fallbackLocale: "en",
    messages,
  });

  const app = createApp(App);

  setupVant(app);
  setupGlobalMethods(app);

  app.config.globalProperties.$lang = messages[resolvedLocale] || messages.en;
  app.config.globalProperties.$dayjs = dayjs;
  app.config.globalProperties.$bus = bus;
  app.config.globalProperties.$toast = toast;

  app.config.globalProperties.$jumpTo = function (
    routeName,
    params = {},
    options = {},
  ) {
    const prefix = readCountryCode();
    const finalParams = {
      ...params,
    };

    const routeConfig = {
      path: "/" + prefix + routeName,
      query: finalParams,
    };

    const jumpMethod = options.replace ? "replace" : "push";

    try {
      const nav = this.$router[jumpMethod](routeConfig);
      Promise.resolve(nav).finally(() => {
        resetPageScrollAfterRoute();
      });
    } catch (error) {
      if (
        !error.message.includes(
          "Avoided redundant navigation to current location",
        )
      ) {
        console.error(error);
      }
    }
  };

  app.config.globalProperties.$launchGame = function (jumpPayload) {
    if (!jumpPayload) return;
    if (jumpPayload.type === "lottery") {
      this.$jumpTo("/lotteryDetail", {
        lotteryType: jumpPayload.lotteryType,
        lotteryName: jumpPayload.lotteryName,
        typeCate: jumpPayload.typeCate != null ? jumpPayload.typeCate : 1,
      });
      return;
    }
    const prefix = readCountryCode();
    this.$router.push({
      name: "GameHall",
      params: {
        prefix,
        gid: jumpPayload.gid,
        isDemo: jumpPayload.isDemo != null ? jumpPayload.isDemo : 0,
        from: jumpPayload.from || "game",
        typeCate: jumpPayload.typeCate,
        gameTab: jumpPayload.gameTab,
      },
    });
    localStorage.setItem("hallFrome", "game");
    localStorage.setItem("hallGid", String(jumpPayload.gid));
  };

  app.use(FacebookPixelPlugin);
  app.use(i18n);
  app.use(store);
  app.use(router);
  app.mixin(globalMixin);
  app.directive("drag-scroll", dragScroll);

  // 全局组件异步注册，减小首屏 JS
  app.component(
    "CommonLang",
    defineAsyncComponent(() => import("./components/CommonLang.vue")),
  );
  app.component(
    "LotteryDayHistory",
    defineAsyncComponent(() => import("./components/LotteryDayHistory.vue")),
  );
  app.component(
    "LotteryOrder",
    defineAsyncComponent(() => import("./components/LotteryOrder.vue")),
  );
  app.component(
    "CommonSwiper",
    defineAsyncComponent(() => import("./components/CommonSwiper.vue")),
  );
  app.component(
    "RechargeCont",
    defineAsyncComponent(() => import("./components/RechargeCont.vue")),
  );
  app.component(
    "login",
    defineAsyncComponent(() => import("./components/Login.vue")),
  );
  app.component(
    "LuckyRoulette",
    defineAsyncComponent(() => import("./components/LuckyRoulette.vue")),
  );
  app.component(
    "CommonPopup",
    defineAsyncComponent(() => import("./components/CommonPopup.vue")),
  );
  app.component(
    "CommonGradientSelect",
    defineAsyncComponent(() => import("./components/CommonGradientSelect.vue")),
  );
  app.component(
    "TitleBar",
    defineAsyncComponent(() => import("./components/TitleBar.vue")),
  );
  app.component(
    "ServicePopup",
    defineAsyncComponent(() => import("./components/ServicePopup.vue")),
  );
  app.component(
    "ActivityPopup",
    defineAsyncComponent(() => import("./components/ActivityPopup.vue")),
  );

  installGlobalClickSound();
  app.mount("#app");
}

bootstrap();
