# H5 × Flutter App 集成说明（给 Web 前端）

本文说明 B 面 H5 在 **Goodgame / LuckyPlay** Flutter App 内 WebView 中的运行方式。按此约定构建与发版，可避免 iOS 白屏、接口 `Network Error`、资源 404 等问题。

---

## 1. 部署形态（和纯浏览器不一样）

| 环境 | 页面来源 | 静态资源路径 | API 建议 |
|------|----------|--------------|----------|
| 线上 CDN / 浏览器 | `https://your-cdn/` | Vite `base: '/'` → `/assets/...` | `https://api.luckyhubx.cc/a/` |
| **App 内 WebView** | `http://127.0.0.1:<随机端口>/` | 同上，由 App 本地静态服务提供 | **必须** `baseURL: '/a/'`（同源） |

App 不会用 `file://` 打开 H5（Vite 产物带 `/assets/` 绝对路径，iOS 会挂）。  
Native 启动本地 HTTP 服务加载 `index.html`，并把 **`/a/*` 反向代理**到 `https://api.luckyhubx.cc/a/*`。

因此：

- **不要**在 App 场景里用 `window.location.origin + '/a/'` 当接口地址（origin 是 `127.0.0.1`，没有业务 API）。
- **不要**在 App 场景里写死仅 `https://us.luckyhubx.cc/a/` 等外域（iOS WKWebView 跨域 XHR 易报 `Network Error` / `ERR_NETWORK`）。
- **推荐**：生产构建统一 `baseURL: '/a/'`；浏览器独立部署时由 **Nginx 把 `/a/` 反代到 API**，与 App 行为一致。

---

## 2. 构建与目录

- 构建产物放入仓库：**`lib/h5/`**（Flutter `pubspec.yaml` 已声明资源）。
- 发版前更新 **`lib/h5/version.json`** 的 `version`（整数或字符串均可，App 用来对比是否覆盖 OTA 缓存）。
- 嵌套目录需在 Flutter 中**显式声明**（Flutter 对 `lib/` 下子目录不会自动递归打包）：
  - `lib/h5/assets/`
  - `lib/h5/img/`

### Vite 建议

```ts
// vite.config.ts
export default defineConfig({
  base: '/', // 保持 /assets/xxx 绝对路径，与 App 本地服务一致
});
```

`index.html` 中入口脚本可能是 `./assets/index-xxx.js` 或 `/assets/index-xxx.js`，均可；App 会按 URL 路径映射到磁盘文件。

---

## 3. API / Axios 约定

**App 内唯一推荐写法：**

```js
const instance = axios.create({
  baseURL: '/a/',
  timeout: 60000,
  headers: { 'Content-Type': 'application/json' },
});
```

若需同时兼容「浏览器直连 CDN 域名」与「App 内嵌」，可在**源码**里区分（不要只依赖 `location.origin`）：

```js
function resolveApiBase() {
  // App WebView：页面来自 127.0.0.1 / localhost
  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(location.origin)) {
    return '/a/';
  }
  return 'https://api.luckyhubx.cc/a/';
}
```

当前仓库在 **`index.html` 头部** 对 legacy 域名做了 XHR/fetch 兜底重写（OTA 旧包用）。**新构建请仍以 `baseURL: '/a/'` 为准**，不要依赖兜底长期存在。

后端需允许来自 App 的 CORS（若仍走外域调试）：`Origin: http://127.0.0.1:*`；**正式 App 内走 `/a/` 代理时为同源，无 CORS 问题**。

---

## 4. Native 注入（UUID / 启动参数）

`index.html` 内联脚本已提供：

| 方法 | 说明 |
|------|------|
| `window.setNativeUuid(uuid)` | Flutter 在 `onPageFinished` 后注入访客 ID |
| `window.getClientId()` / 包内 `resolveClientIdSync` | 请求体里的 `uuid` 字段 |

业务请求 JSON 里通常需要 `uuid`（见现有 `transformRequest`）。**不要在 App 内仅依赖浏览器 fingerprint** 作为唯一设备 ID。

Flutter 侧还有 `flutterBridge` 通道（`getVisitorId`），**当前 H5 主包未强制使用**；以 `setNativeUuid` 为准即可。

`window.__GOODGAME__` 等为 Native 扩展字段，H5 未接入可忽略。

---

## 5. OTA 热更新（checkVersion / h5.zip）

- B 面用户可能从 CDN 拉 **整包 zip** 覆盖 App 沙盒里的 `h5/`。
- zip 内应包含完整 **`index.html` + `assets/` + `version.json`**，结构与 `lib/h5/` 一致。
- **zip 内若仍是旧 API（外域 `us.luckyhubx.cc` 等），iOS 会再次出现 Network Error**；发 OTA 前务必与 App 内置包对齐。
- App 内置 **`version.json` 更高** 或检测到旧 API 配置时，会丢弃沙盒包并重新解压内置资源。

---

## 6. iOS vs Android（Web 需知）

| 现象 | 原因 |
|------|------|
| Android 正常、iOS `Axios Network Error` | 多为 **跨域请求外域 API**；改为 `/a/` |
| 界面蓝/紫底无内容 | 静态资源 404（路径或 OTA 不完整） |
| vConsole 里脚本来自 `127.0.0.1:端口/assets/...` | 正常，说明在 App 内嵌环境 |

第三方脚本（如客服 `salesmartly.com`）失败不影响主接口，但会在 vConsole 里报错，可单独评估是否在 App WebView 禁用。

---

## 7. 发版检查清单

- [ ] `npm run build` 产物拷贝到 `lib/h5/`，包含 `index.html`、`assets/`、`version.json`
- [ ] **`version.json` 版本号递增**
- [ ] 主包 JS 中 `axios` **`baseURL` 为 `'/a/'`**（或源码里 App 分支明确）
- [ ] 确认 **无** 仅面向 `location.origin` 的 API 逻辑
- [ ] OTA zip 与内置包 **同一套 API 策略**
- [ ] 在 App 内 vConsole → Network 查看请求为 `http://127.0.0.1:xxxx/a/...` 且返回 200

---

## 8. 本地调试建议

1. 浏览器：Nginx 静态站 + `/a/` 反代 `https://api.luckyhubx.cc`（模拟 App）。
2. App：改完 `lib/h5/` 后 **`flutter clean` + 卸载 App 重装**，避免沙盒 OTA 旧包。
3. iOS：Safari **开发 → 设备 → WebView** 看 Network / Console。

---

## 9. 联系与仓库路径

| 路径 | 说明 |
|------|------|
| `lib/h5/` | 内置 H5 静态资源 |
| `lib/h5/version.json` | H5 版本号 |
| `lib/h5/FLUTTER_INTEGRATION.md` | 本文档 |
| Flutter `H5LocalServer` | 本地静态 + `/a/` API 代理 |
| Flutter `H5BundlePaths` | 沙盒 OTA / 内置包选择与校验 |

API 生产域名：**`https://api.luckyhubx.cc`**（路径前缀 **`/a/`**）。

如有新的全局配置（语言、货币、platform），请与现有 `localStorage` + 请求体字段保持一致，并在发版说明里注明是否影响 App 内嵌。
