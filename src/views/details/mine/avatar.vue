<template>
  <div class="avatar-page">
    <title-bar :title="$lang.avatar_title || 'SELECT AVATAR'" />

    <div class="avatar-panel">
      <div class="avatar-preview">
        <div class="avatar-preview__ring">
          <img
            v-if="previewSrc"
            class="avatar-preview__img"
            :src="previewSrc"
            alt=""
          />
        </div>
      </div>

      <div class="avatar-grid">
        <div
          v-for="(item, index) in imgList"
          :key="index"
          class="avatar-grid__item"
          @click="getAvatar(index)"
        >
          <div
            class="avatar-grid__face"
            :class="{ 'is-active': index === selectedIndex }"
          >
            <img class="avatar-grid__img" :src="item" alt="" />
          </div>
        </div>
      </div>

      <button
        type="button"
        class="avatar-submit btn-3d-green"
        :disabled="submitting"
        @click="Submit"
      >
        {{ $lang.Enviar || "SUBMIT" }}
      </button>
    </div>
  </div>
</template>

<script>
import { SetHeadUrl, Init } from "@/api/common";
import { avatarImg, AVATAR_COUNT } from "@/utils/avatarAssets";

function validIndex(raw) {
  const n = parseInt(raw, 10);
  return Number.isFinite(n) && n >= 0 && n < AVATAR_COUNT ? n : null;
}

export default {
  name: "Avatar",
  data() {
    const queryIdx = validIndex(this.$route.query.headUrl);
    return {
      imgList: Array.from({ length: AVATAR_COUNT }, (_, i) => avatarImg(i)),
      selectedIndex: queryIdx != null ? queryIdx : 0,
      hasQueryIndex: queryIdx != null,
      submitting: false,
    };
  },
  mounted() {
    if (!this.hasQueryIndex) this.loadCurrentAvatar();
  },
  computed: {
    previewSrc() {
      return this.imgList[this.selectedIndex] || "";
    },
  },
  methods: {
    getAvatar(i) {
      this.selectedIndex = i;
    },
    async loadCurrentAvatar() {
      try {
        const data = await Init();
        const idx = data && data.status === "ok" && data.content
          ? validIndex(data.content.headUrl)
          : null;
        if (idx != null) this.selectedIndex = idx;
      } catch (e) {
        /* ignore */
      }
    },
    async Submit() {
      if (this.submitting) return;
      this.submitting = true;
      try {
        const data = await SetHeadUrl({
          headUrl: this.selectedIndex,
        });
        if (data.status === "ok") {
          this.$router.go(-1);
          this.$toast({
            message: this.$lang.Sucesso,
            icon: "success",
          });
          return;
        }
      } catch (e) {
        /* ignore */
      }
      this.submitting = false;
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffd467;

.avatar-page {
  min-height: 100vh;
  background: transparent;
  color: #fff;
  padding-bottom: 40px;
}

.avatar-panel {
  margin: 12px 14px 0;
  padding: 22px 14px 20px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.1),
    0 8px 18px rgba(0, 0, 0, 0.25);
}

.avatar-preview {
  display: flex;
  justify-content: center;
  margin-bottom: 18px;

  &__ring {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    border: 3px solid @gold;
    box-sizing: border-box;
    overflow: hidden;
    background: #1a0a28;
    clip-path: circle(50%);
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }
}

.avatar-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px 8px;
  padding: 14px 10px;
  border-radius: 18px;
  background: rgba(0, 0, 0, 0.22);

  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 72px;
    cursor: pointer;
  }

  &__face {
    width: 58px;
    height: 58px;
    border-radius: 50%;
    border: none;
    box-sizing: border-box;
    overflow: hidden;
    background: transparent;
    clip-path: circle(50%);

    &.is-active {
      border: 2px solid @gold;
      box-shadow: 0 0 0 2px fade(@gold, 25%);
    }
  }

  &__img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    border: none;
    outline: none;
  }
}

.avatar-submit {
  margin-top: 18px;
  font-size: 16px;
  letter-spacing: 1px;
}

@media (min-width: 769px) {
  .avatar-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
