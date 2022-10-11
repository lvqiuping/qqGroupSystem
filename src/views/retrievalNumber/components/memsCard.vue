<template>
  <div class="container-box">
    <div style="display:flex;justify-content: start; font-size: 18px; padding: 0 0 10px 0;">
      <div>({{ qqGroups.qq }})</div>
      <div style="color: #409EFF; cursor: pointer; padding-left: 20px; padding-right: 20px; font-size: 14px;" @click="prev">[切换QQ账号]</div>
    </div>
    <el-card shadow="never" style="margin-bottom: 10px; border: none;">
      <div style="margin-bottom: 20px; font-size: 14px; font-weight: 600;">我创建的群（{{ qqGroups.create.length }}）</div>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in qqGroups.create" :key="index" :span="8">
          <el-image :src="require('@/assets/login/u.png')" style="width: 16px; height: 16px; margin-right: 10px" />
          <el-link style="margin-bottom: 10px" @click="getMem(item)">
            <span>{{ item.gn }}</span>
          </el-link>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" style="margin-bottom: 10px; border: none;">
      <div style="margin-bottom: 20px; font-size: 14px; font-weight: 600;">
        我管理的群（{{ qqGroups.manage.length }}）
      </div>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in qqGroups.manage" :key="index" :span="8">
          <el-image :src="require('@/assets/login/u.png')" style="width: 16px; height: 16px; margin-right: 10px" />
          <el-link style="margin-bottom: 10px" @click="getMem(item)">
            <span>{{ item.gn }}</span>
          </el-link>
        </el-col>
      </el-row>
    </el-card>
    <el-card shadow="never" style="margin-bottom: 10px; border: none;">
      <div style="margin-bottom: 20px; font-size: 14px; font-weight: 600;">
        我加入的群（{{ qqGroups.join.length }}）
      </div>
      <el-row :gutter="20">
        <el-col v-for="(item, index) in qqGroups.join" :key="index" :span="8">
          <div>
            <el-image :src="require('@/assets/login/u.png')" style="width: 16px; height: 16px; margin-right: 10px" />
            <el-link style="margin-bottom: 10px" @click="getMem(item)">
              <span>{{ item.gn }}</span>
            </el-link>
          </div>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'MemsTable',
  props: {
    qqGroups: { type: Object, default: Object }
  },
  methods: {
    getMem(v) {
      this.$emit('getGetGroupMembers', v)
    },
    prev() {
      this.$emit('prev', 1)
    }
  }
}
</script>
<style scoped>
  .container-box {
    max-height: 75vh;
    overflow-x: hidden;
  }
  </style>
