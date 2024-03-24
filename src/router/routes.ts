import { RouteRecordRaw } from "vue-router";
import HomeView from "@/views/HomeView.vue";
import AdminView from "@/views/AdminView.vue";
import noAuthView from "@/views/noAuthView.vue";
import AccessEnum from "@/access/AccessEnum";

export const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "主页",
    component: HomeView,
  },
  {
    path: "/about",
    name: "题目",
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/admin",
    name: "管理员可见",
    meta: {
      access: AccessEnum.Admin,
    },
    component: AdminView,
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
