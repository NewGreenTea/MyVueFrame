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
        <Form class="formClass" :model="baseArch" :rules="rules" ref="BaseInfoForm">
          <Row>
            <!--立案号,档号,案卷类别-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立案号">
                    <Input placeholder="..." v-model="baseArch.registerNo" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="档号">
                    <Input placeholder="..." v-model="baseArch.archNo" class="colorBack baseWriteInput" disabled/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷类别">
                    <Tooltip :content="baseArch.archType" max-width="300" class="baseWriteInput">
                      <Input placeholder="..." v-model="baseArch.archType" class="colorBack baseWriteInput" disabled/>
                    </Tooltip>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--案卷标题-->
            <Col>
              <FormItem class="FormItemClass" label="案卷标题" prop="archTitle">
                <Input placeholder="..." v-model="baseArch.archTitle" style="width: 92%;float: right"/>
              </FormItem>
            </Col>

            <!--编制单位-->
            <Col>
              <FormItem class="FormItemClass" label="编制单位">
                <Input placeholder="..." v-model="baseArch.company" style="width: 92%;float: right"/>
              </FormItem>
            </Col>

            <!--编制日期,进管日期,保管期限-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="编制日期" prop="date">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="baseWriteInput"
                                @on-change="baseArch.date=$event" v-model="baseArch.date"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="进馆日期" prop="inputDate">
                    <DatePicker placeholder="Select date" format="yyyy-MM-dd" class="baseWriteInput"
                                @on-change="baseArch.inputDate=$event" v-model="baseArch.inputDate"></DatePicker>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="保管期限">
                    <Input placeholder="..." v-model="baseArch.storageType" class="baseWriteInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <!--发文号：文种类别,年份,流水号-->
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" prop="dispatchNoType" label="发文号: ">
                    <Input placeholder="发文号：文种类别" v-model="baseArch.dispatchNoType" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass dispatchCss" prop="dispatchNoYear" label="[">
                    <Input placeholder="发文号：年份" v-model="baseArch.dispatchNoYear" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <Row>
                    <Col span="22">
                      <FormItem class="FormItemClass dispatchCss" prop="dispatchNoNum" label="]">
                        <Input placeholder="发文号：流水号" v-model="baseArch.dispatchNoNum" class="baseWriteInputSpec"/>
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
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="公开属性">
                    <i-select placeholder="属性" class="baseWriteInput" v-model="baseArch.publicProperty">
                      <i-option :key="item" v-for="item in pubProperty" :value="item">{{item}}</i-option>
                    </i-select>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="密级">
                    <Input placeholder="..." v-model="baseArch.secretLv" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="案卷页数" prop="archPage">
                    <Input placeholder="..." v-model="baseArch.archPage" class="baseWriteInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>

            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="经办人">
                    <Input placeholder="..." v-model="baseArch.operator" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷审核人">
                    <Input placeholder="..." v-model="baseArch.archAuditor" class="baseWriteInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="立卷人">
                    <Input placeholder="..." v-model="baseArch.archfileCreator" class="baseWriteInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>

    <Row>
      <Col span="3" offset="9">
        <Button @click="saveArch" v-if="operation">保存</Button>
        <Button @click="updateArch" v-if="!operation">修改</Button>
        <Button @click="reset">重置</Button>
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
          archTitle: '',
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
          archType: this.BaseParams.archTypeName,
          publicProperty: '',
          classId: this.BaseParams.archTypeID
        },
        rules: {
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
            {validator: notNull, trigger: 'change'}
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
            this.$Message.error('著录信息有误！');
          }
        })
      },
      //更新档案
      updateArch() {
        this.axios.post('/api/baseInfo/update', this.baseArch, config).then(res => {
            if(res.data.code === 0){
              this.$Message.success('修改成功!')
            }else{
              this.$Message.error('修改失败!')
            }
          }
        )
      },
      goBack() {
        //this.$router.go(-1);
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
        return DispatchNo.substring(index + 1, DispatchNo.length - 1)
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

</style>
