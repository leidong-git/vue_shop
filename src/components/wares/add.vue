<template>
  <div>
    <!-- 面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card">
      <!-- 添加 -->
      <el-row :gutter="20" class="cat_opt">
        <el-alert title="添加商品信息" type="info" center show-icon>
        </el-alert>
        <el-steps :space="200" :active="activeIndex - 0" finish-status="success" align-center>
          <el-step title="基本信息"></el-step>
          <el-step title="商品参数"></el-step>
          <el-step title="商品属性"></el-step>
          <el-step title="商品图片"></el-step>
          <el-step title="商品内容"></el-step>
          <el-step title="完成"></el-step>
        </el-steps>

        <!-- tab栏区域-->
        <el-form :model="addForm" :rules="addFormrules" ref="addFormref" label-width="100px" :label-position="'top'"
          class="demo-ruleForm">
          <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforetableave" @tab-click="tabclick">
            <el-tab-pane label="基本信息" name="0">
              <el-form-item label="商品名称" prop="goods_name">
                <el-input v-model="addForm.goods_name"></el-input>
              </el-form-item>
              <el-form-item label="商品价格" prop="goods_price">
                <el-input v-model="addForm.goods_price" type="number"></el-input>
              </el-form-item>
              <el-form-item label="商品名称" prop="goods_weight">
                <el-input v-model="addForm.goods_weight"></el-input>
              </el-form-item>
              <el-form-item label="商品数量" prop="goods_number" type="number">
                <el-input v-model="addForm.goods_number"></el-input>
              </el-form-item>
              <el-form-item label="商品分类" prop="goods_cat">
                <el-cascader v-model="addForm.goods_cat" expand-trigger="hover" :options="catelist" :props="cateprops"
                  @change="handleChange"></el-cascader>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品参数" name="1">
              <el-form-item :label="item.attr_name" v-for="item in manytabledata" :key="item.attr_id">
                <el-checkbox-group v-model="item.attr_vals">
                  <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品属性" name="2">
              <el-form-item :label="item.attr_name" v-for="item in onlytabledata" :key="item.attr_id">
                <el-input v-model="item.attr_vals"></el-input>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane label="商品图片" name="3">
              <!-- action图片要上传的后台api接口 -->
              <el-upload class="upload-demo" :action="uoloadURL" :on-preview="handlePreview" :on-remove="handleRemove"
                list-type="picture" :headers="headerobj" :on-success="handlesuccess">
                <el-button size="small" type="primary">点击上传</el-button>
              </el-upload>
            </el-tab-pane>
            <el-tab-pane label="商品内容" name="4">
              <quill-editor v-model="addForm.goods_introduce"></quill-editor>
              <el-button size="small" type="primary" class="btnadd" @click="add">添加商品</el-button>
            </el-tab-pane>
          </el-tabs>
        </el-form>
      </el-row>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewdialogVisible" width="50%">
      <img :src="previewpath" class="preview" alt="">
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
export default {
  data () {
    return {
      activeIndex: '0',
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 10,
        goods_number: 1,
        // 商品所属分类数组
        goods_cat: [],
        // 图片数组
        pics: [],
        // 商品详情
        goods_introduce: '',
        attrs: []
      },
      addFormrules: {
        goods_name: [{
          required: true,
          message: '请输入商品名称',
          trigger: 'blur'
        }],
        goods_price: [{
          required: true,
          message: '请输入商品价格',
          trigger: 'blur'
        }],
        goods_weight: [{
          required: true,
          message: '请输入商品重量',
          trigger: 'blur'
        }],
        goods_number: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        }],
        goods_cat: [{
          required: true,
          message: '请输入商品数量',
          trigger: 'blur'
        }]
      },
      // 商品分类数据
      catelist: [],
      cateprops: {
        label: 'cat_name',
        value: 'cat_id',
        children: 'children'
      },
      selectcate: [],
      // 动态参数数组
      manytabledata: [],
      // 静态属性数组
      onlytabledata: [],
      // 图片上传地址
      uoloadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的headers请求头对象
      headerobj: {
        Authorization: window.sessionStorage.getItem('token')
      },
      //
      previewpath: '',
      previewdialogVisible: false
    }
  },
  created () {
    this.getcatelist()
  },
  methods: {
    // 获取所有商品分类数据
    getcatelist () {
      this.$HTTP.get('categories')
        .then(res => {
          console.log(res.data)
          if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
          // this.$message.success(res.data.meta.msg)
          this.catelist = res.data.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    handleChange () {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    beforetableave (activeName, oldActiveName) {
      // console.log('即将离开的标签是' + oldActiveName)
      // console.log('即将进入的标签是' + activeName)
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    tabclick () {
      // console.log(this.activeIndex)
      // 动态面板判断发起数据请求
      if (this.activeIndex === '1') {
        this.$HTTP.get(`categories/${this.cateID}/attributes`, {
          params: {
            sel: 'many'
          }
        })
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
            res.data.data.forEach(item => {
              item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ')
            })
            console.log(res.data.data)
            this.manytabledata = res.data.data
          })
          .catch(error => {
            console.log(error)
          })
      } else if (this.activeIndex === '2') {
        this.$HTTP.get(`categories/${this.cateID}/attributes`, {
          params: {
            sel: 'only'
          }
        })
          .then(res => {
            if (res.data.meta.status !== 200) return this.$message.error(res.data.meta.msg)
            // res.data.data.forEach(item => {
            //   item.attr_vals = item.attr_vals === 0 ? [] : item.attr_vals.split(' ')
            // })
            // console.log(this.onlytabledata)
            this.onlytabledata = res.data.data
            console.log(this.onlytabledata)
          })
          .catch(error => {
            console.log(error)
          })
      }
    },
    // 处理图片预览事件
    handlePreview (file) {
      console.log(file)
      this.previewpath = file.response.data.url
      this.previewdialogVisible = true
    },
    // 处理移除图片操作
    handleRemove (file) {
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      const i = this.addForm.pics.findIndex((ints) =>
        ints.pic === filePath
      )
      this.addForm.pics.splice(i, 1)

      console.log(this.addForm)
    },
    // 监听图片上传陈宫
    handlesuccess (response) {
      // 拼接得到一个图片信息对象
      // 将图片对象push到 pics数组中
      const picInfo = {
        pic: response.data.tmp_path
      }

      this.addForm.pics.push(picInfo)
      console.log(response)
    },
    // 添加商品
    add () {
      this.$refs.addFormref.validate(valid => {
        if (!valid) {
          return this.$message.error('请填写必要的表单相项！')
        }
        // 执行添加的业务逻辑
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manytabledata.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlytabledata.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals
          }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)

        // 发起添加商品请求
        this.$HTTP.post('goods', form)
          .then(res => {
            if (res.data.meta.status !== 201) return this.$message.error(res.data.meta.msg)
            this.$message.success(res.data.meta.msg)
            this.$router.push('/goods')
          })
          .catch(error => {
            console.log(error)
          })
      })
    }

  },
  computed: {

    // 当前选中的三级分类的id
    cateID () {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    }
  }
}
</script>

<style lang="less" scoped="scoped">
  .el-checkbox {
    margin: 0 10px 0 0 !important;
  }

  .preview {
    width: 100%;
  }

  .btnadd {
    margin-top: 15px;
  }
</style>
