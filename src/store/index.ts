import { createStore } from "vuex";
import user from "@/store/module/user";

export default createStore({
  state: {
    visible: false,
  },
  getters: {},
  mutations: {},
  actions: {},
  modules: {
    user,
  },
});
