<template>
    <div>
      <!-- 主布局 -->
      <Layout name="mianWapper" style="height: 900px">
        <!-- 侧边栏 -->
        <!-- 如果不常变更就固定成一个组件，不用router-view来显示（下同） -->
        <Sider style="max-width: 240px !important;flex-basis: 240px !important;background-color:white;" >
          <router-view name="index_side" @showIndexCont="indexContLayout"></router-view>
        </Sider>

        <!-- 新布局2c -->
        <Layout name="mianHeader">
          <!-- 头部 -->
          <!--<Header style="background-color: burlywood;">-->
          <Header style="background-color:white">
            <router-view name="index_header"></router-view>
          </Header>

          <!-- 新布局3c -->
          <!-- 内容列表，经常会变更，使用router-view去变换 -->
          <layout name="mianContent" style="">
            <!--<Content style="background-color:silver">-->
            <Content style="background-color: white">
              <router-view name="tools"></router-view>
              <router-view name="index_content" v-if="showContent" :tabsArray="tabs" :currentTab="tabCrruent" @reIndexCont="redirectCont"></router-view>
            </Content>
          </layout>
          <!-- 3c end -->

        </Layout>
        <!-- 2c end -->

      </Layout>
      <!-- 主布局 end -->
    </div>
</template>

<script>
export default {
  name: 'managerLayout',
  data () {
    return {
      tabs: this.getTabViewPath,
      tabCrruent: '', // 设置默认标签页的
      showContent: true
    }
  },
  methods: {
    indexContLayout (data) {
      this.tabs = this.getTabViewPath
      this.$nextTick(() => {
        this.tabs = this.getTabViewPath
        this.tabCrruent = data
        this.showContent = true
      })
    },
    redirectCont (data) {
      this.tabs = this.getTabViewPath
      this.showContent = false
      this.$nextTick(() => {
        this.tabs = this.getTabViewPath
        this.tabCrruent = data
        this.showContent = true
      })
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
