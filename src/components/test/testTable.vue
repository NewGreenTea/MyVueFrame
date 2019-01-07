<template>
<div>
  <Table  border :columns="columns2" :data="data3"></Table>
  <Input search enter-button placeholder="请输入姓名搜索" v-model="searchValue" @on-search="test"/>
</div>
</template>

<script>
    export default {
        name: "testTable",
      data () {
        return {
          columns2: [
            {
              title: 'Name',
              key: 'name'
            },
            {
              title: 'Age',
              key: 'age',
              render: (h, params) => {

                if (params.row.$isEdit) {

                  return h('input', {

                    domProps: {
                      value: params.row.age
                    },
                    on: {
                      input: function (event) {
                        params.row.age = event.target.value
                      }
                    }
                  });
                } else  {
                  return h('div', params.row.age);
                }
              }
            },
            {
              title: 'Address',
              key: 'address'
            },
            {
              title: 'Action',
              key: 'action',
              render: (h, params) => {
                return h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      if (params.row.$isEdit) {
                        this.handleSave(params.row)
                      } else {
                        this.handleEdit(params.row)
                      }
                    }
                  }
                }, params.row.$isEdit ? '保存' : '编辑')
              }
            }
          ],
          searchValue: '',
          data3: [
            {
              name: '哈哈',
              age: 18,
              address: '上海',
              $isEdit: false
            },
            {
              name: '啦啦',
              age: 24,
              address: '北京',
              $isEdit: false
            }
          ]
        }
      },
      methods: {
        handleEdit(row) {
          this.$set(row, '$isEdit', true)
        },
        handleSave(row) {
          this.$set(row, '$isEdit', false)
        },
        test(){
          alert('sssss')
        }
      }
    }
</script>

<style scoped>

</style>
