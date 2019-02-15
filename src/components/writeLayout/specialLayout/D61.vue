<template>
  <Row>
    <Col span="22" offset="1">
      <!-- D61验收测量记录册 -->
      <!--<RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo"-->
      <!--@saveMeasureInfoData="saveD61MI" class="routeView"></RouterView>-->
      <MeasureInfo ref="MeaInfo" name="MeasureInfo" :D6123SpecParams="D6123SpecParams"
                   @saveMeasureInfoData="saveD61MI" class="routeView"></MeasureInfo>

      <!-- D61验收建筑层数与面积 -->
      <!--<RouterView ref="NumAInfo" name="NumAreaInfo" :isUpdate="updateInfo"-->
      <!--@saveNumAreaInfoData="saveD61NAI" class="routeView"></RouterView>-->
      <NumAreaInfo ref="NumAInfo" name="NumAreaInfo" :D6123SpecParams="D6123SpecParams"
                   @saveNumAreaInfoData="saveD61NAI" class="routeView"></NumAreaInfo>

      <!-- D61公建配套详细 -->
      <!--<RouterView ref="PubBInfo" name="D61PubBuildInfo" :isUpdate="updateInfo"-->
      <!--@savePubBuildInfoData="saveD61PBI" class="routeView"></RouterView>-->
      <PubBuildInfo ref="PubBInfo" name="D61PubBuildInfo" :D6123SpecParams="D6123SpecParams"
                    @savePubBuildInfoData="saveD61PBI" class="routeView"></PubBuildInfo>
    </Col>
  </Row>
</template>

<script>
  import {ArchRequestConfig} from "../../../js/global";
  import MeasureInfo from "./MeasureInfo";
  import NumAreaInfo from "./D61NumAreaInfo";
  import PubBuildInfo from "./D61PubBuildInfo";

  export default {
    name: "D61",
    components: {NumAreaInfo, PubBuildInfo, MeasureInfo},
    props: ['specViewParams'],
    data() {
      return {
        archType: this.specViewParams.archType,
        archId: this.specViewParams.archId,
        MeasureInfoData: [],
        NumAreaInfoData: [],
        PubBuildInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        D6123SpecParams: ''
      }
    },
    methods: {
      // loadD61() {
      //
      // },
      saveArch() {
        this.axios.all([this.axiosSaveD61NAI(), this.axiosSaveD61MI(), this.axiosSaveD61PBI()])
          .then(this.axios.spread((oneRespone, twoRespone, threeRespone) =>{
            // console.log('oneRespone' + JSON.stringify(oneRespone));
            // console.log('twoRespone' + JSON.stringify(twoRespone));
            // console.log('threeRespone' + JSON.stringify(threeRespone));
            this.$emit('RealSave');
          }))
      },
      updateArch() {
        this.axios.all([this.$refs.MeaInfo.updatePMI(),this.$refs.NumAInfo.updatePMI(),this.$refs.PubBInfo.updatePMI()])
          .then(this.axios.spread((res1,res2,res3) => {
            this.$emit('RealUpdate')
          }))
      },
      saveD61MI(data) {
        this.MeasureInfoData = data
      },
      saveD61NAI(data) {
        this.NumAreaInfoData = data
      },
      saveD61PBI(data) {
        this.PubBuildInfoData = data
      },
      axiosSaveD61NAI() {
        if (this.MeasureInfoData !== []) {
          this.axios.post('/api/profETC/addD61MI', JSON.stringify(this.MeasureInfoData), ArchRequestConfig);
        }
      },
      axiosSaveD61MI() {
        if (this.NumAreaInfoData !== []) {
          this.axios.post('/api/profETC/addD61NumAreaInfo', JSON.stringify(this.NumAreaInfoData), ArchRequestConfig);
        }
      },
      axiosSaveD61PBI() {
        if (this.PubBuildInfoData !== []) {
          this.axios.post('/api/profETC/addD61PubBuildInfo', JSON.stringify(this.PubBuildInfoData), ArchRequestConfig);
        }
      },
      initD6123Params() {
        this.D6123SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      // this.loadD61()
    },
    created() {
      this.initD6123Params();
    }
  }
</script>

<style scoped>

</style>
