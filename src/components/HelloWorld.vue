<template>
    <!-- 页面框架demo -->
    <!-- 新布局1c -->
    <Layout>
      <!-- 侧边栏 -->
      <Sider style="width: 200px;">
        <!--<My_Sider style="width: 200px;"></My_Sider>-->
        <router-view name="sider"></router-view>
      </Sider>

      <!-- 新布局2c -->
      <Layout>
        <!-- 头部 -->
        <Header style="background-color: burlywood;height: auto;padding: 5px;">
          <!--<My_Header></My_Header>-->
          <router-view name="header"></router-view>
        </Header>

        <!-- 新布局3c -->
        <layout>
          <router-link to="/sider"><Button>Sider</Button></router-link>
          <router-link to="/header"><Button>Header</Button></router-link>
        </layout>
      </Layout>
    </Layout>
</template>

<script>
  import My_Header from './MySider'
  import My_Sider from './MyHeader'
export default {
  name: 'HelloWorld',
  data () {
    return {
      Tname: '',
      Tchn: '',
      Tfather: '',
      Ttype: ''
    }
  },
  methods: {
    testDic () {

    }
  }
  // components: {
  //   My_Header: My_Header,
  //   My_Sider: My_Sider
  // }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
