<template>
  <div>
    <el-card :body-style="{ padding: '0px' }" shadow="never" style="border: none">
      <el-image
        v-loading="eCondeImageLoading"
        style="width: 200px; height: 200px"
        :src="eCode"
        fit="contain"
      />
      <div>
        <span>请使用手机QQ扫描二维码登录<el-button type="text" class="button" icon="el-icon-refresh" style="margin-left: 10px" @click="getEcode">切换</el-button></span>
        <div>
          <div style="color: #909399">提示： ( 未登录 / 已失效 ) 的，请在手机操作登录成功后再点击下一步</div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'MemsTable',
  props: {
    eCode: { type: String, default: '' },
    eCondeImageLoading: { type: Boolean, default: false },
    qqGroupsList: { type: Array, default: Array }
  },
  methods: {
    getEcode() {
      this.$emit('getEcode')
    }
  }
}
</script>
