<template>
  <div class="content-c">
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
      >
        <div>
          <p>{{ item.dealTypeName }}</p>
          <p
            class="error-color m-t-15"
            :class="{ active: item.orderAmount > 0 }"
          >
            {{ item.orderAmount }}
          </p>
        </div>
        <div>
          <p class="font-color">{{ item.createDate }}</p>
          <p class="m-t-15 font-color">
            Balance: R$ {{ $formatNumberWithCommas(item.balCurr) }}
          </p>
        </div>
      </div>
      <van-empty
        v-if="!orderList.length && !loading"
        :image="require('../../assets/img/common/img_no_data.png')"
        description="Sem Registros"
      />
    </van-list>
  </div>
</template>
<script>
import { CapitalDetails } from "@/api/common";
export default {
  name: "RechargeTabThree",
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
    // 获取订单列表数据
    async fetchOrderList() {
      this.loading = true;
      const data = await CapitalDetails({ pageIndex: this.page });
      // let list = data.content?.capitalDetailsList || []
      let list = data.content.capitalDetailsList || [];
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
  margin-top: 30px;
  height: 450px; /* 固定高度 */
  overflow-y: auto; /* 垂直方向可滚动 */
}
.order-list--item {
  font-size: 15px;
  .record-list-card();
  margin-bottom: 20px;
  padding: 10px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
:deep(.van-loading) {
  padding-top: 0%;
}
.active {
  color: @primary-color2;
}
:deep(.van-loading) {
  background: transparent;
  padding-top: 0%;
}
</style>
