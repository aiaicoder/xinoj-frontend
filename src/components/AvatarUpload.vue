<template>
  <div id="avatarUpload">
    <a-space direction="vertical" :style="{ width: '100%' }">
      <a-tooltip content="更换头像" background-color="#3491FA">
        <a-upload
          :custom-request="uploadAvatar"
          :fileList="file ? [file] : []"
          :show-file-list="false"
          @change="onChange"
        >
          <template #upload-button>
            <div
              :class="`arco-upload-list-item${
                file && file.status === 'error'
                  ? ' arco-upload-list-item-error'
                  : ''
              }`"
            >
              <div
                class="arco-upload-list-picture custom-upload-avatar"
                v-if="file && file?.url"
              >
                <img :src="file.url" alt="修改头像" />
                <div class="arco-upload-list-picture-mask">
                  <IconEdit />
                </div>
              </div>
              <div class="arco-upload-picture-card" v-else>
                <div class="arco-upload-picture-card-text">
                  <IconPlus />
                  <div style="margin-top: 10px; font-weight: 600">上传头像</div>
                </div>
              </div>
            </div>
          </template>
        </a-upload>
      </a-tooltip>
    </a-space>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { FileControllerService } from "../../generated";
import message from "@arco-design/web-vue/es/message";
import { useStore } from "vuex";

const store = useStore();
const loginUser = computed(() => store.state.user.loginUser);
const file = ref({
  url: "",
});
const onChange = async (_: any, currentFile: any) => {
  file.value = {
    ...currentFile,
  };
};

if (loginUser.value.userAvatar) {
  file.value.url = loginUser.value.userAvatar;
}

const uploadAvatar = async () => {
  const res = await FileControllerService.uploadFileUsingPost(
    file.value.file,
    "user_avatar"
  );
  if (res.code === 0) {
    file.value.url = res.data;
    loginUser.value.userAvatar = res.data;
    store.commit("user/setUserInfo", loginUser.value);
    console.log(store.state.user.loginUser);
    message.success("上传成功");
  } else {
    file.value.status = "error";
    message.error("上传失败");
  }
};
</script>

<style scoped>
avatarUpload {
}
</style>
