<template>
  <Form class="formClass" :model="C63Info">
    <Row>
      <Col>
        <Row>
          <Col span="8">
            <FormItem class="FormItemClass" label="规划设计单位">
              <Input placeholder="..." v-model="C63Info.designCompany" class="writeInput"/>
            </FormItem>
          </Col>
        </Row>
      </Col>
    </Row>
  </Form>
</template>

<script>
  import {ArchRequestConfig} from "../../../js/global";

  export default {
  name: 'C63',
  props: ['isUpdate'],
  data() {
    return {
      archId: this.$route.params.archId,
      C63Info: {
        id: null,
        archId: this.$route.params.archId, // 读取出来
        designCompany: ''
      }
    }
  },
  methods: {
    loadC63() {
      if (this.isUpdate === true) {
        this.axios.get('/api/profETC/getC63', {params: {archId: this.archId}}).then(
          res => {
            this.C63Info = res.data.data
          }
        )
      }
    },
    saveArch() {
      this.axios.post('/api/profETC/addC63', this.C63Info, ArchRequestConfig);
      this.$emit('RealSave');
    },
    updateArch () {
      this.axios.post('/api/profETC/updateC63', this.C63Info, ArchRequestConfig);
      this.$emit('RealUpdate');
    },
    goback(){
      this.$router.go(-2);
    }
  },
  mounted () {
    this.loadC63()
  }
}
</script>

<style scoped>

</style>
