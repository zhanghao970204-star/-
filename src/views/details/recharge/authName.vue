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
  background: #1a0a28;
}

.custom-field2 {
  margin-top: 10px;
  padding: 0 16px;
  height: 48px;
  font-size: 14px;
  background: #000 !important;
  border: none !important;
  border-radius: 25px !important;
  box-sizing: border-box;
  font-weight: normal !important;

  &:focus-within {
    box-shadow: 0 0 0 1px #ffd400;
  }

  :deep(.van-field__control) {
    color: #fff;
    font-size: 14px;
    font-weight: normal !important;

    &::placeholder {
      color: #9b86c9 !important;
      font-weight: normal !important;
    }
  }
}
</style>
