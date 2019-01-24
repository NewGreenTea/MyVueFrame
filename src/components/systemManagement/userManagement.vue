<template>
  <div>
    <Row>
      <Col span="6" offset="1">
        <Input search enter-button placeholder="请输入姓名搜索" v-model="searchValue" @on-search="search"/>
      </Col>
      <Col span="4" style="margin-left: 20px;">
        <Button type="primary" @click="showAddModel">添加用户</Button>
      </Col>
    </Row>
    <br/>
    <Row>
      <Col span="22" offset="1" class="TableFontCss">
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
    <Modal v-model="addModal" :title="addModalTitle" ok-text="添加" @on-ok="addUser" cancel-text="关闭">
      <Form v-model="addInfo" label-position="left" :label-width="addLabelWidth" :placement="placement" class="formClass">
        <FormItem label="用户名">
          <Input type="text" v-model="addInfo.username"></Input>
        </FormItem>
        <FormItem label="密码">
          <Input type="password" v-model="addInfo.password"></Input>
        </FormItem>
        <FormItem label="姓名">
          <Input type="text" v-model="addInfo.nickname"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="addInfo.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="年龄">
          <Input type="text" v-model="addInfo.age"></Input>
        </FormItem>
        <FormItem label="所属部门">
          <Select v-model="addInfo.departId" @on-change="changeDepartment">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所在职位">
          <Select v-model="addInfo.postId">
            <Option v-for="item in posts" :key="item.id" :value="item.id">{{item.postName}}</Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
    <Modal v-model="editModal" :title="editModalTitle" ok-text="修改" @on-ok="updateUser" cancel-text="关闭">
      <Form v-model="editInfo" label-position="left" :label-width="editLabelWidth" class="formClass">
        <FormItem label="用户名">
          <Input type="text" readonly v-model="editInfo.username"></Input>
        </FormItem>
        <FormItem label="姓名">
          <Input type="text" v-model="editInfo.nickname"></Input>
        </FormItem>
        <FormItem label="性别">
          <RadioGroup v-model="editInfo.sex">
            <Radio label="男">男</Radio>
            <Radio label="女">女</Radio>
          </RadioGroup>
        </FormItem>
        <FormItem label="年龄">
          <Input type="text" v-model="editInfo.age"></Input>
        </FormItem>
        <FormItem label="所属部门">
          <Select v-model="editInfo.departId" @on-change="changeDepartment">
            <Option v-for="item in departments" :key="item.id" :value="item.id">{{item.departName}}</Option>
          </Select>
        </FormItem>
        <FormItem label="所在职位">
          <Select v-model="editInfo.postId">
            <Option v-for="item in posts" :key="item.id" :value="item.id">{{item.postName}}</Option>
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
    name: "userManagement",
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
            type: 'index'
          },
          {
            title: '用户名',
            key: 'username'
          },
          {
            title: '姓名',
            key: 'nickname'
          },
          {
            title: '所属部门',
            render: (h, data) => {
              let department = data.row.department;
              return h('span', department === null ? '' : department.departName);
            }
          },
          {
            title: '所属职位',
            render: (h, data) => {
              let post = data.row.post;
              return h('span', post === null ? '' : post.postName);
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
                    this.axios.post('/api/user/delete', qs.stringify({
                      id: id
                    }), {timeout: 10000}).then(
                      res => {
                        if (res.data.code === 0) {
                          this.$Message.success("删除成功!");
                          this.pageNum = 1;
                          this.loadUser(this.pageNum, this.pageSize);
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
        nickname: '',
        addModal: false,
        addModalTitle: '添加用户',
        addLabelWidth: 90,
        addInfo: {
          username: '',
          password: '',
          nickname: '',
          sex: '',
          age: '',
          departId: '',
          postId: ''
        },
        editModal: false,
        editModalTitle: '修改用户信息',
        editLabelWidth: 90,
        editInfo: {
          id: '',
          username: '',
          nickname: '',
          sex: '',
          age: '',
          departId: '',
          postId: '',
          creator: '',
          createTime: '',
          modifier: '',
          modifyTime: ''
        },
        editId: '',
        department: {
          id: '无',
          departName: '无'
        },
        departments: [],
        post: {
          id: '无',
          postName: '无'
        },
        posts: []
      }
    },
    methods: {
      loadUser(pageNum, pageSize) {
        this.loading = true;
        this.axios.post('/api/user/list/' + this.nickname, qs.stringify({
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
        this.loadUser(pageNum, this.pageSize);
      },
      // 改变显示条数
      changePage(pageSize) {
        this.pageSize = pageSize;
        if (this.pageSize <= this.total) {
          this.loadUser(this.pageNum, this.pageSize);
        }
      },
      search() {
        this.nickname = this.searchValue;
        this.pageNum = 1;
        this.loadUser(this.pageNum, this.pageSize);
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
      addUser() {
        this.axios.post('/api/user/add', qs.stringify(this.addInfo), {timeout: 10000}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('添加成功!');
            this.loadUser(this.pageNum, this.pageSize);
          } else {
            this.$Message.error('添加失败!');
            console.log(res.data);
          }
        }).catch((error) => {
          console.log(error);
        }).finally(() => {
          this.addInfo = {
            username: '',
            password: '',
            nickname: '',
            sex: '',
            age: '',
            departId: '',
            postId: ''
          };
        });
      },
      updateUser() {
        this.axios.post('/api/user/update/info/admin', qs.stringify(this.editInfo), {timeout: 10000}).then(res => {
          if (res.data.code === 0) {
            this.$Message.success('修改成功!');
            this.loadUser(this.pageNum, this.pageSize);
          } else {
            this.$Message.error('修改失败!');
            console.log(res.data);
          }
        }).catch((error) => {
          console.log(error);
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
        let departId;
        if (h.department === null) {
          departId = '';
        } else {
          departId = h.department.id;
        }
        this.axios.post('/api/post/listByDepartId/s', qs.stringify({
          departId: departId
        }), {timeout: 10000}).then(res => {
          this.posts = [];
          this.posts.push(this.post);
          this.posts = this.posts.concat(res.data.data);
        }).catch((error) => {
          console.log(error);
        });
        this.editInfo.id = h.id;
        this.editInfo.username = h.username;
        this.editInfo.nickname = h.nickname;
        this.editInfo.sex = h.sex;
        this.editInfo.age = h.age;
        this.editInfo.departId = (h.department === null ? '' : h.department.id);
        this.editInfo.postId = (h.post === null ? '' : h.post.id);
        this.editInfo.creator = h.creator;
        this.editInfo.createTime = h.createTime;
        this.editInfo.modifier = h.modifier;
        this.editInfo.modifyTime = h.modifyTime;
        this.editModal = true;
      },
      changeDepartment(v) {
        this.axios.post('/api/post/listByDepartId/s', qs.stringify({
          departId: v
        }), {timeout: 10000}).then(res => {
          this.posts = res.data.data;
          if (this.addModal === true) {
            this.addInfo.postId = '';
          }
          if (this.editModal === true) {
            this.editInfo.postId = '';
          }
        }).catch((error) => {
          console.log(error);
        });
      }
    },
    mounted() {
      this.loadUser(this.pageNum, this.pageSize);
    }
  }
</script>

<style scoped>

</style>
