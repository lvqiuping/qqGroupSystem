<template>
  <div class="app-container">
    <basic-table
      :table-title="tableTitle"
      :table-data="tableData"
      :loading="loading"
      :height="400"
      :search-form="searchForm"
      @refresh="getPageList()"
      @searchFormEmit2="searchFormEmit2"
    />
<!-- :search-form="searchForm"  -->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetGroupMembers } from '@/api/retrievalNumber'

export default {
  name: 'MemsTable',
  components: { BasicTable, Pagination },
  props: {
    // eslint-disable-next-line vue/prop-name-casing
    MembersList: { type: Array, default: Array },
    listQuery: { type: Object, default: Object }
  },
  data() {
    return {
      loading: false,
      searchForm: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            type: 'input',
            label: '搜索qq群',
            labelShow: false,
            name: 'qq'
          }
        ]
      },
      tableTitle: [
        {
          label: '成员',
          value: 'groupEntry',
          show: true,
          type: 'text'
        },
        {
          label: '群昵称',
          value: 'nick',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ号',
          value: 'qq',
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
          label: 'Q龄',
          value: 'qAge',
          show: true,
          type: 'text'
        },
        {
          label: '入群时间',
          value: 'join_time',
          show: true,
          type: 'text'
        },
        {
          label: '最后发言',
          value: 'lastSpeakTime',
          show: true,
          type: 'text'
        }
      ],
      total: 0,
      tableData: []
    }
  },
  created() {
    this.getMems()
  },
  methods: {
    getMems() {
      console.log('参数', this.listQuery)
      GetGroupMembers(this.listQuery).then((res) => {
        console.log('成员', JSON.parse(res.data))
        var d = JSON.parse(res.data)
        if (d.code === 200) {
          this.loading = false
          this.tableData = d.data.mems
          this.total = d.data.count
        }
      })
    },
    // 获取表格数据分页
    getPageList() {
      this.loading = true
      this.getMems()
    },
    // sousuo
    searchFormEmit2() {
      // this.listQuery.pageIndex = 1
      // this.listQuery = Object.assign({}, this.listQuery, this.temp)
      // this.getPageList()
    }

  }
}
</script>
