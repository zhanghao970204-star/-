<template>
  <van-tabbar
    v-if="visible"
    :fixed="false"
    :safe-area-inset-bottom="true"
    v-model="active"
    :before-change="onBeforeChange"
    :border="false"
    class="y7-tabbar"
  >
    <van-tabbar-item @click="toTop">
      <span :class="{ activeSpan: active === 0 }">{{
        $lang.tab_game || "Game"
      }}</span>
      <template #icon>
        <div class="img" :class="active !== 0 ? 'img1' : 'img1A'"></div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <span :class="{ activeSpan: active === 1 }">{{
        $lang.tab_invite || "Invite"
      }}</span>
      <template #icon>
        <div class="img" :class="active !== 1 ? 'img2' : 'img2A'"></div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <span
        class="wallet-label"
        :class="{ activeSpan: active === 2 }"
        >{{ $lang.Depósito }}</span
      >
      <template #icon>
        <div class="boxBg">
          <img class="tabqb" src="@/assets/img/tabbar/tabqb.png" alt="" />
        </div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <span :class="{ activeSpan: active === 3 }">{{
        $lang.tab_reward || $lang.tab_promotions || "Reward"
      }}</span>
      <template #icon>
        <div
          class="img reward-tab-icon"
          :class="active !== 3 ? 'img4' : 'img4A'"
        ></div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <span :class="{ activeSpan: active === 4 }">{{
        $lang.tab_account || "Account"
      }}</span>
      <template #icon>
        <div class="img" :class="active !== 4 ? 'img5' : 'img5A'"></div>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { resetPageScroll, resetPageScrollAfterRoute } from '@/utils/scrollReset'

export default {
  name: 'Y7Tabbar',
  emits: ['need-login'],
  data() {
    return {
      active: 0
    }
  },
  computed: {
    routePrefix() {
      return this.$route.params.prefix || localStorage.getItem('country') || ''
    },
    routerArr() {
      const p = this.routePrefix
      return [
        `/${p}/home`,
        `/${p}/share`,
        `/${p}/rechargeCont`,
        `/${p}/activity`,
        `/${p}/mine`
      ]
    },
    // deposit / share / mine 需登录；home / activity 可游客
    needLoginIndexes() {
      return [1, 2, 4]
    },
    visible() {
      const path = this.$route.path
      return (
        !path.includes('/Country') &&
        !path.includes('/Crowdfunding') &&
        !path.includes('/appDetail') &&
        !path.includes('/Support')
      )
    }
  },
  watch: {
    $route: {
      handler(to) {
        this.syncActive(to.path)
      },
      immediate: true
    }
  },
  methods: {
    syncActive(path) {
      if (path.includes('/share')) {
        this.active = 1
      } else if (path.includes('/rechargeCont')) {
        this.active = 2
      } else if (path.includes('/activity') || path.includes('/bonus')) {
        this.active = 3
      } else if (path.includes('/mine')) {
        this.active = 4
      } else if (path.includes('/home')) {
        this.active = 0
      }
    },
    toTop() {
      resetPageScroll()
    },
    onBeforeChange(index) {
      const to = this.routerArr[index]
      if (!to) return false

      if (this.needLoginIndexes.includes(index) && !localStorage.getItem('token')) {
        this.$emit('need-login')
        return false
      }

      if (this.$route.path !== to) {
        this.$router.push(to)
      }
      // 任意底部 Tab 切换都回到顶部，避免首页滑到底再进「我的」停在中间
      this.toTop()
      resetPageScrollAfterRoute()
      return true
    }
  }
}
</script>

<style scoped lang="less">
.boxBg {
  width: 58px;
  height: 48px;
  display: flex;
  margin-top: -18px;
  position: relative;
  align-items: center;
  justify-content: center;
  z-index: 2;
  background: transparent !important;
  box-shadow: none !important;

  .tabqb {
    width: 54px;
    height: auto;
    object-fit: contain;
    display: block;
    background: transparent;
  }
}

.y7-tabbar {
  position: relative;
  flex-shrink: 0;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  z-index: 999;
  height: calc(var(--tabbar-bar-height, 66px) + env(safe-area-inset-bottom, 0px));
  padding-bottom: env(safe-area-inset-bottom, 0px);
  box-sizing: border-box;
  text-align: center;
  border-top: none;
  background-color: transparent !important;
  background-image: url(@/assets/img/tabbar/tabbar.png);
  background-repeat: no-repeat;
  background-position: center top;
  background-size: 100% var(--tabbar-bar-height, 66px);
  overflow: visible;

  :deep(.van-tabbar-item) {
    position: relative;
    bottom: 0;
    padding-top: 8px;
    padding-bottom: 6px;
    color: rgba(255, 255, 255, 0.75);
    background: transparent !important;
  }

  /* 中间项：不要任何颜色填充 */
  :deep(.van-tabbar-item:nth-child(3)),
  :deep(.van-tabbar-item:nth-child(3) .van-tabbar-item__icon),
  :deep(.van-tabbar-item:nth-child(3) .van-badge__wrapper) {
    background: transparent !important;
    box-shadow: none !important;
  }

  :deep(.van-tabbar-item__icon) {
    margin-bottom: 4px;
    background: transparent !important;
  }

  .img {
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
    margin-bottom: 0;
  }

  .img1A {
    background-image: url(@/assets/img/tabbar/img1A.png);
  }
  .img2A {
    background-image: url(@/assets/img/tabbar/img2A.png);
  }
  .img4A {
    background-image: url(@/assets/img/tabbar/img4A.png);
  }
  .img5A {
    background-image: url(@/assets/img/tabbar/img5A.png);
  }
  .img1 {
    background-image: url(@/assets/img/tabbar/img1.png);
  }
  .img2 {
    background-image: url(@/assets/img/tabbar/img2.png);
  }
  .img4 {
    background-image: url(@/assets/img/tabbar/img4.png);
  }
  .reward-tab-icon {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: -1px;
      right: -3px;
      width: 8px;
      height: 8px;
      border: 1.5px solid #430063;
      border-radius: 50%;
      background: #ff4b55;
      box-sizing: border-box;
    }
  }
  .img5 {
    background-image: url(@/assets/img/tabbar/img5.png);
  }

  span {
    display: block;
    font-size: 11px;
    line-height: 1.2;
    margin-top: 1px;
    color: rgba(255, 255, 255, 0.85);
  }

  .wallet-label {
    display: block;
    margin-bottom: 0;
  }

  :deep(.van-tabbar-item--active) {
    background: transparent !important;
  }

  .activeSpan {
    color: #fff;
  }
}

@media (min-width: 769px) {
  .y7-tabbar {
    width: 450px !important;
    max-width: 450px !important;
  }
}
</style>
