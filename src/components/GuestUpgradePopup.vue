<template>
  <van-popup
    v-model:show="visible"
    round
    :close-on-click-overlay="!submitting"
    class="guest-upgrade-popup"
  >
    <div class="guest-upgrade__head">
      <span>{{ $lang.guest_upgrade_title || "UPGRADE ACCOUNT" }}</span>
      <button
        type="button"
        class="guest-upgrade__close"
        :disabled="submitting"
        @click="close"
      >
        <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
          <path
            d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
            fill="none"
            stroke="#fff"
            stroke-width="2.6"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>

    <div class="guest-upgrade__content">
      <p class="guest-upgrade__tip">
        {{
          $lang.guest_upgrade_tip ||
          "To submit a withdrawal request as a guest user, you must first create and link a registered account"
        }}
      </p>

      <div class="guest-upgrade__input">
        <van-icon name="phone-o" size="18" color="#fff" />
        <span class="guest-upgrade__area">{{ areaCode }}</span>
        <input
          :value="phoneNo"
          type="tel"
          inputmode="numeric"
          autocomplete="tel"
          :placeholder="$lang.login_txt || 'Enter mobile number'"
          @input="onPhoneInput"
        />
      </div>

      <div v-if="isCaptchaRequired" class="guest-upgrade__input">
        <van-icon name="comment-o" size="18" color="#fff" />
        <input
          :value="captcha"
          type="tel"
          inputmode="numeric"
          autocomplete="one-time-code"
          :placeholder="
            $lang.login_captcha_placeholder || 'Enter verification code'
          "
          @input="onCaptchaInput"
        />
        <button
          type="button"
          class="guest-upgrade__send"
          :disabled="!canSendCaptcha"
          @click="sendCaptcha"
        >
          {{
            captchaCountdown > 0
              ? `${captchaCountdown}s`
              : $lang.login_captcha_send || "Send"
          }}
        </button>
      </div>
      <p v-if="isCaptchaRequired && captchaError" class="guest-upgrade__field-error">
        {{ captchaError }}
      </p>

      <div class="guest-upgrade__input">
        <van-icon name="lock" size="18" color="#fff" />
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          :placeholder="
            $lang.guest_upgrade_password_placeholder ||
            'Enter 6-16 character password'
          "
          @input="normalizePassword('password')"
        />
        <button
          type="button"
          class="guest-upgrade__eye"
          @click.prevent="showPassword = !showPassword"
        >
          <van-icon
            :name="showPassword ? 'eye-o' : 'closed-eye'"
            size="18"
            color="#9b86c9"
          />
        </button>
      </div>

      <div class="guest-upgrade__input">
        <van-icon name="shield-o" size="18" color="#fff" />
        <input
          v-model="confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          maxlength="16"
          autocomplete="new-password"
          :placeholder="
            $lang.guest_upgrade_confirm_placeholder ||
            'Enter password again'
          "
          @input="normalizePassword('confirmPassword')"
        />
        <button
          type="button"
          class="guest-upgrade__eye"
          @click.prevent="showConfirmPassword = !showConfirmPassword"
        >
          <van-icon
            :name="showConfirmPassword ? 'eye-o' : 'closed-eye'"
            size="18"
            color="#9b86c9"
          />
        </button>
      </div>

      <p v-if="errorText" class="guest-upgrade__error">{{ errorText }}</p>

      <button
        type="button"
        class="guest-upgrade__submit btn-3d-green"
        :disabled="submitting"
        @click="submit"
      >
        {{
          submitting
            ? $lang.processing || "PROCESSING..."
            : $lang.Confirmar || $lang.guest_upgrade_confirm || "CONFIRM"
        }}
      </button>
    </div>
  </van-popup>
</template>

<script>
import { BindGuest, GetCaptcha, GetSysConfig } from "@/api/common";
import {
  getGuestUuid,
  isGuestUser,
  saveLoginSession,
} from "@/utils/guestAuth";
import {
  isUsAreaCode,
  isValidUsPhone,
  normalizeUsPhoneInput,
} from "@/utils/phoneValidate";
import md5 from "@/utils/md5";

export default {
  name: "GuestUpgradePopup",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue", "success"],
  data() {
    return {
      visible: this.modelValue,
      phoneNo: "",
      captcha: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      submitting: false,
      errorText: "",
      captchaLoginSwitch: false,
      captchaCountdown: 0,
      captchaTimer: null,
      captchaSending: false,
      captchaError: "",
    };
  },
  computed: {
    areaCode() {
      return this.GET_AREACODE || "+1";
    },
    isUsPhoneArea() {
      const currency = localStorage.getItem("currency");
      const platform = localStorage.getItem("platform");
      return (
        isUsAreaCode(this.areaCode, localStorage.getItem("country")) ||
        currency === "USD" ||
        currency === "usd" ||
        platform === "usbet"
      );
    },
    // 与注册一致：后端 captchaLoginSwitch 打开，或墨西哥站 / GHS 币种时必填短信验证码
    isCaptchaRequired() {
      const currency = localStorage.getItem("currency");
      const platform = localStorage.getItem("platform");
      const isMxSite = currency === "MXN" || platform === "mxbet";
      return currency === "GHS" || this.captchaLoginSwitch || isMxSite;
    },
    // 手机号格式正确才能发送验证码
    canSendCaptcha() {
      return (
        !this.phoneError() && !this.captchaSending && this.captchaCountdown === 0
      );
    },
  },
  watch: {
    modelValue(value) {
      this.visible = value;
    },
    visible(value) {
      this.$emit("update:modelValue", value);
      if (value) this.fetchSysConfig();
      if (!value && !this.submitting) this.resetForm();
    },
  },
  beforeUnmount() {
    this.clearCaptchaTimer();
  },
  methods: {
    async fetchSysConfig() {
      try {
        const data = await GetSysConfig({});
        if (data.status === "ok" && data.content) {
          this.captchaLoginSwitch = !!data.content.captchaLoginSwitch;
        }
      } catch (e) {
        /* ignore */
      }
    },
    normalizePhone(value) {
      if (this.isUsPhoneArea) return normalizeUsPhoneInput(value);
      return String(value ?? "")
        .replace(/\D/g, "")
        .slice(0, 13);
    },
    // 直接改写 input 值，超出位数的字符不会残留在输入框
    onPhoneInput(e) {
      this.errorText = "";
      this.captchaError = "";
      this.phoneNo = this.normalizePhone(e.target.value);
      e.target.value = this.phoneNo;
    },
    onCaptchaInput(e) {
      this.errorText = "";
      this.captchaError = "";
      this.captcha = String(e.target.value || "")
        .replace(/\D/g, "")
        .slice(0, 6);
      e.target.value = this.captcha;
    },
    phoneError() {
      if (!this.phoneNo) return this.$lang.login_txt19 || "Please enter the content";
      if (this.isUsPhoneArea) {
        return isValidUsPhone(this.phoneNo)
          ? ""
          : this.$lang.phone_us_invalid || "Incorrect phone number";
      }
      return /^\d{8,13}$/.test(this.phoneNo)
        ? ""
        : this.$lang.common_txt369 ||
            "The account number must consist of 8 to 13 digits only.";
    },
    clearCaptchaTimer() {
      if (this.captchaTimer) {
        clearInterval(this.captchaTimer);
        this.captchaTimer = null;
      }
    },
    startCaptchaCountdown() {
      this.captchaCountdown = 60;
      this.clearCaptchaTimer();
      this.captchaTimer = setInterval(() => {
        if (this.captchaCountdown > 0) {
          this.captchaCountdown -= 1;
        } else {
          this.clearCaptchaTimer();
        }
      }, 1000);
    },
    async sendCaptcha() {
      if (!this.canSendCaptcha) return;
      this.errorText = "";
      this.captchaError = "";
      this.captchaSending = true;
      try {
        const data = await GetCaptcha({
          areaCode: this.areaCode,
          phoneNo: this.phoneNo,
          captchaType: "register",
        });
        if (data.status === "ok") {
          this.startCaptchaCountdown();
        } else {
          this.captchaError =
            data.msg || this.$lang.network_error || "Network error";
        }
      } catch (e) {
        this.captchaError = this.$lang.network_error || "Network error";
      } finally {
        this.captchaSending = false;
      }
    },
    normalizePassword(field) {
      this.errorText = "";
      this[field] = String(this[field] || "")
        .replace(/\s+/g, "")
        .slice(0, 16);
    },
    close() {
      if (this.submitting) return;
      this.visible = false;
    },
    resetForm() {
      this.phoneNo = "";
      this.captcha = "";
      this.password = "";
      this.confirmPassword = "";
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.errorText = "";
      this.captchaError = "";
      this.captchaCountdown = 0;
      this.clearCaptchaTimer();
    },
    // 与注册规则一致：手机号 / 6-16 位密码 / 两次密码一致 / 6 位验证码
    validate() {
      const phoneError = this.phoneError();
      if (phoneError) return phoneError;
      if (this.password.length < 6 || this.password.length > 16) {
        return (
          this.$lang.login_txt17 || "The password must be between 6-16 characters"
        );
      }
      if (this.password !== this.confirmPassword) {
        return this.$lang.login_txt18 || "The repeated password does not match";
      }
      if (this.isCaptchaRequired) {
        if (!this.captcha) return this.$lang.login_txt19 || "Please enter the content";
        if (!/^\d{6}$/.test(this.captcha)) {
          return this.$lang.login_captcha_invalid || "Enter a 6-digit code";
        }
      }
      return "";
    },
    async submit() {
      if (this.submitting) return;
      if (!isGuestUser()) {
        this.visible = false;
        this.$emit("success");
        return;
      }

      const validationError = this.validate();
      if (validationError) {
        this.errorText = validationError;
        return;
      }

      this.submitting = true;
      this.errorText = "";
      try {
        const params = {
          account: this.phoneNo,
          passwd: md5(this.password),
          areaCode: this.areaCode,
          phoneNo: this.phoneNo,
        };
        if (this.isCaptchaRequired) params.captcha = this.captcha;
        const guestUuid = getGuestUuid();
        if (guestUuid) params.uuid = guestUuid;
        const response = await BindGuest(params);
        if (
          response &&
          response.status === "ok" &&
          response.content &&
          response.content.accessToken
        ) {
          // 文档要求：绑定成功后必须立即用新 Token 替换旧 Token。
          saveLoginSession(response.content);
          const boundAccount = response.content.account || this.phoneNo;
          this.visible = false;
          this.$toast({
            message:
              this.$lang.guest_upgrade_success ||
              "Account upgraded successfully. Please sign in.",
            icon: "success",
          });
          this.$emit("success", { account: boundAccount });
          return;
        }
        this.errorText =
          (response && response.msg) ||
          this.$lang.guest_upgrade_failed ||
          "Upgrade failed. Please try again.";
      } catch (error) {
        this.errorText =
          (error && (error.msg || error.message)) ||
          this.$lang.guest_upgrade_failed ||
          "Upgrade failed. Please try again.";
      } finally {
        this.submitting = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
/* 对齐 bank ADD ACCOUNT 通用弹窗：标题 / 标题底 / 内容底 / 黑胶囊输入框 */
.guest-upgrade-popup {
  width: 88% !important;
  max-width: 360px;
  overflow: hidden;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  border-radius: 18px !important;
}

.guest-upgrade__head {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 44px;
  background: #512275;
  color: #fff;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}

.guest-upgrade__close {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 28px;
  height: 28px;
  padding: 0;
  border: none;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
}

.guest-upgrade__content {
  padding: 14px 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.guest-upgrade__tip {
  margin: 0 2px 2px;
  color: rgba(255, 255, 255, 0.88);
  font-size: 12px;
  line-height: 1.45;
  text-align: center;
}

.guest-upgrade__input {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 48px;
  padding: 0 16px;
  background: #000;
  border-radius: 25px;
  box-sizing: border-box;

  &:focus-within {
    box-shadow: 0 0 0 1px #ffd400;
  }

  input {
    flex: 1;
    min-width: 0;
    height: 48px;
    line-height: 48px;
    padding: 0;
    background: transparent;
    border: none;
    color: #fff;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: #9b86c9;
    }
  }
}

.guest-upgrade__area {
  flex-shrink: 0;
  padding-right: 10px;
  border-right: 1px solid rgba(255, 255, 255, 0.25);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
}

.guest-upgrade__send {
  flex-shrink: 0;
  min-width: 44px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #ffd400;
  font-size: 14px;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    color: #9b86c9;
    cursor: default;
  }
}

.guest-upgrade__eye {
  width: 28px;
  height: 28px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  flex-shrink: 0;
}

.guest-upgrade__error {
  margin: -4px 4px 0;
  color: #ffd467;
  font-size: 12px;
  line-height: 1.35;
  text-align: center;
}

.guest-upgrade__field-error {
  margin: -8px 16px 0;
  color: #ffd467;
  font-size: 12px;
  line-height: 1.35;
}

.guest-upgrade__submit {
  margin-top: 8px;
  width: 100%;
  height: 48px;
  border: 0;
  font-size: 16px;
  font-weight: 900;
  letter-spacing: 0.6px;
  text-transform: uppercase;

  &:disabled {
    opacity: 0.7;
  }
}
</style>
