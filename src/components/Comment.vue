<template>
  <div>
    <!-- 评论输入框 -->
    <a-comment align="right" :avatar="loginUser.userAvatar">
      <template #actions>
        <a-button key="1" type="primary" @click="sendComment">评论</a-button>
      </template>
      <template #content>
        <a-input v-model="comment" placeholder="这里是讨论区，不是无人区..." />
      </template>
    </a-comment>

    <!-- 评论列表 -->
    <a-comment
      v-for="(item, index) in questionComment"
      :author="item.userName"
      :content="item.content"
      :datetime="moment(item.gmtCreate).format('YYYY-MM-DD hh:mm')"
      :key="index"
    >
      <template #actions>
        <span
          class="action"
          key="heart"
          @click="onLikeChange('comment', index, 0, item.id)"
        >
          <span v-if="item.likeListId?.indexOf(loginUser.id) !== -1">
            <IconHeartFill :style="{ color: '#f53f3f' }" />
          </span>
          <span v-else>
            <IconHeart />
          </span>
          {{ item.likeCount }}
        </span>
        <span class="action" key="message">
          <span>
            <IconMessage />
          </span>
          {{ item.commentNum }}
        </span>
        <span
          class="action"
          v-if="loginUser.id !== item.userId"
          @click="showReplyInput(index, 0, item)"
        >
          <IconMessage /> 回复
        </span>
        <span
          class="action"
          v-if="
            item.userId === loginUser.id ||
            loginUser.userRole === Access_Enum.Admin
          "
          @click="deleteCommentById(item)"
        >
          <IconDelete />
        </span>
        <a-comment
          align="right"
          :avatar="loginUser.userAvatar"
          v-if="questionComment[index].inputShow && showReply"
        >
          <template #actions>
            <a-button key="1" type="primary" @click="sendCommentReply(item)"
              >回复
            </a-button>
          </template>
          <template #content>
            <a-input
              v-model="replyComment"
              placeholder="留下你善意的回复吧..."
            />
          </template>
        </a-comment>
      </template>
      <template #avatar>
        <a-avatar>
          <img alt="avatar" :src="item.userAvatar" />
        </a-avatar>
      </template>

      <!--二级评论的开始-->
      <a-comment
        v-for="(reply, j) in item.reply"
        :author="reply.userName"
        :avatar="reply.userAvatar"
        :content="formattedReplyContent(reply.fromName, reply.content)"
        :datetime="moment(reply.gmtCreate).format('YYYY-MM-DD HH:mm')"
        :key="j"
      >
        <template #actions>
          <span
            class="action"
            key="heart"
            @click="onLikeChange('reply', index, j, item.id)"
          >
            <span v-if="reply.likeListId?.indexOf(loginUser.id) !== -1">
              <IconHeartFill :style="{ color: '#f53f3f' }" />
            </span>
            <span v-else>
              <IconHeart />
            </span>
            {{ reply.likeCount }}
          </span>
          <span class="action" key="message">
            <span>
              <IconMessage />
            </span>
            {{ reply.commentNum }}
          </span>
          <span
            class="action"
            v-if="loginUser.id !== reply.userId"
            @click="showReplyInput(index, j, reply)"
          >
            <IconMessage /> 回复
          </span>
          <span
            class="action"
            v-if="
              reply.userId === loginUser.id ||
              loginUser.userRole === Access_Enum.Admin
            "
            @click="deleteCommentById(reply)"
          >
            <IconDelete />
          </span>
        </template>
      </a-comment>
    </a-comment>
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from "vue";
import {
  IconHeart,
  IconHeartFill,
  IconMessage,
  IconDelete,
} from "@arco-design/web-vue/es/icon";
import { QuestionCommentsControllerService } from "../../generated";
import { useStore } from "vuex";
import moment from "moment";
import message from "@arco-design/web-vue/es/message";
import Access_Enum from "@/access/ACCESS_ENUM";

const store = useStore();
// eslint-disable-next-line no-undef
const Props = defineProps({
  questionId: {
    type: Number,
    default: 0,
  },
});

const loginUser = computed(() => store.state.user.loginUser);

const replyComment = ref("");
const showReply = ref(false);
const comment = ref("");
const questionComment = ref([]);
const lastIndex = ref(0);
const currentComment = ref({
  questionId: Props.questionId,
  userId: loginUser.value.id,
  userName: loginUser.value.userName,
  userAvatar: loginUser.value.userAvatar,
  content: comment.value,
  parentId: -1,
  likeListId: "[]",
  fromId: -1,
  fromName: "",
}); // 当前被点击的评论对象

/**
 * 是否展示输入框
 * @param i
 * @param j
 * @param current
 */
const showReplyInput = (i, j, current) => {
  if (current.parentId === "-1") {
    currentComment.value.parentId = current.id;
  } else {
    currentComment.value.parentId = current.parentId;
  }
  currentComment.value.fromName = current.userName;
  currentComment.value.fromId = current.userId;
  console.log(currentComment.value);
  showReply.value = !showReply.value;
  if (lastIndex.value !== i) {
    questionComment.value[lastIndex.value].inputShow = false;
  }
  if (current.parentId === -1) {
    currentComment.value.parentId = current.id;
  }
  questionComment.value[i].inputShow = true;
  lastIndex.value = i;
};

/**
 * 组件挂载时就加载评论
 */
onMounted(() => {
  loadComment();
});

/**
 * 深拷贝
 * @param targetObj
 * @returns {*}
 */
const copyObject = (targetObj) => {
  let comment = { ...targetObj };
  // 转换为以,号分割的字符串 [因为后端采用的是字符串进行存储]
  comment.likeListId = "[" + comment.likeListId.join(",") + "]";
  // 删除掉该属性，不然后端接收会报错
  delete comment.reply;
  return comment;
};

/**
 * 删除评论
 * @param current
 * @returns {Promise<void>}
 */
const deleteCommentById = async (current) => {
  let comment = copyObject(current);
  console.log("current=", current);
  const res = await QuestionCommentsControllerService.deleteQuestionUsingPost(
    comment
  );
  if (res.code === 0) {
    message.success("删除成功");
    // 重新加载评论数据
    await loadComment();
  }
};

/**
 * 加载评论
 * @returns {Promise<void>}
 */
const loadComment = async () => {
  const res = await QuestionCommentsControllerService.getCommentListUsingGet(
    Props.questionId
  );
  if (res.code === 0) {
    questionComment.value = res.data;
  }
};

/**
 * 点赞或取消点赞
 * @param {string} type 评论类型 (comment 或 reply)
 * @param {number} i 评论索引
 * @param {number} j 回复索引
 * @param {number} id 评论ID
 * @returns {Promise<void>}
 */
const onLikeChange = async (type, i, j, id) => {
  const commentObje =
    type === "comment"
      ? questionComment.value[i]
      : questionComment.value[i].reply[j];
  let list = commentObje.likeListId;

  if (list.length === 0 || list.indexOf(loginUser.value.id) === -1) {
    // 在已经点赞的列表中未找到 userId
    commentObje.isLike = true;
    commentObje.likeCount += 1;
    commentObje.likeListId.push(loginUser.value.id);

    // 将对象复制一份并且去除掉 reply 属性，避免后台接收数据出现异常
    let comment = copyObject(commentObje);
    console.log("这是我之前的评论对象", comment);
    // 发送请求到后台修改点赞数量
    const res =
      await QuestionCommentsControllerService.updateQuestionCommentUsingPost(
        comment
      );
    if (res.code === 0) {
      await loadComment();
    }
    console.log("点赞+1", commentObje.isLike, commentObje.likeListId);
  } else {
    const index = list.indexOf(loginUser.value.id);
    commentObje.isLike = false;
    commentObje.likeCount -= 1;
    commentObje.likeListId.splice(index, 1);

    // 将对象复制一份并且去除掉 reply 属性，避免后台接收数据出现异常
    let comment = copyObject(commentObje);
    console.log("这是我之前的评论对象", comment);
    // 发送请求到后台修改点赞数量
    const res =
      await QuestionCommentsControllerService.updateQuestionCommentUsingPost(
        comment
      );
    if (res.code === 0) {
      await loadComment();
    }
    console.log("点赞-1", commentObje.likeListId);
  }
};

/**
 * 格式化回复内容，添加红色和加粗样式
 * @param {string} userName 被回复的用户名
 * @param {string} content 回复的内容
 * @returns {string} 格式化后的 HTML 字符串
 */
const formattedReplyContent = (userName, content) => {
  return `回复 ${userName} : ${content}`;
};

/**
 * 发送评论
 * @returns {Promise<void>}
 */
const sendComment = async () => {
  console.log("这是评论内容", comment.value);
  if (comment.value === "") {
    message.warning("评论不能为空");
    return;
  }
  currentComment.value.content = comment.value;
  const commentAddRequest = {
    currentComment: currentComment.value,
  };
  const res =
    await QuestionCommentsControllerService.addQuestionCommentWrapUsingPost(
      commentAddRequest
    );
  if (res.code === 0) {
    comment.value = "";
    await loadComment();
    message.success("评论成功");
  }
};

/**
 * 发送回复
 * @param {object} current 当前评论对象
 * @returns {Promise<void>}
 */
const sendCommentReply = async (current) => {
  if (!replyComment.value) {
    message.warning("回复不能为空");
  } else {
    // 回复内容对象
    currentComment.value.content = replyComment.value;
    // 更新当前被点击的评论对象的回复条数
    current.commentNum += 1;
    let parent = { ...current };
    parent.likeListId = "[" + parent.likeListId.join(",") + "]";
    delete parent.reply; // 删除属性，否则后端接收数据出现异常[后端采用字符串进行存储]
    delete current.reply;

    console.log("current=", currentComment.value);
    console.log("parent=", parent);
    const commentAddRequest = {
      currentComment: currentComment.value,
      parentComment: parent,
    };
    const res =
      await QuestionCommentsControllerService.addQuestionCommentWrapUsingPost(
        commentAddRequest
      );
    if (res.code === 0) {
      message.success("回复成功");
      await loadComment();
      showReply.value = false; // 隐藏回复输入框
    }
    replyComment.value = "";
  }
};
</script>

<style scoped>
.action {
  display: inline-block;
  padding: 0 4px;
  color: var(--color-text-1);
  line-height: 24px;
  background: transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: all 0.1s ease;
}

.action:hover {
  background: var(--color-fill-3);
}
</style>
