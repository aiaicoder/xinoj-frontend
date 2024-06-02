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
import QuestionsSubmissionsDetail from "@/views/question/QuestionsSubmissionsDetail.vue";
import UserManageView from "@/views/user/UserManageView.vue";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: QuestionsView,
    meta: {
      title: "小新判题",
    },
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
      title: "我的信息",
    },
  },
  {
    path: "/update/question",
    name: "更新题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.User,
      hideInMenu: true,
      title: "更新题目",
    },
  },
  {
    path: "/question_submit",
    name: "浏览题目提交",
    component: QuestionSubmitView,
    meta: {
      title: "提交浏览",
    },
  },
  {
    path: "/view/question/:id",
    name: "View-question",
    props: true,
    component: ViewQuestionsView,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.User,
      title: "问题详情",
    },
  },
  {
    path: "/submissions/detail/:id",
    name: "提交详情",
    props: true,
    component: QuestionsSubmissionsDetail,
    meta: {
      hideInMenu: true,
      access: ACCESS_ENUM.User,
      title: "提交详情",
    },
  },
  {
    path: "/manage/question",
    name: "管理题目",
    component: ManageQuestionView,
    meta: {
      access: ACCESS_ENUM.Admin,
      title: "管理题目",
    },
  },
  {
    path: "/add/question",
    name: "创建题目",
    component: AddQuestionView,
    meta: {
      access: ACCESS_ENUM.User,
      title: "创建题目",
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
  {
    path: "/manage/user",
    name: "用户管理",
    component: UserManageView,
    meta: {
      access: ACCESS_ENUM.Admin,
    },
  },
];
