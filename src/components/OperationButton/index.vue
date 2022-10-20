<template>
  <div>
    <el-button-group style="display: flex;">
      <template>
        <div v-for="(item, index) in buttonGroup.fields" :key="index" style="margin-right: 10px;">

          <div v-if="item.selected">
            <el-dropdown split-button :type="item.type ? item.type: 'primary'" @command="operate">
              {{ item.text }}
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="(item2, index2) in item.selectList" :key="index2" :command="{value: item2.value, operateType: item.operateType}">{{ item2.title }}</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div v-else>
            <el-button
              v-if="item.showButtonGroup"
              size=""
              :type="item.type ? item.type: 'primary'"
              :icon="item.icon"
              @click="operate(item.operateType)"
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
