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
      position="bottom"
    >
      <div class="RechargeCont-cont">
        <div class="d-flex-s">
          <div style="width: 43%; margin-top: 10px">
            <van-icon
              @click="goBack"
              name="arrow-left"
              size="15"
              color="#1F2A47"
            />
          </div>
          <div class="d-flex-s" style="width: 57%">
            <p class="f-t-15 m-t-10">{{ $lang.Depósito }}</p>
            <p @click="goToRechage" class="primary-color f-t-13">
              {{ $lang.RechargeCont_txt }}
            </p>
          </div>
        </div>
        <div
          class="d-flex"
          style="border-bottom: 1px solid rgba(233, 168, 67, 0.3)"
        >
          <div class="RechargeCont-tab p-r d-flex">
            <img
              class="m-r-10"
              src="../assets/img/recharge/online.png"
              width="20"
            />

            <span class="primary-color f-t-14">{{
              $lang.RechargeCont_txt2
            }}</span>
            <div class="custom-badge">
              <p v-if="paymentList.length > 0" class="p-r">
                {{
                  paymentList[0].quickSelect[
                    paymentList[0].quickSelect.length - 1
                  ].bonus
                }}
              </p>
              <p class="tool-tips-tail"></p>
            </div>
          </div>
        </div>

        <div class="d-flex m-t-10">
          <div class="type-item d-flex">
            <img src="../assets/img/home/pix-H.png" height="25" class="m-l-5" />
            <span class="primary-color m-l-20">{{ $lang.account }}</span>
            <div class="custom-badge">
              <div v-if="paymentList.length > 0" class="p-r">
                <p>
                  {{ paymentList[0].quickSelect[1].bonus }}-
                  {{
                    paymentList[0].quickSelect[
                      paymentList[0].quickSelect.length - 1
                    ].bonus
                  }}
                </p>
              </div>
              <p class="tool-tips-tail"></p>
            </div>
            <div class="badgeIcon-c">
              <p class="badgeIcon">
                <van-icon
                  name="success"
                  color="var(--wihte-color)"
                  class="badgeIcon-i"
                  size="10"
                />
              </p>
            </div>
          </div>
        </div>
        <p class="p-line"></p>
        <div class="d-flex">
          <div class="type-item d-flex-s t-c">
            <span class="primary-color t-c" style="width: 100%"
              >{{ $lang.account }}1</span
            >
            <div class="badgeIcon-c">
              <p class="badgeIcon">
                <van-icon
                  name="success"
                  color="var(--wihte-color)"
                  class="badgeIcon-i"
                  size="10"
                />
              </p>
            </div>
          </div>
        </div>
        <p class="p-line"></p>
        <div v-if="showBg">
          <p class="tipsBox">
            {{ $lang.RechargeCont_txt3 }}
          </p>
          <div class="tipsBox-s">
            <p class="tipsBox-sj"></p>
          </div>
        </div>

        <div class="d-flex-s f-t-13">
          <span>{{ $lang.RechargeCont_txt4 }}</span>
          <span @click="showBg = !showBg" class="primary-color">{{
            $lang.RechargeCont_txt5
          }}</span>
        </div>

        <div class="amount-box-list d-flex-s">
          <div
            class="amount-box-list-item"
            v-for="(item, index) in dataList"
            :key="index"
            :class="{ active: index === selectAmountIndex || item.isActive }"
            @click="selectAmount(index, item)"
          >
            <div
              v-if="(activities.length < 1 || agree) && item.bonus > 0"
              class="custom-badge"
            >
              <div class="p-r">
                <p>
                  {{ $formatNumberWithCommas(item.bonus) }}
                </p>
              </div>
              <p class="tool-tips-tail"></p>
            </div>
            <div class="d-flex-s" style="height: 100%">
              <span style="width: 100%" class="t-c">{{
                $formatNumberWithCommas(item.amount)
              }}</span>
              <div class="badgeIcon-c">
                <p
                  v-if="index === selectAmountIndex || item.isActive"
                  class="badgeIcon"
                >
                  <van-icon
                    name="success"
                    color="var(--wihte-color)"
                    class="badgeIcon-i"
                    size="10"
                  />
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex" v-if="activities.length > 0">
          <van-checkbox
            v-model="agree"
            shape="square"
            checked-color="var(--icon-color)"
            icon-size="14px"
            style="
              border: 2px solid var(--icon-color);
              margin-right: 10px;
              border-radius: 5px;
            "
          ></van-checkbox>
          <p
            v-if="activities[0].code === 'first_recharge_new_1'"
            class="info-color"
          >
            {{ $lang.RechargeCont_txt6 }} {{ getCurrency
            }}{{
              $formatNumberWithCommas(
                dataList.find((item) => parseFloat(item.bonus) > 0).bonus,
              ) || ""
            }}
          </p>
          <p
            v-if="activities[0].code === 'first_recharge_new_2'"
            class="info-color"
          >
            {{ $lang.RechargeCont_txt7 }}
          </p>
        </div>
        <van-field
          v-model="amount"
          placeholder="Valor da recarga"
          class="custom-field m-t-10"
          type="number"
          :style="{
            borderColor: focus ? 'var(--border-color)' : 'var(--border-color)',
          }"
          @input="handleInput"
          @focus="focus = true"
          @blur="focus = false"
        >
          <template #left-icon>
            <span class="f-t-15">{{ getCurrency }}</span>
          </template>
        </van-field>
        <van-button
          @click="submit"
          size="large"
          class="custom-button m-t-20"
          :class="{ 'active-b': isLoading }"
          :disabled="isLoading"
        >
          {{ $lang.bonus_txt4 }}
        </van-button>
      </div>
    </van-popup>
    <login v-model="showPopup" overlay></login>
  </div>
</template>

<script>
import { Pay, GetIsFbReport, VnRechargeInitS } from "@/api/common";
export default {
  name: "RechargeCont",
  props: {
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
    isFlogin: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      showPopup: false,
      showBg: false,
      isLoading: false,
      agree: false,
      selectIndex: 0,
      selectAmountIndex: null,
      amount: "",
      focus: false,
      dataList: [],
      paymentType: "",
      paymentKey: "",
      paymentId: "",
      rechargeFees: 0,
      visible: this.modelValue, // 内部状态
      paymentList: [],
      activities: [],
      firstRecharge: false,
    };
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
    paymentList: {
      deep: true, // 开启深度监听
      // immediate: true, // 在加载时立即调用一次
      handler() {
        this.tabIndex(0);
        this.selectAmount(1, this.paymentList[0].quickSelect[1].amount);
        this.amount = this.paymentList[0].quickSelect[1].amount;
        this.agree = true;
      },
    },
  },
  mounted() {
    if (this.token) {
      this.VnRechargeInitS();
    }
  },
  methods: {
    goToRechage() {
      this.$jumpTo("/recordOrder");
    },
    goBack() {
      this.visible = false;
    },
    async VnRechargeInitS() {
      const data = await VnRechargeInitS();
      if (data.status === "ok") {
        this.paymentList = data.content.paymentList;
        this.dataList = data.content.paymentList[0].quickSelect;
        this.activities = data.content.activities || [];
        this.firstRecharge = data.content.firstRecharge === true;
      }
    },
    async GetIsFbReport(v) {
      const data = await GetIsFbReport({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.isReport) {
          if (data.content.target === "ks") {
            window.kwaiq.load(data.content.fbPixId);
            window.kwaiq.instance(data.content.fbPixId).track("addToCart", {
              value: parseInt(v * 0.1),
              currency: "NGN",
            });

            console.log("add_to_cart");
          } else {
            this.$pixel.setFbId(data.content.fbPixId);
            this.$pixel.callTrackHasPara("track", "AddToCart", v * 0.1, "NGN"); // 上报
            const jsonData = `"""{"data":[{"event_name": "Lead","content_name": "Recharge Form","value": ${parseInt(
              v * 0.1,
            )},"currency": "BRLS"}]}"""`;
            this.$pixel.sendEventToAndroid(jsonData);
          }
        }
      }
    },
    async submit() {
      if (this.amount < 10) {
        this.$toast({
          message: this.$lang.RechargeCont_txt8,
          icon: "cross",
        });
        return;
      }
      this.isLoading = true;
      const data = await Pay({
        paymentAmount: this.amount,
        paymentId: this.paymentId,
        paymentKey: this.paymentKey,
        paymentType: this.paymentType,
        rechargeFees: this.rechargeFees,
        promoType: this.firstRecharge
          ? this.activities.length > 0
            ? this.activities[0].code
            : "first_recharge_new_1"
          : null,
      });
      if (data.status === "ok") {
        this.GetIsFbReport(this.amount);
        sessionStorage.setItem(
          "gameHallEmbed",
          JSON.stringify({ from: "recharge", url: data.content.url }),
        );
        this.$jumpTo("/gameHall");
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
      this.isLoading = false;
    },
    tabIndex(i) {
      this.selectIndex = i;
      this.dataList = this.paymentList[i].quickSelect;
      this.dataList.forEach((i) => {
        i.isActive = false;
      });
      this.paymentId = this.paymentList[i].paymentId;
      this.paymentKey = this.paymentList[i].paymentKey;
      this.paymentType = this.paymentList[i].paymentType;
      this.rechargeFees = this.paymentList[i].rechargeFees;
    },
    selectAmount(i, v) {
      this.dataList.forEach((i) => {
        i.isActive = false;
      });
      this.selectAmountIndex = i;
      this.amount = v.amount;
    },
    handleInput(i) {
      // 根据输入框的值更新按钮的激活状态
      this.dataList.forEach((item) => {
        item.isActive = parseInt(item.amount) === parseInt(i);
        this.selectAmountIndex = null;
      });
    },
  },
};
</script>

<style lang="less" scoped>
.custom-popup {
  border-radius: 15px 15px 0 0;
  // height: 90%;
  padding-bottom: 30px;
  .RechargeCont-cont {
    padding: 10px;
  }
  .type-item {
    width: 120px;
    position: relative;
    border-radius: 5px;
    border: 1px solid @primary-color;
    height: 40px;
  }
  :deep(.van-checkbox__icon .van-icon) {
    border: none;
  }
  :deep(.van-checkbox__icon--checked .van-icon) {
    background-color: transparent !important;
    color: #333333;
  }
}
.custom-badge {
  position: absolute;
  right: -10px;
  top: -7px;
  font-size: 9px;
  color: @wihte-color;
  background: @error-color;
  border-radius: 15px 15px 15px 0;
  padding: 2px 3px;
  min-width: 28px;
  text-align: center;
}
.tool-tips-tail {
  position: absolute;
  top: 13px;
  left: 0;
  width: 0;
  height: 0;
  border-left: 0px solid transparent; /* 左边框透明 */
  border-right: 5px solid transparent; /* 右边框透明 */
  border-top: 6px solid @error-color; /* 上边框设置颜色和宽度 */
}
.RechargeCont-tab {
  margin-top: 30px;
  border-bottom: 2px solid @primary-color;
  padding-bottom: 5px;
}
.badgeIcon-c {
  position: absolute;
  top: 22px;
  right: 0;
}
.badgeIcon {
  position: relative;
  border-left: 16px solid transparent !important;
  // border-right: 0px solid transparent !important;
  border-bottom: 16px solid @primary-color;
  // border-radius: 0 0 3px 0;
}
.badgeIcon-i {
  position: absolute;
  right: 0;
  top: 6px;
  width: 10px;
}
.p-line {
  height: 1px;
  background: fade(#e9a843, 30%);
  margin: 10px 0 15px 0;
}
.tipsBox {
  border-radius: 5px;
  padding: 10px;
  text-align: center;
  background: @info-color;
  color: @wihte-color;
}
.tipsBox-sj {
  width: 10px;
  border-left: 5px solid transparent; /* 左边框透明 */
  border-right: 5px solid transparent; /* 右边框透明 */
  border-top: 6px solid @info-color; /* 上边框设置颜色和宽度 */
  margin-right: 30px;
  margin-bottom: 2px;
}
.tipsBox-s {
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
.amount-box-list {
  flex-flow: wrap row;
  margin-top: 15px;
}
.amount-box-list-item {
  position: relative;
  border-radius: 5px;
  border: 1px solid fade(#e9a843, 35%);
  width: 22%;
  height: 40px;
  margin-bottom: 10px;
}
.active {
  border: 1px solid @primary-color;
}
</style>
