import { RouteRecordRaw } from "vue-router";
import AdminView from "@/views/AdminView.vue";
import noAuthView from "@/views/noAuthView.vue";

import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionsView from "@/views/question/ViewQuestionsView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.User,
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.Admin,
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.User,
      hideInMenu: true,
    },
  },

  {
    path: "/questions",
    name: "浏览题目",
    component: QuestionsView,
  },
  {
    path: "/admin",
    name: "管理员可见",
    meta: {
      access: ACCESS_ENUM.Admin,
    },
    component: AdminView,
  },
  {
    path: "/view/question/:id",
    name: "在线做题",
    props: true,
    component: ViewQuestionsView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.User,
    },
  },
  {
    path: "/noAuth",
    name: "无权限",
    meta: {
      hideInMenu: true,
    },
    component: noAuthView,
  },
];
