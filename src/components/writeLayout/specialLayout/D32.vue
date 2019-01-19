<template>
  <Row>
    <Col span="20" offset="1">
      <Form class="formClass" :model="D32Info" :rules="rules" ref="D32form" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <FormItem class="FormItemClass" label="起止点">
              <Input placeholder="..." v-model="D32Info.roadStart" class="writeInput"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="断面形式">
              <Input placeholder="..." v-model="D32Info.roadTypeAspect" class="writeInput"/>
            </FormItem>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="道路长度" prop="roadLength">
                  <Input placeholder="..." v-model="D32Info.roadLength" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="道路开口">
              <Input placeholder="..." v-model="D32Info.roadCrossing" class="writeInput"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="平面位置">
              <Input placeholder="..." v-model="D32Info.roadAspectPosition" class="writeInput"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="跨越区域">
              <Input placeholder="..." v-model="D32Info.bridgeCrossingArea" class="writeInput"/>
            </FormItem>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="桥面长度" prop="bridgeLength">
                  <Input placeholder="..." v-model="D32Info.bridgeLength" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="总长度" prop="bridgeTotalLength">
                  <Input placeholder="..." v-model="D32Info.bridgeTotalLength" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="净空高度" prop="bridgeHight">
                  <Input placeholder="..." v-model="D32Info.bridgeHight" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="平面位置">
              <Input placeholder="..." v-model="D32Info.bridgeAspectPosition" class="writeInput"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
</template>

<script>
  import {isDecimalNotMust} from '../../../js/validate'
  import {ArchRequestConfig} from "../../../js/global";

  export default {
    name: "D32",
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 100,
        archId: this.specViewParams.archId,
        D32Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          roadStart: '',
          roadTypeAspect: '',
          roadLength: '',
          roadCrossing: '',
          roadAspectPosition: '',
          bridgeCrossingArea: '',
          bridgeLength: '',
          bridgeTotalLength: '',
          bridgeHight: '',
          bridgeAspectPosition: ''
        },
        rules: {
          roadLength: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          bridgeLength: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          bridgeTotalLength: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          bridgeHight: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      loadD32() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD32', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              this.D32Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$refs.D32form.validate((valid) => {    //todo 更新检测
          if (valid) {
            this.axios.post('/api/profETC/addD32', this.D32Info, ArchRequestConfig);
            this.$emit('RealSave');
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D32form.validate((valid) => {    //todo 更新检测
          if (valid) {
            this.axios.post('/api/profETC/updateD32', this.D32Info, ArchRequestConfig);
            this.$emit('RealUpdate');
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      }
    },
    mounted() {
      this.loadD32()
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
