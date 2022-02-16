<template>
  <div class="ct-component ct-weather">
    Location {{location}}
    <div v-if="weatherData">
      {{weatherData}}
    </div>
    <div v-if="error" class="ct-error-message">
      {{ error }}
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'

@Component
export default class Weather extends Vue {

  @Prop({required: true})
  public location: string = ""

  public weatherData: any = null;
  public error: string = ""

  public mounted() {
    this.loadWeatherData()
  }

  public loadWeatherData() {
    this.weatherData = null
    this.error = ""
    axios.get(`http://localhost:8080/weather/daily?location=${this.location}`).then(
        (response: AxiosResponse<any>) => {
          this.weatherData = response.data
        },
        (error) => {
          this.error = "Unable to load weather. " + error
        })
  }
}
</script>