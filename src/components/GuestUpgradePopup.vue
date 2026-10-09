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
        <van-icon name="user-o" size="18" color="#fff" />
        <input
          v-model.trim="account"
          type="text"
          maxlength="16"
          autocomplete="username"
          :placeholder="
            $lang.guest_upgrade_account_placeholder ||
            '6-16 letters and numbers'
          "
          @input="clearError"
        />
      </div>

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
import { BindGuest } from "@/api/common";
import {
  getGuestUuid,
  isGuestUser,
  saveLoginSession,
} from "@/utils/guestAuth";
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
      account: "",
      password: "",
      confirmPassword: "",
      showPassword: false,
      showConfirmPassword: false,
      submitting: false,
      errorText: "",
    };
  },
  watch: {
    modelValue(value) {
      this.visible = value;
    },
    visible(value) {
      this.$emit("update:modelValue", value);
      if (!value && !this.submitting) this.resetForm();
    },
  },
  methods: {
    clearError() {
      this.errorText = "";
      this.account = String(this.account || "")
        .replace(/[^A-Za-z0-9]/g, "")
        .slice(0, 16);
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
      this.account = "";
      this.password = "";
      this.confirmPassword = "";
      this.showPassword = false;
      this.showConfirmPassword = false;
      this.errorText = "";
    },
    validate() {
      if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,16}$/.test(this.account)) {
        return (
          this.$lang.guest_upgrade_account_invalid ||
          "Account must be 6-16 characters and contain both letters and numbers."
        );
      }
      if (this.password.length < 6 || this.password.length > 16) {
        return (
          this.$lang.guest_upgrade_password_invalid ||
          "Password must be 6-16 characters."
        );
      }
      if (this.password !== this.confirmPassword) {
        return (
          this.$lang.guest_upgrade_password_mismatch ||
          "The passwords do not match."
        );
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
        const response = await BindGuest({
          account: this.account,
          passwd: md5(this.password),
          uuid: getGuestUuid(),
        });
        if (
          response &&
          response.status === "ok" &&
          response.content &&
          response.content.accessToken
        ) {
          // 文档要求：绑定成功后必须立即用新 Token 替换旧 Token。
          saveLoginSession(response.content);
          const boundAccount = response.content.account || this.account;
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
