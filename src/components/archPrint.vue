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
      }
    }

  }
</script>

<style>
  .boxdiv{
    font-size:20px;
    padding: 10px;
    margin: 40px 50px 10px;
    border: 1px rgba(193, 180, 198, 0.03) solid;
    box-shadow: 0px 0px 10px #888888;
  }
  .fmdydiv{
    font-size:16px;
    margin: 5px 5px 30px;
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
