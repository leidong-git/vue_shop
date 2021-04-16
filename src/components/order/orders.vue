<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加 -->
      <el-row :gutter="20" class="cat_opt">
        <el-col :span="8">
          <el-input :span="5" placeholder="请输入内容" clearable @clear="getorderlist" v-model="queryInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getorderlist"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 数据表格 -->
      <el-table :data="orderlist" style="width: 100%;" :border="true" :stripe="true">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180px">
        </el-table-column>
        <el-table-column prop="" label="是否付款" width="180px">
          <template v-slot="scope">
            <el-tag type="success" v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="" label="是否发货" width="180px">
          <template v-slot="scope">
            <template>
              {{scope.row.is_send}}
            </template>
          </template>
        </el-table-column>
        <el-table-column prop="" label="下单时间" width="180px">
          <template v-slot="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120px">
          <template>
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editdig"></el-button>
            <el-button type="success" size="mini" icon="el-icon-location" @click="progressdig"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 修改地址对话框-->
    <el-dialog title="修改地址" :visible.sync="editDialogvisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="addressform" :rules="addressformrules" ref="addressformref" label-width="90px">
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="citydata" v-model="addressform.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressform.address2"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 物流信息对话框-->
    <el-dialog title="物流信息" :visible.sync="progressDialogvisible" width="50%" @close="progressDialogClose">
      <el-timeline>
        <el-timeline-item v-for="(item, index) in progresslist" :key="index" :timestamp="item.time">
          {{item.context}}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script>
import citydata from '../../assets/citydata.js'
export default {
  data () {
    return {
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10
      },
      total: 0,
      orderlist: [],
      editDialogvisible: false,
      addressform: {},
      addressformrules: {
        address1: [{
          required: true,
          message: '请选择省市区县',
          trigger: 'blur'
        }],
        address2: [{
          required: true,
          message: '请填写详细地址',
          trigger: 'blur'
        }]
      },
      citydata,
      progressDialogvisible: false,
      progresslist: []
    }
  },
  created () {
    this.getorderlist()
  },
  methods: {
    getorderlist () {
      this.$HTTP.get('orders', {
        params: this.queryInfo
      })
        .then(res => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.orderlist = res.data.data.goods
          this.total = res.data.data.total
          console.log(this.orderlist, this.total)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 监听psgesize 改变
    handleSizeChange (newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getorderlist()
    },
    // 监听 页码值 改变
    handleCurrentChange (newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getorderlist()
    },
    editdig () {
      this.editDialogvisible = true
    },
    editDialogClose () {
      this.$refs.addressformref.resetFields()
    },
    progressdig () {
      this.$HTTP.get('/kuaidi/804909574412544580')
        .then(res => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.progresslist = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
      this.progressDialogvisible = true
    },
    // 关闭后清空时间线
    progressDialogClose () {
      this.progresslist = []
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .el-cascader {
    width: 100%;
  }
</style>
