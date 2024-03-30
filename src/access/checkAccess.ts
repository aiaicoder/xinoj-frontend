import ACCESS_ENUM from "@/access/ACCESS_ENUM";

const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.UnLogin) => {
  //获取当前用户登录状态，如果用户没有登录态，那么就是未登录
  const loginAccess = loginUser?.userRole ?? ACCESS_ENUM.UnLogin;
  if (needAccess === ACCESS_ENUM.UnLogin) {
    return true;
  }
  //判断用户登录的权限是否和所需权限一致
  if (needAccess === ACCESS_ENUM.User) {
    if (loginAccess === ACCESS_ENUM.UnLogin) {
      return false;
    }
  }

  if (needAccess === ACCESS_ENUM.Admin) {
    if (loginAccess !== ACCESS_ENUM.Admin) {
      return false;
    }
  }
  return true;
};
export default checkAccess;
