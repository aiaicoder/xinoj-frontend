import router from "@/router";
import { useStore } from "vuex";
import Access_Enum from "@/access/AccessEnum";

router.beforeEach(async (to, from, next) => {
  const store = useStore();
  console.log("登录用户信息", store.state.user.loginUser);
  //自动登录
  const loginUser = store.state.user.loginUser;
  //如果用户不存在
  if (!loginUser || !loginUser.userRole) {
    //同步等待用户登录成功
    await store.dispatch("user/loginUser");
  }
  //根据路由中的meta信息进行判断，如果没有access属性那么就表示该页面无需登录
  const needAccess = (to.meta?.access as string) ?? Access_Enum.UnLogin;
  //表明该页面需要登录
  if (needAccess !== Access_Enum.UnLogin) {
    //如果用户未登录
    if (!loginUser || !loginUser.userRole) {
      next("/login");
      return;
    }
    //如果已经登录但是权限不足
    if (loginUser.userRole !== needAccess) {
      next("/noAuth");
      return;
    }
  }
  next();
});
