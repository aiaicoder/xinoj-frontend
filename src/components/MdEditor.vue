<template>
  <Editor
    :value="value"
    :plugins="plugins"
    :mode="mode"
    :locale="locale"
    @change="handleChange"
  />
</template>

<script setup lang="ts">
import gfm from "@bytemd/plugin-gfm";
import { Editor } from "@bytemd/vue-next";
import { defineProps, withDefaults } from "vue";
import highlight from "@bytemd/plugin-highlight";
import math from "@bytemd/plugin-math";
import locale from "bytemd/locales/zh_Hans.json";
// 引入汉化包
import mathLocale from "@bytemd/plugin-math/locales/zh_Hans.json";
import gfmLocale from "@bytemd/plugin-gfm/locales/zh_Hans.json";

const plugins = [
  gfm({
    locale: gfmLocale,
  }),
  // Add more plugins here
  highlight(),
  math({
    locale: mathLocale,
  }),
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
