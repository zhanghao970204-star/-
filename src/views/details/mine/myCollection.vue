<template>
  <div class="content t-c">
    <title-bar :title="$lang.common_txt296"></title-bar>
    <div style="padding: 10px">
      <div
        v-if="favorites.length > 0 && favorites"
        class="d-flex"
        style="flex-flow: wrap row"
      >
        <div
          v-for="(item, index) in favorites.filter(
            (item) => item.currency === getCurrency
          )[0].list"
          :key="index"
          style="width: 33.3%; margin-bottom: 5px"
          @click="goToGame(item.gid, item)"
        >
          <img
            :src="item.gameIcon"
            style="border-radius: 10px; width: 92%; max-height: 150px"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  name: 'myCollection',
  components: {},
  data() {
    return {}
  },
  computed: {
    ...mapState(['favorites'])
  },
  mounted() {},
  methods: {
    goToGame(v, v2) {
      if (this.token) {
        const lotteryIds = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32
        ]
        const game = v2 || { gid: v }
        const jumpPayload = lotteryIds.includes(v)
          ? { type: 'lottery', lotteryType: game.gameCode, lotteryName: game.gameName, typeCate: 1 }
          : { type: 'hall', gid: v, isDemo: 0, from: 'game' }
        this.$launchGame(jumpPayload)
      }
    }
  }
}
</script>
<style lang="less" scoped></style>
