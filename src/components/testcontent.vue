<template>
  <div v-if="show">
    <Tabs :value="currentTab" type="card" closable @on-tab-remove="handleTabRemove" @on-click="tabclick">
      <TabPane :key="index" v-for="(tab, index) in tabsArray" :label="tab.desName" :name="tab.name">
        <router-view :name="tab.name"></router-view>
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
    handleTabRemove (name) {
      this.$store.dispatch('RemoveTabView', name);
      if (this.getTabViewPath.length !== 0) { // 如果不是最后一个则跳到第一个打开的窗口
        this.$emit('reIndexCont', this.tabsArray[0].name);
        this.$router.push({name: this.tabsArray[0].name, path: this.tabsArray[0].path})
      }
    },
    tabclick (name) { // tab被点击时触发
      let path = null;
      for (let i = 0; i < this.tabsArray.length; i++) {
        if (name === this.tabsArray[i].name) {
          path = this.tabsArray[i].path
        }
      }
      this.$router.push({name: name, path: path})
    }
  },
  computed: {
    getTabViewPath () {
      return this.$store.state.visitViewPath
    }
  }
}
</script>

<style scoped>

</style>
