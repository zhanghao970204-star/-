<template>
  <div class="bank-page">
    <title-bar :title="$lang.bank_title || 'Bank Card'" />

    <!-- Empty State -->
    <div v-if="!BankList.length" class="bank-empty">
      <div class="bank-empty__icon">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="#a89b7c"><path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/></svg>
      </div>
      <p class="bank-empty__title">{{ $lang.bank_empty || 'No Bank Card' }}</p>
      <p class="bank-empty__desc">{{ $lang.bank_empty_desc || 'Add a bank card for withdrawals' }}</p>
      <button class="bank-add-btn" @click="onClickRight">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span>{{ $lang.bank_add || 'Add Bank Card' }}</span>
      </button>
    </div>

    <!-- Bank Card List -->
    <div v-else class="bank-list">
      <div
        v-for="(item, index) in BankList"
        :key="index"
        class="bank-card"
      >
        <div class="bank-card__top">
          <div class="bank-card__bank-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffa300"><path d="M4 10v7h3v-7H4zm6 0v7h3v-7h-3zM2 22h19v-3H2v3zm14-12v7h3v-7h-3zm-4.5-9L2 6v2h19V6l-9.5-5z"/></svg>
          </div>
          <span class="bank-card__name">{{ item.bankName }}</span>
          <button class="bank-card__delete" @click="showDeletePopup(item.cardId)">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#a89b7c"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
          </button>
        </div>

        <div class="bank-card__number">
          <span v-if="item.isSee" class="bank-card__full">{{ item.bankCard }}</span>
          <span v-else class="bank-card__masked">{{ formatCardNumber(item.bankCard) }}</span>
          <div class="bank-card__actions">
            <button class="bank-card__action" @click="copyText(item.bankCard)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#a89b7c"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>
            </button>
            <button class="bank-card__action" @click="toggleSee(item)">
              <svg v-if="item.isSee" width="18" height="18" viewBox="0 0 24 24" fill="#ffa300"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
              <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="#a89b7c"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46A11.804 11.804 0 001 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>
            </button>
          </div>
        </div>

        <div class="bank-card__decoration">
          <div class="bank-card__circle bank-card__circle--1"></div>
          <div class="bank-card__circle bank-card__circle--2"></div>
        </div>
      </div>

      <!-- Add More Button -->
      <button class="bank-add-btn bank-add-btn--outline" @click="onClickRight">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        <span>{{ $lang.bank_add || 'Add Bank Card' }}</span>
      </button>
    </div>

    <!-- Delete Confirmation Popup -->
    <van-popup v-model:show="isShow" round :close-on-click-overlay="true" class="delete-popup">
      <div class="delete-popup__content">
        <div class="delete-popup__icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="#ef4444"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
        </div>
        <p class="delete-popup__title">{{ $lang.bank_txt || 'Remove this bank card?' }}</p>
        <div class="delete-popup__field">
          <label>{{ $lang.bank_txt2 || 'Withdrawal Password' }}</label>
          <div class="delete-popup__input" :class="{ 'delete-popup__input--focus': focus }">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#a89b7c"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM12 17c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zM9 8V6c0-1.66 1.34-3 3-3s3 1.34 3 3v2H9z"/></svg>
            <input
              v-model="privacyPwd"
              type="password"
              :placeholder="$lang.bank_pwd_ph || 'Enter withdrawal password'"
              @focus="focus = true"
              @blur="focus = false"
            />
          </div>
        </div>
        <div class="delete-popup__actions">
          <button class="delete-popup__btn delete-popup__btn--cancel" @click="isShow = false">
            {{ $lang.Cancelar || 'Cancel' }}
          </button>
          <button class="delete-popup__btn delete-popup__btn--confirm" @click="Confirm(deleteCardId)">
            {{ $lang.Confirmar || 'Confirm' }}
          </button>
        </div>
      </div>
    </van-popup>

    <!-- Add Bank Card Popup -->
    <van-popup v-model:show="showAddPopup" round :close-on-click-overlay="true" class="add-popup">
      <div class="add-popup__content">
        <h3 class="add-popup__title">{{ $lang.BankInfo_txt13 || 'Add Bank Card' }}</h3>

        <!-- Real Name -->
        <div class="add-popup__field">
          <label>{{ $lang.common_txt46 || 'Real Name' }}</label>
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
          <label>{{ $lang.bank_title || 'Bank' }}</label>
          <div class="add-popup__input add-popup__input--select" @click="toggleBankSelect">
            <span :class="{ 'add-popup__placeholder': !addBankName }">{{ addBankName || 'Select bank' }}</span>
            <van-icon :name="showBankSelect ? 'arrow-up' : 'arrow-down'" size="14" color="#a89b7c" />
          </div>
          <div v-if="showBankSelect" class="add-popup__dropdown">
            <div
              v-for="(item, idx) in addBankColumns"
              :key="idx"
              class="add-popup__dropdown-item"
              :class="{ 'add-popup__dropdown-item--active': idx === addSelectIndex }"
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

        <!-- Actions -->
        <div class="add-popup__actions">
          <button class="add-popup__btn add-popup__btn--cancel" @click="showAddPopup = false">
            {{ $lang.Cancelar || 'Cancel' }}
          </button>
          <button
            class="add-popup__btn add-popup__btn--confirm"
            :disabled="addSubmitting"
            @click="submitAddBank"
          >
            {{ addSubmitting ? ($lang.common_loading || 'Loading...') : ($lang.Confirmar || 'Confirm') }}
          </button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { BankCardInfo, DelBankCard, AddBankCardInit, AddBankCard } from '@/api/common'
import md5 from '@/utils/md5'
import {
  normalizeBankType,
  needsIfscCard,
  needsDollarPrefix,
  formatCardExpiryInput,
  formatAchRoutingInput,
  formatCashtagBodyInput,
  formatRealNameInput,
  validateAddAccountForm,
  buildAddBankCardPayload
} from '@/utils/bankAccountValidate'

export default {
  name: 'Bank',
  data() {
    return {
      BankList: [],
      isShow: false,
      focus: false,
      privacyPwd: '',
      deleteCardId: null,
      // Add bank card popup
      showAddPopup: false,
      addRealName: '',
      addRealNameReadonly: false,
      addBankName: '',
      addBankId: null,
      addBankCard: '',
      addIfscCard: '',
      addBankColumns: [],
      showBankSelect: false,
      addSelectIndex: 0,
      addSubmitting: false
    }
  },
  computed: {
    bankType() {
      return normalizeBankType(this.addBankName)
    },
    showIfscField() {
      return needsIfscCard(this.addBankName)
    },
    showCashtagPrefix() {
      return needsDollarPrefix(this.addBankName)
    },
    ifscLabel() {
      if (this.bankType === 'ach') {
        return this.$lang.account_routing_label || 'Routing Number'
      }
      return this.$lang.account_expiry_label || 'Expiry Date'
    },
    ifscPlaceholder() {
      if (this.bankType === 'ach') {
        return this.$lang.account_routing_placeholder || 'Routing number (9 digits)'
      }
      return this.$lang.account_expiry_placeholder || 'Expiry (MM/YYYY)'
    },
    ifscMaxLength() {
      return this.bankType === 'ach' ? 9 : 7
    },
    accountPlaceholder() {
      if (this.bankType === 'paypal') {
        return this.$lang.account_paypal_placeholder || 'PayPal Email'
      }
      if (this.bankType === 'card') {
        return this.$lang.account_card_placeholder || 'Bank card number'
      }
      if (this.bankType === 'ach') {
        return this.$lang.account_ach_placeholder || 'Bank account number'
      }
      if (this.bankType === 'cashapp') {
        return this.$lang.account_cashapp_placeholder || 'Username e.g. JohnSmith, abc123'
      }
      if (this.bankType === 'chime') {
        return this.$lang.account_chime_placeholder || 'Username e.g. test888'
      }
      return this.$lang.account_contact_placeholder
    }
  },
  mounted() {
    this.BankCardInfo()
  },
  methods: {
    formatCardNumber(cardNumber) {
      if (!cardNumber) return ''
      if (cardNumber.length <= 4) return cardNumber
      return '**** **** ' + cardNumber.slice(-4)
    },
    toggleSee(item) {
      (item)['isSee'] = !item.isSee
    },
    copyText(v) {
      const textarea = document.createElement('textarea')
      textarea.value = v
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      this.$toast({ message: this.$lang.Sucesso, icon: 'success' })
    },
    showDeletePopup(cardId) {
      this.deleteCardId = cardId
      this.privacyPwd = ''
      this.isShow = true
    },
    async Confirm(cardId) {
      if (!this.privacyPwd) {
        this.$toast({ message: this.$lang.bank_txt2 || 'Enter Withdrawal Password', icon: 'cross' })
        return
      }
      const data = await DelBankCard({
        privacyPwd: md5(this.privacyPwd),
        cardId: cardId
      })
      if (data.status === 'ok') {
        this.isShow = false
        await this.BankCardInfo()
        this.$toast({ message: this.$lang.Sucesso, icon: 'success' })
      } else {
        this.$toast({ message: data.msg, icon: 'cross' })
      }
    },
    onClickRight() {
      this.showAddPopup = true
      this.addBankCard = ''
      this.addIfscCard = ''
      this.fetchAddBankCardInit()
    },
    async fetchAddBankCardInit() {
      const data = await AddBankCardInit()
      if (data.status === 'ok') {
        if (data.content.realName) {
          this.addRealName = data.content.realName
          this.addRealNameReadonly = true
        } else {
          this.addRealName = ''
          this.addRealNameReadonly = false
        }
        this.addBankColumns = (data.content.bankList || []).map(item => ({
          value: item.bankId,
          label: item.bankName
        }))
        if (this.addBankColumns.length > 0) {
          this.addBankId = this.addBankColumns[0].value
          this.addBankName = this.addBankColumns[0].label
          this.addSelectIndex = 0
          this.addIfscCard = ''
        }
      }
    },
    toggleBankSelect() {
      this.showBankSelect = !this.showBankSelect
    },
    selectBank(index, item) {
      this.addBankId = item.value
      this.addBankName = item.label
      this.addSelectIndex = index
      this.showBankSelect = false
      this.addIfscCard = ''
      this.addBankCard = ''
    },
    onRealNameInput(e) {
      if (this.addRealNameReadonly) return
      const val = e && e.target ? e.target.value : e
      const next = formatRealNameInput(val)
      if (next !== this.addRealName) this.addRealName = next
    },
    onAccountInput(e) {
      const val = e && e.target ? e.target.value : e
      if (needsDollarPrefix(this.addBankName)) {
        const next = formatCashtagBodyInput(val)
        if (next !== this.addBankCard) this.addBankCard = next
      }
    },
    onIfscInput(e) {
      const val = e && e.target ? e.target.value : e
      if (this.bankType === 'ach') {
        this.addIfscCard = formatAchRoutingInput(val)
      } else if (this.bankType === 'card') {
        this.addIfscCard = formatCardExpiryInput(val)
      }
    },
    async submitAddBank() {
      const check = validateAddAccountForm({
        realName: this.addRealName,
        bankName: this.addBankName,
        bankCard: this.addBankCard,
        ifscCard: this.addIfscCard
      })
      if (!check.ok) {
        this.$toast({
          message: (check.messageKey && this.$lang[check.messageKey]) || check.message,
          icon: 'cross'
        })
        return
      }
      this.addSubmitting = true
      try {
        const data = await AddBankCard(
          buildAddBankCardPayload({
            bankName: this.addBankName,
            bankId: this.addBankId,
            bankCard: this.addBankCard,
            realName: this.addRealName,
            ifscCard: this.addIfscCard
          })
        )
        if (data.status === 'ok') {
          this.showAddPopup = false
          this.$toast({ message: this.$lang.Sucesso || 'Success', icon: 'success' })
          await this.BankCardInfo()
        } else {
          this.$toast({ message: data.msg, icon: 'cross' })
        }
      } catch (e) {
        console.error(e)
      } finally {
        this.addSubmitting = false
      }
    },
    async BankCardInfo() {
      const data = await BankCardInfo()
      if (data.status === 'ok') {
        this.BankList = data.content.bankCardList || []
        this.BankList.forEach((i) => {
          (i)['isSee'] = false
        })
      } else {
        this.$toast({ message: data.msg, icon: 'cross' })
      }
    }
  }
}
</script>

<style lang="less" scoped>
@bg: #1f1c17;
@card: #15110a;
@neon: #ffa300;
@muted: #a89b7c;
@border: rgba(255, 162, 0, 0.45);

.bank-page {
  min-height: 100vh;
  background: @bg;
  padding-bottom: 40px;
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
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.04);
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
  }

  &__title {
    font-size: 18px;
    font-weight: 700;
    color: @wihte-color;
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
  padding: 12px 16px;
}

.bank-card {
  background: linear-gradient(135deg, #2a2418 0%, #1d1814 50%, #15110a 100%);
  border-radius: 14px;
  padding: 18px 20px;
  margin-bottom: 14px;
  border: 1px solid @border;
  position: relative;
  overflow: hidden;

  &__top {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 20px;
  }

  &__bank-icon {
    width: 36px;
    height: 36px;
    border-radius: 10px;
    background: rgba(255, 163, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__name {
    flex: 1;
    font-size: 15px;
    font-weight: 700;
    color: @wihte-color;
    text-transform: uppercase;
  }

  &__delete {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: background 0.15s;

    &:active {
      background: rgba(239, 68, 68, 0.1);
    }
  }

  &__number {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__full,
  &__masked {
    font-size: 18px;
    font-weight: 600;
    color: @wihte-color;
    letter-spacing: 2px;
    font-family: 'Courier New', monospace;
  }

  &__masked {
    color: @muted;
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  &__action {
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.15s;

    &:active {
      background: rgba(255, 255, 255, 0.06);
    }
  }

  // Decorative circles
  &__decoration {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
  }

  &__circle {
    position: absolute;
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.04);

    &--1 {
      width: 120px;
      height: 120px;
      top: -30px;
      right: -20px;
    }

    &--2 {
      width: 80px;
      height: 80px;
      bottom: -20px;
      right: 40px;
    }
  }
}

// ====== ADD BUTTON ======
.bank-add-btn {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 14px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(255, 163, 0, 0.25);
  transition: transform 0.1s;

  &:active {
    transform: scale(0.98);
  }

  &--outline {
    background: transparent;
    color: @neon;
    border: 1px dashed rgba(255, 163, 0, 0.3);
    box-shadow: none;
    margin-top: 8px;
  }
}

// ====== DELETE POPUP ======
.delete-popup {
  background: @card !important;
  border-radius: 16px !important;

  &__content {
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  &__icon {
    margin-bottom: 16px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-align: center;
    margin: 0 0 20px;
  }

  &__field {
    width: 100%;
    margin-bottom: 24px;

    label {
      display: block;
      font-size: 12px;
      color: @muted;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px 14px;
    transition: border-color 0.2s;

    &--focus {
      border-color: @neon;
      box-shadow: 0 0 0 2px rgba(255, 163, 0, 0.1);
    }

    input {
      flex: 1;
      background: transparent;
      border: none;
      color: @wihte-color;
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: #a89b7c;
      }
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    width: 100%;
  }

  &__btn {
    flex: 1;
    height: 44px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: transform 0.1s;

    &:active {
      transform: scale(0.98);
    }

    &--cancel {
      background: rgba(255, 255, 255, 0.08);
      color: @wihte-color;
    }

    &--confirm {
      background: #ef4444;
      color: @wihte-color;
    }
  }
}

// ====== ADD POPUP ======
.add-popup {
  background: @card !important;
  border-radius: 16px !important;
  width: 90%;
  max-width: 400px;

  &__content {
    padding: 24px 20px;
  }

  &__title {
    font-size: 16px;
    font-weight: 700;
    color: @wihte-color;
    text-align: center;
    margin: 0 0 20px;
  }

  &__field {
    margin-bottom: 16px;
    position: relative;

    label {
      display: block;
      font-size: 12px;
      color: @muted;
      margin-bottom: 6px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  &__input {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    padding: 12px 14px;

    input {
      flex: 1;
      background: transparent;
      border: none;
      color: @wihte-color;
      font-size: 14px;
      outline: none;

      &::placeholder {
        color: #a89b7c;
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
        color: @wihte-color;
      }
    }
  }

  &__prefix {
    color: @neon;
    font-weight: 600;
    font-size: 13px;
    flex-shrink: 0;
  }

  &__cashtag {
    color: @wihte-color;
    font-weight: 700;
    font-size: 16px;
    flex-shrink: 0;
    line-height: 1;
  }

  &__placeholder {
    color: #a89b7c !important;
  }

  &__dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: #2a2418;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    max-height: 160px;
    overflow-y: auto;
    z-index: 10;
    margin-top: 4px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  &__dropdown-item {
    padding: 10px 14px;
    font-size: 13px;
    color: @wihte-color;
    cursor: pointer;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);

    &:last-child { border-bottom: none; }
    &:active { background: rgba(255, 163, 0, 0.1); }

    &--active {
      background: rgba(255, 163, 0, 0.15);
      color: @neon;
      font-weight: 600;
    }
  }

  &__actions {
    display: flex;
    gap: 12px;
    margin-top: 20px;
  }

  &__btn {
    flex: 1;
    height: 44px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    border: none;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: transform 0.1s;

    &:active { transform: scale(0.98); }
    &:disabled { opacity: 0.5; cursor: not-allowed; }

    &--cancel {
      background: rgba(255, 255, 255, 0.08);
      color: @wihte-color;
    }

    &--confirm {
      background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
      color: #573900;
    }
  }
}

@media (min-width: 769px) {
  .bank-page {
    max-width: 450px;
    margin: 0 auto;
  }
}
</style>
