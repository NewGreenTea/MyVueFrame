<template>
  <div>
    <Row>
      <Col>
        <Form class="formClass" :model="D63PipelineInfo" ref="D63form" :rules="rules">
          <Row>
            <Col>
              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="起止点">
                    <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeStart" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="管径规格">
                    <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeType" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="管线长度" prop="overheadPipeLength">
                    <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeLength" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="架空高度" prop="overheadPipeHight">
                    <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeHight" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="其他">
                    <Input placeholder="..." v-model="D63PipelineInfo.overheadPipeEtc" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="起止点">
                    <Input placeholder="..." v-model="D63PipelineInfo.underPipeStart" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>

              <Row>
                <Col span="8">
                  <FormItem class="FormItemClass" label="管径规格">
                    <Input placeholder="..." v-model="D63PipelineInfo.underPipeType" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="管线长度" prop="underPipeLength">
                    <Input placeholder="..." v-model="D63PipelineInfo.underPipeLength" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="埋设深度" prop="underPipeHight">
                    <Input placeholder="..." v-model="D63PipelineInfo.underPipeHight" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="其他">
                    <Input placeholder="..." v-model="D63PipelineInfo.underPipeEtc" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>

      <Col>
        <!-- 验收测量记录册 -->
        <RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo"
                    @saveMeasureInfoData="saveD63MI"></RouterView>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {CommonFunction,ArchRequestConfig} from "../../../js/global";

  export default {
    name: "D63",
    props: ['isUpdate'],
    data() {
      return {
        archType: this.$route.params.archType,
        archId: this.$route.params.archId,
        D63PipelineInfo: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
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
        updateInfo: this.isUpdate,
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
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getD63PipelineInfo', {params: {archId: this.archId}}).then(
            res => {
              this.D63PipelineInfo = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D63form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/addD63PipelineInfo', this.D63PipelineInfo, ArchRequestConfig);
            if (this.MeasureInfoData !== []) {
              this.axios.post('/api/profETC/addD63MI', JSON.stringify(this.MeasureInfoData),ArchRequestConfig);
            }
            this.$emit('RealSave');
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D63form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/updateD63PipelineInfo', this.D63PipelineInfo, ArchRequestConfig);
            this.$refs.MeaInfo.updatePMI();
            this.$emit('RealUpdate');
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      },
      saveD63MI(data) {
        this.MeasureInfoData = data
      },
      goback(){
        this.$router.go(-3);
      }
    },
    mounted() {
      this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD63()
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
