<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :button-group="buttonGroup"
      :search-form="searchForm"
      @operateEmit2="operateEmit2"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    >
      <template v-slot:userStatus="scope">
        <el-tag :type="scope.row.userStatus === 0 ? 'success' : 'danger'" style="cursor:pointer;" @click="changeStatus(scope.row)">
          {{ scope.row.userStatus === 0 ? '已启用' : '已禁用' }}
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
  </div>
</template>
<script>
import DataForm from '@/views/userManagement/components/dataForm.vue'
import PasswordForm from '@/views/userManagement/components/passwordForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { AddUser, GetUserPageList, ChangeUserStauts, UpdatePassword } from '@/api/userManagement'
import { TipsBox } from '@/utils/feedback.js'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
export default {
  name: 'UserManagement',
  components: { BasicTable, Pagination, DataForm, PasswordForm },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
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
        password: ''
      },
      passwordtemp: {
        newPassword: '',
        userId: ''
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
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
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
        password: ''
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
    getPageList() {
      this.loading = false
      getList(this, GetUserPageList, this.listQuery)
    }
  }
}
</script>
