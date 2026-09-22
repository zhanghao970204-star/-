<template>
  <div>
    <van-popup
      v-model:show="visible"
      :position="position"
      :overlay="overlay"
      :style="{ height: popupHeight }"
      class="custom-popup"
      closeable
    >
      <iframe
        v-if="srcValue"
        :src="srcValue"
        scrolling="auto"
        style="width: 100%; height: 100%"
        frameborder="0"
      ></iframe>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "ServicPopup",
  props: {
    srcValue: {
      type: String,
      default: "",
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 弹窗位置（top、bottom、left、right、center）
    position: {
      type: String,
      default: "bottom",
    },
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
    },
    popupHeight: {
      type: String,
      default: "70vh",
    },
  },
  data() {
    return {
      visible: this.modelValue, // 内部状态
    };
  },
  watch: {
    // 监听外部传入的 value 值变化
    modelValue(newVal) {
      this.visible = newVal;
    },
    // 监听内部 visible 值变化，同步到外部
    visible(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  methods: {
    close() {
      this.$emit("close");
    },
    confirm() {
      this.$emit("confirm");
    },
  },
};
</script>

<style lang="less" scoped>
.custom-popup {
  width: 100%;
  border-radius: 15px 15px 0 0;
  overflow: hidden;
}
:deep(.van-popup__close-icon) {
  color: #111111;
}
:deep(.van-popup__close-icon--top-right) {
  right: 13px !important;
  top: 13px !important;
}
</style>
