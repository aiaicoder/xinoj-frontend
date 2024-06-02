<template>
  <div id="questionsView">
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
      <template #acceptedRate="{ record }">
        <a-progress
          :percent="
            record.submitNum
              ? +(record.acceptedNum / record.submitNum).toFixed(3)
              : 0
          "
          :style="{ width: '120%' }"
        />
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm:ss") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button @click="doQuestion(record)" type="primary">做题</a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import { Question, QuestionControllerService } from "../../../generated";
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

const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
    searchParams.value
  );
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    message.error("加载失败，" + res.message);
  }
};

/**
 * 处理不同难度标签对应不同的颜色
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
 * 监听变量的改变重新触发loadData函数
 */
watchEffect(() => {
  loadData();
});

const columns = [
  {
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "标题",
    dataIndex: "title",
  },
  {
    title: "标签",
    dataIndex: "tags",
    slotName: "tag",
  },
  {
    title: "通过率",
    slotName: "acceptedRate",
  },

  {
    title: "发布时间",
    slotName: "createTime",
  },
  {
    title: "操作",
    slotName: "optional",
  },
];

const router = useRouter();
/**
 * 跳转到对应的做题页
 * @param question
 */
const doQuestion = (question: Question) => {
  console.log(question);
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 执行搜索
 */
const doSubmit = async () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1,
  };
};
</script>

<style scoped>
#questionsView {
  max-width: 1280px;
  margin: 0 auto;
}
</style>
