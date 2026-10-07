<template>
  <div class="game-records-page">
    <title-bar :title="$lang.billGame_title || 'GAME RECORDS'" />

    <!-- Balance + Filter Header -->
    <div class="gr-subheader">
      <div class="gr-balance">
        <span class="gr-balance__label">{{ getCurrency }}</span>
        <span class="gr-balance__amount">{{
          $formatNumberWithCommas(balance)
        }}</span>
      </div>
      <div class="gr-filter">
        <common-gradient-select
          v-model="filterValue"
          :options="filterOptions"
          @change="onFilterChange"
        />
      </div>
    </div>

    <!-- Game List -->
    <van-list
      v-model:loading="loading"
      :finished="finished"
      loading-text=" "
      @load="loadMore"
      class="gr-list"
    >
      <template v-for="(group, gIdx) in groupedList" :key="'d' + gIdx">
        <div class="gr-date">{{ group.label }}</div>
        <div
          v-for="(item, idx) in group.items"
          :key="'g' + gIdx + '-' + idx"
          class="gr-card"
        >
          <div class="gr-card__left">
            <div class="gr-card__thumb">
              <img
                class="gr-card__icon"
                src="@/assets/img/mine/game_pad.png"
                alt=""
              />
            </div>
            <div class="gr-card__info">
              <p class="gr-card__name">{{ item.gameName }}</p>
              <p class="gr-card__meta">
                <span class="gr-card__bet"
                  >{{ $lang.billGame_txt2 || "Bet:" }} {{ getCurrency
                  }}{{ $formatNumberWithCommas(item.betAmount) }}</span
                >
              </p>
              <p class="gr-card__time">{{ formatTime(item.createDate) }}</p>
            </div>
          </div>
          <div class="gr-card__right">
            <p
              class="gr-card__profit"
              :class="
                getProfit(item) >= 0
                  ? 'gr-card__profit--win'
                  : 'gr-card__profit--loss'
              "
            >
              {{ getCurrency }} {{ profitSign(item)
              }}{{ $formatNumberWithCommas(Math.abs(getProfit(item))) }}
            </p>
          </div>
        </div>
      </template>

      <van-empty
        v-if="!userList.length && !loading"
        :image="require('../../../assets/img/common/img_no_data.png')"
        :description="$lang.noempt"
      />
    </van-list>
  </div>
</template>

<script>
import { GetUserGameRecordList, GameBalanceList } from "@/api/common";

export default {
  name: "BillGame",
  data() {
    return {
      balance: 0,
      userList: [],
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
      const today = this.$dayjs().format("YYYY-MM-DD");
      this.userList.forEach((item) => {
        const date = this.$dayjs(item.createDate).format("YYYY-MM-DD");
        if (!groups[date]) {
          groups[date] = {
            date,
            label: date === today ? this.$lang.billGame_txt4 || "Today" : date,
            items: [],
          };
        }
        groups[date].items.push(item);
      });
      return Object.values(groups);
    },
  },
  mounted() {
    this.getBalance();
  },
  methods: {
    async getBalance() {
      try {
        const data = await GameBalanceList();
        if (data.status === "ok") {
          this.balance = data.content.balance || 0;
        }
      } catch (e) {
        console.error(e);
      }
    },
    formatTime(d) {
      return this.$dayjs(d).format("HH:mm");
    },
    getProfit(item) {
      return (item.winAmount || 0) - (item.betAmount || 0);
    },
    profitSign(item) {
      return this.getProfit(item) < 0 ? "-" : "+";
    },
    onFilterChange(i) {
      this.resetList();
      const rangeMap = {
        0: () => this.$getTodayRange(),
        1: () => this.$getYesterdayRange(),
        2: () => this.$getThisWeekRange(),
        3: () => this.$getLastWeekRange(),
        4: () => this.$getThisMonthRange(),
        5: () => this.$getLastMonthRange(),
      };
      if (rangeMap[i]) {
        const range = rangeMap[i]();
        this.fetchData(range.slice(0, 19), range.slice(20, 40));
      } else {
        this.fetchData("", "");
      }
    },
    resetList() {
      this.userList = [];
      this.page = 0;
      this.finished = false;
    },
    async fetchData(startDate, endDate) {
      this.params = { startDate, endDate, pageIndex: this.page };
      this.loading = true;
      try {
        const data = await GetUserGameRecordList(this.params);
        if (data.status === "ok") {
          const list = data.content.dataList || [];
          if (list.length < 20) this.finished = true;
          this.userList = this.userList.concat(list);
          this.loading = false;
          this.page++;
        } else {
          this.loading = false;
          this.$toast({ message: data.msg, icon: "cross" });
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
@bg: #1a0a28;
@fill: #1d022c;
@neon: #f6ff00;
@muted: #d7a2fa;
@border-grad: linear-gradient(90deg, #e93dfe 0%, #3245a2 100%);

.game-records-page {
  min-height: 100vh;
  background: @bg;
  padding-bottom: 20px;
}

// ====== SUB HEADER ======
.gr-subheader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 16px;
  position: sticky;
  top: 46px;
  z-index: 10;
  background: @bg;
}

.gr-balance {
  display: flex;
  align-items: center;
  gap: 6px;
  min-height: 34px;
  padding: 0 14px;
  border: 1px solid transparent;
  border-radius: 999px;
  box-sizing: border-box;
  background:
    linear-gradient(@fill, @fill) padding-box,
    @border-grad border-box;
  box-shadow: 0 0 10px fade(#e93dfe, 22%);

  &__label {
    font-size: 12px;
    color: @neon;
    font-weight: 700;
  }

  &__amount {
    font-size: 14px;
    font-weight: 700;
    color: @neon;
  }
}

.gr-filter {
  flex-shrink: 0;

  :deep(.cgs__panel) {
    left: auto;
    right: 0;
  }
}

// ====== DATE HEADER ======
.gr-date {
  padding: 12px 16px 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #ffffff;
  position: sticky;
  top: 90px;
  background: @bg;
  z-index: 5;
}

// ====== GAME CARD ======
.gr-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  margin: 0 12px 8px;
  .record-list-card();
  border-radius: 10px;

  &__left {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
  }

  &__thumb {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__icon {
    width: 40px;
    object-fit: contain;
    display: block;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    color: #d7a2fa;
    text-transform: uppercase;
  }

  &__meta {
    font-size: 11px;
    color: @muted;
  }

  &__bet {
    color: @neon;
  }

  &__time {
    font-size: 11px;
    color: #ffffff;
  }

  &__right {
    text-align: right;
    flex-shrink: 0;
  }

  &__profit {
    font-size: 15px;
    font-weight: 700;

    &--win {
      color: @neon;
    }

    &--loss {
      color: #ef4444;
    }
  }
}

// ====== EMPTY STATE ======
:deep(.van-empty) {
  padding: 60px 0;

  .van-empty__description {
    color: @muted;
  }
}

:deep(.van-loading) {
  background: transparent;
}

@media (min-width: 769px) {
  .game-records-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
