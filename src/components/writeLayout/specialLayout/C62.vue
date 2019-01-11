<template>
  <Row>
    <Col span="20" offset="1">
      <Form class="formClass" :model="C62Info" :label-width="labelWidth">
        <Row class="WriteLayoutFont" :gutter="16">
          <Col span="8">
            <FormItem class="FormItemClass" label="规划设计单位">
              <Input placeholder="..." v-model="C62Info.designCompany" class="writeInput"/>
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
    name: 'C62',
    props: ['isUpdate'],
    data() {
      return {
        labelWidth: 100,
        archId: this.$route.params.archId,
        C62Info: {
          id: null,
          archId: this.$route.params.archId, // 读取出来
          designCompany: ''
        }
      }
    },
    methods: {
      loadC62() {
        if (this.isUpdate === true) {
          this.axios.get('/api/profETC/getC62', {params: {archId: this.archId}}).then(
            res => {
              this.C62Info = res.data.data
            }
          )
        }
      },
      saveArch() {
        this.axios.post('/api/profETC/addC62', this.C62Info, ArchRequestConfig);
        this.$emit('RealSave');
      },
      updateArch() {
        this.axios.post('/api/profETC/updateC62', this.C62Info, ArchRequestConfig);
        this.$emit('RealUpdate');
      },
      goback() {
        this.$router.go(-2);
      }
    },
    mounted() {
      this.loadC62()
    }
  }
</script>

<style scoped>

</style>
