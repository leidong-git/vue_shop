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
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <el-input :span="5" placeholder="请输入内容" clearable @clear="getUserList" v-model="querytInfo.query">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogvisible = true">添加用户</el-button>
        </el-col>
      </el-row>
      <!-- 表格 -->
      <el-table :data="userList" style="width: 100%;" :border="true" :stripe="true">
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="username" label="姓名">
        </el-table-column>
        <el-table-column prop="email" label="邮箱">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template v-slot="scope">
            <el-switch v-model="scope.row.mg_state" @change="swithchange(scope.row)">
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" width="175px">
          <template v-slot="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="removeUserbyid(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="分配角色" :enterable="false" placement="top">
              <el-button type="warning" size="mini" @click="disuserfp(scope.row)" icon="el-icon-setting"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="querytInfo.pagenum"
        :page-sizes="[1,2,5,10]" :page-size="querytInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框-->
    <el-dialog title="添加用户" :visible.sync="addDialogvisible" width="50%" @close="addDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addfromrules" ref="addFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框-->
    <el-dialog title="修改用户" :visible.sync="editDialogvisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormref" label-width="70px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="edituserinfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框-->
    <el-dialog title="分配角色" :visible.sync="disDialogvisible" width="50%" @close="disDialogClose">
      <!-- 内容主题区域 -->
      <el-form label-width="90px" ref="disFormref">
        <el-row>
          <el-col>
            <el-form-item label="当前用户:">
              <el-input v-model="disshow.username" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="当前角色:">
              <el-input v-model="disshow.role_name"></el-input>
            </el-form-item>
          </el-col>
          <el-col>
            <el-form-item label="分配新角色:">
                <el-select v-model="selectuid" placeholder="请选择">
                    <el-option
                      v-for="item in roleList"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id">
                    </el-option>
                  </el-select>
              </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="disDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="disuserinfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
export default {
  data () {
    // 自定义验证邮箱
    var checkEmail = (rele, value, cb) => {
      const regEmail = /^([a-zA-Z0-9])+@([a-zA-Z0-9_-])+([a-zA-Z0-9_-])+/

      if (regEmail.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的邮箱！'))
    }
    // 自定义验证手机号
    var checkMobile = (rele, value, cb) => {
      const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

      if (regMobile.test(value)) {
        // 合法的邮箱
        return cb()
      }
      cb(new Error('请输入合法的手机！'))
    }
    return {
      querytInfo: {
        query: '',
        // 当前页数
        pagenum: 1,
        // 总条数
        pagesize: 2
      },
      userList: [],
      total: 0,
      // 添加用户表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      // 控制添加对话框的显示与隐藏
      addDialogvisible: false,
      // 添加表单验证规则
      addfromrules: {
        username: [{
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 10,
          message: '用户名的长度在3~10个字符之间',
          trigger: 'blur'
        }
        ],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 15,
          message: '用户名的长度在6~15个字符之间',
          trigger: 'blur'
        }
        ],
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      },
      // 控制修改对话框隐藏显示
      editDialogvisible: false,
      // 查询到的用户对象
      editForm: {},
      // 修改表单的验证规则对象
      editFormRules: {
        email: [{
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        }, {
          validator: checkEmail,
          trigger: 'blur'
        }],
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          validator: checkMobile,
          trigger: 'blur'
        }]
      },
      // 分配角色显示
      disDialogvisible: false,
      // 分配角色
      disshow: [],
      roleList: [],
      selectuid: ''
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      await this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/users', {
        params: this.querytInfo
      })
        .then((res) => {
          // console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.userList = res.data.data.users
          this.total = res.data.data.total
          // console.log(this.userList)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听开关 改变状态
    swithchange (swith) {
      // console.log(swith);
      this.$HTTP.put(`http://127.0.0.1:8888/api/private/v1/users/${swith.id}/state/${swith.mg_state}`)
        .then((res) => {
          // console.log(res.data)
          if (res.data.meta.status !== 200) {
            swith.ma_state = !swith.ma_state
            this.$message.error(res.data.meta.msg)
          }
          this.$message.success(res.data.meta.msg)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听psgesize 改变
    handleSizeChange (newsize) {
      // console.log(newsize);
      this.querytInfo.pagesize = newsize
      this.getUserList()
    },
    // 监听 页码值 改变
    handleCurrentChange (newpage) {
      // console.log(newpage);
      this.querytInfo.pagenum = newpage
      this.getUserList()
    },
    // 监听用户对话框的关闭事件重置表单
    addDialogClose () {
      this.$refs.addFormref.resetFields()
    },
    // 点击按钮，添加新用户
    adduser () {
      // 校验表单
      this.$refs.addFormref.validate((valid) => {
        // console.log(valid)
        if (!valid) return
        // 可以发起添加用户的网络请求
        this.$HTTP.post('http://127.0.0.1:8888/api/private/v1/users', this.addForm)
          .then((res) => {
            // console.log(res.data)
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
            this.$message.success(res.data.meta.msg)
            // 关闭对话框
            this.addDialogvisible = false
            // 重新获取数据
            this.getUserList()
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    // 展示编辑用户的对话框
    showEditDialog (id) {
      console.log(id)
      this.editDialogvisible = true
      // 根据id获取用户数据
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/users/' + id)
        .then((res) => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.editForm = res.data.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听用户修改对话框的关闭事件
    editDialogClose () {
      this.$refs.editFormref.resetFields()
    },
    // 修改用户信息并提交
    edituserinfo () {
      this.$refs.editFormref.validate((valid) => {
        console.log(valid)
        if (!valid) return
        // 发起用户修改信息数据请求
        this.$HTTP.put('http://127.0.0.1:8888/api/private/v1/users/' + this.editForm.id, {
          email: this.editForm.email,
          mobile: this.editForm.mobile
        })
          .then((res) => {
            // console.log(res.data)
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
            // 关闭对话框
            this.editDialogvisible = false
            // 刷新数据列表
            this.getUserList()
            // 提示修改成功
            this.$message.success(res.data.meta.msg)
          })
          .catch((error) => {
            console.log(error)
          })
      })
    },
    // 根据id删除
    async removeUserbyid (id) {
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
      // 删除数据请求
      this.$HTTP.delete('http://127.0.0.1:8888/api/private/v1/users/' + id)
        .then((res) => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 删除用户成功
          this.$message.success(res.data.meta.msg)
          // 刷新数据列表
          this.getUserList()
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 监听用户修改对话框的关闭事件
    disDialogClose () {
      this.$refs.disFormref.resetFields()
      this.selectuid = ''
    },
    // 打开分配角色对话框
    disuserfp (role) {
      this.disshow = role
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/roles')
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 数据接收
          this.roleList = res.data.data
          // console.log(this.roleList)
        })
        .catch(error => {
          console.log(error)
        })
      this.disDialogvisible = true
    },
    // 上传分配角色
    disuserinfo () {
      if (!this.selectuid) return this.$message.error('请选择角色！')
      this.$HTTP.put(`users/${this.disshow.id}/role`, {
        rid: this.selectuid
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 数据接收
          this.$message.success(res.data.meta.msg)
          this.getUserList()
          this.disDialogvisible = false
        })
        .catch(error => {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="less" scoped="scoped">
</style>
