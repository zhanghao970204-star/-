<template>
  <div class="content-c">
    <title-bar :title="$lang.rewardRecord_title || 'Reward Record'"></title-bar>
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
        :key="item.dealNo || index"
      >
        <div class="order-list--left">
          <p class="order-list--name">{{ item.dealTypeName || item.dealType }}</p>
          <p class="font-color m-t-10">{{ item.createDate }}</p>
        </div>
        <div class="order-list--right">
          <p
            :class="
              Number(item.orderAmount) < 0 ? 'error-color' : 'primary-color'
            "
          >
            {{ Number(item.orderAmount) < 0 ? "" : "+"
            }}{{ $formatNumberWithCommas(item.orderAmount) }}
          </p>
          <p v-if="item.balCurr != null" class="font-color m-t-10 bal-curr">
            {{ $lang.rewardRecord_balance || "Balance" }}:
            {{ $formatNumberWithCommas(item.balCurr) }}
          </p>
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
import { GetOtherDealHistory } from "@/api/common";

export default {
  name: "RewardRecord",
  data() {
    return {
      orderList: [],
      loading: false,
      finished: false,
      page: 0,
    };
  },
  methods: {
    async fetchOrderList() {
      this.loading = true;
      try {
        const data = await GetOtherDealHistory({
          pageIndex: this.page,
        });
        if (data.status !== "ok") {
          this.finished = true;
          if (data.msg) {
            this.$toast({ message: data.msg, icon: "cross" });
          }
          return;
        }
        const content = data.content || {};
        const list = content.capitalDetailsList || [];
        // 文档：每页固定 10 条；以本页条数 < 10 判断是否还有下一页
        if (list.length < 10) {
          this.finished = true;
        }
        this.orderList = this.orderList.concat(list);
        this.page++;
      } catch (e) {
        this.finished = true;
        console.error("GetOtherDealHistory error", e);
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.fetchOrderList();
    },
  },
};
</script>

<style lang="less" scoped>
.order-list {
  margin-top: 10px;
  height: 90vh;
  overflow-y: auto;
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

.order-list--left {
  flex: 1;
  min-width: 0;
  padding-right: 10px;
}

.order-list--name {
  word-break: break-word;
}

.order-list--right {
  text-align: right;
  flex-shrink: 0;
}

.bal-curr {
  font-size: 11px;
}

:deep(.van-loading) {
  background: transparent;
  padding-top: 0%;
}
</style>
