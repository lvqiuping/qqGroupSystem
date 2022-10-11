<template>
  <div>
    <div style="display:flex;justify-content: start; font-size: 18px; padding: 0 0 10px 0;">
      <div>{{ qqGroupsItems.gn }}({{ qqGroupsItems.gc }})</div>
      <div style="color: #409EFF; cursor: pointer; padding-left: 20px; padding-right: 20px; font-size: 14px;" @click="prev">[切换QQ群]</div>
    </div>
    <div>
      <basic-table
        :table-title="tableTitle"
        :table-data="tableData"
        :loading="loading"
        :height="550"
        :right-button-group="false"
        :left-button-group="false"
        :multiple-table="false"
      />
    </div>
    <div style="margin-top: 10px">群人数： {{ total }} 人</div>
  </div>
</template>
<script>
import BasicTable from '@/components/BasicTable/index.vue'
export default {
  name: 'MemsTable',
  components: { BasicTable },
  props: {
    tableData: { type: Array, default: Array },
    total: { type: Number, default: 0 },
    qqGroupsItems: { type: Object, default: Object }
  },
  data() {
    return {
      loading: false,
      tableTitle: [
        {
          label: '序号',
          value: 'xh',
          show: true,
          type: 'text'
        },
        {
          label: '成员',
          value: 'nick',
          show: true,
          type: 'text'
        },
        {
          label: '群昵称',
          value: 'groupEntry',
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
      ]
    }
  },
  methods: {
    prev() {
      this.$emit('prev', 2)
    }

  }
}
</script>
