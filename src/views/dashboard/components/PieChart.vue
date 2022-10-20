<template>
  <div>
    <div style="font-weight: 600; margin-bottom: 20px;">数据饼图</div>
    <el-row>
      <el-col>
        <div :id="id" :class="className" :style="{height:height,width:width,backgroundColor: '#fff',padding: '20px'}" />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    id: {
      type: String,
      default: 'pie'
    },
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '320px'
    },
    pieChartData: {
      type: Array,
      default: Array
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart(this.pieChartData)
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart(pieChartData) {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption({
        title: { text: '全部' },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        legend: {
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        series: [
          {
            name: '数据统计',
            type: 'pie',
            roseType: 'radius',
            radius: '50%',
            center: ['50%', '38%'],
            data: pieChartData,
            animationEasing: 'cubicInOut',
            animationDuration: 2600,
            color: [
              '#409EFF',
              '#67C23A'
            ]
          }
        ]
      })
    }
  }
}
</script>
