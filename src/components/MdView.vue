<template>
  <Viewer :value="value" :plugins="plugins" />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import { Viewer } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";
import highlight from "@bytemd/plugin-highlight";

const plugins = [
  gfm(),
  // Add more plugins here
  highlight(),
];

// 定义Props属性
interface Props {
  value: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
});
</script>
