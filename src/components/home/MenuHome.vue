<template>
  <div class="fixed-menu">
    <img
      :src="
        !isMenu
          ? require('@/assets/img/common/default_top.png')
          : require('@/assets/img/common/top_up.png')
      "
      width="50"
      @click.stop="isMenu = !isMenu"
    />
    <van-popup v-model:show="isMenu" :overlay="false" :lock-scroll="false">
      <div class="fixed-menu--a m-t-5">
        <img
          @click="goTo(1)"
          src="../../assets/img/common/service.png"
          width="50"
        />
        <img
          @click="goTo(2)"
          src="../../assets/img/common/download.png"
          width="50"
        />
        <div @click="goTo(3)" class="fixed-menu--p">
          <p class="fixed-menu--t">12:00</p>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { GetCsLink } from '@/api/common'

export default {
  name: 'MenuHome',

  data() {
    return {
      isMenu: false
    }
  },
  watch: {},
  mounted() {},
  methods: {
    async GetCsLink() {
      const data = await GetCsLink()
      const targetKey2 = 'online'
      sessionStorage.setItem(
        'gameHallEmbed',
        JSON.stringify({
          from: 'home',
          url: data.content.url2.find((item) => targetKey2 in item)?.[
            targetKey2
          ]
        })
      )
      this.$jumpTo('/gameHall')
    },
    goTo(i) {
      if (i === 2) {
        const downloadUrl =
          'https://file.otgame.bet/download/otlotter_V1.0.0.apk'
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = 'otlotter_V1.0.0.apk' // 可以指定下载后的文件名
        link.style.display = 'none' // 隐藏链接
        document.body.appendChild(link)
        link.click() // 触发点击事件
        document.body.removeChild(link) // 移除临时链接
      } else if (i === 1) {
        this.GetCsLink()
      } else if (i === 3) {
        this.$jumpTo('/redPacket')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.fixed-menu {
  position: fixed;
  top: 12%;
  right: 3%;
  z-index: 233;
}
.fixed-menu--a {
  display: flex;
  flex-flow: column;
  align-items: center;
  img {
    margin-bottom: 10px;
  }
}

.fixed-menu--p {
  background-image: url('../../assets/img/common/red_packet.png'); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 50px; /* 或者指定具体的宽度 */
  height: 50px;
}
.fixed-menu--t {
  font-size: 10px;
  margin: 28px 0 0 13px;
  color: black;
}
:deep(.van-overlay) {
  background-color: transparent;
}
:deep(.van-popup--center) {
  width: 14%;
  position: fixed;
  top: 20%;
  left: auto; /* 将 left 设置为 auto，使其失效 */
  right: 2.5%;
  -webkit-transform: none;
  transform: none;
  background: transparent;
}
</style>
