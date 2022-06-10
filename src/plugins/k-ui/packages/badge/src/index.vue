<template>
  <div class="status-badge-wrapper">
    <span :class="`badge badge__${type} is-dot`"></span>
    <span class="status-badge__content">
      <slot>{{ content }}</slot>
    </span>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'KBadge',
  props: {
    type: {
      type: String,
      default: 'primary',
      validator: val => {
        return ['primary', 'success', 'warning', 'info', 'danger'].includes(val)
      }
    },
    content: {
      type: String,
      default: ''
    }
  }
})
</script>
