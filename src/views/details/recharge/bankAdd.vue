<template>
  <div class="content">
    <div class="bankAdd-cont d-flex">
      <van-icon
        @click="goBack"
        name="arrow-left"
        size="17"
        class="m-l-10 m-b-10"
        color="var(--wihte-color)"
      />
      <div class="d-flex m-l-10">
        <p
          v-for="(item, index) in tabList"
          :key="index"
          class="m-l-20 ankAdd-top-i"
          :class="{ active: selectIndex === index }"
          @click="selectF(index)"
        >
          {{ item }}
        </p>
      </div>
    </div>
    <bank-info-tab1
      v-if="selectIndex === 0"
      @goToActive="goToActive"
    ></bank-info-tab1>
    <bank-info-tab2 v-if="selectIndex === 1"></bank-info-tab2>
  </div>
</template>
<script>
import BankInfoTab1 from '../../../components/recharge/BankInfoTab1.vue'
import BankInfoTab2 from '../../../components/recharge/BankInfoTab2.vue'
export default {
  name: 'BankAdd',
  components: { BankInfoTab1, BankInfoTab2 },
  data() {
    return {
      tabList: [this.$lang.Saque, this.$lang.bankAdd_txt],
      selectIndex: 0
    }
  },
  mounted() {
    if (this.$route.query.from === 'profile') {
      this.selectIndex = 1
    }
  },
  methods: {
    selectF(i) {
      this.selectIndex = i
    },
    goBack() {
      this.$router.go(-1)
    },
    goToActive(v) {
      this.selectIndex = v
    }
  }
}
</script>
<style lang="less" scoped>
.bankAdd-cont {
  padding-top: 13px;
  background: #1f1c17;
  border-bottom: 1px solid @border-color;
  position: sticky;
  top: 0;
  z-index: 2;
}
.ankAdd-top-i {
  padding-bottom: 13px;
}
.active {
  // border-bottom: 2px solid @primary-color;
  padding-bottom: 11px;
  position: relative;
}
.active::after {
  content: '';
  position: absolute;
  left: -5px;
  right: 0;
  bottom: -1px;
  margin: 0 auto;
  width: 50px;
  height: 3px; /* 设置渐变阴影的高度 */
  background: linear-gradient(to right, @info2-color, #f7ba17, @info2-color);
}
</style>
