<template>
  <div class="box">
    <el-row :gutter="10">
      <el-col :span="16">
        <panel-group :panel-data="panelData" />
      </el-col>
      <el-col :span="8">
        <pie-chart v-if="flag" :pie-chart-data="pieChartData" />
      </el-col>
    </el-row>
    <el-row>
      <el-col>
        <line-chart v-if="flag" :line-chart-data="lineChartData" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import PanelGroup from './components/PanelGroup'
import PieChart from './components/PieChart'
import lineChart from './components/LineChart'
import { GetFirstPageStats } from '@/api/dashboard'
import moment from 'moment'
export default {
  name: 'Dashboard',
  components: {
    PanelGroup, PieChart, lineChart
  },
  data() {
    return {
      flag: false,
      panelData: {},
      pieChartData: [],
      lineChartData: {
        actualData: [],
        expectedData: []
      }
    }
  },
  created() {
    this.getPageList()
  },
  methods: {
    getPageList() {
      GetFirstPageStats().then((res) => {
        if (res.statusCode === 200) {
          this.flag = true
          this.flag = true // 跟组件生命周期有关，先获取到数据再加载组件，防止拿不到数据就渲染子组件
          this.panelData = res.data
          this.pieChartData.push(
            { value: res.data.memberWithPhonePercent, name: '精准客户' },
            { value: res.data.memberWithoutPhonePercent, name: ' QQ群人员' }
          )
          res.data.memberDayIncrs.forEach(element => {
            this.lineChartData.actualData.push(this.myDateFormat(element.day))
            this.lineChartData.expectedData.push(element.incrCount)
          })
        }
      })
    },
    myDateFormat(date, fmt = 'YYYY-MM-DD') {
    // eslint-disable-next-line no-undef
      return moment(date).format(fmt)
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  padding: 30px 20px 20px 20px;
  background-color: #F2F6FC;
  min-height: 100vh;
}
</style>
