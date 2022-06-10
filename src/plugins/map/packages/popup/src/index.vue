<template>
  <k-map-html v-bind="$attrs" ref="html" :class="classes" :style="{ 'width': width }" v-clickoutside="handleClickOutside">
    <i class="k-map-popup__close el-icon-close" v-if="closable" @click="hide"></i>
    <div v-if="title" class="k-map-popup__title">
      <slot name="title">{{ title }}</slot>
    </div>
    <div class="k-map-popup__body" :style="{ 'height': height }">
      <slot></slot>
    </div>
  </k-map-html>
</template>

<script>
import { computed, defineComponent, ref } from 'vue'
import KMapHtml from '../../html'
import { ClickOutside as clickoutside } from 'element-plus/lib/directives'

export default defineComponent({
  name: 'KMapPopup',
  components: { KMapHtml },
  directives: {
    clickoutside
  },
  /**
   * 属性参数
   * @member props
   * @property {string} [width] 弹窗主体宽度
   * @property {string} [height] 弹窗主体高度
   * @property {string} [title] 弹窗标题
   * @property {string|object} [icon] 弹窗icon
   * @property {boolean} [closable] c
   * @property {boolean} [closeOnClick] 是否点击外部关闭
   * @property {boolean} [showArrow] 是否显示箭头
   */
  props: {
    width: String,
    height: String,
    title: String,
    closable: {
      type: Boolean,
      default: true
    },
    position: {
      type: Array,
      required: true
    },
    closeOnClick: Boolean,
    showArrow: {
      type: [String, Boolean],
      default: true
    }
  },
  emits: ['show', 'hide'],
  setup (props, { emit }) {
    const html = ref()

    const show = position => {
      const coordinate = position || props.position
      html.value.setPosition(coordinate)
      emit('show', coordinate)
    }

    const hide = () => {
      html.value.setPosition(null)
      emit('hide')
    }

    const handleClickOutside = () => {
      if (props.closeOnClick) {
        hide()
      }
    }

    const classes = computed(() => {
      return ['k-map-popup', `${props.showArrow ? 'arrow' : ''} ${props.showArrow === 'left' ? 'arrow-left' : 'arrow-bottom'}`]
    })

    return {
      html,
      classes,
      show,
      hide,
      handleClickOutside
    }
  }
})
</script>
