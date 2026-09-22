<template>
  <div class="phone-page">
    <title-bar v-if="!isFromGoogle" :title="$lang.phoneUnbound_title || 'PHONE SECURITY'" />
    <!-- Custom header for Google forced bind -->
    <nav v-else class="phone-header">
      <button class="phone-header__back" @click="showLogoutConfirm = true">
        <van-icon name="cross" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="phone-header__title">{{ $lang.phoneUnbound_title || 'PHONE SECURITY' }}</h1>
      <div class="phone-header__spacer"></div>
    </nav>

    <div class="phone-content">
      <!-- Icon -->
      <div class="phone-icon">
        <van-icon name="phone-o" size="48" color="#ffa300" />
      </div>

      <p class="phone-desc">{{ $lang.phoneUnbound_desc || 'Link your phone number to enhance account security, enable SMS alerts, and recover your account easily.' }}</p>

      <!-- Phone Input -->
      <div class="phone-field-row">
        <div class="phone-area-code" @click="toggleCountry">
          <img :src="selectedIcon || GET_ICONURL" width="22" />
          <span class="phone-area-code__text">{{ selectedAreaCode || GET_AREACODE }}</span>
          <van-icon :name="showCountryDrop ? 'arrow-up' : 'arrow-down'" size="10" color="#a89b7c" />
        </div>
        <van-field
          v-model="phoneNo"
          :placeholder="$lang.gpb_phone_placeholder || 'Enter phone number'"
          class="phone-input"
          type="number"
          @input="phoneNo = phoneNo.replace(/\D/g, '').slice(0, 13)"
        />
      </div>

      <!-- Country Dropdown -->
      <div v-if="showCountryDrop" class="phone-dropdown">
        <div
          v-for="(item, idx) in countryList"
          :key="idx"
          class="phone-dropdown__item"
          @click="selectCountry(item)"
        >
          <img :src="item.iconUrl" width="24" />
          <span>{{ item.countryName }}</span>
          <span class="phone-dropdown__code">{{ item.areaCode }}</span>
        </div>
        <div v-if="countryList.length === 0" class="phone-dropdown__item" style="justify-content: center; color: #a89b7c;">
          {{ $lang.common_loading || 'Loading...' }}
        </div>
      </div>

      <p v-if="errorMsg" class="phone-error">
        <van-icon name="warning" color="#ef4444" size="12" /> {{ errorMsg }}
      </p>

      <!-- Submit Button -->
      <button
        class="phone-submit"
        :class="{ 'phone-submit--disabled': !phoneNo || loading }"
        :disabled="!phoneNo || loading"
        @click="handleBind"
      >
        {{ loading ? ($lang.common_loading || 'Loading...') : ($lang.phoneUnbound_bind || 'BIND PHONE') }}
      </button>
    </div>

    <!-- Logout confirm for Google forced bind -->
    <van-dialog
      v-model:show="showLogoutConfirm"
      :title="$lang.gpb_confirm_title || 'Notice'"
      :message="$lang.gpb_confirm_msg || 'Not binding phone will log you out. Are you sure?'"
      show-cancel-button
      :confirm-button-text="$lang.gpb_confirm_yes || 'Yes'"
      :cancel-button-text="$lang.gpb_confirm_no || 'No'"
      confirm-button-color="#ef4444"
      cancel-button-color="#ffa300"
      @confirm="confirmLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>

<script>
import { BindPhone, GetPlatformList } from '@/api/common'

export default {
  name: 'PhoneUnbound',
  data() {
    return {
      phoneNo: '',
      loading: false,
      errorMsg: '',
      showCountryDrop: false,
      showLogoutConfirm: false,
      countryList: [],
      selectedIcon: localStorage.getItem('iconUrl'),
      selectedAreaCode: localStorage.getItem('areaCode')
    }
  },
  computed: {
    isFromGoogle() {
      return this.$route.query.fromGoogle === '1'
    }
  },
  methods: {
    confirmLogout() {
      localStorage.removeItem('token')
      const prefix = this.$route.params.prefix || localStorage.getItem('country') || ''
      this.$router.replace('/' + prefix + '/home')
      setTimeout(() => { window.location.reload() }, 200)
    },
    toggleCountry() {
      this.showCountryDrop = !this.showCountryDrop
      if (this.showCountryDrop && this.countryList.length === 0) {
        this.fetchCountryList()
      }
    },
    async fetchCountryList() {
      try {
        const data = await GetPlatformList()
        if (data.status === 'ok') {
          this.countryList = data.content.list
        }
      } catch (e) {
        console.error('fetchCountryList error', e)
      }
    },
    selectCountry(item) {
      this.selectedIcon = item.iconUrl
      this.selectedAreaCode = item.areaCode
      localStorage.setItem('areaCode', item.areaCode)
      localStorage.setItem('iconUrl', item.iconUrl)
      this.showCountryDrop = false
    },
    async handleBind() {
      if (!this.phoneNo) {
        this.errorMsg = this.$lang.login_txt19 || 'Please enter the content'
        return
      }
      if (!/^\d{8,13}$/.test(this.phoneNo)) {
        this.errorMsg = this.$lang.common_txt369 || 'The account must be 8-13 digits'
        return
      }
      this.errorMsg = ''
      this.loading = true
      try {
        const params = {
          phoneNo: this.phoneNo,
          areaCode: this.selectedAreaCode || this.GET_AREACODE
        }
        const data = await BindPhone(params)
        if (data.status === 'ok') {
          this.$toast({ message: this.$lang.Sucesso || 'Success', icon: 'success' })
          if (this.isFromGoogle) {
            const prefix = this.$route.params.prefix || localStorage.getItem('country') || ''
            this.$router.replace('/' + prefix + '/home')
            setTimeout(() => { window.location.reload() }, 200)
          } else {
            this.$router.go(-1)
          }
        } else {
          this.errorMsg = data.msg || 'Binding failed'
        }
      } catch (e) {
        this.errorMsg = this.$lang.network_error || 'Network error'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
@primary: #ffa300;
@bg: #1f1c17;
@input-bg: #2a2418;
@border: rgba(255, 162, 0, 0.45);

.phone-page {
  min-height: 100vh;
  background: @bg;
}

.phone-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: @bg;

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__spacer { width: 40px; }
}

.phone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
  max-width: 450px;
  margin: 0 auto;
}

.phone-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: rgba(255, 163, 0, 0.1);
  border: 2px solid rgba(255, 163, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 24px;
}

.phone-desc {
  text-align: center;
  font-size: 14px;
  color: #a89b7c;
  line-height: 1.6;
  max-width: 320px;
  margin-bottom: 32px;
}

.phone-field-row {
  display: flex;
  gap: 8px;
  width: 100%;
  margin-bottom: 8px;
}

.phone-area-code {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  height: 48px;
  background: @input-bg;
  border: 1.5px solid @border;
  border-radius: 10px;
  cursor: pointer;
  flex-shrink: 0;

  &__text {
    color: @wihte-color;
    font-size: 13px;
    font-weight: 600;
    white-space: nowrap;
  }
}

.phone-input {
  height: 48px;
  background: @input-bg !important;
  border: 1.5px solid @border !important;
  border-radius: 10px !important;
  color: @wihte-color;
  font-size: 14px;

  :deep(.van-field__control) {
    color: @wihte-color;
  }
  :deep(.van-field__control::placeholder) {
    color: #a89b7c;
  }
}

.phone-dropdown {
  background: #2a2418;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  margin-bottom: 8px;
  width: 100%;

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    color: @wihte-color;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child { border-bottom: none; }
    &:active { background: rgba(255, 163, 0, 0.1); }
  }

  &__code {
    margin-left: auto;
    color: @primary;
    font-weight: 600;
    font-size: 12px;
  }
}

.phone-error {
  color: #ef4444;
  font-size: 11px;
  padding: 4px 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
  width: 100%;
}

.phone-submit {
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 24px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  font-size: 16px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  margin-top: 16px;
  box-shadow: 0 4px 16px rgba(255, 163, 0, 0.3);

  &:active { transform: scale(0.97); }

  &--disabled {
    background: #2a2418;
    color: #a89b7c;
    box-shadow: none;
    cursor: not-allowed;
  }
}
</style>
