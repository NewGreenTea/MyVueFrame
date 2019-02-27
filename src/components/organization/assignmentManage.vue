<template>
  <div>
    <!-- 任务界面 -->
    <Row style="margin-bottom: 20px">
      <Col span="4">
        <!-- 任务显示按钮 -->
        <Row>
          <Col offset="2" class="buttonMargin">
            <Button @click="showBatchAssignment" style="width: 150px;font-size: 15px;"
                    :class="{'buttonSelect': butOnSelect.activeIndex === 1}">批次任务
            </Button>
          </Col>
          <Col offset="2" class="buttonMargin">
            <Button @click="showHisAssignment" style="width: 150px;font-size: 15px;"
                    :class="{'buttonSelect': butOnSelect.activeIndex === 2}">历史批次任务
            </Button>
          </Col>
          <Col offset="2" class="buttonMargin">
            <Button @click="showDistAssignment" style="width: 150px;font-size: 15px;"
                    :class="{'buttonSelect': butOnSelect.activeIndex === 3}">已分配任务
            </Button>
          </Col>
        </Row>
      </Col>

      <Col span="19" class="TableFontCss buttonMargin">
        <Row>
          <Col>
            <Form class="formClass-right" @keydown.enter.native="keySearch" :label-width="labelWidth">
              <Row :gutter="16">
                <Col span="6">
                  <FormItem label="档号:">
                    <Input type="text" v-model="keyArchNo"/>
                  </FormItem>
                </Col>
                <!-- 批次 -->
                <Col span="5" v-if="!showDTData">
                <FormItem label="批次:">
                  <Input type="text" v-model="keyBatch"/>
                </FormItem>
                </Col>
                <Col span="7">
                  <FormItem label="开始时间:">
                    <DatePicker type="daterange" placement="bottom-end" placeholder="Select date"
                                format="yyyy-MM-dd"
                                :value="keyDate" @on-change="keyDate=$event"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="2">
                    <Button type="primary" @click="keySearch">搜索</Button>
                </Col>
                <Col span="2">
                    <Button @click="keyResetLoad">重置</Button>
                </Col>
              </Row>
            </Form>
          </Col>

          <Col>
            <Table border :columns="Columns" :data="AssignmentData" :height="600"></Table>
            <Page :current="assCurrentPage" :total="assDataCount" :page-size="assPageSize" show-elevator show-total
                  show-sizer @on-change="destPage1" @on-page-size-change="changePageSize1" :page-size-opts="assPSO"
                  placement="top"/>
            <Spin fix v-if="spinShow">
              <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
              <div>加载中</div>
            </Spin>
          </Col>
        </Row>
      </Col>
    </Row>

    <!-- 查看已分配任务信息情况对话框 -->
    <Modal v-model="showModal" :title="distributeATitle" width="1000px" @on-cancel="modalClose" @on-ok="modalClose">
      <div class="TableFontCss">
        <Table ref="distributeModalTable" border :columns="DisColumn" :data="showDAData" @on-select-all="selectAllData"
               @on-select="selectRowData"
               @on-select-cancel="cancelRowData" @on-select-all-cancel="cancelAllData"></Table>
        <Row>
          <Col>
            <Row>
              <Col span="12">
                <Page :current="disCurrentPage" :total="disDataCount" :page-size="disPageSize" show-elevator show-total
                      show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="disPSO"
                      placement="top"/>
              </Col>
              <Col span="12">
                <Button style="float: right;margin-top: 5px" @click="manyUpdate" v-if="!showAllUpdate">多选修改</Button>
              </Col>
            </Row>
          </Col>
          <Col>
            <Row v-if="showAllUpdate" :gutter="8">
              <Col span="4" style="margin-top: 10px;font-size: 14px;text-align: right;padding-top: 5px">
                修改所选档案状态为：
              </Col>
              <Col span="5" style="margin-top: 10px">
                <Select placeholder="状态" @on-change="choseTwoStatue" ref="ArchStatue" :clearable="InputClear">
                  <Option :key="item" v-for="item in twoStatues" :value="item">{{item}}</Option>
                </Select>
              </Col>
              <Col span="2" style="margin-top: 10px;font-size: 14px;text-align: right;padding-top: 5px">
                负责组为：
              </Col>
              <Col span="3" style="margin-top: 10px">
                <Select placeholder="负责组" @on-change="choseUpdateWrokGroup" ref="ArchWorkGroup" :clearable="InputClear">
                  <Option :key="item.id" v-for="item in WorkGroup" :value="item.departName">{{item.departName}}</Option>
                </Select>
              </Col>
              <Col span="2">
                <Button @click="allUpdate" style="margin-top: 10px">确定</Button>
              </Col>
              <Col span="2">
                <Button @click="manyUpdate" style="margin-top: 10px">返回</Button>
              </Col>
            </Row>
          </Col>
        </Row>
        <Spin fix v-if="disSpinShow">
          <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
          <div>加载中</div>
        </Spin>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {ArchStatueChange, CommonFunction} from './../../js/global'

  export default {
    name: "assignmentManage",
    data() {
      return {
        //初始化列
        Columns: [],
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
        //分配档案的工作组
        WorkGroup: [],
        //批次任务表格格式
        AssignmentColumn: [
          {
            title: '序号',
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage - 1) * this.assPageSize + 1);
            }
          },
          {
            title: '批次',
            key: 'batchName'
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
            title: '导入时间',
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
                            this.$Notice.info({
                              title: '提示信息：',
                              desc: '此任务已经分配完成！',
                              duration: 0
                            });
                          }
                        });
                      //当前任务浏览数据
                      let assignmentVisitParams = {
                        url: this.assPageUrl,
                        params: this.assUrlParams
                      };
                      assignmentVisitParams.params.pageNum = this.assCurrentPage;
                      //查看该批次的档案列表信息
                      this.pageUrl = '/api/importArch/archStatue';
                      this.urlParams = {'batchID': params.row.batchId, 'pageNum': null, 'pageSize': this.pageSize};
                      //任务数据参数
                      let assignmentParams = {
                        url: this.pageUrl,
                        params: this.urlParams
                      };
                      this.$store.commit('setAssignmentsVisit', assignmentVisitParams);
                      //标签页跳转
                      this.$store.commit('setAssignmentsData', assignmentParams);
                      this.$emit('showDistribute')
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
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage - 1) * this.assPageSize + 1);
            }
          },
          {
            title: '批次',
            key: 'batchName'
          },
          {
            title: '任务名',
            render: (h, params) => {
              return h('p', '分配档案')
            }
          },
          {
            title: '导入时间',
            key: 'createdDate'
          },
          {
            title: '分配时间',
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
                        //当前任务浏览数据
                        let assignmentVisitParams = {
                          url: this.assPageUrl,
                          params: this.assUrlParams
                        };
                        assignmentVisitParams.params.pageNum = this.assCurrentPage;
                        //查看该批次的档案列表信息
                        this.pageUrl = '/api/importArch/archStatue';
                        this.urlParams = {'batchID': params.row.batchId, 'pageNum': null, 'pageSize': this.pageSize};
                        //任务数据参数
                        let assignmentParams = {
                          url: this.pageUrl,
                          params: this.urlParams
                        };
                        this.$store.commit('setAssignmentsVisit', assignmentVisitParams);
                        //标签页跳转
                        this.$store.commit('setAssignmentsData', assignmentParams);
                        this.$emit('showDistribute')
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
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.assCurrentPage - 1) * this.assPageSize + 1);
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
                        this.disSpinShow = true;
                        this.disCurrentPage = 1;
                        this.distributeParams = {
                          assignmentID: params.row.assignmentId,
                          pageNum: this.disCurrentPage,
                          pageSize: this.disPageSize
                        };
                        this.axios.post(this.distributeUrl, this.qs.stringify(this.distributeParams))
                          .then(res => {
                            this.showDAData = res.data.data.list;
                            this.disDataCount = res.data.data.total;
                            this.disSpinShow = false;
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
        //控制显示已分配任务情况对话框
        showModal: false,
        //已分配任务情况对话框标题
        distributeATitle: '',
        //初始化分配任务表格加载格式
        DisColumn: [
          {
            title: '序号',
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.disCurrentPage - 1) * this.disPageSize + 1);
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
              let twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: twoStatue
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.archVO.twoStatue = ArchStatueChange.statueTwoCode(event);
                        twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
                      }
                    }
                  },
                  this.twoStatues.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type
                      }
                    }, type);
                  })
                )
              }
              else {
                return h('p', twoStatue)
              }
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
              let writeGroup = params.row.writeGroup;
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: switchWrokGroup(params.row.writeGroup, this.WorkGroup)
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.writeGroup = switchWrokGroup(event, this.WorkGroup) //event;//
                      }
                    }
                  },
                  this.WorkGroup.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type.departName
                      }
                    }, type.departName);
                  }))
              }
              else {
                return h('p', writeGroup)
              }
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    if (params.row.$isEdit) {
                      this.archID.push(params.row.archVO.archId);
                      this.updateStatue.push(params.row.archVO.twoStatue);
                      this.groupID.push(params.row.writeGroup);
                      //触发保存方法
                      this.handleSave(params.row)
                    } else {
                      //触发编辑方法
                      this.handleEdit(params.row)
                    }
                  }
                }
              }, params.row.$isEdit ? '保存' : '编辑')
            }
          }
        ],
        //单个修改模式
        showDAColumn: [
          {
            title: '序号',
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.disCurrentPage - 1) * this.disPageSize + 1);
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
              let twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: twoStatue
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.archVO.twoStatue = ArchStatueChange.statueTwoCode(event);
                        twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
                      }
                    }
                  },
                  this.twoStatues.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type
                      }
                    }, type);
                  })
                )
              }
              else {
                return h('p', twoStatue)
              }
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
              let writeGroup = params.row.writeGroup;
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: switchWrokGroup(params.row.writeGroup, this.WorkGroup)
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.writeGroup = switchWrokGroup(event, this.WorkGroup) //event;//
                      }
                    }
                  },
                  this.WorkGroup.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type.departName
                      }
                    }, type.departName);
                  }))
              }
              else {
                return h('p', writeGroup)
              }
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text'
                },
                on: {
                  click: () => {
                    if (params.row.$isEdit) {
                      this.archID.push(params.row.archVO.archId);
                      this.updateStatue.push(params.row.archVO.twoStatue);
                      this.groupID.push(params.row.writeGroup);
                      //触发保存方法
                      this.handleSave(params.row)
                    } else {
                      //触发编辑方法
                      this.handleEdit(params.row)
                    }
                  }
                }
              }, params.row.$isEdit ? '保存' : '编辑')
            }
          }
        ],
        //多个修改模式
        showDAColumn2: [
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
              return h('span', params.index + (this.disCurrentPage - 1) * this.disPageSize + 1);
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
              let twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: twoStatue
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.archVO.twoStatue = ArchStatueChange.statueTwoCode(event);
                        twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
                      }
                    }
                  },
                  this.twoStatues.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type
                      }
                    }, type);
                  })
                )
              }
              else {
                return h('p', twoStatue)
              }
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
              let writeGroup = params.row.writeGroup;
              if (params.row.$isEdit) {
                return h('Select',
                  {
                    props: {
                      value: switchWrokGroup(params.row.writeGroup, this.WorkGroup)
                    },
                    on: {
                      'on-change': (event) => {
                        params.row.writeGroup = switchWrokGroup(event, this.WorkGroup) //event;//
                      }
                    }
                  },
                  this.WorkGroup.map(function (type) {
                    return h('Option', {
                      props: {
                        value: type.departName
                      }
                    }, type.departName);
                  }))
              }
              else {
                return h('p', writeGroup)
              }
            }
          }
        ],
        //已分配任务详细情况数据
        showDAData: [],
        //任务分页参数配置
        assCurrentPage: 1,
        assDataCount: 0,
        assPageSize: 10,
        assPSO: [5, 10, 15, 20, 50],
        assPageUrl: '',
        assUrlParams: {},
        //
        disCurrentPage: 1,
        disDataCount: 0,
        disPageSize: 10,
        disPSO: [5, 10, 15, 20, 50],
        disSpinShow: false,
        //点击任务按钮变色
        butOnSelect: {
          activeIndex: 0
        },
        //加载动画
        spinShow: false,
        //表格开启修改时，档案变量
        updateStatue: [],  //档案变更状态
        archID: [],         //档案ID
        groupID: [],     //分配对应的组
        distributeUrl: '/api/importArch/detailDistAssignment', //查看分配任务表格数据的url
        distributeParams: [], //查看分配任务表格数据的url的参数
        tempArchData: [], //多选修改档案状态的数据
        InputClear: true,
        allUpdateStatue: '',
        allUpdateWrokGroup: '',
        showAllUpdate: false,
        //搜索条件参数
        labelWidth: 90,
        keyArchNo: '', //档号关键词
        keyBatch: '', //批次关键词
        keyWorkGroup: '', //负责组关键词
        keyDate: '', //任务开始时间关键词
        isSearch: false,
        searchParam: {}
      }
    },
    methods: {
      //加载离开此页请求分配页面时，当时的浏览数据
      loadAssignmentsVisit() {
        if (this.getAssignmentsVisit.pageUrl !== null) {
          this.assPageUrl = this.getAssignmentsVisit.pageUrl;
          this.assUrlParams = this.getAssignmentsVisit.urlParams;
          this.assCurrentPage = this.getAssignmentsVisit.urlParams.pageNum;
          this.spinShow = true;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            if (this.assUrlParams.batchStatue === 0) {
              this.Columns = this.AssignmentColumn;
            } else if (this.assUrlParams.batchStatue === 1) {
              this.Columns = this.AssignmentHisColumn;
            }
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
            this.$store.commit('setAssignmentsVisit', {url: null, params: null})
          });
        }
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
          this.Columns = this.AssignmentColumn;
          this.spinShow = true;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          });
          this.keyReset()
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
          this.Columns = this.AssignmentHisColumn;
          this.spinShow = true;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
        this.keyReset()
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
          this.Columns = this.AssignmentDisColumn;
          this.spinShow = true;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
        this.keyReset()
      },
      //加载著录工作组信息
      loadWorkGroup() {
        this.axios.post('/api/department/list/group/s').then(res => {
          this.WorkGroup = res.data.data
        })
      },
      //*******任务表格分页方法******
      destPage1(index) {
        this.assCurrentPage = index;
        this.spinShow = true;
        if(this.isSearch === true){
          this.searchParam.pageNum = index;
          this.axios.post('/api/manageArch/searchAssignment',this.qs.stringify(this.searchParam)).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          })
        }else{
          this.assUrlParams.pageNum = index;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
      },
      changePageSize1(index) {
        this.assPageSize = index;
        this.spinShow = true;
        if(this.isSearch === true){
          this.searchParam.pageSize = index;
          this.axios.post('/api/manageArch/searchAssignment',this.qs.stringify(this.searchParam)).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          })
        }else {
          this.assUrlParams.pageSize = index;
          this.axios.get(this.assPageUrl, {params: this.assUrlParams}).then(res => {
            this.AssignmentData = res.data.data.list;
            this.assDataCount = res.data.data.total;
            this.spinShow = false;
          });
        }
      },
      //*****************************
      destPage(index) {
        this.disCurrentPage = index;
        this.distributeParams.pageNum = index;
        this.disSpinShow = true;
        this.axios.post(this.distributeUrl, this.qs.stringify(this.distributeParams)).then(res => {
          this.showDAData = res.data.data.list;
          this.disDataCount = res.data.data.total;
          this.disSpinShow = false;
        });
      },
      changePageSize(index) {
        this.disPageSize = index;
        this.distributeParams.pageSize = index;
        this.disSpinShow = true;
        this.axios.post(this.distributeUrl, this.qs.stringify(this.distributeParams)).then(res => {
          this.showDAData = res.data.data.list;
          this.disDataCount = res.data.data.total;
          this.disSpinShow = false;
        });
      },
      //表格开启保存
      handleEdit(row) {
        this.$set(row, '$isEdit', true)
      },
      //表格修改保存
      handleSave(row) {
        let archids = JSON.stringify(this.archID);
        let twostatues = JSON.stringify(this.updateStatue);
        let groupids = switchWrokGroupID(this.groupID, this.WorkGroup);
        this.axios.post('/api/manageArch/updateStatue',
          this.qs.stringify(
            {
              archID: archids,
              twoStatue: twostatues,
              groupID: groupids
            })).then(res => {
          if (res.data.code === 0) {//更新成功
            this.$Message.success('修改成功！')
          } else {
            this.$Message.error('修改失败！')
          }
          this.archID = [];
          this.updateStatue = [];
          this.groupID = [];
          this.$set(row, '$isEdit', false)
        });
      },
      //多选修改档案状态
      manyUpdate() {
        this.$refs.distributeModalTable.selectAll(false);
        if (this.DisColumn === this.showDAColumn2) {
          this.DisColumn = this.showDAColumn;
          this.showAllUpdate = false;
        } else {
          this.DisColumn = this.showDAColumn2;
          this.showAllUpdate = true;
        }
      },
      //选择修改档案状态
      choseTwoStatue(value) {
        this.allUpdateStatue = ArchStatueChange.statueTwoCode(value)
      },
      //选择修改档案的负责组
      choseUpdateWrokGroup(value) {
        this.allUpdateWrokGroup = value;
      },
      allUpdate() {
        if (this.tempArchData.length < 1) {
          this.$Message.warning('请选择修改的档案！')
        } else {
          let archIds = [];
          let twoStatues = [];
          let groupIds = [];
          for (let i = 0; i < this.tempArchData.length; i++) {
            archIds.push(this.tempArchData[i].archVO.archId);
            //档案状态是否变动
            if (this.allUpdateStatue === '') {
              twoStatues.push(this.tempArchData[i].archVO.twoStatue)
            } else {
              twoStatues.push(this.allUpdateStatue);
            }
            //负责组是否变动
            if (this.allUpdateWrokGroup === '') {
              groupIds.push(this.tempArchData[i].writeGroup);
            } else {
              groupIds.push(this.allUpdateWrokGroup);
            }
          }
          archIds = JSON.stringify(archIds);
          groupIds = switchWrokGroupID(groupIds, this.WorkGroup);
          twoStatues = JSON.stringify(twoStatues);
          //多个修改档案状态或负责组
          this.axios.post('/api/manageArch/updateStatue', this.qs.stringify({
            archID: archIds,
            twoStatue: twoStatues,
            groupID: groupIds
          })).then(res => {
            if (res.data.code === 0) {
              this.$Message.success('修改成功！')
            } else {
              this.$Message.error('修改失败！')
            }
            this.allUpdateStatue = '';
            this.allUpdateWrokGroup = '';
            this.$refs.ArchStatue.clearSingleSelect();
            this.$refs.ArchWorkGroup.clearSingleSelect();
            this.DisColumn = this.showDAColumn2;
            this.disSpinShow = true;
            this.axios.post(this.distributeUrl, this.qs.stringify(this.distributeParams)).then(res => {
              this.showDAData = res.data.data.list;
              this.disDataCount = res.data.data.total;
              this.disSpinShow = false;
            })
          })
        }
      },
      //表格选中操作（4个）
      selectAllData(selection) {
        this.tempArchData = [];
        for (let i = 0; i < selection.length; i++) {
          this.tempArchData.push(selection[i])
        }
      },
      selectRowData(selection, row) {
        this.tempArchData.push(row);
      },
      cancelAllData(selection) {
        this.tempArchData = []
      },
      cancelRowData(selection, row) {
        for (let i = 0; i < this.tempArchData.length; i++) {
          if (this.tempArchData[i].archId === row.archVO.archId) {
            this.tempArchData.splice(i, 1);
            break;
          }
        }
      },
      //查看分配任务档案信息的对话框，点击确定或取消事件
      modalClose() {
        this.DisColumn = this.showDAColumn;
        this.showAllUpdate = false;
        this.tempArchData = []
      },
      //******任务模糊搜索***********
      //负责组
      // choseSearchWrokGroup(value){
      //
      // },
      //搜索确定
      keySearch() {
        if (this.showATData === false && this.showHTData === false && this.showDTData === false) {
          this.$Message.warning('请选择左边需要查询的任务类型！')
        } else {
          let keyDate;
          if(this.keyDate === '' || this.keyDate.length ===0){
            keyDate = '';
          }else{
            keyDate = this.keyDate[0]+','+this.keyDate[1];
          }
          this.spinShow = true;
          this.assCurrentPage = 1;

          //批次任务搜索
          if (this.showATData === true) {
            this.searchParam ={
              keyArchNo: this.keyArchNo,
              batchName: this.keyBatch,
              keyDate: keyDate,
              batchStatue: 0,
              pageNum: 1,
              pageSize: this.assPageSize
            };
            this.axios.post('/api/manageArch/searchBatchAssignment',this.qs.stringify(this.searchParam)).then(res => {
              if(res.data.data === null){
                this.$Message.info('数据错误！');
              }else{
                this.AssignmentData = res.data.data.list;
                this.assDataCount = res.data.data.total;
                if(res.data.data.list.length === 0){
                  this.$Message.info('没有找到！');
                  //不记录查询条件
                  this.searchParam ={};
                }else{
                  //记录查询条件
                  this.isSearch = true;
                }
              }
              this.spinShow = false;
            })
          }
          //历史批次任务搜索
          if (this.showHTData === true) {
            this.searchParam ={
              keyArchNo: this.keyArchNo,
              batchName: this.keyBatch,
              keyDate: keyDate,
              batchStatue: 1,
              pageNum: 1,
              pageSize: this.assPageSize
            };
            this.axios.post('/api/manageArch/searchBatchAssignment',this.qs.stringify(this.searchParam)).then(res => {
              if(res.data.data === null){
                this.$Message.info('数据错误！');
              }else {
                this.AssignmentData = res.data.data.list;
                this.assDataCount = res.data.data.total;
                if (res.data.data.list.length === 0) {
                  this.$Message.info('没有找到！');
                  //不记录查询条件
                  this.searchParam = {};
                } else {
                  //记录查询条件
                  this.isSearch = true;
                }
              }
              this.spinShow = false;
            })
          }
          //已分配任务搜索
          if (this.showDTData === true) {
            this.searchParam ={
              keyArchNo: this.keyArchNo,
              keyDate: keyDate,
              pageNum: 1,
              pageSize: this.assPageSize
            };
            this.axios.post('/api/manageArch/searchDistAssignment',this.qs.stringify(this.searchParam)).then(res => {
              this.AssignmentData = res.data.data.list;
              this.assDataCount = res.data.data.total;
              this.spinShow = false;
              if(res.data.data.list.length === 0){
                this.$Message.info('没有找到！');
                //不记录查询条件
                this.searchParam ={};
              }else{
                //记录查询条件
                this.isSearch = true;
              }
            })
          }
        }
      },
      //搜索重置
      keyReset(){
        this.keyArchNo = '';
        this.keyDate = '';
        this.keyBatch = '';
        this.isSearch = false;
        this.searchParam ={};
      },
      //搜索重置并加载
      keyResetLoad() {
        this.keyArchNo = '';
        this.keyDate = '';
        this.isSearch = false;
        this.searchParam ={};
        if (this.showATData === true){
          this.showATData = false;
          this.showBatchAssignment()
        }
        if(this.showHTData === true){
          this.showHTData = false;
          this.showHisAssignment()
        }
        if(this.showDTData === true) {
          this.showDTData=false;
          this.showDistAssignment();
        }
      }
    },
    mounted() {
      this.loadWorkGroup();
      this.loadAssignmentsVisit()
    },
    computed: {
      getAssignmentsVisit() {
        return this.$store.state.AssignmentsVisit
      }
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

  //分配任务中的档案是哪个工作组
  function switchWrokGroup(name, data) {
    for (let i = 0; i < data.length; i++) {
      if (name === data[i].departName) {
        return data[i].departName;
      }
    }
  }

  //修改分配任务中的档案是工作组id
  function switchWrokGroupID(GroupName, GroupData) {
    let data = '';
    for (let j = 0; j < GroupName.length; j++) {
      for (let i = 0; i < GroupData.length; i++) {
        if (GroupName[j] === GroupData[i].departName) {
          data = data + GroupData[i].id + ',';
          break;
        }
      }
    }
    return data;
  }
</script>

<style scoped>
  .buttonMargin {
    margin-top: 20px;
  }
</style>
