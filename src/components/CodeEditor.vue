<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 400px; height: 60vh"
  ></div>
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor"; // 全部导入
import { ref, onMounted, toRaw, withDefaults, defineProps, watch } from "vue";

const codeEditor = ref();
const codeEditorRef = ref();

interface Props {
  code: any;
  handleChange: (value: string) => void;
  language?: string;
}

const props = withDefaults(defineProps<Props>(), {
  code: "import java.util.Scanner;\n// 1:无需package\n// 2: 类名必须Main, 不可修改\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner scan = new Scanner(System.in);\n        //在此输入您的代码...\n        scan.close();\n    }\n}",
  handleChange: (v: string) => {
    console.log(v);
  },
  language: () => "java",
});

/**
 * 监听编辑器中语言的变化
 */
watch(
  () => props.language,
  () => {
    if (codeEditor.value) {
      toRaw(codeEditor?.value).getModel().setValue(props.code);
      monaco.editor.setModelLanguage(
        toRaw(codeEditor.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  if (!codeEditorRef.value) {
    return;
  }
  codeEditor.value = monaco.editor.create(codeEditorRef.value, {
    value: props.code,
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
