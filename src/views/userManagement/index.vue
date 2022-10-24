<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :button-group="buttonGroup"
      :search-form="searchForm"
      :multiple-table="false"
      @operateEmit2="operateEmit2"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    >
      <template v-slot:userStatus="scope">
        <el-tag :type="scope.row.userStatus === 0 ? 'success' : 'danger'" style="cursor:pointer;" @click="changeStatus(scope.row)">
          {{ scope.row.userStatus === 0 ? '已启用' : '已禁用' }}
        </el-tag>
      </template>
      <template v-slot:drawGroupUpLimit="scope">
        <el-tag :type="'primary'" style="cursor:pointer;" @click="clickUpLimit(scope.row)">
          {{ scope.row.drawGroupUpLimit }}
        </el-tag>
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <el-dialog :title="'新增'" :visible.sync="dialogFormVisible" top="3%">
      <div class="el-dialog-div">
        <data-form
          :loading="loading"
          :temp="temp"
          @createDataEmit="createDataEmit"
          @dialogFormVisibleEmit="dialogFormVisibleEmit"
        />
      </div>
    </el-dialog>
    <el-dialog :title="'修改密码'" :visible.sync="dialogPasswordVisible" top="3%">
      <div class="el-dialog-div">
        <password-form
          :passwordtemp="passwordtemp"
          @createPassword="createPassword"
          @dialogPasswordVisibleEmit="dialogPasswordVisibleEmit"
        />
      </div>
    </el-dialog>
    <el-dialog :title="'修改上限'" :visible.sync="dialogUpdateUpLimit" top="3%">
      <div class="el-dialog-div">
        <up-limit-form
          :up-limittemp="upLimittemp"
          @dialogUpdateUpLimitEmit="dialogUpdateUpLimitEmit"
          @createUpLimit="createUpLimit"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import DataForm from '@/components/DataForm/index.vue'
import DataForm from '@/views/userManagement/components/dataForm.vue'
import PasswordForm from '@/views/userManagement/components/passwordForm.vue'
import UpLimitForm from '@/views/userManagement/components/upLimitForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { AddUser, GetUserPageList, ChangeUserStauts, UpdatePassword, UpdateDrawGroupUpLimit } from '@/api/userManagement'
import { TipsBox } from '@/utils/feedback.js'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
export default {
  name: 'UserManagement',
  components: { BasicTable, Pagination, DataForm, PasswordForm, UpLimitForm },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
      dialogUpdateUpLimit: false,
      loading: false,
      tableTitle: [
        {
          label: 'ID',
          value: 'id',
          show: true,
          type: 'text'
        },
        {
          label: '用户名',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: '真实姓名',
          value: 'realName',
          show: true,
          type: 'text'
        },
        {
          label: '状态',
          value: 'userStatus',
          show: true,
          type: 'slot',
          slot: 'userStatus'
        },
        {
          label: '上限',
          value: 'drawGroupUpLimit',
          show: true,
          // type: 'text'
          type: 'slot',
          slot: 'drawGroupUpLimit'
        },
        {
          label: '创建时间',
          value: 'createOn',
          show: true,
          type: 'text'
        },
        {
          label: '操作',
          show: true,
          type: 'options',
          options: [
            {
              text: '修改密码',
              icon: 'el-icon-edit',
              type: 'success',
              clickEvent: (row) => {
                this.resetPasswordtemp()
                this.dialogPasswordVisible = true
                this.passwordtemp.userId = row.id
              }
            }
            // {
            //   text: '上限',
            //   icon: 'el-icon-edit',
            //   type: 'success',
            //   clickEvent: (row) => {
            //     // this.resetPasswordtemp()
            //     this.dialogUpdateUpLimit = true
            //     this.upLimittemp.userId = row.id
            //   }
            // }
          ]
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
      },
      temp: {
        userName: '',
        realName: '',
        password: '',
        num: 10
      },
      passwordtemp: {
        newPassword: '',
        userId: ''
      },
      upLimittemp: {
        userId: '',
        newUpLimit: 0
      },
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'input',
            label: '用户名',
            labelShow: false,
            name: 'userName'
          }
        ]
      },
      buttonGroup: {
        expend: true,
        show: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            showButtonGroup: true,
            text: '添加',
            icon: 'el-icon-check'
          }
        ]
      }
      // dataFormTemp: {
      //   fields: [
      //     {
      //       show: true,
      //       type: 'input',
      //       label: '用户名',
      //       labelShow: false,
      //       name: 'userName'
      //     }
      //   ]
      // }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    clickUpLimit(row) {
      this.dialogUpdateUpLimit = true
      this.upLimittemp.userId = row.id
      this.upLimittemp.newUpLimit = row.drawGroupUpLimit
    },
    dialogUpdateUpLimitEmit(v) {
      this.dialogUpdateUpLimit = v
    },
    changeStatus(v) {
      if (v.id === 1) {
        TipsBox('error', '不允许更改超级管理员信息')
        return
      }
      QueryBox('是否修改用户状态').then(() => {
        if (v.userStatus === 1) {
          v.userStatus = 0
        } else if (v.userStatus === 0) {
          v.userStatus = 1
        }
        const params = `userId=${v.id}&status=${v.userStatus}`
        ChangeUserStauts(params).then((res) => {
          this.loading = true
          if (res.statusCode === 200) {
            this.loading = false
            TipsBox('success', res.data)
            this.getPageList()
          }
        })
      })
    },
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    dialogPasswordVisibleEmit(v) {
      this.dialogPasswordVisible = v
    },
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    operateEmit2() {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        userName: '',
        realName: '',
        password: '',
        num: 10
      }
    },
    resetPasswordtemp() {
      this.passwordtemp = {
        newPassword: '',
        userId: ''
      }
    },
    createDataEmit(v) {
      AddUser(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogFormVisible = false
          this.getPageList()
        } else if (res.statusCode === 500) {
          this.loading = false
          TipsBox('success', res.errors)
        }
      })
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
    createUpLimit(v) {
      UpdateDrawGroupUpLimit(v).then((res) => {
        this.loading = true
        if (res.statusCode === 200) {
          this.loading = false
          TipsBox('success', res.data)
          this.dialogUpdateUpLimit = false
          this.getPageList()
        }
      })
    },
    getPageList() {
      this.loading = false
      getList(this, GetUserPageList, this.listQuery)
    }
  }
}
</script>
