<template>
  <div>
    <Row >
      <Col>
      <div style="visibility: hidden;height: 200px;"></div>
      </Col>
      <Col>
        <div style="height: 200px;background-color: silver"></div>
      </Col>
      <!--<div class="loginStyle">-->
      <Col :style="centerCss">
        <div >
          <Row>
            <Col>
              <div style="margin-bottom: 50px;text-align: center" class="loginTitle">
                <p>国土规划综合档案电子化管理系统</p>
              </div>
            </Col>
            <Col span="8" offset="8" class="Top">
              <div class="loginForm">
                <Row>
                  <Col>
                    <Form ref="formInline" :model="formInline" :rules="ruleInline" label-position="right" :label-width="100" @keydown.enter.native="handleSubmit('formInline')">
                      <FormItem prop="user">
                        <Input type="text" v-model="formInline.user" placeholder="Username">
                        <Icon type="ios-person-outline" slot="prepend" size="30"></Icon>
                        </Input>
                      </FormItem>
                      <FormItem prop="password">
                        <Input type="password" v-model="formInline.password" placeholder="Password">
                        <Icon type="ios-lock" slot="prepend" size="30"></Icon>
                        </Input>
                      </FormItem>
                      <FormItem>
                        <Button type="primary" @click="handleSubmit('formInline')" style="float: right">登录</Button>
                      </FormItem>
                    </Form>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        </div>
      </Col>
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
        clientWidth: document.body.clientWidth,
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
        Top: {
          position: 'relative',//'relative',
          width: '100%',
          top: ''
        },
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
                  this.$store.dispatch('SetUserName', res.data.data.nickname); // 在前端保持登录者的用户名
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

    },
    computed:{
      centerCss: function(){
        this.Top.top ='-150px';
        return this.Top;
      }
    }
  }
</script>

<style scoped>

</style>
