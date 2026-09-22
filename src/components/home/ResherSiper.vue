<template>
  <div class="nav-cont">
    <div class="resher-content--b">
      <van-image
        v-for="(item, index) in displayedItems"
        :key="index"
        @click="goToGame(item.gid, item)"
        class="swiper-slide--img t-c"
        style="position: relative"
        :src="item.gameIcon"
        lazy-load
      >
        <template v-slot:loading>
          <van-loading size="20" color="#a665d8" vertical />
        </template>
        <img
          v-if="!isFavorite(item)"
          @click.stop="toggleFavorite(item)"
          src="../../assets/img/common/scyx.png"
          width="20"
          style="position: absolute; right: 5px; top: 5px"
        />
        <img
          v-if="isFavorite(item)"
          @click.stop="toggleFavorite(item)"
          src="../../assets/img/common/scyx-a.png"
          width="20"
          style="position: absolute; right: 5px; top: 5px"
        />
        <div
          v-if="!['2000601', '2000110'].includes(siderData.code)"
          style="
            position: absolute;
            text-align: center;
            bottom: 5px;
            width: 100%;
          "
        >
          {{ item.gameName }}
        </div>
        <div
          v-if="['2000110'].includes(siderData.code)"
          class="d-flex"
          style="
            width: 100%;
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            backdrop-filter: blur(10px) grayscale(30%);
            height: 42px;
            border-radius: 0 0 10px 10px;
            justify-content: center;
            word-wrap: break-word; /* 允许单词在容器内强制换行 */
          "
        >
          <p style="width: 90%; margin: 0 auto; text-align: center">
            {{ item.gameName }}
          </p>
        </div>
      </van-image>
    </div>
    <div
      v-if="hasMoreItems"
      class="resher-content--lo m-t-5"
      @click="loadMore(9)"
    >
      <div class="lo-wrapper">
        <p class="font-color">{{ $lang.ResherContent_txt4 }}</p>
        <img
          src="../../assets/img/common/loredmore.png"
          style="width: 12px; height: 12px; object-fit: contain"
        />
      </div>
    </div>

    <div v-else class="resher-content--lo m-t-5" @click="goTop">
      <div class="lo-wrapper">
        <p class="font-color">{{ $lang.ResherContent_txt5 }}</p>
        <img
          src="../../assets/img/common/loredmore.png"
          style="
            transform: rotate(180deg);
            width: 12px;
            height: 12px;
            object-fit: contain;
          "
        />
      </div>
    </div>
    <login v-model="showPopup" overlay></login>
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
      type: Object
    }
  },
  data() {
    return {
      showPopup: false,
      displayedItems: [], // 当前显示的项目
      itemsPerPage: 12, // 每次加载的项目数
      currentPage: 0, // 当前页码
      initialLoad: 12 // 初始加载的项目数
    }
  },
  computed: {
    ...mapState(['favorites']),
    hasMoreItems() {
      return (
        this.currentPage * this.itemsPerPage + this.initialLoad <
        this.siderData.games.length
      )
    }
  },
  mounted() {
    // 初始化时加载第一页数据
    this.initializeItems()
  },
  methods: {
    ...mapActions(['addFavorite', 'removeFavorite']),
    isFavorite(item) {
      return this.favorites.some((fav) => fav.gid === item.gid)
    },
    toggleFavorite(item) {
      if (this.isFavorite(item)) {
        this.removeFavorite(item)
      } else {
        this.addFavorite(item)
      }
    },
    goTop() {
      // 重置为初始的 6 个元素
      this.displayedItems = this.siderData.games.slice(0, this.initialLoad)
      this.currentPage = 0
      this.$emit('getBack')
    },
    goToGame(v, v2) {
      if (this.token) {
        const jumpPayload = { type: 'hall', gid: v, isDemo: 0, from: 'game' }
        this.$launchGame(jumpPayload)
      } else {
        this.showPopup = true
      }
    },
    loadMore() {
      const start = this.currentPage * this.itemsPerPage + this.initialLoad
      const end = start + this.itemsPerPage
      const newItems = this.siderData.games.slice(start, end)
      this.displayedItems = this.displayedItems.concat(newItems)
      this.currentPage++
    },
    initializeItems() {
      // 初始化显示的项目
      this.displayedItems = this.siderData.games.slice(0, this.initialLoad)
    }
  }
}
</script>
<style lang="less" scoped>
.nav-cont {
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
}
.resher-content--b {
  display: flex;
  // justify-content: space-between;
  flex-flow: row wrap;
  font-size: 11px;
}

.swiper-slide--img {
  width: 30%;
  // width: 22.5%;
  margin: 0 1.53% 12px 1.53%;
  // height: 145px;
  // margin-bottom: 10px;
  :deep(.van-image__img) {
    border-radius: 10px;
  }
  :deep(.van-loading__spinner) {
    display: none;
  }
}

// .resher-content--b::after {
//   content: '';
//   width: 23%; /* 与.item宽度一致 */
//   height: 0; /* 不占用高度 */
// }

.resher-content--lo {
  display: flex;
  justify-content: center;
  align-items: center;

  .lo-wrapper {
    display: flex;
    align-items: center;
    gap: 8px; // 图片和文字之间的间距
    img {
      width: 20px; // 可根据需要设置尺寸
      height: 20px;
    }
    p {
      font-size: 14px;
    }
  }
}
.noMore {
  transform: rotate(180deg);
}
</style>
