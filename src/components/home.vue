<template>
  <el-container class="home-container">
    <!-- 头部 -->
    <el-header>
      <div>
        <img src="../assets/logo1.png" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="infor" @click="loginout">退出</el-button>
    </el-header>
    <!-- 页面主题 -->
    <el-container>
      <!-- 菜单栏 -->
      <el-aside :width="iscollapse ?'56px':'200px'">
        <div class="toggle-buttom" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409eff"
        :unique-opened="true"
        :collapse="iscollapse"
        :collapse-transition="false"
        :router="true"
        :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconlist[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
            :key="subItem.id" @click="saveNavState('/'+subItem.path)">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧主题 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      // 左侧菜单数据
      menulist: [],
      iconlist: {
        125: 'fa fa-user',
        103: 'fa fa-database',
        101: 'fa fa-reorder',
        102: 'fa fa-shopping-bag',
        145: 'fa fa-area-chart'
      },
      // 是否折叠
      iscollapse: false,
      // 被激活的链接地址
      activePath: ''
    }
  },
  created () {
    this.getMenList()
    this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    loginout () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    getMenList () {
      this.$HTTP.get('http://127.0.0.1:8888/api/private/v1/menus')
        .then((res) => {
          // console.log(response.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          this.menulist = res.data.data
          // console.log(this.menulist)
        })
        .catch((error) => {
          console.log(error)
        })
    },
    // 点击按钮，切换菜单折叠与展开
    toggleCollapse () {
      this.iscollapse = !this.iscollapse
    },
    // 保存链接的激活状态
    saveNavState (activePath) {
      window.sessionStorage.setItem('activePath', activePath)
      this.activePath = activePath
    }

  }
}
</script>

<style lang="less" scoped="scoped">
  .home-container {
    height: 100%;
  }

  .el-header {
    background: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

    >div {
      display: flex;
      align-items: center;

      span {
        margin-left: 15px;
      }

      img {
        width: 50px;
      }
    }
  }

  .el-container {
    background: #333744;
    .el-menu{
      border-right: none;
    }
  }

  .el-main {
    background: #eaedf1;
  }
  .fa{
    margin-right: 10px;
    text-align: center;
  }

  .toggle-buttom{
    background: #4a5064;
    font-size: 10px;
    line-height: 24px;
    text-align: center;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
</style>
