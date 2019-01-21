<template>
  <Row class="WriteLayoutFont">
    <!-- 筛选条件表格 -->
    <Col span="22" offset="1">
      <!-- 搜索条件表单 -->
      <Form>
        <Row type="flex"><!-- 搜索条件表单：第一行 -->
          <Col span="2">
            <FormItem>
              <Button type="success">筛选条件</Button>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Row>
                <Col span="12">
                  档案状态：
                </Col>
                <Col span="12">
                  <Select placeholder="状态" v-model="archOS" @on-change="closeSelect">
                    <Option :key="item" v-for="item in oneStatues" :value="item">{{item}}</Option>
                  </Select>
                  <Select placeholder="状态" v-model="archTS" @on-change="closeSelect" v-if="showATS">
                    <Option :key="item" v-for="item in twoStatues" :value="item">{{item}}</Option>
                  </Select>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem>
              <Row>
                <Col span="11">
                  <Row>
                    <Col span="12">
                      日期类型：
                    </Col>
                    <Col span="12">
                      <i-select placeholder="日期">
                        <i-option :key="item" v-for="item in DateType" :value="item">{{item}}</i-option>
                      </i-select>
                    </Col>
                    <Col span="12" v-if="showTSD">
                      &nbsp;
                    </Col>
                    <Col span="12" v-if="showTSD">
                      <i-select placeholder="日期">
                        <i-option :key="item" v-for="item in DateType" :value="item">{{item}}</i-option>
                      </i-select>
                    </Col>
                    <Col span="12" v-if="showSSD">
                      &nbsp;
                    </Col>
                    <Col span="12" v-if="showSSD">
                      <i-select placeholder="日期">
                        <i-option :key="item" v-for="item in DateType" :value="item">{{item}}</i-option>
                      </i-select>
                    </Col>
                  </Row>
                </Col>
                <Col span="13">
                  <DatePicker type="daterange" placement="bottom-end" placeholder="Select date"
                              style="width: 200px" v-model="firstDate"></DatePicker>
                  <Icon type="ios-add" size="20" color="red" @click="addSearchDate"/>
                </Col>
                <Col span="13" v-if="showTSD">
                  <DatePicker type="daterange" placement="bottom-end" placeholder="Select date"
                              style="width: 200px" v-model="secondDate"></DatePicker>
                  <Icon type="ios-remove" size="20" color="red" @click="removeSD(1)"/>
                </Col>
                <Col span="13" v-if="showSSD">
                  <DatePicker type="daterange" placement="bottom-end" placeholder="Select date"
                              style="width: 200px" v-model="thirdDate"></DatePicker>
                  <Icon type="ios-remove" size="20" color="red" @click="removeSD(2)"/>
                </Col>
              </Row>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <Input search placeholder="档号，发文号，创建人等" v-model="keyword" clearable/>
            </FormItem>
          </Col>
          <Col span="3" align="bottom">
            <FormItem>
              <Button type="primary">确定</Button>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Col>
    <!-- 加载档案数据表格 -->
    <Col span="22" offset="1">
      <Table ref="table" border :columns="WAColumn" :data="WriterArchData"
             v-if="WriterArchData != null"></Table>
      <Page :total="archDataCount" :page-size="pageSize" show-elevator show-total show-sizer
            @on-change="destPage" @on-page-size-change="changePage" :page-size-opts="pso"/>
    </Col>
  </Row>
</template>

<script>
export default {
  name: 'archData',
  data () {
    return {
      keyword: '', // 搜索关键词（档号，创建人，批次等）
      firstDate: '', // 搜索日期(一)
      secondDate: '', // 搜索日期(二)
      thirdDate: '', // 搜索日期(三)
      archOS: '', // 选择的档案一级状态
      archTS: '', // 选择的档案二级状态
      showATS: false, // [false, false, false], // 档案多类型状态显示控制
      showTSD: false, // 档案多类型日期显示控制
      showSSD: false, // 档案多类型日期显示控制
      showDateNum: 0, // 多类型日期显示控制参数
      WriterArchData: [], // 档案数据临时集合
      archDataCount: 0, // 分页数据总条数
      pageSize: 10, // 当前是第几分页
      pso: [10, 20, 30, 50, 100], // 分页显示条数
      // 档案业务数据
      WAColumn: [
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
          title: '批次',
          key: 'batch_id'
        },
        {
          title: '档号',
          key: 'arch_no'
        },
        {
          title: '发文号',
          key: 'dispatch_doc_no'
        },
        {
          title: '立案号',
          key: ' register_no'
        },
        {
          title: '档案一级状态',
          key: 'one_statue',
          render: (h, params) => {
            let statue = statueDes(params.row.one_statue)
            return h('div', statue)
          }
        },
        {
          title: '档案二级状态',
          key: 'two_statue',
          render: (h, params) => {
            let statue = statueDes(params.row.two_statue)
            return h('div', statue)
          }
        },
        {
          title: '创建人',
          key: 'importer'
        },
        {
          title: '导入日期',
          key: 'import_date',
          render: (h, params) => {
            // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
            let datadate = dateFormate(new Date(params.row.import_date))
            return h('div', datadate)
          }
        },
        {
          title: '借阅日期',
          key: 'borrow_date',
          render: (h, params) => {
            let datadate = dateFormate(new Date(params.row.borrow_date))
            return h('div', datadate)
          }
        },
        {
          title: '出库日期',
          key: 'output_date',
          render: (h, params) => {
            let datadate = dateFormate(new Date(params.row.output_date))
            return h('div', datadate)
          }
        }
      ],
      oneStatues: [
        '整理',
        '在库',
        '借阅中',
        '出库'
      ], // 档案一级状态
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
      ], // 档案二级状态
      DateType: [
        '导入日期',
        '借阅日期',
        '出库日期'
      ] // 筛选日期类型
    }
  },
  methods: {
    // 档案一级状态选择器选中时触发
    closeSelect (value) {
      if (value === '整理') {
        this.showATS = true
      } else {
        this.showATS = false
      }
    },
    // 添加日期条件
    addSearchDate () {
      if (this.showTSD === false) {
        this.showTSD = true
      } else if (this.showSSD === false) {
        this.showSSD = true
      } else {
        alert('日期类型超于3个')
      }
    },
    // 移除日期条件
    removeSD (i) {
      if (i === 1) {
        this.showTSD = false
      } else if (i === 2) {
        this.showSSD = false
      }
    },
    // 跳转目标页
    destPage () {

    },
    // 改变显示条数
    changePage () {

    }
  }
}

// 档案状态的转义
function statueDes (statue) {
  let statueName = null
  if (statue === 0) {
    statueName = '未著录'
  } else if (statue === 1) {
    statueName = '已著录'
  } else if (statue === 2) {
    statueName = '质检通过'
  } else if (statue === 3) {
    statueName = '质检不通过'
  } else if (statue === 4) {
    statueName = '待质检'
  } else if (statue === 5) {
    statueName = '待上传'
  } else if (statue === 6) {
    statueName = '借阅'
  } else if (statue === 7) {
    statueName = '在库'
  } else if (statue === 8) {
    statueName = '出库'
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
