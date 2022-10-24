<template>
  <div style="width:50%;text-align:center;margin:auto;">
    <el-form ref="dataForm" :model="upLimittemp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item label="日提取数" prop="newUpLimit">
        <el-input-number v-model="upLimittemp.newUpLimit" :min="1" label="描述文字" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogUpdateUpLimitEmit', false)">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="createData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UpLimitForm',
  props: {
    upLimittemp: { type: Object, default: Object }
  },
  data() {
    return {
      loading: false
    }
  },
  methods: {
    createData() {
      const temp2 = `userId=${this.upLimittemp.userId}&newUpLimit=${this.upLimittemp.newUpLimit}`
      console.log(temp2)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('createUpLimit', temp2)
        }
      })
    }
  }
}
</script>
