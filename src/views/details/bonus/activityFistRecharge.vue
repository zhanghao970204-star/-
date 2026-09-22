<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title2"></title-bar>
    <div class="content-c" style="padding: 3%">
      <!-- <div>
        <img
          src="../../../assets/img/bonus/bonus3.png"
          width="100%"
          style="border-radius: 13px"
        />
      </div> -->
      <!-- <div style="position: relative">
        <img
          src="../../../assets/img/bonus/bonus3.png"
          width="100%"
          style="border-radius: 13px"
        />
        <div style="position: absolute; top: 20px; left: 20px">
          <p
            style="font-weight: 800; font-size: 15px; margin-bottom: 10px"
            v-html="$lang.common_txt238"
          ></p>
          <p v-html="$lang.common_txt239"></p>
        </div>
      </div> -->
      <div class="content-a m-t-10">
        <div v-html="$lang.bonus_txt3" class="content-b"></div>
        <van-button @click="goToRec" size="large" class="custom-button m-t-20">
          {{ $lang.bonus_txt4 }}
        </van-button>
        <div class="m-b-20 info-color m-t-5">
          {{ $lang.bonus_txt5 }}
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'ActivityFistRecharge',
  components: {},
  data() {
    return {}
  },
  methods: {
    goToRec() {
      if (!this.token) {
        this.$refs.rechargeCont.showPopup = true
      } else {
        this.$jumpTo('/rechargeCont')
      }
      window.scrollTo(0, 0)
    }
  }
}
</script>
<style lang="less" scoped>
.content-b {
  font-size: 13px;
  border-radius: 12px;
  width: 100%;
  line-height: 16px;
  background: @cont-bg;
  padding: 3%;
}
</style>
