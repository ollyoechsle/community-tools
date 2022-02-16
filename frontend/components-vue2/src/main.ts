// import Vue from "vue";
// import App from "./App.vue";
//
// Vue.config.productionTip = false;
//
// new Vue({
//   render: h => h(App)
// }).$mount("#app");


import Vue from "vue";
import wrap from "@vue/web-component-wrapper";

import News from "./components/News.vue";

const wrappedNews: any = wrap(Vue, News);
window.customElements.define("ct-news", wrappedNews);