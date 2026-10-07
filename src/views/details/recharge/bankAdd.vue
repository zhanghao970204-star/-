<template>
  <div class="wd-page">
    <title-bar :title="$lang.Saque || 'Withdraw'" />

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

    <bank-info-tab1
      v-if="selectIndex === 0"
      @goToActive="goToActive"
    />
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

.wd-tabs {
  display: flex;
  margin: 10px 14px 0;
  height: 44px;
  padding: 3px;
  border-radius: 14px;
  overflow: hidden;
  background-color: #14041c;
  background-image: url("@/assets/img/recharge/wd_tab_bg.png");
  background-position: center;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-sizing: border-box;
  border: 1px solid rgba(177, 120, 220, 0.4);

  &__item {
    flex: 1;
    height: 100%;
    border: none;
    border-radius: 12px;
    background: transparent;
    color: fade(#fff, 55%);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;

    &.is-active {
      background: linear-gradient(180deg, #8f3ab0 0%, #6a228c 100%);
      color: #fff;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
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
