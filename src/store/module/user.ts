import { UserControllerService } from "../../../generated";
import Access_Enum from "@/access/ACCESS_ENUM";
import message from "@arco-design/web-vue/es/message";

const state = () => ({
  loginUser: {
    id: "",
    userName: "未登录",
    userRole: "unLogin",
    userAvatar: "",
    gender: "",
    userProfile: "",
    createTime: "",
  },
});

const getters = {
  getUserInfo(state: { loginUser: any }) {
    console.log(state.loginUser);
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
    } else {
      message.error(res.message as string);
    }
    commit("setUserInfo", {
      ...state.loginUser,
      UserRole: Access_Enum.UnLogin,
    });
  },

  async userLoginOut({ commit, state }: any) {
    const res = await UserControllerService.userLogoutUsingPost();
    if (res.code === 0) {
      commit("setUserInfo", {
        ...state.loginUser,
        UserRole: Access_Enum.UnLogin,
      });
    }
    commit("setUserInfo", {
      ...state.loginUser,
      UserRole: Access_Enum.UnLogin,
    });
  },

  changeAvatar({ commit, state }: any, payload: any) {
    commit("setUserInfo", {
      ...state.loginUser,
      userAvatar: payload,
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
