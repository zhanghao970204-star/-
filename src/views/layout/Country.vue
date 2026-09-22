<template>
  <div class="country-page">
    <div class="country-page__mask">
      <CommonLang v-model="showPopup" :overlay="false"></CommonLang>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Country',
  components: {},
  data() {
    return {
      showPopup: false
    }
  },
  methods: {},
  mounted() {
    if (this.GET_PLATFORM) {
      this.$jumpTo('/home', {}, { replace: true })
    }
    this.showPopup = true
  }
}
</script>
<style lang="less" scoped>
/* y7 黑金风格背景 */
.country-page {
  min-height: 100vh;
  background: #1f1c17;
}

.country-page__mask {
  min-height: 100vh;
  background: #1f1c17 url(@/assets/img/login/loginPageBg.png) center top no-repeat;
  background-image: image-set(
    url('@/assets/img/login/loginPageBg.webp') type('image/webp'),
    url('@/assets/img/login/loginPageBg.png') type('image/png')
  );
  background-size: cover;
  background-position: center top;
  overflow: auto;
}
</style>
