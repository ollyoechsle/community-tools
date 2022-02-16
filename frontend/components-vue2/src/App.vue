<template>
  <div id="app">
<!--    <img alt="Vue logo" src="./assets/logo.png" />-->
    <News/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import News from "./components/News.vue";

@Component({
  components: {
    News
  }
})
export default class App extends Vue {}
</script>
