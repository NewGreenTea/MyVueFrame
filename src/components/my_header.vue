<style scoped>
  .ivu-col {
    margin: 0;
    padding: 0;
  }
</style>
<template>
  <!-- 栅格系统 -->
  <layout>
    <content style="width: 100%">
      <Row>

        <Col span="2" style="float: right;text-align: right;padding-right: 40px">
          <Dropdown>
            <a href="#">
              <p style="text-align: center;font-weight: 600;font-size: 15px">{{loginUser}}</p>
            </a>
            <DropdownMenu slot="list">
              <dropdown-item style="text-align:center">
                <Button @click="Logout">退出</Button>
              </dropdown-item>
            </DropdownMenu>
          </Dropdown>
        </Col>
        <Col span="1" style="float: right;text-align: right">
          <Icon type="md-person" size="40"/>
        </Col>
      </Row>
    </content>
  </layout>
</template>

<script>
  export default ({
    data() {
      return {
        user: ''
      }
    },
    methods: {
      Logout() { // 用户退出
        this.axios.get('/api/logout').then(res => {
          this.$store.dispatch('ClearUserID');
          this.$store.dispatch('ClearUserName');
          this.$store.dispatch('ReSetTabView');
          this.$router.push('/')
        })
      }
    },
    computed: {
      loginUser() {
        let localData = window.localStorage.getItem('username');
        if (this.$store.state.userName === '' && localData) {
          this.$store.dispatch('UpdateUserName', localData) // 同步操作
        }
        return this.$store.state.userName
      }
    }
  })
</script>
