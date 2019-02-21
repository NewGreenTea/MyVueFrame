<template>
  <div style="margin: 0px 0px 50px;">
    <uploader :options="options" class="uploader-example" ref="myupload"
              :autoStart="autoParam"
              :file-status-text="StatusText"
              @file-progress="uploading"
              @file-success="fileSuccess"
              @file-error="fileError"
              @complete="finishUpload"
              @file-complete="fileComplete"
              @file-removed="fileRemoved"
              @files-added="filesAdded"
              v-if="show">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop style="background: white">
        <div style="margin: 10px 0px;padding:10px;border: 1px #c64e53 dashed;border-radius: 5px;">
          <Checkbox v-model="ifIgnore" size="large" @on-change="checkboxChange">执行覆盖上传</Checkbox>
          <Button type="error" @click="ifCleanCache" :disabled="cacheB">清除上传缓存</Button>
        </div>
        <div style="margin: 10px 0px;padding:10px;border: 1px #c64e53 dashed;border-radius: 5px;">
          <span>
            <Tooltip placement="right" max-width="200px" theme="light"  content="选择文件上传时，需要输入档号">
              <Icon type="ios-help-circle-outline" size="30"/>
            </Tooltip>
          </span>
          <uploader-btn :attrs="attrs" class="uploadbutton">选择文件</uploader-btn>
          <span>档号：<Input size="large" style="width: 300px;" placeholder="请输入需要档号" v-model="archNoPage" @on-change="changeInputValue"/></span>
        </div>
        <div style="padding: 10px;border: 1px #c64e53 dashed;border-radius: 5px;">
          <span>
            <Tooltip placement="right" max-width="200px" theme="light"  content="单次上传限制文件总大小为4000MB以下（单个文件大小不超过20MB）">
              <Icon type="ios-help-circle-outline" size="30"/>
            </Tooltip>
          </span>
          <uploader-btn :directory="true" class="uploadbutton">选择文件夹</uploader-btn>
          <Button type="primary" @click="allUpload">全部上传</Button>
          <Button type="warning" @click="allPause">全部暂停</Button>
          <Button type="error" @click="clear">清空</Button>
        </div>
      </uploader-drop>
      <uploader-list ref="uploadList"></uploader-list>
    </uploader>

    <!--隐藏窗口-->
    <Modal v-model="alldelete" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>删除确认</span>
      </p>
      <div style="text-align:center">
        <p>确认要清空待上传的文件/文件夹吗？</p>
      </div>
      <div slot="footer">
        <Button type="error" size="large" long @click="alldeleteok">删除</Button>
      </div>
    </Modal>

  </div>
</template>

<script>
  import axios from 'axios';
  export default {
    name: 'fileupload',
    data () {
      return {
        /*uploader属性*/
        options: {
          target: '/api/upload/vueUpload', // 请求的目标URL
          chunkSize: 1024 * 1024 * 50, // 每个上传的数据块的大小（以字节为单位）默认值：1*1024*1024
          query:'',
          forceChunkSize: false, // 是否强制每块大小小于chunkSize（规定大小）
          autoStart: false, // 是否是自动上传（默认true）
          testChunks: false,
          // singleFile:true,
          simultaneousUploads:1
        },
        /*上传转换数列*/
        uploadFolders:[],
        uploadFiles:[],
        /*已上传文件队列，用于清除缓存*/
        uploadedFile:[],
        /*上传单个文件需要输入的档号*/
        archNoPage:'',
        /*控件*/
        cacheB:false,
        alldelete:false,
        ifIgnore:false,
        /*上传错误列表*/
        errorList:[],
        /*上传拦截器*/
        attrs: {
          accept: 'image/*'
        },
        /*自动上传参数*/
        autoParam: this.$store.state.autoUploadParam,
        /*是否显示预览*/
        show: true,
        /*上传状态汉化*/
        StatusText: {
          success: '上传成功',
          error: '上传失败',
          uploading: '上传中',
          paused: '暂停中',
          waiting: '等待中'
        }
      }
    },
    methods: {
      alldeleteok(){// 清空文件列表
        const uploaderInstance = this.$refs.myupload.uploader
        uploaderInstance.cancel()
        this.alldelete=false;
      },
      clear () {
        let filesLength = this.$refs.myupload.uploader.files.length
        if(filesLength==0){
          this.$Message.warning("没有可以删除的文件")
          return false;
        }
        this.alldelete=true
      },
      filesAdded(files, fileList, event){
        // 添加文件的时候，设置档号，复选框为true添加覆盖上传标记
        const uploaderInstance = this.$refs.myupload.uploader;
        uploaderInstance.opts.query={archNo : this.archNoPage};
        if(this.ifIgnore){
          const uploaderInstance = this.$refs.myupload.uploader;
          uploaderInstance.opts.query={archNo : this.archNoPage, ifIgnore : '1'};
        }

      },
      ifCleanCache(){
        this.$Modal.confirm({
          title: '警告！',
          content: '<p style="font-size: 15px">此操作会影响正在上传的文件</p><p style="font-size: 15px">请确保没有文件正在上传！</p>',
          okText: '确认',
          cancelText: '取消',
          onOk: () => {
            this.cleanCache()
          },
          onCancel: () => {
            return false;
          }
        });
      },
      cleanCache(){
        axios({
          method: 'post',
          url: '/api/upload/cleanUploadCache'
        }).then(res=>{
          this.$Message.success("缓存清除完成")
        }).catch(error=>{
          this.$Message.error('数据错误')
        })
      },
      changeInputValue(){
        // 文本框改变的时候，设置档号
        const uploaderInstance = this.$refs.myupload.uploader;
        uploaderInstance.opts.query={archNo : this.archNoPage};
      },
      checkboxChange(){
        // 复选框为true添加覆盖上传标记
        if(this.ifIgnore){
          const uploaderInstance = this.$refs.myupload.uploader;
          uploaderInstance.opts.query={archNo : this.archNoPage, ifIgnore : '1'};
        }
      },
      uploading (file) { // 上传中的事件
        // console.log('当前开始上传：'+file);
        this.cacheB=true;
      },
      allUpload: function () { // 全部上传
        const uploaderInstance = this.$refs.myupload.$children[2]; // 获得uploader下的filelist
        const filesLength = uploaderInstance.$children.length; // 获得uploader下的filelist的长度
        if(filesLength==0){
          this.$Message.warning("当前没有待上传的文件/文件夹");
          return false;
        }
        for (let i = 0; i < filesLength; i++) {
          uploaderInstance.$children[i].resume()
        }
      },
      allPause () { // 全部暂停
        const uploaderInstance = this.$refs.myupload.$children[2]; // 获得uploader下的filelist
        const filesLength = uploaderInstance.$children.length; // 获得uploader下的filelist的长度
        for (let i = 0; i < filesLength; i++) {
          uploaderInstance.$children[i].pause()
        }
      },
      //单个文件上传成功
      fileSuccess(rootFile, file, message, chunk){
        //判断当前已完成多少个文件，队列所有文件上传完之后删除缓存中上传信息
        if(rootFile.isFolder){
          let archno=file.parent.name;
          let filenum=file.parent.fileList.length;
          let uploadedNum=0;
          this.uploadedFile.push(archno);
          for (let i=0;i<this.uploadedFile.length;i++){
            if(this.uploadedFile[i]==archno){
              uploadedNum++;
            }
          }
          if( uploadedNum == filenum || uploadedNum > filenum ){
            let param = new URLSearchParams();
            param.append('archno', archno);
            axios({
              method: 'post',
              url: '/api/upload/deleteUploadCache',
              data: param
            }).then(res=>{

            }).catch(error=>{
              this.$Message.error('数据错误')
            })
          }
        }
      },
      //单个文件上传失败
      fileError(rootFile, file, message, chunk){
        //记录上传失败的信息
        let resmsg=JSON.parse(chunk.xhr.response).msg;
        this.errorList.push(resmsg);
        //判断当前已完成多少个文件,队列所有文件上传完之后删除缓存中上传信息
        if(rootFile.isFolder) {
          let archno = file.parent.name;
          let filenum = file.parent.fileList.length;
          let uploadedNum = 0;
          this.uploadedFile.push(archno);
          for (let i = 0; i < this.uploadedFile.length; i++) {
            if (this.uploadedFile[i] == archno) {
              uploadedNum++;
            }
          }
          if (uploadedNum == filenum || uploadedNum > filenum) {
            let param = new URLSearchParams();
            param.append('archno', archno);
            axios({
              method: 'post',
              url: '/api/upload/deleteUploadCache',
              data: param
            }).then(res => {

            }).catch(error=>{
              this.$Message.error('数据错误')
            })
          }
        }
      },
      fileRemoved(file){
        //文件删除
      },
      fileComplete(rootFile){
        //每一行上传完成
      },
      finishUpload(){
        /*显示错误信息*/
        if(this.errorList.length>0){
          let showError = [];
          for(let i = 0; i < this.errorList.length; i++){
            if (showError.indexOf(this.errorList[i]) == -1){
              showError.push(this.errorList[i]);
            }
          }
          let errorList='共计：'+this.errorList.length+' 份文件上传失败'+'\n';
          errorList+='失败原因如下：'+'\n';
          for (let i=0;i<showError.length;i++){
            errorList+=(i+1)+'.'+showError[i]+'\n'
          }
          this.$Notice.open({
            title: '上传失败信息汇总   '+dateFormate(new Date()),
            desc: '',
            duration: 0,
            render: h => {
              return h('pre', errorList)
            }
          });
        }
        /*重置数据*/
        this.cacheB=false;
        this.uploadedFile=[];
        this.ifIgnore=false;
        this.errorList=[];
        this.$refs.myupload.$children[2].$children=[];
      },

    }

  }

  // 时间格式转换
  // 对日期的格式进行转换（‘Tue Nov 06 2018 00:00:00 GMT+0800’=》‘yyyy-MM-dd’）
  function dateFormate (date) {
    if (date.getTime() === new Date('Thu Jan 01 1970 08:00:00 GMT+0800 (中国标准时间)').getTime()) {
      return ''
    }
    let datadate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() +
      ' ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds()
    return datadate
  }
</script>

<style scoped>
  .uploadbutton {
    display: inline-block;
    position: relative;
    padding: 4px 8px;
    font-size: 100%;
    line-height: 1.5;
    color: white;
    border: 1px solid #2baee9;
    cursor: pointer;
    border-radius: 5px;
    background: #2baee9;
    outline: none;
  }
  .uploadbutton:hover {
    background-color: rgba(45, 183, 245, 0.8);
  }
  .uploader-example {
    padding: 16px;
    margin: 40px 50px 10px;
    font-size: 15px;
    box-shadow: 0 0 10px #888888;
  }
  .uploader-example .uploader-list {
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
