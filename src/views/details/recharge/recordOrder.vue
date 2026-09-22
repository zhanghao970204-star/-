<template>
  <div class="content-c">
    <title-bar :title="$lang.recordOrder_title"></title-bar>
    <van-list
      v-model:loading="loading"
      :finished="finished"
      loading-text=" "
      @load="loadMore"
      class="order-list"
    >
      <div
        class="order-list--item"
        v-for="(item, index) in orderList"
        :key="index"
        @click="goToD(item)"
      >
        <div class="d-flex">
          <!-- <img src="../../../assets/img/home/pix-H.png" height="30" /> -->
          <div class="m-l-10">
            <p v-if="item.orderType === 'pay'">{{ $lang.Recarregar }}</p>
            <p v-else>
              <span>{{ $lang.recordOrder_txt }} {{ $lang.account }}</span
              >({{ item.bankName }} {{ formatCardNumber(item.bankCard) }})
            </p>

            <p class="font-color m-t-10">{{ item.createDate }}</p>
          </div>
        </div>
        <div>
          <div style="text-align: right">
            <p v-if="item.orderType === 'wd'" class="error-color">
              - {{ $formatNumberWithCommas(item.orderAmount) }}
            </p>
            <p v-else class="primary-color">
              + {{ $formatNumberWithCommas(item.orderAmount) }}
            </p>
          </div>
          <div class="m-t-10">
            <p v-if="item.isReversed" style="color: var(--primary-color)">
              <van-icon name="success" size="12" style="margin-right: 2px" />
              {{ $lang.recharge_success || "Recharge Successful" }}
            </p>
            <p
              v-else-if="
                ['withdraw$success', 'pay$success'].includes(item.orderStatus)
              "
              style="color: var(--primary-color)"
            >
              <van-icon name="success" size="12" style="margin-right: 2px" />
              {{
                item.orderType === "pay"
                  ? $lang.recharge_success || "Recarga bem-sucedida"
                  : item.orderStatusName
              }}
            </p>
            <p
              class="error-color"
              v-else-if="
                ['withdraw$failed', 'pay$failed'].includes(item.orderStatus)
              "
            >
              {{ item.orderStatusName }}
            </p>
            <p v-else class="error-color">
              {{ item.orderStatusName }}
            </p>
          </div>
        </div>
      </div>
      <van-empty
        v-if="!orderList.length && !loading"
        :image="require('../../../assets/img/common/img_no_data.png')"
        :description="$lang.noempt"
      />
    </van-list>
  </div>
</template>
<script>
import { GetRWHistory } from "@/api/common";
export default {
  name: "recordOrder",
  components: {},

  data() {
    return {
      orderList: [], // 订单列表数据
      loading: false, // 是否正在加载更多数据
      finished: false, // 是否已经加载完所有数据
      // isRefreshing: false, // 是否正在下拉刷新
      page: 0, // 当前页码
    };
  },
  mounted() {},
  methods: {
    // 格式化银行卡号
    formatCardNumber(cardNumber) {
      if (!cardNumber) return ""; // 如果为空，直接返回空字符串
      const length = cardNumber.length;
      if (length <= 4) return cardNumber; // 如果长度小于等于4，直接返回原号码
      const stars = "***"; // 前面用6个*代替
      return stars + cardNumber.slice(-4); // 返回格式化后的字符串
    },
    goToD(v) {
      sessionStorage.setItem("orderDetailData", JSON.stringify(v));
      this.$jumpTo("/orderDetail");
    },
    // 获取订单列表数据
    async fetchOrderList() {
      this.loading = true;
      const data = await GetRWHistory({
        pageIndex: this.page,
        orderType: "pay",
      });
      // let list = data.content?.capitalDetailsList || []
      let list = data.content.orderRecordList || [];
      // 如果没有新数据，表示加载完成
      if (list.length < 15) {
        this.finished = true;
      }
      // 将新数据添加到列表中
      this.orderList = this.orderList.concat(list);
      // 加载状态结束
      this.loading = false;
      // 加载下一页
      this.page++;
    },
    // 加载更多数据
    loadMore() {
      this.fetchOrderList();
    },
    // // 下拉刷新
    // handleRefresh() {
    //   this.isRefreshing = true
    //   this.page = 0
    //   this.finished = false
    //   this.orderList = []
    //   this.loadMore()
    // }
  },
};
</script>
<style lang="less" scoped>
/* 设置订单容器和列表的高度 */
.content-c {
  //   height: 200px; /* 固定高度 */
  //   overflow-y: auto; /* 垂直方向可滚动 */
}

.order-list {
  margin-top: 10px;
  height: 90vh; /* 固定高度 */
  overflow-y: auto; /* 垂直方向可滚动 */
  padding: 0 10px;
}
.order-list--item {
  font-size: 12px;
  .record-list-card();
  margin-bottom: 10px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.van-loading) {
  background: transparent;
  padding-top: 0%;
}
.active {
  color: @primary-color2;
}
</style>
