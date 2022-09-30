<template>
  <div>
    <div v-if="loginStep === 0" style="width:50%;text-align:center;margin:auto; margin-bottom: 50px;">
      <el-image
        v-loading="eCondeImageLoading"
        style="width: 200px; height: 200px"
        :src="eCode"
        fit="contain"
      />
      <div style="margin-top: 20px; display: flex; justify-content: center;">
        <div style="margin-right: 10px">请使用手机QQ扫描二维码登录</div>
        <div style="cursor:pointer" @click="getEcode">
          <i class="el-icon-refresh" style="color: #409EFF; font-weight: 900;" />
          <span style="color: #409EFF; margin-left: 2px;">切换</span>
        </div>
      </div>
      <div style="color: #ccc; margin-top: 10px">提示： 首次 (未登录) 的，请务必在手机操作登录成功后再点击下一步</div>
    </div>
    <!-- step2 -->
    <div v-else-if="loginStep === 1" style="">
      <div>
        <div style="margin: 20px 0"> 我创建的群（{{ qqGroupsList.length }}）</div>
        <el-row>
          <el-col v-for="(item, index) in qqGroupsList" :key="index" :span="8">
            <div style="display:flex; align-items:center; margin: 0 10px 10px 0;cursor: pointer;" @click="getGetGroupMembers(item)">
              <el-image :src="require('@/assets/login/u.png')" style="width: 20px;height: 20px;margin-right: 10px;" />
              <div>{{ item.gn }}</div>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <!-- step3 -->
    <div v-else-if="loginStep === 2">
      <div style="color: #409EFF; cursor: pointer; padding-left: 20px; padding-right: 20px;" @click="prev()">[切换QQ群]</div>
      <mems-table :list-query="listQuery" />
    </div>
    <!-- 按钮 -->
    <div v-show="isStep" slot="footer" style="margin-top: 20px; text-align: center;">
      <el-button
        v-loading="nextLoading"
        :disabled="eCondeImageLoading"
        :type="qqGroupsParams.qq ? loginStatus.primary : loginStatus.info"
        @click="next()"
      >
        下一步
        <span v-show="qqGroupsParams.qq">
          （{{ valid ? loginStatus.validLogin : loginStatus.inValidLogin }}）
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
export default {
  name: 'DataForm',
  components: { MemsTable },
  props: {

  },
  data() {
    return {
      eCondeImageLoading: false,
      nextLoading: false,
      isStep: true,
      valid: true,
      loginStatus: {
        noLogin: '未登录',
        validLogin: '已登录',
        inValidLogin: '已失效',
        info: 'info',
        primary: 'primary',
        error: 'error'
      },
      eCode: '',
      loginToken: '',
      qqGroupsList: [],
      MembersList: [],
      loginStep: 0,
      temp: {
        qq: ''
      },
      qqGroupsParams: { qq: '' },
      listQuery: { // 传给表格
        pageIndex: 1,
        pageSize: 10,
        qq: '',
        groupCode: ''
      }
    }
  },
  created() {
    this.qqGroupsParams.qq = Cookies.get('qqGroupsParams')
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
    next() {
      this.nextLoading = true
      if (this.loginToken) {
        var params = `token=${this.loginToken}`
        LoginConfirm(params).then((res) => {
          console.log('获得的qq名字', JSON.parse(res.data))
          // 400:参数错误，401：未登录或登录过期，301：二维码未失效，302:二维码认证中，303:二维码已失效   // 未扫码就无法获取qq号
          const b = JSON.parse(res.data)
          if (b.code === 200 || b.code === 301 || b.code === 302) {
            if (b.code === 200) {
              this.nextLoading = false
              this.qqGroupsParams.qq = b.data.uni
              Cookies.set('qqGroupsParams', this.qqGroupsParams.qq)
              if (this.qqGroupsParams.qq) {
                this.getAllGroup()
              }
            }
            if (b.code === 301) {
              this.nextLoading = false
              if (this.qqGroupsParams.qq) {
                this.getAllGroup()
              } else {
                TipsBox('warning', b.text + ',请扫码登录再点击下一步')
              }
            }
            if (b.code === 302) {
              this.nextLoading = false
              TipsBox('warning', b.text)
              return
            }
          } else if (b.code === 303 || b.code === 401) {
            TipsBox('error', b.text + '请重新获取/切换二维码')
            this.nextLoading = false
          } else if (b.code === 400) {
            TipsBox('error', b.text)
            this.nextLoading = false
          }
        })
      } else {
        TipsBox('warning', '请在手机上确认是否登录成功')
        this.nextLoading = false
        return
      }
    },
    getAllGroup() {
      GetQQGroups({ qq: '448427168' }).then((res) => {
        console.log('res', res)
        console.log('所有群', JSON.parse(res.data))
        var c = JSON.parse(res.data)
        if (c.code === 200) {
          this.loginStep = 1
          this.isStep = false
          this.qqGroupsList = c.data.join
        } else if (c.code === 401) {
          TipsBox('error', c.text)
          this.nextLoading = false
          this.valid = false
          return
        }
      }).catch(function(err) {
        TipsBox('error', '二维码登录已失效，请重新扫码登录' + err)
      })
    },
    getGetGroupMembers(v) {
      this.loginStep = 2
      this.listQuery.qq = '448427168' // this.qqGroupsParams.qq
      this.listQuery.groupCode = v.gc
    },
    prev() {
      this.loginStep = 1
    }
  }
}
</script>
