<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :search-form="searchForm"
      :button-group="buttonGroup"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
      @operateEmit2="operateEmit2"
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <el-dialog :title="'提取'" :visible.sync="dialogFormVisible" top="3%">
      <div>
        <data-form
          @dialogFormVisibleEmit="dialogFormVisibleEmit"
        />
      </div>
    </el-dialog>
  </div>
</template>
<script>
import DataForm from '@/views/retrievalNumber/components/dataForm.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'
import { GetUserPageList } from '@/api/userManagement'
export default {
  name: 'RetrievalNumber',
  components: { BasicTable, Pagination, DataForm },
  data() {
    return {
      dialogFormVisible: false,
      dialogPasswordVisible: false,
      loading: false,
      excelData: [],
      tableTitle: [
        {
          label: 'QQ群',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: '所属QQ',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: '人数',
          value: 'userName',
          show: true,
          type: 'router',
          path: 'peopleNumber'
        },
        {
          label: '手机号',
          value: 'userName',
          show: true,
          type: 'router',
          path: 'phoneNumber'
        },
        {
          label: '提取时间',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: '状态',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: '操作',
          show: true,
          type: 'options',
          options: [
            {
              text: '导出',
              icon: 'el-icon-upload2',
              type: 'success',
              clickEvent: (row) => {
                console.log(row)
                this.downloadExcel()
              }
            },
            {
              text: '删除',
              icon: 'el-icon-delete',
              type: 'danger',
              clickEvent: (row) => {
                console.log(row)
                QueryBox().then(() => {
                  const params = `userIds=${row.id}`
                  this.del(params)
                })
                  .catch(err => { console.error(err) })
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
        UserName: '',
        RealName: '',
        Pwd: ''
      },
      searchForm: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            type: 'input',
            label: '用户名',
            labelShow: false,
            name: 'userName'
          }
        ]
      },
      buttonGroup: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            text: '提取',
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
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = false
      getList(this, GetUserPageList, this.listQuery)
    },
    // 导出
    downloadExcel() {
      QueryBox('将导出为excel文件，确认导出?').then(() => {
        this.excelData = this.tableData
        this.export2Excel(this.excelData, this.tableTitle, 'hao')
      }).catch(() => {

      })
    },
    export2Excel(tData, tTitle, tName) {
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/excel/export2Excel') // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [] // 导出的excel的表头字段名称
        const filterVal = [] // 对象属性，对应于tHeader
        tTitle.forEach((item) => {
          tHeader.push(item.label)
          filterVal.push(item.value)
        })
        const list = this.excelData // json数组对象，接口返回的数据
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, tName)// 导出的表格名称
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    },
    operateEmit2() {
      this.dialogFormVisible = true
    },
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
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
