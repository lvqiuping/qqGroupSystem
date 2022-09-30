// 去重
const unique = (arr) => {
  const newArr = []
  arr.forEach((item) => {
    if (newArr.indexOf(item.id) === -1) {
      newArr.push(item.id)
    }
  })
  return newArr
}

export { unique }

/**
 * 表单数据收集
 */
export function getFormData(params, idsName) {
  let p = []
  if (typeof params === 'string') {
    p.push(params)
  } else {
    p = params
  }
  const form = new FormData()
  for (let i = 0; i < p.length; i++) {
    form.append(idsName, p[i])
  }

  return form
}
/**
 * 表单数据收集
 */
    // 导出
    downloadExcel(){
      QueryBox('将导出为excel文件，确认导出?').then(() => {
        this.excelData = this.tableData
        this.export2Excel(this.excelData, this.tableTitle, 'hao')
      }).catch(() => {

      })
    }
    export2Excel(tData, tTitle, tName){
      require.ensure([], () => {
        const { export_json_to_excel } = require('@/excel/export2Excel') // 这里必须使用绝对路径，使用@/+存放export2Excel的路径
        const tHeader = [] // 导出的excel的表头字段名称
        const filterVal = [] // 对象属性，对应于tHeader
        tTitle.forEach((item) => {
          tHeader.push(item.label)
          filterVal.push(item.value)
        })
        const list = this.excelData // json数组对象，接口返回的数据
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, tName)// 导出的表格名称
      })
    }
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => v[j]))
    }
