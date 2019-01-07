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
      <uploader-drop>
        <p style="margin: 10px 0px;padding:5px;border: 1px #c64e53 dashed;">
          提示：最多上传200个文件（单个文件大小不超过20mb），支持格式为jpg、png、pdf、gif、word文档、execl文档
        </p>
        <div style="margin: 10px 0px;padding:5px;border: 1px #c64e53 dashed;border-radius: 5px;">
          <uploader-btn :attrs="attrs" @click="clickFileUpload">上传文件</uploader-btn>
          <span>档号：<input type="text" style="height: 25px;font-size: medium" placeholder="请输入需要替换文件的档号" v-model="archNoPage" @change="changeInputValue"/></span>
        </div>
        <div style="padding: 5px;border: 1px #c64e53 dashed;">
          <uploader-btn :directory="true">选择文件夹</uploader-btn>
          <button class="uploader-btn" @click="clear">清空</button>
          <button class="uploader-btn" @click="allUpload">全部上传</button>
          <button class="uploader-btn" @click="allPause">全部暂停</button>
        </div>
      </uploader-drop>
      <uploader-list ref="uploadList"></uploader-list>
    </uploader>
  </div>
</template>

<script>

  export default {
    name: 'fileupload',
    data () {
      return {
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
      clear () { // 清空文件列表
        const uploaderInstance = this.$refs.myupload.uploader
        uploaderInstance.cancel()
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
        let resmsg=JSON.parse(chunk.xhr.response).msg
        if(resmsg!='200'){
          this.$Message.error({
            content:resmsg,
            duration: 300,
            closable: true
          });
        }
      },
      fileError(rootFile, file, message, chunk){  //上传失败
        console.log('error', rootFile, file, message, chunk)
      },
      finishUpload(e){
        debugger;
        let res=JSON.parse(e);
        console.log(res);
      }
    }

  }
</script>

<style scoped>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
