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
              <Col span="4">
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
        <!-- 加载档案数据待著录表格 -->
        <Col span="20" offset="2" class="TableFontCss">
          <Table border :columns="needToDoColumns" :data="needToDoData"></Table>
          <Page :current="needToDoPage" :total="needToDoCount" :page-size="needToDoPageSize" show-elevator show-total
                placement="top"
                show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="needToDoPSO"/>
          <Spin fix v-if="spinShow">
            <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </Col>
      </Row>

      <Row v-if="showArchData" style="margin-top: 20px;">
        <!-- 加载档案数据表格 -->
        <Col span="20" offset="2" class="TableFontCss">
          <Table border :columns="columns" :data="tableData"></Table>
          <!--<Page :current="currentPage" :total="totalCount" :page-size="pageSize" show-elevator show-total show-sizer-->
          <!--:page-size-opts="pageSizeOpt" @on-change="destPage1" @on-page-size-change="changePageSize1"/>-->
          <Spin fix v-if="spinShow2">
            <Icon type="ios-loading" size=36 class="demo-spin-icon-load"></Icon>
            <div>加载中</div>
          </Spin>
        </Col>
      </Row>
    </div>

    <!-- 完成著录后是否进入修改提示框 -->
    <Modal v-model="showModal" :title="modalTitle" @on-ok="tips" @on-cancel="cancelTips" name="123">
      <div>
        是否进入为修改操作?
      </div>
    </Modal>

    <!-- 著录档案信息的路由界面 -->
    <div v-if="showWriteData">
      <keep-alive>
        <!--<router-view :name="viewName" @changeShowView="showView" v-if="$route.meta.keepAlive"></router-view>-->
        <div v-if="viewName === 'BaseInfo'">
          <BaseInfo @changeShowView="showView" :BaseParams="baseParams" @toShowOther="showOtherWrite"></BaseInfo>
        </div>
      </keep-alive>
      <keep-alive>
        <div v-if="viewName === 'ProfInfo'">
          <ProfInfo @changeShowView="showView" :ProfParams="profParams" @toShowOther="showOtherWrite"></ProfInfo>
        </div>
      </keep-alive>
      <keep-alive>
        <div v-if="viewName === 'FileInfo'">
          <FileInfo @changeShowView="showView" :FileParams="fileParams" @toShowOther="showOtherWrite"></FileInfo>
        </div>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import {ArchStatueChange, archNoType} from './../../js/global'
  import BaseInfo from "../writeLayout/BaseInfo";
  import FileInfo from "../writeLayout/FileInfo";
  import ProfInfo from "../writeLayout/ProfInfo";

  export default {
    name: 'writerGroup',
    components: {ProfInfo, FileInfo, BaseInfo},
    data() {
      return {
        labelWidth: 100,
        showTwoType: false, // 控制二级分类的显示
        archOneTypes: [], // 一级分类，后台获取
        archTwoTypes: [], // 二级分类，后台获取
        showArchData: false, // 待著录的档案列表
        currentPage: 1, // 分页插件：当前页
        viewName: '', //动态显示著录界面(基本，专业，文件)
        archTypeID: '', //档案类别id临时存储
        archTypeName: '', //档案类别名临时存储
        showWriteData: false, //著录界面是否显示
        showModal: false, // 控制是否继续进入添加或修改弹窗
        pushConf: null, // 修改的跳转配置（默认：修改）
        modalTitle: '', // 弹窗的标题
        loadData: {
          view: true,
          hidd: false
        },
        totalCount: 0, // 分页插件：总数量
        pageSize: 10, // 分页插件：显示条数
        pageSizeOpt: [10, 20, 30, 40, 50, 100], // 分页插件：选择显示条数框
        twoStatues: ['待著录', '已著录', '不通过'], // 档案状态搜索
        //向下基本，专业，文件传递的参数
        baseParams: '',
        profParams: '',
        fileParams: '',
        // 显示表格的属性列
        columns: [
          {
            title: '立案号',
            key: 'registerNo'
          },
          {
            title: '发文号',
            key: 'dispatchDocNo'
          },
          {
            title: '档号',
            key: 'archNo'
          },
          {
            title: '档案状态',
            width: 140,
            key: 'twoStatue',
            render: (h, params) => {
              let statue = ArchStatueChange.lowerStatueTwoDes(params.row.twoStatue);
              return h('div', statue)
            }
          },
          {
            title: '基本信息',
            width: 100,
            render: (h, params) => {
              return h('div', [
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // 判断基本信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/baseInfo/existBaseInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data.length === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.baseParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                registerNo: params.row.registerNo,
                                dispatchDocNo: params.row.dispatchDocNo,
                                archTypeID: params.row.classId,
                                archTypeName: archNoType.writeVueLayout2(params.row.archNo),
                                archInputDate: params.row.inputDate,
                                title: res.data.data.title,
                                operation: true
                              };
                              this.viewName = 'BaseInfo';
                              this.showWriteData = true;
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.modalTitle = '基本信息已完成';
                              this.baseParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                registerNo: params.row.registerNo,
                                dispatchDocNo: params.row.dispatchDocNo,
                                archTypeID: params.row.classId,
                                archTypeName: archNoType.writeVueLayout2(params.row.archNo),
                                archInputDate: params.row.inputDate,
                                title: res.data.data.title,
                                operation: false
                              };
                              this.viewName = 'BaseInfo';
                            }
                          })

                      }
                    }
                  }, '+')
                ]
              )
            }
          },
          {
            title: '专业信息',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // 判断专业信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/profInfo/existProfInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.viewName = 'ProfInfo';
                              this.profParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: params.row.classId,
                                archType: archNoType.writeVueLayout(params.row.archNo),
                                dispatchNo: params.row.dispatchDocNo,
                                operation: true
                              };
                              this.showWriteData = true;
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.viewName = 'ProfInfo';
                              this.modalTitle = '专业信息已完成';
                              this.profParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: params.row.classId,
                                archType: archNoType.writeVueLayout(params.row.archNo),
                                dispatchNo: params.row.dispatchDocNo,
                                operation: false
                              }
                            }
                          })
                      }
                    }
                  }, '+')
              ])
            }
          },
          {
            title: '文件信息',
            width: 100,
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // 判断文件信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/fileInfo/existFileInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.viewName = 'FileInfo';
                              this.fileParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: params.row.archVO.classId,
                                operation: true
                              };
                              // this.showWriteData = true;
                            } else {
                              this.showModal = true;
                              this.viewName = 'FileInfo';
                              this.modalTitle = '文件信息已完成';
                              this.fileParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: params.row.classId,
                                operation: false
                              };
                            }
                          });
                      }
                    }
                  }, '+')
              ])
            }
          }
        ],
        // 表格数据
        tableData: [],
        //分配到登录工作组的待著录档案数据
        needToDoData: [],
        //分配到登录工作组的待著录档案表格格式
        needToDoColumns: [
          {
            title: '序号',
            width: 70,
            render: (h, params) => {
              return h('span', params.index + (this.needToDoPage - 1) * this.needToDoPageSize + 1);
            }
          },
          {
            title: '批次',
            width: 70,
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
              return h('p', ArchStatueChange.lowerStatueTwoDes(params.row.archVO.twoStatue))
            }
          },
          {
            title: '操作状态',
            render: (h, params) => {
              //判断档案著录进行到哪一步，是否完成著录
              if (params.row.baseCode === 0 && params.row.profCode === 0 && params.row.fileCode === 0) {
                return h('p', '待著录')
              }
              else {
                if (params.row.baseCode !== 0 && params.row.profCode === 0 && params.row.fileCode === 0) {
                  return h('p', '专业信息和文件信息未著录')
                } else if (params.row.baseCode === 0 && params.row.profCode !== 0 && params.row.fileCode === 0) {
                  return h('p', '基本信息和文件信息未著录')
                } else if (params.row.baseCode === 0 && params.row.profCode === 0 && params.row.fileCode !== 0) {
                  return h('p', '基本信息和专业信息未著录')
                } else if (params.row.baseCode !== 0 && params.row.profCode !== 0 && params.row.fileCode === 0) {
                  return h('p', '文件信息未著录')
                } else if (params.row.baseCode !== 0 && params.row.profCode === 0 && params.row.fileCode !== 0) {
                  return h('p', '专业信息未著录')
                } else if (params.row.baseCode === 0 && params.row.profCode !== 0 && params.row.fileCode !== 0) {
                  return h('p', '基本信息未著录')
                } else {
                  if (params.row.archVO.twoStatue === 3) {
                    return h('p', '')
                  } else if (params.row.archVO.twoStatue === 6 || params.row.archVO.twoStatue < 3) {
                    return h('Button', {
                      props: {
                        type: 'primary', size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.spinShow = true;
                          //检测基本信息的文件页数和文件级信息文件编号是否相等
                          this.axios.post('/api/loadArch/checkArchFilePage', this.qs.stringify({archID: params.row.archId})).then(res => {
                            if (res.data.code === 1) {
                              this.$Message.error(res.data.msg);
                              this.spinShow = false;
                            } else {
                              // 修改档案状态，变为已著录/待质检的状态
                              this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({archID: params.row.archId}))
                                .then(res => {
                                  this.loadGroupArch();
                                  //刷新选择具体分类的档案著录数据
                                  this.reFlash();
                                  this.spinShow = false;
                                })
                            }
                          })
                        }
                      }
                    }, '确认完成');
                  } else {
                    return h('Button', {
                      on: {
                        click: () => {
                          this.showArchData = true;
                          this.showTwoType = false;
                          this.archTypeName = archNoType.writeVueLayout2(params.row.archVO.archNo);
                          this.axiosArchNo(params.row.archVO.archNo);
                        }
                      }
                    }, '查看')
                  }
                }
              }
            }
          },
          {
            title: '编辑',
            width: 70,
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.loadData = {
                          view: false,
                          hidd: true
                        };
                        // 判断基本信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/baseInfo/existBaseInfo', {params: {archId: params.row.archId}}).then(res=>{
                          if (res.data.data.length === 1) {
                            this.baseParams = {
                              archId: params.row.archVO.archId, //传递一些重要参数给下一个界面
                              archNo: params.row.archVO.archNo,
                              registerNo: params.row.archVO.registerNo,
                              dispatchDocNo: params.row.archVO.dispatchDocNo,
                              archTypeID: params.row.archVO.classId,
                              archTypeName: archNoType.writeVueLayout2(params.row.archVO.archNo),
                              archInputDate: params.row.archVO.inputDate,
                              title: '',
                              operation: false
                            };
                            this.viewName = 'BaseInfo';
                            this.showWriteData = true;
                          }else{
                            this.baseParams = {
                              archId: params.row.archVO.archId, //传递一些重要参数给下一个界面
                              archNo: params.row.archVO.archNo,
                              registerNo: params.row.archVO.registerNo,
                              dispatchDocNo: params.row.archVO.dispatchDocNo,
                              archTypeID: params.row.archVO.classId,
                              archTypeName: archNoType.writeVueLayout2(params.row.archVO.archNo),
                              archInputDate: params.row.archVO.inputDate,
                              title: res.data.data.title,
                              operation: true
                            };
                            this.viewName = 'BaseInfo';
                            this.showWriteData = true;
                          }
                        });
                      }
                    }
                  }, '+')
              ])
            }
          }
        ],
        //工作组著录分页配置
        needToDoPage: 1,
        needToDoCount: 0,
        needToDoPageSize: 10,
        needToDoPSO: [1, 5, 8, 10, 15, 20, 50],
        //用户信息id
        userID: this.$store.state.userID,
        //查询档案二级状态码
        archStatueCode: null,
        //档号查询关键字
        keyword: '',
        pageKeyword: '',
        //查看待档案著录数据表格的加载动画
        spinShow: false,
        //查看具体分类的档案著录数据表格的加载动画
        spinShow2: false,
        //具体分类档案著录数据的搜索关键字
        showArchDataKeyword: '',
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
        dispatchKeyword: ''
      }
    },
    methods: {
      //加载工作组负责的档案数据
      loadGroupArch() {
        this.searchFunction(this.needToDoPage,this.needToDoPageSize)
      },
      //加载档案类型级联数据 -2019/02/19
      loadArchTypes() {
        this.axios.get('/api/loadArch/getArchType').then(res => {
          this.archTypes = res.data.data
        })
      },
      //加载工作组负责的批次数据
      // loadArchBatch() {
      //   this.axios.get('/api/loadArch/getGroupBatch').then(res => {
      //       this.batchData = res.data.data
      //     }
      //   )
      // },
      // 显示一级分类
      //*******************************弃用start
      loadOneTypes() {
        this.axios.get('/api/loadArch/getOneClass').then(res => {
            this.archOneTypes = res.data.data
          }
        )
      },
      // 显示二级分类
      showTwoTypes(type) {
        this.showTwoType = true;
        if (this.showArchData === true) {
          this.showArchData = false
        }
        this.axios.get('/api/loadArch/getAllTwoClass', {params: {name: type}}).then(res => {
            this.archTwoTypes = res.data.data
          }
        )
      },
      // 显示著录档案列表数据
      writeLayout(type) {
        this.showTwoType = false;
        this.showArchData = true;
        this.archTypeName = type.className;
        this.axiosArchNo(type.className);
      },
      //加载具体分类的档案著录数据
      axiosArchNo(archno) {
        this.spinShow2 = true;
        this.axios.get('/api/loadArch/getTpyeArch', {
          params: {
            type: archno,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          if(res.data.data === null){
            this.$Message.info('没有相应的档案！');
            this.tableData = [];
            this.totalCount = 0;
          }else if (res.data.data.list.length === 0) {
            this.$Message.info('没有相应的档案！');
            this.tableData = [];
            this.totalCount = 0;
          } else {
            this.archTypeID = res.data.data.list[0].classId;
            this.tableData = res.data.data.list;
            this.totalCount = res.data.data.total;
          }
          this.spinShow2 = false;
        })
      },
      //*******************************弃用end
      // 显示著录列表，隐藏著录界面
      showView() {
        this.showWriteData = false;
        this.loadData = {
          view: true,
          hidd: false
        };
        //刷新表格
        this.searchFunction(this.needToDoPage,this.needToDoPageSize);
      },
      //三大信息互相跳转
      showOtherWrite(viewName, data) {
        if (viewName === 'ProfInfo') {
          this.viewName = 'ProfInfo';
          this.showWriteData = true;
          this.profParams = data;
        } else if (viewName === 'FileInfo') {
          this.viewName = 'FileInfo';
          this.showWriteData = true;
          this.fileParams = data;
        } else if (viewName === 'BaseInfo') {
          this.viewName = 'BaseInfo';
          this.showWriteData = true;
          this.baseParams = data;
        }
      },
      //进入修改界面
      tips() {
        this.loadData = {
          view: false,
          hidd: true
        };
        this.showWriteData = true;
        // this.$router.push(this.pushConf)
      },
      // 取消进入修改界面
      cancelTips() {
        this.viewName = ''
      },
      //搜索条件中的状态条件
      oneSelect(value) {
        this.archStatueCode = statueTwoCode(value);
      },
      //搜索条件中的档案类型返回
      typeSelect(value, selectedData){
        this.searchArchType = value;
      },
      //清空搜索条件中的状态条件
      oneClear() {
        this.archStatueCode = ''
      },
      //搜索方法
      searchFunction(pageNum,pageSize){
        this.spinShow = true;
        this.axios.post('/api/loadArch/GroupArch', this.qs.stringify({
          archType: this.searchArchType[1],
          archStatue: this.archStatueCode,
          archNo: this.archNoKeyword,
          dispKeyword: this.dispatchKeyword,
          batch: this.batchData,
          regKeyword: this.regNoKeyword,
          check: false,
          page: pageNum,
          pageSize: pageSize
        })).then(res => {
          if(res.data.data === null){
            this.$Message.info('没有找到！');
            this.needToDoData = [];
            this.needToDoCount = 0;
          }else if (res.data.data.list.length === 0) {
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
      //搜索
      searchArch() {
        let result = archNoType.changeArchNoCondition(this.archNoKeyword);
        if (!result) {
          this.$Message.error('搜索档号区间，两档号类型不一致！')
        } else {
          this.searchFunction(this.needToDoPage,this.needToDoPageSize);
        }
      },
      //具体分类档案著录数据的搜索
      searchArch2() {
        if (this.showArchDataKeyword === '') {
          this.axiosArchNo(this.archTypeName);
        } else {
          this.axiosArchNo(this.showArchDataKeyword);
        }
      },
      //查询所有该登录者的待著录数据 -已弃用
      allWriteArch() {
        this.$refs.selectStatue.clearSingleSelect();
        this.archStatueCode = 1;
        this.needToDoPage = 1;
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            'archStatue': this.archStatueCode,
            'keyword': this.keyword,
            'page': this.needToDoPage,
            'pageSize': this.needToDoPageSize
          }
        }).then(res => {
          this.needToDoData = res.data.data.list;
          this.needToDoCount = res.data.data.total;
        })
      },
      //切换页码
      destPage(index) {
        this.needToDoPage = index;
        this.searchFunction(this.needToDoPage,this.needToDoPageSize);
      },
      //切换配置页
      changePageSize(index) {
        this.needToDoPageSize = index;
        this.searchFunction(this.needToDoPage,this.needToDoPageSize);
      },
      //刷新具体分类的档案著录数据
      reFlash() {
        this.spinShow2 = true;
        this.axios.get('/api/loadArch/getTpyeArch', {
          params: {
            type: this.archTypeName,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.total;
          this.spinShow2 = false;
        })
      },
      //切换页码
      destPage1(index) {
        this.currentPage = index;
        this.axios.get('/api/loadArch/getTpyeArch', {
          params: {
            type: this.archTypeName,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.total
        })
      },
      //切换配置页
      changePageSize1(index) {
        this.pageSize = index;
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            type: this.archTypeName,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.total
        })
      },
      //档案类型级联数据的名称显示格式
      Cascaderformat(label, selectedData) {
        return label[label.length-1];
      }
    },
    mounted() {
      //加载档案类型数据
      this.loadArchTypes();
      //加载登录者所在工作组全部档案数据
      this.loadGroupArch()
    }
  }

  //档案二级状态名转状态码
  function statueTwoCode(statue) {
    let statueName = null;
    if (statue === '待著录') {
      statueName = 1
    } else if (statue === '已著录') {
      statueName = 3
    } else if (statue === '不通过') {
      statueName = 6
    }
    return statueName
  }
</script>

<style scoped>
  /*著录界面的类型文字显示*/
  .archTypeText {
    float: right;
    font-size: 14px;
    padding-top: 7px;
    padding-right: 15px;
  }

  /*专业信息著录界面与选择类别界面的显示与隐藏*/
  .view {
    display: block
  }

  .hidd {
    display: none
  }

  /*表格字体大小*/
  .TableFontCss >>> .ivu-table {
    font-size: 14px;
  }
</style>
