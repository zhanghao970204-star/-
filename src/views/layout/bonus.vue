<template>
  <div class="content">
    <div id="md-hddb2"></div>
    <!-- <img class="content-info" src="../../assets/img/bonus/bonus1.png" /> -->
    <div style="padding: 0 3% 15%">
      <div
        v-for="(item, index) in bonusData"
        :key="index + 'a'"
        @click="goDetail(index)"
        style="
          /* background: var(--popup-bg); */
          border-radius: 13px;
          /* box-shadow: 0 0px 1px 1px rgba(0, 0, 0, 0.1); */
        "
      >
        <div
          class="content-info2--img"
          :style="`background-image: url(${item.img});`"
        >
          <div
            style="
              display: flex;
              justify-content: space-between;
              flex-flow: column;
              height: 100%;
              padding: 20px 0 10px 20px;
            "
          >
            <div>
              <p
                style="font-size: 15px; font-weight: 800; line-height: 15px"
                class="m-b-10"
                v-html="item.tex1"
              ></p>
              <p style="color: #a89b7c" v-html="item.text2"></p>
            </div>
            <div class="d-flex">
              <img :src="item.img2" width="33" />
              <p class="m-l-10 f-w" style="color: #a89b7c">{{ item.name }}</p>
            </div>
          </div>
          <!-- <van-button size="large" class="popup-button1">Detalhes </van-button> -->
        </div>
        <!-- <div
          class="d-flex f-t-15 f-w"
          style="justify-content: space-between; padding: 3%"
        >
          <div class="d-flex">
            <img :src="item.img2" width="33" class="m-r-10" />
            <p style="color: rgba(0, 0, 0, 0.85)">{{ item.name }}</p>
          </div>
          <p
            style="
              background: #2a2418;
              padding: 10px 7px;
              border-radius: 8px;
              color: var(--wihte-color);
            "
          >
            {{ $lang.common_txt6 }}
          </p>
        </div> -->
      </div>
    </div>

    <lucky-roulette v-model="showPopup" overlay></lucky-roulette>
  </div>
</template>
<script>
// import { Init } from '@/api/common'
export default {
  name: 'Bonus',
  components: {},
  data() {
    return {
      showPopup: false,
      bonusData: [
        // {
        //   img: require('@/assets/img/bonus/bonus12.png'),
        //   img2: require('@/assets/img/share/total_recharge.png'),
        //   name: this.$lang.common_txt20
        // },
        {
          img: require('@/assets/img/bonus/bonus2.png'),
          img2: require('@/assets/img/share/wheelof_fortune.png'),
          name: this.$lang.common_txt16,
          tex1: this.$lang.common_txt230,
          text2: this.$lang.common_txt231
        },
        {
          img: require('@/assets/img/bonus/bonus3.png'),
          img2: require('@/assets/img/share/recharge_bargain_sales.png'),
          name: this.$lang.common_txt11,
          tex1: this.$lang.common_txt238,
          text2: this.$lang.common_txt239
        },
        {
          img: require('@/assets/img/bonus/bonus4.png'),
          img2: require('@/assets/img/share/box.png'),
          name: this.$lang.common_txt10,
          tex1: this.$lang.common_txt232,
          text2: this.$lang.common_txt233
        },
        {
          img: require('@/assets/img/bonus/bonus5.png'),
          img2: require('@/assets/img/share/game_benefit.png'),
          name: this.$lang.common_txt15,
          tex1: this.$lang.common_txt228,
          text2: this.$lang.common_txt229
        },
        {
          img: require('@/assets/img/bonus/bonus6.png'),
          img2: require('@/assets/img/share/global_wash_chip.png'),
          name: this.$lang.common_txt12,
          tex1: this.$lang.common_txt240,
          text2: this.$lang.common_txt241
        },
        {
          img: require('@/assets/img/bonus/bonus7.png'),
          img2: require('@/assets/img/share/red_envelope_rain.png'),
          name: this.$lang.common_txt13,
          tex1: this.$lang.common_txt236,
          text2: this.$lang.common_txt237
        },
        {
          img: require('@/assets/img/bonus/bonus8.png'),
          img2: require('@/assets/img/share/agent_commission.png'),
          name: this.$lang.common_txt17,
          tex1: this.$lang.common_txt242,
          text2: this.$lang.common_txt243
        },
        {
          img: require('@/assets/img/bonus/bonus10.png'),
          img2: require('@/assets/img/share/user_rank.png'),
          name: this.$lang.common_txt18,
          tex1: this.$lang.common_txt234,
          text2: this.$lang.common_txt235
        },
        {
          img: require('@/assets/img/bonus/bonus9.png'),
          img2: require('@/assets/img/share/mystery.png'),
          name: this.$lang.common_txt19,
          tex1: this.$lang.common_txt244,
          text2: this.$lang.common_txt245
        }
      ]
    }
  },
  methods: {
    // async Init() {
    //   const data = await Init()
    //   // eslint-disable-next-line no-empty
    //   if (data.status === 'ok') {
    //   }
    // },
    goDetail(i) {
      // 1. 通过 id 获取目标元素
      const target = document.getElementById('md-hddb2')
      if (!target) return // 防止 id 不存在报错
      target.scrollIntoView({
        behavior: 'auto', // 滚动行为：smooth（平滑）/ auto（瞬间，默认）
        block: 'start', // 对齐方式：start（顶部对齐）/ center（居中）/ end（底部对齐）
        inline: 'nearest' // 水平对齐（默认即可）
      })
      if (i === 0) {
        this.showPopup = true
      } else if (i === 1) {
        this.$jumpTo('/activityFistRecharge')
      } else if (i === 2) {
        this.$jumpTo('/referFriend')
      } else if (i === 3) {
        this.$jumpTo('/cashBack')
      } else if (i === 4) {
        this.$jumpTo('/teamRebates')
      } else if (i === 5) {
        this.$jumpTo('/redPacket')
      } else if (i === 6) {
        if (!this.token) {
          this.$jumpTo('/home', { isValue: 'isLogin' })
        } else {
          this.$jumpTo('/share')
        }
      } else if (i === 7) {
        this.$jumpTo('/signIn')
      } else if (i === 8) {
        this.$jumpTo('/vipSignIn')
      }
    }
  },
  mounted() {
    // this.Init()
  }
}
</script>
<style lang="less" scoped>
.content {
  // background: @background-color;
  padding-top: 20px;
}
.content-info {
  width: 100%;
  border-radius: 10px;
}
.popup-button1 {
  color: @black-color;
  border-radius: 10px; /* 圆角 */
  font-weight: bold;
  margin-top: 135px;
  margin-left: 20px;
  width: 120px;
  height: 35px;
  background: @info-color;
  border: none;
}

.content-info2--img {
  background-image: url('../../assets/img/bonus/invite_friends.png'); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 100%; /* 或者指定具体的宽度 */
  height: 150px;
  border-radius: 13px 13px 0 0;
  margin-bottom: 10px;
}
</style>
