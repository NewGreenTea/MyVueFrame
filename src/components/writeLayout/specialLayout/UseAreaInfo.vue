<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          用地性质详细著录
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
    <Modal width="1000px" v-model="AddModal" :loading="loading" draggable :closable="false" title="添加用地性质详细著录"
           @on-ok="addUAIData" @on-cancel="addcancle">
      <Form class="formClass" :model="UseAreaInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="8">
                <FormItem class="FormItemClass" label="用地性质">
                  <Input placeholder="..." v-model="UseAreaInfo.areaNature" class="writeInput"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem class="FormItemClass" label="用地代码">
                  <Input placeholder="..." v-model="UseAreaInfo.areaCode" class="writeInput"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem class="FormItemClass" label="分类用地面积" prop="typeArea">
                  <Input placeholder="..." v-model="UseAreaInfo.typeArea" class="writeInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal width="1000px" v-model="UpdateModal" :loading="loading" draggable :closable="false" title="修改用地性质详细著录"
           @on-ok="UpdateUAIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="UseAreaInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="8">
                <FormItem class="FormItemClass" label="用地性质">
                  <Input placeholder="..." v-model="UseAreaInfo.areaNature" class="writeInput"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem class="FormItemClass" label="用地代码">
                  <Input placeholder="..." v-model="UseAreaInfo.areaCode" class="writeInput"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem class="FormItemClass" label="分类用地面积" prop="typeArea">
                  <Input placeholder="..." v-model="UseAreaInfo.typeArea" class="writeInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {isIntegerNotMust} from '../../../js/validate'
  import {CommonFunction, ArchRequestConfig} from '../../../js/global'

  export default {
    name: "UseAreaInfo",
    props: ['isUpdate'],
    data() {
      return {
        loading: false,
        rules: {
          typeArea: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        },
        //档案分类
        archType: this.$route.params.archType,
        //保存数据
        UseAreaInfoData: [],
        archId: this.$route.params.archId,
        tableData: [],
        tempData: [],
        UpdateAddData: [],
        UpdateDeleteData: [],
        tableHeight: 150,
        UseAreaInfo: {
          id: null,
          archId: '',
          areaNature: '',
          areaCode: '',
          typeArea: ''
        },
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
            title: '用地性质',
            key: 'areaNature'
          },
          {
            title: '用地代码',
            key: 'areaCode'
          },
          {
            title: '分类用地面积',
            key: 'typeArea'
          }
        ],
        AddModal: false,
        UpdateModal: false
      }
    },
    methods: {
      loadUAI(data) {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getUseAreaInfo', {params: {archId: this.archId, ArchInfo: data}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.UseAreaInfo.id = '';
        this.UseAreaInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的用地性质详细著录')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的用地性质详细著录')
        } else {
          this.UpdateModal = true;
          this.UseAreaInfo.id = this.tempData[0].id;
          this.UseAreaInfo.archId = this.archId;
          this.UseAreaInfo.areaNature = this.tempData[0].areaNature;
          this.UseAreaInfo.areaCode = this.tempData[0].areaCode;
          this.UseAreaInfo.typeArea = this.tempData[0].typeArea;
        }
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.tempData = []
      },
      UpdateUAIData() {
        let temp = {
          id: null,
          archId: '',
          areaNature: '',
          areaCode: '',
          typeArea: ''
        };
        temp.id = this.UseAreaInfo.id;
        temp.archId = this.archId;
        temp.areaNature = this.UseAreaInfo.areaNature;
        temp.areaCode = this.UseAreaInfo.areaCode;
        temp.typeArea = this.UseAreaInfo.typeArea;
        let check = true;
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.areaNature) ||
              !CommonFunction.isEmpty(temp.areaCode) ||
              !CommonFunction.isEmpty(temp.typeArea)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].areaNature === this.tempData[0].areaNature &&
                  this.UpdateAddData[i].areaCode === this.tempData[0].areaCode &&
                  this.UpdateAddData[i].typeArea === this.tempData[0].typeArea) {
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
                this.axios.post('/api/profETC/update' + this.archType + 'UseAreaInfo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/profETC/getUseAreaInfo', {
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
                        if (this.UpdateDeleteData[i].areaNature === this.tableData[j].areaNature
                          && this.UpdateDeleteData[i].areaCode === this.tableData[j].areaCode
                          && this.UpdateDeleteData[i].typeArea === this.tableData[j].typeArea) {
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
                  this.UseAreaInfo.id = '';
                  this.UseAreaInfo.archId = '';
                  this.formReset();
                  this.tempData = [];
                });
              }
              this.UpdateModal = false;
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
      updatePMI() {
        this.axios.post('/api/profETC/add' + this.archType + 'UseAreaInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig).then(res => {
          this.UpdateAddData = []
          //todo,有错报错，没错提示并跳转
        });
        this.axios.post('/api/profETC/delete' + this.archType + 'UseAreaInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig).then(res => {
          this.UpdateDeleteData = []
          //todo,有错报错，没错提示并跳转
        })
      },
      updateRowData(row, index) {
        if (this.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            areaNature: '',
            areaCode: '',
            typeArea: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.areaNature = row.areaNature;
          temp.areaCode = row.areaCode;
          temp.typeArea = row.typeArea;
          this.UseAreaInfo.id = row.id;
          this.UseAreaInfo.archId = this.archId;
          this.UseAreaInfo.areaNature = row.areaNature;
          this.UseAreaInfo.areaCode = row.areaCode;
          this.UseAreaInfo.typeArea = row.typeArea;
          this.tempData.push(temp)
        }
      },
      addUAIData() {
        let temp = {
          id: null,
          archId: '',
          areaNature: '',
          areaCode: '',
          typeArea: ''
        };
        temp.archId = this.archId;
        temp.areaNature = this.UseAreaInfo.areaNature;
        temp.areaCode = this.UseAreaInfo.areaCode;
        temp.typeArea = this.UseAreaInfo.typeArea;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.areaNature) ||
              !CommonFunction.isEmpty(temp.areaCode) ||
              !CommonFunction.isEmpty(temp.typeArea)) {
              if (this.isUpdate === true) {
                this.UpdateAddData.unshift(temp);
                this.tableData.unshift(temp)
              }
              else {
                this.UseAreaInfoData.unshift(temp);
                this.tableData = this.UseAreaInfoData;
                this.$emit('saveUseAreaInfoData', this.tableData)
              }
              this.AddModal = false;
              this.UseAreaInfo.id = '';
              this.UseAreaInfo.archId = '';
              this.formReset()
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
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的用地性质详细著录')
        } else {
          let index = [];
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].areaNature === this.UpdateAddData[j].areaNature &&
                this.tempData[i].areaCode === this.UpdateAddData[j].areaCode &&
                this.tempData[i].typeArea === this.UpdateAddData[j].typeArea) {
                index.push(i);
                this.UpdateAddData.splice(j, 1);
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].areaNature === this.tempData[i].areaNature &&
                    this.tableData[l].areaCode === this.tempData[i].areaCode &&
                    this.tableData[l].typeArea === this.tempData[i].typeArea) {
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
              if (this.tableData[i].areaNature === this.tempData[j].areaNature &&
                this.tableData[i].areaCode === this.tempData[j].areaCode &&
                this.tableData[i].typeArea === this.tempData[j].typeArea) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.isUpdate !== true) {
            this.$emit('saveUseAreaInfoData', this.tableData);
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
          if (this.tempData[i].areaNature === row.areaNature &&
            this.tempData[i].areaCode === row.areaCode &&
            this.tempData[i].typeArea === row.typeArea) {
            this.tempData.splice(i, 1)
          }
        }
      },
      cancelAllData(selection) {
        this.tempData = []
      },
      addcancle() {
        this.$refs.addForm.resetFields()
      },
      formReset() {
        this.UseAreaInfo.areaNature = '';
        this.UseAreaInfo.areaCode = '';
        this.UseAreaInfo.typeArea = '';
      }
    },
    mounted() {
      this.loadUAI(this.archType)
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
