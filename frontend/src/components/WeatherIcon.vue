<template>
  <div class="weather-icon">
    <img :src="iconUrl()" />
  </div>
</template>

<script lang="ts">
import {Component, Prop, Vue} from "vue-property-decorator";

const iconMapping = {
  'clearNight': '01n',
  'clearDay': '01d',
  'fogMist': '15',
  'cloudy': '04',
  'lightRainShowerNight': '05n',
  'lightRainShowerDay': '05d',
  'lightRain': '09',
  'heavyRain': '10',
  'sleet': '12',
  'lightSnowNight': '08n',
  'lightSnowDay': '08d',
  'heavySnow': '13',
  'thunderStorm': '11',
}

@Component
export default class WeatherIcon extends Vue {
  @Prop({required: true})
  private icon?: string;

  public iconUrl() {
    //@ts-ignore
    return `http://localhost:8080/static/weather/icons/${iconMapping[this.icon]}.png`
  }
}
</script>

<style>

.weather-icon img {
  width: 30px;
  height: 25px;
}

</style>