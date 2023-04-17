<template>
  <div class="app-container">
    <div style="display: flex;flex-direction: row;justify-content: space-between; ">
      <div style="display: flex;flex-direction: row;justify-content: space-between;">
        <search-form :search-form="searchForm" @searchFormEmit="searchFormEmit" />
      </div>
      <div style="display: flex;flex-direction: row;justify-content: space-between; height: 40px; margin-bottom: 20px;">
        <el-button type="" icon="el-icon-refresh" style="margin-right: 10px; margin-left: 10px;" @click="getPageList()" />
      </div>
    </div>
    <el-row :gutter="20" style="display: flex;">
      <el-col v-for="(item, index) in tableData" :key="index" :span="5">
        <el-badge :value="'提'" class="item" style="display: block; height: 100%">
          <el-card class="box-card" style="height: 100%;">
            <el-row>
              <el-col :xs="24" :sm="24" :md="24" :lg="5" :xl="5">
                <div><el-avatar shape="square" size="large" :src="cardImage" /></div>
              </el-col>
              <el-col :xs="24" :sm="24" :md="24" :lg="19" :xl="19">
                <div class="card-content">
                  <div class="card-contents" style="color: #303133;font-size: 16px;">{{ item.groupName }}</div>
                  <div class="card-contents"><span>人数：</span>{{ item.groupOwnerQq }}</div>
                  <div class="card-contents"><span>QQ群号：</span>{{ item.groupQq }}</div>
                </div>
              </el-col>
            </el-row>
          </el-card>
        </el-badge>
      </el-col>
    </el-row>
    <pagination v-show="total > 0" :total="total" :page.sync="listQuery.pageIndex" :limit.sync="listQuery.pageSize" @pagination="getPageList()" />
    <div>
      <el-button type="primary" @click="printPdf">打 印</el-button>
      <div id="stReport" style="display: none;">
        <table
          id="stTable"
          border="0"
          align="center"
          cellpadding="0"
          cellspacing="0"
          style="border:solid 0px black;width: 95%; height: 100%;"
        >
          <tbody style="height: 82%;">
            <tr
              v-for="(item, index) in tableData"
              :key="index"
              style="height: 60px;"
            >
              <td
                width="31%"
                style="word-break:break-all; word-wrap:break-word; font-size: 18px; color: blue;"
              >
                {{
                  item.label === '123'
                    ? ''
                    : item.groupName
                }}
              </td>
              <!-- <td
                width="31%"
                style="word-break:break-all; word-wrap:break-word; font-size: 18px; color: blue;padding-left: 15px;"
              >
                {{
                  item.label === '123'
                    ? ''
                    : '会计科目会计科目会计科目会计科目会计科目会计科目会计科目会计科目'
                }}
              </td>
              <td
                width="6%"
                align="right"
                style="word-wrap: nowarp; font-size: 18px;"
                :style="{ color: item.label === '123' ? 'white' : 'blue' }"
              >
                {{ item.label === '123' ? 0 : 10056700.98 }}
              </td>
              <td
                width="6%"
                align="right"
                style="word-wrap: nowarp; font-size: 18px;"
                :style="{ color: item.label === '123' ? 'white' : 'blue' }"
              >
                {{ item.label === '123' ? 0 : 1000.23 }}
              </td> -->
            </tr>
          </tbody>
          <tfoot style="height: 8%; bottom: 0px;">
            <tr>
              <td
                width="15%"
                tdata="Sum"
                tindex="3"
                format="#,##0.00"
                align="right"
              >
                <font id="sum1" color="white">￥###</font>
              </td>
              <td
                width="15%"
                tdata="Sum"
                tindex="4"
                format="#,##0.00"
                align="right"
              >
                <font id="sum2" color="white">￥###</font>
              </td>
            </tr>
            <tr>
              <td
                width="60%"
                align="left"
                colspan="2"
                style="padding-left: 80px;"
              >
                <font
                  color="blue"
                  tdata="(sum1 + sum2)"
                  format="UpperMoney"
                >#####<br>
                </font>
              </td>
              <td
                width="16.7%"
                tdata="Sum"
                tindex="3"
                format="#,##0.00"
                align="right"
                style="padding-left: 10px;"
              >
                <font id="sum3" color="blue">￥###</font>
              </td>
              <td
                width="16.7%"
                tdata="Sum"
                tindex="4"
                format="#,##0.00"
                align="right"
              >
                <font id="sum4" color="blue">￥###</font>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  </div>
</template>
<script>
import { getLodop } from '@/utils/getLodop.js'
import SearchForm from '@/components/SearchForm/index.vue'
import Pagination from '@/components/BasicTable/Pagination.vue'
import { GetGroupPageList } from '@/api/retrievalNumber'
export default {
  name: 'RetrievalNumber',
  components: { Pagination, SearchForm },
  data() {
    return {
      cardImage: require('@/assets/head.png'),
      tableData: null,
      total: 0,
      listQuery: {
        pageIndex: 1,
        pageSize: 10,
        groupQQ: '',
        groupName: ''
      },
      isDraw: true,
      searchForm: {
        expend: true,
        title: '表格筛选',
        size: 'default',
        fields: [
          {
            show: true,
            type: 'input',
            label: '名称',
            labelShow: false,
            name: 'groupName'
          },
          {
            show: true,
            type: 'input',
            label: 'QQ群',
            labelShow: false,
            name: 'groupQQ'
          }
        ],
        tableData2: [],
        printerList: []
      }
    }
  },
  created() {
    this.getPageList()
    this.initData()
  },
  methods: {
    initData() {
      this.tableData2 = []
      for (let index = 0; index < 50; index++) {
        this.tableData2.push({ label: index, value: index })
      }
      const printNum = 9 // 表格一页打印9条
      const printPage = Math.ceil(this.tableData2.length / printNum) // 有多少页
      const expectNum = printNum * printPage //  期望占满页数 printPage 需要的数据条数
      const tabledataNum = this.tableData2.length // 当前已有的数据
      // 不够使用空白的来顶替，保证合计数一直在底部显示
      for (let index = 0; index < expectNum - tabledataNum; index++) {
        this.tableData2.push({ label: '', value: 0 })
      }
    },
    printPdf() {
      const LODOP = getLodop()
      LODOP.SET_PRINT_STYLE('FontSize', 12)
      LODOP.SET_PRINT_PAGESIZE(2, '297mm', '210mm', 'A4') // 纸张方向大小
      LODOP.SET_PRINT_STYLEA(0, 'TableHeightScope', 3) // 高度包含页尾
      LODOP.ADD_PRINT_SETUP_BKIMG(`"<img border='0' src=${this.imgsrc}>"`) // 背景图
      LODOP.SET_SHOW_MODE('BKIMG_LEFT', '0mm')
      LODOP.SET_SHOW_MODE('BKIMG_TOP', '0mm')
      LODOP.SET_SHOW_MODE('BKIMG_WIDTH', '197mm')
      LODOP.SET_SHOW_MODE('BKIMG_HEIGHT', '210mm') // 这句可不加，因宽高比例固定按原图的
      LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1)
      // LODOP.SET_SHOW_MODE('BKIMG_IN_PREVIEW', 1) //预览包含背景图
      // LODOP.SET_PRINT_PAGESIZE(2, 2970, 2100, 'a4') // 纸张方向大小
      // //  ADD_PRINT_HTM(intTop,intLeft,intWidth,intHeight,strHtml)增加超文本项
      LODOP.SET_PRINT_COPIES(1) // 份数
      // LODOP.PRINTSETUP_PAGE_COUNT(2) // 2页
      // LODOP.SET_PRINT_PAGE_COUNT(2) // 2页
      LODOP.SET_PREVIEW_WINDOW(0, 0, 0, 0, 0, '') // 演示设置各种样式的打印预览窗口：
      LODOP.SET_SHOW_MODE('LANDSCAPE_DEFROTATED', 1) // 横向时的正向显示
      // LODOP.SET_PRINT_STYLE('Bold', 1)
      LODOP.SET_PRINT_STYLE('FontColor', '#0000FF')
      LODOP.ADD_PRINT_TEXT('20mm', '115mm', '40mm', '5mm', '记账凭证')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // ->放在某处后面表示每一页都有这个内容
      LODOP.ADD_PRINT_TEXT('28mm', '115mm', '40mm', '5mm', '2019年')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1) // ->放在某处后面表示每一页都有这个内容
      LODOP.ADD_PRINT_TEXT(
        '36mm',
        '60mm',
        '55mm',
        '5mm',
        '社会保险事业管理中心'
      )
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('36mm', '115mm', '40mm', '5mm', '中央调剂金账套')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('28mm', '242mm', '40mm', '5mm', '3月29日')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('36mm', '242mm', '40mm', '5mm', '编号：记账1')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 表格部分
      // LODOP.ADD_PRINT_HTM(
      //   '59mm',
      //   '40mm',
      //   '245mm',
      //   '117mm',
      //   document.getElementById('stReport').innerHTML
      // )
      LODOP.ADD_PRINT_TABLE(
        '59mm',
        '38mm',
        '245mm',
        '117mm',
        document.getElementById('stReport').innerHTML
      )
      // 页码
      LODOP.ADD_PRINT_HTM(
        '200mm',
        '48%',
        '100mm',
        100,
        "<font color='#000'><span tdata='pageNO'>第##页</span>/<span tdata='pageCount'> 共##页</span></font>"
      )
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 张数
      LODOP.ADD_PRINT_HTM(
        '77mm',
        '284mm',
        '2mm',
        '5mm',
        "<font color='0000FF'><span tdata='pageNO'>##</span></font>"
      ) // 打印页码
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 合计部分
      // LODOP.ADD_PRINT_TEXT('180mm', '60mm', '140mm', '5mm', '2323.23')
      // LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // LODOP.ADD_PRINT_TEXT('180mm', '200mm', '40mm', '5mm', '2,020,202.00')
      // LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // LODOP.ADD_PRINT_TEXT('180mm', '250mm', '40mm', '5mm', '2,020,202.00')
      // LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      // 人员部分
      LODOP.ADD_PRINT_TEXT('191mm', '55mm', '30mm', '5mm', '财务主管xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('191mm', '100mm', '30mm', '5mm', '记账人xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('191mm', '140mm', '30mm', '5mm', '复核人xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('191mm', '177mm', '30mm', '5mm', '出纳xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('191mm', '217mm', '30mm', '5mm', '制单人xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)
      LODOP.ADD_PRINT_TEXT('191mm', '260mm', '30mm', '5mm', '经办人xx')
      LODOP.SET_PRINT_STYLEA(0, 'ItemType', 1)

      // LODOP.PRINT() // 直接打印
      // LODOP.PRINT_SETUP() // 手动维护
      LODOP.PREVIEW()
    },

    searchFormEmit(v) {
      this.listQuery.pageIndex = 1
      this.listQuery = Object.assign({}, this.listQuery, v)
      this.getPageList()
    },
    getPageList() {
      this.loading = true
      GetGroupPageList(this.listQuery).then(response => {
        if (response.statusCode === 200) {
          this.loading = false
          this.tableData = response.data.pageList
          this.total = response.data.totalRowCount
        }
      })
    }
  }
}
</script>
<style scoped>
.card-box {
  display: flex;
}

.card-content {
  font-size: 14px;
}

.card-contents {
  margin-bottom: 6px;
  color: #999;
}
</style>
