<template>
  <div class="content">
    <title-bar :title="$lang.common_txt21"></title-bar>
    <div class="d-flex f-t-15 f-w font-color">
      <p
        class="message-i"
        v-for="(item, index) in [$lang.common_txt23]"
        :key="index"
        :class="{ active: selectIndex === index }"
        @click="getSelect(index)"
      >
        {{ item }}
      </p>
    </div>
    <p class="message-line"></p>
    <!-- <img src="../../../assets/img/common/bg-service.png" width="100%" /> -->

    <div v-if="selectIndex === 0" style="width: 96%; margin: 20px auto 0">
      <div
        class="message-i2 d-flex-s m-b-10"
        v-for="(item2, index2) in vipLevel > 2
          ? serviceList
          : serviceList.slice(0, 1)"
        :key="index2"
        @click="goTo(index2)"
      >
        <div class="d-flex">
          <img :src="item2.img" width="50" class="m-r-10" />
          <div>
            <p class="f-t-14 f-w">{{ item2.txt }}</p>
            <p class="font-color m-t-5">{{ item2.txt }}</p>
          </div>
        </div>
        <div class="font-color f-w ser-cont">{{ $lang.common_txt22 }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { GetCsLink, Init } from "@/api/common";
export default {
  name: "MessageCenter",
  components: {},
  data() {
    return {
      vipLevel: 0,
      selectIndex: 0,
      serviceList: [
        {
          img: require("@/assets/img/common/tt_icon.png"),
          txt: "BISONFUN | Official Channel",
        },
        {
          img: require("@/assets/img/common/tt_icon.png"),
          txt: "BISONFUN | Finance Channel",
        },
        {
          img: require("@/assets/img/common/whats-w.png"),
          txt: "BISONFUN | Finance Channel",
        },
      ],
    };
  },
  watch: {},
  computed: {},
  created() {},
  mounted() {
    if (this.token) {
      this.Init();
    }
  },
  methods: {
    async GetCsLink(v) {
      const data = await GetCsLink();
      if (v === 1) {
        const targetKey = "tg";
        window.open(
          data.content.url2.find((item) => targetKey in item)?.[targetKey],
        );
      } else if (v === 2) {
        const targetKey = "ws";
        window.open(
          data.content.url2.find((item) => targetKey in item)?.[targetKey],
        );
      }
    },
    getSelect(i) {
      this.selectIndex = i;
    },
    goTo(i) {
      if (i === 0) {
        window.open("https://t.me/OTgamel");
      } else if (i === 1) {
        this.GetCsLink(1);
      } else if (i === 2) {
        this.GetCsLink(2);
      }
    },
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.vipLevel = data.content.vipLevel;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.message-i {
  text-align: center;
  min-width: 85px;
  padding: 15px 0;
  margin: 0 10px;
}
.active {
  border-bottom: 2px solid @info-color;
  padding-bottom: 13px !important;
  color: @info-color;
}
.message-line {
  height: 1px;
  background: @font-color;
}
.message-i2 {
  background: @cont-bg;
  border-radius: 8px;
  padding: 15px 10px;
}
.ser-cont {
  padding: 10px;
  border-radius: 8px;
  background: @background-color;
}
</style>
