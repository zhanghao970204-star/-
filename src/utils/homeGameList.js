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

export function normalizeHomeDataList(dataList) {
  if (!Array.isArray(dataList)) return [];
  return dataList.map(normalizeHomeCategory).filter(Boolean);
}

/** Hot：兼容第一项直接 games，或树形 types[].games */
export function getCategoryGames(item) {
  if (!item) return [];
  if (Array.isArray(item.games) && item.games.length) return item.games;
  if (Array.isArray(item.types)) {
    return item.types.flatMap((t) => (t && Array.isArray(t.games) ? t.games : []));
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

  list.forEach((item) => {
    if (item.currency && !matchCurrency(item.currency)) return;
    (item.types || []).forEach((t) => {
      if (!Array.isArray(t.games)) return;
      if (t.currency && !matchCurrency(t.currency)) return;
      games.push(...t.games);
    });
  });
  return games;
}
