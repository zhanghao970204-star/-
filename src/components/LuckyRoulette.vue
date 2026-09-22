<template>
  <div>
    <van-popup
      v-model:show="visible"
      :closeable="closeable"
      :close-icon="closeIcon"
      :overlay="overlay"
      :close-on-click-overlay="false"
      :style="{ width: '100%', height: '100%' }"
      class="custom-popup"
    >
      <div class="tra-con" style="overflow: hidden" :key="timer">
        <div style="padding-bottom: 2%">
          <div
            class="d-flex t-c"
            style="
              justify-content: flex-end;
              margin-right: 20px;
              position: relative;
            "
          >
            <div @click="goJl" style="margin-right: 25px">
              <img
                src="../assets/img/lucky_jackpot/luttory_icon.png"
                width="45"
              />
              <p class="wihte-color">{{ $lang.common_txt51 }}</p>
            </div>
            <div @click="goRl">
              <img
                src="../assets/img/lucky_jackpot/luttory_icon2.png"
                width="45"
              />
              <p class="wihte-color">{{ $lang.common_txt52 }}</p>
            </div>
          </div>
          <div v-if="showJl" class="custom-top">
            <p class="triangle2"></p>
            <div class="custom-top--i">
              <div class="d-flex-s">
                <p>
                  {{ $lang.LuckyRoulette_txt }}
                  <span class="info-color">{{
                    $formatNumberWithCommas(bonusSum)
                  }}</span>
                </p>
                <van-button
                  class="popup-button"
                  :class="{
                    active: bonusSum < (getCurrency === 'BRL' ? 100 : 15000),
                  }"
                  :disabled="bonusSum < (getCurrency === 'BRL' ? 100 : 15000)"
                  @click="getJl"
                >
                  {{ $lang.LuckyRoulette_txt2 }}
                </van-button>
              </div>
              <p class="f-t-12">
                {{ $lang.LuckyRoulette_txt3 }}
                <span class="error-color">{{ countdown }}</span>
              </p>
              <div class="d-flex m-t-10">
                <van-progress
                  :percentage="calculatedPercentage"
                  :pivot-text="`just ${
                    (getCurrency === 'BRL' ? 100 : 15000) - parseInt(bonusSum)
                  } more to receive`"
                  stroke-width="20"
                  track-color="#202A39"
                />
                <p class="m-l-5 f-t-10 m-l-10">
                  {{ $lang.common_txt53 }}
                  {{ getCurrency === "BRL" ? 100 : 15000 }}
                  {{ $lang.common_txt54 }}
                </p>
              </div>
            </div>
          </div>
          <div v-if="showRl" class="custom-bottom">
            <p class="triangle3"></p>
            <div class="custom-bottom-i">
              <van-tabs
                background="transparent"
                @click-tab="tabSelect"
                v-model:active="activeTab"
                title-inactive-color="var(--black-color)"
                title-active-color="var(--black-color)"
              >
                <van-tab
                  v-for="(item, index) in [$lang.Regras, 'meus registros']"
                  :key="index"
                >
                  <template #title>
                    <span
                      class="tab-text"
                      :class="{ 'active-color': index === activeTab }"
                      >{{ item }}</span
                    >
                  </template>
                  <div class="content-tab--c">
                    <div
                      v-if="activeTab === 0"
                      style="padding: 15px 10px; font-size: 11px"
                      v-html="$lang.LuckyRoulette_txt11"
                    ></div>
                    <div v-if="activeTab === 1">
                      <div v-if="myRecordList.length > 0" class="m-t-15">
                        <div
                          class="record-bg"
                          v-for="(item, index) in myRecordList"
                          :key="index"
                        >
                          {{
                            $dayjs(item.drawDate)
                              .format("YYYY-MM-DD")
                              .slice(8, 10) +
                            "/" +
                            $dayjs(item.drawDate)
                              .format("YYYY-MM-DD")
                              .slice(5, 7) +
                            "/" +
                            $dayjs(item.drawDate)
                              .format("YYYY-MM-DD")
                              .slice(0, 4)
                          }}
                          Loteria,Ganhar
                          <span class="info-color"
                            >{{ getCurrency
                            }}{{ $formatNumberWithCommas(item.bonusSum) }}</span
                          >
                        </div>
                      </div>
                      <van-empty
                        v-else
                        :image="require('@/assets/img/common/img_no_data.png')"
                        :description="$lang.noempt"
                      />
                    </div>
                  </div>
                </van-tab>
              </van-tabs>
            </div>
          </div>

          <div class="lettey-bg">
            <!-- <div class="content-jz"> -->
            <div class="container">
              <div
                class="turntable"
                :style="{ transform: `rotate(${currentAngle}deg)` }"
              ></div>
              <button
                class="pointer"
                :disabled="isSpinning"
                @click="startRotation"
              >
                {{ $lang.LuckyRoulette_txt5 }}
                <span style="color: #ffcd28">{{ drawCount }}</span>
                {{ $lang.LuckyRoulette_txt6 }}
              </button>
              <div v-if="isShareBtn" class="triangle"></div>
              <div
                v-if="isShareBtn"
                class="btn-share"
                style="color: var(--wihte-color)"
              >
                {{ $lang.LuckyRoulette_txt7 }}
                <p
                  class="btn-share--b"
                  style="color: white"
                  @click="shareContent"
                >
                  <img
                    src="../assets/img/lucky_jackpot/img_share.png"
                    width="15px"
                    class="m-r-10"
                  />{{ $lang.LuckyRoulette_txt8 }}
                </p>
                <p>
                  {{ $lang.LuckyRoulette_txt9 }}
                  <span class="info-color"></span>
                  {{ $lang.LuckyRoulette_txt10 }}
                </p>
                <img
                  @click="toggleRotation"
                  src="../assets/img/common/home_top_refresh.png"
                  style="
                    background: var(--primary-color2);
                    border-radius: 50%;
                    width: 17px;
                    padding: 2px;
                  "
                />
              </div>
              <!-- </div> -->
            </div>
          </div>
        </div>
        <div class="t-c">
          <img
            @click="visible = false"
            src="../assets/img/lucky_jackpot/img_cancel.png"
            width="35"
          />
        </div>
      </div>
      <van-overlay :show="showJl" @click="goJl" class="custom-overlay">
      </van-overlay>
      <van-overlay :show="showRl" @click="goRl" class="custom-overlay">
      </van-overlay>
    </van-popup>

    <van-dialog
      v-model:show="showDialog"
      title=" "
      style="width: 100%; background: transparent; border-radius: 0px"
      :showConfirmButton="false"
    >
      <div class="tc-bg">
        <img
          src="../assets/img/lucky_jackpot/img_cancel.png"
          width="35"
          style="position: absolute; right: 30px; top: 65px"
          @click="showDialog = false"
        />
        <p class="tc-bg--sum">
          {{ getCurrency }} {{ $formatNumberWithCommas(getBonusSum) }}
        </p>
        <div class="tc-bg--i" style="color: var(--wihte-color)">
          {{ $lang.LuckyRoulette_txt12 }}
          <span class="info-color"
            >{{ getCurrency }} {{ $formatNumberWithCommas(getBonusSum) }}</span
          >{{ $lang.LuckyRoulette_txt13 }}
          <span class="info-color"
            >{{ getCurrency }}
            {{ (getCurrency === "BRL" ? 100 : 15000) - getBonusSum }}</span
          >{{ $lang.LuckyRoulette_txt14 }}<span class="info-color">10</span>
          {{ $lang.LuckyRoulette_txt15 }}
          <span class="info-color">{{ getCurrency }} 10000</span>.
        </div>
      </div>

      <p class="ok-btn" @click="shareContent">
        <img
          src="../assets/img/lucky_jackpot/img_share.png"
          width="20px"
          class="m-r-10"
        />
        {{ $lang.Compartilhar }}
      </p>
    </van-dialog>
  </div>
</template>

<script>
import {
  GetLuckyRoulette,
  LuckyRoulette,
  GetLuckyRouletteRecord,
  ReceiveLuckyRouletteBonus,
} from "@/api/common";
export default {
  name: "LuckyRoulette",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭按钮
    closeable: {
      type: Boolean,
      default: false,
    },
    // 关闭按钮的图标
    closeIcon: {
      type: String,
      default: "cross",
    },
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      showJl: false,
      showRl: false,
      isShareBtn: false,
      getBonusSum: 0,
      showDialog: false,
      countdown: "00:00:00", // 初始化倒计时显示
      timer2: null, // 定时器
      timer: null,
      myRecordList: [],
      activeTab: 0,
      bonusSum: 0,
      drawCount: 0,
      visible: this.modelValue, // 内部状态
      currentAngle: 0, // 当前旋转角度
      isSpinning: false, // 是否正在旋转
      prizeCount: 6, // 奖品总数（根据实际修改）
    };
  },
  computed: {
    calculatedPercentage() {
      // 计算百分比，0 到 15000 对应 0% 到 100%
      if (this.bonusSum <= 0) {
        return 0;
      } else if (this.bonusSum >= this.getCurrency === "BRL" ? 100 : 15000) {
        return 100;
      }
      return (this.bonusSum / this.getCurrency === "BRL" ? 100 : 15000) * 100;
    },
  },
  watch: {
    // 监听外部传入的 value 值变化
    modelValue(newVal) {
      this.visible = newVal;
    },
    // 监听内部 visible 值变化，同步到外部
    visible(newVal) {
      this.$emit("update:modelValue", newVal);
    },
  },
  mounted() {
    if (this.token) {
      this.GetLuckyRoulette();
    }
    this.startCountdown();
  },
  beforeUnmount() {
    // 组件销毁时清除定时器
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  },
  methods: {
    goJl() {
      this.showJl = !this.showJl;
      // if (this.showJl) {
      //   this.showRl = false
      // }
    },
    goRl() {
      this.showRl = !this.showRl;
      // if (this.showRl) {
      //   this.showJl = false
      // }
    },
    toggleRotation() {
      this.GetLuckyRoulette();
    },
    shareContent() {
      if (navigator.share) {
        navigator
          .share({
            title: "BISONFUN",
            text: "BISONFUN",
            url:
              window.location.origin +
              "/" +
              localStorage.getItem("country") +
              "/home?id=" +
              localStorage.getItem("shareCode"),
          })
          .catch((err) => {
            console.error(err);
          });
      } else {
        alert("Your browser does not support the Web Share API.");
      }
    },
    async getJl() {
      const data = await ReceiveLuckyRouletteBonus();
      if (data.status === "ok") {
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: "success",
        });
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    startCountdown() {
      // 获取后一天早上7点的时间戳
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + 1); // 后一天
      targetDate.setHours(7, 0, 0, 0); // 设置为早上7点

      // 每秒更新一次倒计时
      this.timer2 = setInterval(() => {
        const now = new Date();
        const timeLeft = targetDate - now; // 剩余时间（毫秒）

        if (timeLeft > 0) {
          // 计算时分秒
          const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
          const seconds = Math.floor((timeLeft / 1000) % 60);

          // 格式化为两位数
          this.countdown = `${String(hours).padStart(2, "0")}:${String(
            minutes,
          ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
        } else {
          // 如果时间已过，停止倒计时
          clearInterval(this.timer2);
          this.countdown = "00:00:00";
        }
      }, 1000); // 每秒更新一次
    },
    tabSelect(i) {
      if (i === 1) {
        if (this.token) {
          this.GetLuckyRouletteRecord();
        }
        //  else {
        //   this.$router.push({ path: '/home', query: { isValue: 'isLogin' } })
        // }
      }
    },
    async GetLuckyRouletteRecord() {
      const data = await GetLuckyRouletteRecord();
      if (data.status === "ok") {
        this.myRecordList = data.content.myRecordList || [];
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    async GetLuckyRoulette() {
      const data = await GetLuckyRoulette();
      if (data.status === "ok") {
        this.bonusSum = data.content.bonusSum;
        this.drawCount = data.content.drawCount;
      }
    },
    // 模拟接口请求
    async mockApiRequest() {
      const data = await LuckyRoulette();
      // eslint-disable-next-line no-empty
      if (data.status === "ok") {
        let numbers = [1, 2, 3, 3];
        const randomIndex = Math.floor(Math.random() * numbers.length);
        this.getBonusSum = data.content.bonusSum || 0;
        return numbers[randomIndex];
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },

    // 开始旋转
    async startRotation() {
      if (this.drawCount === 0) {
        this.isShareBtn = true;
      } else {
        this.isShareBtn = false;
      }

      if (this.isSpinning) return;
      this.isSpinning = true;

      try {
        // 获取抽奖结果（替换实际接口调用）
        if (this.drawCount > 0) {
          const res = await this.mockApiRequest();
          this.rotateTurntable(res);
        } else if (!this.token) {
          this.$emit("login-key");
          console.error = (message, ...args) => {
            if (message.includes("Navigation cancelled")) {
              return; // 忽略这个特定的错误
            }
            this.$jumpTo("/home");
            console.error(message, ...args);
          };
        }
      } catch (error) {
        console.error(error);
        this.isSpinning = false;
      }
    },

    // 执行转盘旋转
    rotateTurntable(targetIndex) {
      this.GetLuckyRoulette();
      // 计算每个奖品区块角度
      const sectorAngle = 360 / this.prizeCount;

      // 目标角度 = 完整圈数 + 目标位置角度 - 校正偏差
      const fullCircles = 3 * 360; // 至少旋转3圈
      const targetAngle = fullCircles + targetIndex * sectorAngle;

      // 计算最终角度（注意要基于当前角度继续旋转）
      this.currentAngle +=
        fullCircles - (this.currentAngle % 360) + targetAngle;
      // 动画结束后恢复状态
      setTimeout(() => {
        this.isSpinning = false;
        this.showDialog = true;
        this.timer++;
        this.showDialog = true;
        // 这里可以添加中奖提示
        // this.$toast({
        //   message: `恭喜获得奖品 ${targetIndex + 1}`,
        //   icon: 'success'
        // })
      }, 4500); // 需要与CSS动画时间匹配
    },
  },
};
</script>

<style lang="less" scoped>
/* 可以在这里添加自定义样式 */
.custom-popup {
  padding-top: 3vh;
  background-color: transparent; /* 设置背景色 */
  :deep(.van-tab--active ::after) {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0px;
    margin: 0 auto;
    width: 35px;
    height: 3px; /* 设置渐变阴影的高度 */
    background: linear-gradient(to right, @info2-color, #f7ba17, @info2-color);
  }
  :deep(.van-tabs__line) {
    display: none;
  }
}

.content-jz {
  width: 300px;
  height: 320px;
  background: url("../assets/img/lucky_jackpot/zhuanpankuang2.png") no-repeat;
  background-size: 100% 100%;
  padding-top: 28px;
  margin: 0 auto;
}
.container {
  position: relative;
  width: 266px;
  height: 265px;
  // width: 70vw;
  // height: 32vh;
  margin: 0 auto;
}
.turntable {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: url("../assets/img/lucky_jackpot/zhuanpan2.png") no-repeat
    center/cover;
  transition: transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1);
}

.pointer {
  position: absolute;
  top: 29%;
  left: 34%;
  width: 95px;
  height: 105px;
  background: url("../assets/img/lucky_jackpot/anniu2.png") no-repeat;
  background-size: 100% 100%;
  z-index: 1;
  border: none;
  color: white;
  padding: 12px 10px 0 10px;
}
.btn-share {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 13px;
  padding: 10px;
  font-size: 12px;
  top: 150px;
  line-height: 15px;
  z-index: 9;
}
.custom-top {
  z-index: 99999;
  position: absolute;
  // border: 1px solid #f0d767;
  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  width: 90%;
}
.custom-top--i {
  // background: #beeeff;
  background: @wihte-color;
  border-radius: 13px;
  padding: 10px 15px;
  // color: @wihte-color;
}
.active {
  // box-shadow: 0 2px 1px #7f7f7f !important; /* 阴影效果 */
  background: linear-gradient(to right, #adadad, #a4a4a4) !important;
}
.popup-button {
  opacity: 1;
  background: linear-gradient(to right, #d62345, #d62345);
  // box-shadow: 0 2px 1px #580f1d; /* 阴影效果 */
  border: none;
  border-radius: 8px; /* 圆角 */
  font-weight: bold;
  width: 60px;
  height: 25px !important;
  color: @wihte-color;
  font-size: 12px;
}
:deep(.van-progress__pivot) {
  background-color: transparent !important;
  color: @wihte-color;
  left: 0 !important;
  width: 198px;
}
:deep(.van-progress) {
  border-radius: 10px;
  // background: #21372d;
  border: 3px solid #2a3546;
  width: 195px;
  // border: 1px solid #476057;
}
:deep(.van-progress__portion) {
  background: @primary-color2;
  width: 175px !important;
}
.custom-bottom {
  z-index: 99999;
  // border: 1px solid #f0d767;

  position: absolute;
  margin: 0 auto;
  left: 0;
  right: 0;
  width: 90%;
  :deep(.van-tabs__wrap) {
    border-radius: 12px;
    position: sticky;
    // background: #beeeff;
    background: @wihte-color;

    top: 0;
  }
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
}
.custom-bottom-i {
  // background: #beeeff;
  background: @wihte-color;
  border-radius: 13px;
  padding-bottom: 20px;
  max-height: 50vh;
  overflow-y: scroll;
  min-height: 50vh;
}

:deep(.van-tabs__nav) {
  width: 220px;
}

.record-bg {
  border-radius: 5px;
  border: 1px solid #ababab;
  padding: 5px;
  // color: @wihte-color;
  font-size: 11px;
  width: 95%;
  margin: 0 auto 10px;
}
:deep(.van-popup__close-icon) {
  color: @wihte-color;
  border: 3px solid @wihte-color;
  border-radius: 50%;
  padding: 3px;
}
:deep(.van-popup__close-icon--top-right) {
  right: 3px;
}
.tc-bg {
  width: 100%;
  height: 400px;
  background: url("../assets/img/lucky_jackpot/tc.png") no-repeat;
  background-size: 100% 100%;
  text-align: center;
  position: relative;
}
.tc-bg--sum {
  position: absolute;
  font-size: 32px;
  left: 0;
  right: 0;
  bottom: 103px;
  margin: 0 auto;
  color: @info-color;
}
.tc-bg--i {
  position: absolute;
  width: 80%;
  border: 1px solid #f0d767;
  background: linear-gradient(to right, #1f3151, #1e2532);
  border-radius: 13px;
  font-size: 12px;
  left: 0;
  right: 0;
  margin: 0 auto;
  bottom: 5px;
  text-align: left;
  line-height: 15px;
  padding: 10px;
}
.ok-btn {
  width: 45%;
  background: @primary-color2;
  border-radius: 30px;
  padding: 12px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 15px auto 0;
  color: @wihte-color;
}
.btn-share--b {
  background: @primary-color2;
  border-radius: 8px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
}
.triangle {
  top: 137px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 9;
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid rgba(0, 0, 0, 0.5); /* 透明黑色 */
}
// .tra-con {
//   transform: scale(0.8);
// }
.lettey-bg {
  background: url(../assets/img/lucky_jackpot/zhuanpankuang2.png) no-repeat;
  background-size: 100% 100%;
  height: 525px;
  padding-top: 172px;
  // height: 62vh;
  // padding-top: 20vh;
  // max-width: 450px;
  margin: 0 auto;
}
.triangle2 {
  width: 0;
  height: 0;
  border-left: 10px solid transparent; /* 左边框透明 */
  border-right: 10px solid transparent; /* 右边框透明 */
  // border-bottom: 19px solid #beeeff; /* 底边框颜色 */
  border-bottom: 19px solid @wihte-color; /* 底边框颜色 */
  margin-left: 73%;
}
.triangle3 {
  width: 0;
  height: 0;
  border-left: 10px solid transparent; /* 左边框透明 */
  border-right: 10px solid transparent; /* 右边框透明 */
  // border-bottom: 19px solid #beeeff; /* 底边框颜色 */
  border-bottom: 19px solid @wihte-color; /* 底边框颜色 */

  margin-left: 90%;
}
.custom-overlay {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
/* PC 端样式 */
@media (min-width: 769px) {
  .lettey-bg {
    height: 575px;
    padding-top: 187px;
  }
  .container {
    height: 291px;
    width: 292px;
  }
}
</style>
