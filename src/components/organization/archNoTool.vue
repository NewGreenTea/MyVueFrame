<template>
  <div style="overflow-scrolling: auto;font-size: 14px;">
    <!-- 档案档号搜索条件 -->
    <Row>
      <Col span="20" offset="1">
        <Row>
          <Col span="2" class="archToolCss">
            <p>档案类型：</p>
          </Col>
          <Col span="3">
            <Select @on-change="oneSelect" clearable :clearable="clearTwoClass" ref="OneCalssSelect">
              <Option :key="item.id" v-for="item in archOneType" :value="JSON.stringify(item)">{{item.className}}
              </Option>
            </Select>
          </Col>
          <Col span="6">
            <Select @on-change="twoSelect" placeholder="请选择具体档案类型" :clearable="clearTwoClass" ref="TwoCalssSelect">
              <Option :key="item.id" v-for="item in archTwoType" :value="JSON.stringify(item)">{{item.className}}
              </Option>
            </Select>
          </Col>
          <Col span="2" class="archToolCss">
            <p>年份：</p>
          </Col>
          <Col span="3">
            <DatePicker type="year" placeholder="选择年份" v-model="yearKey" :value="yearKey" @on-change="yearKey=$event"></DatePicker>
          </Col>
          <Col span="2">
            <Button type="primary" @click="searchArchNo" style="margin-left: 20px">搜索</Button>
          </Col>
        </Row>
      </Col>
    </Row>

    <!-- 档案档号设置表格数据视图 -->
    <Row style="margin-top: 30px">
      <Col span="20" offset="1">
        <Row>
          <Col>
            <Button @click="deleteArchNO" class="profButtonFloat">删除</Button>
            <Button @click="updateArchNO" class="profButtonFloat">修改</Button>
            <Button @click="addArchNO" class="profButtonFloat">添加</Button>
            <Button @click="allArchNO" class="profButtonFloat">所有数据</Button>
          </Col>
        </Row>
        <Row>
          <Col class="TableFontCss">
            <Table ref="table" border :columns="columns" :data="ArchNoData" v-if="ArchNoData != null"
                   @on-select-all="selectAllData" @on-select="selectData" @on-row-dblclick="updateRowData"
                   @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
            <Page :current="currentPage" :total="archDataCount" :page-size="pageSize" show-elevator show-total
                  show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="pso" placement="top"/>
            <Spin fix v-if="spinShow">
              <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
              <div>加载中</div>
            </Spin>
          </Col>
        </Row>
      </Col>
    </Row>

    <!-- 添加或修改档案档号设置视图 -->
    <Modal v-model="addModal" title="添加档号设置" :loading="loading" draggable :mask-closable="false" width="800"
           @on-ok="saveArchNo" @on-cancel="cancleAdd">
      <Row>
        <Col>
          <Row class="archToolTableCss">
            <Col span="12">
              <p>档案类型</p>
            </Col>
            <Col span="6">
              <p>年份</p>
            </Col>
            <Col span="6">
              <p>开始流水号</p>
            </Col>
          </Row>
        </Col>
        <Col>
          <Form ref="addForm" :rules="rules" :model="serialnumInfo" class="archToolTableCss">
            <Row :gutter="16">
              <Col span="12">
                <FormItem class="ToolToolFormItemClass">
                  <Row>
                    <Col span="8">
                      <Select @on-change="addOneSelect" clearable ref="addOneCalssSelect">
                        <Option :key="item.id" v-for="item in archOneType" :value="JSON.stringify(item)">
                          {{item.className}}
                        </Option>
                      </Select>
                    </Col>
                    <Col span="16">
                      <Select @on-change="addTwoSelect" placeholder="请选择具体档案类型" :clearable="clearTwoClass"
                              ref="addTwoCalssSelect">
                        <Option :key="item.id" v-for="item in addArchTwoType" :value="JSON.stringify(item)">
                          {{item.className}}
                        </Option>
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem prop="archYear" class="ToolFormItemClass">
                  <Input type="text" v-model="serialnumInfo.archYear" placeholder="设置年份"/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem prop="startNum" class="ToolFormItemClass">
                  <Input type="text" v-model="serialnumInfo.startNum" placeholder="定义开始流水号"/>
                </FormItem>
              </Col>
              <!-- 隐藏（暂时没有用） -->
              <FormItem prop="endNum" class="ToolFormItemClass" hidden>
                <Input type="text" v-model="serialnumInfo.endNum" placeholder="定义结束流水号"/>
              </FormItem>
              <!-- 隐藏（暂时没有用） -->
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>

    <Modal v-model="updateModal" title="修改档号设置" :loading="loading" draggable :mask-closable="false" width="800"
           @on-ok="updateArchNo" @on-cancel="cancleUpdate" >
      <Row>
        <Col>
          <Row class="archToolTableCss">
            <Col span="12" >
              <p>档案类型</p>
            </Col>
            <Col span="6">
              <p>年份</p>
            </Col>
            <Col span="6">
              <p>开始流水号</p>
            </Col>
          </Row>
        </Col>
        <Col>
          <Form ref="updateForm" :rules="rules" :model="serialnumInfo">
            <Row :gutter="16">
              <Col span="12">
                  <Row>
                    <Col span="8">
                      <FormItem class="ToolFormItemClass colorBack">
                        <Input type="text" v-model="updateOneTypeName" disabled/>
                      </FormItem>
                    </Col>
                    <Col span="16">
                      <FormItem class="ToolFormItemClass colorBack">
                        <Tooltip :content="serialnumInfo.className" max-width="200" style="width: 240px;">
                        <Input type="text" v-model="serialnumInfo.className" disabled/>
                        </Tooltip>
                      </FormItem>
                    </Col>
                  </Row>
              </Col>
              <Col span="6">
                <FormItem class="ToolFormItemClass colorBack">
                  <Input type="text" v-model="serialnumInfo.archYear" placeholder="设置年份" disabled/>
                </FormItem>
              </Col>
              <Col span="6">
                <FormItem prop="startNum" class="ToolFormItemClass">
                  <Input type="text" v-model="serialnumInfo.startNum" placeholder="定义开始流水号"/>
                </FormItem>
              </Col>
              <!-- 隐藏（暂时没有用） -->
              <FormItem prop="endNum" class="ToolFormItemClass" hidden>
                <Input type="text" v-model="serialnumInfo.endNum" placeholder="定义结束流水号"/>
              </FormItem>
              <!-- 隐藏（暂时没有用） -->
            </Row>
          </Form>
        </Col>
      </Row>
    </Modal>
  </div>
</template>

<script>
  import {isFourInteger, isFourIntegerNotMust} from "../../js/validate";
  import {ArchRequestConfig} from "../../js/global";

  export default {
    name: "archNoTool",
    data() {
      return {
        //档案类型
        archOneType: [],
        archTwoType: [],
        //与流水号关联的年份
        archNoYear: '',
        //档号流水号
        archNoNum: '',
        //设置档号流水号表格配置
        ArchNoData: [],
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
            title: '档案类型',
            key: 'className'
          },
          {
            title: '年份',
            key: 'archYear'
          },
          {
            title: '开始流水号',
            key: 'startNum'
          },
          // {
          //   title: '结束流水号',
          //   key: 'endNum'
          // }
        ],
        //流水号结构体
        serialnumInfo: {
          id: null,
          classId: '',
          className: '',
          parentId: '',
          archYear: '',
          startNum: '',
          endNum: null
        },
        rules: {
          archYear: [
            {validator: isFourInteger, trigger: 'blur'}
          ],
          startNum: [
            {validator: isFourInteger, trigger: 'blur'}
          ],
          endNum: [
            {validator: isFourIntegerNotMust, trigger: 'blur'}
          ]
        },
        //查询条件
        //查询条件：一级类型id
        oneID: '',
        //查询条件：二级类型id
        twoID: '',
        //查询条件：日期
        yearKey: '',
        //是否清空二级类型下拉框的选项值
        clearTwoClass: true,
        //档号设置表格数据选择存储变量
        tempData: [],
        //分页信息
        currentPage: 1,
        archDataCount: 0,
        pageSize: 10,
        pso: [5, 10, 15, 20,50,100],
        //添加或修改档号弹窗控制参数
        addModal: false,
        updateModal: false,
        loading: true,
        //添加界面二级加载数据
        addArchTwoType: [],
        addArchTwodata: '',
        //请求参数
        reqParams:null,
        //加载动画
        spinShow: false,
        //修改界面的一级类型名
        updateOneTypeName: ''
      }
    },
    methods: {
      //加载条件查询的一级类型
      loadArchType() {
        this.axios.get('/api/loadArch/allOneClass').then(res => {
          this.archOneType = res.data.data;
        })
      },
      //当一级类型选中时
      oneSelect(value) {
        this.twoID = '';
        //清空下拉选项的选择值
        this.$refs.TwoCalssSelect.clearSingleSelect();
        this.oneID = this.stringToObject(value).id;
        // temp.parentId = this.stringToObject(value).id;
        //改变表格的数据
        // this.axios.get('/api/archTool/getByOneType', {params: temp}).then(res => {
        //   this.ArchNoData = res.data.data;
        // });
        this.axios.get('/api/loadArch/getAllTwoClass', {params: {'name': this.stringToObject(value).className}}).then(res => {
          this.archTwoType = res.data.data;
        })
      },
      //当二级类型选中时
      twoSelect(value) {
        //拿到二级类型的id
        this.twoID = this.stringToObject(value).id;
      },
      //显示添加新档号流水号操作界面
      addArchNO() {
        this.addModal = true;
      },
      //添加界面的一级类型选择框
      addOneSelect(value){
        //清空下拉选项的选择值
        this.$refs.addTwoCalssSelect.clearSingleSelect();
        //加载档案二级类型
        this.axios.get('/api/loadArch/getAllTwoClass', {params: {'name': this.stringToObject(value).className}}).then(res => {
          this.addArchTwoType = res.data.data;
        });
        this.serialnumInfo.parentId = this.stringToObject(value).id;
      },
      //添加界面的二级类型选择框
      addTwoSelect(value){
        this.addArchTwodata = this.stringToObject(value).id;
        this.serialnumInfo.classId = this.addArchTwodata;
        this.serialnumInfo.className = this.stringToObject(value).className;
      },
      //添加一条档号流水号数据
      saveArchNo(){
        if(this.addArchTwodata !== ''){
          this.$refs.addForm.validate((valid) => {
            if(valid){
              //符合添加要求
              this.axios.post('/api/archTool/add', JSON.stringify(this.serialnumInfo), ArchRequestConfig)
                .then(res =>{
                  if(res.data.code === 0){
                    if(res.data.msg === '添加成功！'){
                      this.$Message.success(res.data.msg);
                    }else{
                      this.$Notice.info({
                        title: '提示信息：',
                        desc: res.data.msg,
                        duration: 0
                      });
                    }
                  }else{
                    this.$Message.error(res.data.msg)
                  }
                  this.twoID = this.serialnumInfo.classId;
                  this.searchArchNo();
                });
              this.addModal = false;
            }else{
              setTimeout(() => {
                this.loading = false;
                this.$nextTick(() => {
                  this.loading = true;
                });
              }, 500);
            }
          })
        }else{
          this.$Message.error('未选择档案二级类型！');
          setTimeout(() => {
            this.loading = false;
            this.$nextTick(() => {
              this.loading = true;
            });
          }, 500);
        }
      },
      //取消添加档号流水号数据
      cancleAdd(){
        //重置表单数据
        this.$refs.addForm.resetFields();
        //清空添加界面一级下拉选项的选择值
        this.$refs.addOneCalssSelect.clearSingleSelect();
        this.reset();
      },
      //勾选修改
      updateArchNO(){
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          this.$Message.info('请钩选要修改的档号')
        } else if (Object.keys(this.tempData).length > 1) {
          this.$Message.info('请钩选一条要修改的档号')
        } else {
          this.updateModal = true;
          this.serialnumInfo.id = this.tempData[0].id;
          this.serialnumInfo.classId = this.tempData[0].classId;
          this.serialnumInfo.className = this.tempData[0].className;
          this.serialnumInfo.parentId = this.tempData[0].parentId;
          this.serialnumInfo.archYear = this.tempData[0].archYear;
          this.serialnumInfo.startNum = this.tempData[0].startNum;
          this.serialnumInfo.endNum = this.tempData[0].endNum;
          this.updateOneTypeName = this.oneTypeNameInUpdate(this.serialnumInfo.parentId);
        }
      },
      //双击表格行
      updateRowData(row, index){
        this.updateModal = true;
        this.serialnumInfo.id = row.id;
        this.serialnumInfo.classId = row.classId;
        this.serialnumInfo.className = row.className;
        this.serialnumInfo.parentId = row.parentId;
        this.serialnumInfo.archYear = row.archYear;
        this.serialnumInfo.startNum = row.startNum;
        this.serialnumInfo.endNum = row.endNum;
        this.updateOneTypeName = this.oneTypeNameInUpdate(this.serialnumInfo.parentId);
      },
      //修改档号设置数据
      updateArchNo(){
        this.$refs.addForm.validate((valid) => {
          if(valid){
            //符合添加要求
            this.axios.post('/api/archTool/update', JSON.stringify(this.serialnumInfo), ArchRequestConfig)
              .then(res => {
                if(res.data.code === 0){
                  this.$Message.success('修改成功！');
                }else{
                  this.$Message.error('修改失败！')
                }
                this.twoID = this.serialnumInfo.classId;
                this.searchArchNo();
                this.reset();
                this.updateModal = false
              })
          }else{
            setTimeout(() => {
              this.loading = false;
              this.$nextTick(() => {
                this.loading = true;
              });
            }, 500);
          }
        })
      },
      //取消修改
      cancleUpdate(){
        //重置表单数据
        this.$refs.addForm.resetFields();
        this.reset();
        this.tempData = [];
        this.$refs.table.selectAll(false)
      },
      //判断id是哪个一级
      oneTypeNameInUpdate(data){
        for(let i=0;i<this.archOneType.length;i++) {
          if (this.archOneType[i].id === data) {
            return this.archOneType[i].className
          }
        }
      },
      //所有档案档号设置数据
      allArchNO() {
        let param = new URLSearchParams();
        param.append('pageNum', this.currentPage);
        param.append('pageSize', this.pageSize);
        this.reqParams = param;
        this.spinShow = true;
        this.axios.post('/api/archTool/getByCondition',this.reqParams)
          .then(res => {
            this.ArchNoData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.$refs.OneCalssSelect.clearSingleSelect();
            this.yearKey = '';
            this.loadArchType();
            this.spinShow = false;
          })
      },
      //点击查询按钮
      searchArchNo() {
        //要么只有一级，要么只有二级类型，要么只有年份，要么只有二级和年份（一级和年份）
        let param = new URLSearchParams();
        if (this.oneID !== '') {
          param.append('parentId', this.oneID);
        }
        if (this.twoID !== '') {
          param.append('classId', this.twoID);
        }
        if (this.yearKey !== '') {
          param.append('archYear', this.yearKey);
        }
        param.append('pageNum', this.currentPage);
        param.append('pageSize', this.pageSize);
        this.reqParams = param;
        this.spinShow = true;
        //改变表格的数据
        this.axios.post('/api/archTool/getByCondition', this.reqParams)
          .then(res => {
            this.ArchNoData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.$refs.OneCalssSelect.clearSingleSelect();
            this.yearKey = '';
            this.loadArchType();
            this.spinShow = false;
            this.reset()
          });
      },
      //删除新档号流水号
      deleteArchNO() {
        if (this.tempData.length === 0) {
          this.$Message.info('请选择要删除的档号设置')
        } else {
          this.axios.post('/api/archTool/delete', JSON.stringify(this.tempData), ArchRequestConfig).then(res => {
            if (res.data.code === 0) {
              this.$Message.success('删除成功！');
              this.allArchNO();
            } else {
              this.$Message.error('删除失败！');
            }
          })
        }
      },
      //把json字符串转成对象
      stringToObject(str) {
        return JSON.parse(str);
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
          if (this.tempData[i].id === row.id) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
      destPage(index) {
        this.currentPage = index;
        this.reqParams.set('pageNum',index);
        this.spinShow = true;
        this.axios.post('/api/archTool/getByCondition',this.reqParams)
          .then(res => {
            this.ArchNoData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          })
      },
      changePageSize(index) {
        this.pageSize = index;
        this.reqParams.set('pageSize', index);
        this.spinShow = true;
        this.axios.post('/api/archTool/getByCondition',this.reqParams)
          .then(res => {
            this.ArchNoData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          })
      },
      //表单重置
      reset(){
        this.serialnumInfo.id = null;
        this.serialnumInfo.classId = '';
        this.serialnumInfo.className = '';
        this.serialnumInfo.parentId = '';
        this.serialnumInfo.archYear = '';
        this.serialnumInfo.startNum = '';
        this.serialnumInfo.endNum = null;
      }
    },
    mounted() {
      this.loadArchType();
    }
  }
</script>

<style scoped>
</style>
