<template>
  <div class="news-component">
    <ul class="news">
      <li v-for="(article, index) in news" :key="index">
        <a target="_blank" :href="article.link">{{ article.title }}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'

@Component
export default class HelloWorld extends Vue {
  private news: any = []

  public mounted() {
    axios.get('http://localhost:8080/news').then((response: AxiosResponse<any>) => {
      this.news = response.data
    })
  }
}
</script>