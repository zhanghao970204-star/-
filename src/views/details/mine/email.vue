<template>
  <div style="padding: 10px">
    <title-bar :title="$lang.common_txt293"></title-bar>

    <div v-if="noticeList.length > 0" class="d-flex-s" style="padding: 8px 5px">
      <p style="color: #a89b7c; font-size: 12px" @click="readAll">
        <van-icon name="browsing-history-o" size="14" />
        {{ $lang.mc_read_all || "Read All" }}
      </p>
      <p style="color: #a89b7c; font-size: 12px" @click="deleteRead">
        <van-icon name="delete-o" size="14" />
        {{ $lang.mc_delete_read || "Delete Read" }}
      </p>
    </div>

    <div
      v-for="(item, index) in noticeList"
      :key="index"
      style="
        background: #15110a;
        padding: 12px;
        margin: 0 0 10px;
        border-radius: 8px;
        position: relative;
        border: 1px solid rgba(255, 162, 0, 0.45);
      "
      @click="viewDetail(item)"
    >
      <div class="d-flex-s">
        <div class="d-flex" style="align-items: center">
          <span
            v-if="!item.read"
            style="
              width: 8px;
              height: 8px;
              border-radius: 50%;
              background: #ffa300;
              margin-right: 6px;
              flex-shrink: 0;
            "
          ></span>
          <p
            :style="{
              color: item.read ? '#a89b7c' : '#ffe4b5',
              fontSize: '14px',
              fontWeight: 'bold',
            }"
          >
            {{ item.title }}
          </p>
        </div>
        <p style="color: #a89b7c; font-size: 12px; flex-shrink: 0">
          {{ item.sendTime }}
        </p>
      </div>
      <p
        :style="{
          color: item.read ? '#6b6250' : '#a89b7c',
          fontSize: '12px',
          marginTop: '5px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }"
      >
        {{ item.content }}
      </p>
    </div>

    <van-empty
      v-if="noticeList.length === 0 && !loading"
      :image="require('../../../assets/img/common/img_no_data.png')"
      :description="$lang.noempt"
    />

    <van-popup
      v-model:show="showDetail"
      position="bottom"
      closeable
      style="background: #1f1c17; border-radius: 16px 16px 0 0; height: 70%"
    >
      <div
        style="padding: 20px 16px; overflow-y: auto; height: 100%"
        v-if="currentNotice"
      >
        <h3
          style="
            color: var(--wihte-color);
            font-size: 16px;
            font-weight: bold;
            margin-bottom: 6px;
          "
        >
          {{ currentNotice.title }}
        </h3>
        <p style="color: #a89b7c; font-size: 12px; margin-bottom: 16px">
          {{ currentNotice.sendTime }}
        </p>
        <div
          style="
            color: #ccc;
            font-size: 14px;
            line-height: 22px;
            word-break: break-word;
          "
          v-html="currentNotice.content"
        ></div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import {
  NoticeList,
  NoticeDetails,
  NoticeReadAll,
  NoticeDeleteRead,
} from "@/api/common";
export default {
  name: "email",
  data() {
    return {
      noticeList: [],
      loading: false,
      showDetail: false,
      currentNotice: null,
    };
  },
  mounted() {
    this.fetchNoticeList();
  },
  methods: {
    async fetchNoticeList() {
      this.loading = true;
      try {
        const data = await NoticeList({
          messageType: "systemNotice",
          pageIndex: 0,
          pageSize: 50,
        });
        if (data.status === "ok" && data.content) {
          this.noticeList = data.content.noticeList || [];
        }
      } catch (e) {
        console.error("fetchNoticeList error", e);
      } finally {
        this.loading = false;
      }
    },
    async viewDetail(item) {
      // 先调详情接口（后端会标记已读）
      try {
        const data = await NoticeDetails({ noticeId: item.noticeId });
        if (data.status === "ok" && data.content) {
          this.currentNotice = data.content;
        } else {
          this.currentNotice = item;
        }
      } catch (e) {
        this.currentNotice = item;
      }
      // 前端同步已读状态
      item["read"] = true;
      this.showDetail = true;
    },
    async readAll() {
      try {
        const data = await NoticeReadAll({ messageType: "systemNotice" });
        if (data.status === "ok") {
          this.noticeList.forEach((item) => {
            item["read"] = true;
          });
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
        } else {
          this.$toast({ message: data.msg || "Error", icon: "cross" });
        }
      } catch (e) {
        this.$toast({ message: "Error", icon: "cross" });
      }
    },
    async deleteRead() {
      try {
        const data = await NoticeDeleteRead({ messageType: "systemNotice" });
        if (data.status === "ok") {
          this.noticeList = this.noticeList.filter((item) => !item.read);
          this.$toast({
            message: this.$lang.Sucesso || "Success",
            icon: "success",
          });
        } else {
          this.$toast({ message: data.msg || "Error", icon: "cross" });
        }
      } catch (e) {
        this.$toast({ message: "Error", icon: "cross" });
      }
    },
  },
};
</script>
