<template>
  <div class="pay-order">
    <title-bar :title="$lang.Depósito"></title-bar>

    <div class="pay-order__body">
      <div class="depo_cont">
        <img
          class="depo_cont__bg"
          src="../../../assets/img/recharge/qb_icon.png"
          alt=""
        />
        <div class="depo_cont__inner">
          <div
            v-if="orderStatus == '0' && countdown > 0"
            class="status-pill status-pill--countdown"
          >
            <p class="status-pill__label">{{ $lang.common_txt248 }}</p>
            <p class="status-pill__time">{{ timeCounmp }}</p>
          </div>

          <div
            v-if="orderStatus == '1'"
            class="status-pill status-pill--success"
          >
            <img src="../../../assets/img/recharge/sucee_sle.png" width="28" />
            <p class="status-pill__text">{{ $lang.common_txt251 }}</p>
          </div>

          <div
            v-if="(orderStatus == '0' && countdown <= 0) || orderStatus == '2'"
            class="status-pill status-pill--wait"
          >
            <img src="../../../assets/img/recharge/wait_sle.png" width="28" />
            <p class="status-pill__text">{{ $lang.common_txt252 }}</p>
          </div>

          <div class="amount-block">
            <div class="amount-block__label">
              <img
                class="amount-block__icon"
                src="../../../assets/img/recharge/amount_icon.png"
                width="22"
                alt=""
              />
              <span>{{ $lang.common_txt86 }}</span>
            </div>
            <p class="amount-block__value">
              {{ $formatNumberWithCommas(infoDetail.paymentAmount) }}
              {{ infoDetail.paymentId }}
            </p>
            <p class="amount-block__type">({{ infoDetail.wlType }})</p>
          </div>

          <div class="addr-card">
            <vue-qr
              :value="infoDetail.url"
              :size="108"
              class="addr-card__qr"
              :margin="2"
            ></vue-qr>
            <div class="addr-card__right">
              <p class="addr-card__title">{{ $lang.common_txt249 }}</p>
              <p class="addr-card__url">{{ infoDetail.url }}</p>
              <button type="button" class="addr-card__copy" @click="copyText">
                <img
                  class="addr-card__copy-icon"
                  src="../../../assets/img/recharge/copy_i.png"
                  width="15"
                  alt=""
                />
                <span>{{ $lang.common_txt250 }}</span>
              </button>
            </div>
          </div>

          <div class="tips">
            <p>{{ $lang.common_txt253 }}</p>
            <p>{{ $lang.common_txt254 }}</p>
            <p>{{ $lang.common_txt255 }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import VueQr from "qrcode.vue";
import { UpayStatusorderNo } from "@/api/common";
export default {
  name: "payOrder",
  components: { VueQr },
  data() {
    return {
      infoDetail: JSON.parse(sessionStorage.getItem("payOrderData")),
      timeCounmp: "29:59", // 初始倒计时
      orderStatus: "0", // 默认未支付状态
      countdown: 30 * 60, // 30分钟倒计时（秒）
      timer: null, // 倒计时定时器
      apiTimer: null, // 接口调用定时器
      startTime: null, // 页面首次加载时间（用于计算是否已过1分钟）
      isApiPollingStarted: false, // 标记接口轮询是否已启动
    };
  },
  mounted() {
    // 初始化页面启动时间（优先从缓存读取，支持刷新后恢复）
    this.initStartTime();

    // 初始化倒计时
    this.initCountdown();

    // 检查是否需要启动接口轮询（支持刷新后恢复）
    this.checkAndStartApiPolling();
  },
  beforeRouteLeave(to, from, next) {
    // 路由离开时（退出当前页面），强制停止所有定时器和清理缓存
    this.forceStopAllTimersAndCache();
    next();
  },
  beforeUnmount() {
    // 组件销毁时，强制停止所有定时器和清理缓存（双重保障）
    this.forceStopAllTimersAndCache();
  },
  methods: {
    onClickLeft() {
      this.$jumpTo("/rechargeCont", {}, { replace: true });
    },
    copyText() {
      const textarea = document.createElement("textarea");
      textarea.value = this.infoDetail.url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
    // 初始化页面启动时间
    initStartTime() {
      const cacheKey = `startTime_${this.infoDetail.orderNo}`;
      const cachedStartTime = sessionStorage.getItem(cacheKey);

      if (cachedStartTime) {
        // 从缓存恢复启动时间
        this.startTime = parseInt(cachedStartTime);
      } else {
        // 首次加载，记录当前时间戳
        this.startTime = Date.now();
        sessionStorage.setItem(cacheKey, this.startTime);
      }
    },
    // 初始化30分钟倒计时
    initCountdown() {
      const cacheKey = `countdown_${this.infoDetail.orderNo}`;
      const remainingTime = sessionStorage.getItem(cacheKey);

      if (remainingTime) {
        // 从缓存中读取剩余时间（支持刷新后恢复）
        this.countdown = parseInt(remainingTime);
      } else {
        this.countdown = 30 * 60; // 30分钟
      }

      // 更新倒计时显示
      this.updateCountdownDisplay();

      // 启动倒计时定时器
      this.timer = setInterval(() => {
        if (this.countdown > 0) {
          this.countdown--;
          // 缓存剩余时间
          sessionStorage.setItem(cacheKey, this.countdown);
          this.updateCountdownDisplay();

          // 倒计时过程中检查是否需要启动接口轮询
          this.checkAndStartApiPolling();
        } else {
          // 倒计时结束，强制停止所有定时器和缓存
          this.forceStopAllTimersAndCache();
        }
      }, 1000);
    },
    // 更新倒计时显示格式（mm:ss）
    updateCountdownDisplay() {
      const minutes = Math.floor(this.countdown / 60);
      const seconds = this.countdown % 60;
      this.timeCounmp = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
    },
    // 检查是否需要启动接口轮询
    checkAndStartApiPolling() {
      // 已经启动过轮询、支付成功、倒计时结束，不需要再启动
      if (
        this.isApiPollingStarted ||
        this.orderStatus === "1" ||
        this.countdown <= 0
      ) {
        return;
      }

      // 计算已经过了多少时间（毫秒）
      const elapsedTime = Date.now() - this.startTime;
      const oneMinute = 60 * 1000; // 1分钟

      if (elapsedTime >= oneMinute) {
        // 已经过了1分钟，立即启动接口轮询
        this.startApiPolling();
      } else {
        // 还没到1分钟，设置定时器，到时间后启动
        setTimeout(() => {
          this.startApiPolling();
        }, oneMinute - elapsedTime);
      }
    },
    // 开始接口轮询（刷新后也能保持3秒一次）
    startApiPolling() {
      if (this.isApiPollingStarted) return;

      this.isApiPollingStarted = true;
      console.log("开始接口轮询，每3秒一次");

      // 先立即调用一次
      this.fetchOrderStatus();

      // 之后每3秒调用一次（刷新后会重新创建定时器，保持轮询）
      this.apiTimer = setInterval(() => {
        this.fetchOrderStatus();
      }, 3000);
    },
    // 调用订单状态接口
    async fetchOrderStatus() {
      try {
        const data = await UpayStatusorderNo({
          orderNo: this.infoDetail.orderNo,
        });
        if (data.status === "ok") {
          this.orderStatus = data.content.orderStatus;
          console.log("订单状态更新：", data.content.orderStatus);

          // 订单支付成功或倒计时结束，停止接口调用
          if (this.orderStatus === "1" || this.countdown <= 0) {
            this.forceStopAllTimersAndCache();
          }
        }
      } catch (error) {
        console.error("获取订单状态失败：", error);
        // 接口调用失败不停止轮询，继续尝试
      }
    },
    // 强制停止所有定时器和清理缓存（退出页面时使用）
    forceStopAllTimersAndCache() {
      console.log("退出页面，停止所有定时器和清理缓存");
      // 清除倒计时定时器
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }

      // 清除接口轮询定时器
      if (this.apiTimer) {
        clearInterval(this.apiTimer);
        this.apiTimer = null;
      }

      // 标记轮询已停止
      this.isApiPollingStarted = false;

      // 清除所有相关缓存
      const orderNo = this.infoDetail?.orderNo;
      if (orderNo) {
        sessionStorage.removeItem(`countdown_${orderNo}`);
        sessionStorage.removeItem(`startTime_${orderNo}`);
        sessionStorage.removeItem(`isApiPollingStarted_${orderNo}`);
        sessionStorage.removeItem(`orderStatus_${orderNo}`);
      }
    },
  },
  created() {
    // 页面创建时从缓存恢复关键状态（支持刷新后恢复）
    const orderNo = this.infoDetail?.orderNo;
    if (orderNo) {
      const cachedIsPolling = sessionStorage.getItem(
        `isApiPollingStarted_${orderNo}`,
      );
      const cachedStatus = sessionStorage.getItem(`orderStatus_${orderNo}`);

      if (cachedIsPolling !== null) {
        this.isApiPollingStarted = cachedIsPolling === "true";
      }

      if (cachedStatus) {
        this.orderStatus = cachedStatus;
      }
    }
  },
};
</script>
<style lang="less" scoped>
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@gold-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@card-bg: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);

.pay-order {
  min-height: 100%;
}

.pay-order__body {
  padding: 16px 14px 28px;
}

.depo_cont {
  background: @card-bg;
  border: 1px solid fade(@gold-deep, 40%);
  padding: 22px 18px 24px;
  position: relative;
  min-height: 360px;
  border-radius: 24px;
  z-index: 1;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);

  &__bg {
    position: absolute;
    right: -8px;
    bottom: -4px;
    width: 148px;
    z-index: 0;
    pointer-events: none;
    opacity: 0.22;
    /* 蓝灰线稿 → 金色水印 */
    filter: brightness(0) saturate(100%) invert(72%) sepia(58%) saturate(650%)
      hue-rotate(359deg) brightness(1.05);
  }

  &__inner {
    position: relative;
    z-index: 1;
  }
}

.status-pill {
  width: 78%;
  max-width: 280px;
  margin: 0 auto;
  border-radius: 32px;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &--countdown {
    background: @gold-grad;
    color: #573900;
    padding: 10px 12px 12px;
  }

  &--success,
  &--wait {
    flex-direction: row;
    gap: 8px;
    padding: 12px 14px;
    color: #fff;
  }

  &--success {
    background: #23b975;
  }

  &--wait {
    background: #6e6e6e;
  }

  &__label {
    margin: 0;
    font-weight: 800;
    font-size: 13px;
  }

  &__time {
    margin: 4px 0 0;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: 0.5px;
  }

  &__text {
    margin: 0;
    font-weight: 800;
    font-size: 14px;
  }
}

.amount-block {
  margin-top: 28px;
  text-align: center;

  &__label {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    color: @gold-soft;
    font-size: 14px;
    font-weight: 600;
  }

  &__icon {
    display: block;
    /* 浅蓝钱包 → 金色 */
    filter: brightness(0) saturate(100%) invert(72%) sepia(58%) saturate(650%)
      hue-rotate(359deg) brightness(1.08);
  }

  &__value {
    margin: 12px 0 0;
    color: #fff;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: 0.3px;
  }

  &__type {
    margin: 6px 0 0;
    color: fade(@gold-soft, 75%);
    font-size: 13px;
  }
}

.addr-card {
  display: flex;
  align-items: stretch;
  gap: 14px;
  margin-top: 26px;
  padding: 16px;
  background: #2a2418;
  border: 1px solid fade(@gold-deep, 40%);
  border-radius: 16px;
  color: @gold-soft;

  &__qr {
    flex-shrink: 0;
    width: 108px;
    height: 108px;
    border-radius: 10px;
    overflow: hidden;
    background: #fff;
    padding: 4px;
    box-sizing: border-box;
  }

  &__right {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 8px;
  }

  &__title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: @gold-soft;
  }

  &__url {
    margin: 0;
    background: #15110a;
    border: 1px solid fade(@gold-deep, 35%);
    border-radius: 8px;
    padding: 8px 10px;
    color: @gold-soft;
    font-size: 11px;
    line-height: 1.4;
    word-break: break-all;
    max-height: 52px;
    overflow: hidden;
  }

  &__copy {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: 100%;
    border: none;
    cursor: pointer;
    background: @gold-grad;
    padding: 9px 10px;
    border-radius: 10px;
    color: #573900;
    font-size: 13px;
    font-weight: 700;
    box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  }

  &__copy-icon {
    display: block;
    filter: brightness(0) saturate(100%) invert(22%) sepia(55%) saturate(900%)
      hue-rotate(8deg);
  }
}

.tips {
  margin-top: 24px;
  color: fade(#fff, 88%);
  font-size: 13px;
  font-weight: 500;
  line-height: 1.55;

  p {
    margin: 0 0 12px;
    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media (min-width: 769px) {
  .pay-order__body {
    max-width: 480px;
    margin: 0 auto;
  }
}
</style>
