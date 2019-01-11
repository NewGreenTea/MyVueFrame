<template>
  <div>
    <!-- 任务界面 -->
    <Row style="margin-bottom: 20px">
      <Col span="4">
        <!-- 任务显示按钮 -->
        <Row>
          <Col offset="2">
            <Button @click="showBatchAssignment" style="width: 150px" :class="{'buttonSelect': butOnSelect.activeIndex === 1}">批次任务</Button>
          </Col>
          <Col offset="2">
            <Button @click="showHisAssignment" style="width: 150px" :class="{'buttonSelect': butOnSelect.activeIndex === 2}">历史批次任务</Button>
          </Col>
          <Col offset="2">
            <Button @click="showDistAssignment" style="width: 150px" :class="{'buttonSelect': butOnSelect.activeIndex === 3}">已分配任务</Button>
          </Col>
        </Row>
      </Col>

      <!-- 批次任务 -->
      <Col span="19" v-if="showATData">
        <Table border :columns="AssignmentColumn" :data="AssignmentData"></Table>
        <Page :current="assCurrentPage" :total="assDataCount" :page-size="assPageSize" show-elevator show-total
              show-sizer @on-change="destPage1" @on-page-size-change="changePageSize1" :page-size-opts="assPSO"/>
      </Col>
      <!-- 历史批次任务 -->
      <Col span="19" v-if="showHTData">
        <Table border :columns="AssignmentHisColumn" :data="AssignmentHisData"></Table>
        <Page :current="assCurrentPage" :total="assDataCount" :page-size="assPageSize" show-elevator show-total
              show-sizer @on-change="destPage1" @on-page-size-change="changePageSize1" :page-size-opts="assPSO"/>
      </Col>
      <!-- 已分配任务 -->
      <Col span="19" v-if="showDTData">
        <Table border :columns="AssignmentDisColumn" :data="AssignmentDisData"></Table>
        <Page :current="assCurrentPage" :total="assDataCount" :page-size="assPageSize" show-elevator show-total
              show-sizer @on-change="destPage1" @on-page-size-change="changePageSize1" :page-size-opts="assPSO"/>
      </Col>
      <!-- 查看已分配任务信息情况对话框 -->
      <Modal v-model="showModal" :title="distributeATitle" width="1000px">
        <div>
          <Table border :columns="showDAColumn" :data="showDAData"></Table>
        </div>
      </Modal>
    </Row>

    <!-- 分配界面：头部 -->
    <Row>
      <Col span="24">
        <hr>
        <div style="text-align:center">
          <h2>分配任务</h2>
        </div>
      </Col>
    </Row>
    <!-- 分配界面：主体 -->
    <Row>
      <!-- 分配界面：主体左边：选择工作组 -->
      <Col span="3" offset="1">
        <Row v-if="hackReset">
          <Col span="24" class="WriteLayoutFont">可用著录组：</Col>
          <Col span="24">
            <RadioGroup size="large" vertical @on-change="selectWG" ref="radio" v-if="WorkGroup.length">
              <Radio :label="writer.id" :value="writer.id" style="font-size: 20px" v-for="writer in WorkGroup"
                     :key="writer.id">{{writer.departName}}
              </Radio>
            </RadioGroup>
          </Col>
          <Col span="24">
            <Button @click="distributeAssignment">分配</Button>
          </Col>
        </Row>
      </Col>

      <!-- 分配界面：主体右边：分配操作面板 -->
      <Col span="19">
        <Row>
          <!-- 分配界面：主体右边：（上半部分）筛选条件 -->
          <Col>
            <Form ref="searchForm">
              <Row>
                <Col span="2">
                  <FormItem>
                    <Button type="success">筛选条件</Button>
                  </FormItem>
                </Col>
                <!-- 筛选条件：档案状态 -->
                <Col span="4">
                  <FormItem>
                    <Row>
                      <Col span="8" offset="4">
                        档案状态：
                      </Col>
                      <Col span="12">
                        <Select placeholder="状态" @on-change="choseTwoStatue" ref="ArchStatue" :clearable="InputClear">
                          <Option :key="item" v-for="item in twoStatues" :value="item">{{item}}</Option>
                        </Select>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <!-- 筛选条件：任务开始时间 -->
                <Col span="6">
                  <FormItem>
                    <Row>
                      <Col>
                        <Row>
                          <Col span="7" offset="2">
                            任务开始时间：
                          </Col>
                          <Col span="15">
                            <DatePicker type="daterange" placement="bottom-end" placeholder="Select date"
                                        format="yyyy-MM-dd"
                                        style="width: 200px" :value="keyDate" @on-change="keyDate=$event"></DatePicker>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <!-- 筛选条件：档号，档案类型或人名-->
                <Col span="5">
                  <FormItem>
                    <Row>
                      <Col span="5" offset="2">
                        关键字：
                      </Col>
                      <Col span="17">
                        <Input placeholder="档号" v-model="keyword" :clearable="InputClear"/>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <!-- 搜索按钮 -->
                <Col span="3">
                  <Row>
                    <Col span="2" offset="5">
                  <FormItem>
                    <Button type="primary" @click="searchNotDistri">搜索</Button>
                  </FormItem>
                    </Col>
                  </Row>
                </Col>
                <!-- 返回初始未分配档案数据按钮 -->
                <Col span="3">
                  <FormItem>
                    <Button type="primary" @click="returnAll(1)">所有未分配档案</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>

          <!-- 分配界面：主体右边：（下半部分）档案数据分配表格 -->
          <Col span="24" class="tableLoading">
            <Table ref="table" :height="tableHeight" border :columns="ArchTableColumn" :data="DistributeArchData"
                   v-if="DistributeArchData != null" @on-select-all="selectAllData" @on-select="selectRowData"
                   @on-select-cancel="cancelRowData" @on-select-all-cancel="cancelAllData"></Table>
            <Page :current="currentPage" :total="archDataCount" :page-size="pageSize" show-elevator show-total
                  show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="pso"/>
            <Spin fix v-if="spinShow">
              <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
              <div>加载中</div>
            </Spin>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "newDirector",
    data() {
      return {
        //批次任务表格格式
        AssignmentColumn: [
          {
            title: '序号',
            width: 60,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage- 1) * this.assPageSize + 1);
            }
          },
          {
            title: '任务id',
            key: 'batchId'
          },
          {
            title: '任务名',
            render: (h, params) => {
              return h('p', '分配档案')
            }
          },
          {
            title: '库房管理员',
            key: 'importerName'
          },
          {
            title: '开始时间',
            key: 'createdDate'
          },
          {
            title: '状态',
            key: 'statue',
            render: (h, params) => {
              let statue = assignmentStatue(params.row.statue);
              return h('p', statue)
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {type: 'primary', size: 'small'},
                  on: {
                    click: () => {
                      //请求批次任务先查询该批次是否分配完成
                      this.axios.post('/api/importArch/checkBatchAssignment', this.qs.stringify({batchID: params.row.batchId}))
                        .then(res => {
                          if (res.data.code === 0) {
                            this.$Message.info('此任务已经分配完成！')
                          }
                        });
                      //查看该批次的档案列表信息
                      this.pageUrl = '/api/importArch/archStatue';
                      this.currentPage = 1;
                      this.urlParams = {'batchID': params.row.batchId, 'pageNum': null, 'pageSize': this.pageSize};
                      this.axios.get(this.pageUrl, {params: this.urlParams})
                        .then(res => {
                          this.DistributeArchData = res.data.data.list;
                          this.archDataCount = res.data.data.total;
                          this.searchData=false;
                        })
                    }
                  }
                }, '分配')
              ])
            }
          }
        ],
        //历史批次任务表格格式
        AssignmentHisColumn: [
          {
            title: '序号',
            width: 60,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage- 1) * this.assPageSize + 1);
            }
          },
          {
            title: '任务id',
            key: 'batchId'
          },
          {
            title: '任务名',
            render: (h, params) => {
              return h('p', '分配档案')
            }
          },
          {
            title: '开始时间',
            key: 'createdDate'
          },
          {
            title: '结束时间',
            key: 'completeDate'
          },
          {
            title: '状态',
            key: 'statue',
            render: (h, params) => {
              let statue = assignmentStatue(params.row.statue);
              return h('p', statue)
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {type: 'primary', size: 'small'},
                    on: {
                      click: () => {
                        //查看该批次的档案列表信息
                        this.pageUrl = '/api/importArch/archStatue';
                        this.currentPage = 1;
                        this.urlParams = {'batchID': params.row.batchId, 'pageNum': null, 'pageSize': this.pageSize};
                        this.axios.get(this.pageUrl, {params: this.urlParams})
                          .then(res => {
                            this.DistributeArchData = res.data.data.list;
                            this.archDataCount = res.data.data.total;
                            this.searchData=false;
                          })
                      }
                    }
                  }, '查看')
              ])
            }
          }
        ],
        //分配任务表格格式
        AssignmentDisColumn: [
          {
            title: '序号',
            width: 60,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage- 1) * this.assPageSize + 1);
            }
          },
          {
            title: '任务id',
            key: 'assignmentId'
          },
          {
            title: '任务名',
            render: (h, params) => {
              return h('p', '著录档案')
            }
          },
          {
            title: '开始时间',
            key: 'startTime'
          },
          {
            title: '结束时间',
            key: 'endTime'
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {type: 'primary', size: 'small'},
                    on: {
                      click: () => {
                        this.distributeATitle = '任务名：' + params.row.assignmentId;
                        this.showModal = true;
                        this.axios.post('/api/importArch/detailDistAssignment', this.qs.stringify({assignmentID: params.row.assignmentId}))
                          .then(res => {
                            this.showDAData = res.data.data
                          })
                      }
                    }
                  }, '查看')
              ])
            }
          }
        ],
        //任务表格数据
        AssignmentData: [],
        //历史任务表格数据
        AssignmentHisData: [],
        //分配任务表格数据
        AssignmentDisData: [],
        //控制显示任务表格
        showATData: false,
        showHTData: false,
        showDTData: false,
        // 刷新著录组的状态
        hackReset: true,
        //分配档案的工作组
        WorkGroup: [],
        //档案分配表格格式
        ArchTableColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            key: '_checked'
          },
          {
            title: '序号',
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.currentPage- 1) * this.pageSize + 1);
            }
          },
          {
            title: '任务id',
            render: (h, params) => {
              return h('p', params.row.batchVO.batchId)
            }
          },
          {
            title: '档号', //档案id
            render: (h, params) => {
              return h('p', params.row.archVO.archNo)
            }
          },
          {
            title: '状态',
            render: (h, params) => {
              let twoStatue = statueTwoDes(params.row.archVO.twoStatue);
              return h('p', twoStatue)
            }
          },
          {
            title: '库房管理员',
            render: (h, params) => {
              return h('p', params.row.importerName)
            }
          },
          {
            title: '分配人',
            width: 110,
            render: (h, params) => {
              return h('p', params.row.distributor)
            }
          },
          {
            title: '负责组',
            width: 110,
            render: (h, params) => {
              return h('p', params.row.writeGroup)
            }
          },
          {
            title: '任务开始时间',
            render: (h, params) => {
              return h('p', params.row.batchVO.createdDate)
            }
          },
          {
            title: '分配时间',
            render: (h, params) => {
              let distributeTime;
              for (let i = 0; i < params.row.distributeVO.length; i++) {
                let id = params.row.distributeVO[i].archId;
                if (id === params.row.archVO.archId) {
                  distributeTime = params.row.distributeVO[i].distributeDate;
                  break;
                }
              }
              return h('p', distributeTime)
            }
          }
        ],
        //档案分配数据
        DistributeArchData: [],
        // 每页条数
        pageSize: 10,
        // 档案数据总条数
        archDataCount: 0,
        // 分页当前页
        currentPage: 1,
        // 选择档案每页显示条数
        pso: [10, 20, 30, 40, 50],
        // 档案二级状态
        twoStatues: [
          '待分配',
          '已分配（待著录）',
          '著录中',
          '已著录（待质检）',
          '质检中',
          '质检通过（待上传）',
          '质检不通过',
          '上传中',
          '已上传（组卷中）',
          '组卷完成'
        ],
        // 记录待分配的档案记录集合
        tempArchData: [],
        //默认表格高度
        tableHeight: 550,
        // 初始化分页的url
        pageUrl: '/api/importArch/archStatue',
        //url的参数配置
        urlParams: {},
        //分配时的保存选中的著录工作组ID
        taskWG: '',
        //分配时，保存的档案id组
        taskArchID: [],
        //控制显示已分配任务情况对话框
        showModal: false,
        //已分配任务情况对话框标题
        distributeATitle: '',
        //已分配任务详细情况表格格式
        showDAColumn: [
          {
            title: '序号',
            width: 60,
            type: 'index'
          },
          {
            title: '档号', //档案id
            render: (h, params) => {
              return h('p', params.row.archVO.archNo)
            }
          },
          {
            title: '状态',
            render: (h, params) => {
              let twoStatue = statueTwoDes(params.row.archVO.twoStatue);
              return h('p', twoStatue)
            }
          },
          {
            title: '库房管理员',
            render: (h, params) => {
              return h('p', params.row.importerName)
            }
          },
          {
            title: '分配人',
            render: (h, params) => {
              return h('p', params.row.distributor)
            }
          },
          {
            title: '负责组',
            render: (h, params) => {
              return h('p', params.row.writeGroup)
            }
          }
        ],
        //已分配任务详细情况数据
        showDAData: [],
        //任务分页参数配置
        assCurrentPage: 1,
        assDataCount: 0,
        assPageSize: 2,
        assPSO: [1, 2, 3, 5, 8, 10, 20],
        assPageUrl: '',
        assUrlParams: {},
        //***搜索条件***
        archStatues: '',
        keyword: '',
        keyDate: '',
        searchData: false,
        //vue 组件属性
        InputClear: true,
        //加载动画
        spinShow: false,
        //点击任务按钮变色
        butOnSelect: {
          activeIndex: 0
        }
      }
    },
    methods: {
      //加载著录工作组信息
      loadWorkGroup() {
        this.axios.post('/api/department/list/group/s').then(res => {
          this.WorkGroup = res.data.data
        })
      },
      //加载档案未分配数据
      loadDistributeArchData() {
        this.currentPage = 1;
        this.urlParams = {'assignmentStatue': 0, 'pageNum': null, 'pageSize': this.pageSize};
        this.spinShow = true;
        this.axios.get(this.pageUrl, {params: this.urlParams}).then(res => {
          this.DistributeArchData = res.data.data.list;
          this.archDataCount = res.data.data.total;
          this.spinShow = false;
        });

      },
      //加载档案批次任务
      showBatchAssignment() {
        if (this.showATData === true) {
          this.showATData = false;
          this.butOnSelect.activeIndex = 0;
        } else {
          this.showHTData = false;
          this.showDTData = false;
          this.showATData = true;
          this.butOnSelect.activeIndex = 1;
          this.assCurrentPage = 1;
          this.assPageUrl = '/api/importArch/checkAssignment';
          this.assUrlParams = {
            'batchStatue': 0,
            'pageNum': 1,
            'pageSize': this.assPageSize
          };
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total
          });
        }
      },
      //查询历史批次任务
      showHisAssignment() {
        if (this.showHTData === true) {
          this.showHTData = false;
          this.butOnSelect.activeIndex = 0;
        } else {
          this.showATData = false;
          this.showDTData = false;
          this.showHTData = true;
          this.butOnSelect.activeIndex = 2;
          this.assCurrentPage = 1;
          this.assPageUrl = '/api/importArch/checkAssignment';
          this.assUrlParams = {
            'batchStatue': 1,
            'pageNum': 1,
            'pageSize': this.assPageSize
          };
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentHisData = res.data.data.list;
            this.assDataCount = res.data.data.total
          });
        }
      },
      //查看分配的任务
      showDistAssignment() {
        if (this.showDTData === true) {
          this.showDTData = false;
          this.butOnSelect.activeIndex = 0;
        } else {
          this.showATData = false;
          this.showHTData = false;
          this.showDTData = true;
          this.butOnSelect.activeIndex = 3;
          this.assCurrentPage = 1;
          this.assPageUrl = '/api/importArch/checkDistAssignment';
          this.assUrlParams = {
            'pageNum': 1,
            'pageSize': this.assPageSize
          };
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentDisData = res.data.data.list;
            this.assDataCount = res.data.data.total
          });

        }
      },
      // 选好档案数据和著录工作组即可进行分配任务
      distributeAssignment() {
        let archDataID = [];
        //判断工作组是否为空及是否选中档案的逻辑值
        let WGisNull = true;
        //判断著录工作组ID是否为空
        if (this.taskWG !== '') {
          if (this.tempArchData.length !== 0) {
            for (let i = 0; i < this.tempArchData.length; i++) {
              //判断档案二级状态是否是“待分配”状态
              if (this.tempArchData[i].twoStatue !== 0) { //不是
                WGisNull = false;
                alert('档号：“' + this.tempArchData[i].archNo + '”已经分配了');
                break
              } else { // 是
                archDataID.push(this.tempArchData[i].archId);
                this.taskArchID = archDataID;
              }
            }
          }
          else {
            WGisNull = false;
            alert('未选择档案数据!')
          }
        }
        else {
          WGisNull = false;
          alert('未选择著录组!')
        }
        //逻辑值正确触发分配
        if (WGisNull === true) {
          let temp = JSON.stringify(this.taskArchID);
          let userID;
          if (this.$store.state.userID === '') {
            if (window.localStorage.getItem('userID') === '') {
              this.axios.post('/api/user/get').then(res => {
                userID = res.data.data.id
              })
            }
            else {
              userID = window.localStorage.getItem('userID');
            }
          } else {
            userID = this.$store.state.userID;
          }
          this.axios.post('/api/importArch/distribute', this.qs.stringify({
            distributorID: userID,
            writeGroupID: this.taskWG,
            ids: temp
          })).then(res => {
            this.$Message.success(res.data.msg);
            this.hackReset = false;
            this.$nextTick(() => {
              this.hackReset = true;
            });
            this.taskWG = '';
            this.tempArchData = [];
            this.taskArchID = [];
            this.pageUrl = '/api/importArch/archStatue';
            this.returnAll();
          })
        }
      },
      //改变选择著录工作组
      selectWG(writeGroupID) {
        this.taskWG = writeGroupID;
      },
      //根据条件查询未分配的档案
      searchNotDistri() {
        if(this.keyDate!== '' || this.archStatues !== '' || this.keyword !== '') {
          this.pageUrl = '/api/importArch/archSearch';
          this.urlParams = {
            keyDate: this.keyDate,
            Statue: this.archStatues,
            keyword: this.keyword,
            pageNum: 1,
            pageSize: this.pageSize
          };
          this.spinShow = true;
          this.axios.post(this.pageUrl, this.qs.stringify(this.urlParams, {indices: false}))
            .then(res => {
              this.DistributeArchData = res.data.data.list;
              this.archDataCount = res.data.data.total;
              this.searchData = true;
              this.keyDate = '';
              this.archStatues = '';
              this.keyword = '';
              //清空下拉选项的选择值
              this.$refs.ArchStatue.clearSingleSelect();
              this.spinShow = false;
            })

        }else{
          this.$Message.error('筛选条件没有正确选择！')
        }
      },
      //筛选条件：选择档案二级状态后
      choseTwoStatue(value) {
        this.archStatues = statueTwoCode(value)
      },
      //返回所有档案未分配数据
      returnAll() {
        this.pageUrl = '/api/importArch/archStatue';
        this.loadDistributeArchData();
        this.searchData = false
      },
      //改变页数
      destPage(index) {
        this.currentPage = index;
        this.urlParams.pageNum = index;
        let param;
        if (this.searchData === true) {
          param=this.qs.stringify(this.urlParams, {indices: false});
          this.spinShow = true;
          this.axios.post(this.pageUrl, param).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }else{
          this.spinShow = true;
          this.axios.get(this.pageUrl, {params: this.urlParams}).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
      },
      //改变显示条数
      changePageSize(index) {
        this.pageSize = index;
        this.urlParams.pageSize = index;
        let param;
        if (this.searchData === true) {
          param=this.qs.stringify(this.urlParams);
          this.spinShow = true;
          this.axios.post(this.pageUrl, param).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }else{
          this.spinShow = true;
          this.axios.get(this.pageUrl, {params: this.urlParams}).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
      },
      //表格选中操作（4个）
      selectAllData(selection) {
        this.tempArchData = [];
        for (let i = 0; i < selection.length; i++) {
          this.tempArchData.push(selection[i].archVO)
        }
      },
      selectRowData(selection, row) {
        this.tempArchData.push(row.archVO);
      },
      cancelAllData(selection) {
        this.tempArchData = []
      },
      cancelRowData(selection, row) {
        for (let i = 0; i < this.tempArchData.length; i++) {
          if (this.tempArchData[i].archId === row.archVO.archId) {
            this.tempArchData.splice(i, 1)
          }
        }
      },
      //*******任务表格分页方法******
      destPage1(index) {
        this.assCurrentPage = index;
        this.assUrlParams.pageNum = index;
        this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
          if (this.assPageUrl === '/api/importArch/checkDistAssignment') {
            this.AssignmentDisData = res.data.data.list;
          }else if (this.assUrlParams.batchStatue === 1) {
            this.AssignmentHisData = res.data.data.list;
          } else if (this.assUrlParams.batchStatue === 0) {
            this.AssignmentData = res.data.data.list;
          }
          this.assDataCount = res.data.data.total
        });
      },
      changePageSize1(index) {
        this.assPageSize = index;
        this.assUrlParams.pageSize = index;
        this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
          if (this.assPageUrl === '/api/importArch/checkAssignment') {
            this.AssignmentHisData = res.data.data.list;
          } else if (this.assPageUrl === '/api/importArch/checkAssignment') {
            this.AssignmentData = res.data.data.list;
          } else if (this.assPageUrl === '/api/importArch/checkDistAssignment') {
            this.AssignmentDisData = res.data.data.list;
          }
          this.assDataCount = res.data.data.total
        });
      }
    },
    mounted() {
      this.loadDistributeArchData();
      this.loadWorkGroup()
    }
  }

  //任务状态解释说明
  function assignmentStatue(statue) {
    let statueDes;
    if (statue === 0) {
      statueDes = '未完成'
    } else {
      statueDes = '已完成'
    }
    return statueDes;
  }

  //档案二级状态解释说明
  function statueTwoDes(statue) {
    let statueName;
    if (statue === 0) {
      statueName = '待分配'
    } else if (statue === 1) {
      statueName = '已分配（待著录）'
    } else if (statue === 2) {
      statueName = '著录中'
    } else if (statue === 3) {
      statueName = '已著录（待质检）'
    } else if (statue === 4) {
      statueName = '质检中'
    } else if (statue === 5) {
      statueName = '质检通过（待上传）'
    } else if (statue === 6) {
      statueName = '质检不通过'
    } else if (statue === 7) {
      statueName = '上传中'
    } else if (statue === 8) {
      statueName = '已上传（组卷中）'
    } else if (statue === 9) {
      statueName = '组卷完成'
    }
    return statueName
  }

  //档案二级状态转换对应后台
  function statueTwoCode(statue) {
    let statueName;
    if (statue === '待分配') {
      statueName = 0
    } else if (statue === '已分配（待著录）') {
      statueName = 1
    } else if (statue === '著录中') {
      statueName = 2
    } else if (statue === '已著录（待质检）') {
      statueName = 3
    } else if (statue === '质检中') {
      statueName = 4
    } else if (statue === '质检通过（待上传）') {
      statueName = 5
    } else if (statue === '质检不通过') {
      statueName = 6
    } else if (statue === '上传中') {
      statueName = 7
    } else if (statue === '已上传（组卷中）') {
      statueName = 8
    } else if (statue === '组卷完成') {
      statueName = 9
    }
    return statueName
  }
</script>

<style scoped>
.buttonSelect{
  background-color: deepskyblue;
}
</style>
