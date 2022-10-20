<template>
  <div>
    <div style="font-weight: 600; margin: 20px 0;">数据走势图</div>
    <el-row style="margin-bottom: 10px">
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
      default: 'line'
    },
    className: {
      type: String,
      default: 'line'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '400px'
    },
    lineChartData: {
      type: Object,
      default: Object
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
      this.setOptions(this.lineChartData)
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
    initChart() {
      this.chart = echarts.init(document.getElementById(this.id))
      this.chart.setOption(this.lineChartData)
    },
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        xAxis: {
          type: 'category',
          data: actualData
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            data: expectedData,
            type: 'line',
            smooth: true,
            color: [ // 柱子颜色
              '#409eff'
            ]
          }
        ]
      })
    }
  }
}
</script>
