<template>
  <div id="basicLayout">
    <a-layout style="min-height: 100vh">
      <a-layout-header class="header">
        <GlobalHeader />
      </a-layout-header>
      <a-layout-content class="content">
        <router-view></router-view>
      </a-layout-content>
      <a-layout-footer class="footer">
        <a href="https://xinzz.vip/" target="_blank">小新的编程博客</a>
      </a-layout-footer>
    </a-layout>
  </div>
</template>
<style scoped>
#basicLayout .content {
  background: linear-gradient(to right, #2874f0, #654ea3);
  margin-bottom: 16px;
  padding: 20px;
}

#basicLayout .footer {
  background-color: aliceblue;
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 10px;
  text-align: center;
}
</style>

<script setup lang="ts">
import GlobalHeader from "@/components/GlobalHeader.vue";
</script>
