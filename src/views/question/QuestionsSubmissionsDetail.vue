<template>
  <div class="layout-container">
    <a-layout class="layout" style="min-height: 100vh">
      <a-layout-header class="header">
        <!-- 添加标题和状态信息 -->
        <div class="header-title">
          <router-link
            v-if="questionVo"
            :to="`/view/question/${questionVo.id}`"
            class="header-link"
          >
            {{ questionVo.title || "问题标题加载中..." }}
          </router-link>
          <span v-else>问题数据加载中...</span>
        </div>
        <div class="header-status">
          <span class="status-label">状态：</span>
          <span
            :class="[
              'status-value',
              statusInfo === '通过' ? 'status-pass' : 'status-fail',
            ]"
            >{{ statusInfo }}</span
          >
          <span class="submit-time"
            >提交时间：<strong>{{ formattedSubmitTime }}</strong></span
          >
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <h2>提交记录</h2>
        <div class="record">
          <p>
            <strong>{{ passNum }} / {{ totalNum }}</strong> 个通过测试用例
          </p>
          <p>执行用时：{{ time }} ms</p>
          <p>内存消耗：{{ memory }} kb</p>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer">
        <div>
          <h4>
            提交的代码：
            <span>{{ formattedSubmitTime }}</span>
          </h4>
          <p>语言：{{ language }}</p>
          <div class="code-block-container">
            <CodeBlock :codeText="codeText" :lang="language" />
          </div>
        </div>
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import { QuestionControllerService } from "../../../generated";
import { computed, onMounted, ref } from "vue";
import message from "@arco-design/web-vue/es/message";
import CodeBlock from "@/components/CodeBlock.vue";
import { formatDistanceToNow, parseISO } from "date-fns";
import { zhCN } from "date-fns/locale";

const route = useRoute();
const questionSubmitId = route.params.id;
const questionSubmit = ref({});
// 计算属性，用以安全访问属性
const codeText = computed(() => questionSubmit.value?.code || "加载中...");
const language = computed(() => questionSubmit.value?.language || "java");
const submitTime = computed(() => questionSubmit.value?.createTime || "");
const judgeInfo = computed(() => questionSubmit.value?.judgeInfo || null);
// 获取执行时间
const time = computed(() => judgeInfo.value?.time);
// 获取执行消耗的内存
const memory = computed(() => judgeInfo.value?.memory);
// 获取通过数
const passNum = computed(() => judgeInfo.value?.passNum);
// 获取案例数
const totalNum = computed(() => judgeInfo.value?.totalNum);

//状态信息，假设judgeInfo.message存在并包含状态信息
const statusInfo = computed(() => judgeInfo.value?.message || "loading...");

// 正确获取 questionVO 对象
const questionVo = computed(() => questionSubmit.value?.questionVO || null);

// 时间格式化插件
const formattedSubmitTime = computed(() => {
  if (submitTime.value) {
    return formatDistanceToNow(parseISO(submitTime.value), {
      addSuffix: true,
      locale: zhCN,
    });
  }
  return "";
});

const loadQuestionSubmit = async () => {
  // load question submit
  const res = await QuestionControllerService.getJudgeResultUsingGet(
    questionSubmitId
  );
  if (res.code === 0) {
    questionSubmit.value = res.data;
  } else {
    message.error(res.message);
  }
};

onMounted(() => {
  loadQuestionSubmit();
});
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem; /* 添加内边距 */
}

.header-title,
.header-status {
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 1rem; /* 间距 */
}

.header-link {
  color: black; /* 设置链接颜色为黑色 */
  text-decoration: none; /* 移除链接下划线 */
  font-size: 1.2rem; /* 调整标题大小 */
  font-weight: bold;
}

.header-link:hover {
  text-decoration: none; /* 删除悬停时显示下划线 */
}

.status-label {
  color: #888;
}

.status-value {
  font-weight: bold;
}

.status-pass {
  color: #28a745;
}

.status-fail {
  color: red;
}

.submit-time {
  color: black;
}

.content {
  flex: 1;
  background-color: #fff;
}

.record {
  border: 1px solid #ddd;
  padding: 1rem;
  margin-top: 1rem;
  background-color: #fafafa;
}

.footer {
  background-color: #fff; /* 设置背景颜色为白色 */
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.code-block-container {
  max-width: 1200px; /* 限制代码块最大宽度 */
  max-height: 800px;
  width: 100%; /* 让代码块占满容器宽度 */
  overflow-y: auto; /* 使代码块可以滚动 */
  text-align: left;
  white-space: pre-wrap; /* 折行显示 */
  box-sizing: border-box; /* 包括内边距*/
}
</style>
