<template>
  <div>
    <uploader :options="options" class="uploader-example" ref="myupload" :autoStart="autoParam"
              :file-status-text="StatusText"
              @file-added="beforeUpload"
              @file-progress="uploading"
              @file-success="fileSuccess"
              @file-error="fileError"
              v-on:finish="finishUpload"
              v-if="show">
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop style="background: white">
        <!--<p style="margin: 10px 0px;padding:5px;border: 1px #c64e53 dashed;">-->
          <!---->
        <!--</p>-->
        <div style="margin: 10px 0px;padding:5px;border: 1px #c64e53 dashed;border-radius: 5px;">
          <span>
            <Tooltip placement="right" max-width="200px" theme="light"  content="选择文件上传时，需要输入档号">
              <Icon type="ios-help-circle-outline" size="30"/>
            </Tooltip>
          </span>
          <uploader-btn :attrs="attrs" class="uploadbutton" @click="clickFileUpload">选择文件</uploader-btn>
          <span>档号：<Input size="large" style="width: 300px;" placeholder="请输入需要替换文件的档号" v-model="archNoPage" @change="changeInputValue"/></span>
        </div>
        <div style="padding: 5px;border: 1px #c64e53 dashed;">
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

  export default {
    name: 'fileupload',
    data () {
      return {
        alldelete:false,
        archNoPage:'',
        options: {
          target: '/api/upload/vueUpload', // 请求的目标URL
          chunkSize: 1024 * 1024 * 50, // 每个上传的数据块的大小（以字节为单位）默认值：1*1024*1024
          query:'',
          forceChunkSize: false, // 是否强制每块大小小于chunkSize（规定大小）
          autoStart: false, // 是否是自动上传（默认true）
          testChunks: false
        },
        attrs: {
          accept: 'image/*'
        },
        autoParam: this.$store.state.autoUploadParam,
        show: true,
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
      clickFileUpload(){

      },
      alldeleteok(){// 清空文件列表
        const uploaderInstance = this.$refs.myupload.uploader
        uploaderInstance.cancel()
        this.alldelete=false;
      },
      clear () {
        const uploaderInstance = this.$refs.myupload.$children[2] // 获得uploader下的filelist
        const filesLength = uploaderInstance.$children.length // 获得uploader下的filelist的长度
        if(filesLength==0){
          this.$Message.warning("没有可以删除的文件")
          return false;
        }
        this.alldelete=true
      },
      beforeUpload (file) { // 添加文件触发事件（上传之前，做检验用）
        const uploaderInstance = this.$refs.myupload.uploader
        uploaderInstance.opts.query={archNo : this.archNoPage};
      },
      changeInputValue(){
        const uploaderInstance = this.$refs.myupload.uploader
        uploaderInstance.opts.query={archNo : this.archNoPage};
      },
      uploading (file) { // 上传中的事件

      },
      allUpload: function () { // 全部上传
        const uploaderInstance = this.$refs.myupload.$children[2] // 获得uploader下的filelist
        const filesLength = uploaderInstance.$children.length // 获得uploader下的filelist的长度
        if(filesLength==0){
          this.$Message.warning("当前没有待上传的文件/文件夹")
          return false;
        }
        for (let i = 0; i < filesLength; i++) {
          uploaderInstance.$children[i].resume()
        }
      },
      allPause () { // 全部暂停
        const uploaderInstance = this.$refs.myupload.$children[2] // 获得uploader下的filelist
        const filesLength = uploaderInstance.$children.length // 获得uploader下的filelist的长度
        for (let i = 0; i < filesLength; i++) {
          uploaderInstance.$children[i].pause()
        }
      },
      fileSuccess(rootFile, file, message, chunk){  //上传成功

      },
      fileError(rootFile, file, message, chunk){  //上传失败
        let resmsg=JSON.parse(chunk.xhr.response).msg
        this.$Message.warning({
          content:resmsg,
          duration: 20,
          closable: true
        });
      },
      finishUpload(e){
        let res=JSON.parse(e);
        console.log(res);
      }
    }

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
