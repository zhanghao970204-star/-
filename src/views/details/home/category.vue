<template>
  <div class="content category-page">
    <!-- <title-bar :title="$lang.common_txt63"></title-bar> -->
    <van-nav-bar
      :title="vendorName || $lang.common_txt63"
      :border="false"
      fixed
      z-index="1000"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </template>
    </van-nav-bar>
    <div class="category-page__body">
      <div class="cot-Search">
        <van-field
          v-model="gameValue"
          :placeholder="
            vendorName
              ? ($lang.search_in || 'Search in') + ' ' + vendorName
              : $lang.common_txt144
          "
          class="custom-field"
        >
          <template #right-icon>
            <img
              class="cot-Search__icon"
              src="@/assets/img/home/top_search.png"
              alt=""
            />
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
            @scroll.passive="onListScroll"
          >
            <div
              v-for="(item3, index) in displayGames"
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
    </div>
    <login v-model="showPopup" overlay></login>
  </div>
</template>
<script>
import { GetHomeGameList } from "@/api/common";
import { normalizeHomeDataList } from "@/utils/homeGameList";
import { mapState, mapActions } from "vuex";

const PAGE_SIZE = 30;
const STATE_KEY = "categoryState:";

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
      vendorName: "",
      // 分批渲染，避免一次挂 700+ 张卡
      visibleCount: PAGE_SIZE,
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
      this.allGames = this.filterGames(newArr);
    },
    allGames() {
      if (this._restoring) return;
      this.visibleCount = PAGE_SIZE;
    },
  },
  computed: {
    ...mapState(["favorites"]),
    displayGames() {
      return this.allGames.slice(0, this.visibleCount);
    },
    // 新增：获取当前币种
    // currentCurrency() {
    //   return this.getCurrency // 确保getCurrency方法/属性已定义
    // }
  },
  created() {},
  mounted() {
    this.GetHomeGameList();
  },
  beforeRouteLeave(to, from, next) {
    // 记住分类页状态，从游戏返回时恢复
    try {
      const el = this.$refs.targetElement;
      sessionStorage.setItem(
        STATE_KEY + from.fullPath,
        JSON.stringify({
          selectIndex2: this.selectIndex2,
          gameValue: this.gameValue,
          visibleCount: this.visibleCount,
          scrollTop: el ? el.scrollTop : 0,
        }),
      );
    } catch (e) {
      /* ignore */
    }
    next();
  },
  methods: {
    ...mapActions(["addFavorite", "removeFavorite"]),
    onListScroll(e) {
      const el = e.target;
      if (
        this.visibleCount < this.allGames.length &&
        el.scrollTop + el.clientHeight >= el.scrollHeight - 200
      ) {
        this.visibleCount += PAGE_SIZE;
      }
    },
    restoreState() {
      let saved = null;
      try {
        saved = JSON.parse(
          sessionStorage.getItem(STATE_KEY + this.$route.fullPath) || "null",
        );
      } catch (e) {
        saved = null;
      }
      if (!saved) return;
      this._restoring = true;
      this.gameValue = saved.gameValue || "";
      this.$nextTick(() => {
        if (saved.selectIndex2 === 1) this.getSelect2(1);
        this.visibleCount = Math.max(PAGE_SIZE, saved.visibleCount || 0);
        this.$nextTick(() => {
          const el = this.$refs.targetElement;
          if (el && saved.scrollTop) el.scrollTop = saved.scrollTop;
          this._restoring = false;
        });
      });
    },
    // 按 gid 去重（Hot 与厂商分组会重复返回同一游戏），并按去首尾空格的关键词过滤
    filterGames(list) {
      const kw = (this.gameValue || "").trim().toLowerCase();
      const seen = new Set();
      return list.filter((g) => {
        if (!g) return false;
        if (g.gid != null) {
          if (seen.has(g.gid)) return false;
          seen.add(g.gid);
        }
        return !kw || (g.gameName || "").toLowerCase().includes(kw);
      });
    },
    // 修改：适配分组结构的收藏判断逻辑
    isFavorite(item) {
      // 找到对应currency的分组
      const currencyGroup = this.favorites.find(
        (group) => group.currency === this.getCurrency,
      );
      if (!currencyGroup) return false;
      // 检查该分组下是否包含当前游戏
      return currencyGroup.list.some((fav) => Number(fav.gid) === Number(item.gid));
    },
    // 收藏走服务端：未登录弹登录，接口成功后再提示
    async toggleFavorite(item) {
      if (!this.token) {
        this.showPopup = true;
        return;
      }
      if (this._favBusy) return;
      this._favBusy = true;
      const payload = {
        currency: this.getCurrency,
        item: item,
      };
      try {
        if (this.isFavorite(item)) {
          if (await this.removeFavorite(payload)) {
            this.$toast(this.$lang.favorite_removed || "Removed from favorites");
          }
        } else if (await this.addFavorite(payload)) {
          this.$toast(this.$lang.favorite_added || "Added to favorites");
        }
      } finally {
        this._favBusy = false;
      }
      // 切换收藏后更新收藏列表展示
      if (this.selectIndex2 === 1) {
        this.getSelect2(1);
      }
    },
    onClickLeft() {
      this.$jumpTo("/home", {}, { replace: true });
    },
    goToGame(v) {
      if (this.token) {
        this.$launchGame({
          type: "hall",
          gid: v,
          isDemo: 0,
          from: "game",
          typeCate: 1,
          gameTab: this.$route.query.gameTab,
        });
      } else {
        sessionStorage.setItem("loginScene", "game");
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

      this.allGames = this.filterGames(newArr);
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
        // View All 进来时标题显示厂商 / 分类名
        if (typeCode) {
          const hitCat = normalized.find((it) => String(it.code) === String(typeCode));
          const hitType = typesArr.find((t) => String(t.code) === String(typeCode));
          this.vendorName =
            (hitType && (hitType.name || hitType.showName)) ||
            (hitCat && hitCat.name) ||
            "";
        }

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
        this.restoreState();
      }
    },
  },
};
</script>
<style lang="less" scoped>
.category-page {
  min-height: 100vh;
  padding-top: var(--van-nav-bar-height, 67px);
  box-sizing: border-box;

  :deep(.van-nav-bar__title) {
    position: absolute !important;
    left: 50% !important;
    right: auto !important;
    flex: none;
    width: auto;
    max-width: calc(100% - 96px) !important;
    margin: 0 !important;
    transform: translateX(-50%) !important;
    text-align: center;
  }
}

.category-page__body {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 35px 16px 0;
  box-sizing: border-box;
}

.cot-Search {
  width: 100%;
  box-sizing: border-box;

  &__icon {
    display: block;
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
  }

  .custom-field {
    display: flex !important;
    align-items: center !important;
    width: 100%;
    height: 48px !important;
    min-height: 48px !important;
    padding: 0 16px !important;
    background: #000 !important;
    border-radius: 999px !important;
    border: 1px solid #633488 !important;
    box-sizing: border-box !important;
    overflow: visible;

    &:focus-within {
      box-shadow: 0 0 0 1px #ffd400;
    }

    :deep(.van-cell__value) {
      display: flex;
      align-items: center;
      flex: 1;
      width: 100%;
      min-width: 0;
      height: auto;
      overflow: visible;
    }

    :deep(.van-field__body) {
      display: flex;
      align-items: center;
      flex: 1;
      width: 100%;
      min-width: 0;
      height: auto;
      overflow: visible;
    }

    :deep(.van-field__control) {
      flex: 1;
      width: auto;
      min-width: 0;
      height: auto !important;
      min-height: 0;
      padding: 0 !important;
      margin: 0;
      color: #fff;
      font-size: 14px;
      font-weight: 500;
      line-height: 22px;
      overflow: visible;
    }

    :deep(.van-field__control::placeholder) {
      color: #d7a2fa;
      line-height: 22px;
      opacity: 1;
    }

    :deep(.van-field__right-icon) {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 0 0 18px;
      width: 18px;
      height: auto;
      margin: 0 0 0 10px;
      padding: 0;
      line-height: 1;
    }
  }
}
.cot-cont {
  display: flex;
  margin-top: 12px;
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
      background: #2d1545;
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
  border-radius: 999px;
}
.active-select2 {
  // background-image: linear-gradient(99deg, @info-color 0%, #7041f3 85%) !important;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  // box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.15);
  color: #573900 !important;
  border-radius: 999px !important;
}
.cot-cont-r {
  position: relative;
  margin-left: 0;
  width: 100%;
  container-type: inline-size;
}
.cot-cont-rt {
  position: relative;
  display: flex;
  align-items: center;
  background: transparent;
  margin-left: 0;
  .cot-cont-rti {
    background: #2d1545;
    border: 1px solid rgba(233, 168, 67, 0.25);
    color: #ffe4b5;
    border-radius: 999px;
    text-align: center;
    min-width: 70px;
    padding: 5px 12px;
    margin-right: 10px;
    cursor: pointer;
  }
}
.cot-cont-rb {
  margin-top: 12px;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 2.4cqw;
  overflow-x: hidden;
  overflow-y: auto;
  max-height: calc(100vh - var(--van-nav-bar-height, 67px) - 140px);
  max-width: 450px;
  margin-left: auto;
  margin-right: auto;
  padding: 0 0 50px;
  box-sizing: border-box;
}
.cot-cont-rbi {
  width: 100%;
  position: relative;
}
.cot-cont-rbi__cover {
  width: 100%;
  aspect-ratio: 208 / 280;
  border-radius: 13px;
  overflow: hidden;
  background: #2d1545;
  line-height: 0;

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 13px;
    vertical-align: top;
  }
}
.cot-cont-rbi__fav {
  position: absolute;
  right: 0;
  top: 0;
  z-index: 2;
  box-sizing: content-box;
  padding: 5px 5px 14px 14px;
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
