import toast from "./toast";

export function copyToClipboard(text) {
  const value = String(text || "");
  if (!value) return Promise.resolve(false);
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard
      .writeText(value)
      .then(() => true)
      .catch(() => legacyCopy(value));
  }
  return Promise.resolve(legacyCopy(value));
}

function legacyCopy(value) {
  try {
    const textarea = document.createElement("textarea");
    textarea.value = value;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(textarea);
    return ok;
  } catch (e) {
    return false;
  }
}

export function buildInviteUrl() {
  const code = localStorage.getItem("shareCode") || "";
  const country = localStorage.getItem("country") || "US";
  return `${window.location.origin}/${country}/home${code ? `?id=${code}` : ""}`;
}

/** 系统分享；不支持时复制链接并提示 */
export function shareLink(url, { title = "LuckyPlay", text = "", copiedText } = {}) {
  if (navigator.share) {
    return navigator.share({ title, text: text || title, url }).catch(() => {});
  }
  return copyToClipboard(url).then((ok) => {
    toast(ok ? copiedText || "Link copied" : url);
  });
}

/** 按渠道打开带邀请链接的分享页；渠道不支持带参时复制链接 */
export function shareToChannel(channel, url, { text = "", copiedText } = {}) {
  const u = encodeURIComponent(url);
  const t = encodeURIComponent(text ? `${text} ${url}` : url);
  const map = {
    whatsapp: `https://wa.me/?text=${t}`,
    telegram: `https://t.me/share/url?url=${u}${text ? `&text=${encodeURIComponent(text)}` : ""}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${u}`,
    twitter: `https://twitter.com/intent/tweet?url=${u}${text ? `&text=${encodeURIComponent(text)}` : ""}`,
  };
  if (map[channel]) {
    window.open(map[channel], "_blank");
    return Promise.resolve();
  }
  return copyToClipboard(url).then((ok) => {
    toast(ok ? copiedText || "Link copied" : url);
  });
}
