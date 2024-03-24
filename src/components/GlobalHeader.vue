<template>
  <a-row class="grid-demo" align="center" :wrap="false">
    <a-col flex="auto">
      <a-menu
        mode="horizontal"
        :selected-keys="selectedKeys"
        @menu-item-click="doMenuClick"
      >
        <a-menu-item
          key="0"
          :style="{ padding: 0, marginRight: '38px' }"
          disabled
        >
          <div class="title-bar">
            <img class="logo" src="../assets/logo.png" alt="图标" />
            <div class="title">新 OJ</div>
          </div>
        </a-menu-item>
        <a-menu-item v-for="item in showRoutes" :key="item.path">
          {{ item.name }}
        </a-menu-item>
      </a-menu>
    </a-col>
    <a-col flex="100px">
      <LoginAndRegister
        v-if="store.state.user.loginUser.userRole === Access_Enum.UnLogin"
      ></LoginAndRegister>
      <a-avatar
        v-if="store.state.user.loginUser.userRole !== Access_Enum.UnLogin"
      >
        <img
          alt="avatar"
          src="https://p1-arco.byteimg.com/tos-cn-i-uwbnlip3yd/3ee5f13fb09879ecb5185e440cef6eb9.png~tplv-uwbnlip3yd-webp.webp"
        />
      </a-avatar>
    </a-col>
  </a-row>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { routes } from "@/router/routes";
import { computed, ref } from "vue";
import { useStore } from "vuex";
import checkAccess from "@/access/checkAccess";
import Access_Enum from "@/access/AccessEnum";
import LoginAndRegister from "@/components/LoginAndRegister.vue";

//默认主页
const selectedKeys = ref(["/"]);
//router信息对象，route是当前路由参数
const router = useRouter();
const store = useStore();

router.afterEach((to) => {
  selectedKeys.value = [to.path];
});

const showRoutes = computed(() => {
  return routes.filter((route) => {
    if (route.meta?.hideInMenu) {
      return false;
    }
    return checkAccess(
      //如果直接通过复制拿到的值，不是响应式数据
      store.state.user.loginUser,
      route.meta?.access as string
    );
  });
});

const doMenuClick = (key: string) => {
  router.push(key);
};
</script>

<style scoped>
.title-bar .logo {
  height: 30px;
}

.title-bar {
  display: flex;
}

.title-bar .title {
  margin-left: 20px;
  font-size: 20px;
  color: black;
}
</style>
