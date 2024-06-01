import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ArcoVue from "@arco-design/web-vue";
import "@arco-design/web-vue/dist/arco.css";
import "@/config/axios";
import "@/access/index";
import "bytemd/dist/index.css";
import ArcoVueIcon from "@arco-design/web-vue/es/icon";
import "@arco-design/web-vue/dist/arco.css";

createApp(App)
  .use(store)
  .use(router)
  .use(ArcoVue)
  .use(ArcoVueIcon)
  .use(ArcoVue)
  .mount("#app");
