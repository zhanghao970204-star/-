<template>
  <div class="wd-tab">
    <div class="wd-balance">
      <div class="wd-balance__row">
        <span>{{ $lang.BankInfo_txt }}</span>
        <em>{{ $formatNumberWithCommas(balance) }}</em>
        <button
          type="button"
          class="wd-balance__refresh"
          @click="toggleRotation"
        >
          <svg
            :class="{ rotating: isRotating }"
            viewBox="0 0 24 24"
            width="13"
            height="13"
            aria-hidden="true"
          >
            <path
              d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3"
              fill="none"
              stroke="#fff"
              stroke-width="2.6"
              stroke-linecap="round"
            />
            <path
              d="M19.8 4.2V9h-4.8"
              fill="none"
              stroke="#fff"
              stroke-width="2.6"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
      <div class="wd-balance__row">
        <span>{{ $lang.BankInfo_txt_withdrawable }}</span>
        <em>{{ $formatNumberWithCommas(balLimit > 0 ? 0 : balWdl) }}</em>
      </div>
      <div class="wd-balance__row wd-balance__row--wrap">
        <span>
          {{ $lang.BankInfo_txt3 }}
          <em>{{ $formatNumberWithCommas(balLimit) }}</em>
          {{ $lang.BankInfo_txt4 }}
        </span>
      </div>
    </div>

    <div class="wd-card">
      <div class="wd-type">
        <span>{{ $lang.BankInfo_txt5 }}</span>
        <span class="wd-type__check" aria-hidden="true"></span>
      </div>
    </div>

    <div class="wd-card">
      <div v-if="bankCardList.length > 0" class="wd-account" @click="selectF">
        <div class="wd-account__main">
          <span>{{ bankName }}({{ bankCard }})</span>
          <van-icon name="arrow-down" :class="{ 'is-up': showSelect }" />
        </div>
        <div v-if="showSelect && columns.length > 0" class="wd-account__list">
          <button
            v-for="(item, index) in columns"
            :key="index"
            type="button"
            class="wd-account__item"
            :class="{ 'is-active': index === selectIndex }"
            @click.stop="getSelect(index, item)"
          >
            {{ item.label }}({{ item.value }})
          </button>
        </div>
      </div>
      <button v-else type="button" class="wd-add-account" @click="gotoBank">
        <img src="@/assets/img/recharge/wd_card_icon.png" alt="" />
        <span>{{ $lang.BankInfo_txt6 }}</span>
      </button>

      <div class="wd-amount">
        <span class="wd-amount__unit">{{ getCurrency }}</span>
        <i class="wd-amount__line"></i>
        <input
          v-model="amount"
          class="wd-amount__input"
          type="number"
          inputmode="decimal"
          :placeholder="
            $lang.BankInfo_txt9 || 'Please enter the withdrawal amount.'
          "
        />
      </div>
    </div>

    <div class="wd-card">
      <p class="wd-pin-label">{{ $lang.BankInfo_txt8 }}</p>
      <div
        class="pin-box"
        :class="{ 'pin-box--focus': pinFocus, 'pin-box--error': !!errorInfo }"
        @click="focusPin"
      >
        <input
          ref="pinInput"
          class="pin-box__native"
          type="tel"
          inputmode="numeric"
          pattern="[0-9]*"
          maxlength="6"
          autocomplete="one-time-code"
          enterkeyhint="done"
          :value="passWord"
          @focus="pinFocus = true"
          @blur="pinFocus = false"
          @input="onPinInput"
        />
        <div class="pin-box__cells" aria-hidden="true">
          <div
            v-for="i in 6"
            :key="'p' + i"
            class="pin-box__cell"
            :class="{
              'is-on': passWord.length >= i,
              'is-caret': pinFocus && passWord.length === i - 1,
            }"
          >
            <i v-if="passWord.length >= i" class="pin-box__dot"></i>
          </div>
        </div>
      </div>
      <p v-if="errorInfo" class="wd-pin-error">{{ errorInfo }}</p>

      <button type="button" class="wd-submit btn-3d-green" @click="submit">
        {{ $lang.Confirmar || "CONFIRM" }}
      </button>
    </div>

    <div class="wd-tips">
      <p class="wd-tips__title">{{ $lang.common_txt318 }}</p>
      <p>{{ $lang.common_txt221 }}</p>
      <p>
        {{ $lang.common_txt222 }}
        {{ withdrawAmountMin }} {{ getCurrency }} {{ $lang.common_txt223 }}
      </p>
      <p>{{ $lang.common_txt224 }}</p>
      <p>{{ $lang.common_txt225 }}</p>
    </div>
  </div>
</template>

<script>
import { WithdrawInit, Withdraw } from "@/api/common";
import md5 from "@/utils/md5";

export default {
  name: "BankInfoTab1",
  data() {
    return {
      bankName: "",
      bankId: null,
      columns: [],
      passWord: "",
      errorInfo: "",
      pinFocus: false,
      amount: null,
      balance: 0,
      balWdl: 0,
      isRotating: false,
      bankCardList: [],
      showSelect: false,
      bankCard: "",
      withdrawAmountSingleMax: 0,
      withdrawAmountMin: 0,
      balLimit: 0,
      selectIndex: 0,
    };
  },
  mounted() {
    this.WithdrawInit();
  },
  methods: {
    focusPin() {
      this.$refs.pinInput && this.$refs.pinInput.focus();
    },
    onPinInput(e) {
      const raw = String(e.target.value || "")
        .replace(/\D/g, "")
        .slice(0, 6);
      this.passWord = raw;
      if (e.target.value !== raw) e.target.value = raw;
      if (raw.length === 6) this.errorInfo = "";
    },
    selectF() {
      this.showSelect = !this.showSelect;
    },
    async submit() {
      if (this.amount < 1) {
        this.$toast({
          message: this.$lang.BankInfo_txt9,
          icon: "info",
        });
      }
      if (this.passWord.length < 6) {
        this.errorInfo = "6 Numeros";
      } else {
        this.errorInfo = "";
      }
      if (this.balLimit > 0) {
        this.$toast({
          message: `${this.$lang.BankInfo_txt3} ${this.$formatNumberWithCommas(this.balLimit)} ${this.getCurrency} ${this.$lang.BankInfo_txt4}`,
          icon: "cross",
        });
        return;
      }

      if (this.balance < this.amount) {
        this.$toast({
          message: this.$lang.BankInfo_txt10,
          icon: "cross",
        });
        return;
      }

      if (
        this.amount < this.withdrawAmountMin ||
        this.amount > this.withdrawAmountSingleMax
      ) {
        this.$toast({
          message: `  ${
            this.$lang.BankInfo_txt11 +
            this.$formatNumberWithCommas(this.withdrawAmountMin)
          } - ${this.$formatNumberWithCommas(this.withdrawAmountSingleMax)}`,
          icon: "cross",
        });
        return;
      }

      if (this.amount !== 0 && this.passWord.length === 6) {
        const data = await Withdraw({
          privacyPwd: md5(this.passWord),
          rechargeFees: 1,
          withdrawAmount: this.amount,
          afterWithdrawAmount: this.amount,
          cardId: this.bankCardList[this.selectIndex].cardId,
        });
        if (data.status === "ok") {
          this.$toast({
            message: this.$lang.Sucesso,
            icon: "success",
          });
          this.amount = null;
          this.passWord = "";
          this.WithdrawInit();
        } else {
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      }
    },
    getSelect(i, v) {
      this.bankCard = v.value;
      this.bankName = v.label;
      this.selectIndex = i;
      this.showSelect = false;
    },
    async WithdrawInit() {
      const data = await WithdrawInit();
      if (data.status === "ok") {
        this.withdrawAmountMin = data.content.withdrawAmountMin;
        this.withdrawAmountSingleMax = data.content.withdrawAmountSingleMax;
        this.balLimit = data.content._balLimit || 0;
        this.balance = data.content._balUsable || 0;
        this.balWdl = data.content._balWdl || 0;
        this.bankCardList = data.content.bankCardList || [];
        this.columns =
          data.content.bankCardList.map((item) => ({
            value: item.bankCard,
            label: item.bankName,
          })) || [];
        if (this.columns.length > 0) {
          this.getSelect(0, this.columns[0]);
        }
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    gotoBank() {
      this.$emit("goToActive", 1);
    },
    toggleRotation() {
      if (this.isRotating) return;
      this.isRotating = true;
      setTimeout(() => {
        this.isRotating = false;
      }, 1000);
      this.WithdrawInit();
    },
  },
};
</script>

<style lang="less" scoped>
@gold: #ffd467;
@panel: linear-gradient(180deg, #7a2190 0%, #532276 100%);

.wd-tab {
  padding: 12px 14px 24px;
  color: #fff;
}

.wd-card {
  margin-top: 12px;
  padding: 14px 14px 16px;
  border-radius: 16px;
  background: #411c59;
  box-sizing: border-box;
}

.wd-balance {
  padding: 16px 16px 14px;
  border-radius: 16px;
  background: #411c59;

  &__row {
    display: flex;
    align-items: center;
    flex-wrap: nowrap;
    gap: 6px;
    font-size: 13px;
    line-height: 1.5;
    color: #fff;

    & + & {
      margin-top: 8px;
    }

    &--wrap {
      flex-wrap: wrap;
    }

    em {
      font-style: normal;
      color: #3ee08a;
      font-weight: 800;
    }
  }

  &__refresh {
    width: 22px;
    height: 22px;
    margin-left: 4px;
    padding: 0;
    border: none;
    border-radius: 50%;
    background: #b06cff;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    flex-shrink: 0;

    svg {
      display: block;
    }
  }
}

.wd-type {
  position: relative;
  margin-top: 0;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 999px;
  border: 1px solid #ffd404;
  background: linear-gradient(90deg, #a42bb8 0%, #4e3fb8 100%);
  box-shadow:
    inset 0 2px 4px 0 rgba(190, 94, 217, 0.9),
    inset 0 -4px 4px 0 rgba(79, 40, 144, 0.53);
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  overflow: hidden;

  &__check {
    position: absolute;
    right: -6px;
    bottom: -8px;
    width: 36px;
    height: 28px;
    background: #ffd404;
    border-radius: 16px 0 0 0;

    &::after {
      content: "";
      position: absolute;
      left: 10px;
      top: 4px;
      width: 5px;
      height: 8px;
      border: solid #5a3a00;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }
}

.wd-account {
  position: relative;

  &__main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    padding: 0 16px;
    border-radius: 999px;
    border: 1.5px solid @gold;
    background: #000;
    box-sizing: border-box;
    cursor: pointer;

    span {
      color: #fff;
      font-size: 14px;
      font-weight: 600;
    }

    .van-icon {
      color: #fff;
      transition: transform 0.2s;

      &.is-up {
        transform: rotate(-180deg);
      }
    }
  }

  &__list {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 6px);
    z-index: 9;
    max-height: 160px;
    overflow-y: auto;
    border-radius: 14px;
    background: #2a0b45;
    border: 1px solid fade(@gold, 40%);
    padding: 6px 0;
  }

  &__item {
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
}

.wd-add-account {
  display: flex;
  align-items: center;
  width: 100%;
  height: 48px;
  padding: 0 16px;
  border: none;
  border-radius: 999px;
  background: linear-gradient(90deg, #6a228c 0%, #8d35a8 55%, #6a228c 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
    flex-shrink: 0;
  }

  span {
    flex: 1;
    text-align: center;
    margin-right: 28px;
  }
}

.wd-amount {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 12px;
  height: 48px;
  padding: 0 16px;
  border-radius: 999px;
  background: #000;
  box-sizing: border-box;

  &__unit {
    color: #fff;
    font-size: 14px;
    font-weight: 800;
    flex-shrink: 0;
  }

  &__line {
    width: 1px;
    height: 16px;
    background: fade(#fff, 45%);
    flex-shrink: 0;
  }

  &__input {
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

.wd-pin-label {
  margin: 0 2px 10px;
  color: #fff;
  font-size: 15px;
  font-weight: 800;
  text-align: center;
}

.wd-pin-error {
  margin: 8px 2px 0;
  color: #ef4444;
  font-size: 12px;
}

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

  &--error {
    border-color: #ef4444;
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

.wd-submit {
  margin-top: 22px;
  font-size: 16px;
  letter-spacing: 1px;
}

.wd-tips {
  margin-top: 22px;
  color: #fff;
  font-size: 13px;
  line-height: 1.55;

  &__title {
    margin: 0 0 8px;
    font-size: 15px;
    font-weight: 800;
    text-align: center;
  }

  p {
    margin: 8px 0 0;
  }
}

@keyframes rotate-and-back {
  0%,
  100% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(360deg);
  }
}

.rotating {
  animation: rotate-and-back 1s linear forwards;
}
</style>
