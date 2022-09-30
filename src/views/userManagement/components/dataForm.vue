<template>
  <div style="width:50%;text-align:center;margin:auto;">
    <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="margin-left:50px;margin-right:50px;">
      <el-form-item label="用户名" prop="userName">
        <el-input v-model.trim="temp.userName" placeholder="请输入用户名" />
      </el-form-item>
      <el-form-item label="真实姓名" prop="realName">
        <el-input v-model.trim="temp.realName" placeholder="请输入真实姓名" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model.trim="temp.password" type="password" placeholder="请输入密码" />
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogFormVisible = $emit('dialogFormVisibleEmit', false)">
        取消
      </el-button>
      <el-button type="primary" :loading="loading" @click="createData()">
        确认
      </el-button>
    </div>
  </div>
</template>

<script>
import { validateUsername, validatePassword } from '@/utils/validator'
export default {
  name: 'DataForm',
  props: {
    temp: { type: Object, default: Object },
    loading: { type: Boolean, default: false }
  },
  data() {
    return {
      rules: {
        userName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      }
    }
  },
  methods: {
    createData() {
      this.temp2 = `userName=${this.temp.userName}&realName=${this.temp.realName}&password=${this.temp.password}`
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.$emit('createDataEmit', this.temp2, true)
        }
      })
    }
  }
}
</script>
