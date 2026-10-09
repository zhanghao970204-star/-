<template>
  <div class="activity-page">
    <!-- 双列六入口：紫框底 + 黑内容区 + 底部绿按钮 -->
    <div class="promo-grid">
      <div
        v-for="card in promoCards"
        :key="card.key"
        class="promo-card"
        @click="onCardClick(card)"
      >
        <div class="promo-card__inner">
          <h3 class="promo-card__title">{{ card.title }}</h3>
          <div class="promo-card__art">
            <img :src="card.icon" alt="" />
          </div>
          <p class="promo-card__desc" v-html="card.desc"></p>
        </div>
        <button type="button" class="promo-card__btn btn-3d-green">
          {{ card.btn }}
        </button>
      </div>
    </div>

    <login v-model="showLogin" overlay></login>
  </div>
</template>

<script>
import { NewPlayerGiftPackInit } from "@/api/common";
import iconSpin from "@/assets/img/activity/promo/spin.png";
import iconEnvelopes from "@/assets/img/activity/promo/envelopes.png";
import iconGifts from "@/assets/img/activity/promo/gifts.png";
import iconCheckin from "@/assets/img/activity/promo/checkin.png";
import iconLoss from "@/assets/img/activity/promo/loss.png";
import iconVip from "@/assets/img/activity/promo/vip.png";

export default {
  name: "Activity",
  data() {
    return {
      showLogin: false,
      newbieVisible: false,
    };
  },
  computed: {
    promoCards() {
      const L = this.$lang || {};
      const cards = [
        {
          key: "envelope",
          path: "/redPacket",
          icon: iconEnvelopes,
          title: L.activity_card_lucky || "LUCKY COMPENSATION",
          desc:
            L.activity_card_lucky_desc ||
            "Up to <em>$5000</em> bonus on big deposits",
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "spin",
          path: "/luckyReferral",
          icon: iconSpin,
          title: L.activity_card_spins || "DAILY FREE SPINS",
          desc:
            L.activity_card_spins_desc ||
            "Get up to <em>100</em> Free Spins every day",
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "deposit",
          path: this.newbieVisible ? "/newbieGift" : "/rechargeCont",
          icon: iconGifts,
          title: L.activity_card_deposit || "DEPOSIT BONUS",
          desc:
            L.activity_card_deposit_desc ||
            "Get up to <em>20%</em> extra free on every top-up",
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "checkin",
          path: "/dailyCheckIn",
          icon: iconCheckin,
          title: L.activity_card_login || "DAILY LOGIN REWARDS",
          desc:
            L.activity_card_login_desc ||
            "Get up to <em>$3977</em> totally free!",
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "loss",
          path: "/weeklyMissions",
          icon: iconLoss,
          title: L.activity_card_loss || "LOSS RESCUE",
          desc:
            L.activity_card_loss_desc ||
            "Up to <em>50%</em> cashback on slot losses",
          btn: L.activity_spin || "SPIN",
        },
        {
          key: "vip",
          path: "/vipLevels",
          icon: iconVip,
          title: L.activity_card_vip || "VIP CLUB",
          desc:
            L.activity_card_vip_desc ||
            "Up to <em>$10,000</em> exclusive VIP reward",
          btn: L.activity_spin || "SPIN",
        },
      ];
      return cards;
    },
  },
  mounted() {
    this.initActivityStatus();
  },
  methods: {
    async initActivityStatus() {
      try {
        const ngRes = await NewPlayerGiftPackInit({});
        if (ngRes && ngRes.status === "ok" && ngRes.content) {
          this.newbieVisible = ngRes.content.visible === 1;
        }
      } catch (e) {
        console.error("NewPlayerGiftPackInit error", e);
      }
    },
    onCardClick(card) {
      this.goTo(card.path);
    },
    goTo(path) {
      if (!this.token) {
        this.showLogin = true;
        return;
      }
      this.$jumpTo(path);
    },
  },
};
</script>

<style lang="less" scoped>
@frame: #7e3fb8;

.activity-page {
  padding: 10px 12px 100px;
  min-height: 100vh;
  color: #fff;
  box-sizing: border-box;
}

.promo-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
}

.promo-card {
  display: flex;
  flex-direction: column;
  align-items: stretch;
  min-height: 228px;
  padding: 5px 5px 10px;
  box-sizing: border-box;
  border-radius: 16px;
  background: @frame;
  border: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.12s ease;

  &:active {
    transform: scale(0.98);
  }

  &__inner {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 0;
    padding: 12px 8px 10px;
    box-sizing: border-box;
    border-radius: 12px;
    background: #000;
  }

  &__title {
    margin: 0 0 8px;
    width: 100%;
    text-align: center;
    font-size: 12px;
    font-weight: 800;
    letter-spacing: 0.3px;
    color: #fff;
    line-height: 1.2;
    text-transform: uppercase;
  }

  &__art {
    width: 100%;
    height: 76px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 8px;

    img {
      max-width: 92%;
      max-height: 100%;
      object-fit: contain;
      display: block;
    }
  }

  &__desc {
    margin: 0;
    width: 100%;
    text-align: center;
    font-size: 11px;
    line-height: 1.35;
    color: #fff;
    font-weight: 600;

    :deep(em) {
      font-style: normal;
      color: #ffd400;
      font-weight: 800;
    }
  }

  &__btn {
    width: calc(100% - 16px);
    margin: 10px auto 0;
    height: 36px !important;
    font-size: 13px !important;
    font-weight: 900 !important;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
}
</style>
