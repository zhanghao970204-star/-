import { GetCsLink } from "@/api/common";

export function getCsItemUrl(item) {
  if (!item) return "";
  return item.linkUrl || item.url || "";
}

export function getCsLinkList(content) {
  if (!content) return [];
  const list = content.list;
  if (!Array.isArray(list)) return [];
  return list.filter(Boolean);
}

export function getCsLinksByScene(content, scene) {
  const target = String(scene || "").toLowerCase();
  return getCsLinkList(content).filter((item) => {
    return (
      String(item.scene || "").toLowerCase() === target && !!getCsItemUrl(item)
    );
  });
}

export function getFirstCsLinkByScene(content, scene) {
  return getCsLinksByScene(content, scene)[0] || null;
}

export function pickCsUrl(content, preferredScene) {
  if (!content) return "";
  if (typeof content === "string") return content;
  if (content.url) return content.url;
  if (content.csUrl) return content.csUrl;
  if (content.link) return content.link;

  if (preferredScene) {
    const preferred = getCsItemUrl(
      getFirstCsLinkByScene(content, preferredScene)
    );
    if (preferred) return preferred;
  }

  const fromScene =
    getCsItemUrl(getFirstCsLinkByScene(content, "floating")) ||
    getCsItemUrl(getFirstCsLinkByScene(content, "home")) ||
    getCsItemUrl(getCsLinkList(content)[0]);
  if (fromScene) return fromScene;

  const list = content.url2 || content.links || [];
  if (!Array.isArray(list)) return "";
  const byKey = (key) => {
    const hit = list.find((item) => item && item[key]);
    return hit ? hit[key] : "";
  };
  return byKey("online") || byKey("tg") || byKey("ws") || byKey("url") || "";
}

/** 预取客服链接，点击时同步打开，避免手机拦截异步 window.open */
export async function fetchCsUrl(preferredScene) {
  const data = await GetCsLink();
  const content = data && data.content ? data.content : data;
  return pickCsUrl(content, preferredScene);
}

function openUrlSync(url) {
  if (!url) return false;
  const win = window.open(url, "_blank");
  if (win) {
    try {
      win.opener = null;
    } catch (e) {
      /* ignore */
    }
    return true;
  }
  // 弹窗被拦：同页跳转，保证能打开
  window.location.href = url;
  return true;
}

function navigateOpenedWindow(win, url) {
  if (win) {
    try {
      win.opener = null;
      win.location.href = url;
      return true;
    } catch (e) {
      try {
        win.close();
      } catch (err) {
        /* ignore */
      }
    }
  }
  window.location.href = url;
  return true;
}

let csOpening = false;

/**
 * 打开客服。优先用预取 url 同步打开（最稳）；
 * 否则先同步开 about:blank，再填入接口地址。
 * @param {{ url?: string, scene?: string }} [options]
 */
export async function openCustomerService(options = {}) {
  const knownUrl = options && options.url ? String(options.url) : "";
  const scene = options && options.scene ? options.scene : "";

  if (csOpening) return false;
  csOpening = true;

  try {
    // 已有预取链接：完全在用户手势内同步打开
    if (knownUrl) {
      return openUrlSync(knownUrl);
    }

    // 手机浏览器要求 window.open 必须在用户手势同步调用；
    // 接口 await 后再 open 常被拦截 → 「有时点不了 / 不跳转」
    const win = window.open("about:blank", "_blank");
    try {
      const url = await fetchCsUrl(scene);
      if (!url) {
        if (win) win.close();
        return false;
      }
      return navigateOpenedWindow(win, url);
    } catch (e) {
      if (win) {
        try {
          win.close();
        } catch (err) {
          /* ignore */
        }
      }
      return false;
    }
  } finally {
    setTimeout(() => {
      csOpening = false;
    }, 800);
  }
}
