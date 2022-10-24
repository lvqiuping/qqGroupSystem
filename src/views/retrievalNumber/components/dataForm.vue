<template>
  <div>
    <div v-if="loginStep === 0" style="width:50%;text-align:center;margin:auto; margin-bottom: 50px;">
      <ecode-card :e-code="eCode" :e-conde-image-loading="eCondeImageLoading" :show-code="loginStatus === 1 ? true : false" @getEcode="getEcode" />
    </div>
    <div v-else-if="loginStep === 1">
      <mems-card :qq-groups="qqGroups" @getGetGroupMembers="getGetGroupMembers2" @prev="prev" />
    </div>
    <div v-else-if="loginStep === 2">
      <mems-table v-loading="loading" :table-data="tableData" :total="total" :qq-groups-items="qqGroupsItems" @prev="prev" />
    </div>
    <!-- 按钮 -->
    <div v-show="isStep" slot="footer" style="margin-top: 20px; text-align: center;">
      <el-button
        v-loading="nextLoading"
        :disabled="eCondeImageLoading"
        :type="loginStatus === 0 ? 'info' : loginStatus === 1 ? 'primary' : 'danger'"
        @click="next(loginStep)"
      >
        {{ loginStep === 2 ? '立即提取' : '下一步' }}
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
import { GetGroupMembers, InsertGroupMembers } from '@/api/retrievalNumber'
export default {
  name: 'DataForm',
  components: { MemsTable, MemsCard, EcodeCard },
  props: {
  },
  data() {
    return {
      loginStatus: 0,
      eCondeImageLoading: false,
      nextLoading: false,
      isStep: true,
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
        groupQQ: ''
      },
      tableData: [],
      total: 0,
      insertParams: {},
      groupItem: {},
      listQuery2: {}
    }
  },
  created() {
    this.qqGroupsParams.qq = Cookies.get('qqGroupsParams')
    this.loginStatus = this.qqGroupsParams.qq ? 1 : 0
    this.loginStatusText = this.qqGroupsParams.qq ? '已登录' : '未登录'
    if (Cookies.get('ecodeLoginToken')) {
      this.loginToken = Cookies.get('ecodeLoginToken')
      this.eCode = Cookies.get('eCodeImg')
    } else {
      this.getEcode()
    }
  },
  methods: {
    getEcode() {
      this.eCondeImageLoading = true
      GetQQLoginImage().then((res) => {
        const a = JSON.parse(res.data)
        if (a.code === 200) {
          this.eCondeImageLoading = false
          this.loginToken = a.data.token
          this.eCode = a.data.pic_base64
          Cookies.set('ecodeLoginToken', this.loginToken)
          Cookies.set('eCodeImg', this.eCode)
        }
      })
    },
    next(step) {
      this.nextLoading = true
      if (step === 0) {
        if (this.loginToken) {
          var params = `token=${this.loginToken}`
          LoginConfirm(params).then((res) => {
            // 400:参数错误，302:二维码认证中，401：未登录或登录过期，301：二维码未失效，303:二维码已失效 304返回状态，本次登录被拒绝  // 未扫码就无法获取qq号
            const b = JSON.parse(res.data)
            if (b.code === 200) {
              this.loginStatus = 1
              this.loginStatusText = '已登录'
              this.qqGroupsParams.qq = b.data.uin
              Cookies.set('qqGroupsParams', this.qqGroupsParams.qq)
              this.getAllGroup()
            }
            if (b.code === 301 || b.code === 303) {
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
              this.loginStatusText = '未登录，请扫码'
            }
            if (b.code === 302) {
              TipsBox('warning', b.text)
              this.loginStatus = 0
              this.nextLoading = false
            }
            if (b.code === 304) {
              TipsBox('warning', b.text || '本次登录被拒绝，请稍后重试')
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
        this.insertMems(this.insertParams)
      }
    },
    getAllGroup() {
      GetQQGroups({ qq: Cookies.get('qqGroupsParams') }).then((res) => {
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
      console.log('群成员参数', v)
      this.loginStep = 2
      this.isStep = true
      this.listQuery.qq = this.qqGroupsParams.qq
      this.listQuery.groupQQ = v.gc
      this.groupItem = {
        'gc': v.gc.toString(),
        'gn': v.gn.toString(),
        'owner': v.owner.toString()
      }
      this.qqGroupsItems = v
      this.getMems(this.listQuery, 0)
    },
    getMems(v) {
      this.loading = true
      console.log('成员参数', v)
      if (v.qq && v.groupQQ) {
        const params = `qq=${v.qq}&groupQQ=${v.groupQQ}`
        GetGroupMembers(params).then((res) => {
          var d = JSON.parse(res.data)
          console.log('成员列表', d.data)
          if (d.code === 200) {
            var a = d.data.mems
            console.log(a)
            const aa = []
            a.forEach((item) => {
              aa.push({
                'groupEntry': item.groupEntry,
                'joinTime': item.joinTime, // === null ? null : item.joinTime
                'lastSpeakTime': item.lastSpeakTime,
                'nick': item.nick,
                'qAge': item.qAge,
                'qq': item.qq,
                'sex': item.sex
              })
            })

            this.insertParams = {
              'groupItem': this.groupItem,
              'qq': d.data.qq,
              'memberData': {
                'groupcode': d.data.groupCode,
                'mems': aa
              }
            }
            this.loading = false
            this.tableData = d.data.mems
            this.total = d.data.count
          }
        }).catch(error => {
          TipsBox('error', error)
        })
      } else {
        TipsBox('error', '参数有误')
        this.loading = false
      }
    },
    insertMems(p) {
      console.log('插入', p)
      if (p) {
        InsertGroupMembers(p).then((res) => {
          console.log(res)
          if (res.statusCode === 200) {
            TipsBox('success', res.data)
            this.$emit('dialogFormVisibleEmit', false)
          }
        }).catch(error => {
          TipsBox('error', error)
          return
        })
      } else {
        TipsBox('error', '参数有误')
        return
      }
    },
    prev(v) {
      if (v === 1) {
        this.loginStep = 0
        this.isStep = true
        // this.getEcode()
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
