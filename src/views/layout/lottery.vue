<template>
  <div class="content">
    <div
      style="
        margin-top: 12px;
        display: grid;
        padding: 0 3%;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
      "
    >
      <div
        v-for="(item, index) in lotTabList"
        :key="index"
        class="t-c"
        @click="getLotC(index)"
      >
        <p
          class="lot-tab-icon"
          :class="{ 'active-lotL': index === selectLotIndex }"
        >
          <img
            v-if="index === 0"
            :src="
              selectLotIndex === 0
                ? require('@/assets/img/lottery/xxx_lot7.png')
                : item.img
            "
            width="25"
          />
          <img v-else :src="item.img" width="25" />
        </p>
        <p class="m-t-5" style="font-size: 11px">{{ item.name }}</p>
      </div>
    </div>

    <div class="lottery-tab2--c">
      <div v-if="selectLotIndex !== 1">
        <div>
          <div class="d-flex m-b-10">
            <img src="../../assets/img/lottery/xxx_lot2.png" width="22" />
            <p class="m-l-5 f-t-15 f-w">{{ $lang.common_txt168 }}</p>
          </div>
        </div>
        <div class="d-flex-s" style="flex-flow: row wrap">
          <div
            v-for="(item, index) in lotList2"
            :key="index"
            style="width: 49%; margin-bottom: 5px; position: relative"
            @click="goToDetail(item.lotteryType, item.lotteryName)"
          >
            <img :src="item.iconUrl" width="100%" height="100" />
            <p class="lot-issue-badge">
              {{ item.currIssueNo }}
            </p>
            <p class="lot-countdown-badge">
              {{ item.countdown || '00:00' }}
            </p>
          </div>
        </div>
      </div>
      <div v-if="[0, 1].includes(selectLotIndex)">
        <div class="d-flex m-b-10">
          <img src="../../assets/img/lottery/xx_lot.png" width="20" />
          <p class="m-l-5 f-t-15 f-w">{{ $lang.common_txt169 }}</p>
        </div>
        <div>
          <div
            class="lottery-tab2--bg"
            v-for="(item3, index3) in lotList"
            :key="index3"
            @click="goToDetail(item3.lotteryType, item3.lotteryName)"
          >
            <img
              :src="lotteryImg(`game_bg${(index3 % 3) + 1}.png`)"
              width="100%"
              style="min-height: 125px"
            />
            <div
              style="
                position: absolute;
                left: 170px;
                top: 35px;
                color: var(--wihte-color);
                font-size: 18px;
                font-weight: bold;
              "
            >
              {{ getCurrency }}
              <span style="font-size: 25px">{{ getMon(item3) }}</span>
              million
            </div>
            <div class="lottery-tab2--i2-x">
              <div class="lottery-tab2--i2">
                {{ item3.countdown || '00:00' }}
              </div>
            </div>
            <img class="lottery-tab2--i8" :src="item3.iconUrl" />
          </div>
        </div>
      </div>
    </div>
    <p class="m-l-20 f-t-15 f-w">{{ $lang.common_txt171 }}</p>
    <p class="m-l-20 m-t-5 m-b-10">{{ $lang.common_txt172 }}</p>
    <div v-if="pList.length > 0" class="jack-bg">
      <div style="width: 90%; margin: 0 auto; text-align: center">
        <div
          style="
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
          "
        >
          <div class="jack-icon-box">
            <img src="../../assets/img/lottery/lot_jb.png" width="22" />
          </div>
        </div>
        <p class="jack-title">
          {{ $lang.common_txt173 }}
        </p>
        <div
          style="display: flex; justify-content: center; align-items: center"
        >
          <div class="jack-amount-box">
            <span style="font-size: 13px">{{ getCurrency }} </span
            >{{ getToalMout() }}
          </div>
        </div>
      </div>

      <div class="m-t-20" style="padding: 0 7px">
        <div
          style="color: var(--wihte-color); justify-content: space-between"
          class="d-flex"
        >
          <p class="d-flex" style="width: 40%; padding-left: 30px">
            <img
              src="../../assets/img/lottery/lot_x1.png"
              width="12"
              class="m-r-5"
            />
            <span>{{ $lang.common_txt174 }}</span>
          </p>
          <p class="d-flex" style="width: 32%">
            <img
              src="../../assets/img/lottery/lot_x2.png"
              width="12"
              class="m-r-5"
            />
            <span>{{ $lang.common_txt175 }}</span>
          </p>
          <p class="d-flex" style="width: 28%">
            <img
              src="../../assets/img/lottery/lot_x3.png"
              width="12"
              class="m-r-5"
            />
            <span>{{ $lang.common_txt176 }}</span>
          </p>
        </div>
        <div style="height: 210px; overflow: hidden; margin-top: 5px">
          <div
            class="scroll-list"
            ref="scrollList"
            :style="{ transform: `translateY(${scrollTop}px)` }"
          >
            <div
              v-for="(item, index) in fullList"
              :key="index"
              class="d-flex-s jack-scroll-item"
              @click="goToTyepe(item)"
            >
              <p class="d-flex" style="width: 40%">
                <img
                  :src="avatarImg(getFixedAvatarIndex(item, index))"
                  width="20"
                  style="border-radius: 50%; margin-right: 5px"
                />
                <span>{{ item.userName }}</span>
              </p>
              <p style="width: 35%">{{ item.gameName }}</p>
              <p style="width: 25%">
                {{ getCurrency }} {{ $formatNumberWithCommas(item.amount) }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div style="width: 93%; margin: 20px auto">
      <p class="f-t-15 f-w m-b-10">{{ $lang.common_txt177 }}</p>
      <div
        class="lot-reslut"
        v-for="(item, index) in lotResultList"
        :key="index"
      >
        <div class="d-flex-s">
          <div class="d-flex">
            <img :src="item.iconUrl" width="40" />
            <p class="m-r-5 m-l-5 f-t-15" style="font-weight: bold">
              {{ item.lotteryName }}
            </p>
            <p
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
                ].includes(item.lotteryType)
              "
            >
              ({{ item.issueNo }})
            </p>
            <p v-else>({{ item.openResultTime.slice(0, 10) }})</p>
          </div>
          <div
            @click="goToDetail(item.lotteryType, item.lotteryName)"
            class="d-flex"
            style="color: #c83535"
          >
            <p>{{ $lang.common_txt178 }}</p>
            <van-icon name="arrow" />
          </div>
        </div>
        <p class="lot-result-divider"></p>
        <div>
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
              ].includes(item.lotteryType)
            "
            class="d-flex"
            style="flex-flow: wrap row"
          >
            <p
              class="lot-ball"
              v-for="(item2, index2) in item.lotteryResult.split(',')"
              :key="index2"
            >
              {{ item2 }}
            </p>
            <p
              class="lot-bin-btn"
              @click="goToBin(item.resultBasedOn)"
            >
              {{ $lang.common_txt181 }}
            </p>
          </div>
          <div v-else>
            <div>
              <p class="f-t-15 f-w m-b-5">winning:</p>
              <div class="d-flex" style="flex-flow: wrap row">
                <p
                  class="lot-ball"
                  v-for="(item2, index) in JSON.parse(
                    item.lotteryResult
                  ).winning.split(',')"
                  :key="index"
                >
                  {{ item2 }}
                </p>
              </div>
            </div>
            <div v-if="JSON.parse(item.lotteryResult).machine">
              <p class="f-t-15 f-w m-b-5 m-t-5">machine:</p>
              <div class="d-flex" style="flex-flow: wrap row">
                <p
                  class="lot-ball"
                  v-for="(item2, index) in JSON.parse(
                    item.lotteryResult
                  ).machine.split(',')"
                  :key="index"
                >
                  {{ item2 }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="
            ![
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
            ].includes(item.lotteryType)
          "
        >
          <p class="m-t-10 m-b-10" style="font-weight: 800">
            {{ $lang.common_txt176 }}
          </p>
          <p style="font-size: 20px; font-weight: bold">
            {{ getCurrency }} {{ getMon(item) }} {{ $lang.common_txt170 }}
          </p>
        </div>
        <div
          class="lot-history-btn"
          @click="goToDetail3(item.lotteryType, item.lotteryName)"
        >
          {{ $lang.common_txt184 }}
        </div>
      </div>
    </div>

    <div class="content-bbttom" style="padding: 20px 0 50px">
      <div style="width: 90%; margin: 0 auto">
        <img src="../../assets/img/common/logo_h.png" width="100" />
        <p class="m-t-10">
          {{ $lang.common_txt164 }}
        </p>

        <!-- <p class="content-line m-t-10"></p> -->
        <!-- <img src="../../assets/img/common/cmc_1.png" width="90%" /> -->
        <p class="content-line m-t-10"></p>
        <p class="m-t-20">{{ $lang.common_txt165 }}</p>
        <img
          class="m-t-10"
          src="../../assets/img/common/cmc_2.png"
          width="90%"
        />
        <p class="content-line m-t-10"></p>
        <img
          class="m-t-10"
          src="../../assets/img/common/cmc_3.png"
          width="100%"
        />
        <p class="content-line m-t-10"></p>
        <div class="t-c">
          <p style="font-weight: 800">{{ $lang.common_txt166 }}</p>
          <p>{{ $lang.common_txt167 }}</p>
        </div>
      </div>
    </div>
    <login v-model="showPopup3" overlay></login>
  </div>
</template>
<script>
import {
  MainInit,
  GetNGNDrawHistory,
  GetBRDrawHistory,
  GetServerDateTime,
  GetHomeWinningLottoList,
  FreshIssueInfo
} from '@/api/common'
import { avatarImg } from '@/utils/avatarAssets'
import { lotteryImg } from '@/utils/lotteryAssets'
export default {
  name: 'Lottery',
  data() {
    return {
      lotTabList: [
        {
          img: require('@/assets/img/lottery/xxx_lot6.png'),
          name: this.$lang.common_txt189
        },
        {
          img: require('@/assets/img/lottery/xx_lot.png'),
          name: this.$lang.common_txt190
        },
        {
          img: require('@/assets/img/lottery/xxx_lot2.png'),
          name: this.$lang.common_txt191
        },
        {
          img: require('@/assets/img/lottery/xxx_lot3.png'),
          name: 'TRON'
        },
        {
          img: require('@/assets/img/lottery/xxx_lot4.png'),
          name: 'ETH'
        },
        {
          img: require('@/assets/img/lottery/xxx_lot5.png'),
          name: 'BNB'
        }
      ],
      scrollTop: 0,
      timer2: null,
      itemHeight: 32,
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
      MenList: [
        {
          img: require('@/assets/img/home/men_1.png'),
          name: this.$lang.common_txt138
        },
        {
          img: require('@/assets/img/home/men_2.png'),
          name: this.$lang.common_txt139
        }
      ],
      ListLot: [
        {
          img: require('@/assets/img/lottery/lot_ico1.png'),
          cot1: this.$lang.common_txt149,
          cot2: this.$lang.common_txt150
        },
        {
          img: require('@/assets/img/lottery/lot_ico2.png'),
          cot1: this.$lang.common_txt151,
          cot2: this.$lang.common_txt152
        },
        {
          img: require('@/assets/img/lottery/lot_ico3.png'),
          cot1: this.$lang.common_txt153,
          cot2: this.$lang.common_txt154
        }
      ],
      gameValue: '',
      showPopup3: false,
      pList: [],
      dayList: [
        { id: 7, name: 'Sun' },
        { id: 1, name: 'Mon' },
        { id: 2, name: 'Tue' },
        { id: 3, name: 'Wed' },
        { id: 4, name: 'Thu' },
        { id: 5, name: 'Fri' },
        { id: 6, name: 'Sat' }
      ],
      SelectiTab: 0,
      SelectiTab2: 0,
      selectMenIndex: 0,
      lotList: [],
      lotList2: [],
      copyLotList2: [],
      tabList: [
        { icon: require('@/assets/img/lottery/tab4.png') },
        { icon: require('@/assets/img/lottery/tab1.png') },
        { icon: require('@/assets/img/lottery/tab2.png') },
        { icon: require('@/assets/img/lottery/tab3.png') }
      ],
      timer: null,
      lastList: [],
      lotResultList: [],
      dateStr: null, // 服务器时间戳（毫秒）
      globalTimer: null, // 全局定时器
      refreshing: new Map(), // 存储正在刷新的彩票类型（key: lotteryType, value: boolean）
      selectLotIndex: 0,
      hsTime2: null
    }
  },
  computed: {
    fullList() {
      return this.pList.concat(this.pList[0])
    }
  },
  async mounted() {
    await this.GetServerDateTime()
    await this.MainInit()
    this.GetHomeWinningLottoList()
    this.GetBRDrawHistory()
    this.startScroll()
    this.startGlobalTimer()
  },
  beforeUnmount() {
    this.stopScroll()
    if (this.globalTimer) {
      clearInterval(this.globalTimer)
      this.globalTimer = null
    }
  },
  methods: {
    avatarImg,
    lotteryImg,
    goToBin(v) {
      window.open(v, '_blank')
    },
    // 启动全局定时器
    startGlobalTimer() {
      if (this.globalTimer) {
        clearInterval(this.globalTimer)
      }
      // 立即更新一次
      this.updateAllCountdowns()
      // 每秒更新一次
      this.globalTimer = setInterval(() => {
        if (this.dateStr) {
          this.dateStr += 1000
        }
        this.updateAllCountdowns()
      }, 1000)
    },

    // 更新所有倒计时
    updateAllCountdowns() {
      if (!this.dateStr) return

      // 更新数字彩票列表
      this.lotList.forEach((item) => {
        this.updateSingleCountdown(item)
      })

      // 更新货币彩票列表
      this.lotList2.forEach((item) => {
        this.updateSingleCountdown(item)
      })
    },

    // 更新单个倒计时
    updateSingleCountdown(item) {
      // 无效数据处理
      if (isNaN(item.currBetEndTime) || !this.dateStr) {
        item.countdown = '00:00'
        return
      }

      const endTime = item.currBetEndTime
      const currentTime = this.dateStr
      const countdown = endTime - currentTime

      // 倒计时未结束
      if (countdown > 0) {
        item.countdown = this.formatCountdown(countdown)
        return
      }

      // 倒计时已结束且不在刷新中
      if (countdown <= 0 && !this.refreshing.has(item.lotteryType)) {
        item.countdown = '00:00'
        this.refreshSingleItem(item) // 只刷新当前过期项
      }
    },

    // 只刷新指定的过期项
    async refreshSingleItem(item) {
      const { lotteryType } = item
      // 标记为正在刷新
      this.refreshing.set(lotteryType, true)

      try {
        let old = Math.floor(Date.now() / 1000)
        // 1. 先获取最新服务器时间（确保时间准确性）
        await this.GetServerDateTime()
        // 2. 只获取当前彩票类型的最新期数信息
        const result = await FreshIssueInfo({ lotteryType })
        let olds = Math.floor(Date.now() / 1000)
        this.hsTime2 = olds - old
        // 3. 验证返回数据并更新
        if (result && result.status === 'ok' && result.content) {
          const { currBetEndTime, currIssueNo } = result.content
          const newEndTime = new Date(currBetEndTime).getTime()

          if (!isNaN(newEndTime)) {
            // 更新当前项的结束时间和期号
            item.currBetEndTime = newEndTime
            item.currIssueNo = currIssueNo // 同步更新期号
            // 立即计算新的倒计时
            this.updateSingleCountdown(item)
          }
        }
      } catch (error) {
        // console.error(`刷新${item.lotteryName}失败:`, error)
        console.log(error)
      } finally {
        // 无论成功失败，都移除刷新标记
        this.refreshing.delete(lotteryType)
      }
    },

    // 格式化倒计时（小时为00时不显示，有值时显示）
    // 格式化倒计时（小时为00时不显示，有值时显示；1分钟时从59秒开始倒计时）
    formatCountdown(ms) {
      const totalSeconds = Math.floor(ms / 1000) // 总秒数（向下取整，避免毫秒导致的误差）
      const days = Math.floor(totalSeconds / 86400)
      const hours = Math.floor((totalSeconds % 86400) / 3600)
      const minutes = Math.floor((totalSeconds % 3600) / 60)
      const seconds = totalSeconds % 60 // 修正：直接取余，无需额外加减（totalSeconds已经是向下取整的总秒数）

      const parts = []

      // 处理天数
      if (days > 0) {
        parts.push(`${days}d`)
      }

      // 处理小时（只有当小时大于0时才显示，且补零为两位）
      if (hours > 0) {
        parts.push(hours.toString().padStart(2, '0'))
      }

      // 处理分钟（始终显示，补零为两位）
      parts.push(minutes.toString().padStart(2, '0'))

      // 处理秒数（始终显示，补零为两位；1分钟时自然显示59秒）
      parts.push(seconds.toString().padStart(2, '0'))

      return parts.join(':')
    },

    // 获取服务器时间
    async GetServerDateTime() {
      try {
        const data = await GetServerDateTime()
        const timeStr = data.content.dateStr
        const newDateStr = new Date(timeStr).getTime()
        if (!isNaN(newDateStr)) {
          this.dateStr = newDateStr
        }
      } catch (error) {
        console.error('获取服务器时间失败：', error)
      }
    },

    // 其他业务方法
    getLotC(i) {
      this.selectLotIndex = i
      if (i === 3) {
        this.lotList2 = this.copyLotList2.filter((i) =>
          ['tron16x660', 'tron16x6180', 'tron16x6300', 'tron16x6600'].includes(
            i.lotteryType
          )
        )
      } else if (i === 4) {
        this.lotList2 = this.copyLotList2.filter((i) =>
          ['eth16x660', 'eth16x6180', 'eth16x6300', 'eth16x6600'].includes(
            i.lotteryType
          )
        )
      } else if (i === 5) {
        this.lotList2 = this.copyLotList2.filter((i) =>
          ['bnb16x660', 'bnb16x6180', 'bnb16x6300', 'bnb16x6600'].includes(
            i.lotteryType
          )
        )
      } else {
        this.lotList2 = this.copyLotList2.filter((i) => i.freqType === 'H')
      }
    },

    getToalMout() {
      return this.$formatNumberWithCommas(
        this.pList.reduce((sum, item) => sum + parseInt(item.amount), 0) * 878
      )
    },

    startScroll() {
      this.timer2 = setInterval(() => {
        this.scrollTop--
        if (Math.abs(this.scrollTop) >= this.pList.length * this.itemHeight) {
          this.scrollTop = 0
        }
      }, 45)
    },

    stopScroll() {
      clearInterval(this.timer2)
    },

    getFixedAvatarIndex(item, index) {
      const uniqueKey = item.id || index
      return uniqueKey % 8
    },

    async GetHomeWinningLottoList() {
      const data = await GetHomeWinningLottoList()
      this.pList = data.content.dataList
    },

    getMon(i) {
      const map = {
        '06': 2.2,
        'club-master': 3,
        super: 2.2,
        metro: 3,
        msp: 2.5,
        vag: 2.7,
        tota: 2.2,
        gold: 2.2,
        jackpot: 2.3,
        mark: 2.7,
        fairchance: 2.5,
        midweek: 3,
        fortune: 2.7,
        'premier-king': 2.6,
        national: 2.8,
        royal: 2.2,
        bonanza: 2.3,
        enugu: 2.5,
        bingo: 2.2,
        diamond: 2.5,
        international: 2.6,
        peoples: 2.7,
        'lucky-g': 2.8
      }
      return map[i.lotteryType] || 0
    },

    goToTyepe(v) {
      this.$jumpTo('/lotteryDetail', {
        lotteryType: v.lotteryType,
        lotteryName: v.gameName
      })
    },

    goToDetail3(v, v2) {
      this.$jumpTo('/latestResults', {
        lotteryType: v,
        lotteryName: v2,
        isFrom: '1'
      })
    },

    async GetBRDrawHistory() {
      const data = await GetBRDrawHistory()
      if (data.status === 'ok') {
        this.lotResultList = data.content.list
      }
    },

    async GetNGNDrawHistory() {
      const data = await GetNGNDrawHistory()
      if (data.status === 'ok') {
        this.lastList = data.content.list
      }
    },

    goToDetail(v, v2) {
      if (!this.token) {
        this.showPopup3 = true
      } else {
        this.$jumpTo('/lotteryDetail', { lotteryType: v, lotteryName: v2 })
      }
    },

    getSelectTab(i) {
      this.SelectiTab = i
      if ([1, 2, 3].includes(i)) {
        this.$toast({ message: 'Stay tuned!', icon: 'fail' })
      }
    },

    async MainInit() {
      const data = await MainInit()
      if (data.status === 'ok') {
        // 处理数字彩票列表
        this.lotList = data.content.allLotteryList
          .filter((i) => i.freqType === 'L')
          .map((item) => {
            const endTime = new Date(item.currBetEndTime).getTime()
            return {
              ...item,
              currBetEndTime: isNaN(endTime) ? null : endTime,
              countdown: '00:00'
            }
          })

        // 处理货币彩票列表
        this.lotList2 = data.content.allLotteryList
          .filter((i) => i.freqType === 'H')
          .map((item) => {
            const endTime = new Date(item.currBetEndTime).getTime()
            return {
              ...item,
              currBetEndTime: isNaN(endTime) ? null : endTime,
              countdown: '00:00'
            }
          })

        this.copyLotList2 = [...this.lotList2]
        this.updateAllCountdowns()
      }
    },

    goToHistory(v) {
      this.$jumpTo('/latestResults', {
        lotteryType: v.lotteryType,
        lotteryName: v.lotteryName
      })
    }
  }
}
</script>
<style lang="less" scoped>
@cell: #2a2418;
@card-solid: #15110a;
@muted: #a89b7c;
@gold-soft: #ffe4b5;

.content {
  padding-bottom: 16%;
}

.lot-tab-icon {
  border-radius: 10px;
  background: @cell;
  border: 1px solid fade(@border-color, 35%);
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.25);
  width: 43px;
  height: 43px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.lot-issue-badge {
  position: absolute;
  left: 10px;
  bottom: 12px;
  background: @primary-color3;
  color: @primary-text-on;
  padding: 2px 10px;
  border-radius: 15px;
}

.lot-countdown-badge {
  position: absolute;
  right: 10px;
  bottom: 8px;
  background: @primary-gradient;
  font-size: 15px;
  font-weight: bold;
  color: @primary-text-on;
  padding: 3px 5px;
  border-radius: 15px;
}

.jack-icon-box {
  background: @cell;
  border: 1px solid fade(@border-color, 40%);
  border-radius: 8px;
  width: 38px;
  height: 38px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 22px;
}

.jack-title {
  color: @gold-soft;
  font-weight: 800;
  margin: 5px 0;
  font-size: 15px;
}

.jack-amount-box {
  border: 1px solid fade(@border-color, 50%);
  border-radius: 15px;
  background: @card-solid;
  color: @wihte-color;
  font-size: 20px;
  padding: 10px 0;
  width: 260px;
  text-align: center;
}

.jack-scroll-item {
  background: @card-solid;
  margin-bottom: 8px;
  border-radius: 8px;
  padding: 5px 15px 5px 5px;
  border: 1px solid fade(@border-color, 30%);
  color: @gold-soft;
  font-size: 13px;
  font-weight: bold;
  text-align: left;
}

.lot-result-divider {
  height: 1px;
  background: fade(@border-color, 35%);
  margin-bottom: 10px;
  margin-top: 5px;
}

.lot-bin-btn {
  background: @primary-gradient;
  color: @primary-text-on;
  height: 30px;
  width: 70px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-left: 20px;
  margin-bottom: 5px;
}

.lot-history-btn {
  margin-top: 10px;
  border: 1px solid @border-color;
  border-radius: 20px;
  width: 220px;
  padding: 10px 0;
  text-align: center;
  font-weight: 800;
  color: @primary-color;
}

.lottery-tab {
  width: 93%;
  margin: 10px auto;
  display: flex;
  justify-content: space-between;
  background: @cont-bg;
  border-radius: 13px;
  padding: 3px 10px;
}
.lottery-tab--i {
  width: 22%;
  border-radius: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px 0;
}
.select-active {
  background: @primary-color;
}
.lottery-tab2 {
  margin-top: 10px;
  width: 100%;
  display: flex;
  align-items: center;
  color: @title-color;
}
.lottery-tab2--i {
  width: 14.3%;
  text-align: center;
  padding: 8px 0;
  border-bottom: 1px solid fade(@border-color, 25%);
  font-weight: bold;
}
.select-active2 {
  background: url(../../assets/img/lottery/select-day.png) no-repeat;
  background-size: 100% 100%;
  height: 100%;
  border-bottom: none;
  color: @wihte-color;
}
.lottery-tab2--c {
  padding: 10px;
}
.lottery-tab2--bg {
  position: relative;
  width: 100%;
  border-radius: 13px;
}
.lottery-tab2--i1 {
  position: absolute;
  top: 15px;
  left: 20px;
  font-size: 15px;
  font-weight: bold;
}
.lottery-tab2--i2-x {
  position: absolute;
  top: 70px;
  left: 170px;
  color: @primary-color;
  font-size: 15px;
  font-weight: bold;
}
.lottery-tab2--i3 {
  position: absolute;
  background: @cell;
  top: 40px;
  left: 20px;
  border-radius: 8px 15px 15px 0;
  padding: 3px 10px;
  z-index: 2;
  font-size: 10px;
}
.lottery-tab2--i4 {
  background: @primary-gradient;
  font-weight: bold;
  border-radius: 7px;
  padding: 9px 0;
  font-size: 15px;
  color: @primary-text-on;
  width: 115px;
  text-align: center;
}
.lottery-tab2--i5 {
  position: absolute;
  background: @cell;
  top: 40px;
  left: 145px;
  border-radius: 8px 15px 15px 0;
  padding: 3px 10px;
  z-index: 2;
  font-size: 10px;
}
.lottery-tab2--i6 {
  position: absolute;
  bottom: 55px;
  left: 20px;
}
.lottery-tab2--i7 {
  position: absolute;
  left: 20px;
  bottom: 18px;
  p {
    background: url('../../assets/img/lottery/select-q.png') no-repeat;
    background-size: 100% 100%;
    width: 32px;
    height: 32px;
    color: @black-color;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 13px;
    font-weight: bold;
  }
}
.lottery-tab2--i8 {
  position: absolute;
  top: 18px;
  width: 90px;
  left: 30px;
}
.lottery2-tab2--bg {
  position: relative;
  width: 92%;
  margin: 0 auto;
}
.lottery2-tab2--i1 {
  position: absolute;
  top: 19px;
  left: 20px;
  font-size: 26px;
  font-weight: bold;
  width: 145px;
  line-height: 32px;
}
.lottery2-tab2--i2 {
  position: absolute;
  background: url(../../assets/img/lottery/lz2.png);
  font-weight: bold;
  border-radius: 7px;
  top: 110px;
  left: 20px;
  padding: 12px 0;
  font-size: 15px;
  width: 135px;
  text-align: center;
}
.lottery2-tab2--i4 {
  position: absolute;
  background: @primary-gradient;
  font-weight: bold;
  border-radius: 7px;
  top: 165px;
  left: 20px;
  padding: 12px 0;
  font-size: 15px;
  width: 135px;
  color: @primary-text-on;
  text-align: center;
}
.lottery2-tab2--i6 {
  position: absolute;
  color: @title-color;
  bottom: 148px;
  left: 20px;
  font-weight: bold;
}
.lottery2-tab2--i7 {
  position: absolute;
  left: 20px;
  bottom: 97px;
  p {
    background: url('../../assets/img/lottery/select-q.png') no-repeat;
    background-size: 100% 100%;
    width: 40px;
    height: 40px;
    color: @black-color;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 13px;
    font-size: 15px;
    font-weight: bold;
  }
}
.lottery2-tab2--i8 {
  position: absolute;
  right: 15px;
  top: 40px;
  width: 140px;
}
.lottery2-tab2--i9 {
  position: absolute;
  width: 97%;
  height: 1px;
  bottom: 83px;
  background: fade(@border-color, 30%);
  left: 5px;
}
.custom-button-xg {
  width: 89%;
  position: absolute;
  bottom: 23px;
  left: 20px;
  box-shadow: none;
}
.img-0 {
  width: 50px;
  height: 30px;
}
.img-1 {
  width: 60px;
  height: 30px;
}
.img-2 {
  width: 60px;
  height: 30px;
}
.img-3 {
  width: 30px;
  height: 30px;
}
.jack-bg {
  background: url(../../assets/img/lottery/lottHis.png) no-repeat;
  background-size: 100% 100%;
  width: 93%;
  margin: 0 auto;
  border-radius: 13px;
  height: 400px;
}
.lot-qbg {
  background: url('../../assets/img/lottery/select-q.png') no-repeat;
  background-size: 100% 100%;
  width: 25px;
  height: 25px;
  color: @black-color;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 5px;
}
.select-Men {
  background: @primary-gradient !important;
  color: @primary-text-on !important;
  border-bottom: 1px solid @border-color !important;
}
.content-line {
  margin: 15px auto;
  width: 100%;
  height: 1px;
  background: fade(@border-color, 40%);
  opacity: 0.7;
}
.lot-reslut {
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid fade(@border-color, 30%);
  border-radius: 10px;
  padding: 10px 10px;
  box-shadow: -2px 5px 10px rgba(0, 0, 0, 0.35);
  margin-bottom: 10px;
  color: @wihte-color;
}
.lot-ball {
  background: url('../../assets/img/lottery/select-q.png') no-repeat;
  border-radius: 20px;
  background-size: 100% 100%;
  width: 32px;
  height: 32px;
  color: @black-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 5px;
}
.lot_hh {
  background: url(../../assets/img/lottery/hua_s.png) no-repeat;
  width: 32px;
  height: 32px;
  background-size: 100% 100%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
.scroll-list {
  transition: transform 0.5s linear;
}
.active-lotL {
  background: @primary-gradient !important;
  border-color: @border-color !important;
}
</style>
