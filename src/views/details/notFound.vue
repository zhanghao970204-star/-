<template>
  <div class="not-found">
    <div class="not-found__card">
      <div class="not-found__code">404</div>
      <p class="not-found__title">
        {{ $lang.not_found_title || "Oops! Page Not Found" }}
      </p>
      <p class="not-found__desc">
        {{
          $lang.not_found_desc ||
          "The page you're looking for doesn't exist or has been moved. Let's get you back to the games."
        }}
      </p>
      <button type="button" class="not-found__btn" @click="goHome">
        {{ $lang.not_found_back || "BACK TO HOME" }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotFound",
  methods: {
    goHome() {
      this.$jumpTo("/home", {}, { replace: true });
    },
  },
};
</script>

<style lang="less" scoped>
.not-found {
  min-height: 100vh;
  box-sizing: border-box;
  padding: 0 16px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: transparent;
}

.not-found__logo {
  width: 140px;
  height: auto;
  margin-bottom: 20px;
  filter: drop-shadow(0 6px 14px rgba(0, 0, 0, 0.45));
}

.not-found__card {
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
  padding: 26px 18px 22px;
  border-radius: 28px;
  background: linear-gradient(180deg, #7a2190 0%, #532276 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.12),
    0 8px 18px rgba(0, 0, 0, 0.25);
}

.not-found__code {
  font-size: 76px;
  font-weight: 900;
  line-height: 1;
  letter-spacing: 4px;
  background: linear-gradient(180deg, #fff3b0 0%, #ffd400 45%, #ff9d00 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 3px 0 #6a1585)
    drop-shadow(0 6px 10px rgba(0, 0, 0, 0.35));
}

.not-found__title {
  margin: 18px 0 8px;
  font-size: 18px;
  font-weight: 800;
  color: #ffffff;
}

.not-found__desc {
  margin: 0 0 24px;
  font-size: 13px;
  line-height: 1.55;
  color: #e6d4f8;
}

.not-found__btn {
  .btn-3d-green();
  height: 50px;
  font-size: 16px;
}
</style>
