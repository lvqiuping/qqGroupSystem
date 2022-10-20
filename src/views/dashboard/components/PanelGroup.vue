<template>
  <div>
    <div style="font-weight: 600; margin-bottom: 20px;">综合数据</div>
    <el-row style="margin-bottom: 10px" :gutter="10">
      <el-col :span="8">
        <div class="channel channel1">
          <div class="title">创建任务数量（个）</div>
          <div class="content">
            <div class="number"><count-to :start-val="0" :end-val="panelData.groupCount" :duration="2600" /></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="channel channel2">
          <div class="title">总获取群成员（个）</div>
          <div class="content">
            <div class="number"><count-to :start-val="0" :end-val="panelData.memberCount" :duration="2600" /></div>
          </div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="channel channel3">
          <div class="title">总精准客户（个）</div>
          <div class="content">
            <div class="number"><count-to :start-val="0" :end-val="panelData.memberWithPhoneCount" :duration="2600" /></div>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <div class="channel channel4 content" style="border-left: 1px solid #c3d2e9;">
          <div>今日新增群数量 <el-tag style="margin-left: 20px;" :type="panelData.groupIncrPercent>=0?'success':'danger'">{{ toPercent(panelData.groupIncrPercent) }}</el-tag></div>
          <div class="number"><count-to :start-val="0" :end-val="panelData.groupIncrCount_Today" :duration="2600" /></div>
          <div class="subtitle">昨日</div>
          <div>{{ panelData.groupIncrCount_Yesterday }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="channel channel4 content">
          <div>今日新增群成员<el-tag style="margin-left: 20px;" :type="panelData.memberIncrPercent>=0?'success':'danger'">{{ toPercent(panelData.memberIncrPercent) }}</el-tag></div>
          <div class="number"><count-to :start-val="0" :end-val="panelData.memberIncrCount_Today" :duration="2600" /></div>
          <div class="subtitle">昨日</div>
          <div>{{ panelData.memberIncrCount_Yesterday }}</div>
        </div>
      </el-col>
      <el-col :span="8">
        <div class="channel channel4 content">
          <div>今日抓取精准客户<el-tag style="margin-left: 20px;" :type="panelData.memberWithPhoneIncrPercent>=0?'success':'danger'">{{ toPercent( panelData.memberWithPhoneIncrPercent) }}</el-tag></div>
          <div class="number"><count-to :start-val="0" :end-val="panelData.memberWithPhoneIncrCount_Today" :duration="2600" /></div>
          <div class="subtitle">昨日</div>
          <div>{{ panelData.memberWithPhoneIncrCount_Yesterday }}</div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CountTo from 'vue-count-to'

export default {
  components: {
    CountTo
  },
  props: { panelData: { type: Object, default: null }},
  data() {
    return {
      // panelImage: require('@/assets/panel.png')
    }
  },
  methods: {
    toPercent(point) {
      let str = Number(point / 100)
      str += '%'
      return str
    },
    handleSetLineChartData(type) {
      this.$emit('handleSetLineChartData', type)
    }
  }
}
</script>

<style lang="scss" scoped>

.channel{
  padding: 15px;
}
.channel1 {
  background-color: #dde5f3;
}
.channel2 {
  background-color: #d6f1c9;
}
.channel3 {
  background-color: #dde5f3;
}
.channel4 {
  background-color: #fff;
  border-right: 1px solid #c3d2e9;
}
.title{
  position: relative;
  text-indent: 1rem;
  margin-bottom: 10px;
}
.title:before{
position: absolute;
top: 0;
left: 0px;
content: '';
width: 4px;
height: 100%;
background-color: #409eff;
margin-right: 10px;
}
.content{
  text-align: center;
  .number{
  font-weight: 600;
  font-size: 30px;
  margin: 21px 0;
}
.subtitle{
  color: #909399;
  margin-bottom: 10px;
}
}

</style>
