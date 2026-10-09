<template>
  <div class="mail-page">
    <title-bar :title="$lang.common_txt293"></title-bar>

    <div v-if="noticeList.length > 0" class="mail-actions">
      <button type="button" class="mail-actions__btn" @click="readAll">
        <img src="@/assets/img/mine/mail/eye.png" alt="" />
        <span>{{ $lang.mc_read_all || "Read All" }}</span>
      </button>
      <button type="button" class="mail-actions__btn" @click="deleteRead">
        <img src="@/assets/img/mine/mail/trash.png" alt="" />
        <span>{{ $lang.mc_delete_read || "Delete Read" }}</span>
      </button>
    </div>

    <div class="mail-list">
      <div
        v-for="(item, index) in noticeList"
        :key="item.noticeId || index"
        class="mail-card"
        :class="{ 'is-read': item.read }"
        @click="viewDetail(item)"
      >
        <span v-if="!item.read" class="mail-card__dot"></span>
        <img
          class="mail-card__icon"
          :src="
            item.read
              ? require('@/assets/img/mine/mail/envelope.png')
              : require('@/assets/img/mine/mail/envelope_closed.png')
          "
          alt=""
        />
        <div class="mail-card__body">
          <p class="mail-card__title">{{ item.title }}</p>
          <p
            class="mail-card__content"
            v-html="formatPreview(item.content)"
          ></p>
          <p class="mail-card__time">{{ item.sendTime }}</p>
        </div>
      </div>
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
      class="mail-detail-popup"
    >
      <div class="mail-detail" v-if="currentNotice">
        <h3 class="mail-detail__title">{{ currentNotice.title }}</h3>
        <p class="mail-detail__time">{{ currentNotice.sendTime }}</p>
        <div
          class="mail-detail__content"
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
    formatPreview(text) {
      const raw = String(text || "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();
      // 金额高亮为绿色（设计稿）
      return raw.replace(
        /(\d[\d,]*(?:\.\d+)?)/g,
        '<em class="mail-amt">$1</em>',
      );
    },
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

<style lang="less" scoped>
.mail-page {
  min-height: 100%;
  padding: 0 14px 24px;
  box-sizing: border-box;
  color: #fff;
}

.mail-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 0 14px;
}

.mail-actions__btn {
  flex: 1;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid #7a3fb0;
  background: linear-gradient(180deg, #3a1a55 0%, #2a1040 100%);
  color: #ffd467;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  img {
    width: 16px;
    height: 16px;
    object-fit: contain;
    display: block;
  }
}

.mail-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.mail-card {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  min-height: 105px;
  padding: 14px 14px 12px;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid transparent;
  /* 设计稿：块背景 #9D2DB9 → #5C3BB9，描边 #BA65DB → #5D4FAE */
  background:
    linear-gradient(180deg, #9d2db9 0%, #5c3bb9 100%) padding-box,
    linear-gradient(180deg, #ba65db 0%, #5d4fae 100%) border-box;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.28);
  cursor: pointer;
  transition: transform 0.12s ease, opacity 0.12s ease;

  &:active {
    transform: scale(0.98);
  }

  &.is-read {
    opacity: 0.48;
    filter: saturate(0.75) brightness(0.82);
  }

  &__dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff3b3b;
    box-shadow: 0 0 6px rgba(255, 59, 59, 0.7);
  }

  &__icon {
    width: 48px;
    height: 48px;
    flex-shrink: 0;
    object-fit: contain;
    display: block;
    margin-top: 2px;
  }

  &__body {
    flex: 1;
    min-width: 0;
  }

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 800;
    color: #ffd467;
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding-right: 12px;
  }

  &__content {
    margin: 6px 0 0;
    font-size: 12px;
    line-height: 1.4;
    color: #fff;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    :deep(.mail-amt) {
      font-style: normal;
      color: #39ff14;
      font-weight: 800;
    }
  }

  &__time {
    margin: 8px 0 0;
    font-size: 11px;
    color: fade(#fff, 78%);
    line-height: 1.2;
  }
}

.mail-detail-popup {
  background: #1a0a28 !important;
  border-radius: 16px 16px 0 0 !important;
  height: 70%;
}

.mail-detail {
  padding: 20px 16px;
  overflow-y: auto;
  height: 100%;
  box-sizing: border-box;

  &__title {
    margin: 0 0 6px;
    color: #fff;
    font-size: 16px;
    font-weight: 800;
  }

  &__time {
    margin: 0 0 16px;
    color: #b8a8d4;
    font-size: 12px;
  }

  &__content {
    color: #ccc;
    font-size: 14px;
    line-height: 22px;
    word-break: break-word;
  }
}
</style>
