<template>
  <div style="width: 240px;">
    <Menu :accordion="menuAccordion" class="sideClass">
      <Submenu name="1" >
        <template slot="title">
          <Icon type="ios-analytics" size="16px"/>
          档案整理
        </template>
        <MenuItem name="1-1">
          <router-link to="/index/viewcont/archAdmin" tag="p"><p @click="archAdminLauout">导入清单</p></router-link>
        </MenuItem>
        <MenuItem name="1-2">
          <router-link to="/index/viewcont/director" tag="p"><p @click="directorLauout">任务分配</p></router-link>
        </MenuItem>
        <MenuItem name="1-3">
          <router-link to="/index/viewcont/writerGroup" tag="p"><p @click="writerLauout">著录</p></router-link>
        </MenuItem>
        <MenuItem name="1-4">
          <router-link to="/index/viewcont/checkWrite" tag="p"><p @click="checkWriter" >著录质检</p></router-link>
        </MenuItem>
        <MenuItem name="1-5">
          <router-link to="/index/viewcont/archSmCheck" tag="p"><p @click="smcheckLauout" >扫描质检</p></router-link>
        </MenuItem>
        <MenuItem name="1-6">
          <router-link to="/index/viewcont/upload" tag="p"><p @click="fileuploadLauout" >上传</p></router-link>
        </MenuItem>
        <MenuItem name="1-7">
          <router-link to="/index/viewcont/archClassify" tag="p"><p @click="archClassifyLauout">档案组卷</p></router-link>
        </MenuItem>
        <MenuItem name="1-8">
          <router-link to="/index/viewcont/archPrint" tag="p"><p @click="printLauout">打印</p></router-link>
        </MenuItem>
      </Submenu>
      <Submenu name="2">
        <template slot="title">
          <Icon type="ios-filing" size="16px"/>
          借阅管理
        </template>
        <MenuItem name="2-1">待完善</MenuItem>
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-filing"/>
          检索统计
        </template>
        <MenuItem name="3-1">
          待完善
          <!--<router-link to="">档案统计</router-link>-->
        </MenuItem>
      </Submenu>
      <Submenu name="4">
        <template slot="title">
          <Icon type="ios-cog" size="20px"/>
          系统管理
        </template>
        <MenuItem name="4-1">
          <router-link to="/index/viewcont/userManagement" tag="p"><p @click="userManagement">用户管理</p></router-link>
        </MenuItem>
        <MenuItem name="4-2">权限管理</MenuItem>
        <MenuItem name="4-3">
          <router-link to="/index/viewcont/departmentManagement" tag="p"><p @click="departmentManagement">部门管理</p></router-link>
        </MenuItem>
        <MenuItem name="4-4">
          <router-link to="/index/viewcont/postManagement" tag="p"><p @click="postManagement">职位管理</p></router-link>
        </MenuItem>
        <!--<MenuItem name="4-5">模板管理</MenuItem>-->
        <MenuItem name="4-5">
          <router-link to="/index/viewcont/archNoTool" tag="p"><p @click="archNoManagement">档号管理</p></router-link>
        </MenuItem>
      </Submenu>
      <Submenu name="5">
        <template slot="title">
          <Icon type="ios-cog" size="16px"/>
          开发测试
        </template>
        <MenuItem name="5-1">
          <router-link to="/index/viewcont/flowCreated"><p>业务创建</p></router-link>
        </MenuItem>
        <MenuItem name="5-2">
          <router-link to="/index/viewcont/Assignment"><p>任务</p></router-link>
        </MenuItem>
        <MenuItem name="5-3">
          <router-link to="/index/viewcont/Assignment"><p>数据管理</p></router-link>
        </MenuItem>
        <MenuItem name="5-4">
          <router-link to="/index/viewcont/archManagement"><p>档案管理</p></router-link>
        </MenuItem>
        <MenuItem name="5-5">
          <!--<p @click="ArchTypeLauout">-->
          <router-link to="/index/viewcont"><p>档案类型</p></router-link>
        </MenuItem>
        <MenuItem name="5-6">
          <router-link to="/index/viewcont/echarts"><p>测试ECHARTS</p></router-link>
        </MenuItem>
      </Submenu>
    </Menu>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        //开启手风琴模式，只能打开菜单的一个
        menuAccordion: true
      }
    },
    methods: {
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
      ArchTypeLauout() { //不使用（档案类型管理）
        let path = this.getTabViewPath;
        let temp = {name: 'classtype', path: '/index/viewcont/classtype'};
        if (recopy(path, 'classtype', '/index/viewcont/classtype')) {
          this.$emit('showIndexCont', 'classtype')
        } else {
          this.$emit('showIndexCont', 'classtype'); // 子向父组件传值
          this.$store.dispatch('AddTabView', temp)
        }
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
      },
      //档号管理（设置）
      archNoManagement(){
        let path = this.getTabViewPath;
        let temp = {name: 'archNoManagement', path: '/index/viewcont/archNoTool', desName: '档号管理'};
        if (recopy(path, 'archNoManagement', '/index/viewcont/archNoTool')) {
          this.$emit('showIndexCont', 'archNoManagement')
        } else {
          this.$emit('showIndexCont', 'archNoManagement'); // 子向父组件传值
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
