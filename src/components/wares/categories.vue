<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="4">
          <el-button type="primary" @click="ShowaddDialog()">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="cateList" :columns="columns" show-index index-text="#" border :selection-type="false"
        :expand-type="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false" style="color: limegreen"></i>
          <i class="el-icon-error" v-else style="color: red;"></i>
        </template>

        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>

        <template slot="opt">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="ShowEditDialog()">编辑</el-button>
          <el-button type="danger" size="mini" icon="el-icon-delete" @click="Showdelete()">删除</el-button>
        </template>
      </tree-table>

      <!-- 分页 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1,2,5,10]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框-->
    <el-dialog title="添加分类" :visible.sync="addDialogvisible" width="50%" @close="addDialogClose">
      <!-- 添加分类的表单 -->
      <el-form :model="addcataform" :rules="addcatarules" ref="addcataref" label-width="100px">
        <el-form-item label="分类名称:" prop="cat_name">
          <el-input v-model="addcataform.cat_name"></el-input>
        </el-form-item>

        <el-form-item label="父级分类:">
          <!-- options指定数据源 -->
          <!-- props指定配置对象 -->
          <el-cascader v-model="selectedkeys" expand-trigger="hover" :options="parentcateList" :props="cascaderprops"
            @change="handleChange" clearable change-on-select></el-cascader>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addcate">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改分类对话框-->
    <el-dialog title="修改分类" :visible.sync="editDialogvisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <h1>修改分类对话框</h1>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 定义分页
      queryInfo: {
        type: 3,
        // 当前页数
        pagenum: 1,
        // 每页条数
        pagesize: 10
      },
      total: 0,
      // 商品列表数据
      cateList: [],
      columns: [{
        label: '分类名称',
        prop: 'cat_name'
      }, {
        label: '是否有效',
        // 当前定义模板列
        type: 'template',
        // 当前列用的模板名称
        template: 'isok'
      }, {
        label: '排序',
        type: 'template',
        // 当前列用的模板名称
        template: 'order'
      }, {
        label: '操作',
        type: 'template',
        template: 'opt',
        width: '180px'
      }],
      // 添加对话框 状态
      addDialogvisible: false,
      // 添加表单数组
      addcataform: {
        cat_name: '',
        // 父级分类id
        cat_pid: 0,
        // 添加分类等级 默认为0
        cat_level: 0
      },
      addcatarules: {
        cat_name: [{
          required: true,
          message: '请输入分类名称',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
        ]
      },
      // 父级分类的列表
      parentcateList: [],
      //  指定级联选择器配置对象
      cascaderprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 修改对话框 状态
      editDialogvisible: false,
      // 选中的  父级分类id
      selectedkeys: []

    }
  },
  created () {
    this.getcateList()
  },
  methods: {
    // 获取商品列表数据
    getcateList () {
      this.$HTTP.get('categories', {
        params: this.queryInfo
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 数据赋值
          this.cateList = res.data.data.result
          // 总数据条数
          this.total = res.data.data.total
          console.log(this.cateList)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 监听psgesize 改变
    handleSizeChange (newsize) {
      // console.log(newsize);
      this.queryInfo.pagesize = newsize
      this.getcateList()
    },
    // 监听 页码值 改变
    handleCurrentChange (newpage) {
      // console.log(newpage);
      this.queryInfo.pagenum = newpage
      this.getcateList()
    },
    // 关闭添加
    addDialogClose () {
      this.$refs.addcataref.resetFields()
      this.selectedkeys = ''
      this.addcataform.cat_pid = 0
      this.addcataform.cat_level = 0
    },
    // 打开添加对话框
    ShowaddDialog () {
      // 获取父级分类数据
      this.getcateParentList()

      this.addDialogvisible = true
    },

    // 获取父级分类的数据
    getcateParentList () {
      this.$HTTP.get('categories', {
        params: {
          type: 2
        }
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 父级分类数据赋值
          this.parentcateList = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 选择项发生变化触发这个函数
    handleChange () {
      console.log(this.selectedkeys.length)
      console.log(this.selectedkeys)
      if (this.selectedkeys.length > 0) {
        // 父级分类id
        this.addcataform.cat_pid = this.selectedkeys[this.selectedkeys.length - 1]
        // 当前等级
        this.addcataform.cat_level = this.selectedkeys.length
      } else {
        this.addcataform.cat_pid = 0
        this.addcataform.cat_level = 0
      }
    },
    // 点击添加新分类
    addcate () {
      console.log(this.addcataform)
      this.$refs.addcataref.validate(valid => {
        if (!valid) return
        this.$HTTP.post('categories', this.addcataform)
          .then(res => {
            console.log(res.data)
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
            // 父级分类数据赋值
            this.$message.success(res.data.meta.msg)
            // 刷新数据
            this.getcateList()
            this.addDialogvisible = false
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 关闭修改
    editDialogClose () {

    },
    // 打开修改对话框
    ShowEditDialog () {
      this.editDialogvisible = true
    },
    // 删除对话框
    async Showdelete () {
      // console.log(id)
      const confirmResult = await this.$confirm('此操作将永久删除用户，是否继续？', '提示', {
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
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .zk-table {
    font-size: 15px;
    margin-top: 15px;
  }

  .el-cascader {
    width: 100%;
  }
</style>
