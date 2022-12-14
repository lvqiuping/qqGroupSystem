<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :search-form="searchForm"
      :button-group="buttonGroup"
      :multiple-table="false"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
      @operateEmit2="operateEmit2"
      @batchDeleted="batchDeleted"
    >
      <template v-slot:memberUpdateStatus="scope">
        <el-tag :type="scope.row.memberUpdateStatus? 'success' : 'danger'">{{ scope.row.memberUpdateStatus ? '已完成': '进行中' }}</el-tag>
      </template>
    </basic-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <div>
      <el-dialog
        :title="'提取'"
        :visible.sync="dialogFormVisible"
        top="3%"
      >
        <div class="container-box">
          <data-form
            @dialogFormVisibleEmit="dialogFormVisibleEmit"
          />
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import DataForm from '@/views/retrievalNumber/components/dataForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetGroupPageList, GetUpdateMemberStatus, DeleteGroups } from '@/api/retrievalNumber'
import Cookies from 'js-cookie'
import { QueryBox, TipsBox } from '@/utils/feedback'

export default {
  name: 'RetrievalNumber',
  components: { BasicTable, Pagination, DataForm },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
      loading: false,
      isAdmin: false,
      excelData: [],
      tableTitle: [
        {
          label: '群名',
          value: 'groupName',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ群',
          value: 'groupQq',
          show: true,
          type: 'text'
        },
        {
          label: '所属QQ',
          value: 'masterQq',
          show: true,
          type: 'text'
        },
        {
          label: '群主',
          value: 'groupOwnerQq',
          show: true,
          type: 'text'
        },
        {
          label: '群人数',
          value: 'groupMemberCount',
          show: true,
          type: 'router',
          path: 'peopleNumber',
          query: {
            onlyHasPhone: false // 是否有电话,必须参数,
          },
          params: {
            groupQQ: 'groupQq'
          }
        },
        {
          label: '可联系人数',
          value: 'memberWithPhoneCount',
          show: true,
          type: 'router',
          path: 'peopleNumber',
          query: {
            onlyHasPhone: true // 是否有电话,必须参数,
          },
          params: {
            groupQQ: 'groupQq'
          }
        },
        {
          label: '状态',
          value: 'memberUpdateStatus',
          show: true,
          type: 'slot',
          slot: 'memberUpdateStatus'
        },
        {
          label: '提取人', // 这个必须排在index=7的位置
          value: 'createUserName',
          show: true,
          type: 'text'
        },
        {
          label: '提取时间',
          value: 'createOn',
          show: true,
          type: 'text'
        }
      ],
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'input',
            label: '群名',
            labelShow: false,
            name: 'groupName'
          },
          {
            show: true,
            type: 'input',
            label: 'QQ群',
            labelShow: false,
            name: 'groupQQ'
          },
          {
            show: true, // 这个必须排在index=2的位置
            type: 'input',
            label: '提取人',
            labelShow: false,
            name: 'createUserName'
          },
          {
            show: true,
            type: 'select',
            label: '状态',
            labelShow: false,
            name: 'status',
            options: [
              { label: '全部', value: '' },
              { label: '已完成', value: true },
              { label: '进行中', value: false }
            ]
          }
        ]
      },
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        groupQQ: '',
        groupName: '',
        status: ''
      },

      buttonGroup: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            showButtonGroup: true,
            text: '提取',
            icon: 'el-icon-check',
            operateType: 'add'
          },
          {
            showButtonGroup: false,
            text: '批量删除',
            icon: 'el-icon-delete',
            type: 'danger',
            operateType: 'del'
          }
        ]
      },
      selectDate: []
    }
  },
  mounted() {
    this.tableTitle[7].show = Cookies.get('isAdmin') === 'true'
    this.searchForm.fields[2].show = Cookies.get('isAdmin') === 'true'
  },
  created() {
    // debugger
    this.isAdmin = Cookies.get('isAdmin')
    if (this.$route.query) {
      this.temp = {
        createUserName: this.$route.query.createUserName
      }
      this.searchFormEmit2(this.temp)
    }
    this.getPageList()
  },
  beforeDestroy() {
    clearInterval(this.timer)
    this.timer = null
  },
  methods: {
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = true
      GetGroupPageList(this.listQuery).then(response => {
        if (response.statusCode === 200) {
          this.loading = false
          this.tableData = response.data.pageList
          this.total = response.data.totalRowCount
          // this.timer = setInterval(this.memberStatusParams, 3000)
        }
      })
    },
    memberStatusParams() {
      const that = this
      // 无痕更新某条数据
      this.tableData.forEach((item, index) => {
        if (!item.memberUpdateStatus) {
          GetUpdateMemberStatus({ groupQQ: item.groupQq }).then((res) => {
            if (res.statusCode === 200) {
              // that.tableData[index] = res.data 不能整条数据换掉，不然复选框会选不上
              that.tableData[index].memberWithPhoneCount = res.data.memberWithPhoneCount
              that.tableData[index].memberUpdateStatus = res.data.memberUpdateStatus
            }
          })
        }
      })
    },
    operateEmit2(v) {
      if (v === 'add') {
        this.dialogFormVisible = true
      } else if (v === 'del') {
        const params = this.selectDate
        if (!params.length) {
          TipsBox('warning', '请选择要删除的数据')
          return
        } else {
          QueryBox().then(() => {
            const a = []
            params.forEach((item) => {
              a.push(item.groupQq)
            })
            DeleteGroups(a).then((res) => {
              if (res.statusCode === 200) {
                TipsBox('success', res.data)
                this.getPageList()
              }
            })
          })
        }
      }
    },
    batchDeleted(v) {
      this.selectDate = v
    },
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
      this.listQuery = Object.assign({}, this.listQuery, this.listQuery)
      this.getPageList()
    },
    dialogPasswordVisibleEmit(v) {
      this.dialogPasswordVisible = v
    },
    handleCreate() {
      this.dialogFormVisible = true
    }
  }
}
</script>
<style scoped>
/* .container-box {
  max-height: 75vh;
  overflow-x: hidden;
} */
</style>
