<template>
  <div class="wd-manage">
    <div class="wd-manage__card">
      <p class="wd-manage__title">{{ $lang.BankInfo_txt12 }}</p>
      <p class="wd-manage__sub">{{ $lang.account }}</p>
      <div
        v-for="(item, index) in bankCardList"
        :key="index"
        class="wd-manage__item"
      >
        <div class="wd-manage__info">
          <p class="wd-manage__name">{{ item.bankName }}</p>
          <p class="wd-manage__num">
            <span>{{ item.bankCard }}</span>
            <i
              class="icon iconfont icon-Vector"
              @click="copyText(item.bankCard)"
            ></i>
          </p>
        </div>
        <button
          type="button"
          class="wd-manage__delete"
          @click="showDeletePopup(item)"
        >
          {{ $lang.common_delete || "Delete" }}
        </button>
      </div>
    </div>

    <button type="button" class="wd-manage__add" @click="showBankF">
      <span class="wd-manage__add-icon">
        <img class="wd-manage__add-frame" src="@/assets/img/recharge/wd_icon_frame.png" alt="" />
        <img class="wd-manage__add-card" src="@/assets/img/recharge/wd_card_icon.png" alt="" />
      </span>
      <span class="wd-manage__add-text">
        <strong>{{ $lang.BankInfo_txt6 || "ADD ACCOUNT" }}</strong>
        <em>{{ $lang.BankInfo_txt13 || "ADD" }}</em>
      </span>
    </button>

    <!-- ADD ACCOUNT popup -->
    <van-popup
      v-model:show="showBank"
      round
      position="center"
      :close-on-click-overlay="true"
      class="wd-popup"
    >
      <div class="wd-popup__head">
        <span>{{ $lang.BankInfo_txt6 || "ADD ACCOUNT" }}</span>
        <button type="button" class="wd-popup__close" @click="showBank = false">
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
      <div class="wd-popup__body">
        <div class="wd-popup__field">
          <div class="wd-popup__input">
            <img
              class="wd-popup__ico"
              src="@/assets/img/recharge/wd_id_card.png"
              alt=""
            />
            <input
              v-model="realNameInput"
              :readonly="realNameIsf"
              :placeholder="$lang.common_txt46 || 'Real Name'"
            />
          </div>
        </div>

        <div class="wd-popup__field wd-popup__field--select" @click="selectF">
          <div class="wd-popup__input">
            <img
              class="wd-popup__ico"
              src="@/assets/img/recharge/wd_user.png"
              alt=""
            />
            <span class="wd-popup__value">{{ bankName }}</span>
            <van-icon name="arrow-down" :class="{ 'is-up': showSelect }" />
          </div>
          <div v-if="showSelect" class="wd-popup__select">
            <button
              v-for="(item, index) in columns"
              :key="index"
              type="button"
              class="wd-popup__option"
              :class="{ 'is-active': index === selectIndex }"
              @click.stop="getSelect(index, item)"
            >
              {{ item.label }}
            </button>
          </div>
        </div>

        <div class="wd-popup__field">
          <div class="wd-popup__input">
            <span v-if="showCashtagPrefix" class="wd-popup__prefix">$</span>
            <img
              v-else
              class="wd-popup__ico"
              src="@/assets/img/recharge/wd_signature.png"
              alt=""
            />
            <input
              v-model="bankCard"
              :placeholder="accountPlaceholder"
              class="no-copy"
              @input="onAccountInput($event.target.value)"
            />
          </div>
        </div>

        <div v-if="showIfscField" class="wd-popup__field">
          <div class="wd-popup__input">
            <img
              class="wd-popup__ico"
              src="@/assets/img/recharge/wd_signature.png"
              alt=""
            />
            <input
              v-model="ifscCard"
              :placeholder="ifscPlaceholder"
              :maxlength="ifscMaxLength"
              @input="onIfscInput($event.target.value)"
            />
          </div>
        </div>

        <button
          type="button"
          class="wd-popup__submit btn-3d-green"
          @click="submit"
        >
          {{ $lang.Confirmar || "CONFIRM" }}
        </button>
      </div>
    </van-popup>

    <!-- Delete popup -->
    <van-popup
      v-model:show="showDelete"
      round
      :close-on-click-overlay="true"
      class="wd-popup"
    >
      <div class="wd-popup__head">
        <span>{{ $lang.bank_txt || "Remove this bank card?" }}</span>
        <button
          type="button"
          class="wd-popup__close"
          @click="showDelete = false"
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
      <div class="wd-popup__body">
        <p class="wd-popup__pin-label">
          {{ $lang.bank_txt2 || "Withdrawal Password" }}
        </p>
        <div
          class="pin-box"
          :class="{ 'pin-box--focus': deletePinFocus }"
          @click="focusDeletePin"
        >
          <input
            ref="deletePin"
            class="pin-box__native"
            type="tel"
            inputmode="numeric"
            pattern="[0-9]*"
            maxlength="6"
            autocomplete="one-time-code"
            enterkeyhint="done"
            :value="privacyPwd"
            @focus="deletePinFocus = true"
            @blur="deletePinFocus = false"
            @input="onDeletePinInput"
          />
          <div class="pin-box__cells" aria-hidden="true">
            <div
              v-for="i in 6"
              :key="'d' + i"
              class="pin-box__cell"
              :class="{
                'is-on': privacyPwd.length >= i,
                'is-caret': deletePinFocus && privacyPwd.length === i - 1,
              }"
            >
              <i v-if="privacyPwd.length >= i" class="pin-box__dot"></i>
            </div>
          </div>
        </div>
        <div class="wd-popup__actions">
          <button
            type="button"
            class="wd-popup__cancel"
            @click="showDelete = false"
          >
            {{ $lang.Cancelar || "Cancel" }}
          </button>
          <button
            type="button"
            class="wd-popup__submit btn-3d-yellow"
            :disabled="deleting"
            @click="confirmDelete"
          >
            {{ $lang.Confirmar || "CONFIRM" }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import {
  AddBankCardInit,
  AddBankCard,
  BankCardInfo,
  DelBankCard,
  WithdrawInit,
} from "@/api/common";
import md5 from "@/utils/md5";
import {
  normalizeBankType,
  needsIfscCard,
  needsDollarPrefix,
  formatCardExpiryInput,
  formatAchRoutingInput,
  formatCashtagBodyInput,
  formatRealNameInput,
  validateAddAccountForm,
  buildAddBankCardPayload,
} from "@/utils/bankAccountValidate";

export default {
  name: "BankInfoTab2",
  components: {},
  props: {},
  data() {
    return {
      bankName: "",
      realName: "",
      realNameIsf: false,
      bankId: null,
      showBank: false,
      bankCard: "",
      ifscCard: "",
      columns: [],
      showSelect: false,
      selectIndex: 0,
      bankCardList: [],
      vipLevel: null,
      cpf: "",
      cpfIsf: false,
      loading: false,
      showDelete: false,
      deleteCardId: null,
      privacyPwd: "",
      deleting: false,
      deletePinFocus: false,
    };
  },
  computed: {
    bankType() {
      return normalizeBankType(this.bankName);
    },
    showIfscField() {
      return needsIfscCard(this.bankName);
    },
    showCashtagPrefix() {
      return needsDollarPrefix(this.bankName);
    },
    ifscPlaceholder() {
      if (this.bankType === "ach") {
        return (
          this.$lang.account_routing_placeholder || "Routing number (9 digits)"
        );
      }
      return this.$lang.account_expiry_placeholder || "Expiry (MM/YYYY)";
    },
    ifscMaxLength() {
      return this.bankType === "ach" ? 9 : 7;
    },
    accountPlaceholder() {
      if (this.bankType === "paypal") {
        return this.$lang.account_paypal_placeholder || "PayPal Email";
      }
      if (this.bankType === "card") {
        return this.$lang.account_card_placeholder || "Bank card number";
      }
      if (this.bankType === "ach") {
        return this.$lang.account_ach_placeholder || "Bank account number";
      }
      if (this.bankType === "cashapp") {
        return (
          this.$lang.account_cashapp_placeholder ||
          "Username e.g. JohnSmith, abc123"
        );
      }
      if (this.bankType === "chime") {
        return this.$lang.account_chime_placeholder || "Username e.g. test888";
      }
      return this.$lang.account_contact_placeholder;
    },
    realNameInput: {
      get() {
        return this.realName;
      },
      set(value) {
        if (!this.realNameIsf) {
          this.realName = formatRealNameInput(value);
        }
      },
    },
  },
  created() {},
  mounted() {
    this.WithdrawInit();
    this.BankCardInfo();
    this.AddBankCardInit();
  },
  watch: {
    bankName() {
      this.ifscCard = "";
      this.bankCard = "";
    },
  },
  methods: {
    formatRealName(value) {
      return formatRealNameInput(value);
    },
    async WithdrawInit() {
      const data = await WithdrawInit();
      if (data.status === "ok") {
        this.vipLevel = data.content.vipLevel;
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    // 格式化银行卡号
    formatCardNumber(cardNumber) {
      if (!cardNumber) return "";
      const length = cardNumber.length;
      if (length <= 4) return cardNumber;
      const stars = "******";
      return stars + cardNumber.slice(-4);
    },
    copyText(v) {
      const textarea = document.createElement("textarea");
      textarea.value = v;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({
        message: this.$lang.Sucesso,
        icon: "success",
      });
    },
    showDeletePopup(item) {
      if (!item || !item.cardId) {
        this.$toast({
          message: "Missing cardId, cannot delete",
          icon: "cross",
        });
        return;
      }
      this.deleteCardId = item.cardId;
      this.privacyPwd = "";
      this.showDelete = true;
    },
    async confirmDelete() {
      if (this.deleting) return;
      if (!this.privacyPwd) {
        this.$toast({
          message: this.$lang.bank_txt2 || "Enter Withdrawal Password",
          icon: "cross",
        });
        return;
      }
      if (!this.deleteCardId) {
        this.$toast({ message: "Missing cardId", icon: "cross" });
        return;
      }
      this.deleting = true;
      try {
        const data = await DelBankCard({
          privacyPwd: md5(this.privacyPwd),
          cardId: this.deleteCardId,
        });
        if (data.status === "ok") {
          this.showDelete = false;
          this.privacyPwd = "";
          this.deleteCardId = null;
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
          await this.BankCardInfo();
        } else {
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.deleting = false;
      }
    },
    showBankF() {
      this.showBank = true;
      this.bankCard = "";
      this.ifscCard = "";
      this.AddBankCardInit();
    },
    async BankCardInfo() {
      this.loading = true;
      const data = await BankCardInfo();
      if (data.status === "ok") {
        this.bankCardList = data.content.bankCardList || [];
        this.bankCardList.forEach((i) => {
          i["isSee"] = false;
        });
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
      this.loading = false; // 补充关闭loading
    },
    onAccountInput(val) {
      // Cash App / Chime：输入框只存用户名，$ 固定展示在左侧，避免改写光标错位
      if (needsDollarPrefix(this.bankName)) {
        const next = formatCashtagBodyInput(val);
        if (next !== this.bankCard) this.bankCard = next;
      }
    },
    onIfscInput(val) {
      if (this.bankType === "ach") {
        this.ifscCard = formatAchRoutingInput(val);
      } else if (this.bankType === "card") {
        this.ifscCard = formatCardExpiryInput(val);
      }
    },
    async submit() {
      const check = validateAddAccountForm({
        realName: this.realName,
        bankName: this.bankName,
        bankCard: this.bankCard,
        ifscCard: this.ifscCard,
      });
      if (!check.ok) {
        this.$toast({
          message:
            (check.messageKey && this.$lang[check.messageKey]) || check.message,
          icon: "cross",
        });
        return;
      }

      const params = buildAddBankCardPayload({
        bankName: this.bankName,
        bankId: this.bankId,
        bankCard: this.bankCard,
        realName: this.realName,
        ifscCard: this.ifscCard,
      });
      const data = await AddBankCard(params);
      if (data.status === "ok") {
        this.showBank = false;
        this.bankCard = "";
        this.ifscCard = "";
        this.BankCardInfo();
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    getSelect(i, v) {
      this.bankId = v.value;
      this.bankName = v.label;
      this.selectIndex = i;
      this.ifscCard = "";
      this.showSelect = false;
    },
    async AddBankCardInit() {
      const data = await AddBankCardInit();
      if (data.status === "ok") {
        if (data.content.realName) {
          this.realName = data.content.realName;
          this.realNameIsf = true;
        } else {
          this.realNameIsf = false;
        }

        this.columns = data.content.bankList.map((item) => ({
          value: item.bankId,
          label: item.bankName,
        }));
        // 防止bankList为空导致报错
        if (this.columns.length > 0) {
          this.getSelect(0, this.columns[0]);
        }
      }
    },
    selectF() {
      this.showSelect = !this.showSelect;
    },
    focusDeletePin() {
      this.$refs.deletePin && this.$refs.deletePin.focus();
    },
    onDeletePinInput(e) {
      const raw = String(e.target.value || "")
        .replace(/\D/g, "")
        .slice(0, 6);
      this.privacyPwd = raw;
      if (e.target.value !== raw) e.target.value = raw;
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffd467;
@panel: linear-gradient(180deg, #7a2190 0%, #532276 100%);

.wd-manage {
  padding: 12px 14px 28px;
  color: #fff;

  &__card {
    padding: 16px 16px 14px;
    border-radius: 16px;
    border: 1.5px solid @gold;
    background: linear-gradient(180deg, #7a2a9a 0%, #5a1d78 100%);
  }

  &__title {
    margin: 0;
    font-size: 15px;
    font-weight: 800;
    color: #fff;
  }

  &__sub {
    margin: 6px 0 0;
    font-size: 13px;
    color: #fff;
    text-transform: capitalize;
  }

  &__item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-top: 12px;
    padding: 12px;
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.22);
  }

  &__info {
    flex: 1;
    min-width: 0;
  }

  &__name {
    margin: 0;
    font-size: 14px;
    font-weight: 700;
    color: #fff;
  }

  &__num {
    margin: 4px 0 0;
    font-size: 13px;
    color: fade(#fff, 85%);
    display: flex;
    align-items: center;
    gap: 8px;

    .iconfont {
      font-size: 14px;
      color: @gold;
      cursor: pointer;
    }
  }

  &__delete {
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: #ef4444;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    padding: 6px 4px;
  }

  &__add {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    margin-top: 16px;
    padding: 14px 16px;
    border: none;
    border-radius: 18px;
    background: url("@/assets/img/recharge/wd_add_bg.png") center / 100% 100% no-repeat;
    box-shadow: 0 8px 18px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    text-align: left;
    overflow: hidden;
  }

  &__add-icon {
    position: relative;
    width: 52px;
    height: 52px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  &__add-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  &__add-card {
    position: relative;
    z-index: 1;
    width: 30px;
    height: 30px;
    object-fit: contain;
  }

  &__add-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    strong {
      color: @gold;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.4px;
      text-transform: uppercase;
    }

    em {
      font-style: normal;
      color: #fff;
      font-size: 13px;
      font-weight: 700;
      text-transform: uppercase;
    }
  }
}

.wd-popup {
  width: 88% !important;
  max-width: 360px;
  background: #7a2190 !important;
  border-radius: 18px !important;
  overflow: hidden;

  &__head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 44px;
    background: #532276;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
  }

  &__close {
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
    padding: 18px 20px 24px;
    background: #7a2190;
  }

  &__field {
    position: relative;
    margin-bottom: 14px;

    &--select {
      cursor: pointer;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 48px;
    padding: 0 16px;
    background: #000;
    border-radius: 999px;
    box-sizing: border-box;

    &:focus-within {
      box-shadow: 0 0 0 1px #ffd400;
    }

    input {
      flex: 1;
      min-width: 0;
      height: 48px;
      border: none;
      outline: none;
      background: transparent;
      color: #fff;
      font-size: 14px;

      &::placeholder {
        color: #9b86c9;
      }
    }
  }

  &__ico {
    width: 18px;
    height: 18px;
    object-fit: contain;
    flex-shrink: 0;
    filter: brightness(0) invert(1);
  }

  &__prefix {
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    flex-shrink: 0;
  }

  &__value {
    flex: 1;
    min-width: 0;
    color: #fff;
    font-size: 14px;
  }

  .van-icon {
    color: #fff;
    transition: transform 0.2s;

    &.is-up {
      transform: rotate(-180deg);
    }
  }

  &__select {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 6px);
    z-index: 10;
    max-height: 130px;
    overflow-y: auto;
    border-radius: 14px;
    background: #2a0b45;
    border: 1px solid fade(@gold, 40%);
    padding: 6px 0;
  }

  &__option {
    display: block;
    width: 100%;
    padding: 12px 16px;
    border: none;
    background: transparent;
    color: #fff;
    font-size: 13px;
    text-align: left;
    cursor: pointer;

    &.is-active {
      background: fade(@gold, 18%);
      color: @gold;
      font-weight: 700;
    }
  }

  &__submit {
    margin-top: 8px;
    font-size: 16px;
    letter-spacing: 1px;

    &:disabled {
      opacity: 0.55;
    }
  }

  &__actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;

    .wd-popup__submit {
      flex: 1;
      margin-top: 0;
    }
  }

  &__cancel {
    flex: 1;
    height: 48px;
    border: none;
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
  }

  &__pin-label {
    margin: 0 0 8px;
    color: #fff;
    font-size: 14px;
    font-weight: 600;
  }
}

/* 与设置提现密码页同一套 PIN 框 */
.pin-box {
  position: relative;
  height: 52px;
  border-radius: 12px;
  background: #000;
  border: 1px solid #c9b3ff;
  box-sizing: border-box;
  overflow: hidden;
  cursor: text;

  &--focus {
    border-color: #e93dfe;
    box-shadow: 0 0 0 1px rgba(233, 61, 254, 0.35);
  }

  &__native {
    position: absolute;
    inset: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    opacity: 0.02;
    border: 0;
    background: transparent;
    color: transparent;
    caret-color: transparent;
    font-size: 16px;
    outline: none;
  }

  &__cells {
    position: relative;
    z-index: 1;
    display: flex;
    height: 100%;
  }

  &__cell {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    border-right: 1px solid rgba(201, 179, 255, 0.55);
    box-sizing: border-box;

    &:last-child {
      border-right: none;
    }

    &.is-caret::after {
      content: "";
      width: 2px;
      height: 22px;
      border-radius: 1px;
      background: #e93dfe;
      animation: pin-caret 1s step-end infinite;
    }
  }

  &__dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #fff;
    display: block;
  }
}

@keyframes pin-caret {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}

.no-copy {
  -webkit-user-select: none;
  user-select: none;
}
</style>

<style lang="less">
.wd-popup.van-popup {
  width: 88% !important;
  max-width: 360px;
  background: #7a2190 !important;
  border-radius: 18px !important;
  overflow: hidden;
}
</style>
