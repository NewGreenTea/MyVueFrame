<template>
  <Row style="margin: 0px 0px 50px;">
    <!-- 搜索条件 -->
    <Row>
      <Col span="22" offset="1">
        <Form inline :label-width="120" class="formClass-right" >
          <div style="margin: 10px 0px">
            <Input search enter-button placeholder="请输入iso名称进行搜索" style="width: 400px" v-model="keyword"
                   @keyup.enter.native="search" @on-search="search"/>
          </div>
          <Collapse>
            <Panel name="1">
              高级搜索
              <div slot="content">
                <div>
                  <FormItem label="生成时间：">
                    <DatePicker format="yyyy-MM-dd" type="daterange" placement="bottom-end" placeholder="请选择日期范围"
                                @on-change="dateFormat" v-model="searchDate" style="width: 300px"></DatePicker>
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
        <Button type="primary" :loading="downloadloading" size="large" @click="downloadISO">生成交接登记表</Button>
      </Col>
      <Col span="1" offset="1">
        <Button type="error" :loading="deleteloading" size="large" @click="deleteISO">删除ISO</Button>
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

    <!-- 隐藏窗口 查看案卷 -->
    <Modal v-model="ajmodal" draggable scrollable :title=ajtitle>
      <Table ref="ajtable" border :columns="AJColumn" :data="ajData"
             v-if="WriterArchData != null" height="580"></Table>
      <Page :total="ajtotalCount"
            :current="ajcurrentPage"
            :page-size="ajpageSize"
            :page-size-opts="ajpso"
            @on-change="ajpageChange"
            @on-page-size-change="ajpageSizeChange"
            show-elevator show-total show-sizer/>

    </Modal>
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
            key: 'isoId'
          },
          {
            title: '序号',
            type: 'index',
            width: 70
          },
          {
            title: 'iso名称',
            key: 'isoName'
          },
          {
            title: '生成日期',
            key: 'makeDate',
            render: (h, params) => {
              // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
              let datadate = dateFormate(new Date(params.row.makeDate))
              return h('div', datadate)
            }
          },
          {
            title: '制作人',
            key: 'makerName'
          },
          {
            title: 'iso路径',
            key: 'isoPath',
          },
          {
            title: '操作',
            key: 'isoId',
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px',
                    },
                    on: {
                      click: () => {
                        this.ajmodal=true;
                        this.tempid=params.row.isoId;
                        this.ajtitle="ISO编号："+params.row.isoName;
                        this.writeAjLayout(this.ajcurrentPage,this.ajpageSize);
                      }
                    }
                  }, '查看案卷')
              ])
            }
          }
        ],
        /*案卷table*/
        AJColumn:[
          {
            title: '档案号',
            align: 'center',
            key: 'archNo'
          },
          {
            title: '发文号',
            align: 'center',
            key: 'dispatchDocNo'
          },
          {
            title: '立案号',
            align: 'center',
            key: 'registerNo'
          },
        ],
        WriterArchData:[],
        ajData:[],
        tempData: [],
        //用于保存查看案卷的id
        tempid:'',
        /*分页插件*/
        currentPage: 1,
        totalCount: 0,
        pageSize: 10,
        pso: [10, 20, 30, 50, 100],
        ajcurrentPage: 1,
        ajtotalCount: 0,
        ajpageSize: 10,
        ajpso: [10, 20, 30, 50, 100],
        /*搜索表单*/
        keyword: '',
        searchDate:[],
        /*加载动画控件*/
        downloadloading:false,
        deleteloading:false,
        /*隐藏modl控件*/
        ajmodal:false,
        ajtitle:''
      }
    },
    methods : {
      //获取列表数据
      writeLayout(currentPage,pageSize){
        let param = new URLSearchParams();
        param.append('pageNum', currentPage);
        param.append('pageSize', pageSize);
        param.append('searchItem', this.keyword);
        param.append('searchDate', this.searchDate);
        axios({
          method: 'post',
          url: '/api/iso/getIsoInfoList',
          data: param
        }).then(res=>{
          this.WriterArchData = res.data.data.list;
          this.totalCount = res.data.data.total;
        })
      },
      writeAjLayout(currentPage,pageSize){
        let param = new URLSearchParams();
        param.append('pageNum', currentPage);
        param.append('pageSize', pageSize);
        param.append('isoid', this.tempid);
        axios({
          method: 'post',
          url: '/api/iso/getArchListByIso',
          data: param
        }).then(res=>{
          this.ajData = res.data.data.list;
          this.ajtotalCount = res.data.data.total;
        })
      },
      //页码改变
      pageChange: function(index){
        this.currentPage=index;
        this.writeLayout(this.currentPage,this.pageSize);
        this.tempData=[];
      },
      ajpageChange: function(index){
        this.ajcurrentPage=index;
        this.writeLayout(this.ajcurrentPage,this.ajpageSize);
      },
      //页数改变
      pageSizeChange: function(index){
        this.pageSize = index;
        this.writeLayout(this.currentPage, this.pageSize);
        this.tempData=[];
      },
      ajpageSizeChange: function(index){
        this.ajpageSize = index;
        this.writeLayout(this.ajcurrentPage, this.ajpageSize);
      },
      search() {
        this.currentPage = 1;
        this.writeLayout(this.currentPage, this.pageSize);
      },
      /*下载iso*/
      downloadISO(){
        if(this.tempData.length<=0){
          this.$Message.warning("请选择需要操作的记录");
          return false;
        }
        this.downloadloading=true;
        let param = new URLSearchParams();
        param.append('isoids', this.tempData);
        axios({
          method: 'post',
          url: '/api/iso/downloadIso',
          data: param
        }).then(res=>{
          this.downloadloading=false;
          this.tempData=[];
          this.$refs.table.selectAll(false);
          this.$Message.success("交接清单生成成功");
        })
      },
      /*删除iso*/
      deleteISO(){

      },
      // 选择单条记录
      selectData(selection, row) {
        this.tempData.push(row.isoId);
      },
      // 选择所有记录
      selectAllData(selection) {
        for (let i = 0; i < selection.length; i++) {
          this.tempData.push(selection[i].isoId)
        }
      },
      //取消某个记录
      cancelData(selection, row) {
        for (let i = 0; i < this.tempData.length; i++) {
          if (this.tempData[i] === row.isoId) {
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
  .demo-spin-icon-load{
    animation: ani-demo-spin 1s linear infinite;
  }
</style>
