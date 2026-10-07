<template>
  <div class="pwd-page">
    <title-bar :title="$lang.setPassWord_title || 'Change Withdrawal Password'" />

    <div class="pwd-panel">
      <p v-if="privacyPasswdSetted === 'no'" class="pwd-panel__lead">
        {{ $lang.setPassWord_txt }}
      </p>
      <p class="pwd-panel__title">{{ $lang.setPassWord_txt2 }}</p>

      <div v-if="privacyPasswdSetted === 'yes'" class="pwd-block">
        <p class="pwd-block__label">{{ $lang.setPassWord_txt3 }}</p>
        <div
          class="pin-box"
          :class="{ 'pin-box--focus': activePin === 'old', 'pin-box--error': !!errorInfo }"
          @click="focusPin('old')"
        >
          <input
            ref="oldPin"
            class="pin-box__native"
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            autocomplete="one-time-code"
            enterkeyhint="done"
            :value="passWord"
            @focus="onFocus('old')"
            @blur="onBlur"
            @input="onPinInput('old', $event)"
          />
          <div class="pin-box__cells" aria-hidden="true">
            <div
              v-for="i in 6"
              :key="'o' + i"
              class="pin-box__cell"
              :class="{
                'is-on': passWord.length >= i,
                'is-caret': activePin === 'old' && passWord.length === i - 1,
              }"
            >
              <i v-if="passWord.length >= i" class="pin-box__dot"></i>
            </div>
          </div>
        </div>
        <p v-if="errorInfo" class="pwd-block__error">{{ errorInfo }}</p>
      </div>

      <div class="pwd-block">
        <p class="pwd-block__label">{{ $lang.setPassWord_txt4 }}</p>
        <div
          class="pin-box"
          :class="{ 'pin-box--focus': activePin === 'new', 'pin-box--error': !!errorInfo2 }"
          @click="focusPin('new')"
        >
          <input
            ref="newPin"
            class="pin-box__native"
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            autocomplete="one-time-code"
            enterkeyhint="done"
            :value="passWord2"
            @focus="onFocus('new')"
            @blur="onBlur"
            @input="onPinInput('new', $event)"
          />
          <div class="pin-box__cells" aria-hidden="true">
            <div
              v-for="i in 6"
              :key="'n' + i"
              class="pin-box__cell"
              :class="{
                'is-on': passWord2.length >= i,
                'is-caret': activePin === 'new' && passWord2.length === i - 1,
              }"
            >
              <i v-if="passWord2.length >= i" class="pin-box__dot"></i>
            </div>
          </div>
        </div>
        <p v-if="errorInfo2" class="pwd-block__error">{{ errorInfo2 }}</p>
      </div>

      <p class="pwd-panel__tip">{{ $lang.setPassWord_txt5 }}</p>

      <button type="button" class="pwd-panel__submit" @click="submit">
        {{ $lang.Confirmar || "CONFIRM" }}
      </button>
    </div>
  </div>
</template>

<script>
import { ChangePrivacyPwd, Init } from "@/api/common";
import md5 from "@/utils/md5";

export default {
  name: "SetPassWord",
  data() {
    return {
      passWord: "",
      passWord2: "",
      errorInfo: "",
      errorInfo2: "",
      activePin: "",
      privacyPasswdSetted: "",
    };
  },
  mounted() {
    this.Init();
  },
  methods: {
    onlyDigits(v) {
      return String(v || "")
        .replace(/\D/g, "")
        .slice(0, 6);
    },
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.privacyPasswdSetted = data.content.privacyPasswdSetted;
      }
    },
    focusPin(which) {
      this.activePin = which;
      this.$nextTick(() => {
        const el = which === "old" ? this.$refs.oldPin : this.$refs.newPin;
        if (el && el.focus) el.focus();
      });
    },
    onFocus(which) {
      this.activePin = which;
    },
    onBlur() {
      // delay so switching fields keeps focus style briefly
      setTimeout(() => {
        const a = document.activeElement;
        if (a !== this.$refs.oldPin && a !== this.$refs.newPin) {
          this.activePin = "";
        }
      }, 0);
    },
    onPinInput(which, e) {
      const next = this.onlyDigits(e && e.target ? e.target.value : "");
      if (which === "old") {
        this.passWord = next;
        this.errorInfo = "";
        if (e && e.target) e.target.value = next;
      } else {
        this.passWord2 = next;
        this.errorInfo2 = "";
        if (e && e.target) e.target.value = next;
      }
    },
    async ChangePrivacyPwd(params) {
      const data = await ChangePrivacyPwd(params);
      if (data.status === "ok") {
        if (this.$route.query.from === "profile") {
          this.$router.go(-1);
        } else {
          this.$jumpTo("/bankAdd", {}, { replace: true });
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    submit() {
      this.errorInfo = "";
      this.errorInfo2 = "";

      if (this.privacyPasswdSetted === "yes" && this.passWord.length < 6) {
        this.errorInfo = this.$lang.setPassWord_txt6 || "6 numbers";
      }
      if (this.passWord2.length < 6) {
        this.errorInfo2 = this.$lang.setPassWord_txt6 || "6 numbers";
      }
      if (
        this.privacyPasswdSetted === "yes" &&
        this.passWord.length === 6 &&
        this.passWord2.length === 6 &&
        this.passWord === this.passWord2
      ) {
        // new password should differ from old
        this.errorInfo2 =
          this.$lang.passwordLogin_txt7 ||
          this.$lang.setPassWord_txt7 ||
          "The new password is the same as the old one";
      }

      if (this.errorInfo || this.errorInfo2) return;

      if (this.privacyPasswdSetted === "yes") {
        this.ChangePrivacyPwd({
          newPrivacyPwd: md5(this.passWord2),
          oldPrivacyPwd: md5(this.passWord),
        });
      } else {
        this.ChangePrivacyPwd({
          newPrivacyPwd: md5(this.passWord2),
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.pwd-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.pwd-panel {
  margin: 14px 14px 0;
  padding: 20px 16px 22px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.25);

  &__lead {
    margin: 0 0 12px;
    color: #ffd467;
    font-size: 13px;
    line-height: 1.45;
    text-align: center;
  }

  &__title {
    margin: 0 0 16px;
    color: #fff;
    font-size: 14px;
    font-weight: 700;
  }

  &__tip {
    margin: 6px 2px 20px;
    color: #ffd467;
    font-size: 12px;
    line-height: 1.55;
  }

  &__submit {
    .btn-3d-green();
    height: 50px;
    font-size: 16px;
  }
}

.pwd-block {
  margin-bottom: 16px;

  &__label {
    margin: 0 0 8px;
    color: #fff;
    font-size: 13px;
    font-weight: 600;
  }

  &__error {
    margin: 8px 2px 0;
    color: #ef4444;
    font-size: 12px;
  }
}

/* 手写 6 位数字框：透明原生 input 唤起系统数字键盘 */
.pin-box {
  position: relative;
  height: 52px;
  border-radius: 12px;
  background: #000;
  border: 1px solid #c9b3ff;
  box-sizing: border-box;
  overflow: hidden;
  cursor: text;

  &--focus {
    border-color: #e93dfe;
    box-shadow: 0 0 0 1px rgba(233, 61, 254, 0.35);
  }

  &--error {
    border-color: #ef4444;
  }

  &__native {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0.02;
    border: 0;
    background: transparent;
    color: transparent;
    caret-color: transparent;
    font-size: 16px; /* iOS 避免自动缩放 */
    letter-spacing: 0;
    -webkit-text-security: none;
    outline: none;
  }

  &__cells {
    position: relative;
    z-index: 1;
    display: flex;
    height: 100%;
  }

  &__cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(201, 179, 255, 0.55);
    box-sizing: border-box;

    &:last-child {
      border-right: none;
    }

    &.is-caret::after {
      content: "";
      width: 2px;
      height: 22px;
      border-radius: 1px;
      background: #e93dfe;
      animation: pin-caret 1s step-end infinite;
    }
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    display: block;
  }
}

@keyframes pin-caret {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

@media (min-width: 769px) {
  .pwd-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
