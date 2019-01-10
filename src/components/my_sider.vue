<template>
  <div style="width: 240px;">
    <Menu active-name="1-1">
      <Submenu name="1">
        <template slot="title">
          <Icon type="ios-analytics"/>
          档案整理
        </template>
        <MenuItem name="1-1">
          <router-link to="/index/viewcont/archAdmin"><p @click="archAdminLauout">导入清单</p></router-link>
        </MenuItem>
        <MenuItem name="1-2">
          <router-link to="/index/viewcont/director"><p @click="directorLauout">任务分配</p></router-link>
        </MenuItem>
        <MenuItem name="1-3">
          <router-link to="/index/viewcont/writerGroup"><p @click="writerLauout">著录</p></router-link>
        </MenuItem>
        <MenuItem name="1-4">
          <router-link to="/index/viewcont/checkWrite"><p @click="checkWriter">著录质检</p></router-link>
        </MenuItem>
        <MenuItem name="1-5">
          <router-link to="/index/viewcont/archSmCheck"><p @click="smcheckLauout">扫描质检</p></router-link>
        </MenuItem>
        <MenuItem name="1-5">
          <router-link to="/index/viewcont/archPrint"><p @click="printLauout">打印</p></router-link>
        </MenuItem>
        <MenuItem name="1-6">
          <router-link to="/index/viewcont/upload"><p @click="fileuploadLauout">上传</p></router-link>
        </MenuItem>
        <MenuItem name="1-7">
          <router-link to="/index/viewcont/archClassify"><p @click="archClassifyLauout">档案组卷</p></router-link>
        </MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-filing"/>
          借阅管理
        </template>
        <MenuItem name="2-1">待做</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-filing"/>
          检索统计
        </template>
        <MenuItem name="3-1">
          <router-link to="">档案统计</router-link>
        </MenuItem>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
          <Icon type="ios-cog"/>
          系统管理
        </template>
        <MenuItem name="4-1">
          <router-link to="/index/viewcont/userManagement"><p @click="userManagement">用户管理</p></router-link>
        </MenuItem>
        <MenuItem name="4-2">权限管理</MenuItem>
        <MenuItem name="4-3">
          <router-link to="/index/viewcont/departmentManagement"><p @click="departmentManagement">部门管理</p></router-link>
        </MenuItem>
        <MenuItem name="4-4">
          <router-link to="/index/viewcont/postManagement"><p @click="postManagement">职位管理</p></router-link>
        </MenuItem>
        <!--<MenuItem name="4-5">模板管理</MenuItem>-->
      </Submenu>
      <Submenu name="5">
        <template slot="title">
          <Icon type="ios-cog"/>
          测试专用
        </template>
        <MenuItem name="5-1">
          <router-link to="/index/viewcont/flowCreated"><p @click="flowCreatedLauout">业务创建</p></router-link>
        </MenuItem>
        <MenuItem name="5-2">
          <router-link to="/index/viewcont/Assignment"><p @click="AssignmentLauout">任务</p></router-link>
        </MenuItem>
        <MenuItem name="5-3">
          <Cascader :data="data" @on-change="handleChange" trigger="hover">源数据管理</Cascader>
        </MenuItem>
        <MenuItem name="5-4">
          <router-link to="/index/viewcont/archManagement"><p @click="ArchManagerLauout">档案管理</p></router-link>
        </MenuItem>
        <MenuItem name="5-5">
          <router-link to="/index/viewcont"><p @click="ArchTypeLauout">档案类型</p></router-link>
        </MenuItem>
        <MenuItem name="5-6">
          <router-link to="/index/viewcont/echarts"><p @click="testEcharts">测试ECHARTS</p></router-link>
        </MenuItem>
        <MenuItem name="5-6"><a href="/api/getVO">测试VO</a></MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        data: [
          {
            value: 'beijing',
            label: '北京'
          },
          {
            value: 'beijing',
            label: '上海'
          }
        ]
      }
    },
    methods: {
      testEcharts() {
        let path = this.getTabViewPath;
        let temp = {name: 'echarts', path: '/index/viewcont/echarts'};
        if (recopy(path, 'echarts', '/index/viewcont/echarts')) {
          this.$emit('showIndexCont', 'echarts')
        } else {
          this.$emit('showIndexCont', 'echarts'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      fileuploadLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'fileupload', path: '/index/viewcont/fileupload', desName: '文件上传'};
        if (recopy(path, 'fileupload', '/index/viewcont/fileupload')) {
          this.$emit('showIndexCont', 'fileupload')
        } else {
          this.$emit('showIndexCont', 'fileupload');// 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      archClassifyLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'archClassify', path: '/index/viewcont/archClassify', desName: '档案组卷'};
        if (recopy(path, 'archClassify', '/index/viewcont/archClassify')) {
          this.$emit('showIndexCont', 'archClassify')
        } else {
          this.$emit('showIndexCont', 'archClassify'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      printLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'archPrint', path: '/index/viewcont/archPrint', desName: '打印'};
        if (recopy(path, 'archPrint', '/index/viewcont/archPrint')) {
          this.$emit('showIndexCont', 'archPrint')
        } else {
          this.$emit('showIndexCont', 'archPrint'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      flowCreatedLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'flowCreated', path: '/index/viewcont/flowCreated'};
        if (recopy(path, 'flowCreated', '/index/viewcont/flowCreated')) {
          this.$emit('showIndexCont', 'flowCreated')
        } else {
          this.$emit('showIndexCont', 'flowCreated'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      AssignmentLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'Assignment', path: '/index/viewcont/Assignment'};
        if (recopy(path, 'Assignment', '/index/viewcont/Assignment')) {
          this.$emit('showIndexCont', 'Assignment')
        } else {
          this.$emit('showIndexCont', 'Assignment'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      directorLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'director', path: '/index/viewcont/director', desName: '任务分配'};
        if (recopy(path, 'director', '/index/viewcont/director')) {
          this.$emit('showIndexCont', 'director')
        } else {
          this.$emit('showIndexCont', 'director'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      writerLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'writerGroup', path: '/index/viewcont/writerGroup', desName: '著录'};
        if (recopy(path, 'writerGroup', '/index/viewcont/writerGroup')) {
          this.$emit('showIndexCont', 'writerGroup')
        } else {
          this.$emit('showIndexCont', 'writerGroup'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      checkWriter() {
        let path = this.getTabViewPath;
        let temp = {name: 'checkWrite', path: '/index/viewcont/checkWrite', desName: '著录质检'};
        if (recopy(path, 'checkWrite', '/index/viewcont/checkWrite')) {
          this.$emit('showIndexCont', 'checkWrite')
        } else {
          this.$emit('showIndexCont', 'checkWrite'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      smcheckLauout(){
        let path = this.getTabViewPath;
        let temp = {name: 'archSmCheck', path: '/index/viewcont/archSmCheck', desName: '扫描质检'};
        if (recopy(path, 'archSmCheck', '/index/viewcont/archSmCheck')) {
          this.$emit('showIndexCont', 'archSmCheck')
        } else {
          this.$emit('showIndexCont', 'archSmCheck'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      archAdminLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'archAdmin', path: '/index/viewcont/archAdmin', desName: '导入清单'};
        if (recopy(path, 'archAdmin', '/index/viewcont/archAdmin')) {
          this.$emit('showIndexCont', 'archAdmin')
        } else {
          this.$emit('showIndexCont', 'archAdmin'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      ArchManagerLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'archManagement', path: '/index/viewcont/archManagement'};
        if (recopy(path, 'archManagement', '/index/viewcont/archManagement')) {
          this.$emit('showIndexCont', 'archManagement')
        } else {
          this.$emit('showIndexCont', 'archManagement'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      ArchTypeLauout() {
        let path = this.getTabViewPath;
        let temp = {name: 'classtype', path: '/index/viewcont/classtype'};
        if (recopy(path, 'classtype', '/index/viewcont/classtype')) {
          this.$emit('showIndexCont', 'classtype')
        } else {
          this.$emit('showIndexCont', 'classtype'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      handleChange(value, selectedData) { // 二级级联菜单
        console.log('处理点击的事件：' + value + selectedData)
      },
      userManagement() {
        let path = this.getTabViewPath;
        let temp = {name: 'userManagement', path: '/index/viewcont/userManagement', desName: '用户管理'};
        if (recopy(path, 'userManagement', '/index/viewcont/userManagement')) {
          this.$emit('showIndexCont', 'userManagement')
        } else {
          this.$emit('showIndexCont', 'userManagement'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      departmentManagement() {
        let path = this.getTabViewPath;
        let temp = {name: 'departmentManagement', path: '/index/viewcont/departmentManagement', desName: '部门管理'};
        if (recopy(path, 'departmentManagement', '/index/viewcont/departmentManagement')) {
          this.$emit('showIndexCont', 'departmentManagement')
        } else {
          this.$emit('showIndexCont', 'departmentManagement'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      },
      postManagement() {
        let path = this.getTabViewPath;
        let temp = {name: 'postManagement', path: '/index/viewcont/postManagement', desName: '职位管理'};
        if (recopy(path, 'postManagement', '/index/viewcont/postManagement')) {
          this.$emit('showIndexCont', 'postManagement')
        } else {
          this.$emit('showIndexCont', 'postManagement'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
      }
    },
    computed: {
      getTabViewPath() {
        return this.$store.state.visitViewPath
      }
    }
  }

  function recopy(s, c, p) {
    let result = false;
    for (let i = 0; i < s.length; i++) {
      if (s[i].name === c && s[i].path === p) {
        result = true
      }
    }
    return result
  }
</script>

<style scoped>

</style>
