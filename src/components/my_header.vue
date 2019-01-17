<style scoped>
  .ivu-col{
    margin: 0;
    padding: 0;
  }
</style>
<template>
  <!-- 栅格系统 -->
  <layout>
    <content style="width: 100%">
      <Row>
        <Col align="right" style="padding-right: 40px">
          <Icon type="ios-contact"/>
          管理员&nbsp;
          <Dropdown>
            <a href="#">代替图标&nbsp;&nbsp;</a>
            <DropdownMenu slot="list">
              <dropdown-item>{{loginUser}}</dropdown-item>
              <dropdown-item><Button @click="Logout">退出</Button></dropdown-item>
            </DropdownMenu>
          </Dropdown>
        </Col>
      </Row>
    </content>
  </layout>
</template>

<script>
export default ({
  data () {
    return {
      user: ''
    }
  },
  methods: {
    Logout () { // 用户退出
      this.axios.get('/api/logout').then(res => {
        this.$store.dispatch('ClearUserID');
        this.$store.dispatch('ClearUserName');
        this.$store.dispatch('ReSetTabView');
        this.$router.push('/')
      })
    }
  },
  computed: {
    loginUser () {
      let localData = window.localStorage.getItem('username');
      if (this.$store.state.userName === '' && localData) {
        this.$store.dispatch('UpdateUserName', localData) // 同步操作
      }
      return this.$store.state.userName
    }
  }
})
</script>
