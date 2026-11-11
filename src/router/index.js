import { createRouter, createWebHistory } from "vue-router";
import {
  resetPageScroll,
  resetPageScrollAfterRoute,
} from "@/utils/scrollReset";
import bus from "@/utils/eventBus";
import { isGuestUser } from "@/utils/guestAuth";
import { isNativeAppShell } from "@/utils/nativeApp";
import { normalizeCountryCode, readCountryCode } from "@/utils/country";
import { consumeRouteMotion } from "@/utils/routeMotion";
import { setOpenLoginAfterReloadFlag } from "@/utils/platformAuth";

// 禁止浏览器自动恢复滚动位置（从长页进二级页停在半截的根因之一）
try {
  if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
    window.history.scrollRestoration = "manual";
  }
} catch (e) {
  /* ignore */
}

const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    // 始终回到顶部；实际滚动容器是 #app / #app-content
    resetPageScroll();
    return new Promise((resolve) => {
      requestAnimationFrame(() => {
        resetPageScroll();
        resolve({ left: 0, top: 0 });
      });
    });
  },
  routes: [
    {
      path: "/:prefix?",
      component: () => import("@/views/layout"),
      children: [
        // {
        //   path: "Country",
        //   name: "Country",
        //   component: () => import("@/views/layout/Country"),
        //   meta: { keepAlive: true },
        // },
        {
          path: "home",
          name: "Home",
          component: () => import("@/views/layout/home"),
          meta: { keepAlive: true },
        },
        // 旧 menu 入口重定向到邀请页
        {
          path: "menu",
          redirect: (to) => ({
            name: "Share",
            params: { prefix: to.params.prefix },
          }),
        },
        {
          path: "appDetail",
          name: "AppDetail",
          component: () => import("@/views/layout/appDetail"),
          meta: { keepAlive: false },
        },
        {
          path: "Support",
          name: "Support",
          component: () => import("@/views/layout/Support"),
          meta: { keepAlive: true },
        },
        {
          path: "share",
          name: "Share",
          component: () => import("@/views/layout/share"),
          meta: { keepAlive: true },
        },
        {
          path: "mine",
          name: "Mine",
          component: () => import("@/views/layout/mine"),
          meta: { keepAlive: true },
        },
        {
          path: "activity",
          name: "Activity",
          component: () => import("@/views/layout/activity"),
          meta: { keepAlive: true },
        },
        {
          path: "rechargeCont",
          name: "RechargeCont",
          component: () => import("@/views/layout/rechargeCont"),
          meta: { keepAlive: true },
        },
        {
          path: "newbieGift",
          name: "NewbieGift",
          component: () => import("@/views/details/activity/newbieGift"),
        },
      ],
    },
    {
      path: "/:prefix?/redPacket",
      name: "RedPacket",
      component: () => import("@/views/details/bonus/redPacket"),
    },
    {
      path: "/:prefix?/dailyCheckIn",
      name: "DailyCheckIn",
      component: () => import("@/views/details/activity/dailyCheckIn"),
    },
    {
      path: "/:prefix?/rewardHistory",
      name: "RewardHistory",
      component: () => import("@/views/details/activity/rewardHistory"),
    },
    {
      path: "/:prefix?/weeklyMissions",
      name: "WeeklyMissions",
      component: () => import("@/views/details/activity/weeklyMissions"),
    },
    {
      path: "/:prefix?/luckyReferral",
      name: "LuckyReferral",
      component: () => import("@/views/details/activity/luckyReferral"),
    },
    {
      path: "/:prefix?/bankAdd",
      name: "BankAdd",
      component: () => import("@/views/details/recharge/bankAdd"),
    },
    {
      path: "/:prefix?/authName",
      name: "AuthName",
      component: () => import("@/views/details/recharge/authName"),
    },
    {
      path: "/:prefix?/setPassWord",
      name: "SetPassWord",
      component: () => import("@/views/details/recharge/setPassWord"),
    },
    {
      path: "/:prefix?/forgotPassword",
      name: "ForgotPassword",
      component: () => import("@/views/details/mine/forgotPassword"),
    },
    {
      path: "/:prefix?/passwordLogin",
      name: "PsswordLogin",
      component: () => import("@/views/details/mine/passwordLogin"),
    },
    {
      path: "/:prefix?/bank",
      name: "Bank",
      component: () => import("@/views/details/mine/bank"),
    },
    {
      path: "/:prefix?/avatar",
      name: "Avatar",
      component: () => import("@/views/details/mine/avatar"),
    },
    {
      path: "/:prefix?/privacy",
      name: "Privacy",
      component: () => import("@/views/details/login/privacyPolicy"),
    },
    {
      path: "/:prefix?/termsOfUse",
      name: "TermsOfUse",
      component: () => import("@/views/details/login/termsOfUse"),
    },
    {
      path: "/:prefix?/billGame",
      name: "BillGame",
      component: () => import("@/views/details/mine/billGame"),
    },
    {
      path: "/:prefix?/gameHall",
      name: "GameHall",
      component: () => import("@/views/details/mine/gameHall"),
    },
    {
      path: "/:prefix?/payOrder",
      name: "PayOrder",
      component: () => import("@/views/details/mine/payOrder"),
    },
    {
      path: "/:prefix?/recordOrder",
      name: "RecordOrder",
      component: () => import("@/views/details/recharge/recordOrder"),
    },
    {
      path: "/:prefix?/rewardRecord",
      name: "RewardRecord",
      component: () => import("@/views/details/mine/rewardRecord"),
    },
    {
      path: "/:prefix?/orderDetail",
      name: "OrderDetail",
      component: () => import("@/views/details/recharge/orderDetail"),
    },
    // {
    //   path: "/:prefix?/firstRegister",
    //   name: "FirstRegister",
    //   component: () => import("@/views/details/bonus/firstRegister"),
    // },
    // {
    //   path: "/:prefix?/cp",
    //   name: "Cp",
    //   component: () => import("@/views/details/mine/cp"),
    // },
    {
      path: "/:prefix?/email",
      name: "Email",
      component: () => import("@/views/details/mine/email"),
    },
    {
      path: "/:prefix?/category",
      name: "Category",
      component: () => import("@/views/details/home/category"),
    },
    {
      path: "/:prefix?/searchGame",
      name: "SearchGame",
      component: () => import("@/views/details/home/searchGame"),
    },
    {
      path: "/:prefix?/settings",
      name: "Settings",
      component: () => import("@/views/details/mine/settings"),
    },
    {
      path: "/:prefix?/editProfile",
      name: "EditProfile",
      component: () => import("@/views/details/mine/editProfile"),
    },
    {
      path: "/:prefix?/vipLevels",
      name: "VipLevels",
      component: () => import("@/views/details/mine/vipLevels"),
    },
    {
      path: "/:prefix?/transactionRecords",
      name: "TransactionRecords",
      component: () => import("@/views/details/mine/transactionRecords"),
    },
    {
      path: "/:prefix?/phoneUnbound",
      name: "PhoneUnbound",
      component: () => import("@/views/details/mine/phoneUnbound"),
    },
    {
      path: "/:prefix?/googlePhoneBind",
      name: "GooglePhoneBind",
      component: () => import("@/views/details/mine/googlePhoneBind"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "NotFound",
      component: () => import("@/views/details/notFound"),
    },
  ],
});

router.beforeEach((to, from, next) => {
  to.meta.routeTransition = consumeRouteMotion();
  const urlSearch = new URLSearchParams(window.location.search);
  const rawCode = to.query.code || urlSearch.get("code");
  if (rawCode) {
    console.log(
      "[Google OAuth] Router guard: Google callback detected, letting App.vue handle it",
    );
    return next();
  }

  // 未匹配的路由没有 prefix 参数，下面的前缀修正会重定向回同一地址造成死循环
  if (to.name === "NotFound") {
    return next();
  }

  // 写死美国；中间页选国家逻辑先关掉
  const defaultCountry = "US";
  // 强制美国，忽略本地已存国家（中间页逻辑关闭期间）
  localStorage.setItem("country", defaultCountry);
  if (!localStorage.getItem("platform")) {
    localStorage.setItem("platform", "usbet");
  }
  if (!localStorage.getItem("currency")) {
    localStorage.setItem("currency", "usd");
  }
  if (!localStorage.getItem("areaCode")) {
    localStorage.setItem("areaCode", "+1");
  }
  if (!localStorage.getItem("defaultLanguage")) {
    localStorage.setItem("defaultLanguage", "en");
  }
  // const savedCountry = readCountryCode()
  const savedCountry = defaultCountry;
  const rawRoutePrefix = to.params.prefix || "";
  const routePrefix = normalizeCountryCode(rawRoutePrefix);
  const pathSegments = to.path.split("/").filter(Boolean);
  if (pathSegments[0]) {
    pathSegments[0] = normalizeCountryCode(pathSegments[0]);
  }

  if (rawRoutePrefix && routePrefix && rawRoutePrefix !== routePrefix) {
    const pathWithoutPrefix = to.path.replace(/^\/[^/]+/, "") || "";
    return next({
      path: `/${routePrefix}${pathWithoutPrefix}`,
      query: to.query,
      hash: to.hash,
      replace: true,
    });
  }

  if (pathSegments[0] === "appDetail") {
    localStorage.setItem("country", defaultCountry);
    const childPath = pathSegments[1] || "appDetail";
    return next({
      path: `/${defaultCountry}/${childPath}`,
      query: to.query,
      hash: to.hash,
      replace: true,
    });
  }

  let finalPrefix = "";

  if (savedCountry) {
    finalPrefix = savedCountry;
    if (routePrefix !== savedCountry) {
      const pathWithoutPrefix = to.path.replace(/^\/[^/]+/, "") || "";
      const correctPath = `/${savedCountry}${pathWithoutPrefix}`;
      if (localStorage.getItem("googleAuthCode")) {
        window.location.href = correctPath;
        return;
      }
      return next(correctPath);
    }
  } else {
    // finalPrefix = routePrefix || ''
    // if (finalPrefix) {
    //   localStorage.setItem('country', finalPrefix)
    // }
    finalPrefix = defaultCountry;
    localStorage.setItem("country", defaultCountry);
  }

  const validSubPaths = [
    "Country",
    "home",
    "appDetail",
    "menu",
    "Support",
    "bonus",
    "share",
    "mine",
    "activity",
  ];

  if (pathSegments.length === 0) {
    // 中间页逻辑注释掉，直接进美国首页
    // if (localStorage.getItem('googleAuthCode') && savedCountry) {
    //   window.location.href = `/${savedCountry}/home`
    //   return
    // }
    // return next('/Country')
    return next(`/${defaultCountry}/home`);
  } else if (
    pathSegments.length === 1 &&
    !validSubPaths.includes(pathSegments[0])
  ) {
    // const prefix = pathSegments[0]
    // localStorage.setItem('country', prefix)
    // const targetPath = `/${prefix}/home`
    // window.location.href = targetPath
    // return
    localStorage.setItem("country", defaultCountry);
    return next(`/${defaultCountry}/home`);
  } else if (pathSegments[0] === "Country") {
    // 直接访问中间页也跳美国首页
    return next(`/${defaultCountry}/home`);
  }

  // /US/Country 等带前缀的中间页也跳过
  if (to.name === "Country" || pathSegments.includes("Country")) {
    return next(`/${defaultCountry}/home`);
  }

  // 底部 Deposit / Mine 及分享页需登录；未登录回首页并弹登录框
  const needAuthPaths = ["/rechargeCont", "/mine", "/share"];
  const currentPath = to.path.replace(/^\/[^/]+/, "") || "/";

  // 游客不能进入提现页：App 内升级弹窗；H5 打开登录。
  if (currentPath === "/bankAdd" && isGuestUser()) {
    const redirectPath = finalPrefix ? `/${finalPrefix}/home` : "/home";
    const openGate = () => {
      setTimeout(() => {
        if (isNativeAppShell()) bus.emit("openGuestUpgrade");
        else bus.emit("openLogin", 0);
      }, 0);
    };
    if (!from.fullPath || from.fullPath === "/") {
      next(redirectPath);
    } else {
      next(false);
    }
    openGate();
    return;
  }

  if (needAuthPaths.includes(currentPath)) {
    const token = localStorage.getItem("token");
    if (!token) {
      const redirectPath = finalPrefix ? `/${finalPrefix}/home` : "/home";
      // 深链首屏时布局还没挂载、收不到事件；打标后由布局 mounted 补弹
      setOpenLoginAfterReloadFlag();
      const openLogin = () => {
        setTimeout(() => bus.emit("openLogin"), 0);
      };
      if (!from.fullPath) {
        next(redirectPath);
        openLogin();
      } else {
        setTimeout(() => {
          next(redirectPath);
          openLogin();
        }, 0);
      }
      return;
    }
  }

  next();
});

// Tab 切换 / 进二级页：强制滚到顶部（修复停在上一页半截的问题）
router.afterEach(() => {
  resetPageScrollAfterRoute();
});

export default router;
