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
      temp: {}
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
