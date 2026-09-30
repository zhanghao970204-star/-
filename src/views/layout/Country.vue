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
.country-page {
  min-height: 100vh;
  background-color: #27033C;
  background-image: url(@/assets/img/common/page_bg.png);
  background-repeat: repeat;
  background-size: auto;
  background-position: top center;
}

.country-page__mask {
  min-height: 100vh;
  background: transparent;
  overflow: auto;
}
</style>
