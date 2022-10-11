<template>
  <div>
    <el-button-group>
      <template>
        <div v-for="(item, index) in buttonGroup.fields" :key="index">
          <el-button
            size=""
            :type="buttonGroup.type ? buttonGroup.type: 'primary'"
            :icon="item.icon"
            @click="operate()"
          >{{ item.text }}</el-button>
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
    operate() {
      this.$emit('operateEmit')
    }
  }
}
</script>
