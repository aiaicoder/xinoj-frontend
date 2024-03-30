<template>
  <a-button type="primary" @click="handleClick" shape="round"
    >登录/注册
  </a-button>
  <a-modal v-model:visible="store.state.visible" :footer="false" hide-title>
    <a-tabs default-active-key="1">
      <a-tab-pane key="1" title="登录">
        <LoginForm></LoginForm>
      </a-tab-pane>
      <a-tab-pane key="2" title="注册">
        <RegisterForm></RegisterForm>
      </a-tab-pane>
    </a-tabs>
  </a-modal>
</template>

<script setup lang="ts">
import LoginForm from "@/components/LoginForm.vue";
import store from "@/store";
import RegisterForm from "@/components/RegisterForm.vue";

const handleClick = () => {
  store.state.visible = true;
};
</script>

<style scoped></style>
