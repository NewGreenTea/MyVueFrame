<template>
  <Row>
    <Col>
      <Form class="formClass" :model="D22Info" :rules="rules" ref="D22form">
        <Row>
          <Col>
            <Row>
              <Col span="8">
                <FormItem class="FormItemClass" label="规划批面积（总用地面积）" prop="totalArea">
                  <Input placeholder="..." v-model="D22Info.totalArea" class="writeInput"/>
                </FormItem>
              </Col>
              <Col span="8">
                <FormItem class="FormItemClass" label="拟征地现状土地类别">
                  <Input placeholder="..." v-model="D22Info.areaClass" class="writeInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Col>

    <!-- 用地性质详细著录 -->
    <Col>
      <RouterView ref="D22UAInfo" name="D22UseAreaInfo" :isUpdate="updateInfo"
                  @saveUseAreaInfoData="saveD22UAI"></RouterView>
    </Col>
  </Row>
</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";

  export default {
    name: "D22",
    props: ['isUpdate'],
    data() {
      return {
        rules: {
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        },
        archType: this.$route.params.archType,
        archId: this.$route.params.archId,
        D22Info: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoData: [],
        updateInfo: this.isUpdate
      }
    },
    methods: {
      loadD22() {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getD22', {params: {archId: this.archId}}).then(
            res => {
              this.D22Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D22form.validate((valid) => {    //todo 更新检测
          if (valid) {
            //传给专业信息界面能按保存按钮
            this.axios.post('/api/profETC/addD22', this.D22Info, ArchRequestConfig);
            if (this.UseAreaInfoData !== []) {
              this.axios.post('/api/profETC/addD22UseAreaInfo', this.UseAreaInfoData, ArchRequestConfig);
            }
            this.$emit('RealSave');
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D22form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/updateD22', this.D22Info, ArchRequestConfig);
            this.$refs.D22UAInfo.updatePMI();
            this.$emit('RealUpdate');
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD22UAI (data) {
        this.UseAreaInfoData = data
      },
      goback(){
        this.$router.go(-3);
      }
    },
    mounted() {
      this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD22()
    }
  }
</script>

<style scoped>
  .writeInput {
    width: 280px;
    float: right;
  }

  .FormItemClass {
    margin-left: 10px;
  }
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
