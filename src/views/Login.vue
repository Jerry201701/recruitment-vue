<template>
<div>
  <el-form :model="loginForm" :rules="fieldRules" ref="loginForm" label-position="left" label-width="0px" class="demo-ruleForm login-container">
    <span class="tool-bar">
      <!-- 主题切换 -->
      <theme-picker style="float:right;" class="theme-picker" :default="themeColor" @onThemeChange="onThemeChange"></theme-picker>
      <!-- 语言切换 -->
      <!-- <lang-selector class="lang-selector"></lang-selector>    -->
    </span>
    <h2 class="title" style="padding-left:22px;" >系统登录</h2>
    <el-form-item prop="account">
      <el-input type="text" v-model="loginForm.account" auto-complete="off" placeholder="账号"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="loginForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>
    <el-form-item >
      <el-col :span="12">
        <el-form-item prop="captcha">
          <el-input type="test" v-model="loginForm.captcha" auto-complete="off" placeholder="验证码, 单击图片刷新"
            style="width: 100%;">
          </el-input>
        </el-form-item>
      </el-col>
      <el-col class="line" :span="1">&nbsp;</el-col>
      <el-col :span="11">
        <el-form-item>
            <img style="width: 100%;" class="pointer" :src="loginForm.src" @click="refreshCaptcha">
        </el-form-item>
      </el-col>
    </el-form-item>
    <!-- <el-checkbox v-model="checked" checked class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <!-- <el-button type="primary" style="width:48%;" @click.native.prevent="reset">重 置</el-button> -->
      <el-button type="primary" style="width:48%;" @click.native.prevent="register">注册</el-button>
      <el-button type="primary" style="width:48%;" @click.native.prevent="login" :loading="loading">登 录</el-button>
    </el-form-item>
  </el-form>

  <!--用户注册界面 -->
    <el-dialog
      title="用户注册"
      width="40%"
      :visible.sync="editDialogVisible"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dataForm"
        label-width="120px"
        label-position="left"
        :rules="dataFormRules"
        ref="dataForm"
        :size="size"
      >
        <el-form-item label="ID" prop="id" v-if="false">
          <el-input v-model="dataForm.id" :disabled="true" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户名" prop="name">
          <el-input v-model="dataForm.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="dataForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="操作密码" prop="operatePassword">
          <el-input v-model="dataForm.operatePassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户类型" prop="type">
         <el-select v-model="dataForm.type" placeholder="请选择类型" style="float:left;">
					<el-option
					v-for="item in options"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item>
        <el-form-item label="所在区域" prop="deptId">
          <el-select v-model="dataForm.deptId" placeholder="请选择区域" style="float:left;">
					<el-option
					v-for="item in departments"
					:key="item.key"
					:label="item.key"
					:value="item.value">
					</el-option>
					</el-select>
        </el-form-item>

      </el-form>

      <div></div>
      <div slot="footer" class="dialog-footer">
        <el-button :size="size" @click.native="editDialogVisible = false">{{$t('action.cancel')}}</el-button>
        <el-button
          :size="size"
          type="primary"
          @click.native="submitForm"
          :loading="editLoading"
        >{{$t('action.submit')}}</el-button>
      </div>
    </el-dialog>
<div>
</div>

</div>
</template>

<script>
import { mapState } from 'vuex'
import Cookies from "js-cookie"
import ThemePicker from "@/components/ThemePicker"
import LangSelector from "@/components/LangSelector"
export default {
  name: 'Login',
  components:{
    ThemePicker,
    LangSelector
  },
  data() {
    return {
      loading: false,
      loginForm: {
        account: 'admin',
        password: 'admin',
       // password: '',
        captcha:'',
        src: ''
      },
      fieldRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
        // ,
        // captcha: [
        //   { required: true, message: '请输入验证码', trigger: 'blur' }
        // ]
      },
       size: "small",
      checked: true,
      editDialogVisible: false, // 新增编辑界面是否显示
      editLoading: false,
      dataFormRules: {
        name: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        operatePassword: [{ required: true, message: "请输入操作密码", trigger: "blur" }],
        type: [{ required: true, message: "请选择类型", trigger: "blur" }],
        region: [{ required: true, message: "请选择区域", trigger: "blur" }]
      },
      // 新增编辑界面数据
      dataForm: {
        id: 0,
        name: "",
        password: "",
        operatePassword:"",
        type:"",
        status: 1,
        deptId:0,
        userRoles:[]

      },
      options: [{
                    value: 9,
                    key: '商户'
                }, {
                    value: 11,
                    key: '配送员'
                }],
     departments:[],
     userRoles:[],
     userInfo:{}
    }
  },
  methods: {
    login() {
      this.loading = true
      let userInfo = {account:this.loginForm.account, password:this.loginForm.password, captcha:this.loginForm.captcha}
      this.$api.login.login(userInfo).then((res) => {
          if(res.msg != null) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            Cookies.set('token', res.data.token) // 放置token到Cookie
            sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
            sessionStorage.setItem('userId',res.data.userId)
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/')  // 登录成功，跳转到主页
          }
          this.loading = false
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        });
    },
    refreshCaptcha: function(){
      this.loginForm.src = this.global.baseUrl + "/captcha.jpg?t=" + new Date().getTime();
    },
    reset() {
      this.$refs.loginForm.resetFields()
    },
     ceshi(){
    console.log('1111')
    this.$api.employee.weiOauth().then(res => {console.log(res) });
            },
    register(){
       this.$api.login.departments().then((res)=>{
       // console.log(res.data)
        res.data.forEach(element=>{
          this.departments.push({
            value:element.id,
            key:element.name

        })
        })
     
      })
      
       this.editDialogVisible = true;
      this.operation = true;
      this.dataForm = {
        id: 0,
        name: "",
        password: "",
        operatePassword:"",
        type:"",
        status: 1,
        userRoles:[]
      

      };

    }, 
    //获取区域信息
    getRegions(){
     

    },

    // 表单提交
    submitForm () {
        this.loading = true
       let userInfo = {account:this.dataForm.name, password:this.dataForm.password}
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.dataForm.userRoles.push({roleId:this.dataForm.type})
						this.editLoading = true
            let params = Object.assign({}, this.dataForm)
						this.$api.login.register(params).then((res) => {
              this.editLoading = false
              if(res.code == 200) {

                this.$api.login.login(userInfo).then((res) => {
          if(res.msg != null) {
            this.$message({
              message: res.msg,
              type: 'error'
            })
          } else {
            Cookies.set('token', res.data.token) // 放置token到Cookie
            sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
            this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            this.$router.push('/')  // 登录成功，跳转到主页
          }
          this.loading = false
        }).catch((res) => {
          this.$message({
          message: res.message,
          type: 'error'
          })
        });
        
             //   Cookies.set('token', res.data.token) // 放置token到Cookie
             //   sessionStorage.setItem('user', userInfo.account) // 保存用户到本地会话
               //this.$store.commit('menuRouteLoaded', false) // 要求重新加载导航菜单
            //    this.$router.push('/')  // 登录成功，跳转到主页
								// this.$message({ message: '注册成功', type: 'success' })
                // this.dialogVisible = false
                // this.$refs['dataForm'].resetFields()
							} else {
								this.$message({message: '注册失败, ' + res.msg, type: 'error'})
							}
          
						})
					})
				}
      })
    },  

    // 切换主题
    onThemeChange: function(themeColor) {
      this.$store.commit('setThemeColor', themeColor)
    }
  },
  

  mounted() {
    this.refreshCaptcha()
  },
  computed:{
    ...mapState({
      themeColor: state=>state.app.themeColor
    })
  }
}
</script>

<style lang="scss" scoped>
  .login-container {
    -webkit-border-radius: 5px;
    border-radius: 5px;
    -moz-border-radius: 5px;
    background-clip: padding-box;
    margin: 100px auto;
    width: 350px;
    padding: 35px 35px 15px 35px;
    background: #fff;
    border: 1px solid #eaeaea;
    box-shadow: 0 0 25px #cac6c6;
    .title {
      margin: 0px auto 30px auto;
      text-align: center;
      color: #505458;
    }
    .remember {
      margin: 0px 0px 35px 0px;
    }
  }
</style>