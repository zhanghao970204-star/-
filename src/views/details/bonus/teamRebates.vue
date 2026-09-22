<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title8"> </title-bar>
    <!-- <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <img
        src="../../../assets/img/bonus/bonus6.png"
        width="100%"
        style="border-radius: 13px"
      />
    </div> -->
    <div style="position: relative; margin: 10px 10px 0 10px">
      <img
        src="../../../assets/img/bonus/bonus6.png"
        width="100%"
        style="border-radius: 13px"
      />
      <div style="position: absolute; top: 20px; left: 20px">
        <p
          style="font-weight: 800; font-size: 15px; margin-bottom: 10px"
          v-html="$lang.common_txt240"
        ></p>
        <p v-html="$lang.common_txt241"></p>
      </div>
    </div>
    <div class="content-c">
      <div class="content-c--c">
        <p class="content-c--c1">{{ $lang.bonus_txt39 }}</p>
        <p class="content-c--c2">{{ getCurrency }} {{ info.reliefAmount }}</p>
        <van-button
          size="large"
          class="custom-button"
          :class="{ active: info.promoStatus !== 'not_receive' }"
          :disabled="info.promoStatus !== 'not_receive'"
          @click="getJl"
        >
          {{ $lang.Receber }}
        </van-button>
        <img
          class="content-c--c5"
          src="../../../assets/img/bonus/title-bg.png"
        />
      </div>
      <div
        class="d-flex f-t-15 f-w m-t-10 m-b-10"
        style="justify-content: center"
      >
        <span class="share-bot-l"></span>
        <span>{{ $lang.common_txt35 }}</span>
        <span class="share-bot-r"></span>
      </div>
      <div class="font-color" v-html="$lang.bonus_txt40"></div>
    </div>
  </div>
</template>
<script>
import { GetTeamRebateInit, ReceiveTeamRebateAmount } from '@/api/common'
export default {
  name: 'teamRebates',
  components: {},
  data() {
    return {
      info: {}
    }
  },
  mounted() {
    this.GetTeamRebateInit()
  },
  methods: {
    async getJl() {
      const data = await ReceiveTeamRebateAmount()
      if (data.status === 'ok') {
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: 'success'
        })
        this.GetTeamRebateInit()
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async GetTeamRebateInit() {
      const data = await GetTeamRebateInit()
      if (data.status === 'ok') {
        this.info = data.content
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
.content-c {
  padding: 0% 3% 10% 3%;
  // margin-top: -85px;
}
.content-c--c {
  margin-top: 10px;
  position: relative;
  border-radius: 15px;
  width: 100%;
  background: @cont-bg;
  height: 155px;
  border: 1px solid @info2-color;
}
.content-c--c1 {
  position: absolute;
  font-size: 15px;
  left: 5%;
  top: 10%;
  font-weight: bold;
}
.content-c--c2 {
  position: absolute;
  font-size: 25px;
  left: 5%;
  top: 29%;
  font-weight: bold;
  color: @info-color;
}
.active {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #2a2418 !important;
  border-bottom: 0px solid #e9a843 !important;
}
.custom-button {
  opacity: 1;
  position: absolute;
  margin-top: 15px;
  width: 130px;
  height: 38px;
  left: 5%;
  bottom: 15%;
  border-radius: 13px;
}
.content-c--c5 {
  position: absolute;
  right: 15px;
  width: 152px;
  top: 12%;
}
.content-c2 {
  font-size: 18px;
  margin-top: 18px;
  background-image: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 2px 10px;
  color: #573900;
}

.content-c4 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 18px;
  // background: #076237;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 3px 5px;
}
</style>
