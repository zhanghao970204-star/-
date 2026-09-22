<template>
  <div class="content">
    <title-bar :title="$lang.bonus_title6"> </title-bar>
    <div style="margin-left: 10px; margin-right: 10px; margin-top: 10px">
      <!-- <img src="../../../assets/img/bonus/bonus4.png" width="100%" /> -->
    </div>
    <div class="content-a">
      <div class="content-c3">
        <div class="d-flex content-c3--top">
          <div class="content-c3--qr-wrap">
            <vue-qr
              :value="inviteCode"
              :size="88"
              :margin="1"
              class="content-c3--qr"
            />
          </div>
          <div class="content-c3--info">
            <p class="font-color">{{ $lang.bonus_txt23 }}</p>
            <div class="content-c3--b">
              <p class="content-c3--link">{{ inviteCode }}</p>
              <img
                @click="copyText(1)"
                class="m-l-10 content-c3--copy"
                width="20px"
                src="../../../assets/img/drawer/drawer_copy.png"
              />
            </div>
            <p class="m-t-5">
              <span class="font-color">{{ $lang.bonus_txt24 }} </span>
              <span class="info-color">{{ inviteCode2 }}</span>
              <img
                @click="copyText(2)"
                class="m-l-5 content-c3--copy"
                width="11px"
                src="../../../assets/img/drawer/drawer_copy.png"
              />
            </p>
          </div>
        </div>
        <div>
          <img
            class="m-t-20"
            src="../../../assets/img/share/share_list2.png"
            style="width: 100%"
          />
        </div>
        <p class="font-color m-t-5">
          {{ $lang.bonus_txt25 }}
          <span class="info-color">{{ result || 0 }}</span>
          {{
            (result || 0) === 1
              ? $lang.bonus_txt26_single || $lang.bonus_txt26
              : $lang.bonus_txt26
          }}
          <span class="info-color">{{ $lang.Detalhes }}</span>
        </p>
      </div>

      <div class="content-bottom">
        <div
          v-for="(item, index) in chestList"
          :key="index"
          style="width: 14%; text-align: center"
          :class="{ isR: item.isR === 'right', isL: item.isL === 'left' }"
        >
          <div v-if="item.img && item.people">
            <div v-if="item.people <= treasureLevel">
              <img class="img-content" :src="chestImgs.opened" alt="" />
            </div>
            <div
              v-else-if="result >= item.people && item.people > treasureLevel"
              @click="ReceiveTreasure"
            >
              <img
                class="img-content img-content--claimable"
                :src="chestImgs.claimable"
                alt=""
              />
            </div>
            <div v-else>
              <img
                class="img-content img-content--locked"
                :src="chestImgs.locked"
                alt=""
              />
            </div>
            <p class="chest-amount">
              {{ $formatNumberWithCommas(item.count) }}
            </p>
            <p class="chest-people">
              {{ item.people }}
              {{
                item.people === 1
                  ? $lang.bonus_txt26_single || $lang.bonus_txt26
                  : $lang.bonus_txt26
              }}
            </p>
          </div>
          <img
            v-if="item.icon"
            :src="item.icon"
            style="width: 18px; margin-left: 20px; margin-bottom: 24px"
          />
          <div v-if="item.icon2">
            <img :src="item.icon2" style="width: 18px" />
          </div>
          <img
            v-if="item.icon3"
            :src="item.icon3"
            style="width: 18px; margin-left: 20px; margin-bottom: 24px"
          />
        </div>
      </div>
      <p class="t-c f-t-15 f-w m-t-10 l-h-20">
        {{ $lang.bonus_txt27 }}<br />
        {{ $lang.bonus_txt28 }}
      </p>
      <div class="content-refer">
        <img src="../../../assets/img/refer_friend/img_wallet.png" width="60" />
        <p class="content-refer__text" style="margin-left: 16px">
          {{ $lang.bonus_txt29 }}<br /><span>{{ $lang.bonus_txt30 }}</span>
        </p>
      </div>
      <div class="content-refer2">
        <img src="../../../assets/img/refer_friend/img_cion.png" width="72" />
        <p class="content-refer__text">
          {{ $lang.bonus_txt31 }}<br /><span>{{ $lang.bonus_txt32 }}</span>
        </p>
      </div>
      <!-- <div class="content-c2">Detalhes do Evento</div> -->
      <div
        class="d-flex f-t-15 f-w m-t-10 m-b-10"
        style="justify-content: center"
      >
        <span class="share-bot-l"></span>
        <span>{{ $lang.common_txt35 }}</span>
        <span class="share-bot-r"></span>
      </div>
      <div
        v-html="$lang.bonus_txt33"
        class="l-h-20 font-color"
        style="
          margin-bottom: 10px;
          line-height: 20px;
          border-radius: 15px;
          padding: 0 10px 10px;
        "
      ></div>
    </div>
  </div>
</template>
<script>
import VueQr from "qrcode.vue";
import { Init, TreasureReceiveInit, ReceiveTreasure } from "@/api/common";

// 宝箱三态：未达成=灰色 / 可领取=黑金 / 已领取=打开
const CHEST_LOCKED = require("@/assets/img/refer_friend/img_box_unopened.png");
const CHEST_CLAIMABLE = require("@/assets/img/refer_friend/img_isOpen_box.png");
const CHEST_OPENED = require("@/assets/img/refer_friend/img_open_box.png");

export default {
  name: "ShareOnes",
  // eslint-disable-next-line vue/no-unused-components
  components: { VueQr },
  data() {
    return {
      inviteCode: "",
      inviteCode2: "",
      chestImgs: {
        locked: CHEST_LOCKED,
        claimable: CHEST_CLAIMABLE,
        opened: CHEST_OPENED,
      },
      chestList: [
        {
          people: 1,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 2,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 3,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 4,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 8,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 7,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 6,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 5,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 9,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 10,
          count: 2000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 15,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 20,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 40,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 35,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 30,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 25,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 45,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 50,
          count: 10000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 60,
          count: 20000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 70,
          count: 20000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 150,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 100,
          count: 20000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 90,
          count: 20000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 80,
          count: 20000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 200,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 250,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 300,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 350,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 600,
          count: 200000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 500,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 450,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 400,
          count: 100000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 700,
          count: 200000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 800,
          count: 200000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 900,
          count: 200000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 1000,
          count: 200000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 3000,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 2500,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 2000,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 1500,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 3500,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 4000,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 4500,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 5000,
          count: 1000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 9000,
          count: 2000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 8000,
          count: 2000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 7000,
          count: 2000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 6000,
          count: 2000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 10000,
          count: 2000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          count: 10000000,
          people: 15000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 20000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 25000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {
          people: 45000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 40000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 35000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 30000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isL: "left",
        },
        {
          people: 50000,
          count: 10000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 60000,
          count: 20000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 70000,
          count: 20000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon: require("@/assets/img/refer_friend/img_right.png"),
        },
        {
          people: 80000,
          count: 20000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon2: require("@/assets/img/refer_friend/img_down.png"),
          isR: "right",
        },
        {},
        {},
        {},
        {},
        {
          people: 100000,
          count: 20000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
        {
          icon3: require("@/assets/img/refer_friend/img_left.png"),
        },
        {
          people: 90000,
          count: 20000000,
          img: require("@/assets/img/refer_friend/img_box_unopened.png"),
          img_open: require("@/assets/img/refer_friend/img_open_box.png"),
          img_isOpen: require("@/assets/img/refer_friend/img_isOpen_box.png"),
        },
      ],
      currentCount: 0,
      treasureLevel: 0,
    };
  },
  mounted() {
    if (this.token) {
      this.Init();
      this.TreasureReceiveInit();
    }
  },
  computed: {
    result() {
      // 接口 currentCount 表示“拥有到第几等级宝箱的人数”（待开 + 已开）
      // 因此展示与可开判断直接使用 currentCount 对比 item.people 即可。
      return this.currentCount || 0;
    },
  },
  methods: {
    async ReceiveTreasure() {
      const data = await ReceiveTreasure();
      if (data.status === "ok") {
        await this.TreasureReceiveInit();
      } else {
        this.$toast({
          message: data.msg,
          icon: "cross",
        });
      }
    },
    async TreasureReceiveInit() {
      const data = await TreasureReceiveInit();
      if (data.status === "ok") {
        this.currentCount = data.content.currentCount;
        this.treasureLevel = data.content.treasureLevel;
        // 根据 ruleList 动态更新宝箱金额
        if (data.content.ruleList) {
          try {
            const rules =
              typeof data.content.ruleList === "string"
                ? JSON.parse(data.content.ruleList)
                : data.content.ruleList;
            this.chestList.forEach((item) => {
              if (item.people) {
                const rule = rules.find(
                  (r) =>
                    item.people >= r.levelMin + 1 && item.people <= r.levelMax,
                );
                if (rule) {
                  item.count = rule.reward;
                }
              }
            });
          } catch (e) {
            console.error("ruleList parse error", e);
          }
        }
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
        this.inviteCode2 = data.content.inviteCode;
      }
    },
    copyText(i) {
      const textarea = document.createElement("textarea");
      if (i === 1) {
        textarea.value = this.inviteCode;
      } else {
        textarea.value = this.inviteCode2;
      }
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
.content-c3 {
  display: flex;
  background: @cont-bg;
  padding: 18px 12px;
  font-weight: bold;
  border-radius: 13px;
  flex-flow: row wrap;
  border: 1px solid @info2-color;
}
.content-c3--top {
  width: 100%;
  align-items: flex-start;
}
.content-c3--info {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  box-sizing: border-box;
}
.content-c3--b {
  margin-top: 5px;
  display: flex;
  background: @cont-bg;
  border: 1px solid rgba(255, 162, 0, 0.45);
  border-radius: 10px;
  padding: 4px 10px;
  line-height: 18px;
  align-items: center;
  letter-spacing: 0;
  min-width: 0;
  max-width: 100%;
  box-sizing: border-box;
}
.content-c3--link {
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  font-size: 12px;
  word-break: break-all;
  overflow-wrap: anywhere;
  white-space: normal;
}
.content-c3--copy {
  flex-shrink: 0;
  filter: brightness(0) invert(1);
}
.content-c3--qr-wrap {
  flex-shrink: 0;
  width: 88px;
  height: 88px;
  margin-right: 10px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  border: 1px solid rgba(233, 168, 67, 0.4);
  box-sizing: border-box;
}
.content-c3--qr {
  display: block;
  width: 88px !important;
  height: 88px !important;

  :deep(canvas),
  :deep(img) {
    display: block;
    width: 100% !important;
    height: 100% !important;
  }
}
.content-refer,
.content-refer2 {
  background: linear-gradient(90deg, #e2b466 0%, #ffe972 100%);
  display: flex;
  border-radius: 13px;
  align-items: center;
  font-size: 14px;
}
.content-refer {
  padding: 15px 10px;
  margin-top: 15px;
}
.content-refer2 {
  padding: 10px;
  margin-top: 18px;
}
.content-refer__text {
  margin-left: 10px;
  color: #000;
  font-weight: 700;
  line-height: 1.35;

  span {
    color: #000;
    font-weight: 400;
  }
}
.content-bottom {
  display: flex;
  flex-flow: wrap row;
  border-radius: 13px;
  padding: 10px 15px 25px 5px;
  // background: @cont-bg;
  align-items: center;
  margin-top: 15px;
}
.isR {
  text-align: right !important;
  width: 100% !important;
  padding-right: 5%;
  margin: 15px 0 8px;
}
.isL {
  text-align: left !important;
  width: 100% !important;
  padding-left: 5%;
  margin: 15px 0 8px;
}
.content-c2 {
  font-size: 16px;
  margin-top: 18px;
  background-image: url("../../../assets/img/bonus/cashback_rate_vip.png"); /* 指定背景图片的路径 */
  background-size: 100% 100%; /* 宽度和高度都拉伸到 100% */
  background-repeat: no-repeat; /* 防止图片重复 */
  width: 260px; /* 或者指定具体的宽度 */
  padding: 2px 10px;
  font-weight: bold;
}
.content-a {
  padding: 10px;
  // width: 94%;
  // margin: 12px auto;
  // z-index: 9 !important;
  // position: absolute;
  // right: 0;
  // left: 0;
}
.img-content {
  width: 56px;
  height: 56px;
  max-width: 100%;
  object-fit: contain;
  display: block;
  margin: 0 auto;
  position: relative;
}
.img-content--locked {
  width: 58px;
  height: 58px;
  filter: none;
}
.img-content--claimable {
  filter: drop-shadow(0 0 6px rgba(255, 163, 0, 0.45));
}
.chest-amount {
  font-size: 11px;
  font-weight: bold;
  color: #ffd700;
  text-align: center;
  margin: 2px 0 0;
  line-height: 1.2;
  white-space: nowrap;
}
.chest-people {
  font-size: 10px;
  color: #a89b7c;
  text-align: center;
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
}
@media (min-width: 769px) {
  .content-a {
    width: 450px !important;
    overflow-y: auto;
    height: 100vh;
    /* 隐藏滚动条样式 */
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
