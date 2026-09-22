<template>
  <div class="content-c">
    <div class="bank-mid">
      <div class="d-flex m-t-5">
        <p>{{ $lang.BankInfo_txt }}</p>
        <p class="info-color m-l-5">{{ $formatNumberWithCommas(balance) }}</p>
        <img
          class="m-l-10"
          @click="toggleRotation"
          :class="{ rotating: isRotating }"
          src="../../assets/img/general/icon_user_refresh.png"
          width="15"
        />
      </div>
      <div class="m-t-10 m-b-5">
        <span>{{ $lang.BankInfo_txt_withdrawable }}</span>
        <span class="info-color m-l-5 m-r-5">{{ $formatNumberWithCommas(balLimit > 0 ? 0 : balWdl) }}</span>
      </div>
      <div v-if="balLimit > 0" class="m-t-10 m-b-5">
        {{ $lang.BankInfo_txt3 }}
        <span class="info-color m-l-5 m-r-5">{{ $formatNumberWithCommas(balLimit) }}</span>
        {{ $lang.BankInfo_txt4 }}
      </div>
    </div>
    <p class="p-line"></p>
    <div class="bank-add">
      <div class="type-item d-flex-s t-c">
        <span class="t-c" style="width: 100%">{{ $lang.BankInfo_txt5 }}</span>
        <div class="badgeIcon-c">
          <p class="badgeIcon">
            <van-icon
              name="success"
              color="var(--wihte-color)"
              class="badgeIcon-i"
              size="10"
            />
          </p>
        </div>
      </div>
    </div>
    <p class="p-line"></p>
    <div class="bank-list">
      <!-- <van-field
        v-model="realName"
        placeholder="Nome Real"
        class="custom-field"
        :style="{ borderColor: focus ? 'var(--border-color)' : 'var(--border-color)' }"
        @focus="focus = true"
        @blur="focus = false"
        style="background: #f5f5f5"
      >
      </van-field> -->
      <div
        v-if="bankCardList.length > 0"
        @click="selectF"
        style="position: relative"
      >
        <div class="bank-list-add d-flex-s m-t-20">
          <div class="d-flex">
            <!-- <div style="background: var(--wihte-color); padding: 5px; border-radius: 5px">
              <i class="icon iconfont icon-pix" style="color: #32bcad"></i>
            </div> -->
            <span class="m-l-10"><b></b>{{ bankName }}({{ bankCard }})</span>
          </div>
          <van-icon name="arrow-down" :class="{ 'arrow-up': showSelect }" />
        </div>

        <div v-if="showSelect && columns.length > 0" class="bank-select">
          <div
            class="bank-select--i"
            v-for="(item, index) in columns"
            :key="index"
            @click="getSelect(index, item)"
            :class="{ 'select-active': index === selectIndex }"
          >
            <div class="d-flex">
              <!-- <div
                style="
                  background: var(--wihte-color);
                  padding: 5px 5px 2px 5px;
                  border-radius: 5px;
                "
              >
                <img src="../../assets/img/home/pix-H.png" width="18" />
              </div> -->
              <span class="m-l-5">{{ item.label }}({{ item.value }})</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else @click="gotoBank" class="bank-list-add d-flex">
        <img src="../../assets/img/recharge/bank.png" width="25" />
        <span class="m-l-10">{{ $lang.BankInfo_txt6 }}</span>
      </div>

      <van-field
        v-model="amount"
        placeholder="Please enter the withdrawal amount."
        class="custom-field"
        type="number"
        :style="{ borderColor: focus2 ? 'var(--border-color)' : 'var(--border-color)' }"
        @focus="focus2 = true"
        @blur="focus2 = false"
        style="margin: 25px 0 30px 0"
      >
        <template #left-icon>
          <span>{{ getCurrency }}</span>
        </template>
        <!-- <template #right-icon>
          <span class="primary-color3">{{ $lang.BankInfo_txt7 }}</span>
        </template> -->
      </van-field>
    </div>
    <p class="p-line"></p>
    <div class="m-t-20" style="padding: 0 10px">
      <p class="m-b-10">{{ $lang.BankInfo_txt8 }}</p>
      <van-password-input
        :value="passWord"
        :error-info="errorInfo"
        :focused="showKeyboard"
        @focus="showKeyboard = true"
      />
      <van-number-keyboard
        v-model="passWord"
        v-model:show="showKeyboard"
        :close-button-text="$lang.Confirmar"
        @blur="showKeyboard = false"
      />
      <van-button size="large" class="custom-button m-t-30" @click="submit">
        {{ $lang.Confirmar }}
      </van-button>
    </div>
    <div class="font-color l-h-20" style="width: 96%; margin: 20px auto 0">
      <p class="m-b-5 f-t-15">{{ $lang.common_txt318 }}</p>
      <div>
        <p class="m-t-10">
          {{ $lang.common_txt221 }}
        </p>
        <p class="m-t-10">
          {{ $lang.common_txt222 }}
          {{ withdrawAmountMin }} {{ getCurrency }} {{ $lang.common_txt223 }}
        </p>
        <p class="m-t-10">
          {{ $lang.common_txt224 }}
        </p>
        <p class="m-t-10">
          {{ $lang.common_txt225 }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { WithdrawInit, Withdraw } from '@/api/common'
import md5 from '@/utils/md5'
export default {
  name: 'BankInfoTab1',
  components: {},
  props: {},
  data() {
    return {
      bankName: '',
      bankId: null,
      columns: [],
      passWord: '',
      errorInfo: '',
      showKeyboard: false,
      amount: null,
      focus2: false,
      focus: false,
      // realName: '',
      balance: 0,
      balWdl: 0,
      isRotating: false,
      bankCardList: [],
      showSelect: false,
      bankCard: '',
      withdrawAmountSingleMax: 0,
      withdrawAmountMin: 0,
      balLimit: 0
    }
  },
  created() {},
  mounted() {
    this.WithdrawInit()
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
    }
  },
  methods: {
    selectF() {
      this.showSelect = !this.showSelect
    },
    async submit() {
      // if (!this.realName) {
      //   this.$toast({
      //     message: 'Por favor, digite seu nome verdadeiro.',
      //     icon: 'info'
      //   })
      // }
      if (this.amount < 1) {
        this.$toast({
          message: this.$lang.BankInfo_txt9,
          icon: 'info'
        })
      }
      if (this.passWord.length < 6) {
        this.errorInfo = '6 números'
      } else {
        this.errorInfo = ''
      }
      if (this.balLimit > 0) {
        this.$toast({
          message: `${this.$lang.BankInfo_txt3} ${this.$formatNumberWithCommas(this.balLimit)} ${this.getCurrency} ${this.$lang.BankInfo_txt4}`,
          icon: 'cross'
        })
        return
      }

      if (this.balance < this.amount) {
        this.$toast({
          message: this.$lang.BankInfo_txt10,
          icon: 'cross'
        })
        return
      }

      if (
        this.amount < this.withdrawAmountMin ||
        this.amount > this.withdrawAmountSingleMax
      ) {
        this.$toast({
          message: `  ${
            this.$lang.BankInfo_txt11 +
            this.$formatNumberWithCommas(this.withdrawAmountMin)
          } - ${this.$formatNumberWithCommas(this.withdrawAmountSingleMax)}`,
          icon: 'cross'
        })
        return
      }
      // if (this.amount > this.balWdl) {
      //   this.$toast({
      //     message:
      //       'O saldo a ser sacado é menor que o saldo disponível para saque.',
      //     icon: 'cross'
      //   })
      // }

      if (this.amount !== 0 && this.passWord.length === 6) {
        const data = await Withdraw({
          privacyPwd: md5(this.passWord),
          rechargeFees: 1,
          withdrawAmount: this.amount,
          afterWithdrawAmount: this.amount,
          cardId: this.bankCardList[this.selectIndex].cardId
        })
        if (data.status === 'ok') {
          this.$toast({
            message: this.$lang.Sucesso,
            icon: 'success'
          })
          this.amount = null
          this.passWord = ''
          this.WithdrawInit()
        } else {
          this.$toast({
            message: data.msg,
            icon: 'cross'
          })
        }
      }
    },
    getSelect(i, v) {
      this.bankCard = v.value
      this.bankName = v.label
      this.selectIndex = i
    },
    async WithdrawInit() {
      const data = await WithdrawInit()
      if (data.status === 'ok') {
        this.withdrawAmountMin = data.content.withdrawAmountMin
        this.withdrawAmountSingleMax = data.content.withdrawAmountSingleMax
        this.balLimit = data.content._balLimit || 0
        this.balance = data.content._balUsable || 0
        this.balWdl = data.content._balWdl || 0
        this.bankCardList = data.content.bankCardList || []
        this.columns =
          data.content.bankCardList.map((item) => ({
            value: item.bankCard,
            label: item.bankName
          })) || []
        if (this.columns.length > 0) {
          this.getSelect(0, this.columns[0])
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    gotoBank() {
      this.$emit('goToActive', 1)
    },
    toggleRotation() {
      if (this.isRotating) return
      this.isRotating = true
      setTimeout(() => {
        this.isRotating = false
      }, 1000)
      this.WithdrawInit()
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding-bottom: 20px;
  .p-line {
    height: 1px;
    background: @border-color;
  }
  .type-item {
    position: relative;
    border-radius: 5px;
    border: 1px solid @info-color;
    height: 38px;
    background: @cont-bg;
  }
  .badgeIcon-c {
    position: absolute;
    top: 20px;
    right: 0;
  }
  .badgeIcon {
    position: relative;
    border-left: 16px solid transparent;
    // border-right: 0px solid transparent;
    border-bottom: 16px solid @info-color;
    // border-radius: 0 0 3px 0;
  }
  .badgeIcon-i {
    position: absolute;
    right: 0;
    top: 6px;
    width: 10px;
  }
  .bank-list {
    padding: 18px 10px;
  }
  .bank-list-add {
    padding: 12px 10px 12px 5px;
    border: 1px solid @border-color;
    border-radius: 5px;
    // background: #f5f5f5;
  }
}
.bank-mid {
  padding: 10px;
  // background: #f5f5f5;
}

.bank-add {
  // background: #f5f5f5;
  padding: 18px 10px;
}

/* 定义旋转动画 */
@keyframes rotate-and-back {
  0%,
  100% {
    transform: rotate(0deg); /* 初始和最终状态 */
  }
  50% {
    transform: rotate(360deg); /* 顺时针旋转360度 */
  }
}
/* 动画类 */
.rotating {
  animation: rotate-and-back 1s linear forwards; /* 4秒完成动画，线性过渡，动画结束后保留状态 */
}
.arrow-up {
  transform: rotate(-180deg); /* 箭头向上时旋转180度 */
}
.select-active {
  background: @primary-gradient;
  font-weight: bold;
  color: @primary-text-on;
}
.bank-select {
  position: absolute;
  border: 1px solid @border-color;
  border-radius: 10px;
  width: 100%;
  background: @cont-bg;
  z-index: 9;
  height: 150px;
  overflow-y: auto;
  padding: 10px 0;
}
.bank-select--i {
  padding: 10px 0;
}
</style>
