<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          验收建筑层数与面积
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
    <Modal width="1000px" :loading="loading" v-model="AddModal" :mask-closable="false" title="添加验收建筑层数与面积"
           @on-ok="addNMIData" @on-cancel="addcancle">
      <Form class="formClass" :model="D61NumAreaInfo" ref="addForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="3">
                <p class="profSpecTableCss">项目名称</p>
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

            <Row :gutter="16">
              <Col span="3">
                <FormItem class="FormItemClass">
                  <Tooltip :content="D61NumAreaInfo.projectName" max-width="200">
                    <Input placeholder="..." v-model="D61NumAreaInfo.projectName" class="D31D61NumWriteInput"/>
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="buildingNum">
                  <Input placeholder="..." v-model="D61NumAreaInfo.buildingNum" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundFloor">
                  <Input placeholder="..." v-model="D61NumAreaInfo.overgroundFloor" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundFloor">
                  <Input placeholder="..." v-model="D61NumAreaInfo.undergroundFloor" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.overgroundArea" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.undergroundArea" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="totalArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.totalArea" class="D31D61NumWriteInput"/>
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
          <Col span="3"><p class="addDataCss">{{item.projectName===''?'-':item.projectName}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.buildingNum===''?'-':item.buildingNum}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.overgroundFloor===''?'-':item.overgroundFloor}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.undergroundFloor===''?'-':item.undergroundFloor}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.overgroundArea===''?'-':item.overgroundArea}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.undergroundArea===''?'-':item.undergroundArea}}</p></Col>
          <Col span="3"><p class="addDataCss">{{item.totalArea===''?'-':item.totalArea}}</p></Col>
          <Col span="1" offset="1">
            <a @click="modalAddDelete(index)" style="color: red;font-size: 14px;">-</a>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal width="1000px" :loading="loading" v-model="UpdateModal" :mask-closable="false" title="修改验收建筑层数与面积"
           @on-ok="UpdateNMIData" @on-cancel="cancleUpdate">
      <Form class="formClass" :model="D61NumAreaInfo" ref="updateForm" :rules="rules">
        <Row>
          <Col>
            <Row :gutter="16">
              <Col span="4">
                <p class="profSpecTableCss">项目名称</p>
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

            <Row :gutter="16">
              <Col span="4">
                <FormItem class="FormItemClass">
                  <Tooltip :content="D61NumAreaInfo.projectName" max-width="200">
                    <Input placeholder="..." v-model="D61NumAreaInfo.projectName" class="D31D61NumWriteInput"/>
                  </Tooltip>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="buildingNum">
                  <Input placeholder="..." v-model="D61NumAreaInfo.buildingNum" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundFloor">
                  <Input placeholder="..." v-model="D61NumAreaInfo.overgroundFloor" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundFloor">
                  <Input placeholder="..." v-model="D61NumAreaInfo.undergroundFloor" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="overgroundArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.overgroundArea" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="undergroundArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.undergroundArea" class="D31D61NumWriteInput"/>
                </FormItem>
              </Col>
              <Col span="3">
                <FormItem class="FormItemClass" prop="totalArea">
                  <Input placeholder="..." v-model="D61NumAreaInfo.totalArea" class="D31D61NumWriteInput"/>
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
    name: "NumAreaInfo",
    props: ['D6123SpecParams'],
    data() {
      return {
        NumAreaInfoData: [],
        archId: this.D6123SpecParams.archId,
        D61NumAreaInfo: {
          id: null,
          archId: this.D6123SpecParams.archId, // 读取出来
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
            width: 70,
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
        },
        //
        modalAdd: []
      }
    },
    methods: {
      loadNAI() {
        if (this.D6123SpecParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD61NumAreaInfo', {params: {archId: this.D6123SpecParams.archId}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.D61NumAreaInfo.id = '';
        this.D61NumAreaInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          this.$Message.info('请钩选要修改的验收建筑层数与面积')
        } else if (Object.keys(this.tempData).length > 1) {
          this.$Message.info('请钩选一条要修改的验收建筑层数与面积')
        } else {
          this.UpdateModal = true;
          this.D61NumAreaInfo.id = this.tempData[0].id;
          this.D61NumAreaInfo.archId = this.archId;
          this.D61NumAreaInfo.projectName = this.tempData[0].projectName;
          this.D61NumAreaInfo.buildingNum = this.tempData[0].buildingNum;
          this.D61NumAreaInfo.overgroundFloor = this.tempData[0].overgroundFloor;
          this.D61NumAreaInfo.undergroundFloor = this.tempData[0].undergroundFloor;
          this.D61NumAreaInfo.overgroundArea = this.tempData[0].overgroundArea;
          this.D61NumAreaInfo.undergroundArea = this.tempData[0].undergroundArea;
          this.D61NumAreaInfo.totalArea = this.tempData[0].totalArea;
        }
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.formReset();
        this.tempData = [];
        this.$refs.D61Table.selectAll(false)
      },
      UpdateNMIData() {
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
        temp.id = this.D61NumAreaInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D61NumAreaInfo.projectName;
        temp.buildingNum = this.D61NumAreaInfo.buildingNum;
        temp.overgroundFloor = this.D61NumAreaInfo.overgroundFloor;
        temp.undergroundFloor = this.D61NumAreaInfo.undergroundFloor;
        temp.overgroundArea = this.D61NumAreaInfo.overgroundArea;
        temp.undergroundArea = this.D61NumAreaInfo.undergroundArea;
        temp.totalArea = this.D61NumAreaInfo.totalArea;
        let check = true;
        this.$refs.updateForm.validate((valid) => {
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
                  this.UpdateAddData.push(temp);
                  this.tableData.splice(i, 1);
                  this.tableData.push(temp);
                  check = false
                }
              }
              if (check === true) {
                let data = [];
                data.push(temp);
                this.axios.post('/api/profETC/updateD61NumAreaInfo', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/profETC/getD61NumAreaInfo', {
                    params: {
                      archId: data[0].archId
                    }
                  }).then(res => {
                    this.tableData = res.data.data;
                    for (let i = (this.UpdateAddData.length - 1); i >= 0; i--) {
                      this.tableData.push(this.UpdateAddData[i])
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
        this.D61NumAreaInfo.id = '';
        this.D61NumAreaInfo.archId = '';
        this.formReset();
        this.tempData = [];
      },
      updatePMI() {
        this.axios.all([this.axios.post('/api/profETC/addD61NumAreaInfo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profETC/deleteD61NumAreaInfo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)]).then(this.axios.spread((res1,res2) => {
          this.UpdateAddData = [];
          this.UpdateDeleteData = [];
          //todo,有错报错，没错提示并跳转
          this.loadNAI()
        }))
      },
      updateRowData(row, index) {
        if (this.D6123SpecParams.isUpdate === true) {
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
          this.D61NumAreaInfo.id = row.id;
          this.D61NumAreaInfo.archId = this.archId;
          this.D61NumAreaInfo.projectName = row.projectName;
          this.D61NumAreaInfo.buildingNum = row.buildingNum;
          this.D61NumAreaInfo.overgroundFloor = row.overgroundFloor;
          this.D61NumAreaInfo.undergroundFloor = row.undergroundFloor;
          this.D61NumAreaInfo.overgroundArea = row.overgroundArea;
          this.D61NumAreaInfo.undergroundArea = row.undergroundArea;
          this.D61NumAreaInfo.totalArea = row.totalArea;
          this.tempData.push(temp)
        }
      },
      addNMIData() {
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
        temp.id = this.D61NumAreaInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D61NumAreaInfo.projectName;
        temp.buildingNum = this.D61NumAreaInfo.buildingNum;
        temp.overgroundFloor = this.D61NumAreaInfo.overgroundFloor;
        temp.undergroundFloor = this.D61NumAreaInfo.undergroundFloor;
        temp.overgroundArea = this.D61NumAreaInfo.overgroundArea;
        temp.undergroundArea = this.D61NumAreaInfo.undergroundArea;
        temp.totalArea = this.D61NumAreaInfo.totalArea;
        let result = false;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if(this.modalAdd.length === 0) {
              if (!CommonFunction.isEmpty(temp.projectName) ||
                !CommonFunction.isEmpty(temp.buildingNum) ||
                !CommonFunction.isEmpty(temp.overgroundFloor) ||
                !CommonFunction.isEmpty(temp.undergroundFloor) ||
                !CommonFunction.isEmpty(temp.overgroundArea) ||
                !CommonFunction.isEmpty(temp.undergroundArea) ||
                !CommonFunction.isEmpty(temp.totalArea)) {
                if (this.D6123SpecParams.isUpdate === true) {
                  this.UpdateAddData.push(temp);
                  this.tableData.push(temp)
                }
                else {
                  this.NumAreaInfoData.push(temp);
                  this.tableData = this.NumAreaInfoData;
                  this.$emit('saveNumAreaInfoData', this.tableData)
                }
                result = true;
              }
            }
            else {
              if (CommonFunction.isEmpty(temp.projectName) &&
                CommonFunction.isEmpty(temp.buildingNum) &&
                CommonFunction.isEmpty(temp.overgroundFloor) &&
                CommonFunction.isEmpty(temp.undergroundFloor) &&
                CommonFunction.isEmpty(temp.overgroundArea) &&
                CommonFunction.isEmpty(temp.undergroundArea) &&
                CommonFunction.isEmpty(temp.totalArea)) {
                if (this.D6123SpecParams.isUpdate === true) {
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.UpdateAddData.push(this.modalAdd[i]);
                    this.tableData.push(this.modalAdd[i])
                  }
                }
                else {
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.NumAreaInfoData.push(this.modalAdd[i]);
                  }
                  this.tableData = this.NumAreaInfoData;
                  this.$emit('saveNumAreaInfoData', this.tableData)
                }
                result = true;
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
      //
      modalAddData(){
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
        temp.id = this.D61NumAreaInfo.id;
        temp.archId = this.archId;
        temp.projectName = this.D61NumAreaInfo.projectName;
        temp.buildingNum = this.D61NumAreaInfo.buildingNum;
        temp.overgroundFloor = this.D61NumAreaInfo.overgroundFloor;
        temp.undergroundFloor = this.D61NumAreaInfo.undergroundFloor;
        temp.overgroundArea = this.D61NumAreaInfo.overgroundArea;
        temp.undergroundArea = this.D61NumAreaInfo.undergroundArea;
        temp.totalArea = this.D61NumAreaInfo.totalArea;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projectName) ||
              !CommonFunction.isEmpty(temp.buildingNum) ||
              !CommonFunction.isEmpty(temp.overgroundFloor) ||
              !CommonFunction.isEmpty(temp.undergroundFloor) ||
              !CommonFunction.isEmpty(temp.overgroundArea) ||
              !CommonFunction.isEmpty(temp.undergroundArea) ||
              !CommonFunction.isEmpty(temp.totalArea)) {
              this.modalAdd.push(temp);
              this.formReset()
            }
          }else{
            this.$Message.error('验收建筑层数与面积不能为空');
          }
        })
      },
      //
      modalAddDelete(index){
        this.modalAdd.splice(index,1)
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          this.$Message.info('请钩选要删除的验收建筑层数与面积')
        } else {
          let index = [];
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].projectName === this.UpdateAddData[j].projectName &&
                this.tempData[i].buildingNum === this.UpdateAddData[j].buildingNum &&
                this.tempData[i].overgroundFloor === this.UpdateAddData[j].overgroundFloor &&
                this.tempData[i].undergroundFloor === this.UpdateAddData[j].undergroundFloor &&
                this.tempData[i].overgroundArea === this.UpdateAddData[j].overgroundArea &&
                this.tempData[i].undergroundArea === this.UpdateAddData[j].undergroundArea &&
                this.tempData[i].totalArea === this.UpdateAddData[j].totalArea) {
                index.push(i);
                this.UpdateAddData.splice(j, 1);
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
          for (let i = 0; i < index.length; i++) {
            this.tempData.splice(index[i], 1) // index拿值
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
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.D6123SpecParams.isUpdate !== true) {
            this.$emit('saveNumAreaInfoData', this.tableData);
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
      cancelAllData(selection) {
        this.tempData = []
      },
      formReset() {
        this.D61NumAreaInfo.projectName = '';
        this.D61NumAreaInfo.buildingNum = '';
        this.D61NumAreaInfo.overgroundFloor = '';
        this.D61NumAreaInfo.undergroundFloor = '';
        this.D61NumAreaInfo.overgroundArea = '';
        this.D61NumAreaInfo.undergroundArea = '';
        this.D61NumAreaInfo.totalArea = '';
      },
      addcancle() {
        this.$refs.addForm.resetFields();
        this.formReset();
      },
    },
    mounted() {
      this.loadNAI()
    }
  }
</script>

<style scoped>
  .addDataCss{
    padding-left: 5px;
  }
</style>
