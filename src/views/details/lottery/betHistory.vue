<template>
  <div class="content" style="background: #1f1c17; min-height: 100vh">
    <title-bar :title="$lang.common_txt193"> </title-bar>
    <div class="bet-bg d-flex-s">
      <p
        v-for="(item, index) in [$lang.common_txt194, $lang.common_txt195]"
        :key="index"
        @click="selectType(index)"
        :class="{ 'active-type': selectIndex === index }"
      >
        {{ item }}
      </p>
    </div>

    <van-list
      v-model:loading="loading"
      :finished="finished"
      loading-text=" "
      @load="loadMore"
      class="order-list"
    >
      <div class="bet-scroll">
        <div
          class="bet-scroll-i"
          v-for="(item, index) in betList"
          :key="index"
          @click="goToDetil(item)"
        >
          <div class="d-flex-s f-t-15">
            <p>
              <span class="f-w">{{ item.lotteryName }}</span>
              <span>({{ item.issueNo }})</span>
            </p>
            <!-- <p v-html="item.statusDescr"></p> -->
            <p class="f-w" :style="textStyle(item.statusCode)">
              {{ getStatus(item.statusCode) }}
            </p>
          </div>
          <div class="d-flex-s m-t-15">
            <p>{{ $lang.common_txt196 }}</p>
            <p>{{ $dayjs(item.betTime).format("DD/MM/YYYY HH:mm:ss") }}</p>
          </div>
          <div class="d-flex-s m-t-10">
            <p>{{ $lang.common_txt197 }}</p>
            <p class="f-w f-t-15">
              <span>{{ getCurrency }} </span>
              <span style="color: #ed0000"
                >-{{ $formatNumberWithCommas(item.betAmount) }}</span
              >
            </p>
          </div>
          <div class="d-flex-s m-t-10">
            <p>{{ $lang.common_txt198 }}</p>
            <p class="f-w f-t-15">
              <span>{{ getCurrency }} </span>
              <span style="color: #007524"
                >+{{ $formatNumberWithCommas(item.sendAmount) }}</span
              >
            </p>
          </div>
        </div>
      </div>
      <div v-if="!betList.length && !loading" class="empt-bg">
        <img src="../../../assets/img/common/img_no_data2.png" width="80%" />
        <p class="f-t-18 f-w">{{ $lang.noempt }}</p>
      </div>
      <!-- <van-empty
          v-if="!betList.length && !loading && !isRefreshing"
          :image="require('../../../assets/img/common/img_no_data2.png')"
          description="No Records"
        /> -->
    </van-list>
  </div>
</template>
<script>
import { GetBetList } from "@/api/common";
export default {
  name: "BetHistory",
  components: {},
  data() {
    return {
      selectIndex: 0,
      pageIndex: 0,
      betList: [],
      loading: false, // 是否正在加载更多数据
      finished: false, // 是否已经加载完所有数据
    };
  },
  mounted() {
    // this.GetBetList()
  },
  methods: {
    textStyle(v) {
      if (v === "bet$no_win") {
        return { color: "#53646B" };
      } else if (v === "bet$u_cancelled") {
        return { color: "#ED0000" };
      } else if (v === "bet$won") {
        return { color: "#007524" };
      } else if (v === "bet$s_cancelled") {
        return { color: "#ED0000" };
      } else if (v === "bet$draw_waiting") {
        return { color: "#25A09C" };
      }
    },
    getStatus(v) {
      if (v === "bet$no_win") {
        return this.$lang.common_txt199;
      } else if (v === "bet$u_cancelled") {
        return this.$lang.common_txt200;
      } else if (v === "bet$won") {
        return this.$lang.common_txt201;
      } else if (v === "bet$s_cancelled") {
        return this.$lang.common_txt202;
      } else if (v === "bet$draw_waiting") {
        return this.$lang.common_txt203;
      }
    },
    goToDetil(v) {
      this.$jumpTo("/bettingDetails", {
        mainOrderNo: v.betOrderNo,
        childOrderNo: v.childOrderNo,
      });
    },
    selectType(i) {
      this.selectIndex = i;
      this.pageIndex = 0;
      this.loading = false; // 是否正在加载更多数据
      this.finished = false; // 是否已经加载完所有数据
      // this.isRefreshing = false // 是否正在下拉刷新
      this.betList = [];
      this.loadMore();
    },
    async GetBetList() {
      this.loading = true;
      const data = await GetBetList({
        betGameType: "TT_LOTTERY",
        hisType: this.selectIndex === 0 ? "n_won" : "n_draw_waiting",
        orderStatus: this.selectIndex === 0 ? "bet$won" : "bet$no_win",
        pageIndex: this.pageIndex,
        queryType: "three_month",
      });
      if (data.status === "ok") {
        // this.betList = data.content.betList
        let list = data.content.betList || [];

        // 如果没有新数据，表示加载完成
        if (list.length < 20) {
          this.finished = true;
        }
        // 将新数据添加到列表中
        this.betList = this.betList.concat(list);
        // 加载状态结束
        this.loading = false;
        // this.isRefreshing = false
        // 加载下一页
        this.pageIndex++;
      }
    },
    // 加载更多数据
    loadMore() {
      this.GetBetList();
    },
    // // 下拉刷新
    // handleRefresh() {
    //   this.isRefreshing = true
    //   this.pageIndex = 0
    //   this.finished = false
    //   this.betList = []
    //   this.loadMore()
    // }
  },
};
</script>
<style lang="less" scoped>
.bet-bg {
  background: #1f1c17;
  text-align: center;
  font-size: 15px;
  font-weight: bold;
  color: #a89b7c;
  padding: 8px 60px 0;
  line-height: 35px;
  position: sticky;
  top: 0;
}
.active-type {
  color: #ffa300;
  border-bottom: 2px solid #ffa300;
}
// .bet-scroll {
//   width: 100%;
//   padding: 3%;
//   overflow-y: auto; /* 垂直方向可滚动 */
//   height: 86vh;
// }
.order-list {
  width: 100%;
  padding: 3%;
  overflow-y: auto; /* 垂直方向可滚动 */
  height: 86vh;
  background: #1f1c17;
}
.bet-scroll-i {
  .record-list-card();
  padding: 15px 10px;
  margin-bottom: 10px;
  color: #ffe4b5;
}
:deep(.van-loading) {
  padding-top: 0%;
  background: transparent;
}
:deep(.van-nav-bar__content) {
  background: #15110a !important;
  color: #ffe4b5 !important;
}
:deep(.van-nav-bar__title) {
  color: #ffe4b5 !important;
}
:deep(.van-icon-arrow-left) {
  color: #ffe4b5 !important;
}
.empt-bg {
  height: 78vh;
  display: flex;
  flex-flow: column;
  align-items: center;
  justify-content: center;
  color: #a89b7c;
}
:deep(.van-nav-bar) {
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1) !important;
}
</style>
