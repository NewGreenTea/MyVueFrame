<template>
  <Row style="margin: 0px 0px 50px;font-size: 14px;">
    <!-- 搜索条件 -->
    <Row>
      <Col span="22" offset="1">
        <Form inline :label-width="120" class="formClass-right">
          <FormItem label="档案状态：">
            <Select v-model="statusdata" placeholder="全部" @on-change="search" style="width:200px">
              <Option v-for="item in statusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
            </Select>
          </FormItem>
          <FormItem>
            <Input search enter-button placeholder="请输入档号，发文号进行搜索" style="width: 400px" v-model="keyword"
                   @keyup.enter.native="search" @on-search="search"/>
          </FormItem>
          <Tooltip placement="right" theme="light" max-width="200px" content="可使用冒号进行范围查询（例如“C3.1-2018-0001:D3.1-2018-0010”）">
            <Icon type="ios-help-circle-outline" size="30"/>
          </Tooltip>
          <Collapse>
            <Panel name="1">
              高级搜索
             <div slot="content">
                <div>
                  <FormItem label="立案号：">
                    <Input enter-button placeholder="" style="width: 300px" v-model="searchLah"
                           @keyup.enter.native="search" @on-search="search"/>
                  </FormItem>
                  <FormItem label="创建人：">
                    <Input enter-button placeholder="" style="width: 300px" v-model="searchCjr"
                           @keyup.enter.native="search" @on-search="search"/>
                  </FormItem>
                  <FormItem label="导入时间：">
                    <DatePicker format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择日期范围"
                                @on-change="dateFormat" v-model="searchDate" style="width: 300px"></DatePicker>
                  </FormItem>
                </div>
               <div>
                 <FormItem label="档案一级状态：">
                   <Select v-model="tstatusdata" placeholder="全部" @on-change="search" style="width:300px">
                     <Option v-for="item in tstatusList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                   </Select>
                 </FormItem>
               </div>
             </div>
            </Panel>
          </Collapse>

        </Form>
      </Col>
    </Row>

    <!-- 按钮 -->
    <Row style="margin: 20px 0px 10px">
      <Col span="1" offset="1">
          <Button type="primary" :loading="floading" size="large" @click="fm_print()">卷案封面打印</Button>
      </Col>
      <Col span="17" offset="1">
          <Button type="primary" :loading="jloading" size="large" @click="jnml_print()">卷内目录打印</Button>
      </Col>
    </Row>

    <!-- 加载档案数据表格 -->
    <Row>
    <Col span="22" offset="1" align="center">
      <Table class="TableFontCss" ref="table" border :columns="WAColumn" :data="WriterArchData"
             @on-select-all="selectAllData"
             @on-select="selectData"
             @on-select-cancel="cancelData"
             @on-select-all-cancel="cancelAllData"
             v-if="WriterArchData != null" height="580"></Table>
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
    name: 'archPrint',
    data(){
      return{
        /*table相关*/
        WAColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            key: 'archId'
          },
          {
            title: '序号',
            type: 'index',
            width: 70
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
        ],
        WriterArchData:[],
        tempData: [],
        /*分页插件*/
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        pso: [10, 20, 30, 50, 100],
        /*搜索表单*/
        //二级状态下拉选框
        statusdata:10,
        statusList:[
          {
            value:'10',
            label:'全部'
          },
          {
            value:'0',
            label:'待分配'
          },
          {
            value:'1',
            label:'待著录'
          },
          {
            value:'2',
            label:'著录中'
          },
          {
            value:'3',
            label:'待著录质检'
          },
          {
            value:'4',
            label:'待扫描质检'
          },
          {
            value:'5',
            label:'质检通过'
          },
          {
            value:'6',
            label:'质检不通过'
          },
          {
            value:'7',
            label:'上传中'
          },
          {
            value:'8',
            label:'待组卷'
          },
          {
            value:'9',
            label:'组卷完成'
          }
        ],
        //一级状态下拉选框
        tstatusdata:10,
        tstatusList:[
          {
            value:'10',
            label:'全部'
          },
          {
            value:'0',
            label:'整理（入库中）'
          },
          {
            value:'1',
            label:'在库'
          },
          {
            value:'2',
            label:'借阅中'
          },
          {
            value:'3',
            label:'出库'
          }
        ],
        keyword: '',
        searchDate:[],
        searchLah:'',
        searchCjr:'',
        /*加载动画控件*/
        floading:false,
        jloading:false
      }
    },
    methods : {
      //获取列表数据
      writeLayout(currentPage,pageSize){
        let param = new URLSearchParams();
        param.append('pageNum', currentPage);
        param.append('pageSize', pageSize);
        param.append('searchItem', this.keyword);
        param.append('registerNo', this.searchLah);
        param.append('importername', this.searchCjr);
        param.append('searchDate', this.searchDate);
        param.append('twoStatue', this.statusdata);
        param.append('oneStatue',this.tstatusdata);
        axios({
          method: 'post',
          url: '/api/arch/getprintArchInfo',
          data: param
        }).then(res=>{
          this.WriterArchData = res.data.data.list;
          this.totalCount = res.data.data.total;
        }).catch(error=>{
          this.$Message.error('数据错误')
        })
      },
      //页码改变
      pageChange: function(index){
        this.currentPage=index;
        this.writeLayout(this.currentPage,this.pageSize);
        this.tempData=[];
      },
      //页数改变
      pageSizeChange: function(index){
        this.pageSize = index;
        this.writeLayout(this.currentPage, this.pageSize);
        this.tempData=[];
      },
      search() {
        this.currentPage = 1;
        this.writeLayout(this.currentPage, this.pageSize);
      },
      fm_print(){
        if(this.tempData.length<=0){
          this.$Message.warning("请选择需要操作的记录")
          return false;
        }
        this.floading=true;
        let param = new URLSearchParams();
        param.append('ids', this.tempData);
        axios({
          method: 'post',
          url: '/api/upload/fmprint',
          data: param
        }).then(res=>{
          this.floading=false;
          if(res.data=='' || res.data==null || res.data=='nullData' ){
            this.$Message.warning("没有搜索到数据:(");
          }else {
            let printwindow=window.open(res.data);
            printwindow.print();
          }
        }).catch(error => {
          this.floading=false;
          this.$Message.error('数据错误')
        })
        this.tempData=[];
        this.$refs.table.selectAll(false);
      },
      jnml_print(){
        if(this.tempData.length<=0){
          this.$Message.warning("请选择需要操作的记录")
          return false;
        }
        this.jloading=true;
        let param = new URLSearchParams();
        param.append('ids', this.tempData);
        axios({
          method: 'post',
          url: '/api/upload/jnmlprint',
          data: param
        }).then(res=>{
          this.jloading=false;
          if(res.data=='' || res.data==null || res.data=='nullData' ){
            this.$Message.warning("没有搜索到数据:(");
          }else {
            let printwindow=window.open(res.data);
            printwindow.print();
          }
        }).catch(error => {
          this.jloading=false;
          this.$Message.error('数据错误')
        })
        this.tempData=[];
        this.$refs.table.selectAll(false);
      },
      // 选择单条记录
      selectData(selection, row) {
        this.tempData.push(row.archId);
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
      //批量转化时间
      dateFormat(){
        for (let i=0;i<this.searchDate.length;i++) {
          if(this.searchDate[i]==''){
            continue;
          }
          this.searchDate[i]=dateFormate(this.searchDate[i]);
        }
      }
    },
    mounted:function () {
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
  .boxdiv{
    font-size:20px;
    padding: 10px;
    margin: 40px 50px 10px;
    border: 1px rgba(193, 180, 198, 0.03) solid;
    box-shadow: 0px 0px 10px #888888;
  }
  .fmdydiv{
    font-size:16px;
    margin: 5px 5px 30px;
    padding: 5px;
    border: 1px #c64e53 dashed;
  }
  .jnmldiv{
    font-size:16px;
    margin: 10px 5px;
    padding: 5px;
    border: 1px #c64e53 dashed;
  }
</style>
