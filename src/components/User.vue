<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getUserInfos"
            @keyup.enter.native="getUserInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getUserInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="addDialogVisible=true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示数据列表 -->
      <el-table :data="userInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="mobile" label="手机号" width="180"></el-table-column>
        <el-table-column prop="role_name" label="角色" width="200"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="190"></el-table-column>
        <el-table-column prop="mg_state" label="状态" width="120">
          <el-switch
            v-model="info.row.mg_state"
            slot-scope="info"
            @change="changeState(info.row.id,info.row.mg_state)"
          ></el-switch>
        </el-table-column>
        <el-table-column label="操作" width="260">
          <template slot-scope="info">
            <el-tooltip content="编辑" placement="top" :enterable="false">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                @click="showEditDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top" :enterable="false">
              <el-button
                type="danger"
                icon="el-icon-delete"
                size="mini"
                @click="delUser(info.row.id)"
              ></el-button>
            </el-tooltip>
            <el-tooltip content="分配角色" placement="top" :enterable="false">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showFenpeiDialog(info.row.id)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 数据分页展示 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 7, 9]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!-- 添加用户对话框 -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 用户修改对话框 -->
      <el-dialog
        title="修改用户"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          @close="editDialogClose"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="editForm.username"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUser">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配角色对话框 -->
      <el-dialog
        title="分配角色"
        :visible.sync="fenpeiDialogVisible"
        width="50%"
        @close="fenpeiDialogClose"
      >
        <el-form
          ref="fenpeiFormRef"
          :model="fenpeiForm"
          :rules="fenpeiFormRules"
          @close="fenpeiDialogClose"
          label-width="120px"
        >
          <el-form-item label="当前用户:" prop="username">{{fenpeiForm.username}}</el-form-item>
          <el-form-item label="分配的角色:" prop="rid">
            <el-select v-model="fenpeiForm.rid" placeholder="请选择">
              <el-option
                v-for="item in roleInfos"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="fenpeiDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="fenpeiUser">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getUserInfos()
  },
  data() {
    // 给手机号验证封装一个函数
    var checkMobile = (rule, value, callback) => {
      if (!/^1[35789]\d{9}$/.test(value)) {
        // 校验失败做出提示
        return callback(new Error('手机号码格式不正确'))
      }
      // 校验成功继续执行
      callback()
    }
    return {
      // 用户数据
      userInfos: [],
      // 给获取用户数据设置查询条件
      querycdt: {
        // 查询关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 3,
        // 总记录条数
        tot: 0
      },

      // 添加用户相关开始
      // 控制用户对话框默认不显示
      addDialogVisible: false,
      // 添加form表单需要的数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 制作表单域验证规则
      addFormRules: {
        username: [{ required: true, message: '用户名必填', trigger: 'blur' }],
        password: [{ required: true, message: '密码必填', trigger: 'blur' }],
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          // {validator:校验函数}
          { validator: checkMobile, trigger: 'change' }
        ]
      },
      // 添加用户相关结束
      // 修改用户相关
      editDialogVisible: false,
      // 编辑表单需要的数据
      editForm: {
        username: '',
        email: '',
        mobile: ''
      },
      // 表单校验
      editFormRules: {
        mobile: [
          { required: true, message: '手机号必填', trigger: 'blur' },
          // 自定义校验手机号码规则
          // {validator:校验函数}
          { validator: checkMobile, trigger: 'change' }
        ]
      },
      // 分配角色相关
      fenpeiDialogVisible: false,
      // 接收供选择的角色信息
      roleInfos: [],
      // 分配角色表单需要的数据
      fenpeiForm: {
        username: '',
        // 当前被修改用户的id
        id: 0,
        // 角色id
        rid: 0
      },
      // 表单校验
      fenpeiFormRules: {
        rid: [{ required: true, message: '角色必选', trigger: 'change' }]
      }
    }
  },
  methods: {
    // 获取用户显示的真实数据
    async getUserInfos() {
      const { data: res } = await this.$http.get('/users', {
        params: this.querycdt
      })
      console.log(res)
      // 判断接收数据失败
      if (res.meta.status !== 200) {
        return res.$message.error(res.meta.msg)
      }
      // 把获取到的用户数据信息赋值给userInfos
      this.userInfos = res.data.users
      // 记录总条数
      this.querycdt.tot = res.data.total
    },
    // 数据分页相关
    handleSizeChange(arg) {
      // 记录显示条数变化的回调函数
      // arg变化后的每页显示条数
      console.log(arg)
      this.querycdt.pagesize = arg
      // 重新获取数据
      this.getUserInfos()
    },
    // 当前页码变化的回调函数
    handleCurrentChange(arg) {
      // arg变化后的当前页码数
      console.log(arg)
      this.querycdt.pagenum = arg
      this.getUserInfos()
    },
    // 修改用户状态
    async changeState(uid, state) {
      const { data: res } = await this.$http.put(
        'users/' + uid + '/state/' + state
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 提示修改成功信息
      this.$message.success(res.meta.msg)
    },

    /**  添加用户相关  */
    // 手机数据存储入库(执行后端api数据接口) 先校验表单validate
    addUser() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          // 校验成功
          const { data: res } = await this.$http.post('users', this.addForm)
          // 判断获取数据失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 添加成功 关闭对话框,刷新列表,成功提示
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 对话框关闭回调 重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 添加用户相关结束

    // 删除用户 串参数用户id
    delUser(id) {
      this.$confirm('确定要删除此用户么?', '删除用户', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('users/' + id)
          // 判断删除失败
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功 刷新数据 提示成功
          this.$message.success(res.meta.msg)
          // 判断当前页码只有一条数据且已经被删除,也不是首页,就让页码减一返回上一页
          if (this.userInfos.length === 1 && this.querycbt.pagenum > 1) {
            this.querycbt.pagenum--
          }
          this.getUserInfos()
        })
        .catch(() => {})
    },
    // 修改用户 收集用户信息存储
    editUser() {
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.editForm.id,
            this.editForm
          )
          // 获取数据失败
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 修改成功,关闭框,刷新列表,提示消息
          this.$message.success(res.meta.msg)
          this.editDialogVisible = false
          this.getUserInfos()
        }
      })
    },
    // 显示修改用户的对话框
    async showEditDialog(id) {
      // 显示对话框
      this.editDialogVisible = true
      // 根据id获取要修改用户的信息
      const { data: res } = await this.$http.get('users/' + id)
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 把获得到的用户信息赋予给editForm表单数据对象
      this.editForm = res.data
    },
    // 重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 分配角色相关
    // 显示分配角色的对话框
    async showFenpeiDialog(id) {
      // 显示对话框
      this.fenpeiDialogVisible = true
      // 根据id获取当前分配角色的用户信息
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取成功,赋值给fenpeiForm
      this.fenpeiForm = res.data
      // 设置rid
      if (this.fenpeiForm.rid === 0) {
        this.fenpeiForm.rid = ''
      }
      // 获取供选择的角色信息
      const { data: res2 } = await this.$http.get('roles')
      if (res2.meta.status !== 200) {
        return this.$message.error(res2.data.msg)
      }
      // 赋值给roleInfos
      this.roleInfos = res2.data
    },
    // 分配角色提交
    fenpeiUser() {
      this.$refs.fenpeiFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'users/' + this.fenpeiForm.id + '/role',
            this.fenpeiForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 提交成功 刷新列表 关闭对话框 提示成功
          this.fenpeiDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getUserInfos()
        }
      })
    },
    // 重置表单
    fenpeiDialogClose() {
      this.$refs.fenpeiFormRef.resetFields()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
