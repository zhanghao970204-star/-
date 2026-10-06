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
      title-inactive-color="#d2c4f0"
      title-active-color="#ffffff"
      :ellipsis="false"
      :swipeable="false"
      sticky
      :offset-top="60"
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
@bg: #15031d;
@muted: #d7a2fa;
/* 设计稿：外框渐变边 / 激活按钮渐变 */
@tab-nav-fill: #1d022c;
@tab-border-grad: linear-gradient(90deg, #e93dfe 0%, #3245a2 100%);
@tab-btn-grad: linear-gradient(135deg, #9f24c9 0%, #3b4edc 100%);

.share-page {
  min-height: 100vh;
  background: @bg;
  color: #fff;
  padding-bottom: 20px;
}

.share-page__banner-wrap {
  margin: 8px 12px 0;
  border-radius: 14px;
  overflow: hidden;
}

.share-page__banner {
  display: block;
  width: 100%;
  vertical-align: top;
}

.share-tabs {
  margin-top: 12px;
  position: relative;
  z-index: 2;

  :deep(.van-tabs__wrap) {
    height: auto !important;
  }

  /* 外框：1px 渐变边 #E93DFE → #3245A2，底 #1D022C，圆角 22.5 */
  :deep(.van-tabs__nav--line) {
    margin: 0 12px 12px;
    padding: 1px !important;
    min-height: 37px;
    border-radius: 22.5px;
    border: 1px solid transparent;
    background:
      linear-gradient(@tab-nav-fill, @tab-nav-fill) padding-box,
      @tab-border-grad border-box;
    box-shadow: 0 0 12px fade(#e93dfe, 28%);
  }

  :deep(.van-tabs--line .van-tabs__wrap) {
    width: 100%;
    margin: 0 auto;
  }

  :deep(.van-tab) {
    flex: 1;
    padding: 0 2px !important;
    border: none !important;
  }

  :deep(.van-sticky--fixed) {
    background: @bg;
    padding-top: 6px;
    padding-bottom: 2px;

    .van-tabs__nav--line {
      margin-bottom: 8px;
      background:
        linear-gradient(@tab-nav-fill, @tab-nav-fill) padding-box,
        @tab-border-grad border-box;
    }
  }

  :deep(.van-tabs__line) {
    display: none;
  }

  :deep(.van-tabs__content),
  :deep(.van-tab__panel) {
    background: @bg !important;
    overflow: visible;
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
    height: 31px;
    padding: 0 6px;
    box-sizing: border-box;
    color: @muted;
    font-size: 12px;
    font-weight: 600;
    line-height: 1.15;
    text-align: center;
    border-radius: 16px;
    white-space: nowrap;
  }

  /* 激活按钮：#9F24C9 → #3B4EDC，圆角 16 */
  .tab-text.active {
    background: @tab-btn-grad;
    color: #fff !important;
    font-weight: 800;
    box-shadow: 0 2px 10px fade(#9f24c9, 45%);
  }
}
</style>
