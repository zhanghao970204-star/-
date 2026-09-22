<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title9"> </title-bar>
    <!-- <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <img
        src="../../../assets/img/bonus/bonus9.png"
        width="100%"
        style="border-radius: 12px"
      />
    </div> -->
    <!-- <div style="position: relative; margin: 10px 10px 0 10px">
      <img
        src="../../../assets/img/bonus/bonus9.png"
        width="100%"
        style="border-radius: 13px"
      />
      <div style="position: absolute; top: 20px; left: 20px">
        <p
          style="font-weight: 800; font-size: 15px; margin-bottom: 10px"
          v-html="$lang.common_txt244"
        ></p>
        <p v-html="$lang.common_txt245"></p>
      </div>
    </div> -->
    <div class="content-c">
      <div class="content-c--c t-c">
        <div
          style="
            width: 32%;
            background: #2a2418;
            border-radius: 12px;
            margin-bottom: 10px;
            border: 1px solid rgba(255, 162, 0, 0.35);
          "
          v-for="(item, index) in singData"
          :key="index"
        >
          <div
            class="content-c--b"
            :class="{
              'active-b': index + 1 === new Date().getDay()
            }"
          >
            <p style="font-size: 14px" class="font-color">
              {{ $lang.common_txt192 }} {{ index + 1 }}
            </p>
            <!-- <div style="margin-top: 76px" class="divider"></div> -->
            <p style="margin-top: 76px" class="info-color">
              {{ getCurrency }} {{ singSum }}
            </p>
          </div>
        </div>
        <van-button
          size="large"
          class="custom-button"
          :class="{ active: info.receiveStatus !== 1 }"
          :disabled="info.receiveStatus !== 1"
          @click="getJl"
        >
          {{ $lang.Recebido }}
        </van-button>
      </div>

      <div class="content-c4">
        <div class="content-c2--c2t">
          {{ $lang.bonus_txt41 }}
        </div>
      </div>
      <div class="content-c5">
        {{ $lang.bonus_txt42 }}
      </div>

      <div class="content-c4">
        <div class="content-c2--c2t">
          {{ $lang.bonus_txt43 }}
        </div>
      </div>
      <div class="content-c3">
        <div class="content-c3--t font-color">
          <p>{{ $lang.bonus_txt36 }}</p>
          <p>{{ $lang.bonus_txt37 }}</p>
        </div>
        <div
          class="content-c3--t2 f-w"
          v-for="(item, index) in InitDate"
          :key="index"
          :style="(index + 1) % 2 === 0 ? {} : { backgroundColor: '#2a2418' }"
        >
          <p>VIP{{ item.vipLevel }}</p>
          <p>{{ item.reward }}</p>
        </div>
      </div>
      <van-loading v-if="loading" color="#ffa300" vertical> </van-loading>
    </div>
  </div>
</template>
<script>
import { GetSignIn, SignIn } from '@/api/common'
export default {
  name: 'cashBack',
  components: {},
  data() {
    return {
      singData: [0, 1, 2, 3, 4, 5, 6],
      InitDate: [],
      info: {},
      loading: false,
      singSum: 0
    }
  },
  mounted() {
    if (this.token) {
      this.GetSignIn()
    }
  },
  methods: {
    async getJl() {
      const data = await SignIn()
      if (data.status === 'ok') {
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: 'success'
        })
        this.GetSignIn()
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async GetSignIn() {
      this.loading = true
      const data = await GetSignIn()
      if (data.status === 'ok') {
        this.InitDate = JSON.parse(data.content.ruleList)
        this.info = data.content
        let newArr = this.InitDate.filter(
          (i) => i.vipLevel === data.content.vipLevel
        )
        this.singSum = newArr[0].reward || 0
        this.loading = false
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 0% 3% 10% 3%;
  // position: absolute;
}
.content-c--c {
  padding: 10px 0px;
  border-radius: 15px;
  width: 100%;
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.content-c--b {
  padding-top: 5px;
  background: url('../../../assets/img/sign_in/sign_in_item_bg.png'); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  // width: 110px;
  height: 120px;
  padding-bottom: 2px;
  position: relative; /* 设置为相对定位，以便添加伪元素 */
  border-radius: 15px;
}
.content-c--b3 {
  width: 100% !important;
}
.content-c--b2 {
  padding-top: 3px;
  background-image: url('../../../assets/img/sign_in/sign_in_item_bg1.png'); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  // width: 346px;
  height: 120px;
  position: relative; /* 设置为相对定位，以便添加伪元素 */
  border-radius: 15px;
  border: 2px solid #e9a843; /* 边框 */
}
.active-b {
  /* 金色阴影效果 */
  // box-shadow: 0 1px 11px rgba(255, 215, 0, 0.8); /* 金色阴影 */
  border: 2px solid @info-color; /* 白色边框 */
  background-image: url('../../../assets/img/sign_in/sign_in_item_bg1.png'); /* 指定背景图片的路径 */
}

.active {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #9b9b9b !important;
  border-bottom: 0px solid #494949 !important;
}
.custom-button {
  opacity: 1;
  border-radius: 13px;
}

.content-c2 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 18px;
  background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 320px; /* 或者指定具体的宽度 */
  padding: 2px 10px;
}
.content-c3--t {
  margin-top: 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px 12px 0 0;
  padding: 3.2% 77px 3.2% 67px;
  background: @cont-bg;
}
.content-c3--t2 {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 11% 12px 6%;
  background: @cont-bg;
  border-radius: 4px 4px 4px 4px;
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
.content-c3 :last-child {
  border-radius: 0 0 12px 12px !important;
}
.content-c4 {
  font-size: 16px;
  font-weight: bold;
  margin-top: 18px;
  // background: #e9a843;
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 360px; /* 或者指定具体的宽度 */
  padding: 3px 0px;
}
.content-c5 {
  // padding: 0 10px;
  // font-size: 15px;
  margin-top: 15px;
  line-height: 20px;
  color: @font-color;
}
.divider {
  width: 60%;
  height: 2px;
  background-color: #ccc; // 你可以根据整体风格改颜色
  margin: 10px auto 0 auto;
}
/* PC 端样式 */
@media (min-width: 769px) {
  .content-c {
    width: 450px;
    padding: 3% 1% 10% 1% !important;
  }
  .content-c3--t {
    padding: 3.2% 98px 3.2% 85px;
  }
}
</style>
