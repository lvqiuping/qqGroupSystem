<template>
  <div style="text-align:center">
    <el-form ref="formExport" :model="formExport" :rules="formExportRules" style="display: flex;justify-content: center;">
      <el-form-item v-if="isSelect === 2" label="输入QQ" :label-width="formLabelWidth" prop="qq">
        <el-input v-model.trim="formExport.qq" autocomplete="off" />
      </el-form-item>
      <el-form-item v-if="isSelect === 3" label="输入号码" :label-width="formLabelWidth" prop="phone">
        <el-input v-model.trim="formExport.phone" autocomplete="off" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormExportEmit">取 消</el-button>
      <el-button type="primary" @click="getOperateEmit">导 出</el-button>
    </div>
  </div>
</template>
<script>
import { validateQq, validatePhone } from '@/utils/validator'

export default {
  name: 'ExportForm',
  props: {
    formExport: { type: Object, default: Object },
    isSelect: { type: Number, default: null }
  },
  data() {
    return {
      formLabelWidth: '20',
      formExportRules: {
        qq: [{ required: true, trigger: 'blur', validator: validateQq }],
        phone: [{ required: true, trigger: 'blur', validator: validatePhone }]
      }

    }
  },
  methods: {
    dialogFormExportEmit() {
      this.$emit('dialogFormExportEmit', false)
    },
    getOperateEmit() {
      this.$refs.formExport.validate(valid => {
        if (valid) {
          this.$emit('getOperateEmit2', this.formExport)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
