<template>
  <div class="tx-records-page">
    <title-bar :title="$lang.txRecords_title || 'Withdrawal Records'" />

    <!-- 固定筛选，不随列表滚，避免叠层遮挡 -->
    <div class="tx-filter">
      <common-gradient-select
        v-model="filterValue"
        :options="filterOptions"
        @change="onFilterChange"
      />
    </div>

    <div class="tx-scroll" ref="txScroll">
      <van-list
        v-model:loading="loading"
        v-model:error="loadError"
        :finished="finished"
        loading-text=" "
        :error-text="$lang.list_load_failed || 'Failed to load. Tap to retry.'"
        :scroller="scrollParent"
        @load="loadMore"
        class="tx-list"
      >
        <template v-for="(group, gIdx) in groupedList" :key="'h' + gIdx">
          <div class="tx-date-header">{{ group.date }}</div>
          <div
            v-for="(item, idx) in group.items"
            :key="'t' + gIdx + '-' + idx"
            class="tx-item"
            @click="goToDetail(item)"
          >
            <div class="tx-item__info">
              <p v-if="item.orderType === 'pay'" class="tx-item__type">
                {{ $lang.Recarregar || "Deposit" }}
              </p>
              <p v-else class="tx-item__type">
                <span
                  >{{ $lang.recordOrder_txt || "Withdraw" }}
                  {{ $lang.account || "Account" }}</span
                >({{ item.bankName }} {{ formatCardNumber(item.bankCard) }})
              </p>
              <p class="tx-item__time">{{ item.createDate }}</p>
            </div>
            <div class="tx-item__right">
              <p
                class="tx-item__amount"
                :class="
                  item.orderType === 'wd'
                    ? 'tx-item__amount--red'
                    : 'tx-item__amount--green'
                "
              >
                {{ item.orderType === "wd" ? "-" : "+" }}
                {{ $formatNumberWithCommas(item.orderAmount) }}
              </p>
              <span
                class="tx-item__status"
                :class="getStatusClass(item.orderStatus)"
              >
                {{ item.orderStatusName }}
              </span>
            </div>
          </div>
        </template>

        <van-empty
          v-if="!list.length && !loading && !loadError"
          :image="require('../../../assets/img/common/img_no_data.png')"
          :description="$lang.noempt"
        >
          <button
            type="button"
            class="empty-action"
            @click="$jumpTo('/home')"
          >
            {{ $lang.empty_go_home || "Back to Home" }}
          </button>
        </van-empty>
      </van-list>
    </div>
  </div>
</template>

<script>
import { GetRWHistory } from "@/api/common";

export default {
  name: "TransactionRecords",
  data() {
    return {
      list: [],
      loading: false,
      finished: false,
      loadError: false,
      page: 0,
      filterValue: 6,
      scrollParent: null,
      filterOptions: [
        { text: this.$lang.billGame_txt4 || "Today", value: 0 },
        { text: this.$lang.billGame_txt5 || "Yesterday", value: 1 },
        { text: this.$lang.billGame_txt6 || "This Week", value: 2 },
        { text: this.$lang.billGame_txt7 || "Last Week", value: 3 },
        { text: this.$lang.billGame_txt8 || "This Month", value: 4 },
        { text: this.$lang.billGame_txt9 || "Last Month", value: 5 },
        { text: this.$lang.billGame_txt10 || "All", value: 6 },
      ],
      range: { startDate: "", endDate: "" },
    };
  },
  computed: {
    groupedList() {
      const groups = {};
      this.list.forEach((item) => {
        const date = this.$dayjs(item.createDate).format("YYYY-MM-DD");
        if (!groups[date]) groups[date] = { date, items: [] };
        groups[date].items.push(item);
      });
      return Object.values(groups);
    },
  },
  mounted() {
    this.scrollParent = this.$refs.txScroll || null;
    this.applyFilterRange(this.filterValue);
  },
  activated() {
    // keep-alive 返回时若列表空，重新拉一次
    if (!this.list.length && !this.loading) {
      this.resetList();
      this.$nextTick(() => this.loadMore());
    }
  },
  methods: {
    formatCardNumber(cardNumber) {
      if (!cardNumber) return "";
      const length = cardNumber.length;
      if (length <= 4) return cardNumber;
      return "***" + cardNumber.slice(-4);
    },
    goToDetail(item) {
      sessionStorage.setItem("orderDetailData", JSON.stringify(item));
      this.$jumpTo("/orderDetail");
    },
    getStatusClass(status) {
      if (["withdraw$success", "pay$success"].includes(status))
        return "tx-item__status--success";
      if (["withdraw$failed", "pay$failed"].includes(status))
        return "tx-item__status--failed";
      return "tx-item__status--pending";
    },
    applyFilterRange(i) {
      const rangeMap = {
        0: () => this.$getTodayRange(),
        1: () => this.$getYesterdayRange(),
        2: () => this.$getThisWeekRange(),
        3: () => this.$getLastWeekRange(),
        4: () => this.$getThisMonthRange(),
        5: () => this.$getLastMonthRange(),
      };
      if (rangeMap[i]) {
        const raw = rangeMap[i]();
        this.range = {
          startDate: raw.slice(0, 19),
          endDate: raw.slice(20, 40),
        };
      } else {
        this.range = { startDate: "", endDate: "" };
      }
    },
    onFilterChange(i) {
      this.applyFilterRange(i);
      this.resetList();
      this.$nextTick(() => this.loadMore());
    },
    resetList() {
      this.list = [];
      this.page = 0;
      this.finished = false;
      this.loadError = false;
    },
    async fetchData() {
      if (this.finished) return;
      this.loading = true;
      this.loadError = false;
      try {
        const params = {
          pageIndex: this.page,
          orderType: "wd",
        };
        if (this.range.startDate) params.startDate = this.range.startDate;
        if (this.range.endDate) params.endDate = this.range.endDate;

        const data = await GetRWHistory(params);
        if (!data || data.status !== "ok" || !data.content) {
          this.loadError = true;
          if (data && data.msg) {
            this.$toast({ message: data.msg, icon: "cross" });
          }
          return;
        }
        const items = data.content.orderRecordList || [];
        const total = Number(data.content.total);
        this.list = this.list.concat(items);
        if (
          items.length === 0 ||
          (Number.isFinite(total) && total > 0
            ? this.list.length >= total
            : items.length < 20)
        ) {
          this.finished = true;
        }
        this.page++;
      } catch (e) {
        this.loadError = true;
        console.error(e);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.fetchData();
    },
  },
};
</script>

<style lang="less" scoped>
.tx-records-page {
  height: 100vh;
  height: 100dvh;
  background: #1a0a28;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
}

.tx-filter {
  flex-shrink: 0;
  z-index: 20;
  padding: 10px 16px 12px;
  background: #1a0a28;
}

.tx-scroll {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding-bottom: 20px;
}

:deep(.van-loading) {
  background: transparent;
}

.tx-list {
  min-height: 100%;
}

.tx-date-header {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #b8a8d4;
  background: #1a0a28;
}

.tx-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin: 0 12px 8px;
  padding: 12px 14px;
  .record-list-card();
  border-radius: 10px;
  cursor: pointer;

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__type {
    font-size: 14px;
    font-weight: 600;
    color: #d7a2fa;
    line-height: 1.3;
  }

  &__time {
    margin-top: 6px;
    font-size: 12px;
    color: #9b7ab8;
  }

  &__right {
    flex-shrink: 0;
    text-align: right;
  }

  &__amount {
    font-size: 14px;
    font-weight: 700;
    color: #ffee00;

    &--red {
      color: #ff5b5b;
    }
    &--green {
      color: #38de98;
    }
  }

  &__status {
    display: inline-block;
    margin-top: 6px;
    font-size: 11px;
    font-weight: 700;

    &--success {
      color: #38de98;
    }
    &--failed {
      color: #ff5b5b;
    }
    &--pending {
      color: #ffd467;
    }
  }
}

.empty-action {
  margin-top: 12px;
  min-width: 160px;
  height: 44px;
  padding: 0 20px;
  border: none;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
  color: #fff;
  background: linear-gradient(180deg, #38de98 0%, #02a460 100%);
  cursor: pointer;
}
</style>
