<template>
  <el-container>
    <el-header>
      <div id="logo-box">
        <img src="../assets/img/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="menushow?'65px':'200px'">
        <div
          style="background-color:rgb(74,80,100);height:25px;
        line-height:25px;text-align:center;color:#fff;letter-spacing:0.1em;font-size:12px;user-select:none;cursor:pointer;"
          @click="menushow=!menushow"
        >|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opend="true"
          :collapse="menushow"
          :router="true"
          :collapse-transition="false"
        >
          <el-submenu :index="item.id+''" v-for="(item,k) in menulist" :key="item.id"
          :style="menushow?'width:65px':'width:200px'">
            <template slot="title">
              <i :class="'iconfont icon-'+ menuicon[k]"></i>
              <span>{{item.authName}}</span>
            </template>
            <el-menu-item :index="item2.path" v-for="item2 in item.children" :key="item2.id">
              <i class="el-icon-menu"></i>
              <span>{{item2.authName}}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <!-- 设置第三组件的路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getMenuList()
  },
  data() {
    return {
      // 左侧按钮导航是否显示
      menushow: false,
      // 接收的后端返回的 左侧显示的权限信息
      menulist: [],
      // 设置左侧权限图标
      menuicon: ['users', 'tijikongjian', 'shangpin', 'danju', 'baobiao']
    }
  },
  methods: {
    // 获取用于显示的左侧列表权限信息
    async getMenuList() {
      const { data: res } = await this.$http.get('/menus')
      // 获取失败处理
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 把权限数据赋值给menulist
      this.menulist = res.data
    },
    // 退出系统
    logout() {
      // 确认退出 删除token 页面跳转到登录页
      this.$confirm('确定要退出系统么?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          window.sessionStorage.removeItem('token')
          this.$router.push('/login')
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.el-container {
  height: 100%;
  .el-header {
    background-color: #373d41;
    padding-right: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    #logo-box {
      user-select: none;
      font-size: 22px;
      color: #fff;
      display: flex;
      align-items: center;
    }
    img {
      width: 50px;
      height: 50px;
      margin-right: 10px;
    }
  }
  .el-aside {
    background-color: #333744;
  }
  .el-main {
    background-color: #eaedf1;
  }
}
</style>
