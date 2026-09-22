<template>
  <div class="settings-page">
    <title-bar :title="$lang.settings_title || 'SETTINGS'" />

    <div class="settings-content">
      <!-- Account Security -->
      <section class="settings-section">
        <div class="settings-section__header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"
            />
          </svg>
          <h2>{{ $lang.settings_account_security || "ACCOUNT SECURITY" }}</h2>
        </div>
        <div class="settings-card">
          <div class="settings-item" @click="openEmailPopup">
            <div class="settings-item__info">
              <p class="settings-item__label">
                {{ $lang.settings_email || "Email Address" }}
              </p>
              <p class="settings-item__value">
                {{ boundMailDisplay }}
              </p>
            </div>
            <button
              class="settings-item__btn settings-item__btn--gold"
              type="button"
              @click.stop="openEmailPopup"
            >
              {{
                hasBoundMail
                  ? $lang.settings_change || "CHANGE"
                  : $lang.settings_bind || "BIND"
              }}
            </button>
          </div>
        </div>
      </section>

      <!-- Social Binding -->
      <!-- <section class="settings-section">
        <div class="settings-section__header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"
            />
          </svg>
          <h2>{{ $lang.settings_social_binding || "SOCIAL BINDING" }}</h2>
        </div>
        <div class="settings-card">
          <div
            v-for="(social, idx) in socialList"
            :key="idx"
            class="settings-item disabled-feature"
            :class="{ 'settings-item--border': idx < socialList.length - 1 }"
          >
            <div class="settings-item__left">
              <div
                class="settings-item__icon"
                :style="{ background: social.color }"
              >
                <svg
                  class="social-svg"
                  viewBox="0 0 24 24"
                  fill="var(--wihte-color)"
                  v-html="social.svgPath"
                ></svg>
              </div>
              <span class="settings-item__name">{{ social.name }}</span>
            </div>
            <button class="settings-item__btn settings-item__btn--gray">
              {{ $lang.settings_bind || "BIND" }}
            </button>
          </div>
        </div>
      </section> -->

      <!-- Preferences -->
      <section class="settings-section">
        <div class="settings-section__header">
          <svg class="section-icon" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6A3.6 3.6 0 1115.6 12 3.611 3.611 0 0112 15.6z"
            />
          </svg>
          <h2>{{ $lang.settings_preferences || "PREFERENCES" }}</h2>
        </div>
        <div class="settings-card">
          <!-- Language (functional) -->
          <div
            class="settings-item settings-item--border"
            @click="showLangPopup = true"
          >
            <div class="settings-item__left">
              <div class="settings-item__icon-round">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#a89b7c">
                  <path
                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95a15.65 15.65 0 00-1.38-3.56A8.03 8.03 0 0118.92 8zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56A7.987 7.987 0 015.08 16zm2.95-8H5.08a7.987 7.987 0 014.33-3.56A15.65 15.65 0 008.03 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95a8.03 8.03 0 01-4.33 3.56zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z"
                  />
                </svg>
              </div>
              <span class="settings-item__name">{{
                $lang.settings_language || "Language"
              }}</span>
            </div>
            <div class="settings-item__right">
              <span class="settings-item__hint">{{ currentLangLabel }}</span>
              <van-icon name="arrow" size="14" color="#a89b7c" />
            </div>
          </div>

          <!-- Push Notifications (UI only) -->
          <div
            class="settings-item settings-item--border"
            @click="pushEnabled = !pushEnabled"
          >
            <div class="settings-item__left">
              <div class="settings-item__icon-round">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#a89b7c">
                  <path
                    d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
                  />
                </svg>
              </div>
              <span class="settings-item__name">{{
                $lang.settings_push || "Push Notifications"
              }}</span>
            </div>
            <div
              class="settings-toggle"
              :class="{ 'settings-toggle--on': pushEnabled }"
            >
              <div class="settings-toggle__track">
                <div class="settings-toggle__thumb"></div>
              </div>
            </div>
          </div>

          <!-- Sound Volume (UI only) -->
          <div class="settings-item">
            <div class="settings-item__left">
              <div class="settings-item__icon-round">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#a89b7c">
                  <path
                    d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0014 8.14v7.72c1.48-.73 2.5-2.25 2.5-3.86zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                  />
                </svg>
              </div>
              <span class="settings-item__name">{{
                $lang.settings_sound || "Sound Volume"
              }}</span>
            </div>
            <div class="settings-slider" @click.stop>
              <input
                v-model="soundVolume"
                type="range"
                min="0"
                max="100"
                class="settings-slider__input"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Logout -->
      <div class="settings-logout">
        <button class="settings-logout__btn" @click="showLogoutPopup = true">
          {{ $lang.mine_txt14 || "Log Out" }}
        </button>
      </div>
    </div>

    <van-popup
      v-model:show="showLangPopup"
      position="bottom"
      round
      class="lang-popup"
    >
      <div class="lang-popup__content">
        <div class="lang-popup__header">
          <span>{{ $lang.settings_language || "Language" }}</span>
          <van-icon
            name="cross"
            size="20"
            color="#a89b7c"
            @click="showLangPopup = false"
          />
        </div>
        <div
          v-for="item in langOptions"
          :key="item.code"
          class="lang-popup__item"
          :class="{
            'lang-popup__item--active': currentLang === item.code,
          }"
          @click="selectLanguage(item)"
        >
          <div class="lang-popup__item-left">
            <img
              v-if="item.iconUrl"
              :src="item.iconUrl"
              width="28"
              height="28"
              alt=""
            />
            <span>{{ item.label }}</span>
          </div>
          <van-icon
            v-if="currentLang === item.code"
            name="success"
            size="18"
            color="#ffa300"
          />
        </div>
      </div>
    </van-popup>

    <!-- Bind / Change Email -->
    <van-popup
      v-model:show="showEmailPopup"
      position="bottom"
      round
      class="lang-popup"
    >
      <div class="lang-popup__content">
        <div class="lang-popup__header">
          <span>{{
            hasBoundMail
              ? $lang.settings_email_change || "Change Email"
              : $lang.settings_email_bind || "Bind Email"
          }}</span>
          <van-icon
            name="cross"
            size="20"
            color="#a89b7c"
            @click="showEmailPopup = false"
          />
        </div>
        <div class="email-form">
          <div v-if="hasBoundMail" class="email-form__field">
            <p class="email-form__label">
              {{ $lang.settings_old_email || "Current Email" }}
            </p>
            <van-field
              v-model="oldMailInput"
              type="email"
              :placeholder="
                $lang.settings_old_email_ph || 'Enter current email'
              "
              class="email-form__input"
            />
          </div>
          <div class="email-form__field">
            <p class="email-form__label">
              {{ $lang.settings_new_email || "New Email" }}
            </p>
            <van-field
              v-model="newMailInput"
              type="email"
              :placeholder="$lang.settings_new_email_ph || 'Enter email address'"
              class="email-form__input"
            />
          </div>
          <div v-if="hasBoundMail" class="email-form__field">
            <p class="email-form__label">
              {{ $lang.settings_privacy_pwd || "Withdrawal Password" }}
            </p>
            <van-field
              v-model="privacyPwdInput"
              type="password"
              :placeholder="
                $lang.settings_privacy_pwd_ph || 'Enter withdrawal password'
              "
              class="email-form__input"
            />
          </div>
          <p v-if="emailError" class="email-form__error">{{ emailError }}</p>
          <button
            class="email-form__submit"
            type="button"
            :disabled="emailSubmitting"
            @click="submitEmail"
          >
            {{
              emailSubmitting
                ? $lang.common_loading || "Loading..."
                : $lang.Confirmar || "Confirm"
            }}
          </button>
        </div>
      </div>
    </van-popup>

    <!-- Logout Popup -->
    <van-popup
      v-model:show="showLogoutPopup"
      round
      :close-on-click-overlay="true"
      class="logout-popup"
    >
      <div class="logout-popup__content">
        <p class="logout-popup__title">{{ $lang.mine_txt4 }}</p>
        <div class="logout-popup__actions">
          <button
            class="logout-popup__btn logout-popup__btn--cancel"
            @click="showLogoutPopup = false"
          >
            {{ $lang.Cancelar }}
          </button>
          <button
            class="logout-popup__btn logout-popup__btn--confirm"
            @click="confirmLogout"
          >
            {{ $lang.Confirmar }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Logout, Init, ChangeMail } from "@/api/common";
import md5 from "@/utils/md5";

const LANG_OPTIONS = [
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
];

export default {
  name: "Settings",
  data() {
    return {
      showLogoutPopup: false,
      showLangPopup: false,
      showEmailPopup: false,
      boundMail: "",
      newMailInput: "",
      oldMailInput: "",
      privacyPwdInput: "",
      emailError: "",
      emailSubmitting: false,
      pushEnabled: false,
      soundVolume: 70,
      langOptions: LANG_OPTIONS,
      currentLang: localStorage.getItem("defaultLanguage") || "en",
      socialList: [
        {
          name: "WhatsApp",
          svgPath:
            '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a8 8 0 01-4.243-1.214l-.252-.149-2.833.842.842-2.833-.149-.252A8 8 0 1112 20z"/>',
          color: "#25d366",
        },
        {
          name: "Facebook",
          svgPath:
            '<path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"/>',
          color: "#1877f2",
        },
        {
          name: "Telegram",
          svgPath:
            '<path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z"/>',
          color: "#0088cc",
        },
        {
          name: "Instagram",
          svgPath:
            '<path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 01-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 017.8 2m-.2 2A3.6 3.6 0 004 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 003.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 110 2.5 1.25 1.25 0 010-2.5M12 7a5 5 0 110 10 5 5 0 010-10m0 2a3 3 0 100 6 3 3 0 000-6z"/>',
          color: "#e4405f",
        },
        {
          name: "X",
          svgPath:
            '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>',
          color: "#2a2418",
        },
      ],
    };
  },
  computed: {
    currentLangLabel() {
      const found = this.langOptions.find((i) => i.code === this.currentLang);
      if (found) return found.label;
      return this.currentLang || "English";
    },
    hasBoundMail() {
      return !!this.boundMail;
    },
    boundMailDisplay() {
      return this.boundMail || this.$lang.settings_not_set || "Not Set";
    },
  },
  created() {
    this.fetchProfile();
  },
  methods: {
    pickMail(content) {
      if (!content) return "";
      return (
        content.mail ||
        content.email ||
        content.userMail ||
        content.newMail ||
        ""
      );
    },
    async fetchProfile() {
      try {
        const data = await Init();
        if (data.status === "ok" && data.content) {
          this.boundMail = this.pickMail(data.content);
        }
      } catch (e) {
        console.error("fetchProfile error", e);
      }
    },
    openEmailPopup() {
      this.emailError = "";
      this.newMailInput = "";
      this.privacyPwdInput = "";
      this.oldMailInput =
        this.boundMail && this.boundMail.indexOf("*") === -1
          ? this.boundMail
          : "";
      this.showEmailPopup = true;
    },
    isValidEmail(v) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v || "").trim());
    },
    async submitEmail() {
      const newMail = String(this.newMailInput || "").trim();
      if (!this.isValidEmail(newMail)) {
        this.emailError =
          this.$lang.settings_email_invalid || "Please enter a valid email";
        return;
      }
      const payload = { newMail };
      if (this.hasBoundMail) {
        const oldMail = String(this.oldMailInput || "").trim();
        if (!this.isValidEmail(oldMail)) {
          this.emailError =
            this.$lang.settings_old_email_invalid ||
            "Please enter your current email";
          return;
        }
        if (!this.privacyPwdInput) {
          this.emailError =
            this.$lang.settings_privacy_pwd_required ||
            "Please enter withdrawal password";
          return;
        }
        payload.oldMail = oldMail;
        payload.privacyPwd = md5(this.privacyPwdInput);
      }
      this.emailError = "";
      this.emailSubmitting = true;
      try {
        const data = await ChangeMail(payload);
        if (data.status === "ok") {
          const next =
            (data.content && this.pickMail(data.content)) || newMail;
          this.boundMail = next;
          this.showEmailPopup = false;
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
        } else {
          this.emailError = data.msg || this.$lang.network_error || "Error";
        }
      } catch (e) {
        this.emailError = this.$lang.network_error || "Network error";
      } finally {
        this.emailSubmitting = false;
      }
    },
    selectLanguage(item) {
      if (!item || !item.code) {
        this.showLangPopup = false;
        return;
      }
      if (item.code === this.currentLang) {
        this.showLangPopup = false;
        return;
      }
      localStorage.setItem("defaultLanguage", item.code);
      this.currentLang = item.code;
      this.showLangPopup = false;
      setTimeout(() => {
        window.location.reload();
      }, 200);
    },
    async confirmLogout() {
      try {
        const data = await Logout();
        if (data.status === "ok") {
          this.showLogoutPopup = false;
          localStorage.removeItem("token");
          this.$jumpTo("/home", {}, { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 200);
        } else {
          this.$toast({ message: data.msg, icon: "cross" });
        }
      } catch (e) {
        console.error("Logout error", e);
      }
    },
  },
};
</script>

<style lang="less" scoped>
@settings-bg: #1f1c17;
@settings-card: #15110a;
@settings-neon: #ffa300;
@settings-muted: #a89b7c;
@settings-border: rgba(255, 162, 0, 0.45);
@settings-gray-btn: #2a2418;

.settings-page {
  min-height: 100vh;
  background: @settings-bg;
  padding-bottom: 40px;
}

.settings-content {
  padding: 12px 16px;
}

// ====== SECTION HEADER ======
.settings-section {
  margin-bottom: 20px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-left: 2px;

    .section-icon {
      width: 18px;
      height: 18px;
      color: @settings-neon;
      flex-shrink: 0;
    }

    h2 {
      font-size: 11px;
      font-weight: 700;
      color: @settings-neon;
      text-transform: uppercase;
      letter-spacing: 2px;
      margin: 0;
    }
  }
}

// ====== CARD ======
.settings-card {
  background: @settings-card;
  border-radius: 12px;
  border: 1px solid @settings-border;
  overflow: hidden;
}

// ====== ITEM ======
.settings-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px;
  cursor: pointer;

  &--border {
    border-bottom: 1px solid @settings-border;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    font-size: 13px;
    color: @settings-muted;
    margin: 0;
  }

  &__value {
    font-size: 14px;
    color: @wihte-color;
    font-weight: 600;
    margin: 0;
  }

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  &__icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    .social-svg {
      width: 20px;
      height: 20px;
    }
  }

  &__icon-round {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.06);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    font-size: 14px;
    color: @wihte-color;
    font-weight: 500;
  }

  &__hint {
    font-size: 13px;
    color: @settings-muted;
  }

  &__btn {
    border: none;
    cursor: pointer;
    font-size: 12px;
    font-weight: 700;
    padding: 10px 16px;
    border-radius: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;

    &--gray {
      background: @settings-gray-btn;
      color: @wihte-color;
    }

    &--gold {
      background: #fff;
      color: #1f1c17;
    }
  }
}

// ====== DISABLED FEATURE ======
.disabled-feature {
  opacity: 0.4;
  pointer-events: none;
}

// ====== TOGGLE ======
.settings-toggle {
  &__track {
    width: 40px;
    height: 22px;
    border-radius: 11px;
    background: @settings-gray-btn;
    position: relative;
    transition: background 0.2s;
  }

  &__thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: @wihte-color;
    position: absolute;
    top: 2px;
    left: 2px;
    transition: left 0.2s;
  }

  &--on {
    .settings-toggle__track {
      background: @settings-neon;
    }

    .settings-toggle__thumb {
      left: 20px;
    }
  }
}

// ====== SLIDER ======
.settings-slider {
  width: 120px;

  &__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    border-radius: 2px;
    background: @settings-gray-btn;
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: @settings-neon;
      cursor: pointer;
    }

    &::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      background: @settings-neon;
      border: none;
      cursor: pointer;
    }
  }
}

// ====== LOGOUT BUTTON ======
.settings-logout {
  padding: 0 0;
  margin-top: 28px;

  &__btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 12px;
    padding: 14px;
    font-size: 15px;
    font-weight: 700;
    color: #dc2626;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
}

// ====== LANGUAGE POPUP ======
.lang-popup {
  background: @settings-card !important;

  &__content {
    padding: 0;
  }

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 18px 20px;
    border-bottom: 1px solid @settings-border;

    span {
      font-size: 16px;
      font-weight: 700;
      color: @wihte-color;
    }
  }

  &__loading {
    display: flex;
    justify-content: center;
    padding: 28px 0;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 20px;
    border-bottom: 1px solid @settings-border;
    cursor: pointer;
    transition: background 0.15s;

    span {
      font-size: 15px;
      color: @wihte-color;
    }

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: rgba(255, 255, 255, 0.04);
    }

    &--active {
      background: rgba(255, 163, 0, 0.08);

      span {
        color: @settings-neon;
        font-weight: 600;
      }
    }
  }

  &__item-left {
    display: flex;
    align-items: center;
    gap: 10px;

    img {
      border-radius: 50%;
      object-fit: cover;
      flex-shrink: 0;
    }
  }
}

.email-form {
  padding: 16px 20px 24px;

  &__field + &__field {
    margin-top: 14px;
  }

  &__label {
    margin: 0 0 8px;
    font-size: 13px;
    color: @settings-muted;
  }

  &__input {
    background: #2a2418 !important;
    border: 1px solid @settings-border !important;
    border-radius: 10px !important;
    overflow: hidden;

    :deep(.van-field__control) {
      color: #fff;
    }
  }

  &__error {
    margin: 10px 0 0;
    font-size: 12px;
    color: #ef4444;
  }

  &__submit {
    width: 100%;
    margin-top: 18px;
    border: none;
    height: 44px;
    border-radius: 10px;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
    font-size: 15px;
    font-weight: 800;
    cursor: pointer;

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

// ====== LOGOUT POPUP ======
.logout-popup {
  background: @settings-card !important;
  border-radius: 16px !important;

  &__content {
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-align: center;
    margin: 0;
  }

  &__actions {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  &__btn {
    flex: 1;
    height: 42px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;

    &--cancel {
      background: rgba(255, 255, 255, 0.1);
      color: @wihte-color;
    }

    &--confirm {
      background: #ef4444;
      color: @wihte-color;
    }
  }
}

@media (min-width: 769px) {
  .settings-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
