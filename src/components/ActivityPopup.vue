<template>
  <div>
    <van-popup
      v-model:show="visible"
      :closeable="closeable"
      :close-icon="closeIcon"
      :overlay="overlay"
      :close-on-click-overlay="false"
      :style="{ width: '100%' }"
      class="custom-popup"
    >
      <div class="act-cont" style="position: relative">
        <img src="../assets/img/common/first-hdbg.png" width="100%" />
        <!-- <img class="act-cont--an" src="../assets/img/common/anniu_bg.png" />
          -->
        <p @click="goToRec(1)" class="act-cont--an">{{ $lang.Receber }}</p>
        <!-- <div class="act-cont-b">
          <p class="f-t t-c">{{ $lang.ActivityPopup_txt }}</p>
        </div>
        <div style="padding: 20px">
          <div class="d-flex-s">
            <div class="d-flex">
              <img src="../assets/img/home/home_i1.png" width="40" />
              <div class="m-l-10 l-h-20">
                <p>{{ $lang.ActivityPopup_txt2 }}</p>
                <p class="info2-color">{{ $lang.ActivityPopup_txt3 }}</p>
              </div>
            </div>
            <van-button
              size="large"
              class="custom-button"
              style="box-shadow: none; border-bottom: 0 !important"
              @click="goToRec(1)"
              :class="{
                active: receiveStatus !== 1 && token && token.length > 1
              }"
              :disabled="receiveStatus !== 1 && token && token.length > 1"
            >
              {{ $lang.Receber }}
            </van-button>
          </div>
          <p class="act-line"></p>
          <div class="d-flex-s" @click="goToRec(2)">
            <div class="d-flex">
              <img src="../assets/img/home/home_i2.png" width="40" />
              <div class="m-l-10 l-h-20">
                <p>{{ $lang.bonus_title2 }}</p>
                <p class="info2-color">{{ $lang.ActivityPopup_txt4 }}</p>
              </div>
            </div>

            <van-button size="large" class="custom-button">
              {{ $lang.ActivityPopup_txt5 }}
            </van-button>
          </div>
        </div> -->
      </div>
      <img
        @click="closeF()"
        src="../assets/img/lucky_jackpot/img_cancel.png"
        width="38"
      />
    </van-popup>
    <login v-model="showPopup2" overlay></login>
  </div>
</template>

<script>
import {
  ActivityreceiveRegisterAward,
  ActivitygetRegisterAward,
} from "@/api/common";

export default {
  name: "ActivityPopup",
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
      // isContentVisible: false,
      showPopup2: false,
      receiveStatus: 0,
      agree: false,
      agree2: false,
      visible: this.modelValue, // 内部状态
    };
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
    // 使用 Math.random() 生成 0 到 1 之间的随机数
    // this.isContentVisible = Math.random() < 0.4 // 如果随机数小于 0.3，则显示内容
    if (this.token) {
      this.ActivitygetRegisterAward();
    }
  },
  methods: {
    closeF() {
      if (this.agree) {
        // 今日不显示
        const today = new Date().toISOString().split("T")[0];
        sessionStorage.setItem("neverShowToday", today);
      }
      if (this.agree2) {
        // 永久不显示
        localStorage.setItem("neverShow", true);
      }
      this.visible = false;
      this.$emit("closeActive2");
    },
    goToRec(i) {
      if (i === 1) {
        if (this.token) {
          this.ActivityreceiveRegisterAward();
        } else {
          this.visible = false;
          this.showPopup2 = true;
          this.$emit("closeActive");
        }
      }
      if (i === 2) {
        this.$jumpTo("/activityFistRecharge");
        this.visible = false;
      }
      if (i === 3) {
        this.$jumpTo("/vipSignIn");
        this.visible = false;
      }
    },
    async ActivitygetRegisterAward() {
      const data = await ActivitygetRegisterAward();
      if (data.status === "ok") {
        this.receiveStatus = data.content.receiveStatus;
        this.visible = false;
      }
    },
    async ActivityreceiveRegisterAward() {
      const data = await ActivityreceiveRegisterAward();
      if (data.status === "ok") {
        this.ActivitygetRegisterAward();
        this.$toast({
          message: this.$lang.bonus_txt16,
          icon: "success",
        });
        this.$bus.emit("refsh-amount");
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    goTod() {
      this.$jumpTo("/firstRegister", {}, { replace: true });
    },
    goTo(i) {
      if (i === 1) {
        window.open("https://t.me/OTgamel", "_blank");
      } else if (i === 2) {
        window.open(
          "https://www.whatsapp.com/channel/0029Vb5HTBy59PwNwLET3e20",
          "_blank",
        );
      } else {
        const downloadUrl =
          "https://file.otgame.bet/download/otlotter_V1.0.0.apk";
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = "otlotter_V1.0.0.apk"; // 可以指定下载后的文件名
        link.style.display = "none"; // 隐藏链接
        document.body.appendChild(link);
        link.click(); // 触发点击事件
        document.body.removeChild(link); // 移除临时链接
      }
    },
  },
};
</script>

<style lang="less" scoped>
.activity-bg {
  background: url(../assets/img/home/activity-bg.png);
  width: 100%;
  height: 455px;
  background-size: 100% 100%;
  position: relative;
  .activity-bg--i {
    position: absolute;
    opacity: 0.8;
    height: 70px;
    width: 88%;
    top: 360px;
    margin: 0 auto;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    p {
      width: 28%;
    }
  }
}
.custom-popup {
  background: transparent;
  text-align: center;
  z-index: 2003 !important;
  .van-overlay {
    z-index: 2000 !important;
  }
}
.act-cont-b {
  background: url(../assets/img/home/home_acBg.png) no-repeat;
  background-size: 100% 100%;
  height: 230px;
  padding-top: 15px;
  font-size: 25px;
  text-shadow:
    -1px -1px 0 @black-color,
    1px -1px 0 @black-color,
    -1px 1px 0 @black-color,
    1px 1px 0 @black-color; /* 四个方向的阴影，形成描边效果 */
}
.act-cont {
  // background: #123454;
  background: transparent;

  // padding: 20px 15px 15px 15px;
  text-align: left;
  margin: 0 auto;
  // width: 93%;
  border-radius: 15px;
  :deep(.van-checkbox__icon .van-icon) {
    border: none;
  }
  :deep(.van-checkbox__icon--checked .van-icon) {
    background-color: @primary-color3 !important;
  }
}

.custom-button {
  width: 75px;
  height: 35px;
  border-radius: 10px;
  font-size: 14px;
}
.active {
  // box-shadow: 0 4px 1px #4a4a4a !important; /* 阴影效果 */
  background: #9b9b9b !important;
  // border-bottom: 0px solid #494949 !important;
}
.act-line {
  height: 2px;
  background: linear-gradient(
    to right,
    fade(@border-color, 20%),
    @border-color,
    fade(@border-color, 20%)
  );
  margin: 20px 0;
}
.act-cont--an {
  position: absolute;
  width: 29%;
  margin: 0 auto;
  left: 0;
  right: 0;
  top: 85%;
  animation: breathe 2s ease-in-out infinite;
  background: @primary-gradient;
  border-radius: 10px;
  color: @primary-text-on;
  font-size: 18px;
  padding: 10px 0;
  text-align: center;
  font-weight: 800;
}
/* 呼吸动画 */
@keyframes breathe {
  0% {
    transform: scale(1);
    // box-shadow: 0 0 0 0 rgba(14, 190, 255, 0.7);
  }
  50% {
    transform: scale(1.2);
    // box-shadow: 0 0 0 10px rgba(14, 190, 255, 0);
  }
  100% {
    transform: scale(1);
    // box-shadow: 0 0 0 0 rgba(14, 190, 255, 0);
  }
}
</style>
