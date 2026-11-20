/**
 * 首页 getHomeGameList 结构兼容：
 * - partType=3 树形：分类下有 types，types[].games
 * - partType=1 列表：分类自身直接带 games
 * 统一成「分类.types[].games」供页面渲染
 */

export function normalizeHomeCategory(item) {
  if (!item || typeof item !== "object") return null;

  // 厂商入口：types 里是厂商项，不一定有 games
  if (item.sortType === 1) {
    return {
      ...item,
      types: Array.isArray(item.types) ? item.types : [],
    };
  }

  const hasTypes = Array.isArray(item.types) && item.types.length > 0;
  const hasGames = Array.isArray(item.games);

  if (hasTypes) {
    const types = item.types
      .filter(Boolean)
      .map((t) => {
        // type 自身已是游戏列表
        if (Array.isArray(t.games)) return t;
        // type 下还有一层 types（极少见），展平为带 games 的项
        if (Array.isArray(t.types) && t.types.length) {
          return t.types.filter((sub) => sub && Array.isArray(sub.games));
        }
        return null;
      })
      .flat()
      .filter((t) => t && Array.isArray(t.games));
    return { ...item, types };
  }

  // 扁平列表：自身 games 包装成唯一 type
  if (hasGames) {
    return {
      ...item,
      types: [
        {
          code: item.code,
          name: item.name,
          icon: item.icon,
          homeIcon: item.homeIcon || item.icon,
          order: item.order,
          showName: item.showName,
          currency: item.currency,
          games: item.games,
        },
      ],
    };
  }

  return { ...item, types: [] };
}

// 彩票已下线：接口仍可能返回彩票分类（code）与彩票游戏（gid 1~32），前端统一过滤
const LOTTERY_TYPE_CODES = ["2000701", "2000702"];
const isLotteryType = (code) => LOTTERY_TYPE_CODES.includes(String(code));
const isLotteryGame = (g) => {
  const gid = Number(g && g.gid);
  return Number.isInteger(gid) && gid >= 1 && gid <= 32;
};
const withoutLotteryGames = (games) => games.filter((g) => !isLotteryGame(g));

function stripLottery(item) {
  return {
    ...item,
    types: (item.types || [])
      .filter((t) => t && !isLotteryType(t.code))
      .map((t) =>
        Array.isArray(t.games) ? { ...t, games: withoutLotteryGames(t.games) } : t,
      ),
  };
}

export function normalizeHomeDataList(dataList) {
  if (!Array.isArray(dataList)) return [];
  return dataList
    .filter((item) => item && !isLotteryType(item.code))
    .map(normalizeHomeCategory)
    .filter(Boolean)
    .map((item) => {
      const stripped = stripLottery(item);
      // 过滤彩票后变空的分类整块丢掉（本来就没有 types 的分类保持原样）
      return item.types.length && !stripped.types.length ? null : stripped;
    })
    .filter(Boolean);
}

/** Hot：兼容第一项直接 games，或树形 types[].games */
export function getCategoryGames(item) {
  if (!item) return [];
  if (Array.isArray(item.games) && item.games.length) {
    return withoutLotteryGames(item.games);
  }
  if (Array.isArray(item.types)) {
    return withoutLotteryGames(
      item.types.flatMap((t) =>
        t && !isLotteryType(t.code) && Array.isArray(t.games) ? t.games : [],
      ),
    );
  }
  return [];
}

/** 首页列表全局缓存：localStorage 持久化，登出/杀进程仍可用；30 分钟刷新 */
export const HOME_GAME_LIST_TTL_MS = 30 * 60 * 1000;
const LS_KEY = "homeGameListCache_v1";

let homeGameListCache = null;
let homeGameListPollTimer = null;
let homeGameListFetching = false;

function lobbyTypeCount(pgDate) {
  const list = pgDate && Array.isArray(pgDate.dataList) ? pgDate.dataList : [];
  const lobby = list[0];
  return lobby && Array.isArray(lobby.types) ? lobby.types.length : 0;
}

function readDiskCache() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !parsed.pgDate || !lobbyTypeCount(parsed.pgDate)) return null;
    return parsed;
  } catch (e) {
    return null;
  }
}

function writeDiskCache(payload) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(payload));
  } catch (e) {
    /* quota / private mode */
  }
}

/** 启动时从磁盘灌入内存，打开链接即可用缓存 */
function hydrateFromDisk() {
  if (homeGameListCache) return;
  const disk = readDiskCache();
  if (disk) homeGameListCache = disk;
}

hydrateFromDisk();

export function getHomeGameListCache() {
  if (!homeGameListCache) hydrateFromDisk();
  return homeGameListCache;
}

export function setHomeGameListCache(payload) {
  if (!payload || !payload.pgDate || !lobbyTypeCount(payload.pgDate)) {
    return;
  }
  homeGameListCache = {
    pgDate: payload.pgDate,
    hotGames: Array.isArray(payload.hotGames) ? payload.hotGames : [],
    activeTab: payload.activeTab || 0,
    visibleTypeCount: payload.visibleTypeCount || 3,
    at: payload.at || Date.now(),
  };
  writeDiskCache(homeGameListCache);
  prefetchHomeGameImages(homeGameListCache);
}

export function isHomeGameListCacheFresh(ttlMs = HOME_GAME_LIST_TTL_MS) {
  const c = getHomeGameListCache();
  if (!c || !lobbyTypeCount(c.pgDate)) return false;
  return Date.now() - (c.at || 0) < ttlMs;
}

/** 把接口 content 转成首页可用的 Lobby 结构 */
export function buildHomeLobbyFromApiContent(content) {
  const rawList = Array.isArray(content && content.dataList)
    ? content.dataList
    : [];
  const hotGames = getCategoryGames(rawList[0]);
  const rest = normalizeHomeDataList(
    rawList.slice(1).filter((item) => item && item.sortType !== 2),
  );
  const typesArr = rest
    .filter((item) => item.sortType !== 1)
    .flatMap((item) => item.types || [])
    .filter((type) => type && Array.isArray(type.games));
  const dataList = [
    {
      name: "Lobby",
      icon: "", // 页面侧补本地 icon，避免缓存写死 require 路径
      types: typesArr,
      sortType: 0,
    },
    ...rest,
  ];
  return {
    pgDate: { ...(content || {}), dataList },
    hotGames,
  };
}

function collectImageUrls(cache) {
  const urls = [];
  const push = (u) => {
    if (u && typeof u === "string" && /^https?:\/\//i.test(u)) urls.push(u);
  };
  const list = (cache && cache.pgDate && cache.pgDate.dataList) || [];
  list.forEach((cat) => {
    push(cat && cat.icon);
    push(cat && cat.homeIcon);
    (cat && cat.types ? cat.types : []).forEach((t) => {
      push(t && t.icon);
      push(t && t.homeIcon);
      (t && t.games ? t.games : []).forEach((g) => {
        push(g && (g.icon || g.gameIcon || g.img || g.imageUrl));
      });
    });
  });
  (cache && cache.hotGames ? cache.hotGames : []).forEach((g) => {
    push(g && (g.icon || g.gameIcon || g.img || g.imageUrl));
  });
  return [...new Set(urls)].slice(0, 120);
}

/** 预热图片到浏览器/WebView 磁盘缓存 */
export function prefetchHomeGameImages(cache) {
  if (typeof Image === "undefined") return;
  const urls = collectImageUrls(cache || getHomeGameListCache());
  urls.forEach((src) => {
    try {
      const img = new Image();
      img.decoding = "async";
      img.src = src;
    } catch (e) {
      /* ignore */
    }
  });
}

/**
 * 全局拉一次列表并写入缓存（与登录态无关）。
 * @returns {Promise<object|null>} 最新 cache
 */
export async function refreshHomeGameListCache({ force = false } = {}) {
  if (!force && isHomeGameListCacheFresh()) {
    return getHomeGameListCache();
  }
  if (homeGameListFetching) {
    return getHomeGameListCache();
  }
  homeGameListFetching = true;
  try {
    const { GetHomeGameList } = await import("@/api/common");
    const data = await GetHomeGameList();
    if (!data || data.status !== "ok") return getHomeGameListCache();
    const built = buildHomeLobbyFromApiContent(data.content || {});
    const prev = getHomeGameListCache();
    setHomeGameListCache({
      ...built,
      activeTab: (prev && prev.activeTab) || 0,
      visibleTypeCount: (prev && prev.visibleTypeCount) || 3,
      at: Date.now(),
    });
    try {
      const { default: bus } = await import("@/utils/eventBus");
      bus.emit("home-game-list-updated", getHomeGameListCache());
    } catch (e) {
      /* ignore */
    }
    return getHomeGameListCache();
  } catch (e) {
    console.error("refreshHomeGameListCache", e);
    return getHomeGameListCache();
  } finally {
    homeGameListFetching = false;
  }
}

/** App 启动：有缓存先用；过期/没有则拉；并开启 30 分钟全局刷新 */
export function startHomeGameListGlobalCache() {
  hydrateFromDisk();
  const fresh = isHomeGameListCacheFresh();
  if (fresh) {
    prefetchHomeGameImages(getHomeGameListCache());
  } else {
    refreshHomeGameListCache({ force: true });
  }
  if (homeGameListPollTimer) return;
  homeGameListPollTimer = setInterval(() => {
    refreshHomeGameListCache({ force: true });
  }, HOME_GAME_LIST_TTL_MS);
}

/** 收集所有游戏（搜索 / 推荐） */
export function collectHomeGames(dataList, currency) {
  const list = normalizeHomeDataList(dataList);
  const games = [];
  const matchCurrency = (raw) => {
    if (!currency || !raw) return !currency;
    return raw
      .split(",")
      .map((c) => c.trim())
      .includes(currency);
  };

  // Hot 与厂商分组会重复返回同一游戏，按 gid 去重
  const seen = new Set();
  list.forEach((item) => {
    if (item.currency && !matchCurrency(item.currency)) return;
    (item.types || []).forEach((t) => {
      if (!Array.isArray(t.games)) return;
      if (t.currency && !matchCurrency(t.currency)) return;
      t.games.forEach((g) => {
        if (!g) return;
        if (g.gid != null) {
          if (seen.has(g.gid)) return;
          seen.add(g.gid);
        }
        games.push(g);
      });
    });
  });
  return games;
}
