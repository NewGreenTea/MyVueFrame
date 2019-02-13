<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          公建配套
        </Col>
        <Col span="12">
          <Button @click="cancelMInfo" class="profButtonFloat">-</Button>
          <Button @click="updateMInfo" v-if="this.D31SpecParams.isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveMInfo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="D31Table"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal width="1000px" :loading="loading" v-model="AddModal" :mask-closable="false" title="添加公建配套"
           @on-ok="addD31PBIData" @on-cancel="addcancle">
      <Form class="formClass" :model="D31PubBuildInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="5">
                <p class="profSpecTableCss">功能名称</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">设计面积</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">规划面积</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">备注</p>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="5">
                <FormItem class="FormItemClass">
                  <Tooltip :content="D31PubBuildInfo.functionName" max-width="300" class="D31WriteInput">
                    <Input placeholder="..." v-model="D31PubBuildInfo.functionName" class="D31WriteInput"/>
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass" prop="designArea">
                  <Input placeholder="..." v-model="D31PubBuildInfo.designArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass" prop="planArea">
                  <Input placeholder="..." v-model="D31PubBuildInfo.planArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D31PubBuildInfo.etc" class="D31WriteInput"/>
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
          <Col span="5"><p class="addDataCss">{{item.functionName===''?'-':item.functionName}}</p></Col>
          <Col span="5"><p class="addDataCss">{{item.designArea===''?'-':item.designArea}}</p></Col>
          <Col span="5"><p class="addDataCss">{{item.planArea===''?'-':item.planArea}}</p></Col>
          <Col span="5"><p class="addDataCss">{{item.etc===''?'-':item.etc}}</p></Col>
          <Col span="1" offset="1">
            <a @click="modalAddDelete(index)" style="color: red;font-size: 14px;">-</a>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal width="1000px" :loading="loading" v-model="UpdateModal" :mask-closable="false" title="修改公建配套"
           @on-ok="UpdateNMIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="D31PubBuildInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="5">
                <p class="profSpecTableCss">功能名称</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">设计面积</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">规划面积</p>
              </Col>
              <Col span="5">
                <p class="profSpecTableCss">备注</p>
              </Col>
            </Row>
            <Row :gutter="16">
              <Col span="5">
                <FormItem class="FormItemClass">
                  <Tooltip :content="D31PubBuildInfo.functionName" max-width="300" class="D31WriteInput">
                    <Input placeholder="..." v-model="D31PubBuildInfo.functionName" class="D31WriteInput"/>
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass" prop="designArea">
                  <Input placeholder="..." v-model="D31PubBuildInfo.designArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass" prop="planArea">
                  <Input placeholder="..." v-model="D31PubBuildInfo.planArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D31PubBuildInfo.etc" class="D31WriteInput"/>
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
  import {isDecimalNotMust} from '../../../js/validate'
  import {CommonFunction, ArchRequestConfig} from '../../../js/global'

  export default {
    name: "D31PubBuildInfo",
    props: ['D31SpecParams'],
    data() {
      return {
        PubBuildInfoData: [],
        archId: this.D31SpecParams.archId,
        D31PubBuildInfo: {
          id: null,
          archId: this.D31SpecParams.archId, // 读取出来
          functionName: '',
          designArea: '',
          planArea: '',
          etc: ''
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
            title: '功能名称',
            key: 'functionName'
          },
          {
            title: '设计面积',
            key: 'designArea'
          },
          {
            title: '规划面积',
            key: 'planArea'
          },
          {
            title: '备注',
            key: 'etc'
          }
        ],
        AddModal: false,
        UpdateModal: false,
        loading: true,
        rules: {
          designArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          planArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        },
        //
        modalAdd: []
      }
    },
    methods: {
      loadBPI() {
        if (this.D31SpecParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD31PubBuildInfo', {params: {archId: this.D31SpecParams.archId}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.D31PubBuildInfo.id = '';
        this.D31PubBuildInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的公建配套')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的公建配套')
        } else {
          this.UpdateModal = true;
          this.D31PubBuildInfo.id = this.tempData[0].id;
          this.D31PubBuildInfo.archId = this.archId;
          this.D31PubBuildInfo.functionName = this.tempData[0].functionName;
          this.D31PubBuildInfo.designArea = this.tempData[0].designArea;
          this.D31PubBuildInfo.planArea = this.tempData[0].planArea;
          this.D31PubBuildInfo.etc = this.tempData[0].etc;
        }
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.formReset();
        this.tempData = [];
        this.$refs.D31Table.selectAll(false)
      },
      addcancle() {
        this.modalAdd = [];
        this.$refs.addForm.resetFields();
        this.formReset();
      },
      UpdateNMIData() {
        let temp = {
          id: null,
          archId: '',
          functionName: '',
          designArea: '',
          planArea: '',
          etc: ''
        };
        temp.id = this.D31PubBuildInfo.id;
        temp.archId = this.archId;
        temp.functionName = this.D31PubBuildInfo.functionName;
        temp.designArea = this.D31PubBuildInfo.designArea;
        temp.planArea = this.D31PubBuildInfo.planArea;
        temp.etc = this.D31PubBuildInfo.etc;
        let check = true;
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.functionName) ||
              !CommonFunction.isEmpty(temp.designArea) ||
              !CommonFunction.isEmpty(temp.planArea)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].functionName === this.tempData[0].functionName &&
                  this.UpdateAddData[i].designArea === this.tempData[0].designArea &&
                  this.UpdateAddData[i].planArea === this.tempData[0].planArea &&
                  this.UpdateAddData[i].etc === this.tempData[0].etc) {
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
                this.axios.post('/api/profETC/updateD31PubBuildInfo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/profETC/getD31PubBuildInfo', {
                    params: {
                      archId: data[0].archId
                    }
                  }).then(res => {
                    this.tableData = res.data.data;
                    //更新后，删掉‘准备删除’的数据
                    let index = [];
                    for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                      for (let j = 0; j < this.tableData.length; j++) {
                        if (this.UpdateDeleteData[i].functionName === this.tableData[j].functionName
                          && this.UpdateDeleteData[i].designArea === this.tableData[j].designArea
                          && this.UpdateDeleteData[i].planArea === this.tableData[j].planArea) {
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
                  })
                });
              }
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
        });
        this.D31PubBuildInfo.id = '';
        this.D31PubBuildInfo.archId = '';
        this.formReset();
        this.tempData = [];
      },
      updatePMI() {
        this.axios.all([
          this.axios.post('/api/profETC/addD31PubBuildInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profETC/deleteD31PubBuildInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1, res2) => {
            this.UpdateAddData = [];
            this.UpdateDeleteData = [];
            //todo,有错报错，没错提示并跳转
            this.loadBPI()
          }))
      },
      updateRowData(row, index) {
        if (this.D31SpecParams.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            functionName: '',
            designArea: '',
            planArea: '',
            etc: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.functionName = row.functionName;
          temp.designArea = row.designArea;
          temp.planArea = row.planArea;
          temp.etc = row.etc;
          this.D31PubBuildInfo.id = row.id;
          this.D31PubBuildInfo.archId = this.archId;
          this.D31PubBuildInfo.functionName = row.functionName;
          this.D31PubBuildInfo.designArea = row.designArea;
          this.D31PubBuildInfo.planArea = row.planArea;
          this.D31PubBuildInfo.etc = row.etc;
          this.tempData.push(temp)
        }
      },
      addD31PBIData() {
        let temp = {
          id: null,
          archId: '',
          functionName: '',
          designArea: '',
          planArea: '',
          etc: ''
        };
        temp.id = this.D31PubBuildInfo.id;
        temp.archId = this.archId;
        temp.functionName = this.D31PubBuildInfo.functionName;
        temp.designArea = this.D31PubBuildInfo.designArea;
        temp.planArea = this.D31PubBuildInfo.planArea;
        temp.etc = this.D31PubBuildInfo.etc;
        let result = false;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            if (this.modalAdd.length === 0) {
              if (!CommonFunction.isEmpty(temp.functionName) ||
                !CommonFunction.isEmpty(temp.designArea) ||
                !CommonFunction.isEmpty(temp.planArea)) {
                if (this.D31SpecParams.isUpdate === true) {
                  this.UpdateAddData.push(temp);
                  this.tableData.push(temp)
                }
                else {
                  this.PubBuildInfoData.push(temp);
                  this.tableData = this.PubBuildInfoData;
                  this.$emit('savePubBuildInfoData', this.tableData)
                }
                result = true;
              }
            } else {
              if (CommonFunction.isEmpty(temp.functionName) &&
                CommonFunction.isEmpty(temp.designArea) &&
                CommonFunction.isEmpty(temp.planArea) &&
                CommonFunction.isEmpty(temp.etc)) {
                if (this.D31SpecParams.isUpdate === true) {
                  for (let i = 0; i < this.modalAdd.length; i++) {
                    this.UpdateAddData.push(this.modalAdd[i]);
                    this.tableData.push(this.modalAdd[i])
                  }
                }
                else {
                  for (let i = 0; i < this.modalAdd.length; i++) {
                    this.PubBuildInfoData.push(this.modalAdd[i]);
                  }
                  this.tableData = this.PubBuildInfoData;
                  this.$emit('savePubBuildInfoData', this.tableData)
                }
                result = true;
              } else {
                this.$Message.error('公建配套请添加到列表里！');
                setTimeout(() => {
                  this.loading = false;
                  this.$nextTick(() => {
                    this.loading = true;
                  });
                }, 1000);
              }
            }
            if (result === true) {
              //重置
              this.modalAdd = [];
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
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的公建配套')
        } else {
          let index = [];
          //删除的是‘准备添加’的数据
          for (let i = 0; i < this.tempData.length; i++) {
            //删除临时数据
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].functionName === this.UpdateAddData[j].functionName
                && this.tempData[i].designArea === this.UpdateAddData[j].designArea
                && this.tempData[i].planArea === this.UpdateAddData[j].planArea) {
                this.UpdateAddData.splice(j, 1);
                index.push(i);
                //从显示表格删除
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].functionName === this.tempData[i].functionName &&
                    this.tableData[l].designArea === this.tempData[i].designArea &&
                    this.tableData[l].planArea === this.tempData[i].planArea) {
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
              if (this.tableData[i].functionName === this.tempData[j].functionName &&
                this.tableData[i].designArea === this.tempData[j].designArea &&
                this.tableData[i].planArea === this.tempData[j].planArea) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1)
              }
            }
          }

          if (this.D31SpecParams.isUpdate !== true) {
            this.$emit('savePubBuildInfoData', this.tableData);
          }
          this.tempData = []
        }
      },
      //
      modalAddData() {
        let temp = {
          id: null,
          archId: '',
          functionName: '',
          designArea: '',
          planArea: '',
          etc: ''
        };
        temp.id = this.D31PubBuildInfo.id;
        temp.archId = this.archId;
        temp.functionName = this.D31PubBuildInfo.functionName;
        temp.designArea = this.D31PubBuildInfo.designArea;
        temp.planArea = this.D31PubBuildInfo.planArea;
        temp.etc = this.D31PubBuildInfo.etc;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.functionName) ||
              !CommonFunction.isEmpty(temp.designArea) ||
              !CommonFunction.isEmpty(temp.planArea)) {
              this.modalAdd.push(temp);
              this.formReset();
            } else {
              this.$Message.error('公建配套不能为空');
            }
          }
        })
      },
      //
      modalAddDelete(index) {
        this.modalAdd.splice(index, 1)
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
          if (this.tempData[i].functionName === row.functionName &&
            this.tempData[i].designArea === row.designArea &&
            this.tempData[i].planArea === row.planArea &&
            this.tempData[i].etc === row.etc) {
            this.tempData.splice(i, 1)
          }
        }
      },
      cancelAllData(selection) {
        this.tempData = []
      },
      formReset() {
        this.D31PubBuildInfo.functionName = '';
        this.D31PubBuildInfo.designArea = '';
        this.D31PubBuildInfo.planArea = '';
        this.D31PubBuildInfo.etc = '';
      }
    },
    mounted() {
      this.loadBPI()
    }
  }
</script>

<style scoped>

</style>
