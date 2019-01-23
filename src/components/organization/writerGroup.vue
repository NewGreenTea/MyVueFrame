<template>
  <div>
    <div :class="loadData">
      <Row>
        <!-- 加载档案数据待著录条件框 -->
        <Col span="20" offset="2">
          <Form class="conditionFormFront">
            <Row>
              <Col span="2">
                <FormItem>
                  <h2>筛选条件:</h2>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Input placeholder="档号等" v-model="keyword"/>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Row>
                    <Col span="10" offset="2">
                      档案状态：
                    </Col>
                    <Col span="12">
                      <Select placeholder="状态" @on-change="oneSelect" :clearable="true" @on-clear="oneClear" ref="selectStatue">
                        <Option :key="item" v-for="item in twoStatues" :value="item">{{item}}</Option>
                      </Select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="13" offset="1">
                <FormItem>
                  <Row>
                    <Col span="4">
                      <Button type="primary" @click="searchArch">搜索</Button>
                    </Col>
                    <Col span="6" offset="14">
                      <Button type="primary" @click="allWriteArch">待著录档案</Button>
                    </Col>
                  </Row>
                </FormItem>
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

      <Row style="margin-top: 20px">
        <!-- 选择类别 -->
        <Col span="2"><span class="archTypeText">选择著录类别：</span></Col>
        <Col span="20">
          <Row :gutter="16">
            <Col v-for="type in archOneTypes" :key="type.index" span="4">
              <Button size="large" long @click="showTwoTypes(type)">{{type}}</Button>
            </Col>
          </Row>
        </Col>
      </Row>
      <Row v-if="showTwoType" style="margin-top: 30px">
        <Col span="2"><span class="archTypeText">选择详细类别：</span></Col>
        <Col span="20">
          <Row :gutter="16">
            <Col v-for="type in archTwoTypes" :key="type.index" span="8" style="margin-top: 7px;margin-bottom: 7px">
              <Button size="large" long style="text-align: left" @click="writeLayout(type)">{{type.className}}</Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <Row v-if="showArchData" style="margin-top: 20px;">
        <!-- 加载档案数据表格 -->
        <Col span="20" offset="2" class="TableFontCss">
          <Table border :columns="columns" :data="tableData"></Table>
          <Page :current="currentPage" :total="totalCount" :page-size="pageSize" show-elevator show-total show-sizer
                :page-size-opts="pageSizeOpt" @on-change="destPage1" @on-page-size-change="changePageSize1"/>
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
          <BaseInfo @changeShowView="showView" :BaseParams="baseParams"></BaseInfo>
        </div>
      </keep-alive>
      <keep-alive>
        <div v-if="viewName === 'ProfInfo'">
          <ProfInfo @changeShowView="showView" :ProfParams="profParams"></ProfInfo>
        </div>
      </keep-alive>
      <keep-alive>
        <div v-if="viewName === 'FileInfo'">
          <FileInfo @changeShowView="showView" :FileParams="fileParams"></FileInfo>
        </div>
      </keep-alive>
    </div>
  </div>
</template>

<script>
  import BaseInfo from "../writeLayout/BaseInfo";
  import FileInfo from "../writeLayout/FileInfo";
  import ProfInfo from "../writeLayout/ProfInfo";

  export default {
    name: 'writerGroup',
    components: {ProfInfo, FileInfo, BaseInfo},
    data() {
      return {
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
        }, // todo
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
              let statue = statueTwoDes(params.row.twoStatue);
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
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.viewName = 'BaseInfo';
                              this.showWriteData = true;
                              this.baseParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                registerNo: params.row.registerNo,
                                dispatchDocNo: params.row.dispatchDocNo,
                                archTypeID: this.archTypeID,
                                archTypeName: this.archTypeName,
                                archInputDate: params.row.inputDate,
                                operation: true
                              }
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.modalTitle = '基本信息已完成';
                              this.viewName = 'BaseInfo';
                              this.baseParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                registerNo: params.row.registerNo,
                                dispatchDocNo: params.row.dispatchDocNo,
                                archTypeID: this.archTypeID,
                                archTypeName: this.archTypeName,
                                archInputDate: params.row.inputDate,
                                operation: false
                              }
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
                              this.showWriteData = true;
                              this.profParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: this.archTypeID,
                                archType: writeVueLayout(params.row.archNo),
                                operation: true
                              }
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.viewName = 'ProfInfo';
                              this.modalTitle = '专业信息已完成';
                              this.profParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: this.archTypeID,
                                archType: writeVueLayout(params.row.archNo),
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
                              this.showWriteData = true;
                              this.viewName = 'FileInfo';
                              this.fileParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: this.archTypeID,
                                operation: true
                              }
                              // this.$router.push({
                              //     name: this.viewName,
                              //     params: {
                              //       archId: params.row.archId, //传递一些重要参数给下一个界面
                              //       archNo: params.row.archNo,
                              //       archTypeID: this.archTypeID,
                              //       operation: true
                              //     }
                              //   })
                            } else {
                              this.showModal = true;
                              this.viewName = 'FileInfo';
                              this.modalTitle = '文件信息已完成';
                              this.fileParams = {
                                archId: params.row.archId, //传递一些重要参数给下一个界面
                                archNo: params.row.archNo,
                                archTypeID: this.archTypeID,
                                operation: false
                              }
                              // this.pushConf = {
                              //     name: this.viewName,
                              //     params: {
                              //       archId: params.row.archId, //传递一些重要参数给下一个界面
                              //       archNo: params.row.archNo,
                              //       archTypeID: this.archTypeID,
                              //       operation: false
                              //     }
                              //   }
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
            title: '档号',
            render: (h, params) => {
              return h('p', params.row.archVO.archNo)
            }
          },
          {
            title: '档号状态',
            render: (h, params) => {
              return h('p', statueTwoDes(params.row.archVO.twoStatue))
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
                  } else {
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
                          // 修改档案状态，变为已著录/待质检的状态
                          this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({archID: params.row.archId}))
                          .then(res => {
                            this.loadGroupArch();
                            this.axios.get('/api/loadArch/getTpyeArch', {
                              params: {
                                type: this.archTypeName,
                                page: this.currentPage,
                                pageSize: this.pageSize
                              }
                            }).then(res => {
                              this.tableData = res.data.data.list;
                              this.totalCount = res.data.data.total;
                              this.spinShow = false;
                            })
                            })
                        }
                      }
                    }, '确认完成');
                    return h('p', params.row.archVO.twoStatue)
                  }
                }
              }
            }
          }
        ],
        //工作组著录分页配置
        needToDoPage: 1,
        needToDoCount: 0,
        needToDoPageSize: 5,
        needToDoPSO: [1, 2, 3, 4, 5, 6, 8, 10],
        //用户信息id
        userID: this.$store.state.userID,
        //查询档案二级状态码
        archStatueCode: 1,
        //档号查询关键字
        keyword: '',
        //查看待档案著录数据表格的加载动画
        spinShow: false
      }
    },
    methods: {
      //加载工作组负责的待著录档案数据
      loadGroupArch() {
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            'archStatue': this.archStatueCode,
            'keyword': this.keyword,
            'page': this.needToDoPage,
            'pageSize': this.needToDoPageSize
          }
        }).then(res => {
            this.needToDoData = res.data.data.list;
            this.needToDoCount = res.data.data.total
          }
        )
      },
      // 显示一级分类
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
      // 显示著录列表数据
      writeLayout(type) {
        this.showTwoType = false;
        this.showArchData = true;
        this.axios.get('/api/loadArch/getTpyeArch', {
          params: {
            type: type.className,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.archTypeID = type.id;
          this.archTypeName = type.className;
          this.tableData = res.data.data.list;
          this.totalCount = res.data.data.total
        })
      },
      // 显示著录列表，隐藏著录界面
      showView() {
        this.showWriteData = false;
        this.loadData = {
          view: true,
          hidd: false
        };
        this.loadGroupArch()
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
      //清空搜索条件中的状态条件
      oneClear(){
        this.archStatueCode = ''
      },
      //搜索条件中的点击搜索按钮
      searchArch() {
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
          this.$refs.selectStatue.clearSingleSelect();
        })
      },
      //查询所有该登录者的待著录数据
      allWriteArch(){
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
        this.spinShow = true;
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
          this.spinShow = false;
        })
      },
      //切换配置页
      changePageSize(index) {
        this.needToDoPageSize = index;
        this.spinShow = true;
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
          this.spinShow = false;
        })
      },
      //著录数据表格分页方法  //待测试
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
    },
    mounted() {
      this.loadOneTypes();
      this.loadGroupArch();
    }
  }

  //档案二级状态解释说明
  function statueTwoDes(statue) {
    let statueName = null;
    if (statue === 1) {
      statueName = '待著录'
    } else if (statue === 3) {
      statueName = '已著录'
    } else if (statue === 6) {
      statueName = '不通过'
    }
    return statueName
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

  // 把C6.1 XXXXXXX变成C61，跳转到相应的著录专业信息界面有用
  function writeVueLayout(type) {
    let index = type.indexOf("-");
    let archType = type.substring(0, index).replace('\.', '');
    return archType
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

  /*条件显示样式*/
  .conditionFormFront >>> .ivu-form-item-content {
    font-size: 15px;
  }

  .conditionFormFront >>> .ivu-input {
    font-size: 14px;
  }
</style>
