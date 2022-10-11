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
    />
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
import { getList } from '@/utils'
import { GetGroupPageList } from '@/api/retrievalNumber'
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
          label: '序号',
          value: 'xh',
          show: true,
          type: 'text'
        },
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
          onlyHasPhone: false // 是否有电话
        },
        {
          label: '可联系人数',
          value: 'hasPhoneCount',
          show: true,
          type: 'router',
          path: 'peopleNumber',
          onlyHasPhone: true
        },
        {
          label: '提取时间',
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
        groupQQ: '',
        groupName: ''
      },
      searchForm: {
        show: true,
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            type: 'input',
            label: '群名',
            labelShow: false,
            name: 'groupName'
          },
          {
            type: 'input',
            label: 'QQ群',
            labelShow: false,
            name: 'groupQQ'
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
      getList(this, GetGroupPageList, this.listQuery)
    },
    operateEmit2() {
      this.dialogFormVisible = true
    },
    dialogFormVisibleEmit(v) {
      this.dialogFormVisible = v
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
