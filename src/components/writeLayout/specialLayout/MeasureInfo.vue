<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          记录册编号
        </Col>
        <Col span="12">
          <Button @click="cancelMInfo" class="profButtonFloat">-</Button>
          <Button @click="updateMInfo" v-if="isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveMInfo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col>
      <Table border :columns="columns" :data="tableData" :height="tableHeight"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal width="1000px" v-model="AddModal" draggable :closable="false" title="添加记录册编号"
           @on-ok="add61MIData" @on-cancel="addcancle">
      <Form class="formClass" :model="MeasureInfo">
        <FormItem class="FormItemClass" label="记录册编号">
          <Input placeholder="..." v-model="MeasureInfo.remarkNo"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal width="1000px" v-model="UpdateModal" draggable :closable="false" title="修改记录册编号"
           @on-ok="update61MIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="MeasureInfo">
        <FormItem class="FormItemClass" label="记录册编号">
          <Input placeholder="..." v-model="MeasureInfo.remarkNo"/>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {CommonFunction, ArchRequestConfig} from '../../../js/global'

  export default {
    name: "MeasureInfo",
    props: ['isUpdate'],
    data() {
      return {
        //档案分类
        archType: this.$route.params.archType,
        //保存数据
        MeasureInfoData: [],
        archId: this.$route.params.archId,
        MeasureInfo: {
          id: null,
          archId: '',
          remarkNo: ''
        },
        tableData: [],
        tempData: [],
        UpdateAddData: [],
        UpdateDeleteData: [],
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
            title: '记录册编号',
            key: 'remarkNo'
          }
        ],
        AddModal: false,
        UpdateModal: false
      }
    },
    methods: {
      loadDMI(data) {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getMeasureInfo', {params: {archId: this.archId, ArchInfo: data}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.MeasureInfo.id = '';
        this.MeasureInfo.archId = '';
        this.MeasureInfo.remarkNo = '';
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的记录册编号')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的记录册编号')
        } else {
          this.UpdateModal = true;
          this.MeasureInfo.id = this.tempData[0].id;
          this.MeasureInfo.archId = this.archId;
          this.MeasureInfo.remarkNo = this.tempData[0].remarkNo
        }
      },
      cancleUpdate() {
        this.tempData = []
      },
      update61MIData() {
        let temp = {
          id: null,
          archId: '',
          remarkNo: ''
        };
        temp.id = this.MeasureInfo.id;
        temp.archId = this.archId;
        temp.remarkNo = this.MeasureInfo.remarkNo;
        let check = true;
        if (!CommonFunction.isEmpty(temp.remarkNo)) {
          for (let i = 0; i < this.UpdateAddData.length; i++) {
            if (this.UpdateAddData[i].remarkNo === this.tempData[0].remarkNo) {
              this.UpdateAddData.splice(i, 1);
              this.UpdateAddData.unshift(temp);
              this.tableData.splice(i, 1);
              this.tableData.unshift(temp);
              check = false
            }
          }
          if (check === true) {
            let data = [];
            data.push(temp);
            this.axios.post('/api/profETC/update' + this.archType + 'MI', JSON.stringify(data), ArchRequestConfig).then(res => {
              this.axios.get('/api/profETC/getMeasureInfo', {
                params: {
                  archId: data[0].archId,
                  ArchInfo: this.archType
                }
              }).then(res => {
                this.tableData = res.data.data;
                //更新后，删掉‘准备删除’的数据
                let index = [];
                for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                  for (let j = 0; j < this.tableData.length; j++) {
                    if (this.UpdateDeleteData[i].remarkNo === this.tableData[j].remarkNo) {
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
              })
            });
          }
        }
        else {
          this.$Message.error('记录册编号不能为空!')
        }

        this.MeasureInfo.id = '';
        this.MeasureInfo.archId = '';
        this.MeasureInfo.remarkNo = '';
        this.tempData = [];
      },
      updatePMI() {
        this.axios.post('/api/profETC/add' + this.archType + 'MI', JSON.stringify(this.UpdateAddData), ArchRequestConfig).then(res => {
          this.UpdateAddData = []
          //todo,有错报错，没错提示并跳转
        });
        this.axios.post('/api/profETC/delete' + this.archType + 'MI', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig).then(res => {
          this.UpdateDeleteData = []
          //todo,有错报错，没错提示并跳转
        })
      },
      updateRowData(row, index) {
        if (this.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            remarkNo: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.remarkNo = row.mapNo;
          this.MeasureInfo.id = row.id;
          this.MeasureInfo.archId = this.archId;
          this.MeasureInfo.remarkNo = row.remarkNo;
          this.tempData.push(temp)
        }
      },
      add61MIData() {
        let temp = {
          id: null,
          archId: '',
          remarkNo: ''
        };
        temp.archId = this.archId;
        temp.remarkNo = this.MeasureInfo.remarkNo;
        if (!CommonFunction.isEmpty(this.MeasureInfo.remarkNo)) {
          if (this.isUpdate === true) {
            this.UpdateAddData.unshift(temp);
            this.tableData.unshift(temp)
          }
          else {
            this.MeasureInfoData.unshift(temp);
            this.tableData = this.MeasureInfoData;
            this.$emit('saveMeasureInfoData', this.tableData)
          }
        } else {
          this.$Message.error('记录册编号不能为空');
        }

        this.MeasureInfo.id = '';
        this.MeasureInfo.archId = '';
        this.MeasureInfo.remarkNo = '';
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的记录册编号')
        } else {
          let index = [];
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].remarkNo === this.UpdateAddData[j].remarkNo) {
                index.push(i);
                this.UpdateAddData.splice(j, 1);
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].remarkNo === this.tempData[i].remarkNo) {
                    //显示表格中删去
                    this.tableData.splice(l, 1)
                  }
                }
              }
            }
          }
          for (let i = 0; i < index.length; i++) {
            this.tempData.splice(index[i], 1) // index拿值
          }
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tempData.length; j++) {
              if (this.tableData[i].remarkNo === this.tempData[j].remarkNo) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.isUpdate !== true) {
            this.$emit('saveMeasureInfoData', this.tableData);
          }
          this.tempData = []
        }
      },
      selectData(selection, row) {
        this.tempData.push(row)
      },
      selectAllData(selection) {
        for (let i = 0; i < selection.length; i++) {
          this.tempData.push(selection[i])
        }
      },
      cancelData(selection, row) {
        for (let i = 0; i < this.tempData.length; i++) {
          if (this.tempData[i].remarkNo === row.remarkNo) {
            this.tempData.splice(i, 1)
          }
        }
      },
      cancelAllData(selection) {
        this.tempData = []
      },
      addcancle() {
        this.MeasureInfo.id = '';
        this.MeasureInfo.archId = '';
        this.MeasureInfo.remarkNo = '';
      }
    },
    mounted() {
      this.loadDMI(this.archType)
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
