<template>
  <div class="content">
    <title-bar :title="$lang.setPassWord_title"></title-bar>
    <div class="senha-cont">
      <p v-if="privacyPasswdSetted === 'no'" class="primary-color3 t-c m-t-10">
        {{ $lang.setPassWord_txt }}
      </p>
      <p class="m-t-15">{{ $lang.setPassWord_txt2 }}</p>

      <div v-if="privacyPasswdSetted === 'yes'" class="m-t-20">
        <p class="m-b-5">{{ $lang.setPassWord_txt3 }}</p>
        <van-password-input
          :value="passWord"
          :error-info="errorInfo"
          :focused="showKeyboard"
          @focus="showKeyboardFun()"
        />
        <van-number-keyboard
          v-model="passWord"
          v-model:show="showKeyboard"
          :close-button-text="$lang.Confirmar"
          @blur="showKeyboard = false"
        />
      </div>

      <div class="m-t-10">
        <p class="m-b-5">{{ $lang.setPassWord_txt4 }}</p>
        <van-password-input
          :value="passWord2"
          :error-info="errorInfo2"
          :focused="showKeyboard2"
          @focus="showKeyboardFun2()"
        />
        <van-number-keyboard
          v-model="passWord2"
          v-model:show="showKeyboard2"
          :close-button-text="$lang.Confirmar"
          @blur="showKeyboard2 = false"
        />
      </div>
      <p class="m-t-15 info-color">
        {{ $lang.setPassWord_txt5 }}
      </p>
      <van-button size="large" class="custom-button m-t-20" @click="submit">
        {{ $lang.Confirmar }}
      </van-button>
    </div>
  </div>
</template>
<script>
import { ChangePrivacyPwd, Init } from '@/api/common'
import md5 from '@/utils/md5'
export default {
  name: 'SetPassWord',
  components: {},
  data() {
    return {
      passWord: '',
      passWord2: '',
      errorInfo: '',
      errorInfo2: '',
      showKeyboard: false,
      showKeyboard2: false,
      privacyPasswdSetted: ''
    }
  },
  watch: {
    passWord(v) {
      if (v.length === 6) {
        this.showKeyboard = false
      }
      // 确保输入值不超过6位
      if (v.length > 6) {
        v = v.slice(0, 6)
      }
      this.passWord = v
    },
    passWord2(v) {
      if (v.length === 6) {
        // this.errorInfo2 = ''
        this.showKeyboard2 = false
      }
      // 确保输入值不超过6位
      if (v.length > 6) {
        v = v.slice(0, 6)
      }
      this.passWord2 = v
    }
  },
  mounted() {
    this.Init()
  },
  methods: {
    async Init() {
      const data = await Init()
      if (data.status === 'ok') {
        this.privacyPasswdSetted = data.content.privacyPasswdSetted
      }
    },
    async ChangePrivacyPwd(params) {
      const data = await ChangePrivacyPwd(params)
      if (data.status === 'ok') {
        // console.log(this.$route.query.from, 9999)
        if (this.$route.query.from === 'profile') {
          this.$router.go(-1)
        } else {
          this.$jumpTo('/bankAdd', {}, { replace: true })
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    showKeyboardFun() {
      this.showKeyboard = true
      this.showKeyboard2 = false
    },
    showKeyboardFun2() {
      this.showKeyboard2 = true
      this.showKeyboard = false
    },
    submit() {
      if (this.passWord.length < 6) {
        this.errorInfo = this.$lang.setPassWord_txt6
      }

      if (this.passWord2.length < 6) {
        this.errorInfo2 = this.$lang.setPassWord_txt6
      }

      if (this.passWord.length > 0 && this.passWord === this.passWord2) {
        this.errorInfo2 = this.$lang.setPassWord_txt7
      }
      if (
        this.privacyPasswdSetted === 'yes' &&
        this.errorInfo === '' &&
        this.errorInfo2 === ''
      ) {
        this.ChangePrivacyPwd({
          newPrivacyPwd: md5(this.passWord2),
          oldPrivacyPwd: md5(this.passWord)
        })
      } else if (this.privacyPasswdSetted === 'no' && this.errorInfo2 === '') {
        this.ChangePrivacyPwd({
          newPrivacyPwd: md5(this.passWord2)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
.senha-cont {
  padding: 10px;
}
</style>
