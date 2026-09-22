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
      <div class="rp-header__right" @click="showHistory = true">
        <van-icon name="clock-o" size="14" color="#ff4d4f" />
        <span>{{ $lang.rp_history || "History" }}</span>
      </div>
    </header>

    <!-- Loading -->
    <div v-if="loading" class="rp-loading">
      <van-loading size="36" color="#ff4d4f" />
    </div>

    <div
      v-else-if="gameState === 'not_qualified'"
      class="rp-state rp-state--locked"
    >
      <div class="rp-state__icon-wrap">
        <img
          src="../../../assets/img/bonus/red_packet.png"
          class="rp-state__icon rp-state__icon--locked"
        />
        <van-icon
          name="lock"
          size="28"
          color="#ff4d4f"
          class="rp-state__lock"
        />
      </div>
      <h2 class="rp-state__title">
        {{ $lang.rp_not_qualified || "Complete a Deposit to Unlock" }}
      </h2>
      <p class="rp-state__desc">
        {{
          $lang.rp_not_qualified_desc ||
          "Make a deposit in the last 3 days to participate"
        }}
      </p>
      <button class="rp-btn rp-btn--deposit" @click="goDeposit">
        {{ $lang.rp_go_deposit || "Go Deposit" }}
      </button>
    </div>

    <div v-else-if="gameState === 'not_open'" class="rp-state rp-state--locked">
      <img
        src="../../../assets/img/bonus/red_packet.png"
        class="rp-state__icon rp-state__icon--grey"
      />
      <h2 class="rp-state__title">
        {{ $lang.rp_not_open || "Activity Not Yet Open" }}
      </h2>
      <p class="rp-state__desc">
        {{ $lang.rp_not_open_desc || "Please check back later" }}
      </p>
    </div>

    <!-- Countdown (timeLeft > 0) -->
    <div
      v-else-if="gameState === 'countdown'"
      class="rp-state rp-state--countdown"
    >
      <img
        src="../../../assets/img/bonus/red_packet.png"
        class="rp-state__icon rp-state__icon--pulse"
      />
      <h2 class="rp-state__title">
        {{ $lang.rp_countdown || "Next Round In" }}
      </h2>
      <div class="rp-countdown">
        <div class="rp-countdown__block">
          <span class="rp-countdown__num">{{ countdownH }}</span>
          <span class="rp-countdown__label">{{ $lang.rp_hour || "H" }}</span>
        </div>
        <span class="rp-countdown__sep">:</span>
        <div class="rp-countdown__block">
          <span class="rp-countdown__num">{{ countdownM }}</span>
          <span class="rp-countdown__label">{{ $lang.rp_min || "M" }}</span>
        </div>
        <span class="rp-countdown__sep">:</span>
        <div class="rp-countdown__block">
          <span class="rp-countdown__num">{{ countdownS }}</span>
          <span class="rp-countdown__label">{{ $lang.rp_sec || "S" }}</span>
        </div>
      </div>
      <p v-if="rpData.nextStartTime" class="rp-state__sub">
        {{ $lang.rp_next_round || "Next Round" }}: {{ rpData.nextStartTime }}
      </p>
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

    <!-- Already Claimed (receiveStatus=2) -->
    <div v-else-if="gameState === 'claimed'" class="rp-state rp-state--claimed">
      <img
        src="../../../assets/img/bonus/red_packet.png"
        class="rp-state__icon"
      />
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
      <div v-if="nextTimeLeft > 0" class="rp-next-round">
        <p class="rp-next-round__label">
          {{ $lang.rp_next_round || "Next Round" }}
        </p>
        <span class="rp-next-round__time">{{ formatTime(nextTimeLeft) }}</span>
      </div>
    </div>

    <!-- Round Ended (receiveStatus=3) -->
    <div v-else-if="gameState === 'ended'" class="rp-state rp-state--ended">
      <img
        src="../../../assets/img/bonus/red_packet.png"
        class="rp-state__icon rp-state__icon--grey"
      />
      <h2 class="rp-state__title">
        {{ $lang.rp_round_ended || "Round Ended" }}
      </h2>
      <div v-if="nextTimeLeft > 0" class="rp-next-round">
        <p class="rp-next-round__label">
          {{ $lang.rp_next_round || "Next Round" }}
        </p>
        <span class="rp-next-round__time">{{ formatTime(nextTimeLeft) }}</span>
      </div>
    </div>

    <!-- Round Info Card (visible when not loading) -->
    <div v-if="!loading && rpData" class="rp-info-card">
      <div class="rp-info-card__row" v-if="rpData.startTime">
        <span class="rp-info-card__label">{{
          $lang.rp_round_time || "Round Time"
        }}</span>
        <span class="rp-info-card__value"
          >{{ formatDateTime(rpData.startTime) }} ~
          {{ formatDateTime(rpData.endTime) }}</span
        >
      </div>
      <div class="rp-info-card__row" v-if="rpData.count !== undefined">
        <span class="rp-info-card__label">{{
          $lang.rp_packets_left || "Packets Left"
        }}</span>
        <span class="rp-info-card__value">{{ rpData.count }}</span>
      </div>
      <div
        class="rp-info-card__row"
        v-if="gameState === 'active' && timeLeft >= 0"
      >
        <span class="rp-info-card__label">{{
          $lang.rp_countdown || "Countdown"
        }}</span>
        <span class="rp-info-card__value rp-info-card__value--red">{{
          formatTime(roundTimeLeft)
        }}</span>
      </div>
    </div>

    <!-- Rules Section -->
    <div v-if="!loading" class="rp-rules">
      <h3 class="rp-rules__title">
        {{ $lang.rp_rules_title || "How to Play" }}
      </h3>
      <div class="rp-rules__list">
        <div class="rp-rules__item">
          <span class="rp-rules__num">1</span>
          <span>{{
            $lang.rp_rule_1 || "Deposit within the last 3 days to qualify"
          }}</span>
        </div>
        <div class="rp-rules__item">
          <span class="rp-rules__num">2</span>
          <span>{{
            $lang.rp_rule_2 || "Tap falling red packets to grab rewards"
          }}</span>
        </div>
        <div class="rp-rules__item">
          <span class="rp-rules__num">3</span>
          <span>{{ $lang.rp_rule_3 || "Each round has limited clicks" }}</span>
        </div>
      </div>
    </div>

    <!-- History Popup -->
    <van-popup
      v-model:show="showHistory"
      round
      position="bottom"
      style="height: 60%; background: #1f1c17"
      @open="fetchHistory"
    >
      <div class="rp-history">
        <h3 class="rp-history__title">{{ $lang.rp_history || "History" }}</h3>
        <div
          v-if="historyLoading && historyList.length === 0"
          class="rp-history__empty"
        >
          <van-loading size="36" color="#ff4d4f" />
        </div>
        <div v-else-if="historyList.length === 0" class="rp-history__empty">
          <van-icon name="orders-o" size="48" color="#a89b7c" />
          <p>{{ $lang.rp_no_history || "No records yet" }}</p>
        </div>
        <div v-else class="rp-history__list">
          <div
            v-for="(item, idx) in historyList"
            :key="idx"
            class="rp-history__item"
          >
            <div class="rp-history__left">
              <img src="../../../assets/img/bonus/red_packet.png" width="32" />
            </div>
            <div class="rp-history__mid">
              <span class="rp-history__round">{{
                $lang.rp_title || "Red Packet"
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

    // Format API time strings or timestamps to readable HH:MM
    formatDateTime(val) {
      if (!val) return "";
      // If it's already a short time string like "15:00", return as-is
      if (typeof val === "string" && /^\d{1,2}:\d{2}/.test(val)) return val;
      // Try parsing as date
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        return (
          String(d.getHours()).padStart(2, "0") +
          ":" +
          String(d.getMinutes()).padStart(2, "0")
        );
      }
      return String(val);
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
@rp-bg: #1f1c17;
@rp-card: #15110a;
@rp-red: #ff4d4f;
@rp-gold: #ffa300;
@rp-green: #ffa300;
@rp-border: rgba(255, 162, 0, 0.45);

.rp-page {
  min-height: 100vh;
  background: @rp-bg;
  padding-bottom: 80px;
}

// ====== HEADER ======
.rp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  position: sticky;
  top: 0;
  z-index: 50;
  background: fade(@rp-bg, 90%);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid @rp-border;

  &__back {
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__right {
    display: flex;
    align-items: center;
    gap: 4px;
    cursor: pointer;
    font-size: 11px;
    color: @rp-red;
    font-weight: 600;
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

// ====== STATE SCREENS ======
.rp-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 48px 24px 32px;
  text-align: center;

  &__icon-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }

  &__icon {
    width: 80px;
    height: 80px;
    object-fit: contain;
    margin-bottom: 16px;
    display: block;

    &--locked {
      opacity: 0.5;
      filter: grayscale(0.3);
      margin-bottom: 0;
    }

    &--pulse {
      animation: rp-pulse 2s ease-in-out infinite;
    }

    &--grey {
      filter: grayscale(1);
      opacity: 0.4;
    }
  }

  &__lock {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: @rp-card;
    border-radius: 50%;
    border: 1px solid rgba(255, 77, 79, 0.5);
    box-sizing: border-box;
  }

  &__title {
    font-size: 18px;
    font-weight: 800;
    color: @wihte-color;
    margin-bottom: 8px;
    text-transform: uppercase;
    letter-spacing: 0.5px;

    &--green {
      color: @rp-green;
    }
  }

  &__desc {
    font-size: 13px;
    color: #a89b7c;
    line-height: 1.5;
    max-width: 280px;
    margin-bottom: 24px;
  }

  &__sub {
    font-size: 12px;
    color: #a89b7c;
    margin-top: 16px;
  }
}

// ====== BUTTON ======
.rp-btn {
  border: none;
  border-radius: 12px;
  font-weight: 800;
  font-size: 16px;
  padding: 14px 48px;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;

  &--deposit {
    background: @rp-red;
    color: @wihte-color;
    box-shadow:
      0 4px 0 #b91c1c,
      0 8px 24px fade(@rp-red, 30%);

    &:active {
      transform: translateY(4px);
      box-shadow: none;
    }
  }
}

// ====== COUNTDOWN ======
.rp-countdown {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;

  &__block {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: @rp-card;
    border: 1px solid fade(@rp-red, 30%);
    border-radius: 10px;
    padding: 10px 16px;
    min-width: 60px;
  }

  &__num {
    font-size: 28px;
    font-weight: 900;
    color: @rp-red;
    font-variant-numeric: tabular-nums;
    text-shadow: 0 0 12px fade(@rp-red, 40%);
  }

  &__label {
    font-size: 9px;
    color: #a89b7c;
    font-weight: 700;
    text-transform: uppercase;
    margin-top: 2px;
  }

  &__sep {
    font-size: 24px;
    font-weight: 900;
    color: @rp-red;
  }
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
      color: #a89b7c;
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
    color: #a89b7c;
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
    color: #a89b7c;
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

// ====== INFO CARD ======
.rp-info-card {
  margin: 16px;
  background: @rp-card;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid @rp-border;

  &__row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;

    & + & {
      border-top: 1px solid @rp-border;
    }
  }

  &__label {
    font-size: 12px;
    color: #a89b7c;
    font-weight: 600;
  }

  &__value {
    font-size: 13px;
    color: @wihte-color;
    font-weight: 700;

    &--red {
      color: @rp-red;
      font-variant-numeric: tabular-nums;
    }
  }
}

// ====== RULES ======
.rp-rules {
  margin: 16px;
  background: @rp-card;
  border-radius: 12px;
  padding: 16px;
  border: 1px solid @rp-border;

  &__title {
    font-size: 13px;
    font-weight: 800;
    color: @wihte-color;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 12px;
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
    color: #a89b7c;
    line-height: 1.4;
  }

  &__num {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: fade(@rp-red, 15%);
    color: @rp-red;
    font-size: 10px;
    font-weight: 800;
  }
}

// ====== HISTORY POPUP ======
.rp-history {
  padding: 20px 16px;

  &__title {
    font-size: 16px;
    font-weight: 800;
    color: @wihte-color;
    text-align: center;
    margin-bottom: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  &__empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 0;
    min-height: 40vh;

    // 覆盖全局 .van-loading 全宽 + padding-top，避免 History 加载偏左
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
      color: #a89b7c;
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
    gap: 12px;
    .record-list-card();
    border-radius: 10px;
    padding: 12px;
  }

  &__left {
    flex-shrink: 0;
  }

  &__mid {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  &__round {
    font-size: 13px;
    font-weight: 600;
    color: @wihte-color;
  }

  &__time {
    font-size: 11px;
    color: #a89b7c;
  }

  &__order {
    font-size: 10px;
    color: #a89b7c;
    word-break: break-all;
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
    color: #a89b7c;
  }

  &__more {
    text-align: center;
    padding: 14px;
    color: @rp-red;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
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
