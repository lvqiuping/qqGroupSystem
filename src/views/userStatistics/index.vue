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
    />
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import Pagination from '@/components/BasicTable/Pagination.vue'
import BasicTable from '@/components/BasicTable/index.vue'
import { GetAdminStatsUserDrawPageList } from '@/api/userStatistics'
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
          label: 'ID',
          value: 'userId',
          show: true,
          type: 'text'
        },
        {
          label: '用户',
          value: 'userName',
          show: true,
          type: 'text'
        },
        {
          label: 'QQ群',
          value: 'groupCount',
          show: true,
          type: 'router',
          path: '/retrievalNumber/retrievalNumber',
          params: {
            createUserName: 'userName'
          }
        },
        {
          label: '群人数',
          value: 'memeberCount',
          show: true,
          type: 'text'
          // type: 'router',
          // path: '/retrievalNumber/peopleNumber',
          // query: {
          //   onlyHasPhone: false // 是否有电话,必须参数,
          // },
          // params: {
          //   createUserName: 'userName'
          // }
        },
        {
          show: true,
          label: '可联系人数',
          value: 'memberWithPhoneCount',
          type: 'text'
          // type: 'router',
          // path: 'peopleNumber',
          // query: {
          //   onlyHasPhone: true // 是否有电话,必须参数,
          // },
          // params: {
          //   groupQQ: 'groupQq'
          // }
        }
      ],
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        userName: '',
        beginTime: '',
        endTime: ''
      },
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'date',
            label: '时间',
            labelShow: false,
            name: 'userStatisticsTime'
          },
          {
            show: true,
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
      if (v.userStatisticsTime) {
        this.listQuery.beginTime = v.userStatisticsTime[0]
        this.listQuery.endTime = v.userStatisticsTime[1]
      }
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = false
      getList(this, GetAdminStatsUserDrawPageList, this.listQuery)
    }
  }
}
</script>
