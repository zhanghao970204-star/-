# VIP 签到（旧版）

## 入口与流程

- 旧 Bonus 页“神秘”活动卡跳转 `/vipSignIn`。
- 已登录时调用 `GetSignIn`，从响应 `ruleList` 生成签到档位和当天可领取金额。
- 符合资格时调用 `SignIn` 领取，成功后重新请求 `GetSignIn`。

## 规则来源

签到连续天数、每档奖励、领取资格及活动说明均由服务端返回；前端只将规则表解析并渲染。

## 相关实现

- 页面：`src/views/details/bonus/vipSignIn.vue`
- 接口：`/activity/getSignIn`、`/activity/signIn`
