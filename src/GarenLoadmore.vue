<template>
  <div class="garen-loadmore" @scroll.passive="handleScroll" :style="{overflow:bottomOverflow}">
    <div class="garen-loadmore-content" ref="content">
      <slot name="top">
        <div class="garen-loadmore-header">
          <div>{{topText}}</div>
        </div>
      </slot>
      <slot></slot>
      <slot name="bottom">
        <div class="garen-loadmore-footer" v-if="!disableBottom" @click="onBottomErrorClick">
          <div>{{bottomText}}</div>
        </div>
      </slot>
    </div>
  </div>
</template>

<script>
const TOPSTATUS = {
  wait: "wait", // 等待
  pulling: "pulling", // 下拉
  limit: "limit", // 超过触发值
  loading: "loading", // 正在加载
  complete: "complete" // 刷新完成
};
const BOTTOMSTATUS = {
  wait: "wait", // 等待
  loading: "loading", // 正在加载
  nodata: "nodata", // 暂无数据
  error: "error" // 错误
};
export default {
  name:'Loadmore',
  props: {
    // 禁止下拉刷新
    disableTop: {
      type: Boolean,
      default: false
    },
    // 下拉移动比例
    distanceIndex: {
      type: Number,
      default: 2
    },
    // loading时与顶端距离
    topLoadingDistance: {
      type: Number,
      default: 50
    },
    // 下拉距离触发值
    topDistance: {
      type: Number,
      default: 100
    },
    // 下拉刷新状态提示
    topChangeText: {
      type: Object,
      default() {
        return {};
      }
    },

    // 禁止上拉加载
    disableBottom: {
      type: Boolean,
      default: false
    },
    // 触发上拉无限滚动距离
    bottomDistance: {
      type: Number,
      default: 10
    },
    // 上拉加载状态提示
    bottomChangeText: {
      type: Object,
      default() {
        return {};
      }
    },
    // scroll事件
    eventScroll: {
      type: Function
    }
  },
  data() {
    return {
      startPositionTop: null,
      startScreenY: 0,
      endScreenY: 0,
      topStatus: TOPSTATUS.wait,
      bottomOverflow: "auto",
      bottomStatus: BOTTOMSTATUS.wait
    };
  },
  components: {},
  computed: {
    topText() {
      switch (this.topStatus) {
        case TOPSTATUS.pulling:
          return this.topChangeText.pulling || "下拉刷新";
          break;
        case TOPSTATUS.limit:
          return this.topChangeText.limit || "释放刷新";
          break;
        case TOPSTATUS.loading:
          return this.topChangeText.loading || "正在刷新...";
          break;
        case TOPSTATUS.complete:
          return this.topChangeText.complete || "";
          break;
        default:
          return "";
      }
    },
    bottomText() {
      switch (this.bottomStatus) {
        case BOTTOMSTATUS.loading:
          return this.bottomChangeText.loading || "正在加载更多...";
          break;
        case BOTTOMSTATUS.nodata:
          return this.bottomChangeText.nodata || "暂无更多数据";
          break;
        case BOTTOMSTATUS.error:
          return this.bottomChangeText.error || "请求数据出错，请点击重试";
          break;
        default:
          return "";
      }
    }
  },
  watch: {
    topStatus(next) {
      // 下拉刷新状态改变
      this.$emit("top-status-change", next);
    },
    bottomStatus(next) {
      // 上拉加载状态改变
      this.$emit("bottom-status-change", next);
    }
  },
  mounted() {
    this.init();
  },
  methods: {
    handleScroll() {
      this.eventScroll && this.eventScroll();
      if (this.disableBottom) {
        return;
      }
      if (this.bottomStatus !== BOTTOMSTATUS.wait) {
        return;
      }
      let bDistance =
        this.$el.scrollHeight - this.$el.scrollTop - this.$el.clientHeight;
      if (bDistance <= this.bottomDistance) {
        this.bottomStatus = BOTTOMSTATUS.loading;
        this.$nextTick(() => {
          // 移动端某些浏览器初始化控制台报错，不影响使用
          try {
            this.$el.scrollTo(0, this.$el.scrollHeight);
          } catch (e) {}
          // this.$el.scrollTop = this.$el.scrollHeight
        });
        this.$emit('bottom-method');
      }
    },
    // 获得滚动距离
    getScrollTop() {
      return this.$el.scrollTop;
    },
    // 设置滚动距离
    setScrollTop(y) {
      this.$nextTick(() => {
        this.$el.scrollTop = parseFloat(y);
      });
    },
    init() {
      this.startPositionTop = this.$refs.content.getBoundingClientRect().top;
      if (!this.disableTop) {
        this.bindTouchEvents();
      }
    },
    bindTouchEvents() {
      this.$refs.content.addEventListener("touchstart", this.handleTouchStart);
      this.$refs.content.addEventListener("touchmove", this.handleTouchMove);
      this.$refs.content.addEventListener("touchend", this.handleTouchEnd);
    },
    handleTouchStart(e) {
      // 只有没滚动时才触发事件
      if (
        this.$refs.content.getBoundingClientRect().top < this.startPositionTop
      ) {
        return;
      }
      if (this.topStatus === TOPSTATUS.loading) {
        return;
      }
      let screenY = e.touches[0].screenY;
      this.startScreenY = screenY;
    },
    handleTouchMove(e) {
      // 只有没滚动时才触发事件
      if (
        this.$refs.content.getBoundingClientRect().top < this.startPositionTop
      ) {
        return;
      }
      if (this.topStatus === "loading") {
        return;
      }
      let screenY = e.touches[0].screenY;
      let moveDistance = (screenY - this.startScreenY) / this.distanceIndex;
      if (
        this.$refs.content.getBoundingClientRect().top > this.startPositionTop
      ) {
        this.topStatus = TOPSTATUS.pulling;
      }
      if (moveDistance >= this.topDistance) {
        this.topStatus = TOPSTATUS.limit;
      }
      if (moveDistance > 0) {
        e.preventDefault();
        e.stopPropagation();
        this.transformStyle(this.$refs.content, moveDistance);
      }
    },
    handleTouchEnd(e) {
      // 只有没滚动时才触发事件
      if (
        this.$refs.content.getBoundingClientRect().top < this.startPositionTop
      ) {
        return;
      }
      if (
        this.topStatus === TOPSTATUS.pulling ||
        this.topStatus === TOPSTATUS.limit
      ) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (this.topStatus === "loading") {
        return;
      }

      let screenY = e.changedTouches[0].screenY;

      if (
        (screenY - this.startScreenY) / this.distanceIndex >=
        this.topDistance
      ) {
        this.transformStyle(this.$refs.content, this.topLoadingDistance, true);
        this.topStatus = TOPSTATUS.loading;
        // 下拉刷新触发方法
        this.$emit("top-method");
        if (!this.disableBottom) {
          this.bottomStatus = BOTTOMSTATUS.wait;
        }
      } else {
        this.topStatus = TOPSTATUS.wait;
        this.transformStyle(this.$refs.content, 0);
        this.startScreenY = 0;
      }
    },
    // TODO:完成时间1s
    // 下拉数据加载完
    onTopLoaded(time = 0) {
      setTimeout(()=>{
        this.transformStyle(this.$refs.content, 0, true);
        this.startScreenY = 0;
      },time)
      this.topStatus = TOPSTATUS.complete;
      
    },
    // 上拉数据加载完
    onBottomLoaded(flag = true) {
      if (flag) {
        this.bottomStatus = BOTTOMSTATUS.wait;
      } else {
        this.bottomStatus = BOTTOMSTATUS.nodata;
      }
    },
    // 上拉数据出错
    onBottomError() {
      this.bottomStatus = BOTTOMSTATUS.error;
    },
    // 出错时，点击重新加载数据
    onBottomErrorClick() {
      if (this.bottomStatus === BOTTOMSTATUS.error) {
        this.bottomStatus = BOTTOMSTATUS.loading;
        this.$emit("bottom-error-click");
      }
    },
    // 动画
    transformStyle(target, moveDistance, transition, timer = 200) {
      target.style["-webkit-transform"] =
        "translate3d(0," + moveDistance + "px,0)";
      target.style["transform"] = "translate3d(0," + moveDistance + "px,0)";
      target.style.transitionDuration = "0ms";
      if (transition) {
        target.style.transitionDuration = timer + "ms";
      }
    }
  }
};
</script>
<style scoped>
.garen-loadmore {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
.garen-loadmore-header {
  margin-top: -50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  letter-spacing: -0.31px;
}
.garen-loadmore-footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 13px;
  color: #666666;
  letter-spacing: -0.31px;
}
</style>