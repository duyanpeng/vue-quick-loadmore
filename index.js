import Vue from 'vue'
import VueQuickLoadmore from './dist/main.js'

Vue.use(VueQuickLoadmore)

new Vue({
    el: '#app',
    data: {
        dataList:[1,2,3,4,5]
    },
    methods: {
        handleTop() {
            // 下拉刷新
          setTimeout(() => {
            this.dataList = [1, 2, 3, 4, 5];
            this.$refs.vueLoad.onTopLoaded();
          }, 1000);
        },
        handleStatusChange(status) {
          console.log(status, "statuschange");
        },
        handleBottomStatusChange(status) {
          console.log(status, "bottomchange");
        },
        handleBottom() {
          // 上拉无限滚动加载
          setTimeout(() => {
            this.dataList.push(1, 2, 3);
            this.$refs.vueLoad.onBottomLoaded();
          }, 1000);
        }
      }
})