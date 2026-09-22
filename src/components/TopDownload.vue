<template>
  <div v-if="isVisible" ref="topDownload" class="top-download">
    <button
      type="button"
      class="top-download__close"
      aria-label="close"
      @click="closeDownload"
    >
      <van-icon name="cross" color="var(--wihte-color)" size="14" />
    </button>
    <div ref="lottieHost" class="top-download__lottie" />
    <div class="top-download__text">
      <div class="top-download__title">{{ titleText }}</div>
      <div class="top-download__sub">{{ subText }}</div>
    </div>
    <button type="button" class="top-download__cta" @click="installApp">
      {{ $lang.common_txt64 || 'Download' }}
    </button>

    <van-popup
      v-model:show="showSafariInstallGuide"
      class="pwa-safari-popup"
      :close-on-click-overlay="true"
      :style="{ background: 'transparent', overflow: 'visible' }"
    >
      <div class="pwa-safari-popup__wrap">
        <img
          :src="iosInstallGuideImg"
          class="pwa-safari-popup__img"
          alt="How to Install a PWA on iPhone (Safari)"
        />
        <button
          type="button"
          class="pwa-safari-popup__close"
          aria-label="close"
          @click="showSafariInstallGuide = false"
        >
          <van-icon name="cross" size="18" color="#fff" />
        </button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import iosInstallGuideImg from '@/assets/img/pwa/ios-safari-install-guide.png'

function isRunningAsInstalledPwa() {
  if (typeof window === 'undefined') return false
  try {
    if (window.matchMedia('(display-mode: standalone)').matches) return true
    if (window.matchMedia('(display-mode: minimal-ui)').matches) return true
    if (window.matchMedia('(display-mode: fullscreen)').matches) return true
  } catch (e) {
    /* ignore */
  }
  if (window.navigator && window.navigator.standalone === true) return true
  return false
}

function isIosSafari() {
  if (typeof navigator === 'undefined') return false
  const ua = navigator.userAgent || ''
  const isIOS =
    /iPad|iPhone|iPod/.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  if (!isIOS) return false
  return (
    /Safari/i.test(ua) &&
    !/CriOS|FxiOS|EdgiOS|OPiOS|mercury|UCBrowser/i.test(ua)
  )
}

export default {
  name: 'TopDownload',
  components: {},
  data() {
    return {
      isShow: true,
      deferredPrompt: null,
      lottieAnim: null,
      inStandaloneMode: isRunningAsInstalledPwa(),
      showSafariInstallGuide: false,
      iosInstallGuideImg
    }
  },
  computed: {
    isVisible() {
      const path = (this.$route && this.$route.path) || ''
      const isHome = /\/home\/?$/.test(path) || path.endsWith('/home')
      return (
        this.isShow &&
        isHome &&
        !this.$route.query.app &&
        !this.inStandaloneMode
      )
    },
    titleText() {
      return this.$lang.top_download_title || 'APPLICATION'
    },
    subText() {
      return (
        this.$lang.top_download_sub ||
        'Unlock Fun with Exclusive Features'
      )
    }
  },
  watch: {
    isVisible(visible) {
      this.$nextTick(() => {
        if (visible) this.scheduleLottie()
        else this.destroyLottie()
        this.emitLayoutChange()
      })
    }
  },
  mounted() {
    this.syncStandaloneFromDisplayMode()
    if (typeof window !== 'undefined' && window.matchMedia) {
      this._dmListener = () => this.syncStandaloneFromDisplayMode()
      this._dmMql = window.matchMedia('(display-mode: standalone)')
      if (this._dmMql.addEventListener) {
        this._dmMql.addEventListener('change', this._dmListener)
      } else if (this._dmMql.addListener) {
        this._dmMql.addListener(this._dmListener)
      }
    }
    this.onBeforeInstallPromptBound = this.onBeforeInstallPrompt.bind(this)
    this.onAppInstalledBound = this.onAppInstalled.bind(this)
    window.addEventListener(
      'beforeinstallprompt',
      this.onBeforeInstallPromptBound
    )
    window.addEventListener('appinstalled', this.onAppInstalledBound)

    this.$nextTick(() => {
      this.emitLayoutChange()
      this.scheduleLottie()
      this.checkInstalledRelatedApps()
    })
    window.addEventListener('resize', this.emitLayoutChange)
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.emitLayoutChange)
    window.removeEventListener(
      'beforeinstallprompt',
      this.onBeforeInstallPromptBound
    )
    window.removeEventListener('appinstalled', this.onAppInstalledBound)
    if (this._dmMql && this._dmListener) {
      if (this._dmMql.removeEventListener) {
        this._dmMql.removeEventListener('change', this._dmListener)
      } else if (this._dmMql.removeListener) {
        this._dmMql.removeListener(this._dmListener)
      }
    }
    if (this._lottieIdleId != null && typeof window.cancelIdleCallback === 'function') {
      try {
        window.cancelIdleCallback(this._lottieIdleId)
      } catch (e) {
        /* ignore */
      }
    }
    if (this._lottieTimer) {
      clearTimeout(this._lottieTimer)
      this._lottieTimer = null
    }
    this.destroyLottie()
  },
  methods: {
    syncStandaloneFromDisplayMode() {
      const next = isRunningAsInstalledPwa()
      if (next !== this.inStandaloneMode) {
        this.inStandaloneMode = next
      }
    },
    async checkInstalledRelatedApps() {
      if (!navigator.getInstalledRelatedApps) return
      try {
        const list = await navigator.getInstalledRelatedApps()
        if (list && list.length > 0) {
          this.inStandaloneMode = true
        }
      } catch (e) {
        /* ignore */
      }
    },
    onBeforeInstallPrompt(e) {
      e.preventDefault()
      this.deferredPrompt = e
      this.emitLayoutChange()
    },
    onAppInstalled() {
      this.deferredPrompt = null
      this.inStandaloneMode = true
      this.isShow = false
      this.$nextTick(this.emitLayoutChange)
    },
    scheduleLottie() {
      if (!this.isVisible || this.lottieAnim) return
      // 首屏先出布局，空闲后再加载 Lottie，降低白屏/卡顿
      const run = () => this.initLottie()
      if (typeof window.requestIdleCallback === 'function') {
        this._lottieIdleId = window.requestIdleCallback(run, { timeout: 800 })
      } else {
        this._lottieTimer = setTimeout(run, 300)
      }
    },
    async initLottie() {
      if (!this.isVisible || !this.$refs.lottieHost || this.lottieAnim) return
      const [{ default: lottie }, animMod] = await Promise.all([
        import('lottie-web'),
        import('@/assets/lottie/top-download-gift.json')
      ])
      if (!this.isVisible || !this.$refs.lottieHost || this.lottieAnim) return
      const giftAnimation = animMod.default || animMod
      this.lottieAnim = lottie.loadAnimation({
        container: this.$refs.lottieHost,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: giftAnimation
      })
      this.$nextTick(this.emitLayoutChange)
    },
    destroyLottie() {
      if (this.lottieAnim) {
        this.lottieAnim.destroy()
        this.lottieAnim = null
      }
    },
    closeDownload() {
      this.isShow = false
      this.$nextTick(this.emitLayoutChange)
    },
    emitLayoutChange() {
      const height =
        this.isVisible && this.$refs.topDownload
          ? this.$refs.topDownload.offsetHeight
          : 0
      this.$emit('layout-change', {
        visible: this.isVisible,
        height
      })
    },
    async installApp() {
      if (!this.deferredPrompt) {
        if (isIosSafari()) {
          this.showSafariInstallGuide = true
          return
        }
        this.$toast({
          message:
            this.$lang.top_download_no_pwa ||
            'Add to Home Screen is not available here. Open in Chrome and ensure the app is served over HTTPS with a registered service worker.',
          duration: 3500
        })
        return
      }
      try {
        await this.deferredPrompt.prompt()
        await this.deferredPrompt.userChoice
      } catch (e) {
        this.$toast({
          message: this.$lang.top_download_install_fail || 'Install prompt failed',
          icon: 'cross'
        })
      } finally {
        this.deferredPrompt = null
      }
    }
  }
}
</script>
<style lang="less" scoped>
/* y7 黑金 */
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);

.top-download {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  padding: 8px 10px 8px 8px;
  background: linear-gradient(90deg, #2a2418 0%, #1f1c17 55%, #15110a 100%);
  border-bottom: 1px solid fade(@gold-deep, 40%);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.35);
}

.top-download__close {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border: 1px solid fade(@gold-deep, 35%);
  border-radius: 50%;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(29, 20, 0, 0.55);
  cursor: pointer;
}

.top-download__lottie {
  flex-shrink: 0;
  width: 52px;
  height: 50px;
  overflow: hidden;
}

.top-download__text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
}

.top-download__title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.04em;
  line-height: 1.1;
  text-transform: uppercase;
  background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.top-download__sub {
  font-size: 10px;
  line-height: 1.25;
  color: fade(@gold-soft, 85%);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.top-download__cta {
  flex-shrink: 0;
  border: none;
  border-radius: 999px;
  padding: 10px 18px;
  font-size: 13px;
  font-weight: 800;
  color: #573900;
  background: @btn-grad;
  box-shadow: 0 2px 10px rgba(255, 163, 0, 0.35);
  cursor: pointer;
}

.top-download__cta:active {
  opacity: 0.9;
}

.pwa-safari-popup {
  background: transparent !important;
  overflow: visible !important;
}

.pwa-safari-popup__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(88vw, 340px);
  margin: 0 auto;
}

.pwa-safari-popup__img {
  display: block;
  width: 100%;
  height: auto;
  border-radius: 12px;
}

.pwa-safari-popup__close {
  margin-top: 16px;
  width: 36px;
  height: 36px;
  border: 1px solid rgba(255, 255, 255, 0.45);
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.45);
}

.pwa-safari-popup__close:active {
  transform: scale(0.92);
}
</style>
