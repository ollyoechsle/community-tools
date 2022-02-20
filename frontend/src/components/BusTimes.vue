<template>
  <div class="ct-component ct-bus-times">
    <div class="stops">
      <li v-for="(stop, index) in allStops" :key="index">
        <a @click="loadData(stop)">{{ stop }}</a>
      </li>
    </div>
    <table class="bus-departures" v-if="data">
      <thead>
      <tr>
        <th class="service">No.</th>
        <th>Toward</th>
        <th class="time">Departs</th>
      </tr>
      </thead>
      <tbody>
      <tr :class="departure.className" v-for="(departure, index) in data.departures" :key="index">
        <td class="service">{{ departure.service }}</td>
        <td>{{ departure.destination }}</td>
        <td class="time">
          <time>
            {{ departure.time }}
          </time>
          <div class="inTime">{{ departure.inTime }}</div>
        </td>
      </tr>
      </tbody>
    </table>
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
import {BusDeparture, BusResponse} from "@/model/model";

@Component
export default class BusTimes extends Vue {

  @Prop({required: true})
  public stops?: string;
  public allStops: string[] = [];
  public currentStop?: string

  private loading = false;
  private data: BusResponse[] = []
  private error? = ""

  public mounted() {
    this.allStops = this.stops!.split(",").map(stop => stop.trim())
    this.loadData(this.allStops[0])
  }

  public loadData(stopId: string) {
    this.loading = true;
    this.error = undefined
    this.data = []
    const url = `http://localhost:8080/buses?stop=${stopId}`
    axios.get(url).then(
        (response: AxiosResponse<BusResponse[]>) => {
          this.data = response.data
          this.loading = false;
        },
        (error) => {
          this.error = "Unable to load bus times. " + error
          this.loading = false;
        })
  }
}
</script>