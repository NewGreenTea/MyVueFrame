<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="D21Info" ref="D21form" :rules="rules" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="规划批面积（总用地面积）" prop="totalArea">
                  <Input placeholder="..." v-model="D21Info.totalArea"/>
                </FormItem>
              </Col>
              <Col span="9" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="拟征地现状土地类别">
                  <Input placeholder="..." v-model="D21Info.areaClass"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Col>

    <!-- 用地性质详细著录表 -->
    <Col span="22" offset="1">
      <!--<RouterView ref="D21UAInfo" name="D21UseAreaInfo" :isUpdate="updateInfo"-->
                  <!--@saveUseAreaInfoData="saveD21UAI"></RouterView>-->
      <UseAreaInfo ref="D21UAInfo" name="D21UseAreaInfo" :D212SpecParams="D212SpecParams"
                   @saveUseAreaInfoData="saveD21UAI"></UseAreaInfo>
    </Col>
  </Row>

</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";
  import UseAreaInfo from "./UseAreaInfo";

  export default {
    name: 'D21',
    components: {UseAreaInfo},
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        archType: this.specViewParams.archType,
        archId: this.specViewParams.archId,
        D21Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        rules: {
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        },
        D212SpecParams: ''
      }
    },
    methods: {
      loadD21() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD21', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              this.D21Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D21form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/addD21', this.D21Info, ArchRequestConfig),this.axiosSaveD21UseArea()])
              .then(this.axios.spread((res1,res2) => {
                this.$emit('RealSave');
              }))
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      axiosSaveD21UseArea(){
        if (this.UseAreaInfoData !== []) {
          this.axios.post('/api/profETC/addD21UseAreaInfo', this.UseAreaInfoData, ArchRequestConfig);
        }
      },
      updateArch() {
        this.$refs.D21form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/updateD21', this.D21Info, ArchRequestConfig),this.$refs.D21UAInfo.updatePMI()])
              .then(this.axios.spread((res1,res2) =>{
                this.$emit('RealUpdate');
              }))
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD21UAI(data) {
        this.UseAreaInfoData = data
      },
      initD212Params() {
        this.D212SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD21()
    },
    created() {
      this.initD212Params();
    }
  }
</script>

<style scoped>
</style>
