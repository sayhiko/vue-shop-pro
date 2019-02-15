<template>
  <div id="login-container">
    <div id="login-box">
      <div id="logo-box">
        <img src="../assets/img/logo.png" alt>
      </div>
      <el-form :rules="rules" ref="loginFormRef" :model="loginForm">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username">
            <i slot="prefix" class="iconfont icon-user"></i>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password">
            <i slot="prefix" class="iconfont icon-3702mima"></i>
          </el-input>
        </el-form-item>
        <el-row>
          <el-col :offset="15">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="reset">重置</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 登录表单需要的数据对象
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        // required非空验证  message错误信息提醒 trigger失去焦点触发校验
        username: [
          { required: true, message: '请输入用户名称', trigger: 'blur' }
        ],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      }
    }
  },

  methods: {
    login() {
      // 登录校验
      this.$refs.loginFormRef.validate(async valid => {
        if (valid === true) {
          // 用戶信息真實性校驗
          // axios带着用户信息去后端数据库校验
          const { data: res } = await this.$http.post('/login', this.loginForm)
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error('用户名或密码不正确')
          }
          // 通过浏览器的sessionStorage记录服务器返回的token信息
          window.sessionStorage.setItem('token', res.data.token)
          // 页面重定向到首页面
          this.$router.push('/home')
        }
      })
    },
    reset() {
      this.$refs.loginFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
#login-container {
  background-color: #2b4b6b;
  height: 100%;
  overflow: hidden;
  #login-box {
    width: 450px;
    height: 304px;
    background-color: #fff;
    border-radius: 4px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .el-form {
      position: absolute;
      width: 100%;
      bottom: 0;
      padding: 20px;
      box-sizing: border-box;
    }
    #logo-box {
      width: 130px;
      height: 130px;
      left: 50%;
      transform: translate(-50%, -50%);
      border: 1px soild #eee;
      box-shadow: 0 0 10px #eee;
      padding: 8px;
      position: absolute;
      border-radius: 50%;
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
  }
}
</style>
