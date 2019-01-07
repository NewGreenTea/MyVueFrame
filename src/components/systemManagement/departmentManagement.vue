<template>
  <div>
    <Row>
      <Col span="6" offset="1">
        <Input search enter-button placeholder="请输入部门名称搜索" v-model="searchValue" @on-search="search"/>
      </Col>
      <Col span="4" style="margin-left: 20px;">
        <Button type="primary" @click="showAddModel">添加部门</Button>
      </Col>
    </Row>
    <br/>
    <Row>
      <Col span="22" offset="1">
        <Table class="table" border :columns="columns" :data="tableData" :loading="loading"
               @on-row-dblclick="showEditModel"></Table>
      </Col>
    </Row>
    <br/>
    <Row>
      <Col span="22" offset="1">
        <Page :current="pageNum" :total="total" :page-size="pageSize" :page-size-opts="pageSizeOpts" show-elevator
              show-total show-sizer
              @on-change="destPage" @on-page-size-change="changePage" placement="top"/>
      </Col>
    </Row>
    <Modal v-model="addModal" :title="addModalTitle" ok-text="添加" @on-ok="addDepartment" cancel-text="关闭">
      <Form v-model="addInfo" label-position="left" :label-width="addLabelWidth">
        <FormItem label="部门名称">
          <Input type="text" v-model="addInfo.departName"></Input>
        </FormItem>
        <FormItem label="部门描述">
          <Input type="text" v-model="addInfo.departDescription"></Input>
        </FormItem>
        <FormItem label="上级部门">
          <Select v-model="addInfo.parentId">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="位置">
          <Input type="text" v-model="addInfo.position"></Input>
        </FormItem>
        <FormItem label="是否为组">
          <RadioGroup v-model="addInfo.isGroup">
            <Radio label="1">否</Radio>
            <Radio label="0">是</Radio>
          </RadioGroup>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModal" :title="editModalTitle" ok-text="修改" @on-ok="updateDepartment" cancel-text="关闭">
      <Form v-model="editInfo" label-position="left" :label-width="editLabelWidth">
        <FormItem label="部门名称">
          <Input type="text" v-model="editInfo.departName"></Input>
        </FormItem>
        <FormItem label="部门描述">
          <Input type="text" v-model="editInfo.departDescription"></Input>
        </FormItem>
        <FormItem label="上级部门">
          <Select v-model="editInfo.parentId">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="位置">
          <Input type="text" v-model="editInfo.position"></Input>
        </FormItem>
        <FormItem label="是否为组">
          <RadioGroup v-model="editInfo.isGroup">
            <Radio label="1">否</Radio>
            <Radio label="0">是</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="创建人">
          <Input type="text" readonly :value="editInfo.creator"/>
        </FormItem>
        <FormItem label="创建时间">
          <Input type="text" readonly :value="editInfo.createTime"/>
        </FormItem>
        <FormItem label="最后修改人">
          <Input type="text" readonly :value="editInfo.modifier"/>
        </FormItem>
        <FormItem label="最后修改时间">
          <Input type="text" readonly :value="editInfo.modifyTime"/>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script>
  import qs from 'qs';

  export default {
    name: "departmentManagement",
    data() {
      return {
        loading: true,
        pageNum: 1,
        total: 0,
        pageSize: 10,
        pageSizeOpts: [10, 20, 30, 40, 50, 100],
        placement: 'top',
        columns: [
          {
            title: '序号',
            width: 100,
            align: 'center',
            type: 'index'
          },
          {
            title: '部门名称',
            width: 240,
            align: 'center',
            key: 'departName'
          },
          {
            title: '部门描述',
            key: 'departDescription'
          },
          {
            title: '上级部门',
            align: 'center',
            width: 240,
            render(h, data) {
              let parentDepartment = data.row.parentDepartment;

              return h('span', parentDepartment === null ? '' : parentDepartment.departName);
            }
          },
          {
            title: '是否为组',
            width: 100,
            align: 'center',
            render(h, data) {
              let isGroup = '否';
              if (data.row.isGroup === 0) {
                isGroup = '是';
              }
              return h('span', isGroup);
            }
          },
          {
            title: '处理',
            width: 100,
            render: (h, params, vm) => {
              return h('Poptip', {
                props: {
                  confirm: true,
                  title: '你确定要删除吗?'
                },
                on: {
                  'on-ok': () => {
                    //删除操作
                    let id = params.row.id;
                    this.axios.post('/api/department/delete', qs.stringify({
                      id: id
                    }), {timeout: 10000}).then(
                      res => {
                        if (res.data.code === 0) {
                          this.$Message.success("删除成功!");
                          this.loadTableData(this.pageNum, this.pageSize);
                        } else {
                          this.$Message.error("删除失败!");
                          console.log(res.data);
                        }
                      }).catch((error) => {
                      console.log(error);
                    });
                  }
                }
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    ghost: true
                  }
                }, [
                  h('Icon', {
                    props: {
                      type: 'md-trash',
                      size: 18,
                      color: '#000000'
                    }
                  })
                ])
              ]);
            }
          }
        ],
        tableData: [],
        searchValue: '',
        departName: '',
        department: {
          id: '无',
          departName: '无'
        },
        departments: [],
        addModal: false,
        addModalTitle: '添加部门',
        addLabelWidth: 90,
        addInfo: {
          departName: '',
          departDescription: '',
          parentId: '',
          position: '',
          isGroup: ''
        },
        editModal: false,
        editModalTitle: '修改部门信息',
        editLabelWidth: 90,
        editInfo: {
          id: '',
          departName: '',
          departDescription: '',
          parentId: '',
          position: '',
          isGroup: '',
          creator: '',
          createTime: '',
          modifier: '',
          modifyTime: ''
        },
      }
    },
    methods: {
      loadTableData(pageNum, pageSize) {
        this.loading = true;
        this.axios.post('/api/department/list/' + this.departName, qs.stringify({
          'pageNum': pageNum,
          'pageSize': pageSize
        }), {timeout: 10000}).then(
          res => {
            if (res.data.code === 0) {
              this.tableData = res.data.data.list;
              this.pageNum = res.data.data.pageNum === 0 ? 1 : res.data.data.pageNum;
              this.pageSize = res.data.data.pageSize;
              this.total = res.data.data.total;
            } else {
              this.$Message.error(res.data.msg);
              console.log(res.data);
            }
          }).finally(() => {
          this.loading = false;
        });
      },
      // 跳转目标页
      destPage(pageNum) {
        this.loadTableData(pageNum, this.pageSize);
      },
      // 改变显示条数
      changePage(pageSize) {
        this.pageSize = pageSize;
        if (this.pageSize <= this.total) {
          this.loadTableData(this.pageNum, this.pageSize);
        }
      },
      search() {
        this.departName = this.searchValue;
        this.pageNum = 1;
        this.loadTableData(this.pageNum, this.pageSize);
      },
      showAddModel() {
        this.axios.post('/api/department/list/s', {timeout: 10000}).then(res => {
          this.departments = [];
          this.departments.push(this.department);
          this.departments = this.departments.concat(res.data.data);
          this.addModal = true;
        }).catch((error) => {
          console.log(error);
        });
      },
      addDepartment() {
        this.axios.post('/api/department/add', qs.stringify(this.addInfo), {timeout: 10000}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功!');
            this.loadTableData(this.pageNum, this.pageSize);
          } else {
            this.$Message.error('添加失败!');
            console.log(res.data);
          }
        }).catch((error) => {
          console.log(error);
        }).finally(() => {
          this.addInfo = {
            departName: '',
            departDescription: '',
            parentId: '',
            position: '',
            isGroup: ''
          };
        });
      },
      showEditModel(h) {
        this.axios.post('/api/department/list/parent/s', qs.stringify({
          id: h.id
        }), {timeout: 10000}).then(res => {
          this.departments = [];
          this.departments.push(this.department);
          this.departments = this.departments.concat(res.data.data);
          this.editInfo.id = h.id;
          this.editInfo.departName = h.departName;
          this.editInfo.departDescription = h.departDescription;
          this.editInfo.parentId = h.parentDepartment === null ? '' : h.parentDepartment.id;
          this.editInfo.position = h.position;
          this.editInfo.isGroup = h.isGroup;
          this.editInfo.creator = h.creator;
          this.editInfo.createTime = h.createTime;
          this.editInfo.modifier = h.modifier;
          this.editInfo.modifyTime = h.modifyTime;
          this.editModal = true;
        }).catch((error) => {
          console.log(error);
        });
      },
      updateDepartment() {
        this.axios.post('/api/department/update', qs.stringify(this.editInfo), {timeout: 10000}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功!');
            this.loadTableData(this.pageNum, this.pageSize);
          } else {
            this.$Message.error('修改失败!');
            console.log(res.data);
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    mounted() {
      this.loadTableData(this.pageNum, this.pageSize);
    }
  }
</script>

<style scoped>

</style>
