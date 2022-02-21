<template>
  <div v-if="loading" class="ct-loading">
    <img :src="iconUrl()"/>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class Loading extends Vue {
  @Prop({required: true})
  private loading = false;

  public iconUrl() {
    //@ts-ignore
    return `${process.env.VUE_APP_API_URL}/static/ajax-loader.gif`
  }
}
</script>

<style>
.ct-loading {
  min-height: 137px;
  text-align: center;
}
</style>