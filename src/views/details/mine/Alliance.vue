<template>
  <div class="content">
    <div class="newAlliance">
      <div class="d-flex-s" style="height: 50px; padding: 0 10px">
        <div class="d-flex">
          <van-icon @click="goLeft()" name="arrow-left" size="20" />
          <span class="f-t-16 m-l-5">{{ $lang.common_txt328 }}</span>
        </div>
        <div
          class="d-flex m-l-20"
          style="
            background: rgba(0, 0, 0, 0.6);
            padding: 3px 10px 3px 5px;
            border-radius: 20px;
          "
        >
          <img src="../../../assets/img/otgame/amount.png" width="15" />
          <span class="m-l-5" style="min-width: 50px; padding: 2px 0">{{
            InitDate._balUsable
          }}</span>
        </div>
        <p style="width: 30%"></p>
      </div>
      <div style="padding: 10px">
        <div class="newAlliance_information">
          <p class="t-c f-t-15 f-w" style="padding-top: 7px">
            {{ $lang.common_txt329 }}
          </p>
          <div class="d-flex-s m-t-20 t-c" style="flex-flow: wrap row">
            <div style="width: 50%">
              <p>{{ $lang.common_txt330 }}</p>
              <p class="m-t-5 f-t-16 f-w" style="color: #ffdc4f">
                {{ InitDate2.totalUserCount }}
              </p>
            </div>
            <div style="width: 50%">
              <p>{{ $lang.common_txt331 }}</p>
              <p class="m-t-5 f-t-16 f-w" style="color: #ffdc4f">
                {{ InitDate2.totalRechargeAmount }}
              </p>
            </div>
            <div class="m-t-15" style="width: 50%">
              <p>{{ $lang.common_txt332 }}</p>
              <p class="m-t-5 f-t-16 f-w" style="color: #ffdc4f">
                {{ InitDate2.newRechargeAmount }}
              </p>
            </div>
            <div class="m-t-15" style="width: 50%">
              <p>{{ $lang.common_txt333 }}</p>
              <p class="m-t-5 f-t-16 f-w" style="color: #ffdc4f">
                {{ InitDate2.newRechargeCount }}
              </p>
            </div>
          </div>
          <div class="card_content" style="margin-top: 25px">
            <div
              class="newAlliance_card d-flex"
              style="align-items: flex-start"
            >
              <div style="width: 40%; text-align: center; padding-top: 12px">
                <img :src="getImgCon()" width="57" />
                <p class="newAlliance_card_txt" style="margin-top: -8px">
                  VIP{{ vipLevel }}
                </p>
                <p style="color: rgba(0, 0, 0, 0.65)">
                  {{ $lang.common_txt352 }}
                </p>
                <p class="newAlliance_card_txt2">20%</p>
                <p style="color: rgba(0, 0, 0, 0.65)">
                  {{ $lang.common_txt353 }}
                </p>
                <p class="newAlliance_card_txt2">5%</p>
              </div>
              <div style="width: 60%; text-align: center; padding-top: 20px">
                <p
                  style="
                    color: #122c04;
                    text-decoration: underline;
                    font-style: italic;
                    font-size: 14px;
                    font-weight: 800;
                  "
                >
                  {{ $lang.common_txt354 }}
                </p>
                <p class="m-t-5" style="color: rgba(0, 0, 0, 0.65)">
                  {{ $lang.common_txt355 }}
                </p>
                <p class="card_right_amount">0</p>

                <div class="card_right_btn t-c">
                  {{ $lang.common_txt356 }}
                </div>
              </div>
            </div>
            <div
              v-if="!isExpanded"
              class="card_desc d-flex f-t-14"
              style="justify-content: center"
              @click="isExpanded = true"
            >
              <span>{{ $lang.common_txt334 }}</span>
              <van-icon
                :name="isExpanded ? 'arrow-up' : 'arrow-down'"
                class="m-l-5"
              />
            </div>
            <div
              v-if="isExpanded"
              class="expanded-content"
              style="height: 200px; overflow: auto"
            >
              <div class="commission-container">
                <div
                  class="commission-header"
                  style="position: sticky; top: 0; background: #2a5e1c"
                >
                  <p class="commission-col">{{ $lang.common_txt335 }}</p>
                  <p class="commission-col">{{ $lang.common_txt336 }}</p>
                  <p class="commission-col">{{ $lang.common_txt337 }}</p>
                </div>
                <div
                  v-for="(item, index) in vipList"
                  :key="index"
                  class="commission-row d-flex"
                  style="border-radius: 10px"
                  :class="[
                    index % 2 === 1 ? 'odd-row' : '',
                    vipLevel === item.vipLevel ? 'current-vip' : '',
                  ]"
                >
                  <p class="commission-col" style="text-align: left">
                    <img
                      style="margin-top: 5px; margin-left: 15px"
                      :src="vipImg(`V${item.vipLevel}`)"
                      height="22"
                    />
                  </p>
                  <p class="commission-col" style="color: #cdff35">
                    {{ item.monthlyBonus }}
                  </p>
                  <p class="commission-col" style="color: #cdff35">
                    {{ item.rechargeAmount }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="card_desc d-flex f-t-14"
              style="justify-content: center"
              v-if="isExpanded"
              @click="isExpanded = false"
            >
              {{ $lang.common_txt334 }}
              <van-icon name="arrow-up" class="m-l-5" />
            </div>
          </div>
          <div class="newAlliance_share">
            <p class="t-c f-t-16 f-w" style="padding-top: 5px">
              {{ $lang.common_txt338 }}
            </p>
            <div style="margin: 27px 0px 0px 16px">
              <img
                v-for="(item, index) in [
                  require('@/assets/img/otgame/pinduoduo_21.png'),
                  require('@/assets/img/otgame/pinduoduo_25.png'),
                  require('@/assets/img/otgame/pinduoduo_26.png'),
                  require('@/assets/img/otgame/pinduoduo_24.png'),
                  require('@/assets/img/otgame/pinduoduo_35.png'),
                  require('@/assets/img/otgame/pinduoduo_23.png'),
                ]"
                :key="index"
                :src="item"
                width="35"
                style="margin-right: 10px"
              />
            </div>
            <p style="text-decoration: underline; margin: 10px 0 0 20px">
              {{ $lang.common_txt339 }}
            </p>
            <div class="d-flex" style="padding: 7px 20px">
              <div
                style="
                  background: #d1d6d4;
                  border-radius: 8px;
                  padding: 10px;
                  color: var(--black-color);
                  width: 73%;
                "
              >
                {{ inviteCode }}
              </div>
              <div
                class="m-l-10 f-t-16 f-w d-flex"
                @click="copyText"
                style="
                  background: linear-gradient(90deg, #fa3f2d, #ff8228);
                  height: 34px;
                  padding: 0 20px;
                  border-radius: 8px;
                "
              >
                {{ $lang.common_txt340 }}
              </div>
            </div>
          </div>
          <div class="newAlliance_display" style="position: relative">
            <p class="t-c f-t-16 f-w" style="padding-top: 8px">
              {{ $lang.common_txt341 }}
            </p>
            <div class="t-c" style="position: absolute; right: 50px; top: 50px">
              <p style="color: #ff5129; font-size: 11px">
                {{ $lang.common_txt342 }}
              </p>
              <p class="f-w">LV 0</p>
              <p style="color: #ff5129; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt343 }}
              </p>
              <p class="f-w">0</p>
              <p style="color: #ff5129; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt344 }}
              </p>
              <p class="f-w">0</p>
            </div>
            <div
              class="t-c"
              style="position: absolute; right: 10px; top: 180px"
            >
              <p style="color: #ffa800; font-size: 11px">
                {{ $lang.common_txt345 }}
              </p>
              <p class="f-w">20%</p>
              <p style="color: #ffa800; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt346 }}
              </p>
              <p class="f-w">0</p>
              <p style="color: #ffa800; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt347 }}
              </p>
              <p class="f-w">0</p>
            </div>
            <div
              class="t-c"
              style="position: absolute; right: 10px; top: 318px"
            >
              <p style="color: #ffa800; font-size: 11px">
                {{ $lang.common_txt348 }}
              </p>
              <p class="f-w">5%</p>
              <p style="color: #ffa800; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt349 }}
              </p>
              <p class="f-w">0</p>
              <p style="color: #ffa800; font-size: 11px; margin-top: 5px">
                {{ $lang.common_txt350 }}
              </p>
              <p class="f-w">0</p>
            </div>
            <div
              style="position: absolute; bottom: 20px; left: 10px"
              v-html="$lang.common_txt351"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Init, GetTeamTotalReports, VipInit } from "@/api/common";
import { vipImg } from "@/utils/vipAssets";
export default {
  name: "Alliance",
  components: {},
  data() {
    return {
      inviteCode: "",
      vipLevel: 0,
      vipList: [],
      InitDate: {},
      InitDate2: {
        totalUserCount: 0,
        totalRechargeAmount: 0,
        newRechargeAmount: 0,
        newRechargeCount: 0,
      },
      isExpanded: false,
    };
  },
  mounted() {
    if (this.token) {
      this.Init();
      this.GetTeamTotalReports();
      this.VipInit();
    }
  },
  methods: {
    vipImg,
    getImgCon() {
      if (this.vipLevel === 0) {
        return vipImg("0_bg.png");
      } else if ([1, 2, 3, 4, 5].includes(this.vipLevel)) {
        return vipImg("1_5_bg.png");
      } else if ([6, 7, 8, 9, 10].includes(this.vipLevel)) {
        return vipImg("6_10_bg.png");
      } else if ([11, 12, 13, 14, 15].includes(this.vipLevel)) {
        return vipImg("11_15_bg.png");
      } else if ([16, 17, 18, 19, 20].includes(this.vipLevel)) {
        return vipImg("16_20_bg.png");
      } else if ([21, 22, 23, 24, 25].includes(this.vipLevel)) {
        return vipImg("21_25_bg.png");
      } else if ([26, 27, 28, 29, 30].includes(this.vipLevel)) {
        return vipImg("26_30_bg.png");
      }
    },
    copyText() {
      const textarea = document.createElement("textarea");
      textarea.value = this.inviteCode;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
    async VipInit() {
      const data = await VipInit();
      if (data.status === "ok") {
        this.vipList = data.content.vipList;
      }
    },
    async GetTeamTotalReports() {
      const data = await GetTeamTotalReports();
      if (data.status === "ok") {
        this.InitDate2 = data.content;
      }
    },
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.InitDate = data.content;
        this.vipLevel = data.content.vipLevel;
        this.inviteCode =
          window.location.origin +
          "/" +
          localStorage.getItem("country") +
          "/home?id=" +
          data.content.inviteCode;
      }
    },
    goLeft() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang="less" scoped>
.newAlliance_display {
  margin-top: 10px;
  background: url(../../../assets/img/otgame/Alliance_9.png) no-repeat;
  height: 560px;
  background-size: 100% 100%;
}
.newAlliance_share {
  margin-top: 10px;
  background: url(../../../assets/img/otgame/Alliance_8.png) no-repeat;
  height: 161px;
  background-size: 100% 100%;
}
.newAlliance {
  background: url(../../../assets/img/otgame/Alliance_bj.jpg) no-repeat;
  min-height: 180vh;
  background-size: 100% 100%;
}
.newAlliance_information {
  background: url(../../../assets/img/otgame/Alliance_1.png) no-repeat;
  height: 150px;
  background-size: 100% 100%;
}
.newAlliance_card {
  background: url(../../../assets/img/otgame/Alliance_2.png) no-repeat;
  height: 162px;
  background-size: 100% 100%;
}
.card_desc {
  background: #2a5e1c;
  height: 25px;
  margin-top: -2px;
  border-radius: 0 0 8px 8px;
  color: #dfe3df;
  cursor: pointer;
}
.expanded-content {
  background: #2a5e1c;
  color: @wihte-color;
  padding: 0 10px 10px 10px;
  margin-top: -2px;

  // 新的佣金列表样式（替代表格）
  .commission-container {
    width: 100%;

    .commission-header,
    .commission-row {
      display: flex;
      width: 100%;
    }

    .commission-col {
      flex: 1;
      text-align: center;
      margin: 0;
      padding: 10px 0;
    }

    // .commission-header {
    //   border-bottom: 1px solid #4a7e3c;
    // }

    // 隔行背景色
    .odd-row {
      background-color: #1b3d14;
    }

    // 当前VIP项黄色边框
    .current-vip {
      border: 2px solid #ffdc4f;
      border-radius: 10px !important;
    }

    .commission-row .commission-col {
      padding: 1px 0;
    }
  }
}
.newAlliance_card_txt {
  background: linear-gradient(180deg, #fcffb3, #fffc00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-style: italic;
  font-weight: bold;
  font-size: 14px;
}
.newAlliance_card_txt2 {
  color: #fcff00;
  font-weight: 700;
  text-shadow:
    -1px -1px 0 #064b10,
    1px -1px 0 #064b10,
    -1px 1px 0 #064b10,
    1px 1px 0 #064b10,
    -1px 0 0 #064b10,
    1px 0 0 #064b10,
    0 -1px 0 #064b10,
    0 1px 0 #064b10;
}
.card_right_amount {
  font-size: 28px;
  color: @wihte-color;
  font-weight: 800;
  text-shadow:
    -2px -2px 0 #064b10,
    2px -2px 0 #064b10,
    -2px 2px 0 #064b10,
    2px 2px 0 #064b10,
    -2px 0 0 #064b10,
    2px 0 0 #064b10,
    0 -2px 0 #064b10,
    0 2px 0 #064b10;
}
.card_right_btn {
  background: url(../../../assets/img/otgame/Alliance_7.png) no-repeat;
  background-size: 100% 100%;
  height: 42px;
  filter: grayscale(100%);
  max-width: 145px;
  padding-top: 9px;
  font-size: 15px;
  font-weight: bold;
  margin-left: 35px;
}
</style>
