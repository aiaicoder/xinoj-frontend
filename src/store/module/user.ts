import { UserControllerService } from "../../../generated";
import Access_Enum from "@/access/AccessEnum";

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
  async loginUser({ commit, state }: any) {
    try {
      const res = await UserControllerService.getLoginUserUsingGet();
      if (res.code === 0) {
        commit("setUserInfo", res.data);
      }
      commit("setUserInfo", {
        ...state.loginUser,
        UserRole: Access_Enum.UnLogin,
      });
    } catch (e) {
      console.log(e);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
