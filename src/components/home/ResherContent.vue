<template>
  <div class="resher-content" style="padding: 0 12px">
    <div class="d-flex m-t-10 m-b-10">
      <!-- <img
        src="../../assets/img/common/back.png"
        width="20"
        style="border: 1px solid var(--wihte-color); border-radius: 50%"
      /> -->
      <img :src="contData.icon" width="120px" class="m-l-5" />
    </div>
    <div class="resher-content--b">
      <van-image
        class="resher-content--img"
        v-for="(item, index) in displayedItems"
        :key="index"
        :src="item.gameIcon"
        lazy-load
        @click="goToGame(item.gid, item)"
        style="position: relative"
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
          v-if="!['2000601', '2000110'].includes(contData.code)"
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
          v-if="['2000110'].includes(contData.code)"
          class="d-flex"
          style="
            width: 100%;
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            /* background: rgba(200, 230, 255, 0.3);
                  backdrop-filter: blur(10px);  */
            /* background: rgba(200, 200, 200, 0.1); */
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
    <div class="resher-content--lo">
      <p class="t-c m-t-10 m-b-10 f-t-15">
        {{ $lang.ResherContent_txt }} {{ displayedItems.length }}
        {{ $lang.ResherContent_txt2 }} {{ contData.games.length }}
        {{ $lang.ResherContent_txt3 }}
      </p>
      <div @click="loadMore" class="resher-content--lore">
        {{ $lang.ResherContent_txt4 }}
      </div>
    </div>
    <login v-model="showPopup" overlay></login>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  name: 'ResherContent',
  props: {
    contData: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPopup: false,
      itemsPerPage: 12, // 每次加载的条数
      currentPage: 1, // 当前页码
      loading: false, // 是否正在加载
      displayedItems: [] // 当前显示的条目
    }
  },
  computed: {
    ...mapState(['favorites'])
  },
  mounted() {
    // 初始化时加载第一页数据
    this.loadMore()
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
    goToGame(v, v2) {
      if (this.token) {
        const jumpPayload = { type: 'hall', gid: v, isDemo: 0, from: 'game' }
        this.$launchGame(jumpPayload)
      } else {
        this.showPopup = true
      }
    },
    // backPre() {
    //   this.$emit('getBack')
    // },
    loadMore() {
      if (this.loading) return
      this.loading = true
      // 计算下一页的起始索引
      const start = (this.currentPage - 1) * this.itemsPerPage
      // 计算下一页的结束索引
      const end = start + this.itemsPerPage

      // 将下一页的条目添加到 displayedItems 数组中
      this.displayedItems = [
        ...this.displayedItems,
        ...this.contData.games.slice(start, end)
      ]

      // 更新当前页码
      this.currentPage++
      // 模拟异步加载延迟
      setTimeout(() => {
        this.loading = false
      }, 1000)
    }
  }
}
</script>
<style lang="less" scoped>
.resher-content--b {
  display: flex;
  align-items: center;
  // justify-content: space-between;
  flex-flow: wrap row;
  font-size: 11px;
}

.resher-content--img {
  width: 30%;
  // width: 22.5%;
  margin: 0 1.53% 12px 1.53%;
  // height: 145px;
  :deep(.van-image__img) {
    border-radius: 10px;
  }
  :deep(.van-loading__spinner) {
    display: none;
  }
}

// .resher-content--b > div:last-child {
//   // margin-right: 31.2%; /* 或者padding-right */
//   margin-right: 23%; /* 或者padding-right */
// }
.resher-content--lore {
  text-align: center;
  margin: 0 auto;
  width: 25%;
  border: 1px solid @primary-color3;
  border-radius: 12px;
  padding: 7px 0;
  color: @primary-color3;
  font-size: 15px;
}
.resher-content--lo {
  margin-bottom: 20%;
}
</style>
