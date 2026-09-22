<template>
  <div class="content-c">
    <div class="content-c--t">
      <div>
        <div class="d-flex" style="justify-content: center">
          <img src="../../assets/img/general/img_dollar.png" width="15px" />
          <span class="m-l-5 font-color">Saldo total</span>
        </div>
        <p class="t-c f-t-20 f-w m-t-10">
          <span class="m-l-5 info-color">{{ getCurrency }}</span>
          {{ $formatNumberWithCommas(info.balance) }}
        </p>
      </div>
      <div class="line"></div>
      <div>
        <div class="d-flex" style="justify-content: center">
          <img src="../../assets/img/general/img_dollar.png" width="15px" />
          <span class="m-l-5 font-color">Retirável</span>
        </div>
        <p class="t-c f-t-20 f-w m-t-10">
          <span class="m-l-5 info-color">{{ getCurrency }}</span>
          {{ $formatNumberWithCommas(info.balWdl) }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'RechargeTop',
  components: {},
  props: {
    info: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      showPopover: false, // 控制气泡显示
      showPopover2: false // 控制气泡显示
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  border-radius: 12px;
}
.content-c--t {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: linear-gradient(to right, #284fac, #3360d1, #1f418d);
  box-shadow: 0 0px 7px black;
  width: 100%;
  height: 96px;
  border-radius: 12px;
  padding: 0 10%;
}
.line {
  width: 2px;
  height: 35px;
  background: black;
}
.content-c--b {
  padding-top: 19px !important;
  display: flex;
  justify-content: space-between;
  padding: 0 1% 0 6.6%;
  height: 117px;
}
.m-b-18 {
  margin-bottom: 18px;
}
.custom-popover-content {
  width: 100%;
  padding: 10px;
  background-color: #f7ba17;
  border-radius: 5px;
  color: @wihte-color;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
.custom-popover-content2 {
  width: 300px;
  padding: 10px;
  background-color: #f7ba17;
  border-radius: 5px;
  color: @wihte-color;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-left: 100px;
}
</style>
