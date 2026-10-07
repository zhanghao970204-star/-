<template>
  <div class="bank-page">
    <title-bar :title="$lang.bank_title || 'Bank Card'" />

    <!-- Empty State -->
    <div v-if="!BankList.length" class="bank-empty">
      <div class="bank-empty__icon">
        <img src="@/assets/img/mine/bank_id_card.png" alt="" />
      </div>
      <p class="bank-empty__title">{{ $lang.bank_empty || "No Bank Card" }}</p>
      <p class="bank-empty__desc">
        {{ $lang.bank_empty_desc || "Add a bank card for withdrawals" }}
      </p>
      <button class="bank-add-btn" type="button" @click="onClickRight">
        + {{ $lang.bank_add || "ADD BANK CARD" }}
      </button>
    </div>

    <!-- Bank Card List -->
    <div v-else class="bank-list">
      <div v-for="(item, index) in BankList" :key="index" class="bank-card">
        <img
          class="bank-card__bg"
          src="@/assets/img/mine/bank_card_bg.png"
          alt=""
        />
        <div class="bank-card__body">
          <div class="bank-card__bank-icon">
            <img
              class="bank-card__icon-frame"
              src="@/assets/img/mine/bank_icon_frame.png"
              alt=""
            />
            <img
              class="bank-card__icon-img"
              src="@/assets/img/mine/bank_id_card.png"
              alt=""
            />
          </div>
          <div class="bank-card__info">
            <span class="bank-card__name">{{ item.bankName }}</span>
            <span v-if="item.isSee" class="bank-card__full">{{
              item.bankCard
            }}</span>
            <span v-else class="bank-card__masked">{{
              formatCardNumber(item.bankCard)
            }}</span>
          </div>
          <div class="bank-card__side">
            <button
              type="button"
              class="bank-card__circle-btn"
              @click="showDeletePopup(item.cardId)"
            >
              <img src="@/assets/img/mine/bank_trash.png" alt="" />
            </button>
            <div class="bank-card__actions">
              <button
                type="button"
                class="bank-card__circle-btn"
                @click="copyText(item.bankCard)"
              >
                <img src="@/assets/img/mine/bank_copy.png" alt="" />
              </button>
              <button
                type="button"
                class="bank-card__circle-btn"
                @click="toggleSee(item)"
              >
                <img :src="item.isSee ? bankEyeOff : bankEye" alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <button class="bank-add-btn" type="button" @click="onClickRight">
        + {{ $lang.bank_add || "ADD BANK CARD" }}
      </button>
    </div>

    <!-- Delete Confirmation Popup -->
    <van-popup
      v-model:show="isShow"
      round
      :close-on-click-overlay="true"
      class="delete-popup"
    >
      <div class="delete-popup__head">
        <span>{{ $lang.bank_txt || "Remove Bank Card" }}</span>
        <button type="button" class="bank-popup-close" @click="isShow = false">
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
      <div class="delete-popup__content">
        <div class="delete-popup__field">
          <label>{{ $lang.bank_txt2 || "Withdrawal Password" }}</label>
          <div
            class="delete-popup__input"
            :class="{ 'delete-popup__input--focus': focus }"
          >
            <input
              v-model="privacyPwd"
              type="password"
              :placeholder="$lang.bank_pwd_ph || 'Enter withdrawal password'"
              @focus="focus = true"
              @blur="focus = false"
            />
          </div>
        </div>
        <button
          type="button"
          class="delete-popup__confirm"
          @click="Confirm(deleteCardId)"
        >
          {{ $lang.Confirmar || "CONFIRM" }}
        </button>
      </div>
    </van-popup>

    <!-- Add Bank Card Popup -->
    <van-popup
      v-model:show="showAddPopup"
      round
      :close-on-click-overlay="true"
      class="add-popup"
    >
      <div class="add-popup__head">
        <span>{{ $lang.BankInfo_txt13 || "ADD ACCOUNT" }}</span>
        <button
          type="button"
          class="bank-popup-close"
          @click="showAddPopup = false"
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
      <div class="add-popup__content">

        <!-- Real Name -->
        <div class="add-popup__field">
          <label>{{ $lang.common_txt46 || "Real Name" }}</label>
          <div class="add-popup__input">
            <input
              v-model="addRealName"
              :readonly="addRealNameReadonly"
              :placeholder="$lang.common_txt46 || 'Enter real name'"
              @input="onRealNameInput"
            />
          </div>
        </div>

        <!-- Bank Name Selector -->
        <div class="add-popup__field">
          <label>{{ $lang.bank_title || "Bank" }}</label>
          <div
            class="add-popup__input add-popup__input--select"
            @click="toggleBankSelect"
          >
            <span :class="{ 'add-popup__placeholder': !addBankName }">{{
              addBankName || "Select bank"
            }}</span>
            <van-icon
              :name="showBankSelect ? 'arrow-up' : 'arrow-down'"
              size="14"
              color="#b8a8d4"
            />
          </div>
          <div v-if="showBankSelect" class="add-popup__dropdown">
            <div
              v-for="(item, idx) in addBankColumns"
              :key="idx"
              class="add-popup__dropdown-item"
              :class="{
                'add-popup__dropdown-item--active': idx === addSelectIndex,
              }"
              @click="selectBank(idx, item)"
            >
              {{ item.label }}
            </div>
          </div>
        </div>

        <!-- Phone / Email / Bank card -->
        <div class="add-popup__field">
          <label>{{ accountPlaceholder }}</label>
          <div class="add-popup__input">
            <span v-if="showCashtagPrefix" class="add-popup__cashtag">$</span>
            <input
              v-model="addBankCard"
              :placeholder="accountPlaceholder"
              @input="onAccountInput"
            />
          </div>
        </div>

        <!-- Card: expiry MM/YYYY；ACH: 9-digit routing → ifscCard -->
        <div v-if="showIfscField" class="add-popup__field">
          <label>{{ ifscLabel }}</label>
          <div class="add-popup__input">
            <input
              v-model="addIfscCard"
              :placeholder="ifscPlaceholder"
              :maxlength="ifscMaxLength"
              @input="onIfscInput"
            />
          </div>
        </div>

        <button
          type="button"
          class="add-popup__confirm"
          :disabled="addSubmitting"
          @click="submitAddBank"
        >
          {{
            addSubmitting
              ? $lang.common_loading || "Loading..."
              : $lang.Confirmar || "CONFIRM"
          }}
        </button>
      </div>
    </van-popup>
  </div>
</template>

<script>
import bankEye from "@/assets/img/mine/bank_eye.svg";
import bankEyeOff from "@/assets/img/mine/bank_eye_off.svg";
import {
  BankCardInfo,
  DelBankCard,
  AddBankCardInit,
  AddBankCard,
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
  name: "Bank",
  data() {
    return {
      bankEye,
      bankEyeOff,
      BankList: [],
      isShow: false,
      focus: false,
      privacyPwd: "",
      deleteCardId: null,
      // Add bank card popup
      showAddPopup: false,
      addRealName: "",
      addRealNameReadonly: false,
      addBankName: "",
      addBankId: null,
      addBankCard: "",
      addIfscCard: "",
      addBankColumns: [],
      showBankSelect: false,
      addSelectIndex: 0,
      addSubmitting: false,
    };
  },
  computed: {
    bankType() {
      return normalizeBankType(this.addBankName);
    },
    showIfscField() {
      return needsIfscCard(this.addBankName);
    },
    showCashtagPrefix() {
      return needsDollarPrefix(this.addBankName);
    },
    ifscLabel() {
      if (this.bankType === "ach") {
        return this.$lang.account_routing_label || "Routing Number";
      }
      return this.$lang.account_expiry_label || "Expiry Date";
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
  },
  mounted() {
    this.BankCardInfo();
  },
  methods: {
    formatCardNumber(cardNumber) {
      if (!cardNumber) return "";
      if (cardNumber.length <= 4) return cardNumber;
      return "**** **** " + cardNumber.slice(-4);
    },
    toggleSee(item) {
      item["isSee"] = !item.isSee;
    },
    copyText(v) {
      const textarea = document.createElement("textarea");
      textarea.value = v;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      this.$toast({ message: this.$lang.Sucesso, icon: "success" });
    },
    showDeletePopup(cardId) {
      this.deleteCardId = cardId;
      this.privacyPwd = "";
      this.isShow = true;
    },
    async Confirm(cardId) {
      if (!this.privacyPwd) {
        this.$toast({
          message: this.$lang.bank_txt2 || "Enter Withdrawal Password",
          icon: "cross",
        });
        return;
      }
      const data = await DelBankCard({
        privacyPwd: md5(this.privacyPwd),
        cardId: cardId,
      });
      if (data.status === "ok") {
        this.isShow = false;
        await this.BankCardInfo();
        this.$toast({ message: this.$lang.Sucesso, icon: "success" });
      } else {
        this.$toast({ message: data.msg, icon: "cross" });
      }
    },
    onClickRight() {
      this.showAddPopup = true;
      this.addBankCard = "";
      this.addIfscCard = "";
      this.fetchAddBankCardInit();
    },
    async fetchAddBankCardInit() {
      const data = await AddBankCardInit();
      if (data.status === "ok") {
        if (data.content.realName) {
          this.addRealName = data.content.realName;
          this.addRealNameReadonly = true;
        } else {
          this.addRealName = "";
          this.addRealNameReadonly = false;
        }
        this.addBankColumns = (data.content.bankList || []).map((item) => ({
          value: item.bankId,
          label: item.bankName,
        }));
        if (this.addBankColumns.length > 0) {
          this.addBankId = this.addBankColumns[0].value;
          this.addBankName = this.addBankColumns[0].label;
          this.addSelectIndex = 0;
          this.addIfscCard = "";
        }
      }
    },
    toggleBankSelect() {
      this.showBankSelect = !this.showBankSelect;
    },
    selectBank(index, item) {
      this.addBankId = item.value;
      this.addBankName = item.label;
      this.addSelectIndex = index;
      this.showBankSelect = false;
      this.addIfscCard = "";
      this.addBankCard = "";
    },
    onRealNameInput(e) {
      if (this.addRealNameReadonly) return;
      const val = e && e.target ? e.target.value : e;
      const next = formatRealNameInput(val);
      if (next !== this.addRealName) this.addRealName = next;
    },
    onAccountInput(e) {
      const val = e && e.target ? e.target.value : e;
      if (needsDollarPrefix(this.addBankName)) {
        const next = formatCashtagBodyInput(val);
        if (next !== this.addBankCard) this.addBankCard = next;
      }
    },
    onIfscInput(e) {
      const val = e && e.target ? e.target.value : e;
      if (this.bankType === "ach") {
        this.addIfscCard = formatAchRoutingInput(val);
      } else if (this.bankType === "card") {
        this.addIfscCard = formatCardExpiryInput(val);
      }
    },
    async submitAddBank() {
      const check = validateAddAccountForm({
        realName: this.addRealName,
        bankName: this.addBankName,
        bankCard: this.addBankCard,
        ifscCard: this.addIfscCard,
      });
      if (!check.ok) {
        this.$toast({
          message:
            (check.messageKey && this.$lang[check.messageKey]) || check.message,
          icon: "cross",
        });
        return;
      }
      this.addSubmitting = true;
      try {
        const data = await AddBankCard(
          buildAddBankCardPayload({
            bankName: this.addBankName,
            bankId: this.addBankId,
            bankCard: this.addBankCard,
            realName: this.addRealName,
            ifscCard: this.addIfscCard,
          }),
        );
        if (data.status === "ok") {
          this.showAddPopup = false;
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
          await this.BankCardInfo();
        } else {
          this.$toast({ message: data.msg, icon: "cross" });
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.addSubmitting = false;
      }
    },
    async BankCardInfo() {
      const data = await BankCardInfo();
      if (data.status === "ok") {
        this.BankList = data.content.bankCardList || [];
        this.BankList.forEach((i) => {
          i["isSee"] = false;
        });
      } else {
        this.$toast({ message: data.msg, icon: "cross" });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@muted: #d7a2fa;
@gold: #ffd467;

.bank-page {
  min-height: 100vh;
  background: transparent;
  padding-bottom: 40px;
}

.bank-popup-close {
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

// ====== EMPTY STATE ======
.bank-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 24px;
  text-align: center;

  &__icon {
    width: 88px;
    height: 88px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 72px;
      height: auto;
      object-fit: contain;
    }
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
    margin: 0 0 8px;
  }

  &__desc {
    font-size: 13px;
    color: @muted;
    margin: 0 0 32px;
  }
}

// ====== BANK CARD ======
.bank-list {
  padding: 12px 14px 20px;
}

.bank-card {
  position: relative;
  margin-bottom: 14px;
  border-radius: 18px;
  overflow: hidden;
  min-height: 96px;

  &__bg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    pointer-events: none;
  }

  &__body {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 96px;
    padding: 16px 14px;
    box-sizing: border-box;
  }

  &__bank-icon {
    position: relative;
    width: 52px;
    height: 52px;
    flex-shrink: 0;
  }

  &__icon-frame {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: fill;
  }

  &__icon-img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 30px;
    height: 30px;
    transform: translate(-50%, -50%);
    object-fit: contain;
  }

  &__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 6px;
  }

  &__name {
    font-size: 16px;
    font-weight: 800;
    color: @gold;
    text-transform: uppercase;
    line-height: 1.2;
  }

  &__full,
  &__masked {
    font-size: 13px;
    font-weight: 600;
    color: #fff;
    letter-spacing: 0.4px;
    line-height: 1.2;
    word-break: break-all;
  }

  &__side {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: space-between;
    align-self: stretch;
    gap: 10px;
    flex-shrink: 0;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  &__circle-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 50%;
    background: #f2b000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);

    img {
      width: 14px;
      height: 14px;
      object-fit: contain;
      display: block;
    }
  }
}

.bank-add-btn {
  .btn-3d-green();
  margin-top: 8px;
  height: 50px;
  font-size: 15px;
}

// ====== DELETE POPUP ======
.delete-popup {
  width: 88% !important;
  max-width: 360px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  border-radius: 18px !important;
  overflow: hidden;

  &__head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 44px;
    background: #512275;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }

  &__content {
    padding: 18px 20px 24px;
  }

  &__field {
    width: 100%;
    margin-bottom: 20px;

    label {
      display: block;
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 16px;
    background: #000;
    border-radius: 25px;
    box-sizing: border-box;

    &--focus {
      box-shadow: 0 0 0 1px #ffd400;
    }

    input {
      flex: 1;
      height: 48px;
      line-height: 48px;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: #9b86c9;
      }
    }
  }

  &__confirm {
    .btn-3d-green();
  }
}

// ====== ADD POPUP ======
.add-popup {
  width: 88% !important;
  max-width: 360px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%) !important;
  border-radius: 18px !important;
  overflow: hidden;

  &__head {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 16px 44px;
    background: #512275;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
    text-transform: uppercase;
  }

  &__content {
    padding: 18px 20px 24px;
  }

  &__field {
    margin-bottom: 14px;
    position: relative;

    label {
      display: block;
      margin: 0 0 8px;
      font-size: 14px;
      font-weight: 600;
      color: #fff;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 16px;
    background: #000;
    border-radius: 25px;
    box-sizing: border-box;

    &:focus-within {
      box-shadow: 0 0 0 1px #ffd400;
    }

    input {
      flex: 1;
      height: 48px;
      line-height: 48px;
      background: transparent;
      border: none;
      color: #fff;
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: #9b86c9;
      }

      &[readonly] {
        color: @muted;
      }
    }

    &--select {
      cursor: pointer;
      justify-content: space-between;

      span {
        font-size: 14px;
        color: #fff;
      }
    }
  }

  &__cashtag {
    color: #fff;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
    line-height: 1;
  }

  &__placeholder {
    color: #9b86c9 !important;
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #2a0b45;
    border: 1px solid rgba(233, 61, 254, 0.35);
    border-radius: 12px;
    max-height: 160px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &__dropdown-item {
    padding: 10px 14px;
    font-size: 13px;
    color: #fff;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child {
      border-bottom: none;
    }

    &:active {
      background: rgba(255, 255, 255, 0.06);
    }

    &--active {
      color: @gold;
      font-weight: 700;
    }
  }

  &__confirm {
    .btn-3d-green();
    margin-top: 8px;
  }
}

@media (min-width: 769px) {
  .bank-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
