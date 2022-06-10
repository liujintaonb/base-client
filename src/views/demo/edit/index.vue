<template>
  <div>
    <el-alert type="info">
      <template #title>
        <p>富文本是管理后台一个比较核心的功能，但同时又是一个有很多坑的地方。</p>
        <p>在选择富文本编辑器的, 建议选择 wangEditor 与 Ueditor 的变种 Neditor 更现代化一些，去掉了UE中的后端代码，且兼容市面上大部分微信编辑器</p>
        <p>这里只封装了 wangEditor 富文本编辑器。</p>
      </template>
    </el-alert>
    <div class="edit-wrapper">
      <el-button style="margin-bottom: 20px;" @click="syncContent">同步内容</el-button>
      <wang-edit v-model="content"></wang-edit>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue'
import WangEdit from '_c/WangEdit'

export default defineComponent({
  components: { WangEdit },
  setup () {
    const content = ref('')
    const syncContent = () => {
      content.value = '<div contenteditable="true" style="width:100%; height:100%; min-height:300px;" class="w-e-text" id="text-elem9967882380010324"><pre><code class="JavaScript"><xmp><template><wang-edit v-model="content"></wang-edit></template></xmp></code></pre><p data-we-empty-p="">使用如 el-input ， 可用于表单</p></div>'
    }
    return {
      content,
      syncContent
    }
  }
})
</script>

<style lang="scss" scoped>
.edit-wrapper {
  margin-top: 20px;
}
</style>
