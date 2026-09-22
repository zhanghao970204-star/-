<template>
  <div class="search-game-page">
    <van-nav-bar
      :title="$lang.search_title"
      :border="false"
      fixed
      z-index="99999"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </template>
    </van-nav-bar>

    <div class="search-game-content">
      <div class="search-input-wrap">
        <van-field
          v-model="searchKeyword"
          :placeholder="$lang.search_placeholder"
          class="search-field"
          @keyup.enter="onSearch"
        >
          <template #left-icon>
            <img
              src="../../../assets/img/common/ssk_com.png"
              width="18"
              class="search-icon"
            />
          </template>
        </van-field>
      </div>

      <div v-if="searchHistory.length > 0" class="section">
        <h3 class="section-title">
          {{ $lang.search_history }}
          <span class="clear-all" @click="clearAllHistory">{{
            $lang.search_clear
          }}</span>
        </h3>
        <div class="tag-list">
          <span
            v-for="(item, idx) in searchHistory"
            :key="'h-' + idx"
            class="tag"
            @click="onHistoryClick(item)"
          >
            {{ item }}
            <van-icon
              name="cross"
              size="12"
              class="tag-close"
              @click.stop="removeHistory(idx)"
            />
          </span>
        </div>
      </div>

      <div
        v-if="popularNames.length > 0 && !searchKeyword.trim()"
        class="section"
      >
        <h3 class="section-title">{{ $lang.search_popular }}</h3>
        <div class="tag-list">
          <span
            v-for="(name, idx) in popularNames"
            :key="'p-' + idx"
            class="tag"
            @click="onPopularClick(name)"
          >
            {{ name }}
          </span>
        </div>
      </div>

      <div
        v-if="recommendedGames.length > 0 && !searchKeyword.trim()"
        class="section"
      >
        <h3 class="section-title">{{ $lang.search_recommended }}</h3>
        <div class="game-grid">
          <div
            v-for="(game, idx) in recommendedGames"
            :key="'r-' + (game.gid || idx)"
            class="game-item"
            @click="goToGame(game.gid, game)"
          >
            <div class="game-item__cover">
              <img :src="game.gameIcon" alt="" loading="lazy" />
            </div>
          </div>
        </div>
      </div>

      <van-empty
        v-if="
          !loading &&
          allGames.length === 0 &&
          searchResult.length === 0 &&
          !searchKeyword
        "
        :image="require('../../../assets/img/common/img_no_data.png')"
        :description="$lang.common_txt145"
        class="empty-tip"
      />
      <div v-if="searchKeyword && searchResult.length > 0" class="section">
        <div class="game-grid">
          <div
            v-for="(game, idx) in searchResult"
            :key="'s-' + (game.gid || idx)"
            class="game-item"
            @click="goToGame(game.gid, game)"
          >
            <div class="game-item__cover">
              <img :src="game.gameIcon" alt="" loading="lazy" />
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
import { collectHomeGames } from "@/utils/homeGameList";

const HISTORY_KEY = "searchGameHistory";
const HISTORY_MAX = 15;
const POPULAR_COUNT = 6;
const RECOMMENDED_COUNT = 3;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default {
  name: "SearchGame",
  data() {
    return {
      searchKeyword: "",
      pgDate: {},
      allGames: [],
      popularNames: [],
      recommendedGames: [],
      searchHistory: [],
      loading: false,
      showPopup: false,
    };
  },
  computed: {
    searchResult() {
      if (!this.searchKeyword.trim()) return [];
      const kw = this.searchKeyword.toLowerCase().trim();
      return this.allGames.filter((g) =>
        (g.gameName || "").toLowerCase().includes(kw),
      );
    },
  },
  created() {
    this.loadSearchHistory();
  },
  mounted() {
    this.GetHomeGameList();
  },
  methods: {
    loadSearchHistory() {
      try {
        const raw = localStorage.getItem(HISTORY_KEY);
        this.searchHistory = raw ? JSON.parse(raw) : [];
      } catch (_) {
        this.searchHistory = [];
      }
    },
    saveSearchHistory(name) {
      if (!name || !name.trim()) return;
      const nameStr = name.trim();
      let list = this.searchHistory.filter((s) => s !== nameStr);
      list.unshift(nameStr);
      list = list.slice(0, HISTORY_MAX);
      this.searchHistory = list;
      localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
    },
    removeHistory(index) {
      this.searchHistory.splice(index, 1);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(this.searchHistory));
    },
    clearAllHistory() {
      this.searchHistory = [];
      localStorage.removeItem(HISTORY_KEY);
    },
    buildAllGames() {
      return collectHomeGames(
        (this.pgDate && this.pgDate.dataList) || [],
        this.getCurrency,
      );
    },
    pickRandomNames(games, count) {
      const names = [...new Set(games.map((g) => g.gameName).filter(Boolean))];
      return shuffle(names).slice(0, count);
    },
    pickRandomGames(games, count) {
      return shuffle(games).slice(0, count);
    },
    async GetHomeGameList() {
      this.loading = true;
      const data = await GetHomeGameList();
      if (data.status === "ok") {
        this.pgDate = data.content;
        this.allGames = this.buildAllGames();
        this.popularNames = this.pickRandomNames(this.allGames, POPULAR_COUNT);
        this.recommendedGames = this.pickRandomGames(
          this.allGames,
          RECOMMENDED_COUNT,
        );
      }
      this.loading = false;
    },
    onClickLeft() {
      this.$jumpTo("/home", {}, { replace: true });
    },
    onSearch() {
      const kw = this.searchKeyword.trim();
      if (kw) this.saveSearchHistory(kw);
    },
    onHistoryClick(name) {
      this.searchKeyword = name;
    },
    onPopularClick(name) {
      this.saveSearchHistory(name);
      this.searchKeyword = name;
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
          : { type: "hall", gid: v, isDemo: 0, from: "game", typeCate: 1 };
        this.$launchGame(jumpPayload);
      } else {
        this.showPopup = true;
      }
    },
  },
};
</script>

<style lang="less" scoped>
.search-game-page {
  min-height: 100vh;
  padding-top: 55px;
  background: #1f1c17;
}
.search-game-content {
  padding: 12px 12px 60px;
}
.search-input-wrap {
  margin-bottom: 20px;
}
.search-field {
  background: #2a2418;
  border-radius: 10px;
  border: 1px solid fade(#e9a843, 30%);
  padding: 10px 12px;
  :deep(.van-field__control) {
    color: @wihte-color;
  }
  :deep(.van-field__left-icon) {
    padding-right: 8px;
  }
}
.search-icon {
  opacity: 0.9;
}
.section {
  margin-bottom: 24px;
}
.section-title {
  font-size: 15px;
  color: @wihte-color;
  margin: 0 0 12px;
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .clear-all {
    font-size: 12px;
    color: #a89b7c;
    cursor: pointer;
  }
}
.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.tag {
  background: #15110a;
  border: 1px solid fade(#e9a843, 25%);
  color: @wihte-color;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  position: relative;
  display: inline-flex;
  align-items: center;
  .tag-close {
    margin-left: 6px;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
.game-grid {
  column-count: 3;
  column-gap: 8px;
}
.game-item {
  break-inside: avoid;
  -webkit-column-break-inside: avoid;
  page-break-inside: avoid;
  margin-bottom: 8px;
  width: 100%;
  cursor: pointer;
  position: relative;
}
.game-item__cover {
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
.game-name {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  margin: 0;
  font-size: 10px;
  line-height: 1.2;
  color: @wihte-color;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 4px;
}
.empty-tip {
  padding: 40px 0;
}
</style>
