<template>
  <div class="content-c">
    <title-bar :title="$lang.orderDetail_title"></title-bar>
    <div>
      <div
        v-if="isFinalStatus"
        class="sqa-top"
        :class="{ 'b-active': isSuccess }"
      >
        <van-icon :name="isSuccess ? 'success' : 'cross'" size="45" />
      </div>
      <div v-else class="t-c" style="margin-top: 12px">
        <img src="../../../assets/img/home/wait.png" width="60" />
      </div>
      <div
        v-if="isFinalStatus"
        class="sqa-sta t-c m-t-10"
        :class="{ 'c-active': isSuccess }"
      >
        {{ displayStatusName }}
      </div>
      <div v-else class="t-c m-t-10" style="color: #e8c03c">
        {{ info.orderStatusName }}
      </div>
      <div class="f-w f-t-25 t-c m-t-10">
        {{ getCurrency }}
        {{ $formatNumberWithCommas(info.orderAmount) }}
      </div>
      <p class="p-line"></p>
      <div class="f-t-14" style="padding: 0 10px">
        <div class="d-flex-s m-b-20">
          <p class="font-color">
            {{ $lang.orderDetail_txt }}
          </p>
          <p style="font-weight: normal">{{ info.orderTypeName }}</p>
        </div>
        <!-- <div class="d-flex-s m-b-20">
          <p class="font-color">
            {{ $lang.orderDetail_txt2 }}
          </p>
          <img src="../../../assets/img/common/pix_pay.png" width="45" />
        </div> -->
        <div class="d-flex-s m-b-20">
          <p class="font-color">
            {{ $lang.orderDetail_txt3 }}
          </p>
          <p>{{ info.createDate }}</p>
        </div>
        <div
          class="d-flex-s m-b-20"
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
          "
        >
          <p class="font-color" style="flex: 1">
            {{ $lang.orderDetail_txt4 }}
          </p>

          <div style="display: flex; align-items: center">
            <p style="margin: 0 8px 0 0">
              {{ info.orderNo }}
            </p>
            <img
              @click="copyText"
              width="13px"
              height="15px"
              src="../../../assets/img/drawer/drawer_copy.png"
            />
          </div>
        </div>

        <div v-if="info.bankCard" class="d-flex-s m-b-20">
          <p class="font-color">
            {{ $lang.orderDetail_txt5 }}
          </p>
          <div class="d-flex">
            <div class="m-r-5">
              <p v-if="isSee">
                {{ info.bankCard }}
              </p>
              <p v-else>
                {{ formatCardNumber(info.bankCard) }}
              </p>
            </div>
            <van-icon
              v-if="isSee"
              @click="isSee = false"
              name="eye-o"
              size="18"
              class="f-w"
            />
            <img
              v-else
              @click="isSee = true"
              src="../../../assets/img/common/byj.png"
              width="18"
            />
          </div>
        </div>
        <div class="d-flex-s m-b-20">
          <p class="font-color">{{ $lang.orderDetail_txt6 }}</p>
          <p
            style="
              width: 200px;
              text-align: right;
              word-wrap: break-word;
              white-space: normal;
            "
          >
            {{ info.remark ? info.remark : "-" }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "orderDetail",
  components: {},

  data() {
    return {
      info: {},
      isSee: false,
    };
  },
  computed: {
    isFinalStatus() {
      return [
        "withdraw$success",
        "pay$success",
        "withdraw$failed",
        "pay$failed",
      ].includes(this.info.orderStatus);
    },
    isSuccess() {
      if (this.info.isReversed) return true;
      return ["withdraw$success", "pay$success"].includes(
        this.info.orderStatus,
      );
    },
    displayStatusName() {
      if (this.info.isReversed || this.info.orderStatus === "pay$success") {
        return this.$lang.recharge_success || "Recharge Successful";
      }
      return this.info.orderStatusName;
    },
  },
  mounted() {
    try {
      const raw = sessionStorage.getItem("orderDetailData");
      this.info = raw ? JSON.parse(raw) : {};
    } catch (e) {
      this.info = {};
    }
  },
  methods: {
    // 格式化银行卡号
    formatCardNumber(cardNumber) {
      if (!cardNumber) return ""; // 如果为空，直接返回空字符串
      const length = cardNumber.length;
      if (length <= 4) return cardNumber; // 如果长度小于等于4，直接返回原号码
      const stars = "******"; // 前面用6个*代替
      return stars + cardNumber.slice(-4); // 返回格式化后的字符串
    },
    copyText() {
      const textarea = document.createElement("textarea");
      textarea.value = this.info.orderNo;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.sqa-top {
  background: #e84c3c;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 12px auto 0;
}
.b-active {
  background: @primary-color !important;
}
.sqa-sta {
  color: #e84c3c;
}
.c-active {
  color: @primary-color !important;
}
.p-line {
  background: #2a2418;
  opacity: 0.23;
  height: 2px;
  width: 100%;
  margin: 15px 0 10px;
}
</style>
