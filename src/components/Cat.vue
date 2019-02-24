<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-button type="primary" @click="showAddDialog()">添加分类</el-button>
      <!-- table-tree展示区域 -->
      <zk-table
        :data="catInfos"
        :columns="catColumns"
        show-index
        :expand-type="false"
        :selection-type="false"
      >
        <template slot="order" slot-scope="info">
          <el-tag v-if="info.row.cat_level==0">一级</el-tag>
          <el-tag v-else-if="info.row.cat_level==1" type="success">二级</el-tag>
          <el-tag v-else type="warning">三级</el-tag>
        </template>
        <template slot="opt" slot-scope="info">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="showEditDialog(info.row.cat_id)"
          >修改</el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="delCat(info.row.cat_id)"
          >删除</el-button>
        </template>
      </zk-table>
      <!-- 分页功能 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querycdt.pagenum"
        :page-sizes="[3, 5, 8, 10]"
        :page-size="querycdt.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="querycdt.tot"
      ></el-pagination>
      <!-- 添加分类对话框 -->
      <el-dialog title="添加分类" :visible.sync="addDialogVisible" width="50%" @close="addDialogClose">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="addForm.cat_name"></el-input>
          </el-form-item>
          <el-form-item label="分类上级">
            <el-cascader
              expand-trigger="hover"
              :options="catData"
              v-model="selectedCat"
              :props="catProps"
              @change="handleChange"
              change-on-select
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCat">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 修改分类对话框 -->
      <el-dialog
        title="修改分类"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form ref="editFormRef" :model="editForm" :rules="editFormRules">
          <el-form-item label="分类名称" prop="cat_name">
            <el-input v-model="editForm.cat_name"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editCat">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
export default {
  created() {
    this.getCatInfos()
  },
  data() {
    return {
      catInfos: [],
      // 定义获取分类数据的条件
      querycdt: {
        // 设置显示三个级别
        type: 3,
        // 每页显示条数
        pagesize: 5,
        // 默认当前页
        pagenum: 1,
        // 总条数
        tot: 0
      },
      // 给table-tree定义列属性
      catColumns: [
        { label: '分类名称', prop: 'cat_name' },
        { label: '排序', type: 'template', template: 'order' },
        { label: '操作', type: 'template', template: 'opt' }
      ],
      // 添加分类部分
      // 默认不显示对话框
      addDialogVisible: false,
      addForm: {
        // 分类名称
        cat_name: '',
        // 分类直接父级id
        cate_pid: 0,
        // 分类等级
        cate_level: 0
      },
      // 校验表单
      addFormRules: {
        cat_name: [
          { required: true, message: '分类名称不能为空', trigger: 'blur' }
        ]
      },
      // 上级分类需要的数据
      catData: [],
      // 给级联选择器设置内容属性
      catProps: {
        // 名称字段
        label: 'cat_name',
        // 值字段
        value: 'cat_id',
        // 子级字段
        children: 'children'
      },
      // 接收或设置选中的上级分类
      selectedCat: [],
      // 修改分类相关
      // 默认弹框不显示
      editDialogVisible: false,
      editForm: {
        cat_name: ''
      },
      editFormRules: {
        cat_name: [{ required: true, message: '分类名称必填', trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 获取分类列表数据
    async getCatInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querycdt
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 获取数据成功 赋值给catInfos
      this.catInfos = res.data.result
      // 记录总条数
      this.querycdt.tot = res.data.total
    },
    // 数据分页相关
    // 改变当前页 arg变化后的当前页码
    handleSizeChange(arg) {
      this.querycdt.pagesize = arg
      this.getCatInfos()
    },
    // 改变显示条数
    handleCurrentChange(arg) {
      this.querycdt.pagenum = arg
      this.getCatInfos()
    },
    // 添加分类部分
    // 上级分类更换后的回调
    handleChange() {
      // 没有选择上级分类(新分类作为第一级别分类添加)
      if (this.selectedCat === 0) {
        this.addForm.cat_pid = 0
        this.addForm.cat_level = 0
      } else {
        // 有选取分类,新分类作为第二级别分类添加
        var len = this.selectedCat.length
        this.addForm.cat_pid = this.selectedCat[len - 1]
        this.addForm.cat_level = len
      }
    },
    // 显示弹框
    async showAddDialog() {
      this.addDialogVisible = true
      // 获取上级分类信息
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取成功 赋值给catData
      this.catData = res.data
    },
    // 添加分类 提交数据
    addCat() {
      // 先校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post(
            'categories',
            this.addForm
          )
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 获取成功 刷新列表 提示消息 关闭弹框
          this.addDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getCatInfos()
        }
      })
    },
    // 重置表单
    addDialogClose() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
      // 重置级联选择器
      this.selectedCat = []
    },
    // 编辑分类相关
    async showEditDialog(id) {
      // 显示弹框
      this.editDialogVisible = true
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取成功 赋值给editForm
      this.editForm = res.data
    },
    // 提交修改
    editCat() {
      // 先校验
      this.$refs.editFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.put(
            'categories/' + this.editForm.cat_id,
            this.editForm
          )
          if (res.meta.status !== 200) {
            this.$message.error(res.meta.msg)
          }
          // 提交成功 刷新列表 关闭对话框 提示信息
          this.editDialogVisible = false
          this.$message.success(res.meta.msg)
          this.getCatInfos()
        }
      })
    },
    // 重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },
    // 删除分类相关
    delCat(id) {
      // 确认信息提示
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const { data: res } = await this.$http.delete('categories/' + id)
          if (res.meta.status !== 200) {
            return this.$message.error(res.meta.msg)
          }
          // 删除成功 提示成功 刷新列表
          this.$message.success(res.meta.msg)
          this.getCatInfos()
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="less" scoped>
.zk-table {
  margin-top: 15px;
}
</style>
