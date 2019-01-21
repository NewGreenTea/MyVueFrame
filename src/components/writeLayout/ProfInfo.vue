<template>
  <div style="overflow: auto;margin-bottom: 20px">
    <Row>
      <Col span="3">
        <Card class="tips">
          <p slot="title">档号</p>
          <p>{{archNo}}</p>
        </Card>
      </Col>
      <Col span="21">
        <!--专业信息必有的两个著录项-->
        <Row>
          <Col span="20" offset="1">
            <Form class="formClass" :model="profArch" :label-width="labelWidth" :rules="rules" ref="profForm">
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" label="建设单位" prop="buildCompany">
                    <Input placeholder="..." v-model="profArch.buildCompany" class="writeInput"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="建设项目" prop="buildProject">
                    <Input placeholder="..." v-model="profArch.buildProject" class="writeInput"/>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <!--项目地点信息-->
        <Row>
          <Col span="20" offset="1">
            <Form class="formClass" :model="buildingAddressInfo" :rules="rules" :label-width="labelWidth">
              <Row>
                <Col span="2">
                  <p class="buildingAddressCss">建设地址</p>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem>
                    <Row>
                      <Col span="21">
                        <Input placeholder="..." v-model="buildingAddressInfo.area" class="profSpecCss"/>
                      </Col>
                      <Col span="3">
                        <p class="buildingAddressCss2">区</p>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem>
                    <Row>
                      <Col span="21">
                        <Input placeholder="..." v-model="buildingAddressInfo.road" class="profSpecCss"/>
                      </Col>
                      <Col span="3">
                        <p class="buildingAddressCss2">路</p>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem>
                    <Row>
                      <Col span="21">
                        <Input placeholder="..." v-model="buildingAddressInfo.street" class="profSpecCss"/>
                      </Col>
                      <Col span="3">
                        <p class="buildingAddressCss2">街</p>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem prop="no">
                    <Row>
                      <Col span="21">
                        <Input placeholder="..." v-model="buildingAddressInfo.no" class="profSpecCss"/>
                      </Col>
                      <Col span="3">
                        <p class="buildingAddressCss2">号</p>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Col>
    </Row>


    <!-- 各类档案个性著录视图 -->
    <Row class="mainSpecialView">
      <Col span="21" offset="3">
        <!--<router-view ref="specialView" :name="archType" :isUpdate="updateInfo"-->
        <!--@RealSave="realSave" @RealUpdate="realUpdate"></router-view>-->
        <C61 ref="specialView" :specViewParams="specialParams" v-if="archType === 'C61'"
             @RealSave="realSave" @RealUpdate="realUpdate"></C61>
        <C62 ref="specialView" :specViewParams="specialParams" v-if="archType === 'C62'"
             @RealSave="realSave" @RealUpdate="realUpdate"></C62>
        <C63 ref="specialView" :specViewParams="specialParams" v-if="archType === 'C63'"
             @RealSave="realSave" @RealUpdate="realUpdate"></C63>
        <D21 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D21'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D21>
        <D22 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D22'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D22>
        <D31 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D31'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D31>
        <D32 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D32'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D32>
        <D34 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D34'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D34>
        <D61 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D61'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D61>
        <D62 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D62'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D62>
        <D63 ref="specialView" :specViewParams="specialParams" v-if="archType === 'D63'"
             @RealSave="realSave" @RealUpdate="realUpdate"></D63>
      </Col>
    </Row>

    <!-- 专业信息必有的4个著录项表 start-->
    <Row>
      <Col span="21" offset="3">
        <Row>
          <Col span="20" offset="1">
            <Row :gutter="16">
              <Col span="6">
                <!--地图型号表-->
                <!--<router-view ref="PMI" name="MapInfo" @saveMapInfoData="saveMID" :isUpdate="updateInfo"></router-view>-->
                <MapInfo ref="PMI" name="MapInfo" @saveMapInfoData="saveMID" :specViewParams="specialParams"
                         v-if="showMapInfo"></MapInfo>
              </Col>
              <Col span="9">
                <!--局历史审批文件编号表-->
                <!--<router-view ref="PAHN" name="AreaHisNo" @saveAreaHisNoData="saveAHND"-->
                <!--:isUpdate="updateInfo"></router-view>-->
                <AreaHisNo ref="PAHN" name="AreaHisNo" @saveAreaHisNoData="saveAHND" :specViewParams="specialParams"
                           v-if="showAreaHisNo"></AreaHisNo>
              </Col>
              <Col span="9">
                <!--建设工程规划许可证号表-->
                <!--<router-view ref="PPN" name="ProjectNo" @saveProjectNoData="savePND"-->
                <!--:isUpdate="updateInfo"></router-view>-->
                <ProjectNo ref="PPN" @saveProjectNoData="savePND" :specViewParams="specialParams"
                           v-if="showProjectNo"></ProjectNo>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
    </Row>
    <!-- 专业信息必有的4个著录项表 end-->

    <!-- 按钮 -->
    <Row class="profButtonView">
      <Col span="2" offset="11">
        <Button @click="saveArch" v-if="operation">保存</Button>
        <Button @click="updateArch" v-if="!operation">修改</Button>
        <Button @click="goBack">返回</Button>
      </Col>
    </Row>
  </div>
</template>

<script>
  import {isIntegerNotMust, notNull} from '../../js/validate'
  import {CommonFunction, ArchRequestConfig} from '../../js/global'
  import ProjectNo from "./ProjectNo";
  import AreaHisNo from "./AreaHisNo";
  import MapInfo from "./MapInfo";
  import C61 from "./specialLayout/C61";
  import C62 from "./specialLayout/C62";
  import C63 from "./specialLayout/C63";
  import D21 from './specialLayout/D21';
  import D22 from './specialLayout/D22';
  import D31 from './specialLayout/D31';
  import D32 from './specialLayout/D32';
  import D34 from './specialLayout/D34';
  import D61 from './specialLayout/D61';
  import D62 from './specialLayout/D62';
  import D63 from './specialLayout/D63';

  export default {
    name: "ProfInfo",
    components: {C61, C62, C63, D21, D22, D31, D32, D34, D61, D62, D63, MapInfo, AreaHisNo, ProjectNo},
    props: ['ProfParams'],
    data() {
      return {
        labelWidth: 100,
        //档案分类
        archType: this.ProfParams.archType,
        // 项目地点表数据
        buildingAddressData: [],
        // 地图型号表数据
        mapInfoData: [],
        // 局历史审批文件编号表数据
        areaHisNoData: [],
        // 建设工程规划许可证号表数据
        projectNoData: [],
        // 判断是否添加还是修改
        operation: this.ProfParams.operation,
        //传递给子组件是否为更新
        updateInfo: false,
        //传递个性页面的参数
        specialParams: '',
        D6123specialParams: '',
        archNo: this.ProfParams.archNo,
        // 档案专业信息必要信息
        profArch: {
          id: null,
          archId: this.ProfParams.archId, // 读取出来(456只是测试用)
          archNo: this.ProfParams.archNo, // 读取出来
          buildCompany: '',
          buildProject: '',
          classId: this.ProfParams.archTypeID
        },
        // 表数据结构体
        buildingAddressInfo: {
          id: null,
          archId: this.ProfParams.archId,
          area: '',
          road: '',
          street: '',
          no: ''
        },
        rules: {
          no: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        },
        //控制显示
        showMapInfo: false,
        showAreaHisNo: false,
        showProjectNo: false,
        //专业信息基本信息校验规则
        rules: {
          buildCompany: [
            {validator: notNull, trigger: 'blur'}
          ],
          buildProject: [
            {validator: notNull, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadArch() {
        if (this.operation === false) {
          this.axios.get('/api/loadArch/getArchInfo', {
            params: {
              archId: this.profArch.archId,
              ArchInfo: 'ProfInfo'
            }
          })
            .then(res => {
                this.profArch = res.data.data
              }
            );
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.profArch.archId,
              ArchInfo: 'BA'
            }
          })
            .then(res => {
                this.buildingAddressInfo = res.data.data;
              }
            );
          this.updateInfo = true
        }
      },
      //初始化传递参数
      initSpecParams() {
        if (this.ProfParams.operation === true) {  //这一部分可能要在writerGroup改动比较好！todo 2019/01/19
          this.ProfParams.operation = false
        } else {
          this.ProfParams.operation = true
        }
        this.specialParams = {
          archType: this.ProfParams.archType,
          archId: this.ProfParams.archId,
          isUpdate: this.ProfParams.operation
        }
      },
      // 保存档案信息
      realSave() { // 特性档案的著录专业信息存储方法
        this.$refs.profForm.validate((valid) => {
          if (valid) {
            this.axios.post('/api/profInfo/addProfInfo', this.profArch, {
              //判断字段是否为null，是则转为空字符串
              transformRequest: [function (data) {
                return CommonFunction.dataIsNull(data)
              }]
            });

            this.axios.post('/api/profInfo/addBuildAddress', this.buildingAddressInfo, ArchRequestConfig);

            if (this.mapInfoData !== []) {
              this.axios.post('/api/profInfo/addMapInfo', JSON.stringify(this.mapInfoData), ArchRequestConfig);
            }
            if (this.areaHisNoData !== []) {
              this.axios.post('/api/profInfo/addAreaHisNo', JSON.stringify(this.areaHisNoData), ArchRequestConfig);
            }
            if (this.projectNoData !== []) {
              this.axios.post('/api/profInfo/addProjectNo', JSON.stringify(this.projectNoData), ArchRequestConfig);
            }
            this.$Message.success('保存成功！');
            this.$emit('changeShowView')
          } else {
            this.$Message.error('著录信息有误！');
          }
        })
      },
      saveArch() { // 无特性档案的著录专业信息存储方法
        // 判断档案有无特性著录项
        if (this.$refs.specialView !== null && this.$refs.specialView !== undefined) {
          this.$refs.profForm.validate((valid) => {
              if (valid) {
                this.$refs.specialView.saveArch();  //即调用realSave方法,但是里面包含个性信息保存操作
              }else{
                this.$Message.error('著录信息有误！');
              }})
        }
        else {
          this.realSave()
        }
      },
      // 更新档案信息
      realUpdate() {
        this.axios.all([this.axiosUpdateProfInfo(), this.axiosUpdateBuildingAddress(),    //专业信息基本和建设地址信息
          this.$refs.PMI.updatePMI(), this.$refs.PAHN.updatePAHN(), this.$refs.PPN.updatePPN()])    //子组件的数据更新方法
          .then(this.axios.spread((res1, res2, res3, res4, res5) => {
            this.$Message.info('修改完毕！')
          }))
      },
      updateArch() {
        // 判断档案有无特性著录项
        if (this.$refs.specialView != null) {
          // 保存特性著录项(返回是否能保存或修改的标识)
          this.$refs.specialView.updateArch();
        }
        else {
          this.realUpdate();
        }
      },
      //后退
      goBack() {
        this.$emit('changeShowView')
      },
      // 子组件地图型号表传过来的数据
      saveMID(data) {
        this.mapInfoData = data
      },
      // 子组件局历史审批文件编号表传过来的数据
      saveAHND(data) {
        this.areaHisNoData = data
      },
      // 子组件建设工程规划许可证号表传过来的数据
      savePND(data) {
        this.projectNoData = data
      },
      axiosUpdateProfInfo() {
        this.axios.post('/api/profInfo/updateProfInfo', this.profArch, {
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data) {
            return CommonFunction.dataIsNull(data)
          }]
        })
      },
      axiosUpdateBuildingAddress() {
        //项目地点更新
        this.axios.post('/api/profInfo/updateBuildAddress', this.buildingAddressInfo, ArchRequestConfig)
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadArch();
      this.showMapInfo = true;
      this.showAreaHisNo = true;
      this.showProjectNo = true
    },
    created() {
      this.initSpecParams();
    }
  }
</script>

<style scoped>
  /*专业信息建设地址样式*/
  .profSpecCss {
    width: 160px;
  }

  .buildingAddressCss {
    font-size: 14px;
    padding-top: 5px;
    padding-left: 10px;
  }

  .buildingAddressCss2 {
    font-size: 14px;

  }

  .formSpec /deep/ .ivu-form-item-content {
    margin-left: 0px !important;
  }

  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
