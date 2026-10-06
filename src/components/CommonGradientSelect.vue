<template>
  <div class="cgs" ref="root">
    <button type="button" class="cgs__trigger" @click.stop="toggle">
      <span class="cgs__text">{{ currentText }}</span>
      <i class="cgs__arrow" :class="{ 'cgs__arrow--open': open }"></i>
    </button>
    <ul v-show="open" class="cgs__panel" role="listbox">
      <li
        v-for="opt in options"
        :key="String(opt.value)"
        class="cgs__option"
        :class="{ 'cgs__option--active': opt.value === innerValue }"
        role="option"
        @click.stop="select(opt)"
      >
        {{ opt.text }}
      </li>
    </ul>
  </div>
</template>

<script>
/**
 * 渐变边框下拉（与邀请页 Tab 外框同款）
 * options: [{ text, value }]
 */
export default {
  name: "CommonGradientSelect",
  props: {
    modelValue: {
      type: [String, Number],
      default: undefined,
    },
    value: {
      type: [String, Number],
      default: undefined,
    },
    options: {
      type: Array,
      default: () => [],
    },
    placeholder: {
      type: String,
      default: "",
    },
  },
  emits: ["update:modelValue", "change", "input"],
  data() {
    return {
      open: false,
    };
  },
  computed: {
    innerValue() {
      return this.modelValue !== undefined ? this.modelValue : this.value;
    },
    currentText() {
      const hit = this.options.find((o) => o.value === this.innerValue);
      return (hit && hit.text) || this.placeholder || "";
    },
  },
  mounted() {
    document.addEventListener("click", this.onDocClick, true);
    document.addEventListener("touchstart", this.onDocClick, true);
  },
  beforeUnmount() {
    document.removeEventListener("click", this.onDocClick, true);
    document.removeEventListener("touchstart", this.onDocClick, true);
  },
  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    },
    onDocClick(e) {
      if (!this.open) return;
      const root = this.$refs.root;
      if (root && !root.contains(e.target)) {
        this.close();
      }
    },
    select(opt) {
      const next = opt.value;
      this.$emit("update:modelValue", next);
      this.$emit("input", next);
      this.$emit("change", next);
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
@fill: #1d022c;
@border-grad: linear-gradient(90deg, #e93dfe 0%, #3245a2 100%);
@panel: #2a0b45;
@active: #ffd467;

.cgs {
  position: relative;
  display: inline-block;
  max-width: 100%;
  z-index: 20;
}

.cgs__trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-width: 128px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  box-sizing: border-box;
  background:
    linear-gradient(@fill, @fill) padding-box,
    @border-grad border-box;
  box-shadow: 0 0 10px fade(#e93dfe, 22%);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
  outline: none;
}

.cgs__text {
  flex: 1;
  min-width: 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.cgs__arrow {
  flex-shrink: 0;
  width: 0;
  height: 0;
  border-left: 5px solid transparent;
  border-right: 5px solid transparent;
  border-top: 6px solid #fff;
  transition: transform 0.18s ease;
}

.cgs__arrow--open {
  transform: rotate(180deg);
}

.cgs__panel {
  position: absolute;
  left: 0;
  top: calc(100% + 6px);
  min-width: 100%;
  margin: 0;
  padding: 6px 0;
  list-style: none;
  border: 1px solid transparent;
  border-radius: 12px;
  box-sizing: border-box;
  background:
    linear-gradient(@panel, @panel) padding-box,
    @border-grad border-box;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.45);
  max-height: 260px;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  z-index: 30;
}

.cgs__option {
  padding: 10px 16px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;

  &:active {
    background: rgba(255, 255, 255, 0.06);
  }
}

.cgs__option--active {
  color: @active;
  font-weight: 800;
}
</style>
