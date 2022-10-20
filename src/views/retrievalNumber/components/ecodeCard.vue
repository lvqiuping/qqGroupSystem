<template>
  <div style="">
    <el-card
      :body-style="{ padding: '0px', display: 'flex',flexDirection: 'column',justifyContent: 'center',alignItems: 'center'}"
      shadow="never"
      style="border: none;"
    >
      <div style="width: 200px; height: 200px;position:relative;">
        <el-image
          v-loading="eCondeImageLoading"
          style="width: 100%; height: auto;"
          :src="eCode"
          fit="contain"
        />
        <div
          v-if="show"
          style="width: 0;
    height: 0;
    border-right: 50px solid transparent;
    border-left: 50px solid #409eff;
    border-top: 50px solid #409eff;
    border-bottom: 50px solid transparent;
    position: absolute; top: 10px; left: 10px;"
        />
      </div>
      <div>
        <span>请使用手机QQ扫描二维码登录<el-button type="text" class="button" icon="el-icon-refresh" style="margin-left: 10px" @click="getEcode">切换</el-button></span>
        <div style="color: #909399; text-align: left;">
          <p>提示：1, ( 未登录 / 已失效 ) 的，请在手机操作登录成功后再点击下一步！</p>
          <p style="text-indent: 3rem; color: #F56C6C">2,（ 已登录 ）的无需扫码！</p>
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
    qqGroupsList: { type: Array, default: Array },
    showCode: { type: Boolean, default: null }
  },
  data() {
    return {
      show: false
    }
  },
  created() {
    this.show = this.showCode
  },
  methods: {
    getEcode() {
      this.show = false
      this.$emit('getEcode')
    }
  }
}
</script>
