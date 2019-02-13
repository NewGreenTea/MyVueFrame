<template>
  <Row>
    <Col span="20" offset="2">
      <Form :model="SQform" inline ref="importForm" class="conditionForm">
        <FormItem prop="district">
          <h2>选择批次:</h2>
        </FormItem>
        <FormItem>
          区局：
          <Input type="text" v-model="SQform.district" placeholder="区局" clearable style="width: 150px"/>
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </FormItem>
        <FormItem prop="date">
          日期：
          <DatePicker v-model="SQform.date" type="date" format="yyyy-MM-dd" placeholder="日期"
                      style="width: 150px"></DatePicker>
          <Button @click="CurrentTime" shape="circle" style="background: #7FFFAA;">当前时间</Button>
        </FormItem>
        <FormItem prop="batch">
          批次：
          <Input type="text" v-model="SQform.batch" placeholder="批次" clearable style="width: 200px"/>
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </FormItem>
        <!--设置表格显示高度：<Input type="text" v-model="tableHeight" placeholder="表格显示高度" style="width: 80px"/>-->
        <FormItem prop="inputDate">
          进馆日期：
          <DatePicker v-model="SQform.inputDate" type="date" format="yyyy-MM-dd" placeholder="日期"
                      style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem>
          <Upload ref="upload" action="/api/importArch/handelExcel" :showUploadList="false" :on-success="importList"
                  :data="{district:SQform.district}" :before-upload="beforeUpload">
            <i-button type="primary">导入清单</i-button>
          </Upload>
        </FormItem>
        <!--<FormItem>-->
        <!--<Button @click="ArchNOTool" shape="circle">档号设置</Button>-->
        <!--</FormItem>-->
        <!--<Button @click="test">测试</Button>-->
      </Form>
    </Col>
    <!-- 显示导进来的Excel的内容（并且是把档号补充完整的） -->
    <Col span="20" offset="2" v-if="tableData != null">
      <Row>
        <Col>
          <Table border :height="tableHeight" :columns="columns" :data="tableData"></Table>
        </Col>
        <Col span="3" offset="10">
          <Button @click="confirm" type="primary">确认</Button>
          <Button @click="clearList">清空</Button>
        </Col>
      </Row>
    </Col>

    <Modal v-model="showMessage">
      错误信息：
      <Alert show-icon type="error">
        <span slot="desc">{{message}}</span>
      </Alert>
      <div slot="footer"></div>
    </Modal>

  </Row>
</template>

<script>
  import {notNull} from '../../js/validate'

  export default {
    name: 'archAmin',
    data() {
      return {
        //消息的展示框
        showMessage: false,
        message: '',
        tableHeight: 700,
        //导入清单的批次信息
        SQform: {
          district: '', // 区号
          date: '', // 日期
          batch: '', // 批次
          inputDate: '' //进馆日期
        },
        file: null, // 档案清单上传文件
        //清单可视化表格设置
        columns: [
          {
            title: '序号',
            width: 70,
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
        //传给后台的DTO
        archinfo: {
          no: '',
          lianhao: '',
          fawenhao: '',
          archNO: ''
        },
        //表单校验规则
        rules: {
          batch: [
            {validator: notNull, trigger: 'blur'}
          ],
          date: [
            {validator: notNull, trigger: 'change'}
          ],
          inputDate: [
            {validator: notNull, trigger: 'change'}
          ]
        }
      }
    },
    methods: {
      CurrentTime() { // 获取当前时间
        let date = new Date();
        this.SQform.date = date
      },
      beforeUpload() {
        this.$refs.importForm.validate((valid) => {
          if (!valid) {
            this.$Message.error('请填写必要导入信息！');
          }
        });
        return !!(this.SQform.inputDate !== '' && this.SQform.date !== '' && this.SQform.batch);
      },
      // 清单的处理
      importList(response, file, fileList) {
        this.tableData = [];
        if (response.data !== '') {
          for (let j = 0; j < response.data.successData.length; j++) {
            this.tableData.push(response.data.successData[j])
          }
          if (response.data.failData.length !== 0) { //含有部分有问题的档案
            let message = '';
            for (let j = 0; j < response.data.failData.length; j++) {
              message = message + response.data.failData[j] + '<br>';
            }
            this.$Notice.error({
              title: '错误信息：',
              desc: message,
              duration: 0
            });
          }
        } else { //全是有问题的档案
          this.$Notice.error({
            title: '错误信息：',
            desc: response.msg,
            duration: 0
          });
          this.$refs.importForm.resetFields();
        }
      },
      //导入确认
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
        let newDate = tempDate.getFullYear() + '-' + timeAdd0((tempDate.getMonth() + 1).toString()) + '-' + timeAdd0(tempDate.getDate().toString());
        let tempDate2 = this.SQform.inputDate;
        let newDate2 = tempDate2.getFullYear() + '-' + timeAdd0((tempDate2.getMonth() + 1).toString()) + '-' + timeAdd0(tempDate2.getDate().toString());

        let batch = this.SQform.district + newDate + this.SQform.batch;
        let inputStoreDate = newDate2;
        //导入清单数据
        let arch = JSON.stringify(this.tableData);

        this.axios.post('/api/importArch/importList', this.qs.stringify({
          district: this.SQform.district,
          batch: batch,
          arch: arch,
          inputDate: inputStoreDate
        })).then(res => {
          this.$Message.info(res.data.msg);
          this.tableData = [];
          this.$refs.importForm.resetFields();
        })
      },
      //清空按钮，清空导入清单数据
      clearList() {
        this.$refs.importForm.resetFields();
        this.tableData = [];
      }
    }
  }
</script>

<style scoped>

</style>
