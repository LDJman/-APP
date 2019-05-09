<template>
    <div>
        <!-- 图标 -->
        <div class="v-bg">
            <img src="../../assets/Version/version-bg.jpg">
        </div>
        <!-- 版本号展示 -->
        <div class="v-num">
           <span> 版本号：{{nowvnum}}</span>
        </div>

        <!-- 弹窗 -->
        <div class="v-pop" v-if="versionshow">
            <!-- 更新选项窗口 -->
            <div class="v-pop-text">
                <div class="updatetext"><span>{{updatetext}}</span></div>
                <div class="v-pop-choice">
                    <span @click="cancel()">取消</span>
                    <span @click="updateversion()">确定</span>
                </div>

            </div>

        </div>

    </div>
</template>

<script>
// import axios from '../../api/axios.js'
export default {
  data() {
    return {
      nowvnum: "1.0", //现版本号
      newvnum: "",
      // newvnum:20181025,
      versionshow: false, //更新弹窗是否展示
      updatetext: "有新的版本哦，快更新吧！" //弹窗文字
    };
  },
  created() {
    this.data_dpr = window.devicePixelRatio; //获取设备的dpr
  },
  mounted() {
    //测试AXIOS是否可行的本机数据测试
    // this.$axios
    //   .post("/api/teacher", {})
    //   .then(res => {
    //     console.log(res.data);
    //     this.newvnum = res.data.data[1].number;
    //     setTimeout(() => {
    //       if (this.newvnum > this.nowvnum) {
    //         //有新版本则停顿一秒后弹出更新窗口
    //         this.versionshow = true;
    //       } else {
    //         if (localStorage.getItem("key")) {
    //           console.log("跳转到开始页面");
    //           this.$router.push("/HelloWorld");
    //         } else {
    //           console.log("跳转到登录页面");
    //           this.$router.push("/login");
    //         }
    //       }
    //     }, 1000);
    //   })
    //   .catch(function(error) {
    //     console.log("error");
    //   });
      //请求最新版本号
      let reqnowvnum = this.nowvnum
      let params = {
       reqnowvnum:reqnowvnum,
      }
      let url = this.host+"/version"
      this.$axios.post(url,this.$qs.stringify(params))
      .then(res => {
        console.log(res);
        this.newvnum = res.data.newvnum;
        console.log(res.data.newvnum)
        setTimeout(() => {
          if (this.newvnum > this.nowvnum) {
            //有新版本则停顿一秒后弹出更新窗口
            this.versionshow = true;
          } else {
            if (localStorage.getItem("key")) {
              console.log("跳转到开始页面");
              this.$router.push("/HelloWorld");
            } else {
              console.log("跳转到登录页面");
              this.$router.push("/login");
            }
          }
        }, 1000);
      })
      .catch(function(error) {
        console.log("error");
      });
  },
  methods: {
    // 取消下载新版本，弹窗关闭
    cancel() {
      this.versionshow = false;
      setTimeout(() => {
        if (localStorage.getItem("key")) {
          console.log("跳转到开始页面");
          this.$router.push("/HelloWorld");
        } else {
          console.log("跳转到登录页面");
          this.$router.push("/login");
        }
      }, 1000);
    },

    // 去下载新的版本
    updateversion() {
      window.location.href = "http://home.sise.cn";
    }
  }
};
</script>

<style scoped lang="scss">
* {
  margin: 0;
  padding: 0;
  font-size: 25px;
}
img {
  width: 750px;
  height: 587px;
}
.v-bg {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
.v-num {
  position: fixed;
  bottom: 50px;
  width: 750px;
  color: #b9bdc0;
  font-size: 25px;
}
.v-pop {
  position: fixed;
  top: 0;
  width: 750px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.v-pop-text {
  width: 500px;
  height: 20vh;
  background-color: white;
  position: relative;
  border-radius: 20px;
  .updatetext {
    height: calc(20vh-75px);
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 30px;
    }
  }
  .v-pop-choice {
    position: absolute;
    bottom: 0;
    width: 500px;
    border-top: black solid 1px;
    span {
      float: left;
      width: 248px;
      height: 75px;
      line-height: 75px;
    }
    :first-child {
      // width: 248px;
      border-right: black solid 1px;
    }
  }
}
</style>