<template>
  <div id="code-editor" ref="codeEditorRef" style="height: 400px"></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor"; // 全部导入
import { ref, onMounted, toRaw, withDefaults, defineProps } from "vue";

const codeEditor = ref();
const codeEditorRef = ref();

interface Props {
  value: string;
  handleChange: (value: string) => void;
}

const props = withDefaults(defineProps<Props>(), {
  value: "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value,
    language: "java",
    minimap: {
      enabled: true,
      size: "fit",
    },
    automaticLayout: true,
    colorDecorators: true, //颜色装饰器
    readOnly: false, //是否开启已读功能
    theme: "vs-dark", //主题
    lineNumbers: "on",
  });
  // 监听编辑器内容变化
  codeEditor.value.onDidChangeModelContent(() => {
    // 触发父组件的 change 事件，通知编辑器内容变化,使用toRaw防止卡死
    props.handleChange(toRaw(codeEditor.value).getValue());
  });
});
</script>

<style scoped></style>
