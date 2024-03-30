<template>
  <Editor
    :value="value"
    :plugins="plugins"
    :mode="mode"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import { Editor } from "@bytemd/vue-next";
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
  handleChange: (v: string) => void;
  mode?: string;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
  mode: () => "split",
});
</script>

<style>
.bytemd-toolbar-icon.bytemd-tippy.bytemd-tippy-right:last-child {
  display: none;
}
</style>
