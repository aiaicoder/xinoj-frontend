<template>
  <div id="manageQuestionView">
    <a-form :model="searchParams" layout="inline">
      <a-form-item field="title" label="名称" style="min-width: 240px">
        <a-input v-model="searchParams.title" placeholder="请输入名称" />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 240px">
        <a-input-tag v-model="searchParams.tags" placeholder="请输入标签" />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="doSubmit">提交</a-button>
      </a-form-item>
    </a-form>
    <a-divider size="0" />
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="handlePageChange"
    >
      <template #tag="{ record }">
        <a-space>
          <a-tag
            v-for="(tag, index) of record.tags"
            :key="index"
            :color="handleColor(record.tags[index])"
            >{{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #content="{ record }">
        <a-collapse :bordered="false">
          <a-collapse-item header="详情内容" key="1">
            <div>{{ record.content }}</div>
          </a-collapse-item>
        </a-collapse>
      </template>
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
import { onMounted, ref, watchEffect } from "vue";
import { QuestionControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";
import moment from "moment";
import { useRouter } from "vue-router";

const searchParams = ref({
  pageSize: 6,
  current: 1,
  title: "",
  tags: [],
});

const dataList = ref([]);
const total = ref(0);

/**
 * 初始化数据
 */
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
const handlePageChange = (current: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: current,
  };
};
/**
 * 处理不同难度对应不同的标签
 * @param record
 */
const handleColor = (record: any): string => {
  if (record === "困难") {
    return "red";
  } else if (record === "中等") {
    return "orange";
  } else if (record === "简单") {
    return "green";
  } else {
    return "gray";
  }
};

/**
 * 监听变量的改变重新触发loadData函数
 */
watchEffect(() => {
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
    title: "题目内容",
    dataIndex: "content",
    slotName: "content",
  },
  {
    title: "标签",
    dataIndex: "tags",
    slotName: "tag",
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
    title: "发布时间",
    dataIndex: "createTime",
    render: (date: moment.MomentInput) => {
      return moment(date).format("YYYY-MM-DD HH:mm");
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

const doDelete = async (question: any) => {
  const result = await QuestionControllerService.deleteQuestionUsingPost1(
    question.id
  );
  if (result.code === 0) {
    message.success("删除成功");
    await loadData();
  } else {
    message.error("删除失败");
  }
};

const doSubmit = async () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped></style>
