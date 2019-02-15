<template>
  <Row>
    <Col span="22" offset="1">
      <Form class="formClass" :model="C63Info" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <FormItem class="FormItemClass" label="规划设计单位">
              <Input placeholder="..." v-model="C63Info.designCompany" class="writeInput"/>
            </FormItem>
          </Col>
        </Row>
      </Form>
    </Col>
  </Row>
</template>

<script>
  import {ArchRequestConfig} from "../../../js/global";

  export default {
    name: 'C63',
    props: ['specViewParams'],
    data() {
      return {
        labelWidth: 80,
        archId: this.specViewParams.archId,
        C63Info: {
          id: null,
          archId: this.specViewParams.archId, // 读取出来
          designCompany: ''
        }
      }
    },
    methods: {
      loadC63() {
        if (this.specViewParams.isUpdate === true) {
          this.axios.get('/api/profETC/getC63', {params: {archId: this.specViewParams.archId}}).then(
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
      updateArch() {
        this.axios.post('/api/profETC/updateC63', this.C63Info, ArchRequestConfig);
        this.$emit('RealUpdate');
      }
    },
    mounted() {
      this.loadC63()
    }
  }
</script>

<style scoped>

</style>
