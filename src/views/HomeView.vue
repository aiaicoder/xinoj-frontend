<template>
  <div class="home">
    <Content msg="Welcome to Your Vue.js + TypeScript App" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Content from "@/components/Content.vue";

export default defineComponent({
  name: "HomeView",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Content,
  },
});
</script>
