<template>
  <div class="home-support">
    <p class="home-support__title">{{ $lang.footer_virtual_currency }}</p>
    <home-crypto-icons />
    <div class="home-support__pay-icons">
      <img
        v-for="(item, index) in payIcons"
        :key="index"
        class="home-support__pay-icon"
        :src="item.src"
        :alt="item.alt"
      />
    </div>
    <p class="home-support__rate">
      1 {{ rateCurrency }} = {{ usdToUsdt }} USDT
    </p>

    <img
      class="home-support__brand"
      src="@/assets/img/login/logo.webp"
      alt=""
    />

    <div class="home-support__badges">
      <a
        href="https://ton.app/gambling/vpbet?id=4498"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="@/assets/img/footer/support-ton.svg" alt="TON" />
      </a>
      <a
        href="https://cryptogambling.org/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="@/assets/img/footer/support-verified.webp" alt="Verified" />
      </a>
      <a
        href="https://cert.gcb.cw/certificate?id=ZXlKcGRpSTZJbWQ0UTBwa1NUSjNSV0pCTTI4NGVYQjFkSGxPSzNjOVBTSXNJblpoYkhWbElqb2lZakJVVkU4NFVrYzFSRzlxTm1kcFNIWmlUa1ZxVVQwOUlpd2liV0ZqSWpvaU1tVmpNekV6TVRKak0ySXlaR0kzWkdZeE16QmtOVGcyWkRNeU9EZGhNV1EzTmpnNE4ySXhOek16WlRJNFpEZzBaV0UyWVRrNE5EUTBOamRsTkRCaVpDSXNJblJoWnlJNklpSjk="
        target="_blank"
        rel="noopener noreferrer"
      >
        <img src="@/assets/img/footer/support-gcb.svg" alt="GCB" />
      </a>
    </div>

    <p class="home-support__legal">
      {{ siteHost }} is owned and operated by Platinum Technology N.V., a
      company registered in Curaçao with Company Number 163348 and with
      Registered Address at Zuikertuintjeweg Z/N, Curaçao.
    </p>
    <p class="home-support__legal">
      Platinum Technology N.V. is licensed and regulated by the Curaçao Gaming
      Authority (CGA) with License Number: OGL/2024/137/0132 issued on
      21/07/2025. Trust Service and Represented by
      <a href="https://igagroup.com" target="_blank" rel="noopener noreferrer"
        >https://igagroup.com</a
      >
    </p>
    <img
      class="home-support__age"
      src="@/assets/img/otgame/eighteen.png"
      width="34"
      alt="18+"
    />
    <p class="home-support__copy">
      ©{{ year }} {{ siteHost }} | All Rights Reserved.
    </p>
  </div>
</template>
<script>
import { RefreshExchangeRate } from "@/api/common";
import HomeCryptoIcons from "./HomeCryptoIcons.vue";

const PAY_ICONS = [
  { src: require("@/assets/img/home/pay/paypal.png"), alt: "PayPal" },
  { src: require("@/assets/img/home/pay/cashapp.png"), alt: "Cash App" },
  { src: require("@/assets/img/home/pay/google.png"), alt: "Google Pay" },
  { src: require("@/assets/img/home/pay/apple.png"), alt: "Apple Pay" },
  { src: require("@/assets/img/home/pay/card.png"), alt: "Card" },
  { src: require("@/assets/img/home/pay/stripe.png"), alt: "Stripe" },
];

export default {
  name: "HomeSupportFooter",
  components: { HomeCryptoIcons },
  data() {
    return {
      exchRate: 0,
      year: new Date().getFullYear(),
      payIcons: PAY_ICONS,
    };
  },
  computed: {
    siteHost() {
      if (typeof window === "undefined") return "";
      return window.location.host || window.location.hostname || "";
    },
    rateCurrency() {
      return this.getCurrency || "USD";
    },
    usdToUsdt() {
      const n = Number(this.exchRate);
      if (!n) return "--";
      // API: 1 USDT = exchRate 法币；展示 1 法币 = 1/exchRate USDT
      const usdt = n < 2 ? n : 1 / n;
      const s = usdt.toFixed(8);
      return s.replace(/0+$/, "").replace(/\.$/, "");
    },
  },
  mounted() {
    this.fetchRate();
  },
  methods: {
    async fetchRate() {
      try {
        const data = await RefreshExchangeRate({
          exccType: "USDT",
          rwType: "r",
        });
        if (data && data.status === "ok" && data.content) {
          this.exchRate = Number(data.content.exchRate) || 0;
        }
      } catch (e) {
        this.exchRate = 0;
      }
    },
  },
};
</script>
<style lang="less" scoped>
.home-support {
  padding: 4px 0 8px;
  text-align: center;
  color: #cfcfcf;

  &__title {
    color: #fff;
    font-size: 13px;
    margin: 0 0 6px;
    letter-spacing: 0.4px;
  }

  &__pay-icons {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 10px 14px;
    padding: 8px 4px 4px;
  }

  &__pay-icon {
    width: 30px;
    height: 30px;
    flex: 0 0 30px;
    object-fit: contain;
    object-position: center;
    display: block;
    border: 0;
    background: none;
  }

  &__rate {
    margin: 10px 0 16px;
    font-size: 12px;
    color: #b8b8b8;
  }

  &__brand {
    display: block;
    width: 220px;
    max-width: 78%;
    height: auto;
    margin: 0 auto 14px;
  }

  &__badges {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin: 0 6px 14px;

    a {
      flex: 1;
      min-width: 0;
      height: 54px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    img {
      width: auto;
      max-width: 100%;
      height: 54px;
      object-fit: contain;
      object-position: center;
      display: block;
    }
  }

  &__legal {
    margin: 0 auto 8px;
    width: 96%;
    font-size: 11px;
    line-height: 1.5;
    color: #b0b0b0;

    a {
      color: #d4b275;
      word-break: break-all;
    }
  }

  &__age {
    margin: 10px auto 6px;
    display: block;
  }

  &__copy {
    margin: 0;
    font-size: 11px;
    color: #9a9a9a;
  }
}
</style>
