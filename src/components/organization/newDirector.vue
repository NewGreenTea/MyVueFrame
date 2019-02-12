<template>
  <div>
    <!-- 分配界面：头部 -->
    <Row>
      <Col>
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
            <Form ref="searchForm" class="conditionFormFront">
              <Row>
                <Col span="2">
                  <FormItem>
                    <h2>筛选条件:</h2>
                  </FormItem>
                </Col>
                <!-- 筛选条件：档案状态 -->
                <Col span="4">
                  <FormItem>
                    <Row>
                      <Col span="10" offset="2">
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
                          <Col span="9" offset="2">
                            任务开始时间：
                          </Col>
                          <Col span="12">
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
                      <Col span="7" offset="4">
                        关键字：
                      </Col>
                      <Col span="13">
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
          <Col span="24" class="tableLoading TableFontCss">
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
  import {ArchStatueChange} from './../../js/global'
  export default {
    name: "newDirector",
    data() {
      return {
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
              return h('span', params.index + (this.currentPage - 1) * this.pageSize + 1);
            }
          },
          {
            title: '任务id',
            width: 80,
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
              let twoStatue = ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue);
              return h('p', twoStatue)
            }
          },
          {
            title: '库房管理员',
            width: 120,
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
        //***搜索条件***
        archStatues: '',
        keyword: '',
        keyDate: '',
        searchData: false,
        //vue 组件属性
        InputClear: true,
        //加载动画
        spinShow: false
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
      //任务界面请求打开分配界面时，加载任务数据
      loadAssignmentsData() {
        if(this.getAssignmentsData.pageUrl !== null){
          this.spinShow = true;
          this.pageUrl = this.getAssignmentsData.pageUrl;
          this.urlParams = this.getAssignmentsData.urlParams;
          this.axios.get(this.pageUrl, {params: this.urlParams})
            .then(res => {
              this.$Message.info('已加载到分配面板上');
              this.DistributeArchData = res.data.data.list;
              this.archDataCount = res.data.data.total;
              this.searchData = false;
              this.spinShow = false;
              this.$store.commit('setAssignmentsData',{url:null,params:null})
            })
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
                this.$Message.info('档号：“' + this.tempArchData[i].archNo + '”已经分配了');
                break
              } else { // 是
                archDataID.push(this.tempArchData[i].archId);
                this.taskArchID = archDataID;
              }
            }
          }
          else {
            WGisNull = false;
            this.$Message.error('未选择档案数据!')
          }
        }
        else {
          WGisNull = false;
          this.$Message.error('未选择著录组!')
        }
        //逻辑值正确触发分配
        if (WGisNull === true) {
          let temp = JSON.stringify(this.taskArchID);
          this.axios.post('/api/importArch/distribute', this.qs.stringify({
            writeGroupID: this.taskWG,
            ids: temp
          })).then(res => {
            if (res.data.code === 0) {
              this.$Message.success('分配完成！');
            } else {
              this.$Message.error('分配失败！')
            }
            this.hackReset = false;
            this.$nextTick(() => {
              this.hackReset = true;
            });
            this.taskWG = '';
            this.tempArchData = [];
            this.taskArchID = [];
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
        if (this.keyDate !== '' || this.archStatues !== '' || this.keyword !== '') {
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
              if(res.data.data.list.length === 0){
                this.$Message.info('没有找到！')
              }else{
                this.DistributeArchData = res.data.data.list;
                this.archDataCount = res.data.data.total;
                this.searchData = true;
              }

              this.keyDate = '';
              this.archStatues = '';
              this.keyword = '';
              //清空下拉选项的选择值
              this.$refs.ArchStatue.clearSingleSelect();
              this.spinShow = false;
            })

        } else {
          this.$Message.error('筛选条件没有正确选择！')
        }
      },
      //筛选条件：选择档案二级状态后
      choseTwoStatue(value) {
        this.archStatues = ArchStatueChange.statueTwoCode(value)
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
          param = this.qs.stringify(this.urlParams, {indices: false});
          this.spinShow = true;
          this.axios.post(this.pageUrl, param).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        } else {
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
          param = this.qs.stringify(this.urlParams);
          this.spinShow = true;
          this.axios.post(this.pageUrl, param).then(res => {
            this.DistributeArchData = res.data.data.list;
            this.archDataCount = res.data.data.total;
            this.spinShow = false;
          });
        } else {
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
    },
    mounted() {
      this.loadAssignmentsData();
      this.loadWorkGroup()
    },
    computed: {
      getAssignmentsData(){
        return this.$store.state.AssignmentsData
      }
    }
  }
</script>

<style scoped>

</style>
