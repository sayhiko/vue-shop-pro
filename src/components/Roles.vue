<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <el-button type="primary" @click="addDialogVisible=true">添加角色</el-button>
      <!-- 角色列表 -->
      <el-table :data="roleInfos" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="info">
            <!-- 一级权限展示 -->
            <!-- <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="{'border-bottom':'1px solid #EBEEF5', 'border-top':k===0 ? '1px solid #EBEEF5':''}"
            >-->
            <el-row
              v-for="(item,k) in info.row.children"
              :key="item.id"
              :style="k===0?'border-bottom:1px solid #EBEEF5;border-top:1px solid #EBEEF5':'border-bottom:1px solid #EBEEF5;'"
            >
              <el-col :span="5">
                <el-tag closable @close="closeTag(info.row.id,item.id)">{{item.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <!-- 二级权限显示 -->
                <!-- <el-row
                  v-for="(item2,k2) in item.children"
                  :key="item2.id"
                  :style="{'border-top': k2!==0 ? '1px solid #EBEEF5':''}"
                >-->
                <el-row
                  v-for="(item2,k2) in item.children"
                  :key="item2.id"
                  :style="k2!==0?'border-top:1px solid #EBEEF5':''"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="closeTag(info.row.id,item2.id)"
                    >{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <!-- 三级权限展示 -->
                    <el-tag
                      closable
                      type="warning"
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      @close="closeTag(info.row.id,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="序号" width="100"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc" width="350"></el-table-column>
        <el-table-column label="操作" width="450">
          <template slot-scope="info">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(info.row.id)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delRole(info.row.id)"
            >删除</el-button>
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showDistributeDialog(info.row)"
            >分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 添加角色对话框 -->
      <el-dialog title="添加角色" :visible.sync="addDialogVisible" width="50%">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" @close="addDialogClose">
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="addForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="addForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改角色对话框 -->
      <el-dialog title="修改角色" :visible.sync="editDialogVisible" width="50%">
        <el-form
          ref="editFormRef"
          :model="editForm"
          :rules="editFormRules"
          @close="editDialogClose"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editRole">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 分配权限对话框 -->
      <el-dialog title="分配权限" :visible.sync="distributeDialogVisible" width="50%">
        <el-form :model="distributeForm">
          <el-form-item label="当前角色">{{distributeForm.roleName}}</el-form-item>
          <el-form-item label="分配的权限">
            <el-tree
              :data="rightsInfos"
              show-checkbox
              node-key="id"
              :default-checked-keys="defaultCheckedKeys"
              :props="rightsInfosProps"
              default-expand-all
              ref="rightsRef"
            ></el-tree>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="distributeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="distributeRight">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getRoleInfos()
  },
  data() {
    return {
      // 角色列表信息
      roleInfos: [],
      // 添加角色相关
      // 默认弹框不显示
      addDialogVisible: false,
      // 添加form表单需要的数据
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单校验
      addFormRules: {
        roleName: [{ required: true, message: '角色名称必填', trigger: 'blur' }]
      },
      // 编辑角色相关
      // 默认不显示对话框
      editDialogVisible: false,
      // 修改角色表单需要的数据
      editForm: {
        roleName: '',
        roleDesc: ''
      },
      // 表单校验
      editFormRules: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ]
      },
      // 分配权限相关
      // 默认对话框不显示
      distributeDialogVisible: false,
      distributeForm: {
        // 被分配权限的角色的id
        id: '',
        // 被分配权限的角色名称
        roleName: ''
      },
      // 接收被分配的权限列表
      rightsInfos: [],
      // 给大树设置属性字段
      rightsInfosProps: {
        // 设置树节点名称
        label: 'authName',
        // 设置子树的属性名称
        children: 'children'
      },
      // 收集默认权限id
      defaultCheckedKeys: []
    }
  },
  methods: {
    async getRoleInfos() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取数据成功,赋值给rolesInfos
      this.roleInfos = res.data
    },
    // 添加角色相关
    // 先校验表单,然后提交数据
    addRole() {
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('roles', this.addForm)
          // 判断获取数据失败
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 获取数据成功 刷新列表 提示成功 关闭对话框
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        }
      })
    },
    // 重置表单
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
    },
    // 编辑角色相关
    // 根据id显示选中的角色的对话框
    async showEditDialog(id) {
      // 显示对话框
      this.editDialogVisible = true
      // 获取数据
      const { data: res } = await this.$http.get('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 把获取到的数据赋值给editForm
      this.editForm = res.data
    },
    // 提交修改数据
    editRole() {
      // 先校验再提交数据
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'roles/' + this.editForm.roleId,
            this.editForm
          )
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 提交成功 提示成功消息 关闭对话框 刷新列表
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        }
      })
    },
    // 重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除角色相关
    delRole(id) {
      this.$confirm('确定要删除该角色吗?', '删除角色', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          const { data: res } = await this.$http.delete('roles/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功 刷新列表 提示成功
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },
    // 删除角色权限
    closeTag(roleId, rightsId) {
      this.$confirm('确定要删除该权限么?', '删除权限', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 向后端发送axios请求
          const { data: res } = await this.$http.delete(
            'roles/' + roleId + '/rights/' + rightsId
          )
          console.log(res)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 成功 提示消息 刷新列表
          this.$message.success(res.meta.msg)
          this.getRoleInfos()
        })
        .catch(() => {})
    },
    // 分配权限相关
    // 显示分配权限对话框
    // role被分配权限的一条角色信息
    async showDistributeDialog(role) {
      // 显示对话框
      this.distributeDialogVisible = true
      // 把role赋予给表单
      this.distributeForm = role
      // 获取tree树上的权限数据
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 获取数据成功 赋值给rightsInfos
      this.rightsInfos = res.data
      // 设置树节点默认选中 当前角色拥有的权限需选中
      // 接收末级权限id
      var arrIds = []
      // 从role中把末级id获取出来
      this.getHaveRights(role, arrIds)
      // 赋值给默认id接收
      this.defaultCheckedKeys = arrIds
    },
    // 获取末级id的方法
    getHaveRights(node, keys) {
      if (!node.children) {
        return keys.push(node.id)
      }
      node.children.forEach(item => {
        this.getHaveRights(item, keys)
      })
    },
    // 存储分配好的权限信息
    async distributeRight() {
      // 获取全选的id
      var id1 = this.$refs.rightsRef.getCheckedKeys()
      // 获取半选中的id
      var id2 = this.$refs.rightsRef.getHalfCheckedKeys()
      // 合并两个id 112,147,103
      var allids = [...id1, ...id2].join(',')
      const { data: res } = await this.$http.post(
        'roles/' + this.distributeForm.id + '/rights',
        { rids: allids })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 提交成功 提示信息 刷新列表 关闭对话框
      this.distributeDialogVisible = false
      this.$message.success(res.meta.msg)
      this.getRoleInfos()
    }
  }
}
</script>

<style lang="less" scoped>
.el-tag {
  margin: 10px 5px;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>
