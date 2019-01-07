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
  </Row>
</template>

<script>
  import {isIntegerNotMust} from '../../js/validate'
  export default {
    name: "testFormVailator",
    data() {
      return {
        rules: {
          totalArea: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        },
        archType: '',
        archId: '',
        D22Info: {
          id: null,
          archId: '', // 读取出来
          totalArea: '',
          areaClass: ''
        },
        UseAreaInfoData: [],
        updateInfo: ''
      }
    },
    methods: {

    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
