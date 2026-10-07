<template>
  <div class="pwd-page">
    <title-bar :title="$lang.passwordLogin_title || 'CHANGE LOGIN PASSWORD'" />

    <div class="pwd-panel">
      <!-- Old Password -->
      <div class="pwd-field">
        <div
          class="pwd-field__input"
          :class="{ 'pwd-field__input--error': error }"
        >
          <img
            class="pwd-field__icon"
            src="@/assets/img/mine/pwd_lock.png"
            alt=""
          />
          <input
            v-model="oldLoginPwd"
            :type="isSee ? 'text' : 'password'"
            :placeholder="$lang.passwordLogin_txt5 || 'Enter The Old Password.'"
            class="pwd-field__text"
          />
          <button
            type="button"
            class="pwd-field__toggle"
            @click="isSee = !isSee"
          >
            <img
              class="pwd-field__eye"
              :src="isSee ? eyeOn : eyeOff"
              alt=""
            />
          </button>
        </div>
        <p v-if="errorText" class="pwd-field__error">{{ errorText }}</p>
      </div>

      <!-- New Password -->
      <div class="pwd-field">
        <div
          class="pwd-field__input"
          :class="{ 'pwd-field__input--error': error2 }"
        >
          <img
            class="pwd-field__icon"
            src="@/assets/img/mine/pwd_lock.png"
            alt=""
          />
          <input
            v-model="newLoginPwd"
            :type="isSee2 ? 'text' : 'password'"
            :placeholder="
              $lang.passwordLogin_txt6 || 'Enter The Login Password.'
            "
            class="pwd-field__text"
          />
          <button
            type="button"
            class="pwd-field__toggle"
            @click="isSee2 = !isSee2"
          >
            <img
              class="pwd-field__eye"
              :src="isSee2 ? eyeOn : eyeOff"
              alt=""
            />
          </button>
        </div>
        <p v-if="errorText2" class="pwd-field__error">{{ errorText2 }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="pwd-field">
        <div
          class="pwd-field__input"
          :class="{ 'pwd-field__input--error': error3 }"
        >
          <img
            class="pwd-field__icon"
            src="@/assets/img/mine/pwd_check.png"
            alt=""
          />
          <input
            v-model="confirmPwd"
            :type="isSee3 ? 'text' : 'password'"
            :placeholder="$lang.pwdConfirm_ph || 'Confirm New Password'"
            class="pwd-field__text"
          />
          <button
            type="button"
            class="pwd-field__toggle"
            @click="isSee3 = !isSee3"
          >
            <img
              class="pwd-field__eye"
              :src="isSee3 ? eyeOn : eyeOff"
              alt=""
            />
          </button>
        </div>
        <p v-if="errorText3" class="pwd-field__error">{{ errorText3 }}</p>
      </div>

      <p class="pwd-panel__tip">{{ $lang.passwordLogin_txt4 }}</p>

      <button type="button" class="pwd-panel__submit" @click="submit">
        {{ $lang.Enviar || "SUBMIT" }}
      </button>
    </div>
  </div>
</template>

<script>
import { ChangeLoginPwd } from "@/api/common";
import md5 from "@/utils/md5";
import eyeOn from "@/assets/img/login/eye.png";
import eyeOff from "@/assets/img/login/eye_off.png";

export default {
  name: "PasswordLogin",
  data() {
    return {
      eyeOn,
      eyeOff,
      oldLoginPwd: "",
      newLoginPwd: "",
      confirmPwd: "",
      error: false,
      error2: false,
      error3: false,
      errorText: "",
      errorText2: "",
      errorText3: "",
      isSee: false,
      isSee2: false,
      isSee3: false,
    };
  },
  methods: {
    async submit() {
      this.error = false;
      this.error2 = false;
      this.error3 = false;
      this.errorText = "";
      this.errorText2 = "";
      this.errorText3 = "";

      if (!this.oldLoginPwd) {
        this.error = true;
        this.errorText =
          this.$lang.passwordLogin_txt5 || "Enter the old password";
      }
      if (!this.newLoginPwd) {
        this.error2 = true;
        this.errorText2 =
          this.$lang.passwordLogin_txt6 || "Enter the new password";
      } else if (this.oldLoginPwd === this.newLoginPwd) {
        this.error2 = true;
        this.errorText2 =
          this.$lang.passwordLogin_txt7 ||
          "The new password is the same as the old one";
      }
      if (!this.confirmPwd) {
        this.error3 = true;
        this.errorText3 = this.$lang.pwdConfirm_ph || "Confirm new password";
      } else if (this.newLoginPwd !== this.confirmPwd) {
        this.error3 = true;
        this.errorText3 =
          this.$lang.pwdConfirm_mismatch || "Passwords do not match";
      }

      if (this.error || this.error2 || this.error3) return;

      const data = await ChangeLoginPwd({
        oldLoginPwd: md5(this.oldLoginPwd),
        newLoginPwd: md5(this.newLoginPwd),
      });
      if (data.status === "ok") {
        this.$jumpTo("/passwordSuccess");
      } else {
        this.$toast({ message: data.msg, icon: "cross" });
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
  padding: 22px 16px 20px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.25);

  &__tip {
    margin: 4px 2px 22px;
    font-size: 12px;
    line-height: 1.55;
    color: #e6d4f8;
  }

  &__submit {
    .btn-3d-green();
    height: 50px;
    font-size: 16px;
  }
}

.pwd-field {
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
      line-height: 48px;
    }
  }

  &__toggle {
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
  }

  &__eye {
    width: 22px;
    height: 22px;
    object-fit: contain;
    display: block;
  }

  &__error {
    margin: 6px 4px 0;
    font-size: 12px;
    color: #ef4444;
  }
}

@media (min-width: 769px) {
  .pwd-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
