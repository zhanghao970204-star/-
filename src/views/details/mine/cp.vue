<template>
  <div class="content">
    <div class="cp-bg">
      <div class="d-flex-s" style="padding: 16px">
        <van-icon
          name="arrow-left"
          @click="goToBack"
          size="20"
          color="#ffa300"
        />
        <p class="f-w" style="font-size: 16px">{{ $lang.common_txt31 }}</p>
        <p></p>
      </div>
      <div class="dp-bg">
        <p>{{ creditPoints }}</p>
        <p style="font-size: 15px !important; color: #ffa300">
          {{ $lang.common_txt66 }}
        </p>
      </div>
    </div>
    <div class="cp-bootom--b">
      <div class="cp-bootom">
        <p class="f-t-18 f-w t-c m-b-10">
          {{ $lang.common_txt32 }}
        </p>
        <p class="font-color" style="line-height: 20px">
          {{ $lang.common_txt33 }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { Init } from '@/api/common'
export default {
  name: 'Cp',
  components: {},
  data() {
    return {
      creditPoints: 0
    }
  },
  mounted() {
    this.Init()
  },
  methods: {
    goToBack() {
      this.$router.go(-1)
    },
    async Init() {
      const data = await Init()
      if (data.status === 'ok') {
        this.creditPoints = data.content.creditPoints
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.cp-bg {
  // background: url(../../../assets/img/home/cp-bg.png) no-repeat;
  background-size: 100% 100%;
  height: 338px;
}
.dp-bg {
  background: url(../../../assets/img/home/dp-bg.png) no-repeat;
  background-size: 100% 100%;
  height: 250px;
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px auto 0;
  display: flex;
  flex-flow: column;
  p {
    font-size: 48px;
    font-weight: bold;
    // text-shadow: -1px -1px 0 black, 1px -1px 0 black, -1px 1px 0 black,
    //   1px 1px 0 black, 0 0 2px black; /* 可选：增加边缘模糊效果 */
    color: #ffa300;
  }
}
.cp-bootom {
  background-image: linear-gradient(180deg, #2a2418 0%, #15110a 100%);
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 18px;
  margin: 0 auto;
  border-radius: 15px;
  line-height: 15px;
  width: 93%;
  border: 1px solid fade(#e9a843, 30%);
}
.cp-bootom--b {
  padding: 25px 0 0 0;
  // background: url(../../../assets/img/home/bottom-cretire.png) no-repeat;
  background-size: 100% 100%;
  height: 100vh;
  width: 100%;
}
</style>
