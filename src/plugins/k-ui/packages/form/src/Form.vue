<template>
  <section class="k-form-container">
    <el-form
      :inline="inline"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      :label-width="labelWidth"
      class="demo-ruleForm"
    >
      <slot v-if="mode==='render'"></slot>
      <!-- <template v-if="mode === 'config'"> -->
      <el-form-item
        v-else
        v-for="(column, index) in columns"
        :key="`${column.label}_${index}`"
        :label="column.label||''"
        :prop="column.prop"
      >
        <!-- 输入框 -->
        <el-input
          v-if="column.type==='input'"
          :placeholder="column.placeholder||'请输入'"
          v-model="ruleForm[column.prop]"
        ></el-input>
        <!-- 下拉菜单 -->
        <el-select
          v-else-if="column.type==='select'"
          :placeholder="column.placeholder||'请选择'"
          v-model="ruleForm[column.prop]"
        >
          <el-option
            v-for="(item,key) in column.options"
            :key="`${item.label}_${key}`"
            :label="column.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <!-- 时间组件 -->
        <el-time-picker
          v-else-if="column.type==='time'"
          :type="column.pickerType"
          style="width:100%"
          :placeholder="column.placeholder||'请选择'"
          v-model="ruleForm[column.prop]"
        ></el-time-picker>
        <!-- 选择按钮 -->
        <el-switch
          v-else-if="column.type==='switch'"
          v-model="ruleForm[column.prop]"
        ></el-switch>
        <!-- 多选 -->
        <el-checkbox-group
          v-else-if="column.type==='checkbox'"
          v-model="ruleForm[column.prop]"
        >
          <el-checkbox
            v-for="(item,key) in column.options"
            :key="`${item.label}_${key}`"
            :label="item.label"
            :name="item.name"
          ></el-checkbox>
        </el-checkbox-group>
        <!-- 单选 -->
        <el-radio-group
          v-else-if="column.type==='radio'"
          :placeholder="column.placeholder||'请选择'"
          v-model="ruleForm[column.prop]"
        >
          <el-radio
            v-for="(item,key) in column.options"
            :key="`${item.label}_${key}`"
            :label="item.label"
          ></el-radio>
          <el-radio label="线下场地免费"></el-radio>
        </el-radio-group>
        <!-- 富文本 -->
        <el-input
          v-else-if="column.type==='textarea'"
          :placeholder="column.placeholder||'请输入'"
          v-model="ruleForm[column.prop]"
        ></el-input>
      </el-form-item>
      <!-- </template> -->

      <el-form-item
        v-for="(item,key) in btnColumns"
        :key="`${item.label}_${key}`"
      >
        <el-button
          v-perm="item.perm"
          :type="item.type||'primary'"
          @click="item.callBack"
        >{{item.label}}</el-button>
      </el-form-item>
    </el-form>
  </section>
</template>

<script>
import { defineComponent, computed } from 'vue'

export default defineComponent({
  name: 'KForm',
  props: {
    mode: {
      type: String,
      default: 'config',
      validator: (val) => {
        return ['config', 'render'].includes(val)
      }
    },
    labelWidth: {
      type: String,
      default: '100px'
    },
    inline: {
      type: Boolean,
      default: true
    },
    formData: {
      type: Object,
      default: () => {
        return {}
      }
    },
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    btnColumns: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  setup (props) {
    const ruleForm = computed(() => props.formData)
    return {
      ruleForm
    }
  }
})
</script>
