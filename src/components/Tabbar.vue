<template>
  <van-tabbar
    v-if="visible"
    :safe-area-inset-bottom="true"
    v-model="active"
    :before-change="onBeforeChange"
    :border="false"
    class="y7-tabbar"
  >
    <van-tabbar-item @click="toTop">
      <img
        class="tabbarimg"
        v-show="active === 0"
        src="@/assets/img/tabbar/tabbar.png"
        alt=""
      />
      <span :class="{ activeSpan: active === 0 }">{{
        $lang.tab_game || "Game"
      }}</span>
      <template #icon>
        <div class="img" :class="active !== 0 ? 'img1' : 'img1A'"></div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <img
        class="tabbarimg"
        v-show="active === 1"
        src="@/assets/img/tabbar/tabbar.png"
        alt=""
      />
      <span :class="{ activeSpan: active === 1 }">{{
        $lang.tab_invite || "Invite"
      }}</span>
      <template #icon>
        <div class="img" :class="active !== 1 ? 'img2' : 'img2A'"></div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <img
        class="tabbarimg"
        v-show="active === 2"
        src="@/assets/img/tabbar/tabbar.png"
        alt=""
      />
      <span
        class="wallet-label"
        :class="{ activeSpan: active === 2 }"
        >{{ $lang.Depósito }}</span
      >
      <template #icon>
        <div class="boxBg">
          <img class="tabqb" src="@/assets/img/tabbar/tabqb.png" alt="" />
          <picture>
            <source
              srcset="@/assets/img/tabbar/jinb_effect.webp"
              type="image/webp"
            />
            <img
              class="jinb_effect"
              src="@/assets/img/tabbar/jinb_effect.png"
              alt=""
            />
          </picture>
          <picture>
            <source
              srcset="@/assets/img/tabbar/cash_effect.webp"
              type="image/webp"
            />
            <img
              class="cash_effect"
              src="@/assets/img/tabbar/cash_effect.png"
              alt=""
            />
          </picture>
        </div>
      </template>
    </van-tabbar-item>

    <van-tabbar-item>
      <img
        class="tabbarimg"
        v-show="active === 3"
        src="@/assets/img/tabbar/tabbar.png"
        alt=""
      />
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
      <img
        class="tabbarimg"
        v-show="active === 4"
        src="@/assets/img/tabbar/tabbar.png"
        alt=""
      />
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
        !path.includes('/appDetail')
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
  width: 51px;
  height: 51px;
  background: linear-gradient(90deg, #f7dd9a 0%, #ffa200 100%);
  display: flex;
  border-radius: 50%;
  margin-top: -18px;
  position: relative;
  align-items: center;
  justify-content: center;

  .tabqb {
    width: 32px;
    height: 32px;
  }

  @keyframes blink {
    0%,
    75% {
      opacity: 1;
    }
    75%,
    100% {
      opacity: 0;
    }
  }

  .cash_effect,
  .jinb_effect {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 51px;
    height: auto;
    transform: translate(-50%, -50%);
    animation: blink 4s infinite;
  }

  .cash_effect {
    aspect-ratio: 154 / 171;
  }

  .jinb_effect {
    aspect-ratio: 192 / 195;
  }
}

.y7-tabbar {
  max-width: 450px;
  margin: auto;
  z-index: 999;
  height: 70px;
  box-sizing: border-box;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  text-align: center;
  border-top: 1px solid #f7dd9a7c;
  background: #050400;

  :deep(.van-tabbar-item) {
    position: relative;
    bottom: 5px;
    color: #ffe0a3c0;
  }

  .tabbarimg {
    width: 62px;
    height: 27px;
    position: absolute;
    left: 50%;
    bottom: -9px;
    transform: translate(-50%, 0);
  }

  .img {
    width: 41px;
    height: 41px;
    background-image: url(@/assets/img/tabbar/tabs.png);
    background-image: image-set(
      url('@/assets/img/tabbar/tabs.webp') type('image/webp'),
      url('@/assets/img/tabbar/tabs.png') type('image/png')
    );
    background-repeat: no-repeat;
    background-size: 245px 92px;
    margin-bottom: -8px;
  }

  .img1A {
    background-position: 0 -0.5px;
  }
  .img2A {
    background-position: -51px -0.5px;
  }
  .img4A {
    background-position: -152px -1.5px;
  }
  .img5A {
    background-position: -204px -1px;
  }
  .img1 {
    background-position: 0 -51.5px;
  }
  .img2 {
    background-position: -51px -51.5px;
  }
  .img4 {
    background-position: -152px -51.5px;
  }
  .reward-tab-icon {
    position: relative;

    &::after {
      content: '';
      position: absolute;
      top: 1px;
      right: -2px;
      width: 12px;
      height: 12px;
      border: 1.5px solid #050400;
      border-radius: 50%;
      background: #ff4b55;
      box-sizing: border-box;
    }
  }
  .img5 {
    background-position: -204px -51.5px;
  }

  span {
    font-size: 12px;
    color: #ffe0a3c0;
  }

  .wallet-label {
    display: block;
    margin-bottom: -3px;
  }

  :deep(.van-tabbar-item--active) {
    background: transparent;
  }

  .activeSpan {
    color: #ffda91;
  }
}

@media (min-width: 769px) {
  .y7-tabbar {
    width: 450px !important;
    max-width: 450px !important;
  }
}
</style>
