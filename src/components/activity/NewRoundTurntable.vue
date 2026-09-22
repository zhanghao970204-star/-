<template>
  <div class="turntable">
    <div class="xz" v-show="isLocking"></div>
    <div class="container" ref="rotateContainer">
      <div
        v-for="(item, index) in prizeData"
        :key="index"
        class="item"
        :data-index="index"
        :style="itemStyle(index)"
      >
        <div class="item-face" :style="faceStyle(index)">
          <div class="text-item" ref="textItems">
            <slot name="item" :item="item" :index="index"></slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const ANGLE_PER_ITEM = 60

export default {
  name: 'NewRoundTurntable',
  props: {
    prizeData: {
      type: Array,
      required: true
    },
    duringTime: {
      type: Number,
      default: 2
    }
  },
  emits: ['endRotation'],
  data() {
    return {
      isLocking: false,
      _rotateTimer: null
    }
  },
  beforeUnmount() {
    if (this._rotateTimer) {
      clearTimeout(this._rotateTimer)
      this._rotateTimer = null
    }
  },
  methods: {
    itemStyle(index) {
      return { transform: `rotateZ(${index * ANGLE_PER_ITEM}deg)` }
    },
    faceStyle(index) {
      return {
        transform: `translateX(-50%) rotateZ(${-index * ANGLE_PER_ITEM}deg)`
      }
    },
    rotate(index) {
      const el = this.$refs.rotateContainer
      if (!el) return
      if (this._rotateTimer) {
        clearTimeout(this._rotateTimer)
      }
      el.style.transform = ''
      el.classList.add('rotating')
      this.isLocking = true
      this._rotateTimer = setTimeout(() => {
        this.isLocking = false
        el.classList.remove('rotating')
        const targetAngle = -(index * ANGLE_PER_ITEM) + 120
        el.style.transform = `rotateX(40deg) rotateZ(${targetAngle}deg)`
        const textItems = this.$refs.textItems
        const list = Array.isArray(textItems) ? textItems : textItems ? [textItems] : []
        list.forEach((node) => {
          if (node) {
            node.style.transform = `rotateZ(${index * ANGLE_PER_ITEM + 240}deg)`
          }
        })
        this.$emit('endRotation')
        this._rotateTimer = null
      }, this.duringTime * 1000)
    }
  }
}
</script>

<style lang="less" scoped>
/* 7y rem = 本项目 px，1:1 原样使用 */
@zp1: url('@/assets/img/activity/turntable/zp1.webp');
@zp3: url('@/assets/img/activity/turntable/zp3.webp');

@keyframes outerCir {
  0% {
    transform: rotateX(40deg) rotateZ(0deg);
  }
  100% {
    transform: rotateX(40deg) rotateZ(360deg);
  }
}

@keyframes innerCir {
  0% {
    transform: rotateZ(0deg);
  }
  100% {
    transform: rotateZ(-360deg);
  }
}

@keyframes toggleXz {
  0%,
  16.65% {
    background-image: @zp1;
  }
  16.66%,
  33.31% {
    background-image: @zp3;
  }
  33.32%,
  49.97% {
    background-image: @zp1;
  }
  49.98%,
  66.63% {
    background-image: none;
  }
  66.64%,
  83.29% {
    background-image: @zp1;
  }
  83.3%,
  100% {
    background-image: @zp3;
  }
}

.turntable {
  position: absolute;
  left: 50%;
  top: 0;
  width: 289px;
  height: 289px;
  text-align: center;
  transform: translateZ(0) translateX(-50%);

  .xz {
    position: absolute;
    left: 50%;
    top: 43.5%;
    width: 289px;
    height: 195px;
    transform: translate(-50%, -50%);
    background-image: @zp1;
    animation: toggleXz 0.6s linear infinite;
    background-size: cover;
    background-position: center;
    pointer-events: none;
  }

  .container {
    position: absolute;
    left: 25%;
    top: 15%;
    width: 50%;
    height: 50%;
    transform: rotateX(40deg) rotateZ(0deg);
    transition: transform 2s ease-in-out;

    .item {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;

      .text-item {
        animation: innerCir 0.6s linear infinite;
      }
    }

    /*
      原版 top:-5 是配合「图标+金额文字」整块高度；
      我们只显示图标，视觉中心偏上，需加大外扩，落在盘面外圈（对齐图一）。
      半径约：container半高72.5 + 42 ≈ 114.5
    */
    .item-face {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 160px;
      position: absolute;
      top: -42px;
      left: 50%;
      transform: translateX(-50%);
    }
  }

  .container.rotating {
    transition: none;
    animation: outerCir 0.6s linear infinite;
  }

  .container:not(.rotating) .text-item {
    animation: none;
  }
}
</style>
