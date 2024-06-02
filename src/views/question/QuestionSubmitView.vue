<template>
  <div id="questionSubmitView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="questionId" label="题号" style="min-width: 240px">
        <a-input v-model="searchParams.questionId" placeholder="请输入" />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 240px">
        <a-select v-model="searchParams.language" :style="{ width: '320px' }">
          <a-option value="">所有编程语言</a-option>
          <a-option v-for="(language, index) in codeLanguages" :key="index"
            >{{ language }}
          </a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">搜索</a-button>
      </a-form-item>
      <a-checkbox v-model="showMy">只看我的</a-checkbox>
    </a-form>
    <a-divider size="0" />
    <a-table
      :ref="tableRef"
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        <a-tag :color="handleColor(record.judgeInfo?.message)">
          {{ record?.judgeInfo?.message }}
        </a-tag>
      </template>
      <template #status="{ record }">
        {{ record?.status === 2 ? "判题成功" : "判题失败" }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            type="primary"
            v-if="loginUser.id === record.userId"
            @click="toQuestionPage(record)"
            >查看详情
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import { useRouter } from "vue-router";
import moment from "moment";
import message from "@arco-design/web-vue/es/message";
import { useStore } from "vuex";

const tableRef = ref();
const showMy = ref(false);
const dataList = ref([]);
const total = ref(0);
const store = useStore();
const loginUser = store.state.user.loginUser;
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: "",
  pageSize: 10,
  current: 1,
});

const loadData = async () => {
  let res;
  if (showMy.value) {
    res = await QuestionControllerService.listMyQuestionSubmitVoByPageUsingPost(
      {
        ...searchParams.value,
        sortField: "createTime",
        sortOrder: "descend",
      }
    );
  } else {
    res = await QuestionControllerService.listQuestionSubmitVoByPageUsingPost({
      ...searchParams.value,
      sortField: "createTime",
      sortOrder: "descend",
    });
  }
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 监听 searchParams 变量，改变时触发页面的重新加载
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
  getLanguages();
});

const columns = [
  {
    title: "提交号",
    dataIndex: "id",
    slotName: "id",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
    slotName: "status",
  },
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "提交者 id",
    dataIndex: "userId",
  },
  {
    title: "判题时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const handleColor = (record: any): string => {
  if (record === "通过") {
    return "green";
  } else {
    return "red";
  }
};

const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

const router = useRouter();

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/submissions/detail/${question.id}`,
  });
};

const codeLanguages = ref<string[]>([]);

const getLanguages = async () => {
  const res = await QuestionControllerService.getAllLanguagesUsingGet();
  if (res.code === 0) {
    codeLanguages.value = res.data as string[];
  } else {
    message.error("加载失败," + res.message);
  }
};

/**
 * 确认搜索，重新加载数据
 */
const doSubmit = () => {
  // 这里需要重置搜索页号
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionSubmitView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
