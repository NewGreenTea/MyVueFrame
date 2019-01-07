<template>
  <!-- 验收测量记录册 -->
  <RouterView ref="MeaInfo" name="MeasureInfo" :isUpdate="updateInfo" @saveMeasureInfoData="saveD62MI"></RouterView>
</template>

<script>
  import {ArchRequestConfig} from '../../../js/global'

  export default {
    name: "D62",
    props: ['isUpdate'],
    data() {
      return {
        archType: this.$route.params.archType,
        archId: this.$route.params.archId,
        MeasureInfoData: [],
        updateInfo: this.isUpdate
      }
    },
    methods: {
      saveArch() {
        if (this.MeasureInfoData !== []) {
          this.axios.post('/api/profETC/addD62MI', JSON.stringify(this.MeasureInfoData),ArchRequestConfig);
          this.$emit('RealSave');
        }
      },
      updateArch() {
        this.$refs.MeaInfo.updatePMI();
        this.$emit('RealUpdate');
      },
      saveD62MI (data) {
        this.MeasureInfoData = data
      },
      goback(){
        this.$router.go(-3);
      }
    },
    mounted() {
      this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
    }
  }
</script>

<style scoped>

</style>
