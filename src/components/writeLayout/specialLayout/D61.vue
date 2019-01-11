<template>
  <Row>
    <Col span="20" offset="1">
        <!-- D61验收测量记录册 -->
        <RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo"
                    @saveMeasureInfoData="saveD61MI" class="routeView"></RouterView>


        <!-- D61验收建筑层数与面积 -->
        <RouterView ref="NumAInfo" name="NumAreaInfo" :isUpdate="updateInfo"
                    @saveNumAreaInfoData="saveD61NAI" class="routeView"></RouterView>


        <!-- D61公建配套详细 -->
        <RouterView ref="PubBInfo" name="D61PubBuildInfo" :isUpdate="updateInfo"
                    @savePubBuildInfoData="saveD61PBI" class="routeView"></RouterView>
    </Col>
  </Row>
</template>

<script>
  import {ArchRequestConfig} from "../../../js/global";

  export default {
    name: "D61",
    props: ['isUpdate'],
    data() {
      return {
        archType: this.$route.params.archType,
        archId: this.$route.params.archId,
        MeasureInfoData: [],
        NumAreaInfoData: [],
        PubBuildInfoData: [],
        updateInfo: this.isUpdate
      }
    },
    methods: {
      loadD61() {

      },
      saveArch() {
        if (this.MeasureInfoData !== []) {
          this.axios.post('/api/profETC/addD61MI', JSON.stringify(this.MeasureInfoData), ArchRequestConfig);
        }
        if (this.NumAreaInfoData !== []) {
          this.axios.post('/api/profETC/addD61NumAreaInfo', JSON.stringify(this.NumAreaInfoData), ArchRequestConfig);
        }
        if (this.PubBuildInfoData !== []) {
          this.axios.post('/api/profETC/addD61PubBuildInfo', JSON.stringify(this.PubBuildInfoData), ArchRequestConfig);
        }
      },
      updateArch() {
        this.$refs.MeaInfo.updatePMI();
        this.$refs.NumAInfo.updatePMI();
        this.$refs.PubBInfo.updatePMI();
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
      goback() {
        this.$router.go(-3);
      }
    },
    mounted() {
      this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD61()
    }
  }
</script>

<style scoped>
  .routeView {
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
