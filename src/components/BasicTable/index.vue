<template>
  <div>
    <div style="display: flex;flex-direction: row;justify-content: space-between; ">
      <div v-if="leftButtonGroup" style="display: flex;flex-direction: row;justify-content: space-between;">
        <search-form
          :search-form="searchForm"
          @searchFormEmit="searchFormEmit"
        />
        <operation-button
          :button-group="buttonGroup"
          @operateEmit="operateEmit"
        />
      </div>
      <div v-if="rightButtonGroup" style="display: flex;flex-direction: row;justify-content: space-between; height: 40px; margin-bottom: 20px;">
        <el-button type="" icon="el-icon-refresh" style="margin-right: 10px; margin-left: 10px;" @click="refresh" />
        <el-popover
          placement="bottom"
          width="90"
          trigger="click"
        >
          <el-button slot="reference" type="" icon="el-icon-menu" />
          <div v-for="(item, index) in tableTitle" :key="index">
            <el-checkbox v-model="item.show" :label="item.label" size="large" />
          </div>
        </el-popover>
      </div>
    </div>
    <el-table
      v-if="showTable"
      ref="multipleTableRef"
      v-loading="loading"
      :data="tableData"
      :height="height"
      :row-class-name="rowClassName"
      :header-cell-style="headerCellStyle"
      style="width: 100%"
      border
      @selection-change="handleSelectionChange"
      @sort-change="sortChange"
    >
      <el-table-column v-if="multipleTable === true" type="selection" width="55" />
      <el-table-column
        v-for="(item, index) in tableTitle.filter(item2 => item2.show)"
        :key="index"
        :prop="item.value"
        :label="item.label"
        :sortable="item.sortable === true"
        align="center"
      >
        <template v-slot="scope">
          <div v-if="item.type == 'text'">
            {{ scope.row[item.value] }}
          </div>
          <div v-else-if="item.type == 'slot'">
            <slot :name="item.slot" :row="scope.row" :column="item.prop" :index="scope.$index" />
          </div>
          <div v-else-if="item.type == 'router'">
            <router-link :to="{path: item.path, query: { onlyHasPhone: item.onlyHasPhone, groupQQ: scope.row.groupQq } }" style="color: #409EFF">{{ scope.row[item.value] }}</router-link>
          </div>
          <div v-else-if="item.type == 'options'">
            <el-button
              v-for="(btn, btnKey) in item.options"
              :key="btnKey"
              :type="btn.type && btn.type !== '' ? btn.type: 'primary'"
              :icon="btn.icon ? btn.icon : ''"
              size="mini"
              @click="btn.clickEvent(scope.row)"
            >
              {{ btn.text }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import SearchForm from '@/components/SearchForm/index.vue'
import OperationButton from '@/components/OperationButton/index.vue'
export default {
  name: 'BasicTable',
  components: { SearchForm, OperationButton },
  props: {
    // 基本
    tableTitle: { type: Array, default: Array },
    tableData: { type: Array, default: Array },
    multipleTable: { type: Boolean, default: true },
    pagination: { type: Boolean, default: true },
    showTable: { type: Boolean, default: true },
    loading: { type: Boolean, default: false },
    height: { type: Number, default: null },
    // eslint-disable-next-line vue/require-valid-default-prop
    headerCellStyle: { type: Object, default: function() {
      return { background: '#f5f7fa' }
    } },
    // 特别操作
    searchForm: { type: Object, default: null },
    isShowGroup: { type: Boolean, default: true },
    buttonGroup: { type: Object, default: null },
    leftButtonGroup: { type: Boolean, default: true },
    rightButtonGroup: { type: Boolean, default: true }

  },
  data() {
    return {
      selectDate: [],
      selectTableData: [],
      total: 0,
      b_data: {},
      temp: {
        orderBy: ''
      }
    }
  },
  methods: {
    rowClassName({ row, rowIndex }) {
      row.xh = rowIndex + 1
    },
    sortChange({ column, prop, order }) {
      if (order === 'ascending') {
        this.temp.orderBy = prop
      } else if (order === 'descending') {
        this.temp.orderBy = prop + ' desc'
      }
      this.$emit('sortChange', this.temp)
    },
    searchFormEmit(v) {
      this.b_data = v
      this.$emit('searchFormEmit2', this.b_data)
    },
    operateEmit(v) {
      this.$emit('operateEmit2', v)
    },
    handleSelectionChange(val) {
      this.selectDate = val
    },
    batchDeleted() {
      this.$emit('batchDeleted', this.selectDate)
    },
    refresh() {
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>

</style>
