<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- card卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="querycdt.query"
            :clearable="true"
            @clear="getGoodsInfos"
            @keyup.enter.native="getGoodsInfos"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsInfos"></el-button>
          </el-input>
        </el-col>
        <el-col :span="8">
          <el-button type="primary" @click="$router.push('goodsadd')">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格展示数据列表 -->
      <el-table :data="goodInfos" border style="width: 100%">
        <el-table-column type="index" label="序号" width="80"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称"></el-table-column>
        <el-table-column prop="goods_price" label="商品价格(元)" width="180"></el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="200"></el-table-column>
        <el-table-column prop="add_time" label="创建时间" width="190"></el-table-column>
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
                @click="delGoods(info.row.id)"
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
    </el-card>
  </div>
</template>

<script>
export default {
  created() {
    this.getGoodsInfos()
  },
  data() {
    return {
      // 用户数据
      goodInfos: [],
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
      }
    }
  },
  methods: {
    // 获取用户显示的真实数据
    async getGoodsInfos() {
      const { data: res } = await this.$http.get('/goods', {
        params: this.querycdt
      })
      console.log(res)
      // 判断接收数据失败
      if (res.meta.status !== 200) {
        return res.$message.error(res.meta.msg)
      }
      // 把获取到的用户数据信息赋值给goodInfos
      this.goodInfos = res.data.goods
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
      this.getGoodsInfos()
    },
    // 当前页码变化的回调函数
    handleCurrentChange(arg) {
      // arg变化后的当前页码数
      console.log(arg)
      this.querycdt.pagenum = arg
      this.getGoodsInfos()
    }
  }
}
</script>

<style lang="less" scoped>
</style>
