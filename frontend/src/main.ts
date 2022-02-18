import Vue from "vue";
import wrap from "@vue/web-component-wrapper";

import News from "./components/News.vue";
import Weather from "./components/Weather.vue";
import BusTimes from "./components/BusTimes.vue";

const wrappedNews: any = wrap(Vue, News);
window.customElements.define("ct-news", wrappedNews);

const wrappedWeather: any = wrap(Vue, Weather);
window.customElements.define("ct-weather", wrappedWeather);

const wrappedBusTimes: any = wrap(Vue, BusTimes);
window.customElements.define("ct-bus-times", wrappedBusTimes);