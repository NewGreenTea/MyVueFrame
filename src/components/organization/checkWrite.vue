<template>
  <div>
    <div :class="loadData">
      <Row>
        <!-- 加载档案数据待著录条件框 -->
        <Col span="20" offset="2">
          <Form class="conditionFormFront" :label-width="labelWidth" style="margin-bottom: 20px">
            <Row>
              <Col span="9">
                <FormItem label="档案类别：">
                  <Cascader v-model="searchArchType" :data="archTypes" trigger="click" filterable
                            :render-format="Cascaderformat" @on-change="typeSelect"></Cascader>
                </FormItem>
              </Col>
              <Col span="5">
                <FormItem label="档案状态：">
                  <Select placeholder="状态" @on-change="oneSelect" :clearable="true" @on-clear="oneClear"
                          ref="selectStatue">
                    <Option :key="item" v-for="item in twoStatues" :value="item">{{item}}</Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="7">
                <FormItem label="档号：">
                  <Row>
                    <Col span="20">
                      <Input placeholder="档号，使用：可区间查询" v-model="archNoKeyword"/>
                    </Col>
                    <Col span="4">
                      <Tooltip placement="bottom-start" theme="light" max-width="300" class="searchTips"
                               content="可使用冒号进行范围查询（例如“C3.1-2018-0001:D3.1-2018-0010”）">
                        <Icon type="ios-help-circle-outline" size="30"/>
                      </Tooltip>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="1">
                <Button type="primary" @click="searchArch">搜索</Button>
              </Col>
            </Row>
            <Row>
              <Col>
                <Collapse>
                  <Panel name="1">
                    更多搜索
                    <div slot="content">
                      <Row>
                        <Col span="4">
                          <FormItem label="批次：">
                            <Input placeholder="批次" v-model="batchData"/>
                          </FormItem>
                        </Col>
                        <Col span="6">
                          <FormItem label="立案号：">
                            <Input placeholder="立案号" v-model="regNoKeyword"/>
                          </FormItem>
                        </Col>
                        <Col span="8">
                          <FormItem label="发文号：">
                            <Input placeholder="发文号" v-model="dispatchKeyword"/>
                          </FormItem>
                        </Col>
                      </Row>
                    </div>
                  </Panel>
                </Collapse>
              </Col>
            </Row>
          </Form>
        </Col>

        <Col span="20" offset="2">
          <!--按钮-->
          <Row :gutter="16" style="margin-bottom: 20px">
            <Col span="2">
              <Button type="success" @click="allOperation('通过')">著录质检通过</Button>
            </Col>
            <Col span="2">
              <Button type="error" @click="allOperation('不通过')">著录质检不通过</Button>
            </Col>
          </Row>
        </Col>

        <!-- 加载档案数据待著录表格 -->
        <Col span="20" offset="2" class="TableFontCss">
          <Table border :columns="needToDoColumns" :data="needToDoData" @on-select-all="selectAllData" @on-select="selectRowData"
                 @on-select-cancel="cancelRowData" @on-select-all-cancel="cancelAllData"></Table>
          <Page :current="needToDoPage" :total="needToDoCount" :page-size="needToDoPageSize" show-elevator show-total
                placement="top"
                show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="needToDoPSO"/>
          <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </Col>
      </Row>

      <!-- 加载档案数据表格 -2019/02/22暂时弃用-->
      <!--<Row v-if="showArchData" style="margin-top: 20px;">-->
        <!--<Col span="20" offset="2" class="TableFontCss">-->
          <!--<Table border :columns="columns" :data="tableData"></Table>-->
          <!--<Page :current="currentPage" :total="totalCount" :page-size="pageSize" show-elevator show-total show-sizer-->
                <!--:page-size-opts="pageSizeOpt"/>-->
        <!--</Col>-->
      <!--</Row>-->
    </div>

    <!-- 质检档案信息的路由界面 -->
    <div v-if="showWriteData">
      <keep-alive>
        <!--<router-view :name="viewName" @changeShowView="showView" v-if="$route.meta.keepAlive"></router-view>-->
        <CheckLayout @changeShowView="showView" :checkParams="checkParam"></CheckLayout>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import CheckLayout from "./CheckLayout";
  import {ArchStatueChange,archNoType} from './../../js/global'

  export default {
    name: "checkWrite",
    components: {CheckLayout},
    data() {
      return {
        labelWidth: 100,
        showTwoType: false, // 控制二级分类的显示
        archOneTypes: [], // 一级分类，后台获取
        archTwoTypes: [], // 二级分类，后台获取
        showWriteData: false,
        //点击二级分类后显示的数据表格
        showArchData: false,
        //二级分类后显示的数据表格分页配置
        currentPage: 1, //当前页
        totalCount: 0,
        pageSize: 10,
        pageSizeOpt: [10, 20, 30, 40, 50, 100],
        //传递给显示著录质检页面的重要参数
        archTypeID: '',
        archTypeName: '',
        //工作组质检表格
        needToDoColumns: [
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
              return h('span', params.index + (this.needToDoPage - 1) * this.needToDoPageSize + 1);
            }
          },
          {
            title: '批次',
            width: 90,
            render: (h, params) => {
              return h('p', params.row.archVO.batchId)
            }
          },
          {
            title: '立案号',
            render: (h, params) => {
              return h('p', params.row.archVO.registerNo)
            }
          },
          {
            title: '发文号',
            render: (h, params) => {
              return h('p', params.row.archVO.dispatchDocNo)
            }
          },
          {
            title: '档号',
            render: (h, params) => {
              return h('p', params.row.archVO.archNo)
            }
          },
          {
            title: '档案状态',
            render: (h, params) => {
              return h('p', ArchStatueChange.statueTwoDes(params.row.archVO.twoStatue))
            }
          },
          {
            title: '质检状况',
            render: (h, params) => {
              return h('p', statueTwoDes(params.row.archVO.twoStatue))
            }
          },
          {
            title: '操作',
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.viewName = 'CheckLayout';
                        this.loadData = {
                          view: false,
                          hidd: true
                        };
                        this.checkParam = {
                          archId: params.row.archId, //传递一些重要参数给下一个界面
                          classId: params.row.archVO.classId,
                          openCheck: params.row.archVO.twoStatue > 3,
                          archType:archNoType.writeVueLayout(params.row.archVO.archNo)
                        };
                        this.showWriteData = true;
                      }
                    }
                  }, '查看')
                ]
              )
            }
          }
        ],
        needToDoData: [],
        //工作组质检分页配置
        needToDoPage: 1,
        needToDoCount: 0,
        needToDoPageSize: 10,
        needToDoPSO: [1, 2, 5, 8, 10, 15, 20, 50],
        //质检界面是否显示
        showWriteData: false,
        //动态显示著录界面(基本，专业，文件)
        viewName: '',
        //质检档案数据表格
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
            title: '档号',
            key: 'archNo'
          },
          {
            title: '档号状态',
            key: 'twoStatue',
            render: (h, params) => {
              let statue = statueTwoDes(params.row.twoStatue);
              return h('div', statue)
            }
          },
          {
            title: '著录信息',
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.viewName = 'CheckLayout';
                        this.loadData = {
                          view: false,
                          hidd: true
                        };
                        this.checkParam = {
                          archId: params.row.archId, //传递一些重要参数给下一个界面
                          classId: this.archTypeID,
                          archType: archNoType.writeVueLayout(params.row.archNo)
                        };
                        this.showWriteData = true;
                      }
                    }
                  }, '查看')
                ]
              )
            }
          }
        ],
        tableData: [],
        //表格数据与档案质检详细界面的切换
        loadData: {
          view: true,
          hidd: false
        },
        checkParam: '',
        // 档案状态搜索
        twoStatues: ['待著录质检', '已著录质检', '著录质检不通过'],
        //查询档案二级状态码
        archStatueCode: '',
        //档号查询关键字
        keyword: '',
        pageKeyword: '',
        spinShow: false,
        //搜索条件中的档案类型级联数据
        archTypes: [],
        //搜索条件中的档案档号关键字
        archNoKeyword: '',
        //搜索条件中的档案类别
        searchArchType: [],
        //搜索条件的批次数据
        batchData: '',
        //搜索条件中的档案立案号关键字
        regNoKeyword: '',
        //搜索条件中的档案发文号关键字
        dispatchKeyword: '',
        //多选的待质检档案数据
        tempArchData:[]
      }
    },
    methods: {
      //加载工作组负责的待质检档案数据
      loadGroupArch() {
        this.spinShow = true;
        this.axios.post('/api/loadArch/GroupArch', this.qs.stringify({
          archType: '',
          archStatue: '',
          archNo: '',
          dispKeyword: '',
          batch: '',
          regKeyword: '',
          check: true,
          page: this.needToDoPage,
          pageSize: this.needToDoPageSize
        })).then(res => {
            this.needToDoData = res.data.data.list;
            this.needToDoCount = res.data.data.total;
            this.spinShow = false;
          }
        )
      },
      //加载档案类型级联数据 -2019/02/22
      loadArchTypes() {
        this.axios.get('/api/loadArch/getArchType').then(res => {
          this.archTypes = res.data.data
        })
      },
      oneClear() {
        this.archStatueCode = ''
      },
      // 显示著录列表数据
      writeLayout(type) {
        this.showTwoType = false;
        this.showArchData = true;
        this.axios.get('/api/loadArch/toWriteCheckArch', {
          params: {
            type: type.className,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.archTypeID = type.id;
          this.archTypeName = type.className;
          if (res.data.data.list.length === 0) {
            this.tableData = [];
          } else {
            this.tableData = res.data.data.list;
          }
          this.totalCount = res.data.data.total
        })
      },
      // 显示著录列表，隐藏著录界面
      showView(type) {
        this.showWriteData = false;
        this.loadData = {
          view: true,
          hidd: false
        };
        this.searchFunction(this.needToDoPage, this.needToDoPageSize);
        // this.loadGroupArch();
        // this.writeLayout(type);
      },
      //切换页码
      destPage(index) {
        this.needToDoPage = index;
        this.searchFunction(this.needToDoPage, this.needToDoPageSize);
      },
      //切换配置页
      changePageSize(index) {
        this.needToDoPageSize = index;
        this.needToDoPage = 1;
        this.searchFunction(this.needToDoPage, this.needToDoPageSize);
      },
      //*********************2019/02/22***************
      //档案类型级联数据的名称显示格式
      Cascaderformat(label, selectedData) {
        return label[label.length - 1];
      },
      //搜索条件中的档案类型返回
      typeSelect(value, selectedData) {
        this.searchArchType = value;
      },
      //条件搜索的
      oneSelect(value) {
        this.archStatueCode = statueTwoCode(value);
      },
      //搜索
      searchArch() {
        let result = archNoType.changeArchNoCondition(this.archNoKeyword);
        if (!result) {
          this.$Message.error('搜索档号区间，两档号类型不一致！')
        } else {
          this.needToDoPage = 1;
          this.searchFunction(this.needToDoPage, this.needToDoPageSize);
        }
      },
      //搜索方法
      searchFunction(pageNum, pageSize) {
        this.spinShow = true;
        this.axios.post('/api/loadArch/GroupArch', this.qs.stringify({
          archType: this.searchArchType[1],
          archStatue: this.archStatueCode,
          archNo: this.archNoKeyword,
          dispKeyword: this.dispatchKeyword,
          batch: this.batchData,
          regKeyword: this.regNoKeyword,
          check: true,
          page: pageNum,
          pageSize: pageSize
        })).then(res => {
          if (res.data.data === null) {
            this.$Message.info('没有找到！');
            this.needToDoData = [];
            this.needToDoCount = 0;
          } else if (res.data.data.list.length === 0) {
            this.$Message.info('没有找到！');
            this.needToDoData = [];
            this.needToDoCount = 0;
          } else {
            this.needToDoData = res.data.data.list;
            this.needToDoCount = res.data.data.total;
          }
          this.spinShow = false;
          this.showArchData = false;
        })
      },
      //质检批量操作
      allOperation(checkResult){
        let result=false;
        let ids=[];
        if(this.tempArchData.length === 0){
          this.$Message.error('请选择质检档案！')
        }else{
          for(let i = 0; i < this.tempArchData.length; i++){
            if(this.tempArchData[i].twoStatue > 3){
              result = true;
              this.$Message.error('第'+(i+1)+'行，不是待著录质检状态！')
            }else{
              ids.push(this.tempArchData[i].archId)
            }
          }
        }
        if(!result){
          //质检状态为通过
          this.axios.post('/api/loadArch/testwriteCheck',this.qs.stringify({ids:JSON.stringify(ids),result:checkResult})).then(res=>{
            if(res.data.code ===0){
              this.$Message.success('档案已质检'+checkResult+'！')
            }
            this.searchFunction(this.needToDoPage, this.needToDoPageSize)
          })
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
      this.loadGroupArch();
      this.loadArchTypes();
    }
  }

  //档案二级状态名转状态码
  function statueTwoCode(statue) {
    let statueName = null;
    if (statue === '待著录质检') {
      statueName = 3
    } else if (statue === '已著录质检') {
      statueName = 4
    } else if (statue === '著录质检不通过') {
      statueName = 6
    }
    return statueName
  }

  //档案二级状态解释说明
  function statueTwoDes(statue) {
    let statueName = null;
    if (statue === 3) {
      statueName = '待著录质检'
    } else if (statue === 6) {
      statueName = '著录质检不通过'
    } else if (statue >= 4) {
      statueName = '已著录质检'
    }
    return statueName
  }
</script>

<style scoped>
  .view {
    display: block
  }

  .hidd {
    display: none
  }
</style>
