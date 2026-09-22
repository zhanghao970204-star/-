<template>
  <van-popup
    :show="modelValue"
    position="bottom"
    round
    :close-on-click-overlay="!paying"
    :z-index="3200"
    class="gift-pay-sheet"
    @update:show="onUpdateShow"
  >
    <div class="gps">
      <div class="gps__head">
        <h3 class="gps__title">
          {{ $lang.gift_pay_title || $lang.common_txt363 || "Payment" }}
        </h3>
        <button class="gps__close" type="button" :disabled="paying" @click="close">
          <van-icon name="cross" size="18" color="#a89b7c" />
        </button>
      </div>

      <div v-if="loading" class="gps__state">
        {{ $lang.common_loading || "Loading..." }}
      </div>
      <div v-else-if="!paymentList.length" class="gps__state">
        {{ emptyText }}
      </div>
      <template v-else>
        <div v-if="payTypeList.length > 1" class="gps__block">
          <p class="gps__label">
            {{ $lang.gift_pay_method || "Payment Method" }}
          </p>
          <div class="gps__types">
            <div
              v-for="(item, index) in payTypeList"
              :key="item.paymentId || index"
              class="gps__type"
              :class="{ 'is-active': selectPayTypeIndex === index }"
              @click="selectPayType(index)"
            >
              <img
                class="gps__type-icon"
                :src="item.typeIcon || item.paymentIcon || item.paymentIconUrl"
                alt=""
              />
              <p class="gps__type-name">{{ item.typeName || item.paymentName }}</p>
            </div>
          </div>
        </div>

        <div class="gps__block">
          <p class="gps__label">
            {{ $lang.gift_pay_channel || "Payment Channel" }}
          </p>
          <div class="gps__channels">
            <div
              v-for="(item, index) in paymentList"
              :key="item.paymentKey || index"
              class="gps__channel"
              :class="{ 'is-active': selectIndex === index }"
              @click="selectChannel(index)"
            >
              <img
                class="gps__channel-icon"
                :src="item.paymentIconUrl || item.paymentIcon"
                alt=""
              />
              <span class="gps__channel-name">{{ item.paymentName }}</span>
            </div>
          </div>
        </div>

        <div v-if="isUsdtSelected" class="gps__block">
          <p class="gps__label">
            {{ $lang.gift_pay_network || "Network" }}
          </p>
          <div class="gps__networks">
            <div
              v-for="(name, index) in usdtNetworks"
              :key="name"
              class="gps__network"
              :class="{ 'is-active': selectWl === index }"
              @click="selectWl = index"
            >
              {{ name }}
            </div>
          </div>
        </div>

        <div class="gps__amount">
          <span>{{ $lang.gift_pay_amount || "Amount" }}</span>
          <strong
            >{{ isUsdtSelected ? "U" : currency }}
            {{ $formatNumberWithCommas ? $formatNumberWithCommas(amount) : amount }}</strong
          >
        </div>

        <button
          class="gps__confirm"
          type="button"
          :disabled="paying || !currentPayment"
          @click="confirmPay"
        >
          {{
            paying
              ? $lang.common_loading || "Loading..."
              : $lang.Confirmar || $lang.reward_confirm || "Confirm"
          }}
        </button>
      </template>
    </div>
  </van-popup>
</template>

<script>
import { VnRechargeInitS, Pay } from "@/api/common";
import {
  isUsPayRedirect,
  openUsPayBlankWindow,
  goPayUrl,
  closePayWindow,
} from "@/utils/payRedirect";

export default {
  name: "GiftPaySheet",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    amount: {
      type: [Number, String],
      default: 0,
    },
    promoType: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "success", "fail"],
  data() {
    return {
      loading: false,
      paying: false,
      allPaymentList: [],
      payTypeList: [],
      paymentList: [],
      selectPayTypeIndex: 0,
      selectIndex: 0,
      account: "",
      loadError: "",
    };
  },
  computed: {
    currency() {
      return localStorage.getItem("currency") || this.getCurrency || "";
    },
    currentPayment() {
      return this.paymentList[this.selectIndex] || null;
    },
    emptyText() {
      return (
        this.loadError ||
        this.$lang.gift_pay_empty ||
        "No payment method"
      );
    },
  },
  watch: {
    modelValue(val) {
      if (val) this.loadPayments();
    },
  },
  methods: {
    onUpdateShow(val) {
      if (this.paying && !val) return;
      this.$emit("update:modelValue", val);
    },
    close() {
      if (this.paying) return;
      this.$emit("update:modelValue", false);
    },
    isUsdtItem(item) {
      if (!item) return false;
      const id = String(item.paymentId || "").toUpperCase();
      const key = String(item.paymentKey || "").toLowerCase();
      const name = String(item.typeName || item.paymentName || "").toUpperCase();
      return id === "USDT" || key === "usdt" || name.includes("USDT");
    },
    async loadPayments() {
      this.loading = true;
      this.loadError = "";
      this.allPaymentList = [];
      this.payTypeList = [];
      this.paymentList = [];
      this.selectPayTypeIndex = 0;
      this.selectIndex = 0;
      try {
        const data = await VnRechargeInitS();
        if (data.status !== "ok" || !data.content) {
          this.loadError = data.msg || this.$lang.gift_pay_empty || "No payment method";
          return;
        }
        // 新手礼包 / 首充活动不支持 USDT
        const list = (data.content.paymentList || []).filter(
          (p) => !this.isUsdtItem(p)
        );
        const types = (data.content.payTypeList || []).filter(
          (t) => !this.isUsdtItem(t)
        );
        this.allPaymentList = list;
        this.payTypeList = types;
        this.account = data.content._account || "";
        this.applyPayTypeFilter();
        if (!this.paymentList.length) {
          this.loadError =
            data.msg || this.$lang.gift_pay_empty || "No payment method";
        }
      } catch (e) {
        console.error("GiftPaySheet loadPayments error", e);
        this.loadError = this.$lang.network_error || "Network error";
      } finally {
        this.loading = false;
      }
    },
    selectPayType(i) {
      if (this.selectPayTypeIndex === i) return;
      this.selectPayTypeIndex = i;
      this.applyPayTypeFilter();
    },
    applyPayTypeFilter() {
      const type = this.payTypeList[this.selectPayTypeIndex];
      if (!type || !this.payTypeList.length) {
        this.paymentList = this.allPaymentList.slice();
      } else {
        this.paymentList = this.allPaymentList.filter(
          (p) => String(p.paymentId) === String(type.paymentId)
        );
      }
      this.selectIndex = 0;
    },
    selectChannel(i) {
      this.selectIndex = i;
    },
    async confirmPay() {
      const pay = this.currentPayment;
      if (this.paying || !pay || !this.amount) return;
      this.paying = true;
      const isUsRedirect = isUsPayRedirect();
      const payWin = isUsRedirect ? openUsPayBlankWindow() : null;
      try {
        const payRes = await Pay({
          paymentAmount: this.amount,
          paymentId: pay.paymentId,
          paymentKey: pay.paymentKey,
          paymentType: pay.paymentType,
          rechargeFees: pay.rechargeFees,
          phone: this.account,
          promoType: this.promoType,
        });
        if (payRes.status === "ok") {
          const payUrl = payRes.content && payRes.content.url;
          this.$emit("update:modelValue", false);
          this.$emit("success", {
            url: payUrl || "",
            payWin,
            isUsRedirect,
            raw: payRes,
          });
        } else {
          closePayWindow(payWin);
          const msg = payRes.msg || "Payment failed";
          this.$toast({ message: msg, icon: "cross" });
          this.$emit("fail", payRes);
        }
      } catch (e) {
        closePayWindow(payWin);
        console.error("GiftPaySheet confirmPay error", e);
        this.$toast({
          message: this.$lang.network_error || "Network error",
          icon: "cross",
        });
        this.$emit("fail", e);
      } finally {
        this.paying = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@cell: #2a2418;
@muted: #a89b7c;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;

.gift-pay-sheet {
  background: #1f1c17 !important;
  max-height: 78vh;
}

.gps {
  padding: 16px 16px calc(16px + env(safe-area-inset-bottom, 0px));
  color: #fff;
}

.gps__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.gps__title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: @gold-soft;
}

.gps__close {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.gps__state {
  padding: 36px 12px;
  text-align: center;
  color: @muted;
  font-size: 14px;
}

.gps__block {
  margin-bottom: 14px;
}

.gps__label {
  margin: 0 0 8px;
  font-size: 13px;
  color: @muted;
}

.gps__types {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    display: none;
  }
}

.gps__type {
  flex: 0 0 auto;
  min-width: 72px;
  height: 72px;
  box-sizing: border-box;
  padding: 6px 8px;
  border-radius: 8px;
  border: 1px solid fade(@gold-deep, 22%);
  background: linear-gradient(180deg, #332c22 0%, #2a2418 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.is-active {
    border: 1.5px solid #d4b275;
    box-shadow:
      0 0 6px rgba(212, 178, 117, 0.45),
      inset 0 1px 0 rgba(255, 228, 181, 0.12);
  }
}

.gps__type-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  margin-bottom: 4px;
}

.gps__type-name {
  margin: 0;
  font-size: 11px;
  color: @gold-soft;
  max-width: 64px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gps__channels {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 240px;
  overflow-y: auto;
}

.gps__channel {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid fade(@gold-deep, 22%);
  background: @cell;
  cursor: pointer;

  &.is-active {
    border-color: @gold;
    box-shadow: 0 0 0 1px fade(@gold, 35%);
  }
}

.gps__channel-icon {
  width: 28px;
  height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}

.gps__channel-name {
  font-size: 14px;
  color: #fff;
}

.gps__amount {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 8px 0 14px;
  padding: 10px 12px;
  border-radius: 8px;
  background: fade(@cell, 80%);
  color: @muted;
  font-size: 13px;

  strong {
    color: @gold;
    font-size: 16px;
    font-weight: 700;
  }
}

.gps__confirm {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 23px;
  background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
  color: #1a1408;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
}
</style>
