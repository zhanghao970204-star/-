<template>
  <div class="tx-records-page">
    <title-bar :title="$lang.txRecords_title || 'TRANSACTION RECORDS'" />

    <!-- Filter -->
    <div class="tx-filter">
      <van-dropdown-menu>
        <van-dropdown-item
          v-model="filterValue"
          :options="filterOptions"
          @change="onFilterChange"
        />
      </van-dropdown-menu>
    </div>

    <!-- Transaction List -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      loading-text=" "
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
        v-if="!list.length && !loading"
        :image="require('../../../assets/img/common/img_no_data.png')"
        :description="$lang.noempt"
      />
    </van-list>
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
      page: 0,
      filterValue: 6,
      filterOptions: [
        { text: this.$lang.billGame_txt4 || "Today", value: 0 },
        { text: this.$lang.billGame_txt5 || "Yesterday", value: 1 },
        { text: this.$lang.billGame_txt6 || "This Week", value: 2 },
        { text: this.$lang.billGame_txt7 || "Last Week", value: 3 },
        { text: this.$lang.billGame_txt8 || "This Month", value: 4 },
        { text: this.$lang.billGame_txt9 || "Last Month", value: 5 },
        { text: this.$lang.billGame_txt10 || "All", value: 6 },
      ],
      params: {},
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
    onFilterChange(i) {
      this.resetList();
      if (i === 0) {
        let startDate = this.$getTodayRange().slice(0, 19);
        let endDate = this.$getTodayRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 1) {
        let startDate = this.$getYesterdayRange().slice(0, 19);
        let endDate = this.$getYesterdayRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 2) {
        let startDate = this.$getThisWeekRange().slice(0, 19);
        let endDate = this.$getThisWeekRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 3) {
        let startDate = this.$getLastWeekRange().slice(0, 19);
        let endDate = this.$getLastWeekRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 4) {
        let startDate = this.$getThisMonthRange().slice(0, 19);
        let endDate = this.$getThisMonthRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 5) {
        let startDate = this.$getLastMonthRange().slice(0, 19);
        let endDate = this.$getLastMonthRange().slice(20, 40);
        this.fetchData(startDate, endDate);
      } else if (i === 6) {
        this.fetchData("", "");
      }
    },
    resetList() {
      this.list = [];
      this.page = 0;
      this.finished = false;
    },
    async fetchData(startDate, endDate) {
      this.params = {
        startDate: startDate,
        endDate: endDate,
        pageIndex: this.page,
        orderType: "wd",
      };
      this.loading = true;
      try {
        const data = await GetRWHistory(this.params);
        if (data.status === "ok") {
          let items = data.content.orderRecordList || [];
          if (items.length < 20) {
            this.finished = true;
          }
          this.list = this.list.concat(items);
          this.loading = false;
          this.page++;
        } else {
          this.loading = false;
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } catch (e) {
        this.loading = false;
        console.error(e);
      }
    },
    loadMore() {
      const { startDate, endDate } = this.params;
      this.fetchData(startDate || "", endDate || "");
    },
  },
};
</script>

<style lang="less" scoped>
.tx-records-page {
  min-height: 100vh;
  background: #1f1c17;
}

/* ===== Filter ===== */
.tx-filter {
  position: sticky;
  top: 46px;
  z-index: 10;
  padding: 10px 16px;
}

:deep(.van-dropdown-menu__bar) {
  background: #15110a;
  height: 30px !important;
  border-radius: 20px;
  border: none;
  padding: 0 18px;
  box-shadow: none;

  .van-dropdown-menu__title {
    color: @wihte-color !important;
  }
  .van-dropdown-menu__title--active {
    color: #ffa300 !important;
  }
}

:deep(.van-dropdown-menu__title) {
  font-size: 12px !important;
  .van-ellipsis {
    margin-right: 5px;
  }
}

:deep(.van-dropdown-item__content) {
  font-size: 12px !important;
  .van-cell__value {
    display: none;
  }
}

:deep(.van-dropdown-item) {
  width: 145px;
  border-radius: 15px;
  margin-top: 5px;
  margin-left: 3%;
  border: 1px solid rgba(255, 162, 0, 0.45);
  height: 240px;

  .van-dropdown-item__content {
    max-height: 100%;
  }
  .van-overlay {
    background-color: transparent !important;
  }
  .van-cell {
    background-color: #2a2418;
    color: @wihte-color;
    padding: 5px 16px;
  }
}

:deep(.van-dropdown-item__option--active) {
  color: #ffa300 !important;
  font-weight: bold;
}

:deep(.van-dropdown-item__option--active .van-dropdown-item__icon) {
  color: #ffa300 !important;
}

:deep(.van-loading) {
  background: transparent;
}

/* ===== Transaction List ===== */
.tx-list {
  height: calc(100vh - 100px);
  overflow-y: auto;
  padding: 0 0 20px;
}

/* ===== Date Header ===== */
.tx-date-header {
  position: sticky;
  top: 0;
  z-index: 5;
  padding: 12px 16px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #a89b7c;
  background: rgba(31, 28, 23, 0.92);
  backdrop-filter: blur(8px);
}

/* ===== Transaction Item ===== */
.tx-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 12px 8px;
  padding: 14px 16px;
  .record-list-card();
  cursor: pointer;
}

/* Info */
.tx-item__info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.tx-item__type {
  font-size: 14px;
  font-weight: 700;
  color: @wihte-color;
  margin: 0;
}

.tx-item__time {
  font-size: 12px;
  color: #a89b7c;
  margin: 4px 0 0;
}

/* Right */
.tx-item__right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  flex-shrink: 0;
}

.tx-item__amount {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
}

.tx-item__amount--green {
  color: #ffa300;
}

.tx-item__amount--red {
  color: #ef4444;
}

/* Status Badge */
.tx-item__status {
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 4px;
}

.tx-item__status--success {
  color: #ffa300;
}

.tx-item__status--pending {
  color: #ffa300;
}

.tx-item__status--failed {
  color: #ef4444;
}

/* ===== PC Responsive ===== */
@media (min-width: 769px) {
  :deep(.van-dropdown-item) {
    left: 50% !important;
    transform: translate(-50%, 0%) !important;
    margin-left: -142px !important;
  }
}
</style>
