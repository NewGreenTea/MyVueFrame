<template>
  <div class="boxdiv">
    <!--<canvas v-for="page in pages" :id="'the-canvas'+page" :key="page"></canvas>-->
    <div>案卷封面打印：</div>
    <div class="fmdydiv">
      <span>档号：</span>
      <span>*<Input v-model="f_value_s" placeholder="起始档号 必填" style="width: 300px" /> ---- </span>
      <span><Input v-model="f_value_e" placeholder="结束档号 选填" style="width: 300px"/></span>
      <span><Button type="primary" :loading="floading" size="large" shape="circle" @click="fm_print()">打印预览</Button></span>
    </div>
    <div>卷内目录打印：</div>
    <div class="jnmldiv">
      <span>档号：</span>
      <span>*<Input v-model="j_value_s" placeholder="起始档号 必填" style="width: 300px" /> ---- </span>
      <span><Input v-model="j_value_e" placeholder="结束档号 选填" style="width: 300px"/></span>
      <span><Button type="primary" :loading="jloading" size="large" shape="circle" @click="jnml_print()">打印预览</Button></span>
    </div>
  </div>
</template>

<script>
  // import PDFJS from 'pdfjs-dist';
  import axios from 'axios';
  export default {
    name: 'archPrint',
    data(){
      return{
        pages:[],
        pdfDoc:'',
        f_value_s:'',
        f_value_e:'',
        j_value_s:'',
        j_value_e:'',
        floading:false,
        jloading:false
      }
    },
    methods : {
      fm_print(){
        if(this.f_value_s==''&&this.f_value_e==''){
          this.$Message.warning("请输入查询条件");
          return false;
        }
        this.floading=true;
        let param = new URLSearchParams();
        param.append('startArchNo', this.f_value_s);
        param.append('endArchNo', this.f_value_e);
        axios({
          method: 'post',
          url: '/api/upload/fmprint',
          data: param
        }).then(res=>{
          this.floading=false;
          if(res.data!='' && res.data!=null ){
            let printwindow=window.open(res.data);
            printwindow.print();
          }else {
            this.$Message.error("数据错误,请检查后重试");
          }
        }).catch(error => {
          this.floading=false;
          console.log(error);
        })
      },
      jnml_print(){
        if(this.j_value_s==''&&this.j_value_e==''){
          this.$Message.warning("请输入查询条件");
          return false;
        }
        this.jloading=true;
        let params = new URLSearchParams();
        params.append('startArchNo', this.j_value_s);
        params.append('endArchNo', this.j_value_e);
        axios({
          method: 'post',
          url: '/api/upload/jnmlprint',
          data: params
        }).then(res=>{
          this.jloading=false;
          if(res.data!='' && res.data!=null ){
            let printwindow=window.open(res.data);
            printwindow.print();
          }else {
            this.$Message.error("数据错误,请检查后重试");
          }
        }).catch(error => {
          this.jloading=false;
          console.log(error);
        })
      },
      // renderPage(num) {
      //   this.pdfDoc.getPage(num).then((page) => {
      //     let canvas = document.getElementById('the-canvas' + num)
      //     let ctx = canvas.getContext('2d')
      //     let dpr = window.devicePixelRatio || 1
      //     let bsr = ctx.webkitBackingStorePixelRatio ||
      //       ctx.mozBackingStorePixelRatio ||
      //       ctx.msBackingStorePixelRatio ||
      //       ctx.oBackingStorePixelRatio ||
      //       ctx.backingStorePixelRatio || 1
      //     let ratio = dpr / bsr
      //     let viewport = page.getViewport(screen.availWidth / page.getViewport(1).width)
      //     canvas.width = viewport.width * ratio
      //     canvas.height = viewport.height * ratio
      //     canvas.style.width = viewport.width + 'px'
      //     canvas.style.height = viewport.height + 'px'
      //     ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
      //     let renderContext = {
      //       canvasContext: ctx,
      //       viewport: viewport
      //     }
      //     page.render(renderContext)
      //     if (this.pages > num) {
      //       this.renderPage(num + 1)
      //     }
      //   })
      // },
      // loadFile(url) {
      //   PDFJS.getDocument(url).then((pdf) => {
      //     this.pdfDoc = pdf
      //     console.log(pdf)
      //     this.pages = this.pdfDoc.numPages
      //     this.$nextTick(() => {
      //       this.renderPage(1)
      //     })
      //   })
      // }
    }

  }
</script>

<style>
  .boxdiv{
    font-size:20px;
    padding: 10px;
    margin: 10px 50px;
    border: 1px rgba(193, 180, 198, 0.03) solid;
    box-shadow: 0px 0px 10px #888888;
  }
  .fmdydiv{
    font-size:16px;
    margin: 5px;
    padding: 5px;
    border: 1px #c64e53 dashed;
  }
  .jnmldiv{
    font-size:16px;
    margin: 10px 5px;
    padding: 5px;
    border: 1px #c64e53 dashed;
  }
</style>
