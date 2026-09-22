<template>
  <div class="content">
    <title-bar :title="$lang.VIP"> </title-bar>
    <!-- <img
      src="../../../assets/img/vip/vip-bg.jpg"
      width="100%"
      style="position: relative"
    /> -->
    <div class="content-info2">
      <div style="width: 100%">
        <div class="content-info2--c d-flex">
          <div class="d-flex-s m-t-5" style="width: 100%">
            <div class="d-flex m-l-10">
              <img
                :src="vipImg(`V${InitDate2.vipLevel != null ? InitDate2.vipLevel : 0}`)"
                width="65"
                style="z-index: 9"
              />
              <div class="vip-tag">
                <p
                  class="content-info2--t"
                  style="
                    font-style: italic;
                    font-size: 25px;
                    font-weight: 900;
                    color: #e9a843;
                  "
                >
                  {{ $lang.VIP }}
                  {{ InitDate2.vipLevel }}
                </p>
              </div>
              <!-- <p style="font-weight: bold; color: #e9a843; margin-left: 12px">
                {{ $lang.common_txt }}
              </p> -->
            </div>
          </div>
        </div>
        <div class="d-flex m-l-10" style="margin-top: 5px">
          <van-progress
            class="progress-bg"
            :percentage="parseInt(percentage)"
            track-color="#2a2418"
            stroke-width="14"
            :show-pivot="false"
          />
          <div class="d-flex m-l-5">
            <img
              :src="vipImg(`V${InitDate2.vipLevel != null ? InitDate2.vipLevel + 1 : 0}`)"
              width="30"
              style="z-index: 9"
            />
            <div v-if="InitDate2.vipLevel" class="vip-tag2">
              <p class="content-info2--t">
                {{ $lang.VIP }}
                {{ InitDate2.vipLevel + 1 }}
              </p>
            </div>
          </div>
        </div>
        <p class="m-t-10 m-l-10" style="font-weight: 800; color: #e9a843">
          {{ $lang.common_txt2 }}
        </p>

        <div class="d-flex m-t-10 f-w">
          <div class="content-info2--ct m-l-10" style="color: #e9a843">
            <p>
              • {{ $lang.common_txt3 }}
              <span
                v-if="
                  InitDate2.nextRechargeAmount - InitDate2.rechargeAmount > 0
                "
                style="color: #d52d49"
                class="f-t-13 f-w m-l-5"
                >{{
                  $formatNumberWithCommas(
                    InitDate2.nextRechargeAmount - InitDate2.rechargeAmount
                  )
                }}</span
              ><span v-else style="color: #d52d49" class="f-t-13 f-w m-l-5"
                >0</span
              ><span style="color: #e9a843; margin-left: 8px"
                >({{
                  InitDate.rechargeAmount != 0
                    ? $formatNumberWithCommas(InitDate2.rechargeAmount)
                    : '0'
                }}
                /
                {{
                  InitDate2.nextRechargeAmount != 0
                    ? $formatNumberWithCommas(InitDate2.nextRechargeAmount)
                    : '0'
                }})</span
              >
            </p>
          </div>
        </div>
      </div>
    </div>
    <p style="margin: 20px 0 25px 10px; font-size: 16px; font-weight: bold">
      {{ $lang.common_txt4 }}
    </p>
    <div class="content-c3">
      <div class="content-c3--t font-color">
        <p>{{ $lang.vip_txt4 }}</p>
        <p v-html="$lang.vip_txt5"></p>
        <p v-html="$lang.vip_txt6"></p>
        <p v-html="$lang.vip_txt7"></p>
        <p v-html="$lang.vip_txt8"></p>
      </div>

      <div
        class="content-c3--t2"
        v-for="(item, index) in InitDate"
        :key="index"
        :style="(index + 1) % 2 === 0 ? {} : { backgroundColor: '#2a2418' }"
      >
        <div class="d-flex" style="width: 20%">
          <div class="d-flex">
            <img
              style="z-index: 9"
              :src="vipImg(`V${index}`)"
              width="28"
            />
            <span class="vip-tag3">VIP{{ item.vipLevel }}</span>
          </div>
        </div>

        <p>{{ $formatNumberWithCommas(item.rechargeAmount) }}</p>
        <p>{{ $formatNumberWithCommas(item.upgradeBonus) }}</p>
        <p>{{ $formatNumberWithCommas(item.signReward) }}</p>
        <p>{{ $formatNumberWithCommas(item.monthlyBonus) }}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { VipInit } from '@/api/common'
import { vipImg } from '@/utils/vipAssets'
export default {
  name: 'Vip',
  components: {},
  data() {
    return {
      InitDate: [],
      InitDate2: {},
      percentage: 0,
      percentage1: 0
    }
  },
  mounted() {
    this.VipInit()
  },
  methods: {
    vipImg,
    getBackgroundColor(i) {
      if (i === 0) {
        return {
          background: `${
            'url(' + vipImg('V0-bg.png') + ') no-repeat'
          } `
        }
      } else if ([1, 2, 3, 4].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V1-bg.png') + ') no-repeat'
          } `
        }
      } else if ([5, 6, 7, 8].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V5-bg.png') + ') no-repeat'
          } `
        }
      } else if ([9, 10, 11].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V9-bg.png') + ') no-repeat'
          } `
        }
      } else if ([12, 13, 14].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V12-bg.png') + ') no-repeat'
          } `
        }
      } else if ([15, 16].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V15-bg.png') + ') no-repeat'
          } `
        }
      } else if ([17, 18].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V17-bg.png') + ') no-repeat'
          } `
        }
      } else if ([19, 20].includes(i)) {
        return {
          background: `${
            'url(' + vipImg('V19-bg.png') + ') no-repeat'
          } `
        }
      }
    },
    async VipInit() {
      const data = await VipInit()
      if (data.status === 'ok') {
        this.InitDate = data.content.vipList || []
        this.InitDate2 = data.content
        this.percentage1 =
          this.InitDate2.betAmount > this.InitDate.nextBetAmount
            ? 100
            : (parseInt(this.InitDate2.betAmount) /
                parseInt(this.InitDate2.nextBetAmount)) *
              100
        this.percentage =
          (this.InitDate2.rechargeAmount > this.InitDate2.nextRechargeAmount
            ? 100
            : (parseInt(this.InitDate2.rechargeAmount) /
                parseInt(this.InitDate2.nextRechargeAmount)) *
              100) || 0
      }
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 5% 3%;
}
.content-c--i {
  position: relative;
  border-radius: 13px;
  padding: 16px 10px;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid rgba(233, 168, 67, 0.35);
  box-shadow: 0 0px 7px black;
  margin-bottom: 19px;
}
.content-c--img {
  position: absolute;
  right: -10px;
  top: 32px;
  z-index: 1;
}
.content-info2 {
  background: url(../../../assets/img/vip/mine-bg.png) no-repeat;
  border-radius: 12px;
  background-size: 100% 100% !important;
  width: 95%;
  padding: 8px 0;
  // position: absolute;
  // left: 0;
  // right: 0;
  margin: 20px auto 0;
  max-width: 422px;
  height: 180px;
}
.content-info2--c {
  display: flex;
  width: 100%;
}
.content-line {
  display: flex;
  background: rgba(233, 168, 67, 0.45);
  margin-top: 10px;
  height: 1px;
  width: 100%;
}
// .content-info2--t {
// color: @wihte-color;
// margin-right: 8px;
// font-style: italic;
// font-weight: bold;
//}

.content-c3 {
  width: 94%;
  margin: 0 auto 30px;
}
.content-c3--t {
  margin-top: -3px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 12px 12px 0 0;
  background: @cont-bg;
  padding: 10px 0;
  text-align: center;
  p {
    width: 20%;
  }
}
.content-c3--t2 {
  display: flex;
  flex: 1;
  text-align: center;
  align-items: center;
  justify-content: space-between;
  background: @cont-bg;
  padding-top: 3px;
  padding-bottom: 3px;
  // padding: 0 3%;
}
.content-c3--t2 img {
  object-fit: contain;
  display: block;
  margin: 0 2px 0 10px;
}
.content-c3--t2 p {
  width: 20%;
  padding: 15px 0;
  text-align: center;
}
.content-c3--t3 {
  border-radius: 0 0 15px 15px;
  height: 0px;
  background: @cont-bg;
}
// .vip-tag {
//   background: linear-gradient(to right, #676767, #525252, #676767) !important;
//   padding: 3px 15px 3px 10px;
//   border-radius: 0 5px 8px 0px;
//   margin-right: 15px;
//   margin-left: -10px;
// }
.vip-tag2 {
  background: #2a2418 !important;
  border: 1px solid rgba(233, 168, 67, 0.4);
  padding: 1px 10px;
  border-radius: 0 3px 6px 0px;
  margin-left: -10px;
  // margin-right: 10px;
  color: @wihte-color;
  font-style: italic;
  font-weight: bold;
}
.vip-tag3 {
  background: #2a2418 !important;
  border: 1px solid rgba(233, 168, 67, 0.4);
  border-radius: 0 5px 8px 0px !important;
  padding: 2px 5px 2px 8px;
  margin-left: -10px;
  color: @wihte-color;
  font-weight: bold;
  font-style: italic;
}
.content-c3 :last-child {
  border-radius: 0 0 12px 12px;
}
:deep(.van-progress) {
  border-radius: 15px;
  // border-radius: 10px;
  // background: #202447;
  width: 245px !important;

  // border: 1px solid #f6eec8;
  // padding: 1px;
}
.progress-bg {
  :deep(.van-progress__portion) {
    background: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%) !important;
    height: 12px;
    margin: 1px 2px 1px 2px;
    border-radius: 20px;
    width: 241px !important;
  }
}
</style>
