<template>
  <div class="login-container" :style="{backgroundImage: `url(${bgImage})`}" style="display: flex; justify-content: center; align-items: center; ">
    <div class="main-body">
      <div class="login-main">
        <div class="login-top">
          <span>群成员后台系统</span>
        </div>
        <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
          <el-form-item prop="userName">
            <el-input
              ref="userName"
              v-model="loginForm.userName"
              placeholder="请输入用户名"
              name="userName"
              type="text"
              tabindex="1"
              auto-complete="on"
              prefix-icon="el-icon-user"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              auto-complete="on"
              prefix-icon="el-icon-lock"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
          <div style="margin-bottom: 1rem;">
            <Vcode :show="isShow" @success="onSuccess" @close="onClose" @fail="onFail" />
            <div
              style="color: #409EFF; cursor: pointer;margin: 20px 0 50px 0;"
              @click="startCaptcha"
            >点击验证</div>
          </div>
          <div>
            <el-button
              :loading="loading"
              type="primary"
              size="medium"
              style="width: 100%"
              @click.native.prevent="handleLogin"
            >登 录</el-button>
          </div>
        </el-form>
      </div>
    </div>

  </div>
</template>

<script>
import { validateUsername, validatePassword } from '@/utils/validator'
import Vcode from 'vue-puzzle-vcode'
import { TipsBox } from '@/utils/feedback'
export default {
  name: 'Login',
  components: {
    Vcode
  },
  data() {
    return {
      bgImage: require('@/assets/login/loginbg.png'),
      loginForm: {
        userName: '',
        password: ''
      },
      loginRules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined,
      isShow: false,
      captcha: false
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    formataJson(params) {
      const formData = new FormData()
      Object.keys(params).forEach((key) => {
        formData.append(key, params[key])
      })
      return formData
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          if (!this.captcha) {
            TipsBox('warning', '验证码未通过')
            return false
          }
          this.loading = true
          const parmas = `userName=${this.loginForm.userName}&password=${this.loginForm.password}`
          this.$store.dispatch('user/login', parmas).then(() => {
            this.$router.push({ path: this.redirect || '/' })
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    startCaptcha() {
      this.isShow = true
    },

    onSuccess(msg) {
      this.isShow = false // 通过验证后，需要手动关闭模态框
      this.captcha = true
    },

    onFail(e) {
      this.captcha = false
    },

    onClose() {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #fff;
$light_gray: #333;
$cursor: #333;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  .sub{
    background-size: 100%;
  background-repeat: no-repeat;
  background-position: center;
  }
  .sub2{
    width: 984px;
    height: 583px;
    background-size: 50%;
  background-repeat: no-repeat;
  background-position: left;
  }
  .el-input {
    display: inline-block;
    height: 47px;
    border-bottom: 1px solid #eee;

    input {
      background: transparent;
      border: 0px;
      border-bottom: 1px solid #eee;
      -webkit-appearance: none;
      border-radius: 0px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: grb(172,169,179);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
// $bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.bg {
  background-size: 110%;
  background-repeat: no-repeat;
  background-position: center;
}

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
.login-main {
  width: 428px;
    position: relative;
    float: left;
}
.login-top {
  height: 117px;
    background-color: #148be4;
    border-radius: 12px 12px 0 0;
    font-family: SourceHanSansCN-Regular;
    font-size: 30px;
    font-weight: 400;
    font-stretch: normal;
    letter-spacing: 0;
    color: #fff;
    line-height: 117px;
    text-align: center;
    overflow: hidden;
}
  .login-form {
    width: 428px;
    background: #fff;
    border-radius: 0 0 12px 12px;
    padding: 53px;
  }

  .tips {
    font-size: 14px;
    color: #889aa4;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
    color: #333
  }
}
</style>
