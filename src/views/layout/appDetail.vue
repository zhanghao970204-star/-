<template>
  <div class="gp-detail-root">
    <div
      class="app-header-bar gp-detail-header-row"
      style="padding-left: 12.8px; padding-right: 12.8px"
      :class="{ 'app-header-bar--shadow': isShadowVisible }"
    >
      <div>
        <img src="@/assets/img/google.png" alt="" style="width: 176px" />
      </div>
      <div class="app-detail-header-menu">
        <a><img src="@/assets/google/search.svg" alt="Search" /></a>
        <a><img src="@/assets/google/help.svg" alt="Help" /></a>
        <a
          ><img
            src="@/assets/google/avatar.png"
            alt="User"
            style="width: 32px; height: 32px"
        /></a>
      </div>
    </div>
    <div class="app-container">
      <div class="flex-col page" style="margin-top: 0">
        <div class="flex-col group">
        <div class="flex-row self-stretch group_2 app-detail-hero-row">
          <img
            class="image app-detail-app-icon"
            src="@/assets/img/logo.webp"
            alt=""
          />
          <div
            class="flex-col items-start flex-1 self-start group_3"
            style="margin-left: 24px"
          >
            <span class="text" style="line-height: 24.48px">{{
              $lang.cont_txt6
            }}</span>
            <span class="mt-16 text_2" style="margin-top: 11.2px">{{
              $lang.cont_txt7
            }}</span>
            <span style="margin-top: 8px">{{ $lang.cont_txt8 }}</span>
          </div>
        </div>
        <div
          class="flex-row justify-between self-stretch group_4"
          style="margin-top: 20.8px !important"
        >
          <div class="flex-row items-center self-start group_7">
            <div class="flex-col group_8">
              <div class="flex-row items-center">
                <span class="font_2 text_4">4.9</span>
                <img class="image_2 ml-1-5" src="@/assets/img/start.png" />
              </div>
              <span class="font_3 text_7 mt-13-5"
                >46K {{ $lang.cont_txt9 }}</span
              >
            </div>
            <div class="section"></div>
          </div>
          <div class="flex-col items-center self-start group_9">
            <span class="font_2 text_5">{{ $lang.cont_txt10 }}</span>
            <span class="mt-16 font_3 text_8">{{ $lang.cont_txt11 }}</span>
          </div>
          <div class="flex-row items-center group_5">
            <div class="shrink-0 section"></div>
            <div class="flex-col shrink-0 group_6">
              <div class="flex-col justify-start items-center self-center">
                <img
                  src="@/assets/img/igaa.webp"
                  style="width: 16px; margin-bottom: 8px; margin-top: 12.8px"
                />
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span class="self-stretch font_3 text_6 mt-5">{{
                  $lang.cont_txt12
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-col self-stretch group_10">
          <div
            @click="installApp"
            class="cursor-pointer google-install-app shiny"
          >
            <div class="d-f-s" style="justify-content: center">
              <img src="@/assets/img/sd.png" style="width: 11.2px" /><span
                style="font-size: 15.2px; color: #ffe336; margin-left: 6.4px"
                >{{ $lang.cont_txt13 }}</span
              >
            </div>
            <span style="font-size: 12px">{{ $lang.cont_txt14 }}</span>
          </div>

          <div
            class="flex-row equal-division group_11 mt-18-5 scbtn"
            style="margin-left: 16px"
          >
            <div class="flex-row items-center equal-division-item">
              <img class="shrink-0 image_3" src="@/assets/img/share.png" />
              <span class="ml-10 text_10 f-s-1">{{ $lang.cont_txt15 }}</span>
            </div>
            <div
              class="ml-22 flex-row items-center equal-division-item_2 group_12 scbtn"
              style="margin-left: 32px"
            >
              <img class="shrink-0 image_3" src="@/assets/img/sc.png" />
              <div
                class="d-f-c f-s-1 text_12 ml-13-5"
                style="line-height: 16px"
              >
                <span>{{ $lang.cont_txt16 }} </span>
                <span>{{ $lang.cont_txt17 }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="flex-row relative group_13" style="margin-top: 35.2px">
          <img class="image_4" src="@/assets/img/banner1.png" />
          <img class="image_4" src="@/assets/img/banner2.png" />
          <img class="image_4" src="@/assets/img/banner3.png" />
          <img class="image_4" src="@/assets/img/banner4.png" />
          <img class="image_4" src="@/assets/img/banner5.png" />
        </div>
        <div class="flex-col self-stretch group_15">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
            "
          >
            <span class="self-start f-s-2">{{ $lang.cont_txt18 }}</span>
            <img src="@/assets/img/right.png" style="margin-right: 16px" />
          </div>

          <div class="flex-col self-stretch group_16 mt-15-5">
            <span class="self-stretch app-detail-about-text">
              {{ $lang.cont_txt19 }}
            </span>
          </div>
        </div>
        <div class="d-f-s">
          <div
            class="flex-col items-start self-stretch"
            style="margin-top: 24px"
          >
            <span class="text_14" style="font-size: 15.2px; color: #202124">{{
              $lang.cont_txt20
            }}</span>
            <span class="text_15" style="margin-top: 8px">{{
              $lang.cont_txt21
            }}</span>
          </div>
        </div>
        <div class="app-detail-tag-list">
          <span
            v-for="(item, index) in tagList"
            :key="index"
            class="app-detail-tag"
          >
            {{ item }}
          </span>
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
          "
        >
          <span class="self-start f-s-2">{{ $lang.cont_txt28 }}</span>
          <img src="@/assets/img/right.png" style="margin-right: 16px" />
        </div>
        <div class="flex-col self-stretch group_18">
          <span class="self-stretch f-c-1" style="margin-right: 16px">
            {{ $lang.cont_txt29 }}
          </span>
        </div>
        <div class="flex-col self-stretch group_19">
          <div class="flex-col self-stretch f-c-1">
            <div class="flex-row self-start group_20">
              <img
                class="shrink-0 self-start image_7"
                src="@/assets/img/share1.png"
              />
              <div class="d-f-c">
                <p class="ml-18 flex-1">{{ $lang.cont_txt30 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt31 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt32 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt33 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt34 }}</p>
              </div>
            </div>
          </div>

          <div class="flex-col self-stretch group_21 f-c-1">
            <div class="flex-row self-start group_22">
              <img
                class="shrink-0 self-start image_8"
                src="@/assets/img/cloud.png"
              />
              <div class="d-f-c">
                <p class="ml-18 flex-1">{{ $lang.cont_txt35 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt36 }}</p>
                <p class="ml-18 flex-1">{{ $lang.cont_txt37 }}</p>
                <p class="ml-18 flex-1">
                  {{ $lang.cont_txt38 }}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex-row items-center self-stretch group_23 f-c-1"
            style="margin-top: 19.2px"
          >
            <img
              class="image_7"
              src="https://play-lh.googleusercontent.com/W5DPtvB8Fhmkn5LbFZki_OHL3ZI1Rdc-AFul19UK4f7np2NMjLE5QquD6H0HAeEJ977u3WH4yaQ=s20"
            />
            <span class="ml-18">{{ $lang.cont_txt39 }}</span>
          </div>
          <div
            class="flex-row items-center self-stretch group_23 f-c-1"
            style="margin-top: 19.2px"
          >
            <img
              class="image_7"
              src="https://play-lh.googleusercontent.com/ohRyQRA9rNfhp7xLW0MtW1soD8SEX45Oec7MyH3FaxtukWUG_6GKVpvh3JiugzryLi7Bia02HPw=s20"
            />
            <div class="d-f-c">
              <p class="ml-18 text_20">
                {{ $lang.cont_txt40 }}
              </p>
            </div>
          </div>

          <span
            class="self-start font text_21"
            style="color: #01875f; margin-left: 11.2px; margin-top: 36.8px"
          >
            {{ $lang.cont_txt41 }}</span
          >
        </div>
      </div>
      <div class="flex-col group_25">
        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
          "
        >
          <span class="self-start f-s-2">{{ $lang.cont_txt42 }}</span>
          <img src="@/assets/img/right.png" style="margin-right: 4.8px" />
        </div>
        <div style="display: flex; align-items: center; margin-top: 16px">
          <span class="self-stretch font_3 text_6 mt-5">{{
            $lang.cont_txt43
          }}</span>
          <img
            src="@/assets/img/info2.png"
            style="width: 20.8px; margin: 4.8px 0 0 2.4px"
          />
        </div>
        <div class="flex-row equal-division_2 group_26">
          <div class="flex-row items-center equal-division-item_3 section_2">
            <img class="image_10" src="@/assets/img/phone.png" />
            <span class="font text_24 ml-9-5">{{ $lang.cont_txt44 }}</span>
          </div>
          <div
            class="ml-14 flex-row items-center equal-division-item_3 group_27"
          >
            <img class="image_11" src="@/assets/img/phone1.png" />
            <span class="font text_25 ml-9">{{ $lang.cont_txt45 }}</span>
          </div>
        </div>
        <div class="flex-col self-stretch group_28">
          <div class="flex-row" style="margin-left: 112px">
            <span class="font_10">5</span>
            <div
              class="flex-col justify-start items-start section_3 ml-14-5"
            >
              <div class="section_4"></div>
            </div>
          </div>
          <div
            class="flex-row justify-between group_29"
            style="justify-content: start !important"
          >
            <span class="self-start" style="font-size: 52.04px; color: #202124"
              >4,9</span
            >
            <div class="flex-col" style="margin-left: 32px">
              <div class="flex-row">
                <span class="font_10 text_27">4</span>
                <div class="shrink-0 section_3 ml-14-5">
                  <div class="section_5"></div>
                </div>
              </div>
              <div class="flex-row" style="margin-top: 8px">
                <span class="font_10 text_28">3</span>
                <div class="shrink-0 section_3 ml-14-5"></div>
              </div>
              <div class="flex-row items-center" style="margin-top: 8px">
                <span class="font_10">2</span>
                <div class="shrink-0 section_3 ml-14-5"></div>
              </div>
            </div>
          </div>
          <div class="flex-col group_30">
            <div class="flex-row">
              <img class="image_12" src="@/assets/img/start1.png" />
              <img class="image_12 ml-2-5" src="@/assets/img/start1.png" />
              <img class="image_12 ml-2-5" src="@/assets/img/start1.png" />
              <img class="image_12 ml-2-5" src="@/assets/img/start1.png" />
              <img class="image_12 ml-2-5" src="@/assets/img/start6.png" />
            </div>
            <div
              class="flex-row relative group_31"
              style="margin-left: 112px; margin-top: -11.2px"
            >
              <span class="font_10 text_29">1</span>
              <div class="section_3" style="margin-left: 16.4px" ></div>
            </div>
          </div>
        </div>
        <div style="margin: 16px 0 0 5.6px" class="f-c-1">
          {{ $lang.cont_txt46 }}
        </div>

        <div
          class="flex-row justify-between items-center self-stretch group_21 view_2"
          style="margin-top: 32px"
        >
          <div class="flex-row items-center">
            <img class="shrink-0 image_13" src="@/assets/img/avatar1.png" />
            <span class="font_5 text_30 ml-13">{{ $lang.cont_txt47 }}</span>
          </div>
          <img
            class="image_14"
            src="@/assets/img/share2.png"
            style="margin-right: 24px"
          />
        </div>
        <div class="flex-row items-center self-stretch group_32">
          <img class="image_15" src="@/assets/img/start_3.png" />
          <img class="image_16" src="@/assets/img/start_2.png" />
          <span class="font_11 text_31">{{ $lang.cont_txt48 }}</span>
        </div>
        <div class="flex-col items-start self-stretch group_33 f-c-1">
          <span>{{ $lang.cont_txt49 }}</span>
          <div style="margin-top: 16px">
            {{ $lang.cont_txt50 }}
          </div>
          <div class="d-f-s" style="margin-top: 12.8px">
            <p>{{ $lang.cont_txt51 }}</p>
            <button class="button" style="margin-left: 8px">
              {{ $lang.cont_txt52 }}
            </button>
            <button class="button" style="margin-left: 12.8px">
              {{ $lang.cont_txt53 }}
            </button>
          </div>
        </div>
        <div
          class="flex-row justify-between items-center self-stretch group_21 view_3"
        >
          <div class="flex-row items-center">
            <img class="shrink-0 image_17" src="@/assets/img/avatar2.jpg" />
            <span class="font_5 text_32 ml-13">{{ $lang.cont_txt54 }}</span>
          </div>
          <img
            class="image_14"
            src="@/assets/img/share2.png"
            style="margin-right: 24px"
          />
        </div>
        <div class="flex-row items-center self-stretch group_34">
          <img class="image_15" src="@/assets/img/start_3.png" />
          <img class="image_18" src="@/assets/img/start_2.png" />
          <span class="font_11 text_33">{{ $lang.cont_txt55 }}</span>
        </div>
        <div class="flex-col items-start self-stretch group_35 f-c-1">
          <span>{{ $lang.cont_txt56 }}</span>
          <div style="margin-top: 16px">
            {{ $lang.cont_txt57 }}
          </div>
          <div class="d-f-s" style="margin-top: 12.8px">
            <p>{{ $lang.cont_txt58 }}</p>
            <button class="button" style="margin-left: 8px">
              {{ $lang.cont_txt52 }}
            </button>
            <button class="button" style="margin-left: 12.8px">
              {{ $lang.cont_txt53 }}
            </button>
          </div>
        </div>
        <div
          class="flex-row justify-between items-center self-stretch group_21 view_4"
        >
          <div class="flex-row items-center">
            <img class="shrink-0 image_17" src="@/assets/img/avatar3.jpg" />
            <span class="font_5 text_34 ml-13">{{ $lang.cont_txt59 }}</span>
          </div>
          <img
            class="image_14"
            src="@/assets/img/share2.png"
            style="margin-right: 24px"
          />
        </div>
        <div class="flex-row items-center self-stretch group_36">
          <img class="image_15" src="@/assets/img/start_3.png" />
          <img class="image_18" src="@/assets/img/start_2.png" />
          <span class="font_11 text_35">{{ $lang.cont_txt60 }}</span>
        </div>
        <div class="flex-col items-start self-stretch group_37 f-c-1">
          <span>{{ $lang.cont_txt61 }}</span>
          <div style="margin-top: 16px">
            {{ $lang.cont_txt62 }}
          </div>
          <div class="d-f-s" style="margin-top: 12.8px">
            <p>{{ $lang.cont_txt63 }}</p>
            <button class="button" style="margin-left: 8px">
              {{ $lang.cont_txt52 }}
            </button>
            <button class="button" style="margin-left: 12.8px">
              {{ $lang.cont_txt53 }}
            </button>
          </div>
        </div>

        <span
          class="self-start font text_21"
          style="
            color: #01875f;
            margin-left: 31.2px;
            color: #01875f;
            margin-left: 12.8px;
            margin-top: 32px;
            margin-bottom: 24px;
          "
          >{{ $lang.cont_txt64 }}</span
        >
        <div class="f-s-2" style="margin-top: 16px">{{ $lang.cont_txt65 }}</div>
        <div style="font-size: 14.4px" class="f-c-1">
          <p style="margin-top: 19.2px">{{ $lang.cont_txt66 }}</p>
          <p>{{ $lang.cont_txt67 }}</p>
          <p style="margin-top: 19.2px">{{ $lang.cont_txt68 }}</p>
          <p style="margin-top: 19.2px">{{ $lang.cont_txt69 }}</p>
        </div>

        <div
          style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-top: 24px;
          "
        >
          <span class="self-start f-s-2">{{ $lang.cont_txt70 }}</span>
          <img src="@/assets/img/right.png" style="margin-right: 4.8px" />
        </div>

        <div
          style="
            display: flex;
            flex-flow: wrap row;
            justify-content: space-between;
          "
        >
          <div
            v-for="(item, index) in [
              {
                img: require('@/assets/img/unnamed.png'),
                value: $lang.cont_txt87,
                value2: $lang.cont_txt88,
                value3: '4,5'
              },
              {
                img: require('@/assets/img/unnamed2.png'),
                value: $lang.cont_txt89,
                value2: $lang.cont_txt90,
                value3: '4,5'
              },
              {
                img: require('@/assets/img/unnamed3.png'),
                value: $lang.cont_txt91,
                value2: $lang.cont_txt92,
                value3: '2,6'
              },
              {
                img: require('@/assets/img/unnamed4.png'),
                value: $lang.cont_txt93,
                value2: $lang.cont_txt94,
                value3: '3,9'
              },
              {
                img: require('@/assets/img/unnamed5.png'),
                value: $lang.cont_txt95,
                value2: $lang.cont_txt96,
                value3: '4,4'
              },
              {
                img: require('@/assets/img/unnamed6.png'),
                value: $lang.cont_txt97,
                value2: $lang.cont_txt98,
                value3: '4,5'
              }
            ]"
            :key="index"
            class="d-f-s"
            style="margin-top: 20.8px"
          >
            <img
              style="border-radius: 12.8px; width: 56px; margin-right: 14.4px"
              :src="item.img"
            />
            <div>
              <div style="width: 92.8px">
                <p class="text-eli" style="font-size: 14.4px">
                  {{ item.value }}
                </p>
                <p class="text-eli" style="font-size: 11.2px">
                  {{ item.value2 }}
                </p>
              </div>
              <div class="d-f-s">
                <span>{{ item.value3 }}</span
                ><img
                  style="width: 11.2px"
                  src="@/assets/img/start.png"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
        <div class="d-f-s" style="margin-top: 19.2px">
          <img src="@/assets/img/hq.png" />
          <p style="margin-left: 16px">{{ $lang.cont_txt71 }}</p>
        </div>
        <div
          style="height: 0.12px; background: #e8eaed; margin-top: 32px"
        ></div>
        <!-- <img class="image" src="@/assets/img/otherGame.png" /> -->

        <span
          class="self-start text_36"
          style="color: #5f6368; font-size: 16px; font-weight: bold"
          >Google Play</span
        >
        <span class="self-start text_ss">{{ $lang.cont_txt72 }}</span>
        <span class="self-start text_ss">{{ $lang.cont_txt73 }}</span>
        <span class="self-start text_ss">{{ $lang.cont_txt74 }}</span>
        <span class="self-start text_ss">{{ $lang.cont_txt75 }}</span>
        <span class="self-start text_ss">{{ $lang.cont_txt76 }}</span>

        <span
          class="self-start text_36"
          style="color: #5f6368; font-size: 16px; font-weight: bold"
          >{{ $lang.cont_txt77 }}</span
        >
        <span
          class="self-start"
          style="
            color: #5f6368;
            font-size: 16px;
            font-weight: bold;
            margin-top: 16px;
          "
          >{{ $lang.cont_txt78 }}</span
        >
        <span
          class="self-start"
          style="
            color: #5f6368;
            font-size: 16px;
            font-weight: bold;
            margin-top: 16px;
          "
          >{{ $lang.cont_txt79 }}</span
        >
        <div class="f-c-1">
          <div class="flex-row items-center group_38">
            <span class="">{{ $lang.cont_txt80 }}</span>
            <span class="ml-23">{{ $lang.cont_txt82 }}</span>
          </div>
          <div class="flex-row self-stretch group_39">
            <span class="text_44">{{ $lang.cont_txt81 }}</span>
            <span class="text_44 ml-19-5"> {{ $lang.cont_txt83 }}</span>
          </div>
          <div class="flex-row self-stretch group_39">
            <span class="text_44">{{ $lang.cont_txt84 }}</span>
            <span class="text_44 ml-19-5"> {{ $lang.cont_txt85 }}</span>
          </div>
          <div class="flex-row self-stretch group_39 d-f-s">
            <img src="@/assets/img/bx.png" width="29.333px" />
            <span class="text_44" style="margin-left: 8px">{{
              $lang.cont_txt86
            }}</span>
          </div>
        </div>

        <div class="flex-col items-center self-stretch group_40">
          <!-- <span class="font_11 text_46">Contact developer</span> -->
          <!-- <div class="section_5"></div> -->
        </div>
      </div>
    </div>
    </div>
    <div class="app-detail-footer">
      <ul class="app-detail-footer-menu">
        <li
          :class="{ active: activeItem === $lang.cont_txt1 }"
          @click="handleFooterClick($lang.cont_txt1)"
        >
          <a
            ><p>
              <img src="@/assets/google/game.svg" :alt="$lang.cont_txt1" />
            </p>
            <span :class="{ active: activeItem === $lang.cont_txt1 }">{{
              $lang.cont_txt1
            }}</span></a
          >
        </li>
        <li
          :class="{ active: activeItem === $lang.cont_txt2 }"
          @click="handleFooterClick($lang.cont_txt2)"
        >
          <a
            ><p>
              <img src="@/assets/google/app.svg" :alt="$lang.cont_txt2" />
            </p>
            <span :class="{ active: activeItem === $lang.cont_txt2 }">{{
              $lang.cont_txt2
            }}</span></a
          >
        </li>
        <li
          :class="{ active: activeItem === $lang.cont_txt3 }"
          @click="handleFooterClick($lang.cont_txt3)"
        >
          <a
            ><p>
              <img src="@/assets/google/file.svg" :alt="$lang.cont_txt3" />
            </p>
            <span :class="{ active: activeItem === $lang.cont_txt3 }">{{
              $lang.cont_txt3
            }}</span></a
          >
        </li>
        <li
          :class="{ active: activeItem === $lang.cont_txt4 }"
          @click="handleFooterClick($lang.cont_txt4)"
        >
          <a
            ><p>
              <img src="@/assets/google/book.svg" :alt="$lang.cont_txt4" />
            </p>
            <span :class="{ active: activeItem === $lang.cont_txt4 }">{{
              $lang.cont_txt4
            }}</span></a
          >
        </li>
        <li
          :class="{ active: activeItem === $lang.cont_txt5 }"
          @click="handleFooterClick($lang.cont_txt5)"
        >
          <a
            ><p>
              <img src="@/assets/google/child.svg" :alt="$lang.cont_txt5" />
            </p>
            <span :class="{ active: activeItem === $lang.cont_txt5 }">{{
              $lang.cont_txt5
            }}</span></a
          >
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  name: 'AppDetail',

  data() {
    return {
      showInstallPrompt: false,
      deferredPrompt: null,
      isShadowVisible: false,
      activeItem: ''
    }
  },

  computed: {
    tagList() {
      const L = this.$lang || {}
      return [
        L.cont_txt22,
        L.cont_txt23,
        L.cont_txt24,
        L.cont_txt25,
        L.cont_txt26,
        L.cont_txt27
      ].filter((t) => t != null && String(t).trim() !== '')
    }
  },
  mounted() {
    this.activeItem = this.$lang.cont_txt2 || 'Apps'
    const routeId = this.$route.query.id
    const storedId = localStorage.getItem('id')
    if (routeId) {
      localStorage.setItem('id', routeId)
    } else if (storedId) {
      localStorage.setItem('id', storedId)
    }

    window.addEventListener('scroll', this.handleHeaderScroll)

    this._onBeforeInstallPrompt = (e) => {
      e.preventDefault()
      this.deferredPrompt = e
      this.showInstallPrompt = true
    }
    this._onAppInstalled = () => {
      this.showInstallPrompt = false
    }
    window.addEventListener('beforeinstallprompt', this._onBeforeInstallPrompt)
    window.addEventListener('appinstalled', this._onAppInstalled)
  },
  beforeUnmount() {
    window.removeEventListener('scroll', this.handleHeaderScroll)
    if (this._onBeforeInstallPrompt) {
      window.removeEventListener(
        'beforeinstallprompt',
        this._onBeforeInstallPrompt
      )
    }
    if (this._onAppInstalled) {
      window.removeEventListener('appinstalled', this._onAppInstalled)
    }
  },
  methods: {
    layoutPathPrefix() {
      const routePrefix = this.$route.params.prefix
      const storedPrefix = localStorage.getItem('country')
      const p =
        (routePrefix && routePrefix !== 'appDetail' && routePrefix) ||
        (storedPrefix && storedPrefix !== 'appDetail' && storedPrefix) ||
        'NG'
      return p ? `/${p}` : ''
    },
    handleHeaderScroll() {
      this.isShadowVisible = window.pageYOffset > 0
    },
    handleFooterClick(item) {
      this.activeItem = item
    },
    installApp() {
      const base = this.layoutPathPrefix()
      const userId = localStorage.getItem('id')
      const homePath = `${base}/home`
      const homeQuery = userId ? { id: userId } : {}
      if (this.deferredPrompt) {
        this.deferredPrompt.prompt()
        this.deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            this.$router.replace({ path: homePath, query: homeQuery })
          }
          this.deferredPrompt = null
        })
      } else {
        const origin = window.location.origin
        const qs = userId ? `?id=${encodeURIComponent(userId)}` : ''
        window.open(`${origin}${homePath}${qs}`, '_blank')
      }
    }
  }
}
</script>

<style src="@/assets/css/googlePlayDetailPrefixed.css"></style>

<style scoped lang="less">
/* 样式开始 */
.gp-detail-root .app-container {
  margin-top: 0;
  padding-bottom: 70px;
  font-size: 14px;
  line-height: 20px;
  color: #5f6368;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica,
    Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB,
    Microsoft Yahei, sans-serif !important;
}

.gp-detail-root {
  all: initial;
  display: flow-root;
  width: 100%;
  min-height: 100vh;
  color: #202124 !important;
  background-color: @wihte-color !important;
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica,
    Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB,
    Microsoft Yahei, sans-serif;
  font-size: 16px;
  line-height: 20px;
  box-sizing: border-box;
  -webkit-font-smoothing: antialiased;
  isolation: isolate;
}

.gp-detail-root,
.gp-detail-root * {
  font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, Helvetica,
    Segoe UI, Arial, Roboto, PingFang SC, miui, Hiragino Sans GB,
    Microsoft Yahei, sans-serif;
}

/* 顶栏行：不依赖 OT 全局 .d-flex-s，与 h5 AppHeader 布局一致 */
.gp-detail-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  box-sizing: border-box;
}

.app-detail-hero-row {
  min-width: 0;
  align-items: flex-start;
}

.page .group .group_2 .image.app-detail-app-icon {
  flex-shrink: 0;
  object-fit: contain;
  border-radius: 8.96px;
  background-color: #f1f3f4;
  box-shadow: 0 1px 2px rgba(60, 64, 67, 0.12);
  filter: none;
}

.page .group .group_2 .group_3 {
  min-width: 0;
}

.app-detail-about-text {
  font-size: 14.08px;
  line-height: 1.45;
  margin-top: 8px;
  color: #5f6368;
  min-width: 0;
  word-break: break-word;
  overflow-wrap: anywhere;
  white-space: normal;
}

.app-detail-tag-list {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  margin-top: 9.6px;
  gap: 8px 9.6px;
  min-width: 0;
}

.app-detail-tag {
  display: inline-flex;
  align-items: center;
  padding: 5.6px 16px;
  border: 1px solid #dadce0;
  border-radius: 19.2px;
  font-size: 14px;
  color: #5f6368;
  line-height: 1.3;
  background-color: @wihte-color;
}

.ml-1-5 {
  margin-left: 1.504px;
}

.mt-13-5 {
  margin-top: 13.44px;
}

.mt-5 {
  margin-top: 4.96px;
}

.mt-18-5 {
  margin-top: 18.56px;
}

.ml-13-5 {
  margin-left: 13.44px;
}

.mt-15-5 {
  margin-top: 15.52px;
}

.mt-12-5 {
  margin-top: 12.48px;
}

.mt-15 {
  margin-top: 15.04px;
}

.ml-16-5 {
  margin-left: 16.48px;
}

.ml-9-5 {
  margin-left: 9.44px;
}

.ml-9 {
  margin-left: 8.96px;
}

.ml-15-5 {
  margin-left: 15.52px;
}

.ml-14-5 {
  margin-left: 14.56px;
}

.ml-15 {
  margin-left: 15.04px;
}

.ml-2-5 {
  margin-left: 2.56px;
}

.ml-17-5 {
  margin-left: 17.44px;
}

.ml-13 {
  margin-left: 12.96px;
}

.ml-23 {
  margin-left: 23.04px;
}

.ml-19-5 {
  margin-left: 19.52px;
}

.page {
  // padding-top: 48px;
  padding-bottom: 15.52px;
  background-color: @wihte-color;
  width: 100%;
  min-width: 0;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
}

.page .group {
  padding-left: 23.52px;
  padding-right: 8px;
}

.page .group .group_2 {
  padding: 0 3.04px;
}

.page .group .group_2 .image {
  width: 72px;
  height: 72px;
}

.page .group .group_2 .group_3 .text {
  color: @black-color;
  font-size: 22.08px;
  font-family: Inter;
  font-weight: 600;
  line-height: 16.48px;
}

.page .group .group_2 .group_3 .text_2 {
  color: #2b8660;
  font-size: 15.04px;
  font-family: Inter;
  font-weight: 600;
  line-height: 11.2px;
}

.page .group .group_4 {
  margin-top: 31.52px;
}

.page .group .group_4 .group_7 {
  margin-top: 16px;
}

.page .group .group_4 .group_7 .group_8 {
  padding: 0 15.04px;
}

.page .group .group_4 .group_7 .group_8 .text_4 {
  margin-left: 22.08px;
  line-height: 9.76px;
}

.page .group .group_4 .group_7 .group_8 .image_2 {
  border-radius: 0.192px;
  width: 13.44px;
  height: 13.44px;
}

.page .group .group_4 .group_7 .group_8 .text_7 {
  line-height: 8.48px;
}

.page .group .group_4 .group_9 {
  margin-top: 18.08px;
}

.page .group .group_4 .group_9 .text_5 {
  line-height: 9.6px;
}

.page .group .group_4 .group_9 .text_8 {
  line-height: 10.4px;
}

.page .group .group_4 .font_3 {
  font-size: 11.04px;
  font-family: Inter;
  color: #828589;
}

.page .group .group_4 .group_5 {
  margin-right: 8px;
}

.page .group .group_4 .group_5 .group_6 {
  padding: 0 19.04px;
  width: 115.52px;
}

.page .group .group_4 .group_5 .group_6 .text-wrapper {
  padding: 10.08px 0;
  background-color: #efeeee;
  border-radius: 2.56px;
  width: 27.52px;
}

.page .group .group_4 .group_5 .group_6 .text-wrapper .text_3 {
  color: @black-color;
  font-weight: 700;
  line-height: 8.96px;
}

.page .group .group_4 .group_5 .group_6 .text_6 {
  line-height: 12.96px;
  text-align: center;
}

.page .group .group_4 .section {
  background-color: #eeeff2;
  width: 0.372px;
  height: 24.96px;
}

.page .group .group_10 {
  margin-top: 40px;
}

.page .group .group_10 .text-wrapper_2 {
  margin-right: 16.96px;
  padding: 12px 0 8.96px;
  background-color: #2b8660;
  border-radius: 8.96px;
}

.page .group .group_10 .text-wrapper_2 .text_9 {
  color: @wihte-color;
  line-height: 12.32px;
}

.page .group .group_10 .equal-division {
  align-self: flex-start;
  margin-left: 11.04px;
}

.page .group .group_10 .equal-division .equal-division-item {
  flex-shrink: 0;
}

.page .group .group_10 .equal-division .equal-division-item .image_3 {
  width: 20.96px;
  height: 20.96px;
}

.page .group .group_10 .equal-division .equal-division-item .text_10 {
  color: #3a8f6b;
  line-height: 12.64px;
}

.page .group .group_10 .equal-division .equal-division-item_2 {
  flex: 1 1 0;
}

.page .group .group_10 .equal-division .equal-division-item_2 .text-wrapper_3 {
  padding: 4px 0 7.04px;
  border-radius: 0.372px;
  background-image: url('https://ide.code.fun/api/image?token=678fb059797f850011f6f2ea&name=8e1ffe26915d872f6946b1822676c0bb.png');
  background-size: 100% 100%;
  background-repeat: no-repeat;
  width: 13.44px;
  height: 17.44px;
}

.page
  .group
  .group_10
  .equal-division
  .equal-division-item_2
  .text-wrapper_3
  .text_11 {
  color: #2b8660;
  line-height: 6.56px;
}

.page .group .group_10 .equal-division .equal-division-item_2 .text_12 {
  color: #2b8660;
  line-height: 10.08px;
}

.page .group .group_10 .equal-division .group_12 {
  padding-bottom: 3.04px;
}

.page .group .group_10 .group_11 {
  width: 238.88px;
}

.page .group .font_2 {
  font-size: 12.96px;
  font-family: Inter;
  line-height: 10.08px;
  font-weight: 700;
  color: @black-color;
}

.page .group .group_13 {
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: 24.48px;
}

.page .group .group_13 .image_4 {
  border-radius: 3.2px;
  width: 109.44px;
  height: 207.52px;
  margin-right: 10.56px;
}

.page .group .group_13 .group_14 {
  margin-left: 10.08px;
  overflow: hidden;
  border-radius: 8px 0 0 8px;
  width: 88.48px;
  height: 223.52px;
}

.page .group .group_13 .image_6 {
  overflow: hidden;
  border-radius: 8px 0 0 8px;
  width: 88px;
  height: 223.52px;
}

.page .group .group_13 .pos {
  position: absolute;
  right: 15.84px;
  bottom: 0;
}

.page .group .group_15 {
  margin-top: 27.04px;
}

.page .group .group_15 .text_13 {
  line-height: 15.52px;
}

.page .group .group_15 .group_16 {
  margin-right: 16.96px;
}

.page .group .group_17 {
  margin-top: 54.08px;
}

.page .group .group_17 .text_14 {
  margin-left: 0.756px;
  line-height: 14.88px;
}

.page .group .group_17 .text_15 {
  line-height: 13.12px;
}

.page .group .font_7 {
  font-size: 14.08px;
  font-family: Inter;
  line-height: 16.96px;
  font-weight: 600;
  color: #828589;
}

.page .group .text_16 {
  margin-left: 0.756px;
  margin-top: 30.08px;
  line-height: 15.52px;
}

.page .group .group_18 {
  margin-top: 23.04px;
}

.page .group .group_19 {
  margin: 32px 15.04px 0 2.56px;
  padding: 20.48px 12.96px 24px 19.04px;
  border-radius: 7.04px;
  border-left: solid 0.756px #dadce0;
  border-right: solid 0.756px #dadce0;
  border-top: solid 0.756px #dadce0;
  border-bottom: solid 0.756px #dadce0;
}

.page .group .group_19 .group_20 .text_17 {
  margin-top: 2.08px;
}

.page .group .group_19 .font_8 {
  font-size: 12px;
  font-family: Inter;
  line-height: 14.56px;
  font-weight: 600;
  color: #7f8185;
}

.page .group .group_19 .group_23 {
  margin-top: 22.08px;
  padding: 0 1.504px;
}

.page .group .group_19 .image_7 {
  width: 19.52px;
  height: 19.52px;
}

.page .group .group_19 .font_9 {
  font-size: 12px;
  font-family: Inter;
  line-height: 11.68px;
  font-weight: 600;
  color: #7f8185;
}

.page .group .group_19 .group_24 {
  margin-top: 22.56px;
  padding: 0 2.56px;
}

.page .group .group_19 .group_24 .image_9 {
  width: 18.56px;
  height: 18.56px;
}

.page .group .group_19 .group_24 .text_20 {
  line-height: 11.2px;
}

.page .group .group_19 .text_21 {
  margin-left: 2.08px;
  margin-top: 28.96px;
  color: #2b8660;
}

.page .divider {
  background-color: #d9d9d9;
  height: 0.372px;
}

.page .view {
  margin-top: 29.44px;
}

.page .group_25 {
  margin-top: 6.08px;
  padding: 0 20px;
}

.page .group_25 .text_22 {
  margin-left: 3.04px;
  line-height: 15.68px;
}

.page .group_25 .text_23 {
  margin-left: 2.08px;
  margin-top: 22.08px;
  color: #828589;
}

.page .group_25 .equal-division_2 {
  align-self: flex-start;
  margin-top: 42.08px;
}

.page .group_25 .equal-division_2 .equal-division-item_3 {
  flex: 1 1 91.04px;
}

.page .group_25 .equal-division_2 .equal-division-item_3 .image_10 {
  width: 12.96px;
  height: 14.08px;
}

.page .group_25 .equal-division_2 .equal-division-item_3 .text_24 {
  color: #028962;
  line-height: 8.8px;
}

.page .group_25 .equal-division_2 .equal-division-item_3 .image_11 {
  width: 12.48px;
  height: 13.44px;
}

.page .group_25 .equal-division_2 .equal-division-item_3 .text_25 {
  color: #61666b;
}

.page .group_25 .equal-division_2 .section_2 {
  padding: 8.96px 16px;
  background-color: #e7f3ef;
  border-radius: 15.68px;
  height: 31.52px;
}

.page .group_25 .equal-division_2 .group_27 {
  padding: 8.96px 16px;
  border-radius: 15.68px;
  height: 31.52px;
  border-left: solid 0.372px #dadce0;
  border-right: solid 0.372px #dadce0;
  border-top: solid 0.372px #dadce0;
  border-bottom: solid 0.372px #dadce0;
}

.page .group_25 .group_26 {
  width: 196px;
}

.page .group_25 .group_28 {
  margin-top: 40.96px;
  padding-left: 2.56px;
}

.page .group_25 .group_28 .font_10 {
  font-size: 11.04px;
  font-family: Inter;
  line-height: 8.16px;
  font-weight: 600;
  color: #565956;
}

.page .group_25 .group_28 .section_3 {
  background-color: #e3e3e3;
  border-radius: 4.8px;
  width: 208px;
  height: 9.44px;
}

.page .group_25 .group_28 .section_3 .section_4 {
  background-color: #2b8661;
  border-radius: 4.8px;
  width: 196.8px;
  height: 9.44px;
}

.page .group_25 .group_28 .group_29 {
  margin-top: 8px;
  padding-left: 3.04px;
}

.page .group_25 .group_28 .group_29 .text_26 {
  color: @black-color;
  font-size: 55.04px;
  font-family: Inter;
  font-weight: 600;
  line-height: 41.28px;
}

.page .group_25 .group_28 .group_29 .text_27 {
  line-height: 8px;
}

.page .group_25 .group_28 .group_29 .text_28 {
  line-height: 8.16px;
}

.page .group_25 .group_28 .group_30 {
  margin-top: 4.96px;
}

.page .group_25 .group_28 .group_30 .image_12 {
  width: 14.08px;
  height: 12.96px;
}

.page .group_25 .group_28 .group_30 .group_31 {
  margin-top: -4px;
}

.page .group_25 .group_28 .group_30 .group_31 .text_29 {
  line-height: 8px;
}

.page .group_25 .view_2 {
  margin-top: 54.56px;
}

.page .group_25 .group_32 {
  margin-top: 28px;
}

.page .group_25 .group_32 .image_16 {
  margin-left: 2.08px;
  width: 22.72px;
  height: 9.44px;
}

.page .group_25 .group_32 .text_31 {
  margin-left: 10.08px;
}

.page .group_25 .group_33 {
  margin-top: 22.08px;
}

.page .group_25 .view_3 {
  margin-top: 32px;
}

.page .group_25 .group_34 {
  margin-top: 28px;
}

.page .group_25 .group_34 .text_33 {
  margin-left: 10.08px;
}

.page .group_25 .image_15 {
  width: 35.04px;
  height: 9.44px;
}

.page .group_25 .font_11 {
  font-size: 11.04px;
  font-family: Inter;
  line-height: 10.08px;
  font-weight: 600;
  color: #444444;
}

.page .group_25 .group_35 {
  margin-top: 22.08px;
}

.page .group_25 .view_4 {
  margin-top: 32px;
}

.page .group_25 .group_36 {
  margin-top: 28px;
}

.page .group_25 .group_36 .text_35 {
  margin-left: 10.08px;
}

.page .group_25 .image_18 {
  margin-left: 2.08px;
  width: 22.72px;
  height: 9.44px;
}

.page .group_25 .group_37 {
  margin-top: 22.08px;
}

.page .group_25 .view_5 {
  margin-top: 28.96px;
}

.page .group_25 .font_12 {
  font-size: 12px;
  font-family: Inter;
  line-height: 11.68px;
  font-weight: 600;
  color: #616468;
}

.page .group_25 .text_36 {
  margin-top: 44px;
  line-height: 11.2px;
}

.page .group_25 .text_37 {
  margin-top: 24px;
}

.page .group_25 .font_13 {
  font-size: 12px;
  font-family: Inter;
  line-height: 9.28px;
  font-weight: 600;
  color: #616468;
}

.page .group_25 .text_38 {
  margin-top: 19.2px;
}

.page .group_25 .text_39 {
  margin-top: 19.2px;
}

.page .group_25 .text_40 {
  margin-top: 19.2px;
}

.page .group_25 .text_41 {
  margin-top: 19.2px;
}

.page .group_25 .text_42 {
  margin-top: 19.2px;
}

.page .group_25 .text_43 {
  margin-top: 19.2px;
}

.page .group_25 .group_38 {
  margin-top: 63.04px;
}

.page .group_25 .group_39 {
  margin-top: 32px;
}

.page .group_25 .group_39 .text_44 {
  line-height: 11.2px;
}

.page .group_25 .group_39 .text_45 {
  line-height: 11.68px;
}

.page .group_25 .group_40 {
  margin-top: 24.96px;
}

.page .group_25 .group_40 .text_46 {
  color: #cfd0d1;
  line-height: 10.4px;
}

.page .group_25 .group_40 .section_5 {
  background-color: #d9d9d9;
  width: 99.04px;
  height: 0.372px;
}

.page .font_6 {
  font-size: 16px;
  font-family: Inter;
  line-height: 15.52px;
  font-weight: 700;
  color: #202124;
}

.page .font_4 {
  font-size: 12.96px;
  font-family: Inter;
  line-height: 15.52px;
  font-weight: 600;
  color: #565956;
}

.page .font {
  font-size: 12px;
  font-family: Inter;
  line-height: 8.8px;
  font-weight: 600;
}

.page .group_21 {
  padding: 0 2.08px;
}

.page .group_21 .group_22 {
  margin-top: 18.08px;
}

.page .group_21 .group_22 .image_8 {
  width: 15.52px;
  height: 12.48px;
}

.page .group_21 .group_22 .text_18 {
  margin-top: 0.756px;
}

.page .group_21 .text_19 {
  line-height: 11.2px;
}

.page .group_21 .image_13 {
  width: 32.48px;
  height: 32.48px;
}

.page .group_21 .text_30 {
  line-height: 9.6px;
}

.page .group_21 .image_14 {
  width: 4.48px;
  height: 16.48px;
}

.page .group_21 .image_17 {
  border-radius: 124.8px;
  width: 32.48px;
  height: 32.48px;
}

.page .group_21 .text_32 {
  line-height: 9.6px;
}

.page .group_21 .text_34 {
  line-height: 9.76px;
}

.page .font_5 {
  font-size: 12.96px;
  font-family: Inter;
  line-height: 10.08px;
  font-weight: 600;
  color: @black-color;
}

.section_5 {
  background-color: #2b8661;
  border-radius: 10px;
  width: 8px;
  height: 9.44px;
}

.text_ss {
  margin-top: 12.8px;
  color: #96989c;
}

.cursor-pointer {
  cursor: pointer;
}

.text-eli {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.google-install-app {
  margin-left: 3.2px;
  position: relative;
  overflow: hidden;
  width: 93%;
  border-radius: 8px;
  background-color: rgb(1, 135, 95);
  text-align: center;
  color: white;
  font-size: 16px;
  padding: 8.8px 0;
}

.google-install-app:active {
  opacity: 0.6;
}

.google-install-app.shiny:after {
  position: absolute;
  -webkit-animation: shiny-btn-anim-data 4s ease-in-out infinite;
  animation: shiny-btn-anim-data 4s ease-in-out infinite;
  background-color: @wihte-color;
  content: '';
  display: inline-block;
  height: 100%;
  left: 0;
  position: absolute;
  top: -180px;
  width: 30px;
}

@-webkit-keyframes shiny-btn-anim-data {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) rotate(45deg);
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    -webkit-transform: scale(0) rotate(45deg);
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    -webkit-transform: scale(4) rotate(45deg);
    transform: scale(4) rotate(45deg);
  }

  to {
    opacity: 0;
    -webkit-transform: scale(50) rotate(45deg);
    transform: scale(50) rotate(45deg);
  }
}

@keyframes shiny-btn-anim-data {
  0% {
    opacity: 0;
    -webkit-transform: scale(0) rotate(45deg);
    transform: scale(0) rotate(45deg);
  }

  80% {
    opacity: 0.5;
    -webkit-transform: scale(0) rotate(45deg);
    transform: scale(0) rotate(45deg);
  }

  81% {
    opacity: 1;
    -webkit-transform: scale(4) rotate(45deg);
    transform: scale(4) rotate(45deg);
  }

  to {
    opacity: 0;
    -webkit-transform: scale(50) rotate(45deg);
    transform: scale(50) rotate(45deg);
  }
}

.button {
  padding: 1.6px 19.2px;
  border: 1px solid #dbdee3;
  color: @black-color;
  border-radius: 16px;
  cursor: pointer;
  outline: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.button:active {
  color: #96989c;
  transform: scale(0.98);
}

.scbtn:active {
  transform: scale(0.98);
}
.ml-18 {
  margin-left: 16px;
}

.app-header-bar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 56px;
  background-color: @wihte-color;
  transition: box-shadow 0.5s ease;
}

.app-header-bar--shadow {
  box-shadow: 0 3px 3px rgba(0, 0, 0, 0.3);
}

.app-detail-header-menu {
  display: flex;

  a {
    width: 48px;
    height: 48px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
  }

  a:hover {
    background-color: #eeeeee;
  }

  img {
    width: 24px;
    height: 24px;
  }
}

.app-detail-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 65px;
  background-color: @wihte-color;
  border-top: 1px solid rgb(218, 220, 224);
  z-index: 1000;
  max-width: 450px;
  margin: 0 auto;
}

.app-detail-footer-menu {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    flex: 1;
    text-align: center;
    overflow: hidden;

    a {
      display: block;
      color: rgb(95, 99, 104);
      text-decoration: none;
    }

    p {
      width: 24px;
      height: 24px;
      margin: 0 auto 2px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
      }
    }

    span {
      font-size: 14px;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.active a {
      color: #01875f;
    }

    &.active p img {
      filter: brightness(0) saturate(100%) invert(40%) sepia(99%)
        saturate(7492%) hue-rotate(162deg) brightness(102%) contrast(99%);
    }

    &.active span {
      color: #01875f;
    }

    &:hover a {
      color: #01875f;
    }

    &:hover p img {
      filter: brightness(0) saturate(100%) invert(40%) sepia(99%)
        saturate(7492%) hue-rotate(162deg) brightness(102%) contrast(99%);
    }

    &:hover span {
      color: #01875f;
    }
  }
}
</style>
