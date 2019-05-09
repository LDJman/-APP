<template>
    <div class="main_all">
        <div class="data">
          <div class="userName">
            <span>账号:</span>
            <span>{{count}}</span>
          </div>
          <div class="mdPsw">
            <span @click="tomodify()">修改密码</span>
          </div>
          <div class="out">
            <span @click="tologin()">{{loginout}}</span>
          </div>
        </div>
        <!-- 底部菜单栏 -->
        <div class="foot">
            <div class="main" @click="tonursemain()">
                <i class="iconfont icon-dianpu"></i>
            </div>
            <div class="usermsg" >
                <i class="iconfont icon-icon"></i>
            </div>
        </div>
    </div>

</template>

<script>
export default {
  data(){
    return{
      count:"",
      loginout:"退出登录"
    };
  },
   created(){
      this.count =localStorage.getItem("count");
    },
  methods:{
    tonursemain(){
      let type = localStorage.getItem("type");
      if(type == "nurse"){
        this.$router.push("/nursemain");
      }else{
        this.$router.push("/relativemain");
      }     
    },
    tomodify(){
        this.$router.push("/password");
    },
    tologin(){
      this.loginout = "退出登录中……";
      var that = this;
      setTimeout(function(){
      localStorage.setItem("count","");
      localStorage.setItem("type","");
      that.$router.push("/login");
      },1000);
    },
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
  .data{
    width:100%;
    height: 25%;
    // background-color: aquamarine;
    padding-top: 15%;
    display: flex;
    flex-wrap:wrap;
    align-content: space-between;
    .userName{
      width:100%;
      height: 40%;
      background-color: #304c8d;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span{
        font-size:6vw;
        margin-left: 2vw;
      }
    }
    .mdPsw{
      width:100%;
      height: 25%;
      background-color: #304c8d;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      span{
      margin-left: 2vw;
      }
    }
    .out{
      width:100%;
      height: 25%;
      background-color: #304c8d;
      display: flex;
      justify-content: center;
      align-items: center;
      span{
        font-size:4vw;
      }
    }
  }
  .foot {
    z-index: 99;
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
      .icon-icon {
        color: #465d91;
      }
    }
    .usermsg {
      height: 90%;
      border-bottom: 10px solid #465d91;
    }
  }
}
</style>