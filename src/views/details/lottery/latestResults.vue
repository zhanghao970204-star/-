<template>
  <div
    class="content"
    style="
      background: #1f1c17;
      min-height: 100vh;
      padding-top: 55px;
      color: #ffe4b5;
    "
  >
    <!-- <title-bar :title="$lang.common_txt135"> </title-bar> -->
    <van-nav-bar
      :title="$lang.common_txt135"
      :border="false"
      fixed
      z-index="99999"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" color="#ffe4b5" />
      </template>
    </van-nav-bar>
    <div class="latest-result">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        loading-text=" "
        @load="loadMore"
        class="order-list"
      >
        <div
          class="latest-result--i m-b-10"
          v-for="(item, index) in lastList"
          :key="index"
        >
          <div class="d-flex-s">
            <div>
              <p class="f-w d-flex f-t-15">
                {{ item.lotteryName }}
                <span class="m-l-5"> ({{ item.issueNo }}) </span>
              </p>
              <p class="m-t-10 f-t-15 f-w">
                {{ $dayjs(item.lotteryTime).format("DD/MM/YYYY HH:mm:ss") }}
              </p>
            </div>

            <img :src="item.iconUrl" width="60" class="m-r-5" />
          </div>
          <div>
            <div>
              <div class="d-flex-s m-t-5">
                <div
                  v-if="
                    [
                      'tron16x660',
                      'tron16x6180',
                      'tron16x6300',
                      'tron16x6600',
                      'eth16x660',
                      'eth16x6180',
                      'eth16x6300',
                      'eth16x6600',
                      'bnb16x660',
                      'bnb16x6180',
                      'bnb16x6300',
                      'bnb16x6600',
                    ].includes(item.lotteryType)
                  "
                  class="d-flex m-t-5"
                  style="flex-flow: wrap row"
                >
                  <p
                    class="lot-qbg"
                    v-for="(item2, index) in item.lotteryResult.split(',')"
                    :key="index"
                  >
                    {{ item2 }}
                  </p>
                </div>
                <div v-else class="d-flex m-t-5" style="flex-flow: wrap row">
                  <div>
                    <p class="f-t-15 f-w m-b-5">winning:</p>
                    <div class="d-flex" style="flex-flow: wrap row">
                      <p
                        class="lot-qbg"
                        v-for="(item2, index) in JSON.parse(
                          item.lotteryResult,
                        ).winning.split(',')"
                        :key="index"
                      >
                        {{ item2 }}
                      </p>
                    </div>
                  </div>
                  <div v-if="JSON.parse(item.lotteryResult).machine">
                    <p class="f-t-15 f-w m-b-5 m-t-5">machine:</p>
                    <div class="d-flex" style="flex-flow: wrap row">
                      <p
                        class="lot-qbg"
                        v-for="(item2, index) in JSON.parse(
                          item.lotteryResult,
                        ).machine.split(',')"
                        :key="index"
                      >
                        {{ item2 }}
                      </p>
                    </div>
                  </div>
                </div>

                <p
                  v-if="
                    [
                      'tron16x660',
                      'tron16x6180',
                      'tron16x6300',
                      'tron16x6600',
                      'eth16x660',
                      'eth16x6180',
                      'eth16x6300',
                      'eth16x6600',
                      'bnb16x660',
                      'bnb16x6180',
                      'bnb16x6300',
                      'bnb16x6600',
                    ].includes(item.lotteryType)
                  "
                  style="
                    background: linear-gradient(
                      180deg,
                      #ffd467 0%,
                      #df8a1b 100%
                    );
                    color: #573900;
                    height: 30px;
                    width: 70px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                  "
                  @click="goToBin(item.resultBasedOn)"
                >
                  {{ $lang.common_txt181 }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <van-empty
          v-if="!lastList.length && !loading"
          :image="require('../../../assets/img/common/img_no_data.png')"
          :description="$lang.noempt"
        />
      </van-list>
    </div>

    <div
      style="
        max-width: 450px;
        width: 100%;
        background: #15110a;
        position: fixed;
        bottom: 0;
        padding: 10px 0;
        box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
        border-top: 1px solid rgba(233, 168, 67, 0.35);
      "
      @click="goToPlay()"
    >
      <p
        style="
          background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
          width: 85%;
          margin: 0 auto;
          text-align: center;
          padding: 12px 0;
          color: #573900;
          font-size: 15px;
          font-weight: bold;
          border-radius: 10px;
        "
      >
        {{ $lang.common_txt207 }}
      </p>
    </div>
  </div>
</template>
<script>
import { GetNGNDrawHistory } from "@/api/common";
export default {
  name: "BetHistory",
  components: {},
  data() {
    return {
      memberList: [
        this.$lang.common_txt99,
        this.$lang.common_txt100,
        this.$lang.common_txt101,
        this.$lang.common_txt102,
        this.$lang.common_txt103,
        this.$lang.common_txt104,
        this.$lang.common_txt105,
        this.$lang.common_txt106,
        this.$lang.common_txt107,
        this.$lang.common_txt108,
        this.$lang.common_txt109,
        this.$lang.common_txt110,
      ],
      lastList: [],
      loading: false, // 是否正在加载更多数据
      finished: false, // 是否已经加载完所有数据
      page: 0, // 当前页码
      lotteryType: this.$route.query.lotteryType,
    };
  },
  mounted() {
    this.GetNGNDrawHistory();
  },
  methods: {
    goToBin(v) {
      window.open(v, "_blank");
    },
    goToPlay() {
      this.$jumpTo(
        "/lotteryDetail",
        {
          lotteryType: this.$route.query.lotteryType
            ? this.$route.query.lotteryType
            : "megasena",
          lotteryName: this.$route.query.lotteryName
            ? this.$route.query.lotteryName
            : "mega-sena",
        },
        { replace: true },
      );
    },
    onClickLeft() {
      if (this.$route.query.isFrom === "1") {
        this.$jumpTo("/home", {}, { replace: true });
      } else if (this.$route.query.isFrom === "2") {
        this.$jumpTo("/mine", {}, { replace: true });
      } else {
        this.$jumpTo(
          "/lotteryDetail",
          {
            lotteryType: this.$route.query.lotteryType,
            lotteryName: this.$route.query.lotteryName,
          },
          { replace: true },
        );
      }
    },
    async GetNGNDrawHistory() {
      this.loading = true;
      const data = await GetNGNDrawHistory({
        lotteryType: this.$route.query.lotteryType,
        pageIndex: this.page,
      });
      if (data.status === "ok") {
        let list = data.content.list || [];
        // 如果没有新数据，表示加载完成
        if (list.length < 15) {
          this.finished = true;
        }

        this.lastList = this.lastList.concat(list);
        // 加载状态结束
        this.loading = false;
        // 加载下一页
        this.page++;
      }
    },
    // 加载更多数据
    loadMore() {
      this.GetNGNDrawHistory();
    },
  },
};
</script>
<style lang="less" scoped>
.latest-result {
  padding: 3% 3% 55px 3%;
}
.latest-result--i {
  padding: 10px 15px;
  .record-list-card();
  border-radius: 15px;
  box-shadow: 0 0 3px 1px rgba(0, 0, 0, 0.1);
  color: #ffe4b5;
}
.lot-qbg {
  // background: #ffa300;
  background: url("../../../assets/img/lottery/select-q.png") no-repeat;
  // border-radius: 20px;
  background-size: 100% 100%;
  width: 32px;
  height: 32px;
  color: @black-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  font-weight: bold;
  font-size: 12px;
  margin-bottom: 5px;
}
.lot_hh {
  background: url(../../../assets/img/lottery/hua_s.png) no-repeat;
  width: 30px;
  height: 30px;
  background-size: 100% 100%;
  margin-right: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
}
:deep(.van-nav-bar__content) {
  background: #15110a !important;
  color: #ffe4b5 !important;
}
:deep(.van-nav-bar__title) {
  color: #ffe4b5 !important;
}
:deep(.van-loading) {
  width: 100%;
  height: 100%;
  padding-top: 45%;
  background-color: #1f1c17; /* 设置背景颜色 */
}
</style>
