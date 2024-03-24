<template>
  <div>
    <a-form
      ref="formRef"
      :rules="rules"
      :model="form"
      :style="{ width: '100%' }"
      @submit="handleSubmit"
      label-align="left"
    >
      <a-form-item field="userAccount" label="用户名" validate-trigger="blur">
        <a-input v-model="form.userAccount" placeholder="请输入用户名" />
      </a-form-item>
      <a-form-item field="userPassword" label="密码" validate-trigger="blur">
        <a-input-password
          v-model="form.userPassword"
          placeholder="请输入密码"
        />
      </a-form-item>
      <a-form-item field="isRead">
        <a-checkbox v-model="form.isRead">
          同意 <a href="javascript:void(0);">《注册协议》</a> 和
          <a href="javascript:void(0);">《隐私政策》</a>
        </a-checkbox>
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          status="success"
          html-type="submit"
          :style="{ width: '100%', marginRight: '80px' }"
          shape="round"
          >登录
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useStore } from "vuex";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const form = reactive({
  userAccount: "",
  userPassword: "",
  isRead: false,
});

const store = useStore();

const rules = {
  userAccount: [
    {
      required: true,
      message: "用户名不能为空",
    },
  ],
  userPassword: [
    {
      required: true,
      message: "密码不能为空",
    },
  ],
};

const handleSubmit = async () => {
  if (!form.isRead) {
    message.warning("请先阅读注册协议和隐私政策");
    form.isRead = true;
    return;
  }
  const res = await UserControllerService.userLoginUsingPost(form);
  // 登录成功，关闭会话框
  try {
    if (res.code === 0) {
      await store.dispatch("user/getLoginUser");
      store.state.visible = false;
    } else {
      message.error("登陆失败，" + res.message);
    }
  } catch (e: any) {
    console.log("登陆失败，" + e.message);
  }
};
</script>

<style scoped></style>
