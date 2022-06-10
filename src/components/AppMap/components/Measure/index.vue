<template>
  <div>
    <k-map-measure ref="KMapMeasureRef" :type="type" v-if="show"></k-map-measure>
    <k-map-placement placement="left-top" :margin="[70, 0, 0, 8]" class="ol-control measure-btn-wrapper">
      <button @click="typeChange('line')" class="measure-button">线</button>
      <button @click="typeChange('area')" class="measure-button">面</button>
      <button @click="clear()" class="measure-button">清</button>
    </k-map-placement>
  </div>
</template>

<script>
import { defineComponent, nextTick, ref } from 'vue'

export default defineComponent({
  setup () {
    const show = ref(false)
    const type = ref('line')
    const KMapMeasureRef = ref()

    const clear = () => {
      KMapMeasureRef.value && KMapMeasureRef.value.clear()
      show.value = false
    }

    const typeChange = val => {
      type.value = val
      clear()
      nextTick(() => {
        show.value = true
      })
    }

    return {
      show,
      type,
      KMapMeasureRef,
      clear,
      typeChange
    }
  }
})
</script>

<style lang="scss" scoped>
.measure-btn-wrapper {
  background-color: rgba(0, 0, 0, 0.1) !important;
}
.measure-button {
  cursor: pointer;
  background-color: rgba(255, 255, 255, 0.9);
  color: #5f6477;
  font-weight: 500;
  outline: none;

  &:hover, &:focus {
    text-decoration: none;
    background-color: #fff;
    outline-color: inherit;
  }

  &:hover {
    opacity: 0.7;
  }
}
</style>
