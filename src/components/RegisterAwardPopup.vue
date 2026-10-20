<template>
  <van-popup
    :show="visible"
    class="ra-popup"
    :z-index="4000"
    :close-on-click-overlay="false"
    :overlay-style="{ background: 'rgba(0,0,0,0.72)' }"
    @update:show="onPopupShow"
  >
    <div class="ra-popup__sheet">
      <button type="button" class="ra-popup__close" @click="dismiss">
        <svg viewBox="0 0 18 18" width="22" height="22" aria-hidden="true">
          <path
            d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
            fill="none"
            stroke="#fff"
            stroke-width="2.4"
            stroke-linecap="round"
          />
        </svg>
      </button>

      <div class="ra-popup__frame">
        <img
          class="ra-popup__bg"
          src="@/assets/img/home/registerAward/welcome_frame.png"
          alt=""
        />
        <div class="ra-popup__body">
          <div class="ra-popup__copy">
            <p class="ra-popup__host">{{ host }}</p>
            <p class="ra-popup__sub">
              A Licensed International Gaming Platform.
            </p>
            <img
              class="ra-popup__divider"
              src="@/assets/img/home/registerAward/welcome_divider.png"
              alt=""
            />
            <div class="ra-popup__row">
              <img
                src="@/assets/img/home/registerAward/signup_coin.png"
                alt=""
              />
              <p>
                New Users Receive A
                <em>{{ amountText }}</em>
                Sign-Up Bonus.
              </p>
            </div>
            <div class="ra-popup__row">
              <img
                src="@/assets/img/home/registerAward/signup_vip.png"
                alt=""
              />
              <p>Make Any Deposit To Upgrade To VIP And Unlock Withdrawals.</p>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="ra-popup__claim btn-3d-green"
          :disabled="claiming || receiveStatus !== 1"
          @click="claim"
        >
          {{ claiming ? "loading..." : "Claim " + amountText }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<script>
import {
  ActivitygetRegisterAward,
  ActivityreceiveRegisterAward,
} from "@/api/common";
import { emitHeaderRefresh } from "@/utils/headerRefresh";
import { flyCoins } from "@/utils/flyCoins";

export default {
  name: "RegisterAwardPopup",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "settled", "closed"],
  data() {
    return {
      visible: this.modelValue,
      receiveStatus: 0,
      awardAmount: 0,
      claiming: false,
      host: "",
    };
  },
  watch: {
    modelValue(val) {
      this.visible = val;
    },
  },
  computed: {
    amountText() {
      const n = this.$formatNumberWithCommas
        ? this.$formatNumberWithCommas(this.awardAmount)
        : this.awardAmount;
      const c = this.getCurrency || "";
      return c ? `${c} ${n}` : String(n);
    },
  },
  mounted() {
    this.host = window.location.host || "";
  },
  methods: {
    onPopupShow(val) {
      this.visible = val;
      this.$emit("update:modelValue", val);
    },
    dismiss() {
      this.onPopupShow(false);
      this.$emit("closed");
    },
    async fetchAward() {
      if (!localStorage.getItem("token")) {
        this.$emit("settled", false);
        return;
      }
      try {
        const data = await ActivitygetRegisterAward({});
        if (!data || data.status !== "ok" || !data.content) {
          this.$emit("settled", false);
          return;
        }
        this.receiveStatus = Number(data.content.receiveStatus) || 0;
        this.awardAmount = Number(data.content.awardAmount) || 0;
        this.$emit("settled", this.receiveStatus === 1 && this.awardAmount > 0);
      } catch (e) {
        this.$emit("settled", false);
      }
    },
    async claim(e) {
      if (this.claiming || this.receiveStatus !== 1) return;
      this.claiming = true;
      try {
        const data = await ActivityreceiveRegisterAward({});
        const content = data && data.content;
        const status = content ? Number(content.receiveStatus) : 0;
        if (data && data.status === "ok" && status === 2) {
          this.receiveStatus = 2;
          this.awardAmount = Number(content.awardAmount) || this.awardAmount;
          this.onPopupShow(false);
          emitHeaderRefresh({ immediate: true });
          await flyCoins(e);
          this.$emit("closed");
          this.$toast({
            message: this.$lang.bonus_txt16 || "Success",
            icon: "success",
          });
        } else if (data && data.status === "ok" && status === 0) {
          this.onPopupShow(false);
          this.$emit("closed");
        } else {
          this.$toast({
            message: (data && data.msg) || "Failed",
            icon: "cross",
          });
        }
      } catch (e) {
        this.$toast({ message: "Failed", icon: "cross" });
      } finally {
        this.claiming = false;
      }
    },
  },
};
</script>

<style lang="less">
.ra-popup.van-popup {
  background: transparent !important;
  overflow: visible;
}
</style>

<style lang="less" scoped>
.ra-popup__sheet {
  position: relative;
  padding-top: 34px;
}

.ra-popup__close {
  position: absolute;
  top: 0;
  right: 2px;
  z-index: 3;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.ra-popup__frame {
  position: relative;
  width: 100%;
}

.ra-popup__bg {
  display: block;
  width: 100%;
  height: auto;
}

.ra-popup__body {
  position: absolute;
  left: 11%;
  right: 11%;
  top: 48%;
  bottom: 14%;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  text-align: center;
  box-sizing: border-box;
}

.ra-popup__copy {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 6px;
  min-height: 0;
}

.ra-popup__host {
  font-size: 20px;
  font-weight: 800;
  line-height: 1.1;
  word-break: break-all;
}

.ra-popup__sub {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.3;
  opacity: 0.92;
}

.ra-popup__divider {
  display: block;
  width: 100%;
  height: auto;
  margin: 0 4px -5px;
  flex-shrink: 0;
}

.ra-popup__row {
  width: 85%;
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  padding: 5px;
  border-radius: 12px;
  border: 1px solid transparent;
  background:
    linear-gradient(#15053a, #15053a) padding-box,
    linear-gradient(90deg, #6e3e9a 0%, #ecc6d9 38%, #ecc6d9 62%, #6e3e9a 100%)
      border-box;
  text-align: left;
  box-sizing: border-box;

  img {
    width: 36px;
    height: 36px;
    object-fit: contain;
    flex-shrink: 0;
  }

  p {
    margin: 0;
    font-size: 11px;
    font-weight: 700;
    line-height: 1.3;
    color: #fff;
  }

  em {
    font-style: normal;
    color: #ffd467;
  }
}

.ra-popup__claim {
  position: absolute;
  left: 16%;
  right: 16%;
  bottom: -2.2%;
  width: auto;
  height: 42px;
  font-size: 16px;
}
</style>
