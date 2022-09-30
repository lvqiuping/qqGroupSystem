<template>
  <div style="width:50%;text-align:center;margin:auto;">
    <el-form ref="dataForm" :rules="rules" :model="passwordtemp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item label="新密码" prop="newPassword">
        <el-input v-model.trim="passwordtemp.newPassword" type="password" placeholder="请输入新的密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogPasswordVisibleEmit', false)">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="createData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { validatePassword } from '@/utils/validator'
export default {
  name: 'PassWordForm',
  props: {
    passwordtemp: { type: Object, default: Object }
  },
  data() {
    return {
      loading: false,
      rules: {
        newPassword: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  methods: {
    createData() {
      const temp2 = `userId=${this.passwordtemp.userId}&newPassword=${this.passwordtemp.newPassword}`
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('createPassword', temp2)
        }
      })
    }
  }
}
</script>
