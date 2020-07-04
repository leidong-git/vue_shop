<template>
  <div class="login_centainer">
    <div class="login_box">

      <!-- 头像区域 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <el-form :model="loginform" ref="loginformref" :rules="loginformrules" label-width="0px" class="login_form">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input v-model="loginform.username" prefix-icon="fa fa-user"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input v-model="loginform.password" type="password" prefix-icon="fa fa-unlock-alt"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginIn">登录</el-button>
          <el-button @click="resetLoginForm" type="info">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 这是登录表单的数据绑定
        loginform: {
          username: 'admin',
          password: '123456'
        },
        // 这是表单验证规则对象
        loginformrules: {
          // 验证用户名是否合法cm
          username: [{
              required: true,
              message: '请输入登录名称',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          // 验证密码是否合法
          password: [{
              required: true,
              message: '请输入登录密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 15,
              message: '长度在6到15个字符',
              trigger: 'blur'
            }
          ]
        }
      }
    },
    methods: {
      // 点击重置按钮，重置登录表单
      resetLoginForm() {
        // console.log(this)
        this.$refs.loginformref.resetFields()
      },
      // 登录验证
      loginIn() {
        this.$refs.loginformref.validate(async valid => {
          // console.log(valid)
          var that = this;
          if (!valid) return
          this.$HTTP.post('http://127.0.0.1:8888/api/private/v1/login', this.loginform)
            .then(function(response) {
              console.log(response.data);
              if (response.data.meta.status !== 200) {
                return that.$message.error('登录失败！');
              } else {
                that.$message.success('登录成功！');
                window.sessionStorage.setItem('token', response.data.data.token);
                that.$router.push('./home');
              }
            })
            .catch(function(error) {
              console.log(error);
            })
          // console.log(result)
          // if (res.meta.status !== 200) return this.$message.error('登录失败！')
          // this.$message.success('登录成功！')
        })
      }
    }
  }
</script>

<style lang="less" scoped="scoped">
  .login_centainer {
    background: #2b4b6b;
    height: 100%;
  }

  .login_box {
    width: 450px;
    height: 300px;
    background: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    // margin-left:-225px; margin-top:-150px;

    .avatar_box {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background: #fff;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: #eee;
      }

      ;
    }

    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      box-sizing: border-box;
      padding: 0 20px;
    }

    .btns {
      display: flex;
      justify-content: flex-end;
    }
  }
</style>
