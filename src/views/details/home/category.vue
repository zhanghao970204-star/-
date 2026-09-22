<template>
  <div class="content" style="padding-top: 55px">
    <!-- <title-bar :title="$lang.common_txt63"></title-bar> -->
    <van-nav-bar
      :title="$lang.common_txt63"
      :border="false"
      fixed
      z-index="99999"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </template>
    </van-nav-bar>
    <div class="cot-Search">
      <van-field
        v-model="gameValue"
        :placeholder="$lang.common_txt144"
        class="custom-field"
        style="border: none !important"
      >
        <template #right-icon>
          <img src="../../../assets/img/common/ssk_com.png" width="18" />
        </template>
      </van-field>
    </div>
    <div v-if="dataList.length > 0" class="cot-cont">
      <div class="cot-cont-r">
        <div class="cot-cont-rt">
          <div
            class="cot-cont-rti"
            v-for="(item2, index2) in ['All', 'Favorite']"
            :key="index2"
            :class="{ 'active-select2': index2 === selectIndex2 }"
            @click="getSelect2(index2)"
          >
            {{ item2 }}
          </div>
        </div>
        <div
          v-if="selectIndex2 === 0"
          class="cot-cont-rb"
          ref="targetElement"
        >
          <div
            v-for="(item3, index) in allGames"
            :key="'all-' + (item3.gid || index)"
            class="cot-cont-rbi"
            @click="goToGame(item3.gid, item3)"
          >
            <div class="cot-cont-rbi__cover">
              <img :src="item3.gameIcon" alt="" loading="lazy" />
            </div>
            <template v-if="item3.gameIcon">
              <img
                v-if="!isFavorite(item3)"
                class="cot-cont-rbi__fav"
                @click.stop="toggleFavorite(item3)"
                src="../../../assets/img/common/scyx.png"
                width="20"
                alt=""
              />
              <img
                v-else
                class="cot-cont-rbi__fav"
                @click.stop="toggleFavorite(item3)"
                src="../../../assets/img/common/scyx-a.png"
                width="20"
                alt=""
              />
              <div
                v-if="
                  dataList[selectIndex] &&
                  dataList[selectIndex].types &&
                  dataList[selectIndex].types[selectIndex2] &&
                  dataList[selectIndex].types[selectIndex2].showName === 'yes'
                "
                class="cot-cont-rbi__name"
              >
                {{ item3.gameName }}
              </div>
            </template>
          </div>
          <div class="cot-cont-empty" v-if="allGames.length === 0">
            <van-empty
              :image="require('../../../assets/img/common/img_no_data.png')"
              :description="$lang.common_txt145"
            />
          </div>
        </div>
        <div
          v-if="selectIndex2 === 1"
          class="cot-cont-rb"
          ref="targetElement"
        >
          <div
            v-for="(item3, index) in favariteGames"
            :key="'fav-' + (item3.gid || index)"
            class="cot-cont-rbi"
            @click="goToGame(item3.gid, item3)"
          >
            <div class="cot-cont-rbi__cover">
              <img :src="item3.gameIcon" alt="" loading="lazy" />
            </div>
            <template v-if="item3.gameIcon">
              <img
                v-if="!isFavorite(item3)"
                class="cot-cont-rbi__fav"
                @click.stop="toggleFavorite(item3)"
                src="../../../assets/img/common/scyx.png"
                width="20"
                alt=""
              />
              <img
                v-else
                class="cot-cont-rbi__fav"
                @click.stop="toggleFavorite(item3)"
                src="../../../assets/img/common/scyx-a.png"
                width="20"
                alt=""
              />
              <div class="cot-cont-rbi__name">
                {{ item3.gameName }}
              </div>
            </template>
          </div>
          <div class="cot-cont-empty" v-if="favariteGames.length === 0">
            <van-empty
              :image="require('../../../assets/img/common/img_no_data.png')"
              :description="$lang.common_txt145"
            />
          </div>
        </div>
      </div>
    </div>
    <login v-model="showPopup" overlay></login>
  </div>
</template>
<script>
import { GetHomeGameList } from "@/api/common";
import { normalizeHomeDataList } from "@/utils/homeGameList";
import { mapState, mapActions } from "vuex";

export default {
  name: "Category",
  components: {},
  data() {
    return {
      gameValue: "",
      pgDate: {},
      dataList: [],
      selectIndex: 0,
      selectIndex2: 0,
      showPopup: false,
      favariteGames: [],
      seachArr: [],
      allGames: [],
    };
  },
  watch: {
    gameValue(value) {
      if (value.length > 0) {
        this.selectIndex2 = 0;
      }
      const item = this.dataList[this.selectIndex];
      if (!item || !Array.isArray(item.types)) {
        this.allGames = [];
        return;
      }
      let newArr = item.types.reduce((acc, type) => {
        return acc.concat((type && type.games) || []);
      }, []);
      this.allGames = newArr.filter((i) =>
        i.gameName.toLowerCase().includes(this.gameValue.toLowerCase()),
      );
    },
  },
  computed: {
    ...mapState(["favorites"]),
    // 新增：获取当前币种
    // currentCurrency() {
    //   return this.getCurrency // 确保getCurrency方法/属性已定义
    // }
  },
  created() {},
  mounted() {
    this.GetHomeGameList();
  },
  methods: {
    ...mapActions(["addFavorite", "removeFavorite"]),
    // 修改：适配分组结构的收藏判断逻辑
    isFavorite(item) {
      // 找到对应currency的分组
      const currencyGroup = this.favorites.find(
        (group) => group.currency === this.getCurrency,
      );
      if (!currencyGroup) return false;
      // 检查该分组下是否包含当前游戏
      return currencyGroup.list.some((fav) => fav.gid === item.gid);
    },
    // 修改：适配分组结构的收藏切换逻辑
    toggleFavorite(item) {
      // 构造payload，包含当前currency和游戏项
      const payload = {
        currency: this.getCurrency,
        item: item,
      };
      if (this.isFavorite(item)) {
        this.removeFavorite(payload);
      } else {
        this.addFavorite(payload);
      }
      // 切换收藏后更新收藏列表展示
      if (this.selectIndex2 === 1) {
        this.getSelect2(1);
      }
    },
    onClickLeft() {
      this.$jumpTo("/home", {}, { replace: true });
    },
    goToGame(v, v2) {
      if (this.token) {
        const lotteryIds = [
          1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
          21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
        ];
        const game = v2 || { gid: v };
        const jumpPayload = lotteryIds.includes(v)
          ? {
              type: "lottery",
              lotteryType: game.gameCode,
              lotteryName: game.gameName,
              typeCate: 1,
            }
          : {
              type: "hall",
              gid: v,
              isDemo: 0,
              from: "game",
              typeCate: 1,
              gameTab: this.$route.query.gameTab,
            };
        this.$launchGame(jumpPayload);
      } else {
        this.showPopup = true;
      }
    },
    getSelect(v) {
      this.selectIndex = v;
      const item = this.dataList[v];
      if (!item || !Array.isArray(item.types)) {
        this.allGames = [];
        return;
      }
      let newArr = item.types.reduce((acc, type) => {
        return acc.concat((type && type.games) || []);
      }, []);

      if (this.gameValue.length > 0) {
        this.allGames = newArr.filter((i) =>
          i.gameName.toLowerCase().includes(this.gameValue.toLowerCase()),
        );
      } else {
        this.allGames = newArr;
      }
      this.$nextTick(() => {
        if (this.$refs.targetElement) {
          this.$refs.targetElement.scrollTop = 0;
        }
      });
    },
    // 修改：获取收藏列表时只展示当前币种下的收藏游戏
    getSelect2(v) {
      this.selectIndex2 = v;
      if (v === 1) {
        // 找到当前币种的收藏分组，取其list作为展示的收藏列表
        const currencyGroup = this.favorites.find(
          (group) => group.currency === this.getCurrency,
        );
        this.favariteGames = currencyGroup ? currencyGroup.list : [];
        this.gameValue = "";
      }
      this.$nextTick(() => {
        if (this.$refs.targetElement) {
          this.$refs.targetElement.scrollTop = 0;
        }
      });
    },
    async GetHomeGameList() {
      // partCode（分类码）和 vendorCode（厂商码）都是 types[].code，语义一致，任取其一
      const typeCode =
        this.$route.query.partCode || this.$route.query.vendorCode;
      const data = await GetHomeGameList();
      if (data.status === "ok") {
        this.pgDate = data.content;
        // 兼容树形 / 扁平列表
        const normalized = normalizeHomeDataList(this.pgDate.dataList || []);
        // 后端返回全部分类，前端按 code 过滤（兼容扁平：分类自身 code 即 typeCode）
        const filteredList = typeCode
          ? normalized
              .map((it) => {
                if (String(it.code) === String(typeCode)) return it;
                return {
                  ...it,
                  types: (it.types || []).filter(
                    (t) => String(t.code) === String(typeCode),
                  ),
                };
              })
              .filter((it) => it.types.length > 0)
          : normalized;

        const typesArr = filteredList.flatMap((item) => item.types || []);

        const newList = [
          {
            name: "Lobby",
            icon: require("@/assets/img/common/all_home.png"),
            types: typesArr,
          },
          ...filteredList,
        ];
        this.dataList.splice(0, this.dataList.length, ...newList);

        this.dataList.forEach((i) => {
          if (Array.isArray(i.types)) {
            i.types.sort((a, b) => (a.order || 0) - (b.order || 0));
          }
        });

        let newArr = (this.dataList[0].types || []).filter(
          (i) => i.code === "3000602",
        );
        this.isOtgame = newArr.flatMap((item) =>
          (item.games || []).filter((game) => game.gameName === "Lucky Ball"),
        );
        this.dataList[0].homeIcon = require("@/assets/img/common/all_home.png");
        const tab = parseInt(this.$route.query.gameTab, 10);
        const safeTab =
          !isNaN(tab) && tab >= 0 && tab < this.dataList.length ? tab : 0;
        this.selectIndex = safeTab;
        this.getSelect(safeTab);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.cot-Search {
  width: 100%;
  max-width: 450px;
  position: fixed;
  // background: @cont-bg;
  padding: 10px 7px;
  // .custom-field {
  //   background: #2d2456 !important;
  // }
}
.cot-cont {
  display: flex;
  margin-top: 65px;
  .cot-cont-l {
    display: flex;
    flex-flow: column;
    position: fixed;
    overflow-y: scroll;
    max-height: 82vh;
    padding-bottom: 50px;
    .cot-cont-li {
      // font-weight: bold;
      text-align: center;
      background: #2a2418;
      border: 1px solid rgba(233, 168, 67, 0.25);
      border-radius: 8px;
      margin: 0 10px 12px 10px;
      padding: 5px 10px;
      color: #ffe4b5;
      cursor: pointer;
      max-width: 66px;
      font-size: 11px;
    }
  }
}
.active-select {
  // background-image: linear-gradient(99deg, @info-color 0%, #7041f3 85%) !important;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.15);
  color: #573900 !important;
}
.active-select2 {
  // background-image: linear-gradient(99deg, @info-color 0%, #7041f3 85%) !important;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.15);
  color: #573900 !important;
}
.cot-cont-r {
  position: fixed;
  margin-left: 0;
  width: 100%;
}
.cot-cont-rt {
  position: fixed;
  display: flex;
  align-items: center;
  background: transparent;
  margin-left: 10px;
  // width: 100%;
  // max-width: 365px;
  .cot-cont-rti {
    background: #2a2418;
    border: 1px solid rgba(233, 168, 67, 0.25);
    color: #ffe4b5;
    border-radius: 6px;
    text-align: center;
    min-width: 70px;
    padding: 8px 0;
    margin-right: 10px;
    cursor: pointer;
  }
}
.cot-cont-rb {
  margin-top: 45px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  overflow-x: hidden;
  overflow-y: scroll;
  max-height: 78vh;
  max-width: 450px;
  padding: 0 7px 50px;
  box-sizing: border-box;
}
.cot-cont-rbi {
  width: 100%;
  position: relative;
}
.cot-cont-rbi__cover {
  width: 100%;
  max-height: 160px;
  border-radius: 13px;
  overflow: hidden;
  background: #2a2418;
  line-height: 0;

  img {
    display: block;
    width: 100%;
    height: auto;
    max-height: 160px;
    object-fit: cover;
    border-radius: 13px;
    vertical-align: top;
  }
}
.cot-cont-rbi__fav {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 2;
}
.cot-cont-rbi__name {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 5px;
  z-index: 2;
  text-align: center;
  font-size: 11px;
  line-height: 1.2;
  color: var(--wihte-color) !important;
  padding: 0 4px;
}
.cot-cont-empty {
  grid-column: 1 / -1;
  padding-top: 10vh;
}
:deep(.van-loading__spinner) {
  display: none;
}
</style>
