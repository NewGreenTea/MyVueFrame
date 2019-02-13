<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          用地性质详细著录
        </Col>
        <Col span="12">
          <Button @click="cancelMInfo" class="profButtonFloat">-</Button>
          <Button @click="updateMInfo" v-if="D212SpecParams.isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveMInfo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="UseATable"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal width="1000px" v-model="AddModal" :loading="loading" :mask-closable="false" title="添加用地性质详细著录"
           @on-ok="addUAIData" @on-cancel="addcancle">
      <Form class="formClass" :model="UseAreaInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="7">
                <p class="profSpecTableCss">用地性质</p>
              </Col>
              <Col span="7">
                <p class="profSpecTableCss">用地代码</p>
              </Col>
              <Col span="7">
                <p class="profSpecTableCss">分类用地面积</p>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="7">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="UseAreaInfo.areaNature" class="D212WriteInput"/>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem class="FormItemClass" prop="areaCode">
                  <Input placeholder="..." v-model="UseAreaInfo.areaCode" class="D212WriteInput"/>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem class="FormItemClass" prop="typeArea">
                  <Input placeholder="..." v-model="UseAreaInfo.typeArea" class="D212WriteInput"/>
                </FormItem>
              </Col>
              <Col span="1">
                <a @click="modalAddData" style="color: red;font-size: 14px;float: right">+</a>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>

      <div v-if="modalAdd !== []">
        <Row v-for="(item,index) in modalAdd" :key="index" style="margin: 3px 0px" :gutter="16">
          <Col span="7"><p class="addDataCss">{{item.areaNature===''?'-':item.areaNature}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.areaCode===''?'-':item.areaCode}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.typeArea===''?'-':item.typeArea}}</p></Col>
          <Col span="1" offset="1">
            <a @click="modalAddDelete(index)" style="color: red;font-size: 14px;">-</a>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal width="1000px" v-model="UpdateModal" :loading="loading" :mask-closable="false" title="修改用地性质详细著录"
           @on-ok="UpdateUAIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="UseAreaInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="7">
                <p class="profSpecTableCss">用地性质</p>
              </Col>
              <Col span="7">
                <p class="profSpecTableCss">用地代码</p>
              </Col>
              <Col span="7">
                <p class="profSpecTableCss">分类用地面积</p>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="7">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="UseAreaInfo.areaNature" class="D212WriteInput"/>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem class="FormItemClass" prop="areaCode">
                  <Input placeholder="..." v-model="UseAreaInfo.areaCode" class="D212WriteInput"/>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem class="FormItemClass" prop="typeArea">
                  <Input placeholder="..." v-model="UseAreaInfo.typeArea" class="D212WriteInput"/>
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
  import {CommonFunction, ArchRequestConfig} from '../../../js/global'

  export default {
    name: "UseAreaInfo",
    props: ['D212SpecParams'],
    data() {
      return {
        loading: true,
        rules: {},
        //档案分类
        archType: this.D212SpecParams.archType,
        //保存数据
        UseAreaInfoData: [],
        archId: this.D212SpecParams.archId,
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
        UpdateModal: false,
        //
        modalAdd: []
      }
    },
    methods: {
      loadUAI(data) {
        if (this.D212SpecParams.isUpdate === true) {
          this.axios.get('/api/profETC/getUseAreaInfo', {params: {archId: this.D212SpecParams.archId, ArchInfo: data}})
            .then(res => {
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
        this.tempData = [];
        this.$refs.UseATable.selectAll(false)
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
                      this.tableData.push(this.UpdateAddData[i])
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
        this.axios.all([
          this.axios.post('/api/profETC/add' + this.archType + 'UseAreaInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profETC/delete' + this.archType + 'UseAreaInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1, res2) => {
            this.UpdateAddData = [];
            this.UpdateDeleteData = [];
            //todo,有错报错，没错提示并跳转
            this.loadUAI(this.D212SpecParams.archType)
          }))
      },
      updateRowData(row, index) {
        if (this.D212SpecParams.isUpdate === true) {
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
        let result = false;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            //无数据
            if (this.modalAdd.length === 0) {
              if (!CommonFunction.isEmpty(temp.areaNature) ||
                !CommonFunction.isEmpty(temp.areaCode) ||
                !CommonFunction.isEmpty(temp.typeArea)) {
                if (this.D212SpecParams.isUpdate === true) {
                  this.UpdateAddData.push(temp);
                  this.tableData.push(temp)
                }
                else {
                  this.UseAreaInfoData.push(temp);
                  this.tableData = this.UseAreaInfoData;
                  this.$emit('saveUseAreaInfoData', this.tableData)
                }
                result = true
              }
            }
            else { //有数据
              if (CommonFunction.isEmpty(temp.areaNature) &&
                CommonFunction.isEmpty(temp.areaCode) &&
                CommonFunction.isEmpty(temp.typeArea)) {
                if (this.D212SpecParams.isUpdate === true) {
                  for (let i = 0; i < this.modalAdd.length; i++) {
                    this.UpdateAddData.push(this.modalAdd[i]);
                    this.tableData.push(this.modalAdd[i])
                  }
                }
                else {
                  for (let i = 0; i < this.modalAdd.length; i++) {
                    this.UseAreaInfoData.push(this.modalAdd[i]);
                  }
                  this.tableData = this.UseAreaInfoData;
                  this.$emit('saveUseAreaInfoData', this.tableData)
                }
                result = true
              }
              else {
                this.$Message.error('用地性质详细著录请添加到列表里！');
                setTimeout(() => {
                  this.loading = false;
                  this.$nextTick(() => {
                    this.loading = true;
                  });
                }, 1000);
              }
            }
            if (result === true) {
              this.modalAdd = [];
              this.AddModal = false;
              this.UseAreaInfo.id = '';
              this.UseAreaInfo.archId = '';
              this.formReset();
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
      //
      modalAddData() {
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
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.areaNature) ||
              !CommonFunction.isEmpty(temp.areaCode) ||
              !CommonFunction.isEmpty(temp.typeArea)) {
              this.modalAdd.push(temp);
              this.formReset()
            } else {
              this.$Message.error('用地性质详细著录不能为空！')
            }
          }
        })
      },
      //
      modalAddDelete(index) {
        this.modalAdd.splice(index, 1)
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
          if (this.D212SpecParams.isUpdate !== true) {
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
        this.modalAdd = [];
        this.$refs.addForm.resetFields()
      },
      formReset() {
        this.UseAreaInfo.areaNature = '';
        this.UseAreaInfo.areaCode = '';
        this.UseAreaInfo.typeArea = '';
      }
    },
    mounted() {
      this.loadUAI(this.D212SpecParams.archType)
    }
  }
</script>

<style scoped>

</style>
