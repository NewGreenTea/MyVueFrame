<template>
  <Row>
  <!-------------------------------------------------------------------------->
  <Col span="20">
    <Form ref="formInline" :model="formdata">
      <FormItem prop="flow">
        <input type="text" v-model="formdata.flow" placeholder="流程名">
        <Icon type="ios-person-outline" slot="prepend"></Icon>
      </FormItem>
      <FormItem prop="bpmn">
        <input type="text" v-model="formdata.bpmn" placeholder="bpmn文件路径">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </FormItem>
      <FormItem prop="png">
        <input type="text" v-model="formdata.png" placeholder="png文件路径">
        <Icon type="ios-lock-outline" slot="prepend"></Icon>
      </FormItem>
      <FormItem>
        <Button type="primary" @click="testCreadted">创建流程</Button>
      </FormItem>
    </Form>
  </Col>
  <!-------------------------------------------------------------------------->

  <Col span="20">
    查询用户名当前任务：<input type="text" v-model="username"/>
    <button @click="checkTask">查看你当前任务（谁请假）</button>
    <button @click="historyTask">查看你历史任务（谁请假）</button>
  </Col>
  <Col span="20">
    任务id：<input type="text" v-model="taskID"/>
    <button @click="completeTask">完成你当前任务</button>
  </Col>
  <Col span="20">
    <router-link to="/index">主页</router-link>
    <router-link to="/">用户登录测试</router-link>
  </Col>
  </Row>
</template>

<script>
export default {
  name: 'temp',
  data () {
    return {
      username: '',
      formdata: {
        flow: '',
        bpmn: '',
        png: ''
      },
      taskID: '',
      title: '表'
    }
  },
  methods: {
    testCreadted () {
      let formData = new FormData()
      formData.append('flow', this.formdata.flow)
      formData.append('bpmn', this.formdata.bpmn)
      formData.append('png', this.formdata.png)
      this.axios.get('/api/Activiti/created', {params: this.formdata}).then(res => {
        alert(JSON.stringify(res.data.data))
        this.title = res.data.data
      })
    },
    checkTask () { // 查看当前任务
      this.axios.get('/api/Activiti/checkTask', {params: {'username': this.username}}).then(res => {
        alert(JSON.stringify(res.data))
      })
    },
    historyTask () {
      this.axios.get('/api/Activiti/historyTask', {params: {'flow': 'qj'}}).then(res => {
        alert(JSON.stringify(res.data))
      })
    },
    completeTask () { // 整个请假流程结束
      this.axios.get('/api/Activiti/endTask',
        { params: {
          'taskID': this.taskID // 页面加载时要把所有流程对应到相应的流程中
        }}).then(res => {
        alert(JSON.stringify(res.data))
      })
    }
  }
}
</script>

<style scoped>

</style>
