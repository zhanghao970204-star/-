# 资源与首屏优化说明

## 本次结果

- 无损重压缩 252 张 PNG，减少 458151 字节（约 447.4 KiB）。
- 与 Git 原图逐张比较：PNG 解压后的扫描行数据、透明度相关数据、调色板、色彩和其他元数据完全一致。
- 删除 20 张无引用图片，减少 429685 字节（约 419.6 KiB）。两项合计减少约 867.0 KiB。
- 保留头像、VIP、彩票、充值等动态路径目录，以及可供外部访问的 public 图片。
- JPG、WebP、GIF 和实际为 WebP 的同名 PNG 未做有损重编码；尺寸、文件名、格式不变。

## 代码调整

- `src/utils/appConstants.js` 统一默认语言、存储键名、接口域名、路径、超时、平台和币种默认值。用户实际配置仍在原调用位置读取。
- `src/utils/assetResolver.js` 为图片文件名建立一次性索引，复用原有查找优先级和路径后缀匹配行为。
- 语言包按当前语言与英文回退并行加载，其余语言保持懒加载。
- 首页首张轮播图优先加载；屏外列表与页脚图片使用浏览器原生懒加载和异步解码。
- Vant 不再强制合并所有路由组件到一个大块，由 Rollup 按使用关系拆分。
- 生产配置清理本地 JS/CSS/HTML 源码注释、普通 console 调用和 debugger，保持 sourcemap 关闭；开发环境保留调试输出。
- console 清理使用 pure 配置，保留日志参数中的函数调用副作用。外部 CDN SDK 的输出不由本地构建控制，Vue 用于更新 DOM 的占位注释也不应删除。

## 维护方式

```sh
# 默认只审计，不删除
node scripts/remove-unused-images.mjs
# 确认后应用，删除前自动备份
node scripts/remove-unused-images.mjs --apply
# 默认只计算无损压缩收益
python3 scripts/compress-images.py
# 应用无损压缩
python3 scripts/compress-images.py --apply
```

本次删除备份（含文件清单）位于 `/var/folders/r7/bp_zk7793zn77p95flj301nw0000gn/T/lz-unused-images-4zf9lN`；这些文件也均可从 Git 中恢复。临时目录可能被系统清理。

已核对 JS/Vue 语法、图片引用、无损一致性与 diff。未执行构建/打包、部署或浏览器性能测量；生产产物和首屏实际耗时需在后续明确授权的构建与运行验证中确认。
