<template>
  <div class="reward-page-wrap">
    <!-- Header -->
    <header class="reward-header">
      <div class="reward-header__back" @click="goBack">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </div>
      <h1 class="reward-header__title">
        {{ $lang.reward_history || "REWARD HISTORY" }}
      </h1>
      <div class="reward-header__filter" @click="showDatePicker = true">
        <van-icon name="notes-o" size="22" color="var(--wihte-color)" />
      </div>
    </header>

    <div v-if="filterDate" class="reward-filter-tag">
      <span>{{ formatFilterDate(filterDate) }}</span>
      <van-icon name="cross" size="14" color="#ffa300" @click="clearFilter" />
    </div>

    <!-- Main Content -->
    <main class="reward-content">
      <template v-for="(group, gIdx) in groupedRewards" :key="gIdx">
        <section class="reward-group">
          <!-- Sticky Month Header -->
          <div class="reward-group__header">
            <h3>{{ group.month }}</h3>
          </div>
          <!-- Reward Items -->
          <div class="reward-group__list">
            <div
              v-for="(item, idx) in group.items"
              :key="idx"
              class="reward-item"
            >
              <!-- Icon -->
              <div class="reward-item__icon">
                <img
                  src="@/assets/img/activity/activity_icon/checkin/coin.png"
                  alt="coin"
                  width="100%"
                  height="100%"
                />
              </div>
              <!-- Info -->
              <div class="reward-item__info">
                <div class="reward-item__title-row">
                  <p class="reward-item__type">
                    {{
                      item.type === "deposit"
                        ? $lang.reward_deposit_signin || "Deposit Sign-in"
                        : $lang.reward_regular_signin || "Regular Sign-in"
                    }}
                  </p>
                  <span v-if="item.isPremium" class="reward-item__premium">{{
                    $lang.reward_premium || "PREMIUM"
                  }}</span>
                </div>
                <p class="reward-item__date">{{ formatDate(item.date) }}</p>
              </div>
              <!-- Amount -->
              <div class="reward-item__amount">
                <p>+{{ Number(item.amount).toFixed(2) }}</p>
              </div>
            </div>
          </div>
        </section>
      </template>

      <!-- Empty State -->
      <div v-if="groupedRewards.length === 0" class="reward-empty">
        <van-icon name="search" size="48" color="#a89b7c" />
        <p>{{ $lang.reward_no_data || "No rewards found" }}</p>
      </div>
    </main>

    <!-- Date Picker Popup -->
    <DatePickerPopup
      v-model="showDatePicker"
      :min-date="minDate"
      :max-date="maxDate"
      :default-date="maxDate"
      :confirm-text="$lang.reward_confirm || 'Confirm Selection'"
      :cancel-text="$lang.reward_cancel || 'Cancel'"
      @confirm="onDateConfirm"
    />
  </div>
</template>

<script>
import { GetSignDaily } from "@/api/common";
import DatePickerPopup from "@/components/DatePickerPopup";

export default {
  name: "RewardHistory",
  components: { DatePickerPopup },
  data() {
    const now = new Date();
    return {
      showDatePicker: false,
      filterDate: null,
      minDate: new Date(now.getFullYear(), now.getMonth(), 1),
      maxDate: now,
      rewardList: [],
    };
  },
  computed: {
    filteredRewards() {
      if (!this.filterDate) return this.rewardList;
      const y = this.filterDate.getFullYear();
      const m = this.filterDate.getMonth();
      const d = this.filterDate.getDate();
      return this.rewardList.filter((item) => {
        const dt = new Date(item.date);
        return (
          dt.getFullYear() === y && dt.getMonth() === m && dt.getDate() === d
        );
      });
    },
    groupedRewards() {
      const groups = {};
      this.filteredRewards.forEach((item) => {
        const dt = new Date(item.date);
        const monthKey = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const label = `${monthNames[dt.getMonth()]} ${dt.getFullYear()}`;
        if (!groups[monthKey]) {
          groups[monthKey] = { month: label, items: [] };
        }
        groups[monthKey].items.push(item);
      });
      return Object.keys(groups)
        .sort((a, b) => b.localeCompare(a))
        .map((k) => groups[k]);
    },
  },
  async mounted() {
    await this.fetchRewards();
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    async fetchRewards() {
      try {
        const res = await GetSignDaily();
        if (res.status === "ok" && res.content) {
          const signList = res.content.signList || [];
          const now = new Date();
          now.setHours(23, 59, 59, 999);

          // 计算最近7天的范围
          const sevenDaysAgo = new Date(now);
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
          sevenDaysAgo.setHours(0, 0, 0, 0);

          const rewards = [];
          signList.forEach((item) => {
            // 只展示已签到的数据(免费签到或充值签到)
            if (item.isFreeSign !== 1 && item.isPaySign !== 1) return;

            const signDate = new Date(item.date);

            // 只展示最近7天已签到的数据
            if (signDate < sevenDaysAgo || signDate > now) return;

            // 免费签到记录
            if (item.isFreeSign === 1) {
              rewards.push({
                type: "regular",
                amount: item.freeSignReward || 0,
                date: item.date,
                isPremium: false,
              });
            }

            // 充值签到记录
            if (item.isPaySign === 1) {
              rewards.push({
                type: "deposit",
                amount: item.paySignReward || 0,
                date: item.date,
                isPremium: true,
              });
            }
          });

          // 按日期降序排列
          rewards.sort((a, b) => new Date(b.date) - new Date(a.date));
          this.rewardList = rewards;
        } else if (res.status === "need_login") {
          this.$bus.emit("openLogin");
        }
      } catch (e) {
        console.error("fetchRewards error:", e);
      }
    },
    onDateConfirm(date) {
      this.filterDate = date;
      this.showDatePicker = false;
    },
    clearFilter() {
      this.filterDate = null;
    },
    formatDate(dateStr) {
      const dt = new Date(dateStr);
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const h = dt.getHours();
      const m = String(dt.getMinutes()).padStart(2, "0");
      const ampm = h >= 12 ? "PM" : "AM";
      const h12 = h % 12 || 12;
      return `${monthNames[dt.getMonth()]} ${dt.getDate()}, ${dt.getFullYear()} • ${String(h12).padStart(2, "0")}:${m} ${ampm}`;
    },
    formatFilterDate(date) {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    },
  },
};
</script>

<style lang="less" scoped>
@primary: #ffa300;
@bg-dark: #1f1c17;
@surface: #15110a;

.reward-page-wrap {
  min-height: 100vh;
  background: @bg-dark;
  padding-bottom: 40px;
}

// Header
.reward-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: @bg-dark;
  border-bottom: 1px solid fade(@primary, 10%);

  &__back {
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-start;

    button,
    div {
      padding: 8px;
      border-radius: 50%;
      cursor: pointer;
      &:active {
        background: fade(@primary, 10%);
      }
    }
  }

  &__title {
    color: @wihte-color;
    font-size: 16px;
    font-weight: bold;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    flex: 1;
    text-align: center;
  }

  &__filter {
    width: 48px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    cursor: pointer;
    padding: 8px;
    border-radius: 50%;
    &:active {
      background: fade(@primary, 10%);
    }
  }
}

// Filter Tag
.reward-filter-tag {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 16px 0;
  padding: 6px 12px;
  background: fade(@primary, 10%);
  border: 1px solid fade(@primary, 20%);
  border-radius: 20px;
  width: fit-content;

  span {
    color: @primary;
    font-size: 12px;
    font-weight: 600;
  }
}

// Content
.reward-content {
  padding: 8px 16px;
}

// Group
.reward-group {
  margin-bottom: 16px;

  &__header {
    position: sticky;
    top: 56px;
    background: @bg-dark;
    padding: 12px 0;
    z-index: 10;

    h3 {
      color: #a89b7c;
      font-size: 13px;
      font-weight: bold;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
}

// Reward Item
.reward-item {
  display: flex;
  align-items: center;
  gap: 16px;
  .record-list-card();
  border-radius: 12px;
  padding: 16px;
  transition: border-color 0.2s;

  &:active {
    border-color: fade(@primary-color, 55%);
  }

  &__icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background: fade(#eab308, 10%);
    border: 1px solid fade(#eab308, 20%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__title-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__type {
    color: @wihte-color;
    font-size: 14px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__premium {
    background: fade(@primary, 10%);
    color: @primary;
    font-size: 10px;
    font-weight: 900;
    padding: 2px 6px;
    border-radius: 4px;
    border: 1px solid fade(@primary, 20%);
    letter-spacing: -0.02em;
    white-space: nowrap;
  }

  &__date {
    color: #a89b7c;
    font-size: 12px;
    font-weight: 500;
    margin-top: 4px;
  }

  &__amount {
    flex-shrink: 0;

    p {
      color: @primary;
      font-size: 18px;
      font-weight: bold;
    }
  }
}

// Empty
.reward-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 0;

  p {
    color: #a89b7c;
    font-size: 14px;
  }
}

// PC
@media (min-width: 769px) {
  .reward-page-wrap {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
