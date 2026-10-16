<template>
  <div class="content support-page">
    <title-bar :title="$lang.common_txt274 || 'Player Support'" />

    <div class="need_help">
      <img
        class="need_help__hero"
        src="@/assets/img/otgame/Support_1.png"
        alt=""
      />
      <div class="need_help_second t-c" @click="goToDDD">
        <p class="need_help_second_t f-t-15 f-w">
          {{ $lang.common_txt274 }}
        </p>
        <p class="need_help_second__hint m-t-5">{{ $lang.common_txt275 }}</p>
        <div class="support-cs-btn" role="button" @click.stop="goToDDD">
          <img
            class="support-cs-btn__img"
            src="@/assets/img/otgame/Support_cs.png"
            alt=""
          />
        </div>
        <p class="f-t-15 support-link" role="button" @click.stop="goToDDD">
          {{ $lang.common_txt276 }}
        </p>
      </div>
    </div>

    <div>
      <div class="d-flex m-t-10" style="justify-content: center">
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
    toggleProblem(index) {
      this.problemList.forEach((item, i) => {
        if (i !== index) item.isOpen = false;
      });
      this.problemList[index].isOpen = !this.problemList[index].isOpen;
    },
  },
  mounted() {
    this.prefetchCsUrl();
  },
};
</script>

<style lang="less" scoped>
@cell: #2d1545;
@muted: #d7a2fa;
@gold-soft: #ffe4b5;

.support-page {
  min-height: 100%;
  padding-bottom: 24px;
  box-sizing: border-box;
}

.need_help__hero {
  display: block;
  width: 100%;
  height: auto;
}

.need_help_second {
  position: relative;
  z-index: 1;
  margin: -20px 14px 0;
  padding: 16px 12px 14px;
  background: url("@/assets/img/otgame/Support_3.png") no-repeat center / 100%
    100%;
  border-radius: 18px;
  box-sizing: border-box;
  cursor: pointer;
}

.need_help_second_t {
  color: #fbff00;
  letter-spacing: 0.5px;
  font-size: 16px;
  font-weight: 700;
}

.need_help_second__hint {
  color: #ffffff;
  font-size: 12px;
  font-weight: 500;
  line-height: 1.4;
  padding: 0 8px;
}

.support-cs-btn {
  position: relative;
  z-index: 2;
  width: 42px;
  height: 43px;
  margin: 12px auto 8px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto;

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    display: block;
    pointer-events: none;
  }
}

.support-link {
  position: relative;
  z-index: 2;
  text-decoration: underline;
  color: #24ee89;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  pointer-events: auto;
  font-size: 12px;
  font-weight: 500;
}

.faq-section-title {
  color: #fbff00;
}

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

  &:last-child {
    border-bottom: none;
  }
}
.problem-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: @gold-soft;
  font-size: 13px;
}
.problem-answer {
  color: @muted;
  margin-top: 10px;
  padding-left: 5px;
  line-height: 1.6;
}
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
  background: linear-gradient(90deg, transparent, #fbff00);
  width: 25%;
  height: 2px;
}
.details_faq_right {
  background: linear-gradient(90deg, #fbff00, transparent);
  width: 25%;
  height: 2px;
}
</style>
