<template>
  <Row>
    <Col>
      项目地点表
      <Button @click="saveBAddress">+</Button>
      <Button @click="updateBAddress" v-if="isUpdate">√</Button>
      <Button @click="cancleBAddress">-</Button>
    </Col>
    <Col>
      <Table border :columns="columns" :data="tableData" :height="tableHeight"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal v-model="AddModal" draggable :closable="false" title="添加项目地点" @on-ok="addBAddressData">
      <Form v-model="buildingAddressInfo">
        <FormItem label="区">
          <Input placeholder="..." v-model="buildingAddressInfo.area" class="writeInput"/>
        </FormItem>
        <FormItem label="路">
          <Input placeholder="..." v-model="buildingAddressInfo.road" class="writeInput"/>
        </FormItem>
        <FormItem label="街">
          <Input placeholder="..." v-model="buildingAddressInfo.street" class="writeInput"/>
        </FormItem>
        <FormItem label="号">
          <Input placeholder="..." v-model="buildingAddressInfo.no" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="UpdateModal" draggable :closable="false" title="修改项目地点" @on-ok="updateBAddressData" @on-cancel="cancleUpdate">
      <Form v-model="buildingAddressInfo">
        <FormItem label="区">
          <Input placeholder="..." v-model="buildingAddressInfo.area" class="writeInput"/>
        </FormItem>
        <FormItem label="路">
          <Input placeholder="..." v-model="buildingAddressInfo.road" class="writeInput"/>
        </FormItem>
        <FormItem label="街">
          <Input placeholder="..." v-model="buildingAddressInfo.street" class="writeInput"/>
        </FormItem>
        <FormItem label="号">
          <Input placeholder="..." v-model="buildingAddressInfo.no" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {CommonFunction} from "../../js/global";

  export default {
    name: "BuildingAdress",
    props: ['isUpdate'],
    data() {
      return {
        //临时存储数据(新增时：给父组件)
        buildingAddressData: [],
        //新增临时存储数据(删减时的存储数据)
        tempData: [],
        //修改时临时存储数据(删减时的存储数据)
        UpdateAddData: [],
        //修改时临时存储数据的下标
        //UpdateAddIndex: 0,
        //修改时临时存储数据(删减时的存储数据)
        UpdateDeleteData: [],
        // 表数据
        tableData: [],
        // 表高度，控制滚动条显示
        tableHeight: 150,
        // 表列
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
            key: '_checked'
          },
          {
            title: '序号',
            type: 'index'
          },
          {
            title: '区',
            key: 'area'
          },
          {
            title: '路',
            key: 'road'
          },
          {
            title: '街',
            key: 'street'
          },
          {
            title: '号',
            key: 'no'
          }
        ],
        // 表数据结构体
        buildingAddressInfo: {
          id: null,
          archId: '',
          area: '',
          road: '',
          street: '',
          no: ''
        },
        //重要的archId
        archId: this.$route.params.archId,
        // 添加弹窗显示控制
        AddModal: false,
        UpdateModal: false
      }
    },
    methods: {
      //加载档案信息（修改时触发）
      loadPBA() {
        if (this.isUpdate === true) {
          this.axios.get('/api/loadArch/getProfInfo', {
            params: {
              archId: this.archId,
              ArchInfo: 'BA'
            }
          }).then(res => {
              this.tableData = res.data.data;
            })
        }
      },
      // 点击“+”号时触发添加弹窗
      saveBAddress() {
        this.buildingAddressInfo.id = '';
        this.buildingAddressInfo.archId = '';
        this.buildingAddressInfo.area = '';
        this.buildingAddressInfo.road = '';
        this.buildingAddressInfo.street = '';
        this.buildingAddressInfo.no = '';
        this.AddModal = true
      },
      // 点击“√”号时触发修改弹窗
      updateBAddress() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的项目地点')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的项目地点')
        } else {
          this.UpdateModal = true;
          this.buildingAddressInfo.id = this.tempData[0].id;
          this.buildingAddressInfo.archId = this.archId;
          this.buildingAddressInfo.area = this.tempData[0].area;
          this.buildingAddressInfo.road = this.tempData[0].road;
          this.buildingAddressInfo.street = this.tempData[0].street;
          this.buildingAddressInfo.no = this.tempData[0].no
        }
      },
      // 取消更新
      cancleUpdate (){
        this.tempData = []
      },
      // 点击修改弹窗的确认按钮，真正修改数据
      updateBAddressData() {
        let temp = {
          id: null,
          archId: '',
          area: '',
          road: '',
          street: '',
          no: ''
        };
        temp.id = this.buildingAddressInfo.id;
        temp.archId = this.archId;
        temp.area = this.buildingAddressInfo.area;
        temp.street = this.buildingAddressInfo.street;
        temp.road = this.buildingAddressInfo.road;
        temp.no = this.buildingAddressInfo.no;
        let check = true;
        //在修改数据时，添加了新数据，又没真正修改整一份档案时（即没修改保存），修改新增的数据（对没在数据库的数据进行修改）
        //判断是否在修改的新增数据上
        for (let i = 0; i < this.UpdateAddData.length; i++) {
          if (this.UpdateAddData[i].area === this.tempData[0].area && this.UpdateAddData[i].road === this.tempData[0].road
            && this.UpdateAddData[i].street === this.tempData[0].street && this.UpdateAddData[i].no === this.tempData[0].no) {
            //删除旧数据
            this.UpdateAddData.splice(i, 1);
            //添加新修改的数据
            this.UpdateAddData.unshift(temp);
            //表格显示更新数据
            this.tableData.splice(i, 1);
            this.tableData.unshift(temp);
            check = false
          }
        }
        if(check === true) {
          let data = [];
          data.push(temp);
          //修改真正存储在数据库的数据上
          this.axios.post('/api/profInfo/updateBuildAddress', data,{
            //判断字段是否为null，是则转为空字符串
            transformRequest: [function (data){
              return CommonFunction.dataIsNull(data)
            }]
          }).then(res => {
            this.axios.get('/api/loadArch/getProfInfo', {
              params: {
                archId: data[0].archId,
                ArchInfo: 'BA'
              }
            }).then(res => {
              this.tableData = res.data.data;
              for (let i = (this.UpdateAddData.length-1); i >= 0; i--) {
                    this.tableData.unshift(this.UpdateAddData[i])
                  }
            })
          });
        };
        this.buildingAddressInfo.id = '';
        this.buildingAddressInfo.archId = '';
        this.buildingAddressInfo.area = '';
        this.buildingAddressInfo.road = '';
        this.buildingAddressInfo.street = '';
        this.buildingAddressInfo.no = '';
        this.tempData = []
      },
      //更新档案信息
      updatePBA() {
        //(实际为：新增的数据)
        this.axios.post('/api/profInfo/addBuildAddress', this.UpdateAddData,{
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data){
            return CommonFunction.dataIsNull(data)
          }]
        }).then(res => {
          this.UpdateAddData = []
          //todo,有错报错，没错提示并跳转
        });
        //(实际为：删除已存在的数据)
        this.axios.post('/api/profInfo/deleteBuildAddress', this.UpdateDeleteData,{
          //判断字段是否为null，是则转为空字符串
          transformRequest: [function (data){
            return CommonFunction.dataIsNull(data)
          }]
        }).then(res => {
          this.UpdateDeleteData = []
          //todo,有错报错，没错提示并跳转
        })
      },
      // 双击显示修改弹窗
      updateRowData(row, index) {
        if (this.isUpdate === true) {
          let temp = {
            id: null,
            archId: '',
            area: '',
            road: '',
            street: '',
            no: ''
          };
          this.UpdateModal = true;
          temp.id = row.id;
          temp.archId = this.archId;
          temp.area = row.area;
          temp.street = row.street;
          temp.road = row.road;
          temp.no = row.no;
          this.buildingAddressInfo.id = row.id;
          this.buildingAddressInfo.archId = this.archId;
          this.buildingAddressInfo.area = row.area;
          this.buildingAddressInfo.road = row.road;
          this.buildingAddressInfo.street = row.street;
          this.buildingAddressInfo.no = row.no;
          this.tempData.push(temp)
        }
      },
      // 点击添加弹窗的确认按钮
      addBAddressData() {
        let temp = {
          id: null,
          archId: '',
          area: '',
          road: '',
          street: '',
          no: ''
        };
        temp.id = this.buildingAddressInfo.id;
        temp.archId = this.archId;
        temp.area = this.buildingAddressInfo.area;
        temp.street = this.buildingAddressInfo.street;
        temp.road = this.buildingAddressInfo.road;
        temp.no = this.buildingAddressInfo.no;
        if (this.isUpdate === true) {
          //把最后新加的放在第一位
          this.UpdateAddData.unshift(temp);
          this.tableData.unshift(temp)
        } else {
          this.buildingAddressData.unshift(temp);
          this.tableData = this.buildingAddressData;
          this.$emit('saveBuildingAddressData', this.tableData)
        }
        this.buildingAddressInfo.id = '';
        this.buildingAddressInfo.archId = '';
        this.buildingAddressInfo.area = '';
        this.buildingAddressInfo.street = '';
        this.buildingAddressInfo.road = '';
        this.buildingAddressInfo.no = '';
      },
      // 点击“-”号时触发
      cancleBAddress() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的项目地点')
        } else {
          let index = [];
          //删除修改时，新增的临时数据
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].area === this.UpdateAddData[j].area && this.tempData[i].road === this.UpdateAddData[j].road
                && this.tempData[i].street === this.UpdateAddData[j].street && this.tempData[i].num === this.UpdateAddData[j].num) {
                index.push(i);
                this.UpdateAddData.splice(j, 1);
                this.tableData.splice(i, 1);
              }
            }
          }
          for (let i = 0; i < index.length; i++) {
            this.tempData.splice(index[i], 1) // index拿值
          }
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tempData.length; j++) {
              if (this.tableData[i].area === this.tempData[j].area && this.tableData[i].road === this.tempData[j].road
                && this.tableData[i].street === this.tempData[j].street && this.tableData[i].num === this.tempData[j].num) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.isUpdate !== true) {
            this.$emit('saveBuildingAddressData', this.tableData);
          }
          this.tempData = []
        }
      },
      // 选择单条记录
      selectData(selection, row) {
        this.tempData.push(row)
      },
      // 选择所有记录
      selectAllData(selection) {
        for (let i = 0; i < selection.length; i++) {
          this.tempData.push(selection[i])
        }
      },
      //取消某个记录
      cancelData(selection, row) {
        for (let i = 0; i < this.tempData.length; i++) {
          if (this.tempData[i].area === row.area && this.tempData[i].road === row.road
            && this.tempData[i].street === row.street && this.tempData[i].num === row.num) {
            this.tempData.splice(i, 1)
          }
        }
      },
      //取消所有记录
      cancelAllData(selection) {
        this.tempData = []
      }
    },
    mounted() {
      this.loadPBA()
    }
  }
</script>

<style scoped>

</style>
