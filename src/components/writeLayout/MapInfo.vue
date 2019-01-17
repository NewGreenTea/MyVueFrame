<template>
  <Row class="WriteLayoutFont">
    <Col>
      <Row>
        <Col span="12">
          地图型号表
        </Col>
        <Col span="12">
          <Button @click="cancelMInfo" class="profButtonFloat">-</Button>
          <Button @click="updateMInfo" v-if="isUpdate" class="profButtonFloat">√</Button>
          <Button @click="saveMInfo" class="profButtonFloat">+</Button>
        </Col>
      </Row>
    </Col>
    <Col class="TableFontCss">
      <Table border :columns="columns" :data="tableData" :height="tableHeight"
             @on-row-dblclick="updateRowData"
             @on-select-all="selectAllData" @on-select="selectData"
             @on-select-cancel="cancelData" @on-select-all-cancel="cancelAllData"></Table>
    </Col>
    <Modal v-model="AddModal" draggable :closable="false" title="添加地图型号" @on-ok="addMInfoData">
      <Form v-model="mapInfo">
        <FormItem label="地图型号">
          <Input placeholder="..." v-model="mapInfo.mapNo" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="UpdateModal" draggable :closable="false" title="修改地图型号" @on-ok="updateMInfoData"
           @on-cancel="cancleUpdate">
      <Form v-model="mapInfo">
        <FormItem label="地图型号">
          <Input placeholder="..." v-model="mapInfo.mapNo" class="writeInput"/>
        </FormItem>
      </Form>
    </Modal>
  </Row>
</template>

<script>
  import {CommonFunction} from '../../js/global'
  //档案数据对象的传输配置
  const config = {
    headers: {'Content-Type': 'application/json'}
  };

  export default {
    name: "MapInfo",
    props: ['isUpdate'],
    data() {
      return {
        //临时存储数据(给父组件)
        mapInfoData: [],
        // 表数据
        tableData: [],
        //临时存储数据(删减临时存储数据)
        tempData: [],
        //修改时临时存储数据(删减时的存储数据)
        UpdateAddData: [],
        //修改时临时存储数据(删减时的存储数据)
        UpdateDeleteData: [],
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
            width: 70,
            type: 'index'
          },
          {
            title: '地图型号',
            key: 'mapNo'
          }
        ],
        // 表结构体
        mapInfo: {
          id: null,
          archId: '',
          mapNo: ''
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
      loadPMI() {
        if (this.isUpdate === true) {
          this.axios.get('/api/loadArch/getProfInfo', {params: {archId: this.archId, ArchInfo: 'MI'}}).then(
            res => {
              this.tableData = res.data.data
            })
        }
      },
      saveMInfo() {
        this.mapInfo.id = '';
        this.mapInfo.archId = '';
        this.mapInfo.mapNo = '';
        this.AddModal = true
      },
      updateMInfo() {
        if (Object.keys(this.tempData).length === 0) { //判断有没勾选
          alert('请钩选要修改的地图型号')
        } else if (Object.keys(this.tempData).length > 1) {
          alert('请钩选一条要修改的地图型号')
        } else {
          this.UpdateModal = true;
          this.mapInfo.id = this.tempData[0].id;
          this.mapInfo.archId = this.archId;
          this.mapInfo.mapNo = this.tempData[0].mapNo
        }
      },
      cancleUpdate() {
        this.mapInfo.mapNo = '';
        this.tempData = []
      },
      updateMInfoData() {
        let temp = {
          id: null,
          archId: '',
          mapNo: ''
        };
        temp.id = this.mapInfo.id;
        temp.archId = this.archId;
        temp.mapNo = this.mapInfo.mapNo;
        if (!CommonFunction.isEmpty(temp.mapNo)) {
          let check = true;
          for (let i = 0; i < this.UpdateAddData.length; i++) {
            if (this.UpdateAddData[i].mapNo === this.tempData[0].mapNo) {
              this.UpdateAddData.splice(i, 1);
              this.UpdateAddData.unshift(temp);
              this.tableData.splice(i, 1);
              this.tableData.unshift(temp);
              check = false
            }
          }
          if (check === true) {
            let data = [];
            data.push(temp);
            this.axios.post('/api/profInfo/updateMapInfo', data, {
              //判断字段是否为null，是则转为空字符串
              transformRequest: [function (data) {
                return CommonFunction.dataIsNull(data)
              }]
            }).then(res => {
              this.axios.get('/api/loadArch/getProfInfo', {
                params: {
                  archId: data[0].archId,
                  ArchInfo: 'MI'
                }
              }).then(res => {
                this.tableData = res.data.data;
                //更新后，删掉‘准备删除’的数据
                let index = [];
                for (let i = 0; i < this.UpdateDeleteData.length; i++) {
                  for (let j = 0; j < this.tableData.length; j++) {
                    if (this.UpdateDeleteData[i].mapNo === this.tableData[j].mapNo) {
                      index.push(j)
                    }
                  }
                }
                for (let i = 0; i < index.length; i++) {
                  this.tableData.splice(index[i], 1)
                }
                for (let i = (this.UpdateAddData.length - 1); i >= 0; i--) {
                  this.tableData.unshift(this.UpdateAddData[i])
                }
              })
            });
          }
          this.mapInfo.id = null;
          this.mapInfo.archId = '';
          this.mapInfo.mapNo = '';
          this.tempData = [];
        } else {
          this.$Message.error('地图型号不能修改为空!');
        }
      },
      //更新档案信息
      updatePMI() {
        //(实际为：新增的数据)
        this.axios.post('/api/profInfo/addMapInfo', JSON.stringify(this.UpdateAddData), config)
          .then(res => {
            this.UpdateAddData = []
            //todo,有错报错，没错提示并跳转
          });
        //(实际为：删除已存在的数据)
        this.axios.post('/api/profInfo/deleteMapInfo', JSON.stringify(this.UpdateDeleteData), config).then(res => {
          this.UpdateDeleteData = []
          //todo,有错报错，没错提示并跳转
        })
      },
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
          temp.mapNo = row.mapNo;
          this.mapInfo.id = row.id;
          this.mapInfo.archId = this.archId;
          this.mapInfo.mapNo = row.mapNo;
          this.tempData.push(temp)
        }
      },
      addMInfoData() {
        let temp = {
          id: null,
          archId: '',
          mapNo: ''
        };
        temp.archId = this.archId;
        temp.mapNo = this.mapInfo.mapNo;
        if (!CommonFunction.isEmpty(this.mapInfo.mapNo)) {
          if (this.isUpdate === true) {
            //把最后新加的放在第一位
            this.UpdateAddData.unshift(temp);
            this.tableData.unshift(temp)
          }
          else {
            this.mapInfoData.unshift(temp);
            this.tableData = this.mapInfoData;
            this.$emit('saveMapInfoData', this.tableData)
          }
          this.mapInfo.id = '';
          this.mapInfo.archId = '';
          this.mapInfo.mapNo = '';
        } else {
          this.$Message.error('地图型号不能为空');
        }
      },
      cancelMInfo() {
        if (Object.keys(this.tempData).length === 0) {
          alert('请钩选要删除的地图型号')
        } else {
          let index = [];
          for (let i = 0; i < this.tempData.length; i++) {
            for (let j = 0; j < this.UpdateAddData.length; j++) {
              if (this.tempData[i].mapNo === this.UpdateAddData[j].mapNo) {
                index.push(i);
                this.UpdateAddData.splice(j, 1);
                index.push(i);
                for (let l = 0; l < this.tableData.length; l++) {
                  if (this.tableData[l].mapNo === this.tempData[i].mapNo) {
                    //显示表格中删去
                    this.tableData.splice(l, 1)
                  }
                }
              }
            }
          }
          for (let i = 0; i < index.length; i++) {
            this.tempData.splice(index[i], 1) // index拿值
          }
          for (let i = 0; i < this.tableData.length; i++) {
            for (let j = 0; j < this.tempData.length; j++) {
              if (this.tableData[i].mapNo === this.tempData[j].mapNo) {
                this.UpdateDeleteData.push(this.tableData[i]);
                this.tableData.splice(i, 1);
              }
            }
          }
          if (this.isUpdate !== true) {
            this.$emit('saveMapInfoData', this.tableData);
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
          if (this.tempData[i].mapNo === row.mapNo) {
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
      this.loadPMI()
    }
  }
</script>

<style scoped>
  /*表格字体大小*/
  .TableFontCss >>> .ivu-table{
    font-size: 14px;
  }
</style>
