<template>
  <div class="content">
    <!-- Header with back button -->
    <header class="support-header">
      <button class="support-header__back" @click="$router.go(-1)">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </button>
      <h1 class="support-header__title">
        {{ $lang.common_txt274 || "Support" }}
      </h1>
      <div class="support-header__spacer"></div>
    </header>

    <div>
      <div class="need_help">
        <div class="need_help_p">
          <img src="../../assets/img/otgame/Support_1.png" width="100%" />
            <div
              @click="goToDDD"
              class="need_help_second t-c"
              style="margin-top: -3px"
            >
            <p class="need_help_second_t f-t-15 f-w">
              {{ $lang.common_txt274 }}
            </p>
            <p class="m-t-10">{{ $lang.common_txt275 }}</p>
            <div
              class="support-cs-btn"
              role="button"
              @click.stop="goToDDD"
            >
              <van-icon name="service-o" size="22" color="#fff" />
            </div>
            <p
              class="f-t-15 support-link"
              role="button"
              @click.stop="goToDDD"
            >
              {{ $lang.common_txt276 }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div>
      <div class="d-flex" style="justify-content: center">
        <p class="details_faq_left"></p>
        <p class="m-l-10 m-r-10 f-t-14 faq-section-title">
          {{ $lang.common_txt297 }}
        </p>
        <p class="details_faq_right"></p>
      </div>

      <div class="common-problems">
        <div
          class="problem-item"
          v-for="(item, index) in problemList"
          :key="index"
          @click="toggleProblem(index)"
        >
          <div class="problem-header">
            <span class="problem-question">{{ item.question }}</span>
            <van-icon
              :name="!item.isOpen ? 'arrow-down' : 'arrow-up'"
              size="14"
            />
          </div>
          <transition name="slide-left">
            <div class="problem-answer" v-if="item.isOpen">
              <div v-html="item.answer"></div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchCsUrl, openCustomerService } from "@/utils/csLink";
export default {
  name: "Support",
  components: {},
  data() {
    return {
      csUrl: "",
      // 常见问题列表（对应图片中的内容）
      problemList: [
        {
          question: this.$lang.common_txt298,
          answer: this.$lang.common_txt299,
          isOpen: false,
        },
        {
          question: this.$lang.common_txt300,
          answer: this.$lang.common_txt301,
          isOpen: false,
        },
        {
          question: this.$lang.common_txt302,
          answer: this.$lang.common_txt303,
          isOpen: false,
        },
        {
          question: this.$lang.common_txt304,
          answer: this.$lang.common_txt305,
          isOpen: false,
        },
        {
          question: this.$lang.common_txt306,
          answer: this.$lang.common_txt307,
          isOpen: false,
        },
      ],
    };
  },
  methods: {
    goToDDD() {
      openCustomerService({ url: this.csUrl }).then((ok) => {
        if (ok) this.prefetchCsUrl();
      });
    },
    async prefetchCsUrl() {
      try {
        this.csUrl = (await fetchCsUrl()) || "";
      } catch (e) {
        this.csUrl = "";
      }
    },
    // 切换问题的展开/收起
    toggleProblem(index) {
      // 关闭其他问题，只保持一个展开（可选逻辑，可删除）
      this.problemList.forEach((item, i) => {
        if (i !== index) item.isOpen = false;
      });
      // 切换当前问题的状态
      this.problemList[index].isOpen = !this.problemList[index].isOpen;
    },
  },
  mounted() {
    this.prefetchCsUrl();
  },
};
</script>

<style lang="less" scoped>
@cell: #2a2418;
@muted: #a89b7c;
@gold-soft: #ffe4b5;

.support-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: @cont-bg;
  border-bottom: 1px solid fade(@border-color, 25%);

  &__back {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__spacer {
    width: 40px;
  }
}

.need_help_p {
  background: url(../../assets/img/otgame/Support_4.png) no-repeat;
  background-size: 100% 100%;
  padding: 20px;
}
.need_help_second {
  position: relative;
  z-index: 1;
  background: url(../../assets/img/otgame/Support_3.png) no-repeat;
  background-size: 100% 100%;
  padding: 6px 0;
}
.need_help_second_t {
  background: @primary-gradient-h;
  -webkit-background-clip: text;
  color: transparent;
}

.support-cs-btn {
  position: relative;
  z-index: 2;
  width: 48px;
  height: 48px;
  margin: 10px auto 6px;
  border-radius: 50%;
  background: #2f6fed;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto;
}

.support-link {
  position: relative;
  z-index: 2;
  text-decoration: underline;
  color: @primary-color;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto;
}

.faq-section-title {
  color: @primary-color;
}

/* 新增：常见问题样式 */
.common-problems {
  margin: 10px;
  background: @cell;
  border: 1px solid fade(@border-color, 25%);
  border-radius: 8px;
  padding: 5px 15px 10px;
}

.problem-item {
  border-bottom: 1px solid fade(@border-color, 20%);
  padding: 10px 0;
  cursor: pointer;
}
.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: @gold-soft;
  font-size: 13px;
}
.arrow-icon {
  color: @wihte-color;
  transition: transform 0.3s ease;
}
/* 箭头旋转动画 */
.rotate {
  transform: rotate(180deg);
}
.problem-answer {
  color: @muted;
  margin-top: 10px;
  padding-left: 5px;
  line-height: 1.6;
}
/* 文字从左滑出动画 */
.slide-left-enter-from,
.slide-left-leave-to {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-left-enter-active,
.slide-left-leave-active {
  transition: all 0.3s ease;
}
.details_faq_left {
  background: linear-gradient(90deg, transparent, @border-color);
  width: 25%;
  height: 2px;
}
.details_faq_right {
  background: linear-gradient(90deg, @border-color, transparent);
  width: 25%;
  height: 2px;
}
</style>
