import Vue from 'vue'
import Router from 'vue-router'
//主界面
import myside from './../components/my_sider'
import myheader from './../components/my_header'
import testcontent from './../components/testcontent'
import login from './../components/login'
import managerLayout from './../components/managerLayout'
//菜单
import archAdmin from './../components/organization/archAmin'
import director from './../components/organization/newDirector'
import writerGroup from './../components/organization/writerGroup'
import checkWrite from './../components/organization/checkWrite'
import fileupload from './../components/fileupload'
import classtype from './../components/test/classtype'
import archTool from '../components/organization/archNoTool'
import archClassify from './../components/organization/archClassify'
import userManagement from '../components/systemManagement/userManagement'
import departmentManagement from '../components/systemManagement/departmentManagement'
import postManagement from '../components/systemManagement/postManagement'
import archSmCheck from '../components/organization/archSmCheck'
import archPrint from '../components/archPrint'
//著录时需要的界面（writerGroup）
import BaseInfo from './../components/writeLayout/BaseInfo'
import ProfInfo from './../components/writeLayout/ProfInfo'
import FileInfo from './../components/writeLayout/FileInfo'

Vue.use(Router);

export default new Router({
  mode: 'history',     //路由模式，如果是history，则在子路由下的路径（children的path）要加父路径上去，去掉url中的“#”
                       //如果是hash（默认），子路由下的路径可以不添加父路径
  routes: [
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
          //档案管理部分
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
            }
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
          //系统管理部分
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
          {//档案档号管理
            path: '/index/viewcont/archNoTool',
            name: 'archNoManagement',
            components: {
              archNoManagement: archTool
            },
            meta:{
              keepAlive:true //需要被缓存的组件
            }
          },
          //额外部分
          { // 档案类型管理  (不打开，不使用)
            path: '/index/viewcont/classtype',
            name: 'classtype',
            components: {
              classtype: classtype
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
