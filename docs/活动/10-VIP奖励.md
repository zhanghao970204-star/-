# VIP 升级奖励（旧版）

## 入口

- 旧 Bonus 页“用户等级”卡跳转 `/signIn`。
- 新版活动中心的 VIP Club 横幅跳转 `/vipLevels`，它是 VIP 等级页，不是本活动的同一详情页。

## 用户流程

1. 已登录时请求 `Init` 获取当前 `vipLevel`，并调用 `GetVipAwardInit` 获取活动状态和规则表。
2. 页面以服务端 `ruleList` 展示 VIP 档位和可获奖励。
3. 当后端状态允许时调用 `GetVipAward` 领取，成功后刷新数据。

## 规则来源

VIP 档位、奖励、是否可领取与条件由接口返回决定；页面不保存本地奖励计算规则。

## 相关实现

- 页面：`src/views/details/bonus/signIn.vue`
- 接口：`/activity/getVipAwardInit`、`/activity/getVipAward`、`/profile/init`
