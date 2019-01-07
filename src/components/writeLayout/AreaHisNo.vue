<template>
  <Row>
    <Col>
      局历史审批文件编号表
      <Button @click="saveAHNo">+</Button>
      <Button @click="updateAHNo" v-if="isUpdate">√</Button>
      <Button @click="cancelAHNo">-</Button>
    </Col>
    <Col>
      <Table border :columns="columns" :data="tableData" :height="tableHeight"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal v-model="AddModal" :loading="loading" draggable :closable="false" title="添加局历史审批文件编号"
           @on-ok="addAHNoData" @on-cancel="addcancel">
      <Form :model="areaHisNoInfo" :rules="rules" ref="addForm">
        <FormItem label="文种类别" prop="hisType" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisType" class="writeInput"/>
        </FormItem>
        <FormItem label="年份" prop="hisYear" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisYear" class="writeInput"/>
        </FormItem>
        <FormItem label="流水号" prop="hisNum" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisNum" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="UpdateModal" :loading="loading" draggable :closable="false" title="修改局历史审批文件编号"
           @on-ok="updateAHNoData" @on-cancel="cancleUpdate">
      <Form :model="areaHisNoInfo" ref="updateForm" :rules="rules">
        <FormItem label="文种类别" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisType" class="writeInput"/>
        </FormItem>
        <FormItem label="年份" prop="hisYear" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisYear" class="writeInput"/>
        </FormItem>
        <FormItem label="流水号" prop="hisNum" class="FormItemClass">
          <Input placeholder="..." v-model="areaHisNoInfo.hisNum" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {isIntegerNotMust} from '../../js/validate'
  import {CommonFunction} from '../../js/global'
  //档案数据对象的传输配置
  const config={
    headers: {'Content-Type': 'application/json'}
  };

  export default {
    name: "AreaHisNo",
    props: ['isUpdate'],
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
            width: 60,
            align: 'center',
            key: '_checked'
          },
          {
            title: '序号',
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
        archId: this.$route.params.archId,
        // 添加弹窗显示控制
        AddModal: false,
        UpdateModal: false
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadPAHN() {
        if (this.isUpdate === true) {
          this.axios.get('/api/loadArch/getProfInfo', {params: {archId: this.archId, ArchInfo: 'AHN'}}).then(
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
        this.tempData = []
      },
      updateAHNoData() {          //todo 这里也是需要修改一下的
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
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.hisType) ||
              !CommonFunction.isEmpty(temp.hisYear) ||
              !CommonFunction.isEmpty(temp.hisNum)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].hisType === this.tempData[0].hisType
                  && this.UpdateAddData[i].hisYear === this.tempData[0].hisYear
                  && this.UpdateAddData[i].hisNum === this.tempData[0].hisNum) {
                  this.UpdateAddData.splice(i, 1);
                  this.UpdateAddData.unshift(temp);
                  this.tableData.splice(i, 1);
                  this.tableData.unshift(temp);
                  check = false;
                  this.formReset()
                }
              }
              if (check === true) {
                let data = [];
                data.push(temp);
                this.axios.post('/api/loadArch/updateAreaHisNo', JSON.stringify(data),config).then(res => {
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
                      this.tableData.unshift(this.UpdateAddData[i])
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
        this.axios.post('/api/profInfo/addAreaHisNo', JSON.stringify(this.UpdateAddData),config).then(res => {
          this.UpdateAddData = []
        });
        this.axios.post('/api/profInfo/deleteAreaHisNo', JSON.stringify(this.UpdateDeleteData),config).then(res => {
          this.UpdateDeleteData = []
        })
      },
      updateRowData(row, index) {
        if (this.isUpdate === true) {
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
        this.$refs.addForm.validate((valid) => {         // todo 添加这里需要更改一下
          if (valid) {
            if (!CommonFunction.isEmpty(temp.hisType) ||
              !CommonFunction.isEmpty(temp.hisYear) ||
              !CommonFunction.isEmpty(temp.hisNum)) {
              if (this.isUpdate === true) {
                this.UpdateAddData.unshift(temp);
                this.tableData.unshift(temp)
              }
              else {
                this.areaHisNoData.unshift(temp);
                this.tableData = this.areaHisNoData;
                this.$emit('saveAreaHisNoData', this.tableData)
              }
              this.AddModal = false
            }
            else {
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
        this.areaHisNoInfo.id = '';
        this.areaHisNoInfo.archId = '';
        this.formReset();
      },
      cancelAHNo() {                                      //todo  所有表格数据表都要修改
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

          if (this.isUpdate !== true) {
            this.$emit('saveAreaHisNoData', this.tableData);
          }
          this.tempData = []
        }
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
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
