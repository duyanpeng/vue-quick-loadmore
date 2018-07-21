<!--  -->
<template>
    <div class="vsim-load" @scroll.passive="handleScroll" :style="{overflow:bottomOverflow}">
        <div class="vsim-load-content" ref="content">
            <slot name="top">
                <div class="vsim-load-header">
                    <div>{{topText}}</div>
                </div>
            </slot>
            <slot></slot>
            <slot name="bottom">
                <div class="vsim-load-footer">
                    <div>{{bottomText}}</div>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
const TOPSTATUS = {
  wait: "wait",
  pulling: "pulling",
  limit: "limit",
  loading: "loading"
};
const BOTTOMSTATUS = {
  wait: "wait",
  loading: "loading",
  nodata: "nodata"
};
export default {
  props: {
    // 禁止上拉刷新
    disableTop: {
      type: Boolean,
      default: false
    },
    // 上拉移动比例
    distanceIndex: {
      type: Number,
      default: 2
    },
    // loading时与顶端距离
    topLoadingDistance: {
      type: Number,
      default: 50
    },
    // 上拉距离触发值
    topDistance: {
      type: Number,
      default: 100
    },
    // 上拉触发方法
    topMethod: {
      type: Function,
      default() {
        return function() {
          console.log("topmethod");
        };
      }
    },
    // 上拉刷新状态改变
    topStatusChange: {
      type: Function,
      default() {
        return function() {
          console.log("topStatusChange");
        };
      }
    },

    // 禁止下拉加载
    disableBottom: {
      type: Boolean,
      default: false
    },
    // 触发下拉加载距离
    bottomDistance: {
      type: Number,
      default: 10
    },
    // 下拉加载方法
    bottomMethod: {
      type: Function,
      default() {
        return function() {};
      }
    },
    // 下拉刷新状态改变
    bottomStatusChange: {
      type: Function,
      default() {
        return function() {
          console.log("topStatusChange");
        };
      }
    }
  },
  data() {
    return {
      startPositionTop: null,
      startScreenY: 0,
      endScreenY: 0,
      topStatus: TOPSTATUS.wait, // 'wait'等待 , 'pulling'下拉,'limit'超过topDistance触发,'loading'正在loading
      bottomOverflow: "auto",
      bottomStatus: BOTTOMSTATUS.wait,
    };
  },

  components: {},

  computed: {
    topText() {
      switch (this.topStatus) {
        case TOPSTATUS.pulling:
          return "下拉刷新";
          break;
        case TOPSTATUS.limit:
          return "释放刷新";
          break;
        case TOPSTATUS.loading:
          return "正在刷新...";
          break;
        default:
          return "";
      }
    },
    bottomText() {
      switch (this.bottomStatus) {
        case BOTTOMSTATUS.loading:
          return "正在加载更多...";
          break;
        case BOTTOMSTATUS.nodata:
          return "暂无更多数据";
          break;
        default:
          return "";
      }
    }
  },
  watch: {
    topStatus(next) {
      this.topStatusChange(next);
    },
    bottomStatus(next) {
      this.bottomStatusChange(next);
    }
  },
  mounted() {
    this.init();
  },

  methods: {
    handleScroll() {
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
          this.$el.scrollTo(0, this.$el.scrollHeight);
          // this.$el.scrollTop = this.$el.scrollHeight
        });
        this.bottomMethod();
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
      this.endScreenY = screenY;
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
      if (this.topStatus === "loading") {
        return;
      }

      if (
        (this.endScreenY - this.startScreenY) / this.distanceIndex >=
        this.topDistance
      ) {
        this.transformStyle(this.$refs.content, this.topLoadingDistance, true);
        this.topStatus = TOPSTATUS.loading;
        this.topMethod();
        if (!this.disableBottom) {
          this.bottomStatus = BOTTOMSTATUS.wait;
        }
      } else {
        this.topStatus = TOPSTATUS.wait;
        this.transformStyle(this.$refs.content, 0);
        this.startScreenY = 0;
        this.endScreenY = 0;
      }
    },
    // 上拉数据加载完
    onTopLoaded() {
      this.transformStyle(this.$refs.content, 0, true);
      this.topStatus = TOPSTATUS.wait;
      this.startScreenY = 0;
      this.endScreenY = 0;
    },
    // 下拉数据加载完
    onBottomLoaded(flag = true) {
      if (flag) {
        this.bottomStatus = BOTTOMSTATUS.wait;
      } else {
        this.bottomStatus = BOTTOMSTATUS.nodata;
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
.vsim-load {
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}

.vsim-load-header {
  margin-top: -50px;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 14px;
  color: #666666;
  letter-spacing: -0.31px;
}

.vsim-load-footer {
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 13px;
  color: #666666;
  letter-spacing: -0.31px;
}
</style>