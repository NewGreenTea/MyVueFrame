<template>
  <div style="margin-bottom: 20px">
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
          <Col span="22" offset="1">
            <!--<Form class="formClass" :model="profArch" :label-width="labelWidth" :rules="rules" ref="profForm">-->
            <Form class="formClass" :model="profArch" :label-width="labelWidth">
              <Row :gutter="16">
                <Col span="8">
                  <FormItem class="FormItemClass" label="建设单位">
                    <Input placeholder="..." v-model="profArch.buildCompany"/>
                  </FormItem>
                </Col>
                <Col span="8">
                  <FormItem class="FormItemClass" label="建设项目">
                    <Input placeholder="..." v-model="profArch.buildProject"/>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <!--项目地点信息-->
        <Row>
          <Col span="22" offset="1">
            <Form class="formClass" :model="buildingAddressInfo" :rules="rules">
              <Row>
                <Col span="2">
                  <p class="buildingAddressCss">建设地址</p>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem label="区">
                    <Row>
                      <Col span="20">
                        <Input placeholder="..." v-model="buildingAddressInfo.area"/>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem label="街">
                    <Row>
                      <Col span="20">
                        <Input placeholder="..." v-model="buildingAddressInfo.road"/>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem label="路">
                    <Row>
                      <Col span="20">
                        <Input placeholder="..." v-model="buildingAddressInfo.street"/>
                      </Col>
                    </Row>
                  </FormItem>
                </Col>
                <Col span="4" class="formSpec">
                  <FormItem prop="no" label="号">
                    <Row>
                      <Col span="20">
                        <Input placeholder="..." v-model="buildingAddressInfo.no"/>
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
          <Col span="22" offset="1">
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
    <Row class="profButtonView" :gutter="16">
      <Col span="6" offset="9">
        <div>
          <Button type="success" v-if="archCommit" @click="commitArch">确认</Button>
          <Button @click="goFileInfo">文件信息</Button>
          <Button @click="saveArch" v-if="operation">保存</Button>
          <Button @click="updateArch" v-if="!operation">修改</Button>
          <Button @click="goBack">返回</Button>
        </div>
      </Col>
    </Row>

    <Modal v-model="showModal" title="确认信息" @on-ok="tips(3)">
      <div>
        档案的基本信息，专业信息，文件信息都已著录完，是否完成这份档案?
      </div>
    </Modal>
  </div>
</template>

<script>
  import {isIntegerNotMust, notNull} from '../../js/validate'
  import {CommonFunction, ArchRequestConfig, SystemFunction, archNoType} from '../../js/global'
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
        showModal: false,
        archCommit:false,
        labelWidth: 80,
        archID: this.ProfParams.archId,
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
          archId: this.ProfParams.archId, // 读取出来
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
        //控制显示
        showMapInfo: false,
        showAreaHisNo: false,
        showProjectNo: false,
        //专业信息校验规则  -2019/02/22弃用
        rules: {
          buildCompany: [
            {validator: notNull, trigger: 'blur'}
          ],
          buildProject: [
            {validator: notNull, trigger: 'blur'}
          ],
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
          this.axios.get('/api/loadArch/getArchInfo', {
            params: {
              archId: this.archID,
              ArchInfo: 'ProfInfo'
            }
          }).then(res => {
                this.profArch = res.data.data
              }
            );
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.archID,
              ArchInfo: 'BA'
            }
          }).then(res => {
                this.buildingAddressInfo = res.data.data;
              }
            );
          this.updateInfo = true
        };
        if(this.ProfParams.archCommit === true){
          this.archCommit = true
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
        // this.$refs.profForm.validate((valid) => {
        //   alert(valid);
        //   if (valid) {
        this.axios.post('/api/profInfo/addBuildAddress', this.buildingAddressInfo, ArchRequestConfig).then(res => {
          this.axios.post('/api/profInfo/addProfInfo', this.profArch, {
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data) {
              return CommonFunction.dataIsNull(data)
            }]
          }).then(res => {
            //把专业信息的字段反写给档案信息的基本信息中的标题
            let road, street, no;
            if (this.buildingAddressInfo.road !== '') {
              road = this.buildingAddressInfo.road
            } else {
              road = ''
            }
            if (this.buildingAddressInfo.street !== '') {
              street = this.buildingAddressInfo.street
            } else {
              street = ''
            }
            if (this.buildingAddressInfo.no !== '') {
              no = this.buildingAddressInfo.no
            } else {
              no = ''
            }
            //反写入到档案基本信息的案卷标题  -可提取出来
            let BaseTitle = this.profArch.buildCompany + this.profArch.buildProject + this.buildingAddressInfo.area
              + road + street + no;
            if (this.archType !== 'B1.3' && this.archType !== 'D8' && !(this.archType.indexOf('C4') > -1)) { //B1.3和D8不用写到标题
              this.axios.post('/api/baseInfo/updateBaseTitle', this.qs.stringify({
                archID: this.ProfParams.archId,
                archNo: this.archNo,
                archType: this.ProfParams.archTypeID,
                dispatchNo: this.ProfParams.dispatchNo,
                title: BaseTitle
              }))
            }
          });
        });

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
        this.checkComplete(this.archID);
        this.operation =false;
        // this.$emit('changeShowView')
        // }
        // else {
        //   this.$Message.error('著录信息有误！');
        // }
        // })
      },
      //检测三大信息是否完成的方法
      checkComplete(id) {
        //触发三大信息是否著录完，弹出提示
        this.axios.post('/api/loadArch/ArchIsComplete', this.qs.stringify({
          archID: id
        })).then(res => {
          if (res.data === 1) {
            this.archCommit = true
          }
        });
      },
      saveArch() { // 无特性档案的著录专业信息存储方法
        // 判断档案有无特性著录项
        if (this.$refs.specialView !== null && this.$refs.specialView !== undefined) {
          // this.$refs.profForm.validate((valid) => {
          //   if (valid) {
              this.$refs.specialView.saveArch();  //即调用realSave方法,但是里面包含个性信息保存操作
            // } else {
            //   this.$Message.error('著录信息有误！');
            // }
          // })
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
            this.$Message.info('修改完毕！');
            this.checkComplete(this.ProfParams.archId);
          }));
        //把专业信息的字段反写给档案信息的基本信息中的标题
        let road, street, no;
        if (this.buildingAddressInfo.road !== '') {
          road = this.buildingAddressInfo.road
        } else {
          road = ''
        }
        if (this.buildingAddressInfo.street !== '') {
          street = this.buildingAddressInfo.street
        } else {
          street = ''
        }
        if (this.buildingAddressInfo.no !== '') {
          no = this.buildingAddressInfo.no
        } else {
          no = ''
        }
        //反写入到档案基本信息的案卷标题
        let BaseTitle = this.profArch.buildCompany + this.profArch.buildProject + this.buildingAddressInfo.area
          + road + street + no;
        if (this.archType !== 'B1.3' && this.archType !== 'D8' && !(this.archType.indexOf('C4') > -1)) { //B1.3和D8不用写到标题
          this.axios.post('/api/baseInfo/updateBaseTitle', this.qs.stringify({
            archID: this.ProfParams.archId,
            dispatchNo: this.ProfParams.dispatchNo,
            archNo: this.archNo,
            archType: this.ProfParams.archTypeID,
            title: BaseTitle
          }));
        }
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
        this.axios.get('/api/baseInfo/existBaseInfo', {params: {archId: this.archID}})
          .then(res => {
            let temp;
            if (res.data.data.length === 0) {
              temp = true;
            } else {
              temp = false;
            }
            this.axios.post('/api/loadArch/necessaryBaseInfo', this.qs.stringify({archID: this.archID})).then(res2 => {
              let data = {
                archId: this.archID, //传递一些重要参数给下一个界面
                archNo: this.archNo,
                registerNo: res2.data.registerNo,
                dispatchDocNo: res2.data.dispatchDocNo,
                archTypeID: this.profArch.classId,
                archTypeName: archNoType.writeVueLayout2(this.archNo),
                archInputDate: res2.data.inputDate,
                title: res.data.data.title,
                operation: temp
              };
              this.$emit('toShowOther', 'BaseInfo', data)
            });
          })
      },
      //跳转到文件级信息
      goFileInfo() {
        this.axios.get('/api/fileInfo/existFileInfo', {params: {archId: this.archID}})
          .then(res => {
            let temp;
            if (res.data.data === 0) {
              temp = true;
            } else {
              temp = false;
            }
            let data = {
              archId: this.archID, //传递一些重要参数给下一个界面
              archNo: this.archNo,
              archTypeID: this.profArch.classId,
              operation: temp,
              archCommit: this.archCommit
            };
            this.$emit('toShowOther', 'FileInfo', data)
          })
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
      },
      //确认档案完成信息
      tips(statue) {
        //检测基本信息的文件页数和文件级信息文件编号是否相等
        this.axios.post('/api/loadArch/checkArchFilePage', this.qs.stringify({archID: this.ProfParams.archId})).then(res => {
          if (res.data.code === 1) {
            this.$Message.error(res.data.msg);
          } else {
            // 修改档案状态，变为已著录/待质检的状态
            this.axios.post('/api/loadArch/writeComplete', this.qs.stringify({archID: this.ProfParams.archId,twoStatue:statue})).then(res => {
              this.archCommit = false;
              this.$emit('changeShowView')
            })
          }
        })
      },
      //确认提示
      commitArch(){
        this.showModal = true;
      },
      //检测三大信息是否完成的方法
      checkComplete(id){
        //触发三大信息是否著录完，弹出提示
        this.axios.post('/api/loadArch/ArchIsComplete', this.qs.stringify({
          archID: id
        })).then(res => {
          if(res.data ===1){
            this.archCommit = true
          }
        });
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadArch();
      this.showMapInfo = true;
      this.showAreaHisNo = true;
      this.showProjectNo = true;
      if (this.getSystemCode === '无') {
        this.buildingAddressInfo.area = ''
      } else {
        this.buildingAddressInfo.area = SystemFunction.getSystemDistrict(this.getSystemCode)
      }
    },
    computed: {
      getSystemCode() {
        if (this.$store.state.systemCode === '') {
          return window.localStorage.getItem('systemCode')
        } else {
          return this.$store.state.systemCode
        }
      }
    },
    created() {
      this.initSpecParams();
    }
  }
</script>

<style scoped>

</style>
