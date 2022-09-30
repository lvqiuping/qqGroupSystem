import { Message, MessageBox } from 'element-ui'

// 提示框
const TipsBox = (type, message) => {
  Message({
    type: type,
    message: message
  })
}
// 操作询问框
const QueryBox = (m) => {
  return MessageBox.confirm(m || '此操作将永久删除该数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
}
export { TipsBox, QueryBox }
