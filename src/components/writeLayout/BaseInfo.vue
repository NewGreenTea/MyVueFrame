<template>
  <div style="overflow: auto">
    <!--<div style="height: 520px">-->
    <!--<div ref="ss">-->
    <Row>
      <Col span="3">
        <Tooltip content="档号">
          <p>档号</p>
          <p>{{archNo}}</p>
        </Tooltip>
      </Col>
      <Col span="18">
        <Form class="formClass" :model="baseArch" :rules="rules" ref="BaseInfoForm">
          <Row>
            <!--立案号,档号,案卷类别-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立案号" prop="registerNo">
                    <Input placeholder="..." v-model="baseArch.registerNo" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="档号">
                    <Input placeholder="..." v-model="baseArch.archNo" class="colorBack writeInput" disabled/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷类别">
                    <Input placeholder="..." v-model="baseArch.archType" class="colorBack writeInput" disabled/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--案卷标题-->
            <Col>
              <FormItem class="FormItemClass" label="案卷标题" prop="archTitle">
                <Input placeholder="..." v-model="baseArch.archTitle" style="width: 93%;float: right"/>
              </FormItem>
            </Col>

            <!--编制单位-->
            <Col>
              <FormItem class="FormItemClass" label="编制单位">
                <Input placeholder="..." v-model="baseArch.company" style="width: 93%;float: right"/>
              </FormItem>
            </Col>

            <!--编制日期,进管日期,保管期限-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="编制日期" prop="date">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="writeInput"
                                @on-change="baseArch.date=$event" v-model="baseArch.date"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="进管日期" prop="inputDate">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="writeInput"
                                @on-change="baseArch.inputDate=$event" v-model="baseArch.inputDate"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="保管期限">
                    <Input placeholder="..." v-model="baseArch.storageType" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--发文号：文种类别,年份,流水号-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="文种类别" prop="dispatchNoType">
                    <Input placeholder="发文号：文种类别" v-model="baseArch.dispatchNoType" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="年份" prop="dispatchNoYear">
                    <Input placeholder="发文号：年份" v-model="baseArch.dispatchNoYear" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="流水号" prop="dispatchNoNum">
                    <Input placeholder="发文号：流水号" v-model="baseArch.dispatchNoNum" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="公开属性">
                    <i-select placeholder="属性" class="writeInput" v-model="baseArch.publicProperty">
                      <i-option :key="item" v-for="item in pubProperty" :value="item">{{item}}</i-option>
                    </i-select>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="密级">
                    <Input placeholder="..." v-model="baseArch.secretLv" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷页数" prop="archPage">
                    <Input placeholder="..." v-model="baseArch.archPage" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="经办人">
                    <Input placeholder="..." v-model="baseArch.operator" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷审核人">
                    <Input placeholder="..." v-model="baseArch.archAuditor" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷人">
                    <Input placeholder="..." v-model="baseArch.archfileCreator" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

    <Button @click="saveArch" v-if="operation">保存</Button>
    <Button @click="updateArch" v-if="!operation">修改</Button>
    <Button @click="reset">重置</Button>
    <Button @click="goBack">返回</Button>
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
    data() {
      return {
        ss: '100%',
        archNo: this.$route.params.archNo,
        pubProperty: ['主动公开', '依申请公开', '免于公开', '(不填)'],
        operation: this.$route.params.operation,
        keyDate: '',
        // 表单用一个基本信息档案类装字段
        baseArch: {
          id: '',
          archId: this.$route.params.archId, // 读取出来
          dispatchDocNo: this.$route.params.dispatchDocNo, // 读取出来
          registerNo: this.$route.params.registerNo, // 读取出来
          archNo: this.$route.params.archNo, // 读取出来
          archTitle: '',
          company: '',
          date: '',
          inputDate: '',
          archPage: '',
          dispatchNoType: this.getDispatchNoType(this.$route.params.dispatchDocNo),
          dispatchNoYear: this.getDispatchNoYear(this.$route.params.dispatchDocNo),
          dispatchNoNum: this.getDispatchNoNum(this.$route.params.dispatchDocNo),
          storageType: '永久',
          secretLv: '内部',
          operator: '',
          archAuditor: '',
          archfileCreator: '',
          archType: this.$route.params.archTypeName,
          publicProperty: '',
          classId: this.$route.params.archTypeID
        },
        rules: {
          registerNo: [
            {validator: isInteger, trigger: 'blur'}
          ],
          archTitle: [
            {validator: notNull, trigger: 'blur'}
          ],
          date: [
            {validator: notNull, trigger: 'blur'}
          ],
          inputDate: [
            {validator: notNull, trigger: 'blur'}
          ],
          dispatchNoType: [
            {validator: notNull, trigger: ['blur', 'change']}
          ],
          dispatchNoNum: [
            {validator: isInteger, trigger: ['blur', 'change']}
          ],
          dispatchNoYear: [
            {validator: isInteger, trigger: ['blur', 'change']}
          ],
          archPage: [
            {validator: isInteger, trigger: 'blur'}
          ]
        }
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
            this.$Message.error('Fail!');
          }
        })
      },
      //更新档案
      updateArch() {
        this.axios.post('/api/baseInfo/update', this.baseArch, config).then(res => {
            //todo,有错报错，没错提示并跳转
            alert('修改完毕')
          }
        )
      },
      goBack() {
        this.$router.go(-1);
        this.$emit('changeShowView')
      },
      getDispatchNoType(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〔");
        return DispatchNo.substring(0, index)
      },
      getDispatchNoYear(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〔");
        let index2 = DispatchNo.lastIndexOf("〕");
        return DispatchNo.substring(index + 1, index2)
      },
      getDispatchNoNum(DispatchNo) {
        let index = DispatchNo.lastIndexOf("〕");
        return DispatchNo.substring(index + 1, DispatchNo.length)
      },
      reset() {
        this.baseArch.archTitle = '';
        this.baseArch.company = '';
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
      }
    },
    mounted() {
      this.loadArch()
    }
  }
</script>

<style scoped>
  .writeInput {
    width: 310px;
    float: right;
  }

  .FormItemClass {
    margin-left: 10px;
  }

  /*禁用的颜色高亮为黑色*/
  .colorBack /deep/ .ivu-input[disabled], fieldset[disabled] .ivu-input {
    color: black !important;
  }

  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
