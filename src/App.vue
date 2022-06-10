<template>
  <k-lazy :timeout="1000">
    <router-view />
    <template #skeleton>
      <div class="app-wrapper">
        <div class="sidebar-container"></div>
        <div class="main-container">
          <div class="navbar"></div>
          <div class="app-main">
            <div class="app-container">
              <content-loader
                :speed="2"
                :width="1000"
                :height="550"
                viewBox="0 0 1000 550"
                backgroundColor="#eaeced"
                foregroundColor="#ffffff"
              >
                <rect x="51" y="45" rx="3" ry="3" width="906" height="17" />
                <circle cx="879" cy="123" r="11" />
                <circle cx="914" cy="123" r="11" />
                <rect x="104" y="115" rx="3" ry="3" width="141" height="15" />
                <rect x="305" y="114" rx="3" ry="3" width="299" height="15" />
                <rect x="661" y="114" rx="3" ry="3" width="141" height="15" />
                <rect x="55" y="155" rx="3" ry="3" width="897" height="2" />
                <circle cx="880" cy="184" r="11" />
                <circle cx="915" cy="184" r="11" />
                <rect x="105" y="176" rx="3" ry="3" width="141" height="15" />
                <rect x="306" y="175" rx="3" ry="3" width="299" height="15" />
                <rect x="662" y="175" rx="3" ry="3" width="141" height="15" />
                <rect x="56" y="216" rx="3" ry="3" width="897" height="2" />
                <circle cx="881" cy="242" r="11" />
                <circle cx="916" cy="242" r="11" />
                <rect x="106" y="234" rx="3" ry="3" width="141" height="15" />
                <rect x="307" y="233" rx="3" ry="3" width="299" height="15" />
                <rect x="663" y="233" rx="3" ry="3" width="141" height="15" />
                <rect x="57" y="274" rx="3" ry="3" width="897" height="2" />
                <circle cx="882" cy="303" r="11" />
                <circle cx="917" cy="303" r="11" />
                <rect x="107" y="295" rx="3" ry="3" width="141" height="15" />
                <rect x="308" y="294" rx="3" ry="3" width="299" height="15" />
                <rect x="664" y="294" rx="3" ry="3" width="141" height="15" />
                <rect x="58" y="335" rx="3" ry="3" width="897" height="2" />
                <circle cx="881" cy="363" r="11" />
                <circle cx="916" cy="363" r="11" />
                <rect x="106" y="355" rx="3" ry="3" width="141" height="15" />
                <rect x="307" y="354" rx="3" ry="3" width="299" height="15" />
                <rect x="663" y="354" rx="3" ry="3" width="141" height="15" />
                <rect x="57" y="395" rx="3" ry="3" width="897" height="2" />
                <circle cx="882" cy="424" r="11" />
                <circle cx="917" cy="424" r="11" />
                <rect x="107" y="416" rx="3" ry="3" width="141" height="15" />
                <rect x="308" y="415" rx="3" ry="3" width="299" height="15" />
                <rect x="664" y="415" rx="3" ry="3" width="141" height="15" />
                <rect x="55" y="453" rx="3" ry="3" width="897" height="2" />
                <rect x="51" y="49" rx="3" ry="3" width="2" height="465" />
                <rect x="955" y="49" rx="3" ry="3" width="2" height="465" />
                <circle cx="882" cy="484" r="11" />
                <circle cx="917" cy="484" r="11" />
                <rect x="107" y="476" rx="3" ry="3" width="141" height="15" />
                <rect x="308" y="475" rx="3" ry="3" width="299" height="15" />
                <rect x="664" y="475" rx="3" ry="3" width="141" height="15" />
                <rect x="55" y="513" rx="3" ry="3" width="897" height="2" />
                <rect x="52" y="80" rx="3" ry="3" width="906" height="17" />
                <rect x="53" y="57" rx="3" ry="3" width="68" height="33" />
                <rect x="222" y="54" rx="3" ry="3" width="149" height="33" />
                <rect x="544" y="55" rx="3" ry="3" width="137" height="33" />
                <rect x="782" y="56" rx="3" ry="3" width="72" height="33" />
                <rect x="933" y="54" rx="3" ry="3" width="24" height="33" />
              </content-loader>
            </div>
          </div>
        </div>
      </div>
    </template>
  </k-lazy>
</template>

<script>
import { defineComponent } from 'vue'
import { ContentLoader } from 'vue-content-loader'

export default defineComponent({
  components: { ContentLoader }
})
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);
}
.app-main {
  /* 50= navbar  50  */
  position: relative;
  min-height: calc(100vh - 50px);
  width: 100%;
  padding: 10px;
  overflow: hidden;
}

.app-container {
  position: relative;
  width: 100%;
  height: calc(100vh - 70px);
  padding: 16px 20px;
  background: #fff;
  overflow-y: auto;
  svg {
    width: 100%;
    max-height: 100%;
    height: auto;
    overflow: hidden;
  }
}
</style>
