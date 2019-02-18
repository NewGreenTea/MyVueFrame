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
        <Form class="formClass" :model="baseArch" :rules="checkRules" ref="BaseInfoForm">
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
                    <i-select placeholder="属性" v-model="baseArch.publicProperty">
                      <i-option :key="item" v-for="item in pubProperty" :value="item">{{item}}</i-option>
                    </i-select>
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
      <Col span="1" offset="10">
        <Button @click="saveArch" v-if="operation">保存</Button>
        <Button @click="updateArch" v-if="!operation">修改</Button>
      </Col>
      <Col span="1">
        <Button @click="reset">重置</Button>
      </Col>
      <Col span="1">
        <Button @click="goBack">返回</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {isInteger, notNull} from '../../js/validate'
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
        lableWidth: 90,
        archNo: this.BaseParams.archNo,
        pubProperty: ['主动公开', '依申请公开', '免于公开', '(不填)'],
        operation: this.BaseParams.operation,
        keyDate: '',
        // 表单用一个基本信息档案类装字段
        baseArch: {
          id: '',
          archId: this.BaseParams.archId, // 读取出来
          dispatchDocNo: this.BaseParams.dispatchDocNo, // 读取出来
          registerNo: this.BaseParams.registerNo, // 读取出来
          archNo: this.BaseParams.archNo, // 读取出来
          archTitle: this.BaseParams.title,
          company: '广州市国土资源和规划委员会', //todo
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
          archType: this.BaseParams.archTypeName,
          publicProperty: '',
          classId: this.BaseParams.archTypeID
        },
        rules: null,
        //除了B1.3和D8
        rules1: {
          registerNo: [
            {validator: isInteger, trigger: 'blur'}
          ],
          archTitle: [
            {validator: notNull, trigger: 'blur'}
          ],
          date: [
            {validator: notNull, trigger: 'change '}
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
        },  //待修改，进去就是提示错误 todo
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
        if (this.operation === false) {
          this.axios.get('/api/loadArch/getArchInfo', {
            params: {
              archId: this.baseArch.archId,
              ArchInfo: 'BaseInfo'
            }
          }).then(
            res => {
              this.baseArch = res.data.data
            }
          )
        }
      },
      // 保存档案
      saveArch() {
        this.$refs.BaseInfoForm.validate((valid) => {
          if (valid) {
            this.axios.post('/api/baseInfo/add', this.baseArch, config).then(res => {
              //todo,有错报错，没错提示并跳转
              this.$Message.success('保存完毕!');
              this.goBack()
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
                this.$Message.success('修改成功!')
              } else {
                this.$Message.error('修改失败!')
              }
            })
          }else{
            this.$Message.error('修改信息有误！');
          }
        })
      },
      goBack() {
        //this.$router.go(-1);
        this.$emit('changeShowView')
      },
      getDispatchNoType(DispatchNo) {
        let index;
        if(DispatchNo!== '') {
          if (DispatchNo.indexOf("〔") !== -1) {
            index = DispatchNo.lastIndexOf("〔");
          } else if (DispatchNo.indexOf("[") !== -1) {
            index = DispatchNo.lastIndexOf("[");
          } else if (DispatchNo.indexOf("【") !== -1) {
            index = DispatchNo.lastIndexOf("【");
          }
          return DispatchNo.substring(0, index)
        }else{
          return ''
        }
      },
      getDispatchNoYear(DispatchNo) {
        let index;
        let index2;
        if(DispatchNo!== '') {
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
        }else{
          return ''
        }
      },
      getDispatchNoNum(DispatchNo) {
        let index;
        if(DispatchNo!== '') {
          if (DispatchNo.indexOf("〔") !== -1) {
            index = DispatchNo.lastIndexOf("〕");
          } else if (DispatchNo.indexOf("]") !== -1) {
            index = DispatchNo.lastIndexOf("]");
          } else if (DispatchNo.indexOf("】") !== -1) {
            index = DispatchNo.lastIndexOf("】");
          }
          return DispatchNo.substring(index + 1, DispatchNo.length - 1)
        }else{
          return ''
        }
      },
      reset() {
        this.baseArch.archTitle = '';
        this.baseArch.company = '广州市国土资源和规划委员会';
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

    },
    mounted() {
      this.loadArch();
      // this.checkRules();
    },
    computed:{
      //加载正确的校验规则
      checkRules(){
        if((this.BaseParams.archTypeName.indexOf('B1.3') > -1) || (this.BaseParams.archTypeName.indexOf('D8') >-1)){
          return this.rules2;
        }
        else{
          return this.rules1;
        }
      }
    }
  }
</script>

<style scoped>

</style>
