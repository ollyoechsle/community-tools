<template>
  <div class="ct-component ct-news">
    <ul class="news">
      <li v-for="(article, index) in news" :key="index">
        <news-img :news-url="article.link"></news-img>
        <a target="_blank" :href="article.link">{{ article.title }}</a>
      </li>
    </ul>
    <div v-if="error" class="ct-error-message">
      {{ error }}
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script lang="ts">
import {Component, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'
import NewsImg from "@/components/NewsImg.vue";
import Loading from "@/components/Loading.vue";

@Component({
  components: {
    Loading,
    NewsImg
  }
})
export default class News extends Vue {
  private loading = false;
  private news: any = []
  private error? = ""

  public mounted() {
    this.loadNews()
  }

  public loadNews() {
    this.loading = true;
    this.error = undefined
    this.news = []
    axios.get(`${process.env.VUE_APP_API_URL}/news`).then(
        (response: AxiosResponse<any>) => {
          this.news = response.data
          this.loading = false;
        },
        (error) => {
          this.error = "Unable to load news. " + error
          this.loading = false;
        })
  }
}
</script>