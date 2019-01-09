<template>
  <div>
    <div :class="loadData">
    <Row>
      <!-- 加载档案数据待质检表格 -->
      <Col>
        <Table border :columns="needToDoColumns" :data="needToDoData"></Table>
        <Page :current="needToDoPage" :total="needToDoCount" :page-size="needToDoPageSize" show-elevator show-total
              show-sizer @on-change="destPage" @on-page-size-change="changePageSize" :page-size-opts="needToDoPSO"/>
      </Col>

      <Row>
        <!-- 选择类别 -->
        <Col>选择著录质检类别</Col>
        <Col span="2">&nbsp;</Col>
        <Col v-for="type in archOneTypes" :key="type.index" span="4">
          <Button size="large" long @click="showTwoTypes(type)">{{type}}</Button>
        </Col>
        <Col span="2">&nbsp;</Col>
      </Row>
      <Row v-if="showTwoType" style="margin-top: 30px">
        <Col v-for="type in archTwoTypes" :key="type.index" span="8">
          <Button size="large" long style="text-align: left" @click="writeLayout(type)">{{type.className}}</Button>
        </Col>
      </Row>

      <!-- 加载档案数据表格 -->
      <Row v-if="showArchData" style="margin-top: 20px;">
        <Col style="margin-left: 20px;margin-right: 20px">
          <Table border :columns="columns" :data="tableData"></Table>
          <Page :current="currentPage" :total="totalCount" :page-size="pageSize" show-elevator show-total show-sizer
                :page-size-opts="pageSizeOpt"/>
        </Col>
      </Row>
    </Row>
    </div>

    <!-- 质检档案信息的路由界面 -->
    <div v-if="showWriteData">
      <router-view :name="viewName" @changeShowView="showView"></router-view>
    </div>
  </div>
</template>

<script>
  export default {
    name: "checkWrite",
    data() {
      return {
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
            title: '序号',
            type: 'index'
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
          }
        ],
        needToDoData: [],
        //工作组质检分页配置
        needToDoPage: 1,
        needToDoCount: 0,
        needToDoPageSize: 5,
        needToDoPSO: [1, 2, 3, 4, 5, 6, 8, 10],
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
                        this.showWriteData = true;
                        this.$router.push({
                          name: this.viewName,
                          params: {
                            archId: params.row.archId, //传递一些重要参数给下一个界面
                            classId: this.archTypeID,
                            archType: writeVueLayout(params.row.archNo)
                          }
                        });
                      }
                    }
                  }, '查看')
                ]
              )
            }
          }
        ],
        tableData: [],
        //
        loadData: {
          view: true,
          hidd: false
        }, // todo
        //
        userID: ''
      }
    },
    methods: {
      //加载工作组负责的待质检档案数据
      loadGroupArch() {
        if (this.userID === '') {
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            'userID': this.userID,
            'archStatue': 3,
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
        this.axios.get('/api/loadArch/toWriteCheckArch', {
          params: {
            type: type.className,
            page: this.currentPage,
            pageSize: this.pageSize
          }
        }).then(res => {
          this.archTypeID = type.id;
          this.archTypeName = type.className;
          if(res.data.data.list.length === 0){
            this.tableData = [];
          }else{
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
        this.loadGroupArch();
        this.writeLayout(type);
      },
      //切换页码
      destPage(index) {
        this.needToDoPage = index;
        if (this.userID === '') {
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            'userID': this.userID,
            'page': this.needToDoPage,
            'pageSize': this.needToDoPageSize
          }
        }).then(res => {
          this.needToDoData = res.data.data.list;
          this.needToDoCount = res.data.data.total
        })
      },
      //切换配置页
      changePageSize(index) {
        this.needToDoPageSize = index;
        if (this.userID === '') {
          this.userID = window.localStorage.getItem('userid')
        }
        this.axios.get('/api/loadArch/getGroupArch', {
          params: {
            'userID': this.userID,
            'page': this.needToDoPage,
            'pageSize': this.needToDoPageSize
          }
        }).then(res => {
          this.needToDoData = res.data.data.list;
          this.needToDoCount = res.data.data.total
        })
      },
    },
    mounted() {
      this.loadGroupArch();
      this.loadOneTypes()
    }
  }

  //档案二级状态解释说明
  function statueTwoDes(statue) {
    let statueName = null;
    if (statue === 3) {
      statueName = '待著录质检'
    } else if (statue === 4) {
      statueName = '已著录质检'
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
    display: block
  }

  .hidd {
    display: none
  }
</style>
