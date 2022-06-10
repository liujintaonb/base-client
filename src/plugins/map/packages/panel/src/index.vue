<template>
  <div v-if="modelValue" v-bind="dragOptions" :class="classes" :style="wrapperStyle" class="k-map-placement k-map-panel">
    <div class="k-map-planel__header">
      <div class="k-map-planel__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="$slots.toolbar" :class="toolbarClass">
        <slot name="toolbar"></slot>
      </div>
      <i v-if="closeable" @click="handleClose" class="k-map-planel__close el-icon-close"></i>
    </div>
    <div class="k-map-panel__body">
      <slot></slot>
    </div>
    <div v-if="$slots.footer" ref="footer" :class="footerClass">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'KMapPanel',
  inject: ['KMap'],
  /**
     * 属性参数
     * @member props
     * @property {string} [width] 宽度
     * @property {string} [height] 高度
     * @property {boolean|object} [draggable] 拖拽配置，参考 my-drag组件
     * @property {boolean|resizable} [resizable] Resize配置
     * @property {string} [title] 标题文本，可以用插槽定义
     * @property {boolean} [closable] 显示关闭按钮
     * @property {string} [footerAlign] 底部对齐方式,支持 'left', 'right', 'center'
     */
  props: {
    // 是否可见
    modelValue: {
      type: Boolean,
      default: true
    },
    width: String,
    height: String,
    draggable: [Boolean, Object],
    resizable: [Boolean, Object],
    title: String,
    closable: Boolean,
    footerAlign: {
      type: String,
      validator (val) {
        return ['left', 'right', 'center'].includes(val)
      }
    }
  },
  data () {
    return {
      footerHeight: 0,
      mapWarp: null
    }
  },
  computed: {
    dragOptions () {
      return {
        disabled: !this.draggable,
        handle: () => {
          return this.$refs.header || this.$el
        },
        target: this.mapWarp,
        ...this.draggable
      }
    },
    toolbarClass () {
      return {
        'k-map-panel__toolbar': true,
        'is-closable': this.closable
      }
    },
    wrapperStyle () {
      return {
        ...this.styles,
        width: this.width === '100%' ? this.width : null,
        height: this.height === '100%' ? this.height : null
      }
    },
    footerClass () {
      return {
        'k-map-panel__footer': true,
        [`is-${this.footerAlign}`]: !!this.footerAlign
      }
    }
  },
  mounted () {
    this.setFooterHeight()
    this.mapWarp = this.KMap?.$el || this.$parent.$el
  },
  methods: {
    setFooterHeight () {
      if (this.$refs.footer) {
        this.footerHeight = this.$refs.footer.getBoundingClientRect().height
      }
    },
    handleClose () {
      this.$emit('update:modelValue', false)
      this.$emit('close')
    }
  }
})
</script>
