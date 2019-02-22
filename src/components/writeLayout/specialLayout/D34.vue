<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="D34Info" ref="D34form" :rules="rules" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <FormItem class="FormItemClass" label="起止点">
              <Input placeholder="..." v-model="D34Info.overheadPipeStart"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="管径规格">
              <Input placeholder="..." v-model="D34Info.overheadPipeType"/>
            </FormItem>
          </Col>
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="管线长度" prop="overheadPipeLength">
                  <Input placeholder="..." v-model="D34Info.overheadPipeLength"/>
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
                <FormItem class="FormItemClass" label="架空高度" prop="overheadPipeHight">
                  <Input placeholder="..." v-model="D34Info.overheadPipeHight"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>

          <Col span="8">
            <FormItem class="FormItemClass" label="平面位置">
              <Input placeholder="..." v-model="D34Info.overheadPipeEtc"/>
            </FormItem>
          </Col>
          <Col span="8">
            <FormItem class="FormItemClass" label="起止点">
              <Input placeholder="..." v-model="D34Info.underPipeStart"/>
            </FormItem>
          </Col>

          <Col span="8">
            <FormItem class="FormItemClass" label="管径规格">
              <Input placeholder="..." v-model="D34Info.underPipeType"/>
            </FormItem>
          </Col>

          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="管线长度" prop="underPipeLength">
                  <Input placeholder="..." v-model="D34Info.underPipeLength"/>
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
                <FormItem class="FormItemClass" label="埋设深度" prop="underPipeHight">
                  <Input placeholder="..." v-model="D34Info.underPipeHight"/>
                </FormItem>
              </Col>
              <Col span="6" class="profWriteUnit">
                （米/m）
              </Col>
            </Row>
          </Col>

          <Col span="8">
            <FormItem class="FormItemClass" label="平面位置">
              <Input placeholder="..." v-model="D34Info.underPipePosition"/>
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
    name: "D34",
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        archId: this.specViewParams.archId,
        D34Info: {
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
          underPipePosition: ''
        },
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
      loadD34() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD34', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              if(res.data.data !== null){
                this.D34Info = res.data.data
              }
            }
          )
        }
      },
      saveArch() {
        this.$refs.D34form.validate((valid) => {    //todo 更新检测
          if (valid) {
            this.axios.post('/api/profETC/addD34', this.D34Info, ArchRequestConfig);
            this.$emit('RealSave');
          } else {
            this.$Message.error('著录数据有误！')
          }
        })
      },
      updateArch() {
        this.$refs.D34form.validate((valid) => {    //todo 更新检测
          if (valid) {
            this.axios.post('/api/profETC/updateD34', this.D34Info, ArchRequestConfig);
            this.$emit('RealUpdate');
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      }
    },
    mounted() {
      this.loadD34()
    }
  }
</script>

<style scoped>
</style>
