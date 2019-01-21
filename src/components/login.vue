<template>
  <div>
    <Row>
      <div style="visibility: hidden;height: 200px;"></div>
    </Row>
    <Row>
      <div style="height: 200px;background-color: silver">
      </div>
    </Row>

    <Row>
      <!--<div class="loginStyle">-->
      <div :style="loginStyle">
        <div style="margin-bottom: 50px;text-align: center">
          <h1>国土规划综合档案电子化管理系统</h1>
        </div>
        <div class="loginForm">
          <Row>
            <Col>
              <Form ref="formInline" :model="formInline" :rules="ruleInline" label-position="right" :label-width="100" @keydown.enter.native="handleSubmit('formInline')">
                <FormItem prop="user">
                  <Input type="text" v-model="formInline.user" placeholder="Username">
                  <Icon type="ios-person-outline" slot="prepend" size="22"></Icon>
                  </Input>
                </FormItem>
                <FormItem prop="password">

                  <Input type="password" v-model="formInline.password" placeholder="Password">
                  <Icon type="ios-lock" slot="prepend" size="22"></Icon>
                  </Input>
                </FormItem>
                <FormItem>
                  <Button type="primary" @click="handleSubmit('formInline')" style="float: right">登录</Button>
                </FormItem>
              </Form>
            </Col>
          </Row>
        </div>
      </div>
    </Row>
  </div>
</template>

<script>
  export default {
    name: 'login',
    data() {
      return {
        //屏幕高度
        clientHeight: '',
        //屏幕宽度
        clientWidth: '',
        moveLeft: '',
        systems: ['规划系统', '国土系统', '文书系统'],
        formInline: {
          user: '',
          password: ''
        },
        ruleInline: {
          user: [
            {required: true, message: '请输入用户名', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {type: 'string', min: 3, message: '密码的长度为3', trigger: 'blur'}
          ]
        },
        loginStyle: {
          position: 'absolute',
          width: '600px',
          left: '',
          top: '-150px'
        }
      }
    },
    methods: {
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            this.axios.post('/api/login', this.qs.stringify({
              'username': this.formInline.user,
              'password': this.formInline.password
            })).then(res => {
              if (res.data.code === 0) { //code=0 表示OK
                this.axios.post('/api/user/get').then(res => {
                  this.$store.dispatch('SetUserID', res.data.data.id); // 在前端记录登录者的用户ID
                  this.$store.dispatch('SetUserName', this.formInline.user); // 在前端保持登录者的用户名
                });
                this.$router.push('/index/viewcont')
              } else {
                this.$Message.success(res.data.msg)
              }
            }).catch(err =>{
              this.$Message.error('请求超时！')
            })
          } else {
            this.$Message.error('格式错误!')
          }
        })
      }
    },
    mounted() {
      this.clientHeight = document.body.clientHeight;
      this.clientWidth = document.body.clientWidth;
      this.loginStyle.left = this.clientWidth/2-300 + 'px';
    }
  }
</script>

<style scoped>
  .loginStyle {
    position: absolute;
    width: 600px;
    left: 624px;
    top: -150px;
  }

  .loginForm {
    background-color: white;
    /*background-color: antiquewhite;*/
    padding: 25px;
    border:1px solid antiquewhite
  }
  .loginForm /deep/ .ivu-form-item-content {
    margin-left: 0 !important;
  }
  .loginForm /deep/ .ivu-input {
    height: 40px !important;
  }
</style>
