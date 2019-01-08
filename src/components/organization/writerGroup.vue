<template>
  <div>
    <div :class="loadData">
      <Row>
        <!-- 加载档案数据待著录条件框 -->
        <Col style="margin-left: 20px;margin-right: 20px">
          <Form>
            <Row>
              <Col span="2">
                <FormItem>
                  <Button type="success">筛选条件</Button>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Input placeholder="档号等"/>
                </FormItem>
              </Col>
              <Col span="4">
                <FormItem>
                  <Row>
                    <Col span="7" offset="5">
                      档案状态：
                    </Col>
                    <Col span="12">
                      <i-select placeholder="状态">
                        <i-option :key="item" v-for="item in twoStatues" :value="item">{{item}}</i-option>
                      </i-select>
                    </Col>
                  </Row>
                </FormItem>
              </Col>
              <Col span="2" offset="1">
                <FormItem>
                  <Button type="primary">搜索</Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <!-- 加载档案数据待著录表格 -->
        <Col>
          <Table border :columns="needToDoColumns" :data="needToDoData"></Table>
          <Page :current="needToDoPage" :total="needToDoCount" :page-size="needToDoPageSize" show-elevator show-total
                show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="needToDoPSO"/>
        </Col>

        <!-- 选择类别 -->
        <Col>选择著录类别</Col>
        <Col span="2">&nbsp;</Col>
        <Col v-for="type in archOneTypes" :key="type.index" span="4">
          <Button size="large" long @click="showTwoTypes(type)">{{type}}</Button>
        </Col>
        <Col span="2">&nbsp;</Col>
      </Row>
      <Row v-if="showTwoType" style="margin-top: 30px">
        <!--<Col span="1">&nbsp;</Col>-->
        <Col v-for="type in archTwoTypes" :key="type.index" span="8">
          <Button size="large" long style="text-align: left" @click="writeLayout(type)">{{type.className}}</Button>
        </Col>
        <!--<Col span="1">&nbsp;</Col>-->
      </Row>

      <Row v-if="showArchData" style="margin-top: 20px;">
        <!-- 加载档案数据表格 -->
        <Col style="margin-left: 20px;margin-right: 20px">
          <Table border :columns="columns" :data="tableData"></Table>
          <!--todo 还没完全做好，待完善 2018/12/6-->
          <Page :current="currentPage" :total="totalCount" :page-size="pageSize" show-elevator show-total show-sizer
                :page-size-opts="pageSizeOpt"/>
        </Col>
      </Row>
    </div>

    <!-- 完成著录后是否进入修改提示框 -->
    <Modal v-model="showModal" :title="modalTitle" @on-ok="tips" @on-cancel="cancelTips">
      <div>
        是否进入为修改操作?
      </div>
    </Modal>

    <!-- 著录档案信息的路由界面 -->
    <div v-if="showWriteData">
      <router-view :name="viewName" @changeShowView="showView"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'writerGroup',
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
        twoStatues: ['待著录', '已著录'], // 档案状态搜索
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
            type: 'index'
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
            title: '档号状态',
            key: 'twoStatue',
            render: (h, params) => {
              let statue = statueTwoDes(params.row.twoStatue);
              return h('div', statue)
            }
          },
          {
            title: '基本信息',
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
                        this.viewName = 'BaseInfo';
                        // 判断基本信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/baseInfo/existBaseInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.showWriteData = true;
                              this.$router.push(
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    registerNo: params.row.registerNo,
                                    dispatchDocNo: params.row.dispatchDocNo,
                                    archTypeID: this.archTypeID,
                                    archTypeName: this.archTypeName,
                                    operation: true
                                  }
                                })
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.modalTitle = '基本信息已完成';
                              this.pushConf =
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    registerNo: params.row.registerNo,
                                    dispatchDocNo: params.row.dispatchDocNo,
                                    archTypeID: this.archTypeID,
                                    archTypeName: this.archTypeName,
                                    operation: false
                                  }
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
            title: '专业信息',
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
                        this.viewName = 'ProfInfo';
                        // 判断专业信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/profInfo/existProfInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.showWriteData = true;
                              this.$router.push(
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    archTypeID: this.archTypeID,
                                    archType: writeVueLayout(params.row.archNo),
                                    operation: true
                                  }
                                })
                            } else { //res.data.data === 1 的时候
                              this.showModal = true;
                              this.modalTitle = '专业信息已完成';
                              this.pushConf =
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    archTypeID: this.archTypeID,
                                    archType: writeVueLayout(params.row.archNo),
                                    operation: false
                                  }
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
                        this.viewName = 'FileInfo';
                        // 判断文件信息是否完成著录，是则“修改”，否则“添加”
                        this.axios.get('/api/fileInfo/existFileInfo', {params: {archId: params.row.archId}})
                          .then(res => {
                            if (res.data.data === 0) {
                              this.loadData = {
                                view: false,
                                hidd: true
                              };
                              this.showWriteData = true;
                              this.$router.push(
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    archTypeID: this.archTypeID,
                                    operation: true
                                  }
                                })
                            } else {
                              this.showModal = true;
                              this.modalTitle = '文件信息已完成';
                              this.pushConf =
                                {
                                  name: this.viewName,
                                  params: {
                                    archId: params.row.archId, //传递一些重要参数给下一个界面
                                    archNo: params.row.archNo,
                                    archTypeID: this.archTypeID,
                                    operation: false
                                  }
                                }
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
            type: 'index'
          },
          {
            title: '档号',
            render: (h, params) => {
              return h('p',params.row.archVO.archNo)
            }
          },
          {
            title: '档号状态',
            render: (h, params) => {
              return h('p',statueTwoDes(params.row.archVO.twoStatue))
            }
          },
          {
            title: '操作状态',
            render: (h, params) => {
              //判断档案著录进行到哪一步，是否完成著录
              if(params.row.baseCode === 0 && params.row.profCode === 0 && params.row.fileCode === 0){
                return h('p','待著录')
              }
              else{
                if(params.row.baseCode !== 0 && params.row.profCode === 0 && params.row.fileCode === 0){
                  return h('p', '专业信息和文件信息未著录')
                }else if(params.row.baseCode === 0 && params.row.profCode !== 0 && params.row.fileCode === 0){
                  return h('p', '基本信息和文件信息未著录')
                }else if(params.row.baseCode === 0 && params.row.profCode === 0 && params.row.fileCode !== 0){
                  return h('p', '基本信息和专业信息未著录')
                }else if(params.row.baseCode !== 0 && params.row.profCode !== 0 && params.row.fileCode === 0){
                  return h('p', '文件信息未著录')
                }else if(params.row.baseCode !== 0 && params.row.profCode === 0 && params.row.fileCode !== 0){
                  return h('p', '专业信息未著录')
                }else if(params.row.baseCode === 0 && params.row.profCode !== 0 && params.row.fileCode !== 0){
                  return h('p', '基本信息未著录')
                }else{
                  return h('button', {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        // 修改档案状态，变为已著录/待质检的状态
                        this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({archID: params.row.archId}))
                          .then(res =>{
                            this.loadGroupArch()
                          })
                      }
                    }
                  },'确认完成')
                }
              }

              return h('p',params.row.archVO.twoStatue)
            }
          }
        ],
        //工作组著录分页配置
        needToDoPage: 1,
        needToDoCount: 0,
        needToDoPageSize: 5,
        needToDoPSO: [1,2,3,4,5,6,8,10],
        //用户信息id
        userID: this.$store.state.userID
      }
    },
    methods: {
      //加载工作组负责的待著录档案数据
      loadGroupArch(){
        if(this.userID === ''){
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch',{
          params:{
            'userID': this.userID,
            'page': this.needToDoPage,
            'pageSize':this.needToDoPageSize}
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
        this.$router.push(this.pushConf)
      },
      // 取消进入修改界面
      cancelTips() {
        // this.showWriteData = false
        // this.loadData = {
        //   view: true,
        //   hidd: false
        // }
      },
      //切换页码
      destPage(index){
        this.needToDoPage = index;
        if(this.userID === ''){
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch', {
          params:{
            'userID': this.userID,
            'page': this.needToDoPage,
            'pageSize':this.needToDoPageSize}
        }).then(res => {
          this.needToDoData = res.data.data.list;
          this.needToDoCount = res.data.data.total
        })
      },
      //切换配置页
      changePageSize(index){
        this.needToDoPageSize = index;
        if(this.userID === ''){
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch', {
          params:{
            'userID': this.userID,
            'page': this.needToDoPage,
            'pageSize':this.needToDoPageSize}
        }).then(res => {
          this.needToDoData = res.data.data.list;
          this.needToDoCount = res.data.data.total
        })
      }
    },
    mounted() {
      this.loadOneTypes();
      this.loadGroupArch();
    }
  }

  //档案二级状态解释说明
  function statueTwoDes(statue) {
    let statueName = null;
    // if (statue === 2) {
    //   statueName = '著录中'
    // } else
      if (statue === 1) {
      statueName = '待著录'
    } else if (statue === 3) {
      statueName = '已著录'
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
  .view {
    /*visibility: visible;*/
    display: block
  }

  .hidd {
    /*visibility: hidden;*/
    display: none
  }
</style>
