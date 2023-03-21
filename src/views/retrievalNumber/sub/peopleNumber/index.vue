<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :search-form="searchForm"
      :button-group="isAdmin === 'true' || isExportUnCodedPhone === '1' ? buttonGroup : buttonGroup2"
      :multiple-table="false"
      @operateEmit2="operateEmit2"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
      @batchDeleted="batchDeleted"
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <el-dialog :visible.sync="dialogFormExport" center>
      <export-form :form-export="formExport" :is-select="isSelect" @getOperateEmit2="getOperateEmit2" @dialogFormExportEmit="dialogFormExportEmit" />
    </el-dialog>
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetGroupMemberPageList, ExportAllGroupMembers, DeleteMembers } from '@/api/retrievalNumber'
import { getList, export2Excel, exportCsv } from '@/utils'
import { QueryBox, TipsBox } from '@/utils/feedback'
import ExportForm from './exportForm.vue'
import Cookies from 'js-cookie'
export default {
  name: 'PeopleNumber',
  components: { BasicTable, Pagination, ExportForm },
  data() {
    return {
      dialogFormExport: false,
      isSelect: 2,
      formExport: {
        qq: '',
        phone: ''
      },
      loading: false,
      buttonGroup: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            text: '导出',
            icon: 'el-icon-upload2',
            type: 'success',
            operateType: 'export',
            selected: true,
            selectList: [
              { title: '当前页', value: 0 },
              { title: '所有页', value: 1 },
              { title: '输入QQ', value: 2 },
              { title: '输入号码', value: 3 }
            ]
          },
          {
            text: '批量删除',
            icon: 'el-icon-delete',
            type: 'danger',
            operateType: 'del',
            showButtonGroup: false
          }
        ]

      },
      buttonGroup2: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            text: '导出全部',
            icon: 'el-icon-upload2',
            type: 'success',
            operateType: 'export',
            showButtonGroup: true
          }
        ]
      },
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'input',
            label: 'QQ',
            labelShow: false,
            name: 'qq'
          },
          {
            show: true,
            type: 'input',
            label: '号码',
            labelShow: false,
            name: 'phone'
          }
        ]
      },
      tableTitle: [
        {
          label: '昵称',
          value: 'nickName',
          show: true,
          type: 'text'
        },
        {
          label: '群昵称',
          value: 'groupNickName',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ',
          value: 'qq',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ龄',
          value: 'qage',
          show: true,
          type: 'text'
        },
        {
          label: '性别',
          value: 'sex',
          show: true,
          type: 'text'
        },
        {
          label: '号码',
          value: 'phone',
          show: true,
          type: 'text'
        },
        {
          label: '号码属地',
          value: 'phonediqu',
          show: true,
          type: 'text'
        },
        {
          label: '群号',
          value: 'groupQq',
          show: true,
          type: 'text'
        },
        {
          label: '最后发言时间',
          value: 'lastSpeakTime',
          show: true,
          type: 'text'
        },
        {
          label: '创建时间',
          value: 'createOn',
          show: true,
          type: 'text'
        }
      ],
      tableData: [],
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        qq: '',
        phone: ''
      },
      selectDate: [],
      isExportUnCodedPhone: '0',
      isAdmin: 'false'
    }
  },
  created() {
    this.listQuery.onlyHasPhone = this.$route.query.onlyHasPhone
    this.listQuery.groupQQ = this.$route.query.groupQQ
    this.getPageList()
    this.isAdmin = Cookies.get('isAdmin')
    this.isExportUnCodedPhone = Cookies.get('isExportUnCodedPhone')
  },
  methods: {
    dialogFormExportEmit(v) {
      this.dialogFormExport = v
    },
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = true
      getList(this, GetGroupMemberPageList, this.listQuery)
    },
    batchDeleted(v) {
      this.selectDate = v
    },
    operateEmit2(v) {
      if (v.operateType === 'export') {
        if (v === 2) {
          this.dialogFormExport = true
          this.isSelect = 2
          this.resetFormExport()
        } else if (v === 3) {
          this.dialogFormExport = true
          this.isSelect = 3
          this.resetFormExport()
        } else {
          this.downloadExcel(v)
        }
      }
      if (v === 'export') {
        this.downloadExcel(9)
      }
      if (v === 'del') {
        const params = this.selectDate
        if (!params.length) {
          TipsBox('warning', '请选择要删除的数据')
          return
        } else {
          QueryBox().then(() => {
            const a = []
            params.forEach((item) => {
              a.push(item.id)
            })
            DeleteMembers(a).then((res) => {
              if (res.statusCode === 200) {
                TipsBox('success', res.data)
                this.getPageList()
              }
            })
          })
        }
      }
    },
    resetFormExport() {
      this.formExport = {
        qq: '',
        phone: ''
      }
    },
    getOperateEmit2(v) {
      this.listQuery.qq = v.qq
      this.listQuery.phone = v.phone
      this.dialogFormExport = false
      this.downloadExcel()
    },
    downloadExcel(v) {
      QueryBox('确认导出文件?').then(() => {
        if (v === 0) {
          // 当前页是数据库前面的1001条数据，所有页是数据库的所有
          this.excelData = this.tableData
          export2Excel(this.excelData, this.tableTitle, '导出群成员')
        } else {
          const params = `groupQQ=${this.listQuery.groupQQ}&onlyHasPhone=${this.listQuery.onlyHasPhone}&qq=${this.listQuery.qq}&phone=${this.listQuery.phone}`
          ExportAllGroupMembers(params).then((res) => {
            if (v === 9) {
              // 加密文件存为csv文件
              this.excelData = res.data
              exportCsv(this.excelData, '导出群成员.csv')
            } else {
              this.excelData = res.data
              export2Excel(this.excelData, this.tableTitle, '导出群成员')
            }
          })
        }
      }).catch(() => {

      })
    }
  }
}
</script>
