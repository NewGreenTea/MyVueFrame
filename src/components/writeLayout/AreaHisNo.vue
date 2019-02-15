<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          局历史审批文件编号表
        </Col>
        <Col span="12">
          <Button @click="cancelAHNo" class="profButtonFloat">-</Button>
          <Button @click="updateAHNo" v-if="specViewParams.isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveAHNo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="AHNTable"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal v-model="AddModal" :loading="loading" :mask-closable="false" title="添加局历史审批文件编号"
           @on-ok="addAHNoData" @on-cancel="addcancel" width="800px">
      <Form :model="areaHisNoInfo" :rules="rules" ref="addForm">
        <Row :gutter="16">
          <Col span="7">
            <p class="profSpecTableCss">文种类别</p>
          </Col>
          <Col span="7">
            <p class="profSpecTableCss">年份</p>
          </Col>
          <Col span="7">
            <p class="profSpecTableCss">流水号</p>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col span="7">
            <FormItem prop="hisType" class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisType" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="hisYear" class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisYear" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="hisNum" class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisNum" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="1">
            <a @click="modalAddData" style="color: red;font-size: 14px;float: right">+</a>
          </Col>
        </Row>
      </Form>
      <div v-if="modalAdd !== []">
        <Row v-for="(item,index) in modalAdd" :key="index" style="margin: 3px 0px" :gutter="16">
          <Col span="7"><p class="addDataCss">{{item.hisType===''?'-':item.hisType}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.hisYear===''?'-':item.hisYear}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.hisNum===''?'-':item.hisNum}}</p></Col>
          <Col span="1" offset="1">
            <a @click="modalAddDelete(index)" style="color: red;font-size: 14px;">-</a>
          </Col>
        </Row>
      </div>
    </Modal>
    <Modal v-model="UpdateModal" :loading="loading" :mask-closable="false" title="修改局历史审批文件编号"
           @on-ok="updateAHNoData" @on-cancel="cancleUpdate" width="800px">
      <Form :model="areaHisNoInfo" ref="updateForm" :rules="rules">
        <Row :gutter="16">
          <Col span="7">
            <p class="profSpecTableCss">文种类别</p>
          </Col>
          <Col span="7">
            <p class="profSpecTableCss">年份</p>
          </Col>
          <Col span="7">
            <p class="profSpecTableCss">流水号</p>
          </Col>
        </Row>

        <Row :gutter="16">
          <Col span="7">
            <FormItem class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisType" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="hisYear" class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisYear" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="hisNum" class="FormItemClass">
              <Input placeholder="..." v-model="areaHisNoInfo.hisNum" class="fileWriteInput"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {isIntegerNotMust} from '../../js/validate'
  import {CommonFunction,ArchRequestConfig} from '../../js/global'

  export default {
    name: "AreaHisNo",
    props: ['specViewParams'],
    data() {
      return {
        loading: true,
        rules: {
          hisYear: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ],
          hisNum: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        },
        //临时存储数据(给父组件)
        areaHisNoData: [],
        // 表数据
        tableData: [],
        //临时存储数据(删减临时存储数据)
        tempData: [],
        //修改时临时存储数据(删减时的存储数据)
        UpdateAddData: [],
        //修改时临时存储数据(删减时的存储数据)
        UpdateDeleteData: [],
        // 表高度，控制滚动条显示
        tableHeight: 150,
        columns: [
          {
            type: 'selection',
            width: 50,
            align: 'center',
            key: '_checked'
          },
          {
            title: '序号',
            width: 60,
            type: 'index'
          },
          {
            title: '文种类别',
            key: 'hisType'
          },
          {
            title: '年份',
            key: 'hisYear'
          },
          {
            title: '流水号',
            key: 'hisNum'
          }
        ],
        // 表数据结构体
        areaHisNoInfo: {
          id: null,
          archId: '',
          hisType: '',
          hisYear: '',
          hisNum: ''
        },
        //重要的archId
        archId: this.specViewParams.archId,
        // 添加弹窗显示控制
        AddModal: false,
        UpdateModal: false,
        //弹窗的多添加保存数据
        modalAdd: []
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadPAHN() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.specViewParams.archId,
              ArchInfo: 'AHN'
            }
          }).then(
            res => {
              this.tableData = res.data.data;
            }
          )
        }
      },
      saveAHNo() {
        this.areaHisNoInfo.id = '';
        this.areaHisNoInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updateAHNo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的局历史审批文件编号')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的局历史审批文件编号')
        } else {
          this.UpdateModal = true;
          this.areaHisNoInfo.id = this.tempData[0].id;
          this.areaHisNoInfo.archId = this.tempData[0].archId;
          this.areaHisNoInfo.hisType = this.tempData[0].hisType;
          this.areaHisNoInfo.hisYear = this.tempData[0].hisYear;
          this.areaHisNoInfo.hisNum = this.tempData[0].hisNum
        }
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.formReset();
        this.tempData = [];
        this.$refs.AHNTable.selectAll(false)
      },
      updateAHNoData() {
        let temp = {
          id: null,
          archId: '',
          hisType: '',
          hisYear: '',
          hisNum: ''
        };
        temp.id = this.areaHisNoInfo.id;
        temp.archId = this.areaHisNoInfo.archId;
        temp.hisType = this.areaHisNoInfo.hisType;
        temp.hisYear = this.areaHisNoInfo.hisYear;
        temp.hisNum = this.areaHisNoInfo.hisNum;
        let check = true;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.hisType) ||
              !CommonFunction.isEmpty(temp.hisYear) ||
              !CommonFunction.isEmpty(temp.hisNum)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].hisType === this.tempData[0].hisType
                  && this.UpdateAddData[i].hisYear === this.tempData[0].hisYear
                  && this.UpdateAddData[i].hisNum === this.tempData[0].hisNum) {
                  this.UpdateAddData.splice(i, 1);
                  this.UpdateAddData.push(temp);
                  this.tableData.splice(i, 1);
                  this.tableData.push(temp);
                  check = false;
                  this.formReset()
                }
              }
              if (check === true) {
                let data = [];
                data.push(temp);
                this.axios.post('/api/profInfo/updateAreaHisNo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/loadArch/getProfInfo', {
                    params: {
                      archId: data[0].archId,
                      ArchInfo: 'AHN'
                    }
                  }).then(res => {
                    this.tableData = res.data.data;
                    //更新后，删掉‘准备删除’的数据
                    let index = [];
                    for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                      for (let j = 0; j < this.tableData.length; j++) {
                        if (this.UpdateDeleteData[i].hisType === this.tableData[j].hisType
                          && this.UpdateDeleteData[i].hisYear === this.tableData[j].hisYear
                          && this.UpdateDeleteData[i].hisNum === this.tableData[j].hisNum) {
                          index.push(j)
                        }
                      }
                    }
                    for (let i = 0; i < index.length; i++) {
                      this.tableData.splice(index[i], 1)
                    }
                    //更新后，添加‘准备添加’的数据
                    for (let i = (this.UpdateAddData.length - 1); i >= 0; i--) {
                      this.tableData.push(this.UpdateAddData[i])
                    }
                  });
                  this.areaHisNoInfo.id = '';
                  this.areaHisNoInfo.archId = '';
                  this.formReset();
                  this.tempData = []
                });
              }
              this.UpdateModal = false
            }
            else {
              this.UpdateModal = false
            }
          }
          else {
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 1000);
          }
        })
      },
      updatePAHN() {
        this.axios.all([this.axios.post('/api/profInfo/addAreaHisNo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profInfo/deleteAreaHisNo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1, res2) => {
            this.UpdateAddData = [];
            this.UpdateDeleteData = [];
            this.loadPAHN();
          }))
      },
      updateRowData(row, index) {
        if (this.specViewParams.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            hisType: '',
            hisYear: '',
            hisNum: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.hisType = row.hisType;
          temp.hisYear = row.hisYear;
          temp.hisNum = row.hisNum;
          this.areaHisNoInfo.id = row.id;
          this.areaHisNoInfo.archId = this.archId;
          this.areaHisNoInfo.hisType = row.hisType;
          this.areaHisNoInfo.hisYear = row.hisYear;
          this.areaHisNoInfo.hisNum = row.hisNum;
          this.tempData.push(temp)
        }
      },
      addAHNoData() {
        let temp = {
          id: null,
          archId: '',
          hisType: '',
          hisYear: '',
          hisNum: ''
        };
        temp.id = this.areaHisNoInfo.id;
        temp.archId = this.archId;
        temp.hisType = this.areaHisNoInfo.hisType;
        temp.hisYear = this.areaHisNoInfo.hisYear;
        temp.hisNum = this.areaHisNoInfo.hisNum;
        let result = false;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.modalAdd.length === 0) { //判断弹窗添加数据是否有数据
              //没数据
              if (!CommonFunction.isEmpty(temp.hisType) ||
                !CommonFunction.isEmpty(temp.hisYear) ||
                !CommonFunction.isEmpty(temp.hisNum)) {
                if (this.specViewParams.isUpdate === true) {
                  this.UpdateAddData.push(temp);
                  this.tableData.push(temp)
                }
                else {
                  this.areaHisNoData.push(temp);
                  this.tableData = this.areaHisNoData;
                  this.$emit('saveAreaHisNoData', this.tableData)
                }
                result = true
              }
            }else{ //有数据
              if (CommonFunction.isEmpty(temp.hisType) &&
                CommonFunction.isEmpty(temp.hisYear) &&
                CommonFunction.isEmpty(temp.hisNum)) {
                if (this.specViewParams.isUpdate === true) {
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.UpdateAddData.push(this.modalAdd[i]);
                    this.tableData.push(this.modalAdd[i])
                  }
                }
                else {
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.areaHisNoData.push(this.modalAdd[i]);
                  }
                  this.tableData = this.areaHisNoData;
                  this.$emit('saveAreaHisNoData', this.tableData)
                }
                result = true
              }else{
                this.$Message.error('局历史审批文件编号请添加到列表里！');
                setTimeout(() => {
                  this.loading = false;
                  this.$nextTick(() => {
                    this.loading = true;
                  });
                }, 1000);
              }
            }
            if(result === true){
              //重置
              this.modalAdd=[];
              this.formReset();
              this.AddModal = false
            }
          }
          else {
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 1000);
          }
        });
      },
      cancelAHNo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的局历史审批文件编号')
        }
        else {
          let index = [];
          //删除的是‘准备添加’的数据
          for (let i = 0; i < this.tempData.length; i++) {
            //删除临时数据
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].hisType === this.UpdateAddData[j].hisType
                && this.tempData[i].hisYear === this.UpdateAddData[j].hisYear
                && this.tempData[i].hisNum === this.UpdateAddData[j].hisNum) {
                this.UpdateAddData.splice(j, 1);
                index.push(i);
                //从显示表格删除
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].hisType === this.tempData[i].hisType &&
                    this.tableData[l].hisYear === this.tempData[i].hisYear &&
                    this.tableData[l].hisNum === this.tempData[i].hisNum) {
                    //显示表格中删去
                    this.tableData.splice(l, 1)
                  }
                }
              }
            }
          }
          //从临时数据删去在‘准备添加’的数据
          for (let i = 0; i < index.length; i++) {
            this.tempData.splice(index[i], 1)
          }
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tempData.length; j++) {
              if (this.tableData[i].hisType === this.tempData[j].hisType &&
                this.tableData[i].hisYear === this.tempData[j].hisYear &&
                this.tableData[i].hisNum === this.tempData[j].hisNum) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1)
              }
            }
          }
          if (this.specViewParams.isUpdate !== true) {
            this.$emit('saveAreaHisNoData', this.tableData);
          }
          this.tempData = []
        }
      },
      //弹窗多添加事件2019/01/29
      modalAddData(){
        let temp={
          id: null,
          archId: '',
          hisType: '',
          hisYear: '',
          hisNum: ''
        };
        temp.id = this.areaHisNoInfo.id;
        temp.archId = this.archId;
        temp.hisType = this.areaHisNoInfo.hisType;
        temp.hisYear = this.areaHisNoInfo.hisYear;
        temp.hisNum = this.areaHisNoInfo.hisNum;
        this.$refs.addForm.validate((valid) => {
          if(valid){
            if (!CommonFunction.isEmpty(temp.hisType)
              || !CommonFunction.isEmpty(temp.hisYear)
              || !CommonFunction.isEmpty(temp.hisNum)){
              this.modalAdd.push(temp);
              this.formReset();
            }else{
              this.$Message.error('局历史审批文件编号不能为空');
            }
          }
        })
      },
      //弹窗删除事件2019/01/29
      modalAddDelete(index){
        this.modalAdd.splice(index, 1)
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
          if (this.tempData[i].hisType === row.hisType && this.tempData[i].hisYear === row.hisYear
            && this.tempData[i].hisNum === row.hisNum) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
      addcancel() {
        this.modalAdd = [];
        this.$refs.addForm.resetFields()
      },
      formReset() {
        this.areaHisNoInfo.hisType = '';
        this.areaHisNoInfo.hisYear = '';
        this.areaHisNoInfo.hisNum = '';
      }
    },
    mounted() {
      this.loadPAHN()
    }
  }
</script>

<style scoped>
</style>
