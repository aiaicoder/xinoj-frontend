<template>
  <div id="manageQuestionView">
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
    >
      <template #optional="{ record }">
        <a-space>
          <a-button @click="doUpdate(record)" type="primary">修改</a-button>
          <a-button @click="doDelete(record)" status="danger">删除</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { useRouter } from "vue-router";

const searchParams = ref({
  pageSize: 10,
  current: 1,
});

const dataList = ref([]);
const total = ref(0);

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    res.data.records.forEach((item: any) => {
      if (item.judgeConfig) {
        item.judgeConfig = JSON.stringify(item.judgeConfig);
      }
      if (item.judgeCase) {
        item.judgeCase = JSON.stringify(item.judgeCase);
      }
    });
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "id",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "内容",
    dataIndex: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
  },
  {
    title: "答案",
    dataIndex: "answer",
  },
  {
    title: "提交数",
    dataIndex: "submitNum",
  },
  {
    title: "通过数",
    dataIndex: "acceptedNum",
  },
  {
    title: "判题配置",
    dataIndex: "judgeConfig",
  },
  {
    title: "判题用例",
    dataIndex: "judgeCase",
  },
  {
    title: "用户id",
    dataIndex: "userId",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    render: (date: moment.MomentInput) => {
      return moment(date).format("YYYY-MM-DD hh:mm");
    },
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const router = useRouter();
const doUpdate = (question: any) => {
  console.log(question);
  router.push({
    path: "/update/question",
    query: {
      id: question.id,
    },
  });
};

const doDelete = (question: any) => {
  console.log(question.id);
};
</script>

<style scoped></style>
