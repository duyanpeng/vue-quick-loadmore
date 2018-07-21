// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"Gqfg":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

var TOPSTATUS = {
  wait: "wait",
  pulling: "pulling",
  limit: "limit",
  loading: "loading"
};
var BOTTOMSTATUS = {
  wait: "wait",
  loading: "loading",
  nodata: "nodata"
};
exports.default = {
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
      default: function _default() {
        return function () {
          console.log("topmethod");
        };
      }
    },
    // 上拉刷新状态改变
    topStatusChange: {
      type: Function,
      default: function _default() {
        return function () {
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
      default: function _default() {
        return function () {};
      }
    },
    // 下拉刷新状态改变
    bottomStatusChange: {
      type: Function,
      default: function _default() {
        return function () {
          console.log("topStatusChange");
        };
      }
    }
  },
  data: function data() {
    return {
      startPositionTop: null,
      startScreenY: 0,
      endScreenY: 0,
      topStatus: TOPSTATUS.wait, // 'wait'等待 , 'pulling'下拉,'limit'超过topDistance触发,'loading'正在loading
      bottomOverflow: "auto",
      bottomStatus: BOTTOMSTATUS.wait
    };
  },


  components: {},

  computed: {
    topText: function topText() {
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
    bottomText: function bottomText() {
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
    topStatus: function topStatus(next) {
      this.topStatusChange(next);
    },
    bottomStatus: function bottomStatus(next) {
      this.bottomStatusChange(next);
    }
  },
  mounted: function mounted() {
    this.init();
  },


  methods: {
    handleScroll: function handleScroll() {
      var _this = this;

      if (this.disableBottom) {
        return;
      }
      if (this.bottomStatus !== BOTTOMSTATUS.wait) {
        return;
      }

      var bDistance = this.$el.scrollHeight - this.$el.scrollTop - this.$el.clientHeight;
      if (bDistance <= this.bottomDistance) {
        this.bottomStatus = BOTTOMSTATUS.loading;
        this.$nextTick(function () {
          _this.$el.scrollTo(0, _this.$el.scrollHeight);
          // this.$el.scrollTop = this.$el.scrollHeight
        });
        this.bottomMethod();
      }
    },

    // 获得滚动距离
    getScrollTop: function getScrollTop() {
      return this.$el.scrollTop;
    },

    // 设置滚动距离
    setScrollTop: function setScrollTop(y) {
      var _this2 = this;

      this.$nextTick(function () {
        _this2.$el.scrollTop = parseFloat(y);
      });
    },
    init: function init() {
      this.startPositionTop = this.$refs.content.getBoundingClientRect().top;
      if (!this.disableTop) {
        this.bindTouchEvents();
      }
    },
    bindTouchEvents: function bindTouchEvents() {
      this.$refs.content.addEventListener("touchstart", this.handleTouchStart);
      this.$refs.content.addEventListener("touchmove", this.handleTouchMove);
      this.$refs.content.addEventListener("touchend", this.handleTouchEnd);
    },
    handleTouchStart: function handleTouchStart(e) {
      // 只有没滚动时才触发事件
      if (this.$refs.content.getBoundingClientRect().top < this.startPositionTop) {
        return;
      }
      if (this.topStatus === TOPSTATUS.loading) {
        return;
      }

      var screenY = e.touches[0].screenY;
      this.startScreenY = screenY;
    },
    handleTouchMove: function handleTouchMove(e) {
      // 只有没滚动时才触发事件
      if (this.$refs.content.getBoundingClientRect().top < this.startPositionTop) {
        return;
      }
      if (this.topStatus === "loading") {
        return;
      }

      var screenY = e.touches[0].screenY;
      this.endScreenY = screenY;
      var moveDistance = (screenY - this.startScreenY) / this.distanceIndex;
      if (this.$refs.content.getBoundingClientRect().top > this.startPositionTop) {
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
    handleTouchEnd: function handleTouchEnd(e) {
      // 只有没滚动时才触发事件
      if (this.$refs.content.getBoundingClientRect().top < this.startPositionTop) {
        return;
      }
      if (this.topStatus === TOPSTATUS.pulling || this.topStatus === TOPSTATUS.limit) {
        e.stopPropagation();
        e.preventDefault();
      }
      if (this.topStatus === "loading") {
        return;
      }

      if ((this.endScreenY - this.startScreenY) / this.distanceIndex >= this.topDistance) {
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
    onTopLoaded: function onTopLoaded() {
      this.transformStyle(this.$refs.content, 0, true);
      this.topStatus = TOPSTATUS.wait;
      this.startScreenY = 0;
      this.endScreenY = 0;
    },

    // 下拉数据加载完
    onBottomLoaded: function onBottomLoaded() {
      var flag = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;

      if (flag) {
        this.bottomStatus = BOTTOMSTATUS.wait;
      } else {
        this.bottomStatus = BOTTOMSTATUS.nodata;
      }
    },

    // 动画
    transformStyle: function transformStyle(target, moveDistance, transition) {
      var timer = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 200;

      target.style["-webkit-transform"] = "translate3d(0," + moveDistance + "px,0)";
      target.style["transform"] = "translate3d(0," + moveDistance + "px,0)";
      target.style.transitionDuration = "0ms";
      if (transition) {
        target.style.transitionDuration = timer + "ms";
      }
    }
  }
};
        var $44ea29 = exports.default || module.exports;
      
      if (typeof $44ea29 === 'function') {
        $44ea29 = $44ea29.options;
      }
    
        /* template */
        Object.assign($44ea29, (function () {
          var render = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{staticClass:"vsim-load",style:({overflow:_vm.bottomOverflow}),on:{"&scroll":function($event){return _vm.handleScroll($event)}}},[_c('div',{ref:"content",staticClass:"vsim-load-content"},[_vm._t("top",[_c('div',{staticClass:"vsim-load-header"},[_c('div',[_vm._v(_vm._s(_vm.topText))])])]),_vm._v(" "),_vm._t("default"),_vm._v(" "),_vm._t("bottom",[_c('div',{staticClass:"vsim-load-footer"},[_c('div',[_vm._v(_vm._s(_vm.bottomText))])])])],2)])}
var staticRenderFns = []

          return {
            render: render,
            staticRenderFns: staticRenderFns,
            _compiled: true,
            _scopeId: "data-v-44ea29",
            functional: undefined
          };
        })());
      
},{}],"Focm":[function(require,module,exports) {
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _VueQuickLoadmore = require('./src/VueQuickLoadmore.vue');

var _VueQuickLoadmore2 = _interopRequireDefault(_VueQuickLoadmore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
    install: function install(Vue) {
        Vue.component('quick-loadmore', _VueQuickLoadmore2.default);
    }
};
},{"./src/VueQuickLoadmore.vue":"Gqfg"}]},{},["Focm"], null)
//# sourceMappingURL=/index.map