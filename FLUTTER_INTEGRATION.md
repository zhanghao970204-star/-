# H5 × Flutter App 集成说明（给 Web 前端）

本文说明 B 面 H5 在 **Goodgame / LuckyPlay** Flutter App 内 WebView 中的运行方式。按此约定构建与发版，可避免 iOS 白屏、接口 `Network Error`、资源 404 等问题。

---

## 仓库目录：`flutter_app` 与 `flutter_bridge`

仓库根目录下这两个文件夹分工不同：**真正打 APK / 跑 App 的是 `flutter_app`**；**`flutter_bridge` 只是对接参考样例，不参与打包。**

### `flutter_app/` — Guest Shell（可安装的 Flutter 壳）

完整 Flutter 工程（包名 `guest_shell`）：内嵌 WebView + 本地 HTTP 静态服务 + `/a/` API 反代，把 Vue `dist` 当 App 打开。日常「更新 H5 再出包」都在这里做。

| 路径 | 作用 |
| ---- | ---- |
| `lib/main.dart` | App 入口：本地 shelf 服务、WebView、uuid 注入、登录态与 H5 `localStorage` 同步、外链 `url_launcher` 等 |
| `lib/h5/` | **内置 H5 资源**（由根目录 `dist/` 同步过来）；含 `index.html`、`assets/`、`img/`、`version.json`；`pubspec.yaml` 已声明为 Flutter assets |
| `pubspec.yaml` / `pubspec.lock` | Flutter 依赖（`webview_flutter`、`shelf`、`shared_preferences`、`uuid`、`url_launcher` 等） |
| `android/` | Android 工程；用这里的 `./gradlew :app:packageRelease` 打 arm64 release |
| `android/app/` | 应用模块：`build.gradle.kts`、包名/图标/权限、`MainActivity`、资源 |
| `android/local-flutter-maven/` | 本地 Flutter engine / 部分依赖 Maven 缓存，减少打包装 Google |
| `android/gradle*` / `gradlew` | Gradle Wrapper 与配置（含镜像、跳过 lintVital 等） |
| `ios/` | iOS Runner 工程（Xcode）；本仓库当前主流程是 Android APK |
| `assets/` | 预留原生侧额外资源（与 `lib/h5` 的 H5 包分开） |
| `build/` | 构建产物（可删可重建）；APK 最终在 `build/app/outputs/flutter-apk/app-release.apk` |
| `test/` | Flutter 测试占位 |
| `*.log` / 根下旧 `.apk` | 本地打包日志或历史包，**不是源码**，可忽略 |

### `flutter_bridge/` — H5 ↔ Flutter 桥接参考（样例）

**不是**可运行工程，也**没有**被 `flutter_app` 以 package 引用。里面是给「别的 Flutter 工程」抄用的对接示意；本仓库正式逻辑已写在 `flutter_app/lib/main.dart`。

| 文件 | 作用 |
| ---- | ---- |
| `native_device_id.dart` | 用 `SharedPreferences` 持久化设备 uuid，页面加载完后 `runJavaScript` 调用 H5 的 `window.setNativeUuid(...)` |
| `app_webview_page.dart` | 最小 WebView 页示例：`onPageFinished` 里调用上面的注入；注释说明如何接到真实工程 |

H5 侧对应约定见下文「Native 注入」：优先用 Flutter 注入的 uuid，再回落到 Vue 本地指纹。

---

## 1. 部署形态（和纯浏览器不一样）

| 环境               | 页面来源                       | 静态资源路径                     | API 建议                          |
| ------------------ | ------------------------------ | -------------------------------- | --------------------------------- |
| 线上 CDN / 浏览器  | `https://your-cdn/`            | Vite `base: '/'` → `/assets/...` | `https://api.luckyhubx.cc/a/`     |
| **App 内 WebView** | `http://127.0.0.1:<随机端口>/` | 同上，由 App 本地静态服务提供    | **必须** `baseURL: '/a/'`（同源） |

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
  base: "/", // 保持 /assets/xxx 绝对路径，与 App 本地服务一致
});
```

`index.html` 中入口脚本可能是 `./assets/index-xxx.js` 或 `/assets/index-xxx.js`，均可；App 会按 URL 路径映射到磁盘文件。

---

## 3. API / Axios 约定

**App 内唯一推荐写法：**

```js
const instance = axios.create({
  baseURL: "/a/",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});
```

若需同时兼容「浏览器直连 CDN 域名」与「App 内嵌」，可在**源码**里区分（不要只依赖 `location.origin`）：

```js
function resolveApiBase() {
  // App WebView：页面来自 127.0.0.1 / localhost
  if (/^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?$/i.test(location.origin)) {
    return "/a/";
  }
  return "https://api.luckyhubx.cc/a/";
}
```

当前仓库在 **`index.html` 头部** 对 legacy 域名做了 XHR/fetch 兜底重写（OTA 旧包用）。**新构建请仍以 `baseURL: '/a/'` 为准**，不要依赖兜底长期存在。

后端需允许来自 App 的 CORS（若仍走外域调试）：`Origin: http://127.0.0.1:*`；**正式 App 内走 `/a/` 代理时为同源，无 CORS 问题**。

---

## 4. Native 注入（UUID / 启动参数）

`index.html` 内联脚本已提供：

| 方法                                                | 说明                                      |
| --------------------------------------------------- | ----------------------------------------- |
| `window.setNativeUuid(uuid)`                        | Flutter 在 `onPageFinished` 后注入访客 ID |
| `window.getClientId()` / 包内 `resolveClientIdSync` | 请求体里的 `uuid` 字段                    |

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

| 现象                                            | 原因                                  |
| ----------------------------------------------- | ------------------------------------- |
| Android 正常、iOS `Axios Network Error`         | 多为 **跨域请求外域 API**；改为 `/a/` |
| 界面蓝/紫底无内容                               | 静态资源 404（路径或 OTA 不完整）     |
| vConsole 里脚本来自 `127.0.0.1:端口/assets/...` | 正常，说明在 App 内嵌环境             |

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

| 路径                            | 说明                        |
| ------------------------------- | --------------------------- |
| `lib/h5/`                       | 内置 H5 静态资源            |
| `lib/h5/version.json`           | H5 版本号                   |
| `lib/h5/FLUTTER_INTEGRATION.md` | 本文档                      |
| Flutter `H5LocalServer`         | 本地静态 + `/a/` API 代理   |
| Flutter `H5BundlePaths`         | 沙盒 OTA / 内置包选择与校验 |

API 生产域名：**`https://api.luckyhubx.cc`**（路径前缀 **`/a/`**）。

如有新的全局配置（语言、货币、platform），请与现有 `localStorage` + 请求体字段保持一致，并在发版说明里注明是否影响 App 内嵌。

## 快速打包流程（仅更新 H5 后出 arm64 release）

> 适用：已能编过一次 release、本地已有 Flutter engine / 依赖缓存。  
> 先在仓库根目录跑完 `npm run build`（产出 `dist/`），再执行下面一条命令。  
> **不要**每次都跑 `flutter build apk`。

### 一条命令（仓库根目录粘贴执行）

```bash
export JAVA_HOME="/Users/suit/Downloads/jdk-21.0.12+8/Contents/Home" GRADLE_USER_HOME="$HOME/.gradle" PATH="$JAVA_HOME/bin:$PATH" && \
rm -rf flutter_app/lib/h5 && mkdir -p flutter_app/lib/h5 && cp -R dist/. flutter_app/lib/h5/ && find flutter_app/lib/h5 -name .DS_Store -delete && \
for p in jni jni_flutter shared_preferences_android webview_flutter_android url_launcher_android; do d="flutter_app/build/$p/intermediates/annotations_typedef_file/release/extractReleaseAnnotations"; mkdir -p "$d"; : > "$d/typedefs.txt"; done && \
cd flutter_app/android && ./gradlew :app:packageRelease :app:createReleaseApkListingFileRedirect -Ptarget-platform=android-arm64 --offline --no-daemon && \
mkdir -p ../build/app/outputs/flutter-apk && cp -f ../build/app/outputs/apk/release/app-release.apk ../build/app/outputs/flutter-apk/app-release.apk && \
ls -lh ../build/app/outputs/flutter-apk/app-release.apk
```

缺依赖时报错时，把上面里的 `--offline` 删掉再跑一次。

成品：`flutter_app/build/app/outputs/flutter-apk/app-release.apk`（arm64，约 30MB）

### 登录态同步（App）

**写入**：一律 `saveLoginSession()`（禁止裸写 `localStorage.token`）。App 内 `setItem` hook → `storageSet` → SharedPreferences；写 `token` 时会重写 boot。

**清除**：
| 场景 | H5 API | NativeBridge |
|------|--------|--------------|
| 退出 / 改密 / 忘记密码 | `clearAuthAndReload()` | `clearAuth` + `reload:true` → 清存储后原生回首页 |
| 账号被挤 `need_login` / 切平台 | `clearAuthLocalAndNative({reload:false})` | `clearAuth` + `reload:false` → 只清存储，H5 弹登录 |
| 游客升级 | `saveLoginSession(..., {clearGuest:true})` + `reloadAppEntry()` | hook 同步新 token |

杀进程重进后再退出时写 boot 可能较慢；过早 reload 会把旧 token 写回。以原生写完 boot 为准，H5 仅 5s 兜底。
