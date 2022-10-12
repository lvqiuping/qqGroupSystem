<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :multiple-table="false"
      :search-form="searchForm"
      :button-group="buttonGroup"
      @operateEmit2="operateEmit2"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetGroupMemberPageList, ExportAllGroupMembers } from '@/api/retrievalNumber'
import { getList } from '@/utils'
import { QueryBox } from '@/utils/feedback'

export default {
  name: 'PeopleNumber',
  components: { BasicTable, Pagination },
  data() {
    return {
      loading: false,
      buttonGroup: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        type: 'success',
        selected: false,
        fields: [
          {
            text: '导出本页',
            icon: 'el-icon-upload2',
            type: 'one'
          },
          {
            text: '导出全部',
            icon: 'el-icon-upload2',
            type: 'all'
          }
        ]
        // selectList: [
        //   { type: 'one' },
        //   { type: 'all' },
        //   { type: 'allqq' },
        //   { type: 'allphone' }
        // ]
      },
      searchForm: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            type: 'input',
            label: 'QQ',
            labelShow: false,
            name: 'qq'
          },
          {
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
          label: '群号',
          value: 'groupQq',
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
          label: '号码属地',
          value: 'phonediqu',
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
          label: '加入时间',
          value: 'joinTime',
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
      }
    }
  },
  created() {
    this.listQuery.onlyHasPhone = this.$route.query.onlyHasPhone
    this.listQuery.groupQQ = this.$route.query.groupQQ
    this.getPageList()
  },
  methods: {
    searchFormEmit2(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = true
      getList(this, GetGroupMemberPageList, this.listQuery)
    },
    operateEmit2(v) {
      console.log(v)
      console.log(this.listQuery)
      this.downloadExcel(v)
    },
    // 导出
    downloadExcel(v) {
      QueryBox('将导出为excel文件，确认导出?').then(() => {
        if (v === 'one') {
          this.excelData = this.tableData
          this.export2Excel(this.excelData, this.tableTitle, '导出群成员')
        } else if (v === 'all') {
          const params = `groupQQ=${this.listQuery.groupQQ}&onlyHasPhone=${this.listQuery.onlyHasPhone}`
          ExportAllGroupMembers(params).then((res) => {
            console.log('导出的数据', res)
            this.excelData = res.data
            this.export2Excel(this.excelData, this.tableTitle, '导出群成员')
          })
        }
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
    }
  }
}
</script>
