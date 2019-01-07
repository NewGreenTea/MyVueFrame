import Vue from 'vue'
import Vuex from 'vuex'

// import state from 'state' // 项目公共变量
// import action from 'actions' // 异步操作数据方法
// import mutations from 'mutations' // 数据的处理方法
// import getters from 'getters' // 得到公共变量

Vue.use(Vuex);

export default new Vuex.Store({ // 新建实例
  // state,
  // mutations, // 对公共数据的处理方法
  // action, // 对mutations的方法进行异步化，不然，使用mutations都是同步的（异步操作数据）
  // getters
  state: {
    count: 0
  },
  mutations: {
    print () {
      this.count++;
      console.log(this.count)
    }
  }
})
