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
