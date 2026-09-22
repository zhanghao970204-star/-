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
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
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
  /* 与全局 --van-nav-bar-height(55px) 对齐 */
  padding-top: 55px;
  box-sizing: border-box;
}
</style>
