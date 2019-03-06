<template>
  <div>
    <!-- 面包屑区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card class="box-card">
      <!-- 警告区 -->
      <el-alert title="注意:只允许为第三级别分类设置相关参数!" type="warning" show-icon :closable="false"></el-alert>
      <!-- 商品级联选择器 -->
      <el-row>
        <el-col>
          <span>选择商品分类</span>
          <el-cascader
            expand-trigger="hover"
            :options="catInfos"
            v-model="selectedCat"
            @change="handleChange"
            :props="catProps"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签切换区 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="showbutton">添加动态参数</el-button>
          <!-- 表格展示数据列表 -->
          <el-table :data="manyInfos" border style="width: 100%">
            <el-table-column type="expand">
              <!-- 展示每个参数的可选值列表 -->
              <template slot-scope="info">
                <el-tag
                  v-for="(v,k) in info.row.attr_vals_arr"
                  :key="k"
                  closable
                  disable-transitions
                >{{v}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="80"></el-table-column>
            <el-table-column prop="attr_name" label="动态参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态参数" name="only">
          <el-button type="primary" size="mini" :disabled="showbutton">添加静态参数</el-button>
          <!-- 表格展示数据列表 -->
          <el-table :data="onlyInfos" border style="width: 100%">
            <el-table-column type="expand">
              <!-- 展示每个参数的可选值列表 -->
              <template slot-scope="info">
                <el-tag
                  v-for="(v,k) in info.row.attr_vals_arr"
                  :key="k"
                  closable
                  disable-transitions
                >{{v}}</el-tag>
                <!-- 添加可选值的按钮和输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(info.row)"
                  @blur="handleInputConfirm(info.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="序号" width="180"></el-table-column>
            <el-table-column prop="attr_name" label="静态参数名称" width="180"></el-table-column>
            <el-table-column label="操作">
              <el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
              <el-button type="danger" size="mini" icon="el-icon-delete">删除</el-button>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
export default {
  // 生命周期函数
  created() {
    this.getCatInfos()
  },
  data() {
    return {
      // 接收级联选择器数据
      catInfos: [],
      // 给级联选择器节点设置内容属性
      catProps: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectedCat: [],
      // 添加参数按钮设置默认禁用
      showbutton: true,
      // 设置默认显示标签
      activeName: 'many',
      // 接收选取第三级别分类id
      catThreeId: 0,
      // 接收分类参数列表信息
      manyInfos: [],
      onlyInfos: [],
      // 添加可选值相关
      // 输入框默认不显示
      inputVisible: false,
      // 接收输入框信息
      inputValue: ''
    }
  },
  methods: {
    // 级联选择器内容发生变化的回调处理
    handleChange() {
      // 如果选择的是非第三级别分类就禁用按钮,重置分类
      if (this.selectedCat.length !== 3) {
        // 重置分类
        this.selectedCat = []
        // 禁用button按钮
        this.showbutton = true
        // 重置id
        this.catThreeId = 0
        // 参数列表重置
        this.manyInfos = []
        this.onlyInfos = []
      } else {
        // 选了第三级别分类 添加按钮激活
        this.showbutton = false
        // 把第三级别分类id赋予给catThreeId
        this.catThreeId = this.selectedCat[2]
        // 调用获取参数列表数据
        this.getParamsInfos()
      }
    },
    // 切换标签被点击后的回调处理
    handleClick() {
      // 如果没有获取第三级别参数停止获取
      if (this.catThreeId === 0) {
        return null
      }
      // 获取参数列表
      this.getParamsInfos()
    },
    async getCatInfos() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 3 }
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // 获取数据成功 赋值给catInfos
      this.catInfos = res.data
    },
    // 统一获取参数列表数据
    async getParamsInfos() {
      const { data: res } = await this.$http.get(
        'categories/' + this.catThreeId + '/attributes',
        { params: { sel: this.activeName } }
      )
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      console.log(res)
      // 遍历各个参数的可选值内容 有字符串变成数组split
      // 给参数信息增加attr_vals_arr成员,用以接收数组格式的可选值信息
      res.data.forEach(item => {
        item.attr_vals_arr = item.attr_vals.split(' ')
      })
      // 判断接收的数据类型
      if (this.activeName === 'many') {
        this.manyInfos = res.data
      } else {
        this.onlyInfos = res.data
      }
    },
    // 添加可选值相关
    // 输入框被敲回车键或失去焦点的回调处理
    // nowParam:当前被添加可选值对应的"参数记录对象"
    handleInputConfirm(nowParams) {
      // 如果输入框不为空 就给数组中添加
      if (this.inputValue.trim() !== '') {
        nowParams.attr_vals_arr.push(this.inputValue.trim())
      }
      // input隐藏,button显示
      this.inputVisible = false
      // 清空输入框信息
      this.inputValue = ''
    },
    // button按钮被点击回调
    showInput() {
      // input显示,button隐藏
      this.inputVisible = true
      // 给输入框设置获取焦点
      // $nextTick的作用全部内容已经从vue内存渲染到HTML容器中了,相当于window.onload()
      this.$nextTick(_ => {
        // 调用两次$refs是为了得到最底层的input框
        this.$refs.saveTagInput.$refs.input.focus()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.el-row {
  margin-top: 15px;
}
.el-tag {
  margin: 10px 5px;
}
.input-new-tag {
  width: 90px;
}
</style>
