<template>
  <div class="pwd-success-page">
    <header class="pwd-success-header">
      <button class="pwd-success-header__back" @click="goHome">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="pwd-success-header__title">{{ $lang.pwdSuccess_header || 'PASSWORD UPDATED' }}</h1>
      <div class="pwd-success-header__spacer"></div>
    </header>
    <div class="pwd-success-header-pad"></div>

    <div class="pwd-success-content">
      <!-- Animated Checkmark -->
      <div class="pwd-success-icon">
        <div class="pwd-success-icon__circle">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M12 24L20 32L36 16" stroke="var(--wihte-color)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>

      <h2 class="pwd-success-title">{{ $lang.pwdSuccess_title || 'Successfully Updated!' }}</h2>
      <p class="pwd-success-desc">{{ $lang.pwdSuccess_desc || 'Your account password has been changed. Please use your new credentials for future logins.' }}</p>

      <button class="pwd-success-btn" @click="goHome">
        {{ $lang.pwdSuccess_done || 'DONE' }}
      </button>

      <p class="pwd-success-footer">{{ $lang.pwdSuccess_footer || 'Secure Account Management' }}</p>
    </div>
  </div>
</template>

<script>
import { Logout } from '@/api/common'

export default {
  name: 'PasswordSuccess',
  methods: {
    async goHome() {
      try {
        await Logout()
      } catch (e) {
        // logout may fail if token already expired
      }
      localStorage.removeItem('token')
      this.$jumpTo('/home', {}, { replace: true })
      setTimeout(() => { window.location.reload() }, 200)
    }
  }
}
</script>

<style lang="less" scoped>
.pwd-success-page {
  min-height: 100vh;
  background-color: #1f1c17;
  color: @wihte-color;
}

.pwd-success-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background-color: #1f1c17;
  z-index: 999;

  &__back {
    position: absolute;
    left: 16px;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__title {
    font-size: 16px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    margin: 0;
  }

  &__spacer {
    width: 20px;
  }
}

.pwd-success-header-pad {
  height: 55px;
}

.pwd-success-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  text-align: center;
}

.pwd-success-icon {
  margin-bottom: 32px;

  &__circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, rgba(255, 163, 0, 0.2), rgba(255, 163, 0, 0.05));
    border: 4px solid rgba(255, 163, 0, 0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    animation: pulse-glow 2s infinite, float 4s ease-in-out infinite;
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 0 0 rgba(255, 163, 0, 0.2);
  }
  50% {
    box-shadow: 0 0 0 20px rgba(255, 163, 0, 0);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.pwd-success-title {
  font-size: 24px;
  font-weight: bold;
  margin: 0 0 12px 0;
}

.pwd-success-desc {
  font-size: 14px;
  color: #a89b7c;
  line-height: 1.6;
  margin: 0 0 40px 0;
  max-width: 300px;
}

.pwd-success-btn {
  width: 100%;
  max-width: 350px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  padding: 16px;
  border-radius: 10px;
  font-weight: bold;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  border: none;
  box-shadow: 0 4px 20px rgba(255, 163, 0, 0.3);
  cursor: pointer;

  &:active {
    transform: scale(0.98);
  }
}

.pwd-success-footer {
  margin-top: 32px;
  font-size: 12px;
  color: #a89b7c;
}
</style>
