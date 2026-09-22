<template>
  <div class="nav-cont m-b-10">
    <div>
      <div
        v-if="gamesList.length > 0"
        class="game_title-ss d-flex-s"
        style="align-items: flex-start"
      >
        <div class="d-flex m-t-5">
          <img :src="siderData.icon" class="m-l-5" height="28px" />
          <span class="m-l-5">{{ siderData.name }}</span>
        </div>

        <div class="d-flex">
          <div
            @click="openAll()"
            class="resher-i--bg m-r-5"
            style="padding: 6px 5px"
          >
            {{ $lang.common_txt60 }} {{ gamesList.length }}
          </div>
          <div class="resher-i--bg2 m-r-5">
            <van-icon @click="prevPage()" name="arrow-left" size="15" />
          </div>

          <div class="resher-i--bg2 m-r-10">
            <van-icon @click="nextPage()" name="arrow" size="15" />
          </div>
          <!-- <div
            @click="openAll()"
            class="resher-i--bg"
            style="padding: 6px 10px"
          >
            {{ $lang.common_txt61 }}
          </div> -->
        </div>
      </div>

      <div>
        <van-swipe
          class="my-swipe"
          :loop="false"
          :touchable="true"
          :autoplay="0"
          :indicator-color="'#1baeae'"
          @change="onChange"
          ref="swipe"
        >
          <van-swipe-item v-for="(page, index) in pages" :key="index">
            <div v-if="Math.abs(index - currentPage2) <= 1" class="swipe-item">
              <van-image
                radius="10"
                v-for="item in page"
                :key="item.gid || item.gameCode || item.gameName"
                @click="goToGame(item.gid, item)"
                class="item"
                style="position: relative"
                :src="item.gameIcon"
                lazy-load
              >
                <template v-slot:loading>
                  <van-loading size="20" color="#a665d8" vertical />
                </template>
                <img
                  v-if="!favoriteGidSet.has(item.gid)"
                  @click.stop="toggleFavorite(item)"
                  src="../../assets/img/common/scyx.png"
                  width="20"
                  style="position: absolute; right: 5px; top: 5px"
                />
                <img
                  v-else
                  @click.stop="toggleFavorite(item)"
                  src="../../assets/img/common/scyx-a.png"
                  width="20"
                  style="position: absolute; right: 5px; top: 5px"
                />
                <div
                  v-if="siderData && siderData.showName === 'yes'"
                  style="
                    position: absolute;
                    text-align: center;
                    bottom: 5px;
                    width: 100%;
                    color: var(--wihte-color);
                  "
                >
                  {{ item.gameName }}
                </div>
              </van-image>
            </div>
            <div v-else class="swipe-item swipe-item--placeholder"></div>
          </van-swipe-item>
        </van-swipe>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ResherSiper',
  components: {},
  props: {
    siderIndex: {
      type: Number
    },
    siderData: {
      type: Object,
      default: () => ({ games: [] })
    }
  },
  data() {
    return {
      currentPage2: 0
    }
  },
  computed: {
    ...mapState(['favorites']),
    gamesList() {
      return (this.siderData && this.siderData.games) || []
    },
    pages() {
      const pages = []
      const games = this.gamesList
      for (let i = 0; i < games.length; i += 6) {
        pages.push(games.slice(i, i + 6))
      }
      return pages
    },
    favoriteGidSet() {
      const currencyGroup = this.favorites.find(
        (group) => group.currency === this.getCurrency
      )
      if (!currencyGroup || !Array.isArray(currencyGroup.list)) {
        return new Set()
      }
      return new Set(currencyGroup.list.map((fav) => fav.gid))
    }
  },
  mounted() {},
  methods: {
    ...mapActions(['addFavorite', 'removeFavorite']),
    isFavorite(item) {
      return this.favoriteGidSet.has(item.gid)
    },
    openAll() {
      const base = typeof this.siderIndex === 'number' ? this.siderIndex : 0
      const partCode = (this.siderData && this.siderData.code) || ''
      this.$jumpTo('/category', { gameTab: base + 1, partCode })
    },
    onChange(index) {
      this.currentPage2 = index
    },
    prevPage() {
      if (this.currentPage2 > 0 && this.$refs.swipe) {
        this.$refs.swipe.swipeTo(this.currentPage2 - 1)
      }
    },
    nextPage() {
      if (this.currentPage2 < this.pages.length - 1 && this.$refs.swipe) {
        this.$refs.swipe.swipeTo(this.currentPage2 + 1)
      }
    },
    toggleFavorite(item) {
      const payload = {
        currency: this.getCurrency,
        item: item
      }
      if (this.isFavorite(item)) {
        this.removeFavorite(payload)
      } else {
        this.addFavorite(payload)
      }
    },
    goToGame(v, v2) {
      if (this.token) {
        const game = v2 || { gid: v }
        const lotteryIds = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ]
        const isLottery =
          lotteryIds.includes(v) ||
          ['2000701', '2000702'].includes(this.siderData.code)
        const jumpPayload = isLottery
          ? {
              type: 'lottery',
              lotteryType: game.gameCode,
              lotteryName: game.gameName,
              typeCate: 1
            }
          : { type: 'hall', gid: v, isDemo: 0, from: 'game' }
        this.$launchGame(jumpPayload)
      } else if (this.$bus) {
        this.$bus.emit('openLogin')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.my-swipe {
  width: 100%;
  // height: 300px; /* 根据实际需求调整高度 */
  /* 隐藏指示器 */
  :deep(.van-swipe__indicators) {
    display: none;
  }
}

.swipe-item {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin: 0 5px;
  min-height: 120px;
}
.swipe-item--placeholder {
  min-height: 120px;
}
.swipe-item::after {
  content: '';
  width: 31.5%; /* 与.item宽度一致 */
  height: 0; /* 不占用高度 */
}
.item {
  max-height: 160px;
  width: 31.5%; /* 每个元素占 32% 的宽度 */
  margin-bottom: 10px; /* 调整元素之间的间距 */
  text-align: center;
  :deep(.van-image__img) {
    border-radius: 10px;
  }
  :deep(.van-loading__spinner) {
    display: none;
  }
}
.resher-i--bg {
  padding: 5px 8px;
  background: rgba(233, 182, 90, 0.12);
  border: 1px solid rgba(233, 182, 90, 0.32);
  border-radius: 16px;
  color: #f3c059;
  font-size: 12px;
  white-space: nowrap;
}

.resher-i--bg2 {
  padding: 5px;
  background: rgba(233, 182, 90, 0.1);
  border: 1px solid rgba(233, 182, 90, 0.28);
  border-radius: 6px;
  color: #f3c059;
  display: flex;
  align-items: center;
  justify-content: center;
}
.game_title {
  position: relative;
  height: 50px;
  background: none;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(../../assets/img/otgame/beijin_12.png) no-repeat;
    background-size: 100% 100%;
    /* 原图偏蓝紫(~234°) → 金色(~40°) */
    filter: hue-rotate(166deg) saturate(1.2) brightness(1.05);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}
.game_title-ss {
  position: relative;
  height: 138px;
  margin-bottom: -93px;
  background: none;
  border: none;
  box-shadow: none;
  padding: 0;
  align-items: flex-start;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: url(../../assets/img/otgame/beijin_12.png) no-repeat;
    background-size: 100% 100%;
    /* 原图偏蓝紫(~234°) → 金色(~40°) */
    filter: hue-rotate(166deg) saturate(1.2) brightness(1.05);
    pointer-events: none;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
}
</style>
