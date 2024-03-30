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
      <a-form-item
        field="checkPassword"
        label="确认密码"
        validate-trigger="blur"
      >
        <a-input-password
          v-model="form.checkPassword"
          placeholder="请再次输入密码"
        />
      </a-form-item>
      <a-form-item field="isRead">
        <a-checkbox v-model="isRead">
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
          >注册
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
import { useStore } from "vuex";
import message from "@arco-design/web-vue/es/message";
import { UserControllerService } from "../../generated";

const form = reactive({
  userAccount: "",
  userPassword: "",
  checkPassword: "",
});
const isRead = ref(false);

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
  checkPassword: [
    {
      required: true,
      message: "请确认密码",
    },
    {
      validator: (value: string, cb: any) => {
        if (value !== form.userPassword) {
          cb("两次密码不匹配");
        } else {
          cb();
        }
      },
    },
  ],
};

const handleSubmit = async () => {
  if (!isRead.value) {
    message.warning("请先阅读注册协议和隐私政策");
    isRead.value = true;
    return;
  }
  const res = await UserControllerService.userRegisterUsingPost(form);
  // 注册成功，让用户自己切回会话框
  if (res.code === 0) {
    message.success("注册成功请登录");
  } else {
    message.error("注册失败，" + res.message);
  }
};
</script>

<style scoped></style>
