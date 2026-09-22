import {
  showToast,
  showLoadingToast,
  showSuccessToast,
  showFailToast,
  closeToast
} from 'vant'
import 'vant/es/toast/style'

function normalizeOptions(opts) {
  if (typeof opts === 'string') {
    return { message: opts }
  }
  return opts || {}
}

function toast(opts) {
  const options = normalizeOptions(opts)
  const { icon, type, message, ...rest } = options
  if (icon === 'success' || type === 'success') {
    return showSuccessToast({ message, ...rest })
  }
  if (icon === 'cross' || icon === 'fail' || type === 'fail') {
    return showFailToast({ message, ...rest })
  }
  return showToast({ message, icon, ...rest })
}

toast.loading = (opts) => {
  const options = normalizeOptions(opts)
  return showLoadingToast({
    forbidClick: true,
    duration: 0,
    ...options
  })
}

toast.clear = () => closeToast()
toast.success = (message) => showSuccessToast(message)
toast.fail = (message) => showFailToast(message)

export default toast
