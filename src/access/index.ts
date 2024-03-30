import router from "@/router";
import { useStore } from "vuex";
import Access_Enum from "@/access/ACCESS_ENUM";
import { computed } from "vue";
import checkAccess from "@/access/checkAccess";

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  //自动登录
  const loginUser = computed(() => store.state.user.loginUser);
  console.log("登录用户信息", loginUser.value.userRole);
  //如果用户不存在
  if (!loginUser.value || loginUser.value.userRole === Access_Enum.UnLogin) {
    //同步等待用户登录成功
    await store.dispatch("user/getLoginUser");
  }
  //根据路由中的meta信息进行判断，如果没有access属性那么就表示该页面无需登录
  const needAccess = (to.meta?.access as string) ?? Access_Enum.UnLogin;
  //表明该页面需要登录
  if (needAccess !== Access_Enum.UnLogin) {
    //如果用户未登录
    if (!loginUser.value || loginUser.value.userRole === Access_Enum.UnLogin) {
      store.state.visible = true;
      next(false);
    }
    //如果已经登录但是权限不足
    if (!checkAccess(loginUser.value, needAccess)) {
      next("/noAuth");
    }
  }
  next();
});
