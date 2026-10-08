<template>
  <div class="settings-page">
    <title-bar :title="$lang.settings_title || 'SETTINGS'" />

    <div class="settings-panel">
      <!-- Account Security -->
      <section class="settings-section">
        <div class="settings-section__header">
          <img
            class="section-icon"
            src="@/assets/img/mine/settings_shield.png"
            alt=""
          />
          <h2>{{ $lang.settings_account_security || "ACCOUNT SECURITY" }}</h2>
        </div>
        <div class="settings-row" @click="openEmailPopup">
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
          <img
            class="section-icon"
            src="@/assets/img/mine/settings_gear.png"
            alt=""
          />
          <h2>{{ $lang.settings_preferences || "PREFERENCES" }}</h2>
        </div>
        <!-- Language: English only -->
        <div class="settings-row settings-row--static">
          <div class="settings-item__left">
            <img
              class="settings-flag"
              src="@/assets/img/login/us_flag.png"
              alt=""
            />
            <span class="settings-item__name">{{
              $lang.settings_language || "Language"
            }}</span>
          </div>
          <div class="settings-item__right">
            <span class="settings-item__hint">English</span>
            <van-icon name="arrow" size="14" color="#d4c4ee" />
          </div>
        </div>

        <!-- Sound master switch：开才有音效 -->
        <div class="settings-row" data-no-sound @click="toggleSound">
          <div class="settings-item__left">
            <img
              class="settings-item__icon-img"
              src="@/assets/img/mine/settings_bell.png"
              alt=""
            />
            <span class="settings-item__name">{{
              $lang.settings_push || "Push Notifications"
            }}</span>
          </div>
          <div
            class="settings-toggle"
            :class="{ 'settings-toggle--on': soundEnabled }"
          >
            <div class="settings-toggle__track">
              <div class="settings-toggle__thumb"></div>
            </div>
          </div>
        </div>

        <!-- Sound Volume -->
        <div class="settings-row">
          <div class="settings-item__left">
            <img
              class="settings-item__icon-img"
              src="@/assets/img/mine/settings_sound.png"
              alt=""
            />
            <span class="settings-item__name">{{
              $lang.settings_sound || "Sound Volume"
            }}</span>
          </div>
          <div class="settings-slider" data-no-sound @click.stop>
            <input
              v-model.number="soundVolume"
              type="range"
              min="0"
              max="100"
              class="settings-slider__input"
              :style="{ '--vol': soundVolume + '%' }"
              @input="onVolumeInput"
              @change="onVolumeChange"
            />
          </div>
        </div>
      </section>

      <!-- Logout -->
      <button
        class="settings-logout"
        type="button"
        @click="showLogoutPopup = true"
      >
        {{ $lang.mine_txt14 || "LOG OUT" }}
      </button>
    </div>

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
          <button
            type="button"
            class="lang-popup__close"
            @click="showEmailPopup = false"
          >
            <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
              <path
                d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
                fill="none"
                stroke="#fff"
                stroke-width="2.6"
                stroke-linecap="round"
              />
            </svg>
          </button>
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
              :placeholder="
                $lang.settings_new_email_ph || 'Enter email address'
              "
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
            class="email-form__submit btn-3d-green"
            type="button"
            :disabled="emailSubmitting"
            @click="submitEmail"
          >
            {{
              emailSubmitting
                ? $lang.common_loading || "Loading..."
                : $lang.Confirmar || "CONFIRM"
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
            type="button"
            class="logout-popup__btn logout-popup__btn--cancel"
            @click="showLogoutPopup = false"
          >
            {{ $lang.Cancelar }}
          </button>
          <button
            type="button"
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
import {
  playSwitchSound,
  playClickSound,
  getSoundVolume,
  setSoundVolume,
  isSoundEnabled,
  setSoundEnabled,
} from "@/utils/sound";

export default {
  name: "Settings",
  data() {
    return {
      showLogoutPopup: false,
      showEmailPopup: false,
      boundMail: "",
      newMailInput: "",
      oldMailInput: "",
      privacyPwdInput: "",
      emailError: "",
      emailSubmitting: false,
      soundEnabled: isSoundEnabled(),
      soundVolume: getSoundVolume(),
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
          color: "#2d1545",
        },
      ],
    };
  },
  computed: {
    hasBoundMail() {
      return !!this.boundMail;
    },
    boundMailDisplay() {
      return this.boundMail || this.$lang.settings_not_set || "Not Set";
    },
  },
  created() {
    localStorage.setItem("defaultLanguage", "en");
    this.fetchProfile();
  },
  methods: {
    toggleSound() {
      if (this.soundEnabled) {
        playSwitchSound();
        this.soundEnabled = false;
        setSoundEnabled(false);
      } else {
        this.soundEnabled = true;
        setSoundEnabled(true);
        playSwitchSound();
      }
    },
    onVolumeInput() {
      setSoundVolume(this.soundVolume);
    },
    onVolumeChange() {
      setSoundVolume(this.soundVolume);
      if (this.soundEnabled && this.soundVolume > 0) playClickSound();
    },
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
          const next = (data.content && this.pickMail(data.content)) || newMail;
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
@settings-card: #12021a;
@settings-panel: #6a2d96;
@settings-row: #0d0d0d;
@settings-neon: #ffa300;
@settings-title: #e6d4f8;
@settings-muted: #c9b4e4;
@settings-border: rgba(255, 162, 0, 0.45);
@settings-gray-btn: #5a3d78;

.settings-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.settings-panel {
  margin: 12px 14px 0;
  padding: 18px 14px 16px;
  border-radius: 28px;
  background: @settings-panel;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.25);
}

// ====== SECTION HEADER ======
.settings-section {
  margin-bottom: 16px;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding-left: 4px;

    .section-icon {
      width: 18px;
      height: 18px;
      object-fit: contain;
      flex-shrink: 0;
    }

    h2 {
      font-size: 13px;
      font-weight: 700;
      color: @settings-title;
      text-transform: uppercase;
      letter-spacing: 1.2px;
      margin: 0;
    }
  }
}

.settings-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  min-height: 58px;
  margin-bottom: 10px;
  padding: 5px 10px;
  border-radius: 999px;
  background: @settings-row;
  cursor: pointer;

  &--static {
    cursor: default;
  }
}

// ====== ITEM ======
.settings-item {
  &__info {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__label {
    font-size: 13px;
    color: #c084f5;
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

  &__icon-img {
    width: 22px;
    height: 22px;
    object-fit: contain;
    display: block;
    flex-shrink: 0;
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
    font-weight: 800;
    padding: 8px 16px;
    border-radius: 999px;
    text-transform: uppercase;
    letter-spacing: 0.6px;
    flex-shrink: 0;

    &--gray {
      background: @settings-gray-btn;
      color: @wihte-color;
    }

    &--gold {
      background: linear-gradient(180deg, #ffe566 0%, #f0a000 100%);
      color: #5a3200;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.7),
        0 2px 0 #c47a00;
    }
  }
}

.settings-flag {
  width: 24px;
  height: 16px;
  border-radius: 2px;
  object-fit: cover;
  display: block;
  flex-shrink: 0;
}

// ====== DISABLED FEATURE ======
.disabled-feature {
  opacity: 0.4;
  pointer-events: none;
}

// ====== TOGGLE ======
.settings-toggle {
  &__track {
    width: 46px;
    height: 26px;
    border-radius: 13px;
    background: #6d4a86;
    position: relative;
    transition: background 0.2s;
  }

  &__thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    position: absolute;
    top: 3px;
    left: 3px;
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  &--on {
    .settings-toggle__track {
      background: #ee960b;
    }

    .settings-toggle__thumb {
      left: 23px;
    }
  }
}

// ====== SLIDER ======
.settings-slider {
  width: 128px;
  flex-shrink: 0;

  &__input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 8px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      #ffe14a var(--vol, 70%),
      #6a4588 var(--vol, 70%)
    );
    outline: none;
    cursor: pointer;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      cursor: pointer;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }

    &::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #fff;
      border: none;
      cursor: pointer;
    }
  }
}

.settings-logout {
  .btn-3d-green();
  margin-top: 8px;
  height: 52px;
  font-size: 16px;
  letter-spacing: 1px;
}

// ====== LANGUAGE POPUP ======
.lang-popup {
  background: #7a2190 !important;

  &__content {
    padding: 0;
    background: #7a2190;
  }

  &__header {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 18px 44px;
    background: #532276;

    .lang-popup__close {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
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

    span {
      font-size: 18px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.4px;
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
  padding: 18px 20px 28px;
  background: transparent;

  &__field + &__field {
    margin-top: 14px;
  }

  &__label {
    margin: 0 0 8px;
    padding: 0 2px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;
  }

  &__input {
    position: relative;
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 16px !important;
    background: #000 !important;
    border: none !important;
    border-radius: 25px !important;
    overflow: hidden;
    box-sizing: border-box;

    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 25px;
      border: 1px solid transparent;
      pointer-events: none;
    }

    &:focus-within::after {
      border-color: #ffd400;
    }

    :deep(.van-field__value),
    :deep(.van-field__body) {
      display: flex;
      align-items: center;
      height: 48px;
    }

    :deep(.van-field__control) {
      height: 48px;
      line-height: 48px;
      color: #fff;
      font-size: 14px;
    }

    :deep(.van-field__control::placeholder) {
      color: #9b86c9;
      line-height: 48px;
    }
  }

  &__error {
    margin: 10px 0 0;
    font-size: 12px;
    color: #ef4444;
  }

  &__submit {
    margin-top: 22px;
    font-size: 16px;
    letter-spacing: 1px;
  }
}

// ====== LOGOUT POPUP ======
.logout-popup {
  width: 300px;
  background: #27033c !important;
  border: 1px solid rgba(192, 132, 252, 0.45) !important;
  border-radius: 16px !important;

  &__content {
    padding: 24px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    text-align: center;
    line-height: 1.4;
  }

  &__actions {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  &__btn {
    flex: 1;
    min-width: 0;
    height: 42px;
    padding: 0 6px;
    font-size: 14px;
    white-space: nowrap;

    &--cancel {
      .btn-3d-yellow();
      height: 42px;
      font-size: 14px;
    }

    &--confirm {
      .btn-3d-green();
      height: 42px;
      font-size: 14px;
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
