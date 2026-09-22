<template>
  <div class="content">
    <title-bar :title="$lang.privacy_title"></title-bar>
    <div v-html="$lang.privacy_txt" class="content-c"></div>
  </div>
</template>
<script>
export default {
  name: 'Privacy',
  components: {},
  data() {
    return {}
  },
  mounted() {},
  methods: {}
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 3.5% 3%;
  letter-spacing: 1px;
  line-height: 22px;
}
</style>
