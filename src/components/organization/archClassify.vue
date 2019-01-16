<template>
  <Row>
    <Row>
    <!-- 搜索 -->
    <Col span="22" offset="1" >
      <Form inline :label-width="80" label-position="left">
        <FormItem label="档案状态：">
          <Select v-model="statusdata" placeholder="待组卷" @on-change="handleSerach()" style="width:200px">
            <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem>
          <Input search enter-button placeholder="请输入档号，发文号进行搜索" style="width: 400px" v-model="keyword"
                 @keyup.enter.native="handleSerach()" @on-search="handleSerach()"/>
        </FormItem>
      </Form>
    </Col>
    </Row>

    <!--按钮-->
    <Row style="margin: 0px 0px 10px">
      <Col span="22" offset="1">
        <Button v-on:click="doArchClassify()" size="large"  type="primary">档案组卷</Button>
      </Col>
    </Row>

    <!-- 加载档案数据表格 -->
    <Row>
      <Col span="22" offset="1" align="center">
        <Table ref="table" border :columns="WAColumn" :data="WriterArchData"
               @on-select-all="selectAllData"
               @on-select="selectData"
               @on-select-cancel="cancelData"
               @on-select-all-cancel="cancelAllData"
               v-if="WriterArchData != null" height="600"></Table>
        <Page :total="totalCount"
              :current="currentPage"
              :page-size="pageSize"
              :page-size-opts="pso"
              @on-change="pageChange"
              @on-page-size-change="pageSizeChange"
              show-elevator show-total show-sizer/>
      </Col>
    </Row>
  </Row>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'archData',
    data () {
      return {
        statusdata:8,
        statusList:[
          {
            value:'8',
            label:'待组卷'
          },
          {
            value:'9',
            label:'组卷完成'
          },
          {
            value:'10',
            label:'全部'
          }
        ],
        keyword: '', // 搜索关键词（档号，发文号）
        tempData: [], //档案临时存储
        WriterArchData: [], // 档案数据临时集合
        pageSize: 10, // 分页插件：每页显示总数
        pso: [10, 20, 30, 50, 100], // 分页显示条数
        currentPage: 1, // 分页插件：当前页
        totalCount: 0, // 分页插件：总数量
        // 档案业务数据
        WAColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            key: 'archId'
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
            title: '发文号',
            key: 'dispatchDocNo'
          },
          {
            title: '立案号',
            key: 'registerNo'
          },
          {
            title: '档案一级状态',
            key: 'oneStatue',
            render: (h, params) => {
              let statue = onestatueDes(params.row.oneStatue)
              return h('div', statue)
            }
          },
          {
            title: '档案二级状态',
            key: 'twoStatue',
            render: (h, params) => {
              let statue = twostatueDes(params.row.twoStatue)
              return h('div', statue)
            }
          },
          {
            title: '创建人',
            key: 'importername'
          },
          {
            title: '导入日期',
            key: 'importDate',
            render: (h, params) => {
              // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
              let datadate = dateFormate(new Date(params.row.importDate))
              return h('div', datadate)
            }
          }
        ]
      }
    },
    methods: {
      //获取列表数据
      writeLayout (currentPage,pageSize) {
        let param = new URLSearchParams();
        param.append('pageNum', currentPage);
        param.append('pageSize', pageSize);
        param.append('searchItem', this.keyword);
        param.append('twoStatue', this.statusdata);
        axios({
          method: 'post',
          url: '/api/arch/getClassifyArchInfo',
          data: param
        }).then(res=>{
          this.WriterArchData = res.data.data.list;
          this.totalCount = res.data.data.total;
        })
      },
      //页码改变
      pageChange: function(index){
        this.currentPage=index
        this.writeLayout(this.currentPage,this.pageSize);
        this.tempData=[];
      },
      //页数改变
      pageSizeChange: function(index){
        this.pageSize = index
        this.writeLayout(this.currentPage, this.pageSize);
        this.tempData=[];
      },
      //组卷
      doArchClassify : function() {
        if(this.tempData.length==0){
          this.$Message.warning("请选择需要操作的记录");
          return false;
        }
        this.showing();
        this.axios.get('/api/arch/doArchClassify', {
          params: {
            'ids': this.tempData.toString()
          }
        }).then(res => {
          this.$Spin.hide();
          let successNum=this.tempData.length-res.data.length;
          let errorList='总操作数量：'+this.tempData.length+' 条'+'\n';
          errorList+='成功：'+successNum+' 条'+'\n';
          errorList+='失败：'+res.data.length+' 条'+'\n';
          if(res.data.length>0){
            errorList+='失败原因如下：'+'\n';
            for (let i=0;i<res.data.length;i++){
              errorList+=(i+1)+'.'+res.data[i]+'\n'
            }
          }
          this.tempData=[];
          this.$Notice.open({
            title: '档案组卷信息汇总  '+dateFormate(new Date()),
            desc: '',
            duration: 0,
            render: h => {
              return h('pre', errorList)
            }
          });
          this.handleSerach();
        }).catch(error => {
          this.$Spin.hide();
          this.tempData=[];
          console.log(error)
        })
      },
      // 选择单条记录
      selectData(selection, row) {
        this.tempData.push(row.archId)
      },
      // 选择所有记录
      selectAllData(selection) {
        for (let i = 0; i < selection.length; i++) {
          this.tempData.push(selection[i].archId)
        }
      },
      //取消某个记录
      cancelData(selection, row) {
        for (let i = 0; i < this.tempData.length; i++) {
          if (this.tempData[i] === row.archId) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      },
      //搜索
      handleSerach(){
        this.currentPage = 1;
        this.writeLayout(this.currentPage,this.pageSize);
      },
      //显示加载动画
      showing(){
        this.$Spin.show({
          render: (h) => {
            return h('div', [
              h('Icon', {
                'class': 'demo-spin-icon-load',
                props: {
                  type: 'ios-loading',
                  size: 36
                }
              }),
              h('div', '正在进行档案组卷，请勿刷新页面')
            ])
          }
        });
      }
    },
    mounted : function () {
      this.writeLayout(this.currentPage,this.pageSize)
    }
  }

  // 档案状态的转义
  function onestatueDes (statue) {
    let statueName = null
    if (statue === 0) {
      statueName = '整理（入库中）'
    } else if (statue === 1) {
      statueName = '在库'
    } else if (statue === 2) {
      statueName = '借阅中'
    } else if (statue === 3) {
      statueName = '出库'
    }
    return statueName
  }

  function twostatueDes (statue) {
    let statueName = null
    if(statue === 0){
      statueName = '待分配'
    } else if (statue === 1) {
      statueName = '已分配（待著录）'
    } else if (statue === 2) {
      statueName = '著录中'
    } else if (statue === 3) {
      statueName = '已著录（待质检）'
    } else if (statue === 4) {
      statueName = '质检中'
    }else if (statue === 5) {
      statueName = '质检通过（待上传）'
    }else if (statue === 6) {
      statueName = '质检不通过'
    }else if (statue === 7) {
      statueName = '上传中'
    }else if (statue === 8) {
      statueName = '已上传（组卷中）'
    }else if (statue === 9) {
      statueName = '组卷完成'
    }
    return statueName
  }

  // 时间格式转换
  // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
  function dateFormate (date) {
    if (date.getTime() === new Date('Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)').getTime()) {
      return ''
    }
    let datadate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
      ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return datadate
  }

</script>

<style>
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
  pre{
    line-height:15px;
    max-height: 600px;
    overflow: auto;
  }
  /*滚动条样式*/
  ::-webkit-scrollbar {/*滚动条整体样式*/
    width: 4px;
    height: 16px;
  }
  ::-webkit-scrollbar-thumb {/*滚动条里面小方块*/
    -webkit-box-shadow: inset 0 0 6px rgba(79, 79, 79, 0.32);
    border-radius: 10px;
    background-color: #2baee9;
  }
  ::-webkit-scrollbar-track {/*滚动条里面轨道*/
    border-radius: 10px;
    -webkit-box-shadow: inset 0 0 6px rgba(79, 79, 79, 0.32);
    background-color: #faeaff;
  }

</style>
