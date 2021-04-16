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
      <el-alert title="注意: 只允许为第三级分类设置相关参数!" :closable="false" type="warning" show-icon>
      </el-alert>
      <el-row :gutter="20" class="cat_opt">
        <el-col :span="10">
          <span>选择商品分类：</span>
          <el-cascader v-model="selectedcatekeys" expand-trigger="hover" :options="catelist" :props="cateprops" @change="handleChange"
            clearable change-on-select></el-cascader>
        </el-col>
      </el-row>
      <el-tabs v-model="activeName" @tab-click="handletebClick">
        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addDialogvisible=true">添加参数</el-button>
          <!-- 动态参数table -->
          <el-table :data="manytableDate" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable v-for="(item,i) in scope.row.attr_vals" @close="removetag(i,scope.row)" :key="i">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showeditDialog(scope.row.attr_id)" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeform(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加静态属性面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isbtndisabled" @click="addDialogvisible=true">添加属性</el-button>
          <!-- 静态参数table -->
          <el-table :data="onlytableDate" border stripe>
            <el-table-column type="expand">
              <template v-slot="scope">
                <el-tag closable v-for="(item,i) in scope.row.attr_vals" @close="removetag(i,scope.row)" :key="i">{{item}}</el-tag>
                <el-input class="input-new-tag" v-if="scope.row.inputVisible" v-model="scope.row.inputValue" ref="saveTagInput"
                  size="small" @keyup.enter.native="handleInputConfirm(scope.row)" @blur="handleInputConfirm(scope.row)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作" width="180px">
              <template v-slot="scope">
                <el-button type="primary" icon="el-icon-edit" @click="showeditDialog(scope.row.attr_id)" size="mini">编辑</el-button>
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeform(scope.row.attr_id)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数对话框-->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogvisible" width="50%" @close="addDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="addform" :rules="addformrules" ref="addFormref" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addform.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addparmes">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框-->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogvisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="editform" :rules="editformrules" ref="editFormref" label-width="80px">
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editform.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editparmes">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      catelist: [],
      cateprops: {
        value: 'cat_id',
        label: 'cat_name',
        children: 'children'
      },
      // 级联选择框 双向绑定selectedcatekeys
      selectedcatekeys: '',
      activeName: 'many',
      // 动态参数数据
      manytableDate: [],
      // 静态参数数据
      onlytableDate: [],
      // 控制添加对话框显示与隐藏
      addDialogvisible: false,
      addform: {
        attr_name: ''
      },
      // 添加 表单 验证规则
      addformrules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      // 控制修改对话框显示与隐藏
      editDialogvisible: false,
      editform: {
        attr_name: ''
      },
      // 修改 表单 验证规则
      editformrules: {
        attr_name: [{
          required: true,
          message: '请输入参数名称',
          trigger: 'blur'
        }]
      },
      // 控制按钮与文本框的切换显示
      inputVisible: false,
      // 文本框中输入的内容
      inputValue: ''
    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    // 获取商品分类数据
    getcatelist () {
      this.$HTTP.get('categories')
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.catelist = res.data.data
          console.log(this.catelist)
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 级联选择框选中变化
    handleChange () {
      this.getparamsData()
    },
    // tab页签
    handletebClick () {
      // console.log(this.activeName)
      this.getparamsData()
    },
    // 获取参数数据
    getparamsData () {
      // console.log(this.selectedcatekeys)
      if (this.selectedcatekeys.length !== 3) {
        this.selectedcatekeys = []
        this.manytableDate = []
        this.onlytableDate = []
        return
      }
      // 证明选中的是3级
      console.log(this.cateID)
      // 根据所选分类id  根据当前所处面板 获取数据参数
      this.$HTTP.get(`categories/${this.cateID}/attributes`, {
        params: {
          sel: this.activeName
        }
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          res.data.data.forEach(item => {
            item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
            // 控制文本框显示与隐藏
            item.inputVisible = false
            // 文本框输入的值
            item.inputValue = ''
          })
          console.log(res.data.data)
          if (this.activeName === 'many') {
            this.manytableDate = res.data.data
          } else {
            this.onlytableDate = res.data.data
          }
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 重置添加对话框的表单
    addDialogClose () {
      this.$refs.addFormref.resetFields()
    },
    // 添加事件
    addparmes () {
      this.$refs.addFormref.validate(valid => {
        if (!valid) return
        this.$HTTP.post(`categories/${this.cateID}/attributes`, {
          attr_name: this.addform.attr_name,
          attr_sel: this.activeName
        })
          .then(res => {
            console.log(res)
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
            this.$message.success(res.data.meta.msg)
            this.getparamsData()
            this.addDialogvisible = false
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 重置修改对话框的表单
    editDialogClose () {
      this.$refs.editFormref.resetFields()
    },
    // 显示修改对话框
    showeditDialog (attrid) {
      this.$HTTP.get(`categories/${this.cateID}/attributes/${attrid}`, {
        params: {
          attr_sel: this.activeName
        }
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.editform = res.data.data
        })
        .catch(error => {
          console.log(error)
        })

      // 显示对话框
      this.editDialogvisible = true
    },
    editparmes () {
      this.$refs.editFormref.validate(valid => {
        if (!valid) return
        this.$HTTP.put(`categories/${this.cateID}/attributes/${this.editform.attr_id}`, {
          attr_name: this.editform.attr_name,
          attr_sel: this.activeName
        })
          .then(res => {
            console.log(res)
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
            this.$message.success(res.data.meta.msg)
            this.getparamsData()
            this.editDialogvisible = false
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 删除
    async removeform (attrid) {
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
      this.$HTTP.delete(`categories/${this.cateID}/attributes/${attrid}`)
        .then((res) => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 删除用户成功
          this.$message.success(res.data.meta.msg)
          // 刷新数据列表
          this.getparamsData()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 文本框失去焦点 或按下enter 键都会触发
    handleInputConfirm (row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
      }
      // 如果没有returen 则证明 输入内容合法 需要做后续处理
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      // 保存这次操作
      this.saveattrvals(row)
    },
    // 点击按钮显示输入框
    showInput (row) {
      row.inputVisible = true
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },
    // 删除tag
    removetag (i, row) {
      row.attr_vals.splice(i, 1)

      this.saveattrvals(row)
    },
    // 保存操作请求
    saveattrvals (row) {
      // 需要发起请求
      this.$HTTP.put(`categories/${this.cateID}/attributes/${row.attr_id}`, {
        attr_name: row.attr_name,
        attr_sel: row.attr_sel,
        attr_vals: row.attr_vals.join(' ')
      })
        .then((res) => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  computed: {
    // 如果按钮需要被禁用 则返回true 否则返回false
    isbtndisabled () {
      if (this.selectedcatekeys.length !== 3) {
        return true
      }
      return false
    },
    // 当前选中的三级分类的id
    cateID () {
      if (this.selectedcatekeys.length === 3) {
        return this.selectedcatekeys[2]
      }
      return null
    },
    // 动态计算标题文本
    titleText () {
      if (this.activeName === 'many') {
        return '动态参数'
      }
      return '静态属性'
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .cat_opt {
    margin: 15px 0;
  }

  .el-tag {
    margin: 5px;
  }

  .button-new-tag {
    margin-left: 5px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
  }

  .input-new-tag {
    width: 120px;
    margin-left: 5px;
  }
</style>
