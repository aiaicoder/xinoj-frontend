import { RouteRecordRaw } from "vue-router";
import AdminView from "@/views/AdminView.vue";
import noAuthView from "@/views/noAuthView.vue";

import AddQuestionView from "@/views/question/AddQuestionView.vue";
import ACCESS_ENUM from "@/access/ACCESS_ENUM";
import ManageQuestionView from "@/views/question/ManageQuestionView.vue";
import QuestionsView from "@/views/question/QuestionsView.vue";
import ViewQuestionsView from "@/views/question/ViewQuestionsView.vue";
import UserCenterView from "@/views/user/UserCenterView.vue";
import UserLayout from "@/layouts/UserLayout.vue";
import QuestionSubmitView from "@/views/question/QuestionSubmitView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
  },
  {
    path: "/user",
    name: "用户",
    component: UserLayout,
    children: [
      {
        path: "/user/center",
        name: "用户中心",
        component: UserCenterView,
      },
    ],
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.User,
    },
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
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
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
