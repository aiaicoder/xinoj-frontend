<template>
  <div class="home">
    <MdEditor :value="Mdvalue" :handle-change="MdhandleChange"></MdEditor>
    <CodeEditor
      :value="Codevalue"
      :handle-change="CodehandleChange"
    ></CodeEditor>
  </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import { ref } from "vue";
import CodeEditor from "@/components/CodeEditor.vue";

const Mdvalue = ref();
const Codevalue = ref();
const CodehandleChange = (val: string) => {
  Codevalue.value = val;
  console.log(val);
};
const MdhandleChange = (val: string) => {
  Mdvalue.value = val;
  console.log(val);
};
</script>
