<template>
  <div>
    <el-button-group style="display: flex;">
      <template>
        <div v-for="(item, index) in buttonGroup.fields" :key="index" style="margin-right: 10px;">
          <div v-if="buttonGroup.selected">
            <el-dropdown split-button :type="buttonGroup.type ? buttonGroup.type: 'primary'">
              {{ item.text }}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item2, index2) in buttonGroup.selectList" :key="index2">{{ item2.type }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <el-button
              size=""
              :type="buttonGroup.type ? buttonGroup.type: 'primary'"
              :icon="item.icon"
              @click="operate(item.type ? item.type : '')"
            >{{ item.text }}</el-button>
          </div>
        </div>
      </template>
    </el-button-group>
  </div>
</template>

<script>
export default {
  name: 'OperationButton',
  props: {
    buttonGroup: { type: Object, default: null }
  },
  data() {
    return {
    }
  },
  methods: {
    operate(v) {
      this.$emit('operateEmit', v)
    }
  }
}
</script>
