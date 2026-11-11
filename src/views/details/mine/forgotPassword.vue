<template>
  <div class="fp-page">
    <title-bar :title="$lang.forgot_title || 'FORGOT PASSWORD'" />

    <div class="fp-steps">
      <span
        v-for="n in 3"
        :key="n"
        class="fp-steps__dot"
        :class="{ 'is-active': step >= n }"
      >{{ n }}</span>
    </div>

    <div class="fp-panel">
      <!-- 1. 输入账号 -->
      <template v-if="step === 1">
        <p class="fp-panel__desc">
          {{
            $lang.forgot_step1_desc ||
            "Enter the phone number of your account. We will send a verification code to the bound phone."
          }}
        </p>
        <div class="fp-field">
          <div
            class="fp-field__input"
            :class="{ 'fp-field__input--error': accountError }"
          >
            <div class="fp-field__area">
              <img src="@/assets/img/login/us_flag.png" alt="US" />
              <span>{{ areaCode }}</span>
            </div>
            <input
              :value="account"
              type="tel"
              inputmode="numeric"
              :placeholder="$lang.login_txt || 'Phone Number'"
              class="fp-field__text"
              @input="onAccountInput"
            />
          </div>
          <p v-if="accountError" class="fp-field__error">{{ accountError }}</p>
        </div>
        <button
          type="button"
          class="fp-panel__submit"
          :disabled="loading"
          @click="queryAccount"
        >
          {{ $lang.forgot_next || "NEXT" }}
        </button>
      </template>

      <!-- 2. 短信验证 -->
      <template v-else-if="step === 2">
        <p class="fp-panel__desc">
          {{
            $lang.forgot_step2_desc || "The verification code will be sent to"
          }}
          <em class="fp-panel__phone">{{ maskedPhone || account }}</em>
        </p>
        <div class="fp-field">
          <div
            class="fp-field__input"
            :class="{ 'fp-field__input--error': captchaError }"
          >
            <img
              class="fp-field__icon"
              src="@/assets/img/mine/pwd_check.png"
              alt=""
            />
            <input
              :value="captcha"
              type="tel"
              inputmode="numeric"
              maxlength="6"
              :placeholder="$lang.forgot_code_ph || 'Enter verification code'"
              class="fp-field__text"
              @input="onCaptchaInput"
            />
            <button
              type="button"
              class="fp-field__send"
              :disabled="sending || countdown > 0"
              @click="sendCaptcha"
            >
              {{
                countdown > 0
                  ? `${countdown}s`
                  : $lang.forgot_send || "Send"
              }}
            </button>
          </div>
          <p v-if="captchaError" class="fp-field__error">{{ captchaError }}</p>
        </div>
        <button
          type="button"
          class="fp-panel__submit"
          :disabled="loading"
          @click="checkCaptcha"
        >
          {{ $lang.forgot_next || "NEXT" }}
        </button>
        <button type="button" class="fp-panel__link" @click="backToStep1">
          {{ $lang.forgot_change_account || "Change phone number" }}
        </button>
      </template>

      <!-- 3. 设置新密码 -->
      <template v-else>
        <p class="fp-panel__desc">
          {{
            $lang.forgot_step3_desc ||
            "Set a new login password (6-16 characters)."
          }}
        </p>
        <div class="fp-field">
          <div
            class="fp-field__input"
            :class="{ 'fp-field__input--error': pwdError }"
          >
            <img
              class="fp-field__icon"
              src="@/assets/img/mine/pwd_lock.png"
              alt=""
            />
            <input
              v-model.trim="password"
              :type="showPwd ? 'text' : 'password'"
              maxlength="16"
              :placeholder="$lang.forgot_new_pwd_ph || 'New password'"
              class="fp-field__text"
            />
            <button
              type="button"
              class="fp-field__toggle"
              @click="showPwd = !showPwd"
            >
              <img :src="showPwd ? eyeOn : eyeOff" alt="" />
            </button>
          </div>
          <p v-if="pwdError" class="fp-field__error">{{ pwdError }}</p>
        </div>
        <div class="fp-field">
          <div
            class="fp-field__input"
            :class="{ 'fp-field__input--error': confirmError }"
          >
            <img
              class="fp-field__icon"
              src="@/assets/img/mine/pwd_check.png"
              alt=""
            />
            <input
              v-model.trim="confirmPwd"
              :type="showConfirm ? 'text' : 'password'"
              maxlength="16"
              :placeholder="$lang.pwdConfirm_ph || 'Confirm new password'"
              class="fp-field__text"
            />
            <button
              type="button"
              class="fp-field__toggle"
              @click="showConfirm = !showConfirm"
            >
              <img :src="showConfirm ? eyeOn : eyeOff" alt="" />
            </button>
          </div>
          <p v-if="confirmError" class="fp-field__error">{{ confirmError }}</p>
        </div>
        <button
          type="button"
          class="fp-panel__submit"
          :disabled="loading"
          @click="resetPassword"
        >
          {{ $lang.forgot_reset || "RESET PASSWORD" }}
        </button>
      </template>
    </div>
  </div>
</template>

<script>
import {
  ForgotPasswordQuery,
  ForgotPasswordCaptcha,
  ForgotPasswordCheck,
  ForgotPasswordReset,
} from "@/api/common";
import md5 from "@/utils/md5";
import {
  isUsAreaCode,
  isValidUsPhone,
  normalizeUsPhoneInput,
} from "@/utils/phoneValidate";
import { setOpenLoginAfterReloadFlag } from "@/utils/platformAuth";
import eyeOn from "@/assets/img/login/eye.png";
import eyeOff from "@/assets/img/login/eye_off.png";

export default {
  name: "ForgotPassword",
  data() {
    const area = localStorage.getItem("areaCode");
    return {
      eyeOn,
      eyeOff,
      step: 1,
      areaCode: area && area !== "null" ? area : "+1",
      account: "",
      maskedPhone: "",
      phoneAreaPrefix: "",
      captcha: "",
      password: "",
      confirmPwd: "",
      accountError: "",
      captchaError: "",
      pwdError: "",
      confirmError: "",
      showPwd: false,
      showConfirm: false,
      loading: false,
      sending: false,
      countdown: 0,
    };
  },
  computed: {
    isUsArea() {
      return isUsAreaCode(this.areaCode, localStorage.getItem("country"));
    },
  },
  beforeUnmount() {
    this.stopCountdown();
  },
  methods: {
    onAccountInput(e) {
      const raw = e.target.value;
      this.account = this.isUsArea
        ? normalizeUsPhoneInput(raw)
        : String(raw).replace(/\D/g, "").slice(0, 13);
      if (e.target.value !== this.account) e.target.value = this.account;
      this.accountError = "";
    },
    onCaptchaInput(e) {
      this.captcha = String(e.target.value).replace(/\D/g, "").slice(0, 6);
      if (e.target.value !== this.captcha) e.target.value = this.captcha;
      this.captchaError = "";
    },
    validateAccount() {
      if (!this.account) {
        return this.$lang.login_txt19 || "Please enter the content";
      }
      if (this.isUsArea && !isValidUsPhone(this.account)) {
        return this.$lang.phone_us_invalid || "Invalid US phone number";
      }
      if (!this.isUsArea && !/^\d{8,13}$/.test(this.account)) {
        return this.$lang.common_txt369;
      }
      return "";
    },
    // 接口要求「区号-手机号」；查号返回的脱敏手机号若带区号前缀，按同样格式拼接
    buildPhoneNo() {
      const prefix = this.phoneAreaPrefix || this.areaCode;
      return `${prefix}-${this.account}`;
    },
    async queryAccount() {
      this.accountError = this.validateAccount();
      if (this.accountError || this.loading) return;
      this.loading = true;
      try {
        const data = await ForgotPasswordQuery({ account: this.account });
        if (data.status === "ok") {
          const content = data.content || {};
          this.maskedPhone = content.phone || "";
          const m = String(this.maskedPhone).match(/^(\+?\d{1,4})-/);
          this.phoneAreaPrefix = m ? m[1] : "";
          this.step = 2;
        } else {
          this.accountError = data.msg || this.$lang.network_error || "Error";
        }
      } catch (e) {
        this.accountError = this.$lang.network_error || "Network error";
      } finally {
        this.loading = false;
      }
    },
    async sendCaptcha() {
      if (this.sending || this.countdown > 0) return;
      this.sending = true;
      this.captchaError = "";
      try {
        const data = await ForgotPasswordCaptcha({
          account: this.account,
          phoneNo: this.buildPhoneNo(),
        });
        if (data.status === "ok") {
          this.$toast(this.$lang.forgot_code_sent || "Verification code sent");
          this.startCountdown();
        } else {
          this.captchaError = data.msg || this.$lang.network_error || "Error";
        }
      } catch (e) {
        this.captchaError = this.$lang.network_error || "Network error";
      } finally {
        this.sending = false;
      }
    },
    async checkCaptcha() {
      if (!/^\d{6}$/.test(this.captcha)) {
        this.captchaError =
          this.$lang.forgot_code_invalid ||
          "Please enter the 6-digit verification code";
        return;
      }
      if (this.loading) return;
      this.loading = true;
      try {
        const data = await ForgotPasswordCheck({
          account: this.account,
          captcha: this.captcha,
        });
        if (data.status === "ok") {
          this.step = 3;
        } else {
          this.captchaError = data.msg || this.$lang.network_error || "Error";
        }
      } catch (e) {
        this.captchaError = this.$lang.network_error || "Network error";
      } finally {
        this.loading = false;
      }
    },
    async resetPassword() {
      this.pwdError = "";
      this.confirmError = "";
      if (this.password.length < 6 || this.password.length > 16) {
        this.pwdError =
          this.$lang.login_txt17 || "The password must be between 6-16 characters";
      }
      if (!this.confirmPwd) {
        this.confirmError = this.$lang.pwdConfirm_ph || "Confirm new password";
      } else if (this.confirmPwd !== this.password) {
        this.confirmError =
          this.$lang.pwdConfirm_mismatch || "Passwords do not match";
      }
      if (this.pwdError || this.confirmError || this.loading) return;
      this.loading = true;
      try {
        const data = await ForgotPasswordReset({
          account: this.account,
          captcha: this.captcha,
          password: md5(this.password),
        });
        if (data.status === "ok") {
          this.$toast({
            message:
              this.$lang.forgot_success ||
              "Password reset successfully. Please log in.",
            icon: "success",
          });
          this.backToLogin();
        } else {
          this.$toast({
            message: data.msg || this.$lang.network_error || "Error",
            icon: "cross",
          });
        }
      } catch (e) {
        this.$toast({
          message: this.$lang.network_error || "Network error",
          icon: "cross",
        });
      } finally {
        this.loading = false;
      }
    },
    // 登录弹窗挂在首页布局上：回首页并打开登录
    backToLogin() {
      setOpenLoginAfterReloadFlag();
      this.$jumpTo("/home", {}, { replace: true });
      setTimeout(() => this.$bus.emit("openLogin", 0), 300);
    },
    backToStep1() {
      this.stopCountdown();
      this.captcha = "";
      this.captchaError = "";
      this.step = 1;
    },
    startCountdown() {
      this.stopCountdown();
      this.countdown = 60;
      this._timer = setInterval(() => {
        this.countdown -= 1;
        if (this.countdown <= 0) this.stopCountdown();
      }, 1000);
    },
    stopCountdown() {
      if (this._timer) {
        clearInterval(this._timer);
        this._timer = null;
      }
      this.countdown = 0;
    },
  },
};
</script>

<style lang="less" scoped>
.fp-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.fp-steps {
  display: flex;
  justify-content: center;
  gap: 28px;
  margin: 18px 0 4px;

  &__dot {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: #c9b3ff;
    background: #250a3d;
    border: 1px solid #590581;

    &.is-active {
      color: #3a2400;
      background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
      border-color: #ffd467;
    }
  }
}

.fp-panel {
  margin: 14px 14px 0;
  padding: 22px 16px 20px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.25);

  &__desc {
    margin: 0 2px 18px;
    font-size: 13px;
    line-height: 1.55;
    color: #e6d4f8;
  }

  &__phone {
    font-style: normal;
    font-weight: 700;
    color: #ffd467;
  }

  &__submit {
    .btn-3d-green();
    height: 50px;
    font-size: 16px;
    margin-top: 8px;

    &:disabled {
      opacity: 0.6;
    }
  }

  &__link {
    display: block;
    margin: 14px auto 0;
    padding: 0;
    border: none;
    background: transparent;
    font-size: 13px;
    color: #5ee59a;
    text-decoration: underline;
    cursor: pointer;
  }
}

.fp-field {
  margin-bottom: 14px;

  &__input {
    position: relative;
    display: flex;
    align-items: center;
    gap: 10px;
    height: 48px;
    padding: 0 14px;
    background: #000;
    border-radius: 25px;
    box-sizing: border-box;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 25px;
      border: 1px solid rgba(233, 61, 254, 0.55);
      pointer-events: none;
      box-shadow: 0 0 8px rgba(233, 61, 254, 0.25);
    }

    &:focus-within::after {
      border-color: #ffd400;
      box-shadow: 0 0 0 1px #ffd400;
    }

    &--error::after {
      border-color: #ef4444;
      box-shadow: 0 0 0 1px #ef4444;
    }
  }

  &__area {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
    padding-right: 10px;
    border-right: 1px solid rgba(201, 179, 255, 0.35);
    color: #fff;
    font-size: 14px;

    img {
      width: 22px;
      height: auto;
      display: block;
    }
  }

  &__icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
    display: block;
  }

  &__text {
    flex: 1;
    min-width: 0;
    height: 48px;
    line-height: 48px;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: #c9b3ff;
    }
  }

  &__send {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    min-width: 64px;
    height: 32px;
    padding: 0 12px;
    border: none;
    border-radius: 16px;
    font-size: 13px;
    font-weight: 700;
    color: #3a2400;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    cursor: pointer;

    &:disabled {
      color: #c9b3ff;
      background: #250a3d;
      cursor: default;
    }
  }

  &__toggle {
    position: relative;
    z-index: 1;
    flex-shrink: 0;
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      display: block;
    }
  }

  &__error {
    margin: 6px 4px 0;
    font-size: 12px;
    color: #ef4444;
  }
}

@media (min-width: 769px) {
  .fp-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
