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
