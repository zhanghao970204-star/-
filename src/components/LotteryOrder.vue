<template>
  <div>
    <van-popup
      v-model:show="visible"
      :closeable="closeable"
      :close-icon="closeIcon"
      :overlay="overlay"
      :close-on-click-overlay="false"
      :style="{ width: '100%', height: '100%' }"
      class="custom-popup"
    >
      <div class="lottery-bg">
        <div class="lottery-title">
          <van-icon
            name="arrow-left"
            @click="visible = false"
            size="18"
            color="#1F2A47"
          />

          <p class="f-w" style="font-size: 16px">{{ $lang.common_txt77 }}</p>

          <p
            @click="cleanAll"
            class="f-t-13 f-w"
            style="color: #d62945; display: flex; align-items: center"
          >
            <img src="../assets/img/lottery/ljt.png" width="16" />
            {{ $lang.common_txt78 }}
          </p>
        </div>
      </div>
      <div class="order-list">
        <div v-if="orderList.length > 0">
          <div
            class="lot-bto-t4 m-b-10"
            v-for="(item, index) in orderList"
            :key="index"
          >
            <div class="lot-bto-t4t">
              <div>
                <p style="color: #ededed">{{ $lang.common_txt79 }}</p>
                <p class="f-t-15" style="color: var(--wihte-color)">
                  {{ item.lotteryName }} ({{ item.betTypeName }})
                </p>
              </div>
              <img
                @click="delOrder(index)"
                src="../assets/img/lottery/ljt.png"
                width="20"
                height="20"
              />
            </div>

            <div style="background: #4d71c0">
              <div
                v-if="
                  !['star7_zu', 'szc11x6_1x_dwd_zu'].includes(item.playType)
                "
                class="lot-bto-t2"
              >
                <p
                  style="
                    border-radius: 50%;
                    border: 1px solid var(--wihte-color);
                    text-align: center;
                    width: 28px;
                    height: 28px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                  v-for="(item, index) in setBalF(item.setBall)"
                  :key="index"
                >
                  <span>
                    {{ item == 100 ? "00" : item }}
                  </span>
                </p>
              </div>
              <div
                v-if="['szc11x6_1x_dwd_zu', 'star7_zu'].includes(item.playType)"
              >
                <div class="lot-bto-t2s">
                  <div
                    class="d-flex"
                    style="
                      width: 28px;
                      height: 28px;
                      justify-content: center;
                      background: #bed730;
                      color: #038141;
                      border-radius: 7px;
                    "
                    v-for="(numType, index5) in ['szc11x6_1x_dwd_zu'].includes(
                      item.playType,
                    )
                      ? 6
                      : 7"
                    :key="index5"
                  >
                    {{ numType }}
                  </div>
                </div>
                <div class="lot-bto-t2">
                  <div
                    v-for="(item, index) in ['szc11x6_1x_dwd_zu'].includes(
                      item.playType,
                    )
                      ? item.selectedByColumn2
                      : item.selectedByColumn"
                    :key="index"
                  >
                    <p
                      v-if="item.length === 0"
                      style="text-align: center; padding-top: 5px"
                    >
                      *
                    </p>
                    <p
                      v-for="(item2, index2) in item"
                      :key="index2"
                      style="
                        border-radius: 50%;
                        border: 1px solid var(--wihte-color);
                        text-align: center;
                        width: 28px;
                        height: 28px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        margin-bottom: 5px;
                      "
                    >
                      <span v-if="item2 == 0">00</span>
                      <span v-else-if="item2 < 10">0{{ item2 }}</span>
                      <span v-else>{{ item2 }}</span>
                    </p>
                  </div>
                </div>
              </div>
              <p
                v-if="
                  ['+milionária', 'dia de sorte'].includes(item.lotteryName)
                "
                style="
                  border: 1px dashed var(--wihte-color);
                  margin-bottom: 5px;
                "
              ></p>
              <div
                v-if="['+milionária'].includes(item.lotteryName)"
                class="d-flex m-t-10"
                style="padding-bottom: 10px"
              >
                <p
                  v-for="(ball, index2) in item.setBall2.split(',')"
                  :key="index2"
                  class="lot-ball m-l-10 d-flex f-w"
                  style="justify-content: center"
                >
                  {{ ball }}
                </p>
              </div>
              <div
                v-if="['dia de sorte'].includes(item.lotteryName)"
                style="
                  padding: 5px 0 10px 10px;
                  color: var(--wihte-color);
                  font-weight: bold;
                "
                class="d-flex"
              >
                <img src="../assets/img/lottery/calendar_25.gif" width="25" />
                <p
                  v-for="(ball2, index3) in item.setBall2.split(',')"
                  :key="index3"
                >
                  {{ memberList[ball2 - 1] }}
                </p>
              </div>
            </div>

            <div class="lot-bto-t4b">
              <div style="padding: 12px 12px 0">
                <p style="color: #ededed">{{ $lang.common_txt85 }}</p>
                <div class="d-flex-s flex-w-r m-t-10">
                  <div
                    v-for="(item2, index) in item.winAmountList"
                    :key="index"
                    class="m-b-10"
                    style="
                      border: 1px solid #c04d4d;
                      width: 32%;
                      border-radius: 12px;
                      text-align: center;
                    "
                  >
                    <p class="lot-bto-t3y" style="padding: 2px 0">
                      {{ item2.num }}
                    </p>
                    <p style="color: var(--wihte-color); padding: 5px 0">
                      {{ getCurrency }}
                      {{ $formatNumberWithCommas(item2.winAmount) }}
                    </p>
                  </div>
                  <div style="width: 32%"></div>
                </div>
              </div>
              <div class="lot-line d-flex-s">
                <div style="width: 38%">
                  <p class="t-c">{{ $lang.common_txt88 }}</p>
                  <p class="lot-bto-t3tl">{{ item.lines }}</p>
                </div>
                <div style="width: 38%">
                  <p class="t-c">{{ $lang.common_txt86 }}</p>
                  <van-field
                    v-model="item.betAmount"
                    class="custom-field"
                    readonly
                  >
                  </van-field>
                </div>
              </div>
              <div class="lot-bto--bt">
                <span style="color: #ededed">{{ $lang.common_txt87 }}</span>
                <span style="color: var(--wihte-color)">
                  {{ item.amount }}
                  {{ getCurrency }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div v-else class="empt-bg">
          <img src="../assets/img/common/img_no_data2.png" width="80%" />
          <p class="f-t-18 f-w">{{ $lang.noempt }}</p>
        </div>
      </div>

      <div class="order-bot">
        <div>
          <p>
            <span class="title-color"
              >{{ $lang.common_txt89 }}
              <span style="color: #4dc0ae">{{ orderList.length }}</span>
            </span>
            <span class="f-w f-t-15 m-l-10"
              >{{ $lang.common_txt90 }}
              <span style="color: #4dc0ae"
                >{{ totalAmount }} {{ getCurrency }}</span
              >
            </span>
          </p>
          <p class="title-color">
            {{ $lang.common_txt91 }}
            <span style="color: #4dc0ae">
              {{ $formatNumberWithCommas(balance) }} {{ getCurrency }}</span
            >
          </p>
        </div>
        <van-button
          class="custom-button custom-button--xg"
          @click="betPayGwc"
          style="border: 0 !important"
          :class="{ active: orderList.length < 1 }"
          :disabled="orderList.length < 1"
        >
          {{ $lang.common_txt92 }}
        </van-button>
      </div>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "LotteryOrder",
  props: {
    orderList: {
      type: Array,
      default: () => [],
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
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
    },
    balance: {
      type: Number,
      default: 0,
    },
  },

  data() {
    return {
      memberList: [
        this.$lang.common_txt99,
        this.$lang.common_txt100,
        this.$lang.common_txt101,
        this.$lang.common_txt102,
        this.$lang.common_txt103,
        this.$lang.common_txt104,
        this.$lang.common_txt105,
        this.$lang.common_txt106,
        this.$lang.common_txt107,
        this.$lang.common_txt108,
        this.$lang.common_txt109,
        this.$lang.common_txt110,
      ],
      visible: this.modelValue, // 内部状态
    };
  },
  computed: {
    totalAmount() {
      // 使用 reduce 方法计算总数量
      return this.orderList.reduce((accumulator, current) => {
        return accumulator + current.amount;
      }, 0);
    },
  },
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
    setBalF(value) {
      return value
        .split(",") // 拆成数组
        .map((n) => parseInt(n, 10)) // 先转数字
        .sort((a, b) => a - b) // 从小到大排序
        .map((n) => (n < 10 ? `0${n}` : n));
    },
    betPayGwc() {
      if (this.orderList.length < 1) {
        this.$toast({
          message: this.$lang.common_txt93,
          icon: "fail",
        });
      } else {
        this.$emit("beyOrder", "or");
      }
    },
    cleanAll() {
      this.$emit("updateList");
    },
    delOrder(i) {
      this.orderList.splice(i, 1); // 删除指定下标处的元素
      this.$emit("updateList2");
    },
  },
};
</script>

<style lang="less" scoped>
:deep(.custom-popup) {
  background: @wihte-color;
  .van-field__control {
    text-align: center;
  }
  .custom-field {
    margin-top: 5px;
    text-align: center;
    border-radius: 20px;
    font-size: 12px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #294071;
  }
}
:deep(.van-field__control) {
  color: @wihte-color;
}
.lottery-title {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: @wihte-color;
  padding: 0 16px;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}

.lot-bto-t4t {
  position: relative;
  background: #4dc0ae;
  padding: 12px;
  margin-top: 3px;
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border-radius: 13px 13px 0 0;
}
.lot-bto-t4t::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #333f3b,
    #39664b,
    #419e61,
    #39664b,
    #333f3b
  );
}
.lot-bto-t4b {
  font-weight: bold;
  background: #4dc0ae;
  position: relative;
  border-radius: 0 0 13px 13px;
}
.lot-bto-t4b::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #333f3b,
    #39664b,
    #419e61,
    #39664b,
    #333f3b
  );
}
.lot-bto-t4bc {
  background: #225257;
  padding: 5px 10px;
  border-radius: 20px;
}
.order-list {
  padding: 3%;
  overflow: scroll;
  height: 85vh;
}
.lot-bto-t2 {
  font-weight: bold;
  line-height: 20px;
  color: @wihte-color;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8%, 1fr));
  gap: 7px;
  justify-content: start;
  padding: 10px;
}
.lot-bto-t2s {
  font-weight: bold;
  line-height: 20px;
  color: @wihte-color;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(8%, 1fr));
  gap: 7px;
  justify-content: start;
  padding: 10px 10px 0 10px;
}
.lot-bto-t3y {
  background: #c04d4d;
  color: @wihte-color;
  border-radius: 10px 10px 0 0;
}
.lot-bto-t3tl {
  background: #608ef2;
  border-radius: 20px;
  width: 100%;
  margin-top: 5px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.lot-line {
  background: #4d71c0;
  width: 100%;
  padding: 15px;
  color: @wihte-color;
}
.lot-bto--bt {
  padding: 10px;
  text-align: right;
}
.lottery-bg {
  position: sticky;
  top: 0;
  z-index: 999;
}
.order-bot {
  width: 100%;
  position: fixed;
  bottom: 0;
  // box-shadow: inset 1px 0px 5px 1px rgba(0, 0, 0, 0.7);
  background: @wihte-color;
  border-radius: 13px 13px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-top: 1px solid #7c8d8f;
}
.custom-button--xg {
  width: 100px;
  border-radius: 20px;
  height: 35px;
  box-shadow: none;
  background: #d62945;
}
.active {
  opacity: 1;
  // background: #d62945 !important;
  background: linear-gradient(to right, #717171, #6f6f6f) !important;
}
.empt-bg {
  height: 78vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  color: #7c8d8f;
}
.lot-ball {
  background: url(../assets/img/lottery/hua_s.png) no-repeat;
  width: 32px;
  height: 32px;
  background-size: 100% 100%;
}
/* PC 端样式 */
@media (min-width: 769px) {
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
