<template>
     <div class="login_all">
         <!-- 背景图片 -->
        <img src="../../assets/login/login_bg.jpg">

         <!-- 阴影黑框 -->
        <div class="login_balck_bg">
        </div>

        <!-- 表单部分 -->
        <div class="login_input">
            <div class="login_input_all">
                <div class="login_input_count">
                    <i class="iconfont icon-iconzh1"></i>
                    <input type="text" placeholder="请输入手机号码"
                    v-model="username"/>
                </div>
                <div class="login_input_psw">
                    <i class="iconfont icon-ai-password"></i>
                    <input type="password" placeholder="请输入密码"
                    v-model="psw"> 
                </div>                            
                <span @click="forgetpwd()">忘记密码</span>
                <div class="input_error" v-show="input_err">
                    <span>!</span>
                    {{input_error}}
                </div>
                <input class="login_button" type="button" value="登录"
                @click="login()">
            </div>
        </div>

        <!-- 注册部分 -->
        <div class="login_register">
            <div class="register_all">
                <div class="register_text" @click="register()">注册</div>
            </div>
        </div>
     </div>


    
</template>

<script>
export default {
  data() {
    return {
      username: "", //用户名
      psw: "", //密码
      input_error: "", //输入错误提示信息
      input_err: false //是否显示输入错误提示信息
    };
  },
  computed: {
    input_tel_r: function() {
      //验证手机号码格式是否正确
      return /^1(3|4|5|7|8)\d{9}$/.test(this.username);
    }
  },
  methods: {
    // 点击登陆
    login() {
      //账号及密码不为空进行下一步处理
      if (this.username != "" && this.psw != "") {
        if (this.input_tel_r == true) {
          //手机号码格式正确才进行请求
          this.input_err = false;
          console.log(this.username);
          console.log(this.psw);
          let params = {
            //请求的参数
            username: this.username,
            password: this.psw
          };
          let url = this.host + "/login"; 
          this.$axios
            .post(url, this.$qs.stringify(params))
            .then(res => {
              console.log(res.data);
              if (res.data.msg == "医护账号登录成功") {
                let type = "nurse";
                localStorage.setItem("count",this.username);
                localStorage.setItem("type",type);
                this.$router.push("./nursemain");
              } 
              if(res.data.msg == "亲属账号登录成功") {
                let type = "relative";
                localStorage.setItem("count",this.username);
                localStorage.setItem("type",type);
                this.$router.push("./relativemain");
              }else {
                this.input_error = res.data.msg;
                this.input_err = true;
              }
            })
            .catch(function(error) {
              console.log("error");
            });
        } else {
          this.input_error = "请输入11位正确的手机号码";
          this.input_err = true;
        }
      } else {
        //判断是手机号码为空或密码为空并提示
        if (this.username == "" && this.psw != "") {
          this.input_error = "请输入账号";
          this.input_err = true;
        }
        if (this.psw == "" && this.username != "") {
          this.input_error = "请输入密码";
          this.input_err = true;
        }
        if (this.username == "" && this.psw == "") {
          this.input_error = "请输入账号及密码";
          this.input_err = true;
        }
      }
    },

    // 忘记密码
    forgetpwd() {
      this.$router.push("/forgetpsw");
    },

    // 注册
    register() {
      this.$router.push("/registe");
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
.login_all {
  img {
    width: 750px;
    height: 1334px;
    display: block;
  }
  .login_balck_bg {
    width: 750px;
    height: 1334px;
    background: rgba(0, 0, 0, 0.7);
    position: fixed;
    top: 0;
  }
  .login_input {
    width: 750px;
    height: 1334px;
    position: fixed;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    .login_input_all {
      text-align: right;
      position: relative;
      .login_input_count,
      .login_input_psw {
        display: flex;
        align-items: center;
        text-align: left;
        width: 500px;
        height: 80px;
        border-radius: 10px;
        margin-bottom: 30px;
        background: rgba(0, 0, 0, 0.4);
        i {
          font-size: 40px;
          color: #465d91;
          margin-left: 20px;
          margin-right: 10px;
        }
        input {
          background: none;
          width: 430px;
          height: 80px;
          border: none;
          outline: none;
        }
      }
      // span{
      //     color:#b9bdc0;
      // }
      .input_error {
        text-align: left;
        position: absolute;
        top: 200px;
        color: red;
        span {
          color: red;
        }
      }
      .login_button {
        border: none;
        display: block;
        margin: auto;
        margin-top: 30px;
        width: 400px;
        height: 80px;
        border-radius: 40px;
        background: #465d91;
        font-size: 30px;
        outline: none;
      }
    }
  }
  .login_register {
    width: 100vw;
    position: fixed;
    bottom: 0;
    .register_all {
      width: 600px;
      height: 80px;
      margin: auto;
      border-top: 1px solid white;
      display: flex;
      justify-content: center;
      align-items: center;
      .register_text {
        font-size: 30px;
      }
    }
  }
}
</style>
