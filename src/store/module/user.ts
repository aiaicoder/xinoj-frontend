import { UserControllerService } from "../../../generated";
import Access_Enum from "@/access/ACCESS_ENUM";

const state = () => ({
  loginUser: {
    username: "未登录",
    userRole: "unLogin",
  },
});

const getters = {
  getUserInfo(state: { loginUser: any }) {
    return state.loginUser;
  },
};

const mutations = {
  setUserInfo(state: { loginUser: any }, payload: any) {
    state.loginUser = payload;
  },
};



const actions = {
  async getLoginUser({ commit, state }: any) {
    const res = await UserControllerService.getLoginUserUsingGet();
    if (res.code === 0) {
      commit("setUserInfo", res.data);
    }
    commit("setUserInfo", {
      ...state.loginUser,
      UserRole: Access_Enum.UnLogin,
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
