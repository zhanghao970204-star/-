<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title7"> </title-bar>
    <!-- <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <img
        src="../../../assets/img/bonus/bonus10.png"
        width="100%"
        style="border-radius: 13px"
      />
    </div> -->
    <!-- <div style="position: relative; margin: 10px 10px 0 10px">
      <img
        src="../../../assets/img/bonus/bonus10.png"
        width="100%"
        style="border-radius: 13px"
      />
      <div style="position: absolute; top: 20px; left: 20px">
        <p
          style="font-weight: 800; font-size: 15px; margin-bottom: 10px"
          v-html="$lang.common_txt234"
        ></p>
        <p v-html="$lang.common_txt235"></p>
      </div>
    </div> -->
    <div class="content-c">
      <div class="content-c--c">
        <p class="content-c--c1">{{ $lang.VIP }} {{ vipLevel }}</p>
        <p class="content-c--c2 font-color">
          {{ $lang.bonus_txt34 }}
          <span class="info-color"
            >{{ getCurrency }} {{ info.awardAmount }}</span
          >
        </p>
        <van-button
          size="large"
          class="custom-button"
          :class="{ active: info.receiveStatus !== 1 }"
          :disabled="info.receiveStatus !== 1"
          @click="getJl"
        >
          {{ $lang.Recebido }}
        </van-button>
        <img
          class="content-c--c5"
          src="../../../assets/img/bonus/six-bg2.png"
        />
      </div>

      <div
        class="content-c2--c2t"
        style="font-weight: bold; font-size: 16px; margin: 15px 0px"
      >
        {{ $lang.bonus_txt35 }}
      </div>
      <div class="content-c3">
        <div class="content-c3--t font-color">
          <p>{{ $lang.bonus_txt36 }}</p>
          <p>{{ $lang.bonus_txt37 }}</p>
        </div>
        <div
          class="content-c3--t2"
          v-for="(item, index) in InitDate"
          :key="index"
          :style="(index + 1) % 2 === 0 ? {} : { backgroundColor: '#2a2418' }"
        >
          <p class="f-w">VIP{{ item.vipLevel }}</p>
          <p class="f-w">
            {{ $formatNumberWithCommas(item.reward) }}
          </p>
        </div>
      </div>
      <van-loading v-if="loading" color="#ffa300" vertical> </van-loading>
      <div
        class="d-flex f-t-15 f-w m-t-15 m-b-10"
        style="justify-content: center"
      >
        <span class="share-bot-l"></span>
        <span>{{ $lang.common_txt35 }}</span>
        <span class="share-bot-r"></span>
      </div>
      <div v-html="$lang.bonus_txt38" class="font-color"></div>
    </div>
  </div>
</template>
<script>
import { GetVipAwardInit, Init, GetVipAward } from '@/api/common'
export default {
  name: 'cashBack',
  components: {},
  data() {
    return {
      InitDate: [],
      info: {},
      vipLevel: 0,
      loading: false
    }
  },
  mounted() {
    if (this.token) {
      this.GetVipAwardInit()
      this.Init()
    }
  },
  methods: {
    async getJl() {
      const data = await GetVipAward()
      if (data.status === 'ok') {
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: 'success'
        })
        this.GetVipAwardInit()
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async Init() {
      const data = await Init()
      if (data.status === 'ok') {
        this.vipLevel = data.content.vipLevel
      }
    },
    async GetVipAwardInit() {
      this.loading = true // 开始加载
      const data = await GetVipAwardInit()
      if (data.status === 'ok') {
        this.InitDate = JSON.parse(data.content.ruleList)
        this.info = data.content
        this.loading = false // 开始加载
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 0% 3% 10% 3%;
}
.content-c--c {
  margin-top: 10px;
  position: relative;
  border-radius: 15px;
  width: 100%;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid rgba(255, 162, 0, 0.45);
  height: 155px;
}
.content-c--c1 {
  position: absolute;
  font-size: 45px;
  left: 5%;
  top: 10%;
  font-weight: bold;
  background: linear-gradient(to bottom, #feef92, #c6a94d);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.content-c--c2 {
  position: absolute;
  left: 5%;
  top: 45%;
}
.active {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #9b9b9b !important;
  border-bottom: 0px solid #494949 !important;
}
.custom-button {
  opacity: 1;
  position: absolute;
  margin-top: 15px;
  width: 130px;
  height: 38px;
  left: 5%;
  bottom: 10%;
  border-radius: 13px;
}
.content-c--c5 {
  position: absolute;
  right: 3%;
  width: 162px;
  top: -2%;
}
.content-c2 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 18px;
  background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 3px 10px;
}
.content-c3--t {
  margin-top: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px 12px 0 0;
  padding: 3.2% 21.5% 3.2% 18.5%;
  background: @cont-bg;
}
.content-c3--t2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 11% 12px 6%;
  background: @cont-bg;
}
.content-c3--t2 p {
  width: 40%;
  text-align: center;
}
.content-c3--t3 {
  // border-radius: 0 0 15px 15px;
  height: 0px;
  // background: @cont-bg;
}
.content-c4 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 18px;
  background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 3px 10px;
}
.content-c3 :last-child {
  border-radius: 0 0 12px 12px !important;
}

/* PC 端样式 */
@media (min-width: 769px) {
  .content-c3--t {
    padding: 3.2% 96px 3.2% 80px;
  }
}
</style>
