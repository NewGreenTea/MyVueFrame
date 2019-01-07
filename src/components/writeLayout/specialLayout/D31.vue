<template>
  <div style="overflow: auto;">
  <Row>
    <Col>
      <Form class="formClass" :model="D31Info">
        <Row>
          <Col>
            <Row>
              <Col span="8">
                <FormItem class="FormItemClass" label="设计单位">
                  <Input placeholder="..." v-model="D31Info.designCompany" class="writeInput"/>
                </FormItem>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
    </Col>

    <Col>
    <!-- 报建项目详细 -->
    <RouterView ref="BPInfo" name="BuildProjInfo" :isUpdate="updateInfo"
                @saveBuildProjInfoData="saveD31BPI" class="routeView"></RouterView>
    </Col>

    <Col>
    <!-- 公建配套 -->
    <RouterView ref="PBInfo" name="D31PubBuildInfo" :isUpdate="updateInfo"
                @savePubBuildInfoData="saveD31PBI" class="routeView"></RouterView>
    </Col>
  </Row>
  </div>
</template>

<script>
  import {CommonFunction, ArchRequestConfig} from "../../../js/global";

  export default {
    name: "D31",
    props: ['isUpdate'],
    data() {
      return {
        archId: this.$route.params.archId,
        D31Info: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
          designCompany: ''
        },
        PubBuildInfoData: [],
        BuildProjInfoData: [],
        updateInfo: this.isUpdate
      }
    },
    methods: {
      loadD31() {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getD31', {params: {archId: this.archId}}).then(
            res => {
              this.D31Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.$emit('RealSave');
        this.axios.post('/api/profETC/addD31', this.D31Info,{
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data){
            return CommonFunction.dataIsNull(data)
          }]
        });
        if (this.BuildProjInfoData !== []) {
          this.axios.post('/api/profETC/addD31BuildProjInfo', JSON.stringify(this.BuildProjInfoData),ArchRequestConfig);
        }
        if (this.PubBuildInfoData !== []) {
          this.axios.post('/api/profETC/addD31PubBuildInfo', JSON.stringify(this.PubBuildInfoData),ArchRequestConfig);
        }
      },
      saveD31BPI(data) {
        this.BuildProjInfoData = data
      },
      saveD31PBI(data) {
        this.PubBuildInfoData = data
      },
      updateArch() {
        this.$emit('RealUpdate');
        this.axios.post('/api/profETC/updateD31', this.D31Info, ArchRequestConfig);
        this.$refs.BPInfo.updatePMI();
        this.$refs.PBInfo.updatePMI();
      },
      goback () {
        //todo
      }
    },
    mounted() {
      this.$router.push({name: 'ProfSpcCommon', params: {archId: this.$route.params.archId, archType: this.archType}});
      this.loadD31()
    }
  }
</script>

<style scoped>
  .routeView{
    margin-top: 10px;
    margin-bottom: 10px;
  }
</style>
