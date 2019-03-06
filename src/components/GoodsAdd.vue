<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片区域 -->
    <el-card class="box-card">
      <!-- alert警告区 -->
      <el-alert title="添加商品信息" type="info" center show-icon></el-alert>
      <!-- 步骤条部分 -->
      <el-steps :active="active-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签切换和步骤条联动 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules">
        <el-tabs tab-position="left">
          <el-tab-pane label="基本信息" name="0">
            <!-- 添加商品基本信息 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
          <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              class="upload-demo"
              :action="uploadUrl"
              list-type="picture"
              :headers="uploadParams"
              :on-success="uploadSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce" ref="myQuillEditor"></quill-editor>
          </el-tab-pane>
          <el-button type="primary" size="small" style="margin-top:15px;" @click="addGoods">添加商品</el-button>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
// 导入富文本编辑器的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 引入富文本编辑器的功能模块
import { quillEditor } from 'vue-quill-editor'
export default {
  // 私有注册富文本编辑器
  components: {
    quillEditor
  },
  data() {
    return {
      // 设置步骤套默认激活单元
      active: '0',
      // 表单需要的数据
      addForm: {
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
        // 给必填项目设置假数据
        goods_cat: '10,11,12',
        // 用来接收上传图片
        pics: [],
        // 商品详情,接收富文本编辑器信息
        goods_introduce: ''
      },
      // 表单校验规则
      addFormRules: {
        goods_name: [
          { required: 'true', message: '商品名称不能为空', trigger: 'blur' }
        ],
        goods_price: [
          { required: 'true', message: '商品价格不能为空', trigger: 'blur' }
        ],
        goods_weight: [
          { required: 'true', message: '商品重量不能为空', trigger: 'blur' }
        ],
        goods_number: [
          { required: 'true', message: '商品数量不能为空', trigger: 'blur' }
        ]
      },
      // 上传图片相关
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 给上传图片设置token请求头信息
      uploadParams: {
        Authorization: window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    // 图片上传成功的回调处理
    uploadSuccess(result) {
      // result会把上传成功后的响应数据接收到data/meta
      console.log(result)
      if (result.meta.status !== 200) {
        return this.$message.error(result.meta.msg)
      }
      // 接收成功 添加到pics里
      var obj = { pic: result.data.tmp_path }
      this.addForm.pics.push(obj)
    },
    // 添加商品方法
    addGoods() {
      // 先校验
      this.$refs.addFormRef.validate(async valid => {
        if (valid) {
          const { data: res } = await this.$http.post('goods', this.addForm)
          if (res.meta.status !== 201) {
            return this.$message.error(res.meta.msg)
          }
          // 获取成功 提示消息 页面返回列表页
          this.$message.success(res.meta.msg)
          this.$router.push('goods')
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// 给步骤条,标签切换设置样式
.el-steps,
.el-tabs {
  margin-top: 20px;
}
</style>
