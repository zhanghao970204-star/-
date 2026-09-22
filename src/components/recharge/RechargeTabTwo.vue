<template>
  <div class="content-c">
    <p class="m-t-20 f-t-15 f-w m-b-10">Valor do saque</p>
    <van-field
      v-model="amount"
      placeholder="R$20 - R$5.000"
      class="custom-field"
      type="number"
      :style="{ borderColor: focus ? 'var(--wihte-color)' : '#494949' }"
      @focus="focus = true"
      @blur="focus = false"
    >
    </van-field>
    <div>
      <div class="d-flex-s m-t-20" style="margin-bottom: 15px">
        <p class="f-t-15 f-w">Cartão Bancário({{ bankCardList.length }}/5)</p>
        <!-- <img
          v-if="bankCardList.length === 0"
          src="../../assets/img/common/bank_add.png"
          alt=""
          width="25"
          @click="addBank"
        /> -->
      </div>
      <div
        class="content-two--card m-b-10"
        v-for="(item, index4) in bankCardList"
        :key="index4"
        :class="{ 'card-bg--c': selectActive === index4 }"
        @click="getSelect(index4)"
      >
        <p class="text-eli info-color" style="width: 60%">
          {{ item.bankName }}
        </p>
        <p>{{ item.bankCard }}</p>
      </div>

      <div v-if="bankCardList.length === 0" class="bank-cont" @click="addBank">
        <img src="https://file.otgame.bet/br/a0/pix_pay.png" />
        <p class="font-color">
          Você ainda não tem uma conta de recebimento. Clique no botão para
          adicionar uma conta de recebimento.
        </p>
        <img
          class="m-t-10"
          src="../../assets/img/home/addBank.png"
          width="200"
          height="50"
        />
      </div>

      <p class="f-t-15 f-w m-t-20">Senha de Saque</p>
      <van-field
        v-model="passward"
        placeholder="Senha de Saque"
        class="custom-field"
        :style="{ borderColor: focus2 ? 'var(--wihte-color)' : '#494949' }"
        @focus="focus2 = true"
        @blur="focus2 = false"
        :type="!isSee ? 'password' : 'text'"
      >
        <template #right-icon>
          <div class="d-flex">
            <van-icon
              v-if="isSee"
              @click="isSee = false"
              name="eye-o"
              size="25"
              class="f-w"
            />
            <img
              v-else
              @click="isSee = true"
              src="../../assets/img/common/byj.png"
              width="24"
            />
          </div>
        </template>
      </van-field>
      <van-button
        v-if="isClose !== 1"
        @click="submit"
        size="large"
        class="custom-button m-t-20"
      >
        Enviar
      </van-button>
      <p v-else class="t-c m-t-10 error-color">{{ closeReason }}</p>
      <div class="content-c--info">
        <p class="f-t-16 f-w m-b-5">Caro Usuário</p>
        <div class="font-color">
          1. O limite de retirada diária é de 100 vezes<br />
          <p class="m-t-10">
            2. Cada valor de retirada é de R$ 3.000 a R$ 5.000.000 e chegará à
            sua conta em 30 segundos.
          </p>
          <p class="m-t-10">
            3. Se você não receber o saque a tempo, entre em contato com o
            serviço de atendimento ao cliente online para relatar o problema
            imediatamente.
          </p>
        </div>
      </div>
    </div>
    <van-popup
      v-model:show="showDialog"
      class="custom-popup"
      position="bottom"
      closeable
    >
      <div class="content-bank--c m-t-10 f-t-15 f-w">
        <p>Autenticação de Nome Real</p>
        <van-field
          v-model="realName"
          placeholder="Nome Real"
          class="custom-field2"
          :style="{ borderColor: focus ? 'var(--wihte-color)' : '#494949' }"
          @focus="focus = true"
          @blur="focus = false"
        >
        </van-field>
        <p class="primary-color f-t-12 m-t-10 m-l-5">
          Certifique-se de que o seu nome corresponda ao nome da conta bancária
          para garantir a segurança.
        </p>
        <van-button
          @click="submit2"
          size="large"
          class="custom-button"
          style="margin-top: 55%"
        >
          Enviar
        </van-button>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { Withdraw, RealnameCert } from '@/api/common'
import md5 from '@/utils/md5'
export default {
  name: 'RechargeTabTwo',
  components: {},
  props: {
    closeReason: {
      type: String,
      default: ''
    },
    isClose: {
      type: Number,
      default: 0
    },
    vipLevel: {
      type: Number,
      default: 0
    },
    bankCardList: {
      type: Array,
      default: () => []
    },
    balance: {
      type: Number,
      default: 0
    },
    isShowPopup: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      realName: '',
      showDialog: false,
      focus: false,
      focus2: false,
      amount: '',
      passward: '',
      isSee: false,
      selectActive: 0
    }
  },
  mounted() {},
  methods: {
    getSelect(i) {
      this.selectActive = i
    },
    async submit2() {
      if (!this.realName) {
        this.$toast({
          message: 'Digite seu nome',
          icon: 'cross'
        })
        return
      }
      const data = await RealnameCert({ realName: this.realName })
      if (data.status === 'ok') {
        this.$jumpTo('/setPassWord', { from: 'recharge' })
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    async submit() {
      if (this.isShowPopup) {
        this.showDialog = true
        return
      }
      if (this.balance < this.amount) {
        this.$toast({
          message: 'Saldo insuficiente para saque',
          icon: 'cross'
        })
      } else if (this.amount < 20 || this.amount > 5000) {
        this.$toast({
          message: 'Intervalo de valor de saque inválido 20 - 5.000',
          icon: 'cross'
        })
        // } else if (this.vipLevel < 1) {
        //   this.$toast({
        //     message:
        //       'O valor total de seu depósito deve ultrapassar R$ 50,00 (cinquenta reais) para solicitar o resgate!',
        //     icon: 'cross'
        //   })
        // } else if (this.vipLevel === 1) {
        //   this.$toast({
        //     message:
        //       'A conta do jogo possui saldo gratuito proveniente de uma promoção. Por favor, entre em contato com o atendimento ao cliente para auxílio no saque.',
        //     icon: 'cross'
        //   })
      } else {
        const data = await Withdraw({
          privacyPwd: md5(this.passward),
          rechargeFees: 1,
          withdrawAmount: this.amount,
          afterWithdrawAmount: this.amount,
          cardId: this.bankCardList[this.selectActive].cardId
        })
        if (data.status === 'ok') {
          this.$toast({
            message: this.$lang.Sucesso,
            icon: 'success'
          })
          // this.$router.push({
          //   path: '/gameHall',
          //   query: {
          //     from: 'recharge',
          //     url: data.content.url
          //   }
          // })
        } else {
          this.$toast({
            message: data.msg,
            icon: 'cross'
          })
        }
      }
    },
    addBank() {
      if (this.isShowPopup) {
        this.showDialog = true
        return
      }
      this.$jumpTo('/bankAdd', { from: 'recharge' })
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding-bottom: 17%;
}
.custom-field {
  margin-top: 10px;
  padding: 12px 10px;
  font-size: 15px;
  background: @background-color;
  border-radius: 13px;
}

:deep(.van-field__value) {
  caret-color: #a665d8; /* 输入框光标颜色 */
}
:deep(.van-field__control::-webkit-input-placeholder) {
  color: #727895; /* 设置为你需要的颜色 */
  font-weight: bold;
}
.content-two--card {
  background: linear-gradient(to right, #313234, #283a3d, #21474a);
  box-shadow: 0 0px 2px black;
  padding: 12px 15px;
  border-radius: 10px;
  font-size: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
}
.card-bg--c {
  background: linear-gradient(to right, #1e2532, #352c5b, #543693);
  border: 1px solid @info-color;
}

.content-c--info {
  margin-top: 15px;
  padding: 15px 15px;
  border-radius: 21px;
  line-height: 22px;
  background: @cont-bg;
}
.custom-popup {
  background: @cont-bg;
  border-radius: 13px 13px 0 0;
  // height: 50%;
  padding: 20px;
}

.custom-field2 {
  margin-top: 10px;
  padding: 11px 15px;
  font-size: 15px;
  background: @background-color;
  border-radius: 13px;
  border: 1px solid #494949;
  :deep(.van-field__control) {
    /* 修改输入框的字体颜色 */
    color: @wihte-color;
  }
}
.bank-cont {
  background: linear-gradient(to right, #1e2532, #2e2a4e, #573798);
  padding: 10px 10px 5px 10px;
  border-radius: 15px;
  text-align: center;
  line-height: 18px;
}
</style>
