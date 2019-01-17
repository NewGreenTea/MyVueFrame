<template>
  <Row>
    <!-- 搜索 -->
    <Row>
      <Col span="22" offset="1">
        <Form>
          <Row>
            <Col span="6">
              <FormItem>
                <Input search enter-button placeholder="请输入档号，发文号进行搜索" v-model="keyword" style="width: 400px"
                       @keyup.enter.native="handleSerach()" @on-search="handleSerach()"/>
              </FormItem>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

    <!--按钮-->
    <Row style="margin: 0px 0px 10px">
      <Col span="1" offset="1">
        <Button v-on:click="smpass()" size="large"  type="success">扫描质检通过</Button>
      </Col>
      <Col span="15" offset="1">
        <Button v-on:click="smfail()" size="large"  type="error">扫描质检不通过</Button>
      </Col>
    </Row>

    <!-- 加载档案数据表格 -->
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

    <!--隐藏窗口-->
    <Modal
      v-model="checkmodal"
      :title=archno
      @on-ok="inputok"
      @on-cancel="inputcancel">
      <Input v-model="bzinput" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注信息..." />
    </Modal>
    <Modal
      v-model="checkmodals"
      title="批量操作，质检不通过"
      @on-ok="inputoks"
      @on-cancel="inputcancels">
      <Input v-model="bzinput" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请输入备注信息..." />
    </Modal>

  </Row>
</template>

<script>
    import axios from 'axios';
    export default {
      name: "archCheck",
      data () {
        return {
          checkmodal: false,
          checkmodals:false,
          bzinput:'',//备注输入框
          bzid:'',//用于备注输入传ID给后台
          archno:'',
          keyword: '', // 搜索关键词（档号，创建人，批次等）
          tempData: [], //档案ID临时存储
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
            },
            {
              title: '质检状况',
              key: 'archId',
              render: (h, params) => {
                return h('div', [
                  h('Button',
                    {
                      props: {
                        type: 'success', size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          let param = new URLSearchParams();
                          param.append('ids', params.row.archId);
                          axios({
                            method: 'post',
                            url: '/api/arch/smcheckpass',
                            data: param
                          }).then(res=>{
                              this.$Message.success("操作成功");
                              this.handleSerach();
                            }
                          )
                        }
                      }
                    }, '通过'),
                  h('Button',
                    {
                      props: {
                        type: 'error', size: 'small'
                      },
                      style: {
                        marginRight: '5px'
                      },
                      on: {
                        click: () => {
                          this.bzid=params.row.archId
                          this.archno="档号："+params.row.archNo
                          this.checkmodal = true
                        }
                      }
                    }, '不通过'),
                ])
              }
            }
          ]
        }
      },
      methods: {
        //获取列表数据
        writeLayout(currentPage,pageSize) {
          let param = new URLSearchParams();
          param.append('pageNum', currentPage);
          param.append('pageSize', pageSize);
          param.append('searchItem', this.keyword);
          axios({
            method: 'post',
            url: '/api/arch/getsmcheckArchInfo',
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
        //不通过备注
        inputok : function(){
          let param = new URLSearchParams();
          param.append('ids', this.bzid);
          param.append('bz', this.bzinput);
          axios({
            method: 'post',
            url: '/api/arch/smcheckfail',
            data: param
          }).then(res=>{
              this.$Message.success("操作成功");
              this.handleSerach();
            }
          )
          this.bzid='';
          this.bzinput='';
        },
        //批量质检通过按钮
        smpass : function() {
          if(this.tempData.length==0){
            this.$Message.warning("请选择需要操作的记录");
            return false;
          }
          let param = new URLSearchParams()
          param.append('ids', this.tempData)
          axios({
            method: 'post',
            url: '/api/arch/smcheckpass',
            data: param
          }).then(res=>{
              this.$Message.success("操作成功");
              this.handleSerach();
          })
          this.tempData=[];
        },
        inputcancel : function(){
          this.bzid='';
          this.bzinput='';
        },
        //批量质检不通过按钮
        smfail : function() {
          if(this.tempData.length==0){
            this.$Message.warning("请选择需要操作的记录");
            return false;
          }
          this.checkmodals=true;
        },
        //批量不通过备注
        inputoks : function(){
          let param = new URLSearchParams();
          param.append('ids', this.tempData);
          param.append('bz', this.bzinput);
          axios({
            method: 'post',
            url: '/api/arch/smcheckfail',
            data: param
          }).then(res=>{
              this.$Message.success("操作成功");
              this.handleSerach();
            }
          )
          this.bzinput='';
        },
        inputcancels : function(){
          this.bzinput='';
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
                h('div', '组卷中')
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

<style scoped>

</style>
