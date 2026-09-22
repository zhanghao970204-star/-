<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title"></title-bar>
    <div class="t-c m-t-10">
      <img
        src="../../../assets/img/bonus/nine-bg.jpg"
        width="93%"
        style="border-radius: 13px"
      />
    </div>
    <div class="content-c">
      <div class="content-b">
        <div v-html="$lang.bonus_txt" class="content-gb"></div>
      </div>
      <van-button @click="goToRec" size="large" class="custom-button m-t-20">
        Telegram:{{ href }}
      </van-button>
      <div v-html="$lang.bonus_txt2" class="content-bg"></div>
    </div>
  </div>
</template>
<script>
import { GetCsLink } from '@/api/common'
export default {
  name: 'ActivityRecharge',
  components: {},
  data() {
    return {
      href: 'https://t.me/OTgamel'
    }
  },
  mounted() {
    // this.GetCsLink()
  },
  methods: {
    async GetCsLink() {
      const data = await GetCsLink()
      const targetKey = 'tg'
      this.href = data.content.url2.find((item) => targetKey in item)?.[
        targetKey
      ]
    },
    async goToRec() {
      // this.GetCsLink()
      window.open(this.href, '_blank')
    }
  }
}
</script>
<style lang="less" scoped>
.content-c {
  padding: 1% 3% 3%;
}

.content-gb {
  margin-top: 10px;
  border-radius: 8px;
  padding: 15px 10px;
  background: @cont-bg;
  line-height: 20px;
}
.content-bg {
  padding: 2%;
  margin-top: 10px;
  line-height: 20px;
}
</style>
