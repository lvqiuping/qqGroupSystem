<template>
  <div v-show="top" class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />
    <div class="right-menu">
      <div style="margin-right: 10px;">{{ userName }}</div>
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">注销</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="changePassword">
            <span style="display:block;">修改密码</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <el-dialog :title="'修改密码'" :visible.sync="dialogPasswordVisible" top="3%">
      <div class="el-dialog-div">
        <password-form
          :passwordtemp="passwordtemp"
          @createPassword="createPassword"
          @dialogPasswordVisibleEmit="dialogPasswordVisibleEmit"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import PasswordForm from '@/views/userManagement/components/passwordForm.vue'
import { UpdatePassword } from '@/api/userManagement'
import { TipsBox } from '@/utils/feedback.js'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    PasswordForm
  },
  data() {
    return {
      top: true,
      dialogPasswordVisible: false,
      passwordtemp: {
        newPassword: '',
        userId: ''
      }

    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'userName',
      'userId'
    ])
  },
  watch: {
    $route(to, from) {
      if (to.fullPath === '/dashboard' || to.fullPath === '/') {
        this.top = false
      } else {
        this.top = true
      }
    }
  },
  created() {
    if (this.$route.fullPath === '/dashboard' || this.$route.fullPath === '/') {
      this.top = false
    } else {
      this.top = true
    }
  },
  methods: {
    changePassword() {
      this.resetTemp()
      this.passwordtemp.userId = this.userId
      this.dialogPasswordVisible = true
    },
    resetTemp() {
      this.passwordtemp = {
        newPassword: '',
        userId: ''
      }
    },
    createPassword(v) {
      UpdatePassword(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogPasswordVisible = false
          this.getPageList()
        }
      })
    },
    dialogPasswordVisibleEmit(v) {
      this.dialogPasswordVisible = v
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    display: flex;
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
