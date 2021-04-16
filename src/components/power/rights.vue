<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 表格 -->
      <el-table :data="rightsList" style="width: 100%;" :border="true" :stripe="true">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="authName" label="权限名称">
        </el-table-column>
        <el-table-column prop="path" label="路径">
        </el-table-column>
        <el-table-column label="权限等级">
          <template v-slot="scope">
            <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '2' ">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      rightsList: []
    }
  },
  created () {
    this.getrightsList()
  },
  methods: {
    getrightsList () {
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/rights/list')
        .then((res) => {
          console.log(res)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.rightsList = res.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
</style>
