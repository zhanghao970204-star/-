<template>
  <div class="title-bar" :class="{ 'title-bar--aside': hasRight }">
    <van-nav-bar
      :title="title"
      :border="false"
      @click-left="onClickLeft"
      fixed
      z-index="999"
    >
      <template #left>
        <van-icon
          class="title-bar__back"
          name="arrow-left"
          size="22"
          color="var(--wihte-color)"
        />
      </template>
      <template v-if="hasRight" #right>
        <slot name="right" />
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: "TitleBar",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  computed: {
    hasRight() {
      return !!this.$slots.right;
    },
  },
  mounted() {
    this.$nextTick(() => {
      window.scrollTo(0, 0);
    });
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
  },
};
</script>
<style lang="less" scoped>
.title-bar {
  /* 与全局 --van-nav-bar-height(67px) 对齐 */
  padding-top: 67px;
  box-sizing: border-box;

  :deep(.van-nav-bar) {
    background: #15031d !important;
    background-color: #15031d !important;
  }

  :deep(.van-nav-bar__title) {
    font-size: 20px;
    font-weight: 700;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* 右边没内容：标题相对整条顶栏居中 */
  &:not(.title-bar--aside) {
    :deep(.van-nav-bar__title) {
      position: absolute !important;
      left: 50% !important;
      right: auto !important;
      flex: none;
      width: auto;
      max-width: calc(100% - 96px) !important;
      margin: 0 !important;
      transform: translateX(-50%) !important;
      text-align: center;
    }
  }

  /* 右边有内容：紧挨返回按钮，再多 10px */
  &--aside {
    :deep(.van-nav-bar__title) {
      text-align: left;
      margin-left: 10px !important;
    }
  }

  &__back {
    font-weight: 700;
    -webkit-text-stroke: 0.6px currentColor;
  }
}
</style>
