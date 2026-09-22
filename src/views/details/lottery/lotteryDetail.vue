<template>
  <div
    class="content"
    style="background: #1f1c17 !important; color: #ffe4b5; min-height: 100vh"
  >
    <div class="lottery-bg">
      <div class="lottery-title">
        <van-icon
          name="arrow-left"
          @click="onClickLeft"
          size="20"
          color="#ffe4b5"
        />
        <p class="f-w" style="font-size: 16px" @click="getShowTop()">
          {{ lotteryTypeName }} <van-icon name="arrow-down" class="f-w" />
        </p>
        <!-- <img
          @click="getShowGn()"
          src="../../../assets/img/lottery/gn-lot.png"
          width="25"
        /> -->
        <van-icon name="wap-nav" @click="getShowGn()" size="18" />
      </div>
      <div v-if="showTop" class="custom-top--bg">
        <div v-for="(item, index) in allLotteryList" :key="index">
          <div class="d-flex">
            <img :src="item.img" width="20" />
            <p class="m-l-5 f-t-15 f-w">{{ item.name }}</p>
          </div>
          <div class="d-flex-s m-t-10" style="width: 100%; flex-flow: wrap row">
            <div
              style="
                background: #2a2418;
                width: 31.5%;
                padding: 12px 0;
                border-radius: 8px;
                text-align: center;
                margin-bottom: 10px;
                color: #a89b7c;
                border: 1px solid rgba(233, 168, 67, 0.35);
              "
              v-for="(item2, index2) in item.list"
              :key="index2"
              :class="{
                'active-typeName': item2.lotteryName === lotteryTypeName,
              }"
              @click="selectTypeLx(item2)"
            >
              {{ item2.lotteryName }}
            </div>
            <div style="width: 31%"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showGn" class="lot-gn-t">
      <div
        class="d-flex f-t-15 f-w"
        style="padding: 12px 5px"
        v-for="(item, index) in gnList"
        :key="index"
        @click="openGn(index)"
      >
        <img :src="item.img" width="18" />
        <p class="m-l-10">{{ item.name }}</p>
      </div>
    </div>
    <div
      style="padding: 3%; padding-bottom: 70px"
      :class="{ botHight: lines > 0 }"
    >
      <div class="lot-cont">
        <div class="lot-cont--top">
          <div class="d-flex-s">
            <div>
              <img :src="iconUrl" width="110" />
            </div>
            <div
              v-if="iconUrl"
              class="t-c"
              style="
                justify-content: space-between;
                display: flex;
                flex-flow: column;
                height: 100%;
                padding-top: 7px;
              "
            >
              <div
                class="lot-lte"
                style="
                  position: relative;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <p
                  style="
                    position: absolute;
                    background: #15110a;
                    border-radius: 10px 10px 10px 0px;
                    top: -8px;
                    font-size: 10px;
                    left: 0;
                    padding: 3px;
                  "
                >
                  {{ $lang.common_txt208 }}
                </p>
                <p class="m-t-5 f-t-15 f-w">
                  {{ formattedTime }}
                </p>
              </div>
              <div>
                <div
                  class="lot-lte2 m-t-15"
                  style="
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                  "
                >
                  <p
                    style="
                      position: absolute;
                      background: #15110a;
                      border-radius: 10px 10px 10px 0px;
                      top: -8px;
                      font-size: 11px;
                      left: 0;
                      padding: 3px;
                    "
                  >
                    {{ $lang.common_txt209 }}
                  </p>
                  <p class="m-t-5 f-t-15 f-w">
                    {{ currIssueNo }}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="
              iconUrl &&
              [
                'tron16x660',
                'tron16x6180',
                'tron16x6300',
                'tron16x6600',
                'eth16x660',
                'eth16x6180',
                'eth16x6300',
                'eth16x6600',
                'bnb16x660',
                'bnb16x6180',
                'bnb16x6300',
                'bnb16x6600',
              ].includes(lotteryType) &&
              lastLotteryResult
            "
            class="m-t-5"
          >
            <div class="d-flex f-w">
              {{ $lang.common_txt210 }}
              <p class="m-l-5">({{ getCurrIssueNo }})</p>
            </div>
            <div class="d-flex">
              <div
                class="lot-ball m-t-5"
                v-for="(itemball, ballIndex) in lastLotteryResult.split(',') ||
                ''"
                :key="ballIndex"
              >
                {{ itemball }}
              </div>
              <p
                class="m-l-5"
                style="
                  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
                  color: #573900;
                  height: 30px;
                  padding: 0 10px;
                  border-radius: 10px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                "
                @click="goToBin"
              >
                {{ $lang.common_txt181 }}
              </p>
            </div>
          </div>
        </div>
        <div class="d-flex-s" style="width: 100%">
          <div class="d-flex" style="flex-flow: wrap row">
            <p
              class="lot-cont--i"
              v-for="(item, index) in playRuleList"
              :key="index"
              @click="selectType(index, item)"
              :class="{ 'active-type': selectIndex === index }"
            >
              {{ item.betTypeName }}
            </p>
          </div>
        </div>
      </div>
      <div class="lot-mid">
        <div class="lot-mid--top">
          <!-- <div class="d-flex" @click="restInit">
            <img src="../../../assets/img/lottery/ljt.png" width="18" />
            <span class="m-l-5 f-w">Delete All</span>
          </div> -->
          <div
            v-if="playRuleList.length > 0"
            class="d-flex lot-rule"
            @click="getRule"
          >
            <img src="../../../assets/img/lottery/rule.png" width="20" />
            <span class="m-l-5 f-t-15">{{ $lang.common_txt70 }}</span>
          </div>
          <div
            v-if="
              ![
                'szc11x6_1x_dwd_zu',
                'szc11x6_ws_dx_zu',
                'szc11x6_ws_ds_zu',
              ].includes(playType)
            "
            class="d-flex"
            @click="quickPick"
          >
            <img src="../../../assets/img/lottery/mfb.png" width="15" />
            <span class="f-w m-l-5" style="color: #ffa300">{{
              $lang.common_txt71
            }}</span>
          </div>
        </div>

        <div>
          <div
            v-if="
              ![
                'szc11x6_1x_dwd_zu',
                'szc11x6_ws_ds_zu',
                'szc11x6_ws_dx_zu',
              ].includes(playType)
            "
          >
            <div class="lot-mid--b">
              <p
                v-for="num in numList"
                :key="num"
                @click="handleClick(num)"
                class="lot-mid--bi"
                :class="{ 'selected-element': isSelected(num) }"
              >
                <span v-if="num === 100">00</span>
                <span v-else> {{ num >= 10 ? num : `0${num}` }}</span>
              </p>
            </div>
          </div>

          <div
            v-if="['szc11x6_ws_ds_zu', 'szc11x6_ws_dx_zu'].includes(playType)"
          >
            <div
              class="d-flex"
              style="
                width: 98%;
                margin: 0 auto;
                justify-content: space-around;
                border: 1px solid rgba(233, 168, 67, 0.35);
                background: #15110a;
                padding: 12px 0;
                border-radius: 12px;
              "
            >
              <div
                v-for="(itemDs, indexDs) in ['szc11x6_ws_ds_zu'].includes(
                  playType,
                )
                  ? ['Odd', 'Even']
                  : ['Big', 'Small']"
                :key="indexDs"
                class="dxds--cont"
                @click="dxdsFun(indexDs)"
              >
                <div
                  class="d-flex"
                  style="
                    background: #2a2418;
                    color: #ffe4b5;
                    font-size: 20px;
                    font-weight: bold;
                    border-radius: 10px;
                    height: 78px;
                    justify-content: center;
                  "
                  :class="{ 'dxds-active': dxdsSelect === indexDs }"
                >
                  <p
                    class="d-flex"
                    style="
                      justify-content: center;
                      border: 1px solid;
                      width: 80px;
                      height: 70px;
                      border-radius: 10px;
                    "
                  >
                    {{ itemDs }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="['szc11x6_1x_dwd_zu'].includes(playType)">
            <div v-for="(numType, index) in 6" :key="numType">
              <p
                style="
                  text-align: center;
                  font-size: 18px;
                  font-weight: bold;
                  margin: 10px 0;
                "
              >
                {{ numType }}{{ $lang.common_txt211 }}
              </p>
              <div
                style="
                  background: #2a2418;
                  border: 1px solid rgba(233, 168, 67, 0.35);
                  margin-bottom: 10px;
                  border-radius: 15px;
                  padding: 10px 5px;
                  margin: 10px 0;
                "
              >
                <div
                  class="m-b-10 f-t-15 f-w d-flex-s"
                  style="
                    color: var(--wihte-color);
                    width: 95%;
                    margin: 5px auto 15px;
                  "
                >
                  <div
                    style="
                      background: #15110a;
                      border: 1px solid rgba(233, 168, 67, 0.35);
                      color: #ffe4b5;
                      padding: 8px 0;
                      width: 80px;
                      display: flex;
                      justify-content: center;
                      align-items: center;
                      border-radius: 8px;
                    "
                    v-for="(item2, index2) in [
                      'Odd',
                      'Even',
                      'Complete',
                      'Clear',
                    ]"
                    :key="index2"
                    @click="getGnJ(index, index2)"
                    :class="{
                      'active-dxsq': selectedDxsqIndexList[index] === index2,
                    }"
                  >
                    {{ item2 }}
                  </div>
                </div>

                <p
                  style="
                    height: 1px;
                    background: rgba(233, 168, 67, 0.35);
                    margin-bottom: 10px;
                    margin-top: 5px;
                  "
                ></p>
                <div
                  class="d-flex"
                  style="
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(10%, 1fr));
                    gap: 5px;
                    justify-content: start;
                  "
                >
                  <p
                    v-for="num5 in Array.from({ length: 16 }, (_, i) => i)"
                    :key="num5"
                    class="lot-mid--b3is2"
                    @click="handleClick6(index, num5)"
                    :class="{ 'selected-element': isSelected4(index, num5) }"
                  >
                    {{ num5 >= 10 ? num5 : `0${num5}` }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div v-if="lastOrderList.length > 0" class="f-w">
            <div class="t-c m-t-10">
              <p style="font-weight: 800">
                {{ lastOrderList[0].issueNo }}(
                <span v-if="totalBonusAmount > 0" style="color: #29f08c"
                  >Has won</span
                >
                <span v-else v-html="lastOrderList[0].orderStatusName"></span>)
              </p>
              <div
                class="d-flex m-t-10"
                style="width: 100%; justify-content: center"
              >
                <p
                  style="
                    border: 1px solid #d62945;
                    padding: 3px 10px;
                    border-radius: 15px;
                    margin-right: 10px;
                  "
                >
                  {{ $lang.common_txt226 }}{{ getCurrency }}
                  <span style="color: #d62945">-{{ totalBetAmount }}</span>
                </p>
                <p
                  style="
                    border: 1px solid #007524;
                    padding: 3px 10px;
                    border-radius: 15px;
                  "
                >
                  {{ $lang.common_txt227 }}{{ getCurrency }}
                  <span style="color: #007524">+{{ totalBonusAmount }}</span>
                </p>
              </div>
            </div>
            <div class="m-t-20">
              <div
                v-for="(lastItem, lastIndex) in lastOrderListItem"
                :key="lastIndex"
                style="
                  background: #15110a;
                  padding: 10px;
                  border-radius: 10px;
                  margin-bottom: 15px;
                "
              >
                <div class="d-flex-s">
                  <p style="width: 36%; color: #ffa300">
                    {{ lastItem.shortFormName }}
                  </p>
                  <div v-if="lastItem.win" style="width: 30%">
                    <p class="go-win f-t-15">
                      <span
                        style="text-stroke: 0.2px #0e3317; font-weight: bold"
                      >
                        {{ $lang.common_txt204 }}
                      </span>
                    </p>
                  </div>

                  <p style="width: 33%; text-align: right">
                    {{ getCurrency }}
                    <span style="color: #007524">
                      +{{ lastItem.win ? lastItem.bonusAmount : 0 }}
                    </span>
                  </p>
                </div>
                <div
                  v-if="
                    !['szc11x6_1x_dwd_zu'].includes(lastItem.playType) &&
                    lastItem.betItem.length > 0
                  "
                  style="margin: 10px auto"
                >
                  <div
                    v-if="
                      !['szc11x6_ws_dx_zu', 'szc11x6_ws_ds_zu'].includes(
                        lastItem.playType,
                      )
                    "
                    class="d-flex"
                    style="flex-flow: wrap row"
                  >
                    <p
                      v-for="(item2, index2) in lastItem.betItem
                        .split('@')[0]
                        .split(',')"
                      :key="index2"
                      style="
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid var(--black-color);
                        font-weight: 800;
                        margin-right: 10px;
                        margin-bottom: 5px;
                      "
                      :class="{
                        'ac-sel3':
                          lastOrderList[0].lotteryResult &&
                          lastOrderList[0].lotteryResult.includes(item2),
                      }"
                    >
                      {{ item2 }}
                    </p>
                  </div>
                  <div v-else class="d-flex" style="flex-flow: wrap row">
                    <p
                      v-for="(item2, index2) in lastItem.betItem
                        .split('@')[0]
                        .split(',')"
                      :key="index2"
                      style="
                        border-radius: 50%;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid var(--black-color);
                        font-weight: 800;
                        margin-right: 10px;
                        margin-bottom: 5px;
                      "
                      :class="{
                        'ac-sel3':
                          lastOrderList[0].lotteryResult &&
                          lastOrderList[0].lotteryResult
                            .split(',')
                            [
                              lastOrderList[0].lotteryResult.split(',').length -
                                1
                            ].includes(item2),
                      }"
                    >
                      {{ item2 }}
                    </p>
                  </div>
                </div>
                <div v-else>
                  <div class="d-flex m-t-10">
                    <p
                      style="
                        background: linear-gradient(
                          180deg,
                          #ffd467 0%,
                          #df8a1b 100%
                        );
                        color: #573900;
                        border-radius: 10px;
                        border: none !important;
                        margin-right: 10px;
                        width: 30px;
                        height: 30px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                      "
                      v-for="(item, index) in [1, 2, 3, 4, 5, 6]"
                      :key="index"
                    >
                      {{ item }}
                    </p>
                  </div>
                  <div
                    v-if="lastItem.betItem.length > 0"
                    class="m-t-10"
                    style="display: flex"
                  >
                    <div
                      class="m-b-5"
                      v-for="(item2, index2) in lastItem.betItem
                        .split('@')[0]
                        .split('#')"
                      :key="index2"
                    >
                      <p
                        style="
                          width: 30px;
                          height: 30px;
                          margin-bottom: 5px;
                          border-radius: 50%;
                          margin-right: 10px;
                          display: flex;
                          justify-content: center;
                          align-items: center;
                        "
                        :style="{
                          border: ['*'].includes(item3.toString())
                            ? 'none'
                            : '1px solid',
                        }"
                        v-for="(item3, index3) in item2.split(',')"
                        :key="index3"
                        :class="
                          [item3].includes(
                            lastOrderList[0].lotteryResult
                              ? lastOrderList[0].lotteryResult.split(',')[
                                  index2
                                ]
                              : '',
                          )
                            ? 'ac-sel3'
                            : ''
                        "
                      >
                        {{ item3 }}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="m-t-5">
                  <span style="color: #007524">
                    {{ lastItem.betTimes }}
                  </span>
                  {{ $lang.common_txt205 }}
                  <span style="color: #007524">{{ lastItem.potCount }}</span>
                  {{ $lang.common_txt206 }}
                  <span style="color: #007524"
                    >{{ getCurrency }} {{ lastItem.betAmount }} </span
                  >.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div :key="timer3" class="loot-bot">
      <div v-if="lines > 0">
        <div
          style="
            background: #15110a;
            box-shadow: 1px -6px 4px -7px rgba(0, 0, 0, 0.5);
          "
        >
          <p
            style="
              background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
              width: 50px;
              border-radius: 0 0 10px 10px;
              padding: 2px 0;
              color: #573900;
              margin: 0 auto;
              text-align: center;
            "
            @click="getIsNo"
          >
            <van-icon :name="isOrNo ? 'arrow-up' : 'arrow-down'" size="18" />
          </p>
        </div>
        <div class="loot-bot--t d-flex">
          <div class="d-flex m-b-10">
            {{ $lang.common_txt72 }}
            <p class="loot-bot--tb">{{ lines }}</p>
            {{ $lang.common_txt73 }}
          </div>
          <div class="d-flex m-b-10">
            {{ $lang.common_txt74 }}
            <p class="loot-bot--tb">
              {{ $formatNumberWithCommas(lines * betAmount) }}
              {{ getCurrency }}
            </p>
          </div>
          <p
            style="
              border: 1px dashed var(--gary-color);
              width: 100%;
              margin-bottom: 8px;
            "
          ></p>

          <div v-if="isOrNo" class="d-flex-s" style="flex-flow: wrap row">
            <div
              class="d-flex m-b-10"
              v-for="(item, index) in winAmountList.slice(0, 1)"
              :key="index"
            >
              <div>
                <span>{{ item.bonusName }} :</span>
                <span style="color: #007524">
                  {{ $formatNumberWithCommas(item.winAmount) }}
                  {{ getCurrency }}
                </span>
              </div>
            </div>
          </div>
          <div v-else class="d-flex-s" style="flex-flow: wrap row">
            <div
              class="d-flex m-b-10"
              v-for="(item, index) in winAmountList"
              :key="index"
              style="min-width: 50%"
            >
              <div>
                <span>{{ item.bonusName }} :</span>
                <span style="color: #007524">
                  {{ $formatNumberWithCommas(item.winAmount) }}
                  {{ getCurrency }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="loot-bot--b d-flex-s">
        <div class="loot-bot--by" @click="showPopup = !showPopup">
          <img src="../../../assets/img/lottery/gwc.png" />
          <p class="loot-bot--byh">{{ orderList.length }}</p>
        </div>
        <div class="loot-bot--by" @click="restInit">
          <img src="../../../assets/img/lottery/sb1.png" />
        </div>
        <div class="loot-bot--by" @click="addOrder">
          <img src="../../../assets/img/lottery/tj.png" />
        </div>
        <!-- <van-field
          v-model="betAmount"
          class="custom-field"
          type="text"
          @input="handleInput"
        >
          <template #button>
            <span style="color: #e9a843">{{ getCurrency }}</span>
          </template>
        </van-field> -->

        <van-stepper
          v-model="betAmount"
          :decimal-length="decimalLength"
          step="50"
          :min="stepMin"
          @input="handleInput"
          @focus="openStepper"
        />
        <van-button
          @click="betPay"
          class="custom-button"
          style="border: 0 !important"
          :class="{ active: lines < 1 && orderList.length < 1 }"
          :disabled="lines < 1 && orderList.length < 1"
        >
          {{ $lang.common_txt76 }}
        </van-button>
      </div>
    </div>

    <div
      v-if="showStepper"
      style="
        background: #15110a;
        box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
        position: fixed;
        bottom: 60px;
        max-width: 380px;
        width: 280px;
        left: 0;
        right: 0;
        margin: 0 auto;
        padding: 20px 20px 10px 20px;
        border-radius: 10px;
      "
    >
      <div class="d-flex-s m-t-5" style="flex-flow: wrap row">
        <p
          class="d-flex"
          style="
            width: 30%;
            justify-content: center;
            border: 1px solid;
            border-radius: 8px;
            margin-bottom: 10px;
            padding: 5px 0;
          "
          v-for="(item, index) in [
            50, 150, 300, 400, 500, 600, 700, 800, 900, 1000, 1200, 1500, 2000,
            3000, 5000,
          ]"
          :key="index"
          @click="getAmount(index, item)"
          :class="{ 'amoun-active': getAmountIndex === index }"
        >
          {{ item }}
        </p>
      </div>
    </div>

    <van-popup
      v-model:show="showPopup2"
      closeable
      close-icon-position="top-right"
      position="bottom"
      class="custom-rule"
    >
      <div>
        <p class="f-w f-t-18 t-c" style="margin: 5px 0 20px">{{ ruleTitle }}</p>
        <!-- <p v-if="ruleTitle === 'Instructions'" class="title-color f-w f-t-15">
          {{ lotteryDescr }}
        </p> -->
        <div>
          <div
            v-if="ruleTitle === 'Instructions'"
            v-html="rule"
            style="word-break: break-all"
          ></div>
          <!-- <p v-html="rule2" class="title-color f-w f-t-15"></p> -->
          <div v-else>
            <div v-html="playDesc" style="word-break: break-all"></div>
            <div class="m-t-10" v-for="(item, index) in rule2" :key="index">
              <p
                v-if="
                  !['szc11x6_ws_dx_zu', 'szc11x6_ws_ds_zu'].includes(playType)
                "
                class="f-w f-t-13 m-b-5"
              >
                {{ item.winningConditions }}({{ $lang.common_txt176 }}:{{
                  $formatNumberWithCommas(item.bonusAmount * betAmount)
                }}
                {{ getCurrency }})
              </p>
              <div v-else class="m-t-10">
                <p v-html="item.winningConditions"></p>
                ({{ $lang.common_txt176 }}:{{
                  $formatNumberWithCommas(item.bonusAmount * betAmount)
                }})
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>

    <!-- <van-popup
      v-model:show="showTop"
      position="top"
      :closeable="false"
      class="custom-top"
    >
      <div class="custom-top--bg">
        <div
          class="custom-top--bgi"
          v-for="(item, index) in allLotteryList"
          :key="index"
          @click="selectTypeLx(item)"
        >
          {{ item.lotteryType }}
        </div>
      </div>
    </van-popup> -->

    <Lottery-day-history
      v-model="showPopup3"
      :betRecordList="betRecordList"
      :info="info"
      :lotteryType="lotteryType"
      :lotteryName="lotteryName"
      overlay
    >
    </Lottery-day-history>

    <lottery-order
      v-model="showPopup"
      :orderList="orderList"
      :balance="balance"
      @updateList="updateList"
      @updateList2="updateList2"
      @beyOrder="beyOrder"
      overlay
    ></lottery-order>

    <van-overlay :show="showOverlay" @click="getTopClose" />
    <van-overlay :show="showOverlay2" @click="getShowGnClose" />
    <van-popup
      v-model:show="typeIsf"
      class="custom-popup"
      :close-on-click-overlay="false"
      :style="{ width: '82%' }"
    >
      <div class="c-content">
        <div class="c-content--c t-c m-t-20 m-b-20">
          {{ $lang.common_txt212 }}
        </div>
        <div class="d-flex-s c-content--i">
          <van-button
            @click="close5"
            size="large"
            class="custom-button active-btn"
            >{{ $lang.Cancelar }}
          </van-button>
          <van-button @click="confirm5" size="large" class="custom-button"
            >{{ $lang.common_txt213 }}
          </van-button>
        </div>
      </div>
    </van-popup>
    <!-- <van-popup
      v-model:show="conwShow"
      class="custom-popup"
      :style="{ width: '70%' }"
      transition
    >
      <p
        style="
          display: flex;
          justify-content: center;
          align-items: center;
          height: 150px;
          font-size: 15px;
          font-weight: bold;
        "
      >
        Apostas de loteria encerradas.
      </p>
    </van-popup> -->
  </div>
</template>
<script>
import {
  // MainInit,
  LotteryInit,
  LotteryBetV2,
  GameBalanceList,
  GetTodayBetRecord,
  GetServerDateTime,
  FreshIssueInfo,
  GetLotteryLatestResults,
  GetLotteryList,
  LastOrderDetail,
} from "@/api/common";
export default {
  name: "LotteryDetail",
  data() {
    return {
      getAmountIndex: null,
      selectedDxsqIndexList: Array(6).fill(-1), // 长度与排数一致，每项存储当前排的选中按钮索引（-1表示未选中）
      selectDxsqIndex: null,
      conwShow: false,
      // 倒计时剩余毫秒数
      remainingTime: 0,
      // 定时器ID
      timer: null,
      formattedTime: "00:00:00:00",
      isOrNo: false,
      typeIsIndex: 0,
      typeIsf: false,
      playDesc: "",
      timer3: null,
      stepMin: 1,
      decimalLength: 0,
      selectMonthIndex: null,
      monthList: [
        {
          id: 1,
          name: this.$lang.common_txt99,
        },
        {
          id: 2,
          name: this.$lang.common_txt100,
        },
        {
          id: 3,
          name: this.$lang.common_txt101,
        },
        {
          id: 4,
          name: this.$lang.common_txt102,
        },
        {
          id: 5,
          name: this.$lang.common_txt103,
        },
        {
          id: 6,
          name: this.$lang.common_txt104,
        },
        {
          id: 7,
          name: this.$lang.common_txt105,
        },
        {
          id: 8,
          name: this.$lang.common_txt106,
        },
        {
          id: 9,
          name: this.$lang.common_txt107,
        },
        {
          id: 10,
          name: this.$lang.common_txt108,
        },
        {
          id: 11,
          name: this.$lang.common_txt109,
        },
        {
          id: 12,
          name: this.$lang.common_txt110,
        },
      ],
      numList: 0,
      showOverlay2: false,
      showOverlay: false,
      ruleTitle: "",
      showTop: false,
      showGn: false,
      gnList: [
        {
          img: require("@/assets/img/lottery/rule.png"),
          name: this.$lang.common_txt80,
        },
        {
          img: require("@/assets/img/lottery/rule2.png"),
          name: this.$lang.common_txt81,
        },
        {
          img: require("@/assets/img/lottery/rule3.png"),
          name: this.$lang.common_txt82,
        },
      ],
      showPopup3: false,
      showPopup2: false,
      rule: "",
      rule2: "",
      showPopup: false,
      betAmount: 1,
      playRuleList: [],
      selectIndex: 0,
      typeName: "",
      selectedElementIds: [],
      selectedElementIds2: [],
      selectedElementIds3: [],
      selectedByColumn: Array(7)
        .fill()
        .map(() => []),
      selectedByColumn2: Array(6)
        .fill()
        .map(() => []),
      playType: "",
      betType: "",
      winAmountList: [],
      bonusAmount: 0,
      lines: 0,
      orderList: [],
      inputArray: "",
      // selectedPType: 'p2',
      result: false,
      linesList: [],
      currIssueNo: "",
      getCurrIssueNo: "",
      lotteryName: "",
      timeleft: 0, // 初始倒计时时间
      intervalId: null, // 用于存储定时器的 ID
      schemeList: [],
      balance: 0,
      betRecordList: [],
      pageIndex: 0,
      info: {
        todayBetCurrAmount: 0,
        todayBetEffAmount: 0,
        todayBonusAmount: 0,
        todayProfitLossAmount: 0,
      },
      lotteryType: "",
      allLotteryList: [],
      lotteryRules: "",
      currLotteryTime: "",
      dateStr: "",
      lastLotteryResult: "",
      resultBasedOn: "",
      lastIssueNo: "",
      lotteryDescr: "",
      iconUrl: "",
      selectLotteryType: null,
      timer2: null,
      lotteryTypeName: this.$route.query.lotteryName
        ? this.$route.query.lotteryName
        : "",
      lotteryResultTimer: null,
      hsTime: null,
      hsTime2: null,
      lastOrderList: [],
      lastOrderListItem: [],
      totalBetAmount: 0,
      totalBonusAmount: 0,
      pollTimer: null, // 轮询计时器（用于停止轮询）,
      dxdsSelect: null,
      showStepper: false,
    };
  },
  created() {
    // 设置定时器，每 30 秒调用一次接口
  },
  async mounted() {
    // 初始化数组长度（假设共6排）
    await this.resherLotteryInit();
    // await this.FreshIssueInfo()
    // await this.GetLotteryLatestResults()
    // this.MainInit()
    this.GetLotteryList();
    this.LotteryInit();
    this.LastOrderDetail();
    this.GetGameBalanceList();
  },
  beforeUnmount() {
    this.clearPollTimer();
    // 组件销毁前清除定时器
    if (this.timer) {
      clearInterval(this.timer);
    }
    clearInterval(this.timer2); // 组件销毁前清除定时器
    clearInterval(this.intervalId); // 组件销毁前清除定时器
    if (this.lotteryResultTimer) clearInterval(this.lotteryResultTimer);
  },
  computed: {
    selectedElementsString() {
      return this.selectedElementIds.join(",");
    },
  },
  methods: {
    getAmount(i, v) {
      this.getAmountIndex = i;
      this.betAmount = v;
      this.showStepper = false;
    },
    openStepper() {
      this.getAmountIndex = null;
      this.showStepper = !this.showStepper;
    },
    dxdsFun(i) {
      this.dxdsSelect = i;
      if (this.playType === "szc11x6_ws_dx_zu") {
        if (i === 0) {
          this.selectedElementIds = [
            "08",
            "09",
            "10",
            "11",
            "12",
            "13",
            "14",
            "15",
          ];
        } else {
          this.selectedElementIds = [
            "00",
            "01",
            "02",
            "03",
            "04",
            "05",
            "06",
            "07",
          ];
        }
      } else {
        if (i === 0) {
          this.selectedElementIds = [
            "01",
            "03",
            "05",
            "07",
            "09",
            "11",
            "13",
            "15",
          ];
        } else {
          this.selectedElementIds = [
            "00",
            "02",
            "04",
            "06",
            "08",
            "10",
            "12",
            "14",
          ];
        }
      }
      this.setOrderType();
    },
    // 清除轮询计时器（统一管理，避免内存泄漏）
    clearPollTimer() {
      if (this.pollTimer) {
        clearTimeout(this.pollTimer);
        this.pollTimer = null;
      }
    },
    // async LastOrderDetail(v, isF) {
    //   try {
    //     const data = await LastOrderDetail({
    //       lotteryType: v ? v : this.$route.query.lotteryType
    //     })
    //     this.lastOrderList = data.content.lastOrderList
    //     this.lastOrderListItem = data.content.lastOrderList.reduce(
    //       (result, order) => {
    //         // 严格判断 betItemList 是数组才合并
    //         if (Array.isArray(order.betItemList)) {
    //           return result.concat(order.betItemList)
    //         }
    //         return result
    //       },
    //       []
    //     )
    //     const totals = this.lastOrderListItem.reduce(
    //       (acc, item) => {
    //         // 累加投注金额（容错：非数字按 0 算）
    //         acc.bet += Number(item.betAmount) || 0
    //         // 累加中奖金额：仅当 bonusAmount 存在、是数字、且大于 0 时
    //         const bonus = Number(item.bonusAmount)
    //         if (!isNaN(bonus) && bonus > 0) {
    //           acc.bonus += bonus
    //         }

    //         return acc
    //       },
    //       { bet: 0, bonus: 0 }
    //     ) // 初始值

    //     this.totalBetAmount = totals.bet
    //     this.totalBonusAmount = totals.bonus
    //     // 3. 检查是否存在待开奖订单
    //     const hasWaitingOrder = this.lastOrderList.some(
    //       (order) => order.orderStatus === 'bet$draw_waiting'
    //     )

    //     // 4. 有则继续轮询（2秒后），无则清除计时器
    //     if (hasWaitingOrder && isF !== 'F') {
    //       console.log(777)

    //       // 先清除已有计时器（避免重复轮询）
    //       this.clearPollTimer()
    //       // 2秒后再次调用接口
    //       this.pollTimer = setTimeout(() => {
    //         this.LastOrderDetail(v) // 传入相同参数保持查询条件一致
    //       }, 2000)
    //     } else {
    //       console.log(888)
    //       // 无待开奖订单，停止轮询
    //       this.clearPollTimer()
    //       // console.log('所有订单已开奖，停止轮询')
    //     }
    //   } catch (error) {
    //     // console.error('查询订单详情失败：', error)
    //     // 异常时也停止轮询（避免无限报错）
    //     this.clearPollTimer()
    //   }
    // },
    async LastOrderDetail(v, isF) {
      try {
        const data = await LastOrderDetail({
          lotteryType: v ? v : this.$route.query.lotteryType,
        });

        this.lastOrderList = data.content.lastOrderList;
        this.lastOrderListItem = this.lastOrderList.reduce((arr, o) => {
          return Array.isArray(o.betItemList) ? arr.concat(o.betItemList) : arr;
        }, []);

        const totals = this.lastOrderListItem.reduce(
          (acc, item) => {
            acc.bet += Number(item.betAmount) || 0;
            const bonus = Number(item.bonusAmount);
            if (!isNaN(bonus) && bonus > 0) acc.bonus += bonus;
            return acc;
          },
          { bet: 0, bonus: 0 },
        );
        this.totalBetAmount = totals.bet;
        this.totalBonusAmount = totals.bonus;

        /* 1. 是否还有“待开奖”订单 */
        const hasWaitingOrder = this.lastOrderList.some(
          (order) => order.orderStatus === "bet$draw_waiting",
        );

        /* 2. 没有待开奖订单：停止订单轮询 + 停止开奖结果轮询 */
        if (!hasWaitingOrder) {
          this.clearPollTimer(); // 停止订单轮询
          if (this.lotteryResultTimer) {
            clearInterval(this.lotteryResultTimer); // 停止开奖结果轮询
            this.lotteryResultTimer = null;
          }
          return; // 直接返回，不再继续轮询
        }

        /* 3. 仍有待开奖订单，继续轮询（避免重复定时器）*/
        if (isF !== "F") {
          this.clearPollTimer();
          this.pollTimer = setTimeout(() => this.LastOrderDetail(v), 2000);
        }
      } catch (e) {
        this.clearPollTimer();
      }
    },
    goToBin() {
      window.open(this.resultBasedOn, "_blank");
    },
    async GetLotteryLatestResults(v) {
      const data = await GetLotteryLatestResults({
        lotteryType: v ? v : this.$route.query.lotteryType,
      });
      if (data.content.lastIssueNo === this.getCurrIssueNo) {
        this.lastLotteryResult = data.content.lastLotteryResult;
        this.resultBasedOn = data.content.resultBasedOn;
        // 相等时停止定时器
        if (this.lotteryResultTimer) {
          clearInterval(this.lotteryResultTimer);
          this.lotteryResultTimer = null;
        }
      } else {
        // 不相等时确保定时器在运行
        if (!this.lotteryResultTimer) {
          this.lotteryResultTimer = setInterval(() => {
            this.GetLotteryLatestResults();
          }, 2000); // 每2秒查询一次
        }
      }
    },
    async FreshIssueInfo(v) {
      let old = Math.floor(Date.now() / 1000);
      const data = await FreshIssueInfo({
        lotteryType: v ? v : this.$route.query.lotteryType,
      });
      if (data.status === "ok") {
        this.remainingTime =
          new Date(data.content.currBetEndTime).getTime() -
          new Date(this.dateStr).getTime();
        let olds = Math.floor(Date.now() / 1000);
        this.hsTime2 = olds - old;

        // 开始倒计时
        this.currIssueNo = data.content.currIssueNo;
        this.getCurrIssueNo = data.content.historyLotteryInfoList[0].issueNo;
        this.startCountdown();
      }
    },
    async resherLotteryInit() {
      let old = Math.floor(Date.now() / 1000);
      const data = await GetServerDateTime();
      this.dateStr = data.content.dateStr;
      let olds = Math.floor(Date.now() / 1000);
      this.hsTime = olds - old;
    },
    // 开始倒计时
    startCountdown() {
      // 清除已有定时器
      if (this.timer) {
        clearInterval(this.timer);
      }

      // 立即更新一次时间显示
      this.updateTimeDisplay();

      // 设置定时器，每秒更新一次
      this.timer = setInterval(async () => {
        this.remainingTime -= 1000;

        // 检查是否倒计时结束
        if (this.remainingTime <= 0) {
          this.$toast({
            message: this.$lang.common_txt214,
          });
          // this.conwShow = true
          this.remainingTime = 0;
          this.updateTimeDisplay();
          clearInterval(this.timer);
          // 倒计时结束后重新获取时间并继续倒计时
          await this.resherLotteryInit();
          await this.FreshIssueInfo(this.selectLotteryType);
          await this.GetLotteryLatestResults(this.selectLotteryType);
          await this.LastOrderDetail(this.selectLotteryType);
          // setTimeout(() => {
          //   this.conwShow = false
          // }, 2000)
          return;
        }
        this.updateTimeDisplay();
      }, 1000);
    },
    // 更新时间显示格式
    updateTimeDisplay() {
      // 1. 计算原始剩余时间（可能为负数），取绝对值转为「正向累计时间」
      const totalPositiveTime = Math.abs(this.remainingTime);

      // 2. 基于正向累计时间，重新计算天、时、分、秒（均为非负）
      const days = Math.floor(totalPositiveTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (totalPositiveTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor(
        (totalPositiveTime % (1000 * 60 * 60)) / (1000 * 60),
      );
      // 修正：原始秒数计算需基于「正向累计时间」，而非原始剩余时间
      const seconds =
        Math.floor((totalPositiveTime % (1000 * 60)) / 1000) -
        this.hsTime -
        this.hsTime2;

      // 3. 确保秒数最终非负（避免hsTime导致的负数，折算到分钟）
      let adjustedMinutes = minutes;
      let adjustedSeconds = seconds;
      if (adjustedSeconds < 0) {
        // 秒数为负时，从分钟借1（60秒），确保秒数非负
        const borrow = Math.ceil(Math.abs(adjustedSeconds) / 60);
        adjustedMinutes = Math.max(0, adjustedMinutes - borrow);
        adjustedSeconds += borrow * 60;
      }

      // 4. 格式化数字为两位数（0-9补前导零）
      const format = (num) => num.toString().padStart(2, "0");

      // 5. 构建时间部分数组（逻辑不变，仅使用调整后的非负时间）
      const timeParts = [];
      if (days > 0) {
        timeParts.push(format(days));
      }
      if (days > 0 || hours > 0) {
        timeParts.push(format(hours));
      }
      // 分钟需显示（即使为0，因为秒数可能非零）
      timeParts.push(format(adjustedMinutes));
      timeParts.push(format(adjustedSeconds));

      // 6. 拼接成最终正向格式（无负数，纯正向时间）
      this.formattedTime = timeParts.join(":");
    },
    getIsNo() {
      this.isOrNo = !this.isOrNo;
    },
    // getMon(i) {
    //   if (i === 'megasena') {
    //     return 195
    //   } else if (i === 'lotomania') {
    //     return 3
    //   } else if (i === 'quina') {
    //     return 50
    //   } else if (i === 'milionaria') {
    //     return 183
    //   } else if (i === 'lotofacil') {
    //     return 6.8
    //   } else if (i === 'duplasena') {
    //     return 2.7
    //   } else if (i === 'diadesorte') {
    //     return 2.1
    //   } else if (i === 'supersete') {
    //     return 2.7
    //   }
    // },
    getShowGn() {
      this.showOverlay2 = !this.showOverlay2;
      this.showOverlay = false;
      this.showGn = !this.showGn;
      this.showTop = false;
      // this.showOverlay = false
    },
    getShowGnClose() {
      this.showGn = false;
      this.showOverlay2 = false;
    },
    getTopClose() {
      this.showTop = false;
      this.showOverlay = false;
    },
    getShowTop() {
      this.showOverlay = !this.showOverlay;
      this.showTop = !this.showTop;
      this.showGn = false;
      this.showOverlay2 = false;
    },
    close5() {
      this.typeIsf = false;
    },
    confirm5() {
      this.orderList = [];
      this.typeIsf = false;
      this.selectTypeLx(this.typeIsIndex);
    },
    async selectTypeLx(v) {
      await this.resherLotteryInit();
      // await this.FreshIssueInfo(v.lotteryType)
      // await this.GetLotteryLatestResults(v.lotteryType)
      this.typeIsIndex = v;
      if (this.orderList.length > 0 && v.lotteryType !== this.lotteryType) {
        this.typeIsf = true;
        return;
      }
      this.LotteryInit(v.lotteryType);
      this.LastOrderDetail(v.lotteryType);
      this.selectLotteryType = v.lotteryType;
      this.showTop = false;
      this.showOverlay = false;
      this.lotteryTypeName = v.lotteryName;
    },
    async GetTodayBetRecord() {
      const data = await GetTodayBetRecord({
        lotteryType: this.$route.query.lotteryType,
        pageIndex: this.pageIndex,
      });
      if (data.status === "ok") {
        this.betRecordList = data.content.betRecordList;
        this.info.todayBetCurrAmount = data.content.todayBetCurrAmount;
        this.info.todayBetEffAmount = data.content.todayBetEffAmount;
        this.info.todayBonusAmount = data.content.todayBonusAmount;
        this.info.todayProfitLossAmount = data.content.todayProfitLossAmount;
      }
    },
    openGn(i) {
      this.showOverlay2 = false;
      if (i === 1) {
        this.GetTodayBetRecord();
        this.showPopup3 = true;
      } else if (i === 2) {
        this.$jumpTo("/latestResults", {
          lotteryType: this.lotteryType,
          lotteryName: this.lotteryName,
        });
      } else if (i === 0) {
        this.rule = this.lotteryRules;
        this.ruleTitle = "Instructions";
        this.showPopup2 = true;
      }

      this.showGn = false;
    },
    onClickLeft() {
      if (this.$route.query.typeCate == 1) {
        this.$router.go(-1);
      } else {
        this.$jumpTo("/home", {}, { replace: true });
      }
    },
    async GetGameBalanceList() {
      const data = await GameBalanceList();
      if (data.status === "ok") {
        this.balance = data.content.balance;
      }
    },
    getRule() {
      this.rule2 = this.playRuleList[this.selectIndex].bonusList;
      this.ruleTitle = "Jogabilidade";
      this.showPopup2 = true;
      this.playDesc = this.playRuleList[this.selectIndex].playDesc;
    },
    getElementIds(selectedElementIds, lines) {
      // if (this.lotteryType === 'milionaria') {
      //   return (
      //     selectedElementIds.join(',') +
      //     '#' +
      //     this.selectedElementIds2.join(',') +
      //     '@' +
      //     lines
      //   )
      // } else if (this.lotteryType === 'diadesorte') {
      //   return (
      //     selectedElementIds.join(',') +
      //     '#' +
      //     [this.selectMonthIndex] +
      //     '@' +
      //     lines
      //   )
      // } else if (this.lotteryType === 'lotomania') {
      //   let newArr = selectedElementIds.map((value) => {
      //     return value === 100 ? '00' : value
      //   })
      //   return newArr.join(',') + '@' + lines
      // } else if (this.lotteryType === 'supersete') {
      //   return (
      //     this.selectedByColumn
      //       .map((subArray) => subArray.join(','))
      //       .join('#') +
      //     '@' +
      //     lines
      //   )
      // } else
      if (this.playType === "szc11x6_1x_dwd_zu") {
        return (
          this.selectedByColumn2
            .map((item) => (item.length ? item.join(",") : "*"))
            .join("#")
            .replace(/\d+/g, (num) => this.padZero(num)) +
          "@" +
          lines
        );
      } else {
        return selectedElementIds.join(",") + "@" + lines;
      }
    },
    getElementIds2(
      selectedElementIds,
      lines,
      selectedElementIds2,
      selectedByColumn,
      selectedByColumn2,
    ) {
      // if (['milionaria', 'diadesorte'].includes(this.lotteryType)) {
      //   return selectedElementIds + '#' + selectedElementIds2 + '@' + lines
      // } else if (this.lotteryType === 'lotomania') {
      //   let newArr = selectedElementIds.split(',').map((value) => {
      //     return value == '100' ? '00' : value
      //   })
      //   return newArr.join(',') + '@' + lines
      // } else if (this.lotteryType === 'supersete') {
      //   return (
      //     selectedByColumn.map((subArray) => subArray.join(',')).join('#') +
      //     '@' +
      //     lines
      //   )
      // } else
      if (this.playType === "szc11x6_1x_dwd_zu") {
        return (
          selectedByColumn2
            .map((item) => (item.length ? item.join(",") : "*"))
            .join("#")
            .replace(/\d+/g, (num) => this.padZero(num)) +
          "@" +
          lines
        );
      } else {
        return selectedElementIds + "@" + lines;
      }
    },
    async betPay(v) {
      // this.getErrorFun()
      if (this.lines > 0 && v !== "or") {
        this.schemeList.push({
          playType: this.playType,
          // betItem: this.selectedElementIds.join(',') +  '@' + this.lines,
          betItem: this.getElementIds(this.selectedElementIds, this.lines),
          betTimes: Number(this.betAmount),
          betAmount: this.betAmount * this.lines,
          betType: this.betType,
          potType: "Y",
          doRebate: "no",
          level: "1",
        });
      }
      this.orderList.forEach((i) => {
        this.schemeList.push({
          playType: i.playType,
          betItem: this.getElementIds2(
            i.setBall,
            i.lines,
            i.setBall2,
            i.selectedByColumn,
            i.selectedByColumn2,
          ),
          betTimes: Number(i.betAmount),
          betAmount: i.amount,
          betType: i.betType,
          potType: "Y",
          doRebate: "no",
          level: "1",
        });
      });
      this.getTotalAll();
      let params = {
        saleFlag: "no",
        lotteryType: this.lotteryType,
        currIssueNo: this.currIssueNo,
        totalAmount: this.getTotalAll(),
        orderContent: "",
        formatContent: "",
        issueList: [1],
        schemeList: this.schemeList,
      };
      if (this.getTotalAll() > this.balance) {
        this.$toast({
          message: this.$lang.common_txt95,
          icon: "fail",
        });
        return;
      }

      if (this.playType !== "szc11x6_1x_dwd_zu") {
        this.schemeList = this.schemeList.map((item) => {
          const [numbers, times] = item.betItem.split("@");
          let skipPadding = false;

          const numberArray = numbers.split(",").map((num) => {
            if (num.includes("#")) {
              // 分割 # 前后部分，对前面的数字补零
              const [numPart, hashPart] = num.split("#"); // 拆分数字和#
              const paddedNum = numPart.length < 2 ? "0" + numPart : numPart;
              skipPadding = true;
              return `${paddedNum}#${hashPart || ""}`; // 拼接补零后的数字和#
            } else if (skipPadding) {
              return num;
            } else {
              return num.length < 2 ? "0" + num : num;
            }
          });

          item.betItem = numberArray.join(",") + "@" + times;
          return item;
        });
      }

      if (this.lines > 0 || this.orderList.length > 0) {
        const data = await LotteryBetV2(params);
        if (data.status === "ok") {
          this.$toast({
            message: this.$lang.Sucesso,
            icon: "success",
          });
          this.LastOrderDetail(this.selectLotteryType, "F");
          this.GetGameBalanceList();
        } else {
          this.$toast({
            message: data.msg,
            icon: "cross",
          });
        }
      } else {
        this.$toast({
          message: this.$lang.common_txt114,
          icon: "fail",
        });
      }

      this.schemeList = [];
      this.orderList = [];
      this.restInit();
    },
    getTotalAll() {
      return this.schemeList.reduce((accumulator, current) => {
        return accumulator + current.betAmount;
      }, 0);
    },
    beyOrder(v) {
      this.betPay(v);
      this.showPopup = false;
    },
    updateList() {
      this.orderList = [];
      this.getTotalAll();
    },
    updateList2() {
      this.getTotalAll();
    },
    // 补零方法
    padZero(value) {
      return value.toString().padStart(2, "0");
    },
    ErrorFun(v) {
      this.$toast({
        message: this.$lang.common_txt83 + v + this.$lang.common_txt84,
        icon: "fail",
      });
    },
    delOrder(i) {
      this.orderList.splice(i, 1); // 删除指定下标处的元素
    },
    getErrorFun() {
      if (this.betAmount < this.stepMin) {
        this.$toast({
          message: this.$lang.common_txt113 + this.stepMin,
          icon: "fail",
        });
        return;
      }

      if (
        this.selectedElementIds.length < 1 &&
        !["star7_zu"].includes(this.playType) &&
        !["szc11x6_1x_dwd_zu"].includes(this.playType)
      ) {
        this.$toast({
          message: this.$lang.common_txt112,
          icon: "fail",
        });
        return;
      }

      if (
        ["szc11x6_r2_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 2
      ) {
        this.ErrorFun(2);
        return;
      }
      if (
        ["szc11x6_r3_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 3
      ) {
        this.ErrorFun(3);
        return;
      }
      if (
        ["szc11x6_r4_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 4
      ) {
        this.ErrorFun(4);
        return;
      }
      if (
        ["szc11x6_r5_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 5
      ) {
        this.ErrorFun(5);
        return;
      }

      if (
        ["wperm2_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 2
      ) {
        this.ErrorFun(2);
        return;
      }

      if (
        ["wperm3_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 3
      ) {
        this.ErrorFun(3);
        return;
      }

      if (
        ["wperm4_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 4
      ) {
        this.ErrorFun(4);
        return;
      }

      if (
        ["wperm5_zu"].includes(this.playType) &&
        this.selectedElementIds.length < 5
      ) {
        this.ErrorFun(5);
        return;
      }
      if (
        ["szc11x6_1x_dwd_zu"].includes(this.playType) &&
        !this.selectedByColumn2.some((col) => col.length > 0)
      ) {
        this.$toast({
          message: this.$lang.common_txt112,
          icon: "fail",
        });
        return;
      }
    },
    addOrder() {
      this.getErrorFun();
      // if (['star7_zu'].includes(this.playType)) {
      //   this.selectedElementIds = this.selectedByColumn.flat()
      // }

      if (["szc11x6_1x_dwd_zu"].includes(this.playType)) {
        this.selectedElementIds = this.selectedByColumn2
          .map((item) => (item.length === 0 ? ["*"] : item))
          .flat();
      }
      let setBall2 = "";
      if (
        this.lotteryType === "milionaria" &&
        this.selectedElementIds2.length > 1
      ) {
        setBall2 = this.selectedElementIds2.join(",");
      } else if (
        this.lotteryType === "diadesorte" &&
        this.selectMonthIndex > 0
      ) {
        setBall2 = [this.selectMonthIndex].join(",");
      }

      this.orderList.unshift({
        setBall: this.selectedElementIds.join(","),
        betType: this.betType,
        amount: this.betAmount * this.lines,
        winAmountList: this.winAmountList,
        betAmount: this.betAmount,
        lines: this.lines,
        playType: this.playType,
        setBall2: setBall2,
        selectedByColumn: this.selectedByColumn,
        selectedByColumn2: this.selectedByColumn2,
        lotteryName: this.lotteryName,
        betTypeName: this.typeName,
      });
      this.restInit();
    },
    handleInput() {
      // if (value > 0) {
      //   this.setOrderType()
      // }
      // if (
      //   this.selectedElementIds.length > 0 ||
      //   this.selectedElementIds2.length > 0
      // ) {
      // this.selecOrderType()
      // }
      this.setOrderType();
    },
    getWinAmountList() {
      this.winAmountList = this.playRuleList
        .filter((i) => i.playType === this.playType)[0]
        .bonusList.map((i2) => {
          return {
            num: i2.bonusName,
            winAmount: this.betAmount * i2.bonusAmount,
            bonusName: i2.bonusName,
          };
        });
    },
    // 组合数计算工具函数
    combination(n, k) {
      if (k > n) return 0;
      if (k === 0 || k === n) return 1;
      if (k > n - k) k = n - k; // 优化计算量

      let result = 1;
      for (let i = 1; i <= k; i++) {
        result = (result * (n - k + i)) / i;
      }
      return Math.round(result); // 确保整数结果
    },
    selecOrderType() {
      const n = this.selectedElementIds.length;
      // const n2 = this.selectedElementIds2.length
      const n3 = this.selectedByColumn2.flat().length;

      // if (this.lotteryType === 'lotofacil') {
      //   if (this.playType === 'star1_zud') {
      //     if (n === 0) return (this.lines = 0)
      //     this.lines = this.combination(n, 1)
      //   } else {
      //     if (n < 15 || n > 20) return 0
      //     // 组合数计算公式：C(n,15) = n!/(15!*(n-15)!)
      //     this.lines = this.combination(n, 15)
      //   }
      //   this.getWinAmountList()
      // } else

      if (
        ["szc11x6_ws_dx_zu", "szc11x6_ws_ds_zu"].includes(this.playType) &&
        this.dxdsSelect !== null
      ) {
        this.lines = 1;
        this.getWinAmountList();
      }

      if (["szc11x6_1x_dwd_zu"].includes(this.playType)) {
        if (n3 === 0 || n3 > 60) return (this.lines = 0);
        this.lines = this.combination(n3, 1);
        this.getWinAmountList();
      } else if (
        [
          "szc11x6_6x_zu",
          "szc11x6_r6_zu",
          "szc11x6_r5_zu",
          "szc11x6_r4_zu",
          "szc11x6_r3_zu",
          "szc11x6_r2_zu",
          "szc11x6_r1_zu",
        ].includes(this.playType)
      ) {
        if (["szc11x6_6x_zu", "szc11x6_r6_zu"].includes(this.playType)) {
          if (n < 6 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 6);
        } else if (["szc11x6_r5_zu"].includes(this.playType)) {
          if (n < 5 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 5);
        } else if (["szc11x6_r4_zu"].includes(this.playType)) {
          if (n < 4 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 4);
        } else if (["szc11x6_r3_zu"].includes(this.playType)) {
          if (n < 3 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 3);
        } else if (["szc11x6_r2_zu"].includes(this.playType)) {
          if (n < 2 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 2);
        } else if (["szc11x6_r1_zu"].includes(this.playType)) {
          if (n === 0 || n > 10) return (this.lines = 0);
          this.lines = this.combination(n, 1);
        }
        this.getWinAmountList();
      } else if (["w1st_drawn", "wperm1_zu"].includes(this.playType)) {
        if (n === 0 || n > 50) return (this.lines = 0);
        this.lines = this.combination(n, 1);
        this.getWinAmountList();
      } else if (["wperm2_zu"].includes(this.playType)) {
        if (n === 0 || n > 50) return (this.lines = 0);
        this.lines = this.combination(n, 2);
        this.getWinAmountList();
      } else if (["wperm3_zu"].includes(this.playType)) {
        if (n === 0 || n > 50) return (this.lines = 0);
        this.lines = this.combination(n, 3);
        this.getWinAmountList();
      } else if (["wperm4_zu"].includes(this.playType)) {
        if (n === 0 || n > 50) return (this.lines = 0);
        this.lines = this.combination(n, 4);
        this.getWinAmountList();
      } else if (["wperm5_zu"].includes(this.playType)) {
        if (n === 0 || n > 50) return (this.lines = 0);
        this.lines = this.combination(n, 5);
        this.getWinAmountList();
      }
    },
    setOrderType() {
      if (
        this.selectedElementIds.length > 0 ||
        this.selectedElementIds2.length > 0 ||
        this.selectedElementIds3.length > 0 ||
        this.selectedByColumn.length > 0
      ) {
        this.selecOrderType();
      } else if (this.selectedElementIds.length === 0) {
        this.winAmountList = [];
        this.lines = 0;
      }
      this.timer3++;
    },
    // handleClick5(i) {
    //   this.selectMonthIndex = i
    //   this.selecOrderType()
    // },
    // 在methods中添加以下方法
    getGnJ(index, index2) {
      this.selectDxsqIndex = index2;
      // const currentCol = this.selectedByColumn2[index];
      this.selectedDxsqIndexList[index] = index2;

      switch (index2) {
        case 0: {
          // 加 {} 包裹作用域
          this.selectedByColumn2[index] = [];
          for (let i = 1; i < 16; i += 2) {
            this.selectedByColumn2[index].push(i);
          }
          break;
        }
        case 1: {
          // 加 {} 包裹作用域
          this.selectedByColumn2[index] = [];
          for (let i = 0; i < 16; i += 2) {
            this.selectedByColumn2[index].push(i);
          }
          break;
        }
        case 2: {
          // 加 {} 包裹作用域
          this.selectedByColumn2[index] = [];
          const nums = []; // 变量声明被 {} 包裹
          while (nums.length < 10) {
            const randomNum = Math.floor(Math.random() * 16);
            if (!nums.includes(randomNum)) {
              nums.push(randomNum);
            }
          }
          this.selectedByColumn2[index] = nums.sort((a, b) => a - b);
          break;
        }
        case 3: {
          // 加 {} 包裹作用域
          this.selectedByColumn2[index] = [];
          break;
        }
      }

      this.setOrderType();
    },
    handleClick6(colIndex, num) {
      const colSelected2 = this.selectedByColumn2[colIndex];
      if (colSelected2.includes(num)) {
        // 取消选中：从数组中删除该数字
        this.selectedByColumn2[colIndex] = colSelected2.filter(
          (item) => item !== num,
        );
      } else {
        if (["szc11x6_1x_dwd_zu"].includes(this.playType)) {
          // 选中：确保每列不超过3个，且插入后保持从小到大排序
          if (colSelected2.length < 10) {
            colSelected2.push(num);
            colSelected2.sort((a, b) => a - b); // 排序保证从小到大
            this.selectedByColumn2[colIndex] = [...colSelected2]; // 触发响应式更新
          }
        }
      }
      // this.selectedElementIds3 = this.selectedByColumn.flat()
      this.setOrderType();
    },
    // handleClick3(colIndex, num) {
    //   const colSelected = this.selectedByColumn[colIndex]
    //   if (colSelected.includes(num)) {
    //     // 取消选中：从数组中删除该数字
    //     this.selectedByColumn[colIndex] = colSelected.filter(
    //       (item) => item !== num
    //     )
    //   } else {
    //     if (this.lotteryType === 'supersete') {
    //       // 选中：确保每列不超过3个，且插入后保持从小到大排序
    //       if (colSelected.length < 3) {
    //         colSelected.push(num)
    //         colSelected.sort((a, b) => a - b) // 排序保证从小到大
    //         this.selectedByColumn[colIndex] = [...colSelected] // 触发响应式更新
    //       }
    //     }
    //   }
    //   this.selectedElementIds3 = this.selectedByColumn.flat()
    //   this.setOrderType()
    // },
    // handleClick2(id) {
    //   const index = this.selectedElementIds2.indexOf(id)
    //   if (index === -1) {
    //     this.selectedElementIds2.push(id)
    //   } else {
    //     this.selectedElementIds2.splice(index, 1)
    //   }
    //   this.setOrderType()
    // },
    handleClick(id) {
      const index = this.selectedElementIds.indexOf(id);
      if (index === -1) {
        if (
          [
            "w1st_drawn",
            "wperm1_zu",
            "wperm2_zu",
            "wperm3_zu",
            "wperm4_zu",
            "wperm5_zu",
          ].includes(this.playType) &&
          this.selectedElementIds.length === 50
        ) {
          return;
        }
        if (
          [
            "szc11x6_6x_zu",
            "szc11x6_r6_zu",
            "szc11x6_r5_zu",
            "szc11x6_r4_zu",
            "szc11x6_r3_zu",
            "szc11x6_r2_zu",
            "szc11x6_r1_zu",
          ].includes(this.playType) &&
          this.selectedElementIds.length === 10
        ) {
          return;
        }
        this.selectedElementIds.push(id);
      } else {
        this.selectedElementIds.splice(index, 1);
      }
      this.setOrderType();
    },

    isSelected(id) {
      return this.selectedElementIds.includes(id);
    },
    isSelected2(id) {
      return this.selectedElementIds2.includes(id);
    },
    isSelected3(colIndex, num) {
      return this.selectedByColumn[colIndex].includes(num);
    },
    isSelected4(colIndex, num) {
      return this.selectedByColumn2[colIndex].includes(num);
    },

    async GetLotteryList() {
      const data = await GetLotteryList();
      if (data.status === "ok") {
        let arr1 = data.content.allLotteryList.filter((i) =>
          ["L"].includes(i.freqType),
        );
        let arr2 = data.content.allLotteryList.filter((i2) =>
          ["tron16x660", "tron16x6180", "tron16x6300", "tron16x6600"].includes(
            i2.lotteryType,
          ),
        );
        let arr3 = data.content.allLotteryList.filter((i3) =>
          ["eth16x660", "eth16x6180", "eth16x6300", "eth16x6600"].includes(
            i3.lotteryType,
          ),
        );
        let arr4 = data.content.allLotteryList.filter((i4) =>
          ["bnb16x660", "bnb16x6180", "bnb16x6300", "bnb16x6600"].includes(
            i4.lotteryType,
          ),
        );

        this.allLotteryList = [
          {
            list: arr1,
            name: "Loterias",
            img: require("@/assets/img/lottery/cp_l1.png"),
          },
          {
            list: arr2,
            name: "TRON",
            img: require("@/assets/img/lottery/cp_l2.png"),
          },
          {
            list: arr3,
            name: "ETH",
            img: require("@/assets/img/lottery/cp_l3.png"),
          },
          {
            list: arr4,
            name: "BNB",
            img: require("@/assets/img/lottery/cp_l4.png"),
          },
        ];
      }
    },

    // async MainInit() {
    //   const data = await MainInit()
    //   if (data.status === 'ok') {
    //     let arr1 = data.content.allLotteryList.filter((i) =>
    //       [
    //         'megasena',
    //         'lotomania',
    //         'quina',
    //         'milionaria',
    //         'lotofacil',
    //         'duplasena',
    //         'diadesorte',
    //         'supersete'
    //       ].includes(i.lotteryType)
    //     )
    //     let arr2 = data.content.allLotteryList.filter((i2) =>
    //       ['tron16x660', 'tron16x6180', 'tron16x6300', 'tron16x6600'].includes(
    //         i2.lotteryType
    //       )
    //     )
    //     let arr3 = data.content.allLotteryList.filter((i3) =>
    //       ['eth16x660', 'eth16x6180', 'eth16x6300', 'eth16x6600'].includes(
    //         i3.lotteryType
    //       )
    //     )
    //     let arr4 = data.content.allLotteryList.filter((i4) =>
    //       ['bnb16x660', 'bnb16x6180', 'bnb16x6300', 'bnb16x6600'].includes(
    //         i4.lotteryType
    //       )
    //     )

    //     this.allLotteryList = [
    //       {
    //         list: arr1,
    //         name: 'Loterias Caixa',
    //         img: require('@/assets/img/lottery/cp_l1.png')
    //       },
    //       {
    //         list: arr2,
    //         name: 'TRON',
    //         img: require('@/assets/img/lottery/cp_l2.png')
    //       },
    //       {
    //         list: arr3,
    //         name: 'ETH',
    //         img: require('@/assets/img/lottery/cp_l3.png')
    //       },
    //       {
    //         list: arr4,
    //         name: 'BNB',
    //         img: require('@/assets/img/lottery/cp_l4.png')
    //       }
    //     ]
    //   }
    // },

    async LotteryInit(v) {
      const data = await LotteryInit({
        playGroup: "odds",
        lotteryType: v ? v : this.$route.query.lotteryType,
      });
      if (data.status === "ok") {
        if (
          [
            "tron16x660",
            "tron16x6180",
            "tron16x6300",
            "tron16x6600",
            "eth16x660",
            "eth16x6180",
            "eth16x6300",
            "eth16x6600",
            "bnb16x660",
            "bnb16x6180",
            "bnb16x6300",
            "bnb16x6600",
          ].includes(data.content.lotteryType)
        ) {
          this.numList = Array.from({ length: 16 }, (_, i) => i);
        } else {
          this.numList = 90;
        }
        this.lotteryName = data.content.lotteryName;
        this.playRuleList = data.content.playRuleList.filter(
          (i) =>
            ![
              "wnap1_zh",
              "wnap2_zh",
              "wnap3_zh",
              "wnap4_zh",
              "wnap5_zh",
            ].includes(i.playType),
        );
        this.currIssueNo = data.content.currIssueNo;
        this.resultBasedOn = data.content.resultBasedOn;
        // this.timeleft = data.content.timeleft
        this.lotteryType = data.content.lotteryType;
        this.lotteryRules = data.content.lotteryRules;
        this.currLotteryTime = data.content.currLotteryTime;
        this.selectType(0, data.content.playRuleList[0]);
        this.getCurrIssueNo = data.content.lastIssueNo;
        this.remainingTime =
          new Date(data.content.currBetEndTime).getTime() -
          new Date(this.dateStr).getTime();
        // this.startCountdown() // 组件挂载后开始倒计时
        this.startCountdown(); // 组件挂载后开始倒计时
        this.lastLotteryResult = data.content.lastLotteryResult;
        this.lotteryDescr = data.content.lotteryDescr;
        this.iconUrl = data.content.iconUrl;
      }
    },
    selectType(i, v) {
      this.dxdsSelect = null;
      if (
        [
          "szc11x6_r6_zu",
          "szc11x6_r5_zu",
          "szc11x6_r4_zu",
          "szc11x6_r3_zu",
          "szc11x6_r2_zu",
          "szc11x6_r1_zu",
          "szc11x6_1x_dwd_zu",
        ].includes(v.playType)
      ) {
        this.stepMin = 50;
        this.betAmount = 50;
      } else {
        this.stepMin = 20;
        this.betAmount = 20;
      }
      this.timer3++;
      this.restInit();
      this.selectIndex = i;
      this.typeName = v.betTypeName;
      this.playType = v.playType;
      this.betType = v.betType;
      this.bonusAmount = v.bonusList[0].bonusAmount;
    },
    restInit() {
      this.selectedElementIds = [];
      this.selectedElementIds2 = [];
      this.selectedElementIds3 = [];
      this.selectMonthIndex = null;
      this.selectedByColumn = Array(7)
        .fill()
        .map(() => []);
      this.selectedByColumn2 = Array(6)
        .fill()
        .map(() => []);
      this.winAmountList = [];
      this.lines = 0;
      this.betAmount = 1;
      this.linesList = [];
      this.dxdsSelect = null;
      // this.orderList = []
    },
    quickPick() {
      this.restInit();
      if (["szc11x6_6x_zu", "szc11x6_r6_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(6);
        this.setOrderType();
      } else if (["szc11x6_r5_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(5);
        this.setOrderType();
      } else if (["szc11x6_r4_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(4);
        this.setOrderType();
      } else if (["szc11x6_r3_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(3);
        this.setOrderType();
      } else if (["szc11x6_r2_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(2);
        this.setOrderType();
      } else if (["szc11x6_r1_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 9) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(1);
        this.setOrderType();
      } else if (["szc11x6_1x_dwd_zu"].includes(this.playType)) {
        const newSelected = [...this.selectedByColumn2.map((col) => [...col])];

        // 从所有列中随机选择一列
        const randomColIndex = Math.floor(Math.random() * newSelected.length);
        const targetCol = newSelected[randomColIndex];

        // 生成1-16的随机数
        const randomNum = Math.floor(Math.random() * 16);

        // 确保随机数未被选中（兼容已有选择的情况）
        if (!targetCol.includes(randomNum)) {
          targetCol.push(randomNum);
          // 保持列内从小到大排序
          targetCol.sort((a, b) => a - b);
        }
        // 更新选中状态（触发响应式更新）
        this.selectedByColumn2 = newSelected;
        this.setOrderType();
      } else if (["w1st_drawn", "wperm1_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 49) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(1);
        this.setOrderType();
      } else if (["wperm2_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 49) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(2);
        this.setOrderType();
      } else if (["wperm3_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 49) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(3);
        this.setOrderType();
      } else if (["wperm4_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 49) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(4);
        this.setOrderType();
      } else if (["wperm5_zu"].includes(this.playType)) {
        if (this.selectedElementIds.length > 49) {
          return;
        }
        this.selectedElementIds = this.getRandomNumbers(5);
        this.setOrderType();
      }
    },
    getRandomNumbers(count) {
      let qNewNUm = 0;
      if (
        [
          "tron16x660",
          "tron16x6180",
          "tron16x6300",
          "tron16x6600",
          "eth16x660",
          "eth16x6180",
          "eth16x6300",
          "eth16x6600",
          "bnb16x660",
          "bnb16x6180",
          "bnb16x6300",
          "bnb16x6600",
        ].includes(this.lotteryType)
      ) {
        qNewNUm = 15;
      } else {
        qNewNUm = 90;
      }

      // 创建一个从1到qNewNUm的数组
      const numbers = Array.from({ length: qNewNUm }, (_, i) => i + 1);

      // 打乱数组顺序
      const shuffled = [...numbers].sort(() => 0.5 - Math.random());

      // 计算需要补齐的随机数个数
      const missingCount = count - this.selectedElementIds.length;

      // 如果需要补齐的随机数个数小于等于0，直接返回selectedElementIds
      if (missingCount <= 0) {
        return this.selectedElementIds.slice(0, count);
      }

      // 从打乱的数组中取出需要补齐的随机数
      const randomNumbers = shuffled
        .filter((num) => !this.selectedElementIds.includes(num))
        .slice(0, missingCount);

      // 将补齐的随机数和selectedElementIds合并
      const result = this.selectedElementIds.concat(randomNumbers);

      // 如果result的长度小于count，继续补齐随机数
      while (result.length < count) {
        const additionalRandomNumbers = shuffled
          .filter((num) => !result.includes(num))
          .slice(0, count - result.length);
        result.push(...additionalRandomNumbers);
      }

      return result;
      // const numbers = Array.from({ length: qNewNUm }, (_, i) => i + 1)
      // const shuffled = [...numbers].sort(() => 0.5 - Math.random())
      // return shuffled.slice(0, count)
    },
  },
};
</script>
<style lang="less" scoped>
.lot-cont {
  // margin-top: 15px;
  display: flex;
  flex-flow: row wrap;
  position: relative;
  justify-content: space-between;
}
.lot-cont--i {
  // background: #15110a;
  // color: @title-color;
  border: 1px solid #e9a843;
  padding: 7px 6px;
  border-radius: 8px;
  margin-bottom: 8px;
  margin-right: 7px;
  font-weight: bold;
}
.active-type {
  color: #ffa300;
  // background: @primary-color;
  border: 1px solid #ffa300;
  background: rgba(255, 163, 0, 0.12);
}
.lot-mid {
  width: 100%;
  border-radius: 13px;
  // background: #15110a;
}
.lot-mid--top {
  // background: linear-gradient(to right, #333838, #3a4435, #415031);
  // border-radius: 13px 13px 0 0;
  padding: 5px 10px 5px 2px;
  // color: #75fcaa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // align-items: center;
  // justify-content: flex-end;
}
// .lot-mid--m {
//   border-radius: 13px 13px 0 0;
//   background: #2a2d2e;
//   text-align: center;
//   width: 92%;
//   margin: 0 auto;
//   font-size: 15px;
//   font-weight: bold;
//   padding: 12px 0;
// }
.lot-mid--b {
  background: #2a2418;
  border: 1px solid rgba(233, 168, 67, 0.35);
  width: 100%;
  margin: 0 auto 0;
  padding: 0 5px 10px;
  // flex-flow: wrap row;
  padding-top: 10px;
  border-radius: 13px;
  // box-shadow: -10px 0 10px rgba(1, 1, 1, 0.5), 10px 0 10px rgba(0, 0, 0, 0.5);
  overflow-y: scroll;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(12%, 1fr));
  gap: 5px;
  justify-content: start;
}
.lot-mid--bi {
  border-radius: 50%;
  width: 38px;
  height: 38px;
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.4);
  color: #ffe4b5;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 5px 5px 5px;
  font-weight: 800;
  font-size: 13px;
  // color: @wihte-color;
}
.lot-mid--b2i {
  display: flex;
  align-items: center;
  justify-content: center;
  background: url(../../../assets/img/lottery/hua.png) no-repeat;
  font-weight: 800;
  font-size: 15px;
  background-size: 100% 100%;
  width: 45px;
  height: 45px;
  color: @wihte-color;
}
// .lot-mid--b > div:last-child {
//   margin-right: 265px; /* 或者padding-right */
// }
.lot-mid--b3 {
  width: 100%;
  margin: 0 auto 0;
  padding: 10px 10px;
  border-radius: 13px;
  border: 1px solid #475304;
}
.lot-mid--b3z {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  padding: 10px 0;
  text-align: center;
  font-size: 18px;
  font-weight: 800;
  color: #573900;
  border-radius: 20px;
}

// .lot-mid--b3i {
// }
.lot-mid--b3is {
  margin: 10px 0;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  width: 38px;
  height: 38px;
}
.lot-mid--b3is2 {
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.35);
  color: #ffe4b5;
  font-size: 15px;
  font-weight: 800;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  width: 38px;
  height: 38px;
  margin-bottom: 10px;
}
.selected-element {
  // background: url(../../../assets/img/lottery/select-q.png) no-repeat;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  background-size: 100% 100%;
  width: 38px;
  height: 38px;
  color: #573900;
}
.selected-element2 {
  background: url(../../../assets/img/lottery/hua_s.png) no-repeat;
  background-size: 100% 100%;
  width: 45px;
  height: 45px;
  color: @black-color;
}
.selected-element3 {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  width: 38px;
  height: 38px;
  color: #573900;
}
.lot-bto-t {
  position: relative;
  margin-top: 20px;
  width: 100%;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  border-radius: 13px 13px 0 0;
  padding: 12px;
  line-height: 18px;
}
.lot-bto-t::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #1d1814,
    #e9a843,
    #ffa300,
    #e9a843,
    #1d1814
  );
}
.lot-bto-t2 {
  padding: 10px 12px;
  font-weight: bold;
  letter-spacing: 3px; /* 增加2像素的字母间距 */
  width: 100%;
  // white-space: pre-wrap; /* 保留空白符序列，但是正常换行 */
  overflow-wrap: break-word; /* 允许在单词内换行 */
  // word-break: break-all; /* 允许在单词内换行 */
  line-height: 20px;
}
.lot-bto-t3 {
  position: relative;
  background: #15110a;
  padding: 20px 0 15px;
  // border-bottom: 1px solid #797b7b;
}
.lot-bto-t3::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #1d1814,
    #e9a843,
    #ffa300,
    #e9a843,
    #1d1814
  );
}
.lot-bto-t3y {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  padding: 5px 9px;
  border-radius: 50%;
}
.lot-bto-t3t {
  width: 100%;
  background: #2a2418;
  padding: 15px;
  :deep(.van-field__control) {
    text-align: center;
  }
  .custom-field {
    margin-top: 5px;
    text-align: center;
    border-radius: 20px;
    font-size: 12px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.4);
  }
}
.lot-bto-t3tl {
  background: #2a2418;
  border-radius: 20px;
  width: 100%;
  margin-top: 5px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.custom-button-xg {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  border-bottom: 2px solid #df8a1b !important;
  color: #573900;
  box-shadow: none;
  border-radius: 20px;
  margin-top: 20px;
}
.lot-bto-t4t {
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  padding: 12px;
  border-top: 1px solid #797b7b;
  margin-top: 3px;
  display: flex;
  justify-content: space-between;
  position: relative;
  font-weight: bold;
}
.lot-bto-t4t::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #1d1814,
    #e9a843,
    #ffa300,
    #e9a843,
    #1d1814
  );
}
.lot-bto-t4b {
  font-weight: bold;
  padding: 12px;
  background: linear-gradient(0deg, #1d1814 13.46%, #252020 100%);
  position: relative;
}
.lot-bto-t4b::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 1px; /* 边框高度 */
  background: linear-gradient(
    to right,
    #1d1814,
    #e9a843,
    #ffa300,
    #e9a843,
    #1d1814
  );
}
.lot-bto-t4bc {
  background: #2a2418;
  padding: 5px 10px;
  border-radius: 20px;
}
.lot-bto-t5 {
  margin-top: 5px;
  border-top: 1px solid #797b7b;
  background: #15110a;
  padding: 15px 0;
  border-radius: 0 0 13px 13px;
}
.lot-bto-t5c {
  background: #2a2418;
  padding: 12px;
}
.lot-bto-t5ct {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  padding: 5px 10px;
  border-radius: 20px;
}
.lot-cont--top {
  background: url(../../../assets/img/lottery/lot-le1.png) no-repeat;
  // background: #df8a1b;
  background-size: 100% 100%;
  width: 100%;
  // height: 110px;
  margin-bottom: 10px;
  padding: 10px 20px 10px 15px;
  color: @wihte-color;
  border-radius: 12px;
  min-height: 130px;
}
.lot-cont--topb {
  background: url(../../../assets/img/lottery/lz2.png) no-repeat;
  background-size: 100% 100%;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 15px;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0;
  width: 110px;
  text-align: center;
}
.lot-cont--topc {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  padding: 5px 0;
  width: 110px;
  text-align: center;
}

.loot-bot {
  position: fixed;
  bottom: 0;
  .custom-field {
    // margin-top: 5px;
    text-align: center;
    border-radius: 20px;
    font-size: 12px;
    display: flex;
    height: 35px;
    align-items: center;
    justify-content: center;
    background: #2a2418;
    border: 1px solid rgba(233, 168, 67, 0.35);
    width: 100px;

    :deep(.van-field__control) {
      color: #ffa300;
    }
  }
  .custom-button {
    width: 100px;
    box-shadow: none;
    border-radius: 20px;
    height: 35px;
    background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
    color: #573900;
  }
}
.loot-bot--b {
  width: 100vw;
  padding: 10px 15px;
  border-radius: 15px 15px 0 0;
  background: #15110a;
  border-top: 1px solid rgba(233, 168, 67, 0.35);
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.5);
  // border-top: 1px solid #a89b7c;
}
.loot-bot--by {
  position: relative;
  // background: #3b4142;
  border-radius: 50%;
  // padding: 6px 8px;
  // margin-right: 10px;
  img {
    width: 30px;
    height: 30px;
  }
}
.loot-bot--t {
  background: #15110a;
  // box-shadow: 1px -6px 4px -7px rgba(0, 0, 0, 0.5);
  font-weight: bold;
  padding: 10px 15px;
  flex-flow: wrap row;
  justify-content: space-between;
  font-size: 13px;
  color: #a89b7c;
}
.loot-bot--tb {
  border-radius: 12px;
  border: 1px solid #a89b7c;
  padding: 2px 15px;
  margin: 0 5px;
  color: #007524;
}
.loot-bot--byh {
  position: absolute;
  top: -8px;
  background: #d62945;
  padding: 1px 5px;
  border-radius: 50%;
  right: -5px;
  color: @wihte-color;
}
.lot-rule {
  // position: absolute;
  // right: 9px;
  // bottom: 16px;
  margin-bottom: 10px;
}
.custom-rule {
  background: #15110a;
  color: #ffe4b5;
  border-radius: 20px 20px 0 0;
  padding: 20px 20px 30px;
  :deep(.van-popup__close-icon--top-right) {
    color: @title-color;
    border-radius: 50%;
    padding: 3px;
    border: 1px solid;
    font-size: 13px;
  }
}
.botHight {
  padding-bottom: 180px !important;
}
.lottery-bg {
  position: sticky;
  top: 0;
  z-index: 999;
}
.lottery-title {
  position: relative;
  height: 55px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #15110a;
  border-bottom: 1px solid rgba(233, 168, 67, 0.3);
  padding: 0 16px;
  // background: url(../../../assets/img/toubu.png) no-repeat;
  // background-size: cover;
  // box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}
.lot-gn-t {
  position: fixed;
  top: 55px;
  z-index: 9;
  right: 0;
  background: #15110a;
  border: 1px solid rgba(233, 168, 67, 0.35);
  color: #ffe4b5;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.6);
  padding: 10px;
}
.custom-top {
  border-radius: 0 0 15px 15px;
  background: #15110a;
  margin-top: 55px;
}
// :deep(.van-overlay) {
//   margin-top: 55px;
// }
.custom-top--bg {
  position: absolute;
  padding: 15px 20px 5px;
  background: #15110a;
  color: #ffe4b5;
  border: 1px solid rgba(233, 168, 67, 0.35);
  border-radius: 0 0 15px 15px;
  width: 100%;
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
}
.custom-top--bgi {
  display: inline-block;
  border: 1px solid;
  padding: 5px;
  border-radius: 20px;
  font-weight: bold;
  font-size: 15px;
  margin-bottom: 10px;
  margin-right: 15px;
}
.active {
  opacity: 1;
  background: linear-gradient(to right, #717171, #6f6f6f) !important;
}

.active-typeName {
  color: #573900 !important;
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
}
.lot-mid--b2 {
  background: #2a2418;
  border: 1px solid rgba(233, 168, 67, 0.35);
  margin: 10px auto 0;
  padding: 10px 10px;
  border-radius: 13px;
}
.lot-mid--b2c {
  display: flex;
  justify-content: space-between;
}
.lot-mid--b5 {
  margin-top: 20px;
  padding: 10px;
  border: 1px solid;
  border-radius: 10px;
}
.lot-mid--b5i {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.lot-mid--b5i2 {
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  width: 22%;
  margin-bottom: 10px;
  min-height: 50px;
  border: 1px solid;
  border-radius: 10px;
  color: #ffa300;
  font-weight: 800;
}
.active-month {
  border: 1px solid #d62945;
  color: #d62945;
}
.lot-lte {
  background: url(../../../assets/img/lottery/lot-le2.png) no-repeat;
  background-size: 100% 100%;
  height: 45px;
  width: 150px;
}
.lot-lte2 {
  // background: url(../../../assets/img/lottery/lot-le3.png) no-repeat;
  // background-size: 100% 100%;
  background: #d62945;
  height: 45px;
  border-radius: 5px;
  width: 150px;
}

/* PC 端样式 */
@media (min-width: 769px) {
  /* 隐藏滚动条样式 */
  &::-webkit-scrollbar {
    display: none;
  }
  .loot-bot--b {
    width: 450px;
  }
  .loot-bot--t {
    width: 450px;
  }
  .lot-gn-t {
    right: 50.6%;
    transform: translate(134%, 0%);
  }
}
.custom-popup {
  background-color: @cont-bg; /* 设置背景色 */
  border-radius: 20px;
  font-size: 14px;
  /* 使用深度选择器覆盖默认关闭按钮样式 */
  :deep(.van-popup__close-icon) {
    color: @wihte-color; /* 修改图标颜色 */
    font-size: 20px;
    right: 15px;
    top: 10px;
  }
  :deep(.van-button--large) {
    height: 45px;
  }

  .c-content {
    padding: 25px 22px;
  }
  .c-content--i {
    width: 85%;
    margin: 0 auto;
  }

  .custom-button {
    // box-shadow: none;
    width: 45%;
  }
}
.active-btn {
  // box-shadow: inset 0px -1px 0px 0px rgba(0, 0, 0, 0.15);
  background: #d62945;
  box-shadow: inset 0px -2px 0px 0px rgba(0, 0, 0, 0.15);
  border-bottom: none !important;
}
.lot-ball {
  background: url("../../../assets/img/lottery/select-q.png") no-repeat;
  background-size: 100% 100%;
  width: 32px;
  height: 32px;
  color: @black-color;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-weight: bold;
}
.active-dxsq {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  color: #573900 !important;
}
.go-win {
  background: url("../../../assets/img/lottery/lot_gho.png") no-repeat;
  background-size: 100% 100%;
  width: 72px;
  color: @wihte-color;
  text-align: center;
  margin-top: -21px;
  height: 22px;
}
.ac-sel3 {
  color: @wihte-color;
  background: #ed0000;
  border: 1px solid #ed0000 !important;
}
.dxds-active {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%) !important;
  color: #573900 !important;
}
.amoun-active {
  background: linear-gradient(180deg, #ffd467 0%, #df8a1b 100%);
  color: #573900;
  font-weight: bold;
}
.dxds--cont {
  background: url("../../../assets/img/lottery/select_cpds.png") no-repeat;
  background-size: 100% 100%;
  width: 100px;
  height: 140px;
  padding: 45px 5px 0 5px;
}
</style>
