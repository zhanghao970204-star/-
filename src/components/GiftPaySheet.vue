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
    <div class="gps__head">
      {{ $lang.gift_pay_title || $lang.common_txt363 || "Select Payment" }}
      <button
        class="gps__close"
        type="button"
        :disabled="paying"
        @click="close"
      >
        <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
          <path
            d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
            fill="none"
            stroke="#fff"
            stroke-width="2.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="gps__body">
      <div v-if="loading" class="gps__state">
        {{ $lang.common_loading || "Loading..." }}
      </div>
      <div v-else-if="!paymentList.length" class="gps__state">
        {{ emptyText }}
      </div>
      <template v-else>
        <template v-if="payTypeList.length > 1">
          <p class="gps__label">
            {{ $lang.gift_pay_method || $lang.rc_select_channel || "Select Channel" }}
          </p>
          <div class="gps__grid">
            <div
              v-for="(item, index) in payTypeList"
              :key="item.paymentId || index"
              class="gps__chip"
              :class="{ 'is-active': selectPayTypeIndex === index }"
              @click="selectPayType(index)"
            >
              <img
                class="gps__chip-bg"
                :src="selectPayTypeIndex === index ? imgChipOn : imgChipOff"
                alt=""
              />
              <img
                class="gps__chip-icon"
                :src="item.typeIcon || item.paymentIcon || item.paymentIconUrl"
                alt=""
              />
              <img
                class="gps__chip-line"
                :src="
                  selectPayTypeIndex === index ? imgChipLineOn : imgChipLineOff
                "
                alt=""
              />
              <span>{{ item.typeName || item.paymentName }}</span>
            </div>
          </div>
        </template>

        <p class="gps__label">
          {{
            $lang.gift_pay_channel ||
            $lang.rc_select_method ||
            "Select Payment Method"
          }}
        </p>
        <div class="gps__grid">
          <div
            v-for="(item, index) in paymentList"
            :key="item.paymentKey || index"
            class="gps__chip"
            :class="{ 'is-active': selectIndex === index }"
            @click="selectChannel(index)"
          >
            <img
              class="gps__chip-bg"
              :src="selectIndex === index ? imgChipOn : imgChipOff"
              alt=""
            />
            <img
              class="gps__chip-icon"
              :src="item.paymentIconUrl || item.paymentIcon"
              alt=""
            />
            <img
              class="gps__chip-line"
              :src="selectIndex === index ? imgChipLineOn : imgChipLineOff"
              alt=""
            />
            <span>{{ item.paymentName }}</span>
          </div>
        </div>

        <p class="gps__label">
          {{ $lang.rc_confirm_order || $lang.gift_pay_amount || "Confirm Order" }}
        </p>
        <div class="gps__order">
          <div class="gps__row">
            <span>{{ $lang.gift_pay_amount || "Amount" }}</span>
            <em
              >{{ currency }}
              {{
                $formatNumberWithCommas
                  ? $formatNumberWithCommas(amount)
                  : amount
              }}</em
            >
          </div>
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
              : $lang.rc_confirm_pay ||
                $lang.Confirmar ||
                $lang.reward_confirm ||
                "Confirm"
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
  closePayWindow,
} from "@/utils/payRedirect";

function rcAsset(name) {
  return new URL(`../assets/img/recharge/${name}`, import.meta.url).href;
}

const IMG_CHIP_ON = rcAsset("Rectangle 480.png");
const IMG_CHIP_OFF = rcAsset("Rectangle 34626424.png");
const IMG_CHIP_LINE_ON = rcAsset("Rectangle 133.png");
const IMG_CHIP_LINE_OFF = rcAsset("Rectangle 34626426.png");

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
      imgChipOn: IMG_CHIP_ON,
      imgChipOff: IMG_CHIP_OFF,
      imgChipLineOn: IMG_CHIP_LINE_ON,
      imgChipLineOff: IMG_CHIP_LINE_OFF,
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
      return this.loadError || this.$lang.gift_pay_empty || "No payment method";
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
      const name = String(
        item.typeName || item.paymentName || "",
      ).toUpperCase();
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
          this.loadError =
            data.msg || this.$lang.gift_pay_empty || "No payment method";
          return;
        }
        // 新手礼包 / 首充活动不支持 USDT
        const list = (data.content.paymentList || []).filter(
          (p) => !this.isUsdtItem(p),
        );
        const types = (data.content.payTypeList || []).filter(
          (t) => !this.isUsdtItem(t),
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
          (p) => String(p.paymentId) === String(type.paymentId),
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
@gold: #ffa300;
@panel-head: #430063;

.gift-pay-sheet {
  width: 100% !important;
  max-width: none;
  max-height: 78vh;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  overflow: hidden;
  border-radius: 18px 18px 0 0 !important;
}

.gps__head {
  position: relative;
  background: @panel-head;
  color: #fff;
  text-align: center;
  font-size: 16px;
  font-weight: 800;
  padding: 14px 40px;
}

.gps__close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.gps__body {
  padding: 14px 14px calc(18px + env(safe-area-inset-bottom, 0px));
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  max-height: calc(78vh - 48px);
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.gps__state {
  padding: 36px 12px;
  text-align: center;
  color: fade(#fff, 70%);
  font-size: 14px;
}

.gps__label {
  margin: 10px 0 8px;
  color: #fff;
  font-size: 14px;
  font-weight: 800;
}

.gps__grid {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.gps__chip {
  position: relative;
  width: calc(33.33% - 7px);
  min-height: 78px;
  border-radius: 14px;
  background: transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 10px 6px 8px;
  box-sizing: border-box;
  cursor: pointer;
  color: #333;
  font-size: 11px;
  font-weight: 700;
  overflow: hidden;

  &.is-active {
    color: #fff;
  }
}

.gps__chip-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: fill;
  z-index: 0;
  pointer-events: none;
}

.gps__chip-icon {
  position: relative;
  z-index: 1;
  width: 28px;
  height: 22px;
  object-fit: contain;
}

.gps__chip-line {
  position: relative;
  z-index: 1;
  width: 70%;
  height: 1px;
  object-fit: fill;
}

.gps__chip span {
  position: relative;
  z-index: 1;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gps__order {
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #2c1137;
  border: 1px solid #9346a9;
}

.gps__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 0;
  color: #fff;
  font-size: 13px;

  em {
    font-style: normal;
    color: @gold;
    font-weight: 800;
  }
}

.gps__confirm {
  .btn-3d-green();
  margin-top: 16px;
  font-size: 16px;
}
</style>
