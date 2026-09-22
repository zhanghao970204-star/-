<template>
  <div class="profile-page">
    <title-bar :title="$lang.profile_title" />

    <div class="profile-list">
      <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="profile-list__item"
        @click="gotoDetail(index)"
      >
        <span class="profile-list__label">{{ item.label }}</span>
        <div class="profile-list__right">
          <span v-if="item.value" class="profile-list__value">{{ item.value }}</span>
          <van-icon name="arrow" size="16" color="#a89b7c" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Init } from '@/api/common'

export default {
  name: 'Profile',
  data() {
    return {
      realName: '',
      headUrl: '',
      account: ''
    }
  },
  computed: {
    menuItems() {
      return [
        { label: this.$lang.profile_account_name, value: this.account },
        { label: this.$lang.profile_real_name, value: this.realName },
        { label: this.$lang.profile_login_pass, value: '' },
        { label: this.$lang.profile_withdraw_pass, value: '' },
        { label: this.$lang.profile_bank_card, value: '' },
        { label: this.$lang.profile_avatar, value: '' },
        { label: this.$lang.profile_privacy, value: '' }
      ]
    }
  },
  mounted() {
    this.loadInit()
  },
  methods: {
    async loadInit() {
      const data = await Init()
      if (data.status === 'ok') {
        this.account = data.content.account
        this.realName = data.content.realName
        this.headUrl = data.content.headUrl
      }
    },
    gotoDetail(i) {
      if (i === 1 && !this.realName) {
        this.$jumpTo('/authName', { from: 'profile' })
      } else if (i === 2) {
        this.$jumpTo('/passwordLogin')
      } else if (i === 3) {
        this.$jumpTo('/setPassWord', { from: 'profile' })
      } else if (i === 4) {
        if (this.realName) {
          this.$jumpTo('/bank')
        } else {
          this.$jumpTo('/authName')
        }
      } else if (i === 5) {
        this.$jumpTo('/avatar', { headUrl: this.headUrl })
      } else if (i === 6) {
        this.$jumpTo('/privacy')
      }
    }
  }
}
</script>

<style lang="less" scoped>
.profile-page {
  min-height: 100vh;
  background: @cont-bg;
}

.profile-list {
  padding: 12px 16px;

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: @cont-bg;
    border-radius: 12px;
    padding: 14px 12px;
    margin-bottom: 12px;
    font-size: 14px;
    color: @font-color;
    font-weight: bold;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__value {
    font-size: 13px;
    color: #a89b7c;
    font-weight: normal;
  }
}
</style>
