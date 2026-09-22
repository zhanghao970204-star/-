<template>
  <div class="menu-page">
      <div class="menu-card banner">
        <div class="banner-left">
          <div class="banner-title">{{ $lang.menu_banner_title }}</div>
          <div class="banner-btn" @click="gotoRefer">
            {{ $lang.menu_invite_now }}
          </div>
        </div>
        <div class="banner-right">
          <div class="banner-mascot"></div>
        </div>
      </div>

      <div class="search-wrap" @click="$jumpTo('/searchGame')">
        <van-field
          v-model="search"
          class="search-field"
          :placeholder="$lang.menu_search_placeholder"
          clearable
          left-icon="search"
        />
      </div>

      <div class="quick-tabs">
        <div
          v-for="(item, idx) in quickTabs"
          :key="item.key"
          class="quick-tab"
          @click="quickActive = idx"
        >
          <div class="quick-ic" :class="item.key"></div>
          <div class="quick-tx">{{ item.text }}</div>
        </div>
      </div>

      <!-- <div class="menu-card download">
      <div class="download-left">
        <div class="download-title">{{ $lang.menu_download_title }}</div>
        <div class="download-sub">{{ $lang.menu_download_sub }}</div>
      </div>
      <div class="download-right">
        <div class="download-img"></div>
      </div>
    </div> -->

      <div class="menu-card list">
        <van-cell class="menu-cell" :border="false" is-link @click="gotoVip">
          <template #icon>
            <div class="cell-ic vip"></div>
          </template>
          <template #title>{{ $lang.menu_vip }}</template>
        </van-cell>
        <van-cell class="menu-cell" :border="false" is-link @click="gotoEvents">
          <template #icon>
            <div class="cell-ic events"></div>
          </template>
          <template #title>{{ $lang.menu_events }}</template>
        </van-cell>
      </div>

      <div class="menu-card list">
        <van-cell class="menu-cell" :border="false" is-link @click="gotoHelp">
          <template #icon>
            <div class="cell-ic help"></div>
          </template>
          <template #title>{{ $lang.menu_help }}</template>
        </van-cell>
        <van-cell
          class="menu-cell"
          :border="false"
          is-link
          @click="gotoSupport"
        >
          <template #icon>
            <div class="cell-ic support"></div>
          </template>
          <template #title>{{ $lang.menu_support }}</template>
        </van-cell>
        <van-cell class="menu-cell" :border="false" is-link @click="gotoRedeem">
          <template #icon>
            <div class="cell-ic redeem"></div>
          </template>
          <template #title>{{ $lang.menu_redeem }}</template>
        </van-cell>
      </div>

      <div ref="menuCountryCard" class="menu-card lang">
        <div class="lang-left">
          <div class="cell-ic lang"></div>
          <div class="lang-title">{{ $lang.menu_language }}</div>
        </div>
        <div class="lang-right lang-country">
          <div class="topnav-country-wrap">
            <div
              class="d-flex menu-country-trigger"
              @click.stop="toggleCountryDrop"
            >
              <img :src="GET_ICONURL" width="25" />
              <span class="m-l-5 m-r-5">{{ GET_COUNTRYNAME }}</span>
              <van-icon :name="showCountryDrop ? 'arrow-up' : 'arrow-down'" />
            </div>
            <div v-if="showCountryDrop" class="topnav-country-dropdown">
              <div
                v-for="(item, idx) in countryList"
                :key="idx"
                class="topnav-country-dropdown__item"
                @click.stop="selectCountryNav(item)"
              >
                <img :src="item.iconUrl" width="24" />
                <span>{{ item.countryName }}</span>
                <span
                  style="
                    margin-left: auto;
                    color: #24ee89;
                    font-size: 12px;
                    font-weight: 600;
                  "
                  >{{ item.areaCode }}</span
                >
              </div>
              <div
                v-if="countryList.length === 0"
                class="topnav-country-dropdown__item"
                style="justify-content: center; color: #6b7280"
              >
                Loading...
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import { GetPlatformList } from '@/api/common'
import {
  logoutIfReloginRequiredWithToken,
  clearTokenIfReloginRequired
} from '@/utils/platformAuth'
import { applyCountryLanguage } from '@/utils/locale'

export default {
  name: 'menu',
  data() {
    return {
      search: '',
      showCountryDrop: false,
      countryList: [],
      quickActive: 0,
      quickTabs: [
        { key: 'hot', text: this.$lang.menu_hot },
        { key: 'fav', text: this.$lang.menu_favorites },
        { key: 'recent', text: this.$lang.menu_recent }
      ]
    }
  },
  mounted() {
    this.ensureCountryInfo()
    document.addEventListener('click', this.handleMenuCountryOutsideClick)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleMenuCountryOutsideClick)
  },
  methods: {
    handleMenuCountryOutsideClick(event) {
      if (!this.showCountryDrop) return
      const el = this.$refs.menuCountryCard
      if (el && !el.contains(event.target)) {
        this.showCountryDrop = false
      }
    },
    toggleCountryDrop() {
      this.showCountryDrop = !this.showCountryDrop
      if (this.showCountryDrop && this.countryList.length === 0) {
        this.fetchCountryList()
      }
    },
    async ensureCountryInfo() {
      const country = localStorage.getItem('country')
      if (!country) return
      if (
        localStorage.getItem('countryName') &&
        localStorage.getItem('iconUrl')
      )
        return
      try {
        const data = await GetPlatformList()
        if (
          data.status !== 'ok' ||
          !data.content ||
          !Array.isArray(data.content.list)
        )
          return
        const match = data.content.list.find((i) => i.country === country)
        if (!match) return
        const prevPlatform = localStorage.getItem('platform')
        if (
          clearTokenIfReloginRequired(prevPlatform, match.platform) &&
          this.$bus
        ) {
          this.$bus.$emit('openLogin')
        }
        localStorage.setItem('countryName', match.countryName || '')
        localStorage.setItem('iconUrl', match.iconUrl || '')
        localStorage.setItem('currency', match.currency || '')
        localStorage.setItem('currencyUnit', match.currencyUnit || '')
        localStorage.setItem('areaCode', match.areaCode || '')
        localStorage.setItem('platform', match.platform || '')
        if (!localStorage.getItem('defaultLanguage')) {
          applyCountryLanguage(match)
        }
        this.GET_COUNTRYNAME = match.countryName || ''
        this.GET_ICONURL = match.iconUrl || ''
        this.GET_CURRENCYUNIT = match.currencyUnit || ''
        this.GET_AREACODE = match.areaCode || ''
        this.GET_PLATFORM = match.platform || ''
        this.getCurrency = match.currency || ''
      } catch (e) {
        console.error('ensureCountryInfo error', e)
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
    selectCountryNav(item) {
      const prevPlatform = localStorage.getItem('platform')
      logoutIfReloginRequiredWithToken(prevPlatform, item.platform)
      localStorage.setItem('currency', item.currency)
      localStorage.setItem('areaCode', item.areaCode)
      localStorage.setItem('currencyUnit', item.currencyUnit)
      localStorage.setItem('platform', item.platform)
      applyCountryLanguage(item)
      localStorage.setItem('iconUrl', item.iconUrl)
      localStorage.setItem('countryName', item.countryName)
      localStorage.setItem('country', item.country)
      this.showCountryDrop = false
      this.$router.replace('/' + item.country + '/home')
      setTimeout(() => {
        window.location.reload()
      }, 200)
    },
    gotoRefer() {
      this.$jumpTo('/referFriend')
    },
    gotoVip() {
      this.$jumpTo('/vipLevels')
    },
    gotoEvents() {
      this.$jumpTo('/dailyCheckIn')
    },
    gotoHelp() {
      this.$jumpTo('/Support')
    },
    gotoSupport() {
      this.$jumpTo('/Support')
    },
    gotoRedeem() {
      this.$jumpTo('/redPacket')
    }
  }
}
</script>

<style lang="less" scoped>
.menu-page {
  padding: 0px 15px 90px;
  max-width: 450px;
  margin: 0 auto;
}

.menu-card {
  background: #2d3140;
  border-radius: 12px;
  padding: 12px;
  margin-top: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.banner {
  margin-top: 0;
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: url(../../assets/img/otgame/men-10.png) no-repeat center center;
  background-size: cover;
  overflow: hidden;
}
.banner-left {
  width: 68%;
}
.banner-title {
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 0.2px;
  line-height: 1.2;
  width: 85%;
}
.banner-btn {
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  padding: 0 20px;
  border-radius: 20px;
  background: #f8f510;
  color: #0d1220;
  font-weight: bold;
}
.banner-right {
  width: 32%;
  display: flex;
  justify-content: flex-end;
}
.banner-mascot {
  width: 78px;
  height: 52px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 12px;
}

.search-wrap {
  margin-top: 10px;
}
.search-field {
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.06);
}
::v-deep .search-field .van-field__control {
  color: #ffffff;
}
::v-deep .search-field .van-icon {
  color: #a9b2c7;
}

.quick-tabs {
  margin-top: 10px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.quick-tab {
  background: #2d3140;
  border-radius: 12px;
  height: 58px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255, 255, 255, 0.05);
}
.quick-tab.active {
  background: #303649;
  border-color: rgba(252, 210, 66, 0.35);
}
.quick-ic {
  width: 25px;
  height: 25px;
  margin-bottom: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.quick-ic.hot {
  background-image: url(../../assets/img/otgame/men-1.png);
}
.quick-ic.fav {
  background-image: url(../../assets/img/otgame/men-2.png);
}
.quick-ic.recent {
  background-image: url(../../assets/img/otgame/men-3.png);
}
.quick-tx {
  font-size: 11px;
  color: #d4d9e7;
}

.download {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: url(../../assets/img/otgame/men-11.png) no-repeat center center;
  background-size: cover;
  height: 75px;
}
.download-left {
  width: 62%;
}
.download-title {
  font-size: 16px;
  font-weight: 800;
}
.download-sub {
  margin-top: 4px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.75);
  font-weight: bold;
}
.download-right {
  width: 38%;
  display: flex;
  justify-content: flex-end;
}
.download-img {
  width: 16px;
  height: 16px;
  border-radius: 12px;
}

.list {
  padding: 6px 6px;
}
.menu-cell {
  background: transparent;
  padding: 12px 8px;
  border-radius: 10px;
}
::v-deep .menu-cell .van-cell__title {
  color: #e8ecf7;
  font-weight: 600;
}
::v-deep .menu-cell .van-cell__right-icon {
  color: rgba(255, 255, 255, 0.35);
}
.cell-ic {
  width: 20px;
  height: 20px;
  margin-right: 10px;
  border-radius: 6px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}
.cell-ic.vip {
  background-image: url(../../assets/img/otgame/men-9.png);
}
.cell-ic.events {
  background-image: url(../../assets/img/otgame/men-8.png);
}
.cell-ic.help {
  background-image: url(../../assets/img/otgame/men-7.png);
}
.cell-ic.support {
  background-image: url(../../assets/img/otgame/men-6.png);
}
.cell-ic.redeem {
  background-image: url(../../assets/img/otgame/men-5.png);
}
.cell-ic.lang {
  background-image: url(../../assets/img/otgame/men-4.png);
}

.lang {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 12px;
}
.lang-left {
  display: flex;
  align-items: center;
}
.lang-title {
  font-weight: 700;
  color: #e8ecf7;
}
.lang-right {
  display: flex;
  align-items: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 12px;
}
.lang-country {
  position: relative;
  flex-shrink: 0;
}
.menu-country-trigger {
  justify-content: center;
  background: rgba(0, 0, 0, 0.6);
  border-radius: 3px;
  padding: 7px 10px;
  cursor: pointer;
}
.topnav-country-wrap {
  position: relative;
}
.topnav-country-dropdown {
  position: absolute;
  bottom: 100%;
  top: auto;
  right: 0;
  left: auto;
  min-width: 200px;
  z-index: 3000;
  background: #252936;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  max-height: 220px;
  overflow-y: auto;
  box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.45);
  margin-bottom: 4px;
}
.topnav-country-dropdown__item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  cursor: pointer;
  font-size: 13px;
  color: #ffffff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}
.topnav-country-dropdown__item:last-child {
  border-bottom: none;
}
.topnav-country-dropdown__item:active {
  background: rgba(36, 238, 137, 0.1);
}
.lang-flag {
  height: 16px;
  margin-right: 8px;
  object-fit: cover;
}
.lang-tx {
  margin-right: 6px;
}
</style>
