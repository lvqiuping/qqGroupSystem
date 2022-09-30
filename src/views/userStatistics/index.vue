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
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetUserPageList } from '@/api/userManagement'
import { getList } from '@/utils'
export default {
  name: 'UserStatistics',
  components: { BasicTable, Pagination },
  data() {
    return {
      buttonGroup: {
        show: false,
        expend: true,
        title: '表格筛选',
        size: 'default'
      },
      loading: false,
      tableTitle: [
        {
          label: '用户',
          value: 'id',
          show: true,
          type: 'text'
        },
        {
          label: '群数量',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ成员数量',
          value: 'realName',
          show: true,
          type: 'text'
        },
        {
          label: '已获得手机号',
          value: 'createOn',
          show: true,
          type: 'text'
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        userName: ''
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
    }
  }
}
</script>
