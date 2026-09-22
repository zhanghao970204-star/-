<template>
  <div
    class="swiper-container"
    ref="container"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
  >
    <div class="swiper-wrapper" ref="wrapper" :style="wrapperStyle">
      <div
        class="swiper-slide"
        v-for="(item, index) in slides"
        :key="index"
        :style="slideStyle"
      >
        <slot :item="item" :index="index"></slot>
      </div>
    </div>
    <div class="swiper-indicators" v-if="showIndicators">
      <span
        class="indicator"
        :class="{ active: currentIndex === i }"
        v-for="(item, i) in slides"
        :key="i"
        @click="goToSlide(i)"
      ></span>
    </div>
    <button class="swiper-prev" v-if="showArrows" @click="prevSlide">
      上一张
    </button>
    <button class="swiper-next" v-if="showArrows" @click="nextSlide">
      下一张
    </button>
  </div>
</template>

<script>
export default {
  name: 'Swiper',
  props: {
    slides: {
      type: Array,
      required: true
    },
    autoplay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 5000 // 增加默认间隔时间到5秒
    },
    showIndicators: {
      type: Boolean,
      default: true
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    loop: {
      type: Boolean,
      default: true
    },
    threshold: {
      type: Number,
      default: 50
    },
    transitionDuration: {
      type: Number,
      default: 800 // 滑动动画持续时间（毫秒）
    }
  },
  data() {
    return {
      currentIndex: 0,
      slideWidth: 0,
      autoplayTimer: null,
      isDragging: false,
      startX: 0,
      currentX: 0,
      offsetX: 0,
      isPC: false
    }
  },
  computed: {
    wrapperStyle() {
      let transform = `translateX(${
        -this.currentIndex * this.slideWidth + this.offsetX
      }px)`
      let transition = this.isDragging
        ? 'none'
        : `transform ${this.transitionDuration}ms ease`

      return {
        transform,
        transition
      }
    },
    slideStyle() {
      return {
        width: `${this.slideWidth}px`
      }
    }
  },
  mounted() {
    this.isPC = !this.isMobile()
    this.initSwiper()
    if (this.autoplay) {
      this.startAutoplay()
    }
    window.addEventListener('resize', this.handleResize)
  },
  beforeUnmount() {
    if (this.autoplayTimer) {
      clearInterval(this.autoplayTimer)
    }
    window.removeEventListener('resize', this.handleResize)
  },
  methods: {
    isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    },
    initSwiper() {
      this.slideWidth = this.$refs.container.clientWidth
    },
    handleResize() {
      this.slideWidth = this.$refs.container.clientWidth
      this.$nextTick(() => {
        this.$refs.wrapper.style.transition = 'none'
        this.$refs.wrapper.style.transform = `translateX(-${
          this.currentIndex * this.slideWidth
        }px)`
        this.$nextTick(() => {
          this.$refs.wrapper.style.transition = `transform ${this.transitionDuration}ms ease`
        })
      })
    },
    startAutoplay() {
      this.autoplayTimer = setInterval(() => {
        this.nextSlide()
      }, this.interval)
    },
    nextSlide() {
      if (this.currentIndex === this.slides.length - 1) {
        if (this.loop) {
          this.currentIndex = 0
        }
      } else {
        this.currentIndex++
      }
      this.resetAutoplay()
    },
    prevSlide() {
      if (this.currentIndex === 0) {
        if (this.loop) {
          this.currentIndex = this.slides.length - 1
        }
      } else {
        this.currentIndex--
      }
      this.resetAutoplay()
    },
    goToSlide(index) {
      this.currentIndex = index
      this.resetAutoplay()
    },
    resetAutoplay() {
      if (this.autoplay) {
        clearInterval(this.autoplayTimer)
        this.startAutoplay()
      }
    },
    onTouchStart(event) {
      if (!this.isPC) {
        this.startDrag(event.touches[0].clientX)
      }
    },
    onTouchMove(event) {
      if (!this.isPC && this.isDragging) {
        event.preventDefault()
        this.drag(event.touches[0].clientX)
      }
    },
    onTouchEnd() {
      if (!this.isPC && this.isDragging) {
        this.endDrag()
      }
    },
    onMouseDown(event) {
      if (this.isPC && event.button === 0) {
        // 只处理左键
        this.startDrag(event.clientX)
      }
    },
    onMouseMove(event) {
      if (this.isPC && this.isDragging) {
        this.drag(event.clientX)
      }
    },
    onMouseUp() {
      if (this.isPC && this.isDragging) {
        this.endDrag()
      }
    },
    startDrag(clientX) {
      this.isDragging = true
      this.startX = clientX
      this.currentX = clientX
      this.$refs.wrapper.style.transition = 'none'
      if (this.autoplay) {
        clearInterval(this.autoplayTimer)
      }
    },
    drag(clientX) {
      this.currentX = clientX
      this.offsetX = this.currentX - this.startX

      // 边界限制，防止无限滑动
      if (!this.loop) {
        if (this.currentIndex === 0 && this.offsetX > 0) {
          this.offsetX = this.offsetX * 0.5
        }
        if (this.currentIndex === this.slides.length - 1 && this.offsetX < 0) {
          this.offsetX = this.offsetX * 0.5
        }
      }
    },
    endDrag() {
      this.isDragging = false
      this.$refs.wrapper.style.transition = `transform ${this.transitionDuration}ms ease`

      if (Math.abs(this.offsetX) > this.threshold) {
        if (this.offsetX > 0) {
          this.prevSlide()
        } else {
          this.nextSlide()
        }
      }

      this.offsetX = 0

      if (this.autoplay) {
        this.startAutoplay()
      }
    }
  }
}
</script>

<style scoped>
.swiper-container {
  position: relative;
  width: 100%;
  height: 300px;
  overflow: hidden;
  touch-action: pan-y;
  cursor: grab;
}

.swiper-container:active {
  cursor: grabbing;
}

.swiper-wrapper {
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
}

.swiper-slide {
  flex-shrink: 0;
  height: 100%;
}

.swiper-indicators {
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  gap: 5px;
}

.indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
}

.indicator.active {
  background-color: var(--wihte-color);
}

.swiper-prev,
.swiper-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
  transition: background-color 0.3s;
}

.swiper-prev {
  left: 10px;
}

.swiper-next {
  right: 10px;
}

@media (hover: hover) and (pointer: fine) {
  .swiper-prev:hover,
  .swiper-next:hover {
    background-color: rgba(0, 0, 0, 0.7);
  }

  .indicator:hover {
    background-color: rgba(255, 255, 255, 0.8);
  }
}
</style>
