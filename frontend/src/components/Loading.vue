<template>
  <div v-if="loading" class="ct-loading">
    Loading...
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

@Component
export default class Loading extends Vue {
    @Prop({required: true})
    private loading = false;
}
</script>

<style>
.ct-loading {
    background: url(http://localhost:8080/static/ajax-loader.gif) no-repeat center;
    min-height: 137px;
    text-align: center;
}
</style>