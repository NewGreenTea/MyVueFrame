import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

// 更新保存用户id在全局变量中 -2019/1/2
export default new Vuex.Store({
  state: {
    userID: '', // 用户id
    userName: '', // 用户名
    systemCode: '', //使用系统
    autoUploadParam: false, // 上传模式
    visitViewPath: [], // 标签路径（导航用）
    visitCurrnetPath: '', // 定位到当前页
    fileNum: -1, // 上传文件数量(暂时不用)
    //任务数据（跨页面传数据） 2019/01/30
    AssignmentsData: {
      pageUrl:null,
      urlParams: null
    },
    //当前任务浏览
    AssignmentsVisit:{
      pageUrl:null,
      urlParams: null
    }
  },
  mutations: {
    //（设置）保存用户id
    setUserID (state, id) {
      state.userID = id;
      window.localStorage.setItem('userid', state.userID)
    },
    //（设置）保存用户名
    setUserName (state, name) {
      state.userName = name;
      window.localStorage.setItem('username', state.userName) //保存在浏览器的本地存储里
    },
    //（设置）使用中系统 -2019/02/16
    setSystemCode(state, code){
      state.systemCode = code;
      window.localStorage.setItem('systemCode', state.systemCode)
    },
    //（清除）使用中系统 -2019/02/16
    clearSystemCode(state){
      state.systemCode = '';
      window.localStorage.setItem('userid', '')
    },
    //更新用户id
    updateUserID(state, id){
      state.userID = id;
      window.localStorage.setItem('userid', state.userID)
    },
    //更新用户名
    updateUserName (state, name) {
      state.userName = name;
      window.localStorage.setItem('username', state.userName)
    },
    //清除用户ID
    clearUserID (state) {
      state.userID = '';
      window.localStorage.setItem('userid', '')
    },
    //清除用户名
    clearUserName (state) {
      state.userName = '';
      window.localStorage.setItem('username', '')
    },
    // ------------------------------------------------------
    //改变上传模式
    changeAutoUpload (state, auto) {
      state.autoUploadParam = auto
    },
    // ------------------------------------------------------
    //添加主界面标签视图
    addTabView (state, path) {
      state.visitViewPath.push({
        name: path.name,
        path: path.path,
        desName: path.desName
      })
    },
    //查看当前标签视图
    visitCurrentPath (state, name) {
      state.visitCurrnetPath = name
    },
    //移除标签视图
    removeTabView (state, name) {
      for (let i = 0; i < state.visitViewPath.length; i++) {
        if (state.visitViewPath[i].name === name) {
          state.visitViewPath.splice(i, 1);
          break
        }
      }
    },
    //退出时清空Vuex的标签栏
    reSetTabView(state){
      state.visitViewPath = []
    },
    // ------------------------------------------------------
    fileAdd (state, num) { // 上传文件数量增加
      state.fileNum = state.fileNum + num
    },
    fileDec (state, num) { // 上传文件数量减少
      state.fileNum = state.fileNum - num
    },
    //---------------------2019/01/30-------------------------
    //任务数据
    setAssignmentsData(state, {url, params}){
      state.AssignmentsData.pageUrl = url;
      state.AssignmentsData.urlParams = params;
    },
    //任务当前浏览数据
    setAssignmentsVisit(state, {url, params}){
      state.AssignmentsVisit.pageUrl = url;
      state.AssignmentsVisit.urlParams = params;
    }
  },
  actions: {
    //用户ID操作方法
    SetUserID (context, id) {
      context.commit('setUserID', id)
    },
    UpdateUserID (context, id) {
      context.commit('updateUserID', id)
    },
    ClearUserID (context) {
      context.commit('clearUserID')
    },
    //用户名操作方法
    SetUserName (context, name) {
      context.commit('setUserName', name)
    },
    UpdateUserName (context, name) {
      context.commit('updateUserName', name)
    },
    ClearUserName (context) {
      context.commit('clearUserName')
    },
    //使用系统操作方法 -2019/02/16
    SetSystemCode(context,code){
      context.commit('setSystemCode',code)
    },
    ClearSystemCode(context){
      context.commit('clearSystemCode')
    },
    // ------------------------------------------
    ChangeAutoUpload (context, auto) {
      context.commit('changeAutoUpload', auto)
    },
    // ------------------------------------------
    AddTabView (context, path) {
      context.commit('addTabView', path)
    },
    RemoveTabView (context, name) {
      context.commit('removeTabView', name)
    },
    VisitCurrentPath (context, name) { // 定位标签页
      context.commit('visitCurrentPath', name)
    },
    //退出时清空Vuex的标签栏
    ReSetTabView (context){
      context.commit('reSetTabView')
    },
    // ------------------------------------------
    FileAdd (context, num) {
      context.commit('fileAdd', num)
    },
    FileDec (context, num) {
      context.commit('fileDec', num)
    },
    //-------------2019/01/30--------------------
    SetAssignmentData(context,url,params){
      context.commit('setAssignmentData', url, params)
    }
  },
  getters: {
    visitViewPath: state => state.visitViewPath,
    AssignmentsData: state => state.AssignmentsData,
    AssignmentsVisit: state => state.AssignmentsVisit,
    systemCode: state => state.systemCode,
  }
})
