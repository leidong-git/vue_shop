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
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="addroleform()">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 表格区域 -->
      <el-table :data="roleList" style="width: 100%;" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand" label="">
          <template v-slot="scope">
            <el-row v-for="(item1,i1) in scope.row.children" :key="item1.id" :class="['bd_bottom',i1 === 0 ? 'bd_top':'','vcenter']">
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag closable @close="removerightbyid(scope.row,item1.id)">{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row :class="[i2 ===0 ? '':'bd_top','vcenter']" v-for="(item2,i2) in item1.children" :key="item2.id">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removerightbyid(scope.row,item2.id)">{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag closable @close="removerightbyid(scope.row,item3.id)" type="warning" v-for="item3 in item2.children"
                      :key="item3.id">{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index" label="#">
        </el-table-column>
        <el-table-column prop="roleName" label="权限名称">
        </el-table-column>
        <el-table-column prop="roleDesc" label="路径">
        </el-table-column>
        <el-table-column label="权限等级" width="260px">
          <template v-slot="scope">
            <el-button type="primary" size="mini" @click="editroleform(scope.row.id)" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" size="mini" @click="removerolebyid(scope.row.id)" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" size="mini" @click="disshowrole(scope.row)" icon="el-icon-setting">权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框-->
    <el-dialog title="添加角色" :visible.sync="addDialogvisible" width="50%" @close="addDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="addForm" :rules="addfromrules" ref="addFormref" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="addroleinfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改角色对话框-->
    <el-dialog title="修改角色" :visible.sync="editDialogvisible" width="50%" @close="editDialogClose">
      <!-- 内容主题区域 -->
      <el-form :model="editForm" :rules="editFormRules" ref="editFormref" label-width="70px">
        <el-form-item label="角色名" prop="roleName">
          <el-input v-model="editForm.roleName" disabled></el-input>
        </el-form-item>
        <el-form-item label="路径" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="editroleinfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 权限管理 -->
    <el-dialog title="权限管理" :visible.sync="disDialogvisible" width="50%" @close="disDialogclose">
      <!-- 内容主题区域 -->
      <el-tree :data="disform" ref="treeref" :props="disProps" :default-checked-keys="defkeys" node-key="id" default-expand-all show-checkbox></el-tree>

      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="disDialogvisible = false">取 消</el-button>
        <el-button type="primary" @click="allorrights()">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
export default {
  data () {
    return {
      roleList: [],
      // 添加角色对话框
      addDialogvisible: false,
      addForm: {
        roleName: '',
        roleDesc: ''
      },
      addfromrules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字符',
          trigger: 'blur'
        }
        ],
        roleDesc: [{
          required: true,
          message: '请输入路径',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字符',
          trigger: 'blur'
        }
        ]
      },
      // 修改角色对话框
      editDialogvisible: false,
      editForm: {},
      editFormRules: {
        roleName: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字符',
          trigger: 'blur'
        }
        ],
        roleDesc: [{
          required: true,
          message: '请输入活动名称',
          trigger: 'blur'
        },
        {
          min: 2,
          max: 10,
          message: '长度在 2 到 10 个字符',
          trigger: 'blur'
        }
        ]
      },
      // 权限管理
      disform: [],
      // 权限对话框
      disDialogvisible: false,
      disProps: {
        label: 'authName',
        children: 'children'
      },
      defkeys: [],
      roleid: ''
    }
  },
  created () {
    this.getrolesList()
  },
  methods: {
    getrolesList () {
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/roles')
        .then(res => {
          // console.log(res.data.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.roleList = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 打开添加对话框
    addroleform () {
      this.addDialogvisible = true
    },
    // 清除默认状态
    addDialogClose () {
      this.$refs.addFormref.resetFields()
    },
    // 提交添加数据
    addroleinfo () {
      this.$refs.addFormref.validate(valid => {
        console.log(valid)
        if (!valid) return this.$message.error('表单校验失败！')
        this.$HTTP.post('http://127.0.0.1:8888/api/private/v1/roles', this.addForm)
          .then(res => {
            console.log(res.data)
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)

            // 提示添加成功
            this.$message.success(res.data.meta.msg)
            // 关闭对话框
            this.addDialogvisible = false
            // 重新获取数据
            this.getrolesList()
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 打开修改对话框
    editroleform (id) {
      this.editDialogvisible = true
      console.log(id)
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/roles/' + id)
        .then(res => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.editForm = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 清除默认状态
    editDialogClose () {
      this.$refs.editFormref.resetFields()
    },
    // 提交修改数据
    editroleinfo () {
      this.$refs.editFormref.validate(valid => {
        // console.log(this.editForm)
        if (!valid) return this.$message.error('表单校验失败！')
        this.$HTTP.put('http://127.0.0.1:8888/api/private/v1/roles/' + this.editForm.roleId, {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        })
          .then(res => {
            // console.log(res.data)
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)

            // 提示添加成功
            this.$message.success(res.data.meta.msg)
            // 关闭对话框
            this.editDialogvisible = false
            // 重新获取数据
            this.getrolesList()
          })
          .catch(error => {
            console.log(error)
          })
      })
    },
    // 删除操作
    async removerolebyid (id) {
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
      this.$HTTP.delete('http://127.0.0.1:8888/api/private/v1/roles/' + id)
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 提示添加成功
          this.$message.success(res.data.meta.msg)
          // 重新获取数据
          this.getrolesList()
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 弹窗提示用户是否删除
    async removerightbyid (role, rightid) {
      const confirmResult1 = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .catch((error) => error)
      console.log(confirmResult1)
      if (confirmResult1 !== 'confirm') {
        // console.log(confirmResult)
        return this.$message.info('已取消删除！')
      }

      this.$HTTP.delete(`http://127.0.0.1:8888/api/private/v1/roles/${role.id}/rights/${rightid}`)
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // 提示添加成功
          this.$message.success(res.data.meta.msg)
          // 不建议重新获取数据(重新获取数据 会将展开列合起来)  可以直接给role.children 直接赋值
          // this.getrolesList()
          role.children = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    // 关闭权限对话框
    disDialogclose () {
      this.defkeys = []
    },
    // 打开权限对话框
    disshowrole (role) {
      this.roleid = role.id
      // 获取所有权限列表
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/rights/tree')
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.disform = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
      // 递归获取三级节点id
      this.getdiskeys(role, this.defkeys)

      console.log(this.defkeys)

      // 获取已有的权限
      this.disDialogvisible = true
    },
    // 递归获取三级节点id
    getdiskeys (node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }

      node.children.forEach(item =>
        this.getdiskeys(item, arr))
    },
    // 点击位角色分配权限
    allorrights () {
      const keys = [...this.$refs.treeref.getCheckedKeys(), ...this.$refs.treeref.getHalfCheckedKeys()]

      console.log(keys)
      const strs = keys.join(',')
      this.$HTTP.post(`http://127.0.0.1:8888/api/private/v1/roles/${this.roleid}/rights`, {
        rids: strs
      })
        .then(res => {
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.$message.success(res.data.meta.msg)
          // 刷新数据
          this.getrolesList()
          // 关闭对话框
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
  .el-tag {
    margin: 7px;
  }

  .bd_bottom {
    border-bottom: 1px solid #eee;
  }

  .bd_top {
    border-top: 1px solid #eee;
  }

  .vcenter {
    display: flex;
    align-items: center;
  }
</style>
