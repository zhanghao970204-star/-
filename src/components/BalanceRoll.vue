<template>
  <div
    class="number-scroll"
    :style="{ fontSize: fontSize + 'px', gap: gap + 'px' }"
  >
    <!-- 滚动数字每位都含 0~9，读屏与复制只取这里的真实金额 -->
    <span class="num-sr-only">{{ realText }}</span>
    <span v-if="prefix" aria-hidden="true" class="num-symbol">{{ prefix }}</span>
    <span v-if="showNegative" aria-hidden="true" class="num-symbol">-</span>

    <template v-for="(item, index) in intParts" :key="`int-${index}`">
      <span v-if="item.type === 'comma'" aria-hidden="true" class="num-symbol num-comma">,</span>
      <div v-else aria-hidden="true" class="num-digit">
        <div
          class="num-list"
          :style="{ transform: `translateY(-${item.value * 10}%)` }"
        >
          <span v-for="n in 10" :key="n">{{ n - 1 }}</span>
        </div>
      </div>
    </template>

    <span v-if="hasDecimal" aria-hidden="true" class="num-symbol">.</span>

    <template v-for="(digit, index) in decimalDigits" :key="`dec-${index}`">
      <div aria-hidden="true" class="num-digit">
        <div
          class="num-list"
          :style="{ transform: `translateY(-${digit * 10}%)` }"
        >
          <span v-for="n in 10" :key="n">{{ n - 1 }}</span>
        </div>
      </div>
    </template>

    <span v-if="suffix" aria-hidden="true" class="num-symbol">{{ suffix }}</span>
  </div>
</template>

<script>
export default {
  name: "BalanceRoll",
  props: {
    value: { type: [Number, String], default: 0 },
    decimals: { type: Number, default: 2 },
    duration: { type: Number, default: 1.5 },
    fontSize: { type: Number, default: 18 },
    gap: { type: Number, default: 0 },
    prefix: { type: String, default: "" },
    suffix: { type: String, default: "" },
    thousand: { type: Boolean, default: true },
  },
  data() {
    return {
      currentValue: 0,
      targetValue: 0,
    };
  },
  computed: {
    showNegative() {
      return Number(this.targetValue) < 0;
    },
    absText() {
      return this.formatNum(this.currentValue);
    },
    realText() {
      const text = this.formatNum(this.targetValue);
      const [intPart, decPart] = text.split(".");
      const intText = this.thousand
        ? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        : intPart;
      const sign = this.showNegative ? "-" : "";
      const body = this.decimals > 0 ? `${intText}.${decPart}` : intText;
      return `${this.prefix}${sign}${body}${this.suffix}`;
    },
    intParts() {
      const targetStr = this.formatNum(this.targetValue).split(".")[0];
      const numStr = this.absText.split(".")[0].padStart(targetStr.length, "0");
      if (!this.thousand) {
        return numStr.split("").map((d) => ({ type: "digit", value: Number(d) }));
      }
      const result = [];
      const len = numStr.length;
      for (let i = 0; i < len; i++) {
        result.push({ type: "digit", value: Number(numStr[i]) });
        if ((len - i - 1) % 3 === 0 && i !== len - 1) result.push({ type: "comma" });
      }
      return result;
    },
    decimalDigits() {
      const targetDec = this.formatNum(this.targetValue).split(".")[1] || "";
      const dec = (this.absText.split(".")[1] || "").padEnd(targetDec.length, "0");
      return dec.split("").map(Number);
    },
    hasDecimal() {
      return this.decimals > 0;
    },
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        this.targetValue = Number(val) || 0;
        setTimeout(() => {
          this.currentValue = this.targetValue;
        }, 50);
      },
    },
    duration: {
      immediate: true,
      handler(val) {
        document.documentElement.style.setProperty(
          "--num-scroll-duration",
          `${val}s`,
        );
      },
    },
  },
  methods: {
    formatNum(num) {
      const absNum = Math.abs(Number(num) || 0);
      const strNum = absNum.toFixed(10);
      const [intPart, decPart] = strNum.split(".");
      const truncatedDec = decPart ? decPart.slice(0, this.decimals) : "";
      return `${intPart}.${truncatedDec.padEnd(this.decimals, "0")}`;
    },
  },
};
</script>

<style scoped>
.number-scroll {
  display: inline-flex;
  align-items: center;
  line-height: 1;
  font-weight: 800;
  color: #fff;
}

.num-symbol {
  display: inline-flex;
  align-items: center;
  height: 1em;
  line-height: 1;
  color: #fff;
}

.num-comma {
  font-weight: 800;
}

.num-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.num-symbol,
.num-digit {
  user-select: none;
  -webkit-user-select: none;
}

.num-digit {
  position: relative;
  width: 0.62em;
  height: 1em;
  overflow: hidden;
}

.num-list {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  transition: transform var(--num-scroll-duration, 1.5s) ease-in-out;
}

.num-list span {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 1em;
  font-weight: 800;
  color: #fff;
}
</style>
