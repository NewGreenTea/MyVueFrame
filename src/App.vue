<template>
  <div id="app">
    <router-view></router-view>
  </div>
  <!--<body :style="bgImg">-->
  <!--<div id="app">-->
  <!--<router-view></router-view>-->
  <!--</div>-->
  <!--</body>-->
</template>

<script>
  // const url = require('./assets/loginImage.jpg')
  export default {
    // data () {
    //   return {
    //     bgImg: {
    //       backgroundImage: 'url(' + url + ')',
    //       backgroundRepeat: 'no-repeat',
    //       backgroundSize: 'cover'
    //     },
    //     screenWidth: document.body.clientWidth
    //   }
    // },
    // mounted () {
    //   const that = this
    //   window.onresize = () => {
    //     return (() => {
    //       window.screenWidth = document.body.clientWidth
    //       that.screenWidth = window.screenWidth
    //     })()
    //   }
    // }
  }
</script>

<style>
  #app {
    /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
    /*-webkit-font-smoothing: antialiased;*/
    /*-moz-osx-font-smoothing: grayscale;*/
    /*text-align: center;*/
    /*color: #2c3e50;*/
  }

  body {
    /*height: 100%;*/
    /*overflow: auto*/
  }
</style>
