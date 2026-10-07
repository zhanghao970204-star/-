<template>
  <van-popup
    :show="modelValue"
    position="bottom"
    round
    :close-on-click-overlay="true"
    class="date-picker-popup"
    @update:show="$emit('update:modelValue', $event)"
  >
    <div class="dp">
      <div class="dp__header">
        <span class="dp__title">{{ title || "Select Date" }}</span>
        <button type="button" class="dp__close" @click="onCancel">
          <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
            <path
              d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
              fill="none"
              stroke="currentColor"
              stroke-width="2.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>

      <p v-if="subtitle" class="dp__subtitle">{{ subtitle }}</p>

      <van-date-picker
        v-model="currentDate"
        :min-date="minDate"
        :max-date="maxDate"
        :show-toolbar="false"
        :visible-option-num="5"
        option-height="44"
        swipe-duration="300"
      />

      <div class="dp__actions">
        <button class="dp__confirm btn-3d-green" type="button" @click="onConfirm">
          {{ confirmText || "SAVE" }}
        </button>
      </div>
    </div>
  </van-popup>
</template>

<script>
function toDateParts(date) {
  const d = date instanceof Date && !isNaN(date.getTime()) ? date : new Date();
  return [
    String(d.getFullYear()),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ];
}

export default {
  name: "DatePickerPopup",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
    },
    subtitle: {
      type: String,
      default: "",
    },
    confirmText: {
      type: String,
      default: "",
    },
    cancelText: {
      type: String,
      default: "",
    },
    minDate: {
      type: Date,
      default: () => new Date(1950, 0, 1),
    },
    maxDate: {
      type: Date,
      default: () => new Date(),
    },
    defaultDate: {
      type: Date,
      default: null,
    },
  },
  emits: ["update:modelValue", "confirm", "cancel"],
  data() {
    return {
      currentDate: toDateParts(new Date()),
    };
  },
  watch: {
    modelValue(val) {
      if (val) this.initDate();
    },
    defaultDate() {
      if (this.modelValue) this.initDate();
    },
  },
  created() {
    this.initDate();
  },
  methods: {
    initDate() {
      const d = this.defaultDate || this.maxDate || new Date();
      this.currentDate = toDateParts(d);
    },
    onConfirm() {
      const parts = Array.isArray(this.currentDate) ? this.currentDate : [];
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const date = new Date(y, m, day);
      this.$emit("confirm", date);
      this.$emit("update:modelValue", false);
    },
    onCancel() {
      this.$emit("cancel");
      this.$emit("update:modelValue", false);
    },
  },
};
</script>

<style lang="less" scoped>
.dp {
  background: #7a2190;
  padding: 0 20px 28px;
  border-radius: 20px 20px 0 0;

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 44px;
    margin: 0 -20px;
    background: #532276;
  }

  &__title {
    color: @wihte-color;
    font-size: 18px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-align: center;
  }

  &__close {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    &:active {
      opacity: 0.75;
    }
  }

  &__subtitle {
    color: #fff;
    font-size: 13px;
    text-align: center;
    margin: 12px 0 4px;
  }

  &__actions {
    margin-top: 18px;
  }

  &__confirm {
    .btn-3d-green();
    font-size: 16px;
    letter-spacing: 1px;
  }
}
</style>

<style lang="less">
.date-picker-popup {
  background: #7a2190 !important;
  overflow: hidden;

  .van-picker,
  .van-date-picker {
    background: transparent !important;
  }

  .van-picker-column__item {
    color: @icon-color !important;
    font-size: 16px;
    font-weight: 500;

    &--selected {
      color: #fff !important;
      font-size: 18px;
      font-weight: 800;
    }
  }

  .van-picker__frame {
    left: 8px !important;
    right: 8px !important;
    border: 1.5px solid @border-color !important;
    border-radius: 10px;
    background: transparent;

    &::after {
      display: none;
    }
  }

  .van-picker__mask {
    background-image: none !important;
    background: transparent !important;
  }

  .van-hairline--top-bottom::after {
    display: none;
  }

  .van-picker__toolbar {
    display: none;
  }
}
</style>
