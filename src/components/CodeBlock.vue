<template>
  <div
    class="code-container"
    @mouseover="showCopyIcon"
    @mouseleave="hideCopyIcon"
  >
    <icon-copy class="copy-icon" @click="copyCode" />
    <pre class="hljs">
      <code ref="code" :class="lang">{{ codeText }}</code>
    </pre>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from "vue";
import hljs from "highlight.js";
import "highlight.js/styles/docco.css"; // 选择一个样式，你可以选择你喜欢的样式
import message from "@arco-design/web-vue/es/message";

const props = defineProps({
  codeText: {
    type: String,
    required: true,
  },
  lang: {
    type: String,
    default: "java",
  },
});

const code = ref(null);
const isCopyIconVisible = ref(false);

const removeHighlightAttribute = () => {
  if (code.value) {
    delete code.value.dataset.highlighted;
  }
};

const highlightCode = async () => {
  await nextTick(); // 确保DOM更新
  if (code.value) {
    console.log("进行高亮处理");
    removeHighlightAttribute(); // 移除高亮属性
    hljs.highlightElement(code.value);
  }
};

onMounted(() => {
  highlightCode();
});

watch(
  () => props.codeText,
  () => {
    highlightCode();
  }
);

const showCopyIcon = () => {
  isCopyIconVisible.value = true;
};

const hideCopyIcon = () => {
  isCopyIconVisible.value = false;
};

const copyCode = () => {
  const textToCopy = code.value?.innerText;
  navigator.clipboard
    .writeText(textToCopy)
    .then(() => {
      message.success("复制成功");
    })
    .catch((err) => {
      message.error("复制失败: " + err);
    });
};
</script>

<style scoped>
@import "highlight.js/styles/docco.css"; /* 确保引入和代码高亮相同的样式 */

.code-container {
  position: relative;
  background-color: #f5f5f5; /* 背景颜色与代码高亮样式一致 */
  font-family: "Courier New", Courier, monospace; /* 使用等宽字体 */
  overflow: auto;
  width: 100%; /* 确保宽度充满父容器 */
}

.hljs {
  padding: 1rem; /* 添加内边距以使代码内容不紧贴边框 */
  margin: 0; /* 移除默认外边距 */
}

.copy-icon {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  cursor: pointer;
  font-size: 1.25rem; /* 调整图标的大小 */
  opacity: 0;
  transition: opacity 0.3s ease-in-out; /* 平滑过渡效果 */
}

/* 当悬停在代码容器上时显示复制图标 */
.code-container:hover .copy-icon {
  opacity: 1;
}
</style>
