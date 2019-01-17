<template>
  <div class="WriteLayoutFont">
    <Row>
      <Col span="3">
        <Card class="tips" style="margin-right: 30px">
          <p slot="title">档号</p>
          <p>{{archNo}}</p>
        </Card>
      </Col>

      <!--表格-->
      <Col span="20">
        <Row>
          <Col>
            <Button @click="allDeleteFileInfo" class="profButtonFloat">全删</Button>
            <Button @click="cancelFileInfo" class="profButtonFloat">-</Button>
            <Button @click="updateFileInfo" class="profButtonFloat">√</Button>
            <Button @click="saveFileInfo" class="profButtonFloat">+</Button>
          </Col>
        </Row>
        <Row>
          <Col class="TableFontCss">
            <Table border :columns="columns" :data="tableData" :height="tableHeight"
                   @on-row-dblclick="updateRowData"
                   @on-select-all="selectAllData" @on-select="selectData"
                   @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row style="margin-top: 30px">
      <Col span="2" offset="11">
        <Button v-if="operation" @click="saveArch">保存</Button>
        <Button v-if="!operation" @click="updateArch">修改</Button>
        <Button @click="goBack">返回</Button>
      </Col>
    </Row>

    <Modal width="1250px" v-model="AddModal" :loading="loading" draggable :closable="false" title="添加文件信息"
           @on-ok="saveArchData" @on-cancel="cancleAdd">
      <Row>
        <Col span="20" offset="2">
          <Form class="formClass" :model="fileArch" :rules="rules" ref="addForm" :label-width="labelWidth">
            <Row :gutter="16">
              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="序号" prop="fileIndex">
                      <Input placeholder="..." v-model="fileArch.fileIndex" class="colorBack fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="文件编号">
                      <Input placeholder="..." v-model="fileArch.fileNo" class="colorBack fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="档号">
                      <Input placeholder="..." v-model="fileArch.archNo" class="colorBack fileWriteInput" disabled/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件题名" prop="fileTitle">
                  <Input placeholder="..." v-model="fileArch.fileTitle" style="width: 100%;float: right"/>
                </FormItem>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="页号" prop="pageNo">
                      <Input placeholder="..." v-model="fileArch.pageNo" class="fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="文件材料分类" prop="fileType">
                      <i-select placeholder="属性" class="fileWriteInput" v-model="fileArch.fileType">
                        <i-option :key="item" v-for="item in fileType" :value="item">{{item}}</i-option>
                      </i-select>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="日期" prop="fileDate">
                      <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="fileWriteInput" type="date"
                                  @on-change="fileArch.fileDate=$event" v-model="fileArch.fileDate"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="责任者">
                      <Input placeholder="..." v-model="fileArch.liableId" class="fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="16">
                    <FormItem class="FormItemClass" label="备注">
                      <Input placeholder="..." v-model="fileArch.remark" style="width: 100%;float: right"
                             type='textarea'/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span="1" offset="2">
          <Button @click="reset" style="align-content: center">重置</Button>
        </Col>
      </Row>
    </Modal>

    <Modal width="1250px" v-model="UpdateModal" :loading="loading" draggable :closable="false" title="修改文件信息"
           @on-ok="updateArchData" @on-cancel="cancleUpdate">
      <Row>
        <Col span="20" offset="2">
          <Form class="formClass" :model="fileArch" :rules="rules" ref="updateForm" :label-width="labelWidth">
            <Row :gutter="16">
              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="序号" prop="fileIndex">
                      <Input placeholder="..." v-model="fileArch.fileIndex" class="colorBack fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="文件编号" prop="fileNo">
                      <Input placeholder="..." v-model="fileArch.fileNo" class="colorBack fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="档号">
                      <Input placeholder="..." v-model="fileArch.archNo" class="colorBack fileWriteInput" disabled/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件题名" prop="fileTitle">
                  <Input placeholder="..." v-model="fileArch.fileTitle" style="width: 100%;float: right"/>
                </FormItem>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="页号" prop="pageNo">
                      <Input placeholder="..." v-model="fileArch.pageNo" class="fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="文件材料分类" prop="fileType">
                      <i-select placeholder="属性" class="fileWriteInput" v-model="fileArch.fileType">
                        <i-option :key="item" v-for="item in fileType" :value="item">{{item}}</i-option>
                      </i-select>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="日期" prop="fileDate">
                      <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="fileWriteInput" type="date"
                                  @on-change="fileArch.fileDate=$event" v-model="fileArch.fileDate"></DatePicker>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="8">
                    <FormItem class="FormItemClass" label="责任者">
                      <Input placeholder="..." v-model="fileArch.liableId" class="fileWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="16">
                    <FormItem class="FormItemClass" label="备注">
                      <Input placeholder="..." v-model="fileArch.remark" style="width: 100%;float: right"
                             type='textarea'/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span="1" offset="2">
          <Button @click="reset" style="align-content: center">重置</Button>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import {isInteger, notNull, isNum} from '../../js/validate'
  import {CommonFunction, ArchRequestConfig} from "../../js/global";

  export default {
    name: "FileInfo",
    data() {
      return {
        labelWidth: 100,
        loading: true,
        tableHeight: '500px',
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
            key: 'fileIndex'
          },
          {
            title: '文件编号',
            key: 'fileNo'
          },
          {
            title: '文件题名',
            width: 300,
            render: (h, params) => {
              return h('Tooltip', {
                props: {
                  'content': params.row.fileTitle,
                  'max-width': 300
                }
              }, params.row.fileTitle.length > 23?params.row.fileTitle.substring(0,23)+'...':params.row.fileTitle)
            }
          },
          {
            title: '页号',
            width: 80,
            key: 'pageNo'
          },
          {
            title: '文件材料分类',
            key: 'fileType'
          },
          {
            title: '责任者',
            key: 'liableId'
          },
          {
            title: '日期',
            key: 'fileDate',
            render: (h, params) => {
              let datadate = CommonFunction.dateFormate(new Date(params.row.fileDate))
              return h('div', datadate)
            }
          }
        ],
        //表格文件级显示数据
        tableData: [],
        //临时装表格选中的数据
        tempData: [],
        //新增时文件级序号
        addFileIndex: 1,
        //修改时新增的数据
        UpdateAddData: [],
        //修改时要删除真实存在的数据
        UpdateDeleteData: [],
        fileType: ['申请材料', '办案过程材料', '结论性文件', '其他材料', '档案变更材料'],
        operation: this.$route.params.operation, //false为修改
        archId: this.$route.params.archId,
        archNo: this.$route.params.archNo,
        classId: this.$route.params.archTypeID,
        rules: {
          fileIndex: [
            {validator: isInteger, trigger: 'blur'}
          ],
          fileNo: [
            {validator: notNull, trigger: 'blur'}
          ],
          fileTitle: [
            {validator: notNull, trigger: 'blur'}
          ],
          pageNo: [
            {validator: isNum, trigger: 'blur'}
          ],
          fileType: [
            {validator: notNull, trigger: 'blur'}
          ],
          fileDate: [
            {validator: notNull, trigger: 'change'}
          ]
        },
        fileArch: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
          archNo: this.$route.params.archNo,
          fileIndex: '',
          fileNo: '',
          liableId: '',
          fileTitle: '',
          fileType: '',
          fileDate: '',
          pageNo: '',
          remark: '',
          classId: this.$route.params.archTypeID
        },
        AddModal: false,
        UpdateModal: false
      }
    },
    methods: {
      //修改时加载文件级信息
      loadFileArch() {
        this.axios.get('/api/loadArch/getArchInfo', {params: {archId: this.archId, ArchInfo: 'FileInfo'}}).then(
          res => {
            this.tableData = res.data.data;
            this.addFileIndex = this.tableData.length + 1;
          }
        )
      },
      //点击添加弹窗的添加按钮
      saveArchData() {
        let temp = {
          id: null,
          archId: this.archId, // 读取出来
          archNo: this.archNo,
          fileIndex: '',
          fileNo: '',
          liableId: '',
          fileTitle: '',
          fileType: '',
          fileDate: '',
          pageNo: '',
          remark: '',
          classId: this.classId
        };
        temp.fileIndex = this.fileArch.fileIndex;
        temp.fileNo = this.fileArch.fileNo;
        temp.liableId = this.fileArch.liableId;
        temp.fileTitle = this.fileArch.fileTitle;
        temp.fileType = this.fileArch.fileType;
        temp.fileDate = this.fileArch.fileDate;
        temp.pageNo = this.fileArch.pageNo;
        temp.remark = this.fileArch.remark;
        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.operation === false) { //判断是否在修改著录还是新建著录
              this.UpdateAddData.push(temp);
              this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig)
                .then(res => {
                  if(res.data.code === 0){
                    this.$Message.success('添加成功！');
                    this.loadFileArch();
                    this.addFileIndex +=1;
                  }else{
                    this.$Message.error('添加失败！');
                  }
                });
            }
            else {
              //添加一条文件级信息  --2019/01/14
              this.UpdateAddData.push(temp);
              this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig)
                .then(res => {
                  if(res.data.code === 0){
                    this.$Message.success('添加成功！');
                    this.loadFileArch();
                    this.addFileIndex +=1;
                  }else{
                    this.$Message.error('添加失败！');
                  }
                });
            }
            this.UpdateAddData = [];
            this.tempData = [];
            this.reset();
            this.AddModal = false;
          }
          else {
            this.$Message.error('著录信息有误！');
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 1000);
          }
        });
      },
      //点击总保存按钮
      saveArch() {
        this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig).then(res => {
          this.$Message.success('保存完毕');
          this.goBack()
        });
      },
      //点击弹窗的修改按钮
      updateArchData() {
        let temp = {
          id: '',
          archId: this.archId, // 读取出来
          archNo: this.archNo,
          fileIndex: '',
          fileNo: '',
          liableId: '',
          fileTitle: '',
          fileType: '',
          fileDate: '',
          pageNo: '',
          remark: '',
          classId: this.classId
        };
        temp.id = this.fileArch.id;
        temp.fileIndex = this.fileArch.fileIndex;
        temp.fileNo = this.fileArch.fileNo;
        temp.liableId = this.fileArch.liableId;
        temp.fileTitle = this.fileArch.fileTitle;
        temp.fileType = this.fileArch.fileType;
        temp.fileDate = this.fileArch.fileDate;
        temp.pageNo = this.fileArch.pageNo;
        temp.remark = this.fileArch.remark;
        let check = true;
        this.$refs.updateForm.validate((valid) => {
          if (valid) {
            for (let i = 0; i < this.UpdateAddData.length; i++) {
              if (this.UpdateAddData[i].fileNo === this.tempData[0].fileNo) {
                this.UpdateAddData.splice(i, 1);
                this.UpdateAddData.unshift(temp);
                for (let j = 0; j < this.tableData.length; j++) {  //2019/01/10更新，添加时，修改临时添加的数据后，不渲染表格数据问题
                  if (this.tableData[j].fileNo === this.tempData[0].fileNo) {
                    this.tableData.splice(j, 1);
                    this.tableData.unshift(temp);
                  }
                }
                check = false;
                this.reset();
                break;
              }
            }
            if (check === true) {
              let data = [];
              data.push(temp);
              this.axios.post('/api/fileInfo/update', JSON.stringify(data), ArchRequestConfig).then(res => {
                  this.axios.get('/api/loadArch/getArchInfo', {params: {archId: this.archId, ArchInfo: 'FileInfo'}})
                    .then(res => {
                      this.tableData = res.data.data;
                      //更新后，删掉‘准备删除’的数据
                      let index = [];
                      for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                        for (let j = 0; j < this.tableData.length; j++) {
                          if (this.UpdateDeleteData[i].fileNo === this.tableData[j].fileNo) {
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
                  this.fileArch.id = null;
                  this.reset();
                  this.tempData = []
                }
              );
            }
            this.UpdateModal = false
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
      //总更新按钮
      updateArch() {
        this.axios.all([
            this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
            this.axios.post('/api/fileInfo/delete', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)
          ]
        ).then(res => {
          this.UpdateAddData = [];
          this.UpdateDeleteData = [];
          this.loadFileArch()
        });
      },
      //点击显示添加弹窗
      saveFileInfo() {
        //判断是否是勾选添加，简单点说明就是从中间插入
        if(Object.keys(this.tempData).length > 1){
          this.$Message.error('请勾选一条以下的数据！')
        }else if(Object.keys(this.tempData).length === 1){
          this.fileArch.fileIndex = this.tempData[0].fileIndex + 1;
          this.AddModal = true;
        }else{
          this.fileArch.fileIndex = this.addFileIndex;
          this.AddModal = true;
        }
      },
      //点击显示修改弹窗
      updateFileInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          this.$Message.info('请钩选要修改的文件信息')
        } else if (Object.keys(this.tempData).length > 1) {
          this.$Message.info('请钩选一条要修改的文件信息')
        } else {
          this.UpdateModal = true;
          this.fileArch.id = this.tempData[0].id;
          this.fileArch.archId = this.archId;
          this.fileArch.archNo = this.archNo;
          this.fileArch.fileIndex = this.tempData[0].fileIndex;
          this.fileArch.fileNo = this.tempData[0].fileNo;
          this.fileArch.liableId = this.tempData[0].liableId;
          this.fileArch.fileTitle = this.tempData[0].fileTitle;
          this.fileArch.fileType = this.tempData[0].fileType;
          this.fileArch.fileDate = this.tempData[0].fileDate;
          this.fileArch.pageNo = this.tempData[0].pageNo;
          this.fileArch.remark = this.tempData[0].remark;
          this.fileArch.classId = this.classId;
        }
      },
      //添加弹窗取消按钮
      cancleAdd() {
        this.$refs.addForm.resetFields();
        this.reset();
        this.AddModal = false
      },
      //删除所选文件记录数（只能删除一条  --2019/01/14）
      cancelFileInfo() {
        if (Object.keys(this.tempData).length === 0) {
          this.$Message.info('请钩选要删除的文件')
        } else if(Object.keys(this.tempData).length > 1){
          this.$Message.info('请钩选一条要删除的文件')
        } else {
          this.axios.post('/api/fileInfo/delete', JSON.stringify(this.tempData), ArchRequestConfig)
            .then(res => {
              if(res.data.code === 0){
                this.$Message.success('删除成功！');
                this.loadFileArch();
              }else{
                this.$Message.error('删除失败！');
              }
            });
          this.tempData = []
        }
      },
      //删除全部文件级信息(--2019/01/14)
      allDeleteFileInfo(){
        this.axios.post('/api/fileInfo/delete', JSON.stringify(this.tableData), ArchRequestConfig)
          .then(res => {
            if(res.data.code === 0){
              this.$Message.success('删除成功！');
              this.loadFileArch();
            }else{
              this.$Message.success('删除失败！')
            }
          })
      },
      // 双击显示修改弹窗
      updateRowData(row, index) {
        this.UpdateModal = true;
        this.fileArch.id = row.id;
        this.fileArch.archId = this.archId;
        this.fileArch.archNo = this.archNo;
        this.fileArch.classId = this.classId;
        this.fileArch.fileIndex = row.fileIndex;
        this.fileArch.fileNo = row.fileNo;
        this.fileArch.liableId = row.liableId;
        this.fileArch.fileTitle = row.fileTitle;
        this.fileArch.fileType = row.fileType;
        alert('row.fileDate---' + row.fileDate);
        this.fileArch.fileDate = row.fileDate;
        this.fileArch.pageNo = row.pageNo;
        this.fileArch.remark = row.remark;
        let temp = {
          id: '',
          archId: this.archId, // 读取出来
          archNo: this.archNo,
          fileIndex: '',
          fileNo: '',
          liableId: '',
          fileTitle: '',
          fileType: '',
          fileDate: '',
          pageNo: '',
          remark: '',
          classId: this.classId
        };
        temp.id = row.id;
        temp.fileIndex = this.fileArch.fileIndex;
        temp.fileNo = this.fileArch.fileNo;
        temp.liableId = this.fileArch.liableId;
        temp.fileTitle = this.fileArch.fileTitle;
        temp.fileType = this.fileArch.fileType;
        temp.fileDate = this.fileArch.fileDate;
        temp.pageNo = this.fileArch.pageNo;
        temp.remark = this.fileArch.remark;
        this.tempData.push(temp)
      },
      // 取消更新
      cancleUpdate() {
        this.$refs.updateForm.resetFields();
        this.tempData = []
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
          if (this.tempData[i].archId === row.archId) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
      //重置表格内容
      reset() {
        this.fileArch.fileIndex = '';
        this.fileArch.liableId = '';
        this.fileArch.fileNo = '';
        this.fileArch.fileTitle = '';
        this.fileArch.fileType = '';
        this.fileArch.fileDate = '';
        this.fileArch.pageNo = '';
        this.fileArch.remark = ''
      },
      //后退
      goBack() {
        this.$router.go(-1);
        this.$emit('changeShowView')
      }
    },
    mounted() {
      this.loadFileArch()
    }
  }
</script>

<style scoped>
  /*禁用的颜色高亮为黑色*/
  .colorBack /deep/ .ivu-input[disabled], fieldset[disabled] .ivu-input {
    color: black !important;
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
