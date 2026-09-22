import axios from "axios";
import { getFingerprint } from "@/utils/common";
import bus from "@/utils/eventBus";
import router from "../router";
// 创建 axios 实例，将来对创建出来的实例，进行自定义配置
// 好处：不会污染原始的 axios 实例
const instance = axios.create({
  // 基地址
  // baseURL: window.location.origin.includes("192.168")
  //   ? "https://us.ot.game/a/"
  //   : window.location.origin + "/a/",
  baseURL: "https://us.ot.game/a/",
  //   超时时间
  timeout: 60000,
  headers: {
    "Content-Type": "application/json", // 默认请求头
  },
  params: {
    lang: localStorage.getItem("defaultLanguage") || "en",
  },
  transformRequest: [
    (data, headers) => {
      // 检测是否为 POST 请求
      if (headers["Content-Type"] === "application/json") {
        // console.log(window.fingerprint, '-')
        // 获取指纹（异步操作）
        // 添加固定参数
        data = {
          mode: 2, // 固定模式
          code: 2,
          timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //客户端时区
          platform: localStorage.getItem("platform") || "usbet", //平台名称
          uuid: window.fingerprint || "", // 客户端的uuid ，网页端要自己生成
          online: true, //是否在线
          currency: localStorage.getItem("currency") || "usd", //币种
          isWap: true, //是否手机端
          ...data, // 合并用户传入的数据
        };
      }
      return JSON.stringify(data); // 返回 JSON 格式的请求体
    },
  ],
});

// 自定义配置  -- 请求/响应 拦截器
// 添加请求拦截器

// 请求拦截器
instance.interceptors.request.use(
  async (config) => {
    // 指纹：有缓存立刻用；没有则后台算，不阻塞本轮请求（避免首屏 API 全卡 FingerprintJS）
    if (!window.fingerprint) {
      const cached =
        typeof localStorage !== "undefined"
          ? localStorage.getItem("ot_fp_vid")
          : null;
      if (cached) {
        window.fingerprint = cached;
      } else if (!window.__fpPromise) {
        window.__fpPromise = getFingerprint().then((id) => {
          if (id) window.fingerprint = id;
          return id;
        });
      }
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["X-Access-Token"] = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    if (response.data.status === "need_login") {
      localStorage.removeItem("token");
      const currentPath =
        router.currentRoute &&
        (router.currentRoute.value
          ? router.currentRoute.value.path
          : router.currentRoute.path);
      const pathOnly = (currentPath || "").replace(/^\/[^/]+/, "") || "/";
      // 活动相关页 / 首页：留在当前页弹登录，避免被踢回 home
      const stayPaths = [
        "/home",
        "/activity",
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
        "/seasonHistory",
      ];
      const stayInPlace = stayPaths.some(
        (p) => pathOnly === p || pathOnly.startsWith(p + "/"),
      );
      bus.emit("openLogin");
      if (!stayInPlace) {
        router
          .push("/" + localStorage.getItem("country") + "/home")
          .catch((err) => {
            if (err.name !== "NavigationDuplicated") {
              throw err;
            }
          });
      }
    }
    return response.data; // 直接返回响应数据
  },
  (error) => {
    // 对响应错误做点什么
    // console.error('响应拦截器错误:', error)
    // if (error.response) {
    //   // 根据响应状态码进行处理
    //   switch (error.response.status) {
    //     case 401:
    //       console.error('未授权')
    //       break
    //     case 403:
    //       console.error('禁止访问')
    //       break
    //     case 404:
    //       console.error('资源未找到')
    //       break
    //     case 500:
    //       console.error('服务器内部错误')
    //       break
    //     default:
    //       console.error('未知错误')
    //   }
    // }
    // setTimeout(() => {
    //   window.location.reload()
    // }, 200)
    return Promise.reject(error);
  },
);

// 导出配置好的实例
export default instance;
