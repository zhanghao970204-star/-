<template>
  <div class="content-c">
    <div class="content-c1">
      <img src="../../assets/img/wallet/pay_item_logo.png" width="115" />
      <div
        v-for="(item, index2) in paymentList"
        :key="index2"
        @click="tabIndex(index2)"
        class="m-l-20"
      >
        <div class="tab--bg">
          <img class="tab--bg-i" :src="item.paymentIconUrl" />
        </div>
      </div>
      <div class="spacer"></div>
    </div>
    <div class="d-flex m-t-20" v-if="activities.length > 0">
      <van-checkbox
        v-model="agree"
        shape="square"
        checked-color="#4173f8"
        icon-size="16px"
        style="
          border: 2px solid #313133;
          margin-right: 10px;
          border-radius: 5px;
        "
      ></van-checkbox>
      <p
        class="f-t-15"
        :style="{ color: agree ? '#4173f8' : 'var(--wihte-color)' }"
      >
        First deposit,O valor mínimo para presente é R$37
      </p>
    </div>
    <div class="content-c2">
      <div
        class="content-c2--c"
        v-for="(item, index3) in dataList"
        :key="index3"
        @click="selectAmount(index3, item)"
        :class="{ active: index3 === selectAmountIndex || item.isActive }"
      >
        <p
          v-if="index3 === selectAmountIndex || item.isActive"
          class="content-gg"
        >
          <van-icon name="success" color="var(--black-color)" />
        </p>
        <p v-if="activities.length < 1 || agree" class="content-c2--bge">
          +{{ $formatNumberWithCommas(item.bonus) }}
        </p>
        <p class="f-w" style="margin-top: 18px">
          {{ getCurrency }} {{ $formatNumberWithCommas(item.amount) }}
        </p>
      </div>
    </div>
    <van-field
      v-model="amount"
      placeholder="Valor da recarga"
      class="custom-field"
      type="number"
      :style="{ borderColor: focus ? 'var(--wihte-color)' : '#494949' }"
      @input="handleInput"
      @focus="focus = true"
      @blur="focus = false"
    >
      <template #right-icon>
        <span style="color: var(--wihte-color); font-weight: bold">R$</span>
      </template>
    </van-field>
    <p class="text-erreo--l">Mínimo R$ 10,00, Máximo R$ 50.000,00</p>

    <van-button
      @click="submit"
      size="large"
      class="custom-button m-t-20"
      :class="{ 'active-b': isLoading }"
      :disabled="isLoading"
    >
      Recarregar
    </van-button>
    <div class="content-c--info">
      <p class="f-t-16 f-w m-b-5">Caro Usuário</p>
      <div class="font-color">
        1. Primeiro depósito >{{ getCurrency }}100, receba até 100% de bônus
        <p class="m-t-10">
          2. A partir do segundo depósito, receba até 10% de bônus
        </p>
        <p class="m-t-10">
          3. Os valores serão depositados automaticamente na carteira
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { Pay, GetIsFbReport } from "@/api/common";

export default {
  name: "RechargeTabOne",
  components: {},
  props: {
    paymentList: {
      type: Array,
      default: () => [],
    },
    activities: {
      type: Array,
      default: () => [],
    },
    firstRecharge: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
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
    };
  },
  created() {},
  mounted() {},
  watch: {
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
  methods: {
    async GetIsFbReport(v) {
      const data = await GetIsFbReport({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.isReport) {
          if (data.content.target === "ks") {
            // window.kwaiq.load('279370163383324')
            // window.kwaiq.instance('279479691584322').track('addToCart')
            window.kwaiq.load(data.content.fbPixId);
            window.kwaiq.instance(data.content.fbPixId).track("addToCart", {
              amount: v * 0.1,
              currency: "NGN",
            });
            // window.kwaiq.load(data.content.fbPixId)
            // window.kwaiq.track('addToCart')
            // window.kwaiq.track('addToCart', {
            //   amount: v * 0.1,
            //   currency: 'BRL'
            // })
            console.log("add_to_cart");
          } else {
            this.$pixel.setFbId(data.content.fbPixId);
            this.$pixel.callTrackHasPara("track", "Lead", v * 0.1, "NGN"); // 上报
            const jsonData = `"""{"data":[{"event_name": "Lead","content_name": "Recharge Form","value": ${
              v * 0.1
            },"currency": "NGN"}]}"""`;
            this.$pixel.sendEventToAndroid(jsonData);
          }
        }
      }
    },
    async submit() {
      if (this.amount < 10) {
        this.$toast({
          message: "Intervalo de valor de recarga incorreto.",
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
.content-c {
  padding-bottom: 17%;
}
.content-c1 {
  margin-top: 22px;
  border-radius: 12px;
  padding: 10px;
  background-image: url("../../assets/img/wallet/pay_item_bg.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 100%;
  height: 122px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px;
}
.content-c1 > div:last-child {
  margin-right: 30%; /* 或者padding-right */
}

.tab--bg {
  background: @primary-color2;
  border-radius: 8px;
  padding: 0 10px;
  .tab--bg-i {
    width: 65px;
  }
}

.van-checkbox {
  margin-right: 5px !important;
  margin-left: 8px;
}
.content-c2 {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-flow: wrap row;
  .content-c2--c {
    position: relative;
    text-align: center;
    margin-bottom: 9px;
    width: 110px;
    height: 48px;
    background: @cont-bg;
    color: @wihte-color;
    border-radius: 15px;
    box-shadow: 0 2px 1px #575757; /* 阴影效果 */
    .content-c2--bge {
      position: absolute;
      background: linear-gradient(to right, #ff5d16, #ff9253);
      border-radius: 7px;
      right: 0;
      padding: 1px 8px;
      border-radius: 0 10px 0 10px;
      color: @wihte-color !important;
      font-size: 11px;
    }
  }
}
.custom-field {
  margin-top: 5px;
  padding: 12px 15px;
  font-size: 15px;
  background: @background-color;
}

:deep(.van-field__value) {
  caret-color: #a665d8; /* 输入框光标颜色 */
}
:deep(.van-field__control::-webkit-input-placeholder) {
  color: #727895; /* 设置为你需要的颜色 */
  font-weight: bold;
}
.active {
  color: @info-color !important;
  border: 2px solid @info-color;
}
.text-erreo--l {
  color: red;
  margin: 3% 0 0 5%;
}

.content-c--info {
  margin-top: 15px;
  padding: 15px 15px;
  border-radius: 21px;
  line-height: 22px;
  background: @cont-bg;
}
.content-gg {
  position: absolute;
  right: 0;
  bottom: 0;
  border-radius: 10px 0px 10px 0px;
  background: @info-color;
  padding: 1px 8px 0;
}
.active-b {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #9b9b9b !important;
  // border-bottom: 0px solid #494949 !important;
}
</style>
