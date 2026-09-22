<template>
  <div class="content">
    <recharge-top :info="info"></recharge-top>
    <div class="content-tab">
      <van-tabs background="transparent" @click-tab="tabSelect" v-model:active="activeTab">
        <van-tab
          v-for="(item, index) in ['Recarregar', 'Retirar', 'Registro']"
          :key="index"
        >
          <template #title>
            <span class="tab-text">{{ item }}</span>
          </template>
          <div class="content-tab--c">
            <recharge-tab-one
              v-if="index === 0"
              :paymentList="paymentList"
              :activities="activities"
              :firstRecharge="firstRecharge"
            ></recharge-tab-one>
            <!-- <van-loading v-if="loading" color="#a665d8" vertical></van-loading> -->
            <recharge-tab-two
              v-if="index === 1"
              :bankCardList="bankCardList"
              :balance="info.balance"
              :isShowPopup="isShowPopup"
              :vipLevel="vipLevel"
              :isClose="isClose"
              :closeReason="closeReason"
            ></recharge-tab-two>
            <recharge-tab-three v-if="index === 2"></recharge-tab-three>
          </div>
        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import RechargeTop from '../../components/recharge/RechargeTop.vue'
import RechargeTabOne from '../../components/recharge/RechargeTabOne.vue'
import RechargeTabTwo from '../../components/recharge/RechargeTabTwo.vue'
import RechargeTabThree from '../../components/recharge/RechargeTabThree.vue'
import {
  VnRechargeInitS,
  WithdrawInit,
  Init,
  GameBalanceList
} from '@/api/common'
export default {
  name: 'Recharge',
  components: { RechargeTop, RechargeTabOne, RechargeTabTwo, RechargeTabThree },
  data() {
    return {
      info: {
        balance: 0,
        totalBalance: 0,
        inviteAwardAmount: 0,
        balWdl: 0
      },
      activeTab: 0, // 默认激活第一个 Tab
      paymentList: [],
      activities: [],
      firstRecharge: false,
      bankCardList: [],
      loading: false,
      isShowPopup: false,
      vipLevel: 0,
      isClose: 0,
      closeReason: ''
    }
  },
  watch: {
    $route: {
      handler(val) {
        if (val.query.tab) {
          this.activeTab = parseInt(val.query.tab)
          this.WithdrawInit()
        }
        // 处理参数变化
      },
      immediate: true
    }
  },
  mounted() {
    this.VnRechargeInitS()
    this.GameBalanceList()
  },
  methods: {
    async GameBalanceList() {
      const data = await GameBalanceList()
      if (data.status === 'ok') {
        this.info = data.content
      }
    },
    async VnRechargeInitS() {
      const data = await VnRechargeInitS()
      if (data.status === 'ok') {
        this.paymentList = data.content.paymentList
        this.activities = data.content.activities || []
        this.firstRecharge = data.content.firstRecharge === true
      }
    },
    async WithdrawInit() {
      this.loading = true // 开始加载
      const data = await WithdrawInit()
      if (data.status === 'ok') {
        this.isClose = data.content.isClose
        this.closeReason = data.content.closeReason
        this.bankCardList = data.content.bankCardList
        if (this.bankCardList.length < 1 && !data.content.realName) {
          // this.$router.push({ path: '/authName', query: { from: 'recharge' } })
          this.isShowPopup = true
        }
        this.loading = false
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async Init() {
      const data = await Init()
      if (data.status === 'ok') {
        this.vipLevel = data.content.vipLevel
        if (
          this.bankCardList.length < 1 &&
          data.content.realName &&
          data.content.privacyPasswdSetted === 'no'
        ) {
          this.$jumpTo('/setPassWord', { from: 'recharge' })
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async tabSelect(i) {
      if (i === 1) {
        await this.WithdrawInit()
        await this.Init()
      } else if (i === 0) {
        this.VnRechargeInitS()
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content {
  padding: 3%;
} /* 自定义选中状态的 Tab 样式 */
.content-tab {
  margin-top: 15px;
}
:deep(.van-tabs__wrap) {
  height: 30px;
  .van-tab--active {
    border: 1px solid @primary-color !important;
    border-radius: 8px;
    color: @wihte-color !important;
    background: @primary-color;
  }
  .van-tab {
    color: @font-color;
    border: 1px solid @font-color;
    border-radius: 8px;
    margin: 0 15px;
    font-weight: bold;
  }
  .van-tabs__line {
    display: none;
  }
}
// :deep(.van-loading) {
//   background: transparent;
//   padding-top: 0%;
// }
</style>
