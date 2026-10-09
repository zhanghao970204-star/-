<template>
  <div class="rp-page">
    <!-- Header -->
    <header class="rp-header">
      <div class="rp-header__back" @click="goBack">
        <van-icon name="arrow-left" size="20" color="var(--wihte-color)" />
      </div>
      <h1 class="rp-header__title">
        {{ $lang.rp_title || "Red Packet Rain" }}
      </h1>
      <button
        type="button"
        class="rp-header__history"
        @click="showHistory = true"
      >
        <van-icon name="clock-o" size="14" color="#ffd467" />
        <span>{{ $lang.rp_history || "History" }}</span>
      </button>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="rp-loading">
      <van-loading size="36" color="#ffd467" />
    </div>

    <!-- Hero + 倒计时（非雨中可玩态） -->
    <div v-else-if="gameState !== 'active'" class="rp-hero">
      <div class="rp-hero__banner">
        <img
          class="rp-hero__img"
          src="@/assets/img/bonus/redpacket/hero_banner.png"
          alt=""
        />
      </div>
      <!-- 未达标（需充值）不展示倒计时，与 otgame 锁定态一致 -->
      <template v-if="gameState !== 'not_qualified'">
        <div v-if="showHeroCountdown" class="rp-hero__timer">
          <img
            class="rp-hero__timer-bg"
            src="@/assets/img/bonus/redpacket/timer_frame.png"
            alt=""
          />
          <div class="rp-hero__timer-inner">
            <span class="rp-hero__timer-label">{{
              $lang.rp_countdown || "NEXT ROUND IN"
            }}</span>
            <span class="rp-hero__timer-time">{{ displayCountdown }}</span>
          </div>
        </div>
        <p v-if="rpData && rpData.nextStartTime" class="rp-hero__next">
          {{ $lang.rp_next_round || "NEXT ROUND" }}:
          {{ rpData.nextStartTime }}
        </p>
      </template>

      <div
        v-if="gameState === 'not_qualified'"
        class="rp-state rp-state--overlay"
      >
        <h2 class="rp-state__title">
          {{ $lang.rp_not_qualified || "Complete a Deposit to Unlock" }}
        </h2>
        <p class="rp-state__desc">
          {{
            $lang.rp_not_qualified_desc ||
            "Make a deposit in the last 3 days to participate"
          }}
        </p>
        <button type="button" class="rp-btn btn-3d-green" @click="goDeposit">
          {{ $lang.rp_go_deposit || "Go Deposit" }}
        </button>
      </div>

      <div
        v-else-if="gameState === 'claimed'"
        class="rp-state rp-state--overlay"
      >
        <h2 class="rp-state__title rp-state__title--green">
          {{ $lang.rp_claimed || "Claimed This Round" }}
        </h2>
        <div class="rp-reward-card">
          <span class="rp-reward-card__label">{{
            $lang.rp_your_reward || "Your Reward"
          }}</span>
          <span class="rp-reward-card__amount"
            >{{ getCurrency }}{{ awardAmount }}</span
          >
        </div>
      </div>

      <div
        v-else-if="gameState === 'not_open' || gameState === 'ended'"
        class="rp-state rp-state--overlay"
      >
        <h2 class="rp-state__title">
          {{
            gameState === "ended"
              ? $lang.rp_round_ended || "Round Ended"
              : $lang.rp_not_open || "Activity Not Yet Open"
          }}
        </h2>
        <p class="rp-state__desc">
          {{ $lang.rp_not_open_desc || "Please check back later" }}
        </p>
      </div>
    </div>

    <!-- Rain Active Game -->
    <div v-else-if="gameState === 'active'" class="rp-game">
      <h2 class="rp-game__title">
        {{ $lang.rp_round_active || "Tap to Grab!" }}
      </h2>

      <!-- Stats bar -->
      <div class="rp-game__stats">
        <div class="rp-game__stat">
          <span class="rp-game__stat-label">{{
            $lang.rp_clicks || "Clicks"
          }}</span>
          <span class="rp-game__stat-value"
            >{{ clickedTimes }} / {{ maxClickTimes }}</span
          >
        </div>
        <div class="rp-game__stat">
          <span class="rp-game__stat-label">{{
            $lang.rp_total_award || "Total Award"
          }}</span>
          <span class="rp-game__stat-value rp-game__stat-value--gold"
            >{{ getCurrency }}{{ awardAmount }}</span
          >
        </div>
      </div>

      <!-- Progress bar -->
      <div class="rp-game__progress">
        <div class="rp-game__progress-track">
          <div
            class="rp-game__progress-fill"
            :style="{ width: clickProgress + '%' }"
          ></div>
        </div>
      </div>

      <!-- Rain area -->
      <div class="rp-rain" ref="rainArea">
        <div
          v-for="pkt in packets"
          :key="pkt.id"
          class="rp-rain__packet"
          :class="{ 'rp-rain__packet--popped': pkt.popped }"
          :style="pkt.style"
          @click="grabPacket(pkt)"
        >
          <img :src="packetImg" class="rp-rain__img" />
        </div>
        <!-- Floating reward numbers -->
        <div
          v-for="rw in rewards"
          :key="rw.id"
          class="rp-rain__reward"
          :style="{ left: rw.x + 'px', top: rw.y + 'px' }"
        >
          +{{ getCurrency }}{{ rw.amount }}
        </div>
      </div>
    </div>

    <!-- Round Info Card -->
    <div v-if="!loading && rpData" class="rp-info-card">
      <div
        class="rp-info-card__row"
        v-if="rpData.beginDate || rpData.endDate || rpData.startTime"
      >
        <span class="rp-info-card__label">{{
          $lang.rp_round_time || "Round Time"
        }}</span>
        <span class="rp-info-card__value rp-info-card__value--green"
          >{{ formatDateTime(rpData.beginDate || rpData.startTime) }} ~
          {{ formatDateTime(rpData.endDate || rpData.endTime) }}</span
        >
      </div>
      <div class="rp-info-card__row" v-if="rpData.count !== undefined">
        <span class="rp-info-card__label">{{
          $lang.rp_packets_left || "Packets Left"
        }}</span>
        <span class="rp-info-card__value rp-info-card__value--gold">{{
          rpData.count
        }}</span>
      </div>
      <div
        class="rp-info-card__row"
        v-if="gameState === 'active' && timeLeft >= 0"
      >
        <span class="rp-info-card__label">{{
          $lang.rp_countdown || "Countdown"
        }}</span>
        <span class="rp-info-card__value rp-info-card__value--gold">{{
          formatTime(roundTimeLeft)
        }}</span>
      </div>
    </div>

    <!-- Rules -->
    <div v-if="!loading" class="rp-rules">
      <h3 class="rp-rules__title">
        {{ $lang.rp_rules_title || "HOW TO PLAY" }}
      </h3>
      <div class="rp-rules__list">
        <div class="rp-rules__item">
          <span class="rp-rules__num">1</span>
          <span>{{
            $lang.rp_rule_1 ||
            "Become a Bison Fun member to enjoy two Red Packet Rain events every day."
          }}</span>
        </div>
        <div class="rp-rules__item">
          <span class="rp-rules__num">2</span>
          <span
            v-html="
              $lang.rp_rule_2 ||
              'Event Times (EST): 1:00-1:59 PM and <em>7:00-8:00 PM</em>'
            "
          ></span>
        </div>
        <div class="rp-rules__item">
          <span class="rp-rules__num">3</span>
          <span>{{
            $lang.rp_rule_3 ||
            "Simply click once to successfully claim your Red Packet."
          }}</span>
        </div>
      </div>
    </div>

    <!-- History：通用弹窗壳 -->
    <van-popup
      v-model:show="showHistory"
      position="center"
      round
      class="rp-confirm"
      :close-on-click-overlay="true"
      @open="fetchHistory"
    >
      <div class="rp-confirm__head">
        {{ $lang.rp_history || "HISTORY" }}
        <button
          type="button"
          class="rp-confirm__x"
          @click="showHistory = false"
        >
          <svg viewBox="0 0 18 18" width="18" height="18" aria-hidden="true">
            <path
              d="M3.2 3.2l11.6 11.6M14.8 3.2L3.2 14.8"
              fill="none"
              stroke="#fff"
              stroke-width="2.6"
              stroke-linecap="round"
            />
          </svg>
        </button>
      </div>
      <div class="rp-confirm__body">
        <div
          v-if="historyLoading && historyList.length === 0"
          class="rp-history__empty"
        >
          <van-loading size="36" color="#ffd467" />
        </div>
        <div v-else-if="historyList.length === 0" class="rp-history__empty">
          <van-icon name="orders-o" size="48" color="#b8a8d4" />
          <p>{{ $lang.rp_no_history || "No records yet" }}</p>
        </div>
        <div v-else class="rp-history__list">
          <div
            v-for="(item, idx) in historyList"
            :key="idx"
            class="rp-history__item"
          >
            <div class="rp-history__left">
              <img
                src="@/assets/img/bonus/redpacket/hero_envelopes.png"
                width="36"
                alt=""
              />
            </div>
            <div class="rp-history__mid">
              <span class="rp-history__round">{{
                $lang.rp_title || "Red Packet Rain"
              }}</span>
              <span class="rp-history__time">{{ item.receiveTime }}</span>
              <span class="rp-history__order">{{ item.recordNo }}</span>
            </div>
            <div class="rp-history__right">
              <span class="rp-history__amount"
                >{{ getCurrency }} +{{
                  $formatNumberWithCommas(item.awardAmount)
                }}</span
              >
            </div>
          </div>
          <div
            v-if="!historyFinished"
            class="rp-history__more"
            @click="loadMoreHistory"
          >
            <span v-if="historyLoading">{{
              $lang.common_loading || "Loading..."
            }}</span>
            <span v-else>{{ $lang.rp_load_more || "Load More" }}</span>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { RedPacket, GetRedPacket, RedPacketReceiveRecord } from "@/api/common";
import { reportPromoPanel } from "@/utils/common";

export default {
  name: "RedPacket",
  data() {
    return {
      loading: true,
      gameState: "countdown", // not_qualified, countdown, active, claimed, ended
      rpData: null,
      timeLeft: 0,
      nextTimeLeft: 0,
      clickedTimes: 0,
      leftClicks: 0,
      maxClickTimes: 10,
      awardAmount: 0,
      roundKey: "",
      giftUrl: "",
      packets: [],
      rewards: [],
      showHistory: false,
      historyList: [],
      historyLoading: false,
      historyPage: 1,
      historyFinished: false,
      countdownTimer: null,
      rainTimer: null,
      packetIdCounter: 0,
      rewardIdCounter: 0,
      grabbing: false,
      roundTimeLeft: 0,
      roundTimer: null,
    };
  },
  computed: {
    countdownH() {
      return String(Math.floor(this.timeLeft / 3600)).padStart(2, "0");
    },
    countdownM() {
      return String(Math.floor((this.timeLeft % 3600) / 60)).padStart(2, "0");
    },
    countdownS() {
      return String(this.timeLeft % 60).padStart(2, "0");
    },
    /** 倒计时秒数：等下一场用 timeLeft；已领/结束后用 nextTimeLeft */
    displayCountdownSec() {
      if (this.gameState === "countdown") return Math.max(0, this.timeLeft | 0);
      if (this.nextTimeLeft > 0) return Math.max(0, this.nextTimeLeft | 0);
      return 0;
    },
    displayCountdown() {
      return this.formatTime(this.displayCountdownSec);
    },
    /** 有剩余秒数才展示灯箱倒计时（未达标不展示，见模板） */
    showHeroCountdown() {
      return this.displayCountdownSec > 0;
    },
    clickProgress() {
      if (!this.maxClickTimes) return 0;
      return (this.clickedTimes / this.maxClickTimes) * 100;
    },
    packetImg() {
      return (
        this.giftUrl || require("../../../assets/img/bonus/red_packet.png")
      );
    },
  },
  mounted() {
    if (!this.token) {
      this.$bus.emit("openLogin");
      return;
    }
    reportPromoPanel("red_packet", 1);
    this.initRedPacket();
  },
  beforeUnmount() {
    reportPromoPanel("red_packet", 2);
    this.clearTimers();
  },
  methods: {
    async initRedPacket() {
      this.loading = true;
      try {
        const res = await RedPacket({});
        if (res && res.status === "ok" && res.content) {
          const c = res.content;
          this.rpData = c;
          this.roundKey = c.roundKey || "";
          this.timeLeft = c.timeLeft || 0;
          this.nextTimeLeft = c.nextTimeLeft || 0;
          this.clickedTimes = parseInt(c.clickedTimes) || 0;
          this.leftClicks = parseInt(c.leftClicks) || 0;
          this.maxClickTimes = parseInt(c.maxClickTimes) || 10;
          this.awardAmount = c.awardAmount || 0;
          this.giftUrl = c.giftUrl || "";

          // 状态判定（依据后端 rechargeSatisfied）：
          // ① !rechargeSatisfied           → 引导充值
          // ② receiveStatus===2            → 已领取本轮
          // ③ receiveStatus===1 && timeLeft===0 → 可参与
          // ④a timeLeft>0                  → 下一轮倒计时
          // ④b 其他（含 receiveStatus===3）→ 活动/场次未开
          if (!c.rechargeSatisfied) {
            this.gameState = "not_qualified";
          } else if (c.receiveStatus === 2) {
            this.gameState = "claimed";
            this.startNextCountdown();
          } else if (c.receiveStatus === 1 && c.timeLeft === 0) {
            this.gameState = "active";
            this.calcRoundTimeLeft();
            this.startRoundTimer();
            this.startRain();
          } else if (c.timeLeft > 0) {
            this.gameState = "countdown";
            this.startCountdown();
          } else {
            this.gameState = "not_open";
          }
        } else if (res && res.status === "need_login") {
          this.$bus.emit("openLogin");
        }
      } catch (e) {
        console.error("RedPacket init error", e);
      } finally {
        this.loading = false;
      }
    },

    clearTimers() {
      if (this.countdownTimer) {
        clearInterval(this.countdownTimer);
        this.countdownTimer = null;
      }
      if (this.rainTimer) {
        clearInterval(this.rainTimer);
        this.rainTimer = null;
      }
      if (this.roundTimer) {
        clearInterval(this.roundTimer);
        this.roundTimer = null;
      }
    },

    startCountdown() {
      this.clearTimers();
      this.countdownTimer = setInterval(() => {
        if (this.timeLeft > 0) {
          this.timeLeft--;
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          // Re-fetch to check if round is now active
          this.initRedPacket();
        }
      }, 1000);
    },

    startNextCountdown() {
      if (this.nextTimeLeft <= 0) return;
      this.clearTimers();
      this.countdownTimer = setInterval(() => {
        if (this.nextTimeLeft > 0) {
          this.nextTimeLeft--;
        } else {
          clearInterval(this.countdownTimer);
          this.countdownTimer = null;
          this.initRedPacket();
        }
      }, 1000);
    },

    // Rain game logic
    startRain() {
      this.packets = [];
      this.rewards = [];
      // Spawn packets periodically
      this.spawnBatch();
      this.rainTimer = setInterval(() => {
        this.spawnBatch();
        // Clean up old packets
        this.packets = this.packets.filter((p) => !p.expired && !p.popped);
      }, 2000);
    },

    spawnBatch() {
      const count = 4 + Math.floor(Math.random() * 4); // 4-7 packets
      for (let i = 0; i < count; i++) {
        this.packetIdCounter++;
        const left = 5 + Math.random() * 80; // 5% - 85%
        const delay = Math.random() * 1.5;
        const duration = 3 + Math.random() * 2; // 3-5s fall time
        const size = 36 + Math.random() * 20; // 36-56px
        const pkt = {
          id: this.packetIdCounter,
          popped: false,
          expired: false,
          style: {
            left: left + "%",
            animationDelay: delay + "s",
            animationDuration: duration + "s",
            width: size + "px",
            height: size + "px",
          },
        };
        this.packets.push(pkt);
        // Auto-expire after animation
        setTimeout(
          () => {
            pkt.expired = true;
          },
          (delay + duration) * 1000 + 500,
        );
      }
    },

    async grabPacket(pkt) {
      if (pkt.popped || this.grabbing) return;
      if (this.clickedTimes >= this.maxClickTimes) return;

      pkt.popped = true;
      this.clickedTimes++;

      // Show floating animation for this click
      this.rewardIdCounter++;
      const curId = this.rewardIdCounter;
      const rainArea = this.$refs.rainArea;
      const rect = rainArea
        ? rainArea.getBoundingClientRect()
        : { width: 300, height: 400 };
      this.rewards.push({
        id: curId,
        amount: "?",
        x: (parseFloat(pkt.style.left) / 100) * rect.width,
        y: rect.height * 0.4,
      });
      setTimeout(() => {
        this.rewards = this.rewards.filter((r) => r.id !== curId);
      }, 1500);

      // When all clicks used, call collect API once
      if (this.clickedTimes >= this.maxClickTimes) {
        this.grabbing = true;
        try {
          const res = await GetRedPacket({ roundKey: this.roundKey });
          if (res && res.status === "ok" && res.content) {
            const c = res.content;
            this.awardAmount = c.awardAmount || 0;
            if (c.receiveStatus === 3) {
              this.gameState = "ended";
            } else {
              this.gameState = "claimed";
            }
            this.clearTimers();
            this.nextTimeLeft = c.nextTimeLeft || 0;
            this.startNextCountdown();
          } else {
            // 本场已被领完或其它错误：提示并切到 ended 状态
            this.$toast({
              message:
                (res && res.msg) ||
                this.$lang.rp_round_ended_msg ||
                "Red packets are all grabbed",
              icon: "cross",
            });
            this.awardAmount = 0;
            this.gameState = "ended";
            this.clearTimers();
            this.Init();
          }
        } catch (e) {
          console.error("grabPacket collect error", e);
          this.$toast({
            message:
              this.$lang.rp_round_ended_msg || "Red packets are all grabbed",
            icon: "cross",
          });
          this.gameState = "ended";
          this.clearTimers();
        } finally {
          this.grabbing = false;
        }
      }
    },

    formatTime(seconds) {
      const h = String(Math.floor(seconds / 3600)).padStart(2, "0");
      const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
      const s = String(seconds % 60).padStart(2, "0");
      return h + ":" + m + ":" + s;
    },

    // Format API time strings or timestamps to readable HH:MM.
    // beginDate/endDate 已是平台本地墙钟，禁止用浏览器时区 new Date().getHours()。
    formatDateTime(val) {
      if (!val && val !== 0) return "";
      if (typeof val === "string") {
        const clock = val.match(/(\d{1,2}):(\d{2})/);
        if (clock) {
          return String(clock[1]).padStart(2, "0") + ":" + clock[2];
        }
      }
      const ts = typeof val === "number" ? val : Number(val);
      if (!Number.isFinite(ts) || ts <= 0) return String(val);
      try {
        const parts = new Intl.DateTimeFormat("en-US", {
          timeZone: "America/New_York",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).formatToParts(new Date(ts));
        const hour = (parts.find((p) => p.type === "hour") || {}).value || "00";
        const minute =
          (parts.find((p) => p.type === "minute") || {}).value || "00";
        return hour.padStart(2, "0") + ":" + minute.padStart(2, "0");
      } catch (e) {
        return String(val);
      }
    },

    // Format roundKey like "202603191500" → "2026-03-19 15:00"
    formatRoundKey(key) {
      if (!key || key.length < 12) return key;
      const str = String(key);
      const month = str.slice(4, 6);
      const day = str.slice(6, 8);
      const hour = str.slice(8, 10);
      const min = str.slice(10, 12);
      return month + "-" + day + " " + hour + ":" + min;
    },

    // Calculate remaining seconds in active round from endTime
    calcRoundTimeLeft() {
      if (this.rpData && this.rpData.endTime) {
        const end = new Date(this.rpData.endTime).getTime();
        const now = Date.now();
        const diff = Math.floor((end - now) / 1000);
        this.roundTimeLeft = diff > 0 ? diff : 0;
      }
    },

    startRoundTimer() {
      if (this.roundTimer) clearInterval(this.roundTimer);
      this.roundTimer = setInterval(() => {
        if (this.roundTimeLeft > 0) {
          this.roundTimeLeft--;
        } else {
          clearInterval(this.roundTimer);
          this.roundTimer = null;
          // Round ended, re-fetch
          this.initRedPacket();
        }
      }, 1000);
    },

    goBack() {
      this.$router.go(-1);
    },

    goDeposit() {
      this.$jumpTo("/rechargeCont");
    },
    async fetchHistory() {
      this.historyPage = 0;
      this.historyFinished = false;
      this.historyList = [];
      this.historyLoading = true;
      try {
        const res = await RedPacketReceiveRecord({
          pageIndex: 0,
          pageSize: 20,
        });
        if (res && res.status === "ok" && res.content) {
          this.historyList = res.content.list || [];
          if (this.historyList.length < 20) {
            this.historyFinished = true;
          }
        }
      } catch (e) {
        console.error("fetchHistory error", e);
      } finally {
        this.historyLoading = false;
      }
    },
    async loadMoreHistory() {
      if (this.historyLoading || this.historyFinished) return;
      this.historyLoading = true;
      this.historyPage++;
      try {
        const res = await RedPacketReceiveRecord({
          pageIndex: this.historyPage,
          pageSize: 20,
        });
        if (res && res.status === "ok" && res.content) {
          const list = res.content.list || [];
          this.historyList = this.historyList.concat(list);
          if (list.length < 20) {
            this.historyFinished = true;
          }
        }
      } catch (e) {
        console.error("loadMoreHistory error", e);
      } finally {
        this.historyLoading = false;
      }
    },
  },
};
</script>

<style lang="less" scoped>
@rp-bg: #0e0616;
@rp-card: #1a0a28;
@rp-red: #ff4d4f;
@rp-gold: #ffd467;
@rp-green: #22c55e;
@rp-border: rgba(255, 162, 0, 0.45);
@frame: #430063;

.rp-page {
  min-height: 100vh;
  background: @rp-bg url("@/assets/img/common/page_bg.png") center top / 100%
    auto repeat-y;
  padding-bottom: 40px;
  box-sizing: border-box;
}

// ====== HEADER ======
.rp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: fade(@rp-bg, 96%);
  backdrop-filter: blur(10px);

  &__back {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__title {
    font-size: 15px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.6px;
  }

  &__history {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 28px;
    padding: 0 10px;
    border-radius: 999px;
    border: 1px solid @rp-gold;
    background: fade(@frame, 75%);
    color: @rp-gold;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }
}

// ====== HERO ======
.rp-hero {
  padding: 4px 12px 0;
  box-sizing: border-box;

  &__banner {
    position: relative;
    width: 100%;
    border-radius: 14px;
    overflow: visible;
  }

  &__img {
    display: block;
    width: 100%;
    height: auto;
    border-radius: 14px;
  }

  &__timer {
    position: relative;
    width: 78%;
    max-width: 300px;
    margin: -8px auto 0;
    z-index: 2;
  }

  &__timer-bg {
    display: block;
    width: 100%;
    height: auto;
  }

  &__timer-inner {
    position: absolute;
    inset: 0;
    box-sizing: border-box;
  }

  /* 标签落在灯箱顶部凸台，时间落在下方主框 */
  &__timer-label {
    position: absolute;
    left: 50%;
    top: 22%;
    transform: translateX(-50%);
    width: 48%;
    text-align: center;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.6px;
    color: #fff;
    text-transform: uppercase;
    white-space: nowrap;
    line-height: 1;
  }

  &__timer-time {
    position: absolute;
    left: 50%;
    top: 62%;
    transform: translate(-50%, -50%);
    font-size: 30px;
    font-weight: 900;
    color: #fff;
    font-variant-numeric: tabular-nums;
    letter-spacing: 1.5px;
    line-height: 1;
    text-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
  }

  &__next {
    margin: 10px 0 6px;
    text-align: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
}

// ====== LOADING ======
.rp-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 56px);
  width: 100%;

  // 覆盖全局 .van-loading { width:100%; padding-top:45% } 导致偏左
  :deep(.van-loading) {
    width: auto !important;
    height: auto !important;
    padding: 0 !important;
    background: transparent !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
}

// ====== STATE OVERLAY ======
.rp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 16px 8px;
  text-align: center;

  &--overlay {
    margin-top: 4px;
  }

  &__title {
    font-size: 16px;
    font-weight: 800;
    color: #fff;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.4px;

    &--green {
      color: @rp-green;
    }
  }

  &__desc {
    font-size: 12px;
    color: #b8a8d4;
    line-height: 1.45;
    max-width: 300px;
    margin-bottom: 12px;
  }
}

.rp-btn {
  width: 70%;
  max-width: 240px;
  border: none;
  cursor: pointer;
}

// ====== GAME SCREEN ======
.rp-game {
  padding: 16px;

  &__title {
    text-align: center;
    font-size: 20px;
    font-weight: 900;
    color: @rp-gold;
    text-transform: uppercase;
    letter-spacing: 2px;
    animation: rp-pulse 1.5s ease-in-out infinite;
    margin-bottom: 12px;
  }

  &__stats {
    display: flex;
    justify-content: space-between;
    background: @rp-card;
    border-radius: 10px;
    padding: 12px 16px;
    border: 1px solid @rp-border;
    margin-bottom: 8px;
  }

  &__stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;

    &-label {
      font-size: 10px;
      color: #b8a8d4;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
    }

    &-value {
      font-size: 16px;
      font-weight: 800;
      color: @wihte-color;

      &--gold {
        color: @rp-gold;
      }
    }
  }

  &__progress {
    margin-bottom: 16px;

    &-track {
      width: 100%;
      height: 6px;
      background: @rp-card;
      border-radius: 999px;
      overflow: hidden;
    }

    &-fill {
      height: 100%;
      background: linear-gradient(to right, @rp-red, @rp-gold);
      border-radius: 999px;
      transition: width 0.3s ease;
    }
  }
}

// ====== RAIN AREA ======
.rp-rain {
  position: relative;
  width: 100%;
  height: 50vh;
  overflow: hidden;
  background: radial-gradient(
    ellipse at 50% 0%,
    fade(@rp-red, 8%) 0%,
    transparent 70%
  );
  border-radius: 16px;
  border: 1px solid fade(@rp-red, 15%);

  &__packet {
    position: absolute;
    top: -60px;
    cursor: pointer;
    animation: rp-fall linear forwards;
    z-index: 2;

    &--popped {
      animation: rp-pop 0.3s ease-out forwards !important;
    }
  }

  &__img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: drop-shadow(0 4px 8px rgba(255, 77, 79, 0.3));
    pointer-events: none;
  }

  &__reward {
    position: absolute;
    z-index: 10;
    font-size: 18px;
    font-weight: 900;
    color: @rp-gold;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
    animation: rp-reward-float 1.5s ease-out forwards;
    pointer-events: none;
    white-space: nowrap;
  }
}

// ====== REWARD CARD ======
.rp-reward-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  background: @rp-card;
  border: 1px solid fade(@rp-gold, 25%);
  border-radius: 16px;
  padding: 20px 40px;
  margin-top: 16px;

  &__label {
    font-size: 11px;
    color: #b8a8d4;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
  }

  &__amount {
    font-size: 36px;
    font-weight: 900;
    color: @rp-gold;
    text-shadow: 0 0 16px fade(@rp-gold, 30%);
  }
}

// ====== NEXT ROUND ======
.rp-next-round {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  margin-top: 24px;

  &__label {
    font-size: 11px;
    color: #b8a8d4;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-weight: 700;
  }

  &__time {
    font-size: 20px;
    font-weight: 900;
    color: @rp-red;
    font-variant-numeric: tabular-nums;
  }
}

// ====== INFO CARD（第二处：紫渐变背景块） ======
.rp-info-card {
  margin: 8px 12px;
  padding: 10px 12px 12px;
  border-radius: 16px;
  background: linear-gradient(180deg, #c24af0 0%, #9a2fd0 40%, #7a2190 100%);
  box-sizing: border-box;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.28);
  overflow: hidden;

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-height: 40px;
    padding: 8px 12px;
    border-radius: 10px;
    box-sizing: border-box;

    /* 去掉发黑透明层，首行用正常紫条区分 */
    &:first-child {
      background: url("@/assets/img/bonus/redpacket/info_bar.png") center / 100%
        100% no-repeat;
    }

    & + & {
      margin-top: 6px;
    }
  }

  &__label {
    font-size: 13px;
    color: #fff;
    font-weight: 700;
  }

  &__value {
    font-size: 13px;
    color: #fff;
    font-weight: 800;

    &--green {
      color: #39ff88;
    }

    &--gold {
      color: #ffe14a;
    }
  }
}

// ====== RULES（第三处：#411C59 背景块） ======
.rp-rules {
  margin: 0 12px 16px;
  background: #411c59;
  border-radius: 16px;
  padding: 14px 14px 12px;
  box-sizing: border-box;

  &__title {
    font-size: 14px;
    font-weight: 800;
    color: #fff;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin: 0 0 12px;
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    font-size: 12px;
    color: #e7deff;
    line-height: 1.45;
    background: transparent;

    :deep(em) {
      font-style: normal;
      color: #ffe14a;
      font-weight: 800;
    }
  }

  &__num {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin: 0;
    padding: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: #2a0a45;
    color: #fff;
    font-size: 11px;
    font-weight: 800;
    line-height: 1;
    box-sizing: border-box;
    /* 避免外层再叠一层方/圆底 */
    box-shadow: none;
    outline: none;
  }
}

// ====== 通用弹窗壳（History） ======
.rp-confirm {
  width: 88% !important;
  max-width: 360px;
  max-height: 72vh;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  overflow: hidden;
  border-radius: 18px !important;

  &__head {
    position: relative;
    background: @frame;
    color: #fff;
    text-align: center;
    font-size: 16px;
    font-weight: 800;
    padding: 14px 40px;
    text-transform: uppercase;
  }

  &__x {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    width: 28px;
    height: 28px;
    padding: 0;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__body {
    padding: 12px 12px 16px;
    max-height: calc(72vh - 52px);
    overflow-y: auto;
    background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  }
}

// ====== HISTORY LIST ======
.rp-history {
  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 36px 0;
    min-height: 180px;

    :deep(.van-loading) {
      width: auto !important;
      height: auto !important;
      padding: 0 !important;
      background: transparent !important;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }

    p {
      font-size: 13px;
      color: #b8a8d4;
    }
  }

  &__list {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__item {
    display: flex;
    align-items: center;
    gap: 10px;
    background: #3f1d5d;
    border-radius: 12px;
    padding: 10px 12px;
  }

  &__left {
    flex-shrink: 0;
  }

  &__mid {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__right {
    flex-shrink: 0;
    text-align: right;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__amount {
    font-size: 15px;
    font-weight: 800;
    color: @rp-gold;
  }

  &__status {
    font-size: 10px;
    color: #b8a8d4;
  }

  &__more {
    text-align: center;
    padding: 12px;
    color: @rp-gold;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
  }

  &__round {
    color: #fff;
    font-weight: 800;
    font-size: 13px;
  }

  &__time {
    color: #c4b5e0;
    font-size: 11px;
  }

  &__order {
    color: #c4b5e0;
    font-size: 10px;
    word-break: break-all;
  }
}

// ====== ANIMATIONS ======
@keyframes rp-fall {
  0% {
    transform: translateY(-60px) rotate(0deg);
    opacity: 1;
  }
  85% {
    opacity: 1;
  }
  100% {
    transform: translateY(55vh) rotate(15deg);
    opacity: 0;
  }
}

@keyframes rp-pop {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.8;
  }
  100% {
    transform: scale(0);
    opacity: 0;
  }
}

@keyframes rp-reward-float {
  0% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translateY(-80px) scale(1.3);
    opacity: 0;
  }
}

@keyframes rp-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}
</style>
