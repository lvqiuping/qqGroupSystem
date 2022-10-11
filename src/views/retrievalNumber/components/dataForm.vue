<template>
  <div>
    <div v-if="loginStep === 0" style="width:50%;text-align:center;margin:auto; margin-bottom: 50px;">
      <ecode-card :e-code="eCode" :e-conde-image-loading="eCondeImageLoading" @getEcode="getEcode" />
    </div>
    <div v-else-if="loginStep === 1">
      <mems-card :qq-groups="qqGroups" @getGetGroupMembers="getGetGroupMembers2" @prev="prev" />
    </div>
    <div v-else-if="loginStep === 2">
      <mems-table :table-data="tableData" :total="total" :qq-groups-items="qqGroupsItems" @prev="prev" />
    </div>
    <!-- 按钮 -->
    <div v-show="isStep" slot="footer" style="margin-top: 20px; text-align: center;">
      <el-button
        v-loading="nextLoading"
        :disabled="eCondeImageLoading"
        :type="loginStatus === 0 ? 'info' : loginStatus === 1 ? 'primary' : 'danger'"
        @click="next(loginStep)"
      >
        {{ loginStep === 2 ? '完成' : '下一步' }}
        <span>
          （{{ loginStatusText }}）
        </span>
      </el-button>
    </div>
  </div>
</template>

<script>
import { GetQQLoginImage, LoginConfirm, GetQQGroups } from '@/api/retrievalNumber'
import { TipsBox } from '@/utils/feedback'
import Cookies from 'js-cookie'
import MemsTable from './memsTable.vue'
import MemsCard from './memsCard.vue'
import EcodeCard from './ecodeCard.vue'
import { GetGroupMembers } from '@/api/retrievalNumber'
export default {
  name: 'DataForm',
  components: { MemsTable, MemsCard, EcodeCard },
  props: {

  },
  data() {
    return {
      eCondeImageLoading: false,
      nextLoading: false,
      isStep: true,
      loginStatus: 0, // 0 1 2
      loginStatusText: '未登录',
      eCode: '',
      loginToken: '',
      qqGroups: {},
      MembersList: [],
      loginStep: 0,
      temp: {
        qq: ''
      },
      qqGroupsItems: {},
      qqGroupsParams: { qq: '' },
      listQuery: { // 传给表格
        qq: '',
        groupCode: '',
        insertDb: false
      },
      tableData: [],
      total: 0
    }
  },
  created() {
    this.qqGroupsParams.qq = Cookies.get('qqGroupsParams')
    this.loginStatus = this.qqGroupsParams.qq ? 1 : 0
    this.loginStatusText = this.qqGroupsParams.qq ? '已登录' : '未登录'
    this.getEcode()
  },
  methods: {
    getEcode() {
      this.eCondeImageLoading = true
      GetQQLoginImage().then((res) => {
        console.log('获得二维码', JSON.parse(res.data))
        const a = JSON.parse(res.data)
        if (a.code === 200) {
          this.eCondeImageLoading = false
          this.loginToken = a.data.token
          this.eCode = a.data.pic_base64
        }
      })
    },
    next(step) {
      this.nextLoading = true
      if (step === 0) {
        if (this.loginToken) {
          var params = `token=${this.loginToken}`
          LoginConfirm(params).then((res) => {
            console.log('获得的qq名字', JSON.parse(res.data))
            // 400:参数错误，302:二维码认证中，401：未登录或登录过期，301：二维码未失效，303:二维码已失效   // 未扫码就无法获取qq号
            const b = JSON.parse(res.data)
            if (b.code === 200) {
              this.loginStatus = 1
              this.loginStatusText = '已登录'
              this.qqGroupsParams.qq = b.data.uin
              Cookies.set('qqGroupsParams', this.qqGroupsParams.qq)
              this.getAllGroup()
            }
            if (b.code === 301) {
              if (this.qqGroupsParams.qq) {
                this.loginStatus = 1
                this.getAllGroup()
              } else {
                TipsBox('warning', b.text + ',请扫码登录再点击下一步')
              }
            }
            if (b.code === 401) {
              TipsBox('error', b.text)
              this.loginStatus = 0
              this.nextLoading = false
              this.loginStatusText = '未登录'
            }
            if (b.code === 302) {
              TipsBox('warning', b.text)
              this.loginStatus = 0
              this.nextLoading = false
            }
            if (b.code === 400) {
              TipsBox('error', b.text)
              this.loginStatus = 0
              this.nextLoading = false
            }
          }).catch(error => {
            TipsBox('error', error)
            this.nextLoading = false
            return
          })
        } else {
          TipsBox('warning', '请在手机上确认是否登录成功')
          this.nextLoading = false
          return
        }
      } else if (step === 2) {
        this.nextLoading = false
        this.listQuery.insertDb = true
        this.listQuery = Object.assign({}, this.listQuery, this.listQuery)
        console.log(this.listQuery)
        this.getMems(this.listQuery, step)
      }
    },
    getAllGroup() {
      GetQQGroups({ qq: Cookies.get('qqGroupsParams') }).then((res) => {
        console.log('所有群', JSON.parse(res.data))
        var c = JSON.parse(res.data)
        if (c.code === 200) {
          this.loginStep = 1
          this.nextLoading = false
          this.isStep = false
          this.loginStatus = 1
          this.qqGroups = c.data
        } else if (c.code === 401) {
          TipsBox('error', c.text)
          this.loginStatus = 2
          this.loginStep = 0
          this.nextLoading = false
          this.loginStatusText = '已失效'
          this.getEcode()
        } else if (c.code === 500) {
          TipsBox('error', c.text)
          return
        }
      }).catch(error => {
        TipsBox('error', error)
      })
    },
    getGetGroupMembers2(v) {
      console.log(v)
      this.loginStep = 2
      this.isStep = true
      this.listQuery.qq = this.qqGroupsParams.qq
      this.listQuery.groupCode = v.gc
      this.qqGroupsItems = v
      this.getMems(this.listQuery, 0)
    },
    getMems(v, s) {
      this.loading = true
      this.nextLoading = true
      console.log('参数', v)
      GetGroupMembers(v).then((res) => {
        console.log('成员', JSON.parse(res.data))
        var d = JSON.parse(res.data)
        if (d.code === 200) {
          this.loading = false
          this.nextLoading = false
          this.tableData = d.data.mems
          this.total = d.data.count
          if (s === 2) {
            TipsBox('success', d.text)
            this.$emit('dialogFormVisibleEmit', false)
          }
        }
      }).catch(error => {
        TipsBox('error', error)
      })
    },
    prev(v) {
      if (v === 1) {
        this.loginStep = 0
        this.isStep = true
        this.getEcode()
      } else if (v === 2) {
        this.isStep = false
        this.loginStep = 1
      }
    }
  }
}
</script>
<style scoped>
.gitems :hover {
  background: #eee;
}
</style>
