<template>
   <div class = "all">
       <!-- 病人基本信息 -->
       <div class="initmsg">
           <div class="patientname">
                    <i class="iconfont icon-icon"></i>
                    <span>{{pname}}</span>
           </div>
           <div class="bednum">
               <span>床号：{{bednum}}</span>
           </div>
       </div>

       <!-- 输液信息及操作 -->
       <div class="liquidop">
           <!-- 流速显示 -->
           <div class="lspeed">
               <span>
                   <i class="iconfont icon-zuidaliusu"></i>
                   &nbsp;&nbsp;<span>当前流速：<span>{{lspeed}}</span>滴/m</span>
                </span>
            </div>

            <!-- 液滴状态显示 -->
            <div class="ltype">
                <span>
                    <i class="iconfont icon-shebeizhuangtai"></i>
                    &nbsp;&nbsp;液滴状态：<span class="ltype_text">{{ltype}}</span>
                </span>
            </div>

            <!-- 调节流速 -->
            <div class="lop">
                <span>调节流速</span>
                <!-- 调节圆环 -->
                <div class="lop_arc">
                  <div class = "lop_arc_bd">
                    <div class="lop_arc_text">
                    <span>{{lspeed}}</span>
                    <span>滴/m</span>
                    </div>
                    <!-- 速度档位显示 -->
                    <div class="lop_arc_big">
                      <div class="speedone">
                      </div>
                      <div class="speedtwo">
                      </div>
                      <div class="speedthree">
                      </div>
                      <div class="speedfour">
                      </div>
                    </div>
                  </div>
                </div>
                <!-- 调节滑竿与按钮 -->
                 <div class="lop_slip">
                   <div class="lop_slip_bd">
                     <div class="lop_slip_bt1">
                       <span @click="deletespeed()">-</span>
                     </div>
                     <div class="lop_slip_bt2">
                       <span @click="addspeed()">+</span>
                     </div>
                   </div>
                 </div>
            </div>

            <!-- 停止输液 -->
            <div class="lstop">
                <input type="button" 
                @click="stopl()" 
                :disabled= "isdisabled" 
                :class="{dis:isdisabled}"
                value="停止输液">
            </div>
        </div>

       <!-- 输液药品信息 -->
       <div class="liquidmsg">
           <div class="willliquid">
               <span>已输液</span>
               <div class="liquided_l">

               </div>
           </div>
           <div class="liquiding">
               <div class="liquiding_c">
                   <span>正输液</span>
                   <div class="liquiding_c_t">

                   </div>
               </div>

                <div class="liquiding_b">
                    <div class="liquiding_b_l" v-if="liquid_change">
                         输液中
                    </div>
                    <div class="liquiding_b_c" v-else @click="l_change()">
                         换液
                    </div>
                </div>
           </div>
           <div class="liquided">
               <span>未输液</span>
                   <div class="willliquid_l">

                   </div>
           </div>
       </div>
       
   </div>
</template>

<script>
export default {
  data() {
    return {
      pname: "马晕",
      bednum: "",
      lspeed: "",
      ltype: "",
      liquid_change: true, //是否可以应用端操作换液记录
      wliquid_list: [],
      liquiding_list: [],
      liquided_list: [],
      isdisabled: false,
      speednum: 0,
      note:false,
    };
  },
  created() {
    this.bednum = this.$route.query.bednum;
    let bnum = this.bednum;
    let params = {
      bednum: bnum
    };
    let url = this.host + "/patientmsg";
    this.$axios
      .post(url, this.$qs.stringify(params))
      .then(res => {
        console.log(res);
        this.bednum = res.data.bednum;
        this.pname = res.data.patientname;
        this.lspeed = res.data.liquidspeed;
        this.ltype = res.data.liquidtype;
        this.speednum = res.data.gear;
        for(let k = 1;k<=this.speednum;k++){
           let sone = document.getElementsByClassName("speedone")[0];
           sone.parentNode.children[k-1].style.backgroundColor = "#465d91";
        }
        if (res.data.wliquid != "") {
          this.wliquid_list = res.data.wliquid.split(","); //未输液清单，添加至页面上
          console.log(this.wliquid_list);
          this.wl();
        }

        if (res.data.liquiding != "") {
          this.liquiding_list = res.data.liquiding.split(","); //正在输液清单，添加至页面上
          console.log(this.liquiding_list);
          this.ling();
        } else {
          this.liquid_change = true;
          this.isdisabled = true;
        }
        if (res.data.liquided != "") {
          this.liquided_list = res.data.liquided.split(","); //已输液清单，添加至页面上
          console.log(this.liquided_list);
          this.led();
        }
      })
      .catch(function(err) {
        console.log(err);
      });

    //建立websocket连接
    this.initwebsocket();
    this.websock.onopen = this.websocketopen;
    this.websock.onmessage = this.websocketonmessage;
    this.websock.onclose = this.websocketclose;
  },
  updated() {
    // 判断输液状态异常，改变颜色
    let lt = document.getElementsByClassName("ltype_text");
    if (lt[0].innerHTML != "输液正常中") {
      lt[0].style.color = "red";
    }
  },
  destroyed() {
    this.websock.close(); //退出页面时关闭websocket连接
  },
  methods: {
    initwebsocket() {
      const wsuri = this.wshost + "/wspatient";
      this.websock = new WebSocket(wsuri);
    },
    websocketopen() {
      //打开websocket
      console.log("WebSocket连接成功");
      this.websock.send(this.bednum);
    },
    websocketonmessage(data) {
      //数据接收
      console.log(data.data);
      //实时
      let wsdata = data.data;
      let wsdatab = wsdata.substring(3);
      let zero_wsdatab = wsdatab.substr(0, 1);
      if (wsdatab == "threshold" || wsdatab == "empty" || zero_wsdatab == "0") {
        let ws_liquidtype = wsdata.substring(3);
        let lt = document.getElementsByClassName("ltype_text");
        if (ws_liquidtype == "threshold") {
          this.note = true;
          lt[0].innerHTML = "输液临空！";
          lt[0].style.color = "red";
        }
        if (ws_liquidtype == "empty") {
          this.note = true;
          lt[0].innerHTML = "输液已空！";
          lt[0].style.color = "red";
        }
        if (zero_wsdatab == "0") {
          lt[0].innerHTML = "输液堵塞！";
          lt[0].style.color = "red";
          let lstext = document.getElementsByClassName("lspeed")[0].firstChild
            .children[1].children[0];
          lstext.innerHTML = wsdatab;
          let blstext = document.getElementsByClassName("lop_arc_bd")[0]
            .children[0];
          blstext.innerHTML = wsdatab;
        }
      } else {
        let lsd = wsdata.substring(3);
        let lstext = document.getElementsByClassName("lspeed")[0].firstChild
          .children[1].children[0];
        lstext.innerHTML = wsdata.substring(3);
        let blstext = document.getElementsByClassName("lop_arc_text")[0]
          .children[0];
        blstext.innerHTML = wsdata.substring(3);
        if(this.note == false){
          let lttext = document.getElementsByClassName("ltype")[0].firstChild
          .children[1];
        lttext.innerHTML = "输液正常中";
        lttext.style.color = "#465d91";
        }
      }
      // if(wsdata.length == 5){
      //   let lsd = wsdata.substring(3);
      //   let lstext = document.getElementsByClassName("lspeed")[0].firstChild.children[1].children[0];
      //   lstext.innerHTML = wsdata.substring(3);
      //   let blstext = document.getElementsByClassName("lop_arc_bd")[0].children[0];
      //   blstext.innerHTML = wsdata.substring(3);
      // }else{
      //   let ws_liquidtype = wsdata.substring(3);
      //   let lt = document.getElementsByClassName("ltype_text");
      //   if (ws_liquidtype == "threshold") {
      //     lt[0].innerHTML = "输液临空！";
      //     lt[0].style.color = "red";
      //   }
      //   if (ws_liquidtype == "empty") {
      //     lt[0].innerHTML = "输液已空！";
      //     lt[0].style.color = "red";
      // }
      // }
    },
    websocketclose() {
      //关闭
      console.log("WebSocket关闭");
    },
    //添加已输液清单DIV
    led() {
      for (let i = 0; i < this.liquided_list.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = i + 1 + "." + this.liquided_list[i];
        div.style.color = "#465d91";
        div.style.fontSize = "10px";
        div.style.textAlign = "left";
        document.getElementsByClassName("liquided_l")[0].appendChild(div);
      }
    },
    //添加正在输液div
    ling() {
      for (let i = 0; i < this.liquiding_list.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = this.liquiding_list[i];
        div.style.color = "#465d91";
        div.style.fontSize = "15px";
        div.style.textAlign = "left";
        document.getElementsByClassName("liquiding_c_t")[0].appendChild(div);
      }
    },
    //添加未输液DIV
    wl() {
      for (let i = 0; i < this.wliquid_list.length; i++) {
        let div = document.createElement("div");
        div.innerHTML = i + 1 + "." + this.wliquid_list[i];
        div.style.color = "#465d91";
        div.style.fontSize = "10px";
        div.style.textAlign = "left";
        document.getElementsByClassName("willliquid_l")[0].appendChild(div);
      }
    },
    stopl() {
      this.liquid_change = false;
      this.isdisabled = true;
    },

    //点击换液时更新每栏数组，清除原本的内容，再从新数组中读取内容更新
    l_change() {
      this.liquided_list.push(this.liquiding_list[0]);
      document.getElementsByClassName("liquided_l")[0].innerHTML = ""; //清除原本div内的所有内容
      this.led();
      this.websock.send(this.liquided_list);
      if (this.wliquid_list.length != 0) {
        this.liquiding_list.splice(0, 1, this.wliquid_list[0]);
        document.getElementsByClassName("liquiding_c_t")[0].innerHTML = "";
        this.ling();
        this.websock.send(this.liquiding_list);
        this.wliquid_list.splice(0, 1);
        document.getElementsByClassName("willliquid_l")[0].innerHTML = "";
        this.wl();
        this.websock.send(this.wliquid_list);
        this.liquid_change = true; //换液后按钮没停止输液前不可按
        this.isdisabled = false;
      } else {
        this.liquiding_list.splice(0, 1);
        document.getElementsByClassName("liquiding_c_t")[0].innerHTML = "";
        this.ling();
        this.websock.send(this.liquiding_list);
        this.liquid_change = true;
        this.isdisabled = true;
        document.getElementsByClassName(
          "liquiding_b"
        )[0].children[0].innerHTML =
          "已完成输液";
      }
    },
    // 点击“＋”输液速度时
    addspeed() {
      if (this.speednum < 4) {
        this.speednum++;
        console.log(this.speednum);
        switch (this.speednum) {
          case 1:
            let sone = document.getElementsByClassName("speedone")[0];
            sone.style.backgroundColor = "#465d91";
            break;
          case 2:
            let stwo = document.getElementsByClassName("speedtwo")[0];
            stwo.style.backgroundColor = "#465d91";
            break;
          case 3:
            let sthree = document.getElementsByClassName("speedthree")[0];
            sthree.style.backgroundColor = "#465d91";
            break;
          case 4:
            let sfour = document.getElementsByClassName("speedfour")[0];
            sfour.style.backgroundColor = "#465d91";
            break;
        }
        this.websock.send("p"+this.speednum);
      }
    },
    // 点击“－”输液速度时
    deletespeed() {
      if (this.speednum > 0) {
        this.speednum--;
        console.log(this.speednum);
        switch (this.speednum) {
          case 0:
            let sone = document.getElementsByClassName("speedone")[0];
            sone.style.backgroundColor = "gray";
            sone.parentNode.children[1].style.backgroundColor = "gray";
            sone.parentNode.children[2].style.backgroundColor = "gray";
            sone.parentNode.children[3].style.backgroundColor = "gray";
            break;
          case 1:
            let stwo = document.getElementsByClassName("speedtwo")[0];
            stwo.style.backgroundColor = "gray";
            stwo.parentNode.children[0].style.backgroundColor = "#465d91";
            stwo.parentNode.children[2].style.backgroundColor = "gray";
            stwo.parentNode.children[3].style.backgroundColor = "gray";
            break;
          case 2:
            let sthree = document.getElementsByClassName("speedthree")[0];
            sthree.style.backgroundColor = "gray";
            sthree.parentNode.children[0].style.backgroundColor = "#465d91";
            sthree.parentNode.children[1].style.backgroundColor = "#465d91";
            sthree.parentNode.children[3].style.backgroundColor = "gray";
            break;
          case 3:
            let sfour = document.getElementsByClassName("speedfour")[0];
            sfour.style.backgroundColor = "gray";
            sfour.parentNode.children[0].style.backgroundColor = "#465d91";
            sfour.parentNode.children[1].style.backgroundColor = "#465d91";
            sfour.parentNode.children[2].style.backgroundColor = "#465d91";
            break;
        }
        this.websock.send("s"+this.speednum);
      }
    }
  }
};
</script>


<style lang="scss" scoped>
* {
  margin: 0;
  padding: 0;
  font-size: 30px;
  color: white;
}
.all {
  width: 100vw;
  height: 100vh;
  background-color: #465d91;
  position: relative;
  .initmsg {
    width: 94vw;
    height: 20vh;
    background-color: white;
    margin: auto;
    border-radius: 20px;
    position: relative;
    top: 1vh;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .patientname {
      display: flex;
      align-items: center;
      i {
        color: #465d91;
        font-size: 75px;
      }
      span {
        color: #465d91;
        font-size: 50px;
      }
    }
    .bednum {
      width: 30vw;
      height: 5vh;
      background-color: #465d91;
      border: none;
      z-index: 10;
      border-top-left-radius: 20px;
      border-bottom-left-radius: 20px;
      border-right: 1px solid white;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  .liquidop {
    width: 94vw;
    height: 56vh;
    background-color: white;
    margin: auto;
    margin-top: 1vh;
    border-radius: 20px;
    position: relative;
    top: 1vh;
    div {
      width: 90%;
      margin: auto;
      height: 15%;
      border-bottom: 1px solid #465d91;
      display: flex;
      align-items: center;
      span {
        color: #465d91;
        display: flex;
        align-items: center;
        i {
          color: #465d91;
          font-size: 50px;
        }
      }
    }
    .lop {
      height: 55%;
      display: flex;
      justify-content: center;
      // align-items: center;
      flex-wrap: wrap;
      div {
        width: 100%;
        margin: 0;
      }
      .lop_arc {
        height: 60%;
        border: none;
        display: block;
        &_bd {
          height: 18vh;
          width: 18vh;
          border-radius: 10vh;
          margin: auto;
          border: 10px solid #465d91;
          color: #465d91;
          font-size: 50px;
          display: block;
          // span{
          //   display: inline-block;
          //   width: 50%;
          //   font-size:50px;
          //   margin: auto;
          // }
          .lop_arc_text {
            width: 100%;
            height: 50%;
            border: none;
            display: flex;
            align-items: flex-end;
            span {
              display: inline-block;
              width: 50%;
              font-size: 50px;
            }
          }
          .lop_arc_big {
            width: 100%;
            height: 50%;
            border: none;
            display: flex;
            justify-content: center;
            align-items: baseline;
            .speedone,
            .speedtwo,
            .speedthree,
            .speedfour {
              border: none;
            }
            .speedone {
              width: 8%;
              height: 20%;
              background-color: gray;
            }
            .speedtwo {
              width: 8%;
              height: 30%;
              background-color: gray;
              margin-left: 5%;
            }
            .speedthree {
              width: 8%;
              height: 40%;
              background-color: gray;
              margin-left: 5%;
            }
            .speedfour {
              width: 8%;
              height: 50%;
              background-color: gray;
              margin-left: 5%;
            }
          }
        }
      }
      .lop_slip {
        height: 20%;
        border: none;
        &_bd {
          width: 18vh;
          height: 100%;
          margin: auto;
          display: flex;
          justify-content: space-between;
          border: none;
          div {
            width: 5vh;
            height: 50%;
            background-color: #465d91;
            border: none;
            display: flex;
            justify-content: center;
            align-items: center;
            span {
              color: white;
              font-size: 50px;
            }
          }
        }
      }
    }
    .lstop {
      input {
        margin: auto;
        background-color: #465d91;
        width: 30vw;
        height: 60%;
        border-radius: 30px;
      }
      .dis {
        margin: auto;
        background-color: gray;
        width: 30vw;
        height: 60%;
        border-radius: 30px;
      }
    }
  }
  .liquidmsg {
    width: 94vw;
    height: 20vh;
    background-color: white;
    margin: auto;
    margin-top: 1vh;
    margin-bottom: 1vh;
    border-radius: 20px;
    position: relative;
    top: 1vh;
    .willliquid {
      width: 50%;
      height: 30%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: #465d91;
        width: 30%;
      }
      div {
        width: 70%;
        height: 95%;
        border: 1px solid gray;
        overflow: scroll;
      }
    }
    .liquiding {
      width: 100%;
      height: 40%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .liquiding_c {
        width: 50%;
        height: 100%;
        //  border :1px solid black;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
          color: #465d91;
          width: 30%;
        }
        .liquiding_c_t {
          width: 70%;
          height: 95%;
          border: 1px solid gray;
          overflow: scroll;
          display: flex;
          align-items: center;
        }
      }
      .liquiding_b {
        width: 50%;
        height: 100%;
        display: flex;
        align-items: center;
        //  border :1px solid black;
        .liquiding_b_l {
          width: 70%;
          height: 65%;
          background-color: gray;
          margin: auto;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .liquiding_b_c {
          width: 70%;
          height: 65%;
          background-color: #465d91;
          margin: auto;
          border-radius: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
    .liquided {
      width: 50%;
      height: 30%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      span {
        color: #465d91;
        width: 30%;
      }
      div {
        width: 70%;
        height: 95%;
        border: 1px solid gray;
        overflow: scroll;
      }
    }
  }
}
</style>