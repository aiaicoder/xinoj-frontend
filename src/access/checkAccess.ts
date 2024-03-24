import AccessEnum from "@/access/AccessEnum";

const checkAccess = (loginUser: any, needAccess = AccessEnum.UnLogin) => {
  //获取当前用户登录状态，如果用户没有登录态，那么就是未登录
  const loginAccess = loginUser?.userRole ?? AccessEnum.UnLogin;
  if (needAccess === AccessEnum.UnLogin) {
    return true;
  }
  //判断用户登录的权限是否和所需权限一致
  if (needAccess === AccessEnum.User) {
    if (loginAccess != AccessEnum.UnLogin) {
      return false;
    }
  }

  if (needAccess === AccessEnum.Admin) {
    if (loginAccess !== AccessEnum.Admin) {
      return false;
    }
  }
  return true;
};
export default checkAccess;
