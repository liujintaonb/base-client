<template>
  <div class="k-map-placement" :class="placement" :style="styles">
    <slot></slot>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'KMapPlacement',
  props: {
    placement: {
      type: String,
      default: 'left-bottom',
      validator: val => {
        return [
          'left-top', 'center-top', 'right-top',
          'left-center', 'center-center', 'right-center',
          'left-bottom', 'center-bottom', 'right-bottom'
        ].includes(val)
      }
    },
    zIndex: {
      type: Number,
      default: 1
    },
    margin: {
      type: [Array, Number],
      default: 10
    }
  },
  computed: {
    styles () {
      return {
        zIndex: this.zIndex,
        margin: [].concat(this.margin).map(n => `${n}px`).join(' ')
      }
    }
  }
})
</script>
