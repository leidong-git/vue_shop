<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加 -->
      <el-row :gutter="20" class="cat_opt">
        <el-col :span="8">
          <el-input :span="5" placeholder="请输入内容" clearable @clear="getgoodslist" v-model="querylist.query">
            <el-button slot="append" icon="el-icon-search" @click="getgoodslist"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goaddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table :data="goodsList" style="width: 100%;" :border="true" :stripe="true">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="goods_name" label="商品名称">
        </el-table-column>
        <el-table-column prop="goods_number" label="商品价格(元)" width="180px">
        </el-table-column>
        <el-table-column prop="goods_weight" label="商品重量" width="180px">
        </el-table-column>
        <el-table-column prop="upd" label="创建时间" width="180px">
          <template v-slot="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removegoods(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querylist.pagenum"
        :page-sizes="[1,2,5,10]" :page-size="querylist.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
export default {
  data () {
    return {
      querylist: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      goodsList: [],
      total: 0

    }
  },
  created () {
    this.getgoodslist()
  },
  methods: {
    getgoodslist () {
      this.$HTTP.get('goods', {
        params: this.querylist
      })
        .then(res => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // this.$message.success(res.data.meta.msg)
          this.goodsList = res.data.data.goods
          this.total = res.data.data.total
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 监听psgesize 改变
    handleSizeChange (newsize) {
      // console.log(newsize);
      this.querylist.pagesize = newsize
      this.getgoodslist()
    },
    // 监听 页码值 改变
    handleCurrentChange (newpage) {
      // console.log(newpage);
      this.querylist.pagenum = newpage
      this.getgoodslist()
    },
    // 删除商品
    async removegoods (id) {
      const confirmResult = await this.$confirm('此操作将永久删除该参数，是否继续？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch((error) => error)

      // 如果用户确认删除，则返回值位字符串confirm
      // 如果用户取消删除，则返回值位字符串cancel
      if (confirmResult !== 'confirm') {
        // console.log(confirmResult)
        return this.$message.info('已取消删除！')
      }
      // 删除数据请求
      this.$HTTP.delete(`goods/${id}`)
        .then((res) => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 删除用户成功
          this.$message.success(res.data.meta.msg)
          // 刷新数据列表
          this.getgoodslist()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 编程式导航 跳转添加界面
    goaddpage () {
      this.$router.push('/goods/add')
    }
  }
}
</script>

<style lang="less" scoped="scoped">
</style>
