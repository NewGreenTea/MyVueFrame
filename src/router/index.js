import Vue from 'vue'
import Router from 'vue-router'
import myside from './../components/my_sider'
import myheader from './../components/my_header'
import testcontent from './../components/testcontent'
import fileupload from './../components/fileupload'
import login from './../components/login'
import temp from './../components/temp'
import managerLayout from './../components/managerLayout'
import Assignment from './../components/Assignment'
import archAdmin from './../components/organization/archAmin'
//import director from './../components/organization/director'
import director from './../components/organization/newDirector'
import writerGroup from './../components/organization/writerGroup'
import checkWrite from './../components/organization/checkWrite'
import echarts from './../components/test/testEcharts'
//著录时需要的界面
import BaseInfo from './../components/writeLayout/BaseInfo'
import ProfInfo from './../components/writeLayout/ProfInfo'
import FileInfo from './../components/writeLayout/FileInfo'
import BuildingAddress from './../components/writeLayout/BuildingAddress'
import MapInfo from './../components/writeLayout/MapInfo'
import ProjectNo from './../components/writeLayout/ProjectNo'
import AreaHisNo from './../components/writeLayout/AreaHisNo'
import C61 from '../components/writeLayout/specialLayout/C61'
import C62 from '../components/writeLayout/specialLayout/C62'
import C63 from '../components/writeLayout/specialLayout/C63'
import D21 from '../components/writeLayout/specialLayout/D21'
import D22 from '../components/writeLayout/specialLayout/D22'
import UseAreaInfo from '../components/writeLayout/specialLayout/UseAreaInfo'
import D31 from '../components/writeLayout/specialLayout/D31'
import BuildProjInfo from '../components/writeLayout/specialLayout/D31BuildProjInfo'
import D31PubBuildInfo from '../components/writeLayout/specialLayout/D31PubBuildInfo'
import D32 from '../components/writeLayout/specialLayout/D32'
import D34 from '../components/writeLayout/specialLayout/D34'
import D61 from '../components/writeLayout/specialLayout/D61'
import D62 from '../components/writeLayout/specialLayout/D62'
import D63 from '../components/writeLayout/specialLayout/D63'
import MeasureInfo from '../components/writeLayout/specialLayout/MeasureInfo'
import D61NumAreaInfo from '../components/writeLayout/specialLayout/D61NumAreaInfo'
import D61PubBuildInfo from '../components/writeLayout/specialLayout/D61PubBuildInfo'
//著录质检需要的界面
import CheckLayout from '../components/organization/CheckLayout'

import testTable from './../components/test/testTable' // 测试用
//import testForm from './../components/test/testFormVailator' // 测试用
import archManagement from './../components/systemManagement/archData'
import classtype from './../components/test/classtype'
import archTool from '../components/organization/archNoTool'
import archClassify from './../components/organization/archClassify'
import userManagement from '../components/systemManagement/userManagement'
import departmentManagement from '../components/systemManagement/departmentManagement'
import postManagement from '../components/systemManagement/postManagement'
import archSmCheck from '../components/organization/archSmCheck'
import archPrint from '../components/archPrint'


Vue.use(Router);

export default new Router({
  mode: 'history',     //路由模式，如果是history，则在子路由下的路径（children的path）要加父路径上去，去掉url中的“#”
                       //如果是hash（默认），子路由下的路径可以不添加父路径
  routes: [
    { // 测试页面
      path: '/test',
      component: testTable
    },
    { // 登录界面
      path: '/',
      component: login
    },
    { // 登录界面
      path: '/login',
      component: login
    },
    { // 主界面
      path: '/index',
      name: 'index',
      component: managerLayout,
      children: [{
        path: '/index/viewcont',
        name: '',
        components: {
          index_side: myside,
          index_header: myheader,
          index_content: testcontent
        },
        meta:{
          keepAlive:true //需要被缓存的组件
        },
        children: [
          {
            path: '/index/viewcont/dd',
            name: 'A',
            components: {
              A: fileupload
            }
          },
          { // 测试echarts用 （可删）
            path: '/index/viewcont/echarts',
            name: 'echarts',
            components: {
              echarts: echarts
            }
          },
          { // 上传界面
            path: '/index/viewcont/upload',
            name: 'fileupload',
            components: {
              fileupload: fileupload
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            },
          },
          { // 组卷界面
            path: '/index/viewcont/archClassify',
            name: 'archClassify',
            components: {
              archClassify: archClassify
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            },
          },
          { // 扫描质检
            path: '/index/viewcont/archSmCheck',
            name: 'archSmCheck',
            components: {
              archSmCheck: archSmCheck
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          { // 档案打印
            path: '/index/viewcont/archPrint',
            name: 'archPrint',
            components: {
              archPrint: archPrint
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            },
          },
          { // 业务流程创建(弃用，可删)
            path: '/index/viewcont/flowCreated',
            name: 'flowCreated',
            components: {
              flowCreated: temp
            }
          },
          { // 任务(弃用，可删)
            path: '/index/viewcont/Assignment',
            name: 'Assignment',
            components: {
              Assignment: Assignment
            }
          },
          { // 导入清单
            path: '/index/viewcont/archAdmin',
            name: 'archAdmin',
            components: {
              archAdmin: archAdmin
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          { // 分配
            path: '/index/viewcont/director',
            name: 'director',
            components: {
              director: director
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            },
          },
          { // 著录
            path: '/index/viewcont/writerGroup',
            name: 'writerGroup',
            components: {
              writerGroup: writerGroup
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            },
            children: [
              {
                path: '/index/viewcont/writerGroup/BaseInfo',
                name: 'BaseInfo',
                components: {
                  BaseInfo: BaseInfo
                },
                meta:{
                  keepAlive:true
                }
              },
              {
                path: '/index/viewcont/writerGroup/ProfInfo',
                name: 'ProfInfo',
                components: {
                  ProfInfo: ProfInfo
                },
                meta:{
                  keepAlive:true //需要被缓存的组件
                },
                // children: [ //2019/01/19弃用，改为组件引用，不使用路由
                //  ............
                // ]
              },
              {
                path: '/index/viewcont/writerGroup/FileInfo',
                name: 'FileInfo',
                components: {
                  FileInfo: FileInfo
                },
                meta:{
                  keepAlive:true //不需要被缓存的组件
                }
              }
            ]
          },
          { // 著录质检
            path: '/index/viewcont/checkWrite',
            name: 'checkWrite',
            components: {
              checkWrite: checkWrite
            },
            meta:{
              keepAlive:true
            },
            children: [
              {
                path: '/index/viewcont/checkWrite/CheckLayout',
                name: 'CheckLayout',
                components: {
                  CheckLayout: CheckLayout
                },
                meta:{
                  keepAlive:true //需要被缓存的组件
                }
              }
            ]
          },
          { // 档案业务数据管理(弃用，可删)
            path: '/index/viewcont/archManagement',
            name: 'archManagement',
            components: {
              archManagement: archManagement
            }
          },
          {
            path: '/index/viewcont/userManagement',
            name: 'userManagement',
            components: {
              userManagement: userManagement
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          {
            path: '/index/viewcont/departmentManagement',
            name: 'departmentManagement',
            components: {
              departmentManagement: departmentManagement
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          {
            path: '/index/viewcont/postManagement',
            name: 'postManagement',
            components: {
              postManagement: postManagement
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          { // 档案业务数据管理
            path: '/index/viewcont/classtype',
            name: 'classtype',
            components: {
              classtype: classtype
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          {//档案档号管理
            path: '/index/viewcont/archNoTool',
            name: 'archNoManagement',
            components: {
              archNoManagement: archTool
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          }
        ]
      }]
    }
  ]
})
