<template>
  <div class="game-records-page">
    <title-bar :title="$lang.billGame_title || 'GAME RECORDS'" />

    <!-- Balance + Filter Header -->
    <div class="gr-subheader">
      <div class="gr-balance">
        <span class="gr-balance__label">{{ getCurrency }}</span>
        <span class="gr-balance__amount">{{ $formatNumberWithCommas(balance) }}</span>
      </div>
      <div class="gr-filter">
        <van-dropdown-menu>
          <van-dropdown-item v-model="filterValue" :options="filterOptions" @change="onFilterChange" />
        </van-dropdown-menu>
      </div>
    </div>

    <!-- Game List -->
    <van-list v-model:loading="loading" :finished="finished" loading-text=" " @load="loadMore" class="gr-list">
      <template v-for="(group, gIdx) in groupedList" :key="'d'+gIdx">
        <div class="gr-date">{{ group.label }}</div>
        <div
          v-for="(item, idx) in group.items"
          :key="'g'+gIdx+'-'+idx"
          class="gr-card"
        >
          <div class="gr-card__left">
            <div class="gr-card__thumb">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#ffa300"><path d="M21.58 16.09l-1.09-7.66C20.21 6.46 18.52 5 16.53 5H7.47C5.48 5 3.79 6.46 3.51 8.43l-1.09 7.66C2.2 17.63 3.39 19 4.94 19h0c.68 0 1.32-.27 1.8-.75L9 16h6l2.25 2.25c.48.48 1.13.75 1.8.75h0c1.55 0 2.74-1.37 2.53-2.91zM11 11H9v2H8v-2H6v-1h2V8h1v2h2v1zm4 2c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm2-3c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1z"/></svg>
            </div>
            <div class="gr-card__info">
              <p class="gr-card__name">{{ item.gameName }}</p>
              <p class="gr-card__meta">
                <span class="gr-card__bet">{{ $lang.billGame_txt2 || 'Bet:' }} {{ getCurrency }}{{ $formatNumberWithCommas(item.betAmount) }}</span>
              </p>
              <p class="gr-card__time">{{ formatTime(item.createDate) }}</p>
            </div>
          </div>
          <div class="gr-card__right">
            <p class="gr-card__profit" :class="getProfit(item) >= 0 ? 'gr-card__profit--win' : 'gr-card__profit--loss'">
              {{ getCurrency }} {{ profitSign(item) }}{{ $formatNumberWithCommas(Math.abs(getProfit(item))) }}
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
import { GetUserGameRecordList, GameBalanceList } from '@/api/common'

export default {
  name: 'BillGame',
  data() {
    return {
      balance: 0,
      userList: [],
      loading: false,
      finished: false,
      page: 0,
      filterValue: 6,
      filterOptions: [
        { text: this.$lang.billGame_txt4 || 'Today', value: 0 },
        { text: this.$lang.billGame_txt5 || 'Yesterday', value: 1 },
        { text: this.$lang.billGame_txt6 || 'This Week', value: 2 },
        { text: this.$lang.billGame_txt7 || 'Last Week', value: 3 },
        { text: this.$lang.billGame_txt8 || 'This Month', value: 4 },
        { text: this.$lang.billGame_txt9 || 'Last Month', value: 5 },
        { text: this.$lang.billGame_txt10 || 'All', value: 6 }
      ],
      params: {}
    }
  },
  computed: {
    groupedList() {
      const groups = {}
      const today = this.$dayjs().format('YYYY-MM-DD')
      this.userList.forEach(item => {
        const date = this.$dayjs(item.createDate).format('YYYY-MM-DD')
        if (!groups[date]) {
          groups[date] = {
            date,
            label: date === today ? (this.$lang.billGame_txt4 || 'Today') : date,
            items: []
          }
        }
        groups[date].items.push(item)
      })
      return Object.values(groups)
    }
  },
  mounted() {
    this.getBalance()
  },
  methods: {
    async getBalance() {
      try {
        const data = await GameBalanceList()
        if (data.status === 'ok') {
          this.balance = data.content.balance || 0
        }
      } catch (e) {
        console.error(e)
      }
    },
    formatTime(d) {
      return this.$dayjs(d).format('HH:mm')
    },
    getProfit(item) {
      return (item.winAmount || 0) - (item.betAmount || 0)
    },
    profitSign(item) {
      return this.getProfit(item) < 0 ? '-' : '+'
    },
    onFilterChange(i) {
      this.resetList()
      const rangeMap = {
        0: () => this.$getTodayRange(),
        1: () => this.$getYesterdayRange(),
        2: () => this.$getThisWeekRange(),
        3: () => this.$getLastWeekRange(),
        4: () => this.$getThisMonthRange(),
        5: () => this.$getLastMonthRange()
      }
      if (rangeMap[i]) {
        const range = rangeMap[i]()
        this.fetchData(range.slice(0, 19), range.slice(20, 40))
      } else {
        this.fetchData('', '')
      }
    },
    resetList() {
      this.userList = []
      this.page = 0
      this.finished = false
    },
    async fetchData(startDate, endDate) {
      this.params = { startDate, endDate, pageIndex: this.page }
      this.loading = true
      try {
        const data = await GetUserGameRecordList(this.params)
        if (data.status === 'ok') {
          const list = data.content.dataList || []
          if (list.length < 20) this.finished = true
          this.userList = this.userList.concat(list)
          this.loading = false
          this.page++
        } else {
          this.loading = false
          this.$toast({ message: data.msg, icon: 'cross' })
        }
      } catch (e) {
        this.loading = false
        console.error(e)
      }
    },
    loadMore() {
      const { startDate, endDate } = this.params
      this.fetchData(startDate || '', endDate || '')
    }
  }
}
</script>

<style lang="less" scoped>
@bg: #1f1c17;
@card: #15110a;
@neon: #ffa300;
@muted: #a89b7c;
@border: rgba(255, 162, 0, 0.45);

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
  padding: 10px 16px;
  position: sticky;
  top: 46px;
  z-index: 10;
  background: rgba(31, 28, 23, 0.96);
  backdrop-filter: blur(8px);
}

.gr-balance {
  background: @card;
  border-radius: 8px;
  padding: 6px 14px;
  display: flex;
  align-items: center;
  gap: 4px;
  border: 1px solid @border;

  &__label {
    font-size: 12px;
    color: @muted;
  }

  &__amount {
    font-size: 14px;
    font-weight: 700;
    color: @wihte-color;
  }
}

.gr-filter {
  :deep(.van-dropdown-menu__bar) {
    background: @card;
    height: 32px !important;
    border-radius: 8px;
    border: 1px solid @border;
    padding: 0 12px;
    box-shadow: none;

    .van-dropdown-menu__title {
      color: @wihte-color !important;
      font-size: 12px !important;
    }
  }

  :deep(.van-dropdown-item) {
    border-radius: 10px;
    overflow: hidden;

    .van-cell {
      background: @card;
      color: @wihte-color;
      padding: 8px 16px;
      font-size: 12px;
    }

    .van-dropdown-item__option--active {
      color: @neon !important;
    }

    .van-dropdown-item__option--active .van-dropdown-item__icon {
      color: @neon !important;
    }
  }

  :deep(.van-overlay) {
    background: transparent !important;
  }
}

// ====== DATE HEADER ======
.gr-date {
  padding: 12px 16px 6px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: @muted;
  position: sticky;
  top: 98px;
  background: rgba(31, 28, 23, 0.92);
  backdrop-filter: blur(8px);
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
  }

  &__thumb {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: rgba(255, 163, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__info {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__name {
    font-size: 14px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
  }

  &__meta {
    font-size: 11px;
    color: @muted;
  }

  &__bet {
    color: @muted;
  }

  &__time {
    font-size: 11px;
    color: #a89b7c;
  }

  &__right {
    text-align: right;
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

  .gr-filter {
    :deep(.van-dropdown-item) {
      left: auto !important;
      right: 16px !important;
      transform: none !important;
    }
  }
}
</style>
