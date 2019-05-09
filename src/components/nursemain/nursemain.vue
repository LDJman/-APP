<template>
    <div class="main_all">
        <!-- 总信息显示 -->
          <div class="list_info" >
            <div class="list_msg_info" v-for="item in msglist">
               <!-- 使用DIV画圆环 -->
                <div class="list_arc_info" @click="topatientmsg($event)">
                  <div class="patient_msg_info">
                    <div>姓名：{{item.patientname}}</div>
                    <div class="liquidtype">液滴状态：{{item.liquidtype}}</div>
                    <div>输液流速：{{item.liquidspeed}}滴/分</div>
                  </div>
                </div>

                 <!-- 使用画布画圆环 -->
                <!-- <canvas class="arc" ref="arc">
                 <span>{{item.cot}}</span>
                </canvas> -->
                <div class="list_num_info">床号：{{item.bednum}}</div>
            </div>
          </div>
        
        <!-- 底部菜单栏 -->
        <div class="foot">
            <div class="main">
                <i class="iconfont icon-dianpu"></i>
            </div>
            <div class="usermsg" @click="tousermsg()">
                <i class="iconfont icon-icon"></i>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
      msglist: [] ,//全部病人信息
      note:false//输液状态发布警报后即改变
    };
  },
  created() {
    this.init();
    //建立websocket连接
    this.initwebsocket();
    this.websock.onopen = this.websocketopen;
    this.websock.onmessage = this.websocketonmessage;
    this.websock.onclose = this.websocketclose;
  },
  mounted() {},
  computed: {
    // isliquidtype_err : function (){
    //   if (this.msglist[2].liquidtype != "输液正常中"){
    //     return true;
    //   }
    // }
  },
  updated() {
    // this.canva();
    // 判断哪个输液状态异常，改变颜色
    let lt = document.getElementsByClassName("liquidtype");
    for (let i = 0; i < this.msglist_length; i++) {
      if (lt[i].innerHTML != "液滴状态：输液正常中") {
        lt[i].style.color = "red";
      }
    }
  },
  destroyed() {
    this.websock.close(); //退出页面时关闭websocket连接
  },
  methods: {
    //请求总体输液病人信息
    init() {
      let count_type = localStorage.getItem("type");
      let count = localStorage.getItem("count");
      let params = {
        count_type: count_type,
        count: count
      };
      if (count_type == "nurse") {
        let url = this.host + "/allpatient"; 
        this.$axios
          .post(url, this.$qs.stringify(params))
          .then(res => {
            console.log(res);
            this.msglist = res.data;
            this.msglist_length = res.data.length;
          })
          .catch(function(error) {
            console.log(error);
          });
      }
    },
    // 跳转用户信息页
    tousermsg() {
      this.$router.push("/usermsg");
    },

    //添加画布圆环【因IPD等平板设备对画布的自定义大小支持与手机不一致，所以不启用】
    canva() {
      var o = document.getElementsByClassName("list_msg_info");
      var r = o[0].offsetWidth / 3;
      console.log(r);
      var c = document.getElementsByClassName("arc");
      for (var i = 0; i < 5; i++) {
        var cxt = c[i].getContext("2d");
        cxt.beginPath();
        cxt.strokeStyle = "#394253";
        cxt.lineWidth = "10";
        console.log(r);
        cxt.arc(150, 80, r, 0, Math.PI * 2, true);
        cxt.stroke();
      }
    },

    // 跳转输液病人信息详细页
    topatientmsg(event) {
      var el = event.currentTarget.nextElementSibling;
      let bnum = el.innerHTML.substring(3); //获取点击输液病人的床号
      this.$router.push({ path: "/patientmsg", query: { bednum: bnum } }); //把点击的输液病人床号通过路由传参
    },
    initwebsocket() {
      const wsuri = this.wshost+"/wsallpatients";
      this.websock = new WebSocket(wsuri);
    },
    websocketopen() {
      //打开websocket
      console.log("WebSocket连接成功");
    },
    websocketonmessage(data) {
      //数据接收
      console.log(data.data);
      //实时
      let wsdata = data.data;
      let wsdatab = wsdata.substring(3);
      let zero_wsdatab = wsdatab.substr(0,1);
      if (wsdata.length == 2) {
        this.init();
      } 
      if(wsdatab == "threshold" || wsdatab == "empty" || zero_wsdatab == "0"){
        let ws_num = wsdata.substr(0, 2);
        let ws_liquidtype = wsdata.substring(3);
        let bn = document.getElementsByClassName("list_num_info");
        for (let i = 0; i < this.msglist_length; i++) {
          let bntext = bn[i].innerHTML;
          let bnum = bntext.substring(3);
          if (bnum == ws_num) {
            let lt = bn[i].previousElementSibling.firstChild.children[1]; //选择相应床号的输液状态节点
            let ls = bn[i].previousElementSibling.firstChild.children[2]; //选择相应床号的输液速度节点
            if (ws_liquidtype == "threshold") {
              this.note = true;
              lt.innerHTML = "液滴状态：输液临空！";
              lt.style.color = "red";
            }
            if (ws_liquidtype == "empty") {
              this.note = true;
              lt.innerHTML = "液滴状态：输液已空！";
              lt.style.color = "red";
            }
            if (zero_wsdatab == "0") {
              lt.innerHTML = "液滴状态：输液堵塞！";
              lt.style.color = "red";
              ls.innerHTML = "输液速度：0 滴/分"
            }
          }
        }
      }else{
        let ws_num = wsdata.substr(0, 2);
        let lspeed = wsdata.substring(3);
        let bn = document.getElementsByClassName("list_num_info");
        for (let i = 0; i < this.msglist_length; i++) {
          let bntext = bn[i].innerHTML;
          let bnum = bntext.substring(3);
          if (bnum == ws_num) {
            if(this.note == false){
              let lt = bn[i].previousElementSibling.firstChild.children[1]; //选择相应床号的输液状态节点
              lt.innerHTML = "液滴状态：输液正常中"
              lt.style.color = "white"
            }
            let ls = bn[i].previousElementSibling.firstChild.children[2]; //选择相应床号的输液速度节点
            ls.innerHTML = "输液速度："+lspeed+"滴/分"
          }
        }       
      }
      // if(wsdata.length == 5){
      //   let ws_num = wsdata.substr(0, 2);
      //   let lspeed = wsdata.substring(3);
      //   let bn = document.getElementsByClassName("list_num_info");
      //   for (let i = 0; i < this.msglist_length; i++) {
      //     let bntext = bn[i].innerHTML;
      //     let bnum = bntext.substring(3);
      //     if (bnum == ws_num) {
      //       let ls = bn[i].previousElementSibling.firstChild.children[2]; //选择相应床号的输液速度节点
      //       ls.innerHTML = "输液速度："+lspeed+"滴/分"
      //     }
      //   }
      // }else {
      //   let ws_num = wsdata.substr(0, 2);
      //   let ws_liquidtype = wsdata.substring(3);
      //   let bn = document.getElementsByClassName("list_num_info");
      //   for (let i = 0; i < this.msglist_length; i++) {
      //     let bntext = bn[i].innerHTML;
      //     let bnum = bntext.substring(3);
      //     if (bnum == ws_num) {
      //       let lt = bn[i].previousElementSibling.firstChild.children[1]; //选择相应床号的输液状态节点
      //       if (ws_liquidtype == "threshold") {
      //         lt.innerHTML = "液滴状态：输液临空！";
      //         lt.style.color = "red";
      //       }
      //       if (ws_liquidtype == "empty") {
      //         lt.innerHTML = "液滴状态：输液已空！";
      //         lt.style.color = "red";
      //       }
      //     }
      //   }
      // }
    },
    websocketclose() {
      //关闭
      console.log("WebSocket关闭");
    }
  }
};
</script>

<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  font-size: 25px;
  color: white;
}
.main_all {
  background-color: #465d91;
  width: 100vw;
  height: 100vh;
  padding-bottom: 6vh;
  overflow: auto;
  .list_info {
    .list_msg_info {
      float: left;
      width: 50vw;
      height: 50vw;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      overflow: hidden;
      margin-top: 5vw;
      .list_arc_info {
        width: 35vw;
        height: 35vw;
        border: 20px solid #394253;
        border-radius: 20vw;
        display: flex;
        justify-content: center;
        align-items: center;
        .patient_msg_info {
          text-align: center;
        }
      }
      .list_num_info {
        width: 49vw; //50vw;
      }
    }
  }
  .foot {
    z-index: 10;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    width: 100vw;
    height: 6vh;
    position: fixed;
    bottom: 0;
    background-color: white;
    div {
      width: 50%;
      height: 100%;
      float: left;
      display: flex;
      align-items: center;
      justify-content: center;
      i {
        color: #394253;
        font-size: 50px;
      }
      .icon-dianpu {
        color: #465d91;
      }
    }
    .main {
      height: 90%;
      border-bottom: 10px solid #465d91;
    }
  }
}
</style>