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
    <div v-if="loading" class="ct-loading">
      Loading...
    </div>
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";
import axios, {AxiosResponse} from 'axios'

@Component
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
    axios.get(`http://localhost:8080/weather/daily?location=${this.location}`).then(
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