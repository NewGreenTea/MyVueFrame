<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="D31Info" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <FormItem class="FormItemClass" label="设计单位">
              <Input placeholder="..." v-model="D31Info.designCompany" class="writeInput"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Col>

    <Col span="22" offset="1">
      <!-- 报建项目详细 -->
      <!--<RouterView ref="BPInfo" name="BuildProjInfo" :isUpdate="updateInfo"-->
                  <!--@saveBuildProjInfoData="saveD31BPI" class="routeView"></RouterView>-->
      <D31BuildProjInfo ref="BPInfo" name="BuildProjInfo" :D31SpecParams="D31SpecParams"
                        @saveBuildProjInfoData="saveD31BPI" class="routeView"></D31BuildProjInfo>
    </Col>

    <Col span="22" offset="1">
      <!-- 公建配套 -->
      <!--<RouterView ref="PBInfo" name="D31PubBuildInfo" :isUpdate="updateInfo"-->
                  <!--@savePubBuildInfoData="saveD31PBI" class="routeView"></RouterView>-->
      <D31PubBuildInfo ref="PBInfo" name="D31PubBuildInfo" :D31SpecParams="D31SpecParams"
                       @savePubBuildInfoData="saveD31PBI" class="routeView"></D31PubBuildInfo>
    </Col>
  </Row>
</template>

<script>
  import {CommonFunction, ArchRequestConfig} from "../../../js/global";
  import D31PubBuildInfo from "./D31PubBuildInfo";
  import D31BuildProjInfo from "./D31BuildProjInfo";

  export default {
    name: "D31",
    components: {D31BuildProjInfo, D31PubBuildInfo},
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        archId: this.specViewParams.archId,
        D31Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          designCompany: ''
        },
        PubBuildInfoData: [],
        BuildProjInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        //传递参数
        D31SpecParams: ''
      }
    },
    methods: {
      loadD31() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getD31', {params: {archId: this.specViewParams.archId}}).then(
            res => {
              if(res.data.data !== null){
                this.D31Info = res.data.data
              }
            }
          )
        }
      },
      saveArch() {
        this.axios.all([this.axios.post('/api/profETC/addD31', this.D31Info, ArchRequestConfig),
        this.axiosSaveD31BPI(),this.axiosSaveD31PBI()]).then(this.axios.spread((res1,res2,res3) => {
          this.$emit('RealSave');
        }))
      },
      saveD31BPI(data) {
        this.BuildProjInfoData = data
      },
      saveD31PBI(data) {
        this.PubBuildInfoData = data
      },
      axiosSaveD31BPI(){
        if (this.BuildProjInfoData !== []) {
          this.axios.post('/api/profETC/addD31BuildProjInfo', JSON.stringify(this.BuildProjInfoData), ArchRequestConfig);
        }
      },
      axiosSaveD31PBI(){
        if (this.PubBuildInfoData !== []) {
          this.axios.post('/api/profETC/addD31PubBuildInfo', JSON.stringify(this.PubBuildInfoData), ArchRequestConfig);
        }
      },
      updateArch() {
        this.axios.post('/api/profETC/updateD31', this.D31Info, ArchRequestConfig);
        this.$refs.BPInfo.updatePMI();
        this.$refs.PBInfo.updatePMI();
      },
      initParams(){
        this.D31SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD31()
    },
    created() {
      this.initParams();
    }
  }
</script>

<style scoped>
</style>
