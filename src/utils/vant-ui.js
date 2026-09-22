import { Lazyload, showDialog, showConfirmDialog, showToast } from 'vant'
import 'vant/es/dialog/style'
import toast from './toast'

export function setupVant(app) {
  // 模板组件由 unplugin-vue-components 按需引入（含对应样式）
  // 这里只注册无法按需的 Lazyload，以及函数式 API
  app.use(Lazyload)

  app.config.globalProperties.$toast = toast
  app.config.globalProperties.$dialog = {
    alert: (options) => showDialog(options),
    confirm: (options) => showConfirmDialog(options),
    ...showDialog
  }
  app.config.globalProperties.$showToast = showToast
}
