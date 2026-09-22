<template>
  <div class="mine-page">
    <div class="mine-top">
      <img
        class="mine-top__logo"
        src="@/assets/img/login/logo.png"
        alt="BISON FUN"
      />
    </div>

    <div class="mine-panel">
      <div class="mine-panel__glow"></div>

      <button class="mine-settings" type="button" @click="$jumpTo('/settings')">
        <van-icon name="setting-o" size="20" color="#FFE4B5" />
      </button>

      <div class="mine-user">
        <div class="mine-user__avatar" @click="$jumpTo('/editProfile')">
          <img
            v-if="avatarSrc"
            :src="avatarSrc"
            class="mine-user__avatar-img"
            alt=""
          />
          <div v-else class="mine-user__avatar-placeholder"></div>
        </div>

        <div class="mine-user__main">
          <div class="mine-user__row">
            <div class="mine-user__name" @click="copyText(InitDate.account)">
              <span>{{ InitDate.account || "--" }}</span>
              <van-icon name="column" size="14" color="#FFE4B5" />
            </div>
            <div
              v-if="InitDate.vipLevel != null"
              class="mine-user__vip"
              @click="$jumpTo('/vipLevels')"
            >
              <div class="mine-user__vip-badge" :style="vipBadgeStyle"></div>
              <span class="mine-user__vip-text"
                >VIP {{ InitDate.vipLevel || 0 }}</span
              >
              <van-icon name="arrow" size="14" color="#FFE4B5" />
            </div>
          </div>
          <!-- <div class="mine-user__id" @click="copyText(InitDate.inviteCode)">
            <span>ID: {{ InitDate.inviteCode || "--" }}</span>
            <van-icon name="column" size="14" color="#FFE4B5" />
          </div> -->
        </div>
      </div>

      <div class="mine-balance">
        <div class="mine-balance__label">
          {{ $lang.common_txt259 || "ACCOUNT BALANCE" }}
        </div>
        <div class="mine-balance__amount">
          {{ getCurrency
          }}{{
            $formatNumberWithCommas(
              InitDate2.totalBalance || InitDate2.balance || 0,
            )
          }}
        </div>

        <div class="mine-balance__stats">
          <div class="mine-balance__stat">
            <div class="lab">{{ $lang.mine_main || "Main" }}</div>
            <div class="val">
              {{ getCurrency
              }}{{ $formatNumberWithCommas(InitDate2.balance || 0) }}
            </div>
          </div>
          <div class="mine-balance__stat is-green">
            <div class="lab">{{ $lang.mine_cashback || "Cashback" }}</div>
            <div class="val">
              {{ getCurrency
              }}{{ $formatNumberWithCommas(InitDate2.cashback || 0) }}
            </div>
          </div>
        </div>
      </div>

      <div class="mine-qb">
        <div class="mine-qb__cz" @click="goToDesposit(0)">
          <div class="mine-qb__text">
            <p class="mine-qb__title">
              {{ $lang.mine_deposit_title || $lang.Depósito || "Deposit" }}
            </p>
            <p class="mine-qb__sub">
              {{ $lang.mine_deposit_sub || "Big rewards await!" }}
            </p>
          </div>
        </div>
        <div class="mine-qb__tx" @click="goToDesposit(1)">
          <div class="mine-qb__text">
            <p class="mine-qb__title">
              {{ $lang.mine_withdraw_title || "Withdraw" }}
            </p>
            <p class="mine-qb__sub">
              {{ $lang.mine_withdraw_sub || "Fast & Reliable" }}
            </p>
          </div>
        </div>
      </div>

      <div class="mine-records">
        <div class="mine-records__item" @click="$jumpTo('/recordOrder')">
          <picture class="mine-records__icon">
            <source
              srcset="@/assets/img/mine/record_deposit.webp"
              type="image/webp"
            />
            <img src="@/assets/img/mine/record_deposit.png" alt="" />
          </picture>
          <div class="mine-records__label">
            {{ $lang.mine_deposit_record || "Deposit Record" }}
          </div>
        </div>
        <div class="mine-records__item" @click="$jumpTo('/transactionRecords')">
          <picture class="mine-records__icon">
            <source
              srcset="@/assets/img/mine/record_withdraw.webp"
              type="image/webp"
            />
            <img src="@/assets/img/mine/record_withdraw.png" alt="" />
          </picture>
          <div class="mine-records__label">
            {{ $lang.mine_withdraw_record || "Withdrawal Record" }}
          </div>
        </div>
        <div class="mine-records__item" @click="$jumpTo('/billGame')">
          <picture class="mine-records__icon">
            <source
              srcset="@/assets/img/mine/record_game.webp"
              type="image/webp"
            />
            <img src="@/assets/img/mine/record_game.png" alt="" />
          </picture>
          <div class="mine-records__label">
            {{ $lang.common_txt261 || "Game Records" }}
          </div>
        </div>
      </div>
    </div>

    <section class="mine-menu">
      <div class="mine-menu__item" @click="$jumpTo('/rewardRecord')">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="gift-o" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.rewardRecord_title || "Reward Record" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/passwordLogin')">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="lock" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.mine_txt9 || "Change Login Password" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="goToBank">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="credit-pay" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.bank_title || "Bank Card" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/setPassWord')">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="shield-o" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.mine_txt10 || "Change Withdrawal Password" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/settings')">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="setting-o" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.settings_title || "Settings" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/Support')">
        <div class="mine-menu__left">
          <div class="mine-menu__icon-wrap">
            <van-icon name="service-o" size="18" color="#FFE4B5" />
          </div>
          <span>{{ $lang.common_txt291 || "Online Customer Service" }}</span>
        </div>
      </div>
    </section>

    <!-- Logout -->
    <div class="mine-logout">
      <button
        class="mine-logout__btn"
        type="button"
        @click="showLogoutPopup = true"
      >
        {{ $lang.mine_txt14 || "LOG OUT" }}
      </button>
    </div>

    <van-popup
      v-model:show="showLogoutPopup"
      round
      :close-on-click-overlay="true"
      class="logout-popup"
    >
      <div class="logout-popup__content">
        <p class="logout-popup__title">{{ $lang.mine_txt4 }}</p>
        <div class="logout-popup__actions">
          <button
            class="logout-popup__btn logout-popup__btn--cancel"
            type="button"
            @click="showLogoutPopup = false"
          >
            {{ $lang.Cancelar }}
          </button>
          <button
            class="logout-popup__btn logout-popup__btn--confirm"
            type="button"
            @click="confirmLogout"
          >
            {{ $lang.Confirmar }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { Init, GameBalanceList, Logout } from "@/api/common";
import { avatarImg } from "@/utils/avatarAssets";
import { resetPageScroll } from "@/utils/scrollReset";

// viptb.png：VIP0–VIP20 共 21 帧（与 vipLevels 一致）
const VIP_SPRITE_W = 4636;
const VIP_SPRITE_H = 280;
const VIP_BADGE_FRAMES = 21;
const VIP_MY_BADGE_H = 30;

export default {
  name: "Mine",
  data() {
    return {
      showLogoutPopup: false,
      InitDate: {
        inviteCode: "",
        headUrl: null,
        account: "",
        vipLevel: null,
        privacyPasswdSetted: "no",
        realName: "",
      },
      InitDate2: {
        balance: 0,
        cashback: 0,
        totalBalance: 0,
      },
    };
  },
  computed: {
    avatarSrc() {
      if (this.InitDate.headUrl == null || this.InitDate.headUrl === "") {
        return "";
      }
      return avatarImg(this.InitDate.headUrl);
    },
    vipBadgeStyle() {
      const lv = Math.max(0, Number(this.InitDate.vipLevel) || 0);
      const idx = Math.min(lv, VIP_BADGE_FRAMES - 1);
      const scale = VIP_MY_BADGE_H / VIP_SPRITE_H;
      const spriteW = VIP_SPRITE_W * scale;
      const frameW = spriteW / VIP_BADGE_FRAMES;
      return {
        width: `${frameW}px`,
        height: `${VIP_MY_BADGE_H}px`,
        backgroundSize: `${spriteW}px ${VIP_MY_BADGE_H}px`,
        backgroundPosition: `-${idx * frameW}px 0`,
      };
    },
  },
  mounted() {
    resetPageScroll();
    this.Init();
    this.GetGameBalanceList();
  },
  activated() {
    resetPageScroll();
    this.$nextTick(() => {
      resetPageScroll();
      setTimeout(resetPageScroll, 50);
    });
    this.Init();
    this.GetGameBalanceList();
  },
  methods: {
    async Init() {
      try {
        const data = await Init();
        if (data.status === "ok") {
          this.InitDate = data.content;
        }
      } catch (e) {
        console.error("Init error", e);
      }
    },
    async GetGameBalanceList() {
      try {
        const data = await GameBalanceList();
        if (data.status === "ok") {
          this.InitDate2 = data.content;
        }
      } catch (e) {
        console.error("GetGameBalanceList error", e);
      }
    },
    async goToDesposit(i) {
      if (i === 0) {
        this.$jumpTo("/rechargeCont");
        return;
      }
      await this.Init();
      if (this.InitDate.privacyPasswdSetted === "no") {
        this.$jumpTo("/setPassWord", { from: "withdraw" });
      } else {
        this.$jumpTo("/bankAdd");
      }
    },
    goToBank() {
      if (this.InitDate.realName) {
        this.$jumpTo("/bank");
      } else {
        this.$jumpTo("/authName");
      }
    },
    copyText(value) {
      const text = value == null ? "" : String(value);
      if (!text || text === "--") return;
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({ message: this.$lang.Sucesso, icon: "success" });
    },
    async confirmLogout() {
      this.showLogoutPopup = false;
      try {
        const data = await Logout();
        if (data.status === "ok") {
          localStorage.removeItem("token");
          this.$jumpTo("/home", {}, { replace: true });
          setTimeout(() => {
            window.location.reload();
          }, 200);
        } else {
          this.$toast({ message: data.msg, icon: "cross" });
        }
      } catch (e) {
        this.$toast({ message: e.msg || "Error", icon: "cross" });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffa300;
@gold-soft: #ffe4b5;
@gold-deep: #e9b65a;
@gold-grad: linear-gradient(90deg, #f7dd9a 0%, #ffa300 100%);
@btn-grad: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
@card-bg: rgba(70, 52, 4, 0.1);
@card-border: rgba(255, 228, 181, 0.39);

.mine-page {
  position: relative;
  min-height: 100vh;
  background: #1f1c17;
  color: #fff;
  padding-bottom: 100px;
  overflow-x: clip;
  overflow-y: visible;
}

/* ① 顶部背景层（y7 mabg） */
.mine-top {
  position: relative;
  height: 197px;
  padding-top: 10px;
  box-sizing: border-box;
  overflow: visible;
  background: url(@/assets/img/mine/mabg.png) 0 0 no-repeat;
  background-image: image-set(
    url("@/assets/img/mine/mabg.webp") type("image/webp"),
    url("@/assets/img/mine/mabg.png") type("image/png")
  );
  background-size: 100% auto;
  background-position: top center;
}

.mine-top__logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 168px;
  max-width: 48%;
  height: auto;
  display: block;
  pointer-events: none;
  z-index: 2;
  object-fit: contain;
  object-position: center top;
}

/* ② 主面板：上浮叠在背景上（金边圆角卡片） */
.mine-panel {
  position: relative;
  z-index: 1;
  margin: -100px 10px 0;
  padding: 14px 12px 16px;
  box-sizing: border-box;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid rgba(255, 162, 0, 0.45);
  border-radius: 16px;
  overflow: hidden;
}

.mine-panel__glow {
  width: 100%;
  height: 108px;
  background: radial-gradient(
    50% 50% at 50% 50%,
    rgba(255, 221, 0, 0.17) 0%,
    rgba(255, 255, 255, 0) 100%
  );
  position: absolute;
  top: -58px;
  left: 0;
  pointer-events: none;
  z-index: 0;
}

.mine-settings {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* 用户区 */
.mine-user {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 28px 8px 4px;
}

.mine-user__avatar {
  width: 65px;
  height: 65px;
  border-radius: 50%;
  overflow: hidden;
  border: 1px solid #ffcc00;
  box-shadow: 0 0 5px 1px #ffc404;
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
}

.mine-user__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.mine-user__avatar-placeholder {
  width: 100%;
  height: 100%;
  background: #2a2418;
}

.mine-user__main {
  flex: 1;
  min-width: 0;
}

.mine-user__row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}

.mine-user__name {
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
  cursor: pointer;

  span {
    font-size: 16px;
    font-weight: 700;
    background: @gold-grad;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}

.mine-user__vip {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
}

.mine-user__vip-badge {
  flex-shrink: 0;
  background-image: url(@/assets/img/vip/viptb.png);
  background-image: image-set(
    url("@/assets/img/vip/viptb.webp") type("image/webp"),
    url("@/assets/img/vip/viptb.png") type("image/png")
  );
  background-repeat: no-repeat;
}

.mine-user__vip-text {
  font-size: 18px;
  font-weight: 700;
  transform: skew(-10deg);
  padding: 0 4px;
  background: @gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  font-family: "Franklin Gothic Medium", "Arial Narrow", Arial, sans-serif;
  line-height: 1;
}

.mine-user__id {
  margin-top: 8px;
  font-size: 12px;
  color: @gold-soft;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

/* 余额 */
.mine-balance {
  position: relative;
  z-index: 1;
  margin-top: 10px;
  text-align: center;
}

.mine-balance__label {
  font-size: 11px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 6px;
}

.mine-balance__amount {
  font-size: 30px;
  font-weight: 800;
  line-height: 1.15;
  background: @gold-grad;
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
  text-decoration: none;
  border: none;
  user-select: none;
  -webkit-user-select: none;
}

.mine-balance__stats {
  position: relative;
  margin-top: 14px;
  display: flex;
  background: @card-bg;
  border: 1px solid @card-border;
  border-radius: 8px;
  padding: 14px 0 12px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 75%;
    height: 1px;
    box-shadow: 0 0 40px 6px @gold;
    pointer-events: none;
  }
}

.mine-balance__stat {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  &:not(:last-child)::after {
    content: "";
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 1px;
    background: linear-gradient(
      180deg,
      rgba(255, 228, 181, 0) 0%,
      #ffe4b5 48%,
      #ffe4b5 52%,
      rgba(255, 228, 181, 0) 100%
    );
  }

  .lab {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.7);
  }

  .val {
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }

  &.is-green .val {
    color: #31ff6f;
  }
}

/* 充提按钮（y7 切图 + 文案叠加） */
.mine-qb {
  position: relative;
  z-index: 1;
  width: 98%;
  margin: 14px auto 0;
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.mine-qb__cz,
.mine-qb__tx {
  position: relative;
  width: 48.5%;
  height: 70px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  cursor: pointer;
  overflow: visible;
}

.mine-qb__cz {
  background-image: url(@/assets/img/mine/czmy.png);
}

.mine-qb__tx {
  background-image: url(@/assets/img/mine/txmy.png);
}

.mine-qb__text {
  position: absolute;
  left: 38%;
  right: 4%;
  top: 50%;
  transform: translateY(-50%);
  text-align: left;
  pointer-events: none;
}

.mine-qb__title {
  margin: 0;
  font-size: 14px;
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: 0.01em;
  background: linear-gradient(180deg, #ffe9b0 0%, #ffa300 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  white-space: nowrap;
}

.mine-qb__sub {
  margin: 2px 0 0;
  font-size: 9px;
  font-weight: 500;
  line-height: 1.25;
  color: #f5efe3;
  opacity: 0.95;
  white-space: normal;
  word-break: break-word;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  overflow: hidden;
}

/* 记录入口 */
.mine-records {
  position: relative;
  z-index: 1;
  margin-top: 12px;
  display: flex;
  background: @card-bg;
  border: 1px solid @card-border;
  border-radius: 8px;
  padding: 14px 0 12px;
  overflow: hidden;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    transform: translateX(-50%);
    width: 75%;
    height: 1px;
    box-shadow: 0 0 40px 6px @gold;
    pointer-events: none;
  }
}

.mine-records__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
}

.mine-records__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 8px;
  line-height: 0;
  flex-shrink: 0;

  img {
    width: 48px;
    height: 48px;
    object-fit: contain;
    object-position: center;
    display: block;
  }
}

.mine-records__label {
  font-size: 11px;
  color: #fff;
  text-align: center;
  line-height: 1.25;
  padding: 0 2px;
  word-break: break-word;
}

/* 菜单 */
.mine-menu {
  margin: 12px 10px 0;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border: 1px solid rgba(255, 162, 0, 0.45);
  border-radius: 16px;
  overflow: hidden;
}

.mine-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 14px;
  cursor: pointer;
  border-bottom: 1px solid rgba(255, 228, 181, 0.12);

  &:last-child {
    border-bottom: none;
  }
}

.mine-menu__left {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;

  span {
    font-size: 14px;
    color: #fff;
    line-height: 1.2;
  }
}

.mine-menu__icon-wrap {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

/* Logout */
.mine-logout {
  padding: 18px 10px 0;
}

.mine-logout__btn {
  width: 100%;
  height: 46px;
  border: none;
  border-radius: 23px;
  background: @btn-grad;
  color: #573900;
  font-size: 15px;
  font-weight: 800;
  letter-spacing: 1px;
  text-transform: uppercase;
  box-shadow: 0 4px 16px rgba(255, 163, 0, 0.28);
  cursor: pointer;

  &:active {
    transform: scale(0.98);
    opacity: 0.92;
  }
}

/* Logout popup */
.logout-popup {
  width: 300px;
  background: #1f1c17 !important;
  border: 1px solid @gold-deep !important;
  border-radius: 12px !important;

  &__content {
    padding: 24px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @gold-soft;
    text-align: center;
    line-height: 1.4;
  }

  &__actions {
    display: flex;
    gap: 10px;
    width: 100%;
  }

  &__btn {
    flex: 1;
    min-width: 0;
    height: 42px;
    padding: 0 6px;
    border-radius: 20px;
    font-size: 14px;
    font-weight: 600;
    border: none;
    cursor: pointer;
    white-space: nowrap;

    &--cancel {
      background: transparent;
      color: @gold-deep;
      border: 1px solid @gold-deep;
    }

    &--confirm {
      background: @btn-grad;
      color: #573900;
    }

    &:active {
      opacity: 0.85;
    }
  }
}

@media (min-width: 769px) {
  .mine-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
