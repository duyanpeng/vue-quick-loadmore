import Vue from 'vue'
import GarenLoadmore from './dist/main.js'

Vue.use(GarenLoadmore)

new Vue({
  name: "Message",
  el:'#app',
  data() {
    return {
      topChangeText:{
        pulling:"下拉刷新",
        limit:"释放刷新",
        loading:"正在刷新...",
        complete:"  ",   // 刷新完成暂不提示
      },  
      bottomChangeText:{
        loading:"正在加载更多...",
        nodata:"暂无更多数据",
        error:"请求数据出错，请点击重试",
      },
      dataList: [1, 2, 3, 4, 5]
    };
  },
  // 实现进入详情页返回列表位置功能-搭配keep-alive
  beforeRouteLeave(to, from, next) {
    // 如果进入详情页
    if (to.name === "MessageDetail") {
        // 获得滚动距离
      let scrollTop = this.$refs.vueLoad.getScrollTop();
      // 设置缓存
      sessionStorage.setItem("messageScrollTop", scrollTop);
    } else {
      // 如果去其他页移除缓存  
      sessionStorage.removeItem("messageScrollTop");
    }
    next();
  },
  activated() {
    // 激活路由  
    let scrollTop = sessionStorage.getItem("messageScrollTop");
    // 判断来源
    if (scrollTop == null) {
      console.log("不需要缓存的页面");
    } else {
     // 需要缓存的页面,滚动
      this.$refs.vueLoad.setScrollTop(scrollTop);
    }
  },
  deactivated() {

  },
  methods: {
    handleTop() {
      // 下拉刷新  
      // 定时器用来模拟下拉刷新接口延迟时间
      setTimeout(() => {
         // 模拟数据更新
        this.dataList = [1, 2, 3, 4, 5];
        // 数据跟新完调用该方法使quick-loadmore滚到顶部,可传参完成状态停止时间
        this.$refs.vueLoad.onTopLoaded();
      }, 1000);
    },
    handleStatusChange(status) {
      // status监控下拉刷新状态--等待/下拉/到达阙值/刷新
      const TOPSTATUS = {
        wait: "wait",
        pulling: "pulling",
        limit: "limit",
        loading: "loading"
      }; 
      console.log(status, "statuschange");
    },
    handleBottomStatusChange(status) {
      // status监控上拉加载状态--等待/加载/没有更多数据  
      const BOTTOMSTATUS = {
        wait: "wait",
        loading: "loading",
        nodata: "nodata"
      };
      console.log(status, "bottomchange");
    },
    handleBottom() {
      // 上拉加载
      // 定时器用来模拟上拉加载接口延迟时间
      setTimeout(() => {
      // 模拟数据更新
        this.dataList.push(1, 2, 3);
        // 数据跟新完调用该方法使数据加载中提示消失，(注意:如果没有更多数据参数传false: this.$refs.vueLoad.onBottomLoaded(false))
        this.$refs.vueLoad.onBottomLoaded();
      }, 1000);
    },
    handleBottomError(){
        this.handleBottom()
    },
    eventScroll(){
      console.log('scroll')
    }
  },
  mounted() {
    // console.log("mounted");
  }
})