<template>
  <div class="content-c">
    <div style="padding: 10px">
      <div class="bank-card f-t-13 l-h-20">
        <p>{{ $lang.BankInfo_txt12 }}</p>
        <p>{{ $lang.account }}</p>
        <div
          class="bank-card-i d-flex-s"
          v-for="(item, index) in bankCardList"
          :key="index"
        >
          <div class="d-flex" style="flex: 1; min-width: 0">
            <div class="m-l-10">
              <p>
                <span class="font-color"> {{ item.bankName }}</span>
              </p>
              <p class="font-color">
                <span>{{ item.bankCard }}</span>
                <i
                  class="icon iconfont icon-Vector m-l-10"
                  style="font-size: 15px"
                  @click="copyText(item.bankCard)"
                ></i>
              </p>
            </div>
          </div>
          <button
            type="button"
            class="bank-card-delete"
            @click="showDeletePopup(item)"
          >
            {{ $lang.common_delete || "Delete" }}
          </button>
        </div>
      </div>
    </div>

    <div class="bank-card-b">
      <div @click="showBankF" class="bank-card-add-btn">
        <div class="add-bank-card">
          <div class="add-bank-card__icon">
            <i class="icon iconfont icon-yinhangkaweihao"></i>
          </div>
          <div class="add-bank-card__text">
            <p class="add-bank-card__title">{{ $lang.BankInfo_txt6 }}</p>
            <p class="add-bank-card__sub">{{ $lang.BankInfo_txt13 }}</p>
          </div>
        </div>
      </div>

      <van-popup
        v-model:show="showBank"
        class="custom-popup"
        :closeable="false"
        :close-on-click-overlay="false"
      >
        <div class="content-card">
          <p class="f-t-14 t-c m-b-20">
            {{ $lang.BankInfo_txt13 }} {{ $lang.account }}
          </p>
          <van-field
            v-model="realNameInput"
            :placeholder="$lang.common_txt46"
            class="custom-field m-b-20"
            :readonly="realNameIsf"
            :formatter="formatRealName"
            format-trigger="onChange"
          >
            <template #left-icon>
              <i class="icon iconfont icon-shiming m-r-5"></i>
            </template>
          </van-field>
          <div class="p-r" @click="selectF">
            <van-field v-model="bankName" class="custom-field m-t-20" readonly>
              <template #left-icon>
                <i class="icon iconfont icon-renyuan m-r-5"></i>
              </template>
              <template #right-icon>
                <van-icon
                  name="arrow-down"
                  :class="{ 'arrow-up': showSelect }"
                />
              </template>
            </van-field>
            <div v-if="showSelect" class="bank-select">
              <p
                class="bank-select--i"
                v-for="(item, index) in columns"
                :key="index"
                @click="getSelect(index, item)"
                :class="{ 'select-active': index === selectIndex }"
              >
                {{ item.label }}
              </p>
            </div>
          </div>

          <van-field
            ref="accountField"
            v-model="bankCard"
            :placeholder="accountPlaceholder"
            class="custom-field m-t-20 xg-in no-copy"
            :class="{ 'cashtag-field': showCashtagPrefix }"
            @update:model-value="onAccountInput"
          >
            <template #left-icon>
              <span v-if="showCashtagPrefix" class="cashtag-prefix">$</span>
              <i
                v-else
                class="icon iconfont icon-yinhangkaweihao m-r-5"
              ></i>
            </template>
          </van-field>

          <!-- Card: 到期日 MM/YYYY；ACH: 9 位 routing → 接口字段 ifscCard -->
          <van-field
            v-if="showIfscField"
            v-model="ifscCard"
            :placeholder="ifscPlaceholder"
            class="custom-field m-t-20 xg-in"
            :maxlength="ifscMaxLength"
            @update:model-value="onIfscInput"
          >
            <template #left-icon>
              <i class="icon iconfont icon-yinhangkaweihao m-r-5"></i>
            </template>
          </van-field>

          <van-button size="large" class="custom-button m-t-30" @click="submit">
            {{ $lang.Confirmar }}
          </van-button>
        </div>
        <div class="t-c m-t-10">
          <i @click="showBank = false" class="icon iconfont icon-guanbi"></i>
        </div>
      </van-popup>

      <!-- 删除账户：需输入提现密码 -->
      <van-popup
        v-model:show="showDelete"
        class="custom-popup"
        :closeable="false"
        :close-on-click-overlay="true"
      >
        <div class="content-card">
          <p class="f-t-14 t-c m-b-20">
            {{ $lang.bank_txt || "Remove this bank card?" }}
          </p>
          <van-field
            v-model="privacyPwd"
            type="password"
            maxlength="6"
            class="custom-field"
            :placeholder="$lang.bank_pwd_ph || 'Enter withdrawal password'"
          >
            <template #left-icon>
              <van-icon name="lock" class="m-r-5" />
            </template>
          </van-field>
          <div class="bank-delete-actions m-t-20">
            <van-button
              size="large"
              class="bank-delete-cancel"
              @click="showDelete = false"
            >
              {{ $lang.Cancelar || "Cancel" }}
            </van-button>
            <van-button
              size="large"
              class="custom-button"
              :disabled="deleting"
              @click="confirmDelete"
            >
              {{ $lang.Confirmar || "Confirm" }}
            </van-button>
          </div>
        </div>
        <div class="t-c m-t-10">
          <i @click="showDelete = false" class="icon iconfont icon-guanbi"></i>
        </div>
      </van-popup>
    </div>
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
        return (
          this.$lang.account_chime_placeholder || "Username e.g. test888"
        );
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
  },
};
</script>
<style lang="less" scoped>
.content-c {
  z-index: 8;
  padding-bottom: 20px;
  .content-card {
    padding: 10px 15px;
    border-radius: 12px;
    width: 90%;
    background: @cont-bg;
    margin: 0 auto;
  }
  .custom-popup {
    width: 100%;
    background: transparent;
  }
  .bank-card {
    background: @cont-bg;
    border-radius: 5px;
    border: 1px solid @border-color;
    padding: 10px;
  }
  .bank-card-b {
    width: 100%;
    background: transparent;
    padding: 0;
  }
  .bank-card-add-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      135deg,
      #f8e7b0 0%,
      #f0c14b 22%,
      #e8a820 48%,
      #c98a12 72%,
      #f5d78a 100%
    );
    border: 1px solid rgba(255, 230, 160, 0.55);
    border-radius: 16px;
    padding: 18px 22px;
    margin: 20px auto;
    width: 85%;
    cursor: pointer;
    transition:
      transform 0.15s,
      box-shadow 0.15s;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 6px 18px rgba(180, 120, 20, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.45),
      inset 0 -1px 0 rgba(120, 70, 0, 0.25);
  }
  .bank-card-add-btn::before {
    content: "";
    position: absolute;
    top: -40%;
    left: -20%;
    width: 55%;
    height: 180%;
    background: linear-gradient(
      105deg,
      transparent 0%,
      rgba(255, 255, 255, 0.35) 45%,
      transparent 70%
    );
    transform: rotate(12deg);
    pointer-events: none;
  }
  .bank-card-add-btn:active {
    transform: scale(0.98);
    box-shadow: 0 3px 10px rgba(180, 120, 20, 0.28);
  }
  .add-bank-card {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    width: 100%;
    position: relative;
    z-index: 1;
    &__icon {
      flex-shrink: 0;
      width: 46px;
      height: 46px;
      border-radius: 12px;
      background: linear-gradient(160deg, #3a2a12 0%, #1a1208 100%);
      border: 1px solid rgba(255, 220, 140, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: inset 0 1px 0 rgba(255, 230, 160, 0.2);
      .iconfont {
        color: #ffe7a8;
        font-size: 22px;
      }
    }
    &__text {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
    &__title {
      margin: 0;
      color: #2a1a08;
      font-size: 16px;
      font-weight: 800;
      letter-spacing: 0.2px;
      line-height: 1.25;
      text-shadow: 0 1px 0 rgba(255, 245, 210, 0.35);
    }
    &__sub {
      margin: 0;
      color: #5a3a10;
      font-size: 13px;
      font-weight: 600;
      opacity: 0.9;
      line-height: 1.2;
    }
  }
  .bank-card-bi {
    border: 1px solid @border-color;
    border-radius: 8px;
    padding: 10px 8px;
  }
  .bank-card-bim {
    background: @wihte-color;
    padding: 5px;
    border-radius: 5px;
  }
  .iconfont {
    color: @wihte-color;
    font-size: 20px;
  }
  .bank-select {
    position: absolute;
    padding: 10px 0;
    border: 1px solid @border-color;
    border-radius: 10px;
    width: 100%;
    background: @cont-bg;
    z-index: 9;
    color: @font-color;
    height: 150px;
    overflow-y: auto;
  }
  .bank-select--i {
    padding: 10px 10px;
  }
  .select-active {
    background: @primary-gradient;
    font-weight: bold;
    color: @primary-text-on;
  }
  .arrow-up {
    transform: rotate(-180deg);
  }
  .icon-guanbi {
    font-size: 32px;
    color: @wihte-color;
  }
  .cashtag-prefix {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 14px;
    margin-right: 6px;
    color: @wihte-color;
    font-size: 16px;
    font-weight: 700;
    line-height: 1;
  }
  .cashtag-field {
    :deep(.van-field__left-icon) {
      margin-right: 2px;
    }
  }
  .bank-card-i {
    border: 1px solid @border-color;
    padding: 5px;
    border-radius: 7px;
    margin-bottom: 5px;
    align-items: center;
  }
  .bank-card-delete {
    flex-shrink: 0;
    border: none;
    background: transparent;
    color: #ef4444;
    font-size: 13px;
    font-weight: 700;
    padding: 6px 8px;
    cursor: pointer;
  }
  .custom-button {
    &:disabled {
      opacity: 0.55;
      cursor: not-allowed;
    }
  }
  .bank-delete-actions {
    display: flex;
    gap: 10px;
    .van-button {
      flex: 1;
    }
  }
  .bank-delete-cancel {
    background: rgba(255, 255, 255, 0.08) !important;
    color: @wihte-color !important;
    border: none !important;
    border-radius: 22px;
  }
  .icon-yanjing {
    font-size: 28px;
    color: @primary-color;
  }
  .icon-a-Vector1 {
    font-size: 15px;
    margin-right: 2px;
    color: @icon-color;
  }
}
.xg-in {
  :deep(.van-field__left-icon) {
    margin-top: 2px;
  }
}
@media (min-width: 769px) {
  .bank-card-add-btn {
    width: 450px;
  }
}
.no-copy {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
</style>
