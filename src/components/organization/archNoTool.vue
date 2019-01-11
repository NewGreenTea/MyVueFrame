<template>
  <div>
    <Row>
      <Col>
        <div>
          档案类型
          <Select @on-change="oneSelect" clearable>
            <Option :key="item.id" v-for="item in archOneType" :value="JSON.stringify(item)">{{item.className}}</Option>
          </Select>
        </div>
        <div v-if="showTwoCalss">
          <Select @on-change="twoSelect" placeholder="请选择具体档案类型" :clearable="clearTwoClass" ref="TwoCalssSelect">
            <Option :key="item.id" v-for="item in archTwoType" :value="JSON.stringify(item)">{{item.className}}</Option>
          </Select>
        </div>
        <div>
          <DatePicker type="year" placeholder="选择年份" v-model="yearKey" @on-change="selectYear"></DatePicker>
        </div>
      </Col>


      <Col>
        <Button @click="addArchNO">添加</Button>
        <Button @click="deleteArchNO">删除</Button>
        <Table ref="table" border :columns="columns" :data="ArchNoData" v-if="ArchNoData != null"
               @on-select-all="selectAllData" @on-select="selectData"
               @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
      </Col>

      <Col>
        <Row>
          <Col>
            <div v-if="AddOrUpdate">
              <Form ref="serialnumForm" :rules="rules" :model="serialnumInfo">
                <FormItem class="FormItemClass">
                  档案类型：{{serialnumInfo.className}}
                </FormItem>
                <FormItem prop="archYear" class="FormItemClass">
                  <Input type="text" v-model="serialnumInfo.archYear" placeholder="设置年份"/>
                </FormItem>
                <FormItem prop="startNum" class="FormItemClass">
                  <Input type="text" v-model="serialnumInfo.startNum" placeholder="定义开始流水号"/>
                </FormItem>
                <FormItem prop="endNum" class="FormItemClass" hidden>
                  <Input type="text" v-model="serialnumInfo.endNum" placeholder="定义结束流水号"/>
                </FormItem>
              </Form>
              <Row>
                <Col span="1" offset="11">
                  <Button @click="addCondition">确定</Button>
                </Col>
              </Row>
            </div>
          </Col>

          <Col span="6" offset="18">
            <Button @click="cancelSet">取消</Button>
            <Button @click="SetArchNo">设置</Button>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {isFourInteger, isFourIntegerNotMust} from "../../js/validate";
  import {ArchRequestConfig} from "../../js/global";

  export default {
    name: "archNoTool",
    data() {
      return {
        showTwoCalss: false,
        //档案类型
        archOneType: [],
        archTwoType: [],
        //与流水号关联的年份
        archNoYear: '',
        //档号流水号
        archNoNum: '',
        //设置好的档号流水号
        ArchNoData: [],
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            key: '_checked'
          },
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '档案类型',
            key: 'className'
          },
          {
            title: '年份',
            key: 'archYear'
          },
          {
            title: '开始流水号',
            key: 'startNum'
          },
          // {
          //   title: '结束流水号',
          //   key: 'endNum'
          // }
        ],
        //流水号结构体
        serialnumInfo: {
          id: null,
          classId: '',
          className: '',
          parentId: '',
          archYear: '',
          startNum: '',
          endNum: null
        },
        rules: {
          archYear: [
            {validator: isFourInteger, trigger: 'blur'}
          ],
          startNum: [
            {validator: isFourInteger, trigger: 'blur'}
          ],
          endNum: [
            {validator: isFourIntegerNotMust, trigger: 'blur'}
          ]
        },
        AddOrUpdate: false,
        oneID: '',
        twoID: '',
        yearKey: '',
        oneData: '',
        clearTwoClass: true,
        //档号设置表格数据选择存储变量
        tempData: []
      }
    },
    methods: {
      loadArchType() {
        this.axios.get('/api/loadArch/allOneClass').then(res => {
          this.archOneType = res.data.data;
        })
      },
      //当一级类型选中时
      oneSelect(value) {
        this.twoID = '';
        this.ArchNoData = [];
        this.archTwoType = [];
        if (this.showTwoCalss === true) {
          //清空下拉选项的选择值
          this.$refs.TwoCalssSelect.clearSingleSelect();
        }
        this.AddOrUpdate = false;
        //表格数据为一级类型所有
        let temp = {
          parentId: '',
          archYear: null
        };
        temp.parentId = this.stringToObject(value).id;
        if (Object.keys(this.yearKey).length !== 0) {
          temp.archYear = this.yearKey
        }
        this.oneID = this.stringToObject(value).id;
        temp.parentId = this.stringToObject(value).id;
        //改变表格的数据
        this.axios.get('/api/archTool/getByOneType', {params: temp}).then(res => {
          this.ArchNoData = res.data.data;
        });
        //二级类型显示
        this.showTwoCalss = true;
        this.axios.get('/api/loadArch/getAllTwoClass', {params: {'name': this.stringToObject(value).className}}).then(res => {
          this.archTwoType = res.data.data;
        })
      },
      //当二级类型选中时
      twoSelect(value) {
        //表格数据为二级类型所有
        let temp = {
          classId: '',
          archYear: null
        };
        temp.classId = this.stringToObject(value).id;
        if (Object.keys(this.yearKey).length !== 0) {
          temp.archYear = this.yearKey
        }
        this.twoID = this.stringToObject(value).id;
        temp.classId = this.stringToObject(value).id;
        this.serialnumInfo.className = this.stringToObject(value).className;
        //改变表格的数据
        this.axios.get('/api/archTool/getByTwoType', {params: temp}).then(res => {
          this.ArchNoData = res.data.data;
        });
      },
      //选择日期时，筛选日期
      selectYear(data, type) {
        this.yearKey = data;
        this.ArchNoData = [];
        if (this.oneID !== '') {
          //查询二级与年份的结果
          if (this.twoID !== '') {
            let temp = {
              classId: '',
              archYear: ''
            };
            temp.classId = this.twoID;
            temp.archYear = data;
            this.axios.get('/api/archTool/getByTwoType', {params:temp}).then(res => {
              this.ArchNoData = res.data.data;
            });
          }
          else {//查询一级与年份的结果
            let temp = {
              parentId: '',
              archYear: ''
            };
            temp.parentId = this.oneID;
            temp.archYear = data;
            this.axios.get('/api/archTool/getByOneType', {params:temp}).then(res => {
              this.ArchNoData = res.data.data;
            });
          }
        }
      },
      //显示添加新档号流水号操作界面
      addArchNO() {
        if (this.twoID === '') {
          this.$Message.warning('请选择具体的档案类型')
        } else {
          if(this.AddOrUpdate === true){
            this.AddOrUpdate = false;
          }else{
            this.AddOrUpdate = true
          }
        }
      },
      //删除新档号流水号
      deleteArchNO() {
        if(this.tempData.length === 0){
          this.$Message.info('请选择要删除的档号设置')
        }else{
          this.axios.post('/api/archTool/delete', JSON.stringify(this.tempData), ArchRequestConfig).then(res => {
            if(res.data.code === 0){
              this.$Message.success(res.data.msg);
            }else{
              this.$Message.error(res.data.msg);
            }

            let temp = {
              classId: this.twoID
            };
            this.$refs.serialnumForm.resetFields();
            this.axios.get('/api/archTool/getByTwoType', {params:temp}).then(res => {
              this.ArchNoData = [];
              this.ArchNoData = res.data.data;
              this.twoID = '';
              this.AddOrUpdate = false
            })
          })
        }
      },
      //添加新档号流水号
      addCondition() {
        this.$refs.serialnumForm.validate((valid) => {
          if (valid) {
            this.serialnumInfo.parentId = this.oneID;
            this.serialnumInfo.classId = this.twoID;
            //添加前检测是否重复
            this.axios.post('/api/archTool/check', this.serialnumInfo, ArchRequestConfig).then(res =>{
              if(res.data.code === 0){
                this.axios.post('/api/archTool/add', this.serialnumInfo, ArchRequestConfig)
                  .then(res => {
                    if(res.data.code === 0){
                      this.$Message.success(res.data.msg);
                    }else{
                      this.$Message.error(res.data.msg);
                      //todo
                      this.$refs.TwoCalssSelect.clearSingleSelect();
                    }

                    let temp = {
                      classId: this.twoID,
                      archYear: this.serialnumInfo.archYear
                    };
                    this.$refs.serialnumForm.resetFields();
                    this.axios.get('/api/archTool/getByTwoType', {params:temp}).then(res => {
                      this.ArchNoData = [];
                      this.ArchNoData = res.data.data;
                      this.twoID = '';
                      this.AddOrUpdate = false
                    })
                  })
              }else{
                this.$Message.error(res.data.msg)
              }
            });

          }
          else {
            this.$Message.error('设置格式有误！')
          }
        })
      },
      //取消设置，跳回
      cancelSet() {
        this.$router.go(-1);
        this.$emit('closeArchNoModel')
      },
      //确定设置档号流水号
      SetArchNo() {
        this.cancelSet()
      },
      stringToObject(str) { //todo 第一级换级的时候第一次有一个undefined
        return JSON.parse(str);
      },
      // 选择单条记录
      selectData(selection, row) {
        this.tempData.push(row)
      },
      // 选择所有记录
      selectAllData(selection) {
        for (let i = 0; i < selection.length; i++) {
          this.tempData.push(selection[i])
        }
      },
      //取消某个记录
      cancelData(selection, row) {
        for (let i = 0; i < this.tempData.length; i++) {
          if (this.tempData[i].id === row.id) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
    },
    mounted() {
      this.loadArchType();
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 5px !important;
  }
</style>
