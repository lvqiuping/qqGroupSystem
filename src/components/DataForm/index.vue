<template>
  <div>
    <el-form ref="dataForm" :model="dataFormTemp" label-position="" label-width="" style="display: flex;height: 40px;">
      <template>
        <div v-for="(field, index) in dataFormTemp.fields" :key="index">
          <div v-if="field.show">
            <el-form-item v-if="field.type === 'input'" :label="field.labelShow ? field.label : ''" style="display: flex; margin-right: 10px;">
              <el-input
                v-model.trim="dataFormTemp[field.name]"
                clearable
                :placeholder="field.label"
                @keyup.enter.native="searching()"
              />
            </el-form-item>
            <!-- <el-form-item v-if="field.type === 'select'" style="margin-right: 10px;">
              <el-select v-model="temp[field.name]" :placeholder="field.label" @change="searching()">
                <el-option
                  v-for="item in field.options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item> -->
          </div>
        </div>
      </template>
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
    dataFormTemp: { type: Object, default: Object },
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
    handleChange(value) {
      console.log(value)
    },
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
