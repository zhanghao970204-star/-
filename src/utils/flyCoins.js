import coinUrl from "@/assets/img/home/fjb.png";

let coinContainer = null;
const coinElements = [];

function ensureCoins() {
  if (coinContainer) return;
  coinContainer = document.createElement("div");
  coinContainer.style.cssText =
    "position:fixed;left:0;top:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483647;";
  for (let i = 1; i <= 6; i++) {
    const coin = document.createElement("div");
    coin.style.cssText =
      "position:absolute;width:22px;height:22px;opacity:0;transition:all 1.2s cubic-bezier(0.2,0.8,0.3,1);z-index:2147483647;";
    const img = new Image();
    img.src = coinUrl;
    img.style.width = "100%";
    img.style.height = "100%";
    img.draggable = false;
    coin.appendChild(img);
    coinElements[i] = coin;
    coinContainer.appendChild(coin);
  }
  document.body.appendChild(coinContainer);
}

function walletPos() {
  const el =
    document.querySelector(".nav-balance__num") ||
    document.querySelector(".nav-balance");
  if (!el) return { x: window.innerWidth * 0.5, y: 24 };
  const rect = el.getBoundingClientRect();
  const width = rect.width || 60;
  const height = rect.height || 24;
  return {
    x: rect.left + width / 2 - 11,
    y: rect.top + height / 2 - 11,
  };
}

function pointFromEvent(e) {
  if (!e) return null;
  if (e.clientX != null && e.clientY != null) {
    return { x: e.clientX, y: e.clientY };
  }
  const touch = (e.changedTouches && e.changedTouches[0]) || (e.touches && e.touches[0]);
  if (touch) return { x: touch.clientX, y: touch.clientY };
  return null;
}

/** 从点击位置飞金币到顶部余额，动画结束后 resolve */
export function flyCoins(e) {
  const start = pointFromEvent(e);
  const COIN_COUNT = 6;
  const STEP = 188;
  const FLY_MS = 1200;
  if (!start) return Promise.resolve();
  ensureCoins();
  for (let i = 1; i <= COIN_COUNT; i++) {
    setTimeout(() => {
      const coin = coinElements[i];
      if (!coin) return;
      coin.style.transition = "none";
      coin.style.opacity = "0";
      coin.style.left = start.x - 11 + "px";
      coin.style.top = start.y - 11 + "px";
      void coin.offsetHeight;
      coin.style.transition = "all 1.2s cubic-bezier(0.2, 0.8, 0.3, 1)";
      coin.style.opacity = "1";
      setTimeout(() => {
        const pos = walletPos();
        coin.style.left = pos.x + "px";
        coin.style.top = pos.y + "px";
      }, 68);
      setTimeout(() => {
        coin.style.opacity = "0";
      }, FLY_MS);
    }, i * STEP);
  }
  return new Promise((resolve) => {
    setTimeout(resolve, COIN_COUNT * STEP + FLY_MS + 80);
  });
}
