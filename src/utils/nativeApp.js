/**
 * 是否运行在 iOS App / Android APK 内嵌 WebView。
 * H5 网页端为 false；游客登录、游客升级弹窗仅 App 内可用。
 */
export function isNativeAppShell() {
  try {
    if (typeof window === "undefined") return false;

    if (window.__IN_FLUTTER_APP__ || window.__FLUTTER_APP__) return true;
    if (window.AndroidInterface) return true;
    if (window.flutter_inappwebview) return true;

    // Flutter 运行时注入（勿用 localStorage，避免同域 H5 误判）
    if (
      window.nativeUuid ||
      window.flutterUuid ||
      window.__NATIVE_UUID__
    ) {
      return true;
    }

    const q = new URLSearchParams(window.location.search || "");
    if (q.get("app")) return true;

    // 本地打包 WebView（排除常见 H5/Vite 开发端口）
    if (typeof location !== "undefined") {
      const origin = location.origin || "";
      if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(origin)) {
        const port = String(location.port || "");
        if (port && port !== "8080" && port !== "5173" && port !== "3000") {
          return true;
        }
      }
    }
  } catch (_) {
    /* ignore */
  }
  return false;
}

/** H5 浏览器访问（非 App 壳） */
export function isH5WebClient() {
  return !isNativeAppShell();
}
