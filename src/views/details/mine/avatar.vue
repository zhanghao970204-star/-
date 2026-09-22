<template>
  <div class="content t-c">
    <title-bar :title="$lang.avatar_title"></title-bar>
    <div class="content-c">
      <div class="content-c--c">
        <div
          class="content-c--img"
          v-for="(item, index) in imgList"
          :key="index"
          @click="getAvatar(index)"
        >
          <div v-if="index === selectedIndex" class="avatar-bg"></div>
          <div
            class="avatar-face"
            :class="{ 'is-active': index === selectedIndex }"
            :style="{ backgroundImage: 'url(' + item + ')' }"
          ></div>
        </div>
      </div>
      <van-button @click="Submit" class="custom-button">
        {{ $lang.Enviar }}
      </van-button>
    </div>
  </div>
</template>
<script>
import { SetHeadUrl } from "@/api/common";
import { avatarImg, AVATAR_COUNT } from "@/utils/avatarAssets";

export default {
  name: "Avatar",
  data() {
    const queryIdx = parseInt(this.$route.query.headUrl, 10);
    return {
      imgList: Array.from({ length: AVATAR_COUNT }, (_, i) => avatarImg(i)),
      selectedIndex: Number.isFinite(queryIdx) ? queryIdx : 0,
    };
  },
  methods: {
    getAvatar(i) {
      this.selectedIndex = i;
    },
    async Submit() {
      const data = await SetHeadUrl({
        headUrl: this.selectedIndex,
      });
      if (data.status === "ok") {
        this.$router.go(-1);
        this.$toast({
          message: this.$lang.Sucesso,
          icon: "success",
        });
      }
    },
  },
};
</script>
<style lang="less" scoped>
.content-c--c {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 8px 0;
  margin: 10px;
  padding: 12px 4px 4px;
  background: @cont-bg;
  border-radius: 15px;
}

.custom-button {
  width: 92%;
  margin-top: 20px;
}

.content-c--img {
  position: relative;
  height: 102px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-bg {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 102px;
  height: 102px;
  transform: translate(-50%, -50%);
  background: url(../../../assets/img/avatar/img_fg.png) no-repeat center;
  background-size: 100% 100%;
  z-index: 0;
  pointer-events: none;
}

.avatar-face {
  position: relative;
  width: 65px;
  height: 65px;
  border-radius: 50%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  z-index: 1;

  &.is-active {
    width: 67px;
    height: 67px;
    border: 2px solid #ffa300;
    box-sizing: border-box;
  }
}
</style>
