<template>
  <table v-if="qisi != null">
    <tr>
      <td>任务id</td><td>任务名</td><td>任务申请时间</td><td>任务申请人</td><td>操作</td>
    </tr>
    <tr :key="assignment.AssignmentID" v-for="assignment in qisi">
      <td>{{assignment.AssignmentID}}</td><td>{{assignment.AssignmentName}}</td><td>{{assignment.AssignmentTime}}</td>
      <td>{{assignment.Applicant}}</td><td><button @click="agree(assignment.AssignmentID,assignment.AssignmentTime)">著录</button><button>驳回</button></td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'Assignment',
  data () {
    return {
      qisi: []
    }
  },
  methods: {
    agree (id, time) { // 确定著录任务
      // 先触发缓存有无该任务分配的信息，锁住已经被人操作中的任务，如果返回信息中可以操作才进入分配界面
      this.axios.post('/api/Activiti/signAssignment', this.qs.stringify({
        'assignmentID': id,
        'assignmentTime': time,
        'user': 'w1' // 获取登录系统的账户
      })).then(res => {
        this.assignment.AssignmentID = id
        this.assignment.AssignmentTime = time
        if (res.data.code === 1) { // 可执行时
          // todo
        } else { // 不可执行时
          alert(res.data.msg)
        }
      })
    },
    checkAssignment () { // 获取任务列表
      this.axios.get('/api/Activiti/checkTask', {
        params: {
          username: 'w1'
        }
      }).then(res => {
        // alert(JSON.stringify(res.data.data))
        this.qisi = res.data.data
      })
    }
  },
  created () {
    this.checkAssignment()
  }
}
</script>

<style scoped>

</style>
