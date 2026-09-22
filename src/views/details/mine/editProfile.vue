<template>
  <div class="edit-profile-page">
    <!-- Custom Header -->
    <header class="ep-header">
      <button class="ep-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="ep-header__title">{{ $lang.editProfile_title || 'EDIT PROFILE' }}</h1>
      <button class="ep-header__save" @click="handleSave">
        {{ $lang.editProfile_save || 'SAVE' }}
      </button>
    </header>
    <div class="ep-header__spacer"></div>

    <div class="ep-content">
      <!-- Avatar Section -->
      <div class="ep-avatar" @click="goSelectAvatar">
        <div class="ep-avatar__wrapper">
          <img
            v-if="avatarSrc"
            :src="avatarSrc"
            class="ep-avatar__img"
            alt=""
          />
          <div v-else class="ep-avatar__placeholder"></div>
          <div class="ep-avatar__camera">
            <van-icon name="photograph" size="16" color="#573900" />
          </div>
        </div>
      </div>

      <!-- User ID (readonly + copy) -->
      <div class="ep-field">
        <label class="ep-field__label">{{ $lang.editProfile_user_id || 'User ID' }}</label>
        <div class="ep-field__input ep-field__input--readonly">
          <span>ID: {{ inviteCode }}</span>
          <button class="ep-field__copy" @click="copyId">
            <van-icon name="records" size="16" color="#a89b7c" />
          </button>
        </div>
      </div>

      <!-- Phone -->
      <div class="ep-field">
        <label class="ep-field__label">{{ $lang.editProfile_phone || 'Phone' }}</label>
        <div class="ep-field__input ep-field__input--readonly">
          <span>{{ phone || '--' }}</span>
        </div>
      </div>

      <!-- Birthday -->
      <div class="ep-field">
        <label class="ep-field__label">{{ $lang.editProfile_birthday || 'Birthday' }}</label>
        <div
          class="ep-field__input"
          style="cursor: pointer"
          @click="showBirthdayPicker = true"
        >
          <span :style="{ color: birthday ? 'var(--wihte-color)' : '#a89b7c' }">
            {{ birthday || ($lang.editProfile_birthday_ph || 'Select birthday') }}
          </span>
          <van-icon name="calendar-o" size="16" color="#a89b7c" />
        </div>
      </div>
    </div>

    <DatePickerPopup
      v-model="showBirthdayPicker"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="pickerDate"
      :title="$lang.editProfile_birthday || 'Birthday'"
      :subtitle="$lang.editProfile_birthday_ph || 'Select birthday'"
      :confirm-text="$lang.editProfile_save || 'Confirm'"
      :cancel-text="$lang.Cancelar || $lang.common_cancel || 'Cancel'"
      @confirm="onBirthdayConfirm"
    />
  </div>
</template>

<script>
import { Init, ChangeExtend } from '@/api/common'
import DatePickerPopup from '@/components/DatePickerPopup'
import { avatarImg } from '@/utils/avatarAssets'

export default {
  name: 'EditProfile',
  components: { DatePickerPopup },
  data() {
    return {
      headUrl: null,
      inviteCode: '',
      phone: '',
      birthday: '',
      showBirthdayPicker: false,
      pickerDate: new Date(),
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      saving: false
    }
  },
  computed: {
    avatarSrc() {
      if (this.headUrl == null || this.headUrl === '') return ''
      return avatarImg(this.headUrl)
    },
  },
  mounted() {
    this.loadProfile()
  },
  activated() {
    this.loadProfile()
  },
  methods: {
    goSelectAvatar() {
      const headUrl =
        this.headUrl == null || this.headUrl === '' ? 0 : this.headUrl
      this.$jumpTo('/avatar', { headUrl })
    },
    async loadProfile() {
      try {
        const data = await Init()
        if (data.status === 'ok') {
          this.headUrl = data.content.headUrl
          this.inviteCode = data.content.inviteCode || ''
          this.phone = data.content.phone || data.content.account || ''
          this.birthday = data.content.birthday || ''
          if (this.birthday) {
            const d = new Date(this.birthday)
            if (!isNaN(d.getTime())) this.pickerDate = d
          }
        }
      } catch (e) {
        console.error('Init error', e)
      }
    },
    onBirthdayConfirm(date) {
      const y = date.getFullYear()
      const m = String(date.getMonth() + 1).padStart(2, '0')
      const d = String(date.getDate()).padStart(2, '0')
      this.birthday = `${y}-${m}-${d}`
      this.showBirthdayPicker = false
    },
    copyId() {
      const text = this.inviteCode
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$toast({ message: this.$lang.Sucesso, icon: 'success' })
    },
    async handleSave() {
      if (this.saving) return
      this.saving = true
      try {
        const res = await ChangeExtend({ birthday: this.birthday || '' })
        if (res.status === 'ok') {
          this.$toast({ message: this.$lang.Sucesso || 'Saved', icon: 'success' })
          this.$router.go(-1)
        } else {
          this.$toast({ message: res.msg || 'Save failed', icon: 'cross' })
        }
      } catch (e) {
        console.error('ChangeExtend error', e)
        this.$toast({ message: 'Save failed', icon: 'cross' })
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style lang="less" scoped>
.edit-profile-page {
  background-color: #1f1c17;
  min-height: 100vh;
  color: @wihte-color;
}

.ep-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #1f1c17;
  z-index: 999;

  &__back {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
  }

  &__title {
    font-size: 18px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: @wihte-color;
    margin: 0;
  }

  &__save {
    background: none;
    border: none;
    color: #ffa300;
    font-size: 14px;
    font-weight: bold;
    text-transform: uppercase;
    cursor: pointer;
    padding: 0;
  }

  &__spacer {
    height: 55px;
  }
}

.ep-content {
  padding-bottom: 24px;
}

.ep-avatar {
  display: flex;
  justify-content: center;
  margin: 24px auto;
  cursor: pointer;

  &__wrapper {
    position: relative;
    width: 128px;
    height: 128px;
    border-radius: 50%;
    border: 4px solid #2a2e3d;
    overflow: visible;
  }

  &__img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    display: block;
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #2a2e3d;
  }

  &__camera {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #ffa300;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #1f1c17;
  }
}

.ep-field {
  margin-bottom: 20px;
  padding: 0 16px;

  &__label {
    display: block;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #a89b7c;
    margin-bottom: 8px;
  }

  &__input {
    background-color: #15110a;
    border: 1px solid rgba(233, 168, 67, 0.35);
    border-radius: 10px;
    padding: 14px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: @wihte-color;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus-within {
      border-color: #ffa300;
      box-shadow: 0 0 0 2px rgba(255, 163, 0, 0.15);
    }

    &--readonly {
      opacity: 0.7;

      &:focus-within {
        border-color: rgba(233, 168, 67, 0.35);
        box-shadow: none;
      }
    }
  }

  &__text {
    background: transparent;
    border: none;
    color: @wihte-color;
    width: 100%;
    outline: none;
    font-size: 14px;
    padding: 0;
    margin: 0;

    &::placeholder {
      color: #a89b7c;
    }
  }

  &__copy {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin-left: 8px;
  }
}
</style>
