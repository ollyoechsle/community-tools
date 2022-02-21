<template>
  <div class="ct-component ct-news-image">
    <img :src="image.url" :alt="image.alt" v-if="image">
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'
import {ImageResponse} from "@/model/model";

@Component
export default class NewsImg extends Vue {
  @Prop({required: true})
  private newsUrl?: string;

  private loading = false;
  private image: ImageResponse | null = null;

  public mounted() {
    this.loadImage()
  }

  public loadImage() {
    this.loading = true;
    this.image = null
    axios.get(`${process.env.VUE_APP_API_URL}/news/img?url=${this.newsUrl}`).then(
        (response: AxiosResponse<ImageResponse>) => {
          this.image = response.data
          this.loading = false;
        },
        () => {
          this.loading = false;
        })
  }
}
</script>