<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="D22Info" :rules="rules" ref="D22form" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="规划批面积（总用地面积）" prop="totalArea">
                  <Input placeholder="..." v-model="D22Info.totalArea"/>
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
                  <Input placeholder="..." v-model="D22Info.areaClass" />
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Col>

    <!-- 用地性质详细著录 -->
    <Col span="22" offset="1">
      <!--<RouterView ref="D22UAInfo" name="D22UseAreaInfo" :isUpdate="updateInfo"-->
                  <!--@saveUseAreaInfoData="saveD22UAI"></RouterView>-->
      <UseAreaInfo ref="D22UAInfo" name="D22UseAreaInfo" :D212SpecParams="D212SpecParams"
                   @saveUseAreaInfoData="saveD22UAI"></UseAreaInfo>
    </Col>
  </Row>
</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";
  import UseAreaInfo from "./UseAreaInfo";

  export default {
    name: "D22",
    components: {UseAreaInfo},
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        rules: {
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        },
        archType: this.specViewParams.archType,
        archId: this.specViewParams.archId,
        D22Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        D212SpecParams: ''
      }
    },
    methods: {
      loadD22() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD22', {params: {archId: this.archId}}).then(
            res => {
              this.D22Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D22form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/addD22', this.D22Info, ArchRequestConfig),
            this.axiosSaveD22UseArea()])
              .then(this.axios.spread((res1,res2) =>{
                this.$emit('RealSave');
              }))
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      axiosSaveD22UseArea(){
        if (this.UseAreaInfoData !== []) {
          this.axios.post('/api/profETC/addD22UseAreaInfo', this.UseAreaInfoData, ArchRequestConfig);
        }
      },
      updateArch() {
        this.$refs.D22form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/updateD22', this.D22Info, ArchRequestConfig),this.$refs.D22UAInfo.updatePMI()])
              .then(this.axios.spread((res1,res2) =>{
                this.$emit('RealUpdate');
              }))
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD22UAI(data) {
        this.UseAreaInfoData = data
      },
      initD212Params() {
        this.D212SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD22()
    },
    created() {
      this.initD212Params();
    }
  }
</script>

<style scoped>
</style>
