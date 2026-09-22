<template>
  <div>
    <van-popup
      v-model:show="visible"
      :position="position"
      :overlay="overlay"
      :close-on-click-overlay="false"
      :style="{ width: '82%' }"
      class="custom-popup"
    >
      <slot>
        <div class="c-content">
          <div v-if="config.isTitle" class="c-content--title">
            {{ config.title }}
          </div>
          <div class="c-content--c t-c m-t-20 m-b-20">{{ config.content }}</div>
          <div class="d-flex-s c-content--i">
            <van-button
              v-if="config.bt1 !== 'isClose'"
              @click="close"
              size="large"
              class="custom-button active-btn"
              >{{ config.bt1 }}
            </van-button>
            <van-button
              :class="{ 'wid-100': config.bt1 === 'isClose' }"
              @click="confirm"
              size="large"
              class="custom-button"
              >{{ config.bt2 }}
            </van-button>
          </div>
        </div>
      </slot>
    </van-popup>
  </div>
</template>

<script>
export default {
  name: "CommonPopup",
  props: {
    config: {
      type: Object,
      default: () => ({
        isTitle: false,
      }),
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 弹窗位置（top、bottom、left、right、center）
    position: {
      type: String,
      default: "center",
    },
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
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
/* 可以在这里添加自定义样式 */
.custom-popup {
  background-color: @cont-bg; /* 设置背景色 */
  border-radius: 20px;
  font-size: 14px;
}
/* 使用深度选择器覆盖默认关闭按钮样式 */
:deep(.van-popup__close-icon) {
  color: @wihte-color; /* 修改图标颜色 */
  font-size: 20px;
  right: 15px;
  top: 10px;
}
:deep(.van-button--large) {
  height: 45px;
}

.c-content {
  padding: 25px 22px;
}
.c-content--i {
  width: 85%;
  margin: 0 auto;
}
.active-btn {
  /* 图二：描边取消按钮 */
  background: transparent !important;
  border: 1px solid #e8b367 !important;
  color: #e8b367 !important;
  box-shadow: none !important;
  border-radius: 999px !important;
}
.custom-button {
  box-shadow: none;
  width: 45%;
  border-radius: 999px !important;
  font-weight: 700;
}
:deep(.custom-button:not(.active-btn)) {
  background: linear-gradient(180deg, #ffe082 0%, #f4a100 100%) !important;
  border: none !important;
  color: #402a0f !important;
}
.wid-100 {
  width: 100% !important;
}
</style>
