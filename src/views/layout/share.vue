<template>
  <div class="share-page">
    <div class="share-page__banner-wrap">
      <img
        src="../../assets/img/share/share_top.png"
        class="share-page__banner"
        alt=""
      />
    </div>
    <van-tabs
      class="share-tabs"
      v-model:active="activeTab"
      title-inactive-color="#c4b59a"
      title-active-color="#573900"
      :ellipsis="false"
      :swipeable="false"
      sticky
      :offset-top="0"
    >
      <van-tab
        v-for="(item, index) in [
          $lang.common_txt27,
          $lang.common_txt28,
          $lang.common_txt29,
        ]"
        :key="index"
      >
        <template #title>
          <span class="tab-text" :class="{ active: index === activeTab }">{{
            item
          }}</span>
        </template>
        <div class="content-tab--c">
          <share-ones v-if="index === 0"></share-ones>
          <share-two v-if="index === 1"></share-two>
          <share-three v-if="index === 2"></share-three>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import ShareOnes from "../../components/share/ShareOnes.vue";
import ShareTwo from "../../components/share/ShareTwo.vue";
import ShareThree from "../../components/share/ShareThree.vue";
export default {
  name: "Share",
  components: { ShareOnes, ShareTwo, ShareThree },
  data() {
    return {
      activeTab: 0,
    };
  },
};
</script>
<style lang="less" scoped>
@bg: #0f0d0b;
@gold: #ffa300;
@gold-deep: #e9a843;
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@muted: #c4b59a;

.share-page {
  min-height: 100vh;
  background: @bg;
  color: #fff;
  padding-bottom: 80px;
}

/* 图一：banner 圆角卡片，非通栏 */
.share-page__banner-wrap {
  margin: 8px 12px 0;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid fade(@gold-deep, 35%);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
}

.share-page__banner {
  display: block;
  width: 100%;
  vertical-align: top;
}

/* tab 单独一行，上下留白 */
.share-tabs {
  margin-top: 12px;
  position: relative;
  z-index: 2;

  :deep(.van-tabs__wrap) {
    height: auto !important;
  }

  :deep(.van-tabs__nav--line) {
    margin: 0 12px 12px;
    padding: 4px !important;
    background: #1a1612;
    border: 1px solid fade(@gold-deep, 40%);
    border-radius: 12px;
    box-shadow: 0 4px 14px rgba(0, 0, 0, 0.45);
  }

  :deep(.van-tabs--line .van-tabs__wrap) {
    width: 100%;
    margin: 0 auto;
  }

  :deep(.van-tab) {
    flex: 1;
    padding: 0 !important;
    border: none !important;
  }

  :deep(.van-sticky--fixed) {
    background: @bg;
    padding-top: 6px;
    padding-bottom: 2px;

    .van-tabs__nav--line {
      background: rgba(26, 22, 18, 0.98);
      margin-bottom: 8px;
    }
  }

  :deep(.van-tabs__line) {
    display: none;
  }

  :deep(.van-tabs__content),
  :deep(.van-tab__panel) {
    background: @bg !important;
  }

  :deep(.van-tab__text) {
    width: 100%;
  }

  .content-tab--c {
    background: @bg;
    min-height: 40vh;
  }

  .tab-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 8px 4px;
    box-sizing: border-box;
    color: @muted;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.15;
    text-align: center;
    border-radius: 9px;
    white-space: nowrap;
  }

  .tab-text.active {
    background: @btn-grad;
    color: #3d2a00 !important;
    font-weight: 800;
  }
}
</style>
