<template>
  <div>
    <van-popup
      v-model:show="visible"
      :closeable="false"
      :close-icon="closeIcon"
      position="bottom"
      teleport="body"
      :z-index="3000"
      :close-on-click-overlay="true"
      @click-overlay="handleClickOverlay"
      @click-close-icon="logClose"
      @close="handleClose"
      class="login-popup"
      :style="loginPopupStyle"
    >
      <div class="page">
        <button
          type="button"
          class="login-popup__close"
          aria-label="close"
          @click.stop.prevent="logClose"
        >
          <van-icon name="cross" size="26" color="#fff" />
        </button>

        <div class="title">
          <div class="left">
            <img
              v-if="selectIndex === 0"
              class="logo"
              src="@/assets/img/login/left.png"
              alt=""
            />
            <img
              v-else
              class="logo"
              src="@/assets/img/login/right.png"
              alt=""
            />
          </div>
        </div>

        <div class="centent">
          <div class="cententBox">
            <div class="tab">
              <div
                class="tab__item"
                :class="{ 'is-active': selectIndex === 0 }"
                @click="selectTab(0)"
              >
                {{ $lang.Entrar || "Sign In" }}
              </div>
              <div
                class="tab__item"
                :class="{ 'is-active': selectIndex === 1 }"
                @click="selectTab(1)"
              >
                {{ $lang.Registro || "Register" }}
              </div>
            </div>

            <div class="login-popup__form">
              <p class="login-popup__label">
                {{ $lang.login_phone_label || "Phone" }}
              </p>
              <div
                class="login-popup__field-row"
                :class="{
                  'login-popup__field-row--focus': isFocused,
                  'login-popup__field-row--error': vError1,
                }"
                style="position: relative"
              >
                <div class="login-popup__area-code">
                  <img
                    class="login-popup__flag"
                    src="@/assets/img/login/us_flag.png"
                    alt="US"
                  />
                  <span class="login-popup__area-code-text">+1</span>
                </div>
                <!-- 国家下拉先关掉，写死美国 +1
                <div v-if="showCountryDrop" class="login-popup__dropdown">
                  <div
                    v-for="(item, idx) in countryList"
                    :key="idx"
                    class="login-popup__dropdown-item"
                    @click="selectCountry(item)"
                  >
                    <img :src="item.iconUrl" width="24" />
                    <span>{{ item.countryName }}</span>
                    <span class="login-popup__dropdown-code">{{
                      item.areaCode
                    }}</span>
                  </div>
                  <div
                    v-if="countryList.length === 0"
                    class="login-popup__dropdown-item"
                    style="justify-content: center; color: #a6b1c9"
                  >
                    {{ $lang.common_loading || "Loading..." }}
                  </div>
                </div>
                -->
                <van-field
                  :model-value="account"
                  :placeholder="$lang.login_txt || 'Phone Number'"
                  class="login-popup__input"
                  @focus="isFocused = true"
                  @blur="isFocused = false"
                  @update:model-value="getError3"
                  type="digit"
                />
              </div>
              <p v-if="vError1" class="login-popup__error">
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ vError1 }}
              </p>

              <div v-if="showCaptchaField" class="login-popup__field">
                <p class="login-popup__label">
                  {{ $lang.login_captcha_label || "Code" }}
                </p>
                <van-field
                  :model-value="captcha"
                  :placeholder="
                    $lang.login_captcha_placeholder || 'Enter verification code'
                  "
                  class="login-popup__input login-popup__input--captcha"
                  :class="{
                    'login-popup__input--focus': isFocusedCaptcha,
                    'login-popup__input--error': vErrorCaptcha,
                  }"
                  @focus="isFocusedCaptcha = true"
                  @blur="isFocusedCaptcha = false"
                  @update:model-value="getCaptchaError"
                  type="digit"
                  maxlength="6"
                >
                  <template #button>
                    <span
                      class="login-popup__captcha-send"
                      :class="{
                        'login-popup__captcha-send--disabled': !canSendCaptcha,
                      }"
                      @click="sendCaptcha"
                    >
                      {{
                        captchaCountdown > 0
                          ? `${captchaCountdown}s`
                          : $lang.login_captcha_send || "Send"
                      }}
                    </span>
                  </template>
                </van-field>
              </div>
              <p
                v-if="showCaptchaField && vErrorCaptcha"
                class="login-popup__error"
              >
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ vErrorCaptcha }}
              </p>

              <div v-if="showPasswordField" class="login-popup__field">
                <p class="login-popup__label">
                  {{ $lang.login_txt4 || "Password" }}
                </p>
                <van-field
                  :model-value="passwd"
                  :placeholder="$lang.login_pwd_placeholder || 'Enter Password'"
                  class="login-popup__input login-popup__input--icon"
                  :class="{
                    'login-popup__input--focus': isFocused2,
                    'login-popup__input--error': vError2,
                  }"
                  @focus="isFocused2 = true"
                  @blur="isFocused2 = false"
                  :type="!isShowMm ? 'password' : 'text'"
                  @update:model-value="getError"
                >
                  <template #right-icon>
                    <img
                      v-if="isShowMm"
                      class="login-popup__eye"
                      src="@/assets/img/login/eye.png"
                      alt=""
                      @click="isShowMm = !isShowMm"
                    />
                    <img
                      v-else
                      class="login-popup__eye"
                      src="@/assets/img/login/eye_off.png"
                      alt=""
                      @click="isShowMm = !isShowMm"
                    />
                  </template>
                </van-field>
              </div>
              <p v-if="showPasswordField && vError2" class="login-popup__error">
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ vError2 }}
              </p>

              <div v-if="showConfirmPasswordField" class="login-popup__field">
                <p class="login-popup__label">
                  {{ $lang.login_txt6 || "Confirm Password" }}
                </p>
                <van-field
                  :model-value="conPasswd"
                  :placeholder="$lang.login_pwd_placeholder || 'Enter Password'"
                  class="login-popup__input login-popup__input--icon"
                  :class="{
                    'login-popup__input--focus': isFocused3,
                    'login-popup__input--error': vError3,
                  }"
                  @focus="isFocused3 = true"
                  @blur="isFocused3 = false"
                  :type="!isShowMm2 ? 'password' : 'text'"
                  @update:model-value="getError2"
                >
                  <template #right-icon>
                    <img
                      v-if="isShowMm2"
                      class="login-popup__eye"
                      src="@/assets/img/login/eye.png"
                      alt=""
                      @click="isShowMm2 = !isShowMm2"
                    />
                    <img
                      v-else
                      class="login-popup__eye"
                      src="@/assets/img/login/eye_off.png"
                      alt=""
                      @click="isShowMm2 = !isShowMm2"
                    />
                  </template>
                </van-field>
              </div>
              <p
                v-if="showConfirmPasswordField && vError3"
                class="login-popup__error"
              >
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ vError3 }}
              </p>

              <div v-if="showEmailField" class="login-popup__field">
                <p class="login-popup__label">
                  {{ $lang.login_email_label || "Email" }}
                </p>
                <van-field
                  :model-value="email"
                  :placeholder="
                    $lang.login_email_placeholder || 'Enter email address'
                  "
                  class="login-popup__input login-popup__input--icon"
                  :class="{
                    'login-popup__input--focus': isFocusedEmail,
                    'login-popup__input--error': vErrorEmail,
                  }"
                  @focus="isFocusedEmail = true"
                  @blur="isFocusedEmail = false"
                  @update:model-value="getEmailError"
                  type="text"
                >
                </van-field>
              </div>
              <p
                v-if="showEmailField && vErrorEmail"
                class="login-popup__error"
              >
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ vErrorEmail }}
              </p>

              <div v-if="showAuthModeSwitch" class="login-popup__mode-switch">
                <van-radio-group
                  :model-value="loginMode"
                  direction="horizontal"
                  checked-color="#ffd400"
                  @update:model-value="setLoginMode"
                >
                  <van-radio name="password" icon-size="16px">
                    {{ $lang.login_mode_password || "Password" }}
                  </van-radio>
                  <van-radio name="captcha" icon-size="16px">
                    {{ $lang.login_mode_otp || "SMS Code" }}
                  </van-radio>
                </van-radio-group>
              </div>

              <p v-if="apiError" class="login-popup__error">
                <van-icon name="warning" color="#ef4444" size="12" />
                {{ apiError }}
              </p>

              <button
                class="login-popup__submit button dlzc"
                :class="{ 'login-popup__submit--disabled': !isBtnEnable }"
                :disabled="!isBtnEnable"
                @click="LoginBtn"
              >
                {{
                  selectIndex === 0
                    ? $lang.Entrar || "LOG IN"
                    : $lang.Registro || "Register"
                }}
              </button>

              <!-- 仅登录页：游客登录（deviceId 由 Flutter 注入） -->
              <div v-if="selectIndex === 0" class="sg">
                <button
                  type="button"
                  class="login-popup__google button kj"
                  :disabled="guestLoading"
                  @click="handleGuestLogin"
                >
                  <span>{{
                    guestLoading
                      ? "..."
                      : $lang.play_as_guest || "Play as Guest"
                  }}</span>
                </button>
                <!--
                <button
                  class="login-popup__google button kj"
                  @click="handleGoogleLogin"
                  :disabled="googleLoading"
                >
                  <span>{{ $lang.google_login || "Sign in with Google" }}</span>
                </button>
                -->
              </div>

              <div class="login-popup__agree">
                <van-checkbox
                  v-model="agree"
                  shape="square"
                  checked-color="#31FF6F"
                  icon-size="16px"
                >
                  <span class="login-popup__agree-text">{{
                    $lang.common_txt271 ||
                    "Agree or disagree with the Service Policy and Privacy Policy"
                  }}</span>
                </van-checkbox>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- Google Registration Popup -->
    <van-popup
      v-model:show="showGoogleRegister"
      :closeable="true"
      close-icon="cross"
      round
      class="google-reg-popup"
    >
      <div class="google-reg">
        <h3 class="google-reg__title">
          {{ $lang.google_register_title || "Complete Registration" }}
        </h3>
        <div class="login-popup__field-row">
          <div class="login-popup__area-code" @click="showGoogleRegisterLang">
            <img
              class="login-popup__flag"
              src="@/assets/img/login/us_flag.png"
              alt="US"
            />
            <van-icon name="arrow-down" size="10" color="#c9b3ff" />
          </div>
          <van-field
            :model-value="googlePhoneNo"
            :placeholder="$lang.google_register_phone || 'Enter phone number'"
            class="login-popup__input"
            type="digit"
            @update:model-value="onGooglePhoneInput"
          />
        </div>
        <p v-if="googleRegError" class="login-popup__error">
          <van-icon name="warning" color="#ef4444" size="12" />
          {{ googleRegError }}
        </p>
        <button
          class="login-popup__submit button dlzc"
          :disabled="!googlePhoneNo || googleRegLoading"
          :class="{ 'login-popup__submit--disabled': !googlePhoneNo }"
          @click="handleGoogleRegister"
        >
          {{ $lang.Registro || "Register" }}
        </button>
      </div>
    </van-popup>

    <div class="login-vcode-wrap">
      <Vcode
        :show="isShow"
        @success="success"
        @close="close2"
        :successText="$lang.login_txt13"
        :failText="$lang.login_txt14"
        :sliderText="$lang.login_txt15"
      />
    </div>
  </div>
</template>

<script>
import Vcode from "vue3-puzzle-vcode";

import {
  Login,
  GuestLogin,
  Register,
  GetIsFbReport,
  GetInvitationID,
  GetPlatformList,
  GetGoogleAuthorizingUrl,
  GoogleRegister,
  GetCaptcha,
  LoginCaptcha,
  GetSysConfig,
} from "@/api/common";
import { logoutIfReloginRequiredWithToken } from "@/utils/platformAuth";
import md5 from "@/utils/md5";
import { applyCountryLanguage } from "@/utils/locale";
import { isUsAreaCode, isValidUsPhone } from "@/utils/phoneValidate";
import { getClientId } from "@/utils/nativeDevice";
import { reloadAppEntry, saveLoginSession } from "@/utils/guestAuth";
export default {
  components: { Vcode },
  name: "Login",
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    // 是否显示关闭按钮
    closeable: {
      type: Boolean,
      default: false,
    },
    // 关闭按钮的图标
    closeIcon: {
      type: String,
      default: "cross",
    },
    // 是否显示遮罩层
    overlay: {
      type: Boolean,
      default: true,
    },
    loginType: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      showLang: false,
      showCountryDrop: false,
      countryList: [],
      selectedIcon: localStorage.getItem("iconUrl"),
      selectedAreaCode: localStorage.getItem("areaCode"),
      isShow: false,
      isShowMm: false,
      isShowMm2: false,
      agree: true,
      agree2: true,
      vError1: "",
      vError2: "",
      vError3: "",
      vErrorCaptcha: "",
      vErrorEmail: "",
      apiError: "",
      isFocused: false, // 用于标记是否聚焦
      isFocused2: false, // 用于标记是否聚焦
      isFocused3: false,
      isFocusedCaptcha: false,
      isFocusedEmail: false,
      account: "",
      passwd: "",
      conPasswd: "",
      email: "",
      captcha: "",
      captchaCountdown: 0,
      captchaTimer: null,
      isCaptchaSending: false,
      captchaLoginSwitch: false,
      loginMode: "password",
      isLogin: true,
      visible: this.modelValue, // 内部状态
      registerParames: {},
      selectIndex: 0,
      // Google login
      googleLoading: false,
      guestLoading: false,
      _guestLoginAt: 0,
      showGoogleRegister: false,
      googlePhoneNo: "",
      googleThirdUuid: "",
      googleRegError: "",
      googleRegLoading: false,
    };
  },
  // 新增：计算按钮是否可点击
  computed: {
    loginPopupStyle() {
      // 移动端勿设 left:unset，否则 bottom 弹层宽度会塌掉看不见
      const style = {
        width: "100%",
        height: "100%",
        background: "#27033C",
      };
      if (typeof window !== "undefined" && window.innerWidth >= 769) {
        style.left = "unset";
      }
      return style;
    },
    isGhsCurrency() {
      return localStorage.getItem("currency") === "GHS";
    },
    isMxSite() {
      const currency = localStorage.getItem("currency");
      const platform = localStorage.getItem("platform");
      return currency === "MXN" || platform === "mxbet";
    },
    isUsSite() {
      const currency = localStorage.getItem("currency");
      const platform = localStorage.getItem("platform");
      return currency === "USD" || currency === "usd" || platform === "usbet";
    },
    /** 美国区号 +1 / 国家 US：注册走美国手机号规则 */
    isUsPhoneArea() {
      return (
        isUsAreaCode(
          this.selectedAreaCode || this.GET_AREACODE,
          localStorage.getItem("country"),
        ) || this.isUsSite
      );
    },
    usPhoneErrorText() {
      return this.$lang.phone_us_invalid || "错误的手机号码";
    },
    isPhoneAccountValid() {
      if (!this.account) return false;
      if (this.selectIndex === 1 && this.isUsPhoneArea) {
        return isValidUsPhone(this.account);
      }
      return /^\d{8,13}$/.test(this.account);
    },
    showCaptchaLogin() {
      return this.isMxSite && this.captchaLoginSwitch;
    },
    // 仅登录展示密码 / 验证码单选；注册不展示
    showAuthModeSwitch() {
      return this.selectIndex === 0 && this.showCaptchaLogin;
    },
    isRegisterCaptchaRequired() {
      if (this.isGhsCurrency) return true;
      return this.selectIndex === 1 && this.isMxSite;
    },
    showCaptchaField() {
      if (this.selectIndex === 0) {
        return this.showCaptchaLogin && this.loginMode === "captcha";
      }
      return this.isRegisterCaptchaRequired;
    },
    showPasswordField() {
      if (
        this.selectIndex === 0 &&
        this.showCaptchaLogin &&
        this.loginMode === "captcha"
      ) {
        return false;
      }
      return true;
    },
    showConfirmPasswordField() {
      return this.selectIndex === 1 && this.showPasswordField;
    },
    showEmailField() {
      return this.selectIndex === 1 && (this.isUsSite || this.isMxSite);
    },
    isEmailValid() {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(this.email || "").trim());
    },
    canSendCaptcha() {
      return !this.isCaptchaSending && this.captchaCountdown === 0;
    },
    displayIcon() {
      return this.validLsValue(this.selectedIcon || this.GET_ICONURL);
    },
    displayAreaCode() {
      return this.validLsValue(this.selectedAreaCode || this.GET_AREACODE);
    },
    isBtnEnable() {
      if (this.selectIndex === 0) {
        if (this.showCaptchaLogin && this.loginMode === "captcha") {
          return (
            this.isPhoneAccountValid &&
            /^\d{6}$/.test(this.captcha) &&
            !this.vError1 &&
            !this.vErrorCaptcha
          );
        }
        return (
          this.isPhoneAccountValid &&
          this.passwd &&
          !this.vError1 &&
          !this.vError2
        );
      }

      const baseEnable =
        this.isPhoneAccountValid &&
        this.passwd &&
        this.conPasswd &&
        !this.vError1 &&
        !this.vError2 &&
        !this.vError3 &&
        this.agree;

      if (this.showEmailField) {
        return (
          baseEnable &&
          this.isEmailValid &&
          !this.vErrorEmail &&
          (!this.isRegisterCaptchaRequired ||
            (/^\d{6}$/.test(this.captcha) && !this.vErrorCaptcha))
        );
      }

      if (this.isRegisterCaptchaRequired) {
        return (
          baseEnable && /^\d{6}$/.test(this.captcha) && !this.vErrorCaptcha
        );
      }

      return baseEnable;
    },
  },
  watch: {
    // 监听外部传入的 value 值变化
    modelValue(newVal) {
      this.visible = newVal;
    },
    // 监听内部 visible 值变化，同步到外部
    visible(newVal) {
      this.$emit("update:modelValue", newVal);
      this.selectTab(this.loginType);
      if (newVal) {
        this.GetInvitationID();
        this.syncCountryDisplay();
        this.fetchSysConfig();
      }
    },
  },
  mounted() {
    // Google callback is handled by App.vue (checkGoogleCallback)
    this.syncCountryDisplay();
    this.fetchSysConfig();
  },
  methods: {
    async fetchSysConfig() {
      try {
        const data = await GetSysConfig({});
        if (data.status === "ok" && data.content) {
          this.captchaLoginSwitch = !!data.content.captchaLoginSwitch;
          if (!this.showAuthModeSwitch) {
            this.loginMode = "password";
          }
        }
      } catch (e) {
        console.error("fetchSysConfig error", e);
      }
    },
    setLoginMode(mode) {
      if (mode === "captcha" && !this.showAuthModeSwitch) return;
      if (this.loginMode === mode) return;
      this.loginMode = mode;
      this.apiError = "";
      this.vErrorCaptcha = "";
      // 登录切换时清空对方字段；注册短信模式清空密码
      if (this.selectIndex === 0) {
        this.passwd = "";
        this.vError2 = "";
        this.clearCaptchaState();
      } else if (mode === "password") {
        this.clearCaptchaState();
      } else if (mode === "captcha") {
        this.passwd = "";
        this.conPasswd = "";
        this.vError2 = "";
        this.vError3 = "";
      }
    },
    getEmailError(v) {
      this.email = String(v ?? "").replace(/\s+/g, "");
      this.apiError = "";
      if (!this.showEmailField) {
        this.vErrorEmail = "";
        return;
      }
      if (!this.email) {
        this.vErrorEmail = "";
      } else if (!this.isEmailValid) {
        this.vErrorEmail =
          this.$lang.settings_email_invalid || "Please enter a valid email";
      } else {
        this.vErrorEmail = "";
      }
    },
    validLsValue(v) {
      if (v == null) return "";
      const s = String(v).trim();
      if (!s || s === "null" || s === "undefined") return "";
      return s;
    },
    syncCountryDisplay() {
      const icon = this.validLsValue(localStorage.getItem("iconUrl"));
      const area = this.validLsValue(localStorage.getItem("areaCode"));
      if (icon) {
        this.selectedIcon = icon;
        this.GET_ICONURL = icon;
      }
      if (area) {
        this.selectedAreaCode = area;
        this.GET_AREACODE = area;
      }
      if (!this.displayIcon || !this.displayAreaCode) {
        this.ensureCountryInfo();
      }
    },
    async ensureCountryInfo() {
      const country = localStorage.getItem("country");
      try {
        const data = await GetPlatformList();
        if (
          data.status !== "ok" ||
          !data.content ||
          !Array.isArray(data.content.list)
        ) {
          return;
        }
        const list = data.content.list;
        this.countryList = list;
        const match = list.find((i) => i && i.country === country) || list[0];
        if (!match) return;
        if (match.iconUrl) {
          this.selectedIcon = match.iconUrl;
          this.GET_ICONURL = match.iconUrl;
          localStorage.setItem("iconUrl", match.iconUrl);
        }
        if (match.areaCode) {
          this.selectedAreaCode = match.areaCode;
          this.GET_AREACODE = match.areaCode;
          localStorage.setItem("areaCode", match.areaCode);
        }
        if (match.countryName) {
          localStorage.setItem("countryName", match.countryName);
        }
        if (match.currency) {
          localStorage.setItem("currency", match.currency);
        }
        if (match.currencyUnit) {
          localStorage.setItem("currencyUnit", match.currencyUnit);
        }
        if (match.platform) {
          localStorage.setItem("platform", match.platform);
        }
        if (!localStorage.getItem("defaultLanguage")) {
          applyCountryLanguage(match);
        }
        if (match.country) {
          localStorage.setItem("country", match.country);
        }
      } catch (e) {
        console.error("ensureCountryInfo error", e);
      }
    },
    async GetInvitationID() {
      const data = await GetInvitationID({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.invitCode) {
          localStorage.setItem("id", data.content.invitCode);
        }
      }
    },
    getLangT() {
      this.showCountryDrop = !this.showCountryDrop;
      if (this.showCountryDrop && this.countryList.length === 0) {
        this.fetchCountryList();
      }
    },
    async fetchCountryList() {
      try {
        const data = await GetPlatformList();
        if (data.status === "ok") {
          this.countryList = data.content.list;
        }
      } catch (e) {
        console.error("fetchCountryList error", e);
      }
    },
    selectCountry(item) {
      const prevPlatform = localStorage.getItem("platform");
      logoutIfReloginRequiredWithToken(prevPlatform, item.platform);
      this.selectedIcon = item.iconUrl;
      this.selectedAreaCode = item.areaCode;
      localStorage.setItem("areaCode", item.areaCode);
      localStorage.setItem("iconUrl", item.iconUrl);
      localStorage.setItem("currency", item.currency);
      localStorage.setItem("currencyUnit", item.currencyUnit);
      localStorage.setItem("platform", item.platform);
      applyCountryLanguage(item);
      localStorage.setItem("countryName", item.countryName);
      localStorage.setItem("country", item.country);
      this.showCountryDrop = false;
      // Reload to apply the new language
      setTimeout(() => {
        reloadAppEntry();
      }, 200);
    },
    goToActive() {
      this.$jumpTo("/activityCooperate");
    },
    onGooglePhoneInput(v) {
      this.googlePhoneNo = String(v ?? "")
        .replace(/\D/g, "")
        .slice(0, 13);
    },
    getError3(v) {
      // Vant4 / type=digit 可能传入 number，需先转字符串
      this.account = String(v ?? "")
        .replace(/\D/g, "")
        .slice(0, 13);
      this.apiError = "";

      if (this.selectIndex === 1) {
        if (this.account.length === 0) {
          this.vError1 = "";
        } else if (this.isUsPhoneArea) {
          this.vError1 = isValidUsPhone(this.account)
            ? ""
            : this.usPhoneErrorText;
        } else if (this.account.length < 8 || this.account.length > 13) {
          this.vError1 = this.$lang.common_txt369;
        } else {
          this.vError1 = "";
        }
      }
    },
    getError(v) {
      this.passwd = String(v ?? "").replace(/\s+/g, "");
      this.apiError = "";
      if (this.selectIndex === 1) {
        if (this.passwd.length === 0) {
          this.vError2 = "";
        } else if (this.passwd.length > 16 || this.passwd.length < 6) {
          this.vError2 = this.$lang.login_txt17;
        } else {
          this.vError2 = "";
        }
      }
    },
    getError2(v) {
      this.conPasswd = String(v ?? "").replace(/\s+/g, "");
      this.apiError = "";
      if (this.selectIndex === 1) {
        if (this.conPasswd.length === 0) {
          this.vError3 = "";
        } else if (this.conPasswd !== this.passwd) {
          this.vError3 = this.$lang.login_txt18;
        } else {
          this.vError3 = "";
        }
      }
    },
    getCaptchaError(v) {
      this.captcha = String(v ?? "")
        .replace(/\D/g, "")
        .slice(0, 6);
      if (this.showCaptchaField) {
        this.vErrorCaptcha = "";
      }
    },
    startCaptchaCountdown() {
      this.captchaCountdown = 60;
      if (this.captchaTimer) {
        clearInterval(this.captchaTimer);
      }
      this.captchaTimer = setInterval(() => {
        if (this.captchaCountdown > 0) {
          this.captchaCountdown -= 1;
        } else {
          clearInterval(this.captchaTimer);
          this.captchaTimer = null;
        }
      }, 1000);
    },
    clearCaptchaState() {
      this.captcha = "";
      this.vErrorCaptcha = "";
      this.captchaCountdown = 0;
      this.isCaptchaSending = false;
      if (this.captchaTimer) {
        clearInterval(this.captchaTimer);
        this.captchaTimer = null;
      }
    },
    async sendCaptcha() {
      if (!this.canSendCaptcha || !this.showCaptchaField) {
        return;
      }
      if (!this.account) {
        this.vError1 = this.$lang.login_txt19;
        return;
      }
      if (this.isUsPhoneArea && this.selectIndex === 1) {
        if (!isValidUsPhone(this.account)) {
          this.vError1 = this.usPhoneErrorText;
          return;
        }
      } else if (!/^\d{8,13}$/.test(this.account)) {
        this.vError1 = this.$lang.common_txt369;
        return;
      }
      this.vError1 = "";
      this.isCaptchaSending = true;
      const captchaType =
        this.selectIndex === 0 && this.loginMode === "captcha"
          ? "login"
          : "register";
      try {
        const data = await GetCaptcha({
          areaCode: this.GET_AREACODE,
          phoneNo: this.account,
          captchaType,
        });
        if (data.status === "ok") {
          this.startCaptchaCountdown();
        } else {
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } catch (e) {
        this.$toast({
          message: this.$lang.network_error || "Network error",
          icon: "cross",
        });
      } finally {
        this.isCaptchaSending = false;
      }
    },
    // 用户通过了验证
    success() {
      this.isShow = false; // 通过验证后，需要手动隐藏模态框
      this.Register();
    },
    // 用户点击遮罩层，应该关闭模态框
    close2() {
      this.isShow = false;
    },
    logClose() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.account = "";
      this.passwd = "";
      this.conPasswd = "";
      this.email = "";
      this.vError1 = "";
      this.vError2 = "";
      this.vError3 = "";
      this.vErrorEmail = "";
      this.apiError = "";
      this.clearCaptchaState();
      this.loginMode = "password";
      this.isShowMm = false;
      this.isShowMm2 = false;
      this.$emit("close");
    },
    selectTab(i) {
      this.selectIndex = i;
      this.vError1 = "";
      this.vError2 = "";
      this.vError3 = "";
      this.vErrorEmail = "";
      this.apiError = "";
      this.account = "";
      this.passwd = "";
      this.conPasswd = "";
      this.email = "";
      this.clearCaptchaState();
      this.loginMode = "password";
    },
    gotoPrivacy() {
      this.$jumpTo("/privacy");
    },
    isLoginRegister() {
      this.isLogin = !this.isLogin;
    },
    // 点击遮罩层时触发
    handleClickOverlay() {
      this.logClose();
      this.$emit("click-overlay");
    },
    // 弹窗关闭时触发
    handleClose() {
      this.$emit("close");
    },
    async GetIsFbReport() {
      const data = await GetIsFbReport({
        inviteCode: localStorage.getItem("id"),
      });
      if (data.status === "ok") {
        if (data.content.isReport) {
          if (data.content.target === "ks") {
            window.kwaiq.load(data.content.fbPixId);
            window.kwaiq
              .instance(data.content.fbPixId)
              .track("completeRegistration");
            console.log("completeRegistration");
          } else {
            this.$pixel.setFbId(data.content.fbPixId);
            this.$pixel.callTrack("track", "CompleteRegistration"); // 上报
            const jsonData = ` ""{"data":[{"event_name": "CompleteRegistration","status": "success","value": 0.00,"currency": "NGN"}]}""`;
            this.$pixel.sendEventToAndroid(jsonData);
          }
        }
      }
    },
    showFormToast(message, icon = "cross") {
      if (!message) return;
      this.$toast({
        message,
        icon,
        zIndex: 4000,
        className: "login-toast",
      });
    },
    async Register() {
      // 修改4：注册时账号直接使用纯数字
      this.registerParames.areaCode = this.GET_AREACODE;
      this.registerParames.phoneNo = this.account;
      if (this.showEmailField) {
        this.registerParames.email = String(this.email || "").trim();
      } else {
        this.registerParames.email = "";
      }
      if (this.isRegisterCaptchaRequired) {
        this.registerParames.captcha = this.captcha;
      } else {
        delete this.registerParames.captcha;
      }

      this.registerParames.account = this.account;
      this.registerParames.loginType = "account";
      this.registerParames.passwd = md5(this.passwd);
      if (localStorage.getItem("id")) {
        this.registerParames.id = localStorage.getItem("id");
        this.registerParames.fbExpand = localStorage.getItem("fbExpand");
      } else {
        delete this.registerParames.id;
        delete this.registerParames.fbExpand;
      }
      this.GetIsFbReport();
      const data = await Register(this.registerParames);
      if (data.status === "ok") {
        this.visible = false;
        saveLoginSession(data.content || {}, { clearGuest: true });
        setTimeout(() => {
          reloadAppEntry();
        }, 200);
        localStorage.setItem("isRegister", "isRegister");
        this.$emit("close-key");
      } else {
        this.apiError = data.msg || this.$lang.network_error || "Error";
        this.showFormToast(this.apiError);
      }
    },
    async LoginCaptchaSubmit() {
      this.apiError = "";
      const data = await LoginCaptcha({
        areaCode: this.GET_AREACODE,
        phoneNo: this.account,
        captcha: this.captcha,
      });
      if (data.status === "ok") {
        this.visible = false;
        saveLoginSession(data.content || {}, { clearGuest: true });
        setTimeout(() => {
          reloadAppEntry();
        }, 200);
        this.$emit("close-key");
      } else {
        this.apiError = data.msg || this.$lang.network_error || "Error";
        this.showFormToast(this.apiError);
      }
    },
    async Login() {
      this.apiError = "";
      const data = await Login({
        account: this.account,
        passwd: md5(this.passwd),
        loginType: "account",
      });
      if (data.status === "ok") {
        this.visible = false;
        saveLoginSession(data.content || {}, { clearGuest: true });
        setTimeout(() => {
          reloadAppEntry();
        }, 200);
        this.$emit("close-key");
      } else {
        this.apiError = data.msg || this.$lang.network_error || "Error";
        this.showFormToast(this.apiError);
      }
    },
    /**
     * 游客登录：POST /login/guestLogin
     * 只需 uuid（+ 拦截器自动 platform/currency 等）；不要传 account/passwd
     */
    async handleGuestLogin() {
      if (this.guestLoading) return;
      if (!this.agree) {
        this.showFormToast(this.$lang.login_txt22, "info");
        return;
      }
      // 文档：同一 uuid+platform 10 秒内只能请求 1 次
      const now = Date.now();
      if (now - this._guestLoginAt < 10000) {
        this.showFormToast(
          this.$lang.guest_login_too_frequent ||
            "Too frequent, please try again later",
        );
        return;
      }

      this.guestLoading = true;
      this.apiError = "";
      try {
        console.log("[GuestLogin] start");
        let uuid = (await getClientId(3000)) || "";
        uuid = String(uuid).trim();
        console.log("[GuestLogin] uuid=", uuid);
        if (!uuid || uuid.length > 128) {
          this.apiError =
            this.$lang.guest_device_id_missing ||
            "Device ID unavailable. Please open in the App.";
          this.showFormToast(this.apiError);
          return;
        }

        const payload = { uuid };
        const inviteId = localStorage.getItem("id");
        if (inviteId) {
          payload.id = inviteId;
          const fbExpand = localStorage.getItem("fbExpand");
          if (fbExpand) payload.fbExpand = fbExpand;
        }
        const invitationCode = localStorage.getItem("invitationCode");
        if (invitationCode) payload.invitationCode = invitationCode;

        this._guestLoginAt = Date.now();
        console.log("[GuestLogin] request", payload);
        const data = await GuestLogin(payload);
        console.log("[GuestLogin] response", data);
        if (data.status === "ok" && data.content && data.content.accessToken) {
          this.visible = false;
          saveLoginSession(data.content, { uuid });
          setTimeout(() => {
            reloadAppEntry();
          }, 200);
          this.$emit("close-key");
        } else {
          this.apiError = data.msg || this.$lang.network_error || "Error";
          this.showFormToast(this.apiError);
        }
      } catch (e) {
        console.error("[GuestLogin] error:", e);
        this.apiError =
          (e && (e.message || e.msg)) ||
          this.$lang.network_error ||
          "Network error";
        this.showFormToast(this.apiError);
      } finally {
        this.guestLoading = false;
      }
    },
    // 登录
    async LoginBtn() {
      this.apiError = "";
      if (!this.account) {
        this.vError1 = this.$lang.login_txt19;
      } else if (
        this.selectIndex === 1 &&
        this.isUsPhoneArea &&
        !isValidUsPhone(this.account)
      ) {
        this.vError1 = this.usPhoneErrorText;
      } else if (!/^\d{8,13}$/.test(this.account)) {
        this.vError1 = this.$lang.common_txt369;
      } else {
        this.vError1 = "";
      }

      const isCaptchaLogin =
        this.selectIndex === 0 &&
        this.showCaptchaLogin &&
        this.loginMode === "captcha";

      if (!isCaptchaLogin) {
        if (!this.passwd) {
          this.vError2 = this.$lang.login_txt19;
        } else if (this.passwd.length > 16 || this.passwd.length < 6) {
          this.vError2 = this.$lang.login_txt21;
        } else {
          this.vError2 = "";
        }
      } else {
        this.vError2 = "";
      }

      if (this.showConfirmPasswordField) {
        if (!this.conPasswd) {
          this.vError3 = this.$lang.login_txt19;
        } else if (this.conPasswd !== this.passwd) {
          this.vError3 = this.$lang.login_txt19;
        } else {
          this.vError3 = "";
        }
      } else {
        this.vError3 = "";
      }

      if (this.showCaptchaField) {
        if (!this.captcha) {
          this.vErrorCaptcha =
            this.isRegisterCaptchaRequired || isCaptchaLogin
              ? this.$lang.login_txt19
              : "";
        } else if (!/^\d{6}$/.test(this.captcha)) {
          this.vErrorCaptcha =
            this.$lang.login_captcha_invalid || "Enter a 6-digit code";
        } else {
          this.vErrorCaptcha = "";
        }
      } else {
        this.vErrorCaptcha = "";
      }

      if (this.showEmailField) {
        if (!this.email) {
          this.vErrorEmail = this.$lang.login_txt19;
        } else if (!this.isEmailValid) {
          this.vErrorEmail =
            this.$lang.settings_email_invalid || "Please enter a valid email";
        } else {
          this.vErrorEmail = "";
        }
      } else {
        this.vErrorEmail = "";
      }

      if (!this.agree && this.selectIndex === 1) {
        this.showFormToast(this.$lang.login_txt22, "info");
        return;
      }

      if (isCaptchaLogin && !this.vError1 && !this.vErrorCaptcha) {
        this.LoginCaptchaSubmit();
      } else if (
        this.selectIndex === 1 &&
        !this.vError1 &&
        !this.vError2 &&
        !this.vError3 &&
        !this.vErrorCaptcha &&
        !this.vErrorEmail &&
        this.agree
      ) {
        this.Register();
      } else if (
        this.selectIndex === 0 &&
        !isCaptchaLogin &&
        !this.vError1 &&
        !this.vError2
      ) {
        this.Login();
      }
    },
    // Google Login: Step 1 - get auth URL and redirect
    async handleGoogleLogin() {
      console.log("[Google OAuth] handleGoogleLogin clicked");
      this.googleLoading = true;
      try {
        const toUrl = window.location.origin;
        console.log(
          "[Google OAuth] Calling GetGoogleAuthorizingUrl with toUrl:",
          toUrl,
        );
        const data = await GetGoogleAuthorizingUrl({
          toUrl: toUrl,
          isWap: true,
        });
        console.log(
          "[Google OAuth] GetGoogleAuthorizingUrl response:",
          JSON.stringify(data).substring(0, 500),
        );
        if (data.status === "ok" && data.content && data.content.redirectUri) {
          console.log(
            "[Google OAuth] Redirecting to:",
            data.content.redirectUri,
          );
          localStorage.setItem("googleToUrl", toUrl);
          window.location.href = data.content.redirectUri;
        } else {
          this.$toast({
            message: data.msg || this.$lang.google_login_url_failed,
            icon: "cross",
          });
        }
      } catch (e) {
        console.error("[Google OAuth] handleGoogleLogin error:", e);
        this.$toast({
          message: this.$lang.network_error,
          icon: "cross",
        });
      } finally {
        this.googleLoading = false;
      }
    },
    // Google Login: Step 3 - register with phone
    async handleGoogleRegister() {
      if (!this.googlePhoneNo) {
        this.googleRegError =
          this.$lang.login_txt19 || "Please enter the content";
        return;
      }
      if (this.isUsPhoneArea && !isValidUsPhone(this.googlePhoneNo)) {
        this.googleRegError = this.usPhoneErrorText;
        return;
      }
      if (!this.isUsPhoneArea && !/^\d{8,13}$/.test(this.googlePhoneNo)) {
        this.googleRegError =
          this.$lang.common_txt369 ||
          "The account number must consist of 8 to 13 digits only.";
        return;
      }
      this.googleRegError = "";
      this.googleRegLoading = true;
      try {
        const params = {
          thirdUuid: this.googleThirdUuid,
          phoneNo: this.googlePhoneNo,
          areaCode: this.GET_AREACODE,
          isWap: true,
        };
        if (localStorage.getItem("id")) {
          params.id = localStorage.getItem("id");
        }
        if (localStorage.getItem("fbExpand")) {
          params.fbExpand = localStorage.getItem("fbExpand");
        }
        const data = await GoogleRegister(params);
        if (data.status === "ok" && data.content) {
          saveLoginSession(data.content, { clearGuest: true });
          localStorage.removeItem("googleToUrl");
          this.showGoogleRegister = false;
          localStorage.setItem("isRegister", "isRegister");
          setTimeout(() => {
            reloadAppEntry();
          }, 200);
        } else {
          this.googleRegError = data.msg || this.$lang.google_register_failed;
        }
      } catch (e) {
        this.googleRegError = this.$lang.network_error;
      } finally {
        this.googleRegLoading = false;
      }
    },
    showGoogleRegisterLang() {
      this.showGoogleRegister = false;
      this.showLang = true;
    },
  },
  beforeUnmount() {
    if (this.captchaTimer) {
      clearInterval(this.captchaTimer);
      this.captchaTimer = null;
    }
  },
};
</script>

<style lang="less" scoped>
.login-popup {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
  max-height: 100% !important;
  left: 0 !important;
  right: 0 !important;
  overflow: hidden;

  :deep(.van-popup__close-icon) {
    font-size: 28px;
    padding: 5px;
    border-radius: 4px;
    color: #fff;
    top: 18px;
    z-index: 100;
  }

  :deep(.van-checkbox__label) {
    font-size: 12px;

    span {
      color: #31ff6f;
      padding: 0 3px;
    }
  }
}

:deep(.van-checkbox__icon) {
  border-radius: 3px;
  overflow: hidden;
}

:deep(.van-checkbox__label) {
  color: #fff;

  & > span {
    color: #31ff6f !important;
  }
}

.login-popup__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 200;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  pointer-events: auto;

  .van-icon {
    font-weight: 600;
    -webkit-text-stroke: 0.6px #fff;
  }
}

.page {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  background-color: #27033c;
  background-image: url(@/assets/img/common/page_bg.png);
  background-repeat: repeat;
  background-size: auto;
  background-position: top center;

  .centent {
    width: 100%;
    flex: 1;
    overflow: auto;
    box-sizing: border-box;
    position: relative;

    .cententBox {
      position: relative;
      z-index: 1;
      height: 100%;
      padding-top: 4px;
      box-sizing: border-box;

      .tab {
        display: flex;
        align-items: center;
        margin: 8px 24px 0;
        height: 44px;
        padding: 3px;
        box-sizing: border-box;
        background: #000;
        border-radius: 999px;

        .tab__item {
          flex: 1;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 700;
          color: #c9b3ff;
          border-radius: 999px;
          cursor: pointer;
          transition:
            background 0.2s,
            color 0.2s;

          &.is-active {
            background: #ffd400;
            color: #111;
          }
        }
      }
    }
  }

  .title {
    width: 100%;
    box-sizing: border-box;
    padding: 28px 18px 0;
    display: flex;
    justify-content: center;
    z-index: 1;

    .left {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;

      .logo {
        width: 86%;
        max-width: 320px;
        height: auto;
        display: block;
        margin: 0 auto;
        object-fit: contain;
      }
    }
  }
}

.login-popup__form {
  padding: 18px 22px 28px;
  box-sizing: border-box;
}

.login-popup__label {
  margin: 0 0 8px;
  padding: 0 2px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
}

.login-popup__field-row {
  position: relative;
  display: flex;
  align-items: stretch;
  gap: 0;
  margin-bottom: 4px;
  background: #000;
  border-radius: 25px;
  overflow: hidden;
  box-sizing: border-box;

  /* 选中边框叠在子元素之上，避免被黑底盖住 */
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 25px;
    border: 1px solid transparent;
    pointer-events: none;
    z-index: 5;
    box-sizing: border-box;
  }

  &--focus::after {
    border-color: #ffd400;
  }

  &--error::after {
    border-color: #ef4444;
  }
}

.login-popup__field {
  margin-top: 14px;
  margin-bottom: 4px;
}

.login-popup__flag {
  width: 24px;
  height: 16px;
  flex-shrink: 0;
  display: block;
  object-fit: cover;
  border-radius: 2px;
}

.login-popup__area-code {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  height: 48px;
  min-width: 64px;
  background: transparent;
  border: none;
  border-right: 1px solid rgba(255, 255, 255, 0.35);
  border-radius: 0;
  flex-shrink: 0;
  position: relative;
  pointer-events: none;
  transition: border-color 0.2s;

  &-text {
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    white-space: nowrap;
  }
}

.login-popup__field-row--focus .login-popup__area-code {
  border-right-color: #ffd400;
}

.login-popup__field-row--error .login-popup__area-code {
  border-right-color: #ef4444;
}

.login-popup__dropdown {
  position: absolute;
  top: 52px;
  left: 0;
  right: 0;
  z-index: 100;
  background: #12001f;
  border: 1px solid rgba(201, 179, 255, 0.25);
  border-radius: 12px;
  max-height: 200px;
  overflow-y: auto;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);

  &-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 14px;
    cursor: pointer;
    font-size: 13px;
    color: #fff;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: rgba(201, 179, 255, 0.12);
    }
  }

  &-code {
    margin-left: auto;
    color: #c9b3ff;
    font-weight: 600;
    font-size: 12px;
  }
}

.login-popup__input {
  height: 48px;
  background: #000 !important;
  border: none !important;
  border-radius: 25px !important;
  color: #fff;
  font-size: 14px;
  transition: box-shadow 0.2s;

  .login-popup__field-row & {
    border-radius: 0 !important;
    flex: 1;
    /* 手机号整行边框由 field-row 负责，输入框本身不再画边 */
    box-shadow: none !important;
  }

  &--focus {
    /* 外描边不被内部黑底遮挡 */
    box-shadow: 0 0 0 1px #ffd400 !important;
  }

  &--error {
    box-shadow: 0 0 0 1px #ef4444 !important;
  }

  :deep(.van-field__control) {
    color: #fff;
  }

  :deep(.van-field__control::placeholder) {
    color: #9b86c9;
  }

  :deep(.van-field__left-icon),
  :deep(.van-field__right-icon) {
    display: flex;
    align-items: center;
  }
}

.login-popup__eye {
  width: 22px;
  height: 22px;
  display: block;
  cursor: pointer;
  object-fit: contain;
}

.login-popup__mode-switch {
  margin: 14px 0 4px;
  padding: 0 2px;

  :deep(.van-radio-group) {
    display: flex;
    gap: 24px;
  }

  :deep(.van-radio) {
    margin-right: 0;
  }

  :deep(.van-radio__label) {
    color: #fff;
    font-size: 13px;
  }

  :deep(.van-radio__icon .van-icon) {
    border-color: #c9b3ff66;
  }
}

.login-popup__captcha-send {
  color: #ffd400;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  user-select: none;

  &--disabled {
    color: #a6b1c9;
    cursor: not-allowed;
  }
}

.login-popup__error {
  color: #ef4444;
  font-size: 11px;
  padding: 4px 4px 8px;
  display: flex;
  align-items: center;
  gap: 4px;
}

.button {
  color: #fff;
  width: 100% !important;
  font-size: 16px;
  font-weight: 800;
  height: 48px;
  line-height: 48px;
  border: none;
  border-radius: 999px;
  cursor: pointer;
  letter-spacing: 0.5px;
  -webkit-tap-highlight-color: transparent;
}

/* Sign In / Register：公共绿色立体按钮 */
.dlzc {
  .btn-3d-green();
  font-size: 16px;
}

/* Play as Guest：公共蓝色立体按钮 */
.kj {
  .btn-3d-blue();
  font-size: 16px;
  backdrop-filter: none;
}

.login-popup__submit {
  margin-top: 22px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &--disabled {
    opacity: 0.55;
    cursor: not-allowed;
    filter: none;
  }
}

.login-popup__agree {
  margin: 0 5px;
  margin-top: 18px;

  &-text {
    font-size: 12px;
    color: #fff;
    line-height: 1.4;
  }

  :deep(.van-checkbox__label) {
    margin-left: 6px;
    line-height: 1.4;
  }
}

@keyframes glow-login-btn {
  0% {
    left: -100%;
    opacity: 0;
  }

  20% {
    opacity: 1;
  }

  to {
    left: 100%;
    opacity: 0;
  }
}

.sg {
  position: relative;
  overflow: visible;
  border-radius: 999px;
  margin-top: 14px;
}

.sg .login-popup__google {
  position: relative;
  overflow: visible;
}

.sg .login-popup__google:after {
  display: none;
}

.login-popup__google {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  pointer-events: auto;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.google-reg-popup {
  width: 93%;
  max-width: 420px;
  background: #27033c !important;
  background-image: url(@/assets/img/common/page_bg.png);
  background-repeat: repeat;
  background-size: auto;
  border: 1px solid rgba(201, 179, 255, 0.25);
  border-radius: 16px !important;
  padding: 24px 20px;
}

.google-reg {
  &__title {
    color: #ffd400;
    font-size: 18px;
    font-weight: 700;
    text-align: center;
    margin-bottom: 20px;
  }

  .login-popup__submit {
    margin-top: 20px;
  }
}

.login-vcode-wrap {
  position: relative;
  z-index: 9999999;
}

@media (min-width: 769px) {
  .login-popup {
    width: 450px !important;
    max-width: 450px !important;
    left: 50% !important;
    right: auto !important;
    transform: translateX(-50%) !important;
  }

  .page {
    width: 100%;
    margin: 0 auto;
  }

  .google-reg-popup {
    width: 400px !important;
  }
}
</style>
