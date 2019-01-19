<template>
  <Row>
    <Col span="20" offset="1">
      <!-- 验收测量记录册 -->
      <!--<RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo" @saveMeasureInfoData="saveD62MI"></RouterView>-->
      <MeasureInfo ref="MeaInfo" name="MeasureInfo" :D6123SpecParams="D6123SpecParams" @saveMeasureInfoData="saveD62MI"></MeasureInfo>
    </Col>
  </Row>
</template>

<script>
  import {ArchRequestConfig} from '../../../js/global'
  import MeasureInfo from "./MeasureInfo";

  export default {
    name: "D62",
    components: {MeasureInfo},
    props: ['specViewParams'],
    data() {
      return {
        archType: this.specViewParams.archType,
        archId: this.specViewParams.archId,
        MeasureInfoData: [],
        updateInfo: this.specViewParams.isUpdate,
        D6123SpecParams: ''
      }
    },
    methods: {
      saveArch() {
        if (this.MeasureInfoData !== []) {
          this.axios.post('/api/profETC/addD62MI', JSON.stringify(this.MeasureInfoData), ArchRequestConfig)
            .then(res =>{
              this.$emit('RealSave');
            });
        }
      },
      updateArch() {
        this.$refs.MeaInfo.updatePMI();
        this.$emit('RealUpdate');
      },
      saveD62MI(data) {
        this.MeasureInfoData = data
      },
      initD6123Params() {
        this.D6123SpecParams = this.specViewParams
      }
    },
    mounted() {
      // this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
    },
    created() {
      this.initD6123Params();
    }
  }
</script>

<style scoped>

</style>
