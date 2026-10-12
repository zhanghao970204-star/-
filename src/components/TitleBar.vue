<template>
  <div class="title-bar">
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
      <template v-if="$slots.right" #right>
        <slot name="right" />
      </template>
    </van-nav-bar>
  </div>
</template>
<script>
export default {
  name: 'TitleBar',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {}
  },
  mounted() {
    this.$nextTick(() => {
      window.scrollTo(0, 0)
    })
  },
  methods: {
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
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
  }

  &__back {
    font-weight: 700;
    -webkit-text-stroke: 0.6px currentColor;
  }
}
</style>
