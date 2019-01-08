<template>
  <div>
    <Row>
      <Col span="6" offset="1">
        <Input search enter-button placeholder="请输入职位名称搜索" v-model="searchValue" @on-search="search"/>
      </Col>
      <Col span="4" style="margin-left: 20px;">
        <Button type="primary" @click="showAddModel">添加职位</Button>
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
    <Modal v-model="addModal" :title="addModalTitle" ok-text="添加" @on-ok="addPost" cancel-text="关闭">
      <Form v-model="addInfo" label-position="left" :label-width="addLabelWidth">
        <FormItem label="职位名称">
          <Input type="text" v-model="addInfo.postName"></Input>
        </FormItem>
        <FormItem label="职位描述">
          <Input type="text" v-model="addInfo.postDescription"></Input>
        </FormItem>
        <FormItem label="上级职位">
          <Select v-model="addInfo.parentId">
            <Option v-for="item in posts" :key="item.id" :value="item.id">{{item.postName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="位置">
          <Input type="text" v-model="addInfo.position"></Input>
        </FormItem>
        <FormItem label="上级职位">
          <Select v-model="addInfo.departId">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModal" :title="editModalTitle" ok-text="修改" @on-ok="updatePost" cancel-text="关闭">
      <Form v-model="editInfo" label-position="left" :label-width="editLabelWidth">
        <FormItem label="职位名称">
          <Input type="text" v-model="editInfo.postName"></Input>
        </FormItem>
        <FormItem label="职位描述">
          <Input type="text" v-model="editInfo.postDescription"></Input>
        </FormItem>
        <FormItem label="上级职位">
          <Select v-model="editInfo.parentId">
            <Option v-for="item in posts" :key="item.id" :value="item.id">{{item.postName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="位置">
          <Input type="text" v-model="editInfo.position"></Input>
        </FormItem>
        <FormItem label="上级职位">
          <Select v-model="editInfo.departId">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
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
    name: "postManagement",
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
            title: '职位名称',
            width: 240,
            align: 'center',
            key: 'postName'
          },
          {
            title: '职位描述',
            key: 'postDescription'
          },
          {
            title: '上级职位',
            align: 'center',
            width: 240,
            render(h, data) {
              let parentPost = data.row.parentPost;

              return h('span', parentPost === null ? '' : parentPost.postName);
            }
          },
          {
            title: '所属部门',
            render(h, data) {
              let department = data.row.department;

              return h('span', department === null ? '' : department.departName);
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
                    this.axios.post('/api/post/delete', qs.stringify({
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
        postName: '',
        post: {
          id: '无',
          departName: '无'
        },
        posts: [],
        department: {
          id: '无',
          departName: '无'
        },
        departments: [],
        addModal: false,
        addModalTitle: '添加职位',
        addLabelWidth: 90,
        addInfo: {
          postName: '',
          postDescription: '',
          parentId: '',
          position: '',
          departId: ''
        },
        editModal: false,
        editModalTitle: '修改职位信息',
        editLabelWidth: 90,
        editInfo: {
          id: '',
          postName: '',
          postDescription: '',
          parentId: '',
          position: '',
          departId: '',
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
        this.axios.post('/api/post/list/' + this.postName, qs.stringify({
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
        this.postName = this.searchValue;
        this.pageNum = 1;
        this.loadTableData(this.pageNum, this.pageSize);
      },
      showAddModel() {
        this.axios.post('/api/department/list/s', {timeout: 10000}).then(res => {
          this.departments = [];
          this.departments.push(this.department);
          this.departments = this.departments.concat(res.data.data);
        }).catch((error) => {
          console.log(error);
        });
        this.axios.post('/api/post/list/s', {timeout: 10000}).then(res => {
          this.posts = [];
          this.posts.push(this.post);
          this.posts = this.posts.concat(res.data.data);
          this.addModal = true;
        }).catch((error) => {
          console.log(error);
        });
      },
      addPost() {
        this.axios.post('/api/post/add', qs.stringify(this.addInfo), {timeout: 10000}).then(res => {
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
            postName: '',
            postDescription: '',
            parentId: '',
            position: '',
          };
        });
      },
      showEditModel(h) {
        this.axios.post('/api/department/list/s', {timeout: 10000}).then(res => {
          this.departments = [];
          this.departments.push(this.department);
          this.departments = this.departments.concat(res.data.data);
        }).catch((error) => {
          console.log(error);
        });
        this.axios.post('/api/post/list/parent/s', qs.stringify({
          id: h.id
        }), {timeout: 10000}).then(res => {
          this.posts = [];
          this.posts.push(this.post);
          this.posts = this.posts.concat(res.data.data);
          this.editInfo.id = h.id;
          this.editInfo.postName = h.postName;
          this.editInfo.postDescription = h.postDescription;
          this.editInfo.parentId = h.parentPost === null ? '' : h.parentPost.id;
          this.editInfo.position = h.position;
          this.editInfo.departId = h.department === null ? '' : h.department.id;
          this.editInfo.creator = h.creator;
          this.editInfo.createTime = h.createTime;
          this.editInfo.modifier = h.modifier;
          this.editInfo.modifyTime = h.modifyTime;
          this.editModal = true;
        }).catch((error) => {
          console.log(error);
        });
      },
      updatePost() {
        this.axios.post('/api/post/update', qs.stringify(this.editInfo), {timeout: 10000}).then(res => {
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
