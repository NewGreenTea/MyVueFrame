<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          建设工程规划许可证号表
        </Col>
        <Col span="12" class="profButtonFloat">
          <Button @click="cancelPNo" class="profButtonFloat">-</Button>
          <Button @click="updatePNo" v-if="specViewParams.isUpdate" class="profButtonFloat">√</Button>
          <Button @click="savePNo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="PNTable"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal v-model="AddModal" :loading="loading" :mask-closable="false" title="添加建设工程规划许可证号"
           @on-ok="addPNoData" @on-cancel="addcancle" width="800px">
      <Form :model="projectNoInfo" ref="addForm" :rules="rules">
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
            <FormItem prop="projType">
              <Input placeholder="..." v-model="projectNoInfo.projType" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="projYear" class="FormItemClass">
              <Input placeholder="..." v-model="projectNoInfo.projYear" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="projNum" class="FormItemClass">
              <Input placeholder="..." v-model="projectNoInfo.projNum" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="1">
            <a @click="modalAddData" style="color: red;font-size: 14px;float: right">+</a>
          </Col>
        </Row>
      </Form>
      <div v-if="modalAdd !== []">
        <Row v-for="(item,index) in modalAdd" :key="index" style="margin: 3px 0px" :gutter="16">
          <Col span="7"><p class="addDataCss">{{item.projType===''?'-':item.projType}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.projYear===''?'-':item.projYear}}</p></Col>
          <Col span="7"><p class="addDataCss">{{item.projNum===''?'-':item.projNum}}</p></Col>
          <Col span="1" offset="1">
            <a @click="modalAddDelete(index)" style="color: red;font-size: 14px;">-</a>
          </Col>
        </Row>
      </div>
    </Modal>

    <Modal v-model="UpdateModal" :loading="loading" :mask-closable="false" title="修改建设工程规划许可证号"
           @on-ok="updatePNoData" @on-cancel="cancleUpdate" width="800px">
      <Form :model="projectNoInfo" ref="updateForm" :rules="rules">
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
            <FormItem>
              <Input placeholder="..." v-model="projectNoInfo.projType" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="projYear" class="FormItemClass">
              <Input placeholder="..." v-model="projectNoInfo.projYear" class="fileWriteInput"/>
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem prop="projNum" class="FormItemClass">
              <Input placeholder="..." v-model="projectNoInfo.projNum" class="fileWriteInput"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {isIntegerNotMust} from '../../js/validate'
  import {CommonFunction, ArchRequestConfig} from '../../js/global'

  export default {
    name: "ProjectNo",
    props: ['specViewParams'],
    data() {
      return {
        //临时存储数据(给父组件)
        projectNoData: [],
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
            width: 70,
            type: 'index'
          },
          {
            title: '文种类别',
            key: 'projType'
          },
          {
            title: '年份',
            key: 'projYear'
          },
          {
            title: '流水号',
            key: 'projNum'
          }
        ],
        rules: {
          projYear: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ],
          projNum: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        },
        loading: true,
        // 表数据结构体
        projectNoInfo: {
          id: null,
          archId: '',
          projType: '',
          projYear: '',
          projNum: ''
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
      loadPPN() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.specViewParams.archId,
              ArchInfo: 'PN'
            }
          }).then(
            res => {
              this.tableData = res.data.data;
            }
          )
        }
      },
      // 参考BuildingAddress的saveBAddress和cancelBAdress方法（函数）
      savePNo() {
        this.projectNoInfo.id = '';
        this.projectNoInfo.archId = '';
        this.formReset();
        this.AddModal = true
      },
      updatePNo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的建设工程规划许可证号')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的建设工程规划许可证号')
        } else {
          this.UpdateModal = true;
          this.projectNoInfo.id = this.tempData[0].id;
          this.projectNoInfo.archId = this.tempData[0].archId;
          this.projectNoInfo.projType = this.tempData[0].projType;
          this.projectNoInfo.projYear = this.tempData[0].projYear;
          this.projectNoInfo.projNum = this.tempData[0].projNum
        }
      },
      addcancle() {
        this.modalAdd = [];  //todo 注意点
        this.$refs.addForm.resetFields()
      },
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.tempData = [];
        this.$refs.PNTable.selectAll(false)
      },
      updatePNoData() {
        let temp = {
          id: null,
          archId: '',
          projType: '',
          projYear: '',
          projNum: ''
        };
        temp.id = this.projectNoInfo.id;
        temp.archId = this.projectNoInfo.archId;
        temp.projType = this.projectNoInfo.projType;
        temp.projYear = this.projectNoInfo.projYear;
        temp.projNum = this.projectNoInfo.projNum;
        let check = true;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            if (!CommonFunction.isEmpty(temp.projType) ||
              !CommonFunction.isEmpty(temp.projYear) ||
              !CommonFunction.isEmpty(temp.projNum)) {
              for (let i = 0; i < this.UpdateAddData.length; i++) {
                if (this.UpdateAddData[i].projType === this.tempData[0].projType && this.UpdateAddData[i].projYear === this.tempData[0].projYear
                  && this.UpdateAddData[i].projNum === this.tempData[0].projNum) {
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
                this.axios.post('/api/profInfo/updateProjectNo', JSON.stringify(data), ArchRequestConfig).then(res => {
                    this.axios.get('/api/loadArch/getProfInfo', {
                      params: {
                        archId: data[0].archId,
                        ArchInfo: 'PN'
                      }
                    }).then(res => {
                      this.tableData = res.data.data;
                      //更新后，删掉‘准备删除’的数据
                      let index = [];
                      for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                        for (let j = 0; j < this.tableData.length; j++) {
                          if (this.UpdateDeleteData[i].projType === this.tableData[j].projType
                            && this.UpdateDeleteData[i].projYear === this.tableData[j].projYear
                            && this.UpdateDeleteData[i].projNum === this.tableData[j].projNum) {
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
                    this.projectNoInfo.id = null;
                    this.projectNoInfo.archId = '';
                    this.formReset();
                    this.tempData = []
                  }
                );
              }
              this.UpdateModal = false
            }
          } else {
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 1000);
          }
        });
      },
      updatePPN() {
        this.axios.all([this.axios.post('/api/profInfo/addProjectNo', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
          this.axios.post('/api/profInfo/deleteProjectNo', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)])
          .then(this.axios.spread((res1, res2) => {
            this.UpdateAddData = [];
            this.UpdateDeleteData = [];
            this.loadPPN();
          }))
      },
      updateRowData(row, index) {
        if (this.specViewParams.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            projType: '',
            projYear: '',
            projNum: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.projType = row.projType;
          temp.projYear = row.projYear;
          temp.projNum = row.projNum;
          this.projectNoInfo.id = row.id;
          this.projectNoInfo.archId = this.archId;
          this.projectNoInfo.projType = row.projType;
          this.projectNoInfo.projYear = row.projYear;
          this.projectNoInfo.projNum = row.projNum;
          this.tempData.push(temp)
        }
      },
      addPNoData() {
        let temp = {
          id: null,
          archId: '',
          projType: '',
          projYear: '',
          projNum: ''
        };
        temp.id = this.projectNoInfo.id;
        temp.archId = this.archId;
        temp.projType = this.projectNoInfo.projType;
        temp.projYear = this.projectNoInfo.projYear;
        temp.projNum = this.projectNoInfo.projNum;
        let result = false;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.modalAdd.length === 0) { //判断弹窗添加数据是否有数据
              if (!CommonFunction.isEmpty(temp.projType)
                || !CommonFunction.isEmpty(temp.projYear)
                || !CommonFunction.isEmpty(temp.projNum)) {
                //没有弹窗数据
                if (this.specViewParams.isUpdate === true) {
                  //把最后新加的放在第一位
                  this.UpdateAddData.push(temp);
                  this.tableData.push(temp)
                }
                else {
                  this.projectNoData.push(temp);
                  this.tableData = this.projectNoData;
                  this.$emit('saveProjectNoData', this.tableData)
                }
                result = true
              }
            } else { //有弹窗数据
              if (CommonFunction.isEmpty(temp.projType)
                && CommonFunction.isEmpty(temp.projYear)
                && CommonFunction.isEmpty(temp.projNum)) {
                if (this.specViewParams.isUpdate === true) {
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.UpdateAddData.push(this.modalAdd[i]);
                    this.tableData.push(this.modalAdd[i])
                  }
                }else{
                  for(let i=0;i<this.modalAdd.length;i++){
                    this.projectNoData.push(this.modalAdd[i]);
                  }
                  this.tableData = this.projectNoData;
                  this.$emit('saveProjectNoData', this.tableData)
                }
                result = true
              }else{
                this.$Message.error('建设工程规划许可证号请添加到列表里！');
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
              this.projectNoInfo.id = '';
              this.projectNoInfo.archId = '';
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
        })
      },
      cancelPNo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的建设工程规划许可证号')
        }
        else {
          let index = [];
          //删除的是‘准备添加’的数据
          for (let i = 0; i < this.tempData.length; i++) {
            //删除临时数据
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].projType === this.UpdateAddData[j].projType
                && this.tempData[i].projYear === this.UpdateAddData[j].projYear
                && this.tempData[i].projNum === this.UpdateAddData[j].projNum) {
                this.UpdateAddData.splice(j, 1);
                index.push(i);
                //从显示表格删除
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].projType === this.tempData[i].projType &&
                    this.tableData[l].projYear === this.tempData[i].projYear &&
                    this.tableData[l].projNum === this.tempData[i].projNum) {
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
          //添加显示表格中‘准备删除’的数据
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tempData.length; j++) {
              if (this.tableData[i].projType === this.tempData[j].projType &&
                this.tableData[i].projYear === this.tempData[j].projYear &&
                this.tableData[i].projNum === this.tempData[j].projNum) {
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
      modalAddData() {
        let temp = {
          id: null,
          archId: '',
          projType: '',
          projYear: '',
          projNum: ''
        };
        temp.id = this.projectNoInfo.id;
        temp.archId = this.archId;
        temp.projType = this.projectNoInfo.projType;
        temp.projYear = this.projectNoInfo.projYear;
        temp.projNum = this.projectNoInfo.projNum;
        this.$refs.addForm.validate((valid) => {
          if(valid){
            if (!CommonFunction.isEmpty(temp.projType)
              || !CommonFunction.isEmpty(temp.projYear)
              || !CommonFunction.isEmpty(temp.projNum)){
              this.modalAdd.push(temp);
              this.formReset();
            }else{
              this.$Message.error('建设工程规划许可证号不能为空');
            }
          }
        })
      },
      //弹窗删除事件2019/01/29
      modalAddDelete(index) {
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
          if (this.tempData[i].projType === row.projType && this.tempData[i].projYear === row.projYear
            && this.tempData[i].projNum === row.projNum) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
      //重置表单
      formReset() {
        this.projectNoInfo.projType = '';
        this.projectNoInfo.projYear = '';
        this.projectNoInfo.projNum = '';
      }
    },
    mounted() {
      this.loadPPN()
    }
  }
</script>

<style scoped>
</style>
