<template>
  <div class="app-container">
    <div style="display: flex;flex-direction: row;justify-content: space-between; ">
      <div style="display: flex;flex-direction: row;justify-content: space-between;">
        <search-form
          :search-form="searchForm"
          @searchFormEmit="searchFormEmit"
        />
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between; height: 40px; margin-bottom: 20px;">
        <el-button type="" icon="el-icon-refresh" style="margin-right: 10px; margin-left: 10px;" @click="getPageList()" />
      </div>
    </div>
    <el-row :gutter="20" style="display: flex;align-items: center;">
      <el-col v-for="(item, index) in tableData" :key="index" :span="5">
        <el-badge :value="isDraw?'提':''" type="primary">
          <el-card :body-style="{ padding: '0px' }" shadow="hover">
            <el-row>
              <el-col :span="8"> <img :src="cardImage" class="image" style="width: 100%;height: auto;padding: 10px;"></el-col>
              <el-col :span="14">
                <div class="card-content">
                  <div class="card-contents"><span style="color: #303133;">名称：</span>{{ item.groupName }}</div>
                  <div class="card-contents"><span style="color: #303133;">人数：</span>{{ item.groupOwnerQq }}</div>
                  <div class="card-contents"><span style="color: #303133;">QQ群号：</span>{{ item.groupQq }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-badge>
      </el-col>
    </el-row>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import { GetGroupPageList } from '@/api/retrievalNumber'
export default {
  name: 'RetrievalNumber',
  components: { Pagination, SearchForm },
  data() {
    return {
      cardImage: require('@/assets/head.png'),
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        groupQQ: '',
        groupName: ''
      },
      isDraw: true,
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'input',
            label: '名称',
            labelShow: false,
            name: 'groupName'
          },
          {
            show: true,
            type: 'input',
            label: 'QQ群',
            labelShow: false,
            name: 'groupQQ'
          }
        ]
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    searchFormEmit(v) {
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
        }
      })
    }
  }
}
</script>
<style scoped>
.card-box{
  display: flex;
}
.card-content{
  padding: 10px;
  font-size: 15px;
}
.card-contents{
  margin-bottom: 4px;
  color: #999;
   /* white-space: nowrap; */
  display: inline-block;
  width: 100%;
  /* overflow: hidden;
  text-overflow:ellipsis; */
}
</style>
