<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title4"> </title-bar>
    <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <img
        src="../../../assets/img/bonus/bonus12.png"
        width="100%"
        style="border-radius: 13px"
      />
    </div>
    <div style="padding: 15px">
      <p class="f-t-16 f-w">{{ $lang.bonus_txt12 }}</p>
      <p class="font-color m-t-10 l-h-20">
        {{ $lang.bonus_txt13 }}
      </p>
      <img
        class="m-t-15"
        src="../../../assets/img/bonus/info-txt.png"
        width="100%"
      />
      <div v-html="$lang.bonus_txt14" class="l-h-20 font-color"></div>
      <van-button
        v-if="!token"
        @click="goToRec"
        size="large"
        class="custom-button m-t-20"
      >
        {{ $lang.bonus_txt15 }}
      </van-button>

      <van-button
        v-if="token"
        @click="goToRev()"
        size="large"
        class="custom-button m-t-20"
        :class="{ active: receiveStatus !== 1 && token && token.length > 1 }"
        :disabled="receiveStatus !== 1 && token && token.length > 1"
      >
        {{ $lang.Receber }}
      </van-button>

      <login v-model="showPopup" overlay></login>
    </div>
  </div>
</template>
<script>
import {
  ActivityreceiveRegisterAward,
  ActivitygetRegisterAward
} from '@/api/common'
export default {
  name: 'FirstRegister',
  components: {},
  data() {
    return {
      showPopup: false,
      receiveStatus: 0
    }
  },
  mounted() {
    if (this.token) {
      this.ActivitygetRegisterAward()
    }
  },
  methods: {
    goToRec() {
      this.showPopup = true
    },
    async ActivityreceiveRegisterAward() {
      const data = await ActivityreceiveRegisterAward()
      if (data.status === 'ok') {
        this.ActivitygetRegisterAward()
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: 'success'
        })
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    goToRev() {
      this.ActivityreceiveRegisterAward()
    },
    async ActivitygetRegisterAward() {
      const data = await ActivitygetRegisterAward()
      if (data.status === 'ok') {
        this.receiveStatus = data.content.receiveStatus
      }
    }
  }
}
</script>
<style lang="less" scoped>
.info-item {
  border: 1px solid fade(#e9a843, 35%);
  p {
    width: 33%;
  }
}
.active {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #2a2418 !important;
  border-bottom: 0px solid #e9a843 !important;
}
</style>
