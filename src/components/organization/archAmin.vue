<template>
  <Row>
    <Col span="20" offset="2">
      <Form :model="SQform" inline ref="importForm">
        <FormItem prop="district">
          <Button type="primary" disabled style="background: #00ff33;color: black;">选择批次</Button>
        </FormItem>
        <FormItem prop="district">
          区局：
          <Input type="text" v-model="SQform.district" placeholder="区局" clearable style="width: 200px"/>
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </FormItem>
        <FormItem prop="date">
          日期：
          <DatePicker v-model="SQform.date" type="datetime" format="yyyy-MM-dd HH:mm:ss" placeholder="日期"
                      style="width: 200px"></DatePicker>
          <Button @click="CurrentTime" shape="circle" style="background: #7FFFAA;">当前时间</Button>
        </FormItem>
        <FormItem prop="batch">
          批次：
          <Input type="text" v-model="SQform.batch" placeholder="批次" clearable style="width: 200px"/>
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </FormItem>
        设置表格显示高度：<Input type="text" v-model="tableHeight" placeholder="表格显示高度" style="width: 80px"/>
        <FormItem prop="batch">
          <Upload ref="upload" action="/api/importArch/handelExcel" :showUploadList="false" :on-success="importList"
                  :multiple="true">
            <i-button type="primary">导入清单</i-button>
          </Upload>
        </FormItem>
        <FormItem>
          <Button @click="ArchNOTool" shape="circle">档号设置</Button>
        </FormItem>
      </Form>
    </Col>
    <!-- 显示导进来的Excel的内容（并且是把档号补充完整的） -->
    <Col span="20" offset="2" v-if="tableData != null">
      <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
      <Button @click="confirm" type="primary">确认</Button>
    </Col>

    <Modal v-model="showMessage">
      错误信息：
      <Alert show-icon type="error">
        <span slot="desc">{{message}}</span>
      </Alert>
      <div slot="footer"></div>
    </Modal>

    <Modal v-model="showArchTool" footer-hide title="设置档案档号流水号">
      <router-view name="ArchTool" @closeArchNoModel="closeArchModel"></router-view>
    </Modal>
  </Row>
</template>

<script>
  export default {
    name: 'archAmin',
    data() {
      return {
        //设置档号流水号的设置
        showArchTool: false,
        //消息的展示框
        showMessage: false,
        message: '',
        tableHeight: 750,
        SQform: {
          district: '', // 区号
          date: '', // 日期
          batch: '' // 批次
        },
        file: null, // 档案清单
        columns: [
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '立案号',
            key: 'lianhao'
          },
          {
            title: '发文号',
            key: 'fawenhao'
          },
          {
            title: '档号',
            key: 'archNO'
          }
        ],
        tableData: [],
        archinfo: {
          no: '',
          lianhao: '',
          fawenhao: '',
          archNO: ''
        },
      }
    },
    methods: {
      CurrentTime() { // 获取当前时间
        let date = new Date();
        this.SQform.date = date
      },
      // 清单的处理
      importList(response, file, fileList) {
        if (this.SQform.date !== '' && this.SQform.batch !== '' && this.SQform.district !== '') {
          for (let j = 0; j < response.data.length; j++) {
            this.tableData.push(response.data[j])
          }
        } else {
          if (this.SQform.date === '') {
            this.showMessage = true;
            this.message = '日期未选择';
            setTimeout(() => {
              this.showMessage = false
            }, 1000)
          }
          if (this.SQform.batch === '') {
            this.showMessage = true;
            this.message = '批次未填写';
            setTimeout(() => {
              this.showMessage = false
            }, 1000)
          }
          if (this.SQform.district === '') {
            this.showMessage = true;
            this.message = '区号未填写';
            setTimeout(() => {
              this.showMessage = false
            }, 1000)
          }
        }
      },
      //档号流水号设置
      ArchNOTool() {
        this.showArchTool = true;
        this.$router.push({name:'archNoTool'})
      },
      confirm() {
        // 日期加0，例如2018-1-1 =》2018-01-01
        function timeAdd0(str) {
          if (str.length <= 1) {
            str = '0' + str
          }
          return str
        }

        // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
        let tempDate = this.SQform.date;
        let newDate = tempDate.getFullYear() + '-' + timeAdd0((tempDate.getMonth() + 1).toString()) + '-' + timeAdd0(tempDate.getDate().toString())
        let batch = this.SQform.district + newDate + this.SQform.batch;

        let arch = JSON.stringify(this.tableData);

        let config = {
          'Content-Type': 'application/x-www-form-urlencoded'
        };

        this.axios.post('/api/importArch/importList', this.qs.stringify({
          applicant: this.$store.state.userID, // 获取当前登录人的ID
          batch: batch,
          arch: arch
        }), config).then(res => {
          alert(res.data.msg);
          this.tableData = [];
          this.$refs.importForm.resetFields();
        })
      },
      closeArchModel () {
        this.showArchTool = false;
      }
    }
  }
</script>

<style scoped>

</style>
