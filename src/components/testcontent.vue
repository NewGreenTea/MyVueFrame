<template>
  <div v-if="show">
    <Tabs :value="currentTab" type="card" closable @on-tab-remove="handleTabRemove" @on-click="tabclick">
      <TabPane :key="index" v-for="(tab, index) in tabsArray" :label="tab.desName" :name="tab.name">
        <keep-alive>
          <router-view :name="tab.name" v-if="$route.meta.keepAlive" @showDistribute="Distribute"></router-view>
        </keep-alive>
        <router-view :name="tab.name" v-if="!$route.meta.keepAlive" @showDistribute="Distribute"></router-view>
      </TabPane>
    </Tabs>
  </div>
</template>

<script>
export default {
  name: 'testcontent',
  props: ['tabsArray', 'currentTab'], // 打开的标签页组,默认标签页
  data () {
    return {
      show: true
    }
  },
  methods: {
    //点击标签页关闭事件
    handleTabRemove (name) {
      this.$store.dispatch('RemoveTabView', name);
      if (this.getTabViewPath.length !== 0) { // 如果不是最后一个则跳到第一个打开的窗口
        this.$emit('reIndexCont', this.tabsArray[0].name);
        this.$router.push({name: this.tabsArray[0].name, path: this.tabsArray[0].path})
      }
    },
    //点击标签重定向当前标签页事件
    tabclick (name) { // tab被点击时触发
      let path = null;
      for (let i = 0; i < this.tabsArray.length; i++) {
        if (name === this.tabsArray[i].name) {
          path = this.tabsArray[i].path
        }
      }
      this.$router.push({name: name, path: path})
    },
    //任务视图请求打开分配视图 -2019/01/30
    Distribute(){
      //判断打开界面浏览菜单中是否含有分配界面
      let result=false;
      for(let i=0;i<this.tabsArray.length;i++){ //有
        if(this.tabsArray[i].name === 'director'){
          this.$emit('reIndexCont','director');
          this.$router.push({name: this.tabsArray[i].name, path: this.tabsArray[i].path});
          result=true;
          break;
        }
      }
      if(result === false){ //无
        let temp = {name: 'director', path: '/index/viewcont/director', desName: '分配任务'};
        this.$store.commit('addTabView', temp);
        this.$nextTick(() =>{
          this.$emit('reIndexCont','director');
          this.$router.push({name: 'director', path: '/index/viewcont/director'});
        })
      }
    }
  },
  computed: {
    //获取浏览界面路径数组
    getTabViewPath () {
      return this.$store.state.visitViewPath
    }
  }
}
</script>

<style scoped>

</style>
