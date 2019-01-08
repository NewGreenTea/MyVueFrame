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
import echarts from './../components/test/testEcharts'
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
// import B13 from './../components/writeLayout/B13'
// import C41 from './../components/writeLayout/C41'
import testTable from './../components/test/testTable' // 测试用
//import testForm from './../components/test/testFormVailator' // 测试用
import archManagement from './../components/systemManagement/archData'
import classtype from './../components/test/classtype'
import archTool from './../components/organization/archNoTool'
import archClassify from './../components/organization/ArchClassify'
import userManagement from '../components/systemManagement/userManagement'
import departmentManagement from '../components/systemManagement/departmentManagement'
import postManagement from '../components/systemManagement/postManagement'

Vue.use(Router);

export default new Router({
  model: 'history',
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
        path: 'viewcont',
        name: '',
        components: {
          index_side: myside,
          index_header: myheader,
          index_content: testcontent
        },
        children: [
          {
            path: 'dd',
            name: 'A',
            components: {
              A: fileupload
            }
          },
          { // 测试echarts用 （可删）
            path: 'echarts',
            name: 'echarts',
            components: {
              echarts: echarts
            }
          },
          { // 上传界面
            path: 'upload',
            name: 'fileupload',
            components: {
              fileupload: fileupload
            }
          },
          { // 组卷界面
            path: 'archClassify',
            name: 'archClassify',
            components: {
              archClassify: archClassify
            }
          },
          { // 业务流程创建
            path: 'flowCreated',
            name: 'flowCreated',
            components: {
              flowCreated: temp
            }
          },
          { // 任务
            path: 'Assignment',
            name: 'Assignment',
            components: {
              Assignment: Assignment
            }
          },
          { // 库房管理员
            path: 'archAdmin',
            name: 'archAdmin',
            components: {
              archAdmin: archAdmin
            },
            children: [{
              path: 'archNoTool',
              name: 'archNoTool',
              components: {
                ArchTool: archTool
              }
            }]
          },
          { // 主管
            path: 'director',
            name: 'director',
            components: {
              director: director
            }
          },
          { // 著录组
            path: 'writerGroup',
            name: 'writerGroup',
            components: {
              writerGroup: writerGroup
            },
            children: [
              {
                path: 'BaseInfo',
                name: 'BaseInfo',
                components: {
                  BaseInfo: BaseInfo
                }
              },
              {
                path: 'ProfInfo',
                name: 'ProfInfo',
                components: {
                  ProfInfo: ProfInfo
                },
                children: [
                  {
                    path: 'ProfCommon',
                    name: 'ProfCommon',
                    components: {
                      BuildingAddress: BuildingAddress,
                      AreaHisNo: AreaHisNo,
                      MapInfo: MapInfo,
                      ProjectNo: ProjectNo,
                      C61: C61,
                      C62: C62,
                      C63: C63,
                      D21: D21,
                      D22: D22,
                      D31: D31,
                      D32: D32,
                      D34: D34,
                      D61: D61,
                      D62: D62,
                      D63: D63
                    },
                    children: [
                      {
                        path: 'ProfSpcCommon',
                        name: 'ProfSpcCommon',
                        components: {
                          MeasureInfo: MeasureInfo,
                          NumAreaInfo: D61NumAreaInfo,
                          D61PubBuildInfo: D61PubBuildInfo,
                          BuildProjInfo: BuildProjInfo,
                          D31PubBuildInfo: D31PubBuildInfo,
                          D21UseAreaInfo: UseAreaInfo,
                          D22UseAreaInfo: UseAreaInfo
                        }
                      }
                    ]
                  }
                ]
              },
              {
                path: 'FileInfo',
                name: 'FileInfo',
                components: {
                  FileInfo: FileInfo
                }
              }
            ]
          },
          { // 档案业务数据管理
            path: 'archManagement',
            name: 'archManagement',
            components: {
              archManagement: archManagement
            }
          },
          {
            path: 'userManagement',
            name: 'userManagement',
            components: {
              userManagement: userManagement
            }
          },
          {
            path: 'departmentManagement',
            name: 'departmentManagement',
            components: {
              departmentManagement: departmentManagement
            }
          },
          {
            path: 'postManagement',
            name: 'postManagement',
            components: {
              postManagement: postManagement
            }
          },
          { // 档案业务数据管理
            path: 'classtype',
            name: 'classtype',
            components: {
              classtype: classtype
            }
          }
        ]
      }]
    }
  ]
})
