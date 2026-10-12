<template>
  <div class="wd-page">
    <title-bar :title="$lang.Saque || 'Withdraw'" />

    <div class="wd-tabs-bar">
      <div class="wd-tabs">
        <button
          v-for="(item, index) in tabList"
          :key="index"
          type="button"
          class="wd-tabs__item"
          :class="{ 'is-active': selectIndex === index }"
          @click="selectF(index)"
        >
          {{ item }}
        </button>
      </div>
    </div>

    <bank-info-tab1 v-if="selectIndex === 0" @goToActive="goToActive" />
    <bank-info-tab2 v-if="selectIndex === 1" />
  </div>
</template>

<script>
import BankInfoTab1 from "../../../components/recharge/BankInfoTab1.vue";
import BankInfoTab2 from "../../../components/recharge/BankInfoTab2.vue";

export default {
  name: "BankAdd",
  components: { BankInfoTab1, BankInfoTab2 },
  data() {
    return {
      tabList: [this.$lang.Saque, this.$lang.bankAdd_txt],
      selectIndex: 0,
    };
  },
  mounted() {
    if (this.$route.query.from === "profile") {
      this.selectIndex = 1;
    }
  },
  methods: {
    selectF(i) {
      this.selectIndex = i;
    },
    goToActive(v) {
      this.selectIndex = v;
    },
  },
};
</script>

<style lang="less" scoped>
.wd-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
  color: #fff;
}

.wd-tabs-bar {
  margin-top: 10px;
  background: url("@/assets/img/recharge/wd_tabs_bg.png") center / 100% 100%
    no-repeat;
  border-bottom: 1px solid #5c1078;
}

.wd-tabs {
  position: relative;
  z-index: 1;
  display: flex;
  width: 60%;
  max-width: 320px;
  height: 28px;
  margin: 0 auto;
  overflow: hidden;
  border: 1px solid #662475;
  border-bottom: none;
  border-radius: 12px 12px 0 0;
  box-sizing: border-box;

  &__item {
    flex: 1;
    height: 100%;
    border: none;
    border-radius: 0;
    background: #1b1226;
    color: #a9a7ab;
    font-size: 12px;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &.is-active {
      background: #491257;
      color: #ffffff;
    }
  }
}

@media (min-width: 769px) {
  .wd-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
