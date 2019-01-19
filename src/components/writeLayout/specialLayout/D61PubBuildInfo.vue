<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          公建配套
        </Col>
        <Col span="12">
          <Button @click="cancelMInfo" class="profButtonFloat">-</Button>
          <Button @click="updateMInfo" v-if="D6123SpecParams.isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveMInfo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="D61Table"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal width="1000px" :loading="loading" v-model="AddModal" draggable :closable="false" title="添加公建配套"
           @on-ok="addPBIData" @on-cancel="addcancle">
      <Form class="formClass" :model="D61PubBuildInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="6">
                <p class="profSpecTableCss">项目名称</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">独立用地面积</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">建筑面积</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">位置</p>
              </Col>
            </Row>

            <Row>
              <Col span="6">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D61PubBuildInfo.projectName" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass" prop="independentArea">
                  <Input placeholder="..." v-model="D61PubBuildInfo.independentArea" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass" prop="buildArea">
                  <Input placeholder="..." v-model="D61PubBuildInfo.buildArea" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D61PubBuildInfo.position" class="D61WriteInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal width="1000px" :loading="loading" v-model="UpdateModal" draggable :closable="false" title="修改公建配套"
           @on-ok="UpdatePBIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="D61PubBuildInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="6">
                <p class="profSpecTableCss">项目名称</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">独立用地面积</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">建筑面积</p>
              </Col>
              <Col span="6">
                <p class="profSpecTableCss">位置</p>
              </Col>
            </Row>

            <Row>
              <Col span="6">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D61PubBuildInfo.projectName" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass" prop="independentArea">
                  <Input placeholder="..." v-model="D61PubBuildInfo.independentArea" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass" prop="buildArea">
                  <Input placeholder="..." v-model="D61PubBuildInfo.buildArea" class="D61WriteInput"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D61PubBuildInfo.position" class="D61WriteInput"/>
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
    name: "PubBuildInfo",
    props: ['D6123SpecParams'],
    data() {
      return {
        PubBuildInfoData: [],
        archId: this.D6123SpecParams.archId,
        D61PubBuildInfo: {
          id: null,
          archId: this.D6123SpecParams.archId, // 读取出来
          projectName: '',
          independentArea: '',
          buildArea: '',
          position: ''
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
            title: '项目名称',
            key: 'projectName'
          },
          {
            title: '独立用地面积',
            key: 'independentArea'
          },
          {
            title: '建筑面积',
            key: 'buildArea'
          },
          {
            title: '位置',
            key: 'position'
          }
        ],
        AddModal: false,
        UpdateModal: false,
        loading: true,
        rules: {
          independentArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          buildArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loadPBI() {
        if (this.D6123SpecParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD61PubBuildInfo', {params: {archId: this.D6123SpecParams.archId}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.D61PubBuildInfo.id = '';
        this.D61PubBuildInfo.archId = '';
        this.D61PubBuildInfo.projectName = '';
        this.D61PubBuildInfo.buildingNum = '';
        this.D61PubBuildInfo.overgroundFloor = '';
        this.D61PubBuildInfo.undergroundFloor = '';
        this.D61PubBuildInfo.overgroundArea = '';
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的公建配套')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的公建配套')
        } else {
          this.UpdateModal = true;
          this.D61PubBuildInfo.id = this.tempData[0].id;
          this.D61PubBuildInfo.archId = this.archId;
          this.D61PubBuildInfo.projectName = this.tempData[0].projectName;
          this.D61PubBuildInfo.independentArea = this.tempData[0].independentArea;
          this.D61PubBuildInfo.buildArea = this.tempData[0].buildArea;
          this.D61PubBuildInfo.position = this.tempData[0].position;
        }
      },
      cancleUpdate() {
        this.tempData = [];
        this.$refs.D61Table.selectAll(false)
      },
      UpdatePBIData() {
        let temp = {
          id: null,
          archId: '',
          projectName: '',
          independentArea: '',
          buildArea: '',
          position: ''
        };
        temp.id = this.D61PubBuildInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D61PubBuildInfo.projectName;
        temp.independentArea = this.D61PubBuildInfo.independentArea;
        temp.buildArea = this.D61PubBuildInfo.buildArea;
        temp.position = this.D61PubBuildInfo.position;
        let check = true;
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projectName) ||
              !CommonFunction.isEmpty(temp.independentArea) ||
              !CommonFunction.isEmpty(temp.buildArea) ||
              !CommonFunction.isEmpty(temp.position)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].projectName === this.tempData[0].projectName &&
                  this.UpdateAddData[i].independentArea === this.tempData[0].independentArea &&
                  this.UpdateAddData[i].buildArea === this.tempData[0].buildArea &&
                  this.UpdateAddData[i].position === this.tempData[0].position) {
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
                this.axios.post('/api/profETC/updateD61PubBuildInfo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/profETC/getD61PubBuildInfo', {
                    params: {
                      archId: data[0].archId
                    }
                  }).then(res => {
                    this.tableData = res.data.data;
                    //更新后，删掉‘准备删除’的数据
                    let index = [];
                    for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                      for (let j = 0; j < this.tableData.length; j++) {
                        if (this.UpdateDeleteData[i].projectName === this.tableData[j].projectName
                          && this.UpdateDeleteData[i].independentArea === this.tableData[j].independentArea
                          && this.UpdateDeleteData[i].buildArea === this.tableData[j].buildArea
                          && this.UpdateDeleteData[i].position === this.tableData[j].position) {
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
        this.D61PubBuildInfo.id = '';
        this.D61PubBuildInfo.archId = '';
        this.formReset();
        this.tempData = [];
      },
      updatePMI() {
        this.axios.all([this.axios.post('/api/profETC/addD61PubBuildInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profETC/deleteD61PubBuildInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1, res2) => {
            this.UpdateAddData = [];
            this.UpdateDeleteData = [];
            //todo,有错报错，没错提示并跳转
            this.loadPBI()
          }))
      },
      updateRowData(row, index) {
        if (this.D6123SpecParams.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            projectName: '',
            independentArea: '',
            buildArea: '',
            position: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.projectName = row.projectName;
          temp.independentArea = row.independentArea;
          temp.buildArea = row.buildArea;
          temp.position = row.position;
          this.D61PubBuildInfo.id = row.id;
          this.D61PubBuildInfo.archId = this.archId;
          this.D61PubBuildInfo.projectName = row.projectName;
          this.D61PubBuildInfo.independentArea = row.independentArea;
          this.D61PubBuildInfo.buildArea = row.buildArea;
          this.D61PubBuildInfo.position = row.position;
          this.tempData.push(temp)
        }
      },
      addcancle() {
        this.$refs.addForm.resetFields();
        this.formReset();
      },
      addPBIData() {
        let temp = {
          id: null,
          archId: '',
          projectName: '',
          independentArea: '',
          buildArea: '',
          position: ''
        };
        temp.id = this.D61PubBuildInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D61PubBuildInfo.projectName;
        temp.independentArea = this.D61PubBuildInfo.independentArea;
        temp.buildArea = this.D61PubBuildInfo.buildArea;
        temp.position = this.D61PubBuildInfo.position;
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projectName) ||
              !CommonFunction.isEmpty(temp.independentArea) ||
              !CommonFunction.isEmpty(temp.buildArea) ||
              !CommonFunction.isEmpty(temp.position)) {
              if (this.D6123SpecParams.isUpdate === true) {
                this.UpdateAddData.unshift(temp);
                this.tableData.unshift(temp)
              }
              else {
                this.PubBuildInfoData.unshift(temp);
                this.tableData = this.PubBuildInfoData;
                this.$emit('savePubBuildInfoData', this.tableData)
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
        this.D61PubBuildInfo.id = '';
        this.D61PubBuildInfo.archId = '';
        this.formReset()
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的验收建筑层数与面积')
        } else {
          let index = [];
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].projectName === this.UpdateAddData[j].projectName &&
                this.tempData[i].independentArea === this.UpdateAddData[j].independentArea &&
                this.tempData[i].buildArea === this.UpdateAddData[j].buildArea &&
                this.tempData[i].position === this.UpdateAddData[j].position) {
                index.push(j);
                this.UpdateAddData.splice(j, 1);
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].projectName === this.tempData[i].projectName &&
                    this.tableData[l].independentArea === this.tempData[i].independentArea &&
                    this.tableData[l].buildArea === this.tempData[i].buildArea &&
                    this.tableData[l].position === this.tempData[i].position) {
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
              if (this.tableData[i].projectName === this.tempData[j].projectName &&
                this.tableData[i].independentArea === this.tempData[j].independentArea &&
                this.tableData[i].buildArea === this.tempData[j].buildArea &&
                this.tableData[i].position === this.tempData[j].position) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.D6123SpecParams.isUpdate !== true) {
            this.$emit('savePubBuildInfoData', this.tableData);
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
          if (this.tempData[i].projectName === row.projectName &&
            this.tempData[i].independentArea === row.independentArea &&
            this.tempData[i].buildArea === row.buildArea &&
            this.tempData[i].position === row.position) {
            this.tempData.splice(i, 1)
          }
        }
      },
      cancelAllData(selection) {
        this.tempData = []
      },
      formReset() {
        this.D61PubBuildInfo.projectName = '';
        this.D61PubBuildInfo.independentArea = '';
        this.D61PubBuildInfo.buildArea = '';
        this.D61PubBuildInfo.position = '';
      }
    },
    mounted() {
      this.loadPBI()
    }
  }
</script>

<style scoped>
  .D61WriteInput {
    width: 200px;
    float: right;
  }

  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }

  /*表格字体大小*/
  .TableFontCss >>> .ivu-table {
    font-size: 14px;
  }
</style>
