const cache = new Map();

/**
 * 配置类接口去重：并发调用只发一次请求，成功结果在 ttlMs 内复用；失败不缓存
 */
export function cachedRequest(key, fetcher, ttlMs = 30000) {
  const hit = cache.get(key);
  if (hit && (hit.pending || Date.now() - hit.at < ttlMs)) {
    return hit.promise;
  }
  const entry = { pending: true, at: 0 };
  entry.promise = fetcher().then(
    (res) => {
      entry.pending = false;
      entry.at = Date.now();
      if (!res || res.status !== "ok") cache.delete(key);
      return res;
    },
    (err) => {
      cache.delete(key);
      throw err;
    },
  );
  cache.set(key, entry);
  return entry.promise;
}

const inflight = new Map();

function cloneResponse(res) {
  if (res == null || typeof res !== "object") return res;
  try {
    // 游戏列表等大体量：structuredClone/JSON 深拷会卡主线程数秒，像「列表不加载」
    // 只浅拷贝外壳；content 引用共享。调用方应把 content 赋给本地再改，勿原地 mutually 污染
    if (res.content && typeof res.content === "object") {
      const content = res.content;
      if (Array.isArray(content.dataList) && content.dataList.length > 20) {
        return { ...res, content: { ...content, dataList: content.dataList.slice() } };
      }
      return { ...res, content: { ...content } };
    }
    return { ...res };
  } catch (e) {
    return res;
  }
}

/**
 * 只读公共接口去重：同一账号、同一参数的请求正在进行时复用它，结束即释放，不做缓存，
 * 不影响数据新鲜度。每个调用方拿到独立副本，避免一处修改返回数据影响另一处。
 */
export function dedupeRequest(name, data, fetcher) {
  let payload = "";
  try {
    payload = JSON.stringify(data || {});
  } catch (e) {
    return fetcher();
  }
  const key = `${name}|${localStorage.getItem("token") || ""}|${payload}`;
  let task = inflight.get(key);
  if (!task) {
    task = fetcher().finally(() => inflight.delete(key));
    inflight.set(key, task);
  }
  return task.then(cloneResponse);
}
