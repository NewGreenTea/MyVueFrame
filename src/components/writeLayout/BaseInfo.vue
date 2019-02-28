<template>
  <div class="WriteLayoutFont">
    <Row style="height: 450px">
      <Col span="3">
        <Card class="tips">
          <p slot="title">档号</p>
          <p>{{archNo}}</p>
        </Card>
      </Col>
      <Col span="18">
        <!-- 校验规则 切换的时候 -->
        <Form class="formClass" ref="BaseInfoForm" :rules="getRules" :model="baseArch">
          <Row :gutter="16">
            <!--立案号,档号,案卷类别-->
            <Col>
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" label="立案号" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.registerNo"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="档号" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.archNo" class="colorBack" disabled/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷类别" :label-width="lableWidth">
                    <Tooltip :content="baseArch.archType" max-width="300">
                      <Input placeholder="..." v-model="baseArch.archType" class="colorBack" disabled/>
                    </Tooltip>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--案卷标题-->
            <Col>
              <FormItem class="FormItemClass" label="案卷标题" :label-width="lableWidth">
                <Input placeholder="..." v-model="baseArch.archTitle"/>
              </FormItem>
            </Col>

            <!--编制单位-->
            <Col>
              <FormItem class="FormItemClass" label="编制单位" :label-width="lableWidth">
                <Input placeholder="..." v-model="baseArch.company"/>
              </FormItem>
            </Col>

            <!--编制日期,进管日期,保管期限-->
            <Col>
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" label="编制日期" prop="date" :label-width="lableWidth">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd"
                                @on-change="baseArch.date=$event" v-model="baseArch.date"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="进馆日期" prop="inputDate" :label-width="lableWidth">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd"
                                @on-change="baseArch.inputDate=$event" v-model="baseArch.inputDate"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="保管期限" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.storageType"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--发文号：文种类别,年份,流水号-->
            <Col>
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" prop="dispatchNoType" label="发文号: " :label-width="lableWidth">
                    <Input placeholder="发文号：文种类别" v-model="baseArch.dispatchNoType"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass dispatchCss" prop="dispatchNoYear" label="[" :label-width="lableWidth">
                    <Input placeholder="发文号：年份" v-model="baseArch.dispatchNoYear"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <Row :gutter="16">
                    <Col span="22">
                      <FormItem class="FormItemClass dispatchCss" prop="dispatchNoNum" label="]"
                                :label-width="lableWidth">
                        <Input placeholder="发文号：流水号" v-model="baseArch.dispatchNoNum"/>
                      </FormItem>
                    </Col>
                    <Col span="2" class="profWriteUnit">
                      号
                    </Col>
                  </Row>

                </Col>
              </Row>
            </Col>

            <Col>
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass selectFontCss" label="公开属性" :label-width="lableWidth">
                    <Select placeholder="属性" v-model="baseArch.publicProperty" filterable>
                      <Option :key="item" v-for="item in pubProperty" :value="item">{{item}}</Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="密级" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.secretLv"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷页数" prop="archPage" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.archPage"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" label="经办人" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.operator"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷审核人" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.archAuditor"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷人" :label-width="lableWidth">
                    <Input placeholder="..." v-model="baseArch.archfileCreator"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

    <Row :gutter="16">
      <Col span="8" offset="8">
        <div>
          <Button type="success" v-if="archCommit" @click="commitArch">确认</Button>
          <Button @click="jumpPage('prof')">专业信息</Button>
          <Button @click="jumpPage('file')">文件信息</Button>
          <Button @click="saveArch" type="primary" v-if="this.baseArch.id===null">保存</Button>
          <Button @click="updateArch" type="primary" v-if="this.baseArch.id!==null">修改</Button>
          <Button @click="goBack">返回</Button>
        </div>
      </Col>
    </Row>

    <Modal v-model="showModal" title="确认信息" @on-ok="tips(3)">
      <div>
        档案的基本信息，专业信息，文件信息都已著录完，是否完成这份档案？
      </div>
    </Modal>

    <Modal v-model="showModal2" title="确认信息" @on-ok="sureback(1)" >
      <div>
        <p style="font-size: 15px;">档案信息进行了修改，没有点击确认，是否确定离开？</p>
      </div>
    </Modal>

    <Modal v-model="showModal3" title="跳转信息" @on-ok="jump">
      <div>
        <p style="font-size: 15px;">页面即将跳转，检查是否点击保存或修改档案信息？</p>
      </div>
    </Modal>
  </div>
</template>

<script>
  import {isInteger, notNull} from '../../js/validate'
  import {SystemFunction, archNoType} from '../../js/global'
  //档案数据对象的传输配置
  const config = {
    headers: {'Content-Type': 'application/json'}
  };

  export default {
    name: "BaseInfo",
    props: ['BaseParams'],
    data() {
      return {
        ss: '100%',
        showModal: false,
        showModal2: false,
        showModal3: false,
        //跳转页面信息
        pageText: '',
        //档案确认按钮
        archCommit: false,
        lableWidth: 90,
        archNo: this.BaseParams.archNo,
        pubProperty: ['主动公开', '依申请公开', '免于公开', '(不填)'],
        operation: this.BaseParams.operation,
        keyDate: '',
        // 表单用一个基本信息档案类装字段
        baseArch: {
          id: null,
          archId: this.BaseParams.archId, // 读取出来
          dispatchDocNo: this.BaseParams.dispatchDocNo, // 读取出来
          registerNo: this.BaseParams.registerNo, // 读取出来
          archNo: this.BaseParams.archNo, // 读取出来
          archTitle: this.BaseParams.title,
          company: '',
          date: '',
          inputDate: this.BaseParams.archInputDate,
          archPage: '',
          dispatchNoType: this.getDispatchNoType(this.BaseParams.dispatchDocNo),
          dispatchNoYear: this.getDispatchNoYear(this.BaseParams.dispatchDocNo),
          dispatchNoNum: this.getDispatchNoNum(this.BaseParams.dispatchDocNo),
          storageType: '永久',
          secretLv: '内部',
          operator: '',
          archAuditor: '',
          archfileCreator: '',
          archType: '',
          publicProperty: '',
          classId: this.BaseParams.archTypeID
        },
        //rules: null,
        //除了B1.3和D8,c4
        rules1: {
          registerNo: [
            {validator: isInteger, trigger: 'blur'}
          ],
          archTitle: [
            {validator: notNull, trigger: 'blur'}
          ],
          date: [
            {validator: notNull, trigger: 'change'}
          ],
          inputDate: [
            {validator: notNull, trigger: 'blur'}
          ],
          dispatchNoType: [
            {validator: notNull, trigger: 'blur'}
          ],
          dispatchNoNum: [
            {validator: isInteger, trigger: 'blur'}
          ],
          dispatchNoYear: [
            {validator: isInteger, trigger: 'blur'}
          ],
          archPage: [
            {validator: isInteger, trigger: 'change'}
          ]
        },
        rules2: {
          registerNo: [
            {validator: isInteger, trigger: 'blur'}
          ],
          date: [
            {validator: notNull, trigger: 'change'}
          ],
          inputDate: [
            {validator: notNull, trigger: 'blur'}
          ],
          archPage: [
            {validator: isInteger, trigger: 'change'}
          ]
        },
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadArch() {
        this.baseArch.company = '广州市' + SystemFunction.getSystemDistrict(this.getSystemCode) + '国土资源和规划局';
        if (this.operation === false) {
          this.axios.get('/api/loadArch/getArchInfo', {
            params: {
              archId: this.BaseParams.archId,
              ArchInfo: 'BaseInfo'
            }
          }).then(res => {
            this.baseArch = res.data.data;
          })
        } else {
          this.axios.post('/api/loadArch/ArchTypeName', this.qs.stringify({archNo: archNoType.writeVueLayout2(this.BaseParams.archNo)})).then(res => {
            this.baseArch.archType = res.data;
          });
        }
        if (this.BaseParams.archCommit === true) {
          this.archCommit = true
        }
      },
      // 保存档案
      saveArch() {
        this.$refs.BaseInfoForm.validate((valid) => {
          if (valid) {
            this.axios.post('/api/baseInfo/add', this.baseArch, config).then(res => {
              this.$Message.success('保存完毕!');
              //保存时立即关闭保存按钮，显示修改按钮 -2019/02/25
              this.baseArch.id = 'temp';
              //检测
              this.checkComplete(this.BaseParams.archId);
            })
          } else {
            this.$Message.error('著录信息有误！');
          }
        })
      },
      //更新档案
      updateArch() {
        this.$refs.BaseInfoForm.validate((valid) => {
          if (valid) {
            this.axios.post('/api/baseInfo/update', this.baseArch, config).then(res => {
              if (res.data.code === 0) {
                this.$Message.success('修改成功!');
                //检测
                this.checkComplete(this.BaseParams.archId);
              } else {
                this.$Message.error('修改失败!')
              }
            })
          } else {
            this.$Message.error('修改信息有误！');
          }
        })
      },
      //检测三大信息是否完成的方法
      checkComplete(id) {
        //触发三大信息是否著录完，弹出提示
        this.axios.post('/api/loadArch/ArchIsComplete', this.qs.stringify({
          archID: id
        })).then(res => {
          if (res.data === 1) {
            this.archCommit = true
          }
        });
      },
      //返回
      goBack() {
        if (this.archCommit === true) {
          this.showModal2 = true;
        } else {
          this.$emit('changeShowView')
        }
      },
      sureback(statue) {
        // 修改档案状态，变为已著录/待质检的状态
        this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({
          archID: this.BaseParams.archId,
          twoStatue: statue
        })).then(res => {
          this.archCommit = false;
          this.$emit('changeShowView')
        })
      },
      //跳转确认提示
      jumpPage(page) {
        this.showModal3 = true;
        this.pageText = page;
      },
      //跳转其他档案信息界面
      jump() {
        if (this.pageText === 'prof') {
          this.pageText = '';
          this.goProfInfo();
        } else if (this.pageText === 'file') {
          this.pageText = '';
          this.goFileInfo2()
        }
      },
      //跳转到专业信息
      goProfInfo() {
        this.axios.get('/api/profInfo/existProfInfo', {params: {archId: this.BaseParams.archId}}).then(res => {
          let temp;
          if (res.data.data === 0) {
            temp = true;
          } else {
            temp = false;
          }
          let data = {
            archId: this.BaseParams.archId, //传递一些重要参数给下一个界面
            archNo: this.archNo,
            archTypeID: this.BaseParams.archTypeID,
            archType: archNoType.writeVueLayout(this.archNo),
            dispatchNo: this.BaseParams.dispatchDocNo,
            operation: temp,
            archCommit: this.archCommit
          };
          this.$emit('toShowOther', 'ProfInfo', data)
        })
      },
      //跳转到文件信息
      goFileInfo2() {
        this.axios.get('/api/fileInfo/existFileInfo', {params: {archId: this.BaseParams.archId}}).then(res => {
          let temp;
          if (res.data.data === 0) {
            temp = true;
          } else {
            temp = false;
          }
          let data = {
            archId: this.BaseParams.archId, //传递一些重要参数给下一个界面
            archNo: this.archNo,
            archTypeID: this.BaseParams.archTypeID,
            operation: temp,
            archCommit: this.archCommit
          };
          this.$emit('toShowOther', 'FileInfo', data)
        })
      },
      getDispatchNoType(DispatchNo) {
        let index;
        if (DispatchNo !== '') {
          if (DispatchNo.indexOf("〔") !== -1) {
            index = DispatchNo.lastIndexOf("〔");
          } else if (DispatchNo.indexOf("[") !== -1) {
            index = DispatchNo.lastIndexOf("[");
          } else if (DispatchNo.indexOf("【") !== -1) {
            index = DispatchNo.lastIndexOf("【");
          }
          return DispatchNo.substring(0, index)
        } else {
          return ''
        }
      },
      getDispatchNoYear(DispatchNo) {
        let index;
        let index2;
        if (DispatchNo !== '') {
          if (DispatchNo.indexOf("〔") !== -1) {
            index = DispatchNo.lastIndexOf("〔");
            index2 = DispatchNo.lastIndexOf("〕");
          } else if (DispatchNo.indexOf("[") !== -1) {
            index = DispatchNo.lastIndexOf("[");
            index2 = DispatchNo.lastIndexOf("]");
          } else if (DispatchNo.indexOf("【") !== -1) {
            index = DispatchNo.lastIndexOf("【");
            index2 = DispatchNo.lastIndexOf("】");
          }
          return DispatchNo.substring(index + 1, index2)
        } else {
          return ''
        }
      },
      getDispatchNoNum(DispatchNo) {
        let index;
        if (DispatchNo !== '') {
          if (DispatchNo.indexOf("〔") !== -1) {
            index = DispatchNo.lastIndexOf("〕");
          } else if (DispatchNo.indexOf("]") !== -1) {
            index = DispatchNo.lastIndexOf("]");
          } else if (DispatchNo.indexOf("】") !== -1) {
            index = DispatchNo.lastIndexOf("】");
          }
          return DispatchNo.substring(index + 1, DispatchNo.length - 1)
        } else {
          return ''
        }
      },
      reset() {
        this.baseArch.archTitle = '';
        this.baseArch.company = '广州市' + SystemFunction.getSystemDistrict(this.getSystemCode) + '国土资源和规划局';
        this.baseArch.date = '';
        this.keyDate = '';
        this.baseArch.archPage = '';
        this.baseArch.dispatchNoType = '';
        this.baseArch.dispatchNoYear = '';
        this.baseArch.dispatchNoNum = '';
        this.baseArch.storageType = '永久';
        this.baseArch.secretLv = '内部';
        this.baseArch.operator = '';
        this.baseArch.archAuditor = '';
        this.baseArch.archfileCreator = '';
        this.baseArch.publicProperty = '';
        this.$refs.BaseInfoForm.resetFields()
      },
      commitArch() {
        this.showModal = true;
      },
      //确认提示，确认档案完成
      tips(statue) {
        //检测基本信息的文件页数和文件级信息文件编号是否相等
        this.axios.post('/api/loadArch/checkArchFilePage', this.qs.stringify({archID: this.BaseParams.archId})).then(res => {
          if (res.data.code === 1) {
            this.$Message.error(res.data.msg);
          } else {
            // 修改档案状态，变为已著录/待质检的状态
            this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({
              archID: this.BaseParams.archId,
              twoStatue: statue
            })).then(res => {
              this.archCommit = false;
              this.$emit('changeShowView')
            })
          }
        })
      }
    },
    mounted() {
      this.loadArch();
    },
    computed: {
      //加载正确的校验规则
      getRules() {
        if ((this.BaseParams.archTypeName.indexOf('B1.3') > -1) || (this.BaseParams.archTypeName.indexOf('D8') > -1)
          || (this.BaseParams.archTypeName.indexOf('C4') > -1)) {
          return this.rules2;
        }
        else {
          return this.rules1;
        }
      },
      //加载基本信息的编制单位
      getSystemCode() {
        if (this.$store.state.systemCode === '') {
          return window.localStorage.getItem('systemCode')
        } else {
          return this.$store.state.systemCode
        }
      }
    }
  }
</script>

<style scoped>

</style>
