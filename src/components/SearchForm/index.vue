<template>
  <div>
    <el-form ref="searchForm" :model="temp" label-position="" label-width="" style="display: flex;height: 40px;">
      <template>
        <div v-for="(field, index) in searchForm.fields" :key="index">
          <div v-if="field.show">
            <el-form-item v-if="field.type === 'input'" :label="field.labelShow ? field.label : ''" style="display: flex; margin-right: 10px;">
              <el-input
                v-model.trim="temp[field.name]"
                clearable
                :placeholder="field.label"
                @keyup.enter.native="searching()"
              />
            </el-form-item>
            <el-form-item v-if="field.type === 'select'" style="margin-right: 10px;">
              <el-select v-model="temp[field.name]" :placeholder="field.label" @change="searching()">
                <el-option
                  v-for="item in field.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item v-if="field.type === 'date'" style="margin-right: 10px;">
              <span>{{ field.label }}：</span>
              <el-date-picker
                v-model="temp[field.name]"
                type="datetimerange"
                :picker-options="pickerOptions"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                align="right"
                value-format="yyyy-MM-dd HH:MM:ss"
              />
            </el-form-item>
          </div>
        </div>
      </template>
      <el-button type="primary" icon="el-icon-search" style="margin-right: 10px;" @click.native.prevent="searching()" />
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'SearchForm',
  props: {
    searchForm: { type: Object, default: null }
  },
  data() {
    return {
      temp: {},
      pickerOptions: {
        shortcuts: [
          {
            text: '全部',
            onClick(picker) {
              const end = ''
              const start = ''
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '3天内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 3)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一周内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          }, {
            text: '三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '半年内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '一年内',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 365)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      }
    }
  },
  watch: {
    // 监听对象temp，
    temp: {
      handler(newVal) {
        this.$emit('searchFormEmit', newVal)
      },
      deep: true
    }
  },
  methods: {
    searching() {
      this.$emit('searchFormEmit', this.temp)
    }
  }
}
</script>
