<template>
  <div class="ct-component ct-weather">
    <div v-if="weatherData">
      <table class="table weather">
        <thead>
        <tr>
          <th>Day</th>
          <th></th>
          <th class="numeric">Temp.</th>
          <th class="numeric">Wind</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(period, index) in weatherData.periods" :key="index">
          <td>
            {{ period.day }}
            <small>{{ period.timeOfDay }}</small>
          </td>
          <td>
            <weather-icon :icon="period.icon"></weather-icon>
            <div class="icon" :class="period.icon">{{period.report}}</div>
          </td>
          <td class="numeric">{{ period.temperature }} &deg;C</td>
          <td class="numeric">
            <div class="wind" :class="period.windDirection">{{ period.windSpeed }}</div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
    <div v-if="error" class="ct-error-message">
      {{ error }}
    </div>
    <loading :loading="loading"></loading>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'

import Loading from "@/components/Loading.vue";
import WeatherIcon from "@/components/WeatherIcon.vue";

@Component({
  components: {
    Loading,
    WeatherIcon
  }
})
export default class Weather extends Vue {

  @Prop({required: true})
  public location?: string;

  public weatherData: any = null;
  public error? = ""
  public loading = false

  public mounted() {
    if (!this.location) {
      this.error = "No location specified"
    } else {
      this.loadWeatherData()
    }
  }

  public loadWeatherData() {
    this.weatherData = null
    this.error = undefined
    this.loading = true
    axios.get(`${process.env.VUE_APP_API_URL}/weather/daily?location=${this.location}`).then(
        (response: AxiosResponse<any>) => {
          this.weatherData = response.data
          this.loading = false
        },
        (error) => {
          this.error = "Unable to load weather. " + error
          this.loading = false
        })
  }
}
</script>