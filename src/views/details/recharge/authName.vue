<template>
  <div class="content">
    <van-nav-bar
      :title="$lang.authName_title"
      :border="false"
      fixed
      z-index="99999"
      @click-left="onClickLeft"
    >
      <template v-if="$route.query.from !== 'recharge'" #left>
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </template>
    </van-nav-bar>
    <div class="content-bank--c m-t-10">
      <van-field
        v-model="realName"
        :placeholder="$lang.authName_txt"
        class="custom-field"
        :style="{ borderColor: focus ? '#ffa300' : '#494949' }"
        @focus="focus = true"
        @blur="focus = false"
      >
      </van-field>
      <p class="error-color m-t-10 m-l-5">
        {{ $lang.authName_txt2 }}
      </p>
      <van-button @click="submit" size="large" class="custom-button m-t-20">
        {{ $lang.Enviar }}
      </van-button>
    </div>
  </div>
</template>
<script>
import { RealnameCert } from '@/api/common'
export default {
  name: 'AuthName',
  components: {},
  data() {
    return {
      focus: false,
      realName: ''
    }
  },
  mounted() {},
  methods: {
    async submit() {
      if (!this.realName) {
        this.$toast({
          message: this.$lang.authName_txt3,
          icon: 'cross'
        })
        return
      }

      const data = await RealnameCert({ realName: this.realName })
      if (data.status === 'ok') {
        if (this.$route.query.from === 'recharge') {
          this.$jumpTo('/setPassWord', { from: 'recharge' })
        } else {
          this.$router.go(-1)
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    onClickLeft() {
      this.$router.go(-1)
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  padding: 60px 3% 0 3%;
  background: #1f1c17;
}

.custom-field2 {
  margin-top: 10px;
  padding: 11px 15px;
  font-size: 15px;
  background: #2a2418;
  border-radius: 13px;
  border: 1px solid fade(#e9a843, 35%);
  font-weight: normal !important; // 👈 添加这句确保外层不加粗
  :deep(.van-field__control) {
    color: @wihte-color; // 输入文字颜色
    font-size: 15px;
    font-weight: normal !important; // 👈 添加这句确保外层不加粗

    &::placeholder {
      color: #a89b7c !important;
      font-weight: normal !important; // 👈 添加这句确保外层不加粗
    }
  }
}
</style>
