<template>
  <div class="pwd-page">
    <!-- Custom Header -->
    <header class="pwd-header">
      <button class="pwd-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="pwd-header__title">{{ $lang.passwordLogin_title || 'CHANGE PASSWORD' }}</h1>
      <div class="pwd-header__spacer"></div>
    </header>
    <div class="pwd-header-pad"></div>

    <div class="pwd-form">
      <!-- Old Password -->
      <div class="pwd-field">
        <div class="pwd-field__input" :class="{ 'pwd-field__input--error': error }">
          <div class="pwd-field__icon">
            <van-icon name="lock" size="18" color="#a89b7c" />
          </div>
          <input
            v-model="oldLoginPwd"
            :type="isSee ? 'text' : 'password'"
            :placeholder="$lang.passwordLogin_txt5 || 'Enter the old password'"
            class="pwd-field__text"
          />
          <button class="pwd-field__toggle" @click="isSee = !isSee">
            <van-icon :name="isSee ? 'eye-o' : 'closed-eye'" size="18" :color="isSee ? '#ffa300' : '#a89b7c'" />
          </button>
        </div>
        <p v-if="errorText" class="pwd-field__error">{{ errorText }}</p>
      </div>

      <!-- New Password -->
      <div class="pwd-field">
        <div class="pwd-field__input" :class="{ 'pwd-field__input--error': error2 }">
          <div class="pwd-field__icon">
            <van-icon name="lock" size="18" color="#a89b7c" />
          </div>
          <input
            v-model="newLoginPwd"
            :type="isSee2 ? 'text' : 'password'"
            :placeholder="$lang.passwordLogin_txt6 || 'Enter the new password'"
            class="pwd-field__text"
          />
          <button class="pwd-field__toggle" @click="isSee2 = !isSee2">
            <van-icon :name="isSee2 ? 'eye-o' : 'closed-eye'" size="18" :color="isSee2 ? '#ffa300' : '#a89b7c'" />
          </button>
        </div>
        <p v-if="errorText2" class="pwd-field__error">{{ errorText2 }}</p>
      </div>

      <!-- Confirm Password -->
      <div class="pwd-field">
        <div class="pwd-field__input" :class="{ 'pwd-field__input--error': error3 }">
          <div class="pwd-field__icon">
            <van-icon name="passed" size="18" color="#a89b7c" />
          </div>
          <input
            v-model="confirmPwd"
            :type="isSee3 ? 'text' : 'password'"
            :placeholder="$lang.pwdConfirm_ph || 'Confirm new password'"
            class="pwd-field__text"
          />
          <button class="pwd-field__toggle" @click="isSee3 = !isSee3">
            <van-icon :name="isSee3 ? 'eye-o' : 'closed-eye'" size="18" :color="isSee3 ? '#ffa300' : '#a89b7c'" />
          </button>
        </div>
        <p v-if="errorText3" class="pwd-field__error">{{ errorText3 }}</p>
      </div>

      <p class="pwd-form__tip">{{ $lang.passwordLogin_txt4 }}</p>

      <button class="pwd-form__submit" @click="submit">
        {{ $lang.Enviar || 'Submit' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ChangeLoginPwd } from '@/api/common'
import md5 from '@/utils/md5'

export default {
  name: 'PasswordLogin',
  data() {
    return {
      oldLoginPwd: '',
      newLoginPwd: '',
      confirmPwd: '',
      error: false,
      error2: false,
      error3: false,
      errorText: '',
      errorText2: '',
      errorText3: '',
      isSee: false,
      isSee2: false,
      isSee3: false
    }
  },
  methods: {
    async submit() {
      this.error = false
      this.error2 = false
      this.error3 = false
      this.errorText = ''
      this.errorText2 = ''
      this.errorText3 = ''

      if (!this.oldLoginPwd) {
        this.error = true
        this.errorText = this.$lang.passwordLogin_txt5 || 'Enter the old password'
      }
      if (!this.newLoginPwd) {
        this.error2 = true
        this.errorText2 = this.$lang.passwordLogin_txt6 || 'Enter the new password'
      } else if (this.oldLoginPwd === this.newLoginPwd) {
        this.error2 = true
        this.errorText2 = this.$lang.passwordLogin_txt7 || 'The new password is the same as the old one'
      }
      if (!this.confirmPwd) {
        this.error3 = true
        this.errorText3 = this.$lang.pwdConfirm_ph || 'Confirm new password'
      } else if (this.newLoginPwd !== this.confirmPwd) {
        this.error3 = true
        this.errorText3 = this.$lang.pwdConfirm_mismatch || 'Passwords do not match'
      }

      if (this.error || this.error2 || this.error3) return

      const data = await ChangeLoginPwd({
        oldLoginPwd: md5(this.oldLoginPwd),
        newLoginPwd: md5(this.newLoginPwd)
      })
      if (data.status === 'ok') {
        this.$jumpTo('/passwordSuccess')
      } else {
        this.$toast({ message: data.msg, icon: 'cross' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@bg: #1f1c17;
@card: #15110a;
@neon: #ffa300;
@muted: #a89b7c;
@border: rgba(255, 162, 0, 0.45);

.pwd-page {
  min-height: 100vh;
  background: @bg;
}

.pwd-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 50px;
  background: @bg;
  z-index: 999;

  &__back {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__spacer {
    width: 36px;
  }
}

.pwd-header-pad {
  height: 50px;
}

.pwd-form {
  padding: 24px 16px;

  &__tip {
    font-size: 12px;
    color: @muted;
    margin: 8px 4px 24px;
    line-height: 1.6;
  }

  &__submit {
    width: 100%;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    border: none;
    border-radius: 10px;
    padding: 14px;
    font-size: 14px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    box-shadow: 0 4px 16px rgba(255, 163, 0, 0.2);
    transition: transform 0.1s;

    &:active {
      transform: scale(0.98);
    }
  }
}

.pwd-field {
  margin-bottom: 16px;

  &__input {
    display: flex;
    align-items: center;
    background: @card;
    border: 1px solid @border;
    border-radius: 10px;
    padding: 0 14px;
    height: 50px;
    transition: border-color 0.2s, box-shadow 0.2s;

    &:focus-within {
      border-color: @neon;
      box-shadow: 0 0 0 2px rgba(255, 163, 0, 0.1);
    }

    &--error {
      border-color: #ef4444;
    }
  }

  &__icon {
    margin-right: 12px;
    display: flex;
    align-items: center;
  }

  &__text {
    flex: 1;
    background: transparent;
    border: none;
    color: @wihte-color;
    font-size: 14px;
    outline: none;

    &::placeholder {
      color: #a89b7c;
    }
  }

  &__toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
  }

  &__error {
    font-size: 12px;
    color: #ef4444;
    margin-top: 6px;
    margin-left: 4px;
  }
}

@media (min-width: 769px) {
  .pwd-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
