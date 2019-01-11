<template>
  <Row>
    <Col span="20" offset="1">
      <Form class="formClass" :model="D21Info" ref="D21form" :rules="rules" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="规划批面积（总用地面积）" prop="totalArea">
                  <Input placeholder="..." v-model="D21Info.totalArea" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="拟征地现状土地类别">
                  <Input placeholder="..." v-model="D21Info.areaClass" class="profWriteInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Col>

    <!-- 用地性质详细著录表 -->
    <Col span="20" offset="1">
      <RouterView ref="D21UAInfo" name="D21UseAreaInfo" :isUpdate="updateInfo"
                  @saveUseAreaInfoData="saveD21UAI"></RouterView>
    </Col>
  </Row>

</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";

  export default {
    name: 'D21',
    props: ['isUpdate'],
    data() {
      return {
        labelWidth: 100,
        archType: this.$route.params.archType,
        archId: this.$route.params.archId,
        D21Info: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoData: [],
        updateInfo: this.isUpdate,
        rules: {
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loadD21() {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getD21', {params: {archId: this.archId}}).then(
            res => {
              this.D21Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D21form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/addD21', this.D21Info, ArchRequestConfig);
            if (this.UseAreaInfoData !== []) {
              this.axios.post('/api/profETC/addD21UseAreaInfo', this.UseAreaInfoData, ArchRequestConfig);
            }
            this.$emit('RealSave');
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D21form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/updateD21', this.D21Info, ArchRequestConfig);
            this.$refs.D21UAInfo.updatePMI();
            this.$emit('RealUpdate');
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD21UAI(data) {
        this.UseAreaInfoData = data
      },
      goback() {
        this.$router.go(-3);
      }
    },
    mounted() {
      this.$router.push({
        name: 'ProfSpcCommon',
        params: {archId: this.$route.params.archId, archType: this.archType}
      });
      this.loadD21()
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
