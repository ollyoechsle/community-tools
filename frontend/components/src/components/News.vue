<script>
import axios from 'axios'

export default {
  mounted() {
    axios.get('http://localhost:8080/news').then((response) => {
      this.news = response.data
    })
  },
  data() {
    return {
      news: []
    }
  }
}
</script>

<template>
  <ul class="news">
    <li v-for="(article, index) in news" :key="index">
      <a target="_blank" :href="article.link">{{ article.title }}</a>
    </li>
  </ul>
</template>

<style>
</style>