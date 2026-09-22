<template>
  <div class="content">
    <van-popup
      v-model:show="showDialog"
      class="custom-popup"
      :close-on-click-overlay="false"
    >
      <van-icon
        style="margin: 20px 0 0 20px"
        @click="goBack"
        name="arrow-left"
        size="20"
        color="#ffa300"
      />
      <div class="show-bg">
        <div class="show-bg--i" @click="goTo">
          Entrar em Contato com o <br />
          Atendimento ao Cliente
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  name: 'joinUs',
  data() {
    return {
      showDialog: true
    }
  },
  mounted() {},
  methods: {
    goTo() {
      window.open('https://t.me/OTgamel', '_blank')
    },
    goBack() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  background: @black-color;
  height: 100vh;
}
.custom-popup {
  width: 100%;
  background: transparent;
  height: 100%;
}
.show-bg {
  background: url(../../../assets/img/home/banner.png) no-repeat;
  width: 100%;
  height: 500px;
  background-size: 100% 100%;
  margin-top: 20%;
  position: relative;
}
.show-bg--i {
  background: url(../../../assets/img/home/btn2.png) no-repeat;
  width: 60%;
  height: 55px;
  background-size: 100% 100%;
  position: absolute;
  left: 25%;
  top: 395px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 20px;
  font-size: 14px;
}
</style>
