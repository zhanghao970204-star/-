<template>
  <div class="game-detail-page">
    <van-nav-bar
      :title="$lang.game_detail_title"
      :border="false"
      fixed
      z-index="99999"
      @click-left="onClickLeft"
    >
      <template #left>
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </template>
    </van-nav-bar>

    <div class="game-detail-content">
      <div class="game-info-card">
        <div class="game-info-top">
          <van-image
            :src="gameInfo.gameIcon"
            width="70"
            radius="10"
            class="game-icon"
          >
            <template v-slot:loading>
              <van-loading size="24" color="#ffa300" />
            </template>
          </van-image>
          <div class="game-info-text">
            <div class="game-name-row">
              <span class="game-name">{{ gameInfo.gameName || "–" }}</span>
              <van-icon
                :name="isFav ? 'star' : 'star-o'"
                size="20"
                color="var(--wihte-color)"
                class="fav-icon"
                @click="toggleFavorite"
              />
            </div>
            <p class="game-meta">
              {{ $lang.game_detail_rtp }}: {{ gameInfo.rtp || "97.9%" }}
            </p>
            <p class="game-meta">
              {{ $lang.game_detail_min_bet }}: {{ minBetText }}
            </p>
          </div>
        </div>
        <div class="play-btn-wrap">
          <van-button type="primary " block class="play-btn" @click="onPlay">
            <van-icon name="play-circle-o" size="20" />
            {{ $lang.game_detail_play }}
          </van-button>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">{{ $lang.game_detail_preview }}</h3>
        <div class="preview-scroll">
          <div
            v-for="(img, idx) in previewImages"
            :key="'p-' + idx"
            class="preview-item"
          >
            <img :src="img" width="100%" height="180" />
          </div>
        </div>
      </div>

      <div class="section">
        <h3 class="section-title">{{ $lang.game_detail_recommend }}</h3>
        <div class="recommend-grid">
          <div
            v-for="(game, idx) in recommendList"
            :key="'r-' + idx"
            class="recommend-item"
            @click="goToGameDetail(game)"
          >
            <img :src="game.gameIcon" width="100%" class="recommend-cover" />
          </div>
        </div>
      </div>
    </div>

    <login v-model="showPopup" overlay></login>
  </div>
</template>

<script>
import { GetHomeGameList, GetGameMaterialList } from "@/api/common";
import { collectHomeGames } from "@/utils/homeGameList";
import { mapState, mapActions } from "vuex";

const GAME_DETAIL_STORAGE = "gameDetailPayload";
const LOTTERY_IDS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31, 32,
];

function shuffle(arr, count) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}

export default {
  name: "GameDetail",
  data() {
    return {
      gameInfo: {
        gid: null,
        gameName: "",
        gameIcon: "",
        rtp: "97.9%",
        minBet: "",
        gameCode: "",
      },
      jumpPayload: null,
      recommendList: [],
      previewImages: [],
      showPopup: false,
    };
  },
  computed: {
    ...mapState(["favorites"]),
    minBetText() {
      const currency =
        this.getCurrency === "CEV" ? "CFA" : this.getCurrency || "CFA";
      const val = this.gameInfo.minBet || 15;
      return `${currency} ${val}`;
    },
    isFav() {
      if (!this.gameInfo || !this.gameInfo.gid) return false;
      const list = (this.favorites || []).find(
        (g) => g.currency === this.getCurrency,
      );
      const arr = list ? list.list : [];
      return arr.some((i) => i.gid === this.gameInfo.gid);
    },
  },
  created() {
    this.loadFromStorage();
    this.loadRecommend();
  },
  methods: {
    ...mapActions(["addFavorite", "removeFavorite"]),
    loadFromStorage() {
      try {
        const raw = sessionStorage.getItem(GAME_DETAIL_STORAGE);
        if (!raw) {
          this.$jumpTo("/home", {}, { replace: true });
          return;
        }
        const data = JSON.parse(raw);
        this.gameInfo = {
          gid: data.gid,
          gameName: data.gameName || "",
          gameIcon: data.gameIcon || "",
          rtp: data.rtp || "97.9%",
          minBet: data.minBet != null ? data.minBet : 15,
          gameCode: data.gameCode || "",
        };
        this.jumpPayload =
          data.jumpPayload ||
          (LOTTERY_IDS.includes(data.gid)
            ? {
                type: "lottery",
                lotteryType: data.gameCode,
                lotteryName: data.gameName,
                typeCate: 1,
              }
            : {
                type: "hall",
                gid: data.gid,
                isDemo: 0,
                from: "game",
                typeCate: 1,
                gameTab: this.$route.query.gameTab,
              });
        this.previewImages = [
          this.gameInfo.gameIcon,
          this.gameInfo.gameIcon,
          this.gameInfo.gameIcon,
        ].filter(Boolean);
        if (this.previewImages.length === 0) this.previewImages = [];
        this.loadGameMaterial();
      } catch (e) {
        this.$jumpTo("/home", {}, { replace: true });
      }
    },
    async loadGameMaterial() {
      if (!this.gameInfo || !this.gameInfo.gid) return;
      try {
        const data = await GetGameMaterialList({ gid: this.gameInfo.gid });
        if (data.status === "ok" && data.content) {
          const list = Array.isArray(data.content)
            ? data.content
            : data.content.list || data.content.dataList || [];
          if (list.length > 0) {
            const urls = list
              .slice(0, 3)
              .map((item) =>
                typeof item === "string"
                  ? item
                  : item.url || item.img || item.image,
              );
            this.previewImages = urls.filter(Boolean);
            if (this.previewImages.length === 0) return;
          }
        }
      } catch (_) {
        // 接口失败时保留 loadFromStorage 中设置的默认预览图，无需处理
      }
    },
    async loadRecommend() {
      try {
        const data = await GetHomeGameList();
        if (data.status !== "ok" || !data.content) return;
        const list = collectHomeGames(
          data.content.dataList || [],
          this.getCurrency,
        );
        const excludeGid = this.gameInfo.gid;
        const others = list.filter((g) => g.gid !== excludeGid);
        this.recommendList = shuffle(others, 6);
      } catch (_) {
        this.recommendList = [];
      }
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    toggleFavorite() {
      if (!this.token) {
        this.showPopup = true;
        return;
      }
      const item = this.gameInfo;
      const payload = { currency: this.getCurrency, item };
      if (this.isFav) {
        this.removeFavorite(payload);
      } else {
        this.addFavorite(payload);
      }
    },
    onPlay() {
      if (!this.token) {
        this.showPopup = true;
        return;
      }
      const payload = this.jumpPayload;
      if (!payload) {
        this.$jumpTo("/home", {}, { replace: true });
        return;
      }
      try {
        sessionStorage.removeItem(GAME_DETAIL_STORAGE);
      } catch (_) {
        // ignore storage errors
      }
      if (payload.type === "lottery") {
        this.$jumpTo("/lotteryDetail", {
          lotteryType: payload.lotteryType,
          lotteryName: payload.lotteryName,
          typeCate: payload.typeCate != null ? payload.typeCate : 1,
        });
      } else {
        this.$router.push({
          name: "GameHall",
          params: {
            prefix: localStorage.getItem("country") || "",
            gid: payload.gid,
            isDemo: payload.isDemo != null ? payload.isDemo : 0,
            from: payload.from || "game",
            typeCate: payload.typeCate,
            gameTab: payload.gameTab,
          },
        });
        localStorage.setItem("hallFrome", "game");
        localStorage.setItem("hallGid", String(payload.gid));
      }
    },
    goToGameDetail(game) {
      const isLottery = LOTTERY_IDS.includes(game.gid);
      const jumpPayload = isLottery
        ? {
            type: "lottery",
            lotteryType: game.gameCode,
            lotteryName: game.gameName,
            typeCate: 1,
          }
        : {
            type: "hall",
            gid: game.gid,
            isDemo: 0,
            from: "game",
            typeCate: 1,
            gameTab: this.$route.query.gameTab,
          };
      const payload = {
        gid: game.gid,
        gameName: game.gameName,
        gameIcon: game.gameIcon,
        rtp: game.rtp || "97.9%",
        minBet: game.minBet != null ? game.minBet : 15,
        gameCode: game.gameCode || "",
        jumpPayload,
      };
      sessionStorage.setItem(GAME_DETAIL_STORAGE, JSON.stringify(payload));
      this.loadFromStorage();
      this.loadRecommend();
    },
  },
};
</script>

<style lang="less" scoped>
.game-detail-page {
  min-height: 100vh;
  padding-top: 55px;
  background: #1f1c17;
  padding-bottom: 80px;
}
.game-detail-content {
  padding: 16px 12px 24px;
}
.game-info-card {
  background: #2a2418;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
}
.game-info-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}
.game-icon {
  flex-shrink: 0;
}
.game-info-text {
  flex: 1;
  min-width: 0;
}
.game-name-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}
.game-name {
  font-size: 16px;
  font-weight: 600;
  color: @wihte-color;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.fav-icon {
  flex-shrink: 0;
  margin-left: 8px;
}
.game-meta {
  font-size: 12px;
  color: #a89b7c;
  margin: 4px 0 0;
}
.play-btn-wrap {
  padding-top: 20px;
  width: 100%;
}
.play-btn {
  width: 100%;
  height: 44px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  border: none !important;
  color: #573900 !important;
  font-weight: 600;
  font-size: 16px;
  border-radius: 10px;
}
.section {
  margin-bottom: 24px;
}
.section-title {
  font-size: 15px;
  color: @wihte-color;
  margin: 0 0 12px;
  font-weight: 600;
}
.preview-scroll {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  width: 100%;
}
.preview-item {
  flex: 1;
  min-width: 0;
  border-radius: 8px;
  overflow: hidden;
}
.recommend-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.recommend-item {
  width: 31.5%;
  cursor: pointer;
  border-radius: 10px;
  overflow: hidden;
}
.recommend-cover {
  display: block;
  :deep(.van-image__img) {
    border-radius: 10px;
    height: 150px;
    object-fit: cover;
  }
}
</style>
