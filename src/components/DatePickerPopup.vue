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
      <div class="dp__bar">
        <span class="dp__bar-line"></span>
      </div>

      <h3 class="dp__title">{{ title || "Select Date" }}</h3>
      <p class="dp__subtitle">
        {{ subtitle || "Select a period to filter your history" }}
      </p>

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
        <button class="dp__confirm" type="button" @click="onConfirm">
          {{ confirmText || "Confirm Selection" }}
        </button>
        <button class="dp__cancel" type="button" @click="onCancel">
          {{ cancelText || "Cancel" }}
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
@primary: #ffa300;
@bg-dark: #1f1c17;

.dp {
  background: @bg-dark;
  padding: 16px 20px 24px;
  border-radius: 16px 16px 0 0;
  border-top: 1px solid fade(#e9a843, 35%);

  &__bar {
    display: flex;
    justify-content: center;
    padding-bottom: 16px;
  }

  &__bar-line {
    width: 40px;
    height: 4px;
    background: fade(#e9a843, 40%);
    border-radius: 2px;
  }

  &__title {
    color: @wihte-color;
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 4px;
  }

  &__subtitle {
    color: #a89b7c;
    font-size: 12px;
    text-align: center;
    margin-bottom: 12px;
  }

  &__actions {
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  &__confirm {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-size: 16px;
    font-weight: 900;
    padding: 14px;
    border: none;
    border-radius: 999px;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 16px rgba(255, 163, 0, 0.28);

    &:active {
      opacity: 0.9;
      transform: scale(0.98);
    }
  }

  &__cancel {
    background: transparent;
    border: none;
    color: #a89b7c;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    padding: 8px 16px;

    &:active {
      color: @wihte-color;
    }
  }
}
</style>

<style lang="less">
.date-picker-popup {
  background: #1f1c17 !important;
  overflow: hidden;

  .van-picker,
  .van-date-picker {
    background: transparent !important;
  }

  .van-picker-column__item {
    color: #a89b7c !important;
    font-size: 16px;
    font-weight: 500;

    &--selected {
      color: #ffa300 !important;
      font-size: 18px;
      font-weight: bold;
    }
  }

  .van-picker__frame {
    border: 2px solid rgba(233, 168, 67, 0.4) !important;
    border-radius: 12px;
    background: rgba(255, 163, 0, 0.08);

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
