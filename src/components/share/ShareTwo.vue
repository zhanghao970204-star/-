<template>
  <div class="content">
    <div ref="timeTabs" class="content-c">
      <div
        class="content-c--item"
        v-for="(item, index) in timeList"
        :key="index"
        @click.stop="selectTab(index)"
      >
        <span :class="['tab-item', { active: index === selectIndex }]">
          {{ item }}
        </span>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card" v-for="(item, index) in cardList" :key="index">
        <p class="stat-card__label" v-html="item.title"></p>
        <p class="stat-card__divider"></p>
        <p class="stat-card__value">
          <span v-if="item.icon">{{ item.icon }} </span
          >{{ $formatNumberWithCommas(item.value) }}
        </p>
      </div>
    </div>

    <h3 class="section-title">{{ $lang.common_txt142 }}</h3>

    <div class="stat-grid stat-grid--summary">
      <div class="stat-card" v-for="(item, index) in summaryList" :key="index">
        <p class="stat-card__label">
          {{ item.title
          }}<template v-if="item.sub"><br />{{ item.sub }}</template>
        </p>
        <p class="stat-card__divider"></p>
        <p class="stat-card__value">
          <span v-if="item.icon">{{ item.icon }} </span
          >{{ $formatNumberWithCommas(item.value) }}
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { GetTeamTotalReports, GetTeamReports } from "@/api/common";
export default {
  name: "ShareTwo",
  data() {
    return {
      selectIndex: 0,
      cardList: [
        {
          title: this.$lang.share_txt28,
          value: 0,
        },
        {
          title: this.$lang.share_txt29,
          value: 0,
          icon: this.getCurrency,
        },
        {
          title: this.$lang.share_txt30,
          value: 0,
        },
        {
          title: this.$lang.share_txt31,
          value: 0,
          icon: this.getCurrency,
        },
        {
          title: this.$lang.share_txt32,
          value: 0,
        },
        {
          title: this.$lang.share_txt39,
          value: 0,
          icon: this.getCurrency,
        },
      ],
      summaryList: [
        {
          title: this.$lang.share_txt18,
          sub: this.$lang.share_txt19,
          value: 0,
        },
        {
          title: this.$lang.share_txt20,
          sub: this.$lang.share_txt21,
          value: 0,
        },
        {
          title: this.$lang.share_txt22,
          sub: this.$lang.share_txt23,
          value: 0,
          icon: this.getCurrency,
        },
        {
          title: this.$lang.share_txt24,
          sub: this.$lang.share_txt25,
          value: 0,
          icon: this.getCurrency,
        },
        {
          title: this.$lang.share_txt26,
          sub: this.$lang.share_txt27,
          value: 0,
          icon: this.getCurrency,
        },
        {
          title: this.$lang.share_txt39,
          sub: this.$lang.share_txt40,
          value: 0,
          icon: this.getCurrency,
        },
      ],
      timeList: [
        this.$lang.billGame_txt4,
        this.$lang.billGame_txt5,
        this.$lang.billGame_txt6,
        this.$lang.billGame_txt7,
        this.$lang.billGame_txt8,
        this.$lang.billGame_txt9,
      ],
    };
  },
  methods: {
    getRangeByIndex(i) {
      const rangeFns = [
        () => this.$getTodayRange(),
        () => this.$getYesterdayRange(),
        () => this.$getThisWeekRange(),
        () => this.$getLastWeekRange(),
        () => this.$getThisMonthRange(),
        () => this.$getLastMonthRange(),
      ];
      const range = (rangeFns[i] || rangeFns[0])();
      return {
        startDate: range.slice(0, 19),
        endDate: range.slice(20, 40),
      };
    },
    ensureTabVisible(index) {
      const scroller = this.$refs.timeTabs;
      if (!scroller) return;
      const item = scroller.children[index];
      if (!item) return;
      const left = item.offsetLeft;
      const right = left + item.offsetWidth;
      const viewLeft = scroller.scrollLeft;
      const viewRight = viewLeft + scroller.clientWidth;
      if (left < viewLeft) {
        scroller.scrollLeft = left;
      } else if (right > viewRight) {
        scroller.scrollLeft = right - scroller.clientWidth;
      }
    },
    selectTab(i) {
      if (this.selectIndex === i) return;
      this.selectIndex = i;
      this.$nextTick(() => this.ensureTabVisible(i));
      const { startDate, endDate } = this.getRangeByIndex(i);
      this.GetTeamReports(startDate, endDate);
      this.GetTeamTotalReports(startDate, endDate);
    },
    async GetTeamTotalReports(startDate, endDate) {
      const data = await GetTeamTotalReports({
        startDate: startDate,
        endDate: endDate,
      });
      if (data.status === "ok") {
        const info = data.content;
        this.summaryList[0].value = info.totalUserCount;
        this.summaryList[1].value = info.newRechargeCount;
        this.summaryList[2].value = info.newRechargeAmount;
        this.summaryList[3].value = info.totalRechargeAmount;
        this.summaryList[4].value = info.betEffc;
        this.summaryList[5].value = info.inviteCommissionAmount || 0;
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    async GetTeamReports(startDate, endDate) {
      const data = await GetTeamReports({
        startDate: startDate,
        endDate: endDate,
      });
      if (data.status === "ok") {
        this.cardList[0].value = data.content.totalUserCount;
        this.cardList[1].value = data.content.newRechargeAmount;
        this.cardList[2].value = data.content.newRechargeCount;
        this.cardList[3].value = data.content.totalRechargeAmount;
        this.cardList[4].value = data.content.totalRechargeCount;
        this.cardList[5].value = data.content.inviteCommissionAmount || 0;
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$refs.timeTabs) this.$refs.timeTabs.scrollLeft = 0;
    });
    const { startDate, endDate } = this.getRangeByIndex(0);
    this.GetTeamReports(startDate, endDate);
    this.GetTeamTotalReports(startDate, endDate);
  },
};
</script>
<style lang="less" scoped>
@page-bg: #1a1613;
@fx-bg: linear-gradient(
  100deg,
  #433e27 0%,
  #3a3523 22%,
  #2b271b 48%,
  #1a1812 78%,
  #13120d 100%
);
@fx-border: 1px solid #6f6959;
@label-color: #c8c4b8;
@value-color: #efd3ac;
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);

.content {
  padding: 0 0 20%;
  background: @page-bg;
}

.content-c {
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 6px 10px 0;
  margin: 0;
  background: @page-bg;
  border-bottom: 1px solid fade(#e9a843, 28%);
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-x: contain;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.content-c::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

.content-c--item {
  flex: 0 0 auto;
  padding: 0 2px;
  white-space: nowrap;
}

.tab-item {
  display: inline-block;
  padding: 8px 10px 10px;
  color: #a89b7c;
  cursor: pointer;
  font-size: 14px;
  position: relative;
}

.tab-item.active {
  color: #ffc85a;
  font-weight: bold;
}

/* 与底部分割线同一水平；宽度跟文字一致；中间亮区稍长 */
.tab-item.active::after {
  content: "";
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: -1px;
  height: 2px;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    rgba(184, 137, 58, 0) 0%,
    rgba(184, 137, 58, 0.3) 12%,
    #e0c078 28%,
    #f0d890 50%,
    #e0c078 72%,
    rgba(184, 137, 58, 0.3) 88%,
    rgba(184, 137, 58, 0) 100%
  );
  box-shadow: 0 0 4px rgba(224, 192, 120, 0.35);
}

.stat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  padding: 12px 10px 4px;
}

.stat-grid--summary {
  padding-top: 0;
  padding-bottom: 12px;
}

.stat-card {
  background: @fx-bg;
  border: @fx-border;
  border-radius: 10px;
  box-sizing: border-box;
  min-height: 88px;
  padding: 10px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.stat-card__label {
  margin: 0;
  min-height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  line-height: 1.25;
  font-weight: 500;
  color: @label-color;

  :deep(p) {
    margin: 0;
    font-size: inherit;
    line-height: inherit;
    color: inherit;
  }
}

.stat-card__divider {
  width: 78%;
  height: 1.5px;
  margin: 8px 0;
  flex-shrink: 0;
  border: none;
  border-radius: 1px;
  background: linear-gradient(
    90deg,
    rgba(184, 137, 58, 0) 0%,
    rgba(184, 137, 58, 0.35) 28%,
    #e0c078 50%,
    rgba(184, 137, 58, 0.35) 72%,
    rgba(184, 137, 58, 0) 100%
  );
  box-shadow: 0 0 3px rgba(224, 192, 120, 0.3);
}

.stat-card__value {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  line-height: 1.2;
  color: @value-color;
  word-break: break-all;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 10px 10px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;

  &::before {
    content: "";
    flex-shrink: 0;
    width: 3px;
    height: 16px;
    border-radius: 2px;
    background: @btn-grad;
  }
}
</style>
