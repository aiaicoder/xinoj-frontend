<template>
  <div id="useCenterView">
    <a-space direction="vertical" size="large" :style="{ width: '600px' }">
      <a-form :model="form" @submit="handleSubmit">
        <a-form-item field="id" label="id">
          <a-input v-model="form.id" disabled />
        </a-form-item>
        <a-form-item field="name" label="用户名">
          <a-input
            v-model="form.userName"
            placeholder="请输入新的用户名"
            :rules="[
              { required: true, message: '用户名不能为空' },
              { maxlength: 10, message: '不可超过10个字符' },
            ]"
          />
        </a-form-item>
        <a-form-item field="userProfile" label="用户简介">
          <a-space direction="vertical" size="large" fill>
            <a-textarea
              v-model="form.userProfile"
              :max-length="{ length: 10, errorOnly: true }"
              allow-clear
              show-word-limit
              :auto-size="{
                minRows: 2,
                maxRows: 5,
              }"
              default-value="该用户很懒，未填写简介"
            />
          </a-space>
        </a-form-item>

        <a-form-item>
          <a-space direction="vertical" size="large">
            <a-radio-group v-model="form.gender">
              <a-radio :value="1">男</a-radio>
              <a-radio :value="0">女</a-radio>
            </a-radio-group>
          </a-space>
        </a-form-item>
        <a-form-item>
          <a-button
            html-type="submit"
            style="margin-left: 250px; margin-top: 20px"
            >修改
          </a-button>
        </a-form-item>
      </a-form>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { reactive, toRef } from "vue";
import { useStore } from "vuex";
import { UserControllerService } from "../../../generated";
import message from "@arco-design/web-vue/es/message";

import { useRouter } from "vue-router";

const form = reactive(toRef(useStore().state.user.loginUser));
const router = useRouter();
const handleSubmit = async () => {
  const res = await UserControllerService.updateMyUserUsingPost(form.value);
  if (res.code === 0) {
    message.success("更新成功");
    router.push("/");
  } else {
    message.error("更新失败");
  }
};
</script>

<style scoped>
useCenterView {
}
</style>