<template>
  <div class="invite">
    <!-- My link + Quick Sharing -->
    <section class="invite-card">
      <p class="invite-card__label">{{ $lang.common_txt57 }}</p>
      <div v-if="inviteCode" class="invite-link">
        <p class="invite-link__url">{{ inviteCode }}</p>
        <button type="button" class="invite-link__copy" @click="copyText">
          {{ $lang.common_txt56 }}
        </button>
      </div>
      <p class="invite-card__share-title">{{ $lang.common_txt58 }}</p>
      <div class="invite-share" v-drag-scroll>
        <div
          class="invite-share__item"
          v-for="(item, index) in shareList"
          :key="index"
          @click="shareContent(index)"
        >
          <div class="invite-share__icon">
            <img :src="item.img" alt="" />
          </div>
          <p class="invite-share__name">{{ item.name }}</p>
        </div>
      </div>
    </section>

    <!-- Hierarchy -->
    <section class="invite-block">
      <h3 class="invite-title">{{ $lang.common_txt34 }}</h3>
      <div class="invite-media">
        <img src="../../assets/img/share/share-fx.png" alt="" />
      </div>
    </section>

    <!-- Invite reward rules -->
    <section class="invite-rules-doc">
      <h2 class="invite-rules-doc__title">{{ $lang.share_rules_title }}</h2>
      <p class="invite-rules-doc__tags">{{ $lang.share_rules_tags }}</p>

      <h3 class="invite-section-title">{{ $lang.share_rules_intro_title }}</h3>
      <p class="invite-section-desc">{{ $lang.share_rules_intro_desc }}</p>

      <h3 class="invite-section-title">
        {{ $lang.share_rules_first_deposit_title }}
      </h3>
      <p class="invite-section-desc">
        {{ $lang.share_rules_first_deposit_desc }}
      </p>
      <div class="invite-table invite-table--4col">
        <div class="invite-table__head">
          <p>{{ $lang.share_rules_fd_col_amount }}</p>
          <p>{{ $lang.share_rules_fd_col_l1 }}</p>
          <p>{{ $lang.share_rules_fd_col_l2 }}</p>
          <p>{{ $lang.share_rules_fd_col_l3 }}</p>
        </div>
        <div
          v-for="(item, index) in firstDepositRows"
          :key="'fd-' + index"
          class="invite-table__row"
          :class="{ 'invite-table__row--alt': index % 2 === 0 }"
        >
          <p>{{ item.amount }}</p>
          <p>{{ item.l1 }}</p>
          <p>{{ item.l2 }}</p>
          <p class="invite-table__rate">{{ item.l3 }}</p>
        </div>
      </div>
      <p class="invite-note">{{ $lang.share_rules_first_deposit_note }}</p>

      <h3 class="invite-section-title">
        {{ $lang.share_rules_betting_title }}
      </h3>
      <p class="invite-section-desc">{{ $lang.share_rules_betting_desc }}</p>
      <div class="invite-table invite-table--2col">
        <div class="invite-table__head">
          <p>{{ $lang.share_rules_bet_col_level }}</p>
          <p>{{ $lang.share_rules_bet_col_rate }}</p>
        </div>
        <div
          v-for="(item, index) in bettingRows"
          :key="'bet-' + index"
          class="invite-table__row"
          :class="{ 'invite-table__row--alt': index % 2 === 0 }"
        >
          <p>{{ $lang[item.levelKey] }}</p>
          <p class="invite-table__rate">{{ item.rate }}</p>
        </div>
      </div>
      <p class="invite-note">{{ $lang.share_rules_betting_settlement }}</p>

      <h3 class="invite-section-title">
        {{ $lang.share_rules_cumulative_title }}
      </h3>
      <p class="invite-section-desc">{{ $lang.share_rules_cumulative_desc }}</p>
      <div class="invite-table invite-table--4col invite-table--compact">
        <div class="invite-table__head">
          <p>{{ $lang.share_rules_cum_col_count }}</p>
          <p>{{ $lang.share_rules_cum_col_l1 }}</p>
          <p>{{ $lang.share_rules_cum_col_l2 }}</p>
          <p>{{ $lang.share_rules_cum_col_l3 }}</p>
        </div>
        <div
          v-for="(item, index) in cumulativeRows"
          :key="'cum-' + index"
          class="invite-table__row"
          :class="{ 'invite-table__row--alt': index % 2 === 0 }"
        >
          <p>{{ item.count }}</p>
          <p>{{ item.l1 }}</p>
          <p>{{ item.l2 }}</p>
          <p class="invite-table__rate">{{ item.l3 }}</p>
        </div>
      </div>

      <h3 class="invite-section-title">
        {{ $lang.share_rules_invite_method_title }}
      </h3>
      <p class="invite-section-desc">
        {{ $lang.share_rules_invite_method_desc }}
      </p>

      <h3 class="invite-section-title">
        {{ $lang.share_rules_settlement_title }}
      </h3>
      <ol class="invite-rules-list">
        <li v-for="(key, index) in settlementRuleKeys" :key="'settle-' + index">
          {{ $lang[key] }}
        </li>
      </ol>

      <p class="invite-rules-doc__cta">{{ $lang.share_rules_footer_cta }}</p>
    </section>
  </div>
</template>
<script>
import VueQr from "qrcode.vue";
import { Init } from "@/api/common";
export default {
  name: "ShareOnes",
  // eslint-disable-next-line vue/no-unused-components
  components: { VueQr },
  data() {
    return {
      inviteCode: "",
      shareList: [
        {
          img: require("@/assets/img/common/fenxiang.png"),
          name: "Share",
        },
        {
          img: require("@/assets/img/common/img_wa.png"),
          name: "WhatsApp",
        },
        {
          img: require("@/assets/img/common/img_tg.png"),
          name: "Telegram",
        },
        {
          img: require("@/assets/img/common/huohua.png"),
          name: "Instagram",
        },
        {
          img: require("@/assets/img/common/youtub.png"),
          name: "YouTube",
        },
        {
          img: require("@/assets/img/common/img_facebook.png"),
          name: "Facebook",
        },
        {
          img: require("@/assets/img/common/douyin.png"),
          name: "TikTok",
        },
        {
          img: require("@/assets/img/common/img_x.png"),
          name: "X",
        },
      ],
      firstDepositRows: [
        { amount: "9.99", l1: "3", l2: "2", l3: "1" },
        { amount: "30.99", l1: "10", l2: "5", l3: "2" },
        { amount: "99.99", l1: "30", l2: "0", l3: "0" },
        { amount: "199.99", l1: "60", l2: "0", l3: "0" },
      ],
      bettingRows: [
        { levelKey: "share_rules_bet_l1", rate: "0.60%" },
        { levelKey: "share_rules_bet_l2", rate: "0.30%" },
        { levelKey: "share_rules_bet_l3", rate: "0.10%" },
      ],
      cumulativeRows: [
        { count: "5", l1: "15", l2: "10", l3: "5" },
        { count: "20", l1: "60", l2: "40", l3: "20" },
        { count: "50", l1: "150", l2: "100", l3: "50" },
        { count: "100", l1: "300", l2: "200", l3: "100" },
        { count: "200", l1: "600", l2: "400", l3: "200" },
        { count: "500", l1: "1,500", l2: "1,000", l3: "500" },
        { count: "1,000", l1: "3,000", l2: "2,000", l3: "1,000" },
        { count: "2,000", l1: "6,000", l2: "4,000", l3: "2,000" },
        { count: "5,000", l1: "15,000", l2: "10,000", l3: "5,000" },
        { count: "10,000", l1: "30,000", l2: "20,000", l3: "10,000" },
        { count: "20,000", l1: "60,000", l2: "40,000", l3: "20,000" },
        { count: "50,000", l1: "150,000", l2: "100,000", l3: "50,000" },
        { count: "100,000", l1: "300,000", l2: "200,000", l3: "100,000" },
      ],
      settlementRuleKeys: [
        "share_rules_settlement_1",
        "share_rules_settlement_2",
        "share_rules_settlement_3",
        "share_rules_settlement_4",
        "share_rules_settlement_5",
      ],
    };
  },
  mounted() {
    this.Init();
  },
  methods: {
    shareContent(i) {
      if (i === 0) {
        if (navigator.share) {
          navigator
            .share({
              title: "BISONFUN",
              text: "BISONFUN",
              url: this.inviteCode,
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          alert("Your browser does not support the Web Share API.");
        }
      } else if (i === 1) {
        window.open(`https://api.whatsapp.com/`, "_blank");
      } else if (i === 2) {
        window.open(`https://t.me/`, "_blank");
      } else if (i === 3) {
        window.open(`https://www.instagram.com/`, "_blank");
      } else if (i === 4) {
        window.open(`https://www.youtube.com/`, "_blank");
      } else if (i === 5) {
        window.open(`https://www.facebook.com/`, "_blank");
      } else if (i === 6) {
        window.open(`https://www.tiktok.com/`, "_blank");
      } else if (i === 7) {
        window.open(`https://x.com/`, "_blank");
      }
    },
    async Init() {
      const data = await Init();
      if (data.status === "ok") {
        this.inviteCode =
          window.location.origin +
          "/" +
          localStorage.getItem("country") +
          "/home?id=" +
          data.content.inviteCode;
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
  },
};
</script>
<style lang="less" scoped>
@bg: #1f1c17;
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9a843;
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@card-bg: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
@card-border: 0.25px solid #ffebc0;
/* 图一吸色：左暖橄榄 → 右近黑 */
@fx-bg: linear-gradient(
  100deg,
  #433e27 0%,
  #3a3523 22%,
  #2b271b 48%,
  #1a1812 78%,
  #13120d 100%
);
@fx-border: 1px solid #877d60;
@muted: #a89b7c;

.invite {
  padding: 4px 12px 80px;
  color: #fff;
}

.invite-card {
  background: @fx-bg;
  border: @fx-border;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 14px 12px 16px;
}

.invite-card__label {
  margin: 0 0 8px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
}

.invite-link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid fade(@gold-deep, 35%);
  border-radius: 10px;
  padding: 6px 8px 6px 12px;
}

.invite-link__url {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: rgba(255, 255, 255, 0.88);
  word-break: break-all;
}

.invite-link__copy {
  flex-shrink: 0;
  border: none;
  outline: none;
  cursor: pointer;
  background: @btn-grad;
  color: #573900;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: 16px;
  padding: 7px 14px;
}

.invite-card__share-title {
  margin: 14px 0 10px;
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.invite-share {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 2px 2px 4px;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;
  cursor: grab;
  user-select: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.invite-share__item {
  flex: 0 0 auto;
  width: 52px;
  text-align: center;
}

.invite-share__icon {
  width: 40px;
  height: 40px;
  margin: 0 auto;
  background: none;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }
}

.invite-share__name {
  margin: 6px 0 0;
  font-size: 9px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.9);
  white-space: nowrap;
}

.invite-block {
  margin-top: 18px;
}

.invite-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 10px;
  font-size: 15px;
  font-weight: 700;
  color: #fff;
  line-height: 1.3;

  &::before {
    content: "";
    flex-shrink: 0;
    width: 3px;
    height: 16px;
    border-radius: 2px;
    background: @btn-grad;
  }
}

.invite-media {
  background: @fx-bg;
  border: @fx-border;
  border-radius: 12px;
  box-sizing: border-box;
  padding: 8px;
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    border-radius: 8px;
  }
}

.invite-table {
  background: @card-bg;
  // border: @card-border;
  border-radius: 8px;
  box-sizing: border-box;
  overflow: hidden;
}

.invite-table__head,
.invite-table__row {
  display: flex;
  align-items: center;
  justify-content: space-between;

  p {
    width: 33.33%;
    margin: 0;
    text-align: center;
    font-size: 12px;
  }
}

.invite-table__head {
  padding: 12px 8px;
  background: rgba(255, 163, 0, 0.12);
  color: @gold-soft;
  font-weight: 700;
}

.invite-table__row {
  padding: 12px 8px;
  color: @gold;
  font-weight: 700;

  p {
    color: @gold;
    font-weight: 700;
  }

  &--alt {
    background: rgba(255, 255, 255, 0.03);
  }
}

.invite-table__rate {
  color: @gold !important;
  font-weight: 700;
}

.invite-table--4col {
  .invite-table__head p,
  .invite-table__row p {
    width: 25%;
    font-size: 11px;
  }
}

.invite-table--2col {
  .invite-table__head p,
  .invite-table__row p {
    width: 50%;
  }
}

.invite-table--compact {
  .invite-table__head p,
  .invite-table__row p {
    font-size: 10px;
    line-height: 1.35;
  }
}

.invite-rules-doc {
  margin-top: 18px;
  padding: 14px 10px 8px;
  background: @fx-bg;
  border: @fx-border;
  border-radius: 12px;
}

.invite-rules-doc__title {
  margin: 0 0 8px;
  text-align: center;
  font-size: 16px;
  font-weight: 700;
  color: @gold-soft;
}

.invite-rules-doc__tags {
  margin: 0 0 14px;
  text-align: center;
  font-size: 11px;
  line-height: 1.5;
  color: @muted;
}

.invite-section-title {
  margin: 16px 0 8px;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
}

.invite-section-desc,
.invite-note {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.65;
  color: @muted;
}

.invite-note {
  margin-top: 8px;
  color: fade(@gold-soft, 85%);
}

.invite-rules-list {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: @muted;

  li + li {
    margin-top: 8px;
  }
}

.invite-rules-doc__cta {
  margin: 16px 0 4px;
  text-align: center;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.5;
  color: @gold-soft;
}

.invite-rules-head {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 22px 0 12px;
}

.invite-rules-head__text {
  flex-shrink: 0;
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  padding: 0 10px;
}

.invite-rules-head__line {
  flex: 1;
  height: 2px;
  max-width: 72px;

  &--l {
    background: linear-gradient(
      90deg,
      rgba(255, 163, 0, 0) 0%,
      fade(@gold, 80%) 100%
    );
  }

  &--r {
    background: linear-gradient(
      90deg,
      fade(@gold, 80%) 0%,
      rgba(255, 163, 0, 0) 100%
    );
  }
}

.invite-rules {
  font-size: 12px;
  line-height: 1.7;
  color: @muted;

  :deep(p) {
    margin: 0 0 10px;
  }

  :deep(strong),
  :deep(b) {
    color: @gold-soft;
  }
}
</style>
