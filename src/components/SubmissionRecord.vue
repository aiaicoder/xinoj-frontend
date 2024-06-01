<template>
  <div>
    <a-form layout="inline">
      <a-form-item label="编程语言" style="min-width: 240px">
        <a-select
          :style="{ width: '320px' }"
          placeholder="请选择语言"
          v-model="selectedLanguage"
          @change="loadRecords"
        >
          <a-option value="">所有编程语言</a-option>
          <a-option v-for="(language, index) in languages" :key="index">
            {{ language }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :loading="loading"
      :columns="columns"
      :data="records"
      :pagination="false"
    >
      <template #status="{ record }">
        <a-tag :color="statusColor(record.judgeInfo?.message)">
          {{ record.judgeInfo.message }}
        </a-tag>
      </template>
      <template #judgeTime="{ record }">
        <icon-schedule />
        {{
          record.judgeInfo.time === null ? "N/A" : `${record.judgeInfo.time} ms`
        }}
      </template>
      <template #judgeMemory="{ record }">
        <icon-bug />
        {{
          record.judgeInfo.memory === null
            ? "N/A"
            : `${record.judgeInfo.memory} kb`
        }}
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import message from "@arco-design/web-vue/es/message";
import { useRoute } from "vue-router";
import {
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../generated";
import { useStore } from "vuex";
import moment from "moment/moment";

const loading = ref(true);
const records = ref([]);
const selectedLanguage = ref<string>(""); // 绑定选中的语言
const route = useRoute();
const questionId = route.params.id;

const languages = ref<string[]>([]); // 存储所有可选的编程语言
const store = useStore();
const loginUser = store.state.user.loginUser;
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: questionId,
  language: selectedLanguage.value,
  userId: loginUser.id,
});

onMounted(() => {
  loadLanguages(); // 加载可选的编程语言
  loadRecords();
});

watch(selectedLanguage, () => {
  searchParams.value.language = selectedLanguage.value;
  loadRecords();
});

const loadLanguages = async () => {
  try {
    const res = await QuestionControllerService.getAllLanguagesUsingGet();
    if (res.code === 0) {
      languages.value = res.data as string[];
    } else {
      message.error("加载编程语言失败：" + res.message);
    }
  } catch (error: any) {
    message.error("加载编程语言失败：" + error.message);
  }
};

const loadRecords = async () => {
  loading.value = true;
  try {
    const response =
      await QuestionControllerService.listMyQuestionSubmitVoRecordUsingPost(
        searchParams.value
      );
    if (response.code === 0) {
      records.value = response.data;
    } else {
      message.error("加载提交记录失败：" + response.message);
    }
  } catch (error: any) {
    message.error("加载提交记录失败：" + error.message);
  } finally {
    loading.value = false;
  }
};

const columns = [
  {
    title: "状态",
    dataIndex: "status",
    slotName: "status",
  },
  {
    title: "语言",
    dataIndex: "language",
  },
  {
    title: "执行时间",
    slotName: "judgeTime",
  },
  {
    title: "内存消耗",
    slotName: "judgeMemory",
  },
  {
    title: "提交时间",
    dataIndex: "createTime",
    render: (date: moment.MomentInput) => {
      return moment(date).format("YYYY-MM-DD HH:mm");
    },
  },
];

const statusColor = (status: string) => {
  switch (status) {
    case "通过":
      return "green";
    default:
      return "red";
  }
};
</script>

<style scoped></style>
