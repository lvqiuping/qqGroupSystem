<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :operates="operates"
      :multiple-table="false"
      :batch-deleted-button="false"
      :search-form="'user'"
      :operates-width="280"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { getUserList, DisableUser, EnableUser, UpdatePassword, DeleteUsers } from '@/api/user'
import { TipsBox } from '@/utils/feedback.js'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
export default {
  name: 'SystemUser',
  components: { BasicTable, Pagination },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
      loading: false,
      operates: {
        operate: true,
        label: '操作'
      },
      tableTitle: [
        {
          label: '成员名字',
          value: 'group',
          show: true,
          type: 'text'
        },
        {
          label: '手机号码',
          value: 'group',
          show: true,
          type: 'text'
        },
        {
          label: '状态',
          value: 'createUserName',
          show: true,
          type: 'text'
        },
        {
          label: '操作',
          value: 'createOn',
          show: true,
          type: 'options',
          options: [
            {
              text: '导出',
              icon: 'el-icon-upload2',
              type: 'success',
              clickEvent: (row) => {
                console.log(row)
              }
            },
            {
              text: '删除',
              icon: 'el-icon-delete',
              type: 'danger',
              clickEvent: (row) => {
                console.log(row)
              }
            }

          ]
        }
      ],
      tableData: [
        { group: '123456', userName: 'lqp', realName: '1', roleName: '134500', createUserName: '2020-12-12', createOn: '结束' }
      ],
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10
      },
      temp: {
        UserName: '',
        RealName: '',
        Pwd: ''
      },
      passwordtemp: {
        newPassword: '',
        userId: ''
      }
    }
  },
  created() {
    // this.user = this.$store.state.user
    // this.getPageList()
  },
  methods: {
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
    },
    dialogPasswordVisibleEmit(v) {
      this.dialogPasswordVisible = v
    },
    // sousuo
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    // add
    handleCreate() {
      this.resetTemp()
      this.dialogFormVisible = true
    },
    resetTemp() {
      this.temp = {
        UserName: '',
        RealName: '',
        Pwd: ''
      }
    },
    resetPasswordtemp() {
      this.passwordtemp = {
        newPassword: '',
        userId: ''
      }
    },
    createDataEmit(v) {
      // createUser(v).then((res) => {
      //   this.loading = true
      //   if (res.statusCode === 200) {
      //     this.loading = false
      //     TipsBox('success', res.data)
      //     this.dialogFormVisible = false
      //     this.getPageList()
      //   }
      // })
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
    // 获取表格数据
    getPageList() {
      this.loading = true
      getList(this, getUserList, this.listQuery)
    },
    // 操作列按钮
    handleOperation(op, row) {
      if (op.types === 'usering') {
        QueryBox('是否启用此用户').then(() => {
          const params = `userId=${row.id}`
          EnableUser(params).then((res) => {
            this.loading = true
            if (res.statusCode === 200) {
              this.loading = false
              TipsBox('success', res.data)
              this.getPageList()
            }
          })
        })
          .catch(err => { console.error(err) })
      } else if (op.types === 'disable') {
        QueryBox('是否禁用此用户').then(() => {
          const params = `userId=${row.id}`
          DisableUser(params).then((res) => {
            this.loading = true
            if (res.statusCode === 200) {
              this.loading = false
              TipsBox('success', res.data)
              this.getPageList()
            }
          })
        })
          .catch(err => { console.error(err) })
      } else if (op.types === 'password') {
        this.dialogPasswordVisible = true
        this.resetPasswordtemp()
        this.passwordtemp.userId = row.id
      } else if (op.types === 'del') {
        QueryBox().then(() => {
          const params = `userIds=${row.id}`
          this.del(params)
        })
          .catch(err => { console.error(err) })
      }
    },
    del(p) {
      DeleteUsers(p).then(response => {
        if (response.statusCode === 200) {
          TipsBox('success', response.data)
          this.getPageList()
        }
      })
    }
  }
}
</script>
