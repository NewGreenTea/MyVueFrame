<template>
  <Row style="margin-bottom: 50px;">
    <Col span="20" offset="2">
      <Form :model="SQform" inline ref="importForm" class="conditionForm" :rules="rules">
        <FormItem>
          <h2>选择批次:</h2>
        </FormItem>
        <FormItem>
          区局：
          <Input type="text" v-model="systemDistrict" placeholder="区局" style="width: 150px" class="colorBack" disabled/>
          <Icon type="ios-person-outline" slot="prepend"></Icon>
        </FormItem>
        <FormItem prop="date">
          日期：
          <DatePicker v-model="SQform.date" type="date" format="yyyy-MM-dd" placeholder="日期"
                      style="width: 150px"></DatePicker>
          <Button @click="CurrentTime" shape="circle" style="background: #7FFFAA;">当前时间</Button>
        </FormItem>
        <FormItem prop="batch">
          批次标识：
          <Input type="text" v-model="SQform.batch" placeholder="批次" clearable style="width: 200px"/>
          <Icon type="ios-lock-outline" slot="prepend"></Icon>
        </FormItem>
        <!--设置表格显示高度：<Input type="text" v-model="tableHeight" placeholder="表格显示高度" style="width: 80px"/>-->
        <FormItem>
          进馆日期：
          <DatePicker v-model="SQform.inputDate" type="date" format="yyyy-MM-dd" placeholder="日期"
                      style="width: 150px"></DatePicker>
        </FormItem>
        <FormItem>
          <Upload ref="upload" action="/api/importArch/handelExcel" :showUploadList="false" :on-success="importList"
                  :data="{district:systemDistrict}" :before-upload="beforeUpload" accept=".xlsx,.xls">
            <i-button type="primary" :loading="importLoading">导入清单</i-button>
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
          <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
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
        //加载动画
        spinShow: false,
        //消息的展示框
        showMessage: false,
        message: '',
        tableHeight: 700,
        systemDistrict: '', // 区号
        //导入清单的批次信息
        SQform: {
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
          },
          // {
          //   title: '操作结果'
          //
          // }
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
            {validator: notNull, trigger: 'blur'}
          ]
        },
        //导入按钮加载状态
        importLoading: false
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
          }else{
            this.importLoading = true;
          }
        });
        return !!(this.SQform.date !== '' && this.SQform.batch !== '');
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
        }
        //关闭导入加载状态
        this.importLoading = false;
      },
      //导入确认
      confirm() {
        if(this.SQform.inputDate !== '') {
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

          let batch = this.systemDistrict + newDate + this.SQform.batch;
          let inputStoreDate = newDate2;
          //导入清单数据,参数化
          let arch = JSON.stringify(this.tableData);

          this.spinShow = true;
          this.axios.post('/api/importArch/importList', this.qs.stringify({
            district: this.systemDistrict,
            batch: batch,
            arch: arch,
            inputDate: inputStoreDate
          })).then(res => {
            if(res.data.code===1){
              this.$Message.error(res.data.msg);
            }else{ //success,0
              this.$Message.info(res.data.msg);
              this.tableData = [];
              this.SQform.inputDate ='';
              this.$refs.importForm.resetFields()
            }
            this.spinShow = false;
          })
        }
        else{
          this.$Message.error('请填写进馆日期！')
        }
      },
      //清空按钮，清空导入清单数据
      clearList() {
        this.tableData = [];
        // this.impListReset()
        this.SQform.inputDate ='';
        this.$refs.importForm.resetFields()
      },
      //导入清单条件重置
      impListReset(){
        this.SQform.batch = '';
        this.SQform.date = '';
        this.SQform.inputDate = '';
      }
    },
    mounted(){
      if(this.getSystemCode === '无'){
        this.systemDistrict = ''
      }else{
        this.systemDistrict = this.getSystemCode
      }
    },
    computed:{
      getSystemCode(){
        return this.$store.state.systemCode
      }
    }
  }
</script>

<style scoped>

</style>
