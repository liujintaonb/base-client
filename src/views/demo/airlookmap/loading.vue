<template>
  <airlookmap></airlookmap>
</template>

<script>
import { defineComponent } from 'vue'
import Airlookmap from '@/plugins/airlookmap'

export default defineComponent({
  components: { Airlookmap }
})
</script>

<style lang="scss" scoped>
.airlookmap-container {
  height: 100%;
  width: 100%;
  position: relative;
}
</style>
