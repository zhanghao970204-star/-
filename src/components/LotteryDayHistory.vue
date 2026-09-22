<template>
  <div>
    <van-popup
      v-model:show="visible"
      :closeable="closeable"
      :close-icon="closeIcon"
      :overlay="overlay"
      position="bottom"
      :style="{ width: '100%' }"
      class="custom-popup"
    >
      <div>
        <div class="lot-day-t d-flex-s">
          <p class="f-w f-t-16">{{ $lang.common_txt128 }}</p>
          <van-button
            class="custom-button custom-button-xg"
            @click="goToHistory()"
          >
            {{ $lang.common_txt129 }}
          </van-button>
        </div>
        <div class="lot-day-t2 d-flex-s t-c">
          <p
            v-for="(item, index) in [
              $lang.common_txt217,
              $lang.common_txt218,
              $lang.common_txt219,
              $lang.common_txt220,
            ]"
            :key="index"
            style="width: 25%"
          >
            {{ item }}
          </p>
        </div>
        <div class="lot-day-scoll">
          <div
            class="lot-day-t3 d-flex-s t-c"
            v-for="(item2, index2) in betRecordList"
            :key="index2"
            @click="goToDetil(item2)"
          >
            <p style="width: 25%">{{ item2.issueNo }}</p>
            <p style="width: 25%">{{ item2.betAmount }} {{ getCurrency }}</p>
            <p style="width: 25%" v-html="item2.statusName"></p>
            <p v-if="item2.bonusAmount" style="color: #59ff00; width: 25%">
              {{ item2.bonusAmount }} {{ getCurrency }}
            </p>
            <p v-else style="width: 25%" class="f-w">...</p>
          </div>
          <div v-if="betRecordList.length === 0" class="lot-empt">
            <img src="../assets/img/lottery/lot-empt.png" width="50%" />
            <p class="f-t-15 f-w" style="color: #616869">
              {{ $lang.common_txt130 }}
            </p>
          </div>
        </div>

        <div class="lot-day-t4 d-flex-s t-c">
          <div>
            <p class="title-color">{{ $lang.common_txt131 }}</p>
            <p v-if="info.todayBetCurrAmount" class="lot-day-t4b">
              {{ info.todayBetCurrAmount }} {{ getCurrency }}
            </p>
            <p v-else class="lot-day-t4b f-w">...</p>
          </div>
          <div>
            <p class="title-color">{{ $lang.common_txt132 }}</p>
            <p v-if="info.todayBetEffAmount" class="lot-day-t4b">
              {{ info.todayBetEffAmount }} {{ getCurrency }}
            </p>
            <p v-else class="lot-day-t4b f-w">...</p>
          </div>
          <div>
            <p class="title-color">{{ $lang.common_txt133 }}</p>
            <p v-if="info.todayBonusAmount" class="lot-day-t4b">
              {{ info.todayBonusAmount }} {{ getCurrency }}
            </p>
            <p v-else class="lot-day-t4b f-w">...</p>
          </div>
          <div>
            <p class="title-color">{{ $lang.common_txt134 }}</p>
            <p v-if="info.todayProfitLossAmount" class="lot-day-t4b">
              {{ info.todayProfitLossAmount }} {{ getCurrency }}
            </p>
            <p v-else class="lot-day-t4b f-w">...</p>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "LotteryDayHistory",
  props: {
    betRecordList: {
      type: Array,
      default: () => [],
    },
    info: {
      type: Object,
      default: () => {},
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭按钮
    closeable: {
      type: Boolean,
      default: false,
    },
    // 关闭按钮的图标
    closeIcon: {
      type: String,
      default: "cross",
    },
    lotteryType: {
      type: String,
      default: "",
    },
    lotteryName: {
      type: String,
      default: "",
    },
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      visible: this.modelValue, // 内部状态
    };
  },
  computed: {},
  watch: {
    // 监听外部传入的 value 值变化
    modelValue(newVal) {
      this.visible = newVal;
    },
    // 监听内部 visible 值变化，同步到外部
    visible(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  mounted() {},

  methods: {
    goToDetil(v) {
      this.$jumpTo(
        "bettingDetails", // routeName 对应 path 部分（会自动拼接 country 前缀）
        {
          // params 对应 query 参数
          mainOrderNo: v.orderNo,
          childOrderNo: v.childOrderNo,
          type: "y",
          lotteryType: this.lotteryType,
          lotteryName: this.lotteryName,
        },
        { replace: true }, // options 指定 replace 跳转模式
      );
    },
    goToHistory() {
      this.$jumpTo("/betHistory");
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.custom-popup) {
  border-radius: 15px 15px 0 0;
  background: @wihte-color;
  padding: 15px 10px 10px;
}
.custom-button-xg {
  box-shadow: none;
  border-radius: 20px;
  padding: 0 10px;
  height: 30px;
  // border-bottom: 1px solid #3bc46b !important;
}
.lot-day-t {
  margin: 0 10px;
}
.lot-day-t2 {
  margin: 10px 15px;
  color: @title-color;
  font-weight: bold;
}
.lot-day-t3 {
  // background: #41484a;
  border-radius: 12px;
  padding: 8px 12px;
  margin-bottom: 10px;
  border: 1px solid;
}
.lot-day-t4b {
  // background: #41484a;
  padding: 5px;
  text-align: center;
  width: 80px;
  border-radius: 15px;
  margin-top: 5px;
  border: 1px solid @title-color;
}
.lot-day-scoll {
  height: 280px;
  overflow: scroll;
  margin-bottom: 10px;
}
.lot-empt {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  flex-flow: column;
}
.lot-day-t2 :first-child {
  text-align: left;
}
.lot-day-t3 :first-child {
  text-align: left;
}
/* PC 端样式 */
@media (min-width: 769px) {
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
