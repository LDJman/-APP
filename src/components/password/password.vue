<template>
  <div class="main_all">
    <div class="title">
      <i class="iconfont icon-54" @click="tousermsg()"></i>
      <span>密码更改</span>
    </div>

    <div class="psd_all">
      <div class="old_psw">
        <span>旧密码：</span>
        <input type="password" placeholder="请输入旧密码">
      </div>
      <div class="new_psw">
        <span>新密码：</span>
        <input type="password" placeholder="请输入新的密码">
      </div>
      <div class="c_psw">
        <span>确认密码：</span>
        <input type="password" placeholder="请再次输入新密码">
      </div>
    </div>

    <div class="confirm" @click="confirm()">
      <span>{{text}}</span>
    </div>
    <!-- 底部菜单栏 -->
    <div class="foot">
      <div class="main" @click="tonursemain()">
        <i class="iconfont icon-dianpu"></i>
      </div>
      <div class="usermsg">
        <i class="iconfont icon-icon"></i>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      count: "",
      text:"确认",
    };
  },
  created() {
    this.count = localStorage.getItem("count");
  },
  methods: {
    tonursemain() {
      let type = localStorage.getItem("type");
      if (type == "nurse") {
        this.$router.push("/nursemain");
      } else {
        this.$router.push("/relativemain");
      }
    },
    tousermsg() {
      this.$router.push("/usermsg");
    },
    confirm() {
      var oldpsw = document.getElementsByClassName("old_psw")[0].children[1]
        .value;
      var newpsw = document.getElementsByClassName("new_psw")[0].children[1]
        .value;
      var agnewpsw = document.getElementsByClassName("c_psw")[0].children[1]
        .value;
      console.log(oldpsw + newpsw + agnewpsw);
      if (oldpsw == "" || newpsw == "" || agnewpsw == "") {
        alert("请填写完整的密码选项");
      } else {
        if (newpsw == agnewpsw) {
          let params = {
            oldpsw: oldpsw,
            newpsw: newpsw,
            count:this.count
          };
          let url = this.host + "/modifypsw";
          this.$axios
            .post(url, this.$qs.stringify(params))
            .then(res => {
              console.log(res);
              var that = this;
              if(res.data.msg == "success"){
                  this.text = "修改成功！"
                  setTimeout(function(){
                      that.$router.push("/login");
                  },1000)
              }
            })
            .catch(function(error) {
              console.log(error);
            });
        }else{
            alert("两次填写新密码请保持一致")
        }
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
    div {
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
        width: 70%;
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