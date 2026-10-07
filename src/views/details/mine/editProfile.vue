<template>
  <div class="edit-profile-page">
    <title-bar :title="$lang.editProfile_title || 'EDIT PROFILE'">
      <template #right>
        <button
          type="button"
          class="ep-save-btn"
          :disabled="saving"
          @click="handleSave"
        >
          <img class="ep-save-btn__icon" src="@/assets/img/mine/ep_save.png" alt="" />
          <span>{{ $lang.editProfile_save || "Save" }}</span>
        </button>
      </template>
    </title-bar>

    <div class="ep-panel">
      <!-- Avatar -->
      <div class="ep-avatar" @click="goSelectAvatar">
        <div class="ep-avatar__wrapper">
          <img
            v-if="avatarSrc"
            :src="avatarSrc"
            class="ep-avatar__img"
            alt=""
          />
          <div v-else class="ep-avatar__placeholder"></div>
          <div class="ep-avatar__edit">
            <van-icon name="edit" size="14" color="#fff" />
          </div>
        </div>
      </div>

      <!-- User ID -->
      <div class="ep-field">
        <label class="ep-field__label">{{
          $lang.editProfile_user_id || "USER ID"
        }}</label>
        <div class="ep-field__input ep-field__input--readonly">
          <p class="ep-field__text">
            <em>ID:</em>
            <span>{{ inviteCode || "--" }}</span>
          </p>
          <button type="button" class="ep-field__action" @click="copyId">
            <img src="@/assets/img/mine/ep_copy.png" alt="" />
          </button>
        </div>
      </div>

      <!-- Phone -->
      <div class="ep-field">
        <label class="ep-field__label">{{
          $lang.editProfile_phone || "PHONE"
        }}</label>
        <div class="ep-field__input ep-field__input--readonly">
          <p class="ep-field__text">
            <span>{{ phone || "--" }}</span>
          </p>
        </div>
      </div>

      <!-- Birthday -->
      <div class="ep-field">
        <label class="ep-field__label">{{
          $lang.editProfile_birthday || "BIRTHDAY"
        }}</label>
        <div
          class="ep-field__input"
          role="button"
          @click="showBirthdayPicker = true"
        >
          <p class="ep-field__text">
            <span :class="{ 'is-placeholder': !birthday }">
              {{
                birthday ||
                $lang.editProfile_birthday_ph ||
                "Select Birthday"
              }}
            </span>
          </p>
          <button
            type="button"
            class="ep-field__action"
            @click.stop="showBirthdayPicker = true"
          >
            <van-icon name="calendar-o" size="14" color="#fff" />
          </button>
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
      :confirm-text="$lang.editProfile_save || 'SAVE'"
      @confirm="onBirthdayConfirm"
    />
  </div>
</template>

<script>
import { Init, ChangeExtend } from "@/api/common";
import DatePickerPopup from "@/components/DatePickerPopup";
import { avatarImg } from "@/utils/avatarAssets";

export default {
  name: "EditProfile",
  components: { DatePickerPopup },
  data() {
    return {
      headUrl: null,
      inviteCode: "",
      phone: "",
      birthday: "",
      showBirthdayPicker: false,
      pickerDate: new Date(),
      minDate: new Date(1950, 0, 1),
      maxDate: new Date(),
      saving: false,
    };
  },
  computed: {
    avatarSrc() {
      if (this.headUrl == null || this.headUrl === "") return "";
      return avatarImg(this.headUrl);
    },
  },
  mounted() {
    this.loadProfile();
  },
  activated() {
    this.loadProfile();
  },
  methods: {
    goSelectAvatar() {
      const headUrl =
        this.headUrl == null || this.headUrl === "" ? 0 : this.headUrl;
      this.$jumpTo("/avatar", { headUrl });
    },
    async loadProfile() {
      try {
        const data = await Init();
        if (data.status === "ok") {
          this.headUrl = data.content.headUrl;
          this.inviteCode = data.content.inviteCode || "";
          this.phone = data.content.phone || data.content.account || "";
          this.birthday = data.content.birthday || "";
          if (this.birthday) {
            const d = new Date(this.birthday);
            if (!isNaN(d.getTime())) this.pickerDate = d;
          }
        }
      } catch (e) {
        console.error("Init error", e);
      }
    },
    onBirthdayConfirm(date) {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, "0");
      const d = String(date.getDate()).padStart(2, "0");
      this.birthday = `${y}-${m}-${d}`;
      this.pickerDate = date;
      this.showBirthdayPicker = false;
    },
    copyId() {
      const text = this.inviteCode;
      if (!text) return;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({ message: this.$lang.Sucesso, icon: "success" });
    },
    async handleSave() {
      if (this.saving) return;
      this.saving = true;
      try {
        const res = await ChangeExtend({ birthday: this.birthday || "" });
        if (res.status === "ok") {
          this.$toast({
            message: this.$lang.Sucesso || "Saved",
            icon: "success",
          });
          this.$router.go(-1);
        } else {
          this.$toast({ message: res.msg || "Save failed", icon: "cross" });
        }
      } catch (e) {
        console.error("ChangeExtend error", e);
        this.$toast({ message: "Save failed", icon: "cross" });
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffd467;
@label: #d7a2fa;

.edit-profile-page {
  min-height: 100vh;
  background: transparent;
  color: #fff;
  padding-bottom: 40px;
}

.ep-save-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 30px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid @gold;
  background: #2a0b45;
  color: @gold;
  font-size: 13px;
  font-weight: 800;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
  }

  &__icon {
    width: 14px;
    height: 14px;
    object-fit: contain;
    display: block;
  }
}

.ep-panel {
  margin: 12px 14px 0;
  padding: 22px 16px 24px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 18px rgba(0, 0, 0, 0.25);
}

.ep-avatar {
  display: flex;
  justify-content: center;
  margin: 4px auto 22px;
  cursor: pointer;

  &__wrapper {
    position: relative;
    width: 112px;
    height: 112px;
    border-radius: 50%;
    border: 3px solid @gold;
    box-sizing: border-box;
    overflow: visible;
    background: #1a0a28;
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
    background: #2a0a4a;
  }

  &__edit {
    position: absolute;
    right: -2px;
    bottom: -2px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: @gold;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #532276;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.35);
  }
}

.ep-field {
  margin-bottom: 16px;

  &__label {
    display: block;
    margin: 0 0 8px 4px;
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: @label;
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 10px 0 16px;
    border-radius: 999px;
    background: #000;
    border: 1px solid rgba(201, 179, 255, 0.28);
    box-sizing: border-box;
    cursor: pointer;
  }

  &__text {
    flex: 1;
    min-width: 0;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    line-height: 1.2;

    em {
      font-style: normal;
      color: @label;
      font-weight: 700;
    }

    .is-placeholder {
      color: #9b86c9;
      font-weight: 500;
    }
  }

  &__action {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 50%;
    background: #f2b000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

    img {
      width: 14px;
      height: 14px;
      object-fit: contain;
      display: block;
    }
  }
}

@media (min-width: 769px) {
  .edit-profile-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
