<template>
  <div>
    <van-popup
      v-model:show="visible"
      :position="position"
      :overlay="overlay"
      :close-on-click-overlay="overlayClick"
      class="lang-popup"
    >
      <div class="lang-popup__wrap">
        <div class="lang-popup__brand">
          <img
            class="lang-popup__logo"
            src="@/assets/img/login/logo.webp"
            alt="BISON FUN"
          />
        </div>
        <div class="lang-popup__panel">
        <p class="lang-popup__title">
          {{ $lang.common_txt272 }}
        </p>
        <div class="lang-popup__list">
          <div
            v-for="(item, index) in CountryList"
            :key="index"
            class="lang-popup__item"
            :class="{ 'is-active': selectIndex === index }"
            @click="selectFun(index, item)"
          >
            <img :src="item.iconUrl" width="28" height="20" alt="" />
            <span>{{ item.countryName }}</span>
          </div>
        </div>
        <div class="lang-popup__hint">
          <img src="../assets/img/otgame/xzgj_3.png" width="14" alt="" />
          <span>{{ $lang.common_txt273 }}</span>
        </div>
        <div class="lang-popup__action">
          <van-button
            size="large"
            class="lang-popup__btn"
            @click="confirm"
            :disabled="selectIndex === null"
          >
            {{ $lang.Confirmar }}
          </van-button>
        </div>
      </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { GetPlatformList } from "@/api/common";
import { logoutIfReloginRequiredWithToken } from "@/utils/platformAuth";
import { applyCountryLanguage } from "@/utils/locale";
export default {
  name: "CommonLang",
  props: {
    overlayClick: {
      type: Boolean,
      default: false,
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: "center",
    },
    overlay: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      info: {},
      selectIndex: null,
      CountryList: [],
      visible: this.modelValue,
      isLoading: false,
    };
  },
  watch: {
    modelValue(newVal) {
      this.visible = newVal;
      if (!newVal) {
        this.selectIndex = null;
      }
    },
    visible(newVal) {
      this.$emit("update:modelValue", newVal);
      if (newVal && this.CountryList.length === 0 && !this.isLoading) {
        this.GetPlatformList();
      }
    },
  },
  mounted() {},
  created() {},
  methods: {
    async GetPlatformList() {
      if (this.isLoading) return;
      this.isLoading = true;

      try {
        const data = await GetPlatformList();
        if (data.status === "ok") {
          this.CountryList = data.content.list;
        } else {
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } catch (error) {
        this.$toast({
          message: error,
          icon: "cross",
        });
      } finally {
        this.isLoading = false;
      }
    },
    confirm() {
      if (this.selectIndex === null || this.CountryList.length === 0) {
        return;
      }
      const prevPlatform = localStorage.getItem("platform");
      logoutIfReloginRequiredWithToken(prevPlatform, this.info.platform);
      localStorage.setItem("currency", this.info.currency);
      localStorage.setItem("areaCode", this.info.areaCode);
      localStorage.setItem("currencyUnit", this.info.currencyUnit);
      localStorage.setItem("platform", this.info.platform);
      applyCountryLanguage(this.info);
      localStorage.setItem("iconUrl", this.info.iconUrl);
      localStorage.setItem("countryName", this.info.countryName);
      localStorage.setItem("country", this.info.country);
      if (this.$route.path.includes("/Country")) {
        this.$router.replace("/" + this.info.country + "/home");
      }
      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
    selectFun(i, v) {
      this.info = v;
      this.selectIndex = i;
    },
  },
};
</script>

<style lang="less" scoped>
/* y7 黑金风格 */
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@gold-grad: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@muted: #a89b7c;
@card: #15110a;
@cell: #2a2418;

.lang-popup {
  width: 85% !important;
  max-width: 360px;
  background: transparent !important;
  overflow: visible !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, calc(-50% - 18px)) !important;
}

.lang-popup__wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
}

.lang-popup__brand {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
  transform: translateY(-36px);
}

.lang-popup__logo {
  width: 180px;
  height: auto;
  display: block;
}

.lang-popup__panel {
  background: linear-gradient(180deg, #2a2418 0%, #1f1c17 40%, #15110a 100%);
  border: 1px solid fade(@gold-deep, 50%);
  border-radius: 16px;
  min-height: auto;
  padding: 16px 16px 18px;
  box-shadow:
    0 12px 36px rgba(0, 0, 0, 0.55),
    0 0 24px rgba(255, 163, 0, 0.12);
  position: relative;
  overflow: hidden;

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: @gold-grad;
  }
}

.lang-popup__title {
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  margin-bottom: 4px;
  background: @gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}

.lang-popup__list {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: flex-start;
  gap: 8px;
  width: 100%;
  min-height: 0;
  margin: 12px auto 0;
  padding: 0 4px;
}

.lang-popup__item {
  width: calc(50% - 4px);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  height: 44px;
  background: @cell;
  border: 1px solid fade(@gold-deep, 28%);
  border-radius: 10px;
  color: @gold-soft;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition:
    border-color 0.15s,
    background 0.15s,
    box-shadow 0.15s;

  img {
    border-radius: 2px;
    flex-shrink: 0;
    object-fit: cover;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &.is-active {
    background: fade(@gold, 16%);
    border-color: @gold-deep;
    color: #fff;
    box-shadow: 0 0 12px rgba(255, 163, 0, 0.22);
  }

  &:active {
    transform: scale(0.98);
  }
}

.lang-popup__hint {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  margin: 12px auto 0;
  padding: 0 8px;
  font-size: 12px;
  color: @muted;
  line-height: 1.35;
}

.lang-popup__action {
  text-align: center;
  margin-top: 14px;
}

.lang-popup__btn {
  width: 70% !important;
  height: 40px !important;
  border: none !important;
  border-radius: 20px !important;
  background: @btn-grad !important;
  color: #573900 !important;
  font-weight: 800 !important;
  box-shadow: 0 4px 14px rgba(255, 163, 0, 0.3);

  &.van-button--disabled {
    background: linear-gradient(180deg, #5a5348 0%, #3d3830 100%) !important;
    color: #8a8174 !important;
    box-shadow: none;
    opacity: 1;
  }
}
</style>
