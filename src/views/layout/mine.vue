<template>
  <div class="mine-page">
    <div class="mine-user">
      <div
        class="mine-user__avatar"
        role="button"
        @click="goEditProfile"
      >
        <img
          v-if="avatarSrc"
          :src="avatarSrc"
          class="mine-user__avatar-img"
          alt=""
        />
        <div v-else class="mine-user__avatar-placeholder"></div>
        <img
          v-if="InitDate.vipLevel != null"
          class="mine-user__vip-badge"
          :src="vipBadgeSrc"
          alt=""
          @click.stop="$jumpTo('/vipLevels')"
        />
      </div>

      <div class="mine-user__main">
        <div class="mine-user__name" @click="copyText(InitDate.account)">
          <span>{{ InitDate.account || "--" }}</span>
          <img
            class="mine-user__copy"
            src="@/assets/img/mine/copy.png"
            alt=""
          />
        </div>
        <div class="mine-user__progress" @click="$jumpTo('/vipLevels')">
          <div class="mine-user__progress-track">
            <div
              class="mine-user__progress-fill"
              :style="{
                width: 'calc((100% - 6px) * ' + vipProgressPercent + ' / 100)',
              }"
            ></div>
            <span class="mine-user__progress-text">{{ vipProgressText }}</span>
          </div>
          <img class="mine-user__progress-gem" :src="vipPairIconSrc" alt="" />
        </div>
      </div>
    </div>

    <div class="mine-balance">
      <div class="mine-balance__amount">
        {{ getCurrency }}
        <span style="margin-left: 5px">
          {{
            $formatNumberWithCommas(
              InitDate2.totalBalance || InitDate2.balance || 0,
            )
          }}
        </span>
      </div>

      <div class="mine-balance__stats">
        <div class="mine-balance__stat">
          <div class="lab">{{ $lang.mine_main || "Main" }}</div>
          <div class="val">
            {{ getCurrency }}
            <span class="m-l-2">
              {{ $formatNumberWithCommas(InitDate2.balance || 0) }}
            </span>
          </div>
        </div>
        <div class="mine-balance__stat is-green">
          <div class="lab">{{ $lang.mine_cashback || "Cashback" }}</div>
          <div class="val">
            {{ getCurrency }}
            <span class="m-l-2">
              {{ $formatNumberWithCommas(InitDate2.cashback || 0) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="mine-qb">
      <div class="mine-qb__btn btn-press" @click="goToDesposit(1)">
        <div class="mine-qb__tx"></div>
      </div>
      <div class="mine-qb__btn btn-press" @click="goToDesposit(0)">
        <div class="mine-qb__cz"></div>
      </div>
    </div>

    <div class="mine-records">
      <div class="mine-records__item" @click="$jumpTo('/recordOrder')">
        <div class="mine-records__tile">
          <img
            class="mine-records__icon"
            src="@/assets/img/mine/record_deposit.png"
            alt=""
          />
          <div class="mine-records__label">
            {{ $lang.mine_deposit_record || "Deposit Record" }}
          </div>
        </div>
      </div>
      <div class="mine-records__item" @click="$jumpTo('/transactionRecords')">
        <div class="mine-records__tile">
          <img
            class="mine-records__icon"
            src="@/assets/img/mine/record_withdraw.png"
            alt=""
          />
          <div class="mine-records__label">
            {{ $lang.mine_withdraw_record || "Withdrawal Record" }}
          </div>
        </div>
      </div>
      <div class="mine-records__item" @click="$jumpTo('/billGame')">
        <div class="mine-records__tile">
          <img
            class="mine-records__icon"
            src="@/assets/img/mine/record_game.png"
            alt=""
          />
          <div class="mine-records__label">
            {{ $lang.common_txt261 || "Game Records" }}
          </div>
        </div>
      </div>
    </div>

    <section class="mine-menu">
      <div class="mine-menu__item" @click="$jumpTo('/rewardRecord')">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_reward.png"
            alt=""
          />
          <span>{{ $lang.rewardRecord_title || "Reward Record" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/passwordLogin')">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_lock.png"
            alt=""
          />
          <span>{{ $lang.mine_txt9 || "Change Login Password" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="goToBank">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_bank.png"
            alt=""
          />
          <span>{{ $lang.bank_title || "Bank Card" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/setPassWord')">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_shield.png"
            alt=""
          />
          <span>{{ $lang.mine_txt10 || "Change Withdrawal Password" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/settings')">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_settings.png"
            alt=""
          />
          <span>{{ $lang.settings_title || "Settings" }}</span>
        </div>
      </div>
      <div class="mine-menu__item" @click="$jumpTo('/Support')">
        <div class="mine-menu__left">
          <img
            class="mine-menu__icon"
            src="@/assets/img/mine/menu_service.png"
            alt=""
          />
          <span>{{ $lang.common_txt291 || "Online Customer Service" }}</span>
        </div>
      </div>
    </section>

    <div class="mine-logout">
      <button
        class="mine-logout__btn btn-3d-green"
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
import { Init, GameBalanceList, Logout, VipInit } from "@/api/common";
import { clearGuestFlags, isGuestUser } from "@/utils/guestAuth";
import { avatarImg } from "@/utils/avatarAssets";
import { resetPageScroll } from "@/utils/scrollReset";

const vipBadgeModules = import.meta.glob("@/assets/img/vip/V*.png", {
  eager: true,
  import: "default",
});
const vipPairModules = import.meta.glob("@/assets/img/vip/*_*.png", {
  eager: true,
  import: "default",
});

function resolveVipBadge(level) {
  const lv = Math.max(0, Math.min(13, Number(level) || 0));
  const hit = Object.keys(vipBadgeModules).find((k) =>
    k.endsWith(`/V${lv}.png`),
  );
  if (hit) return vipBadgeModules[hit];
  const fallback = Object.keys(vipBadgeModules).find((k) =>
    k.endsWith("/V0.png"),
  );
  return fallback ? vipBadgeModules[fallback] : "";
}

/** 两级共用一张：1-2 / 3-4 ... 13-14 */
function resolveVipPairIcon(level) {
  const lv = Math.max(0, Number(level) || 0);
  const start = lv <= 0 ? 1 : Math.floor((lv - 1) / 2) * 2 + 1;
  const clampedStart = Math.min(start, 13);
  const name = `${clampedStart}_${clampedStart + 1}.png`;
  const hit = Object.keys(vipPairModules).find((k) => k.endsWith(`/${name}`));
  if (hit) return vipPairModules[hit];
  const fallback = Object.keys(vipPairModules).find((k) =>
    k.endsWith("/1_2.png"),
  );
  return fallback ? vipPairModules[fallback] : "";
}

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
      vipRechargeAmount: 0,
      vipNextRechargeAmount: 0,
    };
  },
  computed: {
    avatarSrc() {
      if (this.InitDate.headUrl == null || this.InitDate.headUrl === "") {
        return "";
      }
      return avatarImg(this.InitDate.headUrl);
    },
    vipBadgeSrc() {
      return resolveVipBadge(this.InitDate.vipLevel);
    },
    vipPairIconSrc() {
      return resolveVipPairIcon(this.InitDate.vipLevel);
    },
    vipProgressPercent() {
      const cur = Number(this.vipRechargeAmount) || 0;
      const need = Number(this.vipNextRechargeAmount) || 0;
      if (need > 0) {
        return Math.max(0, Math.min(100, (cur / need) * 100));
      }
      return cur > 0 ? 100 : 0;
    },
    vipProgressText() {
      const cur = Number(this.vipRechargeAmount) || 0;
      const need = Number(this.vipNextRechargeAmount) || 0;
      const fmt = (n) => this.$formatNumberWithCommas(n);
      if (need > 0) {
        return `${fmt(cur)}/${fmt(need)}`;
      }
      return `${fmt(cur)}`;
    },
  },
  mounted() {
    resetPageScroll();
    this.Init();
    this.GetGameBalanceList();
    this.loadVipInit();
    this._onHeaderRefresh = () => {
      this.Init();
      this.GetGameBalanceList();
      this.loadVipInit();
    };
    this.$bus.on("refsh-amount", this._onHeaderRefresh);
  },
  activated() {
    resetPageScroll();
    this.$nextTick(() => {
      resetPageScroll();
      setTimeout(resetPageScroll, 50);
    });
    this.Init();
    this.GetGameBalanceList();
    this.loadVipInit();
  },
  beforeUnmount() {
    if (this._onHeaderRefresh) {
      this.$bus.off("refsh-amount", this._onHeaderRefresh);
      this._onHeaderRefresh = null;
    }
  },
  methods: {
    goEditProfile() {
      this.$jumpTo("/editProfile");
    },
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
    async loadVipInit() {
      try {
        const data = await VipInit();
        if (data.status === "ok" && data.content) {
          const c = data.content;
          if (c.vipLevel != null) {
            this.InitDate = { ...this.InitDate, vipLevel: c.vipLevel };
          }
          this.vipRechargeAmount = c.rechargeAmount || 0;
          this.vipNextRechargeAmount = c.nextRechargeAmount || 0;
        }
      } catch (e) {
        console.error("loadVipInit error", e);
      }
    },
    async goToDesposit(i) {
      if (i === 0) {
        this.$jumpTo("/rechargeCont");
        return;
      }
      if (isGuestUser()) {
        this.$bus.emit("openGuestUpgrade");
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
          clearGuestFlags();
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
@purple: #5b1aa8;
@purple-deep: #3a0a6e;
@purple-card: #4c1490;
@green: #31ff6f;
@gold: #ffd400;

.mine-page {
  position: relative;
  min-height: 100%;
  color: #fff;
  padding: 16px 12px 20px;
  box-sizing: border-box;
  overflow-x: clip;
  overflow-y: visible;
  background-color: #27033c;
  background-image: url(@/assets/img/common/page_bg.png);
  background-repeat: repeat;
  background-size: auto;
  background-position: top center;
}

.mine-user {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 2px 10px;
}

.mine-user__avatar {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  overflow: visible;
  border: 2px solid #c084fc;
  box-shadow: 0 0 10px rgba(192, 132, 252, 0.55);
  flex-shrink: 0;
  cursor: pointer;
  box-sizing: border-box;
  background: #2a0a4a;
}

.mine-user__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  border-radius: 50%;
  pointer-events: none;
}

.mine-user__avatar-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: #2a0a4a;
}

.mine-user__vip-badge {
  position: absolute;
  right: -6px;
  bottom: -4px;
  z-index: 2;
  width: 25px;
  height: auto;
  display: block;
  object-fit: contain;
  pointer-events: auto;
  cursor: pointer;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.45));
}

.mine-user__main {
  flex: 1;
  min-width: 0;
}

.mine-user__name {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  cursor: pointer;
  margin-bottom: 10px;

  span {
    font-size: 16px;
    font-weight: 700;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    line-height: 1.2;
  }
}

.mine-user__copy {
  width: 16px;
  height: 16px;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}

.mine-user__progress {
  position: relative;
  cursor: pointer;
  padding-right: 8px;
}

.mine-user__progress-track {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 27px;
  border-radius: 999px;
  background: #000;
  border: 1px solid #5d2e8c;
  overflow: hidden;
  box-sizing: border-box;
  padding: 3px 22px 3px 3px;
}

.mine-user__progress-fill {
  position: absolute;
  left: 3px;
  top: 3px;
  bottom: 3px;
  height: auto;
  border-radius: 999px;
  /* 设计稿：#FAFAA3 → #E96807 */
  background: linear-gradient(180deg, #fafaa3 0%, #e96807 100%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35);
  max-width: calc(100% - 6px);
  pointer-events: none;
}

.mine-user__progress-text {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  margin-left: 6px;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  line-height: 21px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.55);
  white-space: nowrap;
  pointer-events: none;
}

.mine-user__progress-gem {
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translateY(-50%);
  width: 30px;
  height: 30px;
  object-fit: contain;
  z-index: 2;
  pointer-events: none;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.4));
}

.mine-balance {
  position: relative;
  margin-top: 6px;
  padding: 0 12px 14px;
  box-sizing: border-box;
  min-height: 137px;
  background: url(@/assets/img/mine/mabg.png) center / 100% 100% no-repeat;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.mine-balance__amount {
  /* 对齐图一：金额落在金色顶盖正中 */
  position: absolute;
  left: 0;
  right: 0;
  top: 7px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 800;
  line-height: 1;
  letter-spacing: 0.5px;
  color: #fff;
  /* 图一：白字 + 深蓝描边 + 下沉立体；纯 text-shadow，兼容性好 */
  text-shadow:
    -2px -2px 0 #1a3d8e,
    -2px 0 0 #1a3d8e,
    -2px 2px 0 #1a3d8e,
    0 -2px 0 #1a3d8e,
    0 2px 0 #1a3d8e,
    2px -2px 0 #1a3d8e,
    2px 0 0 #1a3d8e,
    2px 2px 0 #1a3d8e,
    -1px -2px 0 #1a3d8e,
    1px -2px 0 #1a3d8e,
    -1px 2px 0 #1a3d8e,
    1px 2px 0 #1a3d8e,
    -2px -1px 0 #1a3d8e,
    2px -1px 0 #1a3d8e,
    -2px 1px 0 #1a3d8e,
    2px 1px 0 #1a3d8e,
    0 3px 0 #152f6e,
    0 4px 0 #152f6e;
  margin: 0;
  z-index: 1;
  pointer-events: none;
}

.mine-balance__stats {
  margin-top: 0;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 14px;
  flex-shrink: 0;
  padding: 0 20px;
  box-sizing: border-box;
}

.mine-balance__stat {
  width: 124px;
  height: 50px;
  min-width: 124px;
  min-height: 50px;
  flex: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 0 6px;
  box-sizing: border-box;
  border-radius: 10px;
  background: #430063;

  .lab {
    font-size: 11px;
    color: #e7deff;
    font-weight: 700;
    line-height: 1.2;
  }

  .val {
    font-size: 13px;
    font-weight: 700;
    color: #ffee00;
    line-height: 1.2;
    white-space: nowrap;
  }

  &.is-green .val {
    color: #99ff00;
  }
}

.mine-qb {
  margin: 12px auto 0;
  padding: 12px 10px;
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  gap: 10px;
  border-radius: 18px;
  background: url(@/assets/img/mine/qb_wrap.png) center / 100% 100% no-repeat;
}

.mine-qb__btn {
  width: 45%;
  padding: 2px;
  box-sizing: border-box;
  border-radius: 26px;
  background: #430063;
  border: 1px solid #6837e3;
}

.mine-qb__cz,
.mine-qb__tx {
  width: 100%;
  height: 47px;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.mine-qb__cz {
  background-image: url(@/assets/img/mine/czmy.png);
}

.mine-qb__tx {
  background-image: url(@/assets/img/mine/txmy.png);
}

.mine-records {
  margin-top: 14px;
  display: flex;
  gap: 8px;
}

.mine-records__item {
  flex: 1;
  min-width: 0;
  cursor: pointer;
}

.mine-records__tile {
  width: 100%;
  min-height: 98px;
  padding: 8px 4px 10px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 16px;
  background: url(@/assets/img/mine/record_tile.png) center / 100% 100%
    no-repeat;
}

.mine-records__icon {
  width: 58%;
  max-width: 64px;
  height: auto;
  object-fit: contain;
  display: block;
  flex-shrink: 0;
}

.mine-records__label {
  font-size: 10px;
  font-weight: 700;
  color: #fff;
  text-align: center;
  line-height: 1.2;
  padding: 0 2px;
  word-break: break-word;
}

.mine-menu {
  margin-top: 14px;
  background: #512275;
  border-radius: 25px;
  overflow: hidden;
}

.mine-menu__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  cursor: pointer;
  border-bottom: 1px solid #250339;

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

.mine-menu__icon {
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex-shrink: 0;
  display: block;
}

.mine-logout {
  padding: 18px 0 4px;
}

.mine-logout__btn {
  /* 样式走公共 .btn-3d-green */
  width: 100%;
}

.logout-popup {
  width: 300px;
  background: #27033c !important;
  border: 1px solid rgba(192, 132, 252, 0.45) !important;
  border-radius: 16px !important;

  &__content {
    padding: 24px 20px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
  }

  &__title {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    color: #fff;
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
    font-size: 14px;
    white-space: nowrap;

    &--cancel {
      .btn-3d-yellow();
      height: 42px;
      font-size: 14px;
    }

    &--confirm {
      .btn-3d-green();
      height: 42px;
      font-size: 14px;
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
