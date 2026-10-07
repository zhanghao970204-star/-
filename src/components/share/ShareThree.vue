<template>
  <div class="content">
    <div class="content-select">
      <common-gradient-select
        v-model="value1"
        :options="option1"
        @change="selectChange"
      />
    </div>
    <div class="content-panel">
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
                src="@/assets/img/mine/copy.png"
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
@page-bg: #15031d;
@panel: #4b0e5d;

.content {
  background: transparent;
  min-height: auto;
  padding-bottom: 20px;
}

.content-select {
  /* 吸顶：顶栏 60 + 主 Tab 约 53，停在红线位置 */
  position: sticky;
  top: 113px;
  z-index: 20;
  padding: 10px 16px 12px;
  background-color: #27033c;
  background-image: url("../../assets/img/common/page_bg.png");
  background-repeat: repeat;
  background-size: auto;
  background-position: top center;
  background-attachment: fixed;
  box-sizing: border-box;
}

.content-panel {
  margin: 0 12px;
  padding: 16px 10px 20px;
  min-height: 280px;
  border-radius: 16px;
  background: @panel;
  box-sizing: border-box;
}

.content-card {
  padding: 3% 0 8%;
}
.content-card--i {
  position: relative;
  background: rgba(18, 6, 40, 0.55);
  border: 1px solid fade(#e93dfe, 28%);
  border-radius: 12px;
  justify-content: space-between;
  padding: 15px 18px;
  box-shadow: 0 0 12px fade(#9f24c9, 18%);
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
  color: #fff;
  background: linear-gradient(135deg, #9f24c9 0%, #3b4edc 100%);
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
:deep(.van-empty) {
  padding: 40px 0 20px;
}
:deep(.van-empty__description) {
  color: #ffffff;
}
.w-line {
  width: 92%;
  height: 2px;
  background: linear-gradient(
    to right,
    rgba(97, 97, 97, 0.1),
    #b48cff,
    rgba(97, 97, 97, 0.1)
  );
  margin: 10px auto;
}
.order-list {
  min-height: auto;
  padding-bottom: 8px;
  background: transparent;
}
</style>
