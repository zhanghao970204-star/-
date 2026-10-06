<template>
  <div class="invite">
    <!-- 图一：链卡框 share_list2 + My link / Quick Sharing -->
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

    <!-- 图二：层级 -->
    <section class="invite-block">
      <h3
        style="
          font-size: 14px;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 10px;
          text-align: center;
          margin: 14px 0;
        "
      >
        {{ $lang.common_txt34 }}
      </h3>
      <div class="invite-media">
        <img src="../../assets/img/share/share-fx.png" alt="" />
      </div>
    </section>

    <!-- 图二：规则整图作背景，正文落在空心紫框内 -->
    <section class="invite-rules-doc">
      <div class="invite-rules-doc__body">
        <h3 class="invite-section-title">
          {{ $lang.share_rules_intro_title }}
        </h3>
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
            :class="{ 'invite-table__row--alt': index % 2 === 1 }"
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
            :class="{ 'invite-table__row--alt': index % 2 === 1 }"
          >
            <p>{{ $lang[item.levelKey] }}</p>
            <p class="invite-table__rate">{{ item.rate }}</p>
          </div>
        </div>
        <p class="invite-note">{{ $lang.share_rules_betting_settlement }}</p>

        <h3 class="invite-section-title">
          {{ $lang.share_rules_cumulative_title }}
        </h3>
        <p class="invite-section-desc">
          {{ $lang.share_rules_cumulative_desc }}
        </p>
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
            :class="{ 'invite-table__row--alt': index % 2 === 1 }"
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
          <li
            v-for="(key, index) in settlementRuleKeys"
            :key="'settle-' + index"
          >
            {{ $lang[key] }}
          </li>
        </ol>

        <p class="invite-rules-doc__cta">{{ $lang.share_rules_footer_cta }}</p>
      </div>
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
        // {
        //   img: require("@/assets/img/common/douyin.png"),
        //   name: "TikTok",
        // },
        // {
        //   img: require("@/assets/img/common/img_x.png"),
        //   name: "X",
        // },
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
@page-bg: #15031d;
@panel: #361a50;
@panel-deep: #1e0a3a;
@purple-line: #8e51c1;
@purple-soft: #9b6dff;
@gold: #ffd36a;
@gold-soft: #ffe9a8;
@muted: #d7a2fa;
@copy-grad: linear-gradient(180deg, #3be59f 0%, #00b56a 100%);
@title-bg: url("../../assets/img/share/share_title.png");

.invite {
  padding: 4px 12px 80px;
  color: #fff;
}

/* 图一：链卡整图作背景（image 23470 → share_list2） */
.invite-card {
  position: relative;
  overflow: hidden;
  box-sizing: border-box;
  /* 头区留给链标装饰，内容落在空心紫区内 */
  padding: 78px 18px 20px;
  background-color: @panel;
  background-image: url("../../assets/img/share/share_list2.png");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;
  box-shadow: 0 0 22px fade(@purple-soft, 40%);
  min-height: 260px;
}

.invite-card__label {
  margin: 20px 0 8px;
  font-size: 12px;
  font-weight: 700;
  color: #edd8fb;
}

.invite-link {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  background: rgba(10, 2, 22, 0.75);
  border: 1px solid fade(@purple-line, 50%);
  border-radius: 999px;
  padding: 6px 8px 6px 12px;
}

.invite-link__url {
  flex: 1;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  line-height: 1.4;
  color: #ffffff;
  word-break: break-all;
  font-weight: 700;
}

.invite-link__copy {
  flex-shrink: 0;
  border: none;
  outline: none;
  cursor: pointer;
  background: @copy-grad;
  color: #fff;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  border-radius: 16px;
  padding: 7px 14px;
  box-shadow: 0 3px 0 #007a48;
}

.invite-card__share-title {
  margin: 16px 0 10px;
  font-size: 12px;
  font-weight: 700;
  color: #edd8fb;
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
  width: 42px;
  height: 42px;
  margin: 0 auto;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.28);

  img {
    width: 42px;
    height: 42px;
    object-fit: contain;
  }
}

.invite-share__name {
  margin: 6px 0 0;
  font-size: 8px;
  line-height: 1.2;
  color: rgba(255, 255, 255, 0.92);
  white-space: nowrap;
  font-weight: 700;
}

/* 标题条：share_title（金星胶囊） */
.invite-title,
.invite-section-title {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 14px 0 10px;
  min-height: 50px;
  padding: 5px 40px 0;
  box-sizing: border-box;
  font-size: 14px;
  font-weight: 800;
  color: #fff;
  line-height: 1.25;
  text-align: center;
  letter-spacing: 0.2px;
  background: @title-bg center center / 100% 100% no-repeat;
  border: none;
}

.invite-title {
  margin: 0 0 10px;
  text-transform: uppercase;
  font-size: 12px;
  min-height: 44px;
  padding: 0 44px;
}

.invite-media {
  overflow: hidden;

  img {
    display: block;
    width: 100%;
    vertical-align: top;
  }
}

.invite-table {
  background: rgba(18, 6, 40, 0.72);
  border: 1px solid fade(@purple-line, 50%);
  border-radius: 10px;
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
  background: #512275;
  color: #d7a2fa;
  font-weight: 700;
}

.invite-table__row {
  padding: 12px 8px;
  font-weight: 700;
  background: #79218f;

  /* 圈中列：白字 */
  p {
    color: #ffffff;
    font-weight: 700;
  }

  /* 第二行起间隔：#4B0E5D */
  &--alt {
    background: #4b0e5d;
  }
}

/* 4 列表：首列金额金色，奖励列白字 */
.invite-table--4col .invite-table__row p:first-child {
  color: @gold;
}

/* 2 列表：等级列白字，返水比例金色 */
.invite-table--2col .invite-table__row .invite-table__rate {
  color: @gold !important;
}

.invite-table__rate {
  color: #ffffff !important;
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

/* 图二：share_rules 整图背景（头图角色+标题在图内，正文落空心区） */
.invite-rules-doc {
  position: relative;
  margin-top: 18px;
  overflow: hidden;
  box-sizing: border-box;
  /* 顶部留给角色/标题装饰，内容从紫框空心区起 */
  padding: 135px 14px 22px;
  background-image: url("../../assets/img/share/share_rules.png");
  background-repeat: no-repeat;
  background-position: top center;
  background-size: 100% 100%;
}

.invite-rules-doc__body {
  padding: 0;
  box-sizing: border-box;
}

.invite-section-desc,
.invite-note {
  margin: 0 0 10px;
  font-size: 12px;
  line-height: 1.65;
  color: #ffffff;
}

.invite-note {
  margin-top: 8px;
  color: #ffffff;
}

.invite-rules-list {
  margin: 0;
  font-size: 12px;
  line-height: 1.65;
  color: #ffffff;

  li + li {
    margin-top: 8px;
  }
}

.invite-rules-doc__cta {
  margin: 16px 0 4px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  color: #eeff00;
}
</style>
