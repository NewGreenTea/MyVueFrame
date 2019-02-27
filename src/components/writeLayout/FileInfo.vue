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
            <Table border :columns="columns" :data="tableData" :height="tableHeight" ref="fileTable"
                   @on-row-dblclick="updateRowData"
                   @on-select-all="selectAllData" @on-select="selectData"
                   @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
            <Spin fix v-if="spinShow">
              <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
              <div>加载中</div>
            </Spin>
          </Col>
        </Row>
      </Col>
    </Row>

    <Row style="margin-top: 30px" :gutter="16">
      <Col span="4" offset="10">
        <div>
        <Button type="success" v-if="archCommit" @click="commitArch">确认</Button>
        <Button v-if="operation" type="primary" @click="saveArch">保存</Button>
        <Button v-if="!operation" type="primary" @click="updateArch">修改</Button>
        <Button @click="jumpPage">返回</Button>
        </div>
      </Col>
    </Row>

    <Modal v-model="showModal" title="确认信息" @on-ok="tips(3)">
      <div>
        档案的基本信息，专业信息，文件信息都已著录完，是否完成这份档案?
      </div>
    </Modal>

    <Modal width="900px" v-model="AddModal" :loading="loading" :mask-closable="false" title="添加文件信息">
      <Row>
        <Col span="20" offset="2">
          <Form class="formClass" :model="fileArch" :rules="rules" ref="addForm" :label-width="labelWidth">
            <Row :gutter="16">
              <Col>
                <Row :gutter="16">
                  <Col span="11">
                    <FormItem class="FormItemClass" label="档号">
                      <Input placeholder="..." v-model="fileArch.archNo" class="colorBack" disabled/>
                    </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                    <FormItem class="FormItemClass" label="序号" prop="fileIndex">
                      <Input placeholder="..." v-model="fileArch.fileIndex" class="colorBack"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件编号">
                  <Input placeholder="..." v-model="fileArch.fileNo" class="colorBack"/>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="责任者">
                  <AutoComplete placeholder="..." v-model="fileArch.liableId" :data="liableIdMemory"
                                :filter-method="filterMethod"></AutoComplete>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件题名" prop="fileTitle">
                  <AutoComplete placeholder="..." v-model="fileArch.fileTitle" :data="titleMemory"
                                :filter-method="filterMethod"></AutoComplete>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass selectFontCss" label="文件材料分类" prop="fileType">
                  <Select placeholder="属性" v-model="fileArch.fileType" filterable>
                    <Option :key="item.name" v-for="item in fileType" :value="item.name">{{item.value}}</Option>
                  </Select>
                </FormItem>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="11">
                    <FormItem class="FormItemClass" label="日期">
                      <DatePicker placeholder="Select date" format="yyyy-MM-dd" type="date"
                                  @on-change="fileArch.fileDate=$event" v-model="fileArch.fileDate"></DatePicker>
                    </FormItem>
                  </Col>

                  <Col span="11" offset="2">
                    <FormItem class="FormItemClass" label="页号" prop="pageNo">
                      <Input placeholder="..." v-model="fileArch.pageNo"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="备注">
                  <Input placeholder="..." v-model="fileArch.remark" type='textarea'/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <div slot="footer">
        <Button @click="cancleAdd">取消</Button>
        <Button type="success"  @click="saveArchData">添加</Button>
      </div>
    </Modal>

    <Modal width="900px" v-model="UpdateModal" :loading="loading" :mask-closable="false" title="修改文件信息">
      <Row>
        <Col span="20" offset="2">
          <Form class="formClass" :model="fileArch" :rules="rules" ref="updateForm" :label-width="labelWidth">
            <Row :gutter="16">
              <Col>
                <Row :gutter="16">
                  <Col span="11">
                    <FormItem class="FormItemClass" label="档号">
                      <Input placeholder="..." v-model="fileArch.archNo" class="colorBack" disabled/>
                    </FormItem>
                  </Col>
                  <Col span="11" offset="2">
                    <FormItem class="FormItemClass" label="序号" prop="fileIndex">
                      <Input placeholder="..." v-model="fileArch.fileIndex" class="colorBack"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件编号">
                  <Input placeholder="..." v-model="fileArch.fileNo" class="colorBack"/>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="责任者">
                  <AutoComplete placeholder="..." v-model="fileArch.liableId" :data="liableIdMemory"
                                :filter-method="filterMethod"></AutoComplete>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="文件题名" prop="fileTitle">
                  <AutoComplete placeholder="..." v-model="fileArch.fileTitle" :data="titleMemory"
                                :filter-method="filterMethod"></AutoComplete>
                </FormItem>
              </Col>

              <Col>
                <FormItem class="FormItemClass selectFontCss" label="文件材料分类" prop="fileType">
                  <i-select placeholder="属性" v-model="fileArch.fileType">
                    <i-option :key="item.name" v-for="item in fileType" :value="item.name">{{item.value}}</i-option>
                  </i-select>
                </FormItem>
              </Col>

              <Col>
                <Row :gutter="16">
                  <Col span="11">
                    <FormItem class="FormItemClass" label="日期">
                      <DatePicker placeholder="Select date" format="yyyy-MM-dd" type="date"
                                  @on-change="fileArch.fileDate=$event" v-model="fileArch.fileDate"></DatePicker>
                    </FormItem>
                  </Col>

                  <Col span="11" offset="2">
                    <FormItem class="FormItemClass" label="页号" prop="pageNo">
                      <Input placeholder="..." v-model="fileArch.pageNo"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>

              <Col>
                <FormItem class="FormItemClass" label="备注">
                  <Input placeholder="..." v-model="fileArch.remark" type='textarea'/>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span="2" offset="10">
          <Button @click="frontResult" style="align-content: center">上一条</Button>
        </Col>
        <Col span="2">
          <Button @click="nextResult" style="align-content: center">下一条</Button>
        </Col>
      </Row>
      <div slot="footer">
        <Button @click="cancleUpdate">取消</Button>
        <Button type="primary"  @click="updateArchData">修改</Button>
      </div>
    </Modal>

    <Modal v-model="showModal3" title="跳转信息" @on-ok="jump">
      <div>
        页面即将跳转，检查是否点击保存或修改档案信息？
      </div>
    </Modal>
  </div>
</template>

<script>
  import {isInteger, notNull, isNum} from '../../js/validate'
  import {CommonFunction, ArchRequestConfig,archNoType} from "../../js/global";

  export default {
    name: "FileInfo",
    props: ['FileParams'],
    data() {
      return {
        showModal: false,
        showModal3: false,
        archCommit: false,
        labelWidth: 100,
        loading: true,
        tableHeight: '500',
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
              }, params.row.fileTitle.length > 23 ? params.row.fileTitle.substring(0, 23) + '...' : params.row.fileTitle)
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
              let datadate = CommonFunction.dateFormate(new Date(params.row.fileDate));
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
        fileType: [
          { name: '申请材料',
            value:'01-申请材料'
          },
          { name: '办案过程材料',
            value:'02-办案过程材料'
          },
          {
            name: '结论性文件',
            value: '03-结论性文件'
          },
          {
            name: '其他材料',
            value: '04-其他材料'
          },
          {
            name: '档案变更材料',
            value: '05-档案变更材料'
          }
        ],
        operation: this.FileParams.operation, //false为修改
        archId: this.FileParams.archId,
        archNo: this.FileParams.archNo,
        classId: this.FileParams.archTypeID,
        rules: {
          fileIndex: [
            {validator: isInteger, trigger: 'blur'}
          ],
          fileNo: [
            {validator: notNull, trigger: 'blur'}
          ],
          fileTitle: [
            {validator: notNull, trigger: ['change','blur']}
          ],
          pageNo: [
            {validator: isNum, trigger: 'blur'}
          ],
          fileType: [
            {validator: notNull, trigger: ['change','blur']}
          ]
        },
        fileArch: {
          id: null,
          archId: this.FileParams.archId, // 读取出来
          archNo: this.FileParams.archNo,
          fileIndex: '',
          fileNo: '',
          liableId: '',
          fileTitle: '',
          fileType: '',
          fileDate: '',
          pageNo: '',
          remark: '',
          classId: this.FileParams.archTypeID
        },
        AddModal: false,
        UpdateModal: false,
        //加载条动画
        spinShow: false,
        //记忆著录数据
        liableIdMemory: [],
        titleMemory: []
      }
    },
    methods: {
      //修改时加载文件级信息
      loadFileArch() {
        this.spinShow = true;
        this.axios.get('/api/loadArch/getArchInfo', {
          params: {archId: this.archId, ArchInfo: 'FileInfo'}
        }).then(res => {
          this.tableData = res.data.data;
          this.addFileIndex = this.tableData.length + 1;
          this.spinShow = false;
        });
        //请求记忆数据
        this.axios.all([this.loadFileMemory('Liable'), this.loadFileMemory('Title')]).then(this.axios.spread((res1, res2) => {
          //错误提示
        }));
        if(this.FileParams.archCommit === true){
          this.archCommit = true
        }
      },
      //加载文件信息记忆数据
      loadFileMemory(type) {
        this.axios.get('/api/archMemory/loadMemory', {params: {type: type}}).then(res => {
          if (type === 'Liable') {
            this.liableIdMemory = res.data.data
          } else if (type === 'Title') {
            this.titleMemory = res.data.data
          }
        })
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

        let addFileLiableId = false;
        let addFileTitle = false;
        //判断填写的文件信息责任者或文件题名是否存在
        if (this.liableIdMemory.indexOf(temp.liableId) === -1) {
          addFileLiableId = true;
        }
        if (this.titleMemory.indexOf(temp.fileTitle) === -1) {
          addFileTitle = true;
        }

        this.$refs.addForm.validate((valid) => {
          if (valid) {
            if (this.operation === false) { //判断是否在修改著录还是新建著录
              this.UpdateAddData.push(temp);
              this.spinShow = true;
              this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig)
                .then(res => {
                  if (res.data.code === 0) {
                    this.$Message.success('添加成功！');

                    //添加记忆数据
                    if (addFileLiableId === true) {
                      this.axios.post('/api/archMemory/addMemory', this.qs.stringify({
                        type: 'Liable',
                        data: temp.liableId
                      })).then(res => {
                        this.loadFileMemory('Liable')
                      })
                    }
                    if (addFileTitle === true) {
                      this.axios.post('/api/archMemory/addMemory', this.qs.stringify({
                        type: 'Title',
                        data: temp.fileTitle
                      })).then(res => {
                        this.loadFileMemory('Title')
                      })
                    }

                    this.$refs.addForm.resetFields();
                    this.loadFileArch();
                    this.addFileIndex += 1;
                    this.saveFileInfo();
                  } else {
                    this.$Message.error('添加失败！');
                  }
                  this.spinShow = false;
                });
            }
            else {
              //添加一条文件级信息  --2019/01/14
              this.UpdateAddData.push(temp);
              this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig)
                .then(res => {
                  if (res.data.code === 0) {
                    this.$Message.success('添加成功！');

                    //添加记忆数据
                    if (addFileLiableId === true) {
                      this.axios.post('/api/archMemory/addMemory', this.qs.stringify({
                        type: 'Liable',
                        data: temp.liableId
                      })).then(res => {
                        this.loadFileMemory('Liable')
                      })
                    }
                    if (addFileTitle === true) {
                      this.axios.post('/api/archMemory/addMemory', this.qs.stringify({
                        type: 'Title',
                        data: temp.fileTitle
                      })).then(res => {
                        this.loadFileMemory('Title')
                      })
                    }

                    this.$refs.addForm.resetFields();
                    this.loadFileArch();
                    this.addFileIndex += 1;
                    this.saveFileInfo();
                  } else {
                    this.$Message.error('添加失败！');
                  }
                  this.spinShow = false;
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
          this.operation = false;
          this.checkComplete(this.FileParams.archId)
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
              this.spinShow = true;
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
                      this.spinShow = false;
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
        this.spinShow = true;
        this.axios.all([
            this.axios.post('/api/fileInfo/add', JSON.stringify(this.UpdateAddData), ArchRequestConfig),
            this.axios.post('/api/fileInfo/delete', JSON.stringify(this.UpdateDeleteData), ArchRequestConfig)
          ]
        ).then(res => {
          this.UpdateAddData = [];
          this.UpdateDeleteData = [];
          this.loadFileArch();
          this.spinShow = false;
          this.$Message.info('修改完成!');
          this.checkComplete(this.FileParams.archId)
        });
      },
      //点击显示添加弹窗
      saveFileInfo() {
        this.$refs.addForm.resetFields();
        //判断是否是勾选添加，简单点说明就是从中间插入
        if (Object.keys(this.tempData).length > 1) {
          this.$Message.error('请勾选一条以下的数据！')
        } else if (Object.keys(this.tempData).length === 1) {
          this.fileArch.fileIndex = this.tempData[0].fileIndex + 1;
          this.AddModal = true;
        } else {
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
          this.$refs.updateForm.resetFields();
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
        this.AddModal = false;
        this.$refs.fileTable.selectAll(false);
        this.AddModal = false;
      },
      //删除所选文件记录数（只能删除一条  --2019/01/14）
      cancelFileInfo() {
        if (Object.keys(this.tempData).length === 0) {
          this.$Message.info('请钩选要删除的文件')
        } else if (Object.keys(this.tempData).length > 1) {
          this.$Message.info('请钩选一条要删除的文件')
        } else {
          this.spinShow = true;
          this.axios.post('/api/fileInfo/delete', JSON.stringify(this.tempData), ArchRequestConfig)
            .then(res => {
              if (res.data.code === 0) {
                this.$Message.success('删除成功！');
                this.loadFileArch();
              } else {
                this.$Message.error('删除失败！');
              }
              this.spinShow = false;
            });
          this.tempData = []
        }
      },
      //删除全部文件级信息(--2019/01/14)
      allDeleteFileInfo() {
        this.spinShow = true;
        this.axios.post('/api/fileInfo/delete', JSON.stringify(this.tableData), ArchRequestConfig)
          .then(res => {
            if (res.data.code === 0) {
              this.$Message.success('删除成功！');
              this.loadFileArch();
            } else {
              this.$Message.success('删除失败！')
            }
            this.spinShow = false;
          })
      },
      // 双击显示修改弹窗
      updateRowData(row, index) {
        this.$refs.updateForm.resetFields();
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
        this.$refs.addForm.resetFields();
        this.reset();
        this.tempData = [];
        this.$refs.fileTable.selectAll(false);
        this.UpdateModal = false;
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
      //记忆著录数据过滤方法
      filterMethod(value, option) {
        return option.toUpperCase().indexOf(value.toUpperCase()) !== -1;
      },
      //重置表格内容
      reset() {
        this.fileArch.liableId = '';
        this.fileArch.fileNo = '';
        this.fileArch.fileTitle = '';
        this.fileArch.fileType = '';
        this.fileArch.fileDate = '';
        this.fileArch.pageNo = '';
        this.fileArch.remark = ''
      },
      //跳转确认提示
      jumpPage(){
        this.showModal3=true;
      },
      //跳转其他档案信息界面
      jump(){
        this.goBack()
      },
      //后退
      goBack() {
        this.axios.get('/api/baseInfo/existBaseInfo', {params: {archId: this.archId}})
          .then(res => {
            let temp;
            if (res.data.data.length === 0) {
              temp=true;
            }else{
              temp=false;
            }
            this.axios.post('/api/loadArch/necessaryBaseInfo',this.qs.stringify({archID:this.archId})).then(res2 =>{
              let data = {
                archId: this.archId, //传递一些重要参数给下一个界面
                archNo: this.archNo,
                registerNo: res2.data.registerNo,
                dispatchDocNo: res2.data.dispatchDocNo,
                archTypeID: this.classId,
                archTypeName: archNoType.writeVueLayout2(this.archNo),
                archInputDate: res2.data.inputDate,
                title: res.data.data.title,
                operation: temp,
                archCommit: this.archCommit
              };
              this.$emit('toShowOther', 'BaseInfo', data)
            });
          })
      },
      //上一条记录
      frontResult() {
        if (this.UpdateModal === true) {
          let frontNum = this.fileArch.fileIndex;
          if (frontNum === 1) {
            this.$Message.info('已经是第一条数据！')
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if ((frontNum-1) === this.tableData[i].fileIndex) {
                this.fileArch.id = this.tableData[i].id;
                this.fileArch.archId = this.tableData[i].archId;
                this.fileArch.archNo = this.tableData[i].archNo;
                this.fileArch.fileIndex = this.tableData[i].fileIndex;
                this.fileArch.fileNo = this.tableData[i].fileNo;
                this.fileArch.liableId = this.tableData[i].liableId;
                this.fileArch.fileTitle = this.tableData[i].fileTitle;
                this.fileArch.fileType = this.tableData[i].fileType;
                this.fileArch.fileDate = this.tableData[i].fileDate;
                this.fileArch.pageNo = this.tableData[i].pageNo;
                this.fileArch.remark = this.tableData[i].remark;
                this.fileArch.classId = this.tableData[i].classId;
                break;
              }
            }
          }
        } else if (this.AddModal === true) {

        }
      },
      //下一条记录
      nextResult() {
        if (this.UpdateModal === true) {
          let frontNum = this.fileArch.fileIndex;
          if (frontNum === this.tableData.length) {
            this.$Message.info('已经是最后一条数据！')
          } else {
            for (let i = 0; i < this.tableData.length; i++) {
              if ((frontNum+1) === this.tableData[i].fileIndex) {
                this.fileArch.id = this.tableData[i].id;
                this.fileArch.archId = this.tableData[i].archId;
                this.fileArch.archNo = this.tableData[i].archNo;
                this.fileArch.fileIndex = this.tableData[i].fileIndex;
                this.fileArch.fileNo = this.tableData[i].fileNo;
                this.fileArch.liableId = this.tableData[i].liableId;
                this.fileArch.fileTitle = this.tableData[i].fileTitle;
                this.fileArch.fileType = this.tableData[i].fileType;
                this.fileArch.fileDate = this.tableData[i].fileDate;
                this.fileArch.pageNo = this.tableData[i].pageNo;
                this.fileArch.remark = this.tableData[i].remark;
                this.fileArch.classId = this.tableData[i].classId;
                break;
              }
            }
          }
        } else if (this.AddModal === true) {

        }
      },
      //确认档案完成信息
      tips(statue) {
        //检测基本信息的文件页数和文件级信息文件编号是否相等
        this.axios.post('/api/loadArch/checkArchFilePage', this.qs.stringify({archID: this.FileParams.archId})).then(res => {
          if (res.data.code === 1) {
            this.$Message.error(res.data.msg);
          } else {
            // 修改档案状态，变为已著录/待质检的状态
            this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({archID: this.FileParams.archId,twoStatue:statue})).then(res => {
              this.archCommit = false;
              this.$emit('changeShowView')
            })
          }
        })
      },
      //确认提示
      commitArch(){
        this.showModal = true;
      },
      //检测三大信息是否完成的方法
      checkComplete(id){
        //触发三大信息是否著录完，弹出提示
        this.axios.post('/api/loadArch/ArchIsComplete', this.qs.stringify({
          archID: id
        })).then(res => {
          if(res.data ===1){
            this.archCommit = true
          }
        });
      }
    },
    mounted() {
      this.loadFileArch();
    }
  }
</script>

<style scoped>
  /*著录错误的显示信息的位置*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 8px;
  }

  /*记忆信息数据显示样式*/
  .FormItemClass >>> .ivu-select-dropdown-list {
    max-height: 200px;
  }
</style>
