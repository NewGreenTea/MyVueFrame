<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          报建项目详细
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
    <Modal width="1000px" :loading="loading" v-model="AddModal" draggable :closable="false" title="添加报建项目详细"
           @on-ok="addBPIData" @on-cancel="addcancle">
      <Form class="formClass" :model="D31BuildProjInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="3">
                <p class="profSpecTableCss">申报项目名称</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">幢数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地上层数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地下层数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地上面积</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地下面积</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">总建筑面积</p>
              </Col>
            </Row>

            <Row>
              <Col span="3">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D31BuildProjInfo.projectName" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="buildingNum">
                  <Input placeholder="..." v-model="D31BuildProjInfo.buildingNum" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundFloor">
                  <Input placeholder="..." v-model="D31BuildProjInfo.overgroundFloor" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundFloor">
                  <Input placeholder="..." v-model="D31BuildProjInfo.undergroundFloor" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.overgroundArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.undergroundArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="totalArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.totalArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Modal>

    <Modal width="1000px" :loading="loading" v-model="UpdateModal" draggable :closable="false" title="修改报建项目详细"
           @on-ok="UpdateBPIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="D31BuildProjInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row>
              <Col span="3">
                <p class="profSpecTableCss">申报项目名称</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">幢数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地上层数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地下层数</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地上面积</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">地下面积</p>
              </Col>
              <Col span="3">
                <p class="profSpecTableCss">总建筑面积</p>
              </Col>
            </Row>

            <Row>
              <Col span="3">
                <FormItem class="FormItemClass">
                  <Input placeholder="..." v-model="D31BuildProjInfo.projectName" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="buildingNum">
                  <Input placeholder="..." v-model="D31BuildProjInfo.buildingNum" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundFloor">
                  <Input placeholder="..." v-model="D31BuildProjInfo.overgroundFloor" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundFloor">
                  <Input placeholder="..." v-model="D31BuildProjInfo.undergroundFloor" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.overgroundArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.undergroundArea" class="D31WriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="totalArea">
                  <Input placeholder="..." v-model="D31BuildProjInfo.totalArea" class="D31WriteInput"/>
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
  import {isDecimalNotMust, isIntegerNotMust} from '../../../js/validate'
  import {CommonFunction, ArchRequestConfig} from '../../../js/global'

  export default {
    name: "D31BuildProjInfo",
    props: ['D31SpecParams'],
    data() {
      return {
        BuildProjInfoData: [],
        archId: this.D31SpecParams.archId,
        D31BuildProjInfo: {
          id: null,
          archId: this.D31SpecParams.archId, // 读取出来
          projectName: '',
          buildingNum: '',
          overgroundFloor: '',
          undergroundFloor: '',
          overgroundArea: '',
          undergroundArea: '',
          totalArea: ''
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
            title: '幢数',
            key: 'buildingNum'
          },
          {
            title: '地上层数',
            key: 'overgroundFloor'
          },
          {
            title: '地下层数',
            key: 'undergroundFloor'
          },
          {
            title: '地上面积',
            key: 'overgroundArea'
          },
          {
            title: '地下面积',
            key: 'undergroundArea'
          },
          {
            title: '总建筑面积',
            key: 'totalArea'
          }
        ],
        AddModal: false,
        UpdateModal: false,
        loading: true,
        rules: {
          buildingNum: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ],
          overgroundFloor: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ],
          undergroundFloor: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ],
          overgroundArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          undergroundArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loadBPI() {
        if (this.D31SpecParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD31BuildProjInfo', {params: {archId: this.D31SpecParams.archId}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.D31BuildProjInfo.id = '';
        this.D31BuildProjInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的报建项目详细')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的报建项目详细')
        } else {
          this.UpdateModal = true;
          this.D31BuildProjInfo.id = this.tempData[0].id;
          this.D31BuildProjInfo.archId = this.archId;
          this.D31BuildProjInfo.projectName = this.tempData[0].projectName;
          this.D31BuildProjInfo.buildingNum = this.tempData[0].buildingNum;
          this.D31BuildProjInfo.overgroundFloor = this.tempData[0].overgroundFloor;
          this.D31BuildProjInfo.undergroundFloor = this.tempData[0].undergroundFloor;
          this.D31BuildProjInfo.overgroundArea = this.tempData[0].overgroundArea;
          this.D31BuildProjInfo.undergroundArea = this.tempData[0].undergroundArea;
          this.D31BuildProjInfo.totalArea = this.tempData[0].totalArea;
        }
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.formReset();
        this.tempData = [];
        this.$refs.D31Table.selectAll(false)
      },
      UpdateBPIData() {
        let temp = {
          id: null,
          archId: '',
          projectName: '',
          buildingNum: '',
          overgroundFloor: '',
          undergroundFloor: '',
          overgroundArea: '',
          undergroundArea: '',
          totalArea: ''
        };
        temp.id = this.D31BuildProjInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D31BuildProjInfo.projectName;
        temp.buildingNum = this.D31BuildProjInfo.buildingNum;
        temp.overgroundFloor = this.D31BuildProjInfo.overgroundFloor;
        temp.undergroundFloor = this.D31BuildProjInfo.undergroundFloor;
        temp.overgroundArea = this.D31BuildProjInfo.overgroundArea;
        temp.undergroundArea = this.D31BuildProjInfo.undergroundArea;
        temp.totalArea = this.D31BuildProjInfo.totalArea;
        let check = true;
        this.$refs.updateForm.validate((valid) => {    //todo 更新检测
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projectName) ||
              !CommonFunction.isEmpty(temp.buildingNum) ||
              !CommonFunction.isEmpty(temp.overgroundFloor) ||
              !CommonFunction.isEmpty(temp.undergroundFloor) ||
              !CommonFunction.isEmpty(temp.overgroundArea) ||
              !CommonFunction.isEmpty(temp.undergroundArea) ||
              !CommonFunction.isEmpty(temp.totalArea)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].projectName === this.tempData[0].projectName &&
                  this.UpdateAddData[i].buildingNum === this.tempData[0].buildingNum &&
                  this.UpdateAddData[i].overgroundFloor === this.tempData[0].overgroundFloor &&
                  this.UpdateAddData[i].undergroundFloor === this.tempData[0].undergroundFloor &&
                  this.UpdateAddData[i].overgroundArea === this.tempData[0].overgroundArea &&
                  this.UpdateAddData[i].undergroundArea === this.tempData[0].undergroundArea &&
                  this.UpdateAddData[i].totalArea === this.tempData[0].totalArea) {
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
                this.axios.post('/api/profETC/updateD31BuildProjInfo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/profETC/getD31BuildProjInfo', {
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
                          && this.UpdateDeleteData[i].buildingNum === this.tableData[j].buildingNum
                          && this.UpdateDeleteData[i].overgroundFloor === this.tableData[j].overgroundFloor
                          && this.UpdateDeleteData[i].undergroundFloor === this.tableData[j].undergroundFloor
                          && this.UpdateDeleteData[i].overgroundArea === this.tableData[j].overgroundArea
                          && this.UpdateDeleteData[i].undergroundArea === this.tableData[j].undergroundArea
                          && this.UpdateDeleteData[i].totalArea === this.tableData[j].totalArea) {
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
        });
        this.D31BuildProjInfo.id = '';
        this.D31BuildProjInfo.archId = '';
        this.formReset();
        this.tempData = [];
      },
      updatePMI() {
        this.axios.all([this.axios.post('/api/profETC/addD31BuildProjInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
        this.axios.post('/api/profETC/deleteD31BuildProjInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1,res2) => {
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
            projectName: '',
            buildingNum: '',
            overgroundFloor: '',
            undergroundFloor: '',
            overgroundArea: '',
            undergroundArea: '',
            totalArea: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.projectName = row.projectName;
          temp.buildingNum = row.buildingNum;
          temp.overgroundFloor = row.overgroundFloor;
          temp.undergroundFloor = row.undergroundFloor;
          temp.overgroundArea = row.overgroundArea;
          temp.undergroundArea = row.undergroundArea;
          temp.totalArea = row.totalArea;
          this.D31BuildProjInfo.id = row.id;
          this.D31BuildProjInfo.archId = this.archId;
          this.D31BuildProjInfo.projectName = row.projectName;
          this.D31BuildProjInfo.buildingNum = row.buildingNum;
          this.D31BuildProjInfo.overgroundFloor = row.overgroundFloor;
          this.D31BuildProjInfo.undergroundFloor = row.undergroundFloor;
          this.D31BuildProjInfo.overgroundArea = row.overgroundArea;
          this.D31BuildProjInfo.undergroundArea = row.undergroundArea;
          this.D31BuildProjInfo.totalArea = row.totalArea;
          this.tempData.push(temp)
        }
      },
      addBPIData() {
        let temp = {
          id: null,
          archId: '',
          projectName: '',
          buildingNum: '',
          overgroundFloor: '',
          undergroundFloor: '',
          overgroundArea: '',
          undergroundArea: '',
          totalArea: ''
        };
        temp.id = this.D31BuildProjInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D31BuildProjInfo.projectName;
        temp.buildingNum = this.D31BuildProjInfo.buildingNum;
        temp.overgroundFloor = this.D31BuildProjInfo.overgroundFloor;
        temp.undergroundFloor = this.D31BuildProjInfo.undergroundFloor;
        temp.overgroundArea = this.D31BuildProjInfo.overgroundArea;
        temp.undergroundArea = this.D31BuildProjInfo.undergroundArea;
        temp.totalArea = this.D31BuildProjInfo.totalArea;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projectName) ||
              !CommonFunction.isEmpty(temp.buildingNum) ||
              !CommonFunction.isEmpty(temp.overgroundFloor) ||
              !CommonFunction.isEmpty(temp.undergroundFloor) ||
              !CommonFunction.isEmpty(temp.overgroundArea) ||
              !CommonFunction.isEmpty(temp.undergroundArea) ||
              !CommonFunction.isEmpty(temp.totalArea)) {
              if (this.D31SpecParams.isUpdate === true) {
                this.UpdateAddData.unshift(temp);
                this.tableData.unshift(temp)
              }
              else {
                this.BuildProjInfoData.unshift(temp);
                this.tableData = this.BuildProjInfoData;
                this.$emit('saveBuildProjInfoData', this.tableData)
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
        this.D31BuildProjInfo.id = '';
        this.D31BuildProjInfo.archId = '';
        this.formReset();
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的报建项目详细')
        } else {
          let index = [];
          //删除的是‘准备添加’的数据
          for (let i = 0; i < this.tempData.length; i++) {
            //删除临时数据
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].projectName === this.UpdateAddData[j].projectName
                && this.tempData[i].buildingNum === this.UpdateAddData[j].buildingNum
                && this.tempData[i].overgroundFloor === this.UpdateAddData[j].overgroundFloor
                && this.tempData[i].undergroundFloor === this.UpdateAddData[j].undergroundFloor
                && this.tempData[i].overgroundArea === this.UpdateAddData[j].overgroundArea
                && this.tempData[i].undergroundArea === this.UpdateAddData[j].undergroundArea
                && this.tempData[i].totalArea === this.UpdateAddData[j].totalArea) {
                this.UpdateAddData.splice(j, 1);
                index.push(i);
                //从显示表格删除
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].projectName === this.tempData[i].projectName &&
                    this.tableData[l].buildingNum === this.tempData[i].buildingNum &&
                    this.tableData[l].overgroundFloor === this.tempData[i].overgroundFloor &&
                    this.tableData[l].undergroundFloor === this.tempData[i].undergroundFloor &&
                    this.tableData[l].overgroundArea === this.tempData[i].overgroundArea &&
                    this.tableData[l].undergroundArea === this.tempData[i].undergroundArea &&
                    this.tableData[l].totalArea === this.tempData[i].totalArea) {
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
              if (this.tableData[i].projectName === this.tempData[j].projectName &&
                this.tableData[i].buildingNum === this.tempData[j].buildingNum &&
                this.tableData[i].overgroundFloor === this.tempData[j].overgroundFloor &&
                this.tableData[i].undergroundFloor === this.tempData[j].undergroundFloor &&
                this.tableData[i].overgroundArea === this.tempData[j].overgroundArea &&
                this.tableData[i].undergroundArea === this.tempData[j].undergroundArea &&
                this.tableData[i].totalArea === this.tempData[j].totalArea) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1)
              }
            }
          }

          if (this.D31SpecParams.isUpdate !== true) {
            this.$emit('saveBuildProjInfoData', this.tableData);
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
            this.tempData[i].buildingNum === row.buildingNum &&
            this.tempData[i].overgroundFloor === row.overgroundFloor &&
            this.tempData[i].undergroundFloor === row.undergroundFloor &&
            this.tempData[i].overgroundArea === row.overgroundArea &&
            this.tempData[i].undergroundArea === row.undergroundArea &&
            this.tempData[i].totalArea === row.totalArea) {
            this.tempData.splice(i, 1)
          }
        }
      },
      addcancle() {
        this.$refs.addForm.resetFields();
        this.formReset()
      },
      cancelAllData(selection) {
        this.tempData = []
      },
      formReset() {
        this.D31BuildProjInfo.projectName = '';
        this.D31BuildProjInfo.buildingNum = '';
        this.D31BuildProjInfo.overgroundFloor = '';
        this.D31BuildProjInfo.undergroundFloor = '';
        this.D31BuildProjInfo.overgroundArea = '';
        this.D31BuildProjInfo.undergroundArea = '';
        this.D31BuildProjInfo.totalArea = '';
      }
    },
    mounted() {
      this.loadBPI()
    }
  }
</script>

<style scoped>
  .D31WriteInput{
    width: 100px;
    float: right;
  }
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }

  /*表格字体大小*/
  .TableFontCss >>> .ivu-table{
    font-size: 14px;
  }
</style>
