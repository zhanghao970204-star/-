<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title3"> </title-bar>
    <!-- <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <img
        src="../../../assets/img/bonus/bonus5.png"
        width="100%"
        style="position: relative; border-radius: 13px"
      />
    </div> -->
    <!-- <div style="position: relative; margin: 10px 10px 0 10px">
      <img
        src="../../../assets/img/bonus/bonus5.png"
        width="100%"
        style="border-radius: 13px"
      />
      <div style="position: absolute; top: 20px; left: 20px">
        <p
          style="font-weight: 800; font-size: 15px; margin-bottom: 10px"
          v-html="$lang.common_txt228"
        ></p>
        <p v-html="$lang.common_txt229"></p>
      </div>
    </div> -->
    <div class="content-c">
      <div class="content-c--c">
        <p class="content-c--c1">{{ $lang.bonus_txt6 }}</p>
        <p class="content-c--c2 font-color">
          {{ $lang.Obter }}
          <span style="font-size: 19px" class="info-color m-l-5">
            {{ info.reliefAmount }}
          </span>
          {{ $lang.bonus_txt7 }}
        </p>
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
          src="../../../assets/img/bonus/loss_rebate.png"
        />
      </div>
      <div
        class="content-c2--c2t"
        style="font-weight: bold; font-size: 16px; margin: 15px 5px"
      >
        {{ $lang.bonus_txt8 }}
      </div>
      <div class="content-c3">
        <div class="content-c3--t font-color">
          <p>{{ $lang.bonus_txt9 }}</p>
          <p>{{ $lang.bonus_txt10 }}</p>
        </div>
        <div
          class="content-c3--t2"
          v-for="(item, index) in InitDate"
          :key="index"
          :style="(index + 1) % 2 === 0 ? {} : { backgroundColor: '#2a2418' }"
        >
          <p style="font-weight: bold">{{ item.minAmount }}</p>
          <p style="font-weight: bold">{{ item.percent }}</p>
        </div>
      </div>
      <van-loading v-if="loading" color="#ffa300" vertical> </van-loading>

      <div
        class="d-flex f-t-15 f-w m-t-10 m-b-10"
        style="justify-content: center"
      >
        <span class="share-bot-l"></span>
        <span>{{ $lang.common_txt35 }}</span>
        <span class="share-bot-r"></span>
      </div>
      <div
        class="font-color"
        v-html="$lang.bonus_txt11"
        style="line-height: 20px"
      ></div>
    </div>
  </div>
</template>
<script>
import { GetPromoDailyRelief, ReceivePromoReliefAmount } from '@/api/common'
export default {
  name: 'cashBack',
  components: {},
  data() {
    return {
      InitDate: [],
      info: {},
      loading: false
    }
  },
  mounted() {
    this.GetPromoDailyRelief()
  },
  methods: {
    async getJl() {
      const data = await ReceivePromoReliefAmount()
      if (data.status === 'ok') {
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: 'success'
        })
        this.GetPromoDailyRelief()
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async GetPromoDailyRelief() {
      this.loading = true // 开始加载
      const data = await GetPromoDailyRelief()
      if (data.status === 'ok') {
        this.InitDate = JSON.parse(data.content.ruleList) || []
        this.info = data.content
        this.loading = false // 开始加载
      } else {
        this.loading = false // 开始加载
        // this.$toast({
        //   message: data.msg,
        //   icon: 'cross'
        // })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 0% 3% 10% 3%;
  padding-top: 5px;
}
.content-c--c {
  margin-top: 10px;
  position: relative;
  border-radius: 15px;
  width: 100%;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  height: 165px;
  border: 1px solid rgba(255, 162, 0, 0.45);
  padding-bottom: 5px;
}
.content-c--c1 {
  position: absolute;
  font-size: 20px;
  left: 6%;
  top: 18%;
  font-weight: bold;
  line-height: 20px;
}
.content-c--c2 {
  position: absolute;
  left: 6%;
  top: 41%;
  font-weight: bold;
  font-size: 15px;
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
  left: 6%;
  bottom: 12%;
  border-radius: 13px;
}
.content-c--c5 {
  position: absolute;
  right: 1%;
  width: 106px;
  bottom: 2px;

}
.content-c2 {
  font-size: 16px;
  margin-top: 18px;
  background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 2px 10px;
  font-weight: bold;
}
.content-c3--t {
  margin-top: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 3.2% 12% 3.2% 19%;
  background: @cont-bg;
  border-radius: 10px 10px 0 0;
}
.content-c3--t2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 11% 10px 6%;
  background: @cont-bg;
}

.content-c3 :last-child {
  border-radius: 0 0 12px 12px !important;
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
  margin-top: 18px;
  // background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 2px 2px;
  font-weight: bold;
}

/* PC 端样式 */
@media (min-width: 769px) {
  .content-c3--t {
    padding: 3.2% 65px 3.2% 79px;
  }
}
</style>
