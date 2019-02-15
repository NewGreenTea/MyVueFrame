<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="D63PipelineInfo" ref="D63form" :rules="rules" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="15">
          <Col span="8">
            <FormItem class="FormItemClass" label="起止点">
              <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeStart"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="管径规格">
              <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeType"/>
            </FormItem>
          </Col>
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="管线长度" prop="overheadPipeLength">
                  <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeLength"/>
                </FormItem>
              </Col>
              <Col span="9" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="架空高度" prop="overheadPipeHight">
                  <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeHight"/>
                </FormItem>
              </Col>
              <Col span="9" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="其他">
              <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeEtc"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="起止点">
              <Input placeholder="..." v-model="D63PipelineInfo.underPipeStart"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="管径规格">
              <Input placeholder="..." v-model="D63PipelineInfo.underPipeType"/>
            </FormItem>
          </Col>
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="管线长度" prop="underPipeLength">
                  <Input placeholder="..." v-model="D63PipelineInfo.underPipeLength"/>
                </FormItem>
              </Col>
              <Col span="9" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="15">
                <FormItem class="FormItemClass" label="埋设深度" prop="underPipeHight">
                  <Input placeholder="..." v-model="D63PipelineInfo.underPipeHight"/>
                </FormItem>
              </Col>
              <Col span="9" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="其他">
              <Input placeholder="..." v-model="D63PipelineInfo.underPipeEtc"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Col>

    <Col span="22" offset="1">
      <!-- 验收测量记录册 -->
      <!--<RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo"-->
                  <!--@saveMeasureInfoData="saveD63MI"></RouterView>-->
      <MeasureInfo ref="MeaInfo" name="MeasureInfo" :D6123SpecParams="D6123SpecParams" @saveMeasureInfoData="saveD63MI"></MeasureInfo>
    </Col>
  </Row>
</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";
  import MeasureInfo from "./MeasureInfo";

  export default {
    name: "D63",
    components: {MeasureInfo},
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        archType: this.specViewParams.archType,
        archId: this.specViewParams.archId,
        D63PipelineInfo: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          overheadPipeStart: '',
          overheadPipeType: '',
          overheadPipeLength: '',
          overheadPipeHight: '',
          overheadPipeEtc: '',
          underPipeStart: '',
          underPipeType: '',
          underPipeLength: '',
          underPipeHight: '',
          underPipeEtc: ''
        },
        MeasureInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        rules: {
          overheadPipeLength: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          overheadPipeHight: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          underPipeLength: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          underPipeHight: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      loadD63() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD63PipelineInfo', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              this.D63PipelineInfo = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D63form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/addD63PipelineInfo', this.D63PipelineInfo, ArchRequestConfig),this.axiosSaveD63Pipeline()])
              .then(this.axios.spread((res1,res2) => {
                this.$emit('RealSave');
              }))
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D63form.validate((valid) => {
          if (valid) {
            this.axios.all([this.axios.post('/api/profETC/updateD63PipelineInfo', this.D63PipelineInfo, ArchRequestConfig),this.$refs.MeaInfo.updatePMI()])
              .then(this.axios.spread((res1,res2) =>{
                this.$emit('RealUpdate');
              }))
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD63MI(data) {
        this.MeasureInfoData = data
      },
      axiosSaveD63Pipeline(){
        if (this.MeasureInfoData !== []) {
          this.axios.post('/api/profETC/addD63MI', JSON.stringify(this.MeasureInfoData), ArchRequestConfig);
        }
      },
      initD6123Params() {
        this.D6123SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD63()
    },
    created() {
      this.initD6123Params();
    }
  }
</script>

<style scoped>
</style>
