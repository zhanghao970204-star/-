<template>
  <div class="content">
    <title-bar title="Deposit Benefits"></title-bar>
    <div class="content-c">
      <img src="../../../assets/img/activity/banner1.png" width="100%" />
      <div class="content-b">
        <p class="m-t-10 f-t-15 l-h-20">
          Extra cash rewards for deposits. Higher deposits, higher rewards up to
          10%.
        </p>
        <div class="content-gb">
          <p style="color: #ffa300">Special Note:</p>
          <p class="m-t-20">Ensure unique account,phone,and card details.</p>
        </div>
      </div>
      <van-button
        @click="goToRec"
        size="large"
        class="popup-button"
        color="linear-gradient(180deg, #ffd467 0%, #df8a1b 100%)"
      >
        Recharge
      </van-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActivityRecharge',
  components: {},
  data() {
    return {}
  },
  methods: {
    goToRec() {
      this.$jumpTo('recharge', {}, { replace: true })
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 3%;
}
.popup-button {
  box-shadow: 0 4px 1px fade(#df8a1b, 50%); /* 阴影效果 */
  border-radius: 15px; /* 圆角 */
  color: #573900 !important; /* 文字颜色 */
  font-weight: bold;
  margin-top: 15px;
}
.content-gb {
  margin-top: 15px;
  border-radius: 8px;
  border: 1px solid fade(#e9a843, 35%);
  padding: 15px 10px;
  background: #15110a;
  font-size: 16px;
}
</style>
