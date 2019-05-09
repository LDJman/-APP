<template>
  <div class="main_all">
    <!-- 病人家属信息填写认证 -->
    <div class="pmsg">
      <div class="pmsg_title">请输入亲属信息</div>
      <div class="pmsg_hospital inputtext">
        <span>医院：</span>
        <input type="text" placeholder="请输入所在医院全称">
      </div>
      <div class="pmsg_pname inputtext">
        <span>姓名：</span>
        <input type="text" placeholder="请输入输液亲属姓名">
      </div>
      <div class="pmsg_bednum inputtext">
        <span>床号：</span>
        <input type="text" placeholder="请输入输液亲属床号">
      </div>
      <div class="pmsg_button">
        <input class="login_button" type="button" value="确定" @click="confirm()">
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
    return {};
  },
  methods: {
    tousermsg() {
      this.$router.push("/usermsg");
    },
    confirm() {
      var hospital = document.getElementsByClassName("pmsg_hospital")[0].children[1].value;
      var pname = document.getElementsByClassName("pmsg_pname")[0].children[1].value;
      var bednum = document.getElementsByClassName("pmsg_bednum")[0].children[1].value;
      console.log(hospital + "," + pname + "," + bednum);
      if(hospital =="" || pname == "" || bednum == ""){
        if(hospital == ""){
          alert("请输入医院全称")
        }
        if(pname == ""){
          alert("请输入病人姓名")
        }
        if(bednum == ""){
          alert("请输入病人床号")
        }
      }else{
        let params = {
            //请求的参数
            hospital: hospital,
            pname: pname,
            bednum:bednum
          };
          let url = this.host + "/relativeLine"; 
          this.$axios
            .post(url, this.$qs.stringify(params))
            .then(res => {
              console.log(res);
              var that = this;
              if(res.data.msg == "success"){
                setTimeout(function(){
                  console.log("hahaha");
                  that.$router.push({path:"/relativepmsg",query: { bednum: bednum }});
                },1000)           
              }
            })
            .catch(function(error) {
              console.log("error");
            });
      }
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
  .pmsg {
    width: 80%;
    height: 50%;
    // background-color: rgb(206, 22, 160);
    border: 10px solid #394253;
    border-radius: 20px;
    margin: 40% auto 25% auto;
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
    div {
      width: 100%;
      height: 10%;
      font-size: 50px;
    }
    .inputtext {
      width: 100%;
      height: 20%;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      font-size: 30px;
      span {
        width: 20%;
      }
      input {
        width: 70%;
        height: 50%;
        color: #394253;
      }
    }
    .pmsg_button {
      input {
        width: 50%;
        height: 80%;
        border-radius: 30px;
        background: #394253;
        font-size: 30px;
        border: none;
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