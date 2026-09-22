<template>
  <div class="content">
    <div class="content-select" ref="filterWrap">
      <van-dropdown-menu :z-index="3000">
        <van-dropdown-item
          class="share-sub-filter-item"
          teleport="body"
          v-model="value1"
          :options="option1"
          @change="selectChange"
          @opened="syncDropdownPosition"
          @open="syncDropdownPosition"
        />
      </van-dropdown-menu>
    </div>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      loading-text=" "
      finished-text=""
      @load="loadMore"
      class="order-list"
    >
      <div v-if="userList.length" class="content-card">
        <div
          class="content-card--i"
          v-for="(item, index) in userList"
          :key="item.userId || index"
        >
          <div class="d-flex f-t-15 m-b-10 m-t-15">
            <p>
              {{ item.userId }}
            </p>
            <img
              @click="copyText(item.userId)"
              class="m-l-10"
              width="16px"
              height="17px"
              src="../../assets/img/drawer/drawer_copy.png"
            />
          </div>

          <div class="f-t-13">
            <p class="d-flex-s m-t-15">
              <span class="font-color">{{ $lang.share_txt38 }}</span>
              {{ getTime(item.loginDate) }}
            </p>
            <p class="w-line"></p>
            <p class="d-flex-s">
              <span class="font-color">{{ $lang.share_txt36 }}</span>
              {{ item.hisSubordinatesCount }}
            </p>
            <p class="w-line"></p>
            <p class="d-flex-s">
              <span class="font-color">{{ $lang.share_txt34 }}</span>
              {{ getCurrency }}
              {{ item.depositAmount }}
            </p>
            <p class="w-line"></p>
            <p class="d-flex-s">
              <span class="font-color">{{ $lang.share_txt37 }}</span>
              {{ getCurrency }} {{ item.validBets }}
            </p>
            <p class="w-line"></p>
            <p class="d-flex-s">
              <span class="font-color">{{ $lang.share_txt35 }}</span>
              <span class="error-color">{{ item.accountStatus }}</span>
            </p>
          </div>

          <div class="content-card--ig t-c">
            <p class="content-card--igt"></p>
            {{ $lang.VIP }} {{ item.vipLevel }}
          </div>
        </div>
      </div>
      <van-empty
        v-if="!userList.length && !loading"
        :image="require('../../assets/img/common/img_no_data.png')"
        :description="$lang.noempt"
      />
    </van-list>
  </div>
</template>
<script>
import { GetSubUserList } from "@/api/common";
export default {
  name: "ShareThree",
  data() {
    return {
      userList: [],
      loading: false,
      finished: false,
      page: 0,
      value1: 6,
      option1: [
        { text: this.$lang.billGame_txt4, value: 0 },
        { text: this.$lang.billGame_txt5, value: 1 },
        { text: this.$lang.billGame_txt6, value: 2 },
        { text: this.$lang.billGame_txt7, value: 3 },
        { text: this.$lang.billGame_txt8, value: 4 },
        { text: this.$lang.billGame_txt9, value: 5 },
        { text: this.$lang.billGame_txt10, value: 6 },
      ],
      params: {
        startDate: "",
        endDate: "",
        pageIndex: 0,
      },
      fetching: false,
    };
  },
  methods: {
    syncDropdownPosition() {
      this.$nextTick(() => {
        const trigger =
          this.$refs.filterWrap &&
          this.$refs.filterWrap.querySelector(".van-dropdown-menu__bar");
        const panel = document.querySelector(".share-sub-filter-item");
        if (!trigger || !panel) return;
        const rect = trigger.getBoundingClientRect();
        panel.style.left = `${Math.max(8, rect.left)}px`;
        panel.style.right = "auto";
        panel.style.width = `${Math.max(rect.width, 160)}px`;
      });
    },
    getTime(v) {
      if (!v) return "-";
      const time = this.$dayjs(v).format("YYYY-MM-DD");
      return (
        time.slice(8, 10) + "/" + time.slice(5, 7) + "/" + time.slice(0, 4)
      );
    },
    getRangeByIndex(i) {
      const rangeFns = {
        0: () => this.$getTodayRange(),
        1: () => this.$getYesterdayRange(),
        2: () => this.$getThisWeekRange(),
        3: () => this.$getLastWeekRange(),
        4: () => this.$getThisMonthRange(),
        5: () => this.$getLastMonthRange(),
      };
      if (!rangeFns[i]) {
        return { startDate: "", endDate: "" };
      }
      const range = rangeFns[i]();
      return {
        startDate: range.slice(0, 19),
        endDate: range.slice(20, 40),
      };
    },
    selectChange(i) {
      this.userList = [];
      this.page = 0;
      this.finished = false;
      this.fetching = false;
      // van-list 会在 finished/loading 变化后再次 check；先占住 loading 防重复
      this.loading = true;
      const { startDate, endDate } = this.getRangeByIndex(i);
      this.fetchList(startDate, endDate);
    },
    async fetchList(startDate = "", endDate = "") {
      if (this.fetching) return;
      this.fetching = true;
      this.params = {
        startDate: startDate || "",
        endDate: endDate || "",
        pageIndex: this.page,
      };
      this.loading = true;
      try {
        const data = await GetSubUserList(this.params);
        if (data.status === "ok") {
          const list = data.content.userList || [];
          if (list.length < 15) {
            this.finished = true;
          }
          this.userList = this.userList.concat(list);
          this.page++;
        } else {
          this.finished = true;
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } catch (e) {
        this.finished = true;
      } finally {
        this.fetching = false;
        this.loading = false;
      }
    },
    // van-list 触发 @load 前会把 loading 设为 true，不能再用 loading 判断拦截
    loadMore() {
      if (this.finished || this.fetching) {
        this.loading = false;
        return;
      }
      const { startDate, endDate } = this.params;
      this.fetchList(startDate || "", endDate || "");
    },
    copyText(i) {
      const textarea = document.createElement("textarea");
      textarea.value = i;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  background: transparent;
  min-height: auto;
}

.content-select {
  padding: 10px 16px;
  background: transparent;
}

:deep(.van-dropdown-menu) {
  width: fit-content;
  height: 30px;
  background: transparent;
}

:deep(.van-dropdown-menu__bar) {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  height: 30px !important;
  border-radius: 20px;
  border: none;
  box-shadow: none;
  padding: 0 18px;
  width: fit-content;
}

:deep(.van-dropdown-menu__item) {
  flex: none;
}

:deep(.van-dropdown-menu__title) {
  color: #573900 !important;
  font-weight: 700;
  font-size: 13px;
}

:deep(.van-dropdown-menu__title--active) {
  color: #573900 !important;
}

:deep(.van-dropdown-menu__title:after) {
  border-color: transparent transparent #573900 #573900;
}

.content-card {
  padding: 3% 3% 15%;
}
.content-card--i {
  position: relative;
  .record-list-card();
  border-radius: 12px;
  justify-content: space-between;
  padding: 15px 18px;
  box-shadow: 0px 0px 12px 0px rgba(255, 163, 0, 0.08);
  margin-bottom: 15px;
  color: #fff;
}
.content-card--ig {
  position: absolute;
  width: 80px;
  top: -6px;
  left: 0;
  right: 0;
  margin: 0 auto;
  padding-bottom: 3px;
  color: #573900;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  font-weight: bold;
  font-size: 15px;
  border-radius: 15px 15px 15px 0;
}
.content-card--igt {
  margin-top: 3px;
}
:deep(.van-loading) {
  background: transparent;
}
.w-line {
  width: 92%;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(97, 97, 97, 0.1),
    #e9a843,
    rgba(97, 97, 97, 0.1)
  );
  margin: 10px auto;
}
.order-list {
  min-height: auto;
  padding-bottom: 20px;
  background: transparent;
}
</style>

<style lang="less">
.share-sub-filter-item.van-dropdown-item {
  z-index: 3000 !important;
  right: auto !important;
  width: 160px;
  height: auto !important;
  max-height: 280px;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(233, 168, 67, 0.4);
  box-sizing: border-box;
}

.share-sub-filter-item .van-dropdown-item__content {
  max-height: 280px;
  background: #252020 !important;
  position: relative !important;
}

.share-sub-filter-item .van-cell {
  background: #252020 !important;
  color: #fff !important;
  padding: 10px 16px;
  font-size: 13px;
  white-space: nowrap;
}

.share-sub-filter-item .van-dropdown-item__option--active,
.share-sub-filter-item
  .van-dropdown-item__option--active
  .van-dropdown-item__icon {
  color: #ffa300 !important;
  font-weight: bold;
}

.share-sub-filter-item .van-overlay {
  background: transparent !important;
}
</style>
