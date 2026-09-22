<template>
  <div class="content">
    <div class="crowd-title">
      <van-icon
        name="arrow-left"
        @click.stop="onClickLeft"
        size="20"
        color="var(--wihte-color)"
      />
      <p class="f-w" style="font-size: 16px">
        {{ $lang.common_txt319 }}
      </p>
      <p @click="gotoRecord">{{ $lang.common_txt256 }}</p>
    </div>
    <div class="Crowdfunding">
      <div>
        <div class="d-flex" style="padding: 10px 30px">
          <img src="../../assets/img/otgame/gantanhao.png" />
          <p class="m-l-10 crowd-tip">
            {{ $lang.common_txt320 }}
          </p>
        </div>

        <div class="crowd_rotate_img">
          <img
            src="../../assets/img/otgame/pinduoduo_7.png"
            width="100%"
            style="max-height: 460px"
          />
        </div>

        <div class="turntable-wrapper">
          <div class="lettey-bg">
            <div
              class="turntable-bg-s"
              :style="{
                background: `url(${bgImages[currentBgIndex]}) no-repeat`,
                transition: 'background 0.3s ease',
              }"
            ></div>

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
              <!-- <div v-if="isShareBtn" class="triangle"></div>
              <div v-if="isShareBtn" class="btn-share" style="color: var(--wihte-color)">
                {{ $lang.LuckyRoulette_txt7 }}
                <p
                  class="btn-share--b"
                  style="color: white"
                  @click="shareContent"
                >
                  <img
                    src="../../assets/img/lucky_jackpot/img_share.png"
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
                  src="../../assets/img/common/home_top_refresh.png"
                  style="
                    background: var(--primary-color2);
                    border-radius: 50%;
                    width: 17px;
                    padding: 2px;
                  "
                />
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div class="d-flex m-t-20" style="justify-content: center">
        <img src="../../assets/img/otgame/pdd_shalou1.png" width="20" />
        <span class="f-t-15 m-l-5 crowd-countdown__label">
          {{ $lang.common_txt321 }}
        </span>
        <span class="crowd-countdown__time">{{ countdown }}</span>
      </div>
      <div class="crowdlist" style="padding: 10px">
        <div class="scroll_invites d-flex" style="justify-content: center">
          <img src="../../assets/img/otgame/pdd_xian_L.png" width="33%" />
          <span style="margin: 0 10px">{{ $lang.common_txt322 }}</span>
          <img src="../../assets/img/otgame/pdd_xian_R.png" width="33%" />
        </div>
        <div class="scroll_ranking">
          <div class="scroll_ranking_title d-flex-s">
            <p
              v-for="(item, index) in [
                $lang.common_txt323,
                $lang.common_txt324,
                $lang.common_txt325,
              ]"
              :key="index"
            >
              {{ item }}
            </p>
          </div>
          <div class="scroll_ranking_sroll">
            <div
              class="d-flex-s m-b-10"
              style="padding: 5px 43px 5px 30px"
              v-for="(item, index) in myRecordList"
              :key="index"
            >
              <span>{{ index + 1 }}</span>
              <span>
                {{
                  $dayjs(item.drawDate).format("YYYY-MM-DD").slice(8, 10) +
                  "/" +
                  $dayjs(item.drawDate).format("YYYY-MM-DD").slice(5, 7) +
                  "/" +
                  $dayjs(item.drawDate).format("YYYY-MM-DD").slice(0, 4)
                }}</span
              >
              <span>{{ item.bonusSum }}</span>
            </div>
            <div
              v-if="myRecordList.length === 0"
              style="text-align: center; margin-top: 20px"
            >
              {{ $lang.common_txt326 }}
            </div>
          </div>
        </div>

        <div class="crowd-divider">
          <span>-------------</span>
          <span class="m-l-5 m-r-5 f-t-15"> {{ $lang.common_txt327 }} </span>
          <span>-------------</span>
        </div>
        <div class="crowd-rules" v-html="$lang.LuckyRoulette_txt11"></div>
      </div>
    </div>
    <login v-model="showPopup" overlay></login>
  </div>
</template>

<script>
import {
  GetLuckyRoulette,
  LuckyRoulette,
  GetLuckyRouletteRecord,
} from "@/api/common";

export default {
  name: "Crowdfunding",
  components: {},
  data() {
    return {
      myRecordList: [],
      showPopup: false,
      // 大转盘相关数据
      isShareBtn: false,
      bonusSum: 0,
      drawCount: 0,
      currentAngle: 0, // 当前旋转角度
      isSpinning: false, // 是否正在旋转
      prizeCount: 6, // 奖品总数（根据实际修改）
      getBonusSum: 0,
      // 背景图片切换相关
      bgImages: [
        require("@/assets/img/otgame/pinduoduo_11.png"),
        require("@/assets/img/otgame/pinduoduo_12.png"),
      ],
      currentBgIndex: 0, // 当前显示的图片索引
      bgSwitchTimer: null, // 定时器标识
      // 新增：倒计时相关数据
      countdown: "00:00:00", // 初始化倒计时显示
      timer2: null, // 倒计时定时器
    };
  },
  methods: {
    gotoRecord() {
      this.$jumpTo("/recordOrder");
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
    onClickLeft() {
      this.$router.go(-1);
    },
    // 新增：倒计时核心方法
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
    // 切换背景图片的方法
    switchBackgroundImage() {
      // 切换到下一张图片，循环切换
      this.currentBgIndex = (this.currentBgIndex + 1) % this.bgImages.length;
    },
    // 大转盘相关方法
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
      if (!this.token) {
        this.showPopup = true;
        return;
      }
      if (this.drawCount === 0) {
        this.$jumpTo("/Alliance");
        return;
      }

      // if (this.drawCount === 0) {
      //   this.isShareBtn = true
      // } else {
      //   this.isShareBtn = false
      // }

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
        // 移除了中奖弹窗相关代码
      }, 4500); // 需要与CSS动画时间匹配
    },
  },
  mounted() {
    // 组件挂载时获取转盘数据
    if (this.token) {
      this.GetLuckyRoulette();
      this.GetLuckyRouletteRecord();
    }

    // 启动背景图片切换定时器，修改为500毫秒切换一次
    this.bgSwitchTimer = setInterval(() => {
      this.switchBackgroundImage();
    }, 500);

    // 新增：启动倒计时
    this.startCountdown();
  },
  beforeUnmount() {
    // 组件卸载时清除定时器，防止内存泄漏
    if (this.bgSwitchTimer) {
      clearInterval(this.bgSwitchTimer);
    }
    // 新增：清除倒计时定时器
    if (this.timer2) {
      clearInterval(this.timer2);
    }
  },
};
</script>

<style lang="less" scoped>
/* y7 黑金风格 */
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@muted: #a89b7c;
@card: #15110a;
@cell: #2a2418;

.content {
  min-height: 100vh;
  background: @bg;
  color: #fff;
}

.Crowdfunding {
  background: @bg;
  padding-bottom: 24px;
}

.crowd-tip {
  color: @gold;
  line-height: 18px;
}

.crowd-countdown__label {
  color: @muted;
}

.crowd-countdown__time {
  color: @gold;
  font-size: 18px;
  margin-left: 5px;
  font-weight: 700;
}

.crowd-divider {
  display: flex;
  justify-content: center;
  margin-top: 20px;
  color: @gold-deep;
}

.crowd-rules {
  padding: 10px;
  color: @muted;
  line-height: 1.5;
}

.scroll_ranking_sroll {
  background: @card;
  border: 1px solid fade(@gold-deep, 25%);
  height: 150px;
  width: 94%;
  margin: 0 auto;
  border-radius: 10px;
  overflow: auto;
  padding: 10px 0;
  color: @gold-soft;
}
.scroll_ranking {
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid fade(@gold, 35%);
  border-radius: 12px;
  color: @muted;
  padding-bottom: 10px;
  margin: 0 4px;
  overflow: hidden;
}
.scroll_ranking_title {
  padding: 5px 30px 10px;
  border-top: 1px solid fade(@gold-deep, 25%);
  color: @gold-soft;
  font-weight: 600;
}
.scroll_invites {
  background: url(../../assets/img/otgame/pdd_di.png) no-repeat;
  height: 45px;
  background-size: 100% 100%;
  color: @gold-soft;
  font-weight: 700;
}
.crowd-title {
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: rgba(31, 28, 23, 0.96);
  border-bottom: 1px solid fade(@gold-deep, 30%);
  padding: 0 16px;
  position: sticky;
  z-index: 999999;
  top: 0;
  backdrop-filter: blur(8px);

  p:last-child {
    color: @gold-deep;
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
}

// 旋转背景图样式 - 保留原动画，作为底层背景
.crowd_rotate_img {
  margin-top: 50px;
  width: 100%;
  position: relative;
  z-index: 1; /* 层级低于转盘 */
  img {
    animation: rotate 10s linear infinite;
    transform-origin: center center;
  }
}

// 大转盘外层容器 - 调整位置，避免覆盖标题栏
.turntable-wrapper {
  position: relative;
  width: 100%;
  z-index: 2; /* 保持层级高于背景图 */
  display: flex;
  justify-content: center;
  align-items: center;
  // padding-top: 40px; /* 保留顶部内边距，避免和标题栏太近 */
  margin-top: -546px;
}

// 大转盘样式
.lettey-bg {
  background: url(../../assets/img/lucky_jackpot/zhuanpankuang2.png) no-repeat;
  background-size: 100% 100%;
  height: 525px;
  padding-top: 172px;
  margin: 30px auto 0;
  width: 100%;
  max-width: 390px;
  position: relative;
}

.container {
  position: relative;
  width: 266px;
  height: 265px;
  margin: 0 auto;
}

.turntable {
  margin-top: -277px;
  width: 100%;
  height: 98%;
  border-radius: 50%;
  background: url("../../assets/img/lucky_jackpot/zhuanpan2.png") no-repeat
    center/cover;
  transition: transform 4.5s cubic-bezier(0.25, 0.1, 0.25, 1);
  margin-left: 1px;
}

.pointer {
  position: absolute;
  top: 29%;
  left: 34%;
  width: 95px;
  height: 105px;
  background: url("../../assets/img/lucky_jackpot/anniu2.png") no-repeat;
  background-size: 100% 100%;
  z-index: 3; /* 按钮层级最高 */
  border: none;
  color: white;
  padding: 12px 10px 0 10px;
  cursor: pointer;
}

.btn-share {
  position: absolute;
  background: rgba(21, 17, 10, 0.92);
  border: 1px solid fade(@gold-deep, 40%);
  border-radius: 13px;
  padding: 10px;
  font-size: 12px;
  top: 150px;
  line-height: 15px;
  z-index: 3;
  color: @gold-soft;
}

.triangle {
  top: 137px;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0 auto;
  z-index: 3;
  position: absolute;
  width: 0;
  height: 0;
  border-left: 10px solid transparent;
  border-right: 10px solid transparent;
  border-bottom: 13px solid fade(@gold-deep, 55%);
}

.btn-share--b {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900 !important;
  font-weight: 700;
  border-radius: 8px;
  padding: 5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 110px;
  cursor: pointer;
}
.turntable-bg-s {
  height: 295px;
  width: 77%;
  margin: -16px auto 0;
  background-size: 100% 100% !important;
  transition: background 0.3s ease;
}

// 定义旋转关键帧
@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
