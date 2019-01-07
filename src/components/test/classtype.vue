<template>
  <!--<div style="overflow: auto">-->
  <div style="height: 600px">
    <Row>
      <Col span="8">&nbsp;</Col>
      <Col span="8">
        <Form :model="baseArch">
          <FormItem class="FormItemClass" label="类型名" style="width:300px">
            <Input placeholder="..." v-model="baseArch.className" class="writeInput"/>
          </FormItem>
          <FormItem class="FormItemClass" label="类型描述" style="width:300px">
            <Input placeholder="..." v-model="baseArch.classDes" class="writeInput"/>
          </FormItem>
          <FormItem class="FormItemClass" label="上级类型" style="width:300px" clearable="true">
            <!--<Input placeholder="..." v-model="baseArch.parent" class="writeInput"/>-->
            <i-select placeholder="选择类别" style="width:300px" v-model="baseArch.parentId">
              <i-option v-for="type in OneTypes" :key="type.id" :value="type.id">{{type.className}}</i-option>
            </i-select>
          </FormItem>
        </Form>
        <Button @click="addClassType">+</Button>
      </Col>
      <Col span="8">
        <Col span="24">
          <i-select placeholder="选择类别" style="width:300px" v-model="moreParentId">
            <i-option v-for="type in OneTypes" :key="type.id" :value="type.id">{{type.className}}</i-option>
          </i-select>
        </Col>
        <Col span="24">
          <Upload ref="upload" action="/api/arch/archTypeExcel" :showUploadList="false" :on-success="importList"
                  :multiple="true">
            <i-button type="primary">导入类型Excel</i-button>
          </Upload>
        </Col>
        <Col span="2">&nbsp;</Col>
        <Col span="20">
          <Table :columns="typeColymns" :data="typeData"></Table>
        </Col>
        <Col span="2">&nbsp;</Col>
        <Col span="24">
          <Button @click="addMoreClassType">确认</Button>
        </Col>
      </Col>
    </Row>
  </div>
</template>

<script>
  export default {
    name: "classtype",
    data() {
      return {
        //一级类型选择框
        OneTypes: [],
        //导入类型临时存储变量
        moreArchType: '',
        //导入类型上级类型变量
        moreParentId: '',
        // 导入类型清单显示
        typeColymns: [
          {
            title: '序号',
            width: 60,
            type: 'index'
          },
          {
            title: '类型名',
            key: 'className'
          },
          {
            title: '操作',
            width: 70,
            align: 'center',
            render: (h, params) => { // 第二个为对象，包含 row、column 和 index，分别指当前行数据，当前列数据，当前行索引
              return h('div', [
                h('Button',
                  {
                    props: {
                      type: 'primary', size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        //todo
                      }
                    }
                  }, '删除')
              ])
            }
          }
        ],
        //导入类型的所有数据
        typeData: [],
        //类型结构体
        baseArch: {
          id: '',
          className: '',
          classDes: '',
          parentId: '',
          position: '',
          creatorId: 'admin',
          createTime: '',
          modifierId: 'admin',
          modifyTime: ''
        }
      }
    },
    methods: {
      //添加新类型
      addClassType() {
        if (this.baseArch.parentId === '无') {
          this.baseArch.parentId = ''
        }
        this.baseArch.createTime = new Date
        this.baseArch.modifyTime = new Date
        this.axios.post('/api/arch/addClassType', this.baseArch).then(res => {
          this.baseArch.className = ''
          this.baseArch.classDes = ''
          this.baseArch.parentId = ''
        })
      },
      //加载一级类型
      loadOneType() {
        this.axios.get('/api/arch/allOneClass', this.baseArch).then(
          res => {
            this.OneTypes = res.data.data
            let temp = {
              id: '',
              className: '无',
              classDes: '',
              parentId: '无',
              position: '',
              creatorId: '',
              createTime: '',
              modifierId: '',
              modifyTime: ''
            }
            this.OneTypes.push(temp)
          }
        )
      },
      //导入清单的处理
      importList(response, file, fileList) {
        this.typeData = response.data
        if(this.moreParentId !== ''){
          for(let i=0;i<this.typeData.length;i++){
            this.typeData[i].parentId = this.moreParentId
            // 设置无关紧要的数值
            this.typeData[i].creatorId = 'admin'
            this.typeData[i].modifierId = 'admin'
            this.typeData[i].createTime = new Date()
            this.typeData[i].modifyTime = new Date()
          }
        }
      },
      //批量添加
      addMoreClassType() {
        this.axios.post('/api/arch/addMoreArchType', this.typeData).then( () => {
          this.typeData = null
          this.moreParentId = ''
        })
      }
    },
    mounted() {
      this.loadOneType()
    }
  }
</script>

<style scoped>

</style>
