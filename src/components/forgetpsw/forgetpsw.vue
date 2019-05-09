<template>
  <div class="main_all">
    <div class="title">
      <i class="iconfont icon-54" @click="tologin()"></i>
      <span>忘记密码</span>
    </div>

    <div class="psd_all">
      <div class="pnum">
        <span>手机号码：</span>
        <input type="text" placeholder="请输入手机号码">
      </div>
      <div class="psw">
        <span>新密码：</span>
        <input type="text" placeholder="请输入新的密码">
      </div>
      <div class="code">
        <span>验证码：</span>
        <input type="text" placeholder="请输入验证码">
        <div class="getcode" @click="getcode()">{{tip}}{{times}}</div>
      </div>
    </div>

    <div class="confirm" @click="confirm()">
      <span>{{text}}</span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: "", //用户名
      text: "确认",
      tip: "获取验证码",
      times: "",
      codetype: true
    };
  },
  created() {
    this.count = localStorage.getItem("count");
  },
  computed: {
    input_tel_r: function() {
      //验证手机号码格式是否正确
      return /^1(3|4|5|7|8)\d{9}$/.test(this.username);
    }
  },
  methods: {
    tologin() {
      this.$router.push("/login");
    },
    confirm() {
      this.username = document.getElementsByClassName(
        "pnum"
      )[0].children[1].value;
      var newpsw = document.getElementsByClassName("psw")[0].children[1].value;
      var Vcode = document.getElementsByClassName("code")[0].children[1].value;
      console.log(this.username + "," + newpsw + "," + Vcode);
      if (this.input_tel_r == true && newpsw != "" && Vcode != "") {
        let params = {
          username: this.username,
          newpsw: newpsw,
          code: Vcode
        };
        var that = this;
        let url = this.host + "/forgetpsw";
        this.$axios
          .post(url, this.$qs.stringify(params))
          .then(res => {
            console.log(res);
            if(res.data.msg == "success"){
              this.text = "重置成功！"
                  setTimeout(function(){
                      that.$router.push("/login");
                  },1000)
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      } else {
        if (this.input_tel_r == false) {
          alert("请输入正确的手机号码格式");
        }
        if (newpsw == "") {
          alert("请输入新的密码");
        }
        if (Vcode == "") {
          alert("请输入输入验证码");
        }
      }
    },
    getcode() {
      if (this.codetype == true) {
        var i = 60;
        var that = this;
        var gcodetext = document.getElementsByClassName("getcode")[0];
        gcodetext.style.backgroundColor = "#a9a9a9";
        this.codetype == false;
        var time = setInterval(function() {
          i--;
          that.tip = "还剩";
          that.times = i + "秒";
          if (i == 0) {
            gcodetext.style.backgroundColor = "#394253";
            that.tip = "获取验证码";
            that.times = "";
            clearInterval(time);
            that.codetype == true;
          }
        }, 1000);
        this.username = document.getElementsByClassName(
        "pnum"
      )[0].children[1].value;
        let params = {
          username: this.username,
        };
        let url = this.host + "/getcode";
        this.$axios
          .post(url, this.$qs.stringify(params))
          .then(res => {
            console.log(res);
          })
          .catch(function(error) {
            console.log(error);
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
  .title {
    width: 100%;
    height: 7%;
    //   background-color: aquamarine;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    i {
      position: absolute;
      top: 20%;
      left: 2%;
      font-size: 8vw;
    }
    span {
      font-size: 6vw;
    }
  }
  .psd_all {
    width: 100%;
    height: 20%;
    background-color: #304c8d;
    .pnum,
    .psw {
      width: 95%;
      margin-left: 5%;
      height: 33%;
      border-bottom: 1px solid #394253;
      display: flex;
      flex: nowrap;
      justify-content: space-between;
      align-items: center;
      span {
        width: 25%;
        font-size: 4vw;
        text-align: left;
      }
      input {
        width: 73%;
        height: 90%;
        border: none;
        background-color: #304c8d;
      }
      input:-ms-input-placeholder {
        color: #a9a9a9;
      } /* Internet Explorer 10+ */
      input::-webkit-input-placeholder {
        color: #a9a9a9;
      } /* WebKit browsers */
      input::-moz-placeholder {
        color: #a9a9a9;
      } /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #a9a9a9;
      } /* Mozilla Firefox 19+ */
    }
    .code {
      width: 95%;
      margin-left: 5%;
      height: 33%;
      border-bottom: 1px solid #394253;
      display: flex;
      flex: nowrap;
      justify-content: space-between;
      align-items: center;
      span {
        width: 25%;
        font-size: 4vw;
        text-align: left;
      }
      input {
        width: 50%;
        height: 90%;
        border: none;
        background-color: #304c8d;
      }
      input:-ms-input-placeholder {
        color: #a9a9a9;
      } /* Internet Explorer 10+ */
      input::-webkit-input-placeholder {
        color: #a9a9a9;
      } /* WebKit browsers */
      input::-moz-placeholder {
        color: #a9a9a9;
      } /* Mozilla Firefox 4 to 18 */
      input:-moz-placeholder {
        color: #a9a9a9;
      } /* Mozilla Firefox 19+ */
      .getcode {
        width: 20%;
        height: 80%;
        background-color: #394253;
        margin-right: 10px;
        border-radius: 10%;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }
  }
  .confirm {
    margin: 10% auto 0 auto;
    width: 30%;
    height: 5%;
    background-color: #394253;
    border-radius: 5%;
    display: flex;
    justify-content: center;
    align-items: center;
    span {
      font-size: 30px;
    }
  }
}
</style>