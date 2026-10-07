<template>
  <div class="content">
    <div class="content-c-wrap">
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
@page-bg: #15031d;
@card-bg: #411c59;
@label-color: #ffffff;
@value-color: #ffd467;

.content {
  padding: 0 0 20%;
  background: transparent;
}

/* 外层固定整宽上下渐变边；内层才横向滚动（避免边跟着 Tab 挪断） */
.content-c-wrap {
  position: relative;
  margin: 0;
  background: linear-gradient(180deg, #7400ae 0%, #53027b 100%);

  &::before,
  &::after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    height: 2px;
    pointer-events: none;
    z-index: 5;
  }

  &::before {
    top: 0;
    background: linear-gradient(90deg, #ed3bfe 0%, #9159fe 100%);
  }

  &::after {
    bottom: 0;
    background: linear-gradient(90deg, #ac65f9 0%, #486dfe 100%);
  }
}

.content-c {
  overflow-x: auto;
  overflow-y: hidden;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  height: 48px;
  padding: 0 6px 0 8px;
  margin: 0;
  box-sizing: border-box;
  border-bottom: none;
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
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0;
  margin: 0 4px;
  white-space: nowrap;
}

.tab-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 14px;
  box-sizing: border-box;
  color: #ffffff;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
  border-radius: 999px;
  border: 1.5px solid transparent;
  background: transparent;
}

.tab-item.active {
  color: #ffffff;
  font-weight: 700;
  border-color: #ffd400;
  background: #1a0a2e;
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
  background: @card-bg;
  border: none;
  border-radius: 16px;
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
  font-weight: 600;
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
  height: 0;
  margin: 8px 0;
  flex-shrink: 0;
  border: none;
  border-top: 1px dashed #924fbe;
  background: none;
  box-shadow: none;
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
  display: block;
  margin: 14px 10px 10px;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  line-height: 1.3;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.4px;
}
</style>
