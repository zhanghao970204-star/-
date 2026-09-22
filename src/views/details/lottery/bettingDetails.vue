<template>
  <div
    class="content"
    style="background: #1f1c17; color: #ffe4b5; min-height: 100vh"
  >
    <div class="lottery-bg">
      <div class="lottery-title">
        <van-icon
          name="arrow-left"
          @click="onClickLeft"
          size="20"
          color="#ffe4b5"
        />
        <p class="f-w" style="font-size: 16px; color: #ffe4b5">
          {{ $lang.common_txt116 }}
        </p>
        <p></p>
      </div>
    </div>
    <div class="bet-bg">
      <div style="height: 82vh; overflow: scroll">
        <div class="bet-bg-t f-w">
          <div class="d-flex-s">
            <img :src="iconUrl" style="width: 100px" />
            <div style="width: 70%; text-align: center">
              <div style="color: var(--wihte-color); font-size: 25px">
                {{ lotteryName }}
              </div>
              <div class="m-t-10 f-t-18">
                <p
                  style="
                    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
                    color: #573900;
                    width: 180px;
                    margin: 0 auto;
                    border-radius: 8px;
                    padding: 5px 0;
                  "
                >
                  {{ issueNo }}
                </p>
              </div>
            </div>
          </div>

          <div v-if="drawingResult && drawingResult.length > 0" class="m-t-10">
            <div
              v-if="
                [
                  'tron16x660',
                  'tron16x6180',
                  'tron16x6300',
                  'tron16x6600',
                  'eth16x660',
                  'eth16x6180',
                  'eth16x6300',
                  'eth16x6600',
                  'bnb16x660',
                  'bnb16x6180',
                  'bnb16x6300',
                  'bnb16x6600'
                ].includes(lotteryType)
              "
              style="
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(11%, 1fr));
                gap: 5px;
                justify-content: start;
              "
            >
              <p
                class="lot-ball"
                v-for="(item, index) in drawingResult.match(/\d+/g)"
                :key="index"
              >
                {{ item }}
              </p>
              <p
                style="
                  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
                  color: #573900;
                  height: 30px;
                  width: 70px;
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                "
                @click="goToBin()"
              >
                {{ $lang.common_txt181 }}
              </p>
            </div>
            <div v-else>
              <div>
                <p class="f-t-15 f-w m-b-5 wihte-color">winning:</p>
                <div class="d-flex" style="flex-flow: wrap row">
                  <p
                    class="lot-ball"
                    v-for="(item2, index) in JSON.parse(
                      drawingResult
                    ).winning.split(',')"
                    :key="index"
                  >
                    {{ item2 }}
                  </p>
                </div>
              </div>
              <div v-if="JSON.parse(drawingResult).machine">
                <p class="f-t-15 f-w m-b-5 m-t-5 wihte-color">machine:</p>
                <div class="d-flex" style="flex-flow: wrap row">
                  <p
                    class="lot-ball"
                    v-for="(item2, index) in JSON.parse(
                      drawingResult
                    ).machine.split(',')"
                    :key="index"
                  >
                    {{ item2 }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          :style="textStyle(childOrderStatus)"
          style="
            background-size: 100% 100%;
            height: 70px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--wihte-color);
            font-size: 20px;
            font-weight: bold;
          "
        >
          {{ getStatus(childOrderStatus) }}
        </div>
        <div class="bet-bg-c m-t-15">
          <div class="d-flex-s m-b-10">
            <p class="f-t-15 f-w">{{ $lang.common_txt117 }}</p>
            <img
              @click="toggleRotation"
              :class="{ rotating: isRotating }"
              src="../../../assets/img/drawer/to-lesa.png"
              width="25"
            />
          </div>

          <div class="bet-bg-c2">
            <div class="d-flex-s">
              <p>{{ $lang.common_txt196 }}</p>
              <p class="f-w">
                {{ $dayjs(createDate).format('DD/MM/YYYY HH:mm:ss') }}
              </p>
            </div>
            <div class="d-flex-s m-t-20">
              <p>{{ $lang.common_txt120 }}</p>
              <div class="d-flex">
                <p class="f-w">{{ mainOrderNo }}</p>
                <img
                  @click="copyText"
                  width="13px"
                  class="m-l-5"
                  src="../../../assets/img/drawer/drawer_copy.png"
                />
              </div>
            </div>

            <div class="d-flex-s m-t-20">
              <p>{{ $lang.common_txt197 }}</p>
              <p class="f-w f-t-15">
                <span>{{ getCurrency }} </span
                ><span>-{{ mainOrderAmount }}</span>
              </p>
            </div>

            <div class="d-flex-s m-t-20">
              <p>{{ $lang.common_txt198 }}</p>
              <p class="f-w f-t-15">
                <span>{{ getCurrency }} </span
                ><span style="color: #007524">+{{ sendAmount }}</span>
              </p>
            </div>
          </div>
          <div class="bet-bg-c3 m-t-15">
            <p class="f-t-15 f-w title-color m-b-10">
              {{ $lang.common_txt121 }}
            </p>
            <div
              class="bet-bg-c3b"
              v-for="(item, index) in betItemList"
              :key="index"
            >
              <div class="d-flex-s f-t-14" style="margin: 0 15px 10px">
                <p class="m-r-5" style="width: 36%">{{ item.shortForm }}</p>
                <div v-if="item.win" style="width: 30%">
                  <p class="go-win">{{ $lang.common_txt204 }}</p>
                </div>
                <p style="width: 33%; text-align: right" class="f-w">
                  {{ getCurrency }} {{ item.betTimes }}*{{ item.potCount }}
                </p>
              </div>
              <p class="p-line"></p>
              <div
                v-if="
                  item.playType !== 'szc11x6_1x_dwd_zu' &&
                  [
                    'tron16x660',
                    'tron16x6180',
                    'tron16x6300',
                    'tron16x6600',
                    'eth16x660',
                    'eth16x6180',
                    'eth16x6300',
                    'eth16x6600',
                    'bnb16x660',
                    'bnb16x6180',
                    'bnb16x6300',
                    'bnb16x6600'
                  ].includes(lotteryType)
                "
                class="f-w f-t-14"
              >
                <div
                  v-if="
                    !['szc11x6_ws_dx_zu', 'szc11x6_ws_ds_zu'].includes(
                      item.playType
                    )
                  "
                  class="bet-bg-c3b2"
                >
                  <p
                    v-for="(item2, index2) in item.betItem
                      .split('@')[0]
                      .split(',')"
                    :key="index2"
                    :class="{
                      'ac-sel3':
                        drawingResult &&
                        drawingResult.length > 0 &&
                        drawingResult.includes(item2)
                    }"
                  >
                    {{ item2 }}
                  </p>
                </div>
                <div v-else class="bet-bg-c3b2">
                  <p
                    v-for="(item2, index2) in item.betItem
                      .split('@')[0]
                      .split(',')"
                    :key="index2"
                    :class="{
                      'ac-sel3':
                        drawingResult &&
                        drawingResult.length > 0 &&
                        drawingResult
                          .split(',')
                          [drawingResult.split(',').length - 1].includes(item2)
                    }"
                  >
                    {{ item2 }}
                  </p>
                </div>
              </div>
              <div v-else class="bet-bg-c3b2 f-w f-t-14">
                <p
                  v-for="(item2, index2) in item.betItem
                    .split('@')[0]
                    .split(',')"
                  :key="index2"
                  :class="{
                    'ac-sel3':
                      drawingResult &&
                      drawingResult.length > 0 &&
                      JSON.parse(drawingResult).winning.includes(item2)
                  }"
                >
                  {{ item2 }}
                </p>
              </div>

              <div
                v-if="item.playType === 'szc11x6_1x_dwd_zu'"
                class="bet-bg-c3b2 f-w f-t-14"
              >
                <div>
                  <div class="d-flex">
                    <p
                      style="
                        background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
                        color: #573900;
                        border-radius: 10px;
                        border: none !important;
                        padding: 12px;
                        width: 30px;
                        margin-right: 10px;
                      "
                      v-for="(item, index) in [1, 2, 3, 4, 5, 6]"
                      :key="index"
                    >
                      {{ item }}
                    </p>
                  </div>
                  <div class="m-t-10" style="display: flex">
                    <div
                      class="m-b-5"
                      v-for="(item2, index2) in item.betItem
                        .split('@')[0]
                        .split('#')"
                      :key="index2"
                    >
                      <p
                        style="
                          margin-bottom: 5px;
                          border: 50%;
                          margin-right: 10px;
                        "
                        :style="{
                          border: ['*'].includes(item3.toString())
                            ? 'none'
                            : '1px solid'
                        }"
                        v-for="(item3, index3) in item2.split(',')"
                        :key="index3"
                        :class="
                          drawingResult &&
                          drawingResult.length > 0 &&
                          [item3].includes(drawingResult.split(',')[index2])
                            ? 'ac-sel'
                            : ''
                        "
                      >
                        {{ item3 }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="margin-top: 10px; line-height: 20px"
                class="f-w f-t-14"
              >
                <div v-if="item.win" class="m-l-10">
                  {{ $lang.common_txt176 }}: {{ getCurrency
                  }}<span style="color: #007524">
                    {{ item.bonusAmount }}
                  </span>
                </div>
                <div
                  class="m-t-5"
                  style="
                    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
                    padding: 7px 10px;
                    border-radius: 0 0 13px 13px;
                    color: #573900;
                  "
                >
                  <span style="color: #573900; font-weight: 800"> {{ item.betTimes }} </span>
                  {{ $lang.common_txt205 }}
                  <span style="color: #573900; font-weight: 800">{{ item.potCount }}</span>
                  {{ $lang.common_txt206 }}
                  <span style="color: #573900; font-weight: 800"
                    >{{ getCurrency }} {{ item.betAmount }} </span
                  >.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bet-bot">
        <div
          class="btn1"
          @click="goToDe(1)"
          :class="{ 'lot-wiht': childOrderStatus !== 'bet_child$draw_waiting' }"
        >
          {{ $lang.common_txt126 }}
        </div>
        <div
          v-if="childOrderStatus === 'bet_child$draw_waiting'"
          class="btn2"
          @click="goToDe(2)"
        >
          {{ $lang.common_txt127 }}
        </div>
      </div>
    </div>

    <common-popup
      v-model="showPopup"
      :config="{
        content: $lang.common_txt161,
        bt1: $lang.Cancelar,
        bt2: $lang.Confirmar
      }"
      @close="close"
      @confirm="confirm"
    ></common-popup>
  </div>
</template>
<script>
import { BetDetail, CancelBet } from '@/api/common'
export default {
  name: 'bettingDetails',
  components: {},
  data() {
    return {
      memberList: [
        this.$lang.common_txt99,
        this.$lang.common_txt100,
        this.$lang.common_txt101,
        this.$lang.common_txt102,
        this.$lang.common_txt103,
        this.$lang.common_txt104,
        this.$lang.common_txt105,
        this.$lang.common_txt106,
        this.$lang.common_txt107,
        this.$lang.common_txt108,
        this.$lang.common_txt109,
        this.$lang.common_txt110
      ],
      showPopup: false,
      lotteryName: '',
      issueNo: '',
      drawingResult: [],
      mainOrderAmount: 0,
      createDate: '',
      mainOrderNo: '',
      betItemList: [],
      childOrderStatusName: '',
      lotteryType: '',
      childOrderStatus: '',
      uid: 0,
      sendAmount: 0,
      iconUrl: '',
      resultBasedOn: '',
      isRotating: false
    }
  },
  mounted() {
    this.BetDetail()
  },
  methods: {
    toggleRotation() {
      if (this.isRotating) return // 如果已经在旋转，直接返回
      this.isRotating = true
      // 动画结束后重置状态
      setTimeout(() => {
        this.isRotating = false
      }, 1000) // 动画持续时间
      this.BetDetail()
    },

    goToBin() {
      window.open(this.resultBasedOn, '_blank')
    },
    textStyle(v) {
      if (v === 'bet_child$no_win') {
        return {
          backgroundImage: `url(${require('@/assets/img/lottery/lotd_3.png')})`
        }
      } else if (v === 'bet_child$refunded_u') {
        return {
          backgroundImage: `url(${require('@/assets/img/lottery/lotd_2.png')})`
        }
      } else if (v === 'bet_child$sent') {
        return {
          backgroundImage: `url(${require('@/assets/img/lottery/lotd_1.png')})`
        }
      } else if (v === 'bet_child$refunded_s') {
        return {
          backgroundImage: `url(${require('@/assets/img/lottery/lotd_2.png')})`
        }
      } else if (v === 'bet_child$draw_waiting') {
        return {
          backgroundImage: `url(${require('@/assets/img/lottery/lotd_4.png')})`
        }
      }
    },
    getStatus(v) {
      if (v === 'bet_child$no_win') {
        return this.$lang.common_txt199
      } else if (v === 'bet_child$refunded_u') {
        return this.$lang.common_txt200
      } else if (v === 'bet_child$sent') {
        return this.$lang.common_txt201
      } else if (v === 'bet_child$refunded_s') {
        return this.$lang.common_txt202
      } else if (v === 'bet_child$draw_waiting') {
        return this.$lang.common_txt203
      }
    },
    copyText() {
      const textarea = document.createElement('textarea')
      textarea.value = this.mainOrderNo
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$toast({
        message: this.$lang.Sucesso,
        icon: 'success'
      })
    },
    onClickLeft() {
      if (this.$route.query.type === 'y') {
        this.$jumpTo(
          './lotteryDetail',
          {
            lotteryType: this.$route.query.lotteryType,
            lotteryName: this.$route.query.lotteryName
          },
          { replace: true }
        )
      } else {
        this.$router.go(-1)
      }
    },
    confirm() {
      this.CancelBet()
    },
    close() {
      this.showPopup = false
    },
    async CancelBet() {
      const data = await CancelBet({
        lotteryType: this.lotteryType,
        mainOrderNo: this.mainOrderNo,
        uid: this.uid
      })
      if (data.status === 'ok') {
        this.showPopup = false
        this.BetDetail()
      } else {
        this.$toast({
          message: data.msg,
          icon: 'cross'
        })
      }
    },
    goToDe(v) {
      if (v === 1) {
        this.$jumpTo(
          '/lotteryDetail',
          {
            lotteryType: this.lotteryType,
            lotteryName: this.lotteryName
          },
          { replace: true }
        )
      } else {
        this.showPopup = true
      }
    },
    async BetDetail() {
      const data = await BetDetail({
        childOrderNo: this.$route.query.childOrderNo,
        mainOrderNo: this.$route.query.mainOrderNo
      })
      if (data.status === 'ok') {
        this.lotteryName = data.content.lotteryName
        this.issueNo = data.content.issueNo
        // this.drawingResult = data.content.drawingResult
        //   ? JSON.parse(data.content.drawingResult).winning.split(',')
        //   : []
        this.drawingResult = data.content.drawingResult
        this.mainOrderAmount = data.content.mainOrderAmount
        this.createDate = data.content.createDate
        this.mainOrderNo = data.content.mainOrderNo
        this.betItemList = data.content.betItemList
        this.childOrderStatusName = data.content.childOrderStatusName
        this.lotteryType = data.content.lotteryType
        this.childOrderStatus = data.content.childOrderStatus
        this.uid = data.content._uid
        this.sendAmount = data.content.sendAmount
        this.iconUrl = data.content.iconUrl
        this.resultBasedOn = data.content.resultBasedOn
      }
    }
  }
}
</script>
<style lang="less" scoped>
.bet-bg {
  padding: 3% 3% 13%;
}
.bet-bg-t {
  // background: url(../../../assets/img/lottery/lotty-debg.png) no-repeat;
  // background: @cont-bg;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid rgba(233, 168, 67, 0.35);
  border-radius: 20px;
  background-size: 100% 100%;
  width: 100%;
  // height: 110px;
  margin-bottom: 10px;
  padding: 15px;
}
.bet-bg-t2 {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  font-weight: bold;
  padding: 2px 0;
  width: 100px;
  text-align: center;
  border-radius: 5px;
  color: #573900;
  font-size: 15px;
  margin-top: 5px;
}
.lot-ball {
  // background: #ffa300;
  background: url('../../../assets/img/lottery/select-q.png') no-repeat;
  // background: @cont-bg;
  border-radius: 20px;
  background-size: 100% 100%;
  width: 32px;
  height: 32px;
  color: @black-color;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
  margin-right: 10px;
}
.bet-bg-c2 {
  padding: 15px;
  border-radius: 13px;
  // background: linear-gradient(to right, #425031, #394234, #323738);
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.35);
  color: #ffe4b5;
}
.bet-bg-c3b {
  padding: 15px 0 0;
  border-radius: 13px;
  // background: linear-gradient(to right, #4b4030, #3d3b34, #313637);
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.35);
  color: #ffe4b5;
  margin-bottom: 12px;
}
.p-line {
  height: 1px;
  background: rgba(233, 168, 67, 0.25);
}
.bet-bg-c3b2 {
  margin: 15px 10px 10px 10px;
  // display: flex;
  // align-items: center;
  // flex-flow: wrap row;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(9%, 1fr));
  gap: 5px;
  justify-content: start;
  p {
    border-radius: 50%;
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid @black-color;
  }
}
.bet-bot {
  position: fixed;
  bottom: 15px;
  margin: 0 auto;
  display: flex;
  width: 94%;
  justify-content: space-between;
  .btn1 {
    // background: linear-gradient(to right, #92e778, #80e980, #6cec88);
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    border-radius: 10px;
    // border-bottom: 2px solid #2fb25d;
    width: 45%;
    padding: 15px 0;
    color: #573900;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
  }
  .btn2 {
    // background: linear-gradient(to right, #e67676, #e46060, #e14c4c);
    background: #d62945;
    border-radius: 10px;
    // border-bottom: 2px solid #b22f2f;
    width: 45%;
    padding: 15px 0;
    color: @wihte-color;
    text-align: center;
    font-size: 15px;
    font-weight: bold;
  }
}
.lot-wiht {
  width: 100% !important;
}
.lot-right {
  background: url('../../../assets/img/lottery/right-lot.png') no-repeat;
  background-size: 100% 100%;
  width: 135px;
  height: 90px;
  p {
    color: #ffa300;
    text-shadow: 1px 0 0 #7f5322, /* 右侧边框 */ -1px 0 0 #7f5322,
      /* 左侧边框 */ 0 1px 0 #7f5322, /* 下方边框 */ 0 -1px 0 #7f5322; /* 上方边框 */
    text-align: center;
    padding-top: 61px;
  }
}
.lottery-bg {
  position: sticky;
  top: 0;
  z-index: 999;
}
.lottery-title {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #15110a;
  border-bottom: 1px solid rgba(233, 168, 67, 0.3);
  padding: 0 16px;
  // box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}
.lot-gn-t {
  position: fixed;
  top: 55px;
  z-index: 9;
  right: 0;
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.35);
  color: #ffe4b5;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
  padding: 10px;
}
.ac-sel {
  background: #ed0000 !important;
  color: @wihte-color;
  border: 1px solid #ed0000 !important;
}
.ac-sel2 {
  background: url(../../../assets/img/lottery/hua_s.png) no-repeat !important;
  color: #737c7d !important;
  background-size: 100% 100% !important;
  width: 30px !important ;
  height: 30px !important;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.mili-select {
  background: url(../../../assets/img/lottery/hua.png) no-repeat;
  background-size: 100% 100%;
  width: 30px;
  height: 30px;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: @wihte-color;
}
.lot_hh {
  background: url(../../../assets/img/lottery/hua_s.png) no-repeat;
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
}
.ac-sel3 {
  color: @wihte-color;
  background: #ed0000;
  border: 1px solid #ed0000 !important;
}
.go-win {
  background: url('../../../assets/img/lottery/lot_gho.png') no-repeat;
  background-size: 100% 100%;
  width: 72px;
  color: @wihte-color;
  text-align: center;
  height: 22px;
  margin-top: -26px;
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
</style>
