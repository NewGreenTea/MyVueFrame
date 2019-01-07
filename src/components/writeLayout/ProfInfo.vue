<template>
  <div style="overflow: auto;margin-bottom: 20px">
    <!--<div style="height: 520px">-->
    <!--<div ref="ss">-->
    <Row>
      <Col span="2">
        <Tooltip content="档号" class="tips">
          <p>档号</p>
          <p>{{archNo}}</p>
        </Tooltip>
      </Col>

      <Col span="22">
      <Row>
        <!--专业信息必有的两个著录项-->
        <Col span="2">&nbsp;</Col>
        <Col span="20">
          <Form class="formClass" :model="profArch">
            <Row>
              <Col>
                <Row>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="建设单位">
                      <Input placeholder="..." v-model="profArch.buildCompany" class="writeInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem class="FormItemClass" label="建设项目">
                      <Input placeholder="..." v-model="profArch.buildProject" class="writeInput"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      <Row>
        <!--项目地点信息-->
        <Col span="2">&nbsp;</Col>
        <Col span="20">
          <Form class="formClass" :model="buildingAddressInfo" :rules="rules">
            <Row>
              <Col>
                <Row>
                  <Col span="8">
                    <FormItem label="区" class="FormItemClass">
                      <Input placeholder="..." v-model="buildingAddressInfo.area" class="writeInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="路" class="FormItemClass">
                      <Input placeholder="..." v-model="buildingAddressInfo.road" class="writeInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="街" class="FormItemClass">
                      <Input placeholder="..." v-model="buildingAddressInfo.street" class="writeInput"/>
                    </FormItem>
                  </Col>
                  <Col span="8">
                    <FormItem label="号" class="FormItemClass" prop="no">
                      <Input placeholder="..." v-model="buildingAddressInfo.no" class="writeInput"/>
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      </Col>
    </Row>


    <!-- 各类档案个性著录视图 -->
    <Row>
      <Col span="2">&nbsp;</Col>
      <Col span="20">
        <router-view ref="specialView" :name="archType" :isUpdate="updateInfo"
                     @RealSave="realSave" @RealUpdate="realUpdate"></router-view>
      </Col>
    </Row>

    <!-- 专业信息必有的4个著录项表 start-->
    <Row style="margin-top: 20px;margin-bottom: 20px">
      <Col span="1">&nbsp;</Col>
      <Col span="21">
        <Row>
          <!--<Col span="11">-->
          <!--&lt;!&ndash;项目地点表&ndash;&gt;-->
          <!--<router-view ref="PBA" name="BuildingAddress" @saveBuildingAddressData="saveBAD"-->
          <!--:isUpdate="updateInfo"></router-view>-->
          <!--</Col>-->

          <Col span="8">
            <!--地图型号表-->
            <router-view ref="PMI" name="MapInfo" @saveMapInfoData="saveMID" :isUpdate="updateInfo"></router-view>
          </Col>

          <Col span="8">
            <!--局历史审批文件编号表-->
            <router-view ref="PAHN" name="AreaHisNo" @saveAreaHisNoData="saveAHND" :isUpdate="updateInfo"></router-view>
          </Col>

          <Col span="8">
            <!--建设工程规划许可证号表-->
            <router-view ref="PPN" name="ProjectNo" @saveProjectNoData="savePND" :isUpdate="updateInfo"></router-view>
          </Col>
        </Row>
      </Col>
    </Row>
    <!-- 专业信息必有的4个著录项表 end-->

    <Button @click="saveArch" v-if="operation">保存</Button>
    <Button @click="updateArch" v-if="!operation">修改</Button>
    <Button @click="goBack">返回</Button>
  </div>
</template>

<script>
  import {isIntegerNotMust} from '../../js/validate'
  import {CommonFunction} from '../../js/global'
  //档案数据对象的传输配置
  const config={
    headers: {'Content-Type': 'application/json'}
  };

  export default {
    name: "ProfInfo",
    data() {
      return {
        //档案分类
        archType: this.$route.params.archType,
        // 项目地点表数据
        buildingAddressData: [],
        // 地图型号表数据
        mapInfoData: [],
        // 局历史审批文件编号表数据
        areaHisNoData: [],
        // 建设工程规划许可证号表数据
        projectNoData: [],
        // 判断是否添加还是修改
        operation: this.$route.params.operation,
        //传递给子组件是否为更新
        updateInfo: false,
        archNo: this.$route.params.archNo,
        // 档案专业信息必要信息
        profArch: {
          id: null,
          archId: this.$route.params.archId, // 读取出来(456只是测试用)
          archNo: this.$route.params.archNo, // 读取出来
          buildCompany: '',
          buildProject: '',
          classId: this.$route.params.archTypeID
        },
        // 表数据结构体
        buildingAddressInfo: {
          id: null,
          archId: this.$route.params.archId,
          area: '',
          road: '',
          street: '',
          no: ''
        },
        rules: {
          no: [
            {validator: isIntegerNotMust, trigger: 'blur'}
          ]
        }
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadArch() {
        if (this.operation === false) {
          this.axios.get('/api/loadArch/getArchInfo', {params: {archId: this.profArch.archId, ArchInfo: 'ProfInfo'}}).then(
            res => {
              this.profArch = res.data.data
            }
          );
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.profArch.archId,
              ArchInfo: 'BA'
            }
          }).then(
            res => {
              this.buildingAddressInfo = res.data.data;
            }
          );
          this.updateInfo = true
        }
      },
      // 保存档案信息
      realSave() {
        // 一份档案的专业信息存储
        if (!CommonFunction.isEmpty(this.profArch.buildCompany) || !CommonFunction.isEmpty(this.profArch.buildProject)) {
          this.axios.post('/api/profInfo/addProfInfo', this.profArch, {
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data) {
              return CommonFunction.dataIsNull(data)
            }]
          });
        }
        if (!CommonFunction.isEmpty(this.buildingAddressInfo.area) || !CommonFunction.isEmpty(this.buildingAddressInfo.road)
          || !CommonFunction.isEmpty(this.buildingAddressInfo.street)) {
          this.axios.post('/api/profInfo/addBuildAddress', this.buildingAddressInfo, {
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data) {
              return CommonFunction.dataIsNull(data)
            }]
          });
        }
        if (this.mapInfoData !== []) {
          this.axios.post('/api/profInfo/addMapInfo', JSON.stringify(this.mapInfoData), config);
        }
        if (this.areaHisNoData !== []) {
          this.axios.post('/api/profInfo/addAreaHisNo', JSON.stringify(this.areaHisNoData), config);
        }
        if (this.projectNoData !== []) {
          this.axios.post('/api/profInfo/addProjectNo', JSON.stringify(this.projectNoData), config);
        }
          alert('保存完毕！');
          this.$refs.specialView.goback();
          this.$emit('changeShowView')
        },
      saveArch() {
        // 判断档案有无特性著录项
        if (this.$refs.specialView != null) {
          this.$refs.specialView.saveArch();
        }
        else {
          // 一份档案的专业信息存储
          if (!CommonFunction.isEmpty(this.profArch.buildCompany) || !CommonFunction.isEmpty(this.profArch.buildProject)) {
            this.axios.post('/api/profInfo/addProfInfo', this.profArch,{
              //判断字段是否为null，是则转为空字符串
              transformRequest: [function (data){
                return CommonFunction.dataIsNull(data)
              }]
            });
            alert('保存完毕！');
          }
          if (!CommonFunction.isEmpty(this.buildingAddressInfo.area) || !CommonFunction.isEmpty(this.buildingAddressInfo.road)
            || !CommonFunction.isEmpty(this.buildingAddressInfo.street)) {
            this.axios.post('/api/profInfo/addBuildAddress', this.buildingAddressInfo,{
              //判断字段是否为null，是则转为空字符串
              transformRequest: [function (data){
                return CommonFunction.dataIsNull(data)
              }]
            });
          }
          if (this.mapInfoData !== []) {
            this.axios.post('/api/profInfo/addMapInfo',JSON.stringify(this.mapInfoData),config)
          }
          if (this.areaHisNoData !== []) {
            this.axios.post('/api/profInfo/addAreaHisNo', JSON.stringify(this.areaHisNoData),config);
          }
          if (this.projectNoData !== []) {
            this.axios.post('/api/profInfo/addProjectNo', JSON.stringify(this.projectNoData),config);
          }
          this.$router.go(-2);
          this.$emit('changeShowView')
        }
      },
      // 更新档案信息
      realUpdate (){
        this.axios.post('/api/profInfo/updateProfInfo', this.profArch,{
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data){
            return CommonFunction.dataIsNull(data)
          }]
        }).then(res => {
          //todo,有错报错，没错提示并跳转
        });
        //项目地点更新
        this.axios.post('/api/profInfo/updateBuildAddress', this.buildingAddressInfo,{
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data){
            return CommonFunction.dataIsNull(data)
          }]
        });
        //子组件的数据更新方法
        // this.$refs.PBA.updatePBA(); //旧版
        this.$refs.PMI.updatePMI();
        this.$refs.PAHN.updatePAHN();
        this.$refs.PPN.updatePPN();
        alert('修改完毕')
      },
      updateArch() {
        // 判断档案有无特性著录项
        if (this.$refs.specialView != null) {
          // 保存特性著录项(返回是否能保存或修改的标识)
          this.$refs.specialView.updateArch();
        }else{
          this.axios.post('/api/profInfo/updateProfInfo', this.profArch,{
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data){
              return CommonFunction.dataIsNull(data)
            }]
          }).then(res => {
            //todo,有错报错，没错提示并跳转
            alert('修改完毕')
          });
          //项目地点更新
          this.axios.post('/api/profInfo/updateBuildAddress', this.buildingAddressInfo,{
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data){
              return CommonFunction.dataIsNull(data)
            }]
          });
          //子组件的数据更新方法
          // this.$refs.PBA.updatePBA(); //旧版
          this.$refs.PMI.updatePMI();
          this.$refs.PAHN.updatePAHN();
          this.$refs.PPN.updatePPN();
        }
      },
      //后退
      goBack() {
        if (this.$refs.specialView != null) {
          //有些跳2有的跳3
          // this.$router.go(-2);
          this.$refs.specialView.goback();
        } else {
          this.$router.go(-2);
        }
        this.$emit('changeShowView')
      },
      //特殊界面的校验，不通过时，不给按“保存”或“修改”
      // SUoperation (data) {
      //   this.SaveOrUpdate = data
      // },
      // 子组件项目地点表传过来的数据
      // saveBAD(data) {
      //   this.buildingAddressData = data
      // },
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
      }
    },
    mounted() {
      this.$router.push({name: 'ProfCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadArch()
    }
  }
</script>

<style scoped>
  .writeInput {
    width: 310px;
    float: right;
  }

  .FormItemClass {
    margin-left: 10px;
  }
  .tips{
    float: right;
    text-align: center;
  }
  /*如果位置有变，错误的显示信息需要改变大小*/
  .FormItemClass >>> .ivu-form-item-error-tip {
    padding-top: 35px !important;
  }
</style>
