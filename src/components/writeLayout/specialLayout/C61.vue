<template>
  <Row>
    <Col span="20" offset="1">
      <Form class="formClass" :model="C61Info" ref="C61form" :rules="rules" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
                <Row>
                  <Col span="16">
                    <FormItem class="FormItemClass" label="总用地面积" prop="totalArea">
                      <Input placeholder="..." v-model="C61Info.totalArea" class="profWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="7" class="profWriteUnit">
                    （平方米/m²）
                  </Col>
                </Row>
          </Col>

          <Col span="8">
                <Row>
                  <Col span="16">
                    <FormItem class="FormItemClass" label="可建设用地面积(净用地面积)" prop="buildArea">
                      <Input placeholder="..." v-model="C61Info.buildArea" class="profWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="7" class="profWriteUnit">
                    （平方米/m²）
                  </Col>
                </Row>
          </Col>

          <Col span="8">
                <Row>
                  <Col span="16">
                    <FormItem class="FormItemClass" label="道路用地面积" prop="roadArea">
                      <Input placeholder="..." v-model="C61Info.roadArea" class="profWriteInput"/>
                    </FormItem>
                  </Col>
                  <Col span="7" class="profWriteUnit">
                    （平方米/m²）
                  </Col>
                </Row>
          </Col>
        </Row>

        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="容积率" prop="plotRatio">
                  <Input placeholder="..." v-model="C61Info.plotRatio" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="7" class="profWriteUnit">
                （%）
              </Col>
            </Row>
          </Col>

          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="建筑密度" prop="buildDensity">
                  <Input placeholder="..." v-model="C61Info.buildDensity" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="7" class="profWriteUnit">
                （kg/m³）
              </Col>
            </Row>
          </Col>

          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="绿地率" prop="greenSpaceRatio">
                  <Input placeholder="..." v-model="C61Info.greenSpaceRatio" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="7" class="profWriteUnit">
                （%）
              </Col>
            </Row>
          </Col>
        </Row>

        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="居住人口" prop="population">
                  <Input placeholder="..." v-model="C61Info.population" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="7" class="profWriteUnit">
                （万）
              </Col>
            </Row>
          </Col>

          <Col span="8">
            <Row>
              <Col span="16">
                <FormItem class="FormItemClass" label="计算容积率建筑面积" prop="plotRatioArea">
                  <Input placeholder="..." v-model="C61Info.plotRatioArea" class="profWriteInput"/>
                </FormItem>
              </Col>
              <Col span="7" class="profWriteUnit">
                （平方米/m²）
              </Col>
            </Row>
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
    name: "C61",
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 100,
        archId: this.specViewParams.archId,
        // 表单用一个基本信息档案类装字段
        C61Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          totalArea: '',
          buildArea: '',
          roadArea: '',
          plotRatio: '',
          buildDensity: '',
          greenSpaceRatio: '',
          population: '',
          plotRatioArea: '',
        },
        rules: {
          totalArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          buildArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          roadArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          plotRatio: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          buildDensity: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          greenSpaceRatio: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          population: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ],
          plotRatioArea: [
            {validator: isDecimalNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //修改操作时加载个性著录项
      loadC61() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getC61', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              this.C61Info = res.data.data
            }
          )
        }
      },
      //保存特性著录数据
      saveArch() {
        this.$refs.C61form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/addC61', this.C61Info, ArchRequestConfig);
            this.$emit('RealSave'); //todo
          } else {
            this.$Message.error('著录数据有误！')
          }
        });
      },
      //更新特性著录数据
      updateArch() {
        this.$refs.C61form.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profETC/updateC61', this.C61Info, ArchRequestConfig);
            this.$emit('RealUpdate'); //todo
          } else {
            this.$Message.error('修改数据有误！')
          }
        })
      }
    },
    mounted() {
      this.loadC61()
    }
  }
</script>

<style scoped>
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
